import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;
const port = parseInt(process.env.EMAIL_PORT || '0', 10) || undefined;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || 'no-reply@careerai.local';

let transporter;
if (host && port && user && pass) {
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: false,
    auth: { user, pass },
    tls: { rejectUnauthorized: false }
  });
} else {
  // Fallback: log emails to console for dev
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export async function sendMail({ to, subject, html, text }) {
  const info = await transporter.sendMail({ from, to, subject, html, text });
  if (process.env.NODE_ENV !== 'production') {
    console.log('Mail sent (dev):', info.messageId, subject, to);
    if (info.message) console.log(info.message);
  }
  return info;
}