import jwt from 'jsonwebtoken';

// 🛡️ Erstellt ein JWT mit optionalem Zusatzinhalt
const generateToken = (user) => {
  const payload = {
    id: user.id,                     // Pflicht: User-ID
    role: user.role || 'user',      // Optional: Rolle mitgeben
    email: user.email,              // Optional: E-Mail im Token
  };

  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: '30d', // ⏳ Gültigkeit 30 Tage
  });
};

export default generateToken;
