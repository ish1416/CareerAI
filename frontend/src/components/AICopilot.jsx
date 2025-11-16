import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Mic, MicOff, Send, Bot, User, Loader2 } from 'lucide-react';
import { useToast } from './Toast.jsx';
import api from '../utils/api.js';

export default function AICopilot({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', content: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const messagesEndRef = useRef(null);
  const { showToast } = useToast();

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';
      
      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };
      
      recognitionInstance.onerror = () => {
        setIsListening(false);
        showToast('Voice recognition failed', 'error');
      };
      
      recognitionInstance.onend = () => {
        setIsListening(false);
      };
      
      setRecognition(recognitionInstance);
    }
  }, [showToast]);

  // Auto-open on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('careerai_visited');
    if (!hasVisited) {
      localStorage.setItem('careerai_visited', 'true');
      setTimeout(() => onToggle(), 2000);
    }
  }, [onToggle]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMessage = { id: Date.now(), type: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      console.log('Sending AI request:', { message: input.trim() });
      const { data } = await api.post('/ai/chat', { message: input.trim() });
      console.log('AI response received:', data);
      const botMessage = { 
        id: Date.now() + 1, 
        type: 'bot', 
        content: data.response,
        actions: data.actions
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage = { 
        id: Date.now() + 1, 
        type: 'bot', 
        content: `Connection error: ${error.response?.data?.message || error.message}` 
      };
      setMessages(prev => [...prev, errorMessage]);
      showToast(`AI connection failed: ${error.response?.status || 'Network error'}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVoice = () => {
    if (!recognition) {
      showToast('Voice recognition not supported', 'error');
      return;
    }
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 'var(--space-4)',
      right: 'var(--space-4)',
      width: '400px',
      height: '600px',
      background: 'var(--surface)',
      backdropFilter: 'blur(10px)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      boxShadow: 'var(--shadow-xl)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <div style={{
        padding: 'var(--space-4)',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <Bot size={20} color="var(--primary)" />
          <h3 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600 }}>
            AI Career Copilot
          </h3>
        </div>
        <button 
          onClick={onToggle}
          style={{ 
            background: 'none', 
            border: 'none', 
            fontSize: 'var(--text-lg)', 
            cursor: 'pointer',
            color: 'var(--text-soft)'
          }}
        >
          ×
        </button>
      </div>

      <div style={{
        flex: 1,
        padding: 'var(--space-3)',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-3)'
      }}>
        {messages.map(message => (
          <div key={message.id} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 'var(--space-2)',
            flexDirection: message.type === 'user' ? 'row-reverse' : 'row'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: message.type === 'user' ? 'var(--primary)' : 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {message.type === 'user' ? 
                <User size={16} color="white" /> : 
                <Bot size={16} color="var(--text)" />
              }
            </div>
            <div style={{
              background: message.type === 'user' ? 'var(--primary)' : 'var(--muted)',
              color: message.type === 'user' ? 'white' : 'var(--text)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius)',
              maxWidth: '80%',
              fontSize: 'var(--text-sm)',
              lineHeight: 1.4
            }}>
              {message.content}
              {message.actions && (
                <div style={{ marginTop: 'var(--space-2)', display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
                  {message.actions.map((action, idx) => (
                    <button 
                      key={idx}
                      className="btn small ghost"
                      style={{ fontSize: 'var(--text-xs)' }}
                      onClick={() => setInput(action)}
                    >
                      {action}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={16} color="var(--text)" />
            </div>
            <div style={{
              background: 'var(--muted)',
              padding: 'var(--space-2) var(--space-3)',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}>
              <Loader2 size={14} className="spinner" />
              <span style={{ fontSize: 'var(--text-sm)' }}>Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={{
        padding: 'var(--space-3)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        gap: 'var(--space-2)'
      }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask me anything about your career..."
          style={{
            flex: 1,
            minHeight: '40px',
            maxHeight: '100px',
            resize: 'none',
            fontSize: 'var(--text-sm)'
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
          <button
            onClick={toggleVoice}
            className={`btn small ${isListening ? 'primary' : 'ghost'}`}
            style={{ padding: 'var(--space-2)' }}
            title="Voice input"
          >
            {isListening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="btn small primary"
            style={{ padding: 'var(--space-2)' }}
            title="Send message"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CopilotToggle({ onClick, hasUnread = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        position: 'fixed',
        bottom: 'var(--space-4)',
        right: 'var(--space-4)',
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: 'var(--primary)',
        border: 'none',
        boxShadow: 'var(--shadow-lg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        zIndex: 999,
        transition: 'all var(--transition-base)'
      }}
      className="interactive"
    >
      <MessageCircle size={24} color="white" />
      {hasUnread && (
        <div style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          width: '12px',
          height: '12px',
          background: 'var(--error)',
          borderRadius: '50%',
          border: '2px solid white'
        }} />
      )}
    </button>
  );
}