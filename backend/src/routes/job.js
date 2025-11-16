import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadJD, compare } from '../controllers/jobController.js';
import JobService from '../services/jobService.js';

const router = Router();
const uploadMw = multer({ dest: 'uploads/' });
const jobService = new JobService();

router.post('/upload', requireAuth, uploadMw.single('file'), uploadJD);
router.post('/compare', requireAuth, compare);

// Job Search
router.get('/search', async (req, res) => {
  try {
    const { query = 'software engineer', location = 'us', page = 1, limit = 20 } = req.query;
    
    const jobResults = await jobService.searchJobs(query, location, parseInt(page), parseInt(limit));
    
    res.json(jobResults);
  } catch (error) {
    console.error('Job search error:', error);
    res.status(500).json({ error: 'Failed to search jobs' });
  }
});

// Get job categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await jobService.getJobCategories();
    
    res.json({ categories });
  } catch (error) {
    console.error('Categories error:', error);
    res.status(500).json({ error: 'Failed to load categories' });
  }
});

// Get trending jobs
router.get('/trending', async (req, res) => {
  try {
    const trendingJobs = await jobService.getTrendingJobs(10);
    
    res.json({ trendingJobs });
  } catch (error) {
    console.error('Trending jobs error:', error);
    res.status(500).json({ error: 'Failed to load trending jobs' });
  }
});

// Get salary insights
router.get('/salary/:jobTitle', async (req, res) => {
  try {
    const { jobTitle } = req.params;
    const { location = 'us' } = req.query;
    
    const salaryStats = await jobService.getSalaryStats(jobTitle, location);
    
    const salaryData = {
      jobTitle,
      location,
      averageSalary: Math.round(salaryStats.average),
      salaryRange: {
        min: Math.round(salaryStats.min),
        max: Math.round(salaryStats.max)
      },
      distribution: salaryStats.distribution
    };
    
    res.json(salaryData);
  } catch (error) {
    console.error('Salary insights error:', error);
    res.status(500).json({ error: 'Failed to load salary insights' });
  }
});

export default router;