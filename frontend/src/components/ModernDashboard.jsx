import React from 'react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, Users, FileText, Target, Calendar, BarChart3, 
  ArrowUpRight, ArrowDownRight, Plus, ExternalLink, Clock,
  CheckCircle, AlertCircle, Zap, Star, Award
} from 'lucide-react';

export default function ModernDashboard() {
  const stats = [
    { label: 'Resume Score', value: '87', change: '+5', trend: 'up', color: 'var(--success)' },
    { label: 'Job Applications', value: '24', change: '+3', trend: 'up', color: 'var(--primary)' },
    { label: 'Profile Views', value: '156', change: '+12', trend: 'up', color: 'var(--warning)' },
    { label: 'Interview Rate', value: '18%', change: '-2%', trend: 'down', color: 'var(--error)' }
  ];

  const recentActivity = [
    { type: 'resume', title: 'Resume updated', time: '2 hours ago', status: 'success' },
    { type: 'application', title: 'Applied to Software Engineer at Google', time: '1 day ago', status: 'pending' },
    { type: 'analysis', title: 'Resume analysis completed', time: '2 days ago', status: 'success' },
    { type: 'interview', title: 'Interview scheduled with Microsoft', time: '3 days ago', status: 'scheduled' }
  ];

  const quickActions = [
    { title: 'Build Resume', description: 'Create or edit your resume', icon: FileText, href: '/builder', color: 'var(--primary)' },
    { title: 'Find Jobs', description: 'Discover matching opportunities', icon: Target, href: '/job-match', color: 'var(--success)' },
    { title: 'Analyze Resume', description: 'Get AI-powered insights', icon: BarChart3, href: '/analysis', color: 'var(--warning)' },
    { title: 'Track Applications', description: 'Manage your job pipeline', icon: Calendar, href: '/job-tracker', color: 'var(--error)' }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Welcome back, John! 👋
        </h1>
        <p className="text-secondary">
          Here's what's happening with your career journey today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
              <span className="text-sm text-secondary">{stat.label}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight size={16} style={{ color: 'var(--success)' }} />
                ) : (
                  <ArrowDownRight size={16} style={{ color: 'var(--error)' }} />
                )}
                <span
                  className="text-xs font-medium"
                  style={{ color: stat.trend === 'up' ? 'var(--success)' : 'var(--error)' }}
                >
                  {stat.change}
                </span>
              </div>
            </div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        {/* Quick Actions */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Link to="/dashboard" className="text-sm text-primary" style={{ textDecoration: 'none' }}>
              View all
            </Link>
          </div>
          <div className="grid grid-2" style={{ gap: 'var(--space-4)' }}>
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Link
                  key={index}
                  to={action.href}
                  className="card"
                  style={{
                    padding: 'var(--space-4)',
                    textDecoration: 'none',
                    color: 'inherit',
                    border: '1px solid var(--border)',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-2)' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: action.color,
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Icon size={20} color="white" />
                    </div>
                    <ExternalLink size={16} style={{ color: 'var(--text-muted)' }} />
                  </div>
                  <h3 className="text-base font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                    {action.title}
                  </h3>
                  <p className="text-sm text-secondary">{action.description}</p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {recentActivity.map((activity, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: activity.status === 'success' ? 'var(--success)' : 
                               activity.status === 'pending' ? 'var(--warning)' : 'var(--primary)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <p className="text-sm font-medium" style={{ marginBottom: 'var(--space-1)' }}>
                    {activity.title}
                  </p>
                  <p className="text-xs text-muted">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-8)' }}>
        {/* Resume Progress */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Resume Progress
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="text-sm">Profile Completeness</span>
                <span className="text-sm font-medium">87%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                <div style={{ width: '87%', height: '100%', background: 'var(--success)', borderRadius: 4 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="text-sm">ATS Optimization</span>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                <div style={{ width: '92%', height: '100%', background: 'var(--primary)', borderRadius: 4 }} />
              </div>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span className="text-sm">Skills Match</span>
                <span className="text-sm font-medium">76%</span>
              </div>
              <div style={{ width: '100%', height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                <div style={{ width: '76%', height: '100%', background: 'var(--warning)', borderRadius: 4 }} />
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Recent Achievements
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'var(--warning)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Star size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium">Resume Expert</p>
                <p className="text-xs text-muted">Completed 10 resume optimizations</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'var(--success)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium">Job Hunter</p>
                <p className="text-xs text-muted">Applied to 25+ positions</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  background: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Zap size={20} color="white" />
              </div>
              <div>
                <p className="text-sm font-medium">AI Power User</p>
                <p className="text-xs text-muted">Used 50+ AI features</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}