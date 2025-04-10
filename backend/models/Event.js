import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: String,
  date: { type: Date, required: true },
  time: { type: String, required: true },
  eventType: { type: String, default: 'Konzert' },
  isOnline: { type: Boolean, default: false },
  street: String,
  postalCode: String,
  city: String,
  country: { type: String, default: 'Deutschland' },
  lat: Number,
  lon: Number,
  contactEmail: { type: String, required: true },
  contactPhone: { type: String, required: true },
  accessibilityOptions: [String],
  rating: { type: Number, default: null },
  suitableFor: { type: String, default: 'Alle' },
  needsCompanion: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.model('Event', eventSchema);
