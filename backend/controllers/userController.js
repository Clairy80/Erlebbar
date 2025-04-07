import User from '../models/User.js';
import Event from '../models/Event.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

// 🔑 **Token generieren**
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 📝 **Benutzer-Registrierung**
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Bitte alle Felder ausfüllen.' });
  }

  // Überprüfen, ob der Benutzername oder die E-Mail bereits existieren
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
  }

  // Passwort verschlüsseln
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Erstelle den neuen Benutzer
  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || 'user', // Standardwert für Rolle ist 'user'
    isVerified: true,  // Benutzer sofort als verifiziert markieren (keine E-Mail-Verifizierung notwendig)
  });

  // JWT Token für den Benutzer erstellen
  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token, // Token wird zurückgegeben
    message: 'Registrierung erfolgreich! Du kannst dich jetzt anmelden.',
  });
});

// 🔑 **Benutzer-Login**
export const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if ((!email && !username) || !password) {
    return res.status(400).json({ message: 'Bitte Benutzername oder E-Mail und Passwort eingeben.' });
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
  }

  // Passwort überprüfen
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    token, // Token wird zurückgegeben
  });
});

// 🔍 **Benutzerprofil abrufen (geschützt)**
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
  }
  res.json(user);
});

// 📌 **Event speichern (geschützt)**
export const saveEventToUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  const eventId = req.params.eventId;
  if (!user.savedEvents.includes(eventId)) {
    user.savedEvents.push(eventId);
    await user.save();
  }

  res.status(200).json({ message: '✅ Event gespeichert!', savedEvents: user.savedEvents });
});

// 📤 **Gespeicherte Events abrufen**
export const getSavedEvents = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedEvents');

  if (!user) {
    return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
  }

  res.status(200).json(user.savedEvents);
});
