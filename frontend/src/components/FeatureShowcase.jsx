import React from 'react';

const FeatureShowcase = () => {
  return (
    <section style={{ padding: '64px 16px', background: '#f8fafc' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontSize: '36px', fontWeight: 'bold', marginBottom: '16px', color: '#1f2937' }}>
          Everything You Need to Land Your Dream Job
        </h2>
        <p style={{ fontSize: '18px', color: '#6b7280', marginBottom: '48px' }}>
          Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents
        </p>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '24px',
          marginBottom: '48px'
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>AI-Powered Analysis</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Get instant ATS compatibility scores and personalized improvement suggestions</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>Professional Templates</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>15+ ATS-optimized templates designed by career experts</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>Job Matching</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Find jobs that match your skills with AI-powered recommendations</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ color: '#1f2937', marginBottom: '8px' }}>Career Insights</h3>
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Real-time salary data, growth trends, and industry analytics</p>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: '24px' 
        }}>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '4px' }}>50K+</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>Resumes Created</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>95%</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>ATS Pass Rate</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>2.5x</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>More Interviews</p>
          </div>
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>24/7</h3>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>AI Support</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;