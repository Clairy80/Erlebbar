import nodemailer from 'nodemailer';

const transporter =
  process.env.EMAIL_SERVICE === "live"
    ? nodemailer.createTransport({
        service: "yahoo",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      })
    : nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        auth: {
          user: "jerrold.schoen@ethereal.email",
          pass: "695dFQB7rD4sAv1yNd",
        },
      });

export default transporter;
