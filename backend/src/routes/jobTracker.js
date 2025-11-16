import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';
import GoogleCalendarService from '../services/googleCalendar.js';

const router = express.Router();
const prisma = new PrismaClient();

// Job Applications
router.get('/applications', requireAuth, async (req, res) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ applications });
  } catch (error) {
    console.error('Applications error:', error);
    res.status(500).json({ error: 'Failed to load applications' });
  }
});

router.post('/applications', requireAuth, async (req, res) => {
  try {
    const { company, position, jobUrl, salary, location, notes } = req.body;
    
    const application = await prisma.jobApplication.create({
      data: {
        userId: req.user.id,
        company,
        position,
        jobUrl,
        salary,
        location,
        notes,
        status: 'applied'
      }
    });
    
    // Update analytics
    await prisma.userAnalytics.upsert({
      where: { userId: req.user.id },
      update: { applicationsSent: { increment: 1 } },
      create: { userId: req.user.id, applicationsSent: 1 }
    });
    
    res.json({ application });
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ error: 'Failed to create application' });
  }
});

router.put('/applications/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    const application = await prisma.jobApplication.update({
      where: { id: parseInt(id) },
      data: { status, notes }
    });
    
    // Update analytics based on status
    if (status === 'interview') {
      await prisma.userAnalytics.upsert({
        where: { userId: req.user.id },
        update: { interviewsScheduled: { increment: 1 } },
        create: { userId: req.user.id, interviewsScheduled: 1 }
      });
    } else if (status === 'offer') {
      await prisma.userAnalytics.upsert({
        where: { userId: req.user.id },
        update: { offersReceived: { increment: 1 } },
        create: { userId: req.user.id, offersReceived: 1 }
      });
    }
    
    res.json({ success: true, application });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ error: 'Failed to update application' });
  }
});

// Calendar Integration
router.get('/calendar/events', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { googleTokens: true }
    });

    if (!user?.googleTokens) {
      return res.json({ events: [], needsAuth: true });
    }

    const calendarService = new GoogleCalendarService();
    calendarService.setCredentials(JSON.parse(user.googleTokens));
    
    const events = await calendarService.getEvents();
    const jobEvents = events.filter(event => event.isJobRelated);
    
    res.json({ events: jobEvents });
  } catch (error) {
    console.error('Calendar events error:', error);
    res.status(500).json({ error: 'Failed to load events' });
  }
});

router.post('/calendar/sync', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { googleTokens: true }
    });

    if (!user?.googleTokens) {
      return res.status(400).json({ error: 'Google Calendar not connected' });
    }

    const calendarService = new GoogleCalendarService();
    calendarService.setCredentials(JSON.parse(user.googleTokens));
    
    // Get applications that need calendar sync
    const applications = await prisma.jobApplication.findMany({
      where: { 
        userId: req.user.id,
        interviewDate: { not: null },
        calendarEventId: null
      }
    });

    const syncedEvents = await calendarService.syncJobApplications(applications);
    
    // Update applications with calendar event IDs
    for (const sync of syncedEvents) {
      await prisma.jobApplication.update({
        where: { id: sync.applicationId },
        data: { calendarEventId: sync.eventId }
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Calendar synced successfully', 
      synced: syncedEvents.length 
    });
  } catch (error) {
    console.error('Calendar sync error:', error);
    res.status(500).json({ error: 'Failed to sync calendar' });
  }
});

// Follow-up Reminders
router.get('/reminders', requireAuth, async (req, res) => {
  try {
    const reminders = [
      {
        id: 1,
        applicationId: 1,
        company: 'Google',
        type: 'interview_prep',
        message: 'Prepare for technical interview tomorrow',
        dueDate: '2024-01-24',
        completed: false
      },
      {
        id: 2,
        applicationId: 2,
        company: 'Meta',
        type: 'followup',
        message: 'Follow up on application status',
        dueDate: '2024-01-27',
        completed: false
      }
    ];
    
    res.json({ reminders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load reminders' });
  }
});

router.post('/reminders', requireAuth, async (req, res) => {
  try {
    const { applicationId, type, message, dueDate } = req.body;
    
    const reminder = {
      id: Date.now(),
      applicationId,
      type,
      message,
      dueDate,
      completed: false,
      createdAt: new Date()
    };
    
    res.json({ reminder });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create reminder' });
  }
});

// Application Autofill
router.post('/autofill', requireAuth, async (req, res) => {
  try {
    const { jobUrl, resumeData } = req.body;
    
    // Mock autofill data extraction
    const autofillData = {
      personalInfo: {
        name: resumeData.name || 'John Doe',
        email: resumeData.email || 'john@example.com',
        phone: resumeData.phone || '+1-555-0123',
        address: resumeData.address || 'San Francisco, CA'
      },
      experience: resumeData.experience || '3+ years in software development',
      skills: resumeData.skills || ['JavaScript', 'React', 'Node.js'],
      education: resumeData.education || 'BS Computer Science',
      coverLetter: `Dear Hiring Manager,\n\nI am excited to apply for this position. With my background in ${resumeData.skills?.[0] || 'software development'}, I believe I would be a great fit for your team.\n\nBest regards,\n${resumeData.name || 'John Doe'}`
    };
    
    res.json({ autofillData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate autofill data' });
  }
});

// Document Vault
router.get('/documents', requireAuth, async (req, res) => {
  try {
    const documents = [
      {
        id: 1,
        name: 'Software Engineer Resume.pdf',
        type: 'resume',
        size: '245 KB',
        uploadDate: '2024-01-15',
        tags: ['current', 'tech'],
        url: '/api/documents/1'
      },
      {
        id: 2,
        name: 'Google Offer Letter.pdf',
        type: 'offer',
        size: '156 KB',
        uploadDate: '2024-01-20',
        tags: ['offer', 'google'],
        url: '/api/documents/2'
      },
      {
        id: 3,
        name: 'Experience Certificate.pdf',
        type: 'certificate',
        size: '89 KB',
        uploadDate: '2024-01-10',
        tags: ['experience', 'previous-job'],
        url: '/api/documents/3'
      }
    ];
    
    res.json({ documents });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load documents' });
  }
});

router.post('/documents', requireAuth, async (req, res) => {
  try {
    const { name, type, tags } = req.body;
    
    const document = {
      id: Date.now(),
      name,
      type,
      size: '123 KB',
      uploadDate: new Date().toISOString().split('T')[0],
      tags: tags || [],
      url: `/api/documents/${Date.now()}`
    };
    
    res.json({ document });
  } catch (error) {
    res.status(500).json({ error: 'Failed to upload document' });
  }
});

// Analytics
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const [totalApplications, interviews, offers, rejections, pending] = await Promise.all([
      prisma.jobApplication.count({ where: { userId: req.user.id } }),
      prisma.jobApplication.count({ where: { userId: req.user.id, status: 'interview' } }),
      prisma.jobApplication.count({ where: { userId: req.user.id, status: 'offer' } }),
      prisma.jobApplication.count({ where: { userId: req.user.id, status: 'rejected' } }),
      prisma.jobApplication.count({ where: { userId: req.user.id, status: 'applied' } })
    ]);
    
    const topCompanies = await prisma.jobApplication.groupBy({
      by: ['company'],
      where: { userId: req.user.id },
      _count: { company: true },
      orderBy: { _count: { company: 'desc' } },
      take: 5
    });
    
    const analytics = {
      overview: {
        totalApplications,
        interviews,
        offers,
        rejections,
        pending
      },
      responseRate: totalApplications > 0 ? ((interviews + offers + rejections) / totalApplications * 100).toFixed(1) : 0,
      topCompanies: topCompanies.map(c => ({
        company: c.company,
        applications: c._count.company
      }))
    };
    
    res.json({ analytics });
  } catch (error) {
    console.error('Job analytics error:', error);
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Google Auth Routes
router.get('/google/status', requireAuth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { googleConnected: true }
    });
    
    res.json({ connected: user?.googleConnected || false });
  } catch (error) {
    console.error('Google status error:', error);
    res.status(500).json({ error: 'Failed to check connection status' });
  }
});

router.get('/google/auth-url', requireAuth, async (req, res) => {
  try {
    const calendarService = new GoogleCalendarService();
    const authUrl = calendarService.getAuthUrl();
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Google auth URL error:', error);
    res.status(500).json({ error: 'Failed to generate auth URL' });
  }
});

router.post('/google/callback', requireAuth, async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code required' });
    }

    const calendarService = new GoogleCalendarService();
    const tokens = await calendarService.getTokens(code);
    
    await prisma.user.update({
      where: { id: req.user.id },
      data: { 
        googleTokens: JSON.stringify(tokens),
        googleConnected: true
      }
    });
    
    res.json({ success: true, message: 'Google Calendar connected successfully' });
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ error: 'Failed to connect Google Calendar' });
  }
});

export default router;