import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  location: { type: String, required: true },
  accessibilityOptions: { type: [String] }
});

const Event = mongoose.model('Event', eventSchema);
export default Event;
