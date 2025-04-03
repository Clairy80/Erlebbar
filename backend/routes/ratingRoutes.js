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
router.post('/', protect, async (req, res) => {
  try {
    await createRating(req, res);
  } catch (error) {
    console.error("❌ Fehler beim Erstellen der Bewertung:", error);
    res.status(500).json({ message: 'Fehler beim Erstellen der Bewertung.' });
  }
});

// 📥 Bewertungen für ein bestimmtes Event abrufen
router.get('/event/:eventId', async (req, res) => {
  try {
    await getRatingsForEvent(req, res);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Bewertungen für das Event:", error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Bewertungen für das Event.' });
  }
});

// 📥 Bewertungen für eine bestimmte Location abrufen
router.get('/location/:locationId', async (req, res) => {
  try {
    await getRatingsForLocation(req, res);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Bewertungen für die Location:", error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Bewertungen für die Location.' });
  }
});

// ❌ Bewertung löschen
router.delete('/:ratingId', protect, async (req, res) => {
  try {
    await deleteRating(req, res);
  } catch (error) {
    console.error("❌ Fehler beim Löschen der Bewertung:", error);
    res.status(500).json({ message: 'Fehler beim Löschen der Bewertung.' });
  }
});

export default router;
