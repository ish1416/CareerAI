import React, { useState } from 'react';
import { Video, Play, Pause, Square, Upload, Download, Mic, MicOff, Camera, CameraOff, Sparkles, FileText } from 'lucide-react';

export default function ProVideoResume() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [avatarMode, setAvatarMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('professional');
  const [script, setScript] = useState('');

  const steps = [
    { id: 1, title: 'Script', desc: 'Write your video script' },
    { id: 2, title: 'Record', desc: 'Record or generate video' },
    { id: 3, title: 'Edit', desc: 'Review and enhance' },
    { id: 4, title: 'Share', desc: 'Export and distribute' }
  ];

  const avatars = [
    { id: 'professional', name: 'Professional', desc: 'Corporate-friendly appearance' },
    { id: 'friendly', name: 'Friendly', desc: 'Approachable and warm' },
    { id: 'confident', name: 'Confident', desc: 'Authoritative presence' }
  ];

  const generatedScript = `Hi, I'm [Your Name], a passionate software engineer with 5 years of experience building scalable web applications.

I specialize in React, Node.js, and cloud technologies, and I've led teams to deliver products used by millions of users. At my current role at TechCorp, I architected a microservices platform that reduced deployment time by 60%.

I'm excited about opportunities to work on challenging problems and mentor junior developers. I believe in writing clean, maintainable code and fostering collaborative team environments.

Thank you for considering my application. I'd love to discuss how I can contribute to your team's success.`;

  const renderScript = () => (
    <div className="pro-step-content-wrapper">
      <div className="pro-section-header">
        <h2>Video Script</h2>
        <p>Create a compelling script for your video resume</p>
      </div>

      <div className="pro-script-grid">
        <div className="pro-script-editor">
          <div className="pro-script-header">
            <h3>Your Script</h3>
            <button className="pro-btn-secondary">
              <Sparkles size={16} />
              AI Generate
            </button>
          </div>
          <textarea
            value={script}
            onChange={(e) => setScript(e.target.value)}
            placeholder="Write your video resume script here..."
            className="pro-script-textarea"
          />
          <div className="pro-script-stats">
            <span>{script.length} characters</span>
            <span>~{Math.ceil(script.length / 150)} seconds</span>
          </div>
        </div>

        <div className="pro-script-template">
          <h3>AI Generated Template</h3>
          <div className="pro-template-card">
            <p>{generatedScript}</p>
            <button 
              className="pro-btn-ghost"
              onClick={() => setScript(generatedScript)}
            >
              Use This Script
            </button>
          </div>
        </div>
      </div>

      <div className="pro-step-actions">
        <button 
          className="pro-btn-primary"
          onClick={() => setCurrentStep(2)}
          disabled={!script.trim()}
        >
          Continue to Recording
        </button>
      </div>
    </div>
  );

  const renderRecord = () => (
    <div className="pro-step-content-wrapper">
      <div className="pro-section-header">
        <h2>Record Your Video</h2>
        <p>Choose between self-recording or AI avatar generation</p>
      </div>

      <div className="pro-record-mode">
        <div className="pro-mode-selector">
          <button 
            className={`pro-mode-btn ${!avatarMode ? 'active' : ''}`}
            onClick={() => setAvatarMode(false)}
          >
            <Camera size={20} />
            <div>
              <div className="pro-mode-title">Self Recording</div>
              <div className="pro-mode-desc">Record yourself with camera</div>
            </div>
          </button>
          <button 
            className={`pro-mode-btn ${avatarMode ? 'active' : ''}`}
            onClick={() => setAvatarMode(true)}
          >
            <Sparkles size={20} />
            <div>
              <div className="pro-mode-title">AI Avatar</div>
              <div className="pro-mode-desc">Generate with AI avatar</div>
            </div>
          </button>
        </div>
      </div>

      {!avatarMode ? (
        <div className="pro-recording-section">
          <div className="pro-video-preview">
            <div className="pro-video-container">
              {recordedVideo ? (
                <video 
                  src={URL.createObjectURL(recordedVideo)} 
                  controls 
                  className="pro-video-player"
                />
              ) : (
                <div className="pro-video-placeholder">
                  <Camera size={48} />
                  <span>Camera Preview</span>
                </div>
              )}
            </div>
            
            <div className="pro-recording-controls">
              <button 
                className="pro-control-btn"
                onClick={() => setAudioEnabled(!audioEnabled)}
              >
                {audioEnabled ? <Mic size={20} /> : <MicOff size={20} />}
              </button>
              <button 
                className="pro-control-btn"
                onClick={() => setVideoEnabled(!videoEnabled)}
              >
                {videoEnabled ? <Camera size={20} /> : <CameraOff size={20} />}
              </button>
              {!isRecording ? (
                <button 
                  className="pro-record-btn"
                  onClick={() => setIsRecording(true)}
                >
                  <Play size={20} />
                  Start Recording
                </button>
              ) : (
                <button 
                  className="pro-record-btn recording"
                  onClick={() => {
                    setIsRecording(false);
                    setRecordedVideo(new Blob([], { type: 'video/webm' }));
                  }}
                >
                  <Square size={20} />
                  Stop Recording
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="pro-avatar-section">
          <div className="pro-avatar-preview">
            <div className="pro-avatar-container">
              <div className="pro-avatar-placeholder">
                <Video size={48} />
                <span>AI Avatar Preview</span>
              </div>
            </div>
          </div>

          <div className="pro-avatar-selection">
            <h4>Choose Avatar Style</h4>
            <div className="pro-avatar-grid">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  className={`pro-avatar-option ${selectedAvatar === avatar.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAvatar(avatar.id)}
                >
                  <div className="pro-avatar-icon">
                    <Video size={24} />
                  </div>
                  <div className="pro-avatar-info">
                    <div className="pro-avatar-name">{avatar.name}</div>
                    <div className="pro-avatar-desc">{avatar.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            
            <button className="pro-btn-primary">
              <Sparkles size={16} />
              Generate Avatar Video
            </button>
          </div>
        </div>
      )}

      <div className="pro-step-actions">
        <button 
          className="pro-btn-secondary"
          onClick={() => setCurrentStep(1)}
        >
          Back
        </button>
        <button 
          className="pro-btn-primary"
          onClick={() => setCurrentStep(3)}
          disabled={!recordedVideo && !avatarMode}
        >
          Continue to Edit
        </button>
      </div>
    </div>
  );

  const renderEdit = () => (
    <div className="pro-step-content-wrapper">
      <div className="pro-section-header">
        <h2>Review & Enhance</h2>
        <p>Fine-tune your video resume before sharing</p>
      </div>

      <div className="pro-edit-grid">
        <div className="pro-video-editor">
          <div className="pro-video-preview-large">
            <video 
              src={recordedVideo ? URL.createObjectURL(recordedVideo) : ''} 
              controls 
              className="pro-video-player-large"
            />
          </div>
          
          <div className="pro-edit-controls">
            <button className="pro-btn-secondary">
              <FileText size={16} />
              Add Captions
            </button>
            <button className="pro-btn-secondary">
              <Sparkles size={16} />
              Enhance Quality
            </button>
          </div>
        </div>

        <div className="pro-edit-options">
          <div className="pro-edit-section">
            <h4>Video Settings</h4>
            <div className="pro-form-group">
              <label>Quality</label>
              <select className="pro-select">
                <option>HD (1080p)</option>
                <option>Standard (720p)</option>
                <option>Compressed (480p)</option>
              </select>
            </div>
            <div className="pro-form-group">
              <label>Format</label>
              <select className="pro-select">
                <option>MP4 (Recommended)</option>
                <option>WebM</option>
                <option>MOV</option>
              </select>
            </div>
          </div>

          <div className="pro-edit-section">
            <h4>Enhancements</h4>
            <div className="pro-toggle-group">
              <label className="pro-toggle">
                <input type="checkbox" defaultChecked />
                <span className="pro-toggle-slider"></span>
              </label>
              <div>
                <div className="pro-toggle-label">Auto-enhance audio</div>
                <div className="pro-toggle-desc">Reduce background noise</div>
              </div>
            </div>
            <div className="pro-toggle-group">
              <label className="pro-toggle">
                <input type="checkbox" />
                <span className="pro-toggle-slider"></span>
              </label>
              <div>
                <div className="pro-toggle-label">Add intro/outro</div>
                <div className="pro-toggle-desc">Professional branding</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-step-actions">
        <button 
          className="pro-btn-secondary"
          onClick={() => setCurrentStep(2)}
        >
          Back
        </button>
        <button 
          className="pro-btn-primary"
          onClick={() => setCurrentStep(4)}
        >
          Continue to Share
        </button>
      </div>
    </div>
  );

  const renderShare = () => (
    <div className="pro-step-content-wrapper">
      <div className="pro-section-header">
        <h2>Share Your Video Resume</h2>
        <p>Export and distribute your professional video resume</p>
      </div>

      <div className="pro-share-grid">
        <div className="pro-export-options">
          <h3>Export Options</h3>
          <div className="pro-export-list">
            <button className="pro-export-btn">
              <Download size={20} />
              <div>
                <div className="pro-export-title">Download Video</div>
                <div className="pro-export-desc">Save to your device</div>
              </div>
            </button>
            <button className="pro-export-btn">
              <Upload size={20} />
              <div>
                <div className="pro-export-title">Upload to Portfolio</div>
                <div className="pro-export-desc">Add to your CareerAI portfolio</div>
              </div>
            </button>
            <button className="pro-export-btn">
              <FileText size={20} />
              <div>
                <div className="pro-export-title">Generate Embed Code</div>
                <div className="pro-export-desc">For websites and applications</div>
              </div>
            </button>
          </div>
        </div>

        <div className="pro-share-options">
          <h3>Quick Share</h3>
          <div className="pro-share-platforms">
            <button className="pro-platform-btn">LinkedIn</button>
            <button className="pro-platform-btn">Email</button>
            <button className="pro-platform-btn">Copy Link</button>
          </div>
          
          <div className="pro-share-stats">
            <h4>Video Stats</h4>
            <div className="pro-stats-list">
              <div className="pro-stat-item">
                <span>Duration:</span>
                <span>2:34</span>
              </div>
              <div className="pro-stat-item">
                <span>Size:</span>
                <span>15.2 MB</span>
              </div>
              <div className="pro-stat-item">
                <span>Quality:</span>
                <span>HD 1080p</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-step-actions">
        <button 
          className="pro-btn-secondary"
          onClick={() => setCurrentStep(3)}
        >
          Back
        </button>
        <button className="pro-btn-primary">
          <Upload size={16} />
          Save & Share
        </button>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Video size={32} />
          </div>
          <div>
            <h1 className="pro-title">Video Resume</h1>
            <p className="pro-subtitle">Create professional video resumes with AI assistance</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Sparkles size={16} />
          AI Quick Generate
        </button>
      </div>

      {/* Progress Steps */}
      <div className="pro-steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`pro-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="pro-step-number">{step.id}</div>
            <div className="pro-step-content">
              <div className="pro-step-title">{step.title}</div>
              <div className="pro-step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="pro-content">
        {currentStep === 1 && renderScript()}
        {currentStep === 2 && renderRecord()}
        {currentStep === 3 && renderEdit()}
        {currentStep === 4 && renderShare()}
      </div>
    </div>
  );
}