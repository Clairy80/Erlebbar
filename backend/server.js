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

// 🔥 **Datenbankverbindung mit Fehlerhandling**
const startServer = async () => {
  try {
    await connectDB(); // 🛠 **Nur verbinden, falls noch nicht verbunden**
    console.log('✅ Erfolgreich mit MongoDB verbunden!');
  } catch (err) {
    console.error('❌ Fehler bei der Datenbankverbindung:', err);
    process.exit(1); // 🚨 Kritischer Fehler → Server nicht starten!
  }

  const app = express();

  // 🛠 **Middleware**
  app.use(express.json()); // JSON-Parsing aktivieren
  app.use(express.urlencoded({ extended: true })); // Form-Daten erlauben

  // 🌍 **Sichere CORS-Konfiguration**
  const allowedOrigins = process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:5173'];
  app.use(cors({ origin: allowedOrigins, credentials: true }));

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
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server läuft auf Port ${PORT} (${process.env.NODE_ENV || 'production'})`);
  });
};

// 🏁 **Server starten**
startServer();
