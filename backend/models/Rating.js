import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    },
    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    },
    rating: {
      type: Number,
      required: [true, 'Bewertung ist erforderlich'],
      min: [1, 'Mindestens 1 Stern'],
      max: [5, 'Maximal 5 Sterne'],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  { timestamps: true }
);

// ❗ Validierung: Entweder Event oder Location
ratingSchema.pre('validate', function (next) {
  if (!this.event && !this.location) {
    return next(new Error('Eine Bewertung muss entweder einem Event oder einer Location zugeordnet sein.'));
  }
  if (this.event && this.location) {
    return next(new Error('Eine Bewertung darf nicht gleichzeitig einem Event und einer Location zugeordnet sein.'));
  }
  next();
});


// 🔒 Eindeutige Kombinationen
ratingSchema.index({ user: 1, event: 1 }, { unique: true, sparse: true });
ratingSchema.index(
  { user: 1, location: 1 },
  {
    unique: true,
    partialFilterExpression: { location: { $exists: true, $ne: null } }
  }
);


// ✅ FIX für Hot-Reload & doppelte Model-Registrierung
const Rating = mongoose.models.Rating || mongoose.model('Rating', ratingSchema);
export default Rating;
