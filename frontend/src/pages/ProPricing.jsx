import { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../components/Toast.jsx';
import { Check, Sparkles, Zap, Crown, ArrowRight, Star } from 'lucide-react';
import StripeCheckout from '../components/StripeCheckout.jsx';

export default function ProPricing() {
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
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{error}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Unlock the full power of AI-driven career tools with flexible pricing designed for every stage of your journey
            </p>
            {!user && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-blue-700 text-sm">💡 Sign in to subscribe and unlock premium features</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`rounded-2xl p-8 ${
                tier.plan === 'pro' 
                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 text-white transform scale-105 shadow-2xl' 
                  : 'bg-white border border-gray-200 shadow-sm'
              } relative`}
            >
              {tier.plan === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-white text-blue-600 px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              )}
              
              <div className="text-center">
                <div className={`w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                  tier.plan === 'pro' ? 'bg-white/20' : getIconBackground(tier.plan)
                }`}>
                  {tier.plan === 'free' && <Sparkles size={32} className="text-green-600" />}
                  {tier.plan === 'pro' && <Zap size={32} className="text-white" />}
                  {tier.plan === 'premium' && <Crown size={32} className="text-yellow-600" />}
                </div>
                
                <h3 className={`text-2xl font-bold mb-2 ${tier.plan === 'pro' ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                
                <div className="mb-6">
                  <span className="text-5xl font-bold">
                    {currency === 'INR' ? '₹' : '$'}{tier.priceMonthly}
                  </span>
                  <span className={`text-lg ${tier.plan === 'pro' ? 'text-white/80' : 'text-gray-500'}`}>
                    /month
                  </span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check size={20} className={`mt-0.5 ${tier.plan === 'pro' ? 'text-white' : 'text-green-500'}`} />
                    <span className={`text-sm ${tier.plan === 'pro' ? 'text-white' : 'text-gray-600'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              {user ? (
                <StripeCheckout
                  plan={tier.plan}
                  planName={tier.name}
                  price={tier.priceMonthly}
                  features={tier.features}
                  onSuccess={handleSubscriptionSuccess}
                />
              ) : (
                <button 
                  className={`w-full py-3 px-6 rounded-lg font-semibold text-sm transition-colors ${
                    tier.plan === 'pro'
                      ? 'bg-white text-blue-600 hover:bg-gray-100'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!user}
                >
                  Sign In to Subscribe
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Features Comparison */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Upgrade?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock advanced features that give you a competitive edge in your job search
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Sparkles size={32} className="text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Advanced AI Analysis</h3>
              <p className="text-gray-600">
                Get comprehensive ATS reports, keyword optimization, and tailored recommendations for every job application.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-green-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Zap size={32} className="text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">AI-Powered Builder</h3>
              <p className="text-gray-600">
                Use AI to refine tone, clarity, and impact across all resume sections with intelligent suggestions.
              </p>
            </div>
            
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-purple-100 rounded-xl mx-auto mb-4 flex items-center justify-center">
                <Crown size={32} className="text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Priority Support</h3>
              <p className="text-gray-600">
                Get faster responses and dedicated assistance from our expert team for all your career needs.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Professionals</h2>
            <p className="text-lg text-gray-600">See what our users say about CareerAI</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Chen",
                role: "Software Engineer at Google",
                content: "CareerAI's AI analysis helped me optimize my resume and land my dream job. The insights were incredibly detailed.",
                rating: 5
              },
              {
                name: "Michael Rodriguez", 
                role: "Product Manager at Microsoft",
                content: "The resume builder and ATS optimization features are game-changers. Highly recommend the Pro plan!",
                rating: 5
              },
              {
                name: "Emily Johnson",
                role: "Data Scientist at Amazon", 
                content: "Best career platform I've used. The AI feedback helped me improve my resume significantly.",
                rating: 5
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who've already upgraded their careers with CareerAI
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2">
            Start Your Free Trial
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );

  function getIconBackground(plan) {
    switch(plan) {
      case 'free': return 'bg-green-100';
      case 'premium': return 'bg-yellow-100';
      default: return 'bg-blue-100';
    }
  }
}