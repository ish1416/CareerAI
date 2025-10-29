import express from 'express';
import { Router } from 'express';
import { stripeWebhook } from '../controllers/stripeWebhookController.js';

const router = Router();

// Use raw body parser for Stripe webhook signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), stripeWebhook);

export default router;