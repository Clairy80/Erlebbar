import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

dotenv.config();

// 🛡 **Middleware: Authentifizierung prüfen**
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // ✅ **Token aus dem `Authorization`-Header auslesen**
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      if (!token) {
        console.warn("⚠ Kein Token vorhanden.");
        return res.status(401).json({ message: 'Nicht autorisiert: Kein Token gefunden.' });
      }

      // 🔑 **Token entschlüsseln**
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        console.warn("❌ Benutzer nicht gefunden.");
        return res.status(401).json({ message: 'Nicht autorisiert: Benutzer existiert nicht mehr.' });
      }

      console.log(`✅ Authentifizierter Benutzer: ${req.user.username}`);
      next();
    } catch (error) {
      console.error("❌ Token-Fehler:", error);
      return res.status(401).json({ message: 'Nicht autorisiert: Ungültiges oder abgelaufenes Token.' });
    }
  } else {
    console.warn("⚠ Kein `Authorization`-Header erhalten.");
    return res.status(401).json({ message: 'Nicht autorisiert: Kein Token bereitgestellt.' });
  }
});

// 📩 **Middleware: E-Mail-Verifizierung prüfen**
export const verifyEmail = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.warn("⚠ Kein User-Objekt in `req.user` gefunden.");
    return res.status(401).json({ message: 'Nicht autorisiert: Kein User-Token vorhanden.' });
  }

  if (!req.user.isVerified) {
    console.warn(`⚠ E-Mail nicht verifiziert: ${req.user.email}`);
    return res.status(403).json({ message: 'E-Mail nicht verifiziert. Bitte bestätige deine E-Mail-Adresse.' });
  }

  console.log(`✅ E-Mail ist verifiziert: ${req.user.email}`);
  next();
});

// 🎭 **Middleware: Veranstalter-Authentifizierung**
export const authenticateOrganizer = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    console.warn("⚠ Kein User-Objekt in `req.user` gefunden.");
    return res.status(403).json({ message: 'Nicht autorisiert: Kein User-Token gefunden.' });
  }

  if (req.user.role !== 'organizer') {
    console.warn(`❌ Benutzer ist kein Veranstalter: ${req.user.username} (Rolle: ${req.user.role})`);
    return res.status(403).json({ message: 'Nur Veranstalter dürfen Events erstellen oder bearbeiten.' });
  }

  console.log(`✅ Veranstalter-Check bestanden: ${req.user.username}`);
  next();
});
