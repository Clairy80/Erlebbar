import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

dotenv.config();

// 🛡 Authentifizierung prüfen
export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer')) {
    console.warn("⚠ Kein `Authorization`-Header erhalten.");
    return res.status(401).json({ message: 'Nicht autorisiert: Kein Token bereitgestellt.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.warn("❌ Benutzer nicht gefunden.");
      return res.status(401).json({ message: 'Nicht autorisiert: Benutzer existiert nicht mehr.' });
    }

    req.user = user;
    console.log(`✅ Authentifizierter Benutzer: ${user.username}`);
    next();
  } catch (error) {
    console.error("❌ Token-Fehler:", error);
    return res.status(401).json({ message: 'Nicht autorisiert: Ungültiges oder abgelaufenes Token.' });
  }
});

// 📩 Verifizierung der E-Mail
export const verifyEmail = asyncHandler(async (req, res, next) => {
  if (!req.user?.isVerified) {
    console.warn(`⚠ E-Mail nicht verifiziert: ${req.user?.email}`);
    return res.status(403).json({ message: 'E-Mail nicht verifiziert. Bitte bestätige deine E-Mail-Adresse.' });
  }

  console.log(`✅ E-Mail ist verifiziert: ${req.user.email}`);
  next();
});

// 🎭 Rolle "organizer" prüfen
export const authenticateOrganizer = asyncHandler(async (req, res, next) => {
  if (req.user?.role !== 'organizer') {
    console.warn(`❌ Kein Veranstalter: ${req.user?.username} (Rolle: ${req.user?.role})`);
    return res.status(403).json({ message: 'Nur Veranstalter dürfen Events erstellen oder bearbeiten.' });
  }

  console.log(`✅ Veranstalter-Check bestanden: ${req.user.username}`);
  next();
});

// ♿ Barrierefreiheitspflicht für Offline-Events
export const checkAccessibilityForOfflineEvent = asyncHandler(async (req, res, next) => {
  const { isOnline, accessibilityOptions } = req.body;

  if (!isOnline && (!accessibilityOptions || accessibilityOptions.length === 0)) {
    console.warn("❌ Barrierefreiheit fehlt bei Offline-Event");
    return res.status(400).json({
      message: 'Barrierefreiheit ist bei Offline-Events erforderlich. Bitte wähle mindestens eine Option aus.'
    });
  }

  next();
});
