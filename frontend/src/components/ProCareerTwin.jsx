import React, { useState } from 'react';
import { Bot, Play, Pause, Settings, MessageCircle, Briefcase, Calendar, Zap, Activity, Users, Target } from 'lucide-react';

export default function ProCareerTwin() {
  const [isActive, setIsActive] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  const twin = {
    name: 'AI Twin - Alex',
    stats: {
      applications: 47,
      responses: 23,
      interviews: 8,
      efficiency: 94
    },
    personality: {
      style: 'Professional & Friendly',
      tone: 'Confident',
      confidence: 'High'
    }
  };

  const activities = [
    {
      type: 'application',
      title: 'Applied to Senior Developer at TechCorp',
      description: 'Auto-applied based on 95% skill match',
      time: '2 hours ago',
      status: 'success'
    },
    {
      type: 'response',
      title: 'Responded to Google Recruiter',
      description: 'Sent personalized response about availability',
      time: '4 hours ago',
      status: 'success'
    },
    {
      type: 'interview',
      title: 'Scheduled interview with Meta',
      description: 'Confirmed availability for technical interview',
      time: '1 day ago',
      status: 'pending'
    }
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'activities', label: 'Activities', icon: MessageCircle },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'personality', label: 'Personality', icon: Bot }
  ];

  const renderOverview = () => (
    <div className="pro-twin-overview">
      <div className="pro-twin-status">
        <div className="pro-twin-avatar">
          <Bot size={48} />
        </div>
        <div className="pro-twin-info">
          <h2>{twin.name}</h2>
          <p>Your AI digital clone working 24/7 in the job market</p>
          <div className={`pro-twin-status-badge ${isActive ? 'active' : 'inactive'}`}>
            {isActive ? 'Active & Working' : 'Paused'}
          </div>
        </div>
        <button 
          className={`pro-btn-${isActive ? 'secondary' : 'primary'}`}
          onClick={() => setIsActive(!isActive)}
        >
          {isActive ? <Pause size={16} /> : <Play size={16} />}
          {isActive ? 'Pause Twin' : 'Activate Twin'}
        </button>
      </div>

      <div className="pro-stats-grid">
        <div className="pro-stat-card primary">
          <div className="pro-stat-icon">
            <Briefcase size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{twin.stats.applications}</div>
            <div className="pro-stat-label">Auto Applications</div>
            <div className="pro-stat-trend">+12 this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <MessageCircle size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{twin.stats.responses}</div>
            <div className="pro-stat-label">Auto Responses</div>
            <div className="pro-stat-trend">+8 this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Calendar size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{twin.stats.interviews}</div>
            <div className="pro-stat-label">Interviews Scheduled</div>
            <div className="pro-stat-trend">+3 this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Zap size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{twin.stats.efficiency}%</div>
            <div className="pro-stat-label">Efficiency Score</div>
            <div className="pro-stat-trend">+2% this week</div>
          </div>
        </div>
      </div>

      <div className="pro-twin-insights">
        <div className="pro-insight-card">
          <Target size={24} />
          <div>
            <h4>Performance Insight</h4>
            <p>Your twin has a 48% response rate from recruiters, which is 23% above average. Consider updating your skills profile to target higher-tier positions.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderActivities = () => (
    <div className="pro-twin-activities">
      <div className="pro-activities-header">
        <h3>Recent Twin Activities</h3>
        <p>Track what your AI twin has been doing on your behalf</p>
      </div>

      <div className="pro-activities-list">
        {activities.map((activity, index) => (
          <div key={index} className="pro-activity-item">
            <div className={`pro-activity-icon ${activity.type}`}>
              {activity.type === 'application' && <Briefcase size={20} />}
              {activity.type === 'response' && <MessageCircle size={20} />}
              {activity.type === 'interview' && <Calendar size={20} />}
            </div>
            <div className="pro-activity-content">
              <h4>{activity.title}</h4>
              <p>{activity.description}</p>
              <div className="pro-activity-meta">
                <span className="pro-activity-time">{activity.time}</span>
                <span className={`pro-activity-status ${activity.status}`}>
                  {activity.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pro-twin-settings">
      <div className="pro-settings-section">
        <h3>Automation Settings</h3>
        <div className="pro-settings-grid">
          <div className="pro-setting-item">
            <div className="pro-toggle-group">
              <label className="pro-toggle">
                <input type="checkbox" defaultChecked />
                <span className="pro-toggle-slider"></span>
              </label>
              <div>
                <div className="pro-toggle-label">Auto Apply to Jobs</div>
                <div className="pro-toggle-desc">Automatically apply to matching opportunities</div>
              </div>
            </div>
          </div>

          <div className="pro-setting-item">
            <div className="pro-toggle-group">
              <label className="pro-toggle">
                <input type="checkbox" />
                <span className="pro-toggle-slider"></span>
              </label>
              <div>
                <div className="pro-toggle-label">Auto Respond to Recruiters</div>
                <div className="pro-toggle-desc">Send automated responses to recruiter messages</div>
              </div>
            </div>
          </div>

          <div className="pro-setting-item">
            <div className="pro-toggle-group">
              <label className="pro-toggle">
                <input type="checkbox" defaultChecked />
                <span className="pro-toggle-slider"></span>
              </label>
              <div>
                <div className="pro-toggle-label">Schedule Interviews</div>
                <div className="pro-toggle-desc">Automatically schedule preliminary interviews</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-settings-section">
        <h3>Preferences</h3>
        <div className="pro-form-grid">
          <div className="pro-form-group">
            <label>Interview Mode</label>
            <select className="pro-select">
              <option>Screening Only</option>
              <option>Preliminary Interviews</option>
              <option>Full Automation</option>
            </select>
          </div>
          <div className="pro-form-group">
            <label>Response Speed</label>
            <select className="pro-select">
              <option>Immediate</option>
              <option>Within 1 hour</option>
              <option>Within 24 hours</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPersonality = () => (
    <div className="pro-twin-personality">
      <div className="pro-personality-header">
        <h3>Twin Personality</h3>
        <p>Customize how your AI twin communicates and represents you</p>
      </div>

      <div className="pro-personality-grid">
        <div className="pro-personality-section">
          <h4>Communication Style</h4>
          <div className="pro-personality-options">
            {['Professional', 'Friendly', 'Confident', 'Casual'].map((style) => (
              <button 
                key={style}
                className={`pro-personality-option ${style === 'Professional' ? 'selected' : ''}`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div className="pro-personality-section">
          <h4>Response Tone</h4>
          <div className="pro-personality-options">
            {['Enthusiastic', 'Balanced', 'Conservative', 'Direct'].map((tone) => (
              <button 
                key={tone}
                className={`pro-personality-option ${tone === 'Balanced' ? 'selected' : ''}`}
              >
                {tone}
              </button>
            ))}
          </div>
        </div>

        <div className="pro-personality-section">
          <h4>Confidence Level</h4>
          <div className="pro-confidence-slider">
            <input type="range" min="1" max="10" defaultValue="7" className="pro-slider" />
            <div className="pro-slider-labels">
              <span>Modest</span>
              <span>Confident</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-personality-preview">
        <h4>Preview Response</h4>
        <div className="pro-preview-card">
          <p>"Thank you for reaching out about the Senior Developer position. I'm very interested in this opportunity and believe my experience in React and Node.js would be a great fit for your team. I'm available for a call this week to discuss further."</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Bot size={32} />
          </div>
          <div>
            <h1 className="pro-title">Career Twin</h1>
            <p className="pro-subtitle">Your AI digital clone working 24/7 in the job market</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Users size={16} />
          Create New Twin
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
        {activeTab === 'activities' && renderActivities()}
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'personality' && renderPersonality()}
      </div>
    </div>
  );
}