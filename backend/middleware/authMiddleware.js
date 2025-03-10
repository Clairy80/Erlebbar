import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

dotenv.config();

// 🔒 **Middleware: User-Authentifizierung**
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 🛠 Token aus `Authorization`-Header auslesen
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      req.user = await User.findById(decoded.id).select('-password'); // 🚀 Kein Passwort in `req.user`

      if (!req.user) {
        return res.status(401).json({ message: 'Nicht autorisiert: Benutzer existiert nicht mehr.' });
      }

      console.log("✅ Authentifizierter User:", req.user.username);
      next();
    } catch (error) {
      console.error("❌ Token-Fehler:", error);
      res.status(401).json({ message: 'Nicht autorisiert: Ungültiges Token.' });
    }
  } else {
    res.status(401).json({ message: 'Nicht autorisiert: Kein Token vorhanden.' });
  }
});

// 📩 **Middleware: E-Mail-Verifizierung prüfen**
export const verifyEmail = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Nicht autorisiert: Kein User-Token gefunden.' });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'E-Mail nicht verifiziert. Bitte bestätige deine E-Mail-Adresse.' });
  }

  console.log("✅ E-Mail ist verifiziert:", req.user.email);
  next();
});

// 🎭 **Middleware: Veranstalter-Authentifizierung**
export const authenticateOrganizer = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(403).json({ message: 'Nicht autorisiert: Kein User-Token gefunden.' });
  }

  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Nur Veranstalter können Events erstellen oder bearbeiten.' });
  }

  console.log("✅ Veranstalter-Check bestanden:", req.user.username);
  next();
});
