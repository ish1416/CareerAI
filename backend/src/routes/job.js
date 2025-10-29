import { Router } from 'express';
import multer from 'multer';
import { requireAuth } from '../middleware/auth.js';
import { uploadJD, compare } from '../controllers/jobController.js';

const router = Router();
const uploadMw = multer({ dest: 'uploads/' });

router.post('/upload', requireAuth, uploadMw.single('file'), uploadJD);
router.post('/compare', requireAuth, compare);

export default router;