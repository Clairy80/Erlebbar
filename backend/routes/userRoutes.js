import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  saveEventToUser,
  getSavedEvents,
  unsaveEventFromUser 
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 👤 Registrierung
router.post('/register', registerUser);

// 🔐 Login
router.post('/login', loginUser);

// 📜 Benutzerprofil abrufen (geschützt)
router.get('/profile', protect, getUserProfile);

// 💾 Event speichern (geschützt)
router.put('/save-event/:eventId', protect, saveEventToUser);

// 📤 Gespeicherte Events abrufen (geschützt)
router.get('/saved-events', protect, getSavedEvents);

router.delete('/unsave-event/:eventId', protect, unsaveEventFromUser);

export default router;
