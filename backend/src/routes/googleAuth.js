import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import GoogleCalendarService from '../services/googleCalendar.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get Google authorization URL
router.get('/auth/google/url', requireAuth, async (req, res) => {
  try {
    const calendarService = new GoogleCalendarService();
    const authUrl = calendarService.getAuthUrl();
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Google auth URL error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

// Handle Google OAuth callback
router.post('/auth/google/callback', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const calendarService = new GoogleCalendarService();
    const tokens = await calendarService.getTokens(code);
    
    // Store tokens in database
    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        googleTokens: JSON.stringify(tokens),
        googleConnected: true
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Google Calendar connected successfully' 
    });
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'Failed to connect Google Calendar' });
  }
});

// Disconnect Google Calendar
router.post('/auth/google/disconnect', requireAuth, async (req, res) => {
  try {
    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        googleTokens: null,
        googleConnected: false
      }
    });
    
    res.json({ 
      success: true, 
      message: 'Google Calendar disconnected' 
    });
  } catch (error) {
    console.error('Google disconnect error:', error);
    res.status(500).json({ error: 'Failed to disconnect Google Calendar' });
  }
});

// Check Google connection status
router.get('/auth/google/status', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { googleConnected: true }
    });
    
    res.json({ 
      connected: user?.googleConnected || false 
    });
  } catch (error) {
    console.error('Google status error:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
});

export default router;