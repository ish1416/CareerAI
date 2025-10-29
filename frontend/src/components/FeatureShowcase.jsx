import React from 'react';
import { FileText, Brain, Target, TrendingUp, Users, Award, Zap, Shield } from 'lucide-react';

const FeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant ATS compatibility scores and personalized improvement suggestions',
      color: '#6366f1'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: '15+ ATS-optimized templates designed by career experts',
      color: '#22c55e'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Find jobs that match your skills with AI-powered recommendations',
      color: '#f59e0b'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Real-time salary data, growth trends, and industry analytics',
      color: '#3b82f6'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with AI-generated questions and get real-time feedback',
      color: '#6366f1'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor your progress and see improvement over time',
      color: '#f59e0b'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'One-click resume enhancement with AI-powered suggestions',
      color: '#3b82f6'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties',
      color: '#64748b'
    }
  ];

  return (
    <section className="section" id="showcase">
      <div className="section-intro">
        <h3 className="section-title">Everything You Need to Land Your Dream Job</h3>
        <p className="muted">Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents</p>
      </div>
      
      <div className="grid">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div key={feature.title} className="card shine feature-card">
              <div 
                className="icon-bubble"
                style={{ background: feature.color }}
              >
                <Icon size={24} color="white" />
              </div>
              
              <h4>{feature.title}</h4>
              <p className="sub">{feature.description}</p>
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