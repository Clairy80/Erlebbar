import express from 'express';
import {
  createRating,
  getRatingsForEvent,
  getRatingsForLocation,
  deleteRating
} from '../controllers/ratingController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 🆕 Bewertung erstellen
router.post('/', protect, createRating);

// 📥 Bewertungen für ein bestimmtes Event abrufen
router.get('/event/:eventId', getRatingsForEvent);

// 📥 Bewertungen für eine bestimmte Location abrufen
router.get('/location/:locationId', getRatingsForLocation);

// ❌ Bewertung löschen
router.delete('/:ratingId', protect, deleteRating);

export default router;
