// backend/server.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import errorHandler from './middleware/errorMiddleware.js';

import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

dotenv.config(); // Umgebungsvariablen laden

const app = express();
app.use(express.json()); // JSON-Parsing aktivieren
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);

// Verbindung zu MongoDB herstellen
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ Erfolgreich mit MongoDB verbunden'))
  .catch((err) => {
    console.error('❌ MongoDB Verbindungsfehler:', err);
    process.exit(1); // Beendet den Prozess bei kritischem Fehler
  });

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
