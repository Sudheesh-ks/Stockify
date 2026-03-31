import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const { MAIL_EMAIL, MAIL_PASSWORD } = process.env as Record<string, string>;

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: MAIL_EMAIL, pass: MAIL_PASSWORD },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({ from: MAIL_EMAIL, to, subject, html });
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
