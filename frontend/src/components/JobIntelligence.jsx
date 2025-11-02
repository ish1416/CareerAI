import React, { useState, useEffect } from 'react';
import { BarChart, TrendingUp, AlertCircle, Building } from 'lucide-react';
import api from '../utils/api.js';

export default function JobIntelligence() {
  const [feed, setFeed] = useState([]);
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    loadFeed();
    loadTrends();
  }, []);

  const loadFeed = async () => {
    try {
      const { data } = await api.get('/job-intelligence/feed');
      setFeed(data.feed);
    } catch (error) {
      console.error('Failed to load feed:', error);
    }
  };

  const loadTrends = async () => {
    try {
      const { data } = await api.get('/job-intelligence/trends');
      setTrends(data.trends);
    } catch (error) {
      console.error('Failed to load trends:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <BarChart size={32} color="var(--primary)" />
        <div>
          <h1>Live Job Intelligence Feed</h1>
          <p style={{ color: 'var(--text-soft)' }}>Real-time job market insights and trends</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        <div>
          <h3>Market Intelligence</h3>
          {feed.map(item => (
            <div key={item.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <Building size={20} color="var(--primary)" />
                <h4>{item.title}</h4>
              </div>
              <p style={{ color: 'var(--text-soft)' }}>{item.description}</p>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', marginTop: 'var(--space-2)' }}>
                {item.timestamp}
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3>Trending Skills</h3>
          {trends.map(trend => (
            <div key={trend.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{trend.skill}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                  <TrendingUp size={16} color="var(--success)" />
                  <span style={{ color: 'var(--success)' }}>+{trend.growth}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}