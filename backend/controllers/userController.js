import User from '../models/User.js';
import Event from '../models/Event.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import asyncHandler from 'express-async-handler';

// 🔑 Token generieren
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 📝 Registrierung + Event-Erstellung für Veranstalter
export const registerUser = asyncHandler(async (req, res) => {
  const {
    username, email, password, role,
    organization, address,
    eventTitle, eventDescription, eventDate, eventTime,
    accessibilityOptions
  } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen.' });
  }

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    return res.status(400).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    username,
    email,
    password: hashedPassword,
    role: role || 'user',
    isVerified: true,
  });

  // 📅 Event automatisch anlegen bei Veranstaltern
  if (role === 'organizer' && address && eventTitle && eventDate && eventTime) {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
    const geoData = await geoRes.json();

    if (!geoData.length) {
      return res.status(400).json({ message: 'Adresse konnte nicht geocodiert werden.' });
    }

    const { lat, lon, display_name } = geoData[0];
    const addressParts = display_name.split(',').map(p => p.trim());

    const city = addressParts.find(p => p.match(/\d{5}/)) || 'Unbekannt';
    const country = addressParts[addressParts.length - 1] || 'Deutschland';

    await Event.create({
      organizer: user._id,
      title: eventTitle.trim(),
      description: eventDescription || "",
      date: eventDate,
      time: eventTime,
      isOnline: false,
      street: address,
      postalCode: "00000",
      city,
      country,
      lat: parseFloat(lat),
      lon: parseFloat(lon),
      contactEmail: email,
      contactPhone: "+49 1234567890",
      accessibilityOptions,
      suitableFor: "Alle",
      needsCompanion: false
    });
  }

  const token = generateToken(user._id);

  res.status(201).json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
    message: 'Registrierung erfolgreich!',
  });
});

// 🔐 Login mit E-Mail ODER Benutzername
export const loginUser = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if (!identifier || !password) {
    return res.status(400).json({ message: 'Bitte Benutzername oder E-Mail und Passwort eingeben.' });
  }

  const user = await User.findOne({
    $or: [
      { username: identifier },
      { email: identifier.toLowerCase() }
    ]
  });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
  }

  const token = generateToken(user._id);

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    token,
    message: 'Login erfolgreich',
  });
});

// 📋 Profil abrufen
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)
    .select("-password")
    .populate("savedEvents");

  if (!user) {
    return res.status(404).json({ message: "Benutzer nicht gefunden." });
  }

  res.json(user);
});

// 💾 Event speichern
export const saveEventToUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;

  if (!eventId) return res.status(400).json({ message: 'Kein Event angegeben.' });

  const eventExists = await Event.findById(eventId);
  if (!eventExists) return res.status(404).json({ message: 'Event nicht gefunden.' });

  if (!user.savedEvents.includes(eventId)) {
    user.savedEvents.push(eventId);
    await user.save();
  }

  res.status(200).json({ message: '✅ Event gespeichert!', savedEvents: user.savedEvents });
});

// 📤 Gespeicherte Events abrufen
export const getSavedEvents = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id).populate('savedEvents');
  if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden.' });

  res.status(200).json(user.savedEvents);
});

// ❌ Event entfernen
export const unsaveEventFromUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  const eventId = req.params.eventId;

  if (!eventId) return res.status(400).json({ message: 'Kein Event angegeben.' });

  const originalLength = user.savedEvents.length;

  user.savedEvents = user.savedEvents.filter(
    (id) => id.toString() !== eventId.toString()
  );

  if (user.savedEvents.length === originalLength) {
    return res.status(404).json({ message: 'Event war nicht gespeichert.' });
  }

  await user.save();
  res.status(200).json({ message: '🗑️ Event entfernt', savedEvents: user.savedEvents });
});
