import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { generate } from '../controllers/coverLetterController.js';

const router = Router();

router.post('/generate', requireAuth, generate);

export default router;