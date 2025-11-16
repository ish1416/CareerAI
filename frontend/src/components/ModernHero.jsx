import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Play, Star, Users, Zap } from 'lucide-react';
import ModernButton from './ModernButton';
import ModernLogo from './ModernLogo';

export default function ModernHero() {
  return (
    <section className="section-lg" style={{ background: 'var(--background)', marginTop: 64 }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
          {/* Logo */}
          <div className="flex justify-center" style={{ marginBottom: 'var(--space-6)' }}>
            <ModernLogo size={80} variant="primary" />
          </div>

          {/* Headline */}
          <h1
            className="text-5xl font-bold mb-6"
            style={{
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
              maxWidth: 800,
              margin: '0 auto var(--space-6)'
            }}
          >
            Build professional resumes with{' '}
            <span style={{ color: 'var(--primary)' }}>AI-powered</span> insights
          </h1>

          {/* Description */}
          <p
            className="text-xl text-secondary mb-8"
            style={{
              maxWidth: 600,
              margin: '0 auto var(--space-8)',
              lineHeight: 1.6
            }}
          >
            Create ATS-optimized resumes, get intelligent feedback, and land your dream job with our comprehensive career platform.
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center justify-center gap-4" style={{ marginBottom: 'var(--space-12)' }}>
            <Link to="/register">
              <ModernButton variant="primary" size="lg" icon={<ArrowRight size={16} />}>
                Start building free
              </ModernButton>
            </Link>
            <ModernButton variant="outline" size="lg" icon={<Play size={16} />}>
              Watch demo
            </ModernButton>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-8 text-sm text-muted">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="var(--warning)" color="var(--warning)" />
                ))}
              </div>
              <span>4.9/5 rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users size={14} />
              <span>50,000+ users</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={14} />
              <span>98% ATS compatible</span>
            </div>
          </div>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
          <div className="card text-center">
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                color: 'var(--primary)'
              }}
            >
              <Zap size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">AI Analysis</h3>
            <p className="text-sm text-secondary">
              Get instant feedback on content, structure, and ATS compatibility with actionable suggestions.
            </p>
          </div>

          <div className="card text-center">
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                color: 'var(--success)'
              }}
            >
              <Users size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Professional Templates</h3>
            <p className="text-sm text-secondary">
              Choose from 15+ professionally designed templates optimized for different industries.
            </p>
          </div>

          <div className="card text-center">
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-4)',
                color: 'var(--warning)'
              }}
            >
              <Star size={24} />
            </div>
            <h3 className="text-lg font-semibold mb-2">Career Insights</h3>
            <p className="text-sm text-secondary">
              Track your progress with detailed analytics and personalized career guidance.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}