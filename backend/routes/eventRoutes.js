import express from 'express';
import {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';

import { protect, authenticateOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 Event erstellen (nur für eingeloggte Organisatoren)
router.post('/', protect, authenticateOrganizer, createEvent);

// 📌 Alle Events abrufen (öffentlich für Map etc.)
router.get('/', getAllEvents);

// 📌 Einzelnes Event abrufen
router.get('/:id', getEventById);

// 📌 Event aktualisieren (nur für Ersteller/Admin)
router.put('/:id', protect, authenticateOrganizer, updateEvent);

// 📌 Event löschen (nur für Ersteller/Admin)
router.delete('/:id', protect, authenticateOrganizer, deleteEvent);

export default router;
