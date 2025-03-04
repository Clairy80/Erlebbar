import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  /*server: {
    host: '0.0.0.0',  // Erlaubt Zugriff von anderen Geräten
    port: 5173,  
    proxy: {
      '/api': 'http://localhost:5000',  // Falls Backend auf 5000 läuft
    },      // Ändere den Port, falls nötig
  },*/
  plugins: [react()],
});
