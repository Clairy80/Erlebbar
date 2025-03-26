import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log('✅ MongoDB ist bereits verbunden.');
    return;
  }

  if (!process.env.MONGODB_URI) {
    console.error('❌ Keine MONGODB_URI in .env definiert!');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB || undefined, // Optionaler DB-Name
    });

    isConnected = true;
    console.log(`✅ Erfolgreich verbunden mit MongoDB bei ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ Fehler bei MongoDB-Verbindung:', err.message);
    process.exit(1);
  }
};

export default connectDB;
