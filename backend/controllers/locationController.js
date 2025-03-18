import asyncHandler from 'express-async-handler';
import Location from '../models/Location.js';

// 📍 **Neue Location erstellen**
export const createLocation = asyncHandler(async (req, res) => {
  const { name, description, street, number, zip, city, country, category, customCategory, accessibilityOptions } = req.body;

  if (!name || !street || !number || !zip || !city || !country || !category) {
    return res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen!' });
  }

  try {
    console.log(`📍 Geolocation für: ${street} ${number}, ${zip} ${city}, ${country}`);
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${street} ${number}, ${zip} ${city}, ${country}`)}`);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
      return res.status(400).json({ message: 'Adresse nicht gefunden, bitte überprüfen.' });
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);
    console.log(`✅ Standort erfolgreich ermittelt: ${lat}, ${lon}`);

    const location = await Location.create({
      name,
      description: description?.trim() || "",
      address: { street, number, zip, city, country },
      geo: { latitude: lat, longitude: lon },
      category,
      customCategory: category === 'Andere' ? customCategory : null,
      accessibility: accessibilityOptions || {},
      addedBy: req.user._id
    });

    res.status(201).json({ message: "✅ Location erfolgreich erstellt!", location });

  } catch (error) {
    console.error("❌ Fehler beim Geocoding:", error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Standortdaten.' });
  }
});

// 🔍 **Alle Locations abrufen**
export const getAllLocations = asyncHandler(async (req, res) => {
  try {
    const locations = await Location.find({});
    res.status(200).json(locations);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Locations:", error);
    res.status(500).json({ message: "Serverfehler: Locations konnten nicht geladen werden." });
  }
});

// 🔎 **Eine Location per ID abrufen**
export const getLocationById = asyncHandler(async (req, res) => {
  try {
    const location = await Location.findById(req.params.id);
    if (!location) {
      return res.status(404).json({ message: 'Location nicht gefunden' });
    }
    res.json(location);
  } catch (error) {
    console.error("❌ Fehler beim Abrufen der Location:", error);
    res.status(500).json({ message: "Serverfehler: Location konnte nicht geladen werden." });
  }
});

// 🛠 **Location aktualisieren (nur Ersteller/Admin)**
export const updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location nicht gefunden' });
  }

  if (location.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nicht autorisiert' });
  }

  location.name = req.body.name?.trim() || location.name;
  location.description = req.body.description?.trim() || location.description;
  location.address.street = req.body.street?.trim() || location.address.street;
  location.address.number = req.body.number?.trim() || location.address.number;
  location.address.zip = req.body.zip?.trim() || location.address.zip;
  location.address.city = req.body.city?.trim() || location.address.city;
  location.address.country = req.body.country?.trim() || location.address.country;
  location.category = req.body.category || location.category;
  location.customCategory = req.body.category === 'Andere' ? req.body.customCategory : null;
  location.accessibility = req.body.accessibilityOptions || location.accessibility;

  const updatedLocation = await location.save();
  res.status(200).json({ message: "✅ Location erfolgreich aktualisiert!", location: updatedLocation });
});

// ❌ **Location löschen (nur Ersteller/Admin)**
export const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location nicht gefunden' });
  }

  if (location.addedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nicht autorisiert' });
  }

  await location.deleteOne();
  res.status(200).json({ message: '✅ Location erfolgreich gelöscht!' });
});


