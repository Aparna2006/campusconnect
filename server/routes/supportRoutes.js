const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, category, issue } = req.body;

  try {
    if (!name || !email || !category || !issue) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    if (!process.env.SUPPORT_EMAIL || !process.env.SUPPORT_PASSWORD) {
      return res.status(500).json({
        success: false,
        message: "Support email is not configured on server.",
      });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SUPPORT_EMAIL,
      replyTo: email,
      to: process.env.SUPPORT_EMAIL,
      subject: `Support Request - ${category}`,
      text: `
      Name: ${name}
      Email: ${email}
      Category: ${category}

      Issue:
      ${issue}
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true });
  } catch (error) {
    console.error("Support email error:", error.message);
    res.status(500).json({
      success: false,
      message: "Unable to send support request email. Check support email credentials.",
    });
  }
});

module.exports = router;
