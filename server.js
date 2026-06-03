require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "https://troylemons.netlify.app"
  ];
  
  app.use(cors({
    origin: ["http://localhost:3000", "https://troylemons.netlify.app"],
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  }));
  

app.use(express.json());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // app password
    },
  });

  app.get("/", (req, res) => {
    res.json({ status: "Backend is working" });
  });

  app.post("/send-email", async (req, res) => {
    console.log("🔥 HIT SEND EMAIL ROUTE");
  
    const { name, email, message } = req.body;
  
    try {
      await transporter.sendMail({
        from: `"${name}" <${email}>`,
        to: process.env.EMAIL_USER,
        subject: "New Contact Message",
        text: `
  Name: ${name}
  Email: ${email}
  
  Message:
  ${message}
        `,
      });
  
      return res.json({ success: true });
  
    } catch (err) {
      console.error("EMAIL ERROR:", err);
      return res.status(500).json({ success: false });
    }
  });
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });