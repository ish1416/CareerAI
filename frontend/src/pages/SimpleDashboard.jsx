import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../utils/api.js';

export default function SimpleDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ resumesCount: 0, averageATSScore: 0 });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      console.log('Loading dashboard data...');
      try {
        const [statsRes, resumesRes] = await Promise.allSettled([
          api.get('/user/dashboard'),
          api.get('/resume/list')
        ]);
        
        console.log('Stats response:', statsRes);
        console.log('Resumes response:', resumesRes);
        
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data || { resumesCount: 0, averageATSScore: 0 });
        }
        
        if (resumesRes.status === 'fulfilled') {
          setResumes(resumesRes.value.data?.resumes || []);
        }
      } catch (error) {
        console.warn('Dashboard load error:', error);
      } finally {
        console.log('Setting loading to false');
        setLoading(false);
      }
    };

    // Force stop loading after 3 seconds
    const timeout = setTimeout(() => {
      console.log('Timeout - forcing loading to false');
      setLoading(false);
    }, 3000);

    console.log('User:', user);
    if (user) {
      loadData();
    } else {
      console.log('No user, setting loading to false');
      setLoading(false);
    }
    
    return () => clearTimeout(timeout);
  }, [user]);

  if (!user) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Please log in to view dashboard</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem', width: '100%' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Dashboard</h1>
        <p style={{ color: '#666', fontSize: '1.1rem' }}>
          Welcome back, {user?.name || 'User'}! Track your progress and manage your career documents.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link 
          to="/builder" 
          style={{
            background: '#6366f1',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600'
          }}
        >
          New Resume
        </Link>
        <Link 
          to="/analysis" 
          style={{
            background: '#f3f4f6',
            color: '#374151',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            textDecoration: 'none',
            fontWeight: '600',
            border: '1px solid #d1d5db'
          }}
        >
          Analyze
        </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#6b7280' }}>Resumes</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>{stats.resumesCount}</div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>Documents created</p>
        </div>
        
        <div style={{ background: 'white', padding: '1.5rem', borderRadius: '0.75rem', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', color: '#6b7280' }}>ATS Score</h3>
          <div style={{ fontSize: '2rem', fontWeight: '800', color: '#111827' }}>
            {stats.averageATSScore ? `${Math.round(stats.averageATSScore)}%` : 'N/A'}
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>Average rating</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Your Resumes</h2>
        {resumes.length === 0 ? (
          <div style={{ 
            background: 'white', 
            padding: '3rem', 
            borderRadius: '0.75rem', 
            border: '2px dashed #d1d5db', 
            textAlign: 'center' 
          }}>
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem' }}>No resumes yet</h3>
            <p style={{ margin: '0 0 1.5rem', color: '#6b7280' }}>
              Create your first resume to get started with AI-powered optimization.
            </p>
            <Link 
              to="/builder"
              style={{
                background: '#6366f1',
                color: 'white',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              Create Resume
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
            {resumes.map((resume) => (
              <div key={resume.id} style={{ 
                background: 'white', 
                padding: '1.5rem', 
                borderRadius: '0.75rem', 
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>
                  {resume.title || 'Untitled Resume'}
                </h3>
                <p style={{ margin: '0 0 1rem', color: '#6b7280', fontSize: '0.875rem' }}>
                  Updated {new Date(resume.updatedAt).toLocaleDateString()}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link 
                    to={`/builder?resumeId=${resume.id}`}
                    style={{
                      background: '#6366f1',
                      color: 'white',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      flex: 1,
                      textAlign: 'center'
                    }}
                  >
                    Edit
                  </Link>
                  <Link 
                    to={`/analysis?resumeId=${resume.id}`}
                    style={{
                      background: '#f3f4f6',
                      color: '#374151',
                      padding: '0.5rem 1rem',
                      borderRadius: '0.375rem',
                      textDecoration: 'none',
                      fontSize: '0.875rem',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    Analyze
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          <Link 
            to="/builder" 
            style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>Build Resume</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Create from scratch or upload existing</p>
          </Link>
          
          <Link 
            to="/analysis" 
            style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>Analyze Resume</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Get AI feedback and ATS scoring</p>
          </Link>
          
          <Link 
            to="/job-match" 
            style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '0.75rem', 
              border: '1px solid #e5e7eb',
              textDecoration: 'none',
              color: 'inherit',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
            }}
          >
            <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.125rem' }}>Job Match</h3>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '0.875rem' }}>Compare with job descriptions</p>
          </Link>
        </div>
      </div>
    </div>
  );
}