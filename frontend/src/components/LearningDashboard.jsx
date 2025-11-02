import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Target, Clock, Star, Play, CheckCircle, TrendingUp, Award, Users, Zap } from 'lucide-react';
import api from '../utils/api.js';

export default function LearningDashboard() {
  const [progress, setProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [paths, setPaths] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Set default data first to prevent infinite loading
      setProgress({ totalHours: 0, level: 1, xp: 0, streak: 0, badges: [] });
      setTests([]);
      setPaths([]);
      
      const [progressRes, testsRes, pathsRes] = await Promise.all([
        api.get('/learning/progress').catch(() => ({ data: { totalHours: 0, level: 1, xp: 0, streak: 0, badges: [] } })),
        api.get('/learning/tests').catch(() => ({ data: { tests: [] } })),
        api.get('/learning/paths').catch(() => ({ data: { paths: [] } }))
      ]);
      
      setProgress(progressRes.data || { totalHours: 0, level: 1, xp: 0, streak: 0, badges: [] });
      setTests(testsRes.data.tests || testsRes.data || []);
      setPaths(pathsRes.data.paths || pathsRes.data || []);
    } catch (error) {
      console.error('Failed to load learning data:', error);
      // Ensure we always have data to prevent infinite loading
      setProgress({ totalHours: 0, level: 1, xp: 0, streak: 0, badges: [] });
      setTests([]);
      setPaths([]);
    }
  };

  const recommendCourses = async () => {
    try {
      const { data } = await api.post('/learning/courses/recommend', {
        skills: 'JavaScript, React',
        careerGoal: 'Frontend Developer',
        experience: 'Beginner'
      });
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setCourses([]);
    }
  };

  const updateProgress = async (courseId, progress, completed = false) => {
    try {
      await api.put(`/learning/courses/${courseId}/progress`, { progress, completed });
      loadData();
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const startTest = async (testId) => {
    try {
      const { data } = await api.post(`/learning/tests/${testId}/start`);
      return data;
    } catch (error) {
      console.error('Failed to start test:', error);
    }
  };

  if (!progress) {
    return (
      <div style={{ padding: 'var(--space-6)' }}>
        <h1>Learning & Skill Development</h1>
        <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
          <div>Loading your learning progress...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>Learning & Skill Development</h1>
      
      {/* Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Clock size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{progress.totalHours}h</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Learning Time</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Trophy size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{progress.badges.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Badges Earned</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Target size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{progress.streak}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Day Streak</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Star size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>Level {progress.level}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{progress.xp} XP</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['overview', 'courses', 'tests', 'paths'].map(tab => (
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

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
          <div>
            <h3>Learning Paths</h3>
            {paths.map(path => (
              <div key={path.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                <h4>{path.title}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>{path.description}</p>
                <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '8px', marginBottom: 'var(--space-2)' }}>
                  <div style={{ background: 'var(--primary)', height: '100%', borderRadius: 'var(--radius)', width: `${path.progress}%` }} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{path.progress}% complete • {path.duration}</div>
              </div>
            ))}
          </div>
          
          <div>
            <h3>Badges</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {progress.badges.map((badge, idx) => (
                <div key={idx} className="card" style={{ padding: 'var(--space-2)', textAlign: 'center', minWidth: '80px' }}>
                  <Trophy size={24} color="var(--warning)" style={{ margin: '0 auto var(--space-1)' }} />
                  <div style={{ fontSize: 'var(--text-xs)' }}>{badge}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'courses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Recommended Courses</h3>
            <button className="btn primary" onClick={recommendCourses}>
              <BookOpen size={16} />
              Get Recommendations
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {courses.map((course, idx) => (
              <div key={idx} className="card">
                <h4>{course.title}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>{course.provider}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{course.duration}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{course.level}</span>
                </div>
                <button className="btn ghost small">
                  <Play size={14} />
                  Start Course
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div>
          <h3>Skill Tests & Quizzes</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {tests.map(test => (
              <div key={test.id} className="card">
                <h4>{test.title}</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{test.questions} questions</span>
                  <span style={{ fontSize: 'var(--text-sm)' }}>{test.duration} min</span>
                </div>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <span style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    borderRadius: 'var(--radius)', 
                    fontSize: 'var(--text-xs)',
                    background: test.difficulty === 'Easy' ? 'var(--success-light)' : 
                               test.difficulty === 'Medium' ? 'var(--warning-light)' : 'var(--error-light)',
                    color: test.difficulty === 'Easy' ? 'var(--success)' : 
                           test.difficulty === 'Medium' ? 'var(--warning)' : 'var(--error)'
                  }}>
                    {test.difficulty}
                  </span>
                </div>
                <button className="btn primary small">
                  <Play size={14} />
                  Start Test
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'paths' && (
        <div>
          <h3>Learning Paths</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
            {paths.map(path => (
              <div key={path.id} className="card" style={{ padding: 'var(--space-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>{path.title}</h4>
                  <span style={{
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    background: path.difficulty === 'Beginner' ? 'var(--success-bg)' : 
                               path.difficulty === 'Intermediate' ? 'var(--warning-bg)' : 'var(--error-bg)',
                    color: path.difficulty === 'Beginner' ? 'var(--success)' : 
                           path.difficulty === 'Intermediate' ? 'var(--warning)' : 'var(--error)'
                  }}>
                    {path.difficulty}
                  </span>
                </div>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>{path.description}</p>
                
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Progress</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{path.progress}%</span>
                  </div>
                  <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '8px' }}>
                    <div style={{ 
                      background: 'var(--gradient-primary)', 
                      height: '100%', 
                      borderRadius: 'var(--radius)', 
                      width: `${path.progress}%`,
                      transition: 'width 0.3s ease'
                    }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Duration</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{path.duration}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>Modules</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>{path.modules || 0}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <Star size={14} color="var(--warning)" />
                    <span style={{ fontSize: 'var(--text-sm)' }}>{path.rating || 4.5}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn primary" style={{ flex: 1 }}>
                    {path.progress > 0 ? 'Continue' : 'Start Path'}
                  </button>
                  <button className="btn ghost">
                    <BookOpen size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {paths.length === 0 && (
            <div className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
              <Target size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-3)' }} />
              <h4>No Learning Paths Yet</h4>
              <p className="muted">Discover structured learning paths to advance your career</p>
              <button className="btn primary" style={{ marginTop: 'var(--space-3)' }}>
                Explore Paths
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}