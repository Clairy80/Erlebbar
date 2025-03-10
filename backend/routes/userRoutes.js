import express from 'express';
import { registerUser, loginUser, verifyEmail, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 **Benutzer-Registrierung**
router.post('/register', registerUser);

// 🔑 **Benutzer-Login**
router.post('/login', loginUser);

// ✅ **E-Mail-Verifizierung**
router.get('/verify-email', verifyEmail);

// 🔒 **Benutzerprofil abrufen (geschützt)**
router.get('/profile', protect, getUserProfile);

export default router;
