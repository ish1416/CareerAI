import React, { useState, useEffect } from 'react';
import { Zap, Send, Target, Clock, CheckCircle, BarChart } from 'lucide-react';
import api from '../utils/api.js';

export default function AutoDistribution() {
  const [campaigns, setCampaigns] = useState([]);
  const [stats, setStats] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [settings, setSettings] = useState({
    autoSend: true,
    dailyLimit: 10,
    targetCompanies: [],
    jobTypes: ['full-time', 'contract'],
    salaryRange: { min: 80000, max: 150000 }
  });

  useEffect(() => {
    loadCampaigns();
    loadStats();
  }, []);

  const loadCampaigns = async () => {
    try {
      const { data } = await api.get('/auto-distribution/campaigns');
      setCampaigns(data.campaigns);
    } catch (error) {
      console.error('Failed to load campaigns:', error);
    }
  };

  const loadStats = async () => {
    try {
      const { data } = await api.get('/auto-distribution/stats');
      setStats(data);
      setIsActive(data.isActive);
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

  const startCampaign = async () => {
    try {
      await api.post('/auto-distribution/start', settings);
      setIsActive(true);
      loadStats();
    } catch (error) {
      console.error('Failed to start campaign:', error);
    }
  };

  const stopCampaign = async () => {
    try {
      await api.post('/auto-distribution/stop');
      setIsActive(false);
      loadStats();
    } catch (error) {
      console.error('Failed to stop campaign:', error);
    }
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Zap size={32} color="var(--primary)" />
        <div>
          <h1>Automated Resume Distribution</h1>
          <p style={{ color: 'var(--text-soft)' }}>Automatically send your resume to relevant companies</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Send size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{stats.totalSent}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Applications Sent</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Target size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{stats.responseRate}%</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Response Rate</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <CheckCircle size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{stats.interviews}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Interviews Scheduled</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{stats.todaySent}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Sent Today</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Campaign Settings */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Distribution Settings</h3>
            <button 
              className={`btn ${isActive ? 'secondary' : 'primary'}`}
              onClick={isActive ? stopCampaign : startCampaign}
            >
              {isActive ? 'Stop Campaign' : 'Start Campaign'}
            </button>
          </div>
          
          <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div>
                <label>Daily Application Limit</label>
                <input 
                  type="number"
                  value={settings.dailyLimit}
                  onChange={(e) => setSettings({...settings, dailyLimit: parseInt(e.target.value)})}
                  min="1"
                  max="50"
                />
              </div>
              
              <div>
                <label>Job Types</label>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  {['full-time', 'part-time', 'contract', 'remote'].map(type => (
                    <label key={type} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <input 
                        type="checkbox"
                        checked={settings.jobTypes.includes(type)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSettings({...settings, jobTypes: [...settings.jobTypes, type]});
                          } else {
                            setSettings({...settings, jobTypes: settings.jobTypes.filter(t => t !== type)});
                          }
                        }}
                      />
                      {type}
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label>Salary Range</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                  <input 
                    type="number"
                    placeholder="Min salary"
                    value={settings.salaryRange.min}
                    onChange={(e) => setSettings({
                      ...settings, 
                      salaryRange: {...settings.salaryRange, min: parseInt(e.target.value)}
                    })}
                  />
                  <input 
                    type="number"
                    placeholder="Max salary"
                    value={settings.salaryRange.max}
                    onChange={(e) => setSettings({
                      ...settings, 
                      salaryRange: {...settings.salaryRange, max: parseInt(e.target.value)}
                    })}
                  />
                </div>
              </div>
              
              <button className="btn primary">Save Settings</button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div>
          <h3>Recent Applications</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {campaigns.map(campaign => (
              <div key={campaign.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <h5>{campaign.company}</h5>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {campaign.position}
                    </div>
                  </div>
                  <div style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    borderRadius: 'var(--radius)', 
                    background: campaign.status === 'sent' ? 'var(--success-bg)' : 
                               campaign.status === 'viewed' ? 'var(--warning-bg)' : 'var(--muted)',
                    color: campaign.status === 'sent' ? 'var(--success)' : 
                           campaign.status === 'viewed' ? 'var(--warning)' : 'var(--text-soft)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600
                  }}>
                    {campaign.status}
                  </div>
                </div>
                
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                  Sent: {campaign.sentAt}
                </div>
                
                {campaign.opened && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--success)', marginTop: 'var(--space-1)' }}>
                    ✓ Opened by recruiter
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}