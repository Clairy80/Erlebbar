import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './db.js';

// 📦 Routen
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import publicTransportRoutes from './routes/publicTransportRoutes.js';

// 📄 .env laden
dotenv.config();

// 📡 Express-App initialisieren
const app = express();

// 🌍 Erlaubte CORS-Ursprünge aus .env oder Fallback
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:5173'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// 🧠 Body-Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 🔗 Routen registrieren
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/public-transport', publicTransportRoutes);

// 🧪 Testroute
app.get('/', (req, res) => {
  res.json({ message: '🚀 Server läuft & MongoDB ist verbunden!' });
});

// 🚀 DB-Verbindung & Serverstart
const startServer = async () => {
  try {
    await connectDB(); // Nur hier wird verbunden!
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🟢 Server läuft auf http://localhost:${PORT} (${process.env.NODE_ENV || 'dev'})`);
    });
  } catch (err) {
    console.error('❌ Fehler beim Starten des Servers:', err.message);
    process.exit(1);
  }
};

console.log("📡 API-Server wird gestartet...");
startServer();
