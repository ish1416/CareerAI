import { prisma } from '../config/prisma.js';
import { compareResumeWithJD } from '../utils/ai.js';
import { parsePDF, parseDOCX } from '../utils/parser.js';
import fs from 'fs';

export async function uploadJD(req, res) {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });
  const filePath = file.path;
  const original = file.originalname.toLowerCase();
  const isPDF = file.mimetype === 'application/pdf' || original.endsWith('.pdf');
  const isDOCX = file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || original.endsWith('.docx');
  try {
    if (!isPDF && !isDOCX) {
      return res.status(400).json({ error: 'Unsupported file type. Upload PDF or DOCX.' });
    }
    let text = '';
    if (isPDF) {
      text = await parsePDF(filePath);
    } else {
      text = await parseDOCX(filePath);
    }
    if (!text || !text.trim()) {
      throw new Error('No extractable text detected');
    }
    return res.json({ text });
  } catch (e) {
    console.error('JD parse error:', e);
    const type = isPDF ? 'PDF' : isDOCX ? 'DOCX' : 'file';
    const msg = `Unable to extract text from ${type}. Try a text-based ${type}, or upload a DOCX.`;
    return res.status(422).json({ error: msg });
  } finally {
    try { fs.unlinkSync(filePath); } catch {}
  }
}

export async function compare(req, res) {
  let { resumeText, jobDescription, resumeId } = req.body;
  if (!jobDescription) return res.status(400).json({ error: 'jobDescription required' });

  // Auto-fetch latest saved resume if resumeText not provided
  if (!resumeText) {
    let resume;
    if (resumeId) {
      resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    } else {
      resume = await prisma.resume.findFirst({ where: { userId: req.user.id }, orderBy: { updatedAt: 'desc' } });
    }
    if (!resume) return res.status(404).json({ error: 'No saved resume found. Build or upload one first.' });
    try {
      const content = resume.content || {};
      const lines = [];
      const personal = content.personal || {};
      const header = [personal.name, personal.email, personal.phone].filter(Boolean).join(' \u2022 ');
      if (header) lines.push(header);
      for (const key of ['summary', 'experience', 'projects', 'education', 'skills', 'achievements', 'certifications']) {
        const val = content[key];
        if (typeof val === 'string' && val.trim()) lines.push(val);
      }
      resumeText = lines.join('\n');
    } catch (e) {
      console.error('Failed to compose resumeText from saved resume', e);
    }
  }

  const result = await compareResumeWithJD(resumeText, jobDescription);
  const saved = await prisma.jobDescription.create({
    data: {
      userId: req.user.id,
      content: jobDescription,
      analysisResult: result,
    },
  });
  res.json({ result, saved });
}