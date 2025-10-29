import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import WelcomeBanner from '../components/WelcomeBanner.jsx';
import api from '../utils/api';
import StatCard from '../components/StatCard.jsx';
import Sparkline from '../components/Sparkline.jsx';
import { SkeletonGrid } from '../components/Skeleton.jsx';
import { PageLoading } from '../components/Loading.jsx';
import PageLayout, { Section } from '../components/PageLayout.jsx';
import ModernEmptyState from '../components/ModernEmptyState.jsx';
import { BarChart3, FileText, Gauge, TrendingUp, Clock, CheckCircle, FilePlus2, SearchCheck, Plus, ArrowRight, Target } from 'lucide-react';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState({ resumesCount: 0, averageATSScore: 0, lastAnalysisDate: null });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Ensure user is available before rendering
  const [userLoaded, setUserLoaded] = useState(false);
  
  useEffect(() => {
    // Wait a bit for user context to load
    const timer = setTimeout(() => setUserLoaded(true), 100);
    return () => clearTimeout(timer);
  }, [user]);

  // Trend & activity states
  const [trendWindow, setTrendWindow] = useState(30);
  const [allReports, setAllReports] = useState([]);
  const [trendLoading, setTrendLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Always set default values first
        const defaultStats = { resumesCount: 0, averageATSScore: 0, lastAnalysisDate: null };
        const defaultResumes = [];
        
        setStats(defaultStats);
        setResumes(defaultResumes);
        
        // Try to load real data
        const [statsRes, resumesRes] = await Promise.allSettled([
          api.get('/user/dashboard'),
          api.get('/resume/list')
        ]);
        
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(statsRes.value.data);
        }
        
        if (resumesRes.status === 'fulfilled' && resumesRes.value?.data?.resumes) {
          setResumes(resumesRes.value.data.resumes);
        }
        
      } catch (e) {
        console.warn('Dashboard load error:', e);
        // Keep default values, don't show error for initial load
      } finally {
        setLoading(false);
        setUserLoaded(true);
      }
    };
    
    if (user) {
      loadDashboard();
    } else {
      setUserLoaded(true);
      setLoading(false);
    }
  }, [user]);

  // Load histories for trend/activity after resumes load
  useEffect(() => {
    let cancelled = false;
    async function loadAllHistories() {
      if (!resumes || resumes.length === 0) {
        setAllReports([]);
        setTrendLoading(false);
        return;
      }
      setTrendLoading(true);
      try {
        const promises = resumes.map((r) =>
          api.get(`/resume/${r.id}/history`).then((res) => ({ resume: r, reports: Array.isArray(res.data?.reports) ? res.data.reports : [] }))
        );
        const results = await Promise.all(promises);
        if (cancelled) return;
        const combined = [];
        results.forEach(({ resume, reports }) => {
          reports.forEach((rep) => combined.push({ ...rep, resumeId: resume.id, resumeTitle: resume.title || `Resume #${resume.id}` }));
        });
        combined.sort((a, b) => new Date(a.date) - new Date(b.date)); // ascending by date
        setAllReports(combined);
      } catch (err) {
        console.error(err);
        if (!cancelled) showToast('Failed to load trend data', 'error');
      } finally {
        if (!cancelled) setTrendLoading(false);
      }
    }
    loadAllHistories();
    return () => { cancelled = true; };
  }, [resumes]);

  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  if (!userLoaded || loading) return <PageLoading message="Loading your dashboard..." />;
  
  if (error && !loading) return (
    <div className="page dashboard">
      <div className="page-header">
        <h1>Overview</h1>
        <p className="muted">Dashboard temporarily unavailable</p>
      </div>
      <div className="card" style={{ background: 'var(--error-bg)', borderColor: 'var(--error-border)' }}>
        <p style={{ color: 'var(--error)', margin: 0 }}>{error}</p>
        <button 
          className="btn small" 
          style={{ marginTop: 'var(--space-3)' }}
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );

  // Build latest ATS per resume data for sparkline
  const latestATS = resumes
    .map((r) => (Array.isArray(r.analysisReport) && r.analysisReport[0] ? r.analysisReport[0].atsScore : null))
    .filter((v) => typeof v === 'number');

  // Trend data (average ATS across recent analyses)
  const trendData = useMemo(() => {
    if (!Array.isArray(allReports) || allReports.length === 0) return [];
    const now = new Date();
    const msWindow = trendWindow * 24 * 60 * 60 * 1000;
    const threshold = new Date(now.getTime() - msWindow);
    const filtered = allReports.filter((r) => new Date(r.date) >= threshold);
    const series = filtered.map((r) => (typeof r.atsScore === 'number' ? r.atsScore : null)).filter((n) => typeof n === 'number');
    return series;
  }, [allReports, trendWindow]);

  // Recent activity (last 5 analyses across all resumes)
  const recentActivity = useMemo(() => {
    const items = Array.isArray(allReports) ? [...allReports] : [];
    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    return items.slice(0, 5);
  }, [allReports]);

  // Delta vs previous for the same resume
  const deltaFor = (rep) => {
    const list = allReports.filter((r) => r.resumeId === rep.resumeId).sort((a, b) => new Date(b.date) - new Date(a.date));
    const idx = list.findIndex((r) => r.id === rep.id);
    if (idx !== -1 && idx + 1 < list.length) {
      const prev = list[idx + 1];
      if (typeof rep.atsScore === 'number' && typeof prev.atsScore === 'number') return Math.round(rep.atsScore - prev.atsScore);
    }
    return null;
  };

  return (
    <PageLayout
      title="Dashboard"
      subtitle="Track your progress and manage your career documents"
      actions={[
        <Link key="new" to="/builder" className="btn primary">
          <FilePlus2 size={18} />
          New Resume
        </Link>,
        <Link key="analyze" to="/analysis" className="btn secondary">
          <SearchCheck size={18} />
          Analyze
        </Link>
      ]}
    >
      <WelcomeBanner />

      {user && !user.emailVerified && (
        <div className="card" style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <strong>Email verification required</strong>
              <p className="muted" style={{ marginTop: 4 }}>Please verify your email to access full dashboard features.</p>
            </div>
            <Link to="/verify-email" className="btn small">Verify now</Link>
          </div>
        </div>
      )}

      <section className="section">
        <div className="section-intro" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Your Progress</h2>
          <p className="muted" style={{ fontSize: 'var(--text-base)' }}>Track your resume optimization journey</p>
        </div>
        <div className="grid stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
          <StatCard 
            title="Resumes" 
            value={stats.resumesCount ?? 0} 
            subtext="Documents created" 
            icon={FileText}
            accent="var(--primary)" 
          />
          <StatCard 
            title="ATS Score" 
            value={stats.averageATSScore ? `${Math.round(stats.averageATSScore)}%` : 'N/A'} 
            subtext="Average rating" 
            icon={Gauge}
            accent="#10b981" 
          />
          <StatCard 
            title="Last Activity" 
            value={stats.lastAnalysisDate ? 'Recent' : 'None'} 
            subtext={fmtDate(stats.lastAnalysisDate) || 'Start analyzing'} 
            icon={Clock}
            accent="#f59e0b" 
          />
        </div>
      </section>

      {/* Latest ATS across resumes */}
      <section className="section">
        <h2>Latest ATS Across Resumes</h2>
        <div className="section-intro">
          <h3 className="section-title">Performance Snapshot</h3>
          <p className="muted">Quickly see how your resumes compare by their latest ATS scores.</p>
        </div>
        {loading ? (
          <div className="card">Loading…</div>
        ) : latestATS.length < 2 ? (
          <div className="card">Run analyses to populate this chart.</div>
        ) : (
          <div className="card" style={{ paddingBottom: 16 }}>
            <Sparkline data={latestATS} height={64} />
            <div className="muted" style={{ marginTop: 6 }}>
              Best: {Math.max(...latestATS)} • Worst: {Math.min(...latestATS)} • Avg: {Math.round(latestATS.reduce((a, b) => a + b, 0) / latestATS.length)}
            </div>
          </div>
        )}
      </section>

      <section className="section">
        <h2>ATS Trend</h2>
        <div className="section-intro">
          <h3 className="section-title">ATS Over Time</h3>
          <p className="muted">Average ATS across recent analyses. Choose a window.</p>
        </div>
        {trendLoading ? (
          <div className="card">Loading…</div>
        ) : trendData.length < 2 ? (
          <div className="card">Not enough data yet. Run analyses to build trends.</div>
        ) : (
          <div className="card" style={{ paddingBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <label className="muted">
                Window
                <select value={trendWindow} onChange={(e) => setTrendWindow(parseInt(e.target.value, 10))} style={{ marginLeft: 8 }}>
                  <option value={7}>7 days</option>
                  <option value={30}>30 days</option>
                  <option value={90}>90 days</option>
                </select>
              </label>
            </div>
            <Sparkline data={trendData} height={72} />
            <div className="muted" style={{ marginTop: 6 }}>
              Points: {trendData.length} • Avg: {Math.round(trendData.reduce((a, b) => a + b, 0) / trendData.length)}
            </div>
          </div>
        )}
      </section>

      <section className="section">
        <h2>Recent Activity</h2>
        <div className="section-intro">
          <h3 className="section-title">Latest Analyses</h3>
          <p className="muted">Recent updates across your resumes with ATS deltas.</p>
        </div>
        {trendLoading ? (
          <div className="card">Loading…</div>
        ) : recentActivity.length === 0 ? (
          <div className="card">No recent analyses yet.</div>
        ) : (
          <div className="card">
            <ul className="resume-list">
              {recentActivity.slice(0, 5).map((rep) => {
                const delta = deltaFor(rep);
                return (
                  <li key={`${rep.resumeId}-${rep.id}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <div>
                      <strong>{rep.resumeTitle || `Resume #${rep.resumeId}`}</strong>
                      <span className="muted" style={{ marginLeft: 8 }}>ATS {rep.atsScore} • {fmtDate(rep.date)}</span>
                      {delta !== null && (
                        <span className="badge outline" style={{ marginLeft: 8, color: delta >= 0 ? 'green' : 'crimson' }}>
                          {delta >= 0 ? `+${delta}` : `${delta}`}
                        </span>
                      )}
                    </div>
                    <div>
                      <Link to={`/history?resumeId=${rep.resumeId}`} className="btn small ghost">View History</Link>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </section>

      <Section title="Your Resumes" subtitle="Manage and optimize your career documents">
        {resumes.length === 0 ? (
          <ModernEmptyState
            icon={FileText}
            title="No resumes yet"
            description="Create your first resume to get started with AI-powered optimization and analysis."
            actionText="Create Resume"
            actionLink="/builder"
            secondaryActionText="Learn More"
            secondaryActionLink="/pricing"
          />
        ) : (
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            {resumes.map((r) => {
              const last = Array.isArray(r.analysisReport) ? r.analysisReport[0] : null;
              return (
                <div className="card elevated" key={r.id} style={{ padding: 'var(--space-5)' }}>
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>
                        {r.title || 'Untitled Resume'}
                      </h3>
                      {last && (
                        <div style={{
                          background: last.atsScore >= 80 ? 'var(--success-bg)' : last.atsScore >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                          color: last.atsScore >= 80 ? 'var(--success)' : last.atsScore >= 60 ? 'var(--warning)' : 'var(--error)',
                          padding: 'var(--space-1) var(--space-2)',
                          borderRadius: 'var(--radius)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600
                        }}>
                          {last.atsScore}% ATS
                        </div>
                      )}
                    </div>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--text-muted)', 
                      fontSize: 'var(--text-sm)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      {last ? `Analyzed ${fmtDate(last.date)}` : 'Ready for analysis'} • Updated {fmtDate(r.updatedAt)}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <Link to={`/builder?resumeId=${r.id}`} className="btn primary" style={{ flex: 1 }}>
                      Edit
                    </Link>
                    <Link to={`/analysis?resumeId=${r.id}`} className="btn secondary">
                      <SearchCheck size={16} />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Section>

      <section className="section">
        <div className="section-intro" style={{ marginBottom: 'var(--space-5)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Quick Actions</h2>
          <p className="muted" style={{ fontSize: 'var(--text-base)' }}>Everything you need to optimize your career documents</p>
        </div>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          <Link to="/builder" className="card elevated interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--gradient-primary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Plus size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Build Resume</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Create from scratch</p>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </div>
          </Link>
          
          <Link to="/analysis" className="card elevated interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <SearchCheck size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Analyze Resume</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Get AI feedback</p>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </div>
          </Link>
          
          <Link to="/job-match" className="card elevated interactive" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{
                width: '48px',
                height: '48px',
                background: 'var(--gradient-secondary)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Target size={24} color="white" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Job Match</h3>
                <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: 'var(--text-sm)' }}>Compare with JD</p>
              </div>
              <ArrowRight size={20} color="var(--text-muted)" style={{ marginLeft: 'auto' }} />
            </div>
          </Link>
        </div>
      </section>

      <section className="section">
        <h2>Getting Started</h2>
        <div className="section-intro">
          <h3 className="section-title">Begin Your Journey</h3>
          <p className="muted">Follow these steps to build, tailor, and track your applications.</p>
          <ol className="step-list">
            <li>Create or import a resume to begin.</li>
            <li>Analyze and refine with AI suggestions.</li>
            <li>Match to JDs and generate tailored cover letters.</li>
          </ol>
        </div>
        <div className="grid">
          <div className="card">
            Create or import your resume to get started.
          </div>
          <div className="card">
            Use AI to tailor your resume for specific roles.
          </div>
          <div className="card">
            Track applications and manage your documents.
          </div>
          <div className="card">
            Upgrade to unlock advanced features and templates.
          </div>
        </div>
      </section>
    </PageLayout>
  );
}