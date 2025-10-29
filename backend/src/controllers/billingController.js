import Stripe from 'stripe';
import { prisma } from '../config/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

export async function getPricing(req, res) {
  res.json({
    currency: 'USD',
    tiers: [
      {
        name: 'Free',
        priceMonthly: 0,
        features: ['3 Resume Uploads', 'Basic AI Analysis', 'Resume Builder Access'],
        plan: 'free',
      },
      {
        name: 'Pro',
        priceMonthly: 9.99,
        features: ['Unlimited Resume Uploads', 'Advanced AI Analysis', 'Job Matching', 'Cover Letter Generator', 'Priority Support'],
        plan: 'pro',
      },
      {
        name: 'Premium',
        priceMonthly: 19.99,
        features: ['Everything in Pro', 'Custom Resume Templates', 'LinkedIn Optimization', '1-on-1 Career Coaching', 'Interview Preparation'],
        plan: 'premium',
      },
    ],
  });
}

export async function createCheckoutSession(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const { plan } = req.body || {};
  if (!plan || !['free', 'pro', 'premium'].includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan' });
  }

  if (plan === 'free') {
    // Directly set plan to free without Stripe
    await prisma.user.update({
      where: { id: userId },
      data: { plan: 'free', stripeSubscriptionId: null },
    });
    return res.json({ status: 'ok', plan: 'free' });
  }

  try {
    const successUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/pricing?canceled=true`;

    const currency = 'USD';
    const amountMap = { pro: 9.99, premium: 19.99 };
    const unitAmount = Math.round((amountMap[plan] || amountMap.pro) * 100); // Convert to cents

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        price_data: {
          currency,
          product_data: { name: `CareerAI ${plan}` },
          recurring: { interval: 'month' },
          unit_amount: unitAmount,
        },
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: String(userId),
      metadata: { plan },
      allow_promotion_codes: true,
      customer_creation: 'always',
    });

    return res.json({ url: session.url });
  } catch (e) {
    console.error('Stripe checkout error:', e);
    return res.status(500).json({ error: 'Payment initialization failed' });
  }
}

export async function confirmCheckout(req, res) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  const sessionId = req.query?.session_id;
  if (!sessionId) return res.status(400).json({ error: 'Missing session_id' });

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (!session || String(session.client_reference_id) !== String(userId)) {
      return res.status(403).json({ error: 'Session not found for user' });
    }

    const statusOk = session.status === 'complete' || session.payment_status === 'paid';
    if (!statusOk) {
      return res.status(400).json({ error: 'Checkout not completed' });
    }

    const plan = session.metadata?.plan || 'pro';
    const customerId = session.customer || null;
    const subscriptionId = session.subscription ? String(session.subscription) : null;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: {
        plan,
        stripeCustomerId: customerId || undefined,
        stripeSubscriptionId: subscriptionId || undefined,
      },
    });

    return res.json({ status: 'ok', user: { id: updated.id, name: updated.name, email: updated.email, role: updated.role, plan: updated.plan } });
  } catch (e) {
    console.error('Confirm checkout error:', e);
    return res.status(500).json({ error: 'Failed to confirm checkout' });
  }
}