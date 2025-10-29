import { Router } from 'express';
import { requireAuth, requireVerified } from '../middleware/auth.js';
import { getDashboard, getProfile, updateProfile } from '../controllers/userController.js';

const router = Router();

router.get('/dashboard', requireAuth, getDashboard);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

export default router;