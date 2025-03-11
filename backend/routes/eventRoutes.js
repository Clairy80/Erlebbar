import express from 'express';
import { createEvent, getAllEvents, getEventById, updateEvent, deleteEvent } from '../controllers/eventController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📌 **Event-Routen**
router.post('/', protect, createEvent); // ✅ Event erstellen (nur für eingeloggte Organisatoren)
router.get('/', getAllEvents); // ✅ Alle Events abrufen
router.get('/:id', getEventById); // ✅ Einzelnes Event abrufen
router.put('/:id', protect, updateEvent); // ✅ Event aktualisieren (nur Organisator)
router.delete('/:id', protect, deleteEvent); // ✅ Event löschen (nur Organisator)

// 🔥 **Fix: Named Export für eventRoutes**
export default router;
