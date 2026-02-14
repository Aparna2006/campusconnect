const nodemailer = require("nodemailer");

let transporter;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: String(process.env.SMTP_SECURE || "false") === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    return transporter;
  }

  return null;
};

const sendEmail = async ({ to, subject, text }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`Email skipped (mailer not configured): ${subject} -> ${to}`);
    return;
  }

  await mailer.sendMail({
    from: process.env.SMTP_FROM || "no-reply@campusconnect.local",
    to,
    subject,
    text,
  });
};

module.exports = {
  sendEmail,
};
