import React, { useState } from 'react';
import { Headphones, Mic, MicOff, Volume2, Settings, Play, Square } from 'lucide-react';

export default function ProVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [activeTab, setActiveTab] = useState('commands');

  const tabs = [
    { id: 'commands', label: 'Voice Control', icon: Mic },
    { id: 'available', label: 'Available Commands', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const commands = [
    {
      category: 'Navigation',
      items: [
        { phrase: 'Go to dashboard', description: 'Navigate to the main dashboard' },
        { phrase: 'Open resume builder', description: 'Launch the resume builder tool' },
        { phrase: 'Show job matches', description: 'Display job matching results' },
        { phrase: 'View analytics', description: 'Open analytics dashboard' }
      ]
    },
    {
      category: 'Actions',
      items: [
        { phrase: 'Start new resume', description: 'Create a new resume from scratch' },
        { phrase: 'Analyze my resume', description: 'Run ATS analysis on current resume' },
        { phrase: 'Find jobs for me', description: 'Search for relevant job opportunities' },
        { phrase: 'Schedule interview prep', description: 'Set up interview practice session' }
      ]
    },
    {
      category: 'Information',
      items: [
        { phrase: 'What\'s my ATS score', description: 'Get current resume ATS score' },
        { phrase: 'Show my applications', description: 'Display job application status' },
        { phrase: 'Check interview schedule', description: 'View upcoming interviews' },
        { phrase: 'What are trending skills', description: 'Show current skill trends' }
      ]
    }
  ];

  const startListening = () => {
    setIsListening(true);
    setTranscript('Listening for your command...');
    
    // Simulate voice recognition
    setTimeout(() => {
      setTranscript('Navigate to resume builder');
      setTimeout(() => {
        setIsListening(false);
        setTranscript('Command executed: Opening resume builder');
      }, 1000);
    }, 2000);
  };

  const stopListening = () => {
    setIsListening(false);
    setTranscript('');
  };

  const renderCommands = () => (
    <div className="pro-voice-commands">
      <div className="pro-voice-interface">
        <div className="pro-voice-visualizer">
          <div className={`pro-voice-circle ${isListening ? 'listening' : ''}`}>
            {isListening ? <MicOff size={48} /> : <Mic size={48} />}
          </div>
          <div className="pro-voice-waves">
            {isListening && (
              <>
                <div className="pro-wave wave-1"></div>
                <div className="pro-wave wave-2"></div>
                <div className="pro-wave wave-3"></div>
              </>
            )}
          </div>
        </div>

        <div className="pro-voice-status">
          <h3>{isListening ? 'Listening...' : 'Ready for Voice Command'}</h3>
          <p>{isListening ? 'Speak your command clearly' : 'Click the microphone to start'}</p>
        </div>

        <div className="pro-voice-controls">
          <button 
            className={`pro-voice-btn ${isListening ? 'listening' : ''}`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? <Square size={24} /> : <Play size={24} />}
            {isListening ? 'Stop Listening' : 'Start Voice Command'}
          </button>
        </div>

        {transcript && (
          <div className="pro-transcript">
            <h4>Transcript</h4>
            <div className="pro-transcript-text">
              "{transcript}"
            </div>
          </div>
        )}
      </div>

      <div className="pro-quick-commands">
        <h4>Quick Commands</h4>
        <div className="pro-quick-grid">
          {['Go to dashboard', 'Open resume builder', 'Show job matches', 'Analyze my resume'].map((command) => (
            <button key={command} className="pro-quick-command">
              <Mic size={16} />
              <span>"{command}"</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAvailable = () => (
    <div className="pro-available-commands">
      <div className="pro-commands-header">
        <h3>Available Voice Commands</h3>
        <p>Complete list of supported voice commands and their functions</p>
      </div>

      <div className="pro-commands-categories">
        {commands.map((category) => (
          <div key={category.category} className="pro-command-category">
            <h4>{category.category}</h4>
            <div className="pro-commands-list">
              {category.items.map((command, index) => (
                <div key={index} className="pro-command-item">
                  <div className="pro-command-phrase">
                    <Mic size={16} />
                    <span>"{command.phrase}"</span>
                  </div>
                  <div className="pro-command-description">
                    {command.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="pro-voice-tips">
        <h4>Voice Command Tips</h4>
        <div className="pro-tips-grid">
          <div className="pro-tip-card">
            <Volume2 size={24} />
            <div>
              <h5>Speak Clearly</h5>
              <p>Use a clear, normal speaking voice for best recognition</p>
            </div>
          </div>
          <div className="pro-tip-card">
            <Headphones size={24} />
            <div>
              <h5>Quiet Environment</h5>
              <p>Use voice commands in a quiet space for better accuracy</p>
            </div>
          </div>
          <div className="pro-tip-card">
            <Mic size={24} />
            <div>
              <h5>Natural Language</h5>
              <p>Commands work with natural language variations</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="pro-voice-settings">
      <div className="pro-settings-header">
        <h3>Voice Settings</h3>
        <p>Configure voice recognition and command preferences</p>
      </div>

      <div className="pro-settings-grid">
        <div className="pro-settings-section">
          <h4>Recognition Settings</h4>
          <div className="pro-form-group">
            <label>Language</label>
            <select className="pro-select">
              <option>English (US)</option>
              <option>English (UK)</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <div className="pro-form-group">
            <label>Sensitivity</label>
            <input type="range" min="1" max="10" defaultValue="7" className="pro-slider" />
            <div className="pro-slider-labels">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Continuous Listening</div>
              <div className="pro-toggle-desc">Keep microphone active for follow-up commands</div>
            </div>
          </div>
        </div>

        <div className="pro-settings-section">
          <h4>Command Preferences</h4>
          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Voice Feedback</div>
              <div className="pro-toggle-desc">Provide audio confirmation of commands</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Wake Word</div>
              <div className="pro-toggle-desc">Use "Hey CareerAI" to activate voice commands</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Command History</div>
              <div className="pro-toggle-desc">Save voice command history for learning</div>
            </div>
          </div>
        </div>

        <div className="pro-settings-section">
          <h4>Privacy & Security</h4>
          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" defaultChecked />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Local Processing</div>
              <div className="pro-toggle-desc">Process voice commands locally when possible</div>
            </div>
          </div>

          <div className="pro-toggle-group">
            <label className="pro-toggle">
              <input type="checkbox" />
              <span className="pro-toggle-slider"></span>
            </label>
            <div>
              <div className="pro-toggle-label">Voice Data Storage</div>
              <div className="pro-toggle-desc">Store voice data to improve recognition accuracy</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-settings-actions">
        <button className="pro-btn-primary">Save Settings</button>
        <button className="pro-btn-secondary">Test Microphone</button>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Headphones size={32} />
          </div>
          <div>
            <h1 className="pro-title">Voice Commands</h1>
            <p className="pro-subtitle">Control CareerAI with natural voice commands</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Volume2 size={16} />
          Test Voice
        </button>
      </div>

      {/* Navigation */}
      <div className="pro-nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`pro-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeTab === 'commands' && renderCommands()}
        {activeTab === 'available' && renderAvailable()}
        {activeTab === 'settings' && renderSettings()}
      </div>
    </div>
  );
}