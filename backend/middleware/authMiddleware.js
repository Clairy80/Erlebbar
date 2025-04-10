import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

// 🛡 Authentifizierung prüfen
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({ message: 'Benutzer nicht gefunden' });
      }

      req.user = user;
      console.log(`✅ Authentifizierter Benutzer: ${user.username}`);
      return next();
    } catch (error) {
      console.error('❌ Fehler beim Token:', error);
      return res.status(401).json({ message: 'Token ungültig oder abgelaufen' });
    }
  }

  return res.status(401).json({ message: 'Kein Token vorhanden' });
});

// 📩 Verifizierungs-Check (falls du den später nutzen willst)
const verifyEmail = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Nicht autorisiert: Kein Benutzer gefunden.' });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ message: 'E-Mail nicht verifiziert. Bitte E-Mail bestätigen.' });
  }

  next();
});

// 🎭 Veranstalter-Check
const authenticateOrganizer = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Nicht autorisiert: Kein Benutzerobjekt.' });
  }

  if (req.user.role !== 'organizer') {
    return res.status(403).json({ message: 'Nur Veranstalter dürfen diese Aktion durchführen.' });
  }

  next();
});

// ♿ Pflichtprüfung für Barrierefreiheit
const checkAccessibilityForOfflineEvent = asyncHandler(async (req, res, next) => {
  const { isOnline, accessibilityOptions, needsCompanion } = req.body;

  if (!isOnline && (!accessibilityOptions || accessibilityOptions.length === 0) && !needsCompanion) {
    return res.status(400).json({
      message: 'Offline-Events müssen entweder barrierefrei sein oder eine Begleitperson erlauben.'
    });
  }

  next();
});

// ✅ Alles exportieren
export {
  protect,
  verifyEmail,
  authenticateOrganizer,
  checkAccessibilityForOfflineEvent,
};
