import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
} from '../controllers/userController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 👤 Registrierung
router.post('/register', registerUser);

// 🔐 Login
router.post('/login', loginUser);

// 📜 Benutzerprofil abrufen (geschützt)
router.get('/profile', protect, getUserProfile); // Hier sollte /api/users/profile die Route für das Nutzerprofil sein



export default router;
