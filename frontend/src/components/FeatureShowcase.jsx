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
    <section style={{ 
      background: '#f8fafc', 
      padding: '64px 0',
      margin: '48px 0'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 16px' 
      }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '64px' 
        }}>
          <h2 style={{ 
            fontSize: '36px', 
            fontWeight: '700', 
            color: '#0f172a', 
            marginBottom: '12px',
            margin: 0
          }}>
            Everything You Need to Land Your Dream Job
          </h2>
          <p style={{ 
            fontSize: '20px', 
            color: '#475569', 
            maxWidth: '600px', 
            margin: '12px auto 0',
            lineHeight: 1.6
          }}>
            Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '24px',
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-4px)';
                  e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '16px',
                  background: feature.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <Icon size={24} color="white" />
                </div>
                
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#0f172a',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>
                  {feature.title}
                </h3>
                
                <p style={{
                  color: '#475569',
                  fontSize: '14px',
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
          marginTop: '64px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '24px',
          textAlign: 'center'
        }}>
          <div>
            <div style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              color: '#0f172a', 
              marginBottom: '4px' 
            }}>50K+</div>
            <div style={{ 
              color: '#475569', 
              fontSize: '14px' 
            }}>Resumes Created</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              color: '#0f172a', 
              marginBottom: '4px' 
            }}>95%</div>
            <div style={{ 
              color: '#475569', 
              fontSize: '14px' 
            }}>ATS Pass Rate</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              color: '#0f172a', 
              marginBottom: '4px' 
            }}>2.5x</div>
            <div style={{ 
              color: '#475569', 
              fontSize: '14px' 
            }}>More Interviews</div>
          </div>
          <div>
            <div style={{ 
              fontSize: '30px', 
              fontWeight: '700', 
              color: '#0f172a', 
              marginBottom: '4px' 
            }}>24/7</div>
            <div style={{ 
              color: '#475569', 
              fontSize: '14px' 
            }}>AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;