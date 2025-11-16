import React, { useState } from 'react';
import { Play, Mic, Video, BarChart3, Clock, Star, Target, CheckCircle, ArrowRight } from 'lucide-react';

export default function ProInterview() {
  const [currentStep, setCurrentStep] = useState('setup');
  const [sessionData, setSessionData] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);

  const interviewTypes = [
    { id: 'technical', name: 'Technical Interview', description: 'Coding and system design questions', duration: '45-60 min' },
    { id: 'behavioral', name: 'Behavioral Interview', description: 'Situational and experience-based questions', duration: '30-45 min' },
    { id: 'case-study', name: 'Case Study', description: 'Problem-solving and analytical thinking', duration: '60-90 min' }
  ];

  const mockQuestions = [
    { question: "Tell me about yourself and your background.", category: "Introduction", difficulty: "Easy" },
    { question: "Describe a challenging project you worked on recently.", category: "Experience", difficulty: "Medium" },
    { question: "How do you handle conflicts in a team environment?", category: "Behavioral", difficulty: "Medium" }
  ];

  const mockResults = {
    overallScore: 85,
    breakdown: {
      communication: 88,
      technical: 82,
      confidence: 87,
      clarity: 83
    },
    strengths: ['Clear communication', 'Good technical knowledge', 'Confident delivery'],
    improvements: ['More specific examples', 'Better structure in answers'],
    recommendations: ['Practice STAR method', 'Prepare more quantified examples']
  };

  const SetupView = () => (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-3)' }}>
          AI Interview Simulator
        </h2>
        <p className="text-secondary">
          Practice interviews with AI-powered feedback and analysis
        </p>
      </div>

      <div className="grid grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {interviewTypes.map((type) => (
          <div
            key={type.id}
            className="card"
            style={{
              padding: 'var(--space-6)',
              cursor: 'pointer',
              textAlign: 'center',
              border: sessionData?.type === type.id ? '2px solid var(--primary)' : '1px solid var(--border)',
              transition: 'var(--transition)'
            }}
            onClick={() => setSessionData({ ...sessionData, type: type.id })}
          >
            <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
              {type.name}
            </h3>
            <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-3)' }}>
              {type.description}
            </p>
            <div className="text-xs text-muted">{type.duration}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
        <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
          Interview Settings
        </h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <div>
            <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Experience Level
            </label>
            <select className="input">
              <option>Entry Level (0-2 years)</option>
              <option>Mid Level (3-5 years)</option>
              <option>Senior Level (5+ years)</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Industry Focus
            </label>
            <select className="input">
              <option>Software Engineering</option>
              <option>Data Science</option>
              <option>Product Management</option>
              <option>Marketing</option>
            </select>
          </div>
        </div>

        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
            Company Type (Optional)
          </label>
          <input className="input" placeholder="e.g., Google, Startup, Consulting" />
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" />
            <Mic size={16} />
            <span className="text-sm">Enable voice recording</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
            <input type="checkbox" />
            <Video size={16} />
            <span className="text-sm">Enable video analysis</span>
          </label>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-primary btn-lg"
          onClick={() => setCurrentStep('interview')}
          disabled={!sessionData?.type}
        >
          <Play size={20} />
          Start Interview Session
        </button>
      </div>
    </div>
  );

  const InterviewView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
      {/* Main Interview Area */}
      <div>
        {/* Progress Bar */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
            <span className="text-sm font-medium">Question {currentQuestion + 1} of {mockQuestions.length}</span>
            <span className="text-sm text-secondary">15:30 elapsed</span>
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
            <div
              style={{
                width: `${((currentQuestion + 1) / mockQuestions.length) * 100}%`,
                height: '100%',
                background: 'var(--primary)',
                borderRadius: 3,
                transition: 'var(--transition)'
              }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <span
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  background: 'var(--primary)',
                  color: 'white',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600
                }}
              >
                {mockQuestions[currentQuestion].category}
              </span>
              <span
                style={{
                  padding: 'var(--space-1) var(--space-2)',
                  background: 'var(--gray-100)',
                  color: 'var(--text-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600
                }}
              >
                {mockQuestions[currentQuestion].difficulty}
              </span>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button
                className={`btn ${isRecording ? 'btn-error' : 'btn-primary'}`}
                onClick={() => setIsRecording(!isRecording)}
              >
                <Mic size={16} />
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>

          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-4)', lineHeight: 1.4 }}>
            {mockQuestions[currentQuestion].question}
          </h2>

          <textarea
            className="input"
            rows={6}
            placeholder="Type your answer here or use voice recording..."
            style={{ marginBottom: 'var(--space-4)' }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button
              className="btn"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous Question
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                if (currentQuestion < mockQuestions.length - 1) {
                  setCurrentQuestion(currentQuestion + 1);
                } else {
                  setCurrentStep('results');
                }
              }}
            >
              {currentQuestion < mockQuestions.length - 1 ? 'Next Question' : 'Finish Interview'}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* AI Tips */}
        <div className="card" style={{ padding: 'var(--space-4)', background: 'var(--gray-50)' }}>
          <h4 className="text-sm font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
            💡 AI Tip for this question:
          </h4>
          <p className="text-sm text-secondary">
            Use the STAR method (Situation, Task, Action, Result) to structure your response effectively.
          </p>
        </div>
      </div>

      {/* Sidebar */}
      <div>
        {/* Recording Status */}
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <h4 className="text-sm font-semibold" style={{ marginBottom: 'var(--space-3)' }}>
            Recording Status
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isRecording ? 'var(--error)' : 'var(--gray-300)'
              }}
            />
            <span className="text-sm">{isRecording ? 'Recording...' : 'Not recording'}</span>
          </div>
          <div className="text-xs text-muted">
            {isRecording ? '00:45 / 02:00' : 'Click to start recording'}
          </div>
        </div>

        {/* Real-time Analysis */}
        <div className="card" style={{ padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <h4 className="text-sm font-semibold" style={{ marginBottom: 'var(--space-3)' }}>
            Real-time Analysis
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-xs">Confidence</span>
              <span className="text-xs font-medium">78%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-xs">Clarity</span>
              <span className="text-xs font-medium">85%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-xs">Pace</span>
              <span className="text-xs font-medium">Good</span>
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <h4 className="text-sm font-semibold" style={{ marginBottom: 'var(--space-3)' }}>
            Interview Questions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {mockQuestions.map((q, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-2)',
                  padding: 'var(--space-2)',
                  borderRadius: 'var(--radius)',
                  background: index === currentQuestion ? 'var(--primary)' : 'transparent',
                  color: index === currentQuestion ? 'white' : 'var(--text)',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentQuestion(index)}
              >
                <div
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    background: index < currentQuestion ? 'var(--success)' : 
                               index === currentQuestion ? 'white' : 'var(--gray-200)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    color: index === currentQuestion ? 'var(--primary)' : 'white'
                  }}
                >
                  {index < currentQuestion ? <CheckCircle size={12} /> : index + 1}
                </div>
                <span className="text-xs">{q.category}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const ResultsView = () => (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Interview Complete! 🎉
        </h2>
        <p className="text-secondary">
          Here's your detailed performance analysis and recommendations
        </p>
      </div>

      {/* Overall Score */}
      <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <div
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: `conic-gradient(var(--success) ${mockResults.overallScore * 3.6}deg, var(--gray-200) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto var(--space-4)',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'bold',
              color: 'var(--success)'
            }}
          >
            {mockResults.overallScore}
          </div>
        </div>
        <h3 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
          Excellent Performance!
        </h3>
        <p className="text-secondary">
          You scored better than 78% of candidates in similar interviews
        </p>
      </div>

      {/* Breakdown */}
      <div className="grid grid-4" style={{ gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {Object.entries(mockResults.breakdown).map(([category, score]) => (
          <div key={category} className="card" style={{ padding: 'var(--space-4)', textAlign: 'center' }}>
            <div className="text-2xl font-bold" style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
              {score}
            </div>
            <div className="text-sm font-medium" style={{ textTransform: 'capitalize' }}>
              {category}
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Feedback */}
      <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--success)', marginBottom: 'var(--space-4)' }}>
            Strengths
          </h3>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
            {mockResults.strengths.map((strength, index) => (
              <li key={index} className="text-sm" style={{ marginBottom: 'var(--space-2)' }}>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--warning)', marginBottom: 'var(--space-4)' }}>
            Areas to Improve
          </h3>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
            {mockResults.improvements.map((improvement, index) => (
              <li key={index} className="text-sm" style={{ marginBottom: 'var(--space-2)' }}>
                {improvement}
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h3 className="text-lg font-semibold" style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)' }}>
            Recommendations
          </h3>
          <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
            {mockResults.recommendations.map((rec, index) => (
              <li key={index} className="text-sm" style={{ marginBottom: 'var(--space-2)' }}>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)' }}>
          <button className="btn" onClick={() => setCurrentStep('setup')}>
            Practice Again
          </button>
          <button className="btn btn-primary">
            <BarChart3 size={16} />
            View Detailed Report
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {currentStep === 'setup' && <SetupView />}
      {currentStep === 'interview' && <InterviewView />}
      {currentStep === 'results' && <ResultsView />}
    </div>
  );
}