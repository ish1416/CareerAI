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
    <div style={{ marginTop: '60px', padding: '0 24px', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Hero Section */}
      <div style={{ textAlign: 'center', padding: 'var(--space-8) 0', background: 'var(--bg)' }}>
        <h1 style={{ fontSize: 'var(--text-5xl)', fontWeight: '800', marginBottom: 'var(--space-3)' }}>Choose Your Plan</h1>
        <p style={{ fontSize: 'var(--text-xl)', color: 'var(--text-soft)', maxWidth: '600px', margin: '0 auto var(--space-6)' }}>
          Unlock the full power of AI-driven career tools with flexible pricing designed for every stage of your journey
        </p>
        {!user && (
          <div style={{ 
            background: 'var(--info-bg)', 
            border: '1px solid var(--info-border)', 
            borderRadius: '12px', 
            padding: 'var(--space-4)', 
            maxWidth: '500px', 
            margin: '0 auto',
            color: 'var(--info)'
          }}>
            💡 Sign in to subscribe and unlock premium features
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div style={{ padding: 'var(--space-8) 0' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto', flexWrap: 'wrap' }}>
          {tiers.map((t) => (
            <div key={t.name} style={{
              background: t.plan === 'pro' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'var(--surface)',
              border: t.plan === 'pro' ? 'none' : '1px solid var(--border)',
              borderRadius: '20px',
              padding: 'var(--space-6)',
              width: '350px',
              textAlign: 'center',
              color: t.plan === 'pro' ? 'white' : 'var(--text)',
              position: 'relative',
              transform: t.plan === 'pro' ? 'scale(1.05)' : 'scale(1)',
              boxShadow: t.plan === 'pro' ? '0 20px 40px rgba(102, 126, 234, 0.3)' : 'var(--shadow)',
              transition: 'all 0.3s ease'
            }}>
              {t.plan === 'pro' && (
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  background: 'white',
                  color: '#667eea',
                  padding: '6px 20px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                }}>MOST POPULAR</div>
              )}
              
              <div style={{
                width: '60px',
                height: '60px',
                background: t.plan === 'pro' ? 'rgba(255,255,255,0.2)' : getIconBackground(t.plan),
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)'
              }}>
                {t.plan === 'free' && <Sparkles size={28} color={t.plan === 'pro' ? 'white' : '#10b981'} />}
                {t.plan === 'pro' && <Zap size={28} color="white" />}
                {t.plan === 'premium' && <Crown size={28} color={t.plan === 'pro' ? 'white' : '#f59e0b'} />}
              </div>
              
              <h3 style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>{t.name}</h3>
              
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <span style={{ fontSize: '48px', fontWeight: '800' }}>
                  {currency === 'INR' ? '₹' : '$'}{t.priceMonthly}
                </span>
                <span style={{ fontSize: 'var(--text-lg)', opacity: 0.7 }}>/month</span>
              </div>
              
              <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
                {t.features.map((f) => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <Check size={18} color={t.plan === 'pro' ? 'white' : '#10b981'} />
                    <span style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{f}</span>
                  </div>
                ))}
              </div>
              
              {user ? (
                <StripeCheckout
                  plan={t.plan}
                  planName={t.name}
                  price={t.priceMonthly}
                  features={t.features}
                  onSuccess={handleSubscriptionSuccess}
                />
              ) : (
                <button style={{
                  width: '100%',
                  padding: '14px 28px',
                  background: t.plan === 'pro' ? 'white' : 'var(--primary)',
                  color: t.plan === 'pro' ? '#667eea' : 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: 'var(--text-base)',
                  fontWeight: '600',
                  cursor: 'not-allowed',
                  opacity: 0.7
                }}>
                  Sign In to Subscribe
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Why Upgrade Section */}
      <div style={{ padding: 'var(--space-8) 0', background: 'var(--bg-subtle)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', fontWeight: '800', marginBottom: 'var(--space-3)' }}>Why Upgrade?</h2>
          <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-soft)', maxWidth: '600px', margin: '0 auto' }}>
            Unlock advanced features that give you a competitive edge in your job search
          </p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{
            background: 'var(--surface)',
            padding: 'var(--space-6)',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <Sparkles size={24} color="white" />
            </div>
            <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Advanced AI Analysis</h4>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>Get comprehensive ATS reports, keyword optimization, and tailored recommendations for every job application.</p>
          </div>
          
          <div style={{
            background: 'var(--surface)',
            padding: 'var(--space-6)',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <Zap size={24} color="white" />
            </div>
            <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>AI-Powered Builder</h4>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>Use AI to refine tone, clarity, and impact across all resume sections with intelligent suggestions.</p>
          </div>
          
          <div style={{
            background: 'var(--surface)',
            padding: 'var(--space-6)',
            borderRadius: '16px',
            textAlign: 'center',
            border: '1px solid var(--border)'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-3)'
            }}>
              <Crown size={24} color="white" />
            </div>
            <h4 style={{ fontSize: 'var(--text-xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Priority Support</h4>
            <p style={{ color: 'var(--text-soft)', lineHeight: 1.6 }}>Get faster responses and dedicated assistance from our expert team for all your career needs.</p>
          </div>
        </div>
      </div>
    </div>
  );

  function getIconBackground(plan) {
    switch(plan) {
      case 'free': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      case 'premium': return 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)';
      default: return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  }
}