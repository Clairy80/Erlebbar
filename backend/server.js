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

// 🔗 **Datenbank verbinden**
connectDB()
  .then(() => console.log('✅ Erfolgreich mit MongoDB verbunden!'))
  .catch((err) => {
    console.error('❌ Fehler bei der Datenbankverbindung:', err);
    process.exit(1);
  });

const app = express();

// 🛠 **Middleware**
app.use(express.json()); // JSON-Parsing aktivieren
app.use(express.urlencoded({ extended: true })); // Form-Daten erlauben
app.use(cors({ origin: '*', credentials: true })); // CORS für alle Anfragen

// 🔍 **Debugging: Geladene Routen**
console.log('🔗 Events-Route geladen:', Object.keys(eventRoutes));
console.log('🔗 User-Route geladen:', Object.keys(userRoutes));
console.log('🔗 Location-Route geladen:', Object.keys(locationRoutes));
console.log('🔗 Rating-Route geladen:', Object.keys(ratingRoutes));

// 📌 **API-Routen**
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/ratings', ratingRoutes);

// ✅ **Test-Route**
app.get('/', (req, res) => {
  res.send('🚀 Server läuft & MongoDB ist verbunden!');
});

// 🔥 **Server starten**
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
