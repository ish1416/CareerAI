import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Users, Globe, Video, Shield, MessageSquare, Cpu, DollarSign, Headphones, Compass, Bot, ArrowLeft } from 'lucide-react';

export default function AIAdvanced() {
  const navigate = useNavigate();

  const features = [
    { id: 'career-dna', icon: Brain, title: 'Career DNA', description: 'AI analysis of skills and personality', color: '#10b981' },
    { id: 'career-twin', icon: Users, title: 'Career Twin', description: 'Find similar professionals', color: '#3b82f6' },
    { id: 'global-ops', icon: Globe, title: 'Global Opportunities', description: 'International job markets', color: '#f59e0b' },
    { id: 'video-resume', icon: Video, title: 'Video Resume', description: 'AI-powered video creation', color: '#06b6d4' },
    { id: 'blockchain-verify', icon: Shield, title: 'Blockchain Verify', description: 'Secure credential verification', color: '#10b981' },
    { id: 'communication-coach', icon: MessageSquare, title: 'Communication Coach', description: 'AI feedback on communication', color: '#3b82f6' },
    { id: 'job-intelligence', icon: Cpu, title: 'Job Intelligence', description: 'Company culture insights', color: '#f59e0b' },
    { id: 'salary-negotiation', icon: DollarSign, title: 'Salary Assistant', description: 'Negotiation preparation', color: '#06b6d4' },
    { id: 'voice-commands', icon: Headphones, title: 'Voice Commands', description: 'Hands-free platform control', color: '#ef4444' },
    { id: 'goal-navigator', icon: Compass, title: 'Goal Navigator', description: 'AI-powered career planning', color: '#10b981' },
    { id: 'ai-agents', icon: Bot, title: 'Multi-AI Agents', description: 'Specialized AI assistants', color: '#3b82f6' }
  ];

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1200px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--space-2)',
          background: 'none',
          border: 'none',
          color: 'var(--text-soft)',
          fontSize: 'var(--text-sm)',
          cursor: 'pointer',
          marginBottom: 'var(--space-6)'
        }}
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </button>
      
      <h1 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)', color: 'var(--text)' }}>
        AI Advanced Features
      </h1>
      <p style={{ fontSize: 'var(--text-lg)', color: 'var(--text-soft)', marginBottom: 'var(--space-8)' }}>
        Cutting-edge AI technology for your career
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 'var(--space-6)'
      }}>
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.id}
              onClick={() => navigate(`/${feature.id}`)}
              style={{
                cursor: 'pointer',
                padding: 'var(--space-6)',
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-base)',
                boxShadow: 'var(--shadow-sm)'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
              }}
            >
              <div style={{
                width: '48px',
                height: '48px',
                background: feature.color,
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 'var(--space-4)',
                flexShrink: 0
              }}>
                <Icon size={24} color="white" />
              </div>
              <h3 style={{
                margin: '0 0 var(--space-2) 0',
                fontSize: 'var(--text-xl)',
                fontWeight: '600',
                color: 'var(--text)'
              }}>
                {feature.title}
              </h3>
              <p style={{
                margin: 0,
                fontSize: 'var(--text-sm)',
                color: 'var(--text-soft)',
                lineHeight: '1.5'
              }}>
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}