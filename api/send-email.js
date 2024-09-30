// api/send-email.js

import nodemailer from "nodemailer";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, email, phone, subject, additionalInfo, recaptchaToken } =
    req.body;

  console.log("Received recaptchaToken on server:", recaptchaToken);

  const hcaptchaSecretKey = process.env.HCAPTCHA_SECRET_KEY;
  console.log("HCAPTCHA_SECRET_KEY:", hcaptchaSecretKey);

  const hcaptchaUrl = "https://hcaptcha.com/siteverify";

  try {
    const hcaptchaResponse = await fetch(hcaptchaUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        secret: hcaptchaSecretKey,
        response: recaptchaToken,
      }),
    });

    const hcaptchaData = await hcaptchaResponse.json();
    console.log("hCaptcha Response:", hcaptchaData);

    if (!hcaptchaData.success) {
      console.log("hCaptcha Error Codes:", hcaptchaData["error-codes"]); // Fügen Sie diese Zeile hinzu
      return res.status(400).json({
        message: "Captcha validation failed.",
        "error-codes": hcaptchaData["error-codes"],
      });
    }
  } catch (error) {
    console.error("Captcha validation error:", error);
    return res.status(500).json({ message: "Captcha validation error" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: `New Request: ${subject}`, // Subject in Betreff einfügen
    text: `New contact details:
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Subject: ${subject}
    Additional Information: ${additionalInfo}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    return res.status(500).json({ message: "Error sending email" });
  }
};
