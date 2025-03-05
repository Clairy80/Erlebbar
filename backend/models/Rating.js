import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Wer hat bewertet?
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },  // Bewertung für ein Event
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },  // Oder für eine Location
  rating: { type: Number, required: true, min: 1, max: 5 },  // 1-5 Sterne
  comment: { type: String }
}, { timestamps: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
