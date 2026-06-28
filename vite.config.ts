import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: {
        // Prevent Vite from watching WhatsApp session files, uploads, and DB
        // This stops the constant browser reloads during WhatsApp initialization
        ignored: [
          '**/.wwebjs_auth/**',
          '**/uploads/**',
          '**/contacts.db',
          '**/.wwebjs_cache/**',
        ],
      },
    },
  };
});
