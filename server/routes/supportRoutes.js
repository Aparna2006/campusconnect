const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

router.post("/", async (req, res) => {
  const { name, email, category, issue } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SUPPORT_EMAIL,
        pass: process.env.SUPPORT_PASSWORD,
      },
    });

    const mailOptions = {
      from: email,
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
    console.log(error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
