import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
  organizer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: [true, "Ein Organizer ist erforderlich!"]
  },
  title: { 
    type: String, 
    required: [true, "Titel ist erforderlich"], 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true, 
    default: "" 
  },
  date: { 
    type: Date, 
    required: [true, "Datum ist erforderlich"],
    validate: {
      validator: function (value) {
        return !isNaN(new Date(value).getTime());
      },
      message: "Ungültiges Datum"
    }
  },
  time: { 
    type: String, 
    required: [true, "Uhrzeit ist erforderlich"],
    match: [/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/, "Ungültige Uhrzeit. Format: HH:mm"]
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  // 📍 Physische Adresse (Pflicht bei Offline-Events)
  street: { 
    type: String, 
    required: function () { return !this.isOnline; }, 
    trim: true 
  },
  postalCode: { 
    type: String, 
    required: function () { return !this.isOnline; }, 
    match: [/^\d{4,6}$/, "Ungültige Postleitzahl"]
  },
  city: { 
    type: String, 
    required: function () { return !this.isOnline; }, 
    trim: true 
  },
  country: { 
    type: String, 
    default: "Deutschland",
    trim: true 
  },
  // 🌍 Koordinaten (Pflicht bei Offline-Events)
  lat: { 
    type: Number,
    required: function () { return !this.isOnline; }
  },
  lon: { 
    type: Number,
    required: function () { return !this.isOnline; }
  },
  // 📩 Kontaktinformationen (Immer erforderlich)
  contactEmail: { 
    type: String,
    required: [true, "Eine Kontakt-E-Mail ist erforderlich"],
    match: [/^\S+@\S+\.\S+$/, "Ungültige E-Mail-Adresse"]
  },
  contactPhone: { 
    type: String,
    required: [true, "Eine Telefonnummer ist erforderlich"],
    match: [/^\+?[0-9\s\-()]{7,20}$/, "Ungültige Telefonnummer"]
  },
  // ♿ Barrierefreiheitsoptionen
  accessibilityOptions: { 
    type: [String], 
    default: [] 
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
