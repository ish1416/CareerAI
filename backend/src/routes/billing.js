import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getPricing, createCheckoutSession, confirmCheckout } from '../controllers/billingController.js';

const router = Router();

router.get('/pricing', getPricing);
router.post('/payment/checkout', requireAuth, createCheckoutSession);
router.get('/payment/confirm', requireAuth, confirmCheckout);

export default router;