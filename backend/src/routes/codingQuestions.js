import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import CodingQuestionsService from '../services/codingQuestionsService.js';

const router = express.Router();
const codingService = new CodingQuestionsService();

// Get questions by filters
router.get('/questions', requireAuth, async (req, res) => {
  try {
    const { company, topic, difficulty, platform, page = 1, limit = 20 } = req.query;
    
    const questions = await codingService.getQuestions({
      company,
      topic,
      difficulty,
      platform,
      page: parseInt(page),
      limit: parseInt(limit)
    });
    
    res.json({ questions });
  } catch (error) {
    console.error('Get questions error:', error);
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

// Get question by ID
router.get('/questions/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const question = await codingService.getQuestionById(id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    res.json({ question });
  } catch (error) {
    console.error('Get question error:', error);
    res.status(500).json({ error: 'Failed to fetch question' });
  }
});

// Submit solution
router.post('/questions/:id/submit', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { code, language, testResults } = req.body;
    const userId = req.user.id;
    
    const submission = await codingService.submitSolution({
      questionId: id,
      userId,
      code,
      language,
      testResults
    });
    
    res.json({ submission });
  } catch (error) {
    console.error('Submit solution error:', error);
    res.status(500).json({ error: 'Failed to submit solution' });
  }
});

// Get user progress
router.get('/progress', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const progress = await codingService.getUserProgress(userId);
    
    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get companies list
router.get('/companies', requireAuth, async (req, res) => {
  try {
    const companies = await codingService.getCompanies();
    res.json({ companies });
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({ error: 'Failed to fetch companies' });
  }
});

// Get topics list
router.get('/topics', requireAuth, async (req, res) => {
  try {
    const topics = await codingService.getTopics();
    res.json({ topics });
  } catch (error) {
    console.error('Get topics error:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
});

// Get user statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await codingService.getUserStats(userId);
    
    res.json({ stats });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

export default router;