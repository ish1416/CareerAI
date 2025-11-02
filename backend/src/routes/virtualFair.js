import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

// Get upcoming virtual career fairs
router.get('/events', async (req, res) => {
  try {
    const events = [
      {
        id: 1,
        title: 'Tech Giants Career Fair 2024',
        date: 'March 15, 2024 - 10:00 AM PST',
        status: 'live',
        attendees: 1247,
        description: 'Connect with top tech companies including Google, Microsoft, Amazon, and more.',
        companies: ['Google', 'Microsoft', 'Amazon', 'Apple', 'Meta', 'Netflix', 'Tesla']
      },
      {
        id: 2,
        title: 'Startup Showcase Fair',
        date: 'March 22, 2024 - 2:00 PM EST',
        status: 'upcoming',
        attendees: 543,
        description: 'Discover exciting opportunities at fast-growing startups and unicorn companies.',
        companies: ['Stripe', 'Airbnb', 'Uber', 'SpaceX', 'OpenAI', 'Figma']
      },
      {
        id: 3,
        title: 'Remote Work Opportunities Fair',
        date: 'March 29, 2024 - 11:00 AM GMT',
        status: 'upcoming',
        attendees: 892,
        description: 'Find remote-first companies offering flexible work arrangements.',
        companies: ['GitLab', 'Zapier', 'Buffer', 'Automattic', 'Toptal']
      }
    ];
    
    res.json({ events });
  } catch (error) {
    console.error('Events fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch events' });
  }
});

// Get booths for a specific fair
router.get('/:fairId/booths', async (req, res) => {
  try {
    const { fairId } = req.params;
    
    const booths = [
      {
        id: 1,
        company: 'Google',
        description: 'Join Google and help us organize the world\'s information.',
        visitors: 234,
        rating: 4.8,
        color: '#4285f4',
        recruiters: ['Sarah Chen - Senior Recruiter', 'Mike Johnson - Engineering Manager'],
        openRoles: ['Software Engineer', 'Product Manager', 'Data Scientist']
      },
      {
        id: 2,
        company: 'Microsoft',
        description: 'Empower every person and organization on the planet to achieve more.',
        visitors: 189,
        rating: 4.7,
        color: '#00a1f1',
        recruiters: ['Lisa Wang - Talent Acquisition', 'David Smith - Tech Lead'],
        openRoles: ['Cloud Engineer', 'AI Researcher', 'UX Designer']
      },
      {
        id: 3,
        company: 'Amazon',
        description: 'Work hard, have fun, make history at Amazon.',
        visitors: 156,
        rating: 4.6,
        color: '#ff9900',
        recruiters: ['Jennifer Lee - HR Manager', 'Carlos Rodriguez - Principal Engineer'],
        openRoles: ['DevOps Engineer', 'Solutions Architect', 'Business Analyst']
      },
      {
        id: 4,
        company: 'Apple',
        description: 'Think different and help us create products that change the world.',
        visitors: 201,
        rating: 4.9,
        color: '#007aff',
        recruiters: ['Emma Thompson - Recruiter', 'James Wilson - Engineering Director'],
        openRoles: ['iOS Developer', 'Hardware Engineer', 'Machine Learning Engineer']
      }
    ];
    
    res.json({ booths });
  } catch (error) {
    console.error('Booths fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch booths' });
  }
});

// Join a virtual fair
router.post('/:fairId/join', async (req, res) => {
  try {
    const { fairId } = req.params;
    
    // In production, track user participation and update analytics
    const fair = {
      id: fairId,
      title: 'Tech Giants Career Fair 2024',
      joinedAt: new Date().toISOString(),
      userPosition: { x: 50, y: 50 }
    };
    
    res.json({ fair, message: 'Successfully joined the virtual fair' });
  } catch (error) {
    console.error('Fair join error:', error);
    res.status(500).json({ error: 'Failed to join fair' });
  }
});

// Start video call with booth
router.post('/booth/:boothId/video-call', async (req, res) => {
  try {
    const { boothId } = req.params;
    
    // In production, integrate with WebRTC or video calling service
    const callSession = {
      sessionId: `call_${Date.now()}`,
      boothId,
      startTime: new Date().toISOString(),
      status: 'connecting'
    };
    
    res.json({ callSession, message: 'Video call initiated' });
  } catch (error) {
    console.error('Video call error:', error);
    res.status(500).json({ error: 'Failed to start video call' });
  }
});

// Send message to booth
router.post('/booth/:boothId/message', async (req, res) => {
  try {
    const { boothId } = req.params;
    const { message } = req.body;
    
    // In production, store messages in database and notify recruiters
    const chatMessage = {
      id: Date.now(),
      boothId,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    // Generate AI response from recruiter
    const recruiterPrompt = `As a professional recruiter at a virtual career fair, respond to this candidate message: "${message}". Keep it friendly, professional, and engaging.`;
    const aiResponse = await groqChat([{ role: 'user', content: recruiterPrompt }]);
    
    res.json({ 
      chatMessage, 
      recruiterResponse: aiResponse,
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('Message send error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

// Get AI matchmaking suggestions
router.post('/matchmaking', async (req, res) => {
  try {
    const { userSkills, careerGoals } = req.body;
    
    const matchPrompt = `Based on these user skills: ${userSkills} and career goals: ${careerGoals}, recommend the top 3 companies from this virtual fair that would be the best match. Provide match percentages and reasoning.`;
    
    const aiResponse = await groqClient.generateResponse(matchPrompt);
    
    const matches = [
      { company: 'Google', match: 92, reason: 'Perfect skill alignment with current openings' },
      { company: 'Microsoft', match: 87, reason: 'Strong cultural fit and growth opportunities' },
      { company: 'Amazon', match: 83, reason: 'Leadership principles align with career goals' }
    ];
    
    res.json({ matches, aiInsights: aiResponse });
  } catch (error) {
    console.error('Matchmaking error:', error);
    res.status(500).json({ error: 'Failed to generate matches' });
  }
});

export default router;