import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// Get Career Goals
router.get('/', requireAuth, async (req, res) => {
  try {
    const goals = await prisma.careerGoal.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json({ goals });
  } catch (error) {
    console.error('Career goals error:', error);
    res.status(500).json({ error: 'Failed to load career goals' });
  }
});

// Create Career Goal
router.post('/', requireAuth, async (req, res) => {
  try {
    const { title, description, targetDate, priority } = req.body;
    
    const goal = await prisma.careerGoal.create({
      data: {
        userId: req.user.id,
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        priority: priority || 'medium',
        status: 'active',
        progress: 0
      }
    });
    
    res.json({ goal });
  } catch (error) {
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create career goal' });
  }
});

// Update Career Goal
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, targetDate, priority, status, progress } = req.body;
    
    const goal = await prisma.careerGoal.update({
      where: { id: parseInt(id) },
      data: {
        title,
        description,
        targetDate: targetDate ? new Date(targetDate) : null,
        priority,
        status,
        progress
      }
    });
    
    res.json({ goal });
  } catch (error) {
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update career goal' });
  }
});

// Delete Career Goal
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.careerGoal.delete({
      where: { id: parseInt(id) }
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete career goal' });
  }
});

export default router;