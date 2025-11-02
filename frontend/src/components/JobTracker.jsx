import React, { useState, useEffect } from 'react';
import { Plus, Calendar, Bell, FileText, BarChart3, ExternalLink, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function JobTracker() {
  const [applications, setApplications] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('applications');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [appsRes, remindersRes, docsRes, analyticsRes] = await Promise.all([
        api.get('/job-tracker/applications').catch(() => ({ data: { applications: [] } })),
        api.get('/job-tracker/reminders').catch(() => ({ data: { reminders: [] } })),
        api.get('/job-tracker/documents').catch(() => ({ data: { documents: [] } })),
        api.get('/job-tracker/analytics').catch(() => ({ data: { analytics: null } }))
      ]);
      
      setApplications(appsRes.data.applications);
      setReminders(remindersRes.data.reminders);
      setDocuments(docsRes.data.documents);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Failed to load job tracker data:', error);
    }
  };

  const addApplication = async (appData) => {
    try {
      const { data } = await api.post('/job-tracker/applications', appData);
      setApplications([...applications, data.application]);
      setShowApplicationForm(false);
      showToast('Application added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add application', 'error');
    }
  };

  const updateApplicationStatus = async (id, status, stage) => {
    try {
      await api.put(`/job-tracker/applications/${id}`, { status, stage });
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status, stage } : app
      ));
      showToast('Application updated!', 'success');
    } catch (error) {
      showToast('Failed to update application', 'error');
    }
  };

  const syncCalendar = async () => {
    try {
      const { data } = await api.post('/job-tracker/calendar/sync');
      showToast(`Calendar synced! ${data.synced} events added.`, 'success');
    } catch (error) {
      showToast('Failed to sync calendar', 'error');
    }
  };

  const ApplicationForm = () => {
    const [formData, setFormData] = useState({
      company: '', position: '', jobUrl: '', salary: '', location: '', notes: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addApplication(formData);
    };

    return (
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <h3>Add Job Application</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <input
              placeholder="Company Name"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              required
            />
            <input
              placeholder="Position Title"
              value={formData.position}
              onChange={(e) => setFormData({...formData, position: e.target.value})}
              required
            />
          </div>
          <input
            placeholder="Job URL"
            value={formData.jobUrl}
            onChange={(e) => setFormData({...formData, jobUrl: e.target.value})}
          />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            <input
              placeholder="Salary Range"
              value={formData.salary}
              onChange={(e) => setFormData({...formData, salary: e.target.value})}
            />
            <input
              placeholder="Location"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <textarea
            placeholder="Notes"
            value={formData.notes}
            onChange={(e) => setFormData({...formData, notes: e.target.value})}
            rows={3}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="btn primary">Add Application</button>
            <button type="button" className="btn ghost" onClick={() => setShowApplicationForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'applied': return 'var(--primary)';
      case 'interview': return 'var(--warning)';
      case 'offer': return 'var(--success)';
      case 'rejected': return 'var(--error)';
      default: return 'var(--text-soft)';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'applied': return <Clock size={16} />;
      case 'interview': return <Calendar size={16} />;
      case 'offer': return <CheckCircle size={16} />;
      case 'rejected': return <AlertCircle size={16} />;
      default: return <Clock size={16} />;
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1>Job Application Tracker</h1>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn ghost" onClick={syncCalendar}>
            <Calendar size={16} />
            Sync Calendar
          </button>
          <button className="btn primary" onClick={() => setShowApplicationForm(true)}>
            <Plus size={16} />
            Add Application
          </button>
        </div>
      </div>

      {/* Stats */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <FileText size={20} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{analytics.overview.totalApplications}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Total Applications</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Calendar size={20} color="var(--warning)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{analytics.overview.interviews}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Interviews</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle size={20} color="var(--success)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{analytics.overview.offers}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Offers</div>
              </div>
            </div>
          </div>
          
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <BarChart3 size={20} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{analytics.responseRate}%</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Response Rate</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['applications', 'reminders', 'documents', 'analytics'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-soft)',
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Applications Tab */}
      {activeTab === 'applications' && (
        <div>
          {showApplicationForm && <ApplicationForm />}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {applications.map(app => (
              <div key={app.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <h3 style={{ margin: '0 0 var(--space-1)' }}>{app.position}</h3>
                    <p style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-lg)', fontWeight: '500' }}>{app.company}</p>
                    <p style={{ margin: 0, color: 'var(--text-soft)' }}>{app.location} • {app.salary}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-1)',
                      padding: 'var(--space-1) var(--space-2)', 
                      background: `${getStatusColor(app.status)}20`,
                      color: getStatusColor(app.status),
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-sm)',
                      textTransform: 'capitalize'
                    }}>
                      {getStatusIcon(app.status)}
                      {app.status}
                    </span>
                    {app.jobUrl && (
                      <button className="btn ghost small" onClick={() => window.open(app.jobUrl, '_blank')}>
                        <ExternalLink size={14} />
                      </button>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Applied</div>
                    <div style={{ fontWeight: '500' }}>{app.appliedDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Stage</div>
                    <div style={{ fontWeight: '500' }}>{app.stage}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Next Action</div>
                    <div style={{ fontWeight: '500' }}>{app.nextAction}</div>
                  </div>
                </div>
                
                {app.notes && (
                  <div style={{ padding: 'var(--space-3)', background: 'var(--muted)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>Notes</div>
                    <div>{app.notes}</div>
                  </div>
                )}
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <select 
                    value={app.status} 
                    onChange={(e) => updateApplicationStatus(app.id, e.target.value, app.stage)}
                    style={{ fontSize: 'var(--text-sm)' }}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button className="btn ghost small">
                    <Bell size={14} />
                    Set Reminder
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reminders Tab */}
      {activeTab === 'reminders' && (
        <div>
          <h3>Upcoming Reminders</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {reminders.map(reminder => (
              <div key={reminder.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 var(--space-1)' }}>{reminder.company}</h4>
                    <p style={{ margin: '0 0 var(--space-1)' }}>{reminder.message}</p>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Due: {reminder.dueDate}</p>
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button className="btn ghost small">
                      <CheckCircle size={14} />
                      Complete
                    </button>
                    <button className="btn ghost small">
                      <Clock size={14} />
                      Snooze
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Documents Tab */}
      {activeTab === 'documents' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Document Vault</h3>
            <button className="btn primary">
              <Plus size={16} />
              Upload Document
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {documents.map(doc => (
              <div key={doc.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <FileText size={24} color="var(--primary)" />
                  <div>
                    <h4 style={{ margin: 0 }}>{doc.name}</h4>
                    <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {doc.size} • {doc.uploadDate}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {doc.tags.map(tag => (
                    <span key={tag} style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--muted)', 
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-xs)' 
                    }}>
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn primary small" onClick={() => window.open(doc.url, '_blank')}>
                    <ExternalLink size={14} />
                    View
                  </button>
                  <button className="btn ghost small">Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div>
          <h3>Application Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4>Application Status Breakdown</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Pending</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.overview.pending}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Interviews</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.overview.interviews}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Offers</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.overview.offers}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Rejections</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.overview.rejections}</span>
                </div>
              </div>
            </div>
            
            <div className="card">
              <h4>Top Companies</h4>
              {analytics.topCompanies.map(company => (
                <div key={company.company} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{company.company}</span>
                  <span style={{ fontWeight: 'bold' }}>{company.applications} apps</span>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Performance Metrics</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Response Rate</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.responseRate}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Avg Response Time</span>
                  <span style={{ fontWeight: 'bold' }}>{analytics.averageResponseTime} days</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}