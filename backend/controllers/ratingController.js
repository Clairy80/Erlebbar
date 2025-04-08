import Rating from "../models/Rating.js";
import asyncHandler from "express-async-handler";

// ➕ Bewertung erstellen (veraltet, siehe updateRating)
export const createRating = asyncHandler(async (req, res) => {
  const { event, location, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Ungültige Bewertung. Bitte 1 bis 5 Sterne angeben." });
  }

  const existing = await Rating.findOne({
    user: req.user._id,
    ...(event && { event }),
    ...(location && { location })
  });

  if (existing) {
    return res.status(400).json({ message: "Du hast dieses Event oder diese Location bereits bewertet." });
  }

  const newRating = await Rating.create({
    user: req.user._id,
    event: event || null,
    location: location || null,
    rating,
    comment: comment?.trim() || "",
  });

  res.status(201).json({ message: "🎉 Bewertung gespeichert!", rating: newRating });
});

// 🔄 Bewertung erstellen ODER aktualisieren
export const updateRating = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const eventId = req.params.eventId;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Bewertung muss zwischen 1 und 5 Sternen liegen." });
  }

  let existingRating = await Rating.findOne({ user: userId, event: eventId });

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment || existingRating.comment;
    await existingRating.save();
    res.json({ message: "Bewertung aktualisiert!", rating: existingRating });
  } else {
    const newRating = await Rating.create({
      user: userId,
      event: eventId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Neue Bewertung gespeichert!", rating: newRating });
  }
});

// ❌ Bewertung für ein Event löschen
export const deleteRatingByEvent = asyncHandler(async (req, res) => {
  const eventId = req.params.eventId;
  const userId = req.user._id;

  const deleted = await Rating.findOneAndDelete({ user: userId, event: eventId });

  if (!deleted) {
    return res.status(404).json({ message: "Keine Bewertung zum Löschen gefunden." });
  }

  res.json({ message: "Bewertung gelöscht." });
});

// 📥 Bewertungen für ein Event
export const getRatingsForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const ratings = await Rating.find({ event: eventId }).populate("user", "username");
  res.status(200).json(ratings);
});

// 📥 Bewertungen für eine Location
export const getRatingsForLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const ratings = await Rating.find({ location: locationId }).populate("user", "username");
  res.status(200).json(ratings);
});

// ❌ Bewertung gezielt löschen (by ratingId)
export const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const rating = await Rating.findById(ratingId);

  if (!rating) {
    return res.status(404).json({ message: "Bewertung nicht gefunden." });
  }

  if (rating.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Du darfst nur deine eigene Bewertung löschen." });
  }

  await rating.deleteOne();
  res.status(200).json({ message: "🗑️ Bewertung erfolgreich gelöscht." });
});
