import React from 'react';
import { BarChart3, TrendingUp, Users, Eye, Download, Calendar, Target, Zap } from 'lucide-react';

export default function ModernAnalytics() {
  const metrics = [
    { label: 'Resume Views', value: '2,847', change: '+12.5%', trend: 'up' },
    { label: 'Download Rate', value: '18.3%', change: '+2.1%', trend: 'up' },
    { label: 'Application Success', value: '24.7%', change: '-1.2%', trend: 'down' },
    { label: 'Profile Strength', value: '87/100', change: '+5', trend: 'up' }
  ];

  const chartData = [
    { month: 'Jan', views: 120, applications: 8, interviews: 2 },
    { month: 'Feb', views: 180, applications: 12, interviews: 4 },
    { month: 'Mar', views: 240, applications: 15, interviews: 6 },
    { month: 'Apr', views: 320, applications: 18, interviews: 7 },
    { month: 'May', views: 280, applications: 22, interviews: 9 },
    { month: 'Jun', views: 380, applications: 25, interviews: 11 }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Analytics Dashboard
        </h1>
        <p className="text-secondary">
          Track your career progress and optimize your job search strategy.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-4" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {metrics.map((metric, index) => (
          <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
              <span className="text-sm text-secondary">{metric.label}</span>
              <TrendingUp size={16} style={{ color: metric.trend === 'up' ? 'var(--success)' : 'var(--error)' }} />
            </div>
            <div className="text-2xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
              {metric.value}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span
                className="text-sm font-medium"
                style={{ color: metric.trend === 'up' ? 'var(--success)' : 'var(--error)' }}
              >
                {metric.change}
              </span>
              <span className="text-xs text-muted">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-8)' }}>
        {/* Main Chart */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Performance Overview
          </h2>
          <div style={{ height: 300, display: 'flex', alignItems: 'end', gap: 'var(--space-2)', padding: 'var(--space-4) 0' }}>
            {chartData.map((data, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'end', gap: 2, height: 200 }}>
                  <div
                    style={{
                      width: 12,
                      height: `${(data.views / 400) * 200}px`,
                      background: 'var(--primary)',
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: `${(data.applications / 30) * 200}px`,
                      background: 'var(--success)',
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                  <div
                    style={{
                      width: 12,
                      height: `${(data.interviews / 15) * 200}px`,
                      background: 'var(--warning)',
                      borderRadius: '2px 2px 0 0'
                    }}
                  />
                </div>
                <span className="text-xs text-muted">{data.month}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', marginTop: 'var(--space-4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 12, height: 12, background: 'var(--primary)', borderRadius: 2 }} />
              <span className="text-sm">Views</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 12, height: 12, background: 'var(--success)', borderRadius: 2 }} />
              <span className="text-sm">Applications</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <div style={{ width: 12, height: 12, background: 'var(--warning)', borderRadius: 2 }} />
              <span className="text-sm">Interviews</span>
            </div>
          </div>
        </div>

        {/* Top Skills */}
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Top Skills Demand
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {[
              { skill: 'React', demand: 92 },
              { skill: 'Node.js', demand: 87 },
              { skill: 'Python', demand: 84 },
              { skill: 'AWS', demand: 79 },
              { skill: 'TypeScript', demand: 76 }
            ].map((item, index) => (
              <div key={index}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                  <span className="text-sm font-medium">{item.skill}</span>
                  <span className="text-sm text-muted">{item.demand}%</span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${item.demand}%`,
                      height: '100%',
                      background: 'var(--primary)',
                      borderRadius: 3
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--primary)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Eye size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Profile Visibility</h3>
              <p className="text-sm text-secondary">Increase by 23%</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            Your profile is performing well. Consider adding more skills to increase visibility.
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--success)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Target size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Job Match Rate</h3>
              <p className="text-sm text-secondary">87% compatibility</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            Excellent job matching. Your skills align well with current market demands.
          </p>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
            <div
              style={{
                width: 48,
                height: 48,
                background: 'var(--warning)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Zap size={24} color="white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Response Rate</h3>
              <p className="text-sm text-secondary">Improve by 15%</p>
            </div>
          </div>
          <p className="text-sm text-muted">
            Consider optimizing your resume summary to improve employer response rates.
          </p>
        </div>
      </div>
    </div>
  );
}