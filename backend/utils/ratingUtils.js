// utils/ratingUtils.js
import Event from "../models/Event.js";
import Rating from "../models/Rating.js";

export const updateEventAverageRating = async (eventId) => {
  const ratings = await Rating.find({ event: eventId });

  if (ratings.length === 0) {
    await Event.findByIdAndUpdate(eventId, { rating: 0 });
    return;
  }

  const avg =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

  await Event.findByIdAndUpdate(eventId, { rating: avg.toFixed(1) });
};
