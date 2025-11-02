import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

export async function groqChat(messages, options = {}) {
  try {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY not configured');
    }

    const completion = await groq.chat.completions.create({
      messages,
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
      top_p: options.topP || 0.9,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Groq API error:', error);
    throw error;
  }
}