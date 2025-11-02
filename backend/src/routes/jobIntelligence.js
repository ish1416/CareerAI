import express from 'express';
const router = express.Router();

router.get('/feed', async (req, res) => {
  try {
    const feed = [
      { id: 1, title: 'Tech Hiring Surge', description: 'Major tech companies increasing hiring by 25%', timestamp: '2 hours ago' },
      { id: 2, title: 'Remote Work Trends', description: 'Remote positions up 40% this quarter', timestamp: '4 hours ago' }
    ];
    res.json({ feed });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

router.get('/trends', async (req, res) => {
  try {
    const trends = [
      { id: 1, skill: 'React', growth: 15 },
      { id: 2, skill: 'Python', growth: 12 },
      { id: 3, skill: 'AWS', growth: 18 }
    ];
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trends' });
  }
});

export default router;