import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { SENDER_EMAIL, BREVO_API_KEY } = process.env;

console.log("MAIL_EMAIL:", SENDER_EMAIL ? "Set" : "Not set");
console.log("MAIL_PASSWORD:", BREVO_API_KEY ? "Set" : "Not set");

if (!SENDER_EMAIL || !BREVO_API_KEY) {
  console.error(
    "Email configuration missing! MAIL_EMAIL or MAIL_PASSWORD is not set.",
  );
}

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: { user: SENDER_EMAIL || "", pass: BREVO_API_KEY || "" },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!SENDER_EMAIL || !BREVO_API_KEY) {
    throw new Error("Email configuration is missing");
  }

  try {
    const result = await transporter.sendMail({
      from: SENDER_EMAIL,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully:", result.messageId);
    return result;
  } catch (error) {
    console.error("Email send failed:", error);
    throw error;
  }
};

// OTP
export const sendOTP = async (email: string, otp: string) =>
  sendEmail(
    email,
    "Verify Your Account - OTP Inside",
    `
    <div style="font-family:Arial,sans-serif;background:#f4f4f4;padding:40px 0">
      <div style="max-width:600px;margin:auto;background:#fff;padding:30px;
                  border-radius:10px;box-shadow:0 4px 8px rgba(0,0,0,0.1)">
        <h2 style="text-align:center;color:#333">Welcome to Stockify 🙏</h2>
        <p style="font-size:16px;color:#555">Hi there,</p>
        <p style="font-size:16px;color:#555">
          Use the One‑Time Password below to verify your account:
        </p>
        <div style="text-align:center;margin:30px 0">
          <span style="display:inline-block;font-size:28px;font-weight:bold;
                       color:#4CAF50;background:#f1f1f1;padding:15px 30px;
                       border-radius:8px;letter-spacing:4px">
            ${otp}
          </span>
        </div>
        <p style="font-size:14px;color:#777">
          This OTP is valid for ⏰ 1 minute. Do not share it with anyone.
        </p>
        <p style="font-size:14px;color:#777">
          If you didn't request this, simply ignore this email.
        </p>
        <p style="margin-top:30px;font-size:14px;color:#999;text-align:center">
          &copy; ${new Date().getFullYear()} Stockify. All rights reserved.
        </p>
      </div>
    </div>
    `,
  );
