import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false; // ✅ Zustand merken, um doppelte Verbindung zu verhindern

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB ist bereits verbunden.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI);
    isConnected = true; // ✅ Nur einmal verbinden
    console.log(`✅ Erfolgreich mit MongoDB verbunden: ${mongoose.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB-Verbindungsfehler:', err);
    process.exit(1);
  }
};

export default connectDB;
