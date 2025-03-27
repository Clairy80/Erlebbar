import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  verifyEmail,
  getSavedEvents,
} from '../controllers/userController.js';

import { protect, verifyEmail as requireVerifiedEmail } from '../middleware/authMiddleware.js';
import { saveEventToUser } from '../controllers/userController.js';


const router = express.Router();

// 👤 Registrierung
router.post('/register', registerUser);

// 🔐 Login
router.post('/login', loginUser);

// 📬 E-Mail-Verifizierung (z. B. mit Token aus E-Mail-Link)
router.post('/verify-email', verifyEmail);

// 🙋‍♀️ Geschützter Profil-Endpunkt
router.get('/profile', protect, requireVerifiedEmail, getUserProfile);

// 📌 Event speichern (geschützt)
router.put('/save-event/:eventId', protect, requireVerifiedEmail, saveEventToUser);

// z. B. in userRoutes.js
router.get('/saved-events', protect, getSavedEvents);




export default router;
