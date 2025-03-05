import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true, // Erlaubt Zugriff von anderen Geräten im Netzwerk
    port: 5173, // Standardport für Vite
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Backend-URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
