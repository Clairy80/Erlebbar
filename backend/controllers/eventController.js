import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// 🟢 **Event erstellen (nur für Organisatoren)**
export const createEvent = asyncHandler(async (req, res) => {
    const {
        title, description, date, time, isOnline,
        street, postalCode, city, country, contactEmail, contactPhone,
        eventType, accessibilityOptions
    } = req.body;

    if (!title || !date || !time) {
        return res.status(400).json({ message: 'Bitte alle Pflichtfelder ausfüllen: Titel, Datum, Uhrzeit!' });
    }

    // ❌ **Überprüfen, ob der Benutzer eingeloggt ist**
    if (!req.user) {
        return res.status(401).json({ message: 'Nicht autorisiert. Bitte einloggen!' });
    }

    // ❌ **Überprüfen, ob der Benutzer Organisator ist**
    if (req.user.role !== 'organizer') {
        return res.status(403).json({ message: 'Nur Organisatoren dürfen Events erstellen!' });
    }

    let lat = null;
    let lon = null;

    // 📍 **Wenn das Event NICHT online ist, muss eine Adresse angegeben werden**
    if (!isOnline) {
        if (!street || !postalCode || !city || !country) {
            return res.status(400).json({ message: 'Adresse (Straße, PLZ, Stadt, Land) ist erforderlich für physische Events!' });
        }

        // 🌍 **Geolocation-Daten holen**
        try {
            console.log(`📍 Geolocation für: ${street}, ${postalCode} ${city}, ${country}`);
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${street}, ${postalCode} ${city}, ${country}`)}`);
            const geoData = await geoRes.json();

            if (geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
                console.log(`✅ Standort erfolgreich ermittelt: ${lat}, ${lon}`);
            } else {
                return res.status(400).json({ message: 'Adresse nicht gefunden, bitte überprüfen.' });
            }
        } catch (error) {
            console.error("❌ Fehler beim Geocoding:", error);
            return res.status(500).json({ message: 'Fehler beim Abrufen der Standortdaten.' });
        }
    }

    const event = await Event.create({
        organizer: req.user._id,
        title: title.trim(),
        description: description?.trim() || "",
        date,
        time,
        isOnline,
        street: isOnline ? null : street.trim(),
        postalCode: isOnline ? null : postalCode.trim(),
        city: isOnline ? null : city.trim(),
        country: isOnline ? "Deutschland" : country.trim(),
        lat,
        lon,
        contactEmail: contactEmail?.trim() || null,
        contactPhone: contactPhone?.trim() || null,
        eventType: eventType || 'default',
        accessibilityOptions: accessibilityOptions || [],
    });

    res.status(201).json({ message: "✅ Event erfolgreich erstellt!", event });
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

    // Falls die Adresse geändert wird, neue Koordinaten abrufen
    if (!event.isOnline && (req.body.street !== event.street || req.body.city !== event.city || req.body.postalCode !== event.postalCode)) {
        try {
            console.log(`📍 Neue Geolocation für: ${req.body.street}, ${req.body.postalCode} ${req.body.city}`);
            const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(`${req.body.street}, ${req.body.postalCode} ${req.body.city}`)}`);
            const geoData = await geoRes.json();

            if (geoData.length > 0) {
                lat = parseFloat(geoData[0].lat);
                lon = parseFloat(geoData[0].lon);
                console.log(`✅ Standort erfolgreich aktualisiert: ${lat}, ${lon}`);
            } else {
                return res.status(400).json({ message: 'Neue Adresse nicht gefunden, bitte überprüfen.' });
            }
        } catch (error) {
            console.error("❌ Fehler beim Geocoding:", error);
            return res.status(500).json({ message: 'Fehler beim Abrufen der Standortdaten.' });
        }
    }

    event.title = req.body.title?.trim() || event.title;
    event.description = req.body.description?.trim() || event.description;
    event.date = req.body.date || event.date;
    event.time = req.body.time || event.time;
    event.isOnline = req.body.isOnline ?? event.isOnline;
    event.street = req.body.street?.trim() || event.street;
    event.postalCode = req.body.postalCode?.trim() || event.postalCode;
    event.city = req.body.city?.trim() || event.city;
    event.country = req.body.country?.trim() || event.country;
    event.lat = lat;
    event.lon = lon;
    event.contactEmail = req.body.contactEmail?.trim() || event.contactEmail;
    event.contactPhone = req.body.contactPhone?.trim() || event.contactPhone;
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

// ✅ **Alle Funktionen korrekt exportieren**
//*export { createEvent, updateEvent, deleteEvent };
/*get event by id und get events imp*/