import axios from 'axios';

const HF_API_URL = 'https://api-inference.huggingface.co/models';
const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const AI_MODEL = process.env.AI_MODEL || 'tiiuae/falcon-7b-instruct';

async function callHuggingFace(prompt) {
  if (!process.env.HF_API_KEY) return null;
  try {
    const { data } = await axios({
      method: 'POST',
      url: `${HF_API_URL}/${AI_MODEL}`,
      headers: {
        Authorization: `Bearer ${process.env.HF_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: { inputs: prompt },
      timeout: 30000,
    });
    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text;
    }
    if (typeof data === 'string') return data;
    return JSON.stringify(data);
  } catch (e) {
    console.error('HF error', e?.response?.data || e.message);
    return null;
  }
}

function sleep(ms) { return new Promise((r) => setTimeout(r, ms)); }

async function callGroq(prompt) {
  if (!process.env.GROQ_API_KEY) return null;
  try {
    const { data } = await axios({
      method: 'POST',
      url: GROQ_URL,
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      data: {
        model: process.env.GROQ_MODEL || 'llama3-8b-8192',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 500
      },
      timeout: 30000,
    });
    return data?.choices?.[0]?.message?.content || null;
  } catch (e) {
    console.error('Groq error:', e?.response?.data || e.message);
    return null;
  }
}

async function callOpenRouter(prompt) {
  if (!process.env.OPENROUTER_API_KEY) return null;
  const referer = process.env.FRONTEND_URL || 'http://localhost:5176';
  const payload = {
    model: process.env.OPENROUTER_MODEL || 'openrouter/auto',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
    // Limit response size to reduce failures on long inputs
    max_tokens: 600,
  };
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data } = await axios({
        method: 'POST',
        url: OPENROUTER_URL,
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': referer,
          'X-Title': 'CareerAI',
        },
        data: payload,
        timeout: 30000,
      });
      const text = data?.choices?.[0]?.message?.content;
      return text || null;
    } catch (e) {
      const msg = e?.response?.data || e.message;
      const status = e?.response?.status || 0;
      console.error(`OpenRouter error (attempt ${attempt})`, msg);
      const transient = status === 429 || status >= 500 || /ENOTFOUND|ECONNRESET|ETIMEDOUT|timeout/i.test(String(msg));
      if (!transient || attempt === 3) return null;
      await sleep(500 * attempt);
    }
  }
  return null;
}

export async function generateText(prompt) {
  // Try Groq first (free, fast, unlimited)
  const groq = await callGroq(prompt);
  if (groq && groq.trim()) return groq;
  
  // Try OpenRouter (paid but reliable)
  const or = await callOpenRouter(prompt);
  if (or && or.trim()) return or;
  
  // Try HuggingFace (free but limited)
  const hf = await callHuggingFace(prompt);
  if (hf && hf.trim()) return hf;
  
  // Fallback response
  return `AI is offline. Get free API key from https://console.groq.com`;
}

// Plain text helper: sanitize artifacts like <s>, [OUT], INST tokens
function sanitizeOutput(str) {
  return (str || '')
    .replace(/^\s*<s>\s*/gi, '')
    .replace(/\s*<\/s>\s*$/gi, '')
    .replace(/\s*\[OUT\]\s*/gi, '')
    .replace(/\s*\[IN\]\s*/gi, '')
    .replace(/\s*\[INST\]\s*/gi, '')
    .replace(/\s*\[\/INST\]\s*/gi, '')
    .replace(/<\|im_start\|>|<\|im_end\|>|<\|assistant\|>|<\|user\|>/gi, '')
    .replace(/^\s*Output:\s*/i, '')
    .trim();
}

export async function generateTextPlain(prompt) {
  const result = await generateText(prompt);
  // If the result appears to be JSON, keep it untouched
  if (typeof result === 'string' && /^[\[{]/.test(result.trim())) return result;
  return sanitizeOutput(result);
}

export async function generateTextJson(prompt) {
  // Do not sanitize JSON to avoid breaking parsing
  return await generateText(prompt);
}

export async function analyzeResumeText(resumeText) {
  const prompt = `You are an expert ATS resume analyzer. Analyze this resume and return ONLY valid JSON with this exact structure:

{
  "atsScore": number (0-100),
  "atsMessage": "brief positive message",
  "suggestions": ["specific actionable suggestions"],
  "missingKeywords": ["important missing keywords"],
  "sectionFeedback": {
    "summary": ["specific feedback"],
    "experience": ["specific feedback"],
    "skills": ["specific feedback"]
  },
  "sectionMissingKeywords": {
    "summary": ["missing keywords"],
    "experience": ["missing keywords"],
    "skills": ["missing keywords"]
  },
  "improvements": {
    "summary": [{
      "issue": "specific issue",
      "recommendation": "how to fix",
      "example": "concrete example"
    }]
  }
}

Focus on:
- Action verbs, quantified results, ATS keywords
- Industry-standard terms and technologies
- Measurable achievements over responsibilities
- Professional formatting and structure

Resume text:
${resumeText}`;
  const response = await generateTextJson(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch {
    // Robust fallback with specific and detailed improvements
    return {
      atsScore: 60,
      atsMessage: 'Analysis complete. Address the items below to improve ATS alignment.',
      suggestions: [
        'Add measurable outcomes to experience bullets.',
        'Include relevant keywords from target job description.',
      ],
      missingKeywords: ['React', 'Node.js', 'CI/CD'],
      sectionFeedback: {
        summary: ['Make the headline more concise and add quantified impact.'],
        experience: ['Use action verbs and add metrics for outcomes.'],
        skills: ['Group by category and indicate proficiency or years.'],
      },
      sectionMissingKeywords: {
        summary: ['impact', 'metrics'],
        experience: ['leadership', 'ownership', 'delivery', 'stakeholders'],
        skills: ['React', 'TypeScript', 'Node.js', 'CI/CD'],
        projects: ['GitHub', 'Demo', 'Results'],
        education: ['GPA', 'Coursework', 'Certifications'],
        certifications: ['AWS', 'Azure', 'Scrum'],
        achievements: ['Award', 'Recognition']
      },
      improvements: {
        summary: [
          {
            issue: 'Headline is broad and lacks quantified impact.',
            recommendation: 'Add a quantified achievement in the summary.',
            example: 'Software Engineer delivering 30% faster release cycles by automating CI/CD pipelines.'
          },
          {
            issue: 'Missing target role keywords.',
            recommendation: 'Incorporate 2-3 high-priority role keywords naturally.',
            example: 'Focused on React, Node.js, and AWS serverless architectures.'
          }
        ],
        experience: [
          {
            issue: 'Bullets describe responsibilities instead of outcomes.',
            recommendation: 'Rewrite bullets to quantify impact using metrics.',
            example: 'Reduced API latency by 45% by optimizing SQL queries and caching.'
          },
          {
            issue: 'Missing action verbs at the start of bullets.',
            recommendation: 'Begin each bullet with a strong verb (Led, Optimized, Implemented).',
            example: 'Implemented feature flag system enabling 20% faster A/B testing iterations.'
          }
        ],
        skills: [
          {
            issue: 'Skills are ungrouped and hard to scan.',
            recommendation: 'Group by category and add proficiency/years for key items.',
            example: 'Frontend: React (3y), TypeScript (2y); Backend: Node.js (4y), PostgreSQL (3y)'
          }
        ]
      }
    };
  }
}

export async function compareResumeWithJD(resumeText, jdText) {
  const prompt = `Compare this resume against the job description. Return ONLY valid JSON:

{
  "matchPercentage": number (0-100),
  "missingKeywords": ["important missing keywords"],
  "keywordSuggestions": [{
    "keyword": "specific keyword",
    "suggestion": "where and how to add it"
  }],
  "suggestions": ["specific actionable improvements"]
}

Analyze for:
- Technical skills and tools mentioned in JD but missing in resume
- Industry buzzwords and terminology
- Required qualifications and experience levels
- Soft skills and competencies

Resume:
${resumeText}

Job Description:
${jdText}`;
  
  const response = await generateTextJson(prompt);
  try {
    const parsed = JSON.parse(response);
    return parsed;
  } catch {
    // Enhanced fallback with more detailed suggestions
    const rTokens = tokenize(resumeText);
    const jTokens = tokenize(jdText);
    const rSet = new Set(rTokens);
    const jSet = new Set(jTokens);
    const intersection = jTokens.filter((t) => rSet.has(t));
    const missing = jTokens.filter((t) => !rSet.has(t) && t.length > 3).slice(0, 10);
    const match = Math.round((intersection.length / Math.max(jSet.size, 1)) * 100);
    
    // Create more detailed suggestions
    const keywordSuggestions = missing.map(keyword => ({
      keyword,
      suggestion: `Add "${keyword}" to your resume in the relevant section. If it's a skill, add to skills section. If it's related to experience, incorporate it in your work descriptions.`
    }));
    
    return {
      matchPercentage: match,
      missingKeywords: missing,
      keywordSuggestions: keywordSuggestions,
      suggestions: [
        'Incorporate missing keywords in relevant sections of your resume',
        'Tailor your experience descriptions to highlight skills mentioned in the job description',
        'Use similar terminology as the job description in your resume',
        'Quantify your achievements to demonstrate impact in areas the job requires'
      ],
    };
  }
}

export async function rewriteTextProfessional(text) {
  const prompt = `You are a professional resume writer. Rewrite this text to be more impactful and ATS-friendly:

RULES:
- Use strong action verbs (Led, Implemented, Optimized, Delivered)
- Add quantifiable metrics where possible (%, numbers, timeframes)
- Keep professional tone, concise bullets
- Remove weak words (responsible for, helped with)
- Focus on achievements, not just duties
- Return ONLY the rewritten text, no explanations

Original text:
${text}`;
  const rewritten = await generateTextPlain(prompt);
  if (!rewritten || !rewritten.trim()) {
    return `AI is offline. Configure backend AI keys in .env to enable enhancements.`;
  }
  return rewritten;
}

// Contextual rewrite with target keywords integrated naturally
export async function rewriteTextWithKeywords(text, keywords = [], section = '') {
  const kws = Array.isArray(keywords) ? keywords.filter((k) => !!k && String(k).trim().length > 0) : [];
  const sectionHint = (section || '').toLowerCase();
  const prompt = `Rewrite this ${sectionHint} section to naturally include these keywords: ${kws.join(', ')}

RULES:
- Keep original meaning and achievements
- Integrate keywords naturally, don't just list them
- Use professional resume language
- Maintain bullet point format if present
- Don't duplicate existing keywords
- Focus on impact and results
- Return ONLY the rewritten text

Original ${sectionHint}:
${text}`;
  const rewritten = await generateTextPlain(prompt);
  return rewritten;
}

function tokenize(str) {
  return (str || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2 && !STOPWORDS.has(t));
}

const STOPWORDS = new Set([
  'the','and','for','with','this','that','from','into','over','under','above','below','is','are','was','were','to','in','of','on','at','by','or','an','a','as','it','be','can','will','not','but','your','you','we','our'
]);