import express from 'express';
import {
  createLocation,
  getAllLocations,
  getLocationById,
  updateLocation,
  deleteLocation
} from '../controllers/locationController.js';
import { protect, verifyEmail } from '../middleware/authMiddleware.js'; 

const router = express.Router();

// 🔹 Neue Location erstellen (nur eingeloggte und verifizierte User)
router.post('/', protect, verifyEmail, createLocation);

// 🔹 Alle Locations abrufen (z.B. für die Map)
router.get('/', getAllLocations);

// 🔹 Eine einzelne Location abrufen
router.get('/:id', getLocationById);

// 🔹 Eine Location bearbeiten (nur Ersteller oder Admins)
router.put('/:id', protect, verifyEmail, updateLocation);

// 🔹 Eine Location löschen (nur Ersteller oder Admins)
router.delete('/:id', protect, verifyEmail, deleteLocation);

export default router;
