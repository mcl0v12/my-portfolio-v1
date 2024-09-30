import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Stellt sicher, dass die Umgebungsvariablen geladen werden
dotenv.config();

const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());

// Füge hier die console.log() Befehle hinzu, um die Umgebungsvariablen zu überprüfen
console.log("Email:", process.env.EMAIL);
console.log("Password:", process.env.EMAIL_PASSWORD);

// Konfiguriere das Rate-Limit (z.B. max. 5 Anfragen pro Minute pro IP)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 Minute
  max: 2, // Maximal 5 Anfragen pro IP in diesem Zeitfenster
  message: "Too many requests send, please try again later.",
});

// Verwende das Rate-Limit für die /send-email Route
app.use("/send-email", limiter);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,   // Verwende die Umgebungsvariable
    pass: process.env.EMAIL_PASSWORD,  // Verwende die Umgebungsvariable
  },
});

app.post("/send-email", (req, res) => {
  const { firstName, lastName, email, phone, date, duration, additionalInfo } = req.body;

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "New Booking Request",
    text: `New booking details:
      First Name: ${firstName}
      Last Name: ${lastName}
      Email: ${email}
      Phone: ${phone}
      Date: ${date}
      Duration: ${duration} minutes
      Additional Information: ${additionalInfo}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send("Email sent: " + info.response);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
