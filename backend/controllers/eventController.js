import asyncHandler from 'express-async-handler';
import Event from '../models/Event.js';

// 🟢 Event erstellen
export const createEvent = asyncHandler(async (req, res) => {
    const { title, description, date, location, lat, lon, eventType, accessibilityOptions } = req.body;

    const event = await Event.create({
        title,
        description,
        date,
        location,
        lat,
        lon,
        eventType,
        accessibilityOptions,
        createdBy: req.user._id,
    });

    if (event) {
        res.status(201).json(event);
    } else {
        res.status(400);
        throw new Error('Fehler beim Erstellen des Events');
    }
});

// 🔵 Alle Events abrufen
export const getAllEvents = asyncHandler(async (req, res) => {
    const events = await Event.find({});
    res.json(events);
});

// 🟣 Ein Event per ID abrufen
export const getEventById = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        res.json(event);
    } else {
        res.status(404);
        throw new Error('Event nicht gefunden');
    }
});

// 🟠 Event aktualisieren
export const updateEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        event.title = req.body.title || event.title;
        event.description = req.body.description || event.description;
        event.date = req.body.date || event.date;
        event.location = req.body.location || event.location;
        event.lat = req.body.lat || event.lat;
        event.lon = req.body.lon || event.lon;
        event.eventType = req.body.eventType || event.eventType;
        event.accessibilityOptions = req.body.accessibilityOptions || event.accessibilityOptions;

        const updatedEvent = await event.save();
        res.json(updatedEvent);
    } else {
        res.status(404);
        throw new Error('Event nicht gefunden');
    }
});

// 🔴 Event löschen
export const deleteEvent = asyncHandler(async (req, res) => {
    const event = await Event.findById(req.params.id);

    if (event) {
        await event.deleteOne();
        res.json({ message: 'Event gelöscht' });
    } else {
        res.status(404);
        throw new Error('Event nicht gefunden');
    }
});
