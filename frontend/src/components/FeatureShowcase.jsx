import React from 'react';
import { FileText, Brain, Target, TrendingUp, Users, Award, Zap, Shield } from 'lucide-react';

const FeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant ATS compatibility scores and personalized improvement suggestions',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: '15+ ATS-optimized templates designed by career experts',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Find jobs that match your skills with AI-powered recommendations',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Real-time salary data, growth trends, and industry analytics',
      color: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with AI-generated questions and get real-time feedback',
      color: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor your progress and see improvement over time',
      color: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'One-click resume enhancement with AI-powered suggestions',
      color: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)'
    }
  ];

  return (
    <section className="section" id="showcase" style={{ padding: 'var(--space-8) 0' }}>
      <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Everything You Need to Land Your Dream Job</h2>
        <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents</p>
        <div style={{ height: '3px', width: '80px', background: 'var(--gradient-primary)', borderRadius: '2px', margin: '0 auto' }} />
      </div>
      
      <div className="grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card shine feature-card" style={{ padding: 'var(--space-5)', textAlign: 'center' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: feature.color,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-3)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}>
                <Icon size={24} color="white" />
              </div>
              
              <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: 600 }}>{feature.title}</h4>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>{feature.description}</p>
            </div>
          );
        })}
      </div>

      {/* Stats Section */}
      <div className="grid stats" style={{ marginTop: 'var(--space-8)' }}>
        <div className="card shine" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--accent-blue)' }}>50K+</h3>
          <p className="muted" style={{ margin: 0 }}>Resumes Created</p>
        </div>
        <div className="card shine" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--success)' }}>95%</h3>
          <p className="muted" style={{ margin: 0 }}>ATS Pass Rate</p>
        </div>
        <div className="card shine" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--warning)' }}>2.5x</h3>
          <p className="muted" style={{ margin: 0 }}>More Interviews</p>
        </div>
        <div className="card shine" style={{ textAlign: 'center' }}>
          <h3 style={{ margin: '0 0 var(--space-1) 0', color: 'var(--info)' }}>24/7</h3>
          <p className="muted" style={{ margin: 0 }}>AI Support</p>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;