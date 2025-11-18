import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;
const port = parseInt(process.env.EMAIL_PORT || '0', 10) || undefined;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || 'no-reply@careerai.local';

let transporter;
if (host && port && user && pass) {
  console.log('📧 Email config:', { host, port, user: user ? '***' : 'missing', pass: pass ? '***' : 'missing' });
  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
    tls: { 
      rejectUnauthorized: false
    },
    connectionTimeout: 30000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    debug: process.env.NODE_ENV !== 'production',
    logger: process.env.NODE_ENV !== 'production'
  });
} else {
  console.warn('⚠️ Email not configured - missing credentials');
  transporter = nodemailer.createTransport({ jsonTransport: true });
}

export async function sendMail({ to, subject, html, text }) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 From: ${from}`);
    
    const info = await transporter.sendMail({ 
      from, 
      to, 
      subject, 
      html, 
      text,
      headers: {
        'X-Mailer': 'CareerAI'
      }
    });
    
    console.log(`✅ Email sent successfully: ${info.messageId}`);
    if (process.env.NODE_ENV !== 'production' && info.message) {
      console.log('📧 Email content:', info.message);
    }
    
    return info;
  } catch (error) {
    console.error('❌ Email send failed:', {
      error: error.message,
      code: error.code,
      command: error.command,
      to,
      subject
    });
    throw error;
  }
}