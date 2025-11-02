import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';

const router = express.Router();

// Test AI Copilot Chat (no auth)
router.post('/test-chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // System prompt for career copilot
    const systemPrompt = `You are an AI Career Copilot assistant. Keep responses to 1-2 sentences maximum. Be concise and direct.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await groqChat(messages, { maxTokens: 100 });

    // Generate suggested actions based on the message
    const actions = generateSuggestedActions(message);

    res.json({ 
      response: response || 'I apologize, but I encountered an issue processing your request. Please try again.',
      actions 
    });

  } catch (error) {
    console.error('AI Copilot chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      response: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
    });
  }
});

// AI Copilot Chat
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // System prompt for career copilot
    const systemPrompt = `You are an AI Career Copilot assistant. Keep responses to 1-2 sentences maximum. Be concise and direct.`;

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await groqChat(messages, { maxTokens: 100 });

    // Generate suggested actions based on the message
    const actions = generateSuggestedActions(message);

    res.json({ 
      response: response || 'I apologize, but I encountered an issue processing your request. Please try again.',
      actions 
    });

  } catch (error) {
    console.error('AI Copilot chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      response: 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
    });
  }
});

// Career Goals endpoints
router.get('/goals', requireAuth, async (req, res) => {
  try {
    // Mock data for now - replace with actual database queries
    const goals = [
      {
        id: 1,
        title: 'Learn React.js',
        description: 'Master React.js for frontend development',
        category: 'skill',
        priority: 'high',
        progress: 65,
        targetDate: '2024-06-01',
        createdAt: new Date()
      }
    ];
    
    res.json({ goals });
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to load goals' });
  }
});

router.post('/goals', requireAuth, async (req, res) => {
  try {
    const { title, description, category, priority, targetDate } = req.body;
    
    // Mock goal creation - replace with actual database insert
    const goal = {
      id: Date.now(),
      title,
      description,
      category,
      priority,
      targetDate,
      progress: 0,
      createdAt: new Date(),
      userId: req.user.id
    };
    
    res.json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
});

router.patch('/goals/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    
    // Mock update - replace with actual database update
    res.json({ success: true, message: 'Goal updated successfully' });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Skill Development endpoints
router.get('/skills/analysis', requireAuth, async (req, res) => {
  try {
    // Mock data - replace with actual analysis
    const skillGaps = [];
    const learningPaths = [];
    
    res.json({ skillGaps, learningPaths });
  } catch (error) {
    console.error('Get skill analysis error:', error);
    res.status(500).json({ error: 'Failed to load skill analysis' });
  }
});

router.post('/skills/analyze', requireAuth, async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!jobDescription || !jobDescription.trim()) {
      return res.status(400).json({ error: 'Job description is required' });
    }

    // Use AI to analyze skill gaps
    const analysisPrompt = `Analyze this job description and identify key skills required:

${jobDescription}

Return a JSON response with:
1. skillGaps: Array of missing skills with name, description, and priority (high/medium/low)
2. learningPaths: Array of learning paths with title, description, estimatedHours, and resources

Focus on technical skills, soft skills, and certifications. Be specific and actionable.`;

    const messages = [
      { role: 'system', content: 'You are a career analysis expert. Always respond with valid JSON only.' },
      { role: 'user', content: analysisPrompt }
    ];

    const aiResponse = await groqChat(messages, { maxTokens: 1000 });

    // Parse AI response or provide fallback
    let analysis;
    try {
      analysis = JSON.parse(aiResponse);
    } catch {
      // Fallback analysis
      analysis = {
        skillGaps: [
          {
            name: 'React.js',
            description: 'Frontend JavaScript library for building user interfaces',
            priority: 'high'
          },
          {
            name: 'Node.js',
            description: 'Backend JavaScript runtime environment',
            priority: 'medium'
          }
        ],
        learningPaths: [
          {
            id: 1,
            title: 'Frontend Development Path',
            description: 'Master modern frontend technologies',
            estimatedHours: 40,
            resources: [
              {
                id: 1,
                title: 'React Official Tutorial',
                type: 'Tutorial',
                duration: '4 hours',
                url: 'https://react.dev/learn',
                completed: false
              }
            ]
          }
        ]
      };
    }

    res.json(analysis);
  } catch (error) {
    console.error('Skill analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze skills' });
  }
});

router.patch('/skills/learning-paths/:pathId/resources/:resourceId', requireAuth, async (req, res) => {
  try {
    const { pathId, resourceId } = req.params;
    const { completed } = req.body;
    
    // Mock update - replace with actual database update
    res.json({ success: true, message: 'Resource updated successfully' });
  } catch (error) {
    console.error('Update resource error:', error);
    res.status(500).json({ error: 'Failed to update resource' });
  }
});

// Helper function to generate suggested actions
function generateSuggestedActions(message) {
  const lowerMessage = message.toLowerCase();
  const actions = [];

  if (lowerMessage.includes('resume') || lowerMessage.includes('cv')) {
    actions.push('Analyze my resume', 'Build new resume', 'Improve ATS score');
  }
  
  if (lowerMessage.includes('job') || lowerMessage.includes('career')) {
    actions.push('Find matching jobs', 'Set career goals', 'Analyze skill gaps');
  }
  
  if (lowerMessage.includes('interview')) {
    actions.push('Practice interview questions', 'Get interview tips');
  }
  
  if (lowerMessage.includes('cover letter')) {
    actions.push('Generate cover letter', 'Improve cover letter');
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('learn')) {
    actions.push('Analyze skill gaps', 'Find learning resources', 'Set learning goals');
  }

  // Default actions if none match
  if (actions.length === 0) {
    actions.push('Analyze my resume', 'Set career goals', 'Find jobs');
  }

  return actions.slice(0, 3); // Limit to 3 suggestions
}

export default router;