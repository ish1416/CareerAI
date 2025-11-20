import express from 'express';
import { sendMail } from '../config/mail.js';

const router = express.Router();

// Simple email test endpoint - no auth required for testing
router.post('/email-test', async (req, res) => {
  try {
    console.log('');
    console.log('🧪 EMAIL TEST ENDPOINT CALLED');
    console.log('Request body:', req.body);
    console.log('');
    
    const testEmail = req.body.email || process.env.EMAIL_USER || 'test@example.com';
    
    const result = await sendMail({
      to: testEmail,
      subject: '🧪 CareerAI Email Test - ' + new Date().toLocaleString(),
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #3b82f6; margin-bottom: 20px;">✅ Email Test Successful!</h2>
          <p style="margin-bottom: 15px;">If you're reading this email, your SMTP configuration is working correctly!</p>
          
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Test Details:</h3>
            <ul style="margin: 10px 0; padding-left: 20px;">
              <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
              <li><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</li>
              <li><strong>Host:</strong> ${process.env.EMAIL_HOST || 'Not set'}</li>
              <li><strong>Port:</strong> ${process.env.EMAIL_PORT || 'Not set'}</li>
              <li><strong>From:</strong> ${process.env.EMAIL_FROM || 'Not set'}</li>
            </ul>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            This is an automated test email from CareerAI backend system.
          </p>
        </div>
      `,
      text: `
EMAIL TEST SUCCESSFUL!

If you're reading this email, your SMTP configuration is working correctly!

Test Details:
- Timestamp: ${new Date().toISOString()}
- Environment: ${process.env.NODE_ENV || 'development'}
- Host: ${process.env.EMAIL_HOST || 'Not set'}
- Port: ${process.env.EMAIL_PORT || 'Not set'}
- From: ${process.env.EMAIL_FROM || 'Not set'}

This is an automated test email from CareerAI backend system.
      `
    });
    
    console.log('');
    console.log('✅ EMAIL TEST COMPLETED SUCCESSFULLY');
    console.log('');
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      details: {
        messageId: result.messageId,
        to: testEmail,
        timestamp: new Date().toISOString(),
        status: result.status || 'SENT',
        attemptId: result.attemptId
      }
    });
    
  } catch (error) {
    console.log('');
    console.log('❌ EMAIL TEST FAILED');
    console.log('Error details:', error);
    console.log('');
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response,
        responseCode: error.responseCode,
        attemptId: error.attemptId,
        timestamp: error.timestamp
      }
    });
  }
});

// Get current email configuration status
router.get('/email-status', (req, res) => {
  const config = {
    EMAIL_HOST: process.env.EMAIL_HOST ? '✅ SET' : '❌ NOT SET',
    EMAIL_PORT: process.env.EMAIL_PORT ? '✅ SET' : '❌ NOT SET',
    EMAIL_USER: process.env.EMAIL_USER ? '✅ SET' : '❌ NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? '✅ SET' : '❌ NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM || '❌ NOT SET',
    FRONTEND_URL: process.env.FRONTEND_URL || '❌ NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  const allSet = process.env.EMAIL_HOST && 
                 process.env.EMAIL_PORT && 
                 process.env.EMAIL_USER && 
                 process.env.EMAIL_PASS;
  
  console.log('📊 EMAIL CONFIGURATION STATUS CHECK:');
  console.log(config);
  console.log('All configured:', allSet ? '✅ YES' : '❌ NO');
  console.log('');
  
  res.json({
    configured: !!allSet,
    config,
    message: allSet 
      ? '✅ All email environment variables are configured' 
      : '❌ Some email environment variables are missing',
    instructions: allSet ? null : {
      message: 'To fix email issues, set these environment variables:',
      variables: [
        'EMAIL_HOST=smtp.gmail.com',
        'EMAIL_PORT=587',
        'EMAIL_USER=your-email@gmail.com',
        'EMAIL_PASS=your-app-password',
        'EMAIL_FROM=your-email@gmail.com'
      ]
    }
  });
});

export default router;