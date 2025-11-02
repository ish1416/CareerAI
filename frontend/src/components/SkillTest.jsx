import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, X, Play, Trophy } from 'lucide-react';

export default function SkillTest({ test, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && started) {
      handleSubmit();
    }
  }, [timeLeft, started]);

  const startTest = () => {
    const mockQuestions = [
      {
        id: 1,
        question: 'What is a closure in JavaScript?',
        options: ['A function inside another function', 'A variable', 'A loop', 'An object'],
        correct: 0
      },
      {
        id: 2,
        question: 'Which hook is used for state in React?',
        options: ['useEffect', 'useState', 'useContext', 'useReducer'],
        correct: 1
      },
      {
        id: 3,
        question: 'What does API stand for?',
        options: ['Application Programming Interface', 'Advanced Programming Interface', 'Application Process Interface', 'Automated Programming Interface'],
        correct: 0
      }
    ];
    
    setQuestions(mockQuestions);
    setTimeLeft(test.duration * 60);
    setStarted(true);
  };

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    const score = Math.floor(Math.random() * 40) + 60; // Mock score 60-100%
    const feedback = score >= 80 ? 'Excellent work!' : score >= 60 ? 'Good job!' : 'Keep practicing!';
    
    setResult({ score, feedback, passed: score >= 60 });
    setCompleted(true);
    onComplete?.({ score, feedback, passed: score >= 60 });
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (completed) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-4)' }}>
          {result.passed ? (
            <Trophy size={48} color="var(--success)" style={{ margin: '0 auto' }} />
          ) : (
            <X size={48} color="var(--error)" style={{ margin: '0 auto' }} />
          )}
        </div>
        
        <h2>Test Complete!</h2>
        <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
          {result.score}%
        </div>
        <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>{result.feedback}</p>
        
        {result.passed && (
          <div style={{ padding: 'var(--space-3)', background: 'var(--success-light)', borderRadius: 'var(--radius)', marginBottom: 'var(--space-4)' }}>
            <CheckCircle size={20} color="var(--success)" style={{ marginRight: 'var(--space-2)' }} />
            Badge Earned: {test.title} Master
          </div>
        )}
        
        <button className="btn primary" onClick={() => window.location.reload()}>
          Take Another Test
        </button>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
        <h2>{test.title}</h2>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', margin: 'var(--space-4) 0' }}>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{test.questions}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Questions</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{test.duration}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Minutes</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>{test.difficulty}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Level</div>
          </div>
        </div>
        
        <button className="btn primary large" onClick={startTest}>
          <Play size={20} />
          Start Test
        </button>
      </div>
    );
  }

  const question = questions[currentQuestion];
  
  return (
    <div className="card" style={{ padding: 'var(--space-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div>
          <h3>{test.title}</h3>
          <div style={{ color: 'var(--text-soft)' }}>
            Question {currentQuestion + 1} of {questions.length}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--primary)' }}>
          <Clock size={20} />
          <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '4px', marginBottom: 'var(--space-6)' }}>
        <div style={{ 
          background: 'var(--primary)', 
          height: '100%', 
          borderRadius: 'var(--radius)', 
          width: `${((currentQuestion + 1) / questions.length) * 100}%`,
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Question */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h4 style={{ marginBottom: 'var(--space-4)' }}>{question.question}</h4>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(question.id, index)}
              style={{
                padding: 'var(--space-3)',
                border: '2px solid',
                borderColor: answers[question.id] === index ? 'var(--primary)' : 'var(--border)',
                background: answers[question.id] === index ? 'var(--primary-light)' : 'var(--panel)',
                borderRadius: 'var(--radius)',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <span style={{ marginRight: 'var(--space-2)', fontWeight: 'bold' }}>
                {String.fromCharCode(65 + index)}.
              </span>
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button 
          className="btn ghost"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button 
            className="btn primary"
            onClick={handleSubmit}
            disabled={Object.keys(answers).length < questions.length}
          >
            Submit Test
          </button>
        ) : (
          <button 
            className="btn primary"
            onClick={() => setCurrentQuestion(currentQuestion + 1)}
            disabled={answers[question.id] === undefined}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}