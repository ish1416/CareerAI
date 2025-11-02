import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Brain, Mic } from 'lucide-react';

const InterviewPrep = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('behavioral');

  const questionCategories = {
    behavioral: [
      "Tell me about yourself and your career journey.",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "Give me an example of when you had to work with a difficult team member.",
      "Tell me about a time you failed and what you learned from it.",
      "Describe your greatest professional achievement."
    ],
    technical: [
      "Explain the difference between REST and GraphQL APIs.",
      "How would you optimize a slow-loading web application?",
      "Describe your approach to debugging a complex issue.",
      "What are the key principles of good software architecture?",
      "How do you ensure code quality in your projects?"
    ],
    situational: [
      "How would you handle a tight deadline with limited resources?",
      "What would you do if you disagreed with your manager's decision?",
      "How would you approach learning a new technology quickly?",
      "Describe how you would handle conflicting priorities.",
      "What would you do if you discovered a security vulnerability?"
    ]
  };

  const categories = [
    { id: 'behavioral', name: 'Behavioral', icon: Brain },
    { id: 'technical', name: 'Technical', icon: CheckCircle },
    { id: 'situational', name: 'Situational', icon: Clock }
  ];

  const questions = questionCategories[selectedCategory];

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, start actual recording here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, stop recording and process audio
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--text)', marginBottom: 'var(--space-4)' }}>
          AI Interview Preparation
        </h2>
        <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-lg)' }}>
          Practice with AI-generated questions and get real-time feedback
        </p>
      </div>

      {/* Category Selection */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentQuestion(0);
              }}
              className="btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-6)',
                borderRadius: 'var(--radius-lg)',
                fontWeight: 600,
                transition: 'all 0.2s ease',
                background: selectedCategory === category.id ? 'var(--primary)' : 'var(--surface)',
                color: selectedCategory === category.id ? 'white' : 'var(--text)',
                border: selectedCategory === category.id ? 'none' : '1px solid var(--border)'
              }}
            >
              <Icon size={20} />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="card elevated" style={{ padding: 'var(--space-8)', marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--text-soft)' }}>
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span style={{
            padding: 'var(--space-1) var(--space-3)',
            background: 'var(--primary-bg)',
            color: 'var(--primary)',
            borderRadius: 'var(--radius-full)',
            fontSize: 'var(--text-sm)',
            fontWeight: 600
          }}>
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </span>
        </div>

        <h3 style={{ fontSize: 'var(--text-xl)', fontWeight: 600, color: 'var(--text)', marginBottom: 'var(--space-8)', lineHeight: 1.6 }}>
          {questions[currentQuestion]}
        </h3>

        {/* Recording Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 'var(--space-4)', marginBottom: 'var(--space-8)' }}>
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className="btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              fontWeight: 600,
              transition: 'all 0.2s ease',
              background: isRecording ? 'var(--error)' : 'var(--primary)',
              color: 'white',
              border: 'none'
            }}
          >
            {isRecording ? (
              <>
                <Pause size={20} />
                Stop Recording
              </>
            ) : (
              <>
                <Mic size={20} />
                Start Recording
              </>
            )}
          </button>

          {isRecording && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--error)' }}>
              <div style={{
                width: '12px',
                height: '12px',
                background: 'var(--error)',
                borderRadius: '50%',
                animation: 'pulse 1s infinite'
              }}></div>
              <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Recording...</span>
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div style={{ marginBottom: 'var(--space-6)' }}>
          <label style={{
            display: 'block',
            fontSize: 'var(--text-sm)',
            fontWeight: 600,
            color: 'var(--text)',
            marginBottom: 'var(--space-2)'
          }}>
            Your Answer (or use voice recording above)
          </label>
          <textarea
            rows={6}
            style={{
              width: '100%',
              padding: 'var(--space-4)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: 'var(--text-base)',
              background: 'var(--surface)',
              color: 'var(--text)',
              resize: 'none',
              transition: 'border-color 0.2s ease',
              outline: 'none'
            }}
            placeholder="Type your answer here or use the voice recording feature above..."
            value={answers[currentQuestion] || ''}
            onChange={(e) => setAnswers({...answers, [currentQuestion]: e.target.value})}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="btn ghost"
            style={{
              padding: 'var(--space-2) var(--space-4)',
              opacity: currentQuestion === 0 ? 0.5 : 1,
              cursor: currentQuestion === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>

          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  border: 'none',
                  transition: 'all 0.2s ease',
                  background: index === currentQuestion
                    ? 'var(--primary)'
                    : answers[index]
                    ? 'var(--success)'
                    : 'var(--muted)',
                  cursor: 'pointer'
                }}
              />
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length - 1}
            className="btn ghost"
            style={{
              padding: 'var(--space-2) var(--space-4)',
              opacity: currentQuestion === questions.length - 1 ? 0.5 : 1,
              cursor: currentQuestion === questions.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>

      {/* AI Feedback Panel */}
      <div className="card" style={{
        background: 'var(--gradient-primary)',
        padding: 'var(--space-6)',
        borderRadius: 'var(--radius-lg)'
      }}>
        <h4 style={{
          fontSize: 'var(--text-lg)',
          fontWeight: 600,
          color: 'white',
          marginBottom: 'var(--space-4)'
        }}>
          AI Feedback & Tips
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.9)' }}>
              Use the STAR method (Situation, Task, Action, Result) for behavioral questions
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.9)' }}>
              Be specific with examples and quantify your achievements when possible
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
            <CheckCircle size={16} color="#22c55e" style={{ marginTop: '2px', flexShrink: 0 }} />
            <span style={{ fontSize: 'var(--text-sm)', color: 'rgba(255,255,255,0.9)' }}>
              Practice speaking clearly and at a moderate pace
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;