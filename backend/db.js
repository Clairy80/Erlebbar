import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("❌ MONGODB_URI fehlt!");
    }

    await mongoose.connect(uri); // Keine useNewUrlParser oder useUnifiedTopology mehr nötig
    console.log("✅ Erfolgreich mit MongoDB verbunden!");
  } catch (error) {
    console.error("❌ MongoDB-Verbindungsfehler:", error);
    process.exit(1);
  }
};

export default connectDB;
