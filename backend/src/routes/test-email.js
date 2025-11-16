import express from 'express';
import { sendMail } from '../config/mail.js';

const router = express.Router();

router.post('/test-email', async (req, res) => {
  try {
    const result = await sendMail({
      to: 'ishita1642006@gmail.com',
      subject: 'Test Email from CareerAI',
      html: '<h1>Test Email</h1><p>If you receive this, email is working!</p>',
      text: 'Test Email - If you receive this, email is working!'
    });
    
    console.log('Email test result:', result);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Email test failed:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;