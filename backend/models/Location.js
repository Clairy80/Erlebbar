import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: {
    street: { type: String, required: true },
    number: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true, default: 'Deutschland' },
  },
  geo: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  description: { type: String },
  category: { type: String, enum: ['Café', 'Restaurant', 'Theater', 'Museum', 'Veranstaltungsort', 'Andere'], required: true },
  openingHours: { type: String },
  images: [{ type: String }], // Array für Bild-URLs
  
  accessibility: {
    stepFreeAccess: { type: Boolean, default: false },
    ramp: { type: Boolean, default: false },
    wideDoors: { type: Boolean, default: false },
    accessibleToilet: { type: Boolean, default: false },
    disabledParking: { type: Boolean, default: false },
    publicTransportNearby: { type: Boolean, default: false },
    inductionLoop: { type: Boolean, default: false },
    brailleSignage: { type: Boolean, default: false },
    quietRoom: { type: Boolean, default: false },
    assistanceAvailable: { type: Boolean, default: false },
  },
  ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }], // Verknüpfung zu Bewertungen
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // User, der die Location hinzugefügt hat
}, { timestamps: true });

const Location = mongoose.model('Location', locationSchema);
export default Location;
