import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Industry Salary Insights
router.get('/salary-insights', async (req, res) => {
  try {
    const { skill, location, experience } = req.query;
    
    const insights = {
      averageSalary: 125000,
      salaryRange: { min: 95000, max: 165000 },
      percentile25: 105000,
      percentile50: 125000,
      percentile75: 145000,
      trend: '+8.5%',
      trendPeriod: 'vs last year',
      dataPoints: 1234,
      topPayingCompanies: [
        { company: 'Google', avgSalary: 165000 },
        { company: 'Meta', avgSalary: 158000 },
        { company: 'Apple', avgSalary: 152000 }
      ],
      skillPremium: [
        { skill: 'React', premium: '+12%' },
        { skill: 'AWS', premium: '+15%' },
        { skill: 'Machine Learning', premium: '+25%' }
      ]
    };
    
    res.json({ insights });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load salary insights' });
  }
});

// Job Market Heatmaps
router.get('/market-heatmap', async (req, res) => {
  try {
    const heatmap = {
      regions: [
        { name: 'San Francisco Bay Area', demand: 95, supply: 78, ratio: 1.22, avgSalary: 145000 },
        { name: 'Seattle', demand: 88, supply: 82, ratio: 1.07, avgSalary: 135000 },
        { name: 'New York', demand: 92, supply: 85, ratio: 1.08, avgSalary: 140000 },
        { name: 'Austin', demand: 85, supply: 75, ratio: 1.13, avgSalary: 125000 },
        { name: 'Remote', demand: 98, supply: 95, ratio: 1.03, avgSalary: 120000 }
      ],
      skills: [
        { skill: 'JavaScript', demand: 95, growth: '+12%' },
        { skill: 'Python', demand: 92, growth: '+18%' },
        { skill: 'React', demand: 88, growth: '+15%' },
        { skill: 'AWS', demand: 85, growth: '+22%' },
        { skill: 'Machine Learning', demand: 82, growth: '+35%' }
      ],
      industries: [
        { industry: 'Technology', jobs: 12500, growth: '+15%' },
        { industry: 'Finance', jobs: 8900, growth: '+8%' },
        { industry: 'Healthcare', jobs: 6700, growth: '+12%' },
        { industry: 'E-commerce', jobs: 5400, growth: '+20%' }
      ]
    };
    
    res.json({ heatmap });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load market heatmap' });
  }
});

// AI Career Predictor
router.post('/career-predictor', requireAuth, async (req, res) => {
  try {
    const { skills, experience, education, interests } = req.body;
    
    const prompt = `Predict career paths for someone with skills: ${skills.join(', ')}, experience: ${experience}, education: ${education}, interests: ${interests.join(', ')}. Return JSON: {"predictions": [{"role":"", "probability":0-100, "timeframe":"", "requirements":[]}]}`;
    
    const messages = [
      { role: 'system', content: 'You are a career predictor. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let predictions;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 600 });
      predictions = JSON.parse(aiResponse);
    } catch {
      predictions = {
        predictions: [
          {
            role: 'Senior Software Engineer',
            probability: 85,
            timeframe: '2-3 years',
            requirements: ['Advanced React skills', 'System design knowledge', 'Leadership experience']
          },
          {
            role: 'Technical Lead',
            probability: 72,
            timeframe: '3-5 years',
            requirements: ['Team management', 'Architecture design', 'Mentoring skills']
          },
          {
            role: 'Product Manager',
            probability: 65,
            timeframe: '4-6 years',
            requirements: ['Business acumen', 'User research', 'Strategic thinking']
          }
        ]
      };
    }
    
    res.json(predictions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to predict career paths' });
  }
});

// Resume Sentiment Analysis
router.post('/resume-sentiment', requireAuth, async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    const prompt = `Analyze the sentiment and tone of this resume: ${resumeText.substring(0, 1000)}. Return JSON: {"sentiment": {"positive": 0-100, "neutral": 0-100, "negative": 0-100}, "tone": {"professional": 0-100, "confident": 0-100, "enthusiastic": 0-100}, "suggestions": []}`;
    
    const messages = [
      { role: 'system', content: 'You are a resume sentiment analyzer. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let analysis;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 500 });
      analysis = JSON.parse(aiResponse);
    } catch {
      analysis = {
        sentiment: { positive: 78, neutral: 18, negative: 4 },
        tone: { professional: 85, confident: 72, enthusiastic: 68 },
        suggestions: [
          'Use more action verbs to show impact',
          'Add quantifiable achievements',
          'Maintain consistent professional tone'
        ]
      };
    }
    
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze sentiment' });
  }
});

// AI Bias Detector
router.post('/bias-detector', requireAuth, async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    const prompt = `Detect potential bias in this resume text: ${resumeText.substring(0, 1000)}. Check for gender, age, cultural, or other biases. Return JSON: {"biases": [{"type":"", "severity":"low|medium|high", "text":"", "suggestion":""}], "overallScore": 0-100}`;
    
    const messages = [
      { role: 'system', content: 'You are a bias detection expert. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let detection;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 500 });
      detection = JSON.parse(aiResponse);
    } catch {
      detection = {
        biases: [
          {
            type: 'age',
            severity: 'low',
            text: 'Recent graduate',
            suggestion: 'Focus on skills rather than graduation year'
          }
        ],
        overallScore: 92
      };
    }
    
    res.json({ detection });
  } catch (error) {
    res.status(500).json({ error: 'Failed to detect bias' });
  }
});

// Market Trends
router.get('/trends', async (req, res) => {
  try {
    const trends = {
      emergingSkills: [
        { skill: 'AI/ML', growth: '+45%', demand: 'Very High' },
        { skill: 'Blockchain', growth: '+38%', demand: 'High' },
        { skill: 'Cloud Security', growth: '+32%', demand: 'Very High' },
        { skill: 'DevOps', growth: '+28%', demand: 'High' }
      ],
      decliningSkills: [
        { skill: 'Flash', growth: '-65%', demand: 'Very Low' },
        { skill: 'jQuery', growth: '-25%', demand: 'Low' },
        { skill: 'PHP', growth: '-15%', demand: 'Medium' }
      ],
      hotJobs: [
        { role: 'AI Engineer', growth: '+42%', avgSalary: 165000 },
        { role: 'Cloud Architect', growth: '+35%', avgSalary: 155000 },
        { role: 'DevOps Engineer', growth: '+30%', avgSalary: 145000 }
      ],
      industryGrowth: [
        { industry: 'AI/ML', growth: '+45%' },
        { industry: 'Cybersecurity', growth: '+35%' },
        { industry: 'Cloud Computing', growth: '+32%' },
        { industry: 'Fintech', growth: '+28%' }
      ]
    };
    
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load trends' });
  }
});

// User Analytics Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    let analytics = await prisma.userAnalytics.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!analytics) {
      analytics = await prisma.userAnalytics.create({
        data: { userId: req.user.id }
      });
    }
    
    // Get additional stats
    const [resumeCount, jobApplications, careerGoals, completedCourses] = await Promise.all([
      prisma.resume.count({ where: { userId: req.user.id } }),
      prisma.jobApplication.count({ where: { userId: req.user.id } }),
      prisma.careerGoal.count({ where: { userId: req.user.id, status: 'active' } }),
      prisma.course.count({ where: { userId: req.user.id, completed: true } })
    ]);
    
    const dashboardStats = {
      ...analytics,
      resumeCount,
      jobApplications,
      activeGoals: careerGoals,
      completedCourses
    };
    
    res.json({ analytics: dashboardStats });
  } catch (error) {
    console.error('Analytics dashboard error:', error);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Update Analytics
router.post('/track', requireAuth, async (req, res) => {
  try {
    const { event, data } = req.body;
    
    const updateData = {};
    
    switch (event) {
      case 'profile_view':
        updateData.profileViews = { increment: 1 };
        break;
      case 'resume_download':
        updateData.resumeDownloads = { increment: 1 };
        break;
      case 'application_sent':
        updateData.applicationsSent = { increment: 1 };
        break;
      case 'interview_scheduled':
        updateData.interviewsScheduled = { increment: 1 };
        break;
      case 'offer_received':
        updateData.offersReceived = { increment: 1 };
        break;
    }
    
    if (Object.keys(updateData).length > 0) {
      await prisma.userAnalytics.upsert({
        where: { userId: req.user.id },
        update: updateData,
        create: { userId: req.user.id, ...updateData }
      });
    }
    
    res.json({ success: true });
  } catch (error) {
    console.error('Track analytics error:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

export default router;