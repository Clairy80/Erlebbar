import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

import User from '../models/User.js';
import Event from '../models/Event.js';
import { protect } from './authMiddleware.js'; // Auth-Middleware importieren


const router = express.Router();

// 📩 Nodemailer Setup für E-Mails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// 📝 **User Registrierung**
router.post('/register/user', async (req, res) => {
    const { username, password, role = 'user', accessibilityOptions = [] } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich' });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Benutzername bereits vergeben' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword, role, accessibilityOptions });
        await user.save();

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            message: 'Benutzer erfolgreich erstellt',
            token,
            user: { id: user._id, username: user.username, role, accessibilityOptions }
        });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers', error: error.message });
    }
});

// 🔑 **Login**
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        if (!username || !password) {
            return res.status(400).json({ message: 'Benutzername und Passwort sind erforderlich' });
        }

        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'Benutzer nicht gefunden' });

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(400).json({ message: 'Ungültige Zugangsdaten' });

        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login erfolgreich',
            token,
            user: { id: user._id, username: user.username, role: user.role, accessibilityOptions: user.accessibilityOptions }
        });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Login', error: error.message });
    }
});

// 🎭 **Event Registrierung (nur für Organisatoren)**
router.post('/register/event', protect, authenticateOrganizer, async (req, res) => {
    const {
        title, description, date, time, location, lat, lon, eventType,
        accessibilityOptions = {}, publicTransportProximity = false,
        wcAccessible = false, elevatorAccessible = false, languageOptions = []
    } = req.body;

    try {
        if (!title || !description || !date || !location || lat == null || lon == null || !eventType) {
            return res.status(400).json({ message: 'Alle erforderlichen Felder müssen ausgefüllt werden' });
        }

        // 📆 Event-Datum validieren & formatieren
        let eventDate = time ? new Date(`${date}T${time}:00`) : new Date(date);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({ message: 'Ungültiges Datum' });
        }

        const newEvent = new Event({
            title, description, date: eventDate, location, lat, lon, eventType,
            accessibilityOptions, publicTransportProximity, wcAccessible,
            elevatorAccessible, languageOptions
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event erfolgreich registriert', event: newEvent });
    } catch (error) {
        console.error('Fehler beim Erstellen des Events:', error);
        res.status(500).json({ message: 'Fehler beim Speichern des Events', error: error.message });
    }
});

export function authenticateOrganizer(req, res, next) {
    if (req.user && req.user.role === 'organizer') {
        return next();
    }
    return res.status(403).json({ message: 'Zugriff verweigert. Nur für Organisatoren.' });
};
