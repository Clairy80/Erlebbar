import express from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createEvent); // Geschützt: Event erstellen
router.get('/', getAllEvents); // Alle Events abrufen
router.get('/:id', getEventById); // Einzelnes Event abrufen
router.put('/:id', protect, updateEvent); // Geschützt: Event aktualisieren
router.delete('/:id', protect, deleteEvent); // Geschützt: Event löschen

export default router;
