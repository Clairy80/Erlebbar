import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Vite-Konfiguration
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // Proxy für Backend-Anfragen
    },
  },
});
