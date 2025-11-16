import { Router } from 'express';
import multer from 'multer';
import { requireAuth, requireVerified } from '../middleware/auth.js';
import { enforcePlanLimits } from '../middleware/planLimits.js';
import { aiLimiter } from '../middleware/rateLimiter.js';
import { upload, analyze, rewrite, saveResume, listResumes, getResume, getResumeHistory, removeDuplicates, testAI } from '../controllers/resumeController.js';

const router = Router();
const uploadMw = multer({ dest: 'uploads/' });

router.post('/upload', requireAuth, requireVerified, uploadMw.single('file'), upload);
router.post('/analyze', requireAuth, requireVerified, aiLimiter, enforcePlanLimits('analyze'), analyze);
router.post('/rewrite', requireAuth, requireVerified, aiLimiter, enforcePlanLimits('rewrite'), rewrite);
router.post('/build', requireAuth, saveResume);
router.get('/list', requireAuth, listResumes);
router.get('/:id', requireAuth, getResume);
router.get('/:id/history', requireAuth, getResumeHistory);
router.get('/test/ai', requireAuth, testAI);
router.delete('/duplicates', requireAuth, removeDuplicates);

export default router;