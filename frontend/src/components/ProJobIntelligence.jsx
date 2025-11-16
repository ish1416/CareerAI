import React, { useState } from 'react';
import { BarChart, TrendingUp, AlertCircle, Building, Zap, Filter, Bell } from 'lucide-react';

export default function ProJobIntelligence() {
  const [activeTab, setActiveTab] = useState('feed');
  const [selectedFilter, setSelectedFilter] = useState('all');

  const tabs = [
    { id: 'feed', label: 'Intelligence Feed', icon: BarChart },
    { id: 'trends', label: 'Market Trends', icon: TrendingUp },
    { id: 'alerts', label: 'Smart Alerts', icon: Bell }
  ];

  const intelligenceFeed = [
    {
      id: 1,
      type: 'hiring_surge',
      title: 'Google Hiring Surge in AI/ML',
      description: 'Google has increased AI/ML hiring by 45% this quarter, with 127 new positions posted in the last 7 days.',
      impact: 'high',
      timestamp: '2 hours ago',
      source: 'LinkedIn Jobs API',
      relevance: 94
    },
    {
      id: 2,
      type: 'salary_increase',
      title: 'React Developer Salaries Up 12%',
      description: 'Average React developer salaries have increased 12% year-over-year, now averaging $118k in major tech hubs.',
      impact: 'medium',
      timestamp: '4 hours ago',
      source: 'Glassdoor Data',
      relevance: 87
    },
    {
      id: 3,
      type: 'company_expansion',
      title: 'Stripe Expanding Engineering Team',
      description: 'Stripe announced plans to hire 200+ engineers across multiple locations, focusing on payments infrastructure.',
      impact: 'high',
      timestamp: '6 hours ago',
      source: 'Company Blog',
      relevance: 91
    }
  ];

  const marketTrends = [
    {
      id: 1,
      skill: 'Artificial Intelligence',
      demand: 95,
      growth: '+67%',
      trend: 'rising',
      jobs: 2847,
      avgSalary: '$145k'
    },
    {
      id: 2,
      skill: 'Cloud Computing',
      demand: 88,
      growth: '+34%',
      trend: 'rising',
      jobs: 1923,
      avgSalary: '$128k'
    },
    {
      id: 3,
      skill: 'Cybersecurity',
      demand: 82,
      growth: '+28%',
      trend: 'rising',
      jobs: 1456,
      avgSalary: '$135k'
    },
    {
      id: 4,
      skill: 'Data Science',
      demand: 79,
      growth: '+22%',
      trend: 'stable',
      jobs: 1234,
      avgSalary: '$122k'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'job_match',
      title: 'New High-Match Position',
      message: 'Senior Software Engineer at Meta - 96% match with your profile',
      priority: 'high',
      timestamp: '1 hour ago',
      actionable: true
    },
    {
      id: 2,
      type: 'salary_alert',
      title: 'Salary Benchmark Update',
      message: 'Your target salary is now 8% below market rate for your experience level',
      priority: 'medium',
      timestamp: '3 hours ago',
      actionable: true
    },
    {
      id: 3,
      type: 'skill_trend',
      title: 'Trending Skill Alert',
      message: 'GraphQL demand increased 45% - consider adding to your skillset',
      priority: 'low',
      timestamp: '1 day ago',
      actionable: false
    }
  ];

  const renderFeed = () => (
    <div className="pro-intelligence-feed">
      <div className="pro-feed-header">
        <div className="pro-feed-controls">
          <div className="pro-filter-group">
            <Filter size={16} />
            <select 
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="pro-select"
            >
              <option value="all">All Intelligence</option>
              <option value="hiring">Hiring Trends</option>
              <option value="salary">Salary Updates</option>
              <option value="company">Company News</option>
            </select>
          </div>
          <button className="pro-btn-secondary">
            <Bell size={16} />
            Set Alerts
          </button>
        </div>
      </div>

      <div className="pro-feed-list">
        {intelligenceFeed.map((item) => (
          <div key={item.id} className="pro-intelligence-card">
            <div className="pro-intelligence-header">
              <div className="pro-intelligence-type">
                <div className={`pro-type-icon ${item.type}`}>
                  {item.type === 'hiring_surge' && <Building size={20} />}
                  {item.type === 'salary_increase' && <TrendingUp size={20} />}
                  {item.type === 'company_expansion' && <Zap size={20} />}
                </div>
                <div className="pro-intelligence-meta">
                  <h4>{item.title}</h4>
                  <div className="pro-meta-info">
                    <span className="pro-timestamp">{item.timestamp}</span>
                    <span className="pro-source">via {item.source}</span>
                  </div>
                </div>
              </div>
              <div className="pro-intelligence-relevance">
                <div className="pro-relevance-score">{item.relevance}%</div>
                <div className="pro-relevance-label">Relevance</div>
              </div>
            </div>

            <p className="pro-intelligence-description">{item.description}</p>

            <div className="pro-intelligence-footer">
              <div className={`pro-impact-badge ${item.impact}`}>
                {item.impact} impact
              </div>
              <div className="pro-intelligence-actions">
                <button className="pro-btn-ghost">View Details</button>
                <button className="pro-btn-ghost">Set Alert</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderTrends = () => (
    <div className="pro-market-trends">
      <div className="pro-trends-header">
        <h3>Market Trends Analysis</h3>
        <p>Real-time insights into skill demand and market movements</p>
      </div>

      <div className="pro-trends-grid">
        {marketTrends.map((trend) => (
          <div key={trend.id} className="pro-trend-card">
            <div className="pro-trend-header">
              <h4>{trend.skill}</h4>
              <div className={`pro-trend-indicator ${trend.trend}`}>
                <TrendingUp size={16} />
                <span>{trend.growth}</span>
              </div>
            </div>

            <div className="pro-trend-metrics">
              <div className="pro-trend-metric">
                <span className="pro-metric-label">Demand Score</span>
                <div className="pro-demand-bar">
                  <div 
                    className="pro-demand-fill" 
                    style={{ width: `${trend.demand}%` }}
                  ></div>
                </div>
                <span className="pro-metric-value">{trend.demand}/100</span>
              </div>

              <div className="pro-trend-stats">
                <div className="pro-trend-stat">
                  <span className="pro-stat-label">Open Jobs</span>
                  <span className="pro-stat-value">{trend.jobs.toLocaleString()}</span>
                </div>
                <div className="pro-trend-stat">
                  <span className="pro-stat-label">Avg Salary</span>
                  <span className="pro-stat-value">{trend.avgSalary}</span>
                </div>
              </div>
            </div>

            <div className="pro-trend-actions">
              <button className="pro-btn-primary">Learn Skill</button>
              <button className="pro-btn-ghost">View Jobs</button>
            </div>
          </div>
        ))}
      </div>

      <div className="pro-market-summary">
        <h4>Market Summary</h4>
        <div className="pro-summary-grid">
          <div className="pro-summary-item">
            <span className="pro-summary-label">Hottest Skill</span>
            <span className="pro-summary-value">Artificial Intelligence</span>
          </div>
          <div className="pro-summary-item">
            <span className="pro-summary-label">Fastest Growing</span>
            <span className="pro-summary-value">AI/ML (+67%)</span>
          </div>
          <div className="pro-summary-item">
            <span className="pro-summary-label">Highest Paying</span>
            <span className="pro-summary-value">AI Engineering ($145k)</span>
          </div>
          <div className="pro-summary-item">
            <span className="pro-summary-label">Most Jobs</span>
            <span className="pro-summary-value">Cloud Computing (1,923)</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAlerts = () => (
    <div className="pro-alerts-section">
      <div className="pro-alerts-header">
        <h3>Smart Alerts</h3>
        <p>Personalized notifications based on your career goals</p>
      </div>

      <div className="pro-alerts-list">
        {alerts.map((alert) => (
          <div key={alert.id} className="pro-alert-card">
            <div className="pro-alert-header">
              <div className={`pro-alert-icon ${alert.priority}`}>
                {alert.type === 'job_match' && <Building size={20} />}
                {alert.type === 'salary_alert' && <TrendingUp size={20} />}
                {alert.type === 'skill_trend' && <Zap size={20} />}
              </div>
              <div className="pro-alert-info">
                <h4>{alert.title}</h4>
                <p className="pro-alert-message">{alert.message}</p>
              </div>
              <div className={`pro-alert-priority ${alert.priority}`}>
                {alert.priority}
              </div>
            </div>

            <div className="pro-alert-footer">
              <span className="pro-alert-time">{alert.timestamp}</span>
              {alert.actionable && (
                <div className="pro-alert-actions">
                  <button className="pro-btn-primary">Take Action</button>
                  <button className="pro-btn-ghost">Dismiss</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="pro-alert-settings">
        <h4>Alert Preferences</h4>
        <div className="pro-alert-preferences">
          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Job Match Alerts</div>
              <div className="pro-toggle-desc">Get notified about high-match job opportunities</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Salary Updates</div>
              <div className="pro-toggle-desc">Receive market salary benchmark updates</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Skill Trends</div>
              <div className="pro-toggle-desc">Stay informed about emerging skill demands</div>
            </div>
          </div>
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
            <BarChart size={32} />
          </div>
          <div>
            <h1 className="pro-title">Job Intelligence</h1>
            <p className="pro-subtitle">Real-time job market insights and career intelligence</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <AlertCircle size={16} />
          Create Alert
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
        {activeTab === 'feed' && renderFeed()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'alerts' && renderAlerts()}
      </div>
    </div>
  );
}