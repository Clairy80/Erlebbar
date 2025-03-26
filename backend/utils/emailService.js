import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter;

if (process.env.EMAIL_SERVICE === "live") {
  // 📬 Produktivmodus: Yahoo oder anderes echtes E-Mail-Service
  transporter = nodemailer.createTransport({
    service: "yahoo", // z. B. "gmail", "outlook", je nach Provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
} else {
  // 🧪 Testmodus: Ethereal Fake-Email-Account
  transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'lucious.mcdermott24@ethereal.email',
        pass: 'xAXJH8S1d4NunC7rNT'
    },
  });

  // 🌈 Nur zu Debug-Zwecken anzeigen
  console.log("📩 E-Mail-Testmodus mit Ethereal aktiviert.");
}

export default transporter;
