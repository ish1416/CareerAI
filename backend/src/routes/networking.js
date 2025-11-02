import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Profile Showcase
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    // Mock profile data
    const profile = {
      id: userId,
      name: 'John Doe',
      title: 'Frontend Developer',
      location: 'San Francisco, CA',
      bio: 'Passionate developer with 3+ years experience in React and Node.js',
      skills: ['JavaScript', 'React', 'Node.js', 'Python'],
      experience: [
        { company: 'Tech Corp', role: 'Frontend Developer', duration: '2022-Present' }
      ],
      connections: 156,
      isPublic: true
    };
    
    res.json({ profile });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

router.put('/profile', requireAuth, async (req, res) => {
  try {
    const { name, title, bio, skills, isPublic } = req.body;
    
    // Mock profile update
    res.json({ success: true, message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Connections & Messaging
router.get('/connections', requireAuth, async (req, res) => {
  try {
    const connections = await prisma.networkConnection.findMany({
      where: {
        userId: req.user.id,
        status: 'accepted'
      },
      include: {
        connected: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.json({ connections });
  } catch (error) {
    console.error('Connections error:', error);
    res.status(500).json({ error: 'Failed to load connections' });
  }
});

router.post('/connect/:userId', requireAuth, async (req, res) => {
  try {
    const { userId } = req.params;
    const { message } = req.body;
    
    const connection = await prisma.networkConnection.create({
      data: {
        userId: req.user.id,
        connectedId: parseInt(userId),
        status: 'pending',
        message
      }
    });
    
    await prisma.userAnalytics.upsert({
      where: { userId: req.user.id },
      update: { networksGrown: { increment: 1 } },
      create: { userId: req.user.id, networksGrown: 1 }
    });
    
    res.json({ success: true, message: 'Connection request sent', connection });
  } catch (error) {
    console.error('Connect error:', error);
    res.status(500).json({ error: 'Failed to send connection request' });
  }
});

router.get('/messages', requireAuth, async (req, res) => {
  try {
    const conversations = [
      {
        id: 1,
        user: { name: 'Sarah Wilson', avatar: null },
        lastMessage: 'Thanks for connecting! Would love to chat about React.',
        timestamp: '2 hours ago',
        unread: true
      }
    ];
    
    res.json({ conversations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Discussion Forums
router.get('/forums', async (req, res) => {
  try {
    const forums = [
      {
        id: 1,
        title: 'Career Advice',
        description: 'General career guidance and tips',
        posts: 1234,
        members: 5678
      },
      {
        id: 2,
        title: 'Resume Reviews',
        description: 'Get feedback on your resume',
        posts: 890,
        members: 2345
      },
      {
        id: 3,
        title: 'Tech Discussions',
        description: 'Programming and technology topics',
        posts: 2345,
        members: 7890
      }
    ];
    
    res.json({ forums });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load forums' });
  }
});

router.get('/forums/:forumId/posts', async (req, res) => {
  try {
    const posts = [
      {
        id: 1,
        title: 'How to negotiate salary for first job?',
        author: 'John Doe',
        replies: 15,
        views: 234,
        timestamp: '2 hours ago',
        tags: ['salary', 'negotiation', 'entry-level']
      },
      {
        id: 2,
        title: 'Best way to transition from backend to frontend?',
        author: 'Jane Smith',
        replies: 8,
        views: 156,
        timestamp: '5 hours ago',
        tags: ['career-change', 'frontend', 'backend']
      }
    ];
    
    res.json({ posts });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load posts' });
  }
});

router.post('/forums/:forumId/posts', requireAuth, async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Mock post creation
    const post = {
      id: Date.now(),
      title,
      content,
      tags,
      author: req.user.name || 'Anonymous',
      timestamp: new Date(),
      replies: 0,
      views: 0
    };
    
    res.json({ post });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

// AI Group Recommendations
router.get('/recommendations/groups', requireAuth, async (req, res) => {
  try {
    let groups = await prisma.networkingGroup.findMany({
      where: { isPublic: true },
      take: 10,
      orderBy: { memberCount: 'desc' }
    });
    
    if (groups.length === 0) {
      const defaultGroups = [
        { name: 'React Developers Network', description: 'Community for React enthusiasts', industry: 'Technology', memberCount: 15000 },
        { name: 'Frontend Masters', description: 'Advanced frontend development discussions', industry: 'Technology', memberCount: 8500 },
        { name: 'Career Growth Hub', description: 'Professional development and career advice', industry: 'General', memberCount: 12000 },
        { name: 'Tech Startups', description: 'Startup founders and early employees', industry: 'Technology', memberCount: 9500 },
        { name: 'Remote Workers United', description: 'Community for remote professionals', industry: 'General', memberCount: 18000 }
      ];
      
      await prisma.networkingGroup.createMany({ data: defaultGroups });
      groups = await prisma.networkingGroup.findMany({ where: { isPublic: true } });
    }
    
    res.json({ groups });
  } catch (error) {
    console.error('Group recommendations error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

router.get('/recommendations/people', requireAuth, async (req, res) => {
  try {
    const people = [
      {
        id: 1,
        name: 'Alex Johnson',
        title: 'Senior React Developer',
        company: 'Stripe',
        mutualConnections: 3,
        reason: 'Similar skills and interests'
      },
      {
        id: 2,
        name: 'Emma Davis',
        title: 'Frontend Team Lead',
        company: 'Airbnb',
        mutualConnections: 5,
        reason: 'Works in your target role'
      }
    ];
    
    res.json({ people });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Recruiter Dashboard
router.get('/recruiter/jobs', requireAuth, async (req, res) => {
  try {
    const jobs = [
      {
        id: 1,
        title: 'Senior Frontend Developer',
        company: 'TechCorp',
        location: 'Remote',
        salary: '$120k-150k',
        applicants: 45,
        posted: '3 days ago'
      }
    ];
    
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

router.post('/recruiter/jobs', requireAuth, async (req, res) => {
  try {
    const { title, description, requirements, salary, location } = req.body;
    
    // Mock job posting
    const job = {
      id: Date.now(),
      title,
      description,
      requirements,
      salary,
      location,
      company: 'Your Company',
      posted: new Date(),
      applicants: 0
    };
    
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to post job' });
  }
});

router.get('/recruiter/candidates', requireAuth, async (req, res) => {
  try {
    const candidates = [
      {
        id: 1,
        name: 'John Doe',
        title: 'Frontend Developer',
        skills: ['React', 'JavaScript', 'CSS'],
        experience: '3 years',
        atsScore: 85,
        location: 'San Francisco'
      }
    ];
    
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load candidates' });
  }
});

// Group Management
router.post('/groups/join/:groupId', requireAuth, async (req, res) => {
  try {
    const { groupId } = req.params;
    
    const membership = await prisma.groupMember.create({
      data: {
        userId: req.user.id,
        groupId: parseInt(groupId),
        role: 'member'
      }
    });
    
    await prisma.networkingGroup.update({
      where: { id: parseInt(groupId) },
      data: { memberCount: { increment: 1 } }
    });
    
    res.json({ success: true, membership });
  } catch (error) {
    console.error('Join group error:', error);
    res.status(500).json({ error: 'Failed to join group' });
  }
});

router.get('/groups/my', requireAuth, async (req, res) => {
  try {
    const memberships = await prisma.groupMember.findMany({
      where: { userId: req.user.id },
      include: { group: true }
    });
    
    res.json({ groups: memberships.map(m => m.group) });
  } catch (error) {
    console.error('My groups error:', error);
    res.status(500).json({ error: 'Failed to load groups' });
  }
});

// Connection Management
router.put('/connections/:id/accept', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const connection = await prisma.networkConnection.update({
      where: { id: parseInt(id) },
      data: { status: 'accepted' }
    });
    
    res.json({ success: true, connection });
  } catch (error) {
    console.error('Accept connection error:', error);
    res.status(500).json({ error: 'Failed to accept connection' });
  }
});

router.get('/connections/pending', requireAuth, async (req, res) => {
  try {
    const pending = await prisma.networkConnection.findMany({
      where: {
        connectedId: req.user.id,
        status: 'pending'
      },
      include: {
        user: {
          select: { id: true, name: true, email: true }
        }
      }
    });
    
    res.json({ connections: pending });
  } catch (error) {
    console.error('Pending connections error:', error);
    res.status(500).json({ error: 'Failed to load pending connections' });
  }
});

export default router;