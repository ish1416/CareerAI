import React from 'react';
import { FileText, Brain, Target, TrendingUp, Users, Award, Zap, Shield } from 'lucide-react';

const FeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant ATS compatibility scores and personalized improvement suggestions',
      color: 'var(--accent-blue)'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: '15+ ATS-optimized templates designed by career experts',
      color: 'var(--success)'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Find jobs that match your skills with AI-powered recommendations',
      color: 'var(--warning)'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Real-time salary data, growth trends, and industry analytics',
      color: 'var(--info)'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with AI-generated questions and get real-time feedback',
      color: 'var(--accent-blue)'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor your progress and see improvement over time',
      color: 'var(--warning)'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'One-click resume enhancement with AI-powered suggestions',
      color: 'var(--info)'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'var(--text-soft)'
    }
  ];

  return (
    <section className="section" style={{ background: 'var(--panel)', padding: 'var(--space-8) 0' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ 
            fontSize: 'var(--text-4xl)', 
            fontWeight: '700', 
            color: 'var(--text)', 
            marginBottom: 'var(--space-3)' 
          }}>
            Everything You Need to Land Your Dream Job
          </h2>
          <p style={{ 
            fontSize: 'var(--text-xl)', 
            color: 'var(--text-soft)', 
            maxWidth: '600px', 
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-5)'
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="card shine"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-5)',
                  transition: 'all var(--transition-base)'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: 'var(--radius-md)',
                  background: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 'var(--space-4)'
                }}>
                  <Icon size={24} color="white" />
                </div>
                
                <h3 style={{
                  fontSize: 'var(--text-lg)',
                  fontWeight: '600',
                  color: 'var(--text)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: 'var(--text-soft)',
                  fontSize: 'var(--text-sm)',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div style={{
          marginTop: 'var(--space-8)',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: 'var(--space-5)',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--text)', marginBottom: 'var(--space-1)' }}>50K+</div>
            <div style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>Resumes Created</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--text)', marginBottom: 'var(--space-1)' }}>95%</div>
            <div style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>ATS Pass Rate</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--text)', marginBottom: 'var(--space-1)' }}>2.5x</div>
            <div style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>More Interviews</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-3xl)', fontWeight: '700', color: 'var(--text)', marginBottom: 'var(--space-1)' }}>24/7</div>
            <div style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;