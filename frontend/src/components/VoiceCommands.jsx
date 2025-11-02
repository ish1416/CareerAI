import React, { useState, useEffect } from 'react';
import { Headphones, Mic, MicOff, Volume2 } from 'lucide-react';
import api from '../utils/api.js';

export default function VoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState([]);

  useEffect(() => {
    loadCommands();
  }, []);

  const loadCommands = async () => {
    try {
      const { data } = await api.get('/voice-commands/available');
      setCommands(data.commands);
    } catch (error) {
      console.error('Failed to load commands:', error);
    }
  };

  const startListening = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.onresult = (event) => {
        const command = event.results[0][0].transcript;
        setTranscript(command);
        processCommand(command);
      };
      recognition.start();
      setIsListening(true);
    }
  };

  const processCommand = async (command) => {
    try {
      await api.post('/voice-commands/process', { command });
      setIsListening(false);
    } catch (error) {
      console.error('Failed to process command:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Headphones size={32} color="var(--primary)" />
        <div>
          <h1>Voice Command Center</h1>
          <p style={{ color: 'var(--text-soft)' }}>Control CareerAI with voice commands</p>
        </div>
      </div>

      <div className="card" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
        <button 
          className={`btn ${isListening ? 'secondary' : 'primary'} large`}
          onClick={startListening}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
          {isListening ? 'Listening...' : 'Start Voice Command'}
        </button>
        {transcript && (
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-lg)' }}>
            "{transcript}"
          </div>
        )}
      </div>

      <div>
        <h3>Available Commands</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-3)' }}>
          {commands.map(command => (
            <div key={command.id} className="card">
              <h5>"{command.phrase}"</h5>
              <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{command.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}