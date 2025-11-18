import nodemailer from 'nodemailer';

const host = process.env.EMAIL_HOST;
const port = parseInt(process.env.EMAIL_PORT || '0', 10) || undefined;
const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;
const from = process.env.EMAIL_FROM || 'no-reply@careerai.local';

let transporter;

// Log current email configuration
console.log('📧 Email Environment Check:', {
  EMAIL_HOST: host || 'MISSING',
  EMAIL_PORT: port || 'MISSING', 
  EMAIL_USER: user ? 'SET' : 'MISSING',
  EMAIL_PASS: pass ? 'SET' : 'MISSING',
  EMAIL_FROM: from
});

if (host && port && user && pass) {
  console.log('✅ Email credentials found - configuring SMTP transport');
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
  console.error('❌ Email credentials missing! Emails will NOT be sent.');
  console.error('🔧 Please set these environment variables in Render:');
  console.error('   - EMAIL_HOST (e.g., smtp.gmail.com)');
  console.error('   - EMAIL_PORT (e.g., 587)');
  console.error('   - EMAIL_USER (your email address)');
  console.error('   - EMAIL_PASS (your email password or app password)');
  console.error('   - EMAIL_FROM (sender email address)');
  
  // Use a transport that will fail gracefully
  transporter = nodemailer.createTransport({ 
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

export async function sendMail({ to, subject, html, text }) {
  try {
    console.log(`📧 Attempting to send email to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 From: ${from}`);
    
    // Check if we have proper email configuration
    if (!host || !port || !user || !pass) {
      console.error('❌ Cannot send email - missing SMTP configuration');
      console.error('📧 Email would have been sent to:', to);
      console.error('📧 Subject would have been:', subject);
      
      // Return a fake success to prevent app crashes, but log the issue
      return {
        messageId: 'fake-' + Date.now(),
        response: 'Email not sent - missing SMTP configuration'
      };
    }
    
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
    console.log(`📧 Response: ${info.response}`);
    
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
      subject,
      host,
      port,
      user: user ? 'SET' : 'MISSING'
    });
    throw error;
  }
}