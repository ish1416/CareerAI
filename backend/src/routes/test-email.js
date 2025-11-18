import { Router } from 'express';
import { sendMail } from '../config/mail.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Test email endpoint (admin only)
router.post('/test-email', requireAuth, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { to, subject = 'Test Email from CareerAI' } = req.body;
    
    if (!to) {
      return res.status(400).json({ error: 'Email address required' });
    }

    const html = `
      <h2>Test Email</h2>
      <p>This is a test email from CareerAI backend.</p>
      <p>If you received this, email configuration is working correctly.</p>
      <p>Sent at: ${new Date().toISOString()}</p>
    `;

    const text = `
      Test Email
      This is a test email from CareerAI backend.
      If you received this, email configuration is working correctly.
      Sent at: ${new Date().toISOString()}
    `;

    const result = await sendMail({
      to,
      subject,
      html,
      text
    });

    res.json({ 
      success: true, 
      messageId: result.messageId,
      message: 'Test email sent successfully'
    });

  } catch (error) {
    console.error('Test email failed:', error);
    res.status(500).json({ 
      error: 'Failed to send test email',
      details: error.message
    });
  }
});

export default router;