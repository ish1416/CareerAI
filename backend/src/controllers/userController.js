import { prisma } from '../config/prisma.js';

export async function getProfile(req, res) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        emailVerified: true,
        createdAt: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
}

export async function getDashboard(req, res) {
  try {
    const userId = req.user.id;
    
    // Get resume count
    const resumesCount = await prisma.resume.count({
      where: { userId }
    });
    
    // Get average ATS score
    const analysisReports = await prisma.analysisReport.findMany({
      where: {
        resume: {
          userId
        }
      },
      select: {
        atsScore: true,
        date: true
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    const averageATSScore = analysisReports.length > 0 
      ? analysisReports.reduce((sum, report) => sum + report.atsScore, 0) / analysisReports.length
      : 0;
    
    const lastAnalysisDate = analysisReports.length > 0 
      ? analysisReports[0].date 
      : null;
    
    res.json({
      resumesCount,
      averageATSScore: Math.round(averageATSScore),
      lastAnalysisDate
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
}

export async function updateProfile(req, res) {
  try {
    const { name } = req.body;
    
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: { name },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        emailVerified: true
      }
    });
    
    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
}