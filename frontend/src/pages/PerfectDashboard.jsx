import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import apiEnhanced from '../utils/apiEnhanced.js';
import { SmartLoading, SkeletonLoader, ConnectionStatus } from '../components/LoadingSystem.jsx';
import { FileText, TrendingUp, Clock, Plus, Search, Filter, RefreshCw, Trash2, Code } from 'lucide-react';
import { useToast } from '../components/Toast.jsx';


export default function PerfectDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState({
    stats: { resumesCount: 0, averageATSScore: 0, lastAnalysisDate: null },
    resumes: [],
    recentActivity: [],
    codingProgress: null
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ search: '', sortBy: 'updated' });
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      
      setError(null);
      
      const [statsRes, resumesRes, codingRes] = await Promise.allSettled([
        apiEnhanced.get('/user/dashboard'),
        apiEnhanced.get('/resume/list'),
        apiEnhanced.get('/coding-questions/progress')
      ]);
      
      const newData = {
        stats: statsRes.status === 'fulfilled' 
          ? statsRes.value.data 
          : { resumesCount: 0, averageATSScore: 0, lastAnalysisDate: null },
        resumes: resumesRes.status === 'fulfilled' 
          ? resumesRes.value.data?.resumes || [] 
          : [],
        recentActivity: [],
        codingProgress: codingRes.status === 'fulfilled'
          ? codingRes.value.data?.progress
          : null
      };
      
      setData(newData);
      setLastUpdated(new Date());
      
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Auto-refresh every 5 minutes
  useEffect(() => {
    loadDashboard();
    const interval = setInterval(() => loadDashboard(true), 300000);
    return () => clearInterval(interval);
  }, [loadDashboard]);

  // Filtered and sorted resumes
  const processedResumes = useMemo(() => {
    let filtered = data.resumes;
    
    if (filters.search) {
      filtered = filtered.filter(resume => 
        (resume.title || '').toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'title':
          return (a.title || '').localeCompare(b.title || '');
        case 'ats':
          const aScore = a.analysisReport?.[0]?.atsScore || 0;
          const bScore = b.analysisReport?.[0]?.atsScore || 0;
          return bScore - aScore;
        case 'updated':
        default:
          return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
    });
  }, [data.resumes, filters]);

  const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <SmartLoading message="Loading your dashboard..." context="general" size="large" />;
  }

  if (!user) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
        <h2>Please log in to view your dashboard</h2>
        <Link to="/login" className="btn primary">Login</Link>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4)', maxWidth: '1400px', margin: '0 auto' }}>
      <ConnectionStatus />
      
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'flex-start',
        marginBottom: 'var(--space-6)',
        flexWrap: 'wrap',
        gap: 'var(--space-4)'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-4xl)', margin: '0 0 var(--space-2)', fontWeight: 800 }}>
            Welcome back, {user.name}! 👋
          </h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-lg)', margin: 0 }}>
            Track your progress and optimize your career documents
          </p>
          {lastUpdated && (
            <p style={{ color: 'var(--text-muted)', fontSize: 'var(--text-sm)', margin: 'var(--space-1) 0 0' }}>
              Last updated: {formatDate(lastUpdated)}
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button 
            className="btn secondary"
            onClick={() => loadDashboard(true)}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <RefreshCw size={16} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
          <RemoveDuplicatesButton onSuccess={() => loadDashboard(true)} />
          <Link to="/builder" className="btn primary" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Plus size={16} />
            New Resume
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          background: 'var(--error-bg)',
          border: '1px solid var(--error-border)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-4)',
          marginBottom: 'var(--space-4)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span style={{ color: 'var(--error)' }}>{error}</span>
          <button className="btn small" onClick={() => loadDashboard()}>
            Retry
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-4)',
        marginBottom: 'var(--space-6)'
      }}>
        <StatCard
          icon={FileText}
          title="Total Resumes"
          value={data.stats.resumesCount}
          subtitle="Documents created"
          color="var(--primary)"
        />
        <StatCard
          icon={TrendingUp}
          title="Average ATS Score"
          value={data.stats.averageATSScore ? `${Math.round(data.stats.averageATSScore)}%` : 'N/A'}
          subtitle="Across all analyses"
          color="var(--success)"
        />
        <StatCard
          icon={Code}
          title="Problems Solved"
          value={data.codingProgress?.totalSolved || 0}
          subtitle={data.codingProgress?.streak ? `${data.codingProgress.streak} day streak` : 'Start practicing'}
          color="var(--info)"
          link="/coding-questions"
        />
        <StatCard
          icon={Clock}
          title="Last Analysis"
          value={data.stats.lastAnalysisDate ? 'Recent' : 'None'}
          subtitle={formatDate(data.stats.lastAnalysisDate) || 'Start analyzing'}
          color="var(--warning)"
        />
      </div>

      {/* Resumes Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-4)',
          flexWrap: 'wrap',
          gap: 'var(--space-3)'
        }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', margin: 0, fontWeight: 700 }}>
            Your Resumes ({processedResumes.length})
          </h2>
          
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ 
                position: 'absolute', 
                left: 'var(--space-2)', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }} />
              <input
                type="text"
                placeholder="Search resumes..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                style={{ 
                  paddingLeft: 'var(--space-7)',
                  minWidth: '200px',
                  fontSize: 'var(--text-sm)'
                }}
              />
            </div>
            
            <select
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value }))}
              style={{ fontSize: 'var(--text-sm)' }}
            >
              <option value="updated">Recently Updated</option>
              <option value="title">Name A-Z</option>
              <option value="ats">ATS Score</option>
            </select>
          </div>
        </div>

        {processedResumes.length === 0 ? (
          <EmptyState />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
            gap: 'var(--space-4)'
          }}>
            {processedResumes.map(resume => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
}

function StatCard({ icon: Icon, title, value, subtitle, color, link }) {
  const content = (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-soft)' }}>
          {title}
        </h3>
        <div style={{
          width: '40px',
          height: '40px',
          borderRadius: 'var(--radius)',
          background: `${color}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} color={color} />
        </div>
      </div>
      <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 800, marginBottom: 'var(--space-1)' }}>
        {value}
      </div>
      <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>
        {subtitle}
      </p>
    </>
  );

  if (link) {
    return (
      <Link to={link} className="card elevated interactive" style={{ padding: 'var(--space-5)', textDecoration: 'none', color: 'inherit' }}>
        {content}
      </Link>
    );
  }

  return (
    <div className="card elevated" style={{ padding: 'var(--space-5)' }}>
      {content}
    </div>
  );
}

function ResumeCard({ resume }) {
  const lastAnalysis = resume.analysisReport?.[0];
  
  return (
    <div className="card elevated interactive" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>
          {resume.title || 'Untitled Resume'}
        </h3>
        {lastAnalysis && (
          <div style={{
            background: lastAnalysis.atsScore >= 80 ? 'var(--success-bg)' : 
                       lastAnalysis.atsScore >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
            color: lastAnalysis.atsScore >= 80 ? 'var(--success)' : 
                   lastAnalysis.atsScore >= 60 ? 'var(--warning)' : 'var(--error)',
            padding: 'var(--space-1) var(--space-2)',
            borderRadius: 'var(--radius)',
            fontSize: 'var(--text-xs)',
            fontWeight: 600
          }}>
            {lastAnalysis.atsScore}% ATS
          </div>
        )}
      </div>
      
      <p style={{ 
        margin: '0 0 var(--space-4)', 
        color: 'var(--text-muted)', 
        fontSize: 'var(--text-sm)'
      }}>
        {lastAnalysis 
          ? `Analyzed ${new Date(lastAnalysis.date).toLocaleDateString()}`
          : 'Ready for analysis'
        } • Updated {new Date(resume.updatedAt).toLocaleDateString()}
      </p>
      
      <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
        <Link 
          to={`/builder?resumeId=${resume.id}`} 
          className="btn primary" 
          style={{ flex: 1, textAlign: 'center' }}
        >
          Edit
        </Link>
        <Link 
          to={`/analysis?resumeId=${resume.id}`} 
          className="btn secondary"
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Search size={16} />
        </Link>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div style={{
      textAlign: 'center',
      padding: 'var(--space-8)',
      border: '2px dashed var(--border)',
      borderRadius: 'var(--radius-lg)',
      background: 'var(--bg-subtle)'
    }}>
      <FileText size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-3)' }} />
      <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)' }}>
        No resumes yet
      </h3>
      <p style={{ margin: '0 0 var(--space-4)', color: 'var(--text-soft)' }}>
        Create your first resume to get started with AI-powered optimization
      </p>
      <Link to="/builder" className="btn primary">
        <Plus size={16} />
        Create Resume
      </Link>
    </div>
  );
}

function RemoveDuplicatesButton({ onSuccess }) {
  const [removing, setRemoving] = useState(false);
  const { showToast } = useToast();
  
  const removeDuplicates = async () => {
    if (!confirm('Remove duplicate resumes? This will keep the oldest version of each resume name.')) {
      return;
    }
    
    setRemoving(true);
    try {
      const { data } = await apiEnhanced.delete('/resume/duplicates');
      showToast(data.message, 'success');
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Remove duplicates error:', error);
      showToast(error?.response?.data?.error || 'Failed to remove duplicates', 'error');
    } finally {
      setRemoving(false);
    }
  };
  
  return (
    <button 
      className="btn ghost"
      onClick={removeDuplicates}
      disabled={removing}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
      title="Remove duplicate resume names"
    >
      <Trash2 size={16} />
      {removing ? 'Removing...' : 'Clean Duplicates'}
    </button>
  );
}

function QuickActions() {
  const actions = [
    { title: 'Build Resume', desc: 'Create from scratch', link: '/builder', color: 'var(--primary)' },
    { title: 'Coding Practice', desc: 'Solve interview problems', link: '/coding-questions', color: 'var(--info)' },
    { title: 'Career Goals', desc: 'Set & track objectives', link: '/goals', color: 'var(--success)' },
    { title: 'Skill Development', desc: 'Gap analysis & learning', link: '/skills', color: 'var(--warning)' },
    { title: 'Resume Templates', desc: 'Professional designs', link: '/templates', color: 'var(--purple)' },
    { title: 'Job Matcher', desc: 'Find matching jobs', link: '/jobs', color: 'var(--teal)' },
    { title: 'Interview Prep', desc: 'Practice questions', link: '/interview', color: 'var(--orange)' },
    { title: 'Cover Letter', desc: 'Generate letter', link: '/cover-letters', color: 'var(--pink)' }
  ];
  
  return (
    <div>
      <h2 style={{ fontSize: 'var(--text-2xl)', margin: '0 0 var(--space-4)', fontWeight: 700 }}>
        Quick Actions
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: 'var(--space-3)'
      }}>
        {actions.map(action => (
          <Link
            key={action.title}
            to={action.link}
            className="card interactive"
            style={{ 
              textDecoration: 'none', 
              color: 'inherit',
              padding: 'var(--space-4)',
              borderLeft: `4px solid ${action.color}`
            }}
          >
            <h4 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
              {action.title}
            </h4>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
              {action.desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}