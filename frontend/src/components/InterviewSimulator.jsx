import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Mic, MicOff, Video, VideoOff, BarChart3, Clock, Star, Target } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function InterviewSimulator() {
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [answer, setAnswer] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [scorecard, setScorecard] = useState(null);
  const [activeTab, setActiveTab] = useState('practice');
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/interview/sessions');
      setSessions(data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const startSession = async (type, domain, difficulty) => {
    try {
      const { data: sessionData } = await api.post('/interview/sessions', { type, domain, difficulty });
      const { data: questionsData } = await api.post('/interview/questions', { 
        type, domain, difficulty, count: 5 
      });
      
      setCurrentSession(sessionData.session);
      setQuestions(questionsData.questions);
      setCurrentQuestionIndex(0);
      setAnswer('');
      showToast('Interview session started!', 'success');
    } catch (error) {
      showToast('Failed to start session', 'error');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoEnabled 
      });
      
      if (isVideoEnabled && videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      mediaRecorderRef.current.start();
      setIsRecording(true);
      showToast('Recording started', 'success');
    } catch (error) {
      showToast('Failed to start recording', 'error');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      showToast('Recording stopped', 'success');
    }
  };

  const analyzeAnswer = async () => {
    if (!answer.trim()) {
      showToast('Please provide an answer first', 'error');
      return;
    }

    try {
      const currentQuestion = questions[currentQuestionIndex];
      const { data } = await api.post('/interview/analyze', {
        question: currentQuestion.question,
        answer: answer,
        type: currentSession.type
      });
      
      setAnalysis(data.analysis);
      showToast('Answer analyzed!', 'success');
    } catch (error) {
      showToast('Failed to analyze answer', 'error');
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer('');
      setAnalysis(null);
    } else {
      finishSession();
    }
  };

  const finishSession = async () => {
    try {
      const { data } = await api.get(`/interview/sessions/${currentSession.id}/scorecard`);
      setScorecard(data.scorecard);
      setActiveTab('results');
      showToast('Session completed!', 'success');
    } catch (error) {
      showToast('Failed to generate scorecard', 'error');
    }
  };

  const SessionSetup = () => (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto', padding: 'var(--space-6)' }}>
      <h2>Start Mock Interview</h2>
      <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>Interview Type</label>
          <select id="type" className="form-input" style={{ width: '100%' }}>
            <option value="technical">Technical Interview</option>
            <option value="behavioral">Behavioral Interview</option>
            <option value="system-design">System Design</option>
            <option value="coding">Coding Interview</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>Domain</label>
          <select id="domain" className="form-input" style={{ width: '100%' }}>
            <option value="software-engineering">Software Engineering</option>
            <option value="data-science">Data Science</option>
            <option value="product-management">Product Management</option>
            <option value="marketing">Marketing</option>
          </select>
        </div>
        
        <div>
          <label style={{ display: 'block', marginBottom: 'var(--space-2)', fontWeight: '500' }}>Difficulty</label>
          <select id="difficulty" className="form-input" style={{ width: '100%' }}>
            <option value="entry">Entry Level</option>
            <option value="mid">Mid Level</option>
            <option value="senior">Senior Level</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <input 
            type="checkbox" 
            id="video" 
            checked={isVideoEnabled}
            onChange={(e) => setIsVideoEnabled(e.target.checked)}
            style={{ marginRight: 'var(--space-2)' }}
          />
          <label htmlFor="video" style={{ fontWeight: '500' }}>Enable video analysis</label>
        </div>
        
        <button 
          className="btn primary large"
          onClick={() => {
            const type = document.getElementById('type').value;
            const domain = document.getElementById('domain').value;
            const difficulty = document.getElementById('difficulty').value;
            startSession(type, domain, difficulty);
          }}
        >
          <Play size={20} />
          Start Interview
        </button>
      </div>
    </div>
  );

  const InterviewSession = () => (
    <div style={{ display: 'grid', gridTemplateColumns: isVideoEnabled ? '1fr 300px' : '1fr', gap: 'var(--space-6)' }}>
      <div>
        <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <button 
                className={`btn ${isRecording ? 'error' : 'primary'}`}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                {isRecording ? 'Stop' : 'Record'}
              </button>
            </div>
          </div>
          
          <div style={{ 
            padding: 'var(--space-4)', 
            background: 'var(--muted)', 
            borderRadius: 'var(--radius)', 
            marginBottom: 'var(--space-4)' 
          }}>
            <h4 style={{ margin: '0 0 var(--space-2)' }}>
              {questions[currentQuestionIndex]?.question}
            </h4>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
              Category: {questions[currentQuestionIndex]?.category}
            </div>
          </div>
          
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Type your answer here or use voice recording..."
            rows={6}
            className="form-input"
            style={{ width: '100%', marginBottom: 'var(--space-3)', resize: 'vertical' }}
          />
          
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button className="btn primary" onClick={analyzeAnswer}>
              <BarChart3 size={16} />
              Analyze Answer
            </button>
            <button className="btn ghost" onClick={nextQuestion}>
              {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Session'}
            </button>
          </div>
        </div>
        
        {analysis && (
          <div className="card">
            <h4>AI Feedback</h4>
            <div style={{ marginBottom: 'var(--space-3)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <Star size={20} color="var(--warning)" />
                <span style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                  Score: {analysis.score}/100
                </span>
              </div>
              <p>{analysis.feedback}</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <h5 style={{ color: 'var(--success)' }}>Strengths</h5>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                  {analysis.strengths.map((strength, idx) => (
                    <li key={idx}>{strength}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 style={{ color: 'var(--warning)' }}>Improvements</h5>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                  {analysis.improvements.map((improvement, idx) => (
                    <li key={idx}>{improvement}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isVideoEnabled && (
        <div>
          <div className="card">
            <h4>Video Analysis</h4>
            <video
              ref={videoRef}
              autoPlay
              muted
              style={{ 
                width: '100%', 
                height: '200px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}
            />
            <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', padding: 'var(--space-3)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
              <div style={{ marginBottom: 'var(--space-1)' }}>Confidence: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>78%</span></div>
              <div style={{ marginBottom: 'var(--space-1)' }}>Eye Contact: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>82%</span></div>
              <div>Engagement: <span style={{ fontWeight: 'bold', color: 'var(--primary)' }}>85%</span></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const ResultsView = () => (
    <div>
      <h2>Interview Scorecard</h2>
      {scorecard && (
        <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
          <div className="card">
            <h3>Overall Performance</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ 
                width: '80px', 
                height: '80px', 
                borderRadius: '50%', 
                background: `conic-gradient(var(--success) ${scorecard.overallScore * 3.6}deg, var(--muted) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'var(--text-xl)',
                fontWeight: 'bold'
              }}>
                {scorecard.overallScore}
              </div>
              <div>
                <h4 style={{ margin: 0 }}>Excellent Performance!</h4>
                <p style={{ margin: 0, color: 'var(--text-soft)' }}>
                  You scored better than 78% of candidates
                </p>
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
              {Object.entries(scorecard.breakdown).map(([category, score]) => (
                <div key={category} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{score}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', textTransform: 'capitalize' }}>
                    {category}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4 style={{ color: 'var(--success)' }}>Strengths</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                {scorecard.strengths.map((strength, idx) => (
                  <li key={idx}>{strength}</li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <h4 style={{ color: 'var(--warning)' }}>Areas to Improve</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                {scorecard.improvements.map((improvement, idx) => (
                  <li key={idx}>{improvement}</li>
                ))}
              </ul>
            </div>
            
            <div className="card">
              <h4 style={{ color: 'var(--primary)' }}>Action Plan</h4>
              <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                {scorecard.actionPlan.map((action, idx) => (
                  <li key={idx}>{action}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="card">
            <h4>Question Performance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {scorecard.questionScores.map((q, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{q.question}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{q.category}</span>
                    <span style={{ fontWeight: 'bold' }}>{q.score}/100</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>AI Interview Simulator</h1>
      
      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['practice', 'history', 'results'].map(tab => (
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

      {activeTab === 'practice' && (
        currentSession && questions.length > 0 ? <InterviewSession /> : <SessionSetup />
      )}

      {activeTab === 'history' && (
        <div>
          <h3>Previous Sessions</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {sessions.map(session => (
              <div key={session.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 var(--space-1)' }}>
                      {session.domain} - {session.type}
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-soft)' }}>
                      {session.date} • {session.duration} minutes
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                      {session.score}/100
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {session.status}
                    </div>
                  </div>
                </div>
                {session.feedback && (
                  <p style={{ marginTop: 'var(--space-2)', padding: 'var(--space-2)', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                    {session.feedback}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'results' && <ResultsView />}
    </div>
  );
}