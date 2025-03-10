import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Benutzername ist erforderlich'],
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, 'E-Mail ist erforderlich'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\S+@\S+\.\S+$/,
        'Bitte eine gültige E-Mail-Adresse eingeben',
      ],
    },
    password: {
      type: String,
      required: [true, 'Passwort ist erforderlich'],
      minlength: [6, 'Passwort muss mindestens 6 Zeichen lang sein'],
    },
    role: {
      type: String,
      enum: ['user', 'organizer'],
      default: 'user',
    },
    savedEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event',
        default: [],
      },
    ],
    savedLocations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        default: [],
      },
    ],
  },
  { timestamps: true }
);

// 🛡 **Passwort-Hashing vor dem Speichern**
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model('User', userSchema);
export default User;
