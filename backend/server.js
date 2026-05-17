require("dotenv").config();
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend running!");
});

app.post("/send-reminder", async (req, res) => {
  const { customer, email, amount } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ message: "Server email configuration is missing" });
  }

  try {

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000 // 10 seconds timeout
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "shivi.giggles1@gmail.com",
      to: email,
      subject: "Payment Reminder",
      html: `
        <h2>Payment Reminder</h2>
        <p>Hello ${customer},</p>
        <p>This is a reminder that your payment of <b>₹${amount}</b> is still pending.</p>
        <p>Please complete the payment soon.</p>
      `,
    });

    res.status(200).json({
      message: "Reminder email sent!",
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Email failed",
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});