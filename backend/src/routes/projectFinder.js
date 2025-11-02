import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';

const router = express.Router();

// Internships
router.get('/internships', async (req, res) => {
  try {
    const internships = [
      {
        id: 1,
        title: 'Software Engineering Intern',
        company: 'Google',
        location: 'Mountain View, CA',
        duration: '3 months',
        stipend: '$8000/month',
        skills: ['JavaScript', 'React', 'Python'],
        deadline: '2024-02-15',
        type: 'remote',
        description: 'Work on cutting-edge web technologies'
      },
      {
        id: 2,
        title: 'Data Science Intern',
        company: 'Meta',
        location: 'Menlo Park, CA',
        duration: '4 months',
        stipend: '$7500/month',
        skills: ['Python', 'Machine Learning', 'SQL'],
        deadline: '2024-02-20',
        type: 'hybrid',
        description: 'Analyze user behavior data'
      }
    ];
    
    res.json({ internships });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load internships' });
  }
});

// Hackathons
router.get('/hackathons', async (req, res) => {
  try {
    const hackathons = [
      {
        id: 1,
        name: 'TechCrunch Disrupt Hackathon',
        organizer: 'TechCrunch',
        startDate: '2024-02-10',
        endDate: '2024-02-12',
        location: 'San Francisco, CA',
        prize: '$50,000',
        theme: 'AI & Sustainability',
        participants: 500,
        registrationDeadline: '2024-02-05'
      },
      {
        id: 2,
        name: 'NASA Space Apps Challenge',
        organizer: 'NASA',
        startDate: '2024-03-15',
        endDate: '2024-03-17',
        location: 'Virtual',
        prize: '$25,000',
        theme: 'Space Technology',
        participants: 1000,
        registrationDeadline: '2024-03-10'
      }
    ];
    
    res.json({ hackathons });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load hackathons' });
  }
});

// AI Matchmaking
router.post('/match', requireAuth, async (req, res) => {
  try {
    const { skills, interests, experience } = req.body;
    
    const prompt = `Match projects for someone with skills: ${skills.join(', ')}, interests: ${interests.join(', ')}, experience: ${experience}. Return JSON: [{"title":"","description":"","skills":[],"difficulty":"","type":""}]`;
    
    const messages = [
      { role: 'system', content: 'You are a project matchmaker. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let matches;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 600 });
      matches = JSON.parse(aiResponse);
    } catch {
      matches = [
        {
          title: 'E-commerce Platform',
          description: 'Build a full-stack online store',
          skills: ['React', 'Node.js', 'MongoDB'],
          difficulty: 'Intermediate',
          type: 'Web Development'
        },
        {
          title: 'AI Chatbot',
          description: 'Create an intelligent customer service bot',
          skills: ['Python', 'NLP', 'Machine Learning'],
          difficulty: 'Advanced',
          type: 'AI/ML'
        }
      ];
    }
    
    res.json({ matches });
  } catch (error) {
    res.status(500).json({ error: 'Failed to find matches' });
  }
});

// Collaboration Hub
router.get('/teams', requireAuth, async (req, res) => {
  try {
    const teams = [
      {
        id: 1,
        name: 'EcoTrack Startup',
        description: 'Building a carbon footprint tracking app',
        lookingFor: ['Frontend Developer', 'UI/UX Designer'],
        skills: ['React Native', 'Figma', 'Sustainability'],
        members: 3,
        maxMembers: 5,
        stage: 'MVP Development'
      },
      {
        id: 2,
        name: 'HealthTech Innovation',
        description: 'AI-powered health monitoring system',
        lookingFor: ['ML Engineer', 'Backend Developer'],
        skills: ['Python', 'TensorFlow', 'Healthcare'],
        members: 2,
        maxMembers: 4,
        stage: 'Research Phase'
      }
    ];
    
    res.json({ teams });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load teams' });
  }
});

router.post('/teams', requireAuth, async (req, res) => {
  try {
    const { name, description, lookingFor, skills } = req.body;
    
    const team = {
      id: Date.now(),
      name,
      description,
      lookingFor,
      skills,
      members: 1,
      maxMembers: 5,
      stage: 'Formation',
      createdBy: req.user.id,
      createdAt: new Date()
    };
    
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create team' });
  }
});

// Certifications
router.get('/certifications', requireAuth, async (req, res) => {
  try {
    const certifications = [
      {
        id: 1,
        name: 'AWS Solutions Architect',
        provider: 'Amazon Web Services',
        status: 'completed',
        completedDate: '2024-01-15',
        expiryDate: '2027-01-15',
        credentialId: 'AWS-SAA-123456',
        skills: ['Cloud Computing', 'AWS', 'Architecture']
      },
      {
        id: 2,
        name: 'Google Cloud Professional',
        provider: 'Google Cloud',
        status: 'in-progress',
        startDate: '2024-01-20',
        expectedCompletion: '2024-03-20',
        progress: 65,
        skills: ['GCP', 'Cloud Computing', 'DevOps']
      },
      {
        id: 3,
        name: 'Certified Kubernetes Administrator',
        provider: 'CNCF',
        status: 'planned',
        targetDate: '2024-04-01',
        skills: ['Kubernetes', 'Container Orchestration', 'DevOps']
      }
    ];
    
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load certifications' });
  }
});

router.post('/certifications', requireAuth, async (req, res) => {
  try {
    const { name, provider, targetDate, skills } = req.body;
    
    const certification = {
      id: Date.now(),
      name,
      provider,
      status: 'planned',
      targetDate,
      skills,
      progress: 0,
      createdAt: new Date()
    };
    
    res.json({ certification });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add certification' });
  }
});

export default router;