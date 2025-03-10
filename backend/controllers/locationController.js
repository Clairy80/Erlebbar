import asyncHandler from 'express-async-handler';
import Location from '../models/Location.js';

// 🔹 **Neue Location erstellen (nur für eingeloggte User)**
export const createLocation = asyncHandler(async (req, res) => {
  const { name, description, address, accessibilityOptions } = req.body;

  if (!name || !address) {
    return res.status(400).json({ message: 'Name und Adresse sind erforderlich.' });
  }

  // 🔍 **Adresse in Koordinaten umwandeln (Geocoding mit OpenStreetMap)**
  const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`);
  const geoData = await geoRes.json();

  if (!geoData || geoData.length === 0) {
    return res.status(400).json({ message: 'Adresse nicht gefunden.' });
  }

  const lat = parseFloat(geoData[0].lat);
  const lon = parseFloat(geoData[0].lon);

  // 📌 **Neue Location speichern**
  const location = new Location({
    name,
    description: description?.trim() || "",
    address,
    lat,
    lon,
    accessibilityOptions: accessibilityOptions || [],
    createdBy: req.user._id, // 🔒 User-Zuweisung
  });

  await location.save();
  res.status(201).json(location);
});

// 🔹 **Alle Locations abrufen (für die Map)**
export const getAllLocations = asyncHandler(async (req, res) => {
  console.log("🔍 getAllLocations wurde aufgerufen!");
  const locations = await Location.find({});
  console.log("📜 Locations aus MongoDB:", locations);
  res.status(200).json(locations);
});

// 🔹 **Eine einzelne Location abrufen**
export const getLocationById = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location nicht gefunden' });
  }

  res.json(location);
});

// 🔹 **Location aktualisieren (nur Ersteller/Admin)**
export const updateLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location nicht gefunden' });
  }

  // 🔒 **Check, ob der User der Ersteller oder Admin ist**
  if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nicht autorisiert' });
  }

  let lat = location.lat;
  let lon = location.lon;

  // Falls die Adresse geändert wird, neue Koordinaten abrufen
  if (req.body.address && req.body.address !== location.address) {
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.address)}`);
    const geoData = await geoRes.json();

    if (geoData && geoData.length > 0) {
      lat = parseFloat(geoData[0].lat);
      lon = parseFloat(geoData[0].lon);
    }
  }

  // 🔄 **Daten aktualisieren**
  location.name = req.body.name?.trim() || location.name;
  location.description = req.body.description?.trim() || location.description;
  location.address = req.body.address?.trim() || location.address;
  location.lat = lat;
  location.lon = lon;
  location.accessibilityOptions = req.body.accessibilityOptions || location.accessibilityOptions;

  const updatedLocation = await location.save();
  res.status(200).json(updatedLocation);
});

// 🔹 **Location löschen (nur Ersteller/Admin)**
export const deleteLocation = asyncHandler(async (req, res) => {
  const location = await Location.findById(req.params.id);

  if (!location) {
    return res.status(404).json({ message: 'Location nicht gefunden' });
  }

  // 🔒 **Check, ob der User der Ersteller oder Admin ist**
  if (location.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Nicht autorisiert' });
  }

  await location.deleteOne();
  res.status(200).json({ message: 'Location erfolgreich gelöscht' });
});
