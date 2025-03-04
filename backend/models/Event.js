// models/Event.js
import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  eventType: { 
    type: String, 
    required: true, 
    enum: ['Konzert', 'Vortrag', 'Workshop', 'Seminar', 'Festival'] 
  },
  
  accessibilityOptions: {
    ramp: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    quietRoom: { type: Boolean, default: false },
    interpreter: { type: Boolean, default: false },
    therapyAnimals: { type: Boolean, default: false },
  },
  publicTransportProximity: { type: Boolean, default: false },
  wcAccessible: { type: Boolean, default: false },
  elevatorAccessible: { type: Boolean, default: false },
  languageOptions: [String],
  ratings: [{ userId: mongoose.Schema.Types.ObjectId, rating: Number, comment: String }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Optional: Ersteller des Events
}, { timestamps: true }); // Timestamps für createdAt und updatedAt aktivieren

const Event = mongoose.model('Event', eventSchema);

export default Event;
