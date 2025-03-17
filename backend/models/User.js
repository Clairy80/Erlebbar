import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// 🔹 E-Mail-Validierungsmuster
const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Benutzername ist erforderlich'],
      unique: true,
      trim: true,
      minlength: [3, 'Benutzername muss mindestens 3 Zeichen lang sein'],
    },
    email: {
      type: String,
      required: [true, 'E-Mail ist erforderlich'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [emailRegex, 'Bitte eine gültige E-Mail-Adresse eingeben'],
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
    isVerified: {
      type: Boolean,
      default: false, // 🚀 Neu: Nutzer müssen ihre E-Mail verifizieren
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

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    console.log(`🔒 Passwort erfolgreich gehasht für: ${this.email}`);
    next();
  } catch (error) {
    console.error("❌ Fehler beim Hashen des Passworts:", error);
    next(error);
  }
});

// 🔑 **Methode: Passwort überprüfen**
userSchema.methods.checkPassword = async function (enteredPassword) {
  try {
    return await bcrypt.compare(enteredPassword, this.password);
  } catch (error) {
    console.error("❌ Fehler beim Passwort-Vergleich:", error);
    return false;
  }
};

// 📩 **Methode: Prüfen, ob E-Mail gültig ist**
userSchema.statics.validateEmail = function (email) {
  return emailRegex.test(email);
};

const User = mongoose.model('User', userSchema);
export default User;
