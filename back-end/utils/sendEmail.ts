// utils/sendEmail.ts
import nodemailer from "nodemailer";

interface EmailOptions {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  replyTo?: string;
}

const {
  EMAIL_HOST,          // e.g., smtp.mailtrap.io
  EMAIL_PORT,          // e.g., 2525 (Mailtrap), 587 (STARTTLS), 465 (SSL)
  EMAIL_USER,
  EMAIL_PASS,
  EMAIL_FROM,          // e.g., 'SneakUp <no-reply@sneakup.app>'
  NODE_ENV,
} = process.env;

const port = Number(EMAIL_PORT || 587);

// Reusable transporter (one per process)
const transporter = nodemailer.createTransport({
  host: EMAIL_HOST,
  port,
  secure: port === 465,                 // SSL for 465, STARTTLS for 587/2525
  auth: EMAIL_USER && EMAIL_PASS ? { user: EMAIL_USER, pass: EMAIL_PASS } : undefined,
  pool: true,                           // fine for both dev/prod; Mailtrap is okay with it
  maxConnections: 5,
  maxMessages: 100,
  tls: {
    // Leave strict verification on; Mailtrap and most providers support this.
    rejectUnauthorized: true,
  },
  connectionTimeout: 10_000,
  socketTimeout: 10_000,
});

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  try {
    await transporter.sendMail({
      from: EMAIL_FROM || EMAIL_USER || "no-reply@sneakup.app",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (NODE_ENV === "development") {
      console.log("📧 Email queued to:", options.to);
    }
  } catch (err: any) {
    // Don’t crash the API if email fails
    console.error("❌ Email send failed:", err?.message || err);
  }
};