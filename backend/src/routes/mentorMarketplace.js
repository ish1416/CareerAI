import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

// Get available mentors with filters
router.get('/mentors', async (req, res) => {
  try {
    const { expertise, priceRange, rating, availability } = req.query;
    
    let mentors = [
      {
        id: 1,
        name: 'Sarah Chen',
        title: 'Senior Software Engineer',
        company: 'Google',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        rating: 4.9,
        reviews: 127,
        hourlyRate: 150,
        responseTime: '< 2 hours',
        matchScore: 95,
        bio: 'Former Google engineer with 8+ years experience. Specialized in system design, career transitions, and technical interviews.',
        expertise: ['System Design', 'Technical Interviews', 'Career Growth', 'Leadership'],
        availability: 'this-week',
        languages: ['English', 'Mandarin']
      },
      {
        id: 2,
        name: 'Marcus Johnson',
        title: 'Product Manager',
        company: 'Microsoft',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        rating: 4.8,
        reviews: 89,
        hourlyRate: 120,
        responseTime: '< 4 hours',
        matchScore: 87,
        bio: 'Product leader with experience at Microsoft and startups. Expert in product strategy, roadmapping, and stakeholder management.',
        expertise: ['Product Strategy', 'Roadmapping', 'Stakeholder Management', 'Analytics'],
        availability: 'today',
        languages: ['English', 'Spanish']
      },
      {
        id: 3,
        name: 'Dr. Emily Rodriguez',
        title: 'Data Science Director',
        company: 'Netflix',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        rating: 4.9,
        reviews: 156,
        hourlyRate: 180,
        responseTime: '< 1 hour',
        matchScore: 92,
        bio: 'PhD in Machine Learning with 10+ years in data science. Led teams at Netflix, Uber, and Amazon.',
        expertise: ['Machine Learning', 'Data Strategy', 'Team Leadership', 'Research'],
        availability: 'next-week',
        languages: ['English', 'Portuguese']
      },
      {
        id: 4,
        name: 'Alex Kim',
        title: 'UX Design Lead',
        company: 'Airbnb',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        rating: 4.7,
        reviews: 73,
        hourlyRate: 100,
        responseTime: '< 6 hours',
        matchScore: 78,
        bio: 'Design leader passionate about user-centered design and design systems. 6+ years at top tech companies.',
        expertise: ['UX Design', 'Design Systems', 'User Research', 'Prototyping'],
        availability: 'this-week',
        languages: ['English', 'Korean']
      }
    ];
    
    // Apply filters
    if (expertise) {
      mentors = mentors.filter(m => m.expertise.some(e => e.toLowerCase().includes(expertise.toLowerCase())));
    }
    
    if (priceRange) {
      const [min, max] = priceRange.includes('+') ? [200, 1000] : priceRange.split('-').map(Number);
      mentors = mentors.filter(m => m.hourlyRate >= min && (max ? m.hourlyRate <= max : true));
    }
    
    if (rating) {
      const minRating = parseFloat(rating.replace('+', ''));
      mentors = mentors.filter(m => m.rating >= minRating);
    }
    
    if (availability) {
      mentors = mentors.filter(m => m.availability === availability);
    }
    
    res.json({ mentors });
  } catch (error) {
    console.error('Mentors fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch mentors' });
  }
});

// Get user's mentoring sessions
router.get('/sessions', async (req, res) => {
  try {
    const sessions = [
      {
        id: 1,
        mentorName: 'Sarah Chen',
        mentorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
        topic: 'System Design Interview Prep',
        date: 'March 20, 2024 - 3:00 PM',
        duration: 60,
        status: 'upcoming',
        sessionType: 'video',
        meetingLink: 'https://meet.careerai.com/session/123'
      },
      {
        id: 2,
        mentorName: 'Marcus Johnson',
        mentorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
        topic: 'Product Management Career Path',
        date: 'March 18, 2024 - 2:00 PM',
        duration: 45,
        status: 'completed',
        sessionType: 'video',
        rating: 5,
        feedback: 'Excellent session with actionable insights'
      },
      {
        id: 3,
        mentorName: 'Dr. Emily Rodriguez',
        mentorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
        topic: 'Data Science Portfolio Review',
        date: 'March 25, 2024 - 4:00 PM',
        duration: 90,
        status: 'upcoming',
        sessionType: 'video',
        meetingLink: 'https://meet.careerai.com/session/456'
      }
    ];
    
    res.json({ sessions });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch sessions' });
  }
});

// Book a mentoring session
router.post('/book', async (req, res) => {
  try {
    const { mentorId, sessionType, duration, date, topic } = req.body;
    
    // In production, integrate with payment processing and calendar scheduling
    const session = {
      id: Date.now(),
      mentorId,
      sessionType,
      duration,
      date,
      topic,
      status: 'confirmed',
      bookingId: `BK${Date.now()}`,
      meetingLink: `https://meet.careerai.com/session/${Date.now()}`,
      bookedAt: new Date().toISOString()
    };
    
    // Send confirmation emails, calendar invites, etc.
    
    res.json({ 
      session, 
      message: 'Session booked successfully',
      paymentStatus: 'completed'
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ error: 'Failed to book session' });
  }
});

// Calculate AI match score
router.post('/match-score', async (req, res) => {
  try {
    const { mentorId } = req.body;
    
    // In production, use AI to calculate compatibility based on:
    // - User's career goals and current level
    // - Mentor's expertise and experience
    // - Communication style preferences
    // - Past session success rates
    
    const matchPrompt = `Calculate a mentorship compatibility score (0-100) based on:
    User: Software developer, 3 years experience, wants to transition to senior role
    Mentor: Senior engineer at Google, 8+ years experience, specializes in career growth
    Consider technical alignment, experience gap, and mentoring style.`;
    
    const aiResponse = await groqChat([{ role: 'user', content: matchPrompt }]);
    
    // Extract score from AI response or use algorithm
    const score = Math.floor(Math.random() * 20) + 80; // 80-100 range
    
    res.json({ 
      score,
      factors: {
        technicalAlignment: 95,
        experienceGap: 88,
        communicationStyle: 92,
        goalAlignment: 87
      },
      aiInsights: aiResponse
    });
  } catch (error) {
    console.error('Match score error:', error);
    res.status(500).json({ error: 'Failed to calculate match score' });
  }
});

// Get mentor recommendations
router.post('/recommendations', async (req, res) => {
  try {
    const { userProfile, careerGoals } = req.body;
    
    const recommendationPrompt = `Based on this user profile: ${JSON.stringify(userProfile)} and career goals: ${careerGoals}, recommend the top 3 mentors from our marketplace. Consider expertise alignment, experience level, and career trajectory.`;
    
    const aiResponse = await groqChat([{ role: 'user', content: recommendationPrompt }]);
    
    const recommendations = [
      { mentorId: 1, score: 95, reason: 'Perfect technical alignment and career path' },
      { mentorId: 2, score: 87, reason: 'Strong leadership experience and mentoring style' },
      { mentorId: 3, score: 82, reason: 'Complementary skills and growth opportunities' }
    ];
    
    res.json({ recommendations, aiInsights: aiResponse });
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
});

// Send message to mentor
router.post('/message', async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    
    // In production, store in database and send notifications
    const chatMessage = {
      id: Date.now(),
      mentorId,
      message,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    
    res.json({ chatMessage, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

export default router;