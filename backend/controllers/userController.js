import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// 🔑 Token generieren
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

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

    // 🆕 Benutzer erstellen
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: 'Fehler beim Erstellen des Benutzers' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔑 **Benutzer-Login**
export const loginUser = async (req, res) => {
  const { username, password } = req.body;  

  try {
    // ❌ Prüfen, ob alle Felder ausgefüllt sind
    if (!username || !password) {
      return res.status(400).json({ message: 'Bitte Benutzername und Passwort eingeben' });
    }

    const user = await User.findOne({ username });

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user.id,
        username: user.username,
        email: user.email,
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Ungültige Anmeldeinformationen' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔍 **Benutzerprofil abrufen (geschützt)**
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Passwort nicht senden

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
