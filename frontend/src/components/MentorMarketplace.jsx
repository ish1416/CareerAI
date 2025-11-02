import React, { useState, useEffect } from 'react';
import { UserCheck, Star, Calendar, MessageCircle, Video, DollarSign, Clock, Filter } from 'lucide-react';
import api from '../utils/api.js';

export default function MentorMarketplace() {
  const [mentors, setMentors] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [filters, setFilters] = useState({
    expertise: '',
    priceRange: '',
    rating: '',
    availability: ''
  });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [bookingModal, setBookingModal] = useState(false);
  const [sessionType, setSessionType] = useState('video');

  useEffect(() => {
    loadMentors();
    loadSessions();
  }, []);

  useEffect(() => {
    loadMentors();
  }, [filters]);

  const loadMentors = async () => {
    try {
      const { data } = await api.get('/mentor-marketplace/mentors', { params: filters });
      setMentors(data.mentors);
    } catch (error) {
      console.error('Failed to load mentors:', error);
    }
  };

  const loadSessions = async () => {
    try {
      const { data } = await api.get('/mentor-marketplace/sessions');
      setSessions(data.sessions);
    } catch (error) {
      console.error('Failed to load sessions:', error);
    }
  };

  const bookSession = async (mentorId, sessionData) => {
    try {
      const { data } = await api.post('/mentor-marketplace/book', {
        mentorId,
        ...sessionData
      });
      setBookingModal(false);
      setSelectedMentor(null);
      loadSessions();
    } catch (error) {
      console.error('Failed to book session:', error);
    }
  };

  const getMatchScore = async (mentorId) => {
    try {
      const { data } = await api.post('/mentor-marketplace/match-score', { mentorId });
      return data.score;
    } catch (error) {
      console.error('Failed to get match score:', error);
      return 0;
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <UserCheck size={32} color="var(--primary)" />
        <div>
          <h1>Mentor Marketplace</h1>
          <p style={{ color: 'var(--text-soft)' }}>Connect with industry experts and career coaches</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <Filter size={20} />
          <h4>Find Your Perfect Mentor</h4>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          <div>
            <label>Expertise</label>
            <select 
              value={filters.expertise}
              onChange={(e) => setFilters({...filters, expertise: e.target.value})}
            >
              <option value="">All Areas</option>
              <option value="software-engineering">Software Engineering</option>
              <option value="product-management">Product Management</option>
              <option value="data-science">Data Science</option>
              <option value="design">Design</option>
              <option value="marketing">Marketing</option>
            </select>
          </div>
          
          <div>
            <label>Price Range</label>
            <select 
              value={filters.priceRange}
              onChange={(e) => setFilters({...filters, priceRange: e.target.value})}
            >
              <option value="">Any Price</option>
              <option value="0-50">$0 - $50</option>
              <option value="50-100">$50 - $100</option>
              <option value="100-200">$100 - $200</option>
              <option value="200+">$200+</option>
            </select>
          </div>
          
          <div>
            <label>Rating</label>
            <select 
              value={filters.rating}
              onChange={(e) => setFilters({...filters, rating: e.target.value})}
            >
              <option value="">Any Rating</option>
              <option value="4.5+">4.5+ Stars</option>
              <option value="4.0+">4.0+ Stars</option>
              <option value="3.5+">3.5+ Stars</option>
            </select>
          </div>
          
          <div>
            <label>Availability</label>
            <select 
              value={filters.availability}
              onChange={(e) => setFilters({...filters, availability: e.target.value})}
            >
              <option value="">Any Time</option>
              <option value="today">Available Today</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Mentor List */}
        <div>
          <h3>Available Mentors</h3>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {mentors.map(mentor => (
              <div key={mentor.id} className="card">
                <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                  <div style={{ 
                    width: '80px', 
                    height: '80px', 
                    borderRadius: '50%', 
                    background: `url(${mentor.avatar}) center/cover`,
                    backgroundColor: 'var(--muted)'
                  }} />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
                      <div>
                        <h4>{mentor.name}</h4>
                        <div style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                          {mentor.title} at {mentor.company}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                            <Star size={16} color="var(--warning)" />
                            <span style={{ fontSize: 'var(--text-sm)' }}>{mentor.rating}</span>
                          </div>
                          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                            ({mentor.reviews} reviews)
                          </span>
                          <div style={{ 
                            padding: 'var(--space-1) var(--space-2)', 
                            borderRadius: 'var(--radius)', 
                            background: 'var(--success-bg)',
                            color: 'var(--success)',
                            fontSize: 'var(--text-xs)',
                            fontWeight: 600
                          }}>
                            {mentor.matchScore}% Match
                          </div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>
                          ${mentor.hourlyRate}/hr
                        </div>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                          {mentor.responseTime} response
                        </div>
                      </div>
                    </div>
                    
                    <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                      {mentor.bio}
                    </p>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                      {mentor.expertise.slice(0, 3).map((skill, idx) => (
                        <span key={idx} style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          borderRadius: 'var(--radius)', 
                          background: 'var(--muted)', 
                          fontSize: 'var(--text-xs)'
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button 
                        className="btn primary small"
                        onClick={() => {setSelectedMentor(mentor); setBookingModal(true);}}
                      >
                        <Calendar size={14} />
                        Book Session
                      </button>
                      <button className="btn ghost small">
                        <MessageCircle size={14} />
                        Message
                      </button>
                      <button className="btn ghost small">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Sessions */}
        <div>
          <h3>Your Sessions</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {sessions.map(session => (
              <div key={session.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
                  <div>
                    <h5>{session.mentorName}</h5>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {session.topic}
                    </div>
                  </div>
                  <div style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    borderRadius: 'var(--radius)', 
                    background: session.status === 'upcoming' ? 'var(--warning-bg)' : 'var(--success-bg)',
                    color: session.status === 'upcoming' ? 'var(--warning)' : 'var(--success)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600
                  }}>
                    {session.status}
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Calendar size={16} color="var(--text-soft)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{session.date}</span>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Clock size={16} color="var(--text-soft)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{session.duration} minutes</span>
                </div>
                
                {session.status === 'upcoming' && (
                  <button className="btn primary small">
                    <Video size={14} />
                    Join Session
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && selectedMentor && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h4>Book Session with {selectedMentor.name}</h4>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Session Type</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <button 
                  className={`btn ${sessionType === 'video' ? 'primary' : 'ghost'} small`}
                  onClick={() => setSessionType('video')}
                >
                  <Video size={14} />
                  Video Call
                </button>
                <button 
                  className={`btn ${sessionType === 'chat' ? 'primary' : 'ghost'} small`}
                  onClick={() => setSessionType('chat')}
                >
                  <MessageCircle size={14} />
                  Chat Only
                </button>
              </div>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Duration</label>
              <select style={{ marginTop: 'var(--space-2)' }}>
                <option value="30">30 minutes - ${selectedMentor.hourlyRate / 2}</option>
                <option value="60">60 minutes - ${selectedMentor.hourlyRate}</option>
                <option value="90">90 minutes - ${selectedMentor.hourlyRate * 1.5}</option>
              </select>
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Preferred Date & Time</label>
              <input 
                type="datetime-local" 
                style={{ marginTop: 'var(--space-2)' }}
              />
            </div>
            
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label>Session Topic</label>
              <textarea 
                placeholder="What would you like to discuss?"
                style={{ marginTop: 'var(--space-2)', minHeight: '80px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'flex-end' }}>
              <button 
                className="btn secondary"
                onClick={() => {setBookingModal(false); setSelectedMentor(null);}}
              >
                Cancel
              </button>
              <button 
                className="btn primary"
                onClick={() => bookSession(selectedMentor.id, { sessionType, duration: 60 })}
              >
                <DollarSign size={14} />
                Book & Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}