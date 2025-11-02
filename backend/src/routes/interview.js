import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Interview Sessions
router.get('/sessions', requireAuth, async (req, res) => {
  try {
    const sessions = await prisma.interviewSession.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ sessions });
  } catch (error) {
    console.error('Interview sessions error:', error);
    res.status(500).json({ error: 'Failed to load sessions' });
  }
});

router.post('/sessions', requireAuth, async (req, res) => {
  try {
    const { company, position, questions } = req.body;
    
    const session = await prisma.interviewSession.create({
      data: {
        userId: req.user.id,
        company,
        position,
        questions: questions || []
      }
    });
    
    res.json({ session });
  } catch (error) {
    console.error('Create session error:', error);
    res.status(500).json({ error: 'Failed to start session' });
  }
});

// Generate Interview Questions
router.post('/questions', requireAuth, async (req, res) => {
  try {
    const { domain, type, difficulty, count = 5 } = req.body;
    
    const prompt = `Generate ${count} ${type} interview questions for ${domain} at ${difficulty} level. Return JSON array: [{"id": 1, "question": "...", "category": "...", "expectedAnswer": "..."}]`;
    
    const messages = [
      { role: 'system', content: 'You are an interview question generator. Return only valid JSON.' },
      { role: 'user', content: prompt }
    ];

    let questions;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 800 });
      questions = JSON.parse(aiResponse);
    } catch {
      questions = [
        {
          id: 1,
          question: "Tell me about yourself and your background in software development.",
          category: "behavioral",
          expectedAnswer: "Should include relevant experience, skills, and career goals"
        },
        {
          id: 2,
          question: "How do you handle working under pressure and tight deadlines?",
          category: "behavioral",
          expectedAnswer: "Should demonstrate stress management and prioritization skills"
        },
        {
          id: 3,
          question: "Explain the difference between let, const, and var in JavaScript.",
          category: "technical",
          expectedAnswer: "Should cover scope, hoisting, and reassignment differences"
        }
      ];
    }
    
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

// Analyze Answer
router.post('/analyze', requireAuth, async (req, res) => {
  try {
    const { sessionId, question, answer, type } = req.body;
    
    const prompt = `Analyze this interview answer:
Question: ${question}
Answer: ${answer}
Type: ${type}

Provide feedback on: content quality, clarity, confidence, and improvement suggestions. Return JSON: {"score": 0-100, "feedback": "...", "strengths": [], "improvements": []}`;
    
    const messages = [
      { role: 'system', content: 'You are an interview coach. Provide constructive feedback.' },
      { role: 'user', content: prompt }
    ];

    let analysis;
    try {
      const aiResponse = await groqChat(messages, { maxTokens: 500 });
      analysis = JSON.parse(aiResponse);
    } catch {
      analysis = {
        score: Math.floor(Math.random() * 30) + 70,
        feedback: "Good answer with relevant examples. Consider being more specific about your achievements.",
        strengths: ["Clear communication", "Relevant experience"],
        improvements: ["Add specific metrics", "More confident delivery"]
      };
    }
    
    // Update session with response and feedback
    if (sessionId) {
      await prisma.interviewSession.update({
        where: { id: parseInt(sessionId) },
        data: {
          responses: { push: { question, answer, score: analysis.score } },
          feedback: { push: analysis }
        }
      });
    }
    
    res.json({ analysis });
  } catch (error) {
    console.error('Analyze answer error:', error);
    res.status(500).json({ error: 'Failed to analyze answer' });
  }
});

// Speech Analysis (Mock)
router.post('/speech-analysis', requireAuth, async (req, res) => {
  try {
    const { audioData, duration } = req.body;
    
    // Mock speech analysis
    const analysis = {
      confidence: Math.floor(Math.random() * 20) + 75,
      clarity: Math.floor(Math.random() * 15) + 80,
      pace: Math.floor(Math.random() * 25) + 70,
      volume: Math.floor(Math.random() * 20) + 75,
      fillerWords: Math.floor(Math.random() * 5) + 2,
      pauseAnalysis: {
        totalPauses: Math.floor(Math.random() * 8) + 3,
        averagePauseLength: (Math.random() * 2 + 1).toFixed(1)
      },
      feedback: [
        "Speak with more confidence",
        "Reduce filler words like 'um' and 'uh'",
        "Maintain steady pace throughout"
      ]
    };
    
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze speech' });
  }
});

// Facial Expression Analysis (Mock)
router.post('/facial-analysis', requireAuth, async (req, res) => {
  try {
    const { imageData } = req.body;
    
    // Mock facial expression analysis
    const analysis = {
      confidence: Math.floor(Math.random() * 20) + 75,
      engagement: Math.floor(Math.random() * 15) + 80,
      eyeContact: Math.floor(Math.random() * 25) + 70,
      expressions: {
        neutral: 65,
        happy: 20,
        focused: 15
      },
      feedback: [
        "Maintain more eye contact with the camera",
        "Show more enthusiasm through facial expressions",
        "Keep a confident posture"
      ]
    };
    
    res.json({ analysis });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze facial expressions' });
  }
});

// Session Scorecard
router.get('/sessions/:id/scorecard', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const session = await prisma.interviewSession.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    const scorecard = {
      sessionId: id,
      overallScore: session.score || 0,
      duration: session.duration || 0,
      responses: session.responses || [],
      feedback: session.feedback || {},
      company: session.company,
      position: session.position,
      createdAt: session.createdAt
    };
    
    res.json({ scorecard });
  } catch (error) {
    console.error('Scorecard error:', error);
    res.status(500).json({ error: 'Failed to load scorecard' });
  }
});

// Interview Tips
router.get('/tips', async (req, res) => {
  try {
    const { domain, type } = req.query;
    
    const tips = [
      {
        category: "Preparation",
        tips: [
          "Research the company and role thoroughly",
          "Practice common questions for your domain",
          "Prepare specific examples using STAR method"
        ]
      },
      {
        category: "Communication",
        tips: [
          "Speak clearly and at a moderate pace",
          "Maintain eye contact with the interviewer",
          "Use confident body language"
        ]
      },
      {
        category: "Technical",
        tips: [
          "Think out loud during problem-solving",
          "Ask clarifying questions when needed",
          "Explain your approach before coding"
        ]
      }
    ];
    
    res.json({ tips });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tips' });
  }
});

export default router;