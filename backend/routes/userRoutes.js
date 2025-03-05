import express from 'express';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser); // Registrierung
router.post('/login', loginUser); // Login
router.get('/profile', protect, getUserProfile); // Geschützt: Nutzerprofil abrufen

export default router;
