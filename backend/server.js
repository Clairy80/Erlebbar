import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';  
import connectDB from './db.js'; 
import errorHandler from './middleware/errorMiddleware.js';

// 📌 Routen importieren
import userRoutes from './routes/userRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import locationRoutes from './routes/locationRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';

console.log('🔗 Events-Route geladen:', eventRoutes);
console.log('🔗 User-Route geladen:', userRoutes);
console.log('🔗 Location-Route geladen:', locationRoutes);
console.log('🔗 Rating-Route geladen:', ratingRoutes);


// 🔧 Konfiguration
dotenv.config();
connectDB();

const app = express();

// 🛠 Middleware
app.use(express.json()); // JSON-Parsing aktivieren
app.use(cors()); // CORS aktivieren

// 📌 Routen einbinden
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/ratings', ratingRoutes);

// ✅ Test-Route
app.get('/', (req, res) => {
  res.send('🚀 Server läuft und MongoDB ist verbunden!');
});

// 🛑 Fehler-Handling Middleware nach allen Routen
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server läuft auf Port ${PORT}`);
});
