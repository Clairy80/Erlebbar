import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false; // 🔥 Variable, um doppelte Verbindung zu verhindern

const connectDB = async () => {
  if (isConnected) return; // ✅ Falls schon verbunden, brich ab!

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true; // ✅ Merke, dass wir verbunden sind
    console.log('XX✅ Erfolgreich mit MongoDB verbunden!');
  } catch (err) {
    console.error('❌ MongoDB Verbindungsfehler:', err);
    process.exit(1); // Kritischer Fehler → beendet den Prozess
  }
};

export default connectDB;
