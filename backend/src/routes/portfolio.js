import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Portfolio Management
router.get('/portfolio', requireAuth, async (req, res) => {
  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
      include: { projects: true }
    });
    
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: req.user.id,
          title: `${req.user.name || 'My'} Portfolio`,
          description: 'Professional portfolio showcasing my work and skills',
          skills: ['JavaScript', 'React', 'Node.js'],
          isPublic: false
        },
        include: { projects: true }
      });
    }
    
    res.json({ portfolio });
  } catch (error) {
    console.error('Portfolio error:', error);
    res.status(500).json({ error: 'Failed to load portfolio' });
  }
});

router.put('/portfolio', requireAuth, async (req, res) => {
  try {
    const { title, description, skills, isPublic } = req.body;
    
    const portfolio = await prisma.portfolio.upsert({
      where: { userId: req.user.id },
      update: { title, description, skills, isPublic },
      create: {
        userId: req.user.id,
        title,
        description,
        skills,
        isPublic
      }
    });
    
    res.json({ success: true, portfolio });
  } catch (error) {
    console.error('Update portfolio error:', error);
    res.status(500).json({ error: 'Failed to update portfolio' });
  }
});

// Auto Portfolio Generator
router.post('/generate', requireAuth, async (req, res) => {
  try {
    const { resumeData, projects } = req.body;
    
    const prompt = `Generate a portfolio website structure from this resume data: ${JSON.stringify(resumeData)}. Return JSON with sections: hero, about, projects, skills, experience. Make it professional and engaging.`;
    
    const messages = [
      { role: 'system', content: 'You are a portfolio generator. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let generatedPortfolio;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 800 });
      generatedPortfolio = JSON.parse(aiResponse);
    } catch {
      generatedPortfolio = {
        hero: { name: 'John Doe', title: 'Software Developer', bio: 'Building amazing digital experiences' },
        about: { content: 'Passionate developer with expertise in modern web technologies.' },
        projects: [
          { name: 'E-commerce Platform', description: 'Full-stack web application', tech: ['React', 'Node.js'], url: '#' }
        ],
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        experience: [
          { company: 'Tech Corp', role: 'Developer', duration: '2022-Present', description: 'Built web applications' }
        ]
      };
    }
    
    res.json({ portfolio: generatedPortfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate portfolio' });
  }
});

// Projects Management
router.get('/projects', requireAuth, async (req, res) => {
  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id },
      include: { projects: true }
    });
    
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: req.user.id,
          title: 'My Portfolio',
          description: 'Professional portfolio'
        },
        include: { projects: true }
      });
    }
    
    res.json({ projects: portfolio.projects });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ error: 'Failed to load projects' });
  }
});

router.post('/projects', requireAuth, async (req, res) => {
  try {
    const { title, description, technologies, url, githubUrl, imageUrl, featured } = req.body;
    
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: req.user.id }
    });
    
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: req.user.id,
          title: 'My Portfolio',
          description: 'Professional portfolio'
        }
      });
    }
    
    const project = await prisma.project.create({
      data: {
        portfolioId: portfolio.id,
        title,
        description,
        technologies,
        url,
        githubUrl,
        imageUrl,
        featured: featured || false
      }
    });
    
    res.json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Testimonials
router.get('/testimonials', requireAuth, async (req, res) => {
  try {
    const testimonials = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'Senior Developer',
        company: 'Google',
        content: 'Atharv is an exceptional developer with great problem-solving skills.',
        rating: 5,
        approved: true,
        createdAt: new Date()
      },
      {
        id: 2,
        name: 'Mike Chen',
        role: 'Product Manager',
        company: 'Meta',
        content: 'Great to work with, delivers high-quality code on time.',
        rating: 5,
        approved: true,
        createdAt: new Date()
      }
    ];
    
    res.json({ testimonials });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load testimonials' });
  }
});

router.post('/testimonials', requireAuth, async (req, res) => {
  try {
    const { name, role, company, content, rating } = req.body;
    
    const testimonial = {
      id: Date.now(),
      name,
      role,
      company,
      content,
      rating,
      approved: false,
      createdAt: new Date()
    };
    
    res.json({ testimonial });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create testimonial' });
  }
});

// Domain Management
router.get('/domains', requireAuth, async (req, res) => {
  try {
    const domains = [
      { domain: 'atharv.careerai.dev', type: 'subdomain', active: true, ssl: true },
      { domain: 'atharv.dev', type: 'custom', active: false, ssl: false, pending: true }
    ];
    
    res.json({ domains });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load domains' });
  }
});

router.post('/domains', requireAuth, async (req, res) => {
  try {
    const { domain, type } = req.body;
    
    // Mock domain setup
    const domainRecord = {
      domain,
      type,
      active: type === 'subdomain',
      ssl: type === 'subdomain',
      pending: type === 'custom',
      createdAt: new Date()
    };
    
    res.json({ domain: domainRecord, message: 'Domain setup initiated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to setup domain' });
  }
});

// Analytics
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const analytics = {
      overview: {
        totalViews: 1250,
        uniqueVisitors: 890,
        recruiterViews: 23,
        projectClicks: 156
      },
      traffic: [
        { date: '2024-01-01', views: 45, visitors: 32 },
        { date: '2024-01-02', views: 52, visitors: 38 },
        { date: '2024-01-03', views: 38, visitors: 28 }
      ],
      sources: [
        { source: 'Direct', visits: 450, percentage: 36 },
        { source: 'LinkedIn', visits: 320, percentage: 26 },
        { source: 'GitHub', visits: 280, percentage: 22 },
        { source: 'Google', visits: 200, percentage: 16 }
      ],
      topProjects: [
        { name: 'CareerAI Platform', clicks: 89 },
        { name: 'E-commerce Dashboard', clicks: 67 }
      ]
    };
    
    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Templates
router.get('/templates', async (req, res) => {
  try {
    const templates = [
      {
        id: 'modern',
        name: 'Modern',
        description: 'Clean and professional design',
        preview: '/api/placeholder/300/200',
        features: ['Responsive', 'Dark Mode', 'Animations']
      },
      {
        id: 'minimal',
        name: 'Minimal',
        description: 'Simple and elegant layout',
        preview: '/api/placeholder/300/200',
        features: ['Fast Loading', 'SEO Optimized', 'Mobile First']
      },
      {
        id: 'creative',
        name: 'Creative',
        description: 'Bold and artistic design',
        preview: '/api/placeholder/300/200',
        features: ['Interactive', 'Colorful', 'Unique Layout']
      }
    ];
    
    res.json({ templates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load templates' });
  }
});

export default router;