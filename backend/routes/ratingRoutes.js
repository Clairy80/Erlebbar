import express from 'express';
const router = express.Router();

// Beispiel-Route: Alle Bewertungen abrufen
router.get('/', (req, res) => {
  res.json({ message: 'Alle Ratings werden hier zurückgegeben' });
});

export default router;
