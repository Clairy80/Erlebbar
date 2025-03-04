import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Erfolgreich mit MongoDB verbunden');
    } catch (err) {
        console.error('❌ MongoDB Verbindungsfehler:', err);
        process.exit(1); // Beendet den Prozess bei kritischem Fehler
    }
};

export default connectDB;
