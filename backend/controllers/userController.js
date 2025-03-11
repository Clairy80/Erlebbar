import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import transporter from '../utils/emailService.js';
import bcrypt from 'bcryptjs';

// 🔑 Token generieren
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// 📧 Verifizierungs-E-Mail verschicken
const sendVerificationEmail = async (userEmail, verificationLink) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: userEmail,
    subject: 'E-Mail-Verifizierung',
    html: `<p>Bitte klicke auf den folgenden Link, um deine E-Mail-Adresse zu bestätigen:</p>
           <a href="${verificationLink}">${verificationLink}</a>`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('✅ Verifizierungs-E-Mail gesendet.');
  } catch (error) {
    console.error('❌ Fehler beim Senden der Verifizierungs-E-Mail:', error);
    throw new Error('E-Mail-Versand fehlgeschlagen.');
  }
};

// 📝 Benutzer-Registrierung (korrigiert, KEIN manuelles Passwort-Hashing)
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Bitte alle Felder ausfüllen.' });
    }

    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'Benutzername oder E-Mail bereits vergeben.' });
    }

    const user = await User.create({
      username,
      email,
      password, // Schema übernimmt das Hashing automatisch
      isVerified: false,
    });

    const verifyToken = generateToken(user._id);
    const verifyLink = `${process.env.FRONTEND_URL}/verify-email?token=${verifyToken}`;

    await sendVerificationEmail(user.email, verifyLink);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      message: 'Registrierung erfolgreich! Bitte überprüfe deine E-Mails zur Verifizierung.',
    });

  } catch (error) {
    console.error("❌ Fehler bei der Registrierung:", error);
    res.status(500).json({ message: 'Registrierung fehlgeschlagen', error: error.message });
  }
};

// ✅ E-Mail-Bestätigung
export const verifyEmail = async (req, res) => {
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: 'Ungültiges Token oder Benutzer existiert nicht mehr.' });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: 'E-Mail wurde bereits bestätigt.' });
    }

    user.isVerified = true;
    await user.save();

    res.json({ message: 'E-Mail erfolgreich verifiziert! Du kannst dich jetzt anmelden.' });
  } catch (error) {
    console.error("❌ Fehler bei der E-Mail-Verifizierung:", error);
    res.status(400).json({ message: 'Ungültiges oder abgelaufenes Token.' });
  }
};

// 🔑 Benutzer-Login
export const loginUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    if ((!email && !username) || !password) {
      return res.status(400).json({ message: 'Bitte Benutzername oder E-Mail und Passwort eingeben.' });
    }

    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
    }

    if (!user.isVerified) {
      return res.status(403).json({ message: 'E-Mail nicht verifiziert! Bitte überprüfe deine E-Mails.' });
    }

    const passwordMatch = bcrypt.compareSync(password, user.password);
    // Schema-Methodik empfohlen

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Ungültige Anmeldeinformationen.' });
    }

    res.json({
      _id: user.id,
      username: user.username,
      email: user.email,
      token: generateToken(user.id),
    });

  } catch (error) {
    console.error("❌ Fehler beim Login:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔍 Benutzerprofil abrufen (geschützt)
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'Benutzer nicht gefunden.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
