import express from "express";
import { createServer as createViteServer } from "vite";
import http from "http";
import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;
import qrcode from "qrcode";
import Database from "better-sqlite3";
import multer from "multer";
import csv from "csv-parser";
import * as xlsx from "xlsx";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ─── Process Error Safety ───────────────────────────────────────────────────
process.on("uncaughtException", (err) => {
  console.error("🔥 Uncaught Exception:", err);
  // Auto-recover if it's a Puppeteer frame error
  if (err.message.includes("detached Frame") || err.message.includes("Target closed")) {
    console.warn("Recovering from Puppeteer error...");
  }
});
process.on("unhandledRejection", (reason, promise) => {
  console.error("🔥 Unhandled Rejection at:", promise, "reason:", reason);
});

// ─── SQLite Setup ───────────────────────────────────────────────────────────
const db = new Database(path.join(__dirname, "contacts.db"));
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT UNIQUE,
    verified INTEGER DEFAULT 0,
    category TEXT DEFAULT 'Default',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);
try {
  db.exec("ALTER TABLE contacts ADD COLUMN category TEXT DEFAULT 'Default'");
} catch (e) {
  // Column already exists
}

// ─── WhatsApp Client Setup ───────────────────────────────────────────────────
let qrCodeData = "";
let clientStatus = "disconnected"; // disconnected | connecting | qr | authenticated | ready
let client: InstanceType<typeof Client> | null = null;
let isInitializing = false; // mutex — never run two inits in parallel
let reinitTimer: ReturnType<typeof setTimeout> | null = null;

// Message sending queue
interface QueueItem {
  phone: string;
  message: string;
  delayMs: number;
}
const messageQueue: QueueItem[] = [];
let isProcessingQueue = false;

// ── Session helpers ──────────────────────────────────────────────────────────
const SESSION_DIR = path.join(__dirname, ".wwebjs_auth");

function clearLockFiles() {
  const lockFiles = [
    path.join(SESSION_DIR, "session", "SingletonLock"),
    path.join(SESSION_DIR, "session", "SingletonSocket"),
    path.join(SESSION_DIR, "session", "SingletonCookiesLock"),
  ];
  for (const f of lockFiles) {
    try { if (fs.existsSync(f)) { fs.unlinkSync(f); console.log("Cleared lock:", f); } }
    catch (_) {}
  }
}

function nukeSession() {
  try {
    if (fs.existsSync(SESSION_DIR)) {
      fs.rmSync(SESSION_DIR, { recursive: true, force: true });
      console.log("🗑  Session wiped for fresh QR.");
    }
  } catch (e) { console.warn("Could not wipe session dir:", e); }
}

// ── Safe client destroyer ────────────────────────────────────────────────────
async function safeDestroy() {
  if (!client) return;
  const c = client;
  client = null;
  try { await c.destroy(); }
  catch (_) {}
}

// ── Schedule a reinit (debounced) ────────────────────────────────────────────
function scheduleReinit(delayMs = 5000) {
  if (reinitTimer) clearTimeout(reinitTimer);
  reinitTimer = setTimeout(() => {
    reinitTimer = null;
    initClient();
  }, delayMs);
}

// ── Create a new Client instance ─────────────────────────────────────────────
function createClient() {
  return new Client({
    authStrategy: new LocalAuth({ dataPath: SESSION_DIR }),
    // Always fetch the latest WhatsApp Web version — fixes "Could not link device"
    webVersion: "2.3000.1041720460-alpha",
    webVersionCache: {
      type: "remote",
      remotePath: "https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.3000.1041720460-alpha.html",
    },
    puppeteer: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--disable-extensions",
        "--disable-default-apps",
        "--no-first-run",
        "--disable-background-networking",
        "--disable-sync",
        "--metrics-recording-only",
        "--mute-audio",
        "--safebrowsing-disable-auto-update",
      ],
    },
  });
}

// ── Main initializer ─────────────────────────────────────────────────────────
async function initClient() {
  if (isInitializing) {
    console.log("Init already in progress — skipping.");
    return;
  }
  isInitializing = true;
  qrCodeData = "";
  clientStatus = "connecting";

  await safeDestroy();
  clearLockFiles();

  try {
    const c = createClient();

    // ── QR received ─────────────────────────────────────────────────────────
    c.on("qr", (qr) => {
      console.log("📱 QR received — waiting for scan…");
      qrCodeData = qr;
      clientStatus = "qr";
    });

    // ── Authenticated (QR scanned) ───────────────────────────────────────────
    c.on("authenticated", () => {
      console.log("✅ Authenticated!");
      clientStatus = "authenticated";
      qrCodeData = "";
    });

    // ── Ready ────────────────────────────────────────────────────────────────
    c.on("ready", () => {
      console.log("🟢 WhatsApp client ready.");
      clientStatus = "ready";
      qrCodeData = "";
    });

    // ── Auth failure — wipe session & show fresh QR ──────────────────────────
    c.on("auth_failure", async (msg) => {
      console.error("❌ Auth failure:", msg);
      clientStatus = "disconnected";
      qrCodeData = "";
      await safeDestroy();
      nukeSession();           // wipe corrupt session
      scheduleReinit(3000);    // restart in 3s → fresh QR
    });

    // ── Disconnected — auto-reconnect ────────────────────────────────────────
    c.on("disconnected", async (reason) => {
      console.warn("⚠️  Disconnected:", reason);
      clientStatus = "disconnected";
      qrCodeData = "";
      await safeDestroy();
      // LOGGED_OUT = intentional logout; otherwise try to reconnect
      if ((reason as string) === "LOGGED_OUT") {
        console.log("User logged out — waiting for manual reinit.");
      } else {
        console.log("Unexpected disconnect — reconnecting in 5s…");
        scheduleReinit(5000);
      }
    });

    client = c;
    await c.initialize();
    isInitializing = false;

  } catch (err: any) {
    isInitializing = false;
    client = null;
    clientStatus = "disconnected";

    const msg: string = err?.message || String(err);
    console.error("WhatsApp init error:", msg);

    // Known recoverable Puppeteer errors — just restart
    const recoverable = [
      "Execution context was destroyed",
      "Protocol error",
      "Target closed",
      "Session closed",
      "Navigation failed",
      "net::ERR",
    ];
    if (recoverable.some(e => msg.includes(e))) {
      console.warn("Recoverable error — restarting in 5s…");
      clearLockFiles();
      scheduleReinit(5000);
    } else if (msg.includes("EADDRINUSE") || msg.includes("already running")) {
      clearLockFiles();
      scheduleReinit(4000);
    } else {
      // Unknown error — log it, clear lock files, and schedule restart without nuking the session
      console.warn("Unknown init error — clear lock files and restarting in 8s (session preserved)…");
      clearLockFiles();
      scheduleReinit(8000);
    }
  }
}

// Start the client on boot
initClient();

// ── Store Recovery & Verification Helper ────────────────────────────────────
async function ensureStore(c: any): Promise<boolean> {
  if (!c || !c.pupPage) return false;
  try {
    const hasStore = await c.pupPage.evaluate(() => typeof (window as any).Store !== 'undefined');
    if (!hasStore) {
      console.warn("⚠️ window.Store is undefined in Puppeteer context. Re-injecting...");
      
      const storePath = path.join(__dirname, "node_modules", "whatsapp-web.js", "src", "util", "Injected", "Store.js");
      if (fs.existsSync(storePath)) {
        const storeContent = fs.readFileSync(storePath, "utf8");
        await c.pupPage.evaluate(() => {
          (window as any).exports = {};
        });
        await c.pupPage.evaluate(storeContent);
        await c.pupPage.evaluate(() => {
          if ((window as any).exports && (window as any).exports.ExposeStore) {
            (window as any).exports.ExposeStore();
          }
        });
        
        const checkStore = await c.pupPage.evaluate(() => typeof (window as any).Store !== 'undefined');
        if (checkStore) {
          console.log("✅ window.Store re-injected successfully.");
          return true;
        } else {
          console.error("❌ Failed to re-inject window.Store: Store is still undefined after evaluation.");
          return false;
        }
      } else {
        console.error(`❌ Store.js file not found at expected path: ${storePath}`);
        return false;
      }
    }
    return true;
  } catch (err) {
    console.error("Error in ensureStore:", err);
    return false;
  }
}

async function getNumberIdSafe(phone: string): Promise<any> {
  if (!client) throw new Error("WhatsApp client not initialized");
  await ensureStore(client);
  return await client.getNumberId(phone);
}

async function sendMessageSafe(chatId: string, message: string): Promise<any> {
  if (!client) throw new Error("WhatsApp client not initialized");
  await ensureStore(client);
  return await client.sendMessage(chatId, message);
}

// ── Queue Processor Worker ──────────────────────────────────────────────────
async function processQueue() {
  if (isProcessingQueue) return;
  isProcessingQueue = true;

  try {
    while (messageQueue.length > 0) {
      if (clientStatus !== "ready" || !client) {
        console.warn("Queue processing paused: WhatsApp client is not ready.");
        await new Promise(r => setTimeout(r, 2000));
        continue;
      }

      const item = messageQueue[0];
      console.log(`Processing message for ${item.phone}. Queue size remaining: ${messageQueue.length - 1}`);

      try {
        const numberId = await getNumberIdSafe(item.phone);
        if (numberId) {
          await sendMessageSafe(numberId._serialized, item.message);
          console.log(`Message successfully sent to ${item.phone}`);
        } else {
          console.warn(`Number ${item.phone} is not registered on WhatsApp.`);
        }
      } catch (e) {
        console.error(`Failed to send to ${item.phone}:`, e);
      }

      // Always remove the item from the queue after processing (whether it succeeded or failed)
      messageQueue.shift();

      // If there are more items, wait the specified delay before processing the next one
      if (messageQueue.length > 0) {
        console.log(`Waiting ${item.delayMs / 1000} seconds before next message...`);
        await new Promise(r => setTimeout(r, item.delayMs));
      }
    }
  } catch (error) {
    console.error("Error in queue processing loop:", error);
  } finally {
    isProcessingQueue = false;
  }
}


// ─── Multer ─────────────────────────────────────────────────────────────────
// Ensure uploads directory exists before multer tries to use it
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
  fs.mkdirSync(path.join(__dirname, "uploads"), { recursive: true });
}
const upload = multer({ dest: path.join(__dirname, "uploads") });

// ─── API Endpoints ───────────────────────────────────────────────────────────

app.get("/api/status", (req, res) => {
  res.json({ status: clientStatus });
});

// ─── QR endpoint — also auto-kicks a stuck init ──────────────────────────────
app.get("/api/qr", async (req, res) => {
  // If not connected and not already initializing, kick off init
  if (clientStatus === "disconnected" && !isInitializing) {
    console.log("QR requested while disconnected — auto-restarting...");
    scheduleReinit(500);
  }
  if (clientStatus === "ready") return res.json({ status: "ready" });
  if (!qrCodeData) return res.json({ status: clientStatus }); // connecting / qr (no image yet)
  try {
    const qrImage = await qrcode.toDataURL(qrCodeData);
    res.json({ qr: qrImage, status: "qr" });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

// ─── RESTART: force wipe session + reinit for guaranteed fresh QR ─────────────
app.post("/api/restart", async (req, res) => {
  console.log("🔄 Force restart requested.");
  if (reinitTimer) { clearTimeout(reinitTimer); reinitTimer = null; }
  isInitializing = false;
  qrCodeData = "";
  clientStatus = "connecting";
  await safeDestroy();
  nukeSession();
  res.json({ message: "Restarting WhatsApp session…" });
  scheduleReinit(1000);
});

// ─── LOGOUT: disconnect + clear contacts + delete session ─────────────────────
app.post("/api/logout", async (req, res) => {
  try {
    // 1. Try a clean logout if connected
    if (client && (clientStatus === "ready" || clientStatus === "authenticated")) {
      try { await client.logout(); } catch (e) { console.warn("Logout warning:", e); }
    }

    isInitializing = false;
    await safeDestroy();
    nukeSession();
    qrCodeData = "";
    clientStatus = "disconnected";

    // 2. Clear all contacts from SQLite
    db.prepare("DELETE FROM contacts").run();
    console.log("All contacts cleared.");

    res.json({ message: "Logged out and all data cleared successfully." });

    // 3. Reinit after 2s to show fresh QR
    scheduleReinit(2000);
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ error: "Logout failed" });
  }
});

// ─── Upload Contacts ─────────────────────────────────────────────────────────
app.post("/api/upload-contacts", (req: any, res: any) => {
  upload.single("file")(req, res, async (uploadErr: any) => {
    if (uploadErr) {
      console.error("Multer upload error:", uploadErr);
      return res.status(500).json({ error: "File upload failed: " + uploadErr.message });
    }

    if (!req.file) {
      return res.status(400).json({ error: "No file received. Make sure the field name is 'file'." });
    }

    const filePath = req.file.path;
    const originalName: string = req.file.originalname || "";
    const contacts: any[] = [];

    console.log("Upload received:", originalName, "at", filePath);

    try {
      if (originalName.toLowerCase().endsWith(".csv")) {
        const stream = fs.createReadStream(filePath).pipe(csv());
        stream.on("data", (data: any) => {
          const phone = data.phone || data.Phone || data.mobile || data.Mobile || data.PHONE || data.MOBILE;
          const name = data.name || data.Name || data.NAME || "Unknown";
          const category = data.category || data.Category || data.CATEGORY || "Default";
          if (phone) {
            contacts.push({ 
              name: String(name).trim(), 
              phone: String(phone).replace(/\D/g, ""),
              category: String(category).trim()
            });
          }
        });
        stream.on("end", () => {
          try { fs.unlinkSync(filePath); } catch (_) {}
          saveContacts(contacts, res);
        });
        stream.on("error", (err: any) => {
          console.error("CSV parse error:", err);
          try { fs.unlinkSync(filePath); } catch (_) {}
          res.status(500).json({ error: "Failed to parse CSV file" });
        });
      } else if (originalName.toLowerCase().endsWith(".xlsx") || originalName.toLowerCase().endsWith(".xls")) {
        const workbook = xlsx.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const data: any[] = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
        data.forEach((row: any) => {
          const phone = row.phone || row.Phone || row.mobile || row.Mobile || row.PHONE || row.MOBILE;
          const name = row.name || row.Name || row.NAME || "Unknown";
          const category = row.category || row.Category || row.CATEGORY || "Default";
          if (phone) {
            contacts.push({ 
              name: String(name).trim(), 
              phone: String(phone).replace(/\D/g, ""),
              category: String(category).trim()
            });
          }
        });
        try { fs.unlinkSync(filePath); } catch (_) {}
        saveContacts(contacts, res);
      } else {
        try { fs.unlinkSync(filePath); } catch (_) {}
        res.status(400).json({ error: "Unsupported file format. Please use .csv, .xlsx, or .xls" });
      }
    } catch (err: any) {
      console.error("File processing error:", err);
      try { fs.unlinkSync(filePath); } catch (_) {}
      res.status(500).json({ error: "Failed to process file: " + (err?.message || err) });
    }
  });
});

// ─── Manual Add Contact ───────────────────────────────────────────────────────
app.post("/api/add-contact", (req, res) => {
  const { name, phone, category } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });
  const cleanPhone = String(phone).replace(/\D/g, "");
  if (cleanPhone.length < 7) return res.status(400).json({ error: "Invalid phone number" });
  const cat = String(category || "Default").trim();
  try {
    db.prepare(`
      INSERT INTO contacts (name, phone, category)
      VALUES (?, ?, ?)
      ON CONFLICT(phone) DO UPDATE SET name=excluded.name, category=excluded.category
    `).run(String(name || "Unknown").trim(), cleanPhone, cat);
    res.json({ message: "Contact added successfully" });
  } catch (err: any) {
    console.error("Add contact error:", err);
    res.status(500).json({ error: "Failed to add contact" });
  }
});

// ─── Bulk JSON Import Contacts ───────────────────────────────────────────────
app.post("/api/import-contacts-bulk", (req, res) => {
  const { contacts } = req.body;
  if (!Array.isArray(contacts)) {
    return res.status(400).json({ error: "Invalid payload: contacts must be an array" });
  }
  saveContacts(contacts, res);
});

// ─── Delete Contact ───────────────────────────────────────────────────────────
app.delete("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  try {
    const result = db.prepare("DELETE FROM contacts WHERE id = ?").run(id);
    if (result.changes === 0) return res.status(404).json({ error: "Contact not found" });
    res.json({ message: "Contact deleted" });
  } catch (err: any) {
    res.status(500).json({ error: "Failed to delete contact" });
  }
});

// ─── Edit Contact ─────────────────────────────────────────────────────────────
app.put("/api/contacts/:id", (req, res) => {
  const { id } = req.params;
  const { name, phone, category } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone number is required" });
  const cleanPhone = String(phone).replace(/\D/g, "");
  if (cleanPhone.length < 7) return res.status(400).json({ error: "Invalid phone number" });
  const cat = String(category || "Default").trim();
  
  try {
    // When editing the phone number, if it changes, we must ensure it doesn't clash with another contact.
    // Also, if the phone number changes, we reset the verified flag to 0 since it is a new number.
    const current = db.prepare("SELECT phone, verified FROM contacts WHERE id = ?").get(id) as any;
    if (!current) {
      return res.status(404).json({ error: "Contact not found" });
    }
    
    const isNewPhone = current.phone !== cleanPhone;
    const verifiedStatus = isNewPhone ? 0 : current.verified;

    const result = db.prepare(`
      UPDATE contacts
      SET name = ?, phone = ?, category = ?, verified = ?
      WHERE id = ?
    `).run(String(name || "Unknown").trim(), cleanPhone, cat, verifiedStatus, id);

    res.json({ message: "Contact updated successfully", verifiedReset: isNewPhone });
  } catch (err: any) {
    console.error("Edit contact error:", err);
    if (err.message.includes("UNIQUE constraint failed")) {
      return res.status(400).json({ error: "Another contact with this phone number already exists" });
    }
    res.status(500).json({ error: "Failed to update contact" });
  }
});

function saveContacts(contacts: any[], res: any) {
  let count = 0;
  const insertStmt = db.prepare(`
    INSERT INTO contacts (name, phone, category)
    VALUES (?, ?, ?)
    ON CONFLICT(phone) DO UPDATE SET name=excluded.name, category=excluded.category
  `);

  const transaction = db.transaction((list: any[]) => {
    for (const contact of list) {
      try {
        const cat = String(contact.category || "Default").trim();
        insertStmt.run(contact.name, contact.phone, cat);
        count++;
      } catch (e) {}
    }
  });

  try {
    transaction(contacts);
  } catch (err) {
    console.error("Transaction failed:", err);
  }

  res.json({ message: `Successfully uploaded ${count} contacts` });
}

// ─── Verify Contacts ─────────────────────────────────────────────────────────
app.post("/api/verify-contacts", async (req, res) => {
  if (clientStatus !== "ready") return res.status(400).json({ error: "WhatsApp not connected" });

  const contacts = db.prepare("SELECT id, phone FROM contacts WHERE verified = 0").all() as any[];
  res.json({ message: "Verification started in background", count: contacts.length });

  // Process in batches of 5 in parallel to avoid rate limiting while dramatically speeding up verification
  const BATCH_SIZE = 5;
  const BATCH_DELAY = 600; // ms delay between batches

  for (let i = 0; i < contacts.length; i += BATCH_SIZE) {
    if (clientStatus !== "ready" || !client) {
      console.warn("⚠️ WhatsApp client disconnected during verification loop. Stopping verification.");
      break;
    }

    const batch = contacts.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map(async (contact) => {
        try {
          const id = await getNumberIdSafe(contact.phone);
          if (id) {
            db.prepare("UPDATE contacts SET verified = 1 WHERE id = ?").run(contact.id);
          } else {
            // Not registered on WhatsApp: mark as 2 (No WhatsApp)
            db.prepare("UPDATE contacts SET verified = 2 WHERE id = ?").run(contact.id);
          }
        } catch (e) {
          console.error(`Error verifying ${contact.phone}:`, e);
          // If we hit a Puppeteer error or other issue, leave it as 0 to allow retrying later
        }
      })
    );

    if (i + BATCH_SIZE < contacts.length) {
      await new Promise(r => setTimeout(r, BATCH_DELAY));
    }
  }
});

// ─── Get Contacts ─────────────────────────────────────────────────────────────
app.get("/api/contacts", (req, res) => {
  const contacts = db.prepare("SELECT id AS _id, name, phone, verified, category FROM contacts").all() as any[];
  res.json(contacts.map(c => ({ 
    ...c, 
    verifiedStatus: c.verified, 
    verified: c.verified === 1 
  })));
});

// ─── Send Message ─────────────────────────────────────────────────────────────
app.post("/api/send-message", async (req, res) => {
  const { message, phoneNumbers, delaySeconds } = req.body;
  const delayMs = Math.max(0, Math.round((parseFloat(delaySeconds) || 5) * 1000));

  if (clientStatus !== "ready") return res.status(400).json({ error: "WhatsApp not connected" });
  if (!message || !phoneNumbers || !Array.isArray(phoneNumbers)) {
    return res.status(400).json({ error: "Invalid parameters" });
  }

  // Add all messages to the queue
  for (const phone of phoneNumbers) {
    const contact = db.prepare("SELECT name FROM contacts WHERE phone = ?").get(phone) as any;
    const personalizedMessage = message.replace(/{name}/g, contact?.name || "Customer");
    
    messageQueue.push({
      phone,
      message: personalizedMessage,
      delayMs
    });
  }

  // Trigger processing asynchronously (do not await, return response immediately)
  processQueue();

  res.json({ message: `Mailing started. Added ${phoneNumbers.length} messages to queue.` });
});

// ─── Stats ────────────────────────────────────────────────────────────────────
app.get("/api/stats", (req, res) => {
  const totalRow = db.prepare("SELECT COUNT(*) AS count FROM contacts").get() as any;
  const verifiedRow = db.prepare("SELECT COUNT(*) AS count FROM contacts WHERE verified = 1").get() as any;
  res.json({ total: totalRow.count, verified: verifiedRow.count });
});

// ─── Vite middleware ──────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    root: __dirname,                                          // ✅ WhatsApp folder as root
    configFile: path.join(__dirname, "vite.config.ts"),      // ✅ WhatsApp's own vite config
    server: {
      middlewareMode: true,
      watch: {
        // Prevent Vite from watching WhatsApp session files and causing reloads
        ignored: ["**/.wwebjs_auth/**", "**/uploads/**", "**/contacts.db"],
      },
    },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
