import React, { useState } from 'react';
import { Plus, Calendar, Clock, CheckCircle, AlertCircle, TrendingUp, Briefcase, FileText, Target } from 'lucide-react';

export default function ProJobTracker() {
  const [activeView, setActiveView] = useState('kanban');

  const stats = [
    { label: 'Total Applications', value: '24', icon: FileText, color: 'var(--primary)' },
    { label: 'Interviews Scheduled', value: '8', icon: Calendar, color: 'var(--warning)' },
    { label: 'Offers Received', value: '3', icon: CheckCircle, color: 'var(--success)' },
    { label: 'Response Rate', value: '67%', icon: TrendingUp, color: 'var(--error)' }
  ];

  const applications = {
    applied: [
      { id: 1, company: 'Google', position: 'Senior Software Engineer', salary: '$180k-220k', date: '2024-01-15', status: 'applied' },
      { id: 2, company: 'Microsoft', position: 'Principal Engineer', salary: '$200k-250k', date: '2024-01-14', status: 'applied' }
    ],
    screening: [
      { id: 3, company: 'Meta', position: 'Staff Engineer', salary: '$220k-280k', date: '2024-01-12', status: 'screening' },
      { id: 4, company: 'Apple', position: 'Senior iOS Engineer', salary: '$190k-240k', date: '2024-01-10', status: 'screening' }
    ],
    interview: [
      { id: 5, company: 'Netflix', position: 'Senior Backend Engineer', salary: '$200k-260k', date: '2024-01-08', status: 'interview' }
    ],
    offer: [
      { id: 6, company: 'Stripe', position: 'Senior Full Stack Engineer', salary: '$185k-230k', date: '2024-01-05', status: 'offer' }
    ]
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'var(--gray-500)';
      case 'screening': return 'var(--primary)';
      case 'interview': return 'var(--warning)';
      case 'offer': return 'var(--success)';
      case 'rejected': return 'var(--error)';
      default: return 'var(--gray-500)';
    }
  };

  const KanbanView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
      {Object.entries(applications).map(([status, apps]) => (
        <div key={status}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 className="text-base font-semibold" style={{ textTransform: 'capitalize' }}>
              {status.replace('_', ' ')}
            </h3>
            <span
              style={{
                padding: 'var(--space-1) var(--space-2)',
                background: getStatusColor(status),
                color: 'white',
                borderRadius: '50%',
                fontSize: 'var(--text-xs)',
                fontWeight: 600,
                minWidth: 20,
                textAlign: 'center'
              }}
            >
              {apps.length}
            </span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {apps.map((app) => (
              <div
                key={app.id}
                className="card"
                style={{
                  padding: 'var(--space-4)',
                  cursor: 'pointer',
                  borderLeft: `4px solid ${getStatusColor(app.status)}`
                }}
              >
                <h4 className="text-sm font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                  {app.position}
                </h4>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-2)' }}>
                  {app.company}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span className="text-xs text-muted">{app.salary}</span>
                  <span className="text-xs text-muted">{app.date}</span>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-sm" style={{ fontSize: 'var(--text-xs)' }}>
                    View
                  </button>
                  <button className="btn btn-sm" style={{ fontSize: 'var(--text-xs)' }}>
                    Update
                  </button>
                </div>
              </div>
            ))}
            
            <button
              style={{
                padding: 'var(--space-4)',
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius)',
                background: 'transparent',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: 'var(--text-sm)',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border)';
                e.target.style.color = 'var(--text-muted)';
              }}
            >
              <Plus size={16} style={{ marginBottom: 'var(--space-1)' }} />
              <br />
              Add Application
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const ListView = () => (
    <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
      <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 className="text-lg font-semibold">All Applications</h3>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <select className="input" style={{ width: 'auto' }}>
              <option>All Status</option>
              <option>Applied</option>
              <option>Interview</option>
              <option>Offer</option>
            </select>
            <button className="btn btn-primary">
              <Plus size={16} />
              Add Application
            </button>
          </div>
        </div>
      </div>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-50)' }}>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Company</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Position</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Status</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Salary</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Applied</th>
              <th style={{ padding: 'var(--space-3)', textAlign: 'left', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Object.values(applications).flat().map((app) => (
              <tr key={app.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: 'var(--space-3)' }}>
                  <div className="text-sm font-medium">{app.company}</div>
                </td>
                <td style={{ padding: 'var(--space-3)' }}>
                  <div className="text-sm">{app.position}</div>
                </td>
                <td style={{ padding: 'var(--space-3)' }}>
                  <span
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      background: getStatusColor(app.status),
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}
                  >
                    {app.status}
                  </span>
                </td>
                <td style={{ padding: 'var(--space-3)' }}>
                  <div className="text-sm">{app.salary}</div>
                </td>
                <td style={{ padding: 'var(--space-3)' }}>
                  <div className="text-sm text-secondary">{app.date}</div>
                </td>
                <td style={{ padding: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn btn-sm">Edit</button>
                    <button className="btn btn-sm">View</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Job Application Tracker
        </h1>
        <p className="text-secondary">
          Manage your job applications with CRM-style tracking and analytics.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: stat.color,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ marginBottom: 'var(--space-1)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-1)', background: 'var(--gray-100)', borderRadius: 'var(--radius)', padding: 'var(--space-1)' }}>
          <button
            onClick={() => setActiveView('kanban')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeView === 'kanban' ? 'white' : 'transparent',
              color: activeView === 'kanban' ? 'var(--text)' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            Kanban View
          </button>
          <button
            onClick={() => setActiveView('list')}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              background: activeView === 'list' ? 'white' : 'transparent',
              color: activeView === 'list' ? 'var(--text)' : 'var(--text-secondary)',
              fontSize: 'var(--text-sm)',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
          >
            List View
          </button>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <button className="btn">
            <Calendar size={16} />
            Calendar View
          </button>
          <button className="btn btn-primary">
            <Plus size={16} />
            Add Application
          </button>
        </div>
      </div>

      {/* Main Content */}
      {activeView === 'kanban' ? <KanbanView /> : <ListView />}
    </div>
  );
}