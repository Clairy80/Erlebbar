import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// 🟢 **Event erstellen (nur für eingeloggte User)**
export const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, time, location, eventType, accessibilityOptions } = req.body;

    if (!title || !date || !time || !location) {
        res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen: title, date, time, location!' });
        return;
    }

    // 🔍 Adresse in Koordinaten umwandeln (Geocoding mit OpenStreetMap)
    const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
    const geoData = await geoRes.json();

    if (!geoData || geoData.length === 0) {
        res.status(400).json({ message: 'Adresse nicht gefunden' });
        return;
    }

    const lat = parseFloat(geoData[0].lat);
    const lon = parseFloat(geoData[0].lon);

    // 🌍 Event mit Koordinaten speichern
    const event = await Event.create({
        title: title.trim(),
        description: description?.trim() || "",
        date,
        time,
        location: location.trim(),
        lat,
        lon,
        eventType: eventType || 'default',
        accessibilityOptions: accessibilityOptions || [],
        createdBy: req.user._id, // 🔒 Der eingeloggte User wird als Ersteller gespeichert
    });

    res.status(201).json(event);
});

// 🔵 **Alle Events abrufen**
export const getAllEvents = asyncHandler(async (req, res) => {
    console.log("🔍 getAllEvents wurde aufgerufen!");
    const events = await Event.find({});
    console.log("📜 Events aus MongoDB:", events);
    res.status(200).json(events);
});

// 🟣 **Ein Event per ID abrufen**
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        res.status(200).json(event);
    } else {
        res.status(404).json({ message: 'Event nicht gefunden' });
    }
});

// 🟠 **Event aktualisieren (nur Ersteller/Admin)**
export const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404).json({ message: 'Event nicht gefunden' });
        return;
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Nicht autorisiert, um dieses Event zu bearbeiten' });
        return;
    }

    // Falls die Location geändert wird, neue Koordinaten abrufen
    let lat = event.lat;
    let lon = event.lon;
    
    if (req.body.location && req.body.location !== event.location) {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.location)}`);
        const geoData = await geoRes.json();

        if (geoData && geoData.length > 0) {
            lat = parseFloat(geoData[0].lat);
            lon = parseFloat(geoData[0].lon);
        }
    }

    // Aktualisierung mit Validierung
    event.title = req.body.title?.trim() || event.title;
    event.description = req.body.description?.trim() || event.description;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.location = req.body.location?.trim() || event.location;
    event.lat = lat;
    event.lon = lon;
    event.eventType = req.body.eventType || event.eventType;
    event.accessibilityOptions = req.body.accessibilityOptions || event.accessibilityOptions;

    const updatedEvent = await event.save();
    res.status(200).json(updatedEvent);
});

// 🔴 **Event löschen (nur Ersteller/Admin)**
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        res.status(404).json({ message: 'Event nicht gefunden' });
        return;
    }

    if (event.createdBy.toString() !== req.user._id.toString()) {
        res.status(403).json({ message: 'Nicht autorisiert, um dieses Event zu löschen' });
        return;
    }

    await event.deleteOne();
    res.status(200).json({ message: 'Event erfolgreich gelöscht' });
});
