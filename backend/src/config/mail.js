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
  console.log('📧 SMTP Configuration:', {
    host,
    port,
    secure: port === 465,
    user,
    from
  });
  
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
    debug: true, // Always enable debug for better logs
    logger: true // Always enable logger
  });
  
  // Test connection on startup with timeout
  const testConnection = () => {
    const timeout = setTimeout(() => {
      console.error('❌ SMTP Connection Test Timeout (30s)');
      console.error('🔧 Check your EMAIL_* environment variables and network connectivity');
    }, 30000);
    
    transporter.verify((error, success) => {
      clearTimeout(timeout);
      if (error) {
        console.error('❌ SMTP Connection Test Failed:', error.message);
        console.error('🔧 Check your EMAIL_* environment variables');
      } else {
        console.log('✅ SMTP Connection Test Successful - Ready to send emails');
      }
    });
  };
  
  // Only test connection if not in production to avoid blocking startup
  if (process.env.NODE_ENV !== 'production') {
    testConnection();
  } else {
    console.log('📧 Production mode - skipping SMTP connection test to avoid blocking startup');
  }
} else {
  console.error('❌ Email credentials missing! Emails will NOT be sent.');
  console.error('🔧 Please set these environment variables in Render:');
  console.error('   - EMAIL_HOST (e.g., smtp.gmail.com)');
  console.error('   - EMAIL_PORT (e.g., 587)');
  console.error('   - EMAIL_USER (your email address)');
  console.error('   - EMAIL_PASS (your email password or app password)');
  console.error('   - EMAIL_FROM (sender email address)');
  console.error('');
  console.error('📊 Current values:');
  console.error('   EMAIL_HOST:', host || 'NOT SET');
  console.error('   EMAIL_PORT:', port || 'NOT SET');
  console.error('   EMAIL_USER:', user || 'NOT SET');
  console.error('   EMAIL_PASS:', pass ? 'SET (hidden)' : 'NOT SET');
  
  // Use a transport that will fail gracefully
  transporter = nodemailer.createTransport({ 
    streamTransport: true,
    newline: 'unix',
    buffer: true
  });
}

export async function sendMail({ to, subject, html, text }) {
  const timestamp = new Date().toISOString();
  const attemptId = `EMAIL_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                    📧 EMAIL ATTEMPT                   ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║ ID: ${attemptId.padEnd(49)} ║`);
  console.log(`║ Time: ${timestamp.padEnd(47)} ║`);
  console.log(`║ To: ${to.padEnd(51)} ║`);
  console.log(`║ Subject: ${subject.substring(0, 45).padEnd(45)} ║`);
  console.log(`║ From: ${from.padEnd(49)} ║`);
  console.log(`║ Host: ${(host || 'NOT SET').padEnd(49)} ║`);
  console.log(`║ Port: ${(port || 'NOT SET').toString().padEnd(49)} ║`);
  console.log(`║ User: ${(user || 'NOT SET').padEnd(49)} ║`);
  console.log(`║ Pass: ${(pass ? `SET (${pass.length} chars)` : 'NOT SET').padEnd(49)} ║`);
  console.log('╚═══════════════════════════════════════════════════════╝');
  
  try {
    // Check if we have proper email configuration
    if (!host || !port || !user || !pass) {
      console.log('');
      console.log('╔═══════════════════════════════════════════════════════╗');
      console.log('║                ❌ CONFIGURATION ERROR ❌              ║');
      console.log('╠═══════════════════════════════════════════════════════╣');
      console.log(`║ ID: ${attemptId.padEnd(49)} ║`);
      console.log(`║ Status: FAILED - Missing SMTP Config${' '.repeat(15)} ║`);
      console.log('║                                                       ║');
      console.log('║ Missing Variables:                                    ║');
      if (!host) console.log('║   ❌ EMAIL_HOST                                       ║');
      if (!port) console.log('║   ❌ EMAIL_PORT                                       ║');
      if (!user) console.log('║   ❌ EMAIL_USER                                       ║');
      if (!pass) console.log('║   ❌ EMAIL_PASS                                       ║');
      console.log('║                                                       ║');
      console.log('║ 🔧 FIX: Set environment variables in production      ║');
      console.log('╚═══════════════════════════════════════════════════════╝');
      console.log('');
      
      // Log to a centralized email log
      console.log(`[EMAIL_LOG] ${timestamp} | ${attemptId} | FAILED | CONFIG_MISSING | ${to} | ${subject}`);
      
      // Return a fake success to prevent app crashes, but log the issue
      return {
        messageId: 'fake-' + Date.now(),
        response: 'Email not sent - missing SMTP configuration',
        status: 'CONFIGURATION_ERROR'
      };
    }
    
    console.log('📤 Sending email via SMTP...');
    
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
    
    // Log detailed delivery info
    console.log('📬 Email delivery details:', {
      messageId: info.messageId,
      response: info.response,
      accepted: info.accepted,
      rejected: info.rejected,
      pending: info.pending,
      envelope: info.envelope
    });
    
    console.log('');
    const endTime = new Date().toISOString();
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                   ✅ EMAIL SUCCESS ✅                 ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log(`║ ID: ${attemptId.padEnd(49)} ║`);
    console.log(`║ Status: SENT SUCCESSFULLY${' '.repeat(25)} ║`);
    console.log(`║ Message ID: ${(info.messageId || 'N/A').substring(0, 39).padEnd(39)} ║`);
    console.log(`║ Response: ${(info.response || 'N/A').substring(0, 41).padEnd(41)} ║`);
    console.log(`║ Accepted: ${JSON.stringify(info.accepted || []).substring(0, 41).padEnd(41)} ║`);
    console.log(`║ Rejected: ${JSON.stringify(info.rejected || []).substring(0, 41).padEnd(41)} ║`);
    console.log(`║ End Time: ${endTime.padEnd(41)} ║`);
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
    
    // Log to centralized email log
    console.log(`[EMAIL_LOG] ${endTime} | ${attemptId} | SUCCESS | SENT | ${to} | ${subject} | ${info.messageId}`);
    
    return { ...info, status: 'SUCCESS', attemptId };
  } catch (error) {
    const errorTime = new Date().toISOString();
    
    console.log('');
    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                    ❌ EMAIL FAILED ❌                 ║');
    console.log('╠═══════════════════════════════════════════════════════╣');
    console.log(`║ ID: ${attemptId.padEnd(49)} ║`);
    console.log(`║ Status: FAILED${' '.repeat(37)} ║`);
    console.log(`║ Error: ${(error.message || 'Unknown error').substring(0, 44).padEnd(44)} ║`);
    console.log(`║ Code: ${(error.code || 'N/A').padEnd(46)} ║`);
    console.log(`║ Command: ${(error.command || 'N/A').padEnd(42)} ║`);
    console.log(`║ Response: ${(error.response || 'N/A').substring(0, 40).padEnd(40)} ║`);
    console.log(`║ Response Code: ${(error.responseCode || 'N/A').toString().padEnd(36)} ║`);
    console.log(`║ Error Time: ${errorTime.padEnd(39)} ║`);
    console.log('║                                                       ║');
    console.log('║ 🔧 Common Solutions:                                  ║');
    console.log('║   1. Check Gmail App Password                         ║');
    console.log('║   2. Verify 2-Step Verification enabled               ║');
    console.log('║   3. Check network/firewall settings                  ║');
    console.log('║   4. Try port 465 with secure: true                   ║');
    console.log('╚═══════════════════════════════════════════════════════╝');
    console.log('');
    
    // Log to centralized email log
    console.log(`[EMAIL_LOG] ${errorTime} | ${attemptId} | FAILED | ${error.code || 'UNKNOWN'} | ${to} | ${subject} | ${error.message}`);
    
    // Add more context to the error
    error.attemptId = attemptId;
    error.timestamp = errorTime;
    error.emailTo = to;
    error.emailSubject = subject;
    
    throw error;
  }
}