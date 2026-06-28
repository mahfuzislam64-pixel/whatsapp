import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  QrCode,
  Upload,
  CheckCircle2,
  XCircle,
  Send,
  RefreshCw,
  Loader2,
  Database,
  LogOut,
  AlertTriangle,
  PlusCircle,
  FileDown,
  Trash2,
  UserPlus,
  FileText,
  FileSpreadsheet,
  Info,
  ExternalLink,
  Timer,
  Edit2,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COUNTRIES = [
  { name: "Afghanistan", code: "93", flag: "🇦🇫" },
  { name: "Albania", code: "355", flag: "🇦🇱" },
  { name: "Algeria", code: "213", flag: "🇩🇿" },
  { name: "Andorra", code: "376", flag: "🇦🇩" },
  { name: "Angola", code: "244", flag: "🇦🇴" },
  { name: "Antigua and Barbuda", code: "1268", flag: "🇦🇬" },
  { name: "Argentina", code: "54", flag: "🇦🇷" },
  { name: "Armenia", code: "374", flag: "🇦🇲" },
  { name: "Australia", code: "61", flag: "🇦🇺" },
  { name: "Austria", code: "43", flag: "🇦🇹" },
  { name: "Azerbaijan", code: "994", flag: "🇦🇿" },
  { name: "Bahamas", code: "1242", flag: "🇧🇸" },
  { name: "Bahrain", code: "973", flag: "🇧🇭" },
  { name: "Bangladesh", code: "880", flag: "🇧🇩" },
  { name: "Barbados", code: "1246", flag: "🇧🇧" },
  { name: "Belarus", code: "375", flag: "🇧🇾" },
  { name: "Belgium", code: "32", flag: "🇧🇪" },
  { name: "Belize", code: "501", flag: "🇧🇿" },
  { name: "Benin", code: "229", flag: "🇧🇯" },
  { name: "Bhutan", code: "975", flag: "🇧🇹" },
  { name: "Bolivia", code: "591", flag: "🇧🇴" },
  { name: "Bosnia and Herzegovina", code: "387", flag: "🇧🇦" },
  { name: "Botswana", code: "267", flag: "🇧🇼" },
  { name: "Brazil", code: "55", flag: "🇧🇷" },
  { name: "Brunei", code: "673", flag: "🇧🇳" },
  { name: "Bulgaria", code: "359", flag: "🇧🇬" },
  { name: "Burkina Faso", code: "226", flag: "🇧🇫" },
  { name: "Burundi", code: "257", flag: "🇧🇮" },
  { name: "Cabo Verde", code: "238", flag: "🇨🇻" },
  { name: "Cambodia", code: "855", flag: "🇰🇭" },
  { name: "Cameroon", code: "237", flag: "🇨🇲" },
  { name: "Canada", code: "1", flag: "🇨🇦" },
  { name: "Central African Republic", code: "236", flag: "🇨🇫" },
  { name: "Chad", code: "235", flag: "🇹🇩" },
  { name: "Chile", code: "56", flag: "🇨🇱" },
  { name: "China", code: "86", flag: "🇨🇳" },
  { name: "Colombia", code: "57", flag: "🇨🇴" },
  { name: "Comoros", code: "269", flag: "🇰🇲" },
  { name: "Congo (DRC)", code: "243", flag: "🇨🇩" },
  { name: "Congo (Republic)", code: "242", flag: "🇨🇬" },
  { name: "Costa Rica", code: "506", flag: "🇨🇷" },
  { name: "Croatia", code: "385", flag: "🇭🇷" },
  { name: "Cuba", code: "53", flag: "🇨🇺" },
  { name: "Cyprus", code: "357", flag: "🇨🇾" },
  { name: "Czech Republic", code: "420", flag: "🇨🇿" },
  { name: "Denmark", code: "45", flag: "🇩🇰" },
  { name: "Djibouti", code: "253", flag: "🇩🇯" },
  { name: "Dominica", code: "1767", flag: "🇩🇲" },
  { name: "Dominican Republic", code: "1809", flag: "🇩🇴" },
  { name: "Ecuador", code: "593", flag: "🇪🇨" },
  { name: "Egypt", code: "20", flag: "🇪🇬" },
  { name: "El Salvador", code: "503", flag: "🇸🇻" },
  { name: "Equatorial Guinea", code: "240", flag: "🇬🇶" },
  { name: "Eritrea", code: "291", flag: "🇪🇷" },
  { name: "Estonia", code: "372", flag: "🇪🇪" },
  { name: "Eswatini", code: "268", flag: "🇸🇿" },
  { name: "Ethiopia", code: "251", flag: "🇪🇹" },
  { name: "Fiji", code: "679", flag: "🇫🇯" },
  { name: "Finland", code: "358", flag: "🇫🇮" },
  { name: "France", code: "33", flag: "🇫🇷" },
  { name: "Gabon", code: "241", flag: "🇬🇦" },
  { name: "Gambia", code: "220", flag: "🇬🇲" },
  { name: "Georgia", code: "995", flag: "🇬🇪" },
  { name: "Germany", code: "49", flag: "🇩🇪" },
  { name: "Ghana", code: "233", flag: "🇬🇭" },
  { name: "Greece", code: "30", flag: "🇬🇷" },
  { name: "Grenada", code: "1473", flag: "🇬🇩" },
  { name: "Guatemala", code: "502", flag: "🇬🇹" },
  { name: "Guinea", code: "224", flag: "🇬🇳" },
  { name: "Guinea-Bissau", code: "245", flag: "🇬🇼" },
  { name: "Guyana", code: "592", flag: "🇬🇾" },
  { name: "Haiti", code: "509", flag: "🇭🇹" },
  { name: "Honduras", code: "504", flag: "🇭🇳" },
  { name: "Hungary", code: "36", flag: "🇭🇺" },
  { name: "Iceland", code: "354", flag: "🇮🇸" },
  { name: "India", code: "91", flag: "🇮🇳" },
  { name: "Indonesia", code: "62", flag: "🇮🇩" },
  { name: "Iran", code: "98", flag: "🇮🇷" },
  { name: "Iraq", code: "964", flag: "🇮🇶" },
  { name: "Ireland", code: "353", flag: "🇮🇪" },
  { name: "Israel", code: "972", flag: "🇮🇱" },
  { name: "Italy", code: "39", flag: "🇮🇹" },
  { name: "Ivory Coast", code: "225", flag: "🇨🇮" },
  { name: "Jamaica", code: "1876", flag: "🇯🇲" },
  { name: "Japan", code: "81", flag: "🇯🇵" },
  { name: "Jordan", code: "962", flag: "🇯🇴" },
  { name: "Kazakhstan", code: "7", flag: "🇰🇿" },
  { name: "Kenya", code: "254", flag: "🇰🇪" },
  { name: "Kiribati", code: "686", flag: "🇰🇮" },
  { name: "Kosovo", code: "383", flag: "🇽🇰" },
  { name: "Kuwait", code: "965", flag: "🇰🇼" },
  { name: "Kyrgyzstan", code: "996", flag: "🇰🇬" },
  { name: "Laos", code: "856", flag: "🇱🇦" },
  { name: "Latvia", code: "371", flag: "🇱🇻" },
  { name: "Lebanon", code: "961", flag: "🇱🇧" },
  { name: "Lesotho", code: "266", flag: "🇱🇸" },
  { name: "Liberia", code: "231", flag: "🇱🇷" },
  { name: "Libya", code: "218", flag: "🇱🇾" },
  { name: "Liechtenstein", code: "423", flag: "🇱🇮" },
  { name: "Lithuania", code: "370", flag: "🇱🇹" },
  { name: "Luxembourg", code: "352", flag: "🇱🇺" },
  { name: "Madagascar", code: "261", flag: "🇲🇬" },
  { name: "Malawi", code: "265", flag: "🇲🇼" },
  { name: "Malaysia", code: "60", flag: "🇲🇾" },
  { name: "Maldives", code: "960", flag: "🇲🇻" },
  { name: "Mali", code: "223", flag: "🇲🇱" },
  { name: "Malta", code: "356", flag: "🇲🇹" },
  { name: "Marshall Islands", code: "692", flag: "🇲🇭" },
  { name: "Mauritania", code: "222", flag: "🇲🇷" },
  { name: "Mauritius", code: "230", flag: "🇲🇺" },
  { name: "Mexico", code: "52", flag: "🇲🇽" },
  { name: "Micronesia", code: "691", flag: "🇫🇲" },
  { name: "Moldova", code: "373", flag: "🇲🇩" },
  { name: "Monaco", code: "377", flag: "🇲🇨" },
  { name: "Mongolia", code: "976", flag: "🇲🇳" },
  { name: "Montenegro", code: "382", flag: "🇲🇪" },
  { name: "Morocco", code: "212", flag: "🇲🇦" },
  { name: "Mozambique", code: "258", flag: "🇲🇿" },
  { name: "Myanmar", code: "95", flag: "🇲🇲" },
  { name: "Namibia", code: "264", flag: "🇳🇦" },
  { name: "Nauru", code: "674", flag: "🇳🇷" },
  { name: "Nepal", code: "977", flag: "🇳🇵" },
  { name: "Netherlands", code: "31", flag: "🇳🇱" },
  { name: "New Zealand", code: "64", flag: "🇳🇿" },
  { name: "Nicaragua", code: "505", flag: "🇳🇮" },
  { name: "Niger", code: "227", flag: "🇳🇪" },
  { name: "Nigeria", code: "234", flag: "🇳🇬" },
  { name: "North Korea", code: "850", flag: "🇰🇵" },
  { name: "North Macedonia", code: "389", flag: "🇲🇰" },
  { name: "Norway", code: "47", flag: "🇳🇴" },
  { name: "Oman", code: "968", flag: "🇴🇲" },
  { name: "Pakistan", code: "92", flag: "🇵🇰" },
  { name: "Palau", code: "680", flag: "🇵🇼" },
  { name: "Palestine", code: "970", flag: "🇵🇸" },
  { name: "Panama", code: "507", flag: "🇵🇦" },
  { name: "Papua New Guinea", code: "675", flag: "🇵🇬" },
  { name: "Paraguay", code: "595", flag: "🇵🇾" },
  { name: "Peru", code: "51", flag: "🇵🇪" },
  { name: "Philippines", code: "63", flag: "🇵🇭" },
  { name: "Poland", code: "48", flag: "🇵🇱" },
  { name: "Portugal", code: "351", flag: "🇵🇹" },
  { name: "Qatar", code: "974", flag: "🇶🇦" },
  { name: "Romania", code: "40", flag: "🇷🇴" },
  { name: "Russia", code: "7", flag: "🇷🇺" },
  { name: "Rwanda", code: "250", flag: "🇷🇼" },
  { name: "Saint Kitts and Nevis", code: "1869", flag: "🇰🇳" },
  { name: "Saint Lucia", code: "1758", flag: "🇱🇨" },
  { name: "Saint Vincent and the Grenadines", code: "1784", flag: "🇻🇨" },
  { name: "Samoa", code: "685", flag: "🇼🇸" },
  { name: "San Marino", code: "378", flag: "🇸🇲" },
  { name: "São Tomé and Príncipe", code: "239", flag: "🇸🇹" },
  { name: "Saudi Arabia", code: "966", flag: "🇸🇦" },
  { name: "Senegal", code: "221", flag: "🇸🇳" },
  { name: "Serbia", code: "381", flag: "🇷🇸" },
  { name: "Seychelles", code: "248", flag: "🇸🇨" },
  { name: "Sierra Leone", code: "232", flag: "🇸🇱" },
  { name: "Singapore", code: "65", flag: "🇸🇬" },
  { name: "Slovakia", code: "421", flag: "🇸🇰" },
  { name: "Slovenia", code: "386", flag: "🇸🇮" },
  { name: "Solomon Islands", code: "677", flag: "🇸🇧" },
  { name: "Somalia", code: "252", flag: "🇸🇴" },
  { name: "South Africa", code: "27", flag: "🇿🇦" },
  { name: "South Korea", code: "82", flag: "🇰🇷" },
  { name: "South Sudan", code: "211", flag: "🇸🇸" },
  { name: "Spain", code: "34", flag: "🇪🇸" },
  { name: "Sri Lanka", code: "94", flag: "🇱🇰" },
  { name: "Sudan", code: "249", flag: "🇸🇩" },
  { name: "Suriname", code: "597", flag: "🇸🇷" },
  { name: "Sweden", code: "46", flag: "🇸🇪" },
  { name: "Switzerland", code: "41", flag: "🇨🇭" },
  { name: "Syria", code: "963", flag: "🇸🇾" },
  { name: "Taiwan", code: "886", flag: "🇹🇼" },
  { name: "Tajikistan", code: "992", flag: "🇹🇯" },
  { name: "Tanzania", code: "255", flag: "🇹🇿" },
  { name: "Thailand", code: "66", flag: "🇹🇭" },
  { name: "Timor-Leste", code: "670", flag: "🇹🇱" },
  { name: "Togo", code: "228", flag: "🇹🇬" },
  { name: "Tonga", code: "676", flag: "🇹🇴" },
  { name: "Trinidad and Tobago", code: "1868", flag: "🇹🇹" },
  { name: "Tunisia", code: "216", flag: "🇹🇳" },
  { name: "Turkey", code: "90", flag: "🇹🇷" },
  { name: "Turkmenistan", code: "993", flag: "🇹🇲" },
  { name: "Tuvalu", code: "688", flag: "🇹🇻" },
  { name: "Uganda", code: "256", flag: "🇺🇬" },
  { name: "Ukraine", code: "380", flag: "🇺🇦" },
  { name: "United Arab Emirates", code: "971", flag: "🇦🇪" },
  { name: "United Kingdom", code: "44", flag: "🇬🇧" },
  { name: "United States", code: "1", flag: "🇺🇸" },
  { name: "Uruguay", code: "598", flag: "🇺🇾" },
  { name: "Uzbekistan", code: "998", flag: "🇺🇿" },
  { name: "Vanuatu", code: "678", flag: "🇻🇺" },
  { name: "Vatican City", code: "39", flag: "🇻🇦" },
  { name: "Venezuela", code: "58", flag: "🇻🇪" },
  { name: "Vietnam", code: "84", flag: "🇻🇳" },
  { name: "Yemen", code: "967", flag: "🇾🇪" },
  { name: "Zambia", code: "260", flag: "🇿🇲" },
  { name: "Zimbabwe", code: "263", flag: "🇿🇼" },
];

// Sort countries by code length DESC so longer codes match first
// (e.g. '1242' for Bahamas matches before '1' for US/Canada)
const SORTED_COUNTRIES_BY_CODE = [...COUNTRIES].sort((a, b) => b.code.length - a.code.length);

const getCountryFlag = (phone: string) => {
  const matching = SORTED_COUNTRIES_BY_CODE.find(c => phone.startsWith(c.code));
  return matching ? matching.flag : "🌐";
};

type Contact = {
  _id: string;
  name: string;
  phone: string;
  verified: boolean;
  verifiedStatus?: number;
  category?: string;
};

type Stats = {
  total: number;
  verified: number;
};

type UploadMode = "file" | "manual" | "fixer";

export default function App() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "login" | "contacts" | "upload" | "composer"
  >("dashboard");
  const [status, setStatus] = useState<string>("loading");
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [stats, setStats] = useState<Stats>({ total: 0, verified: 0 });
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [message, setMessage] = useState("Hello {name}, this is our message.");
  const [delaySeconds, setDelaySeconds] = useState<number>(5);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{
    text: string;
    type: "success" | "error" | "info" | "loading";
  } | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [uploadMode, setUploadMode] = useState<UploadMode>("file");
  const [isDragOver, setIsDragOver] = useState(false);

  // Manual import form
  const [manualName, setManualName] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualCategory, setManualCategory] = useState("Default");
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [addContactStatus, setAddContactStatus] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Number Fixer Form
  const [pastedNumbers, setPastedNumbers] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(""); // empty = not selected
  const [fixerCategory, setFixerCategory] = useState("Default");
  const [isFixing, setIsFixing] = useState(false);
  const [fixerStatus, setFixerStatus] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);
  const [countrySearch, setCountrySearch] = useState("");
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);

  // Delete contact
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Edit contact modal state
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editStatus, setEditStatus] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Contact search/filter
  const [contactSearch, setContactSearch] = useState("");
  const [contactFilter, setContactFilter] = useState<"all" | "verified" | "unverified">("all");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStatus();
    fetchStats();
    fetchContacts();
    const interval = setInterval(() => {
      fetchStatus();
      fetchStats();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/qr");
      const data = await res.json();
      setStatus(data.status);
      if (data.qr) setQrCode(data.qr);
      else if (data.status === "ready") setQrCode(null);
    } catch (err) {
      console.error("Failed to fetch status", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats");
      const data = await res.json();
      setStats(data);
    } catch (err) {}
  };

  const fetchContacts = async () => {
    try {
      const res = await fetch("/api/contacts");
      const data = await res.json();
      setContacts(data);
    } catch (err) {}
  };

  // ─── File Upload ────────────────────────────────────────────────────────────
  const processFile = async (file: File) => {
    const allowed = [".csv", ".xlsx", ".xls"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();
    if (!allowed.includes(ext)) {
      setUploadStatus({ text: "❌ Unsupported file type. Use .csv, .xlsx or .xls", type: "error" });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploadStatus({ text: `Uploading "${file.name}"...`, type: "loading" });
    try {
      const res = await fetch("/api/upload-contacts", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setUploadStatus({ text: data.message || "Upload successful!", type: "success" });
        fetchContacts();
        fetchStats();
      } else {
        setUploadStatus({ text: data.error || "Upload failed", type: "error" });
      }
    } catch (err) {
      setUploadStatus({ text: "Upload failed — server error", type: "error" });
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ─── Manual Import ──────────────────────────────────────────────────────────
  const handleAddContact = async () => {
    if (!manualPhone.trim()) {
      setAddContactStatus({ text: "Phone number is required", type: "error" });
      return;
    }
    setIsAddingContact(true);
    setAddContactStatus(null);
    try {
      const res = await fetch("/api/add-contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name: manualName.trim() || "Unknown", 
          phone: manualPhone.trim(),
          category: manualCategory.trim()
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setAddContactStatus({ text: "✅ " + data.message, type: "success" });
        setManualName("");
        setManualPhone("");
        setManualCategory("Default");
        fetchContacts();
        fetchStats();
      } else {
        setAddContactStatus({ text: "❌ " + data.error, type: "error" });
      }
    } catch {
      setAddContactStatus({ text: "❌ Server error", type: "error" });
    } finally {
      setIsAddingContact(false);
    }
  };

  // ─── Intelligent Number Fixer Import ──────────────────────────────────────
  const handleFixerImport = async () => {
    if (!pastedNumbers.trim()) {
      setFixerStatus({ text: "Please paste some numbers first", type: "error" });
      return;
    }
    setIsFixing(true);
    setFixerStatus(null);

    try {
      const cc = selectedCountryCode; // may be empty if user hasn't selected a country

      // ── Smart phone cleaner ──────────────────────────────────────────────
      const fixPhone = (raw: string): string | null => {
        let s = raw.trim();

        // 1. Remove all known decorators but keep digits and leading + for now
        //    Handle international prefix "00" → "+"
        s = s.replace(/^\s*00/, "+");

        // 2. Strip common visual separators: spaces, dashes, dots, parens, slashes
        //    but preserve a leading + temporarily
        const hasPlus = s.startsWith("+");
        s = s.replace(/[\s\-\.\(\)\/\\]/g, "");
        if (hasPlus) s = "+" + s.replace(/\+/g, "");
        else s = s.replace(/\+/g, "");

        // 3. Remove remaining non-digit chars
        const digitsOnly = s.replace(/\D/g, "");

        if (digitsOnly.length < 5) return null; // too short, skip

        // 4. Determine how to handle the number
        //    a) Started with + or 00 → already international format, trust it
        if (hasPlus) {
          if (digitsOnly.length < 7 || digitsOnly.length > 15) return null;
          return digitsOnly;
        }

        // b) If a country code is selected, apply it
        if (cc) {
          // Check if already starts with country code
          if (digitsOnly.startsWith(cc)) {
            return digitsOnly;
          }
          // Local format with leading 0 (e.g. 01712... in BD)
          if (digitsOnly.startsWith("0")) {
            const result = cc + digitsOnly.substring(1);
            if (result.length < 8 || result.length > 15) return null;
            return result;
          }
          // Bare number → prepend country code
          const result = cc + digitsOnly;
          if (result.length < 8 || result.length > 15) return null;
          return result;
        }

        // c) No country selected, no + prefix
        //    Treat as-is if it looks like a full international number (8–15 digits)
        //    Users who paste international numbers without + should still work
        if (digitsOnly.length >= 8 && digitsOnly.length <= 15) {
          return digitsOnly;
        }

        return null; // Too short/long and no way to fix without country code
      };

      // ── Smart name extractor ─────────────────────────────────────────────
      const extractNameAndPhone = (item: string): { name: string; rawPhone: string } => {
        // Patterns: "Name: number", "Name = number", "Name | number", "Name\tnumber"
        // Also: "Name - number" only if left side contains letters
        const sepPatterns: Array<[RegExp, string]> = [
          [/^([^:]+):\s*(.+)$/, ":"],
          [/^([^=]+)=\s*(.+)$/, "="],
          [/^([^|]+)\|\s*(.+)$/, "|"],
          [/^([^\t]+)\t(.+)$/, "tab"],
        ];

        for (const [regex] of sepPatterns) {
          const m = item.match(regex);
          if (m) {
            const potentialName = m[1].trim();
            const potentialPhone = m[2].trim();
            // Name side must have at least one letter
            if (/[a-zA-Z\u0980-\u09FF]/.test(potentialName)) {
              return { name: potentialName, rawPhone: potentialPhone };
            }
          }
        }

        // Hyphen separator: only if left part has letters (not a phone with dashes)
        const hyphenMatch = item.match(/^([^-]+-[^-]+(?:-[^-]+)?)[-\s]+(\+?[\d][\d\s\-\(\)]+)$/);
        if (hyphenMatch && /[a-zA-Z\u0980-\u09FF]/.test(hyphenMatch[1])) {
          return { name: hyphenMatch[1].trim(), rawPhone: hyphenMatch[2].trim() };
        }

        // If line starts with letters and ends with digits, try splitting at last word boundary
        const mixedMatch = item.match(/^([a-zA-Z\u0980-\u09FF][a-zA-Z\u0980-\u09FF\s.'-]{1,40})\s{2,}(\+?[\d][\d\s\-\(\)]+)$/);
        if (mixedMatch) {
          return { name: mixedMatch[1].trim(), rawPhone: mixedMatch[2].trim() };
        }

        return { name: "", rawPhone: item };
      };

      // ── Main parsing loop ────────────────────────────────────────────────
      // Split on newlines first, then each line by comma/semicolon if no name present
      const rawLines = pastedNumbers.split(/\n/);
      const items: string[] = [];
      for (const line of rawLines) {
        const trimmed = line.trim();
        if (!trimmed) continue;
        // Only split by comma/semicolon if line looks like pure numbers (no letters)
        if (!/[a-zA-Z\u0980-\u09FF]/.test(trimmed)) {
          items.push(...trimmed.split(/[,;]+/).map(s => s.trim()).filter(Boolean));
        } else {
          items.push(trimmed);
        }
      }

      const seen = new Set<string>();
      const list: Array<{ name: string; phone: string; category: string }> = [];
      let skipped = 0;
      let duplicates = 0;

      for (const item of items) {
        if (!item) continue;

        const { name, rawPhone } = extractNameAndPhone(item);
        const phone = fixPhone(rawPhone);

        if (!phone) {
          skipped++;
          continue;
        }

        // Deduplication
        if (seen.has(phone)) {
          duplicates++;
          continue;
        }
        seen.add(phone);

        list.push({
          name: name || `Contact ${phone.slice(-4)}`,
          phone,
          category: fixerCategory.trim() || "Default",
        });
      }

      if (list.length === 0) {
        setFixerStatus({
          text: `❌ No valid phone numbers found. ${skipped > 0 ? `${skipped} lines skipped (too short or invalid).` : ""}`,
          type: "error",
        });
        setIsFixing(false);
        return;
      }

      const res = await fetch("/api/import-contacts-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contacts: list }),
      });
      const data = await res.json();
      if (res.ok) {
        const parts = [`✅ Imported ${list.length} contacts`];
        if (duplicates > 0) parts.push(`${duplicates} duplicates removed`);
        if (skipped > 0) parts.push(`${skipped} invalid lines skipped`);
        setFixerStatus({ text: parts.join(" · "), type: "success" });
        setPastedNumbers("");
        fetchContacts();
        fetchStats();
      } else {
        setFixerStatus({ text: "❌ " + data.error, type: "error" });
      }
    } catch (err) {
      setFixerStatus({ text: "❌ Server error occurred.", type: "error" });
    } finally {
      setIsFixing(false);
    }
  };

  // ─── Sample File Downloads ─────────────────────────────────────────────────
  const downloadSampleCSV = () => {
    const rows = [
      "name,phone,category",
      "John Doe,919876543210,Clients",
      "Jane Smith,8801712345678,Friends",
      "Bob Johnson,15559876543,Family",
      "Alice Brown,447911123456,Default",
      "Carlos Garcia,5491155667788,Clients",
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, "sample_contacts.csv");
  };

  const downloadSampleXLSX = () => {
    const rows = [
      "name\tphone\tcategory",
      "John Doe\t919876543210\tClients",
      "Jane Smith\t8801712345678\tFriends",
      "Bob Johnson\t15559876543\tFamily",
      "Alice Brown\t447911123456\tDefault",
      "Carlos Garcia\t5491155667788\tClients",
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/tab-separated-values;charset=utf-8;" });
    triggerDownload(blob, "sample_contacts.xls");
  };

  const triggerDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // ─── Delete Contact ─────────────────────────────────────────────────────────
  const handleDeleteContact = async (id: string, phone: string) => {
    setDeletingId(id);
    try {
      await fetch(`/api/contacts/${id}`, { method: "DELETE" });
      setContacts((prev) => prev.filter((c) => c._id !== id));
      setSelectedContacts((prev) => prev.filter((p) => p !== phone));
      fetchStats();
    } catch {}
    setDeletingId(null);
  };

  // ─── Verification ──────────────────────────────────────────────────────────
  const startVerification = async () => {
    setIsVerifying(true);
    try {
      await fetch("/api/verify-contacts", { method: "POST" });
      alert("Verification started in background. Please wait a few minutes then refresh.");
    } catch {
      alert("Failed to start verification");
    } finally {
      setIsVerifying(false);
    }
  };

  // ─── Send Message ──────────────────────────────────────────────────────────
  const handleSendMessage = async () => {
    if (selectedContacts.length === 0) return alert("Select at least one contact");
    setIsSending(true);
    try {
      const res = await fetch("/api/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, phoneNumbers: selectedContacts, delaySeconds }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert("Failed to send messages");
    } finally {
      setIsSending(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    setIsLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      setContacts([]);
      setStats({ total: 0, verified: 0 });
      setSelectedContacts([]);
      setQrCode(null);
      setStatus("loading");
      setUploadStatus(null);
      setActiveTab("login");
      setTimeout(() => {
        fetchStatus();
        fetchStats();
        fetchContacts();
      }, 2500);
    } catch {
      alert("Logout failed. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // ─── Force Restart (wipe session → fresh QR) ────────────────────────────────
  const [isRestarting, setIsRestarting] = useState(false);
  const handleForceRestart = async () => {
    setIsRestarting(true);
    setQrCode(null);
    setStatus("connecting");
    try {
      await fetch("/api/restart", { method: "POST" });
      // Poll aggressively for new QR after restart
      setTimeout(fetchStatus, 2000);
      setTimeout(fetchStatus, 5000);
      setTimeout(fetchStatus, 9000);
      setTimeout(fetchStatus, 14000);
    } catch {
      alert("Failed to restart. Check the server.");
    } finally {
      setTimeout(() => setIsRestarting(false), 4000);
    }
  };

  // ─── Export Verified Contacts ──────────────────────────────────────────────
  const exportVerifiedContacts = () => {
    const verifiedList = contacts.filter((c) => c.verified);
    if (verifiedList.length === 0) {
      alert("No verified contacts to export!");
      return;
    }

    const headers = ["name", "phone", "category", "verified"];
    const rows = verifiedList.map((c) => [
      `"${(c.name || "").replace(/"/g, '""')}"`,
      c.phone,
      `"${(c.category || "Default").replace(/"/g, '""')}"`,
      "Yes"
    ]);

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    triggerDownload(blob, "verified_contacts.csv");
  };

  // ─── Edit Contact Actions ──────────────────────────────────────────────────
  const openEditModal = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone);
    setEditCategory(contact.category || "Default");
    setEditStatus(null);
  };

  const handleSaveEdit = async () => {
    if (!editingContact) return;
    if (!editPhone.trim()) {
      setEditStatus({ text: "Phone number is required", type: "error" });
      return;
    }

    setIsSavingEdit(true);
    setEditStatus(null);
    try {
      const res = await fetch(`/api/contacts/${editingContact._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName.trim(),
          phone: editPhone.trim(),
          category: editCategory.trim(),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setEditStatus({ text: "✅ " + data.message, type: "success" });
        setTimeout(() => {
          setEditingContact(null);
          setEditStatus(null);
          fetchContacts();
          fetchStats();
        }, 1200);
      } else {
        setEditStatus({ text: "❌ " + data.error, type: "error" });
      }
    } catch {
      setEditStatus({ text: "❌ Server error occurred.", type: "error" });
    } finally {
      setIsSavingEdit(false);
    }
  };

  const toggleContact = (phone: string) => {
    setSelectedContacts((prev) =>
      prev.includes(phone) ? prev.filter((p) => p !== phone) : [...prev, phone]
    );
  };

  const selectAllVerified = () => {
    setSelectedContacts(contacts.filter((c) => c.verified).map((c) => c.phone));
  };

  const filteredContacts = contacts.filter((c) => {
    const matchSearch =
      c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
      c.phone.includes(contactSearch);
    const matchFilter =
      contactFilter === "all" ||
      (contactFilter === "verified" && c.verified) ||
      (contactFilter === "unverified" && !c.verified);
    return matchSearch && matchFilter;
  });

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans text-[#111B21]">
      {/* Logout Confirm Modal */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col items-center text-center gap-4">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="text-red-500" size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Logout & Clear All Data?</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    This will disconnect WhatsApp, delete all contacts, and clear the session.{" "}
                    <span className="font-semibold text-red-500">Cannot be undone.</span>
                  </p>
                </div>
                <div className="flex gap-3 w-full mt-2">
                  <button
                    onClick={() => setShowLogoutConfirm(false)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex-1 py-2.5 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={16} /> Yes, Logout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Number Formatting & Guide Modal */}
      <AnimatePresence>
        {showInstructionsModal && (
          <motion.div
            key="instructions-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowInstructionsModal(false)}
          >
            <motion.div
              key="instructions-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 max-w-2xl w-full mx-auto max-h-[85vh] overflow-y-auto text-[#111B21]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start border-b border-[#D1D7DB] pb-4 mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Info className="text-[#00A884]" size={24} />
                    WhatsApp Number Formatting & Guide
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Please read this guide to ensure your messages deliver successfully.</p>
                </div>
                <button 
                  onClick={() => setShowInstructionsModal(false)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-xl px-2 hover:bg-gray-100 rounded-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6 text-sm text-gray-700">
                {/* Rule 1: Country Code Requirement */}
                <div className="bg-[#E8FBF0] p-4 rounded-xl border border-green-100">
                  <h4 className="font-bold text-green-800 flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                    ১. কান্ট্রি কোড যুক্ত করা বাধ্যতামূলক (No + or spaces)
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    প্রতিটি নাম্বারের শুরুতে অবশ্যই কান্ট্রি কোড (Country Code) থাকতে হবে। নাম্বারের মধ্যে কোনো <strong>+ (plus sign)</strong>, <strong>spaces (ফাঁকা জায়গা)</strong>, <strong>dash/hyphen (-)</strong> অথবা শুরুতে <strong>00</strong> থাকা যাবে না।
                  </p>
                  <div className="grid grid-cols-2 gap-4 mt-3 text-xs">
                    <div className="bg-white p-2.5 rounded border border-green-200">
                      <span className="text-green-600 font-bold block">✓ সঠিক ফরম্যাট:</span>
                      <code className="text-gray-800 font-semibold text-sm">8801712345678</code>
                    </div>
                    <div className="bg-white p-2.5 rounded border border-red-200">
                      <span className="text-red-500 font-bold block">✗ ভুল ফরম্যাট:</span>
                      <code className="text-gray-400 line-through text-xs">+880 1712-345678</code>
                    </div>
                  </div>
                </div>

                {/* Country Codes Table */}
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">বিভিন্ন দেশের কান্ট্রি কোড উদাহরণ:</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 border border-gray-100 rounded-lg overflow-hidden">
                      <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                        <tr>
                          <th className="px-4 py-2 text-left">দেশ (Country)</th>
                          <th className="px-4 py-2 text-left">কোড (Code)</th>
                          <th className="px-4 py-2 text-left">সঠিক নাম্বারের উদাহরণ</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 text-xs">
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">Bangladesh (বাংলাদেশ)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">880</td>
                          <td className="px-4 py-2.5 font-mono">88017XXXXXXXX</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">India (ভারত)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">91</td>
                          <td className="px-4 py-2.5 font-mono">919876543210</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">Saudi Arabia (সৌদি আরব)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">966</td>
                          <td className="px-4 py-2.5 font-mono">96650XXXXXXX</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">United Arab Emirates (ইউএই/দুবাই)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">971</td>
                          <td className="px-4 py-2.5 font-mono">97150XXXXXXX</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">USA / Canada (আমেরিকা)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">1</td>
                          <td className="px-4 py-2.5 font-mono">15559876543</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-2.5 font-medium text-gray-800">United Kingdom (যুক্তরাজ্য)</td>
                          <td className="px-4 py-2.5 font-mono text-[#00A884] font-bold">44</td>
                          <td className="px-4 py-2.5 font-mono">447911123456</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Steps to Send Campaign */}
                <div className="space-y-3">
                  <h4 className="font-bold text-gray-900">কিভাবে কাজ করে? (Step-by-step Guide)</h4>
                  <div className="relative border-l-2 border-gray-100 pl-4 ml-2 space-y-4">
                    <div>
                      <span className="absolute -left-[22px] top-0.5 bg-[#00A884] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">১</span>
                      <p className="font-bold text-sm text-gray-800">নাম্বার ইম্পোর্ট করুন:</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <strong>Import Contacts</strong> ট্যাবে গিয়ে CSV/Excel ফাইল আপলোড করুন, অথবা <strong>Manual Entry</strong>-তে সরাসরি নাম্বার ও নাম দিয়ে Add করুন।
                      </p>
                    </div>
                    <div>
                      <span className="absolute -left-[22px] top-0.5 bg-[#00A884] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">২</span>
                      <p className="font-bold text-sm text-gray-800">নাম্বার ভেরিফাই করুন (ঐচ্ছিক কিন্তু জরুরি):</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        সব নাম্বার আপলোডের পর Dashboard-এ ফিরে <strong>Verify Numbers</strong> এ চাপুন। এটি চেক করবে কোন নাম্বারগুলোতে আসলেই WhatsApp একাউন্ট সচল রয়েছে।
                      </p>
                    </div>
                    <div>
                      <span className="absolute -left-[22px] top-0.5 bg-[#00A884] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">৩</span>
                      <p className="font-bold text-sm text-gray-800">কন্টাক্ট সিলেক্ট করুন:</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        <strong>Contact List</strong> ট্যাবে গিয়ে যে নাম্বারগুলোতে মেসেজ পাঠাতে চান, সেগুলোর বাম পাশে টিক (check) দিন। অথবা ওপরে <strong>Select All Verified</strong> এ ক্লিক করুন।
                      </p>
                    </div>
                    <div>
                      <span className="absolute -left-[22px] top-0.5 bg-[#00A884] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">৪</span>
                      <p className="font-bold text-sm text-gray-800">মেসেজ লিখে সেন্ড করুন:</p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        এবার <strong>Message Sender</strong>-এ মেসেজ বক্স-এ লেখা লিখুন। প্রতিটি মেসেজের পর সেফটি delay (কমপক্ষে ৫ সেকেন্ড) নির্বাচন করে <strong>Send</strong> এ ক্লিক করুন।
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 border-t border-[#D1D7DB] pt-4 flex justify-end">
                <button
                  onClick={() => setShowInstructionsModal(false)}
                  className="px-5 py-2 bg-[#00A884] text-white font-bold rounded-xl text-sm hover:bg-[#008F6F] transition-colors"
                >
                  I Understand (বুঝেছি)
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Contact Modal */}
      <AnimatePresence>
        {editingContact && (
          <motion.div
            key="edit-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditingContact(null)}
          >
            <motion.div
              key="edit-modal"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full mx-auto text-[#111B21]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center border-b border-[#D1D7DB] pb-3 mb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Edit2 className="text-[#00A884]" size={20} />
                  Edit Contact Details
                </h3>
                <button
                  onClick={() => setEditingContact(null)}
                  className="text-gray-400 hover:text-gray-600 font-bold text-lg"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name (নাম)</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full px-3.5 py-2.5 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number (ফোন নাম্বার)</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    placeholder="Enter phone number"
                    className="w-full px-3.5 py-2.5 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm font-mono"
                  />
                  {editingContact.phone !== editPhone.replace(/\D/g, "") && (
                    <p className="text-[11px] text-amber-600 mt-1 font-medium">
                      ⚠️ Note: Changing phone number will reset its verification status.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category / Group (ক্যাটাগরি)</label>
                  <input
                    type="text"
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    placeholder="Enter category"
                    className="w-full px-3.5 py-2.5 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                  />
                </div>

                {editStatus && (
                  <div className={`p-3 rounded-xl text-xs font-semibold ${
                    editStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {editStatus.text}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setEditingContact(null)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-colors text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={isSavingEdit}
                    className="flex-1 py-2.5 bg-[#00A884] text-white rounded-xl font-semibold hover:bg-[#008F6F] transition-colors flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                  >
                    {isSavingEdit ? <Loader2 size={16} className="animate-spin" /> : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#D1D7DB] flex flex-col shrink-0">
        <div className="p-6 border-b border-[#D1D7DB]">
          <h1 className="text-xl font-bold flex items-center gap-2 text-[#00A884]">
            <MessageSquare className="w-6 h-6" />
            Mahfuz bd asia
          </h1>
          <p className="text-xs text-gray-400 mt-1">WhatsApp Bulk Sender</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          <NavItem active={activeTab === "dashboard"} onClick={() => setActiveTab("dashboard")} icon={<LayoutDashboard size={18} />} label="Dashboard" />
          <NavItem
            active={activeTab === "login"}
            onClick={() => setActiveTab("login")}
            icon={<QrCode size={18} />}
            label="WhatsApp Login"
            badge={status === "ready" ? "Connected" : "Disconnected"}
            badgeColor={status === "ready" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
          />
          <NavItem active={activeTab === "upload"} onClick={() => setActiveTab("upload")} icon={<Upload size={18} />} label="Import Contacts" />
          <NavItem
            active={activeTab === "contacts"}
            onClick={() => setActiveTab("contacts")}
            icon={<Users size={18} />}
            label="Contact List"
            badge={stats.total > 0 ? String(stats.total) : undefined}
            badgeColor="bg-blue-100 text-blue-700"
          />
          <NavItem active={activeTab === "composer"} onClick={() => setActiveTab("composer")} icon={<Send size={18} />} label="Message Sender" />
        </nav>

        <div className="p-4 border-t border-[#D1D7DB] space-y-3">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
          >
            {isLoggingOut ? <><Loader2 size={16} className="animate-spin" /> Logging out...</> : <><LogOut size={16} /> Logout & Clear Data</>}
          </button>
          <p className="text-[10px] text-gray-400 text-center">v1.0.0 • Made by Mahfuz bd asia</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <AnimatePresence mode="wait">

          {/* ── DASHBOARD ───────────────────────────────────────────────────── */}
          {activeTab === "dashboard" && (
            <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <h2 className="text-2xl font-semibold">Dashboard Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Total Contacts" value={stats.total} icon={<Users className="text-blue-500" />} color="bg-blue-50" />
                <StatCard title="Verified on WhatsApp" value={stats.verified} icon={<CheckCircle2 className="text-green-500" />} color="bg-green-50" />
                <StatCard
                  title="WhatsApp Status"
                  value={status === "ready" ? "Connected" : status === "loading" || status === "connecting" ? "Connecting..." : "Disconnected"}
                  icon={<Database className={status === "ready" ? "text-green-500" : "text-red-500"} />}
                  color={status === "ready" ? "bg-green-50" : "bg-red-50"}
                />
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#D1D7DB]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium">Quick Actions</h3>
                  {/* Email Marketing Link Button */}
                  <button
                    onClick={() => window.open('http://localhost:5173', '_blank')}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.45rem',
                      padding: '0.45rem 1rem', borderRadius: '8px',
                      border: '1px solid rgba(99,102,241,0.35)',
                      background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.07) 100%)',
                      color: '#6366f1', fontWeight: 700, fontSize: '0.82rem',
                      cursor: 'pointer', transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.14) 100%)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.6)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(99,102,241,0.2)';
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.background = 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.07) 100%)';
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(99,102,241,0.35)';
                      (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
                    }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                    Email Marketing
                    <ExternalLink size={11} style={{ opacity: 0.7 }} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button onClick={() => setActiveTab("upload")} className="px-4 py-2 bg-[#00A884] text-white rounded-lg hover:bg-[#008F6F] transition-colors flex items-center gap-2 text-sm font-medium">
                    <Upload size={16} /> Import Contacts
                  </button>
                  <button onClick={startVerification} disabled={isVerifying || status !== "ready"} className="px-4 py-2 border border-[#00A884] text-[#00A884] rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50">
                    {isVerifying ? <Loader2 className="animate-spin" size={16} /> : <RefreshCw size={16} />}
                    Verify Numbers
                  </button>
                  <button onClick={() => setActiveTab("contacts")} className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm font-medium">
                    <Users size={16} /> View Contacts
                  </button>
                  <button onClick={() => setShowLogoutConfirm(true)} disabled={isLoggingOut} className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50">
                    <LogOut size={16} /> Logout & Clear
                  </button>
                </div>
              </div>

              {/* How to use guide */}
              <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB] shadow-sm">
                <h3 className="text-lg font-medium mb-4 flex items-center gap-2"><Info size={18} className="text-[#00A884]" /> How to Use</h3>
                <ol className="space-y-3 text-sm text-gray-600">
                  {[
                    { step: 1, title: "Connect WhatsApp", desc: 'Go to "WhatsApp Login" and scan the QR code with your phone.' },
                    { step: 2, title: "Import Contacts", desc: 'Go to "Import Contacts". Upload a CSV/Excel file or add contacts manually one by one.' },
                    { step: 3, title: "Verify Numbers", desc: 'Click "Verify Numbers" to check which contacts have WhatsApp.' },
                    { step: 4, title: "Send Messages", desc: 'Select contacts in "Contact List", compose your message, and send.' },
                  ].map(({ step, title, desc }) => (
                    <li key={step} className="flex gap-3">
                      <span className="w-7 h-7 bg-[#00A884] text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">{step}</span>
                      <div><span className="font-semibold text-gray-800">{title}</span> — {desc}</div>
                    </li>
                  ))}
                </ol>
              </div>
            </motion.div>
          )}

          {/* ── LOGIN ───────────────────────────────────────────────────────── */}
          {activeTab === "login" && (
            <motion.div key="login" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto space-y-4">
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D1D7DB] text-center">
                <h2 className="text-2xl font-bold mb-1">WhatsApp Login</h2>
                <p className="text-gray-500 mb-6 text-sm">Scan the QR code with your WhatsApp app to connect.</p>

                {/* QR / Status display */}
                <div className="flex justify-center mb-6">
                  {status === "ready" ? (
                    <div className="flex flex-col items-center gap-4 text-green-600">
                      <div className="w-48 h-48 bg-green-50 rounded-full flex items-center justify-center">
                        <CheckCircle2 size={80} />
                      </div>
                      <p className="font-semibold text-xl">Connected Successfully!</p>
                    </div>
                  ) : qrCode ? (
                    <div className="flex flex-col items-center gap-3">
                      <div className="p-3 bg-white border-2 border-[#00A884] rounded-xl shadow-md">
                        <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
                      </div>
                      <p className="text-xs text-amber-600 font-medium animate-pulse">⏱ QR expires in ~60s — scan quickly!</p>
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-50 rounded-xl flex items-center justify-center flex-col gap-4 border-2 border-dashed border-gray-200">
                      <Loader2 className="animate-spin text-[#00A884]" size={40} />
                      <p className="text-sm text-gray-400 font-medium">
                        {status === "connecting" ? "Initializing browser..." :
                         status === "authenticated" ? "Authenticated — loading..." :
                         "Generating QR Code..."}
                      </p>
                    </div>
                  )}
                </div>

                {/* Instructions */}
                {status !== "ready" && (
                  <div className="text-left text-sm text-gray-600 bg-gray-50 p-4 rounded-xl mb-5 border border-gray-100">
                    <p className="font-semibold text-gray-800 flex items-center gap-2 mb-2">
                      <Info size={15} className="text-[#00A884]" /> Steps to connect:
                    </p>
                    <ol className="list-decimal list-inside space-y-1 text-gray-500">
                      <li>Open WhatsApp on your phone</li>
                      <li>Tap <strong>Menu ⋮</strong> or <strong>Settings ⚙</strong></li>
                      <li>Tap <strong>Linked Devices → Link a Device</strong></li>
                      <li>Point your phone camera at the QR above</li>
                    </ol>
                  </div>
                )}

                {/* Action buttons */}
                <div className="space-y-3">
                  {status === "ready" ? (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      disabled={isLoggingOut}
                      className="w-full py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isLoggingOut ? <Loader2 size={18} className="animate-spin" /> : <LogOut size={18} />}
                      {isLoggingOut ? "Logging out..." : "Logout & Clear All Data"}
                    </button>
                  ) : (
                    <button
                      onClick={handleForceRestart}
                      disabled={isRestarting}
                      className="w-full py-3 bg-[#00A884] text-white rounded-xl font-semibold hover:bg-[#008F6F] transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-sm"
                    >
                      {isRestarting ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                      {isRestarting ? "Restarting — new QR coming..." : "🔄 Force New QR / Restart Session"}
                    </button>
                  )}
                </div>
              </div>

              {/* Troubleshooting */}
              {status !== "ready" && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 space-y-1.5">
                  <p className="font-bold text-sm">⚠️ &quot;Could not link device&quot; / QR কাজ না করলে:</p>
                  <p>• <strong>🔄 Force New QR</strong> বাটনে ক্লিক করুন — corrupt session মুছে নতুন QR আসবে</p>
                  <p>• WhatsApp-এ ৫টির বেশি linked device থাকলে একটি remove করুন</p>
                  <p>• Phone-এ strong internet connection নিশ্চিত করুন (Wi-Fi ভালো)</p>
                  <p>• QR দেখা মাত্র scan করুন — 60 সেকেন্ড পরে expire হয়</p>
                  <p>• সমস্যা থাকলে server restart করুন এবং আবার Force New QR চাপুন</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ── IMPORT CONTACTS ─────────────────────────────────────────────── */}
          {activeTab === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="max-w-3xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-semibold">Import Contacts</h2>
                <p className="text-gray-500 text-sm mt-1">Add contacts by uploading a file or entering them manually.</p>
              </div>

              {/* Mode Tabs */}
              <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
                <button
                  onClick={() => setUploadMode("file")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${uploadMode === "file" ? "bg-white text-[#00A884] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <FileText size={16} /> File Import
                </button>
                <button
                  onClick={() => setUploadMode("manual")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${uploadMode === "manual" ? "bg-white text-[#00A884] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <UserPlus size={16} /> Manual Entry
                </button>
                <button
                  onClick={() => setUploadMode("fixer")}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${uploadMode === "fixer" ? "bg-white text-[#00A884] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                >
                  <RefreshCw size={16} /> Number Fixer & Paste
                </button>
              </div>

              <AnimatePresence mode="wait">
                {/* ── FILE IMPORT ── */}
                {uploadMode === "file" && (
                  <motion.div key="file-mode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">

                    {/* Sample Downloads */}
                    <div className="bg-[#E8FBF0] border border-green-200 rounded-2xl p-5">
                      <div className="flex items-start gap-3">
                        <FileDown className="text-[#00A884] mt-0.5 shrink-0" size={22} />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 mb-1">Download Sample Files</h4>
                          <p className="text-sm text-gray-600 mb-3">
                            Not sure about the format? Download a demo file to see exactly how your data should look.
                          </p>
                          <div className="flex gap-3 flex-wrap">
                            <button
                              onClick={downloadSampleCSV}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-[#00A884] rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors shadow-sm"
                            >
                              <FileText size={16} /> Download sample.csv
                            </button>
                            <button
                              onClick={downloadSampleXLSX}
                              className="flex items-center gap-2 px-4 py-2 bg-white border border-green-300 text-[#00A884] rounded-lg text-sm font-semibold hover:bg-green-50 transition-colors shadow-sm"
                            >
                              <FileSpreadsheet size={16} /> Download sample.xls
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Drop Zone */}
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                      onDragLeave={() => setIsDragOver(false)}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all group ${isDragOver ? "border-[#00A884] bg-green-50 scale-[1.01]" : "border-[#D1D7DB] hover:border-[#00A884] hover:bg-green-50"}`}
                    >
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${isDragOver ? "bg-green-100" : "bg-gray-100 group-hover:bg-green-100"}`}>
                        <Upload className={`transition-colors ${isDragOver ? "text-[#00A884]" : "text-gray-400 group-hover:text-[#00A884]"}`} size={32} />
                      </div>
                      <h3 className="text-lg font-medium mb-1">Drop your file here or click to browse</h3>
                      <p className="text-gray-400 text-sm mb-4">Supported: .csv, .xlsx, .xls</p>
                      <input type="file" ref={fileInputRef} onChange={handleFileInput} className="hidden" accept=".csv,.xlsx,.xls" />
                      <div className="inline-block px-4 py-2 bg-white border border-[#D1D7DB] rounded-lg text-sm font-medium">
                        Select File
                      </div>
                    </div>

                    {uploadStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-xl flex items-center gap-3 border text-sm font-medium ${
                          uploadStatus.type === "success" ? "bg-green-50 text-green-700 border-green-200" :
                          uploadStatus.type === "error" ? "bg-red-50 text-red-700 border-red-200" :
                          uploadStatus.type === "loading" ? "bg-blue-50 text-blue-700 border-blue-200" :
                          "bg-gray-50 text-gray-700 border-gray-200"
                        }`}
                      >
                        {uploadStatus.type === "loading" ? <Loader2 className="animate-spin shrink-0" size={18} /> :
                         uploadStatus.type === "success" ? <CheckCircle2 size={18} className="shrink-0" /> :
                         <XCircle size={18} className="shrink-0" />}
                        {uploadStatus.text}
                      </motion.div>
                    )}

                    {/* Format Guide */}
                    <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB]">
                      <h4 className="font-semibold mb-4 text-gray-800">File Format Requirements</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-600">
                        <div>
                          <p className="font-semibold mb-2 text-gray-800">Column Names (any case):</p>
                          <ul className="space-y-1">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-[#00A884] rounded-full" /> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">phone</code> / <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">mobile</code> — required</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-300 rounded-full" /> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">name</code> — optional</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 bg-gray-300 rounded-full" /> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">category</code> — optional</li>
                          </ul>
                        </div>
                        <div>
                          <p className="font-semibold mb-2 text-gray-800">Phone Number Format:</p>
                          <p>Include country code, no <code className="bg-gray-100 px-1 rounded text-xs">+</code> or spaces.</p>
                          <p className="mt-1 text-green-700 font-medium">✓ 8801712345678</p>
                          <p className="mt-0.5 text-red-600">✗ +880 1712-345678</p>
                        </div>
                      </div>
                      {/* Mini preview table */}
                      <div className="mt-4 overflow-x-auto">
                        <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Example CSV preview:</p>
                        <table className="text-xs border border-gray-200 rounded-lg overflow-hidden w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left border-r border-gray-200 text-gray-600">name</th>
                              <th className="px-4 py-2 text-left border-r border-gray-200 text-gray-600">phone</th>
                              <th className="px-4 py-2 text-left text-gray-600">category</th>
                            </tr>
                          </thead>
                          <tbody>
                            {[["John Doe","919876543210","Clients"],["Jane Smith","8801712345678","Friends"],["Bob Johnson","15559876543","Family"]].map(([n,p,c], i) => (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{n}</td>
                                <td className="px-4 py-2 border-r border-gray-200 text-gray-700">{p}</td>
                                <td className="px-4 py-2 text-gray-700">{c}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── MANUAL ENTRY ── */}
                {uploadMode === "manual" && (
                  <motion.div key="manual-mode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="bg-white p-8 rounded-2xl border border-[#D1D7DB] shadow-sm space-y-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <UserPlus size={20} className="text-[#00A884]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Add Single Contact</h3>
                          <p className="text-sm text-gray-500">Enter a contact's details and click Add</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Full Name <span className="text-gray-400 font-normal">(optional)</span>
                          </label>
                          <input
                            type="text"
                            value={manualName}
                            onChange={(e) => setManualName(e.target.value)}
                            placeholder="e.g. John Doe"
                            className="w-full px-4 py-3 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Phone Number <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={manualPhone}
                            onChange={(e) => setManualPhone(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddContact()}
                            placeholder="e.g. 8801712345678"
                            className="w-full px-4 py-3 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                          />
                          <p className="text-xs text-gray-400 mt-1">Include country code, no + or spaces</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Category / Group Name
                          </label>
                          <input
                            type="text"
                            value={manualCategory}
                            onChange={(e) => setManualCategory(e.target.value)}
                            placeholder="e.g. Clients, Friends"
                            className="w-full px-4 py-3 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleAddContact}
                        disabled={isAddingContact || !manualPhone.trim()}
                        className="w-full py-3 bg-[#00A884] text-white rounded-xl font-semibold hover:bg-[#008F6F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        {isAddingContact ? <Loader2 className="animate-spin" size={18} /> : <PlusCircle size={18} />}
                        {isAddingContact ? "Adding..." : "Add Contact"}
                      </button>

                      <AnimatePresence>
                        {addContactStatus && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-3 rounded-lg text-sm font-medium ${addContactStatus.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
                          >
                            {addContactStatus.text}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Tip box */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3 text-sm text-blue-700">
                      <Info size={18} className="shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Tip:</span> For many contacts, use File Import instead — upload a CSV or Excel file with hundreds of contacts at once.{" "}
                        <button onClick={() => setUploadMode("file")} className="underline font-semibold hover:no-underline">Switch to File Import →</button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* ── NUMBER FIXER & PASTE ── */}
                {uploadMode === "fixer" && (
                  <motion.div key="fixer-mode" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                    <div className="bg-white p-8 rounded-2xl border border-[#D1D7DB] shadow-sm space-y-6">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                          <RefreshCw size={20} className="text-[#00A884]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">Smart Number Fixer & Paste</h3>
                          <p className="text-sm text-gray-500">Paste numbers, select a country — codes are auto-added, junk removed</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            🌍 Target Country
                            {!selectedCountryCode && <span className="ml-1 text-xs font-normal text-amber-600">(optional — needed for local numbers)</span>}
                          </label>
                          {/* Selected country display + search input */}
                          <div
                            className={`w-full px-4 py-3 border rounded-xl focus-within:ring-2 focus-within:ring-[#00A884] focus-within:border-transparent bg-white flex items-center gap-2 cursor-text transition-colors ${
                              selectedCountryCode ? "border-[#D1D7DB]" : "border-amber-300"
                            }`}
                            onClick={() => setShowCountryDropdown(true)}
                          >
                            <span className="text-base shrink-0">
                              {selectedCountryCode
                                ? COUNTRIES.find(c => c.code === selectedCountryCode)?.flag || "🌐"
                                : "🌐"
                              }
                            </span>
                            <input
                              type="text"
                              value={showCountryDropdown ? countrySearch : (
                                selectedCountryCode && COUNTRIES.find(c => c.code === selectedCountryCode)
                                  ? `${COUNTRIES.find(c => c.code === selectedCountryCode)!.name} (+${selectedCountryCode})`
                                  : ""
                              )}
                              onChange={(e) => { setCountrySearch(e.target.value); setShowCountryDropdown(true); }}
                              onFocus={() => { setCountrySearch(""); setShowCountryDropdown(true); }}
                              onBlur={() => setTimeout(() => setShowCountryDropdown(false), 200)}
                              placeholder={selectedCountryCode ? "Search country..." : "Select country (optional for +/00 numbers)"}
                              className="flex-1 outline-none text-sm bg-transparent min-w-0 placeholder:text-amber-400"
                            />
                            {selectedCountryCode && (
                              <button
                                type="button"
                                onMouseDown={(e) => { e.preventDefault(); setSelectedCountryCode(""); setCountrySearch(""); }}
                                className="text-gray-300 hover:text-red-400 text-xs shrink-0 px-1"
                                title="Clear selection"
                              >✕</button>
                            )}
                            <span className="text-gray-400 text-xs shrink-0">▼</span>
                          </div>
                          {/* Dropdown list */}
                          {showCountryDropdown && (
                            <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-[#D1D7DB] rounded-xl shadow-xl max-h-56 overflow-y-auto">
                              {COUNTRIES.filter(c =>
                                c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                c.code.includes(countrySearch)
                              ).length === 0 ? (
                                <div className="px-4 py-3 text-sm text-gray-400">No countries found</div>
                              ) : (
                                COUNTRIES.filter(c =>
                                  c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
                                  c.code.includes(countrySearch)
                                ).map(c => (
                                  <button
                                    key={`${c.name}-${c.code}`}
                                    type="button"
                                    onMouseDown={() => {
                                      setSelectedCountryCode(c.code);
                                      setCountrySearch("");
                                      setShowCountryDropdown(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left text-sm flex items-center gap-2.5 hover:bg-green-50 transition-colors ${
                                      c.code === selectedCountryCode ? "bg-green-50 font-semibold text-[#00A884]" : "text-gray-700"
                                    }`}
                                  >
                                    <span className="text-base">{c.flag}</span>
                                    <span className="flex-1">{c.name}</span>
                                    <span className="text-gray-400 text-xs font-mono">+{c.code}</span>
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">🏷️ Category / Group (ক্যাটাগরি)</label>
                          <input
                            type="text"
                            value={fixerCategory}
                            onChange={(e) => setFixerCategory(e.target.value)}
                            placeholder="e.g. Clients, Friends, Students"
                            className="w-full px-4 py-3 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1.5">⚡ Auto Fix Intelligence</label>
                          <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded-xl border border-gray-100 leading-relaxed space-y-1">
                            <p>✓ <code className="font-bold">+880...</code> or <code className="font-bold">00880...</code> → keeps as-is</p>
                            <p>✓ <code className="font-bold">01712...</code> → strips 0, adds code</p>
                            <p>✓ <code className="font-bold">1712...</code> → prepends code directly</p>
                            <p>✓ Already has code → no change</p>
                            <p>✓ Spaces, dashes, dots, brackets → removed</p>
                            <p>✓ Duplicate numbers → skipped</p>
                            <p>✓ <code className="font-bold">Name: 017...</code> format → name saved</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          📋 Paste Phone Numbers — one per line, or <code className="bg-gray-100 px-1 rounded">Name: Number</code> format
                        </label>
                        <textarea
                          value={pastedNumbers}
                          onChange={(e) => setPastedNumbers(e.target.value)}
                          rows={8}
                          placeholder={`01712345678\n+8801711223344\nJohn Doe: 01712000000\n+91 98765-43210\n880 1911 222333`}
                          className="w-full p-4 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-sm font-mono"
                        />
                        <p className="text-xs text-gray-400 mt-1">
                          কমা (,), সেমিকোলন (;), বা নতুন লাইনে আলাদা করুন। নাম দিতে চাইলে <code>Name: 01712345</code> এভাবে লিখুন।
                        </p>
                      </div>

                      <button
                        onClick={handleFixerImport}
                        disabled={isFixing || !pastedNumbers.trim()}
                        className="w-full py-3.5 bg-[#00A884] text-white rounded-xl font-semibold hover:bg-[#008F6F] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm text-base"
                      >
                        {isFixing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                        {isFixing ? "Fixing & Importing..." : "Fix & Import Contacts"}
                      </button>

                      <AnimatePresence>
                        {fixerStatus && (
                          <motion.div
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-xl text-sm font-medium flex items-start gap-2 ${
                              fixerStatus.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
                            }`}
                          >
                            {fixerStatus.type === "success" ? <CheckCircle2 size={16} className="shrink-0 mt-0.5" /> : <XCircle size={16} className="shrink-0 mt-0.5" />}
                            {fixerStatus.text}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* ── CONTACTS ────────────────────────────────────────────────────── */}
          {activeTab === "contacts" && (
            <motion.div key="contacts" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-2xl font-semibold">Contact List <span className="text-gray-400 text-lg font-normal">({contacts.length})</span></h2>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={fetchContacts} className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1.5">
                    <RefreshCw size={14} /> Refresh
                  </button>
                  <button onClick={selectAllVerified} className="px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                    Select All Verified
                  </button>
                  <button onClick={() => setSelectedContacts([])} className="px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    Clear Selection
                  </button>
                  <button onClick={exportVerifiedContacts} className="px-3 py-2 text-sm font-semibold bg-[#00A884] text-white hover:bg-[#008F6F] rounded-lg transition-colors flex items-center gap-1.5 shadow-sm">
                    <FileDown size={14} /> Export Verified (CSV)
                  </button>
                </div>
              </div>

              {/* Filter bar */}
              <div className="flex gap-3 flex-wrap items-center">
                <input
                  type="text"
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  placeholder="Search by name or phone..."
                  className="px-4 py-2 border border-[#D1D7DB] rounded-xl text-sm focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none w-64"
                />
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                  {(["all","verified","unverified"] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setContactFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${contactFilter === f ? "bg-white text-[#00A884] shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
                {selectedContacts.length > 0 && (
                  <span className="text-sm text-[#00A884] font-semibold">{selectedContacts.length} selected</span>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-[#D1D7DB] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-gray-50 border-b border-[#D1D7DB]">
                    <tr>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Select</th>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Name</th>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Phone</th>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Category</th>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Status</th>
                      <th className="px-5 py-3.5 font-medium text-gray-500 text-xs uppercase tracking-wide">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F2F5]">
                    {filteredContacts.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center text-gray-400">
                          {contacts.length === 0
                            ? "No contacts yet. Import some to get started."
                            : "No contacts match your search/filter."}
                        </td>
                      </tr>
                    ) : (
                      filteredContacts.map((contact) => (
                        <tr key={contact._id} className={`hover:bg-gray-50 transition-colors ${selectedContacts.includes(contact.phone) ? "bg-green-50/50" : ""}`}>
                          <td className="px-5 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedContacts.includes(contact.phone)}
                              onChange={() => toggleContact(contact.phone)}
                              className="w-4 h-4 rounded border-gray-300 text-[#00A884] focus:ring-[#00A884] cursor-pointer"
                            />
                          </td>
                          <td className="px-5 py-3.5 font-medium text-sm">{contact.name}</td>
                          <td className="px-5 py-3.5 text-sm font-mono">
                            <span className="text-base mr-1.5" title="Country">{getCountryFlag(contact.phone)}</span>
                            <span className="text-gray-500">{contact.phone}</span>
                          </td>
                          <td className="px-5 py-3.5">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                              {contact.category || "Default"}
                            </span>
                          </td>
                          <td className="px-5 py-3.5">
                            {contact.verified ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                                <CheckCircle2 size={11} /> Verified
                              </span>
                            ) : contact.verifiedStatus === 2 ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                                <XCircle size={11} /> No WhatsApp
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
                                <XCircle size={11} /> Unverified
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-3.5 flex items-center gap-1.5">
                            <button
                              onClick={() => openEditModal(contact)}
                              className="p-1.5 text-gray-400 hover:text-[#00A884] hover:bg-green-50 rounded-lg transition-colors"
                              title="Edit contact"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteContact(contact._id, contact.phone)}
                              disabled={deletingId === contact._id}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Delete contact"
                            >
                              {deletingId === contact._id ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* ── COMPOSER ────────────────────────────────────────────────────── */}
          {activeTab === "composer" && (
            <motion.div key="composer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-semibold">Compose Message</h2>
                <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB] shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message Content</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="w-full p-4 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none resize-none text-sm"
                    placeholder="Type your message here..."
                  />
                  <div className="mt-2 text-xs text-gray-400 flex justify-between">
                    <span>Use <code className="bg-gray-100 px-1 rounded">{"{name}"}</code> to personalize</span>
                    <span>{message.length} chars</span>
                  </div>
                </div>

                {/* Delay Between Messages */}
                <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB] shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <Timer size={15} className="text-[#00A884]" />
                    Delay Between Each Message
                  </label>
                  <div className="flex items-center gap-3 flex-wrap">
                    <input
                      type="number"
                      min={0}
                      max={300}
                      step={0.5}
                      value={delaySeconds}
                      onChange={e => setDelaySeconds(parseFloat(e.target.value) || 0)}
                      className="w-24 px-3 py-2 border border-[#D1D7DB] rounded-xl focus:ring-2 focus:ring-[#00A884] focus:border-transparent outline-none text-center font-bold text-lg"
                    />
                    <span className="text-sm text-gray-500">seconds</span>
                    <div className="flex gap-1.5 ml-auto">
                      {[3, 5, 10, 15].map(sec => (
                        <button
                          key={sec}
                          type="button"
                          onClick={() => setDelaySeconds(sec)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                            delaySeconds === sec
                              ? 'bg-green-50 border-[#00A884] text-[#00A884]'
                              : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-[#00A884] hover:text-[#00A884]'
                          }`}
                        >
                          {sec}s
                        </button>
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    প্রতিটি message পাঠানোর পর এই সময় অপেক্ষা করবে। WhatsApp ban এড়াতে কমপক্ষে ৫ সেকেন্ড রাখুন।
                  </p>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB] shadow-sm">
                  <h3 className="font-medium mb-4 flex items-center gap-2 text-sm">
                    <Users size={16} /> Recipients ({selectedContacts.length})
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-1">
                    {selectedContacts.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">No contacts selected. Go to Contact List to select recipients.</p>
                    ) : (
                      selectedContacts.map((phone) => (
                        <span key={phone} className="px-3 py-1 bg-green-50 border border-green-200 text-green-800 rounded-full text-xs font-medium flex items-center gap-1.5">
                          {contacts.find((c) => c.phone === phone)?.name || phone}
                          <button onClick={() => toggleContact(phone)} className="hover:text-red-500 font-bold">×</button>
                        </span>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={handleSendMessage}
                  disabled={isSending || selectedContacts.length === 0 || status !== "ready"}
                  className="w-full py-4 bg-[#00A884] text-white rounded-xl font-bold text-lg hover:bg-[#008F6F] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-green-100"
                >
                  {isSending ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                  {isSending ? "Sending..." : `Send to ${selectedContacts.length} Contact${selectedContacts.length !== 1 ? "s" : ""}`}
                </button>
                {status !== "ready" && (
                  <p className="text-center text-sm text-red-500">⚠ WhatsApp not connected. Go to WhatsApp Login first.</p>
                )}

                {/* ℹ Instruction Guide Button */}
                <button
                  type="button"
                  onClick={() => setShowInstructionsModal(true)}
                  className="w-full mt-4 py-3 border-2 border-[#00A884] text-[#00A884] hover:bg-green-50 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Info size={16} /> Number Formatting & Guide (হেল্প গাইড)
                </button>
              </div>

              {/* Phone preview */}
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold opacity-0">Preview</h2>
                <div className="bg-[#E5DDD5] rounded-3xl overflow-hidden shadow-xl border border-[#D1D7DB] aspect-[9/16] relative">
                  <div className="bg-[#075E54] p-4 text-white flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-300 rounded-full" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Preview Recipient</p>
                      <p className="text-[10px] opacity-70">online</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm max-w-[85%]">
                      <p className="text-sm whitespace-pre-wrap break-words">{message.replace(/{name}/g, "John Doe")}</p>
                      <span className="text-[10px] text-gray-400 block text-right mt-1">10:42 AM ✓✓</span>
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-[#F0F2F5] flex items-center gap-2">
                    <div className="flex-1 bg-white h-10 rounded-full" />
                    <div className="w-10 h-10 bg-[#00A884] rounded-full flex items-center justify-center text-white">
                      <Send size={16} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </main>
    </div>
  );
}

function NavItem({ active, onClick, icon, label, badge, badgeColor }: any) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-sm ${
        active ? "bg-green-50 text-[#00A884] font-semibold" : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
      }`}
    >
      <div className="flex items-center gap-3">{icon}<span>{label}</span></div>
      {badge && (
        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${badgeColor}`}>{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-[#D1D7DB] shadow-sm flex items-center gap-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        {React.cloneElement(icon, { size: 24 })}
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  );
}
