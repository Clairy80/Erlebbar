import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db.js'; // Hier importieren wir unsere ausgelagerte Verbindung
import errorHandler from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // Umgebungsvariablen laden
connectDB(); // Datenbankverbindung starten

const app = express();
app.use(express.json()); // JSON-Parsing aktivieren
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

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
