import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { groqChat } from '../utils/groqClient.js';
import { PrismaClient } from '@prisma/client';
import CourseService from '../services/courseService.js';

const router = express.Router();
const prisma = new PrismaClient();
const courseService = new CourseService();

// Test endpoints (no auth)
router.get('/test-progress', async (req, res) => {
  try {
    const progress = {
      totalHours: 45,
      completedCourses: 3,
      activeCourses: 2,
      badges: ['JavaScript Master', 'React Developer'],
      streak: 7,
      level: 5,
      xp: 1250
    };
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load progress' });
  }
});

router.get('/test-tests', async (req, res) => {
  try {
    const tests = [
      { id: 1, title: 'JavaScript Basics', questions: 20, duration: 30, difficulty: 'Easy' },
      { id: 2, title: 'React Components', questions: 15, duration: 25, difficulty: 'Medium' },
      { id: 3, title: 'Node.js APIs', questions: 18, duration: 35, difficulty: 'Hard' }
    ];
    res.json({ tests });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load tests' });
  }
});

// Get learning dashboard data
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const userProgress = await prisma.userProgress.findUnique({
      where: { userId: req.user.id }
    });

    const enrolledCourses = await prisma.course.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    const userSkills = ['JavaScript', 'React', 'Node.js'];
    const recommendedCourses = await courseService.getRecommendedCourses(userSkills);

    const dashboardData = {
      overview: {
        coursesEnrolled: enrolledCourses.length,
        coursesCompleted: enrolledCourses.filter(c => c.completed).length,
        hoursLearned: userProgress?.totalHours || 0,
        certificatesEarned: userProgress?.badges ? JSON.parse(userProgress.badges).length : 0,
        currentStreak: userProgress?.streak || 0,
        level: userProgress?.level || 1,
        xp: userProgress?.xp || 0,
        nextLevelXP: (userProgress?.level || 1) * 1000
      },
      currentCourses: enrolledCourses.filter(c => !c.completed).map(course => ({
        id: course.id,
        title: course.title,
        provider: course.provider,
        progress: course.progress,
        difficulty: course.level,
        url: course.url
      })),
      recommendedCourses: recommendedCourses.slice(0, 6),
      recentActivity: [],
      skillProgress: [],
      upcomingDeadlines: [],
      achievements: userProgress?.badges ? JSON.parse(userProgress.badges) : []
    };
    
    res.json(dashboardData);
  } catch (error) {
    console.error('Learning dashboard error:', error);
    res.status(500).json({ error: 'Failed to load learning dashboard' });
  }
});

// Get available courses
router.get('/courses', requireAuth, async (req, res) => {
  try {
    const { category, level, search, page = 1 } = req.query;
    
    let courses;
    
    if (search) {
      courses = await courseService.getCoursesBySkill(search, 20);
    } else {
      courses = await courseService.getFreeCourses(parseInt(page) - 1);
    }
    
    if (level) {
      courses = courses.filter(course => 
        course.level.toLowerCase() === level.toLowerCase()
      );
    }
    
    const categories = await courseService.getCategories();
    
    res.json({
      courses,
      totalCourses: courses.length,
      currentPage: parseInt(page),
      totalPages: Math.ceil(courses.length / 20),
      categories: categories.map(cat => cat.name),
      levels: ['Beginner', 'Intermediate', 'Advanced']
    });
  } catch (error) {
    console.error('Courses error:', error);
    res.status(500).json({ error: 'Failed to load courses' });
  }
});

// Course Recommendations
router.post('/courses/recommend', requireAuth, async (req, res) => {
  try {
    const { skills, careerGoal, experience } = req.body;
    
    const recommendedCourses = await courseService.getRecommendedCourses(skills || ['JavaScript']);
    
    res.json({ courses: recommendedCourses });
  } catch (error) {
    console.error('Course recommendation error:', error);
    res.status(500).json({ error: 'Failed to get recommendations' });
  }
});

// Learning Progress
router.get('/progress', requireAuth, async (req, res) => {
  try {
    let progress = await prisma.userProgress.findUnique({
      where: { userId: req.user.id }
    }).catch(() => null);
    
    if (!progress) {
      progress = {
        totalHours: 0,
        level: 1,
        xp: 0,
        streak: 0,
        badges: []
      };
    }
    
    res.json(progress);
  } catch (error) {
    console.error('Progress error:', error);
    res.json({
      totalHours: 0,
      level: 1,
      xp: 0,
      streak: 0,
      badges: []
    });
  }
});

// Skill Tests
router.get('/tests', requireAuth, async (req, res) => {
  try {
    const tests = [
      { id: 1, title: 'JavaScript Basics', questions: 20, duration: 30, difficulty: 'Easy' },
      { id: 2, title: 'React Components', questions: 15, duration: 25, difficulty: 'Medium' },
      { id: 3, title: 'Node.js APIs', questions: 18, duration: 35, difficulty: 'Hard' }
    ];
    
    res.json({ tests });
  } catch (error) {
    console.error('Tests error:', error);
    res.json({ tests: [] });
  }
});

router.post('/tests/:id/start', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const questions = [
      { id: 1, question: 'What is a closure in JavaScript?', options: ['A function', 'A variable', 'A scope concept', 'An object'], correct: 2 },
      { id: 2, question: 'Which hook is used for state in React?', options: ['useEffect', 'useState', 'useContext', 'useReducer'], correct: 1 }
    ];
    
    res.json({ questions, timeLimit: 1800 });
  } catch (error) {
    res.status(500).json({ error: 'Failed to start test' });
  }
});

router.post('/tests/:id/submit', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    
    const score = Math.floor(Math.random() * 40) + 60;
    const feedback = score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job, keep practicing!' : 'Review the concepts and try again.';
    
    await prisma.skillTest.update({
      where: { id: parseInt(id) },
      data: {
        score,
        completed: true
      }
    });
    
    // Update user analytics
    await prisma.userAnalytics.upsert({
      where: { userId: req.user.id },
      update: { skillsAssessed: { increment: 1 } },
      create: { userId: req.user.id, skillsAssessed: 1 }
    });
    
    res.json({ score, feedback, passed: score >= 60 });
  } catch (error) {
    console.error('Submit test error:', error);
    res.status(500).json({ error: 'Failed to submit test' });
  }
});

// Learning Paths
router.get('/paths', requireAuth, async (req, res) => {
  try {
    const paths = [
      {
        id: 1,
        title: 'Frontend Developer',
        description: 'Master modern web development',
        duration: '12 weeks',
        progress: 0
      },
      {
        id: 2,
        title: 'Full Stack Developer', 
        description: 'Complete web development stack',
        duration: '20 weeks',
        progress: 0
      }
    ];
    
    res.json({ paths });
  } catch (error) {
    console.error('Paths error:', error);
    res.json({ paths: [] });
  }
});

// Course Management
router.post('/courses', requireAuth, async (req, res) => {
  try {
    const { title, provider, duration, level, description, url, pathId } = req.body;
    
    const course = await prisma.course.create({
      data: {
        userId: req.user.id,
        pathId: pathId || null,
        title,
        provider,
        duration,
        level,
        description,
        url
      }
    });
    
    res.json(course);
  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

router.put('/courses/:id/progress', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress, completed } = req.body;
    
    const course = await prisma.course.update({
      where: { id: parseInt(id) },
      data: { progress, completed }
    });
    
    if (completed) {
      await prisma.userAnalytics.upsert({
        where: { userId: req.user.id },
        update: { coursesCompleted: { increment: 1 } },
        create: { userId: req.user.id, coursesCompleted: 1 }
      });
      
      // Update user progress XP
      await prisma.userProgress.upsert({
        where: { userId: req.user.id },
        update: { xp: { increment: 100 }, totalHours: { increment: 2 } },
        create: { userId: req.user.id, xp: 100, totalHours: 2 }
      });
    }
    
    res.json(course);
  } catch (error) {
    console.error('Update course progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Learning Path Management
router.post('/paths', requireAuth, async (req, res) => {
  try {
    const { title, description, duration, skills } = req.body;
    
    const path = await prisma.learningPath.create({
      data: {
        userId: req.user.id,
        title,
        description,
        duration,
        skills
      }
    });
    
    res.json(path);
  } catch (error) {
    console.error('Create path error:', error);
    res.status(500).json({ error: 'Failed to create learning path' });
  }
});

router.put('/paths/:id/progress', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { progress } = req.body;
    
    const path = await prisma.learningPath.update({
      where: { id: parseInt(id) },
      data: { progress }
    });
    
    res.json(path);
  } catch (error) {
    console.error('Update path progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

// Progress Updates
router.post('/progress/update', requireAuth, async (req, res) => {
  try {
    const { hours, xp, badge } = req.body;
    
    const progress = await prisma.userProgress.upsert({
      where: { userId: req.user.id },
      update: {
        totalHours: { increment: hours || 0 },
        xp: { increment: xp || 0 },
        badges: badge ? { push: badge } : undefined,
        lastActive: new Date()
      },
      create: {
        userId: req.user.id,
        totalHours: hours || 0,
        xp: xp || 0,
        badges: badge ? [badge] : []
      }
    });
    
    res.json(progress);
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;