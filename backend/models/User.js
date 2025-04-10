import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const emailRegex = /^\S+@\S+\.\S+$/;

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Benutzername ist erforderlich'],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'E-Mail ist erforderlich'],
    unique: true,
    lowercase: true,
    match: [emailRegex, 'Ungültige E-Mail-Adresse'],
  },
  password: {
    type: String,
    required: [true, 'Passwort ist erforderlich'],
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['user', 'organizer'],
    default: 'user',
  },
  organization: String,
  address: String,
  isVerified: {
    type: Boolean,
    default: true,
  },
  savedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.checkPassword = function (password) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model('User', userSchema);
