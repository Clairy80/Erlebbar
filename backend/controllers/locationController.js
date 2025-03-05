import Location from '../models/Location.js';

// 🔹 Neue Location erstellen (nur für eingeloggte & verifizierte User)
export const createLocation = async (req, res) => {
  try {
    const { name, description, address, coordinates, accessibilityOptions } = req.body;

    if (!name || !address || !coordinates) {
      return res.status(400).json({ message: 'Name, Adresse und Koordinaten sind erforderlich.' });
    }

    const location = new Location({
      name,
      description,
      address,
      coordinates,
      accessibilityOptions,
      createdBy: req.user.id, // Verknüpfung mit User
    });

    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen der Location', error: error.message });
  }
};

// 🔹 Alle Locations abrufen (für die Map)
export const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.find();
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Locations', error: error.message });
  }
};

// 🔹 Eine einzelne Location abrufen
export const getLocationById = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location nicht gefunden' });
    }
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Location', error: error.message });
  }
};

// 🔹 Eine Location bearbeiten (nur Ersteller/Admin)
export const updateLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location nicht gefunden' });
    }

    // Check, ob der User der Ersteller ist oder Admin
    if (location.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Nicht autorisiert' });
    }

    const { name, description, address, coordinates, accessibilityOptions } = req.body;
    location.name = name || location.name;
    location.description = description || location.description;
    location.address = address || location.address;
    location.coordinates = coordinates || location.coordinates;
    location.accessibilityOptions = accessibilityOptions || location.accessibilityOptions;

    await location.save();
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Bearbeiten der Location', error: error.message });
  }
};

// 🔹 Eine Location löschen (nur Ersteller/Admin)
export const deleteLocation = async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location nicht gefunden' });
    }

    // Check, ob der User der Ersteller ist oder Admin
    if (location.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Nicht autorisiert' });
    }

    await location.deleteOne();
    res.json({ message: 'Location erfolgreich gelöscht' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Löschen der Location', error: error.message });
  }
};
