import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import WebScrapingService from '../services/webScrapingService.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const scrapingService = new WebScrapingService();

// Scrape job details from URL
router.post('/job-details', requireAuth, async (req, res) => {
  try {
    const { jobUrl } = req.body;
    
    if (!jobUrl) {
      return res.status(400).json({ error: 'Job URL is required' });
    }

    const jobDetails = await scrapingService.scrapeJobDetails(jobUrl);
    
    if (!jobDetails) {
      return res.status(404).json({ error: 'Could not scrape job details from URL' });
    }

    res.json({ jobDetails });
  } catch (error) {
    console.error('Job scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape job details' });
  }
});

// Scrape company information
router.post('/company-info', requireAuth, async (req, res) => {
  try {
    const { companyName } = req.body;
    
    if (!companyName) {
      return res.status(400).json({ error: 'Company name is required' });
    }

    const companyInfo = await scrapingService.scrapeCompanyInfo(companyName);
    
    res.json({ companyInfo });
  } catch (error) {
    console.error('Company scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape company information' });
  }
});

// Scrape salary data
router.post('/salary-data', requireAuth, async (req, res) => {
  try {
    const { jobTitle, location = 'United States' } = req.body;
    
    if (!jobTitle) {
      return res.status(400).json({ error: 'Job title is required' });
    }

    const salaryData = await scrapingService.scrapeSalaryData(jobTitle, location);
    
    res.json({ salaryData });
  } catch (error) {
    console.error('Salary scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape salary data' });
  }
});

// Get trending skills
router.get('/trending-skills', requireAuth, async (req, res) => {
  try {
    const trendingSkills = await scrapingService.scrapeTrendingSkills();
    
    res.json({ trendingSkills });
  } catch (error) {
    console.error('Skills scraping error:', error);
    res.status(500).json({ error: 'Failed to scrape trending skills' });
  }
});

// Get job market insights
router.post('/market-insights', requireAuth, async (req, res) => {
  try {
    const { industry } = req.body;
    
    if (!industry) {
      return res.status(400).json({ error: 'Industry is required' });
    }

    const insights = await scrapingService.scrapeJobMarketInsights(industry);
    
    res.json({ insights });
  } catch (error) {
    console.error('Market insights error:', error);
    res.status(500).json({ error: 'Failed to scrape market insights' });
  }
});

// Batch scrape multiple job URLs
router.post('/batch-jobs', requireAuth, async (req, res) => {
  try {
    const { jobUrls } = req.body;
    
    if (!Array.isArray(jobUrls) || jobUrls.length === 0) {
      return res.status(400).json({ error: 'Job URLs array is required' });
    }

    if (jobUrls.length > 10) {
      return res.status(400).json({ error: 'Maximum 10 URLs allowed per batch' });
    }

    const results = await scrapingService.batchScrape(
      jobUrls, 
      (url) => scrapingService.scrapeJobDetails(url),
      2000 // 2 second delay between requests
    );
    
    res.json({ 
      results,
      processed: results.length,
      total: jobUrls.length
    });
  } catch (error) {
    console.error('Batch scraping error:', error);
    res.status(500).json({ error: 'Failed to batch scrape jobs' });
  }
});

// Auto-fill job application from URL
router.post('/auto-fill', requireAuth, async (req, res) => {
  try {
    const { jobUrl } = req.body;
    
    if (!jobUrl) {
      return res.status(400).json({ error: 'Job URL is required' });
    }

    const jobDetails = await scrapingService.scrapeJobDetails(jobUrl);
    
    if (!jobDetails) {
      return res.status(404).json({ error: 'Could not extract job details' });
    }

    // Format for job application form
    const autoFillData = {
      company: jobDetails.company || '',
      position: jobDetails.title || '',
      location: jobDetails.location || '',
      salary: jobDetails.salary || '',
      jobUrl: jobUrl,
      notes: `Scraped from: ${jobUrl}\n\nRequirements: ${jobDetails.requirements || 'N/A'}`
    };

    res.json({ autoFillData, rawData: jobDetails });
  } catch (error) {
    console.error('Auto-fill error:', error);
    res.status(500).json({ error: 'Failed to auto-fill job data' });
  }
});

export default router;