import Stripe from 'stripe';
import { prisma } from '../config/prisma.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2022-11-15' });

function mapPriceToPlan(priceId) {
  const pro = process.env.STRIPE_PRICE_PRO;
  const premium = process.env.STRIPE_PRICE_PREMIUM;
  if (priceId === pro) return 'pro';
  if (priceId === premium) return 'premium';
  return 'pro';
}

export async function stripeWebhook(req, res) {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('Missing STRIPE_WEBHOOK_SECRET');
    return res.status(500).json({ error: 'Webhook misconfigured' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = parseInt(session.client_reference_id, 10);
        const customerId = session.customer;
        const subscriptionId = session.subscription;

        let plan = 'pro';
        try {
          if (subscriptionId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const lineItem = sub.items?.data?.[0];
            const priceId = lineItem?.price?.id;
            plan = mapPriceToPlan(priceId);
          } else if (session.metadata?.plan) {
            plan = session.metadata.plan;
          }
        } catch (e) {
          console.warn('Failed to retrieve subscription for plan mapping:', e.message);
        }

        if (Number.isInteger(userId)) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              plan,
              stripeCustomerId: customerId || undefined,
              stripeSubscriptionId: subscriptionId ? String(subscriptionId) : undefined,
            },
          });
        }
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        if (customerId) {
          const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
          if (user) {
            await prisma.user.update({
              where: { id: user.id },
              data: { plan: 'free', stripeSubscriptionId: null },
            });
          }
        }
        break;
      }
      default:
        // ignore unhandled events
        break;
    }

    res.json({ received: true });
  } catch (e) {
    console.error('Webhook handling error:', e.message);
    res.status(500).json({ error: 'Webhook handler failure' });
  }
}