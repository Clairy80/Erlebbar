import express from 'express'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken'; 

import nodemailer from 'nodemailer'; 
import User from '../models/User.js'; 
import Event from '../models/Event.js'; 
import { protect } from '../middleware/authMiddleware.js'; // AuthMiddleware importieren
import { authenticateOrganizer } from '../middleware/authenticateOrganizer.js'; // Middleware für Veranstalter importieren

const router = express.Router();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Registrierung (User)
router.post('/register/user', async (req, res) => {
    const { username, password, role = 'user', accessibilityOptions = [] } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Benutzername bereits vergeben' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role, accessibilityOptions });
        await user.save();

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: 'Benutzer erfolgreich erstellt', token, user: { id: user._id, username: user.username, role, accessibilityOptions } });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen des Users', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Benutzer nicht gefunden" });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: "Ungültige Zugangsdaten" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ message: "Login erfolgreich", token, user: { id: user._id, username: user.username, role: user.role, accessibilityOptions: user.accessibilityOptions } });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Login", error: error.message });
    }
});

// Event Registrierung (nur für Organisatoren)
router.post('/register/event', protect, authenticateOrganizer, async (req, res) => {
    const { title, description, date, time, location, lat, lon, accessibilityOptions, publicTransportProximity, wcAccessible, elevatorAccessible, languageOptions } = req.body;

    try {
        if (!title || !description || !date || !location || !lat || !lon) {
            return res.status(400).json({ message: 'Alle erforderlichen Felder müssen ausgefüllt werden' });
        }

        let eventDate = date;
        if (time) {
            eventDate = new Date(`${date}T${time}:00`);
        } else {
            eventDate = new Date(date);  // Falls keine Uhrzeit angegeben wurde
        }

        const newEvent = new Event({
            title,
            description,
            date: eventDate,
            location,
            lat,
            lon,
            accessibilityOptions,
            publicTransportProximity,
            wcAccessible,
            elevatorAccessible,
            languageOptions
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event erfolgreich registriert', event: newEvent });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Speichern des Events', error: error.message });
    }
});

export default router;