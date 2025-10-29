import { prisma } from '../config/prisma.js';
import { generateTextPlain } from '../utils/ai.js';

export async function generateCoverLetter(req, res) {
  try {
    const { resumeText, jdText } = req.body;
    const prompt = `Using the resume and job description, craft a tailored, professional cover letter. Return only the letter body without any tags or extraneous markers.\nResume:\n${resumeText}\n\nJob Description:\n${jdText}`;
    const text = await generateTextPlain(prompt);
    return res.status(200).json({ letter: text });
  } catch (e) {
    console.error('Cover letter error', e.message);
    return res.status(500).json({ error: 'Failed to generate cover letter' });
  }
}

export async function generate(req, res) {
  const { jobTitle, resumeText } = req.body;
  if (!jobTitle || !resumeText) return res.status(400).json({ error: 'jobTitle and resumeText required' });
  const prompt = `Using the resume text below, write a professional cover letter tailored to a job titled "${jobTitle}".\nResume:\n${resumeText}`;
  const content = await generateText(prompt);
  const saved = await prisma.coverLetter.create({ data: { userId: req.user.id, jobTitle, content } });
  res.json({ content, saved });
}