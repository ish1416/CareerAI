import express from 'express';
const router = express.Router();

router.get('/data', async (req, res) => {
  try {
    const data = {
      marketAverage: 120000,
      targetMin: 110000,
      targetMax: 140000
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch salary data' });
  }
});

router.get('/tips', async (req, res) => {
  try {
    const tips = [
      { title: 'Research Market Rates', description: 'Know your worth before negotiating' },
      { title: 'Highlight Your Value', description: 'Emphasize your unique contributions' }
    ];
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch tips' });
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { currentOffer } = req.body;
    const data = {
      marketAverage: 120000,
      targetMin: 110000,
      targetMax: 140000,
      analysis: currentOffer > 120000 ? 'Above market average' : 'Below market average'
    };
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze salary' });
  }
});

export default router;