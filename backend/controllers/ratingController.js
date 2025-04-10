import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import RatingModel from "../models/Rating.js";
import EventModel from "../models/Event.js";
import { updateEventAverageRating } from "../utils/ratingUtils.js";

// ➕ Bewertung erstellen (POST – nur für manuelle Fälle)
export const createRating = asyncHandler(async (req, res) => {
  const { rating, comment, event } = req.body;
  const userId = req.user._id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Bewertung muss zwischen 1 und 5 Sternen liegen." });
  }

  const existing = await RatingModel.findOne({ user: userId, event });
  if (existing) {
    return res.status(400).json({ message: "Du hast dieses Event bereits bewertet." });
  }

  const newRating = new RatingModel({
    user: userId,
    event,
    rating,
    comment: comment?.trim() || ""
  });

  await newRating.save();
  await updateEventAverageRating(event);
  res.status(201).json({ message: "🎉 Bewertung gespeichert!", rating: newRating });
});

// 🔁 Bewertung erstellen oder aktualisieren (PUT)
export const updateRating = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const eventId = req.params.eventId;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(eventId)) {
    return res.status(400).json({ message: "Ungültige Event-ID." });
  }

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: "Bewertung muss zwischen 1 und 5 Sternen liegen." });
  }

  const event = await EventModel.findById(eventId);
  if (!event) {
    return res.status(404).json({ message: "Event nicht gefunden." });
  }

  let existingRating = await RatingModel.findOne({ user: userId, event: eventId });

  if (existingRating) {
    existingRating.rating = rating;
    existingRating.comment = comment || existingRating.comment;
    await existingRating.save();
  } else {
    const newRating = new RatingModel({
      user: userId,
      event: eventId,
      rating,
      comment: comment?.trim() || ""
    });
    await newRating.save();
  }

  await updateEventAverageRating(eventId);
  res.status(200).json({ message: "⭐ Bewertung gespeichert & Durchschnitt aktualisiert." });
});

// 🗑️ Bewertung löschen (nach Rating-ID)
export const deleteRating = asyncHandler(async (req, res) => {
  const { ratingId } = req.params;
  const userId = req.user._id;

  const rating = await RatingModel.findById(ratingId);
  if (!rating) {
    return res.status(404).json({ message: "Bewertung nicht gefunden." });
  }

  if (rating.user.toString() !== userId.toString()) {
    return res.status(403).json({ message: "Du darfst nur deine eigene Bewertung löschen." });
  }

  const eventId = rating.event?.toString();

  await rating.deleteOne();

  if (eventId) {
    await updateEventAverageRating(eventId);
  }

  res.status(200).json({ message: "🗑️ Bewertung erfolgreich gelöscht." });
});

// 🧹 Bewertung zu Event & User löschen
export const deleteRatingByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const userId = req.user._id;

  const deleted = await RatingModel.findOneAndDelete({ user: userId, event: eventId });

  if (!deleted) {
    return res.status(404).json({ message: "Keine Bewertung gefunden." });
  }

  await updateEventAverageRating(eventId);
  res.json({ message: "🧹 Bewertung gelöscht." });
});

// 📥 Bewertungen für ein Event
export const getRatingsForEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const ratings = await RatingModel.find({ event: eventId }).populate("user", "username");
  res.status(200).json(ratings);
});

// 📥 Bewertungen für eine Location
export const getRatingsForLocation = asyncHandler(async (req, res) => {
  const { locationId } = req.params;
  const ratings = await RatingModel.find({ location: locationId }).populate("user", "username");
  res.status(200).json(ratings);
});
