import express from 'express';
import { 
  createLocation, 
  getAllLocations, 
  getLocationById, 
  updateLocation, 
  deleteLocation 
} from '../controllers/locationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();



// 📍 **Neue Location erstellen (nur für eingeloggte User)**
router.post('/', protect, createLocation);

// 📍 **Alle Locations abrufen (für die Map)**
router.get('/', getAllLocations);

// 📍 **Eine einzelne Location abrufen**
router.get('/:id', getLocationById);

// 📍 **Location aktualisieren (nur Ersteller/Admin)**
router.put('/:id', protect, updateLocation);

// 📍 **Location löschen (nur Ersteller/Admin)**
router.delete('/:id', protect, deleteLocation);

export default router;
