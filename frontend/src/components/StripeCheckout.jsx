import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import api from '../utils/api';
import { useToast } from './Toast.jsx';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function StripeCheckout({ plan, planName, price, features, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCheckout = async () => {
    if (plan === 'free') {
      try {
        await api.post('/payment/checkout', { plan: 'free' });
        showToast('Free plan activated!', 'success');
        if (onSuccess) onSuccess();
      } catch (error) {
        showToast('Failed to activate free plan', 'error');
      }
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post('/payment/checkout', { plan });
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        showToast('Failed to initialize checkout', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast(error?.response?.data?.error || 'Checkout failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className={`btn ${plan === 'pro' ? 'cta gradient' : plan === 'premium' ? 'success' : 'ghost'}`}
      onClick={handleCheckout}
      disabled={loading}
      style={{ width: '100%' }}
    >
      {loading ? 'Processing...' : plan === 'free' ? 'Start Free' : `Subscribe - $${price}/mo`}
    </button>
  );
}