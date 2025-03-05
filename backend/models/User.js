import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'organizer'], default: 'user' },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],  // Events speichern
  savedLocations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Location' }],  // Locations speichern
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
