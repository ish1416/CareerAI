import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import SEOService from '../services/seoService.js';

const router = express.Router();
const seoService = new SEOService();

// Analyze page SEO
router.post('/analyze-page', requireAuth, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const analysis = await seoService.analyzePage(url);
    
    res.json({ analysis });
  } catch (error) {
    console.error('SEO analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze page SEO' });
  }
});

// Keyword research
router.post('/keyword-research', requireAuth, async (req, res) => {
  try {
    const { seed, location = 'US' } = req.body;
    
    if (!seed) {
      return res.status(400).json({ error: 'Seed keyword is required' });
    }

    const research = await seoService.keywordResearch(seed, location);
    
    res.json({ research });
  } catch (error) {
    console.error('Keyword research error:', error);
    res.status(500).json({ error: 'Failed to perform keyword research' });
  }
});

// Competitor analysis
router.post('/competitor-analysis', requireAuth, async (req, res) => {
  try {
    const { domain, competitors = [] } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const analysis = await seoService.analyzeCompetitors(domain, competitors);
    
    res.json({ analysis });
  } catch (error) {
    console.error('Competitor analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze competitors' });
  }
});

// Backlink analysis
router.post('/backlink-analysis', requireAuth, async (req, res) => {
  try {
    const { domain } = req.body;
    
    if (!domain) {
      return res.status(400).json({ error: 'Domain is required' });
    }

    const analysis = await seoService.analyzeBacklinks(domain);
    
    res.json({ analysis });
  } catch (error) {
    console.error('Backlink analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze backlinks' });
  }
});

// Technical SEO audit
router.post('/technical-audit', requireAuth, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const audit = await seoService.technicalAudit(url);
    
    res.json({ audit });
  } catch (error) {
    console.error('Technical audit error:', error);
    res.status(500).json({ error: 'Failed to perform technical audit' });
  }
});

// Content optimization
router.post('/optimize-content', requireAuth, async (req, res) => {
  try {
    const { content, targetKeyword } = req.body;
    
    if (!content || !targetKeyword) {
      return res.status(400).json({ error: 'Content and target keyword are required' });
    }

    const optimization = await seoService.optimizeContent(content, targetKeyword);
    
    res.json({ optimization });
  } catch (error) {
    console.error('Content optimization error:', error);
    res.status(500).json({ error: 'Failed to optimize content' });
  }
});

// Rank tracking
router.post('/track-rankings', requireAuth, async (req, res) => {
  try {
    const { domain, keywords } = req.body;
    
    if (!domain || !Array.isArray(keywords)) {
      return res.status(400).json({ error: 'Domain and keywords array are required' });
    }

    const rankings = await seoService.trackRankings(domain, keywords);
    
    res.json({ rankings });
  } catch (error) {
    console.error('Rank tracking error:', error);
    res.status(500).json({ error: 'Failed to track rankings' });
  }
});

// SEO dashboard - comprehensive analysis
router.post('/dashboard', requireAuth, async (req, res) => {
  try {
    const { url, domain, keywords = [] } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    const [pageAnalysis, technicalAudit, rankings] = await Promise.all([
      seoService.analyzePage(url),
      seoService.technicalAudit(url),
      domain && keywords.length ? seoService.trackRankings(domain, keywords) : null
    ]);

    const dashboard = {
      url,
      pageAnalysis,
      technicalAudit,
      rankings,
      overallScore: calculateOverallScore(pageAnalysis, technicalAudit),
      generatedAt: new Date().toISOString()
    };
    
    res.json({ dashboard });
  } catch (error) {
    console.error('SEO dashboard error:', error);
    res.status(500).json({ error: 'Failed to generate SEO dashboard' });
  }
});

// Helper function to calculate overall SEO score
function calculateOverallScore(pageAnalysis, technicalAudit) {
  let score = 100;
  
  // Page analysis scoring
  if (pageAnalysis) {
    if (!pageAnalysis.title || pageAnalysis.titleLength < 30 || pageAnalysis.titleLength > 60) score -= 10;
    if (!pageAnalysis.metaDescription || pageAnalysis.metaDescriptionLength < 120 || pageAnalysis.metaDescriptionLength > 160) score -= 10;
    if (pageAnalysis.h1Count !== 1) score -= 5;
    if (pageAnalysis.imagesWithoutAlt > 0) score -= 5;
    if (pageAnalysis.wordCount < 300) score -= 10;
  }
  
  // Technical audit scoring
  if (technicalAudit) {
    if (!technicalAudit.https) score -= 15;
    if (!technicalAudit.hasRobotsTxt) score -= 5;
    if (!technicalAudit.hasSitemap) score -= 5;
    if (!technicalAudit.mobileViewport) score -= 10;
    if (!technicalAudit.hasStructuredData) score -= 5;
    if (!technicalAudit.openGraph.title) score -= 5;
  }
  
  return Math.max(0, score);
}

export default router;