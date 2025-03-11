import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
        ws: false, // 🔥 WebSocket-Probleme vermeiden
      },
    },
    hmr: {
      overlay: false, // 🔥 Verhindert doppelte HMR-Reloads
    },
  },
  plugins: [react()],
});
