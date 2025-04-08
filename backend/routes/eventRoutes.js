import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

import {
  createRating, // optional
  updateRating,
  deleteRatingByEvent,
} from '../controllers/ratingController.js';

import { protect, authenticateOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();


// 📌 Event erstellen (nur für eingeloggte Organisatoren)
router.post('/', protect, authenticateOrganizer, createEvent);

// 📌 Alle Events abrufen (öffentlich für Map)
router.get('/', getAllEvents);

// 📌 Einzelnes Event abrufen
router.get('/:id', getEventById);

// 📌 Event aktualisieren (nur für Organisatoren)
router.put('/:id', protect, authenticateOrganizer, updateEvent);

// 📌 Event löschen (nur für Organisatoren)
router.delete('/:id', protect, authenticateOrganizer, deleteEvent);

// ⭐ Bewertung erstellen oder aktualisieren
router.put('/:eventId/rate', protect, updateRating); // DAS ist dein PUT!

// ❌ Bewertung löschen (optional)
router.delete('/:eventId/rate', protect, deleteRatingByEvent);

export default router;
