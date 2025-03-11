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
  location: { 
    type: String, 
    required: [true, "Standort ist erforderlich"], 
    trim: true 
  },
  accessibilityOptions: { 
    type: [String], 
    default: [] 
  }
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
export default Event;
