import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';

const router = express.Router();

// Company Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const dashboard = {
      stats: {
        activeJobs: 12,
        totalApplications: 456,
        interviewsScheduled: 23,
        hiredCandidates: 8
      },
      recentActivity: [
        { type: 'application', message: 'New application for Senior Developer', time: '2 hours ago' },
        { type: 'interview', message: 'Interview completed for Product Manager', time: '4 hours ago' },
        { type: 'hire', message: 'Candidate hired for UX Designer role', time: '1 day ago' }
      ],
      topJobs: [
        { title: 'Senior Software Engineer', applications: 89, views: 234 },
        { title: 'Product Manager', applications: 67, views: 189 },
        { title: 'UX Designer', applications: 45, views: 156 }
      ]
    };
    
    res.json({ dashboard });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// Job Management
router.get('/jobs', requireAuth, async (req, res) => {
  try {
    const jobs = [
      {
        id: 1,
        title: 'Senior Software Engineer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120k-150k',
        status: 'active',
        applications: 89,
        views: 234,
        postedDate: '2024-01-15',
        deadline: '2024-02-15'
      },
      {
        id: 2,
        title: 'Product Manager',
        department: 'Product',
        location: 'Remote',
        type: 'Full-time',
        salary: '$110k-140k',
        status: 'active',
        applications: 67,
        views: 189,
        postedDate: '2024-01-20',
        deadline: '2024-02-20'
      }
    ];
    
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load jobs' });
  }
});

router.post('/jobs', requireAuth, async (req, res) => {
  try {
    const { title, department, location, type, salary, description, requirements } = req.body;
    
    const job = {
      id: Date.now(),
      title,
      department,
      location,
      type,
      salary,
      description,
      requirements,
      status: 'active',
      applications: 0,
      views: 0,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    
    res.json({ job });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Candidate Analytics
router.get('/candidates/analytics', requireAuth, async (req, res) => {
  try {
    const analytics = {
      totalCandidates: 1234,
      qualifiedCandidates: 456,
      averageScore: 78.5,
      topSkills: [
        { skill: 'JavaScript', count: 234 },
        { skill: 'React', count: 189 },
        { skill: 'Python', count: 167 },
        { skill: 'Node.js', count: 145 }
      ],
      scoreDistribution: [
        { range: '90-100', count: 45 },
        { range: '80-89', count: 123 },
        { range: '70-79', count: 189 },
        { range: '60-69', count: 99 }
      ]
    };
    
    res.json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load analytics' });
  }
});

// Resume Filtering
router.post('/candidates/filter', requireAuth, async (req, res) => {
  try {
    const { skills, experience, location, salary } = req.body;
    
    const candidates = [
      {
        id: 1,
        name: 'John Doe',
        title: 'Senior Software Engineer',
        experience: '5 years',
        location: 'San Francisco, CA',
        skills: ['JavaScript', 'React', 'Node.js', 'Python'],
        atsScore: 92,
        salaryExpectation: '$130k',
        availability: 'Immediate',
        resumeUrl: '/resumes/john-doe.pdf'
      },
      {
        id: 2,
        name: 'Jane Smith',
        title: 'Full Stack Developer',
        experience: '3 years',
        location: 'Remote',
        skills: ['React', 'Python', 'Django', 'PostgreSQL'],
        atsScore: 87,
        salaryExpectation: '$110k',
        availability: '2 weeks',
        resumeUrl: '/resumes/jane-smith.pdf'
      }
    ];
    
    res.json({ candidates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to filter candidates' });
  }
});

// AI Ranking
router.post('/candidates/rank', requireAuth, async (req, res) => {
  try {
    const { jobId, candidates } = req.body;
    
    // Mock AI ranking
    const rankedCandidates = candidates.map(candidate => ({
      ...candidate,
      aiScore: Math.floor(Math.random() * 30) + 70,
      matchReasons: [
        'Strong technical skills match',
        'Relevant experience in similar role',
        'Good cultural fit indicators'
      ]
    })).sort((a, b) => b.aiScore - a.aiScore);
    
    res.json({ rankedCandidates });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rank candidates' });
  }
});

// Team Management
router.get('/team', requireAuth, async (req, res) => {
  try {
    const team = [
      {
        id: 1,
        name: 'Sarah Johnson',
        role: 'HR Manager',
        email: 'sarah@company.com',
        permissions: ['view_candidates', 'schedule_interviews', 'post_jobs'],
        lastActive: '2024-01-22'
      },
      {
        id: 2,
        name: 'Mike Chen',
        role: 'Technical Recruiter',
        email: 'mike@company.com',
        permissions: ['view_candidates', 'technical_screening'],
        lastActive: '2024-01-21'
      }
    ];
    
    res.json({ team });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load team' });
  }
});

router.post('/team', requireAuth, async (req, res) => {
  try {
    const { name, role, email, permissions } = req.body;
    
    const member = {
      id: Date.now(),
      name,
      role,
      email,
      permissions,
      lastActive: new Date().toISOString().split('T')[0],
      invitedBy: req.user.id,
      status: 'pending'
    };
    
    res.json({ member });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add team member' });
  }
});

// Subscription Plans
router.get('/plans', async (req, res) => {
  try {
    const plans = [
      {
        id: 'starter',
        name: 'Starter',
        price: 99,
        period: 'month',
        features: [
          'Up to 5 job postings',
          'Basic candidate filtering',
          'Email support',
          '100 resume views'
        ],
        limits: {
          jobs: 5,
          resumeViews: 100,
          teamMembers: 2
        }
      },
      {
        id: 'professional',
        name: 'Professional',
        price: 299,
        period: 'month',
        features: [
          'Up to 25 job postings',
          'Advanced AI filtering',
          'Priority support',
          'Unlimited resume views',
          'Team collaboration'
        ],
        limits: {
          jobs: 25,
          resumeViews: -1,
          teamMembers: 10
        },
        popular: true
      },
      {
        id: 'enterprise',
        name: 'Enterprise',
        price: 999,
        period: 'month',
        features: [
          'Unlimited job postings',
          'Custom AI models',
          'Dedicated support',
          'Advanced analytics',
          'API access',
          'Custom integrations'
        ],
        limits: {
          jobs: -1,
          resumeViews: -1,
          teamMembers: -1
        }
      }
    ];
    
    res.json({ plans });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load plans' });
  }
});

export default router;