import React, { useState, useEffect } from 'react';
import { MessageSquare, Mic, Send, CheckCircle } from 'lucide-react';
import api from '../utils/api.js';

export default function CommunicationCoach() {
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const analyzeText = async () => {
    try {
      const { data } = await api.post('/communication-coach/analyze', { message });
      setAnalysis(data);
    } catch (error) {
      console.error('Failed to analyze:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <MessageSquare size={32} color="var(--primary)" />
        <div>
          <h1>AI Communication Coach</h1>
          <p style={{ color: 'var(--text-soft)' }}>Improve your professional communication with AI feedback</p>
        </div>
      </div>

      <div className="card">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message or email..."
          style={{ width: '100%', minHeight: '200px', marginBottom: 'var(--space-3)' }}
        />
        <button className="btn primary" onClick={analyzeText}>
          <CheckCircle size={16} />
          Analyze Communication
        </button>
      </div>

      {analysis && (
        <div className="card" style={{ marginTop: 'var(--space-4)' }}>
          <h3>Analysis Results</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            <div>
              <strong>Tone:</strong> {analysis.tone}
            </div>
            <div>
              <strong>Clarity Score:</strong> {analysis.clarity}/10
            </div>
            <div>
              <strong>Suggestions:</strong>
              <ul style={{ marginTop: 'var(--space-2)' }}>
                {analysis.suggestions.map((suggestion, idx) => (
                  <li key={idx}>{suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}