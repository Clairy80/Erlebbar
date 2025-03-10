import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

// 🔑 **Token generieren**
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 📩 **Nodemailer Transporter für E-Mail-Versand**
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// 📝 **Benutzer-Registrierung**
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // ❌ Überprüfen, ob alle Felder ausgefüllt sind
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Bitte alle Felder ausfüllen' });
    }

    // ❌ Prüfen, ob E-Mail oder Benutzername bereits existiert
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Benutzername oder E-Mail bereits vergeben' });
    }

    // 🔐 Passwort hashen
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 🆕 Benutzer erstellen (Standard: isVerified = false)
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false, // Erst nach E-Mail-Bestätigung auf true setzen
    });

    // 📧 **Verifizierungs-E-Mail senden**
    const verifyToken = generateToken(user._id);
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Bestätige deine E-Mail-Adresse',
      html: `<p>Hallo ${user.username},</p>
             <p>Bitte klicke auf den folgenden Link, um deine E-Mail zu bestätigen:</p>
             <a href="${verifyLink}" target="_blank">${verifyLink}</a>
             <p>Falls du dich nicht registriert hast, ignoriere diese Nachricht.</p>`,
    };

    await transporter.sendMail(mailOptions);
    console.log(`📩 Bestätigungs-E-Mail an ${user.email} gesendet.`);

    res.status(201).json({
      _id: user.id,
      username: user.username,
      email: user.email,
      message: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Verifizierung.',
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ **E-Mail-Bestätigung**
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Ungültiges Token oder Benutzer existiert nicht mehr.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'E-Mail wurde bereits bestätigt.' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'E-Mail erfolgreich verifiziert! Du kannst dich jetzt anmelden.' });
  } catch (error) {
    res.status(400).json({ message: 'Ungültiges oder abgelaufenes Token.' });
  }
};

// 🔑 **Benutzer-Login**
export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if ((!email && !username) || !password) {
      return res.status(400).json({ message: 'Bitte Benutzername oder E-Mail und Passwort eingeben' });
    }

    console.log("🔍 Login-Versuch mit:", { email, username });

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      console.log("❌ Benutzer nicht gefunden");
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
    }

    // 🛑 **Verhindern, dass nicht verifizierte Accounts sich anmelden**
    if (!user.isVerified) {
      return res.status(403).json({ message: 'E-Mail nicht verifiziert! Bitte überprüfe deine E-Mails.' });
    }

    console.log("✅ Benutzer gefunden:", user.email);

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      console.log("❌ Passwort stimmt nicht überein");
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
    }

    console.log("✅ Passwort korrekt! Login erfolgreich.");

    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error("❌ Fehler im Login:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 **Benutzerprofil abrufen (geschützt)**
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
