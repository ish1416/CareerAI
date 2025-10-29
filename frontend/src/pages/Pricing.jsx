import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Check, Sparkles, Zap, Crown } from 'lucide-react';
import { SkeletonGrid } from '../components/Skeleton.jsx';
import StripeCheckout from '../components/StripeCheckout.jsx';

export default function Pricing() {
  const [tiers, setTiers] = useState([]);
  const [currency, setCurrency] = useState('INR');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/pricing');
        setTiers(data.tiers || []);
        setCurrency(data.currency || 'INR');
      } catch (e) {
        console.error(e);
        setError('Failed to load pricing');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Verify success without webhooks using session_id
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get('success');
    const sessionId = params.get('session_id');
    if (success === 'true' && sessionId) {
      (async () => {
        try {
          const { data } = await api.get('/payment/confirm', { params: { session_id: sessionId } });
          if (data?.status === 'ok' && data?.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            showToast('Subscription activated', 'success');
            // Clear params and navigate
            const url = new URL(window.location.href);
            url.search = '';
            window.history.replaceState({}, '', url.toString());
            window.location.href = '/dashboard';
          } else {
            showToast('Could not verify payment', 'error');
          }
        } catch (e) {
          console.error(e);
          showToast('Payment verification failed', 'error');
        }
      })();
    }
  }, []);

  const handleSubscriptionSuccess = () => {
    showToast('Plan activated successfully!', 'success');
    // Refresh user data or redirect
    window.location.reload();
  };

  if (loading) return (
    <div className="section">
      <div className="skeleton title" style={{ width: '300px', margin: '0 auto var(--space-4)' }} />
      <SkeletonGrid count={3} />
    </div>
  );
  
  if (error) return (
    <div className="card" style={{ background: 'var(--error-bg)', borderColor: 'var(--error-border)' }}>
      <p style={{ color: 'var(--error)', margin: 0 }}>{error}</p>
    </div>
  );

  return (
    <div className="section" id="pricing">
      <h2>Choose Your Plan</h2>
      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Review plan features and subscribe to the tier that fits you.</p>
        <ol className="step-list">
          <li>Sign in to access paid plan checkout.</li>
          <li>Compare features across Free and Pro tiers.</li>
          <li>Click Subscribe to start your plan securely.</li>
        </ol>
      </div>
      {!user && (
        <p className="sub">Sign in to subscribe. You can still view plans and features.</p>
      )}
      <div className="pricing-grid">
        {tiers.map((t) => (
          <div key={t.name} className={`pricing-card ${t.plan === 'pro' ? 'recommended' : ''}`}>
            {t.plan === 'pro' && <span className="plan-badge">⭐ Popular</span>}
            <div style={{ marginBottom: 'var(--space-3)' }}>
              {t.plan === 'free' && <Sparkles size={32} color="var(--accent-blue)" />}
              {t.plan === 'pro' && <Zap size={32} color="var(--warning)" />}
              {t.plan === 'premium' && <Crown size={32} color="var(--success)" />}
            </div>
            <h3 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-2)' }}>{t.name}</h3>
            <p className="price" style={{ marginBottom: 'var(--space-4)' }}>
              {currency} {t.priceMonthly}
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 400, color: 'var(--text-soft)' }}>/month</span>
            </p>
            <ul className="features">
              {t.features.map((f) => (
                <li key={f}>
                  <Check size={16} color="var(--success)" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {user ? (
              <StripeCheckout
                plan={t.plan}
                planName={t.name}
                price={t.priceMonthly}
                features={t.features}
                onSuccess={handleSubscriptionSuccess}
              />
            ) : (
              <button
                className="btn ghost"
                disabled
                title="Login to subscribe"
                style={{ marginTop: 'auto', width: '100%' }}
              >
                Login to Subscribe
              </button>
            )}
          </div>
        ))}
      </div>

      <section className="section">
        <h3>Why Upgrade?</h3>
        <div className="grid">
          <div className="card shine">
            <h4>Deeper Insights</h4>
            <p>Get comprehensive ATS reports and tailored recommendations.</p>
          </div>
          <div className="card shine">
            <h4>AI Builder</h4>
            <p>Use AI to refine tone, clarity, and impact across sections.</p>
          </div>
          <div className="card shine">
            <h4>Priority Support</h4>
            <p>Faster responses from our team for Pro/Premium members.</p>
          </div>
        </div>
      </section>
    </div>
  );
}