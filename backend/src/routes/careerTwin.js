import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

// Get career twin profile
router.get('/profile', async (req, res) => {
  try {
    const twinProfile = {
      name: "AI Assistant Alex",
      isActive: true,
      stats: {
        applications: 47,
        responses: 23,
        interviews: 8,
        efficiency: 89
      },
      personality: {
        style: "Professional & Friendly",
        tone: "Confident but Humble",
        confidence: "High"
      },
      createdAt: "2024-01-15T10:00:00Z",
      lastActive: new Date().toISOString()
    };

    res.json(twinProfile);
  } catch (error) {
    console.error('Career twin profile error:', error);
    res.status(500).json({ error: 'Failed to load career twin profile' });
  }
});

// Get twin activities
router.get('/activities', async (req, res) => {
  try {
    const activities = [
      {
        type: "application",
        title: "Applied to Senior Developer Role",
        description: "Automatically applied to Google - Senior Software Engineer position",
        time: "2 hours ago"
      },
      {
        type: "response",
        title: "Responded to Recruiter",
        description: "Sent professional response to Microsoft recruiter inquiry",
        time: "4 hours ago"
      },
      {
        type: "interview",
        title: "Interview Scheduled",
        description: "Scheduled preliminary interview with Amazon for SDE-2 role",
        time: "6 hours ago"
      },
      {
        type: "application",
        title: "Applied to Tech Lead Position",
        description: "Applied to Netflix - Technical Lead position with cover letter",
        time: "1 day ago"
      },
      {
        type: "response",
        title: "Follow-up Message Sent",
        description: "Sent follow-up message to Apple recruiter after initial contact",
        time: "2 days ago"
      }
    ];

    res.json({ activities });
  } catch (error) {
    console.error('Career twin activities error:', error);
    res.status(500).json({ error: 'Failed to load twin activities' });
  }
});

// Toggle twin active status
router.post('/toggle', async (req, res) => {
  try {
    const { active } = req.body;
    
    // In production, update database
    const updatedStatus = {
      isActive: active,
      message: active ? "Career Twin activated successfully" : "Career Twin paused"
    };

    res.json(updatedStatus);
  } catch (error) {
    console.error('Career twin toggle error:', error);
    res.status(500).json({ error: 'Failed to toggle career twin' });
  }
});

// Create new career twin
router.post('/create', async (req, res) => {
  try {
    const prompt = `Create a personalized AI career twin profile based on user's resume and preferences. 
    Generate a professional name, communication style, and personality traits that would represent them well in job applications and recruiter interactions.`;

    const aiResponse = await groqChat([{ role: 'user', content: prompt }]);
    
    const newTwin = {
      name: "AI Assistant Alex",
      isActive: false,
      stats: {
        applications: 0,
        responses: 0,
        interviews: 0,
        efficiency: 0
      },
      personality: {
        style: "Professional & Friendly",
        tone: "Confident but Humble",
        confidence: "High"
      },
      createdAt: new Date().toISOString()
    };

    res.json(newTwin);
  } catch (error) {
    console.error('Career twin creation error:', error);
    res.status(500).json({ error: 'Failed to create career twin' });
  }
});

export default router;