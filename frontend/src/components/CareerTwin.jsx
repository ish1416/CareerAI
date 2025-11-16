import React, { useState, useEffect } from 'react';
import { Bot, Play, Pause, Settings, MessageCircle, Briefcase, Calendar, Zap } from 'lucide-react';
import api from '../utils/api.js';
import BackButton from './BackButton.jsx';

export default function CareerTwin() {
  const [twin, setTwin] = useState(null);
  const [isActive, setIsActive] = useState(false);
  const [activities, setActivities] = useState([]);
  const [settings, setSettings] = useState({
    autoApply: true,
    autoRespond: false,
    interviewMode: 'screening-only'
  });

  useEffect(() => {
    loadTwinData();
    loadActivities();
  }, []);

  const loadTwinData = async () => {
    try {
      const { data } = await api.get('/career-twin/profile');
      setTwin(data);
      setIsActive(data.isActive);
    } catch (error) {
      console.error('Failed to load twin data:', error);
    }
  };

  const loadActivities = async () => {
    try {
      const { data } = await api.get('/career-twin/activities');
      setActivities(data.activities);
    } catch (error) {
      console.error('Failed to load activities:', error);
    }
  };

  const toggleTwin = async () => {
    try {
      const { data } = await api.post('/career-twin/toggle', { active: !isActive });
      setIsActive(data.isActive);
    } catch (error) {
      console.error('Failed to toggle twin:', error);
    }
  };

  const createTwin = async () => {
    try {
      const { data } = await api.post('/career-twin/create');
      setTwin(data);
    } catch (error) {
      console.error('Failed to create twin:', error);
    }
  };

  if (!twin) {
    return (
      <div className="main-content">
        <BackButton />
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Bot size={64} color="var(--primary)" style={{ margin: '0 auto var(--space-4)' }} />
          <h1>Career Twin</h1>
          <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-6)' }}>
            Create an AI digital clone that represents you in the job market
          </p>
          <button className="btn primary large" onClick={createTwin}>
            Create My Career Twin
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <BackButton />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'left' }}>
          <Bot size={32} color="var(--primary)" />
          <div>
            <h1 style={{ textAlign: 'left' }}>Career Twin</h1>
            <p style={{ color: 'var(--text-soft)', textAlign: 'left' }}>AI Digital Clone - {twin.name}</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          <div style={{ 
            padding: 'var(--space-2) var(--space-3)', 
            borderRadius: 'var(--radius)', 
            background: isActive ? 'var(--success-bg)' : 'var(--error-bg)',
            color: isActive ? 'var(--success)' : 'var(--error)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600
          }}>
            {isActive ? 'Active' : 'Inactive'}
          </div>
          <button 
            className={`btn ${isActive ? 'secondary' : 'primary'}`}
            onClick={toggleTwin}
          >
            {isActive ? <Pause size={16} /> : <Play size={16} />}
            {isActive ? 'Pause Twin' : 'Activate Twin'}
          </button>
        </div>
      </div>

      {/* Twin Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{twin.stats.applications}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Auto Applications</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <MessageCircle size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{twin.stats.responses}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Auto Responses</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Calendar size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{twin.stats.interviews}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Interviews Scheduled</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Zap size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{twin.stats.efficiency}%</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Efficiency Score</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recent Activities */}
        <div>
          <h3>Recent Twin Activities</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {activities.map((activity, idx) => (
              <div key={idx} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: activity.type === 'application' ? 'var(--primary)' : 
                               activity.type === 'response' ? 'var(--success)' : 'var(--warning)',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activity.type === 'application' ? <Briefcase size={18} /> :
                     activity.type === 'response' ? <MessageCircle size={18} /> : <Calendar size={18} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{activity.title}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{activity.description}</div>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    {activity.time}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Twin Settings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3>Twin Settings</h3>
            <Settings size={20} color="var(--text-soft)" />
          </div>
          
          <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.autoApply}
                    onChange={(e) => setSettings({...settings, autoApply: e.target.checked})}
                  />
                  Auto Apply to Jobs
                </label>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginTop: 'var(--space-1)' }}>
                  Automatically apply to matching job opportunities
                </div>
              </div>
              
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input 
                    type="checkbox" 
                    checked={settings.autoRespond}
                    onChange={(e) => setSettings({...settings, autoRespond: e.target.checked})}
                  />
                  Auto Respond to Recruiters
                </label>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginTop: 'var(--space-1)' }}>
                  Send automated responses to recruiter messages
                </div>
              </div>
              
              <div>
                <label>Interview Mode</label>
                <select 
                  value={settings.interviewMode}
                  onChange={(e) => setSettings({...settings, interviewMode: e.target.value})}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  <option value="screening-only">Screening Only</option>
                  <option value="preliminary">Preliminary Interviews</option>
                  <option value="full-automation">Full Automation</option>
                </select>
              </div>
              
              <button className="btn primary">Save Settings</button>
            </div>
          </div>

          {/* Twin Personality */}
          <div style={{ marginTop: 'var(--space-4)' }}>
            <h4>Twin Personality</h4>
            <div className="card">
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>
                Communication Style: {twin.personality.style}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>
                Response Tone: {twin.personality.tone}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                Confidence Level: {twin.personality.confidence}
              </div>
              <button className="btn ghost small" style={{ marginTop: 'var(--space-3)' }}>
                Customize Personality
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}