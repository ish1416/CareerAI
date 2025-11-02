import React, { useState, useEffect } from 'react';
import { Target, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import api from '../utils/api.js';

export default function GoalNavigator() {
  const [goals, setGoals] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadGoals();
    loadProgress();
  }, []);

  const loadGoals = async () => {
    try {
      const { data } = await api.get('/goal-navigator/goals');
      setGoals(data.goals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  const loadProgress = async () => {
    try {
      const { data } = await api.get('/goal-navigator/progress');
      setProgress(data);
    } catch (error) {
      console.error('Failed to load progress:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Target size={32} color="var(--primary)" />
        <div>
          <h1>Career Goal Navigator</h1>
          <p style={{ color: 'var(--text-soft)' }}>Track and achieve your career milestones</p>
        </div>
      </div>

      {progress && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <Target size={20} color="var(--primary)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{progress.activeGoals}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Active Goals</div>
              </div>
            </div>
          </div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle size={20} color="var(--success)" />
              <div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{progress.completed}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Completed</div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3>Your Goals</h3>
        {goals.map(goal => (
          <div key={goal.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
              <h4>{goal.title}</h4>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{goal.progress}%</div>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{goal.description}</p>
            <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '8px' }}>
              <div style={{ background: 'var(--primary)', height: '100%', borderRadius: 'var(--radius)', width: `${goal.progress}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}