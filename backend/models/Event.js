import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Wer hat es erstellt?
  title: { type: String, required: true },
  description: { type: String },
  date: { type: String, required: true },  // YYYY-MM-DD
  time: { type: String, required: true },  // HH:MM
  location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },  // Verknüpfung zur Location
  accessibilityOptions: {
    ramp: { type: Boolean, default: false },
    elevator: { type: Boolean, default: false },
    parking: { type: Boolean, default: false },
    quietRoom: { type: Boolean, default: false },
    interpreter: { type: Boolean, default: false },
    therapyAnimals: { type: Boolean, default: false }
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }]  // Bewertungen
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
