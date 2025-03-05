import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  // CORS hinzufügen
import connectDB from './db.js'; // Verbindung zur Datenbank
import errorHandler from './middleware/errorMiddleware.js';

// Routen importieren
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import locationRoutes from './routes/locationRoutes.js';  // NEU
import ratingRoutes from './routes/ratingRoutes.js';  // NEU

dotenv.config();
connectDB();

const app = express();
app.use(express.json()); // JSON-Parsing aktivieren
app.use(cors()); // CORS aktivieren

// Routen einbinden
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);  // NEU
app.use('/api/ratings', ratingRoutes);  // NEU

const PORT = process.env.PORT || 5000;

// Test-Route
app.get('/', (req, res) => {
  res.send('🚀 Server läuft und MongoDB ist verbunden!');
});

// Fehler-Handling Middleware nach allen Routen
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
