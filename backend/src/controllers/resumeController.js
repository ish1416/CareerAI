import { prisma } from '../config/prisma.js';
import { parsePDF, parseDOCX } from '../utils/parser.js';
import { analyzeResumeText, rewriteTextProfessional, rewriteTextWithKeywords } from '../utils/ai.js';
import { mapResumeText } from '../utils/resumeStruct.js';
import fs from 'fs';

export async function upload(req, res) {
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
    const structured = mapResumeText(text);
    return res.json({ text, structured });
  } catch (e) {
    console.error('Resume parse error:', e);
    const type = isPDF ? 'PDF' : isDOCX ? 'DOCX' : 'file';
    const msg = `Unable to extract text from ${type}. Try a text-based ${type}, or upload a DOCX.`;
    return res.status(422).json({ error: msg });
  } finally {
    try { fs.unlinkSync(filePath); } catch {}
  }
}

export async function analyze(req, res) {
  const { resumeText, resumeId } = req.body;
  if (!resumeText) return res.status(400).json({ error: 'resumeText is required' });
  
  try {
    const analysis = await analyzeResumeText(resumeText);
    
    let saved = null;
    if (resumeId) {
      // Verify resume belongs to user
      const resume = await prisma.resume.findFirst({
        where: { id: parseInt(resumeId), userId: req.user.id }
      });
      
      if (resume) {
        saved = await prisma.analysisReport.create({
          data: {
            resumeId: parseInt(resumeId),
            atsScore: Math.max(0, Math.min(100, analysis.atsScore || 0)),
            suggestions: analysis.suggestions || [],
            missingKeywords: analysis.missingKeywords || [],
          },
        });
      }
    }
    
    res.json({ analysis, report: saved });
  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({ error: 'Analysis failed' });
  }
}

export async function rewrite(req, res) {
  const { text, keywords, section } = req.body;
  if (!text) return res.status(400).json({ error: 'text is required' });
  try {
    let rewritten;
    if (Array.isArray(keywords) && keywords.length > 0) {
      rewritten = await rewriteTextWithKeywords(text, keywords, section);
    } else {
      rewritten = await rewriteTextProfessional(text);
    }
    res.json({ rewritten });
  } catch (e) {
    console.error('Rewrite error:', e);
    res.status(500).json({ error: 'Failed to rewrite text' });
  }
}

export async function saveResume(req, res) {
  const { title, content, resumeId } = req.body;
  if (!title || !content) return res.status(400).json({ error: 'title and content required' });
  
  try {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return res.status(400).json({ error: 'Resume title cannot be empty' });
    
    let resume;
    if (resumeId) {
      // Update existing resume - verify ownership
      const existing = await prisma.resume.findFirst({
        where: { id: parseInt(resumeId), userId: req.user.id }
      });
      
      if (!existing) {
        return res.status(404).json({ error: 'Resume not found' });
      }
      
      // Check if title is being changed and if new title already exists
      if (existing.title !== trimmedTitle) {
        const duplicateTitle = await prisma.resume.findFirst({
          where: { 
            userId: req.user.id, 
            title: trimmedTitle,
            id: { not: parseInt(resumeId) }
          }
        });
        
        if (duplicateTitle) {
          return res.status(409).json({ error: 'Resume name already exists. Please choose a different name.' });
        }
      }
      
      resume = await prisma.resume.update({ 
        where: { id: parseInt(resumeId) }, 
        data: { title: trimmedTitle, content, updatedAt: new Date() } 
      });
    } else {
      // Check if resume with same title already exists for this user
      const existingTitle = await prisma.resume.findFirst({
        where: { userId: req.user.id, title: trimmedTitle }
      });
      
      if (existingTitle) {
        return res.status(409).json({ error: 'Resume name already exists. Please choose a different name.' });
      }
      
      // Create new resume
      resume = await prisma.resume.create({ 
        data: { 
          userId: req.user.id, 
          title: trimmedTitle, 
          content 
        } 
      });
    }
    
    res.json({ resume });
  } catch (error) {
    console.error('Save resume error:', error);
    if (error.code === 'P2002') {
      return res.status(409).json({ error: 'Resume name already exists. Please choose a different name.' });
    }
    res.status(500).json({ error: 'Failed to save resume' });
  }
}

export async function listResumes(req, res) {
  const resumes = await prisma.resume.findMany({
    where: { userId: req.user.id },
    orderBy: { updatedAt: 'desc' },
    include: { analysisReport: { orderBy: { date: 'desc' }, take: 1 } },
  });
  res.json({ resumes });
}

export async function getResume(req, res) {
  const id = parseInt(req.params.id, 10);
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume || resume.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  res.json({ resume });
}

export async function getResumeHistory(req, res) {
  const id = parseInt(req.params.id, 10);
  const resume = await prisma.resume.findUnique({ where: { id } });
  if (!resume || resume.userId !== req.user.id) return res.status(404).json({ error: 'Not found' });
  const reports = await prisma.analysisReport.findMany({ where: { resumeId: id }, orderBy: { date: 'desc' } });
  res.json({ reports });
}

export async function removeDuplicates(req, res) {
  try {
    const userId = req.user.id;
    
    // Find all resumes for the user
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' }
    });
    
    const titleMap = new Map();
    const duplicates = [];
    
    // Identify duplicates (keep the first one, mark others as duplicates)
    resumes.forEach(resume => {
      const title = resume.title.trim().toLowerCase();
      if (titleMap.has(title)) {
        duplicates.push(resume.id);
      } else {
        titleMap.set(title, resume.id);
      }
    });
    
    if (duplicates.length === 0) {
      return res.json({ message: 'No duplicate resumes found', removed: 0 });
    }
    
    // Delete analysis reports for duplicate resumes first
    await prisma.analysisReport.deleteMany({
      where: { resumeId: { in: duplicates } }
    });
    
    // Delete duplicate resumes
    const result = await prisma.resume.deleteMany({
      where: { id: { in: duplicates }, userId }
    });
    
    res.json({ 
      message: `Removed ${result.count} duplicate resumes`, 
      removed: result.count 
    });
  } catch (error) {
    console.error('Remove duplicates error:', error);
    res.status(500).json({ error: 'Failed to remove duplicates' });
  }
}

export async function testAI(req, res) {
  try {
    const { rewriteTextProfessional } = await import('../utils/ai.js');
    const result = await rewriteTextProfessional('Software Engineer with experience');
    res.json({ 
      success: true, 
      result,
      length: result?.length || 0,
      hasApiKeys: {
        hf: !!process.env.HF_API_KEY,
        openrouter: !!process.env.OPENROUTER_API_KEY,
        groq: !!process.env.GROQ_API_KEY
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message,
      hasApiKeys: {
        hf: !!process.env.HF_API_KEY,
        openrouter: !!process.env.OPENROUTER_API_KEY,
        groq: !!process.env.GROQ_API_KEY
      }
    });
  }
}