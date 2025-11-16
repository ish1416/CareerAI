import React, { useState } from 'react';
import { Target, CheckCircle, Clock, TrendingUp, Plus, Calendar, Award, Zap } from 'lucide-react';

export default function ProGoalNavigator() {
  const [activeTab, setActiveTab] = useState('goals');
  const [selectedGoal, setSelectedGoal] = useState(null);

  const tabs = [
    { id: 'goals', label: 'Active Goals', icon: Target },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'achievements', label: 'Achievements', icon: Award }
  ];

  const goals = [
    {
      id: 1,
      title: 'Land Senior Developer Role',
      description: 'Secure a senior software developer position at a top tech company',
      category: 'Career Advancement',
      progress: 75,
      targetDate: '2024-06-30',
      priority: 'high',
      milestones: [
        { id: 1, title: 'Update resume with recent projects', completed: true },
        { id: 2, title: 'Complete system design course', completed: true },
        { id: 3, title: 'Apply to 20 senior positions', completed: false, progress: 60 },
        { id: 4, title: 'Practice technical interviews', completed: false, progress: 30 }
      ]
    },
    {
      id: 2,
      title: 'Learn Machine Learning',
      description: 'Develop expertise in ML algorithms and frameworks',
      category: 'Skill Development',
      progress: 45,
      targetDate: '2024-08-15',
      priority: 'medium',
      milestones: [
        { id: 1, title: 'Complete Python for ML course', completed: true },
        { id: 2, title: 'Build 3 ML projects', completed: false, progress: 33 },
        { id: 3, title: 'Get ML certification', completed: false, progress: 0 }
      ]
    },
    {
      id: 3,
      title: 'Build Professional Network',
      description: 'Expand professional connections in the tech industry',
      category: 'Networking',
      progress: 60,
      targetDate: '2024-12-31',
      priority: 'medium',
      milestones: [
        { id: 1, title: 'Attend 5 tech meetups', completed: false, progress: 40 },
        { id: 2, title: 'Connect with 50 professionals', completed: false, progress: 70 },
        { id: 3, title: 'Speak at 1 conference', completed: false, progress: 20 }
      ]
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Resume Optimizer',
      description: 'Achieved 95+ ATS score on resume',
      earnedDate: '2024-02-15',
      category: 'Resume',
      badge: '🏆'
    },
    {
      id: 2,
      title: 'Interview Master',
      description: 'Completed 10+ mock interviews',
      earnedDate: '2024-03-01',
      category: 'Interview Prep',
      badge: '🎯'
    },
    {
      id: 3,
      title: 'Skill Builder',
      description: 'Added 5 new skills to profile',
      earnedDate: '2024-01-20',
      category: 'Skills',
      badge: '📚'
    }
  ];

  const renderGoals = () => (
    <div className="pro-goals-section">
      <div className="pro-goals-header">
        <h3>Career Goals</h3>
        <button className="pro-btn-primary">
          <Plus size={16} />
          Add Goal
        </button>
      </div>

      <div className="pro-goals-grid">
        {goals.map((goal) => (
          <div key={goal.id} className="pro-goal-card">
            <div className="pro-goal-header">
              <div className="pro-goal-info">
                <h4>{goal.title}</h4>
                <p className="pro-goal-description">{goal.description}</p>
                <span className="pro-goal-category">{goal.category}</span>
              </div>
              <div className={`pro-goal-priority ${goal.priority}`}>
                {goal.priority}
              </div>
            </div>

            <div className="pro-goal-progress">
              <div className="pro-progress-header">
                <span>Progress</span>
                <span className="pro-progress-percentage">{goal.progress}%</span>
              </div>
              <div className="pro-progress-bar">
                <div 
                  className="pro-progress-fill" 
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="pro-goal-milestones">
              <h5>Milestones</h5>
              <div className="pro-milestones-list">
                {goal.milestones.slice(0, 3).map((milestone) => (
                  <div key={milestone.id} className="pro-milestone-item">
                    <div className={`pro-milestone-status ${milestone.completed ? 'completed' : 'pending'}`}>
                      {milestone.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    <span className="pro-milestone-title">{milestone.title}</span>
                    {!milestone.completed && milestone.progress && (
                      <span className="pro-milestone-progress">{milestone.progress}%</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-goal-footer">
              <div className="pro-goal-deadline">
                <Calendar size={14} />
                <span>Target: {goal.targetDate}</span>
              </div>
              <button 
                className="pro-btn-ghost"
                onClick={() => setSelectedGoal(goal)}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="pro-progress-section">
      <div className="pro-progress-overview">
        <h3>Progress Overview</h3>
        <div className="pro-overview-stats">
          <div className="pro-stat-card">
            <div className="pro-stat-icon">
              <Target size={24} />
            </div>
            <div className="pro-stat-content">
              <div className="pro-stat-value">{goals.length}</div>
              <div className="pro-stat-label">Active Goals</div>
            </div>
          </div>

          <div className="pro-stat-card">
            <div className="pro-stat-icon">
              <TrendingUp size={24} />
            </div>
            <div className="pro-stat-content">
              <div className="pro-stat-value">
                {Math.round(goals.reduce((acc, goal) => acc + goal.progress, 0) / goals.length)}%
              </div>
              <div className="pro-stat-label">Avg Progress</div>
            </div>
          </div>

          <div className="pro-stat-card">
            <div className="pro-stat-icon">
              <CheckCircle size={24} />
            </div>
            <div className="pro-stat-content">
              <div className="pro-stat-value">{achievements.length}</div>
              <div className="pro-stat-label">Achievements</div>
            </div>
          </div>

          <div className="pro-stat-card">
            <div className="pro-stat-icon">
              <Zap size={24} />
            </div>
            <div className="pro-stat-content">
              <div className="pro-stat-value">87%</div>
              <div className="pro-stat-label">Success Rate</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-progress-timeline">
        <h4>Progress Timeline</h4>
        <div className="pro-timeline">
          {[
            { date: '2024-03-15', event: 'Completed System Design Course', type: 'milestone' },
            { date: '2024-03-10', event: 'Applied to 5 new positions', type: 'action' },
            { date: '2024-03-05', event: 'Updated resume with latest projects', type: 'milestone' },
            { date: '2024-03-01', event: 'Earned Interview Master badge', type: 'achievement' },
            { date: '2024-02-28', event: 'Started ML fundamentals course', type: 'action' }
          ].map((item, index) => (
            <div key={index} className="pro-timeline-item">
              <div className={`pro-timeline-dot ${item.type}`}></div>
              <div className="pro-timeline-content">
                <div className="pro-timeline-date">{item.date}</div>
                <div className="pro-timeline-event">{item.event}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pro-goal-insights">
        <h4>Insights & Recommendations</h4>
        <div className="pro-insights-grid">
          <div className="pro-insight-card">
            <TrendingUp size={24} />
            <div>
              <h5>On Track</h5>
              <p>You're making excellent progress on your senior developer goal. Keep up the momentum!</p>
            </div>
          </div>
          <div className="pro-insight-card">
            <Target size={24} />
            <div>
              <h5>Focus Area</h5>
              <p>Consider dedicating more time to ML projects to accelerate your learning goal.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="pro-achievements-section">
      <div className="pro-achievements-header">
        <h3>Career Achievements</h3>
        <p>Celebrate your career milestones and accomplishments</p>
      </div>

      <div className="pro-achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="pro-achievement-card">
            <div className="pro-achievement-badge">
              <span className="pro-badge-emoji">{achievement.badge}</span>
            </div>
            <div className="pro-achievement-info">
              <h4>{achievement.title}</h4>
              <p className="pro-achievement-description">{achievement.description}</p>
              <div className="pro-achievement-meta">
                <span className="pro-achievement-category">{achievement.category}</span>
                <span className="pro-achievement-date">Earned {achievement.earnedDate}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="pro-achievement-progress">
        <h4>Next Achievements</h4>
        <div className="pro-next-achievements">
          <div className="pro-next-achievement">
            <div className="pro-next-badge">🚀</div>
            <div className="pro-next-info">
              <h5>Job Hunter</h5>
              <p>Apply to 25 positions</p>
              <div className="pro-next-progress">
                <div className="pro-next-bar">
                  <div className="pro-next-fill" style={{ width: '60%' }}></div>
                </div>
                <span>15/25</span>
              </div>
            </div>
          </div>

          <div className="pro-next-achievement">
            <div className="pro-next-badge">🎓</div>
            <div className="pro-next-info">
              <h5>Certified Pro</h5>
              <p>Earn 3 professional certifications</p>
              <div className="pro-next-progress">
                <div className="pro-next-bar">
                  <div className="pro-next-fill" style={{ width: '33%' }}></div>
                </div>
                <span>1/3</span>
              </div>
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
            <Target size={32} />
          </div>
          <div>
            <h1 className="pro-title">Goal Navigator</h1>
            <p className="pro-subtitle">Track and achieve your career milestones</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Plus size={16} />
          New Goal
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
        {activeTab === 'goals' && renderGoals()}
        {activeTab === 'progress' && renderProgress()}
        {activeTab === 'achievements' && renderAchievements()}
      </div>
    </div>
  );
}