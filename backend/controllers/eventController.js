import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// 🟢 **Event erstellen (nur für Organisatoren)**
export const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, time, location, eventType, accessibilityOptions } = req.body;

    // ❌ **Überprüfen, ob der Benutzer eingeloggt ist**
    if (!req.user) {
        return res.status(401).json({ message: 'Nicht autorisiert. Bitte einloggen!' });
    }

    // ❌ **Überprüfen, ob der Benutzer Organisator ist**
    if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Nur Organisatoren dürfen Events erstellen!' });
    }

    // ✅ **Organisator korrekt setzen**
    const organizerId = req.user._id;
    if (!organizerId) {
        return res.status(400).json({ message: 'Organizer ID fehlt!' });
    }

    let lat = null;
    let lon = null;

    // 🌍 Falls Location vorhanden, versuche, Koordinaten zu ermitteln
    if (location) {
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
            const geoData = await geoRes.json();
            
            if (geoData && geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
            }
        } catch (error) {
            console.error("❌ Fehler beim Geocoding:", error);
        }
    }

    const event = await Event.create({
        organizer: organizerId, // Organisator wird korrekt gesetzt
        title: title.trim(),
        description: description?.trim() || "",
        date,
        time,
        location: location.trim(),
        lat,
        lon,
        eventType: eventType || 'default',
        accessibilityOptions: accessibilityOptions || [],
    });

    res.status(201).json({ message: "✅ Event erfolgreich erstellt!", event });
});

// 🔵 **Alle Events abrufen**
export const getAllEvents = asyncHandler(async (req, res) => {
    console.log("🔍 getAllEvents wurde aufgerufen!");
    const events = await Event.find({}).populate("organizer", "username email");
    console.log("📜 Events aus MongoDB:", events);
    res.status(200).json(events);
});

// 🟣 **Ein Event per ID abrufen**
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id).populate("organizer", "username email");

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
        return res.status(404).json({ message: 'Event nicht gefunden' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Nicht autorisiert, um dieses Event zu bearbeiten' });
    }

    let lat = event.lat;
    let lon = event.lon;

    // Falls die Location geändert wird, neue Koordinaten abrufen
    if (req.body.location && req.body.location !== event.location) {
        try {
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(req.body.location)}`);
            const geoData = await geoRes.json();

            if (geoData && geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
            }
        } catch (error) {
            console.error("❌ Fehler beim Geocoding:", error);
        }
    }

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
    res.status(200).json({ message: "✅ Event erfolgreich aktualisiert!", event: updatedEvent });
});

// 🔴 **Event löschen (nur Ersteller/Admin)**
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (!event) {
        return res.status(404).json({ message: 'Event nicht gefunden' });
    }

    if (event.organizer.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Nicht autorisiert, um dieses Event zu löschen' });
    }

    await event.deleteOne();
    res.status(200).json({ message: '✅ Event erfolgreich gelöscht!' });
});
