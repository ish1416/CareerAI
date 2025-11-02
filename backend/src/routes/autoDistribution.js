import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    const stats = {
      totalSent: 47,
      responseRate: 23,
      interviews: 8,
      todaySent: 3,
      isActive: true
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = [
      { id: 1, company: 'Google', position: 'Software Engineer', status: 'sent', sentAt: '2 hours ago', opened: true },
      { id: 2, company: 'Microsoft', position: 'Senior Developer', status: 'viewed', sentAt: '1 day ago', opened: false }
    ];
    res.json({ campaigns });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

router.post('/start', async (req, res) => {
  try {
    res.json({ message: 'Campaign started successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start campaign' });
  }
});

export default router;