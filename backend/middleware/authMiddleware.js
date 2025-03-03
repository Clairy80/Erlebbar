import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';



dotenv.config();

export const authenticateOrganizer = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ msg: 'Kein Token gefunden, bitte anmelden.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.organizerId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Ungültiges Token.' });
  }
};

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Kein Token, Zugang verweigert' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token ist ungültig' });
  }
};

export default (req, res, next) => {
  next();
};