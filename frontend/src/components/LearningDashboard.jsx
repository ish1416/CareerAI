import React, { useState, useEffect } from 'react';
import { BookOpen, Trophy, Target, Clock, Star, Play, CheckCircle, TrendingUp, Award, Users, Zap } from 'lucide-react';
import api from '../utils/api.js';

export default function LearningDashboard() {
  const [progress, setProgress] = useState(null);
  const [courses, setCourses] = useState([]);
  const [tests, setTests] = useState([]);
  const [paths, setPaths] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      
      const [dashboardRes, coursesRes, testsRes, pathsRes] = await Promise.all([
        api.get('/learning/dashboard').catch(() => ({ data: { overview: { totalHours: 0, level: 1, xp: 0, streak: 0 }, achievements: [] } })),
        api.get('/learning/courses').catch(() => ({ data: { courses: [] } })),
        api.get('/learning/tests').catch(() => ({ data: { tests: [] } })),
        api.get('/learning/paths').catch(() => ({ data: { paths: [] } }))
      ]);
      
      const dashboardData = dashboardRes.data;
      setProgress({
        totalHours: dashboardData.overview?.hoursLearned || 0,
        level: dashboardData.overview?.level || 1,
        xp: dashboardData.overview?.xp || 0,
        streak: dashboardData.overview?.currentStreak || 0,
        badges: dashboardData.achievements || []
      });
      
      setCourses(coursesRes.data.courses || []);
      setTests(testsRes.data.tests || []);
      setPaths(pathsRes.data.paths || []);
    } catch (error) {
      console.error('Failed to load learning data:', error);
      setProgress({ totalHours: 0, level: 1, xp: 0, streak: 0, badges: [] });
      setCourses([]);
      setTests([]);
      setPaths([]);
    } finally {
      setLoading(false);
    }
  };

  const recommendCourses = async () => {
    try {
      setLoading(true);
      const { data } = await api.post('/learning/courses/recommend', {
        skills: ['JavaScript', 'React', 'Node.js'],
        careerGoal: 'Frontend Developer',
        experience: 'Beginner'
      });
      setCourses(data.courses || []);
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      setCourses([]);
    } finally {
      setLoading(false);
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
            {loading ? (
              <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                <div>Loading courses...</div>
              </div>
            ) : courses.length > 0 ? (
              courses.map((course, idx) => (
                <div key={idx} className="card">
                  {course.imageUrl && (
                    <img src={course.imageUrl} alt={course.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: 'var(--radius)', marginBottom: 'var(--space-2)' }} />
                  )}
                  <h4>{course.title}</h4>
                  <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>{course.instructor} • {course.provider}</p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)' }}>{course.duration}</span>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>{course.level}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Star size={14} color="var(--warning)" />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{course.rating}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Users size={14} color="var(--text-soft)" />
                      <span style={{ fontSize: 'var(--text-sm)' }}>{course.students}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--success)' }}>{course.price}</span>
                      {course.originalPrice && course.originalPrice !== course.price && (
                        <span style={{ fontSize: 'var(--text-sm)', textDecoration: 'line-through', color: 'var(--text-soft)', marginLeft: 'var(--space-1)' }}>{course.originalPrice}</span>
                      )}
                    </div>
                    <button className="btn primary small" onClick={() => window.open(course.url, '_blank')}>
                      <Play size={14} />
                      Start Course
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
                <BookOpen size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-3)' }} />
                <h4>No Courses Found</h4>
                <p className="muted">Click "Get Recommendations" to discover courses</p>
              </div>
            )}
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
              <div key={path.id} className="card">
                <h4>{path.title}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{path.description}</p>
                <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '8px', marginBottom: 'var(--space-2)' }}>
                  <div style={{ background: 'var(--primary)', height: '100%', borderRadius: 'var(--radius)', width: `${path.progress}%` }} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{path.progress}% complete • {path.duration}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}