import express from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';

import { protect, authenticateOrganizer } from '../middleware/authMiddleware.js';

const router = express.Router();

// 📍 Neue Location erstellen (nur für eingeloggte Veranstalter)
router.post('/', protect, authenticateOrganizer, createLocation);

// 📍 Alle Locations abrufen (öffentlich)
router.get('/', getAllLocations);

// 📍 Einzelne Location abrufen
router.get('/:id', getLocationById);

// 📍 Location aktualisieren (nur Veranstalter)
router.put('/:id', protect, authenticateOrganizer, updateLocation);

// 📍 Location löschen (nur Veranstalter)
router.delete('/:id', protect, authenticateOrganizer, deleteLocation);

export default router;
