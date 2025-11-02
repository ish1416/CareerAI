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
import { BarChart3, FileText, Gauge, TrendingUp, Clock, CheckCircle, FilePlus2, SearchCheck, Plus, ArrowRight, Target, Users, Briefcase, Award, Calendar, Eye, Download, Share2, Star, Zap, Activity } from 'lucide-react';
import { useToast } from '../components/Toast.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Dashboard() {
  const [stats, setStats] = useState({ 
    resumesCount: 0, 
    averageATSScore: 0, 
    lastAnalysisDate: null,
    totalAnalyses: 0,
    jobApplications: 0,
    profileViews: 0,
    downloadsCount: 0,
    sharesCount: 0,
    improvementRate: 0,
    weeklyProgress: 0,
    skillsAssessed: 0,
    certificationsEarned: 0,
    interviewSessions: 0,
    networkConnections: 0,
    learningHours: 0,
    coverLetters: 0,
    jobMatches: 0,
    portfolioItems: 0,
    feedbackCount: 0,
    templatesUsed: 0,
    aiSuggestions: 0,
    careerScore: 0,
    activeStreak: 0
  });
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const { user } = useAuth();
  
  // Enhanced state for comprehensive dashboard
  const [userLoaded, setUserLoaded] = useState(false);
  const [weeklyStats, setWeeklyStats] = useState([]);
  const [topSkills, setTopSkills] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [careerGoals, setCareerGoals] = useState([]);
  
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
        const defaultStats = { 
          resumesCount: 0, 
          averageATSScore: 0, 
          lastAnalysisDate: null,
          totalAnalyses: 0,
          jobApplications: 0,
          profileViews: 0,
          downloadsCount: 0,
          sharesCount: 0,
          improvementRate: 0,
          weeklyProgress: 0,
          skillsAssessed: 0,
          certificationsEarned: 0,
          interviewSessions: 0,
          networkConnections: 0,
          learningHours: 0,
          coverLetters: 0,
          jobMatches: 0,
          portfolioItems: 0,
          feedbackCount: 0,
          templatesUsed: 0,
          aiSuggestions: 0,
          careerScore: 0,
          activeStreak: 0
        };
        const defaultResumes = [];
        
        setStats(defaultStats);
        setResumes(defaultResumes);
        
        // Try to load comprehensive data
        const [statsRes, resumesRes, analyticsRes, learningRes, networkRes, jobsRes] = await Promise.allSettled([
          api.get('/user/dashboard'),
          api.get('/resume/list'),
          api.get('/analytics/dashboard'),
          api.get('/learning/progress'),
          api.get('/network/connections'),
          api.get('/job-tracker/analytics')
        ]);
        
        if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
          setStats(prev => ({ ...prev, ...statsRes.value.data }));
        }
        
        if (resumesRes.status === 'fulfilled' && resumesRes.value?.data?.resumes) {
          setResumes(resumesRes.value.data.resumes);
        }
        
        if (analyticsRes.status === 'fulfilled' && analyticsRes.value?.data?.analytics) {
          const analytics = analyticsRes.value.data.analytics;
          setStats(prev => ({
            ...prev,
            profileViews: analytics.profileViews || 0,
            resumeDownloads: analytics.resumeDownloads || 0,
            applicationsSent: analytics.applicationsSent || 0,
            interviewsScheduled: analytics.interviewsScheduled || 0,
            offersReceived: analytics.offersReceived || 0,
            skillsAssessed: analytics.skillsAssessed || 0,
            coursesCompleted: analytics.coursesCompleted || 0,
            networksGrown: analytics.networksGrown || 0
          }));
        }
        
        if (learningRes.status === 'fulfilled' && learningRes.value?.data) {
          const learning = learningRes.value.data;
          setStats(prev => ({
            ...prev,
            learningHours: learning.totalHours || 0,
            certificationsEarned: learning.badges?.length || 0,
            activeStreak: learning.streak || 0
          }));
        }
        
        if (networkRes.status === 'fulfilled' && networkRes.value?.data?.connections) {
          setStats(prev => ({
            ...prev,
            networkConnections: networkRes.value.data.connections.length || 0
          }));
        }
        
        if (jobsRes.status === 'fulfilled' && jobsRes.value?.data?.analytics) {
          const jobAnalytics = jobsRes.value.data.analytics;
          setStats(prev => ({
            ...prev,
            jobApplications: jobAnalytics.overview?.totalApplications || 0,
            interviewSessions: jobAnalytics.overview?.interviews || 0
          }));
        }
        
        // Load career goals separately
        try {
          const goalsRes = await api.get('/career-goals');
          if (goalsRes.data?.goals) {
            setCareerGoals(goalsRes.data.goals);
          }
        } catch (error) {
          console.warn('Failed to load career goals:', error);
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
          <h2 style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, marginBottom: 'var(--space-2)' }}>Career Analytics</h2>
          <p className="muted" style={{ fontSize: 'var(--text-base)' }}>Comprehensive insights into your career development progress</p>
        </div>
        
        {/* Primary Stats */}
        <div className="grid stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
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
            title="Analyses" 
            value={stats.totalAnalyses ?? 0} 
            subtext="AI reviews completed" 
            icon={SearchCheck}
            accent="#8b5cf6" 
          />
          <StatCard 
            title="Applications" 
            value={stats.jobApplications ?? 0} 
            subtext="Jobs applied to" 
            icon={Briefcase}
            accent="#f59e0b" 
          />
          <StatCard 
            title="Interview Prep" 
            value={stats.interviewSessions ?? 0} 
            subtext="Practice sessions" 
            icon={Users}
            accent="#ec4899" 
          />
        </div>
        
        {/* Secondary Stats */}
        <div className="grid stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <StatCard 
            title="Profile Views" 
            value={stats.profileViews ?? 0} 
            subtext="This month" 
            icon={Eye}
            accent="#06b6d4" 
          />
          <StatCard 
            title="Downloads" 
            value={stats.downloadsCount ?? 0} 
            subtext="Resume downloads" 
            icon={Download}
            accent="#84cc16" 
          />
          <StatCard 
            title="Shares" 
            value={stats.sharesCount ?? 0} 
            subtext="Profile shares" 
            icon={Share2}
            accent="#f97316" 
          />
          <StatCard 
            title="Improvement" 
            value={stats.improvementRate ? `+${stats.improvementRate}%` : 'N/A'} 
            subtext="Score increase" 
            icon={TrendingUp}
            accent="#22c55e" 
          />
          <StatCard 
            title="Skills Assessed" 
            value={stats.skillsAssessed ?? 0} 
            subtext="Competencies evaluated" 
            icon={Star}
            accent="#eab308" 
          />
          <StatCard 
            title="Certifications" 
            value={stats.certificationsEarned ?? 0} 
            subtext="Badges earned" 
            icon={Award}
            accent="#dc2626" 
          />
          <StatCard 
            title="Network Connections" 
            value={stats.networkConnections ?? 0} 
            subtext="Professional contacts" 
            icon={Users}
            accent="#8b5cf6" 
          />
          <StatCard 
            title="Learning Hours" 
            value={stats.learningHours ?? 0} 
            subtext="Skill development" 
            icon={Clock}
            accent="#06b6d4" 
          />
        </div>
        
        {/* Tertiary Stats */}
        <div className="grid stats" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 'var(--space-2)' }}>
          <StatCard 
            title="Cover Letters" 
            value={stats.coverLetters ?? 0} 
            subtext="Generated" 
            icon={FileText}
            accent="#f59e0b" 
          />
          <StatCard 
            title="Job Matches" 
            value={stats.jobMatches ?? 0} 
            subtext="Compatibility checks" 
            icon={Target}
            accent="#10b981" 
          />
          <StatCard 
            title="Portfolio Items" 
            value={stats.portfolioItems ?? 0} 
            subtext="Showcase projects" 
            icon={Star}
            accent="#8b5cf6" 
          />
          <StatCard 
            title="Feedback Received" 
            value={stats.feedbackCount ?? 0} 
            subtext="Community reviews" 
            icon={Users}
            accent="#06b6d4" 
          />
          <StatCard 
            title="Templates Used" 
            value={stats.templatesUsed ?? 0} 
            subtext="Design variations" 
            icon={FileText}
            accent="#84cc16" 
          />
          <StatCard 
            title="AI Suggestions" 
            value={stats.aiSuggestions ?? 0} 
            subtext="Recommendations applied" 
            icon={Zap}
            accent="#f97316" 
          />
          <StatCard 
            title="Career Score" 
            value={stats.careerScore ?? 0} 
            subtext="Overall rating" 
            icon={Award}
            accent="#dc2626" 
          />
          <StatCard 
            title="Active Streak" 
            value={stats.activeStreak ?? 0} 
            subtext="Days consecutive" 
            icon={Activity}
            accent="#22c55e" 
          />
        </div>
      </section>

      {/* Performance Analytics */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <section className="section">
          <h2>Performance Analytics</h2>
          <div className="section-intro">
            <h3 className="section-title">ATS Score Distribution</h3>
            <p className="muted">Track your resume optimization progress across all documents.</p>
          </div>
          {loading ? (
            <div className="card">Loading analytics…</div>
          ) : latestATS.length < 2 ? (
            <div className="card">
              <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
                <Activity size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-3)' }} />
                <h4>No Data Yet</h4>
                <p className="muted">Run analyses to see performance trends</p>
                <Link to="/analysis" className="btn primary small" style={{ marginTop: 'var(--space-3)' }}>
                  Start Analysis
                </Link>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--space-5)' }}>
              <Sparkline data={latestATS} height={80} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--success)' }}>{Math.max(...latestATS)}%</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Best Score</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(latestATS.reduce((a, b) => a + b, 0) / latestATS.length)}%</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Average</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--warning)' }}>{Math.min(...latestATS)}%</div>
                  <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Lowest Score</div>
                </div>
              </div>
            </div>
          )}
        </section>
        
        <section className="section">
          <h2>Weekly Progress</h2>
          <div className="section-intro">
            <h3 className="section-title">This Week</h3>
            <p className="muted">Your activity summary</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Analyses Run</span>
                <span style={{ fontWeight: 'bold' }}>{weeklyStats.analyses || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Resumes Updated</span>
                <span style={{ fontWeight: 'bold' }}>{weeklyStats.updates || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Applications</span>
                <span style={{ fontWeight: 'bold' }}>{weeklyStats.applications || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Profile Views</span>
                <span style={{ fontWeight: 'bold' }}>{weeklyStats.views || 0}</span>
              </div>
            </div>
            {stats.weeklyProgress > 0 && (
              <div style={{ marginTop: 'var(--space-3)', padding: 'var(--space-2)', background: 'var(--success-bg)', borderRadius: 'var(--radius)', textAlign: 'center' }}>
                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success)' }}>+{stats.weeklyProgress}% vs last week</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Skills & Goals Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <section className="section">
          <h2>Top Skills</h2>
          <div className="section-intro">
            <h3 className="section-title">Skill Assessment</h3>
            <p className="muted">Your strongest competencies based on resume analysis</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            {topSkills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <Star size={32} color="var(--text-soft)" style={{ marginBottom: 'var(--space-2)' }} />
                <p className="muted">No skills assessed yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {topSkills.slice(0, 5).map((skill, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 'var(--text-sm)' }}>{skill.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--muted)', borderRadius: '3px' }}>
                        <div style={{ width: `${skill.proficiency}%`, height: '100%', background: 'var(--primary)', borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)', minWidth: '30px' }}>{skill.proficiency}%</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
        
        <section className="section">
          <h2>Career Goals</h2>
          <div className="section-intro">
            <h3 className="section-title">Active Objectives</h3>
            <p className="muted">Track your career development milestones</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            {careerGoals.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <Target size={32} color="var(--text-soft)" style={{ marginBottom: 'var(--space-2)' }} />
                <p className="muted">Set your first career goal</p>
                <Link to="/goals" className="btn primary small" style={{ marginTop: 'var(--space-2)' }}>Add Goal</Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {careerGoals.slice(0, 3).map((goal, idx) => (
                  <div key={idx} className="card" style={{ padding: 'var(--space-3)', background: 'var(--muted)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-2)' }}>
                      <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600 }}>{goal.title}</h4>
                      <span style={{ 
                        fontSize: 'var(--text-xs)', 
                        padding: 'var(--space-1)', 
                        borderRadius: 'var(--radius)', 
                        background: goal.status === 'completed' ? 'var(--success-bg)' : 'var(--warning-bg)',
                        color: goal.status === 'completed' ? 'var(--success)' : 'var(--warning)'
                      }}>
                        {goal.status}
                      </span>
                    </div>
                    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', height: '4px', marginBottom: 'var(--space-1)' }}>
                      <div style={{ background: 'var(--primary)', height: '100%', borderRadius: 'var(--radius)', width: `${goal.progress}%` }} />
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>{goal.progress}% complete • Due {new Date(goal.deadline).toLocaleDateString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
      
      {/* ATS Trend Analysis */}
      <section className="section">
        <h2>Performance Trends</h2>
        <div className="section-intro">
          <h3 className="section-title">ATS Score Evolution</h3>
          <p className="muted">Track your improvement over time with detailed analytics</p>
        </div>
        {trendLoading ? (
          <div className="card">Loading trend analysis…</div>
        ) : trendData.length < 2 ? (
          <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <BarChart3 size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-3)' }} />
            <h4>Build Your Trend</h4>
            <p className="muted">Run multiple analyses to see your improvement over time</p>
            <Link to="/analysis" className="btn primary" style={{ marginTop: 'var(--space-3)' }}>Analyze Resume</Link>
          </div>
        ) : (
          <div className="card" style={{ padding: 'var(--space-5)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: 'var(--space-1)' }}>Improvement Trajectory</h4>
                <p className="muted" style={{ margin: 0, fontSize: 'var(--text-sm)' }}>Your ATS scores across {trendData.length} analyses</p>
              </div>
              <select 
                value={trendWindow} 
                onChange={(e) => setTrendWindow(parseInt(e.target.value, 10))} 
                style={{ 
                  padding: 'var(--space-2)', 
                  borderRadius: 'var(--radius)', 
                  border: '1px solid var(--border)',
                  background: 'var(--surface)'
                }}
              >
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <Sparkline data={trendData} height={100} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-4)', marginTop: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{trendData.length}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Data Points</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>{Math.round(trendData.reduce((a, b) => a + b, 0) / trendData.length)}%</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Average Score</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: trendData[trendData.length - 1] > trendData[0] ? 'var(--success)' : 'var(--error)' }}>
                  {trendData.length > 1 ? (trendData[trendData.length - 1] > trendData[0] ? '+' : '') + Math.round(trendData[trendData.length - 1] - trendData[0]) : '0'}%
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Net Change</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--success)' }}>{Math.max(...trendData)}%</div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Peak Score</div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Recent Activity & Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <section className="section">
          <h2>Recent Activity</h2>
          <div className="section-intro">
            <h3 className="section-title">Latest Updates</h3>
            <p className="muted">Your recent analyses and improvements with performance deltas</p>
          </div>
          {trendLoading ? (
            <div className="card">Loading activity…</div>
          ) : recentActivity.length === 0 ? (
            <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <Clock size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-3)' }} />
              <h4>No Recent Activity</h4>
              <p className="muted">Start analyzing your resumes to see activity here</p>
            </div>
          ) : (
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recentActivity.slice(0, 5).map((rep) => {
                  const delta = deltaFor(rep);
                  return (
                    <div key={`${rep.resumeId}-${rep.id}`} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: 'var(--space-3)', 
                      background: 'var(--muted)', 
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)'
                    }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-1)' }}>
                          <h4 style={{ margin: 0, fontSize: 'var(--text-sm)', fontWeight: 600 }}>{rep.resumeTitle || `Resume #${rep.resumeId}`}</h4>
                          <div style={{
                            background: rep.atsScore >= 80 ? 'var(--success-bg)' : rep.atsScore >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                            color: rep.atsScore >= 80 ? 'var(--success)' : rep.atsScore >= 60 ? 'var(--warning)' : 'var(--error)',
                            padding: 'var(--space-1) var(--space-2)',
                            borderRadius: 'var(--radius)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600
                          }}>
                            {rep.atsScore}% ATS
                          </div>
                          {delta !== null && (
                            <div style={{
                              background: delta >= 0 ? 'var(--success-bg)' : 'var(--error-bg)',
                              color: delta >= 0 ? 'var(--success)' : 'var(--error)',
                              padding: 'var(--space-1) var(--space-2)',
                              borderRadius: 'var(--radius)',
                              fontSize: 'var(--text-xs)',
                              fontWeight: 600
                            }}>
                              {delta >= 0 ? `+${delta}` : `${delta}`}
                            </div>
                          )}
                        </div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>
                          Analyzed {fmtDate(rep.date)}
                        </div>
                      </div>
                      <Link to={`/history?resumeId=${rep.resumeId}`} className="btn small ghost">
                        View Details
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>
        
        <section className="section">
          <h2>Achievements</h2>
          <div className="section-intro">
            <h3 className="section-title">Recent Milestones</h3>
            <p className="muted">Your latest accomplishments</p>
          </div>
          <div className="card" style={{ padding: 'var(--space-4)' }}>
            {recentAchievements.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <Award size={32} color="var(--text-soft)" style={{ marginBottom: 'var(--space-2)' }} />
                <p className="muted">Complete actions to earn achievements</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {recentAchievements.slice(0, 4).map((achievement, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: 'var(--gradient-primary)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <Award size={20} color="white" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>{achievement.title}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>{achievement.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

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
          <p className="muted" style={{ fontSize: 'var(--text-base)' }}>Accelerate your career development with AI-powered tools</p>
        </div>
        <div className="grid" style={{ 
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
          gap: 'var(--space-4)',
          alignItems: 'stretch'
        }}>
          {[
            { to: '/builder', icon: Plus, title: 'Build Resume', desc: 'Create professional resumes with AI assistance', gradient: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)' },
            { to: '/analysis', icon: SearchCheck, title: 'AI Analysis', desc: 'Get detailed ATS scores and improvement suggestions', gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' },
            { to: '/job-match', icon: Target, title: 'Job Matching', desc: 'Compare resumes with job descriptions', gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)' },
            { to: '/learning', icon: Zap, title: 'Skill Development', desc: 'Learn new skills and earn certifications', gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' },
            { to: '/community', icon: Users, title: 'Community', desc: 'Connect with professionals and get advice', gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)' },
            { to: '/job-tracker', icon: Calendar, title: 'Job Tracker', desc: 'Manage applications and follow-ups', gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' }
          ].map((action, idx) => {
            const Icon = action.icon;
            return (
              <div className="card elevated" style={{ padding: 'var(--space-4)' }}>
                <Link 
                  key={idx}
                  to={action.to} 
                  className="card interactive" 
                  style={{ 
                    textDecoration: 'none', 
                    color: 'inherit',
                    padding: 'var(--space-4)',
                    minHeight: '100px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-4)',
                    transition: 'all 0.2s ease',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--surface)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{
                    width: '56px',
                    height: '56px',
                    background: action.gradient,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    position: 'relative',
                    zIndex: 1
                  }}>
                    <Icon size={28} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, zIndex: 1 }}>
                    <h3 style={{ 
                      margin: 0, 
                      fontSize: 'var(--text-lg)', 
                      fontWeight: 600, 
                      marginBottom: 'var(--space-1)',
                      color: 'var(--text)',
                      lineHeight: 1.3
                    }}>
                      {action.title}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      color: 'var(--text-soft)', 
                      fontSize: 'var(--text-sm)',
                      lineHeight: 1.4,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {action.desc}
                    </p>
                  </div>
                  <ArrowRight 
                    size={20} 
                    color="var(--text-soft)" 
                    style={{ 
                      flexShrink: 0,
                      opacity: 0.5,
                      transition: 'all 0.2s ease',
                      zIndex: 1
                    }} 
                  />
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100px',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent 0%, ${action.gradient.split(' ')[1].split(' ')[0]}10 100%)`,
                    opacity: 0.05,
                    pointerEvents: 'none'
                  }} />
                </Link>
              </div>
            );
          })}
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