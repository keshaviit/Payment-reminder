const nodemailer = require('nodemailer');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer, email, amount } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    return res.status(500).json({ message: "Server email configuration is missing" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      connectionTimeout: 10000
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER || "shivi.giggles1@gmail.com",
      to: email,
      subject: "Payment Reminder",
      html: `<h2>Payment Reminder</h2><p>Hello ${customer},</p><p>This is a reminder that your payment of <b>₹${amount}</b> is still pending.</p><p>Please complete the payment soon.</p>`,
    });

    return res.status(200).json({ message: "Reminder email sent!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Email failed" });
  }
}
