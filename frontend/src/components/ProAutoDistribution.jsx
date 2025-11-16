import React, { useState } from 'react';
import { Zap, Send, Target, Clock, CheckCircle, BarChart, Settings, Play, Pause } from 'lucide-react';

export default function ProAutoDistribution() {
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart },
    { id: 'campaigns', label: 'Campaigns', icon: Send },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const stats = {
    totalSent: 247,
    responseRate: 18,
    interviews: 12,
    todaySent: 8,
    dailyLimit: 15
  };

  const campaigns = [
    {
      id: 1,
      company: 'Google',
      position: 'Senior Software Engineer',
      status: 'sent',
      sentAt: '2 hours ago',
      opened: true,
      response: false
    },
    {
      id: 2,
      company: 'Meta',
      position: 'Frontend Developer',
      status: 'viewed',
      sentAt: '4 hours ago',
      opened: true,
      response: true
    },
    {
      id: 3,
      company: 'Apple',
      position: 'iOS Developer',
      status: 'sent',
      sentAt: '1 day ago',
      opened: false,
      response: false
    }
  ];

  const renderOverview = () => (
    <div className="pro-distribution-overview">
      <div className="pro-campaign-status">
        <div className="pro-status-card">
          <div className="pro-status-icon">
            <Zap size={32} />
          </div>
          <div className="pro-status-info">
            <h2>Auto Distribution</h2>
            <p>Automatically send your resume to relevant opportunities</p>
            <div className={`pro-status-badge ${isActive ? 'active' : 'inactive'}`}>
              {isActive ? 'Active Campaign' : 'Paused'}
            </div>
          </div>
          <button 
            className={`pro-btn-${isActive ? 'secondary' : 'primary'}`}
            onClick={() => setIsActive(!isActive)}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? 'Pause' : 'Start'} Campaign
          </button>
        </div>
      </div>

      <div className="pro-stats-grid">
        <div className="pro-stat-card primary">
          <div className="pro-stat-icon">
            <Send size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{stats.totalSent}</div>
            <div className="pro-stat-label">Applications Sent</div>
            <div className="pro-stat-trend">+{stats.todaySent} today</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Target size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{stats.responseRate}%</div>
            <div className="pro-stat-label">Response Rate</div>
            <div className="pro-stat-trend">+2% this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <CheckCircle size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{stats.interviews}</div>
            <div className="pro-stat-label">Interviews</div>
            <div className="pro-stat-trend">+3 this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Clock size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{stats.todaySent}/{stats.dailyLimit}</div>
            <div className="pro-stat-label">Daily Progress</div>
            <div className="pro-stat-trend">{stats.dailyLimit - stats.todaySent} remaining</div>
          </div>
        </div>
      </div>

      <div className="pro-daily-progress">
        <h3>Daily Application Progress</h3>
        <div className="pro-progress-card">
          <div className="pro-progress-info">
            <span>{stats.todaySent} of {stats.dailyLimit} applications sent today</span>
            <span>{Math.round((stats.todaySent / stats.dailyLimit) * 100)}%</span>
          </div>
          <div className="pro-progress-bar">
            <div 
              className="pro-progress-fill" 
              style={{ width: `${(stats.todaySent / stats.dailyLimit) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCampaigns = () => (
    <div className="pro-campaigns-section">
      <div className="pro-campaigns-header">
        <h3>Recent Applications</h3>
        <p>Track your automated job applications and responses</p>
      </div>

      <div className="pro-campaigns-list">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="pro-campaign-card">
            <div className="pro-campaign-header">
              <div className="pro-campaign-info">
                <h4>{campaign.company}</h4>
                <p className="pro-campaign-position">{campaign.position}</p>
              </div>
              <div className={`pro-campaign-status ${campaign.status}`}>
                {campaign.status}
              </div>
            </div>

            <div className="pro-campaign-meta">
              <div className="pro-campaign-time">
                <Clock size={14} />
                <span>Sent {campaign.sentAt}</span>
              </div>
              
              {campaign.opened && (
                <div className="pro-campaign-opened">
                  <CheckCircle size={14} />
                  <span>Opened by recruiter</span>
                </div>
              )}
              
              {campaign.response && (
                <div className="pro-campaign-response">
                  <Target size={14} />
                  <span>Response received</span>
                </div>
              )}
            </div>

            <div className="pro-campaign-actions">
              <button className="pro-btn-ghost">View Details</button>
              <button className="pro-btn-ghost">Follow Up</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pro-settings-section">
      <div className="pro-settings-header">
        <h3>Distribution Settings</h3>
        <p>Configure your automated application preferences</p>
      </div>

      <div className="pro-settings-grid">
        <div className="pro-settings-group">
          <h4>Application Limits</h4>
          <div className="pro-form-group">
            <label>Daily Application Limit</label>
            <input 
              type="number" 
              defaultValue={15} 
              min="1" 
              max="50" 
              className="pro-input"
            />
            <div className="pro-form-help">
              Maximum applications to send per day (recommended: 10-20)
            </div>
          </div>

          <div className="pro-form-group">
            <label>Weekly Limit</label>
            <input 
              type="number" 
              defaultValue={75} 
              min="5" 
              max="200" 
              className="pro-input"
            />
          </div>
        </div>

        <div className="pro-settings-group">
          <h4>Job Preferences</h4>
          <div className="pro-form-group">
            <label>Job Types</label>
            <div className="pro-checkbox-group">
              <label className="pro-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Full-time</span>
              </label>
              <label className="pro-checkbox">
                <input type="checkbox" />
                <span>Part-time</span>
              </label>
              <label className="pro-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Contract</span>
              </label>
              <label className="pro-checkbox">
                <input type="checkbox" defaultChecked />
                <span>Remote</span>
              </label>
            </div>
          </div>

          <div className="pro-form-group">
            <label>Salary Range</label>
            <div className="pro-salary-range">
              <input 
                type="number" 
                placeholder="Min salary" 
                defaultValue={80000}
                className="pro-input"
              />
              <span>to</span>
              <input 
                type="number" 
                placeholder="Max salary" 
                defaultValue={150000}
                className="pro-input"
              />
            </div>
          </div>
        </div>

        <div className="pro-settings-group">
          <h4>Automation Rules</h4>
          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Auto-send applications</div>
              <div className="pro-toggle-desc">Automatically send applications to matching jobs</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Follow-up reminders</div>
              <div className="pro-toggle-desc">Send follow-up emails after 1 week</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Smart filtering</div>
              <div className="pro-toggle-desc">Use AI to filter out irrelevant positions</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-settings-actions">
        <button className="pro-btn-primary">Save Settings</button>
        <button className="pro-btn-secondary">Reset to Default</button>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Zap size={32} />
          </div>
          <div>
            <h1 className="pro-title">Auto Distribution</h1>
            <p className="pro-subtitle">Automated resume distribution to relevant opportunities</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Send size={16} />
          Test Campaign
        </button>
      </div>

      {/* Navigation */}
      <div className="pro-nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`pro-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'campaigns' && renderCampaigns()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}