import React, { useState } from 'react';
import { BookOpen, Trophy, Target, Clock, Star, Play, CheckCircle, TrendingUp, Award, Zap, ArrowRight } from 'lucide-react';

export default function ProLearning() {
  const [activeSection, setActiveSection] = useState('overview');

  const stats = [
    { label: 'Learning Hours', value: '24h', icon: Clock, color: 'var(--primary)' },
    { label: 'Courses Completed', value: '8', icon: CheckCircle, color: 'var(--success)' },
    { label: 'Skill Level', value: 'Level 5', icon: TrendingUp, color: 'var(--warning)' },
    { label: 'Badges Earned', value: '12', icon: Trophy, color: 'var(--error)' }
  ];

  const courses = [
    { title: 'Advanced React Patterns', provider: 'Tech Academy', progress: 75, duration: '8h', level: 'Advanced' },
    { title: 'Node.js Masterclass', provider: 'Code School', progress: 45, duration: '12h', level: 'Intermediate' },
    { title: 'AWS Cloud Practitioner', provider: 'AWS Training', progress: 20, duration: '15h', level: 'Beginner' }
  ];

  const skillTests = [
    { title: 'JavaScript Fundamentals', questions: 25, duration: 30, difficulty: 'Intermediate', score: 85 },
    { title: 'React Components', questions: 20, duration: 25, difficulty: 'Advanced', score: null },
    { title: 'CSS Grid & Flexbox', questions: 15, duration: 20, difficulty: 'Beginner', score: 92 }
  ];

  const learningPaths = [
    { 
      title: 'Full Stack Developer', 
      description: 'Complete path from frontend to backend development',
      progress: 60, 
      modules: 12, 
      duration: '6 months',
      difficulty: 'Intermediate'
    },
    { 
      title: 'DevOps Engineer', 
      description: 'Learn CI/CD, containerization, and cloud deployment',
      progress: 25, 
      modules: 8, 
      duration: '4 months',
      difficulty: 'Advanced'
    }
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Learning & Development
        </h1>
        <p className="text-secondary">
          Advance your skills with personalized learning paths and skill assessments.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: stat.color,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ marginBottom: 'var(--space-1)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'courses', label: 'Courses' },
          { id: 'tests', label: 'Skill Tests' },
          { id: 'paths', label: 'Learning Paths' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'transparent',
              color: activeSection === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeSection === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeSection === tab.id ? 600 : 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Section */}
      {activeSection === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
          {/* Current Courses */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
              <h2 className="text-xl font-semibold">Continue Learning</h2>
              <button className="btn">View All Courses</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {courses.slice(0, 3).map((course, index) => (
                <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                    <div>
                      <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                        {course.title}
                      </h3>
                      <p className="text-sm text-secondary">{course.provider}</p>
                    </div>
                    <span
                      style={{
                        padding: 'var(--space-1) var(--space-3)',
                        background: course.level === 'Advanced' ? 'var(--error)' : 
                                   course.level === 'Intermediate' ? 'var(--warning)' : 'var(--success)',
                        color: 'white',
                        borderRadius: 'var(--radius)',
                        fontSize: 'var(--text-xs)',
                        fontWeight: 600
                      }}
                    >
                      {course.level}
                    </span>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{course.progress}%</span>
                    </div>
                    <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                      <div
                        style={{
                          width: `${course.progress}%`,
                          height: '100%',
                          background: 'var(--primary)',
                          borderRadius: 3
                        }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="text-sm text-secondary">{course.duration} remaining</span>
                    <button className="btn btn-primary btn-sm">
                      <Play size={14} />
                      Continue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements & Recommendations */}
          <div>
            {/* Recent Achievements */}
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                Recent Achievements
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {[
                  { title: 'JavaScript Expert', date: '2 days ago', type: 'skill' },
                  { title: 'Course Completed', date: '1 week ago', type: 'course' },
                  { title: '7-Day Streak', date: '3 days ago', type: 'streak' }
                ].map((achievement, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: 'var(--warning)',
                        borderRadius: 'var(--radius)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Trophy size={20} color="white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">{achievement.title}</div>
                      <div className="text-xs text-muted">{achievement.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Skills */}
            <div>
              <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                Recommended Skills
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['TypeScript', 'Docker', 'GraphQL'].map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 'var(--space-3)',
                      background: 'var(--gray-50)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--border)'
                    }}
                  >
                    <span className="text-sm font-medium">{skill}</span>
                    <button className="btn btn-sm">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Tests Section */}
      {activeSection === 'tests' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2 className="text-xl font-semibold">Skill Assessments</h2>
            <button className="btn btn-primary">
              <Target size={16} />
              Take Assessment
            </button>
          </div>

          <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
            {skillTests.map((test, index) => (
              <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
                    {test.title}
                  </h3>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-3)' }}>
                    <span className="text-sm text-secondary">{test.questions} questions</span>
                    <span className="text-sm text-secondary">{test.duration} min</span>
                  </div>
                  <span
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      background: test.difficulty === 'Advanced' ? 'var(--error)' : 
                                 test.difficulty === 'Intermediate' ? 'var(--warning)' : 'var(--success)',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600
                    }}
                  >
                    {test.difficulty}
                  </span>
                </div>

                {test.score ? (
                  <div style={{ marginBottom: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <CheckCircle size={16} style={{ color: 'var(--success)' }} />
                      <span className="text-sm font-medium">Completed</span>
                    </div>
                    <div className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                      {test.score}%
                    </div>
                  </div>
                ) : (
                  <button className="btn btn-primary" style={{ width: '100%' }}>
                    <Play size={16} />
                    Start Test
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths Section */}
      {activeSection === 'paths' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2 className="text-xl font-semibold">Learning Paths</h2>
            <button className="btn">Explore All Paths</button>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
            {learningPaths.map((path, index) => (
              <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div>
                    <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
                      {path.title}
                    </h3>
                    <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
                      {path.description}
                    </p>
                  </div>
                  <span
                    style={{
                      padding: 'var(--space-1) var(--space-2)',
                      background: path.difficulty === 'Advanced' ? 'var(--error)' : 'var(--warning)',
                      color: 'white',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: 'var(--text-xs)',
                      fontWeight: 600
                    }}
                  >
                    {path.difficulty}
                  </span>
                </div>

                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span className="text-sm">Progress</span>
                    <span className="text-sm font-medium">{path.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                    <div
                      style={{
                        width: `${path.progress}%`,
                        height: '100%',
                        background: 'var(--primary)',
                        borderRadius: 3
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <div>
                      <div className="text-xs text-muted">Duration</div>
                      <div className="text-sm font-medium">{path.duration}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted">Modules</div>
                      <div className="text-sm font-medium">{path.modules}</div>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" style={{ width: '100%' }}>
                  {path.progress > 0 ? 'Continue Path' : 'Start Path'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}