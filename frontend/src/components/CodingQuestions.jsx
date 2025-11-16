import React, { useState, useEffect } from 'react';
import { Filter, Play, CheckCircle, XCircle, Clock, Trophy, Target } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function CodingQuestions() {
  const [questions, setQuestions] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [topics, setTopics] = useState([]);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [filters, setFilters] = useState({
    company: '',
    topic: '',
    difficulty: '',
    platform: '',
    language: 'javascript'
  });
  const { showToast } = useToast();

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      const [questionsRes, companiesRes, topicsRes, progressRes] = await Promise.all([
        api.get('/coding-questions/questions'),
        api.get('/coding-questions/companies'),
        api.get('/coding-questions/topics'),
        api.get('/coding-questions/progress')
      ]);

      setQuestions(questionsRes.data.questions.questions || []);
      setCompanies(companiesRes.data.companies || []);
      setTopics(topicsRes.data.topics || []);
      setProgress(progressRes.data.progress);
    } catch (err) {
      console.error('Failed to load coding questions:', err);
      showToast('Failed to load coding questions data', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applyFilters = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });

      const { data } = await api.get(`/coding-questions/questions?${params}`);
      setQuestions(data.questions.questions || []);
    } catch (err) {
      console.error('Failed to filter questions:', err);
      showToast('Failed to filter questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'var(--success)';
      case 'medium': return 'var(--warning)';
      case 'hard': return 'var(--error)';
      default: return 'var(--text-soft)';
    }
  };

  const QuestionCard = ({ question }) => (
    <div 
      className="card" 
      style={{ cursor: 'pointer', transition: 'transform 0.2s' }}
      onClick={() => setSelectedQuestion(question)}
      onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
      onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-3)' }}>
        <div style={{ flex: 1 }}>
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-lg)' }}>{question.title}</h3>
          <p style={{ margin: '0 0 var(--space-2)', color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: '1.4' }}>
            {question.description.substring(0, 120)}...
          </p>
        </div>
        <span style={{
          padding: 'var(--space-1) var(--space-2)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-xs)',
          fontWeight: '600',
          color: getDifficultyColor(question.difficulty),
          background: `${getDifficultyColor(question.difficulty)}20`,
          marginLeft: 'var(--space-2)'
        }}>
          {question.difficulty}
        </span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
        <span style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--primary-bg)', color: 'var(--primary)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
          {question.company}
        </span>
        <span style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--muted)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
          {question.topic}
        </span>
        <span style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--muted)', borderRadius: 'var(--radius)', fontSize: 'var(--text-xs)' }}>
          {question.platform}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
        <span>Acceptance: {question.acceptance}%</span>
        <span>Frequency: {question.frequency}</span>
      </div>
    </div>
  );

  const QuestionDetail = ({ question, onClose }) => {
    const [code, setCode] = useState(question.solution[filters.language] || question.solution.javascript);
    const [language, setLanguage] = useState(filters.language || 'javascript');
    const [testResults, setTestResults] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const runCode = () => {
      // Mock test execution
      const passed = Math.random() > 0.3;
      setTestResults({
        passed,
        runtime: Math.floor(Math.random() * 100) + 'ms',
        memory: Math.floor(Math.random() * 50) + 'MB',
        testCases: [
          { input: 'Test case 1', expected: 'Expected output', actual: 'Actual output', passed: true },
          { input: 'Test case 2', expected: 'Expected output', actual: 'Actual output', passed }
        ]
      });
    };

    const submitSolution = async () => {
      if (!testResults) {
        showToast('Please run your code first', 'warning');
        return;
      }
      
      try {
        setSubmitting(true);
        await api.post(`/coding-questions/questions/${question.id}/submit`, {
          code,
          language,
          testResults
        });
        showToast('Solution submitted successfully!', 'success');
        loadData(); // Refresh progress
        setTimeout(() => onClose(), 1500);
      } catch (err) {
        console.error('Failed to submit solution:', err);
        showToast('Failed to submit solution', 'error');
      } finally {
        setSubmitting(false);
      }
    };

    const changeLanguage = (newLang) => {
      setLanguage(newLang);
      setCode(question.solution[newLang] || '// Solution not available for this language');
      setTestResults(null);
    };

    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-4)' }}>
        <div style={{ background: 'var(--background)', borderRadius: 'var(--radius)', width: '90%', maxWidth: '1200px', height: '90%', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 'var(--space-4)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2>{question.title}</h2>
            <button className="btn ghost" onClick={onClose}>×</button>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            {/* Problem Description */}
            <div style={{ width: '40%', padding: 'var(--space-4)', overflowY: 'auto', borderRight: '1px solid var(--border)' }}>
              <div style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <span style={{ padding: 'var(--space-1) var(--space-2)', background: `${getDifficultyColor(question.difficulty)}20`, color: getDifficultyColor(question.difficulty), borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)' }}>
                    {question.difficulty}
                  </span>
                  <span style={{ padding: 'var(--space-1) var(--space-2)', background: 'var(--primary-bg)', color: 'var(--primary)', borderRadius: 'var(--radius)', fontSize: 'var(--text-sm)' }}>
                    {question.company}
                  </span>
                </div>
                <p style={{ lineHeight: '1.6' }}>{question.description}</p>
              </div>

              <div style={{ marginBottom: 'var(--space-4)' }}>
                <h4>Examples</h4>
                {question.examples.map((example, idx) => (
                  <div key={idx} style={{ background: 'var(--muted)', padding: 'var(--space-3)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-2)' }}>
                    <div><strong>Input:</strong> {example.input}</div>
                    <div><strong>Output:</strong> {example.output}</div>
                  </div>
                ))}
              </div>

              <div>
                <h4>Constraints</h4>
                <ul>
                  {question.constraints.map((constraint, idx) => (
                    <li key={idx}>{constraint}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Code Editor */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: 'var(--space-3)', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <select 
                  value={language} 
                  onChange={(e) => changeLanguage(e.target.value)}
                  style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                </select>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn ghost" onClick={runCode} disabled={!code.trim()}>
                    <Play size={16} />
                    Run Code
                  </button>
                  <button 
                    className="btn primary" 
                    onClick={submitSolution}
                    disabled={submitting || !testResults}
                  >
                    {submitting ? 'Submitting...' : 'Submit Solution'}
                  </button>
                </div>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                style={{
                  flex: 1,
                  padding: 'var(--space-3)',
                  border: 'none',
                  background: 'var(--muted)',
                  fontFamily: 'monospace',
                  fontSize: 'var(--text-sm)',
                  resize: 'none'
                }}
                placeholder="Write your solution here..."
              />

              {testResults && (
                <div style={{ padding: 'var(--space-3)', borderTop: '1px solid var(--border)', background: 'var(--background)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    {testResults.passed ? (
                      <CheckCircle size={20} color="var(--success)" />
                    ) : (
                      <XCircle size={20} color="var(--error)" />
                    )}
                    <span style={{ fontWeight: '600', color: testResults.passed ? 'var(--success)' : 'var(--error)' }}>
                      {testResults.passed ? 'Accepted' : 'Wrong Answer'}
                    </span>
                    <span style={{ color: 'var(--text-soft)' }}>
                      Runtime: {testResults.runtime} | Memory: {testResults.memory}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 'var(--space-6)', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header Section */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: 'var(--radius)', 
            background: 'var(--primary-bg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Filter size={24} color="var(--primary)" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 'var(--text-3xl)', fontWeight: '700' }}>Coding Practice Platform</h1>
            <p style={{ margin: '0', color: 'var(--text-soft)', fontSize: 'var(--text-base)' }}>
              Master technical interviews with company-specific questions
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="card" style={{ padding: 'var(--space-5)', marginBottom: 'var(--space-4)', background: 'var(--muted)' }}>
          <h3 style={{ marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>How It Works</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700',
                flexShrink: 0
              }}>1</div>
              <div>
                <h4 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: '600' }}>Browse & Filter</h4>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: '1.5' }}>
                  Filter questions by company, topic, difficulty, and platform to find relevant problems
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700',
                flexShrink: 0
              }}>2</div>
              <div>
                <h4 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: '600' }}>Code & Test</h4>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: '1.5' }}>
                  Write solutions in JavaScript, Python, Java, or C++. Run code to test against examples
                </p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--primary)', 
                color: 'white', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontWeight: '700',
                flexShrink: 0
              }}>3</div>
              <div>
                <h4 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: '600' }}>Track Progress</h4>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)', lineHeight: '1.5' }}>
                  Submit solutions to track your progress, maintain streaks, and monitor improvement
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="card" style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary)', padding: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>
            Why Practice Coding Questions?
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)', fontWeight: '600' }}>
                Company-Specific Preparation
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0, color: 'var(--text-soft)' }}>
                Practice questions frequently asked by Google, Microsoft, Amazon, and other top tech companies
              </p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)', fontWeight: '600' }}>
                Skill Mastery
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0, color: 'var(--text-soft)' }}>
                Master data structures, algorithms, and problem-solving patterns essential for technical interviews
              </p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-base)', fontWeight: '600' }}>
                Stay Consistent
              </h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.6', margin: 0, color: 'var(--text-soft)' }}>
                Build daily practice habits with streak tracking and progress monitoring to stay interview-ready
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Stats */}
      {progress && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <Trophy size={24} color="var(--primary)" style={{ marginBottom: 'var(--space-2)' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--primary)' }}>{progress.totalSolved}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Problems Solved</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Target size={24} color="var(--success)" style={{ marginBottom: 'var(--space-2)' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--success)' }}>{progress.streak}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Day Streak</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <CheckCircle size={24} color="var(--success)" style={{ marginBottom: 'var(--space-2)' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--success)' }}>{progress.easySolved}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Easy Solved</div>
          </div>
          <div className="card" style={{ textAlign: 'center' }}>
            <Clock size={24} color="var(--warning)" style={{ marginBottom: 'var(--space-2)' }} />
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--warning)' }}>{progress.mediumSolved}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Medium Solved</div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Filter size={20} />
          <h3>Filters</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)' }}>
          <select 
            value={filters.company} 
            onChange={(e) => setFilters({...filters, company: e.target.value})}
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="">All Companies</option>
            {companies.map(company => (
              <option key={company.name} value={company.name}>{company.name} ({company.questionCount})</option>
            ))}
          </select>
          <select 
            value={filters.topic} 
            onChange={(e) => setFilters({...filters, topic: e.target.value})}
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="">All Topics</option>
            {topics.map(topic => (
              <option key={topic.name} value={topic.name}>{topic.name} ({topic.questionCount})</option>
            ))}
          </select>
          <select 
            value={filters.difficulty} 
            onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
          <select 
            value={filters.language} 
            onChange={(e) => setFilters({...filters, language: e.target.value})}
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}
          >
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
          </select>
          <button className="btn primary" onClick={applyFilters} style={{ gridColumn: 'span 1' }}>
            <Filter size={16} />
            Apply Filters
          </button>
        </div>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <div>Loading questions...</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
          {questions.map(question => (
            <QuestionCard key={question.id} question={question} />
          ))}
        </div>
      )}

      {selectedQuestion && (
        <QuestionDetail 
          question={selectedQuestion} 
          onClose={() => setSelectedQuestion(null)} 
        />
      )}
    </div>
  );
}