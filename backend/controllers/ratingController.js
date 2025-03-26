import Rating from "../models/Rating.js";
import asyncHandler from "express-async-handler";

// ➕ Bewertung erstellen
export const createRating = asyncHandler(async (req, res) => {
  const { event, location, rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Ungültige Bewertung (1–5 Sterne)." });
  }

  const newRating = await Rating.create({
    user: req.user._id,
    event,
    location,
    rating,
    comment,
  });

  res.status(201).json(newRating);
});

// 📥 Bewertungen für ein Event
export const getRatingsForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const ratings = await Rating.find({ event: eventId }).populate("user", "username");

  if (!ratings || ratings.length === 0) {
    return res.status(404).json({ message: "Keine Bewertungen für dieses Event gefunden." });
  }

  res.json(ratings);
});

// 📥 Bewertungen für eine Location
export const getRatingsForLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const ratings = await Rating.find({ location: locationId }).populate("user", "username");

  if (!ratings || ratings.length === 0) {
    return res.status(404).json({ message: "Keine Bewertungen für diese Location gefunden." });
  }

  res.json(ratings);
});

// ❌ Bewertung löschen
export const deleteRating = asyncHandler(async (req, res) => {
  const ratingId = req.params.ratingId;

  const rating = await Rating.findById(ratingId);
  if (!rating) {
    return res.status(404).json({ message: "Bewertung nicht gefunden." });
  }

  if (rating.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Nicht berechtigt, diese Bewertung zu löschen." });
  }

  await rating.deleteOne();
  res.json({ message: "Bewertung erfolgreich gelöscht." });
});
