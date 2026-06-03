require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();


/* ✅ Middleware (FIXED) */
app.use(express.json());

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://troylemons.netlify.app"
  ],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: false
}));

/* Health check */
app.get("/", (req, res) => {
  res.json({ status: "Backend is working" });
});

/* Email route */
app.post("/send-email", async (req, res) => {
  console.log("🔥 POST HIT");
  console.log("BODY:", req.body);

  try {
    const name = req.body?.name;
    const email = req.body?.email;
    const message = req.body?.message;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing fields" });
    }

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      replyTo: email,
      subject: "New Contact Message",
      text: `${name}\n${email}\n\n${message}`,
    });

    return res.json({ success: true });

  } catch (err) {
    console.log("SEND ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
});

/* Start server */
const PORT = process.env.PORT || 5000;

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});