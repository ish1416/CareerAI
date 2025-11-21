import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';

const router = express.Router();

// Test AI Chat endpoint (no auth)
router.post('/test-chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // AI response using Groq
    const systemPrompt = `You are an AI Career Copilot assistant. Help users with career advice, resume optimization, job search strategies, and professional development. Be helpful, concise, and actionable.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await groqChat(messages, { maxTokens: 300 });
    
    const actions = ['Analyze my resume', 'Find jobs', 'Set career goals'];

    res.json({ response, actions });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      response: 'I apologize, but I\'m having trouble right now. Please try again.'
    });
  }
});

// Simple AI Chat endpoint
router.post('/chat', requireAuth, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // AI response using Groq
    const systemPrompt = `You are an AI Career Copilot assistant. Help users with career advice, resume optimization, job search strategies, and professional development. Be helpful, concise, and actionable.`;
    
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: message }
    ];

    const response = await groqChat(messages, { maxTokens: 300 });
    
    const actions = ['Analyze my resume', 'Find jobs', 'Set career goals'];

    res.json({ response, actions });

  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'Failed to get AI response',
      response: 'I apologize, but I\'m having trouble right now. Please try again.'
    });
  }
});

export default router;