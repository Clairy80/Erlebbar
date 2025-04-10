import express from 'express';
import {
  updateRating,
  createRating,
  getRatingsForEvent,
  getRatingsForLocation,
  deleteRating,
  deleteRatingByEvent,
} from '../controllers/ratingController.js';

import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ⭐ Bewertung erstellen (selten genutzt – eher PUT verwenden)
router.post('/', protect, createRating);

// 🔁 Bewertung erstellen oder aktualisieren (Standardweg)
router.put('/:eventId', protect, updateRating);

// 🗑 Bewertung löschen über Rating-ID
router.delete('/by-id/:ratingId', protect, deleteRating);

// 🧹 Bewertung zu Event und eingeloggtem Nutzer löschen
router.delete('/by-event/:eventId', protect, deleteRatingByEvent);

// 📋 Bewertungen zu einem Event abrufen
router.get('/event/:eventId', getRatingsForEvent);

// 📋 Bewertungen zu einer Location abrufen
router.get('/location/:locationId', getRatingsForLocation);

export default router;
