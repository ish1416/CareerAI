import React, { useState } from 'react';
import { Users, Video, MessageCircle, MapPin, Calendar, Star, Play, Headphones } from 'lucide-react';

export default function ProVirtualFair() {
  const [activeFair, setActiveFair] = useState(null);
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [isInCall, setIsInCall] = useState(false);

  const fairEvents = [
    {
      id: 1,
      title: 'Tech Career Fair 2024',
      date: 'March 15, 2024',
      time: '10:00 AM - 6:00 PM PST',
      attendees: 2500,
      companies: ['Google', 'Meta', 'Apple', 'Netflix', 'Uber'],
      status: 'live',
      description: 'Connect with top tech companies and explore exciting career opportunities in software engineering, data science, and product management.'
    },
    {
      id: 2,
      title: 'Startup Showcase',
      date: 'March 22, 2024',
      time: '2:00 PM - 8:00 PM PST',
      attendees: 800,
      companies: ['Stripe', 'Figma', 'Notion', 'Discord'],
      status: 'upcoming',
      description: 'Discover innovative startups and fast-growing companies looking for talented individuals to join their teams.'
    }
  ];

  const booths = [
    {
      id: 1,
      company: 'Google',
      description: 'Join Google and help us organize the world\'s information',
      visitors: 234,
      rating: 4.8,
      recruiter: 'Sarah Chen',
      openPositions: 15,
      color: '#4285f4'
    },
    {
      id: 2,
      company: 'Meta',
      description: 'Build the future of social technology at Meta',
      visitors: 189,
      rating: 4.6,
      recruiter: 'Mike Johnson',
      openPositions: 12,
      color: '#1877f2'
    },
    {
      id: 3,
      company: 'Apple',
      description: 'Think different and create products that change the world',
      visitors: 156,
      rating: 4.9,
      recruiter: 'Lisa Wang',
      openPositions: 8,
      color: '#000000'
    }
  ];

  const renderFairList = () => (
    <div className="pro-fair-list">
      <div className="pro-fair-header">
        <h2>Virtual Career Fairs</h2>
        <p>Join immersive career fairs and connect with top employers</p>
      </div>

      <div className="pro-fairs-grid">
        {fairEvents.map((fair) => (
          <div key={fair.id} className="pro-fair-card">
            <div className="pro-fair-card-header">
              <div>
                <h3>{fair.title}</h3>
                <div className="pro-fair-meta">
                  <div className="pro-fair-meta-item">
                    <Calendar size={16} />
                    <span>{fair.date}</span>
                  </div>
                  <div className="pro-fair-meta-item">
                    <Users size={16} />
                    <span>{fair.attendees.toLocaleString()} attendees</span>
                  </div>
                </div>
              </div>
              <div className={`pro-fair-status ${fair.status}`}>
                {fair.status === 'live' && <div className="pro-live-indicator"></div>}
                {fair.status}
              </div>
            </div>

            <p className="pro-fair-description">{fair.description}</p>

            <div className="pro-fair-companies">
              <span className="pro-companies-label">Featured Companies:</span>
              <div className="pro-companies-list">
                {fair.companies.slice(0, 3).map((company) => (
                  <span key={company} className="pro-company-tag">{company}</span>
                ))}
                {fair.companies.length > 3 && (
                  <span className="pro-company-more">+{fair.companies.length - 3} more</span>
                )}
              </div>
            </div>

            <div className="pro-fair-actions">
              <button 
                className={`pro-btn-${fair.status === 'live' ? 'primary' : 'secondary'}`}
                onClick={() => fair.status === 'live' && setActiveFair(fair)}
                disabled={fair.status !== 'live'}
              >
                {fair.status === 'live' ? (
                  <>
                    <Play size={16} />
                    Join Fair
                  </>
                ) : (
                  'Coming Soon'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVirtualEnvironment = () => (
    <div className="pro-virtual-environment">
      <div className="pro-environment-header">
        <h2>{activeFair.title}</h2>
        <div className="pro-environment-actions">
          <button className="pro-btn-secondary">
            <Headphones size={16} />
            Audio Settings
          </button>
          <button className="pro-btn-secondary" onClick={() => setActiveFair(null)}>
            Leave Fair
          </button>
        </div>
      </div>

      <div className="pro-environment-grid">
        <div className="pro-virtual-space">
          <div className="pro-space-container">
            <div className="pro-booths-grid">
              {booths.map((booth) => (
                <div 
                  key={booth.id}
                  className={`pro-booth ${selectedBooth?.id === booth.id ? 'selected' : ''}`}
                  onClick={() => setSelectedBooth(booth)}
                  style={{ borderColor: booth.color }}
                >
                  <div className="pro-booth-header">
                    <h4>{booth.company}</h4>
                    <div className="pro-booth-visitors">
                      <Users size={14} />
                      <span>{booth.visitors}</span>
                    </div>
                  </div>
                  <div className="pro-booth-info">
                    <div className="pro-booth-rating">
                      <Star size={14} />
                      <span>{booth.rating}</span>
                    </div>
                    <div className="pro-booth-positions">
                      {booth.openPositions} open positions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pro-space-instructions">
            <MapPin size={16} />
            <span>Click on company booths to interact with recruiters</span>
          </div>
        </div>

        <div className="pro-interaction-panel">
          {selectedBooth ? (
            <div className="pro-booth-interaction">
              <div className="pro-booth-details">
                <h3>{selectedBooth.company}</h3>
                <p>{selectedBooth.description}</p>
                
                <div className="pro-booth-stats">
                  <div className="pro-booth-stat">
                    <Users size={16} />
                    <span>{selectedBooth.visitors} visitors</span>
                  </div>
                  <div className="pro-booth-stat">
                    <Star size={16} />
                    <span>{selectedBooth.rating} rating</span>
                  </div>
                </div>

                <div className="pro-recruiter-info">
                  <h4>Meet the Recruiter</h4>
                  <div className="pro-recruiter-card">
                    <div className="pro-recruiter-avatar">
                      {selectedBooth.recruiter.charAt(0)}
                    </div>
                    <div>
                      <div className="pro-recruiter-name">{selectedBooth.recruiter}</div>
                      <div className="pro-recruiter-title">Senior Recruiter</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pro-interaction-actions">
                <button 
                  className="pro-btn-primary"
                  onClick={() => setIsInCall(true)}
                >
                  <Video size={16} />
                  Start Video Chat
                </button>
                <button className="pro-btn-secondary">
                  <MessageCircle size={16} />
                  Send Message
                </button>
              </div>

              {isInCall && (
                <div className="pro-video-call">
                  <div className="pro-video-container">
                    <div className="pro-video-placeholder">
                      <Video size={48} />
                      <span>Video call with {selectedBooth.recruiter}</span>
                    </div>
                  </div>
                  <div className="pro-call-controls">
                    <button className="pro-call-btn">
                      <Video size={16} />
                    </button>
                    <button className="pro-call-btn">
                      <Headphones size={16} />
                    </button>
                    <button 
                      className="pro-call-btn end"
                      onClick={() => setIsInCall(false)}
                    >
                      End Call
                    </button>
                  </div>
                </div>
              )}

              <div className="pro-chat-section">
                <h4>Chat</h4>
                <div className="pro-chat-messages">
                  <div className="pro-chat-message recruiter">
                    <div className="pro-message-avatar">{selectedBooth.recruiter.charAt(0)}</div>
                    <div className="pro-message-content">
                      <div className="pro-message-author">{selectedBooth.recruiter}</div>
                      <div className="pro-message-text">
                        Hi! Welcome to our booth. I'd love to learn more about your background and discuss our open positions.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pro-chat-input">
                  <input 
                    type="text" 
                    placeholder="Type your message..."
                    className="pro-message-input"
                  />
                  <button className="pro-send-btn">Send</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pro-no-selection">
              <MapPin size={48} />
              <h3>Explore the Fair</h3>
              <p>Click on company booths to start conversations with recruiters and learn about opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Users size={32} />
          </div>
          <div>
            <h1 className="pro-title">Virtual Career Fair</h1>
            <p className="pro-subtitle">Connect with top employers in immersive virtual environments</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="pro-content">
        {!activeFair ? renderFairList() : renderVirtualEnvironment()}
      </div>
    </div>
  );
}