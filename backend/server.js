import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

// 📌 Routen importieren
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();

const app = express();

// 🌍 **Sichere CORS-Konfiguration**
const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173']; // Definiert die zugelassenen Ursprünge
app.use(cors({
  origin: allowedOrigins, // Ursprünge von der Umgebungsvariable oder default localhost
  credentials: true, // Wenn du Cookies und Authentifizierung mit Anfragen verwenden möchtest
}));

// 🔥 **Datenbankverbindung mit Fehlerhandling**
const startServer = async () => {
  try {
    await connectDB(); // 🛠 **Nur verbinden, falls noch nicht verbunden**
    console.log('✅ Erfolgreich mit MongoDB verbunden!');
  } catch (err) {
    console.error('❌ Fehler bei der Datenbankverbindung:', err);
    process.exit(1); // 🚨 Kritischer Fehler → Server nicht starten!
  }

  // 🛠 **Middleware**
  app.use(express.json()); // JSON-Parsing aktivieren
  app.use(express.urlencoded({ extended: true })); // Form-Daten erlauben

  // 📌 **API-Routen registrieren**
  app.use('/api/users', userRoutes);
  app.use('/api/events', eventRoutes);
  app.use('/api/locations', locationRoutes);
  app.use('/api/ratings', ratingRoutes);
  

  // ✅ **Test-Route**
  app.get('/', (req, res) => {
    res.json({ message: '🚀 Server läuft & MongoDB ist verbunden!' });
  });

  // 🔥 **Server starten**
  const PORT = process.env.PORT || 5001; // Port wurde auf 5001 geändert, um Konflikte zu vermeiden
  app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT} (${process.env.NODE_ENV || 'production'})`);
  });
};

console.log("📡 API-Server wird gestartet...");

// ✅ Debugging: Routen prüfen
console.log("🔗 Events-Route geladen:", Object.keys(eventRoutes));
console.log("🔗 Users-Route geladen:", Object.keys(userRoutes));
console.log("🔗 Locations-Route geladen:", Object.keys(locationRoutes));
console.log("🔗 Ratings-Route geladen:", Object.keys(ratingRoutes));

// 🏁 **Server starten**
startServer();
