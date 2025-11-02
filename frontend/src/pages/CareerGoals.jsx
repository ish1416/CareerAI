import React, { useState, useEffect } from 'react';
import { Target, Plus, TrendingUp, Calendar, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../components/Toast.jsx';
import api from '../utils/api.js';

export default function CareerGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const { showToast } = useToast();

  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    targetDate: '',
    category: 'skill',
    priority: 'medium'
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const { data } = await api.get('/ai/goals');
      setGoals(data.goals || []);
    } catch (error) {
      showToast('Failed to load career goals', 'error');
    } finally {
      setLoading(false);
    }
  };

  const addGoal = async () => {
    if (!newGoal.title.trim()) {
      showToast('Goal title is required', 'error');
      return;
    }

    try {
      const { data } = await api.post('/ai/goals', newGoal);
      setGoals(prev => [...prev, data.goal]);
      setNewGoal({ title: '', description: '', targetDate: '', category: 'skill', priority: 'medium' });
      setShowAddForm(false);
      showToast('Goal added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add goal', 'error');
    }
  };

  const updateGoalProgress = async (goalId, progress) => {
    try {
      await api.patch(`/ai/goals/${goalId}`, { progress });
      setGoals(prev => prev.map(goal => 
        goal.id === goalId ? { ...goal, progress } : goal
      ));
      showToast('Progress updated!', 'success');
    } catch (error) {
      showToast('Failed to update progress', 'error');
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'var(--success)';
    if (progress >= 50) return 'var(--warning)';
    return 'var(--primary)';
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'skill': return '🎯';
      case 'job': return '💼';
      case 'education': return '🎓';
      case 'network': return '🤝';
      default: return '📈';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <div className="skeleton card" style={{ height: '200px' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 'var(--space-6)'
      }}>
        <div>
          <h1 style={{ fontSize: 'var(--text-4xl)', margin: '0 0 var(--space-2)', fontWeight: 800 }}>
            Career Goals 🎯
          </h1>
          <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-lg)', margin: 0 }}>
            Set, track, and achieve your career objectives with AI guidance
          </p>
        </div>
        <button 
          className="btn primary"
          onClick={() => setShowAddForm(true)}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      {/* Add Goal Form */}
      {showAddForm && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)' }}>Add New Goal</h3>
          
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            <div>
              <label>Goal Title</label>
              <input
                value={newGoal.title}
                onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Learn React.js"
              />
            </div>
            
            <div>
              <label>Description</label>
              <textarea
                rows={3}
                value={newGoal.description}
                onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your goal and why it's important..."
              />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-3)' }}>
              <div>
                <label>Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value }))}
                >
                  <option value="skill">Skill Development</option>
                  <option value="job">Job Search</option>
                  <option value="education">Education</option>
                  <option value="network">Networking</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label>Priority</label>
                <select
                  value={newGoal.priority}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, priority: e.target.value }))}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              
              <div>
                <label>Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button className="btn primary" onClick={addGoal}>
                Add Goal
              </button>
              <button className="btn ghost" onClick={() => setShowAddForm(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-subtle)'
        }}>
          <Target size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-3)' }} />
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)' }}>
            No career goals yet
          </h3>
          <p style={{ margin: '0 0 var(--space-4)', color: 'var(--text-soft)' }}>
            Set your first career goal to start tracking your professional growth
          </p>
          <button 
            className="btn primary"
            onClick={() => setShowAddForm(true)}
          >
            <Plus size={16} />
            Add Your First Goal
          </button>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: 'var(--space-4)'
        }}>
          {goals.map(goal => (
            <GoalCard 
              key={goal.id} 
              goal={goal} 
              onUpdateProgress={updateGoalProgress}
              getCategoryIcon={getCategoryIcon}
              getProgressColor={getProgressColor}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function GoalCard({ goal, onUpdateProgress, getCategoryIcon, getProgressColor }) {
  const [showDetails, setShowDetails] = useState(false);
  
  const daysUntilTarget = goal.targetDate ? 
    Math.ceil((new Date(goal.targetDate) - new Date()) / (1000 * 60 * 60 * 24)) : null;
  
  const isOverdue = daysUntilTarget !== null && daysUntilTarget < 0;
  const isCompleted = goal.progress >= 100;

  return (
    <div className="card interactive" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <span style={{ fontSize: 'var(--text-lg)' }}>{getCategoryIcon(goal.category)}</span>
          <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>
            {goal.title}
          </h3>
        </div>
        
        <div style={{
          background: goal.priority === 'high' ? 'var(--error-bg)' : 
                     goal.priority === 'medium' ? 'var(--warning-bg)' : 'var(--info-bg)',
          color: goal.priority === 'high' ? 'var(--error)' : 
                 goal.priority === 'medium' ? 'var(--warning)' : 'var(--info)',
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
          fontWeight: 600,
          textTransform: 'uppercase'
        }}>
          {goal.priority}
        </div>
      </div>

      {goal.description && (
        <p style={{ 
          margin: '0 0 var(--space-3)', 
          color: 'var(--text-soft)', 
          fontSize: 'var(--text-sm)',
          lineHeight: 1.5
        }}>
          {goal.description}
        </p>
      )}

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-1)'
        }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Progress</span>
          <span style={{ fontSize: 'var(--text-sm)', color: getProgressColor(goal.progress) }}>
            {goal.progress}%
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--muted)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${goal.progress}%`,
            height: '100%',
            background: getProgressColor(goal.progress),
            transition: 'width var(--transition-base)'
          }} />
        </div>
      </div>

      {/* Target Date */}
      {goal.targetDate && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--space-2)',
          marginBottom: 'var(--space-3)',
          fontSize: 'var(--text-sm)',
          color: isOverdue ? 'var(--error)' : 'var(--text-soft)'
        }}>
          <Calendar size={14} />
          <span>
            {isOverdue ? `Overdue by ${Math.abs(daysUntilTarget)} days` :
             daysUntilTarget === 0 ? 'Due today' :
             daysUntilTarget > 0 ? `${daysUntilTarget} days remaining` :
             'No deadline set'}
          </span>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {!isCompleted && (
          <>
            <button 
              className="btn small primary"
              onClick={() => onUpdateProgress(goal.id, Math.min(100, goal.progress + 25))}
            >
              +25%
            </button>
            <button 
              className="btn small secondary"
              onClick={() => onUpdateProgress(goal.id, Math.min(100, goal.progress + 10))}
            >
              +10%
            </button>
          </>
        )}
        {isCompleted && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-1)',
            color: 'var(--success)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600
          }}>
            <CheckCircle size={16} />
            Completed!
          </div>
        )}
      </div>
    </div>
  );
}