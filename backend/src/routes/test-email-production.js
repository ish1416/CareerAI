import express from 'express';
import { sendMail } from '../config/mail.js';

const router = express.Router();

// Test email endpoint - accessible without auth for testing
router.post('/test-email-production', async (req, res) => {
  try {
    console.log('');
    console.log('🧪 TEST EMAIL ENDPOINT CALLED');
    console.log('');
    
    const testEmail = req.body.email || 'ishita1642006@gmail.com';
    
    const result = await sendMail({
      to: testEmail,
      subject: '🧪 CareerAI Production Email Test',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #3b82f6;">Email Test Successful!</h2>
          <p>If you're reading this, your email configuration is working correctly in production.</p>
          <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #e5e7eb;">
          <p style="color: #6b7280; font-size: 14px;">
            This is a test email from CareerAI backend.
          </p>
        </div>
      `,
      text: `
        Email Test Successful!
        
        If you're reading this, your email configuration is working correctly in production.
        
        Timestamp: ${new Date().toISOString()}
        Environment: ${process.env.NODE_ENV || 'development'}
        
        This is a test email from CareerAI backend.
      `
    });
    
    console.log('');
    console.log('✅ Test email sent successfully!');
    console.log('');
    
    res.json({ 
      success: true, 
      message: 'Test email sent successfully',
      messageId: result.messageId,
      to: testEmail,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('');
    console.error('❌ Test email failed!');
    console.error('');
    
    res.status(500).json({ 
      success: false, 
      error: error.message,
      details: {
        code: error.code,
        command: error.command,
        response: error.response
      },
      timestamp: new Date().toISOString()
    });
  }
});

// Get email configuration status
router.get('/email-config-status', (req, res) => {
  const config = {
    EMAIL_HOST: process.env.EMAIL_HOST ? 'SET' : 'NOT SET',
    EMAIL_PORT: process.env.EMAIL_PORT ? 'SET' : 'NOT SET',
    EMAIL_USER: process.env.EMAIL_USER ? 'SET' : 'NOT SET',
    EMAIL_PASS: process.env.EMAIL_PASS ? 'SET' : 'NOT SET',
    EMAIL_FROM: process.env.EMAIL_FROM || 'NOT SET',
    FRONTEND_URL: process.env.FRONTEND_URL || 'NOT SET',
    NODE_ENV: process.env.NODE_ENV || 'development'
  };
  
  const allSet = config.EMAIL_HOST === 'SET' && 
                 config.EMAIL_PORT === 'SET' && 
                 config.EMAIL_USER === 'SET' && 
                 config.EMAIL_PASS === 'SET';
  
  console.log('📊 Email Configuration Status:', config);
  
  res.json({
    configured: allSet,
    config,
    message: allSet 
      ? '✅ All email environment variables are set' 
      : '❌ Some email environment variables are missing'
  });
});

export default router;
