import mongoose from 'mongoose';

const ratingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Wer hat bewertet?

    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      default: null,
    }, // Bewertung für ein Event

    location: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Location',
      default: null,
    }, // Oder für eine Location

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

// ❗ Entweder Event ODER Location – nicht beides gleichzeitig
ratingSchema.pre('validate', function (next) {
  if (!this.event && !this.location) {
    next(new Error('Eine Bewertung muss entweder einem Event oder einer Location zugeordnet sein.'));
  } else if (this.event && this.location) {
    next(new Error('Eine Bewertung darf nicht gleichzeitig einem Event und einer Location zugeordnet sein.'));
  } else {
    next();
  }
});

// 🔒 Optional: Sicherstellen, dass ein User nicht doppelt für dasselbe Ziel bewertet
ratingSchema.index({ user: 1, event: 1 }, { unique: true, sparse: true });
ratingSchema.index({ user: 1, location: 1 }, { unique: true, sparse: true });

const Rating = mongoose.model('Rating', ratingSchema);
export default Rating;
