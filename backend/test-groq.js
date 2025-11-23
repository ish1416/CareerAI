import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function testGroq() {
  try {
    console.log('Testing Groq API...');
    console.log('API Key:', process.env.GROQ_API_KEY ? `${process.env.GROQ_API_KEY.substring(0, 10)}...` : 'Not set');
    console.log('Model:', process.env.GROQ_MODEL);
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Say hello' }
      ],
      model: process.env.GROQ_MODEL || 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 100,
    });

    console.log('Success:', completion.choices[0]?.message?.content);
  } catch (error) {
    console.error('Groq API error:', error.message);
    console.error('Status:', error.status);
    console.error('Type:', error.error?.type);
  }
}

testGroq();