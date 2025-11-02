import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

router.post('/analyze', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `Analyze this professional communication for tone, clarity, and professionalism. Provide specific suggestions for improvement: "${message}"`;
    
    const aiResponse = await groqChat([{ role: 'user', content: prompt }]);
    
    const analysis = {
      tone: 'Professional',
      clarity: 8,
      suggestions: [
        'Consider using more active voice',
        'Add specific examples to support your points',
        'Use more confident language'
      ]
    };
    
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze communication' });
  }
});

export default router;