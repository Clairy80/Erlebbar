import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Middleware zum Überprüfen, ob der Benutzer ein gültiges Token hat
export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Kein Token, Zugriff verweigert' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Speichert das gesamte Token-Objekt für spätere Nutzung
    next();
  } catch (error) {
    res.status(401).json({ message: 'Ungültiges Token' });
  }
};

// Middleware zum Überprüfen, ob der Benutzer verifiziert ist
export const verifyEmail = (req, res, next) => {
  if (!req.user || !req.user.isVerified) {
    return res.status(403).json({ message: 'E-Mail nicht verifiziert' });
  }
  next();
};

// Middleware für Veranstalter (Organizer)
export const authenticateOrganizer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Kein Token, bitte anmelden.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isOrganizer) {
      return res.status(403).json({ message: 'Kein Veranstalter-Account' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Ungültiges Token' });
  }
};
