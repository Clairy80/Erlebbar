import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Nodemailer Setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Registrierung (für User und Veranstalter)
router.post('/register', async (req, res) => {
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

// Passwort-Reset anfordern
router.post('/forgot-password', async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden' });

        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetToken = resetToken;
        user.resetTokenExpiry = Date.now() + 3600000; // 1 Stunde gültig
        await user.save();

        const resetUrl = `http://localhost:3000/reset-password?token=${resetToken}`;

        await transporter.sendMail({
            to: username,
            subject: 'Passwort zurücksetzen',
            html: `<p>Klicken Sie auf den folgenden Link, um Ihr Passwort zurückzusetzen:</p><p><a href="${resetUrl}">${resetUrl}</a></p>`
        });

        res.json({ message: 'E-Mail mit Passwort-Reset-Link gesendet' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Erstellen des Reset-Tokens', error });
    }
});

// Neues Passwort speichern
router.post('/reset-password', async (req, res) => {
    const { resetToken, newPassword } = req.body;
    try {
        const user = await User.findOne({ resetToken, resetTokenExpiry: { $gt: Date.now() } });
        if (!user) return res.status(400).json({ message: 'Token ungültig oder abgelaufen' });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetToken = undefined;
        user.resetTokenExpiry = undefined;
        await user.save();

        res.json({ message: 'Passwort erfolgreich geändert' });
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Zurücksetzen des Passworts', error });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Nutzer finden
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(400).json({ message: "Benutzer nicht gefunden" });
        }

        // Passwort prüfen
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({ message: "Ungültige Zugangsdaten" });
        }

        // JWT-Token generieren
        const token = jwt.sign(
            { id: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login erfolgreich",
            token,
            user: { id: user._id, username: user.username, role: user.role, accessibilityOptions: user.accessibilityOptions }
        });
    } catch (error) {
        res.status(500).json({ message: "Fehler beim Login", error: error.message });
    }
});

// Benutzerprofil abrufen
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Fehler beim Abrufen der Benutzerdaten', error });
    }
});

export default router;