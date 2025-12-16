import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;
const port = parseInt(process.env.EMAIL_PORT || '0', 10) || undefined;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || 'no-reply@careerai.local';

let transporter;

// Email functionality disabled
transporter = nodemailer.createTransporter({ 
  streamTransport: true,
  newline: 'unix',
  buffer: true
});

export async function sendMail({ to, subject, html, text }) {
  // Email functionality disabled
  return {
    messageId: 'disabled-' + Date.now(),
    response: 'Email functionality disabled',
    status: 'DISABLED'
  };
}