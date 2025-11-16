import React, { useState } from 'react';
import { UserCheck, Star, Calendar, MessageCircle, Video, DollarSign, Clock, Filter, Search, Award } from 'lucide-react';

export default function ProMentorMarketplace() {
  const [activeTab, setActiveTab] = useState('browse');
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);

  const tabs = [
    { id: 'browse', label: 'Browse Mentors', icon: Search },
    { id: 'sessions', label: 'My Sessions', icon: Calendar },
    { id: 'favorites', label: 'Favorites', icon: Star }
  ];

  const mentors = [
    {
      id: 1,
      name: 'Sarah Chen',
      title: 'Senior Engineering Manager',
      company: 'Google',
      avatar: null,
      rating: 4.9,
      reviews: 127,
      hourlyRate: 150,
      responseTime: '< 2 hours',
      matchScore: 94,
      expertise: ['Engineering Leadership', 'System Design', 'Career Growth'],
      bio: 'Former startup founder turned engineering leader at Google. I help engineers advance their careers and develop leadership skills.',
      experience: '12+ years',
      sessions: 450,
      languages: ['English', 'Mandarin']
    },
    {
      id: 2,
      name: 'Marcus Johnson',
      title: 'VP of Product',
      company: 'Stripe',
      avatar: null,
      rating: 4.8,
      reviews: 89,
      hourlyRate: 200,
      responseTime: '< 4 hours',
      matchScore: 87,
      expertise: ['Product Strategy', 'Go-to-Market', 'Team Building'],
      bio: 'Product leader with experience scaling products from 0 to millions of users. Passionate about mentoring the next generation of PMs.',
      experience: '10+ years',
      sessions: 320,
      languages: ['English', 'Spanish']
    }
  ];

  const sessions = [
    {
      id: 1,
      mentorName: 'Sarah Chen',
      topic: 'Career Growth Strategy',
      date: 'March 20, 2024',
      time: '2:00 PM PST',
      duration: 60,
      status: 'upcoming',
      type: 'video'
    },
    {
      id: 2,
      mentorName: 'Marcus Johnson',
      topic: 'Product Leadership',
      date: 'March 15, 2024',
      time: '10:00 AM PST',
      duration: 45,
      status: 'completed',
      type: 'video',
      rating: 5
    }
  ];

  const renderBrowse = () => (
    <div className="pro-mentor-browse">
      <div className="pro-browse-header">
        <div className="pro-search-filters">
          <div className="pro-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search mentors by expertise, company, or name..."
              className="pro-search-input"
            />
          </div>
          <button className="pro-btn-secondary">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="pro-mentors-grid">
        {mentors.map((mentor) => (
          <div key={mentor.id} className="pro-mentor-card">
            <div className="pro-mentor-header">
              <div className="pro-mentor-avatar">
                {mentor.name.charAt(0)}
              </div>
              <div className="pro-mentor-info">
                <h3>{mentor.name}</h3>
                <p className="pro-mentor-title">{mentor.title}</p>
                <p className="pro-mentor-company">{mentor.company}</p>
              </div>
              <div className="pro-mentor-match">
                <div className="pro-match-score">{mentor.matchScore}%</div>
                <div className="pro-match-label">Match</div>
              </div>
            </div>

            <div className="pro-mentor-stats">
              <div className="pro-mentor-stat">
                <Star size={16} />
                <span>{mentor.rating} ({mentor.reviews} reviews)</span>
              </div>
              <div className="pro-mentor-stat">
                <Clock size={16} />
                <span>{mentor.responseTime} response</span>
              </div>
              <div className="pro-mentor-stat">
                <MessageCircle size={16} />
                <span>{mentor.sessions} sessions</span>
              </div>
            </div>

            <p className="pro-mentor-bio">{mentor.bio}</p>

            <div className="pro-mentor-expertise">
              {mentor.expertise.slice(0, 3).map((skill) => (
                <span key={skill} className="pro-expertise-tag">{skill}</span>
              ))}
            </div>

            <div className="pro-mentor-footer">
              <div className="pro-mentor-rate">
                <DollarSign size={16} />
                <span>${mentor.hourlyRate}/hour</span>
              </div>
              <div className="pro-mentor-actions">
                <button 
                  className="pro-btn-primary"
                  onClick={() => {
                    setSelectedMentor(mentor);
                    setBookingModal(true);
                  }}
                >
                  <Calendar size={16} />
                  Book Session
                </button>
                <button className="pro-btn-ghost">
                  <MessageCircle size={16} />
                  Message
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSessions = () => (
    <div className="pro-mentor-sessions">
      <div className="pro-sessions-header">
        <h3>My Mentoring Sessions</h3>
        <p>Manage your upcoming and past sessions</p>
      </div>

      <div className="pro-sessions-list">
        {sessions.map((session) => (
          <div key={session.id} className="pro-session-card">
            <div className="pro-session-header">
              <div className="pro-session-info">
                <h4>{session.mentorName}</h4>
                <p className="pro-session-topic">{session.topic}</p>
              </div>
              <div className={`pro-session-status ${session.status}`}>
                {session.status}
              </div>
            </div>

            <div className="pro-session-details">
              <div className="pro-session-detail">
                <Calendar size={16} />
                <span>{session.date} at {session.time}</span>
              </div>
              <div className="pro-session-detail">
                <Clock size={16} />
                <span>{session.duration} minutes</span>
              </div>
              <div className="pro-session-detail">
                <Video size={16} />
                <span>{session.type} call</span>
              </div>
            </div>

            {session.status === 'upcoming' && (
              <div className="pro-session-actions">
                <button className="pro-btn-primary">
                  <Video size={16} />
                  Join Session
                </button>
                <button className="pro-btn-secondary">Reschedule</button>
              </div>
            )}

            {session.status === 'completed' && session.rating && (
              <div className="pro-session-rating">
                <span>Your rating:</span>
                <div className="pro-rating-stars">
                  {Array.from({ length: session.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderFavorites = () => (
    <div className="pro-mentor-favorites">
      <div className="pro-favorites-header">
        <h3>Favorite Mentors</h3>
        <p>Quick access to your preferred mentors</p>
      </div>

      <div className="pro-favorites-empty">
        <Star size={48} />
        <h4>No favorites yet</h4>
        <p>Star mentors while browsing to add them to your favorites for quick access.</p>
        <button 
          className="pro-btn-primary"
          onClick={() => setActiveTab('browse')}
        >
          Browse Mentors
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
            <UserCheck size={32} />
          </div>
          <div>
            <h1 className="pro-title">Mentor Marketplace</h1>
            <p className="pro-subtitle">Connect with industry experts and accelerate your career growth</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Award size={16} />
          Become a Mentor
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
        {activeTab === 'browse' && renderBrowse()}
        {activeTab === 'sessions' && renderSessions()}
        {activeTab === 'favorites' && renderFavorites()}
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedMentor && (
        <div className="pro-modal-overlay">
          <div className="pro-modal">
            <div className="pro-modal-header">
              <h3>Book Session with {selectedMentor.name}</h3>
              <button 
                className="pro-modal-close"
                onClick={() => {
                  setBookingModal(false);
                  setSelectedMentor(null);
                }}
              >
                ×
              </button>
            </div>

            <div className="pro-modal-content">
              <div className="pro-booking-form">
                <div className="pro-form-group">
                  <label>Session Type</label>
                  <div className="pro-session-types">
                    <button className="pro-session-type active">
                      <Video size={16} />
                      Video Call
                    </button>
                    <button className="pro-session-type">
                      <MessageCircle size={16} />
                      Chat Only
                    </button>
                  </div>
                </div>

                <div className="pro-form-group">
                  <label>Duration</label>
                  <select className="pro-select">
                    <option value="30">30 minutes - ${selectedMentor.hourlyRate / 2}</option>
                    <option value="60">60 minutes - ${selectedMentor.hourlyRate}</option>
                    <option value="90">90 minutes - ${selectedMentor.hourlyRate * 1.5}</option>
                  </select>
                </div>

                <div className="pro-form-group">
                  <label>Preferred Date & Time</label>
                  <input type="datetime-local" className="pro-input" />
                </div>

                <div className="pro-form-group">
                  <label>Session Topic</label>
                  <textarea 
                    placeholder="What would you like to discuss in this session?"
                    className="pro-textarea"
                  />
                </div>

                <div className="pro-booking-summary">
                  <div className="pro-summary-item">
                    <span>Duration:</span>
                    <span>60 minutes</span>
                  </div>
                  <div className="pro-summary-item">
                    <span>Rate:</span>
                    <span>${selectedMentor.hourlyRate}/hour</span>
                  </div>
                  <div className="pro-summary-item total">
                    <span>Total:</span>
                    <span>${selectedMentor.hourlyRate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pro-modal-actions">
              <button 
                className="pro-btn-secondary"
                onClick={() => {
                  setBookingModal(false);
                  setSelectedMentor(null);
                }}
              >
                Cancel
              </button>
              <button className="pro-btn-primary">
                <DollarSign size={16} />
                Book & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}