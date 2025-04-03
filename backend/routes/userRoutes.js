import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  getSavedEvents,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';
import { saveEventToUser } from '../controllers/userController.js';

const router = express.Router();

// 👤 Registrierung
router.post('/register', registerUser);

// 🔐 Login
router.post('/login', loginUser);

// 🙋‍♀️ Geschützter Profil-Endpunkt (nur für authentifizierte Benutzer)
router.get('/profile', protect, getUserProfile);

// 📌 Event speichern (geschützt) - nur für authentifizierte Benutzer
router.put('/save-event/:eventId', protect, saveEventToUser);

// 📤 Gespeicherte Events abrufen (geschützt)
router.get('/saved-events', protect, getSavedEvents);

export default router;
