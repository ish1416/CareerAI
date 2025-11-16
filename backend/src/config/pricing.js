export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: ['Basic resume builder', '1 resume template', 'Basic AI suggestions'],
    limits: { resumes: 1, analyses: 3 }
  },
  pro: {
    name: 'Pro',
    price: 9.99,
    stripePrice: process.env.STRIPE_PRICE_PRO || 'price_pro',
    features: ['All resume templates', 'Unlimited resumes', 'Advanced AI analysis', 'Cover letters'],
    limits: { resumes: -1, analyses: -1 }
  },
  premium: {
    name: 'Premium', 
    price: 19.99,
    stripePrice: process.env.STRIPE_PRICE_PREMIUM || 'price_premium',
    features: ['Everything in Pro', 'Job matching', 'Interview prep', 'Career coaching'],
    limits: { resumes: -1, analyses: -1 }
  }
};