require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

require("dotenv").config();


/* ✅ Middleware (FIXED) */
app.use(express.json());

app.use(cors());

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Backend is working" });
});

/* Email route */
app.post("/send-email", async (req, res) => {
  console.log("🔥 HIT SEND EMAIL ROUTE");

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // Gmail App Password
      },
    });

    await transporter.sendMail({
      from: `"${name}" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Contact Message",
      text: `
Name: ${name}
Email: ${email}

Message:
${message}
      `,
    });

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send email",
    });
  }
});

/* Start server */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});