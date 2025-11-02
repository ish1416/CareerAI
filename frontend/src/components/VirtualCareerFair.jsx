import React, { useState, useEffect, useRef } from 'react';
import { Users, Video, MessageCircle, MapPin, Calendar, Star, Zap } from 'lucide-react';
import api from '../utils/api.js';

export default function VirtualCareerFair() {
  const [fairEvents, setFairEvents] = useState([]);
  const [activeFair, setActiveFair] = useState(null);
  const [booths, setBooths] = useState([]);
  const [currentBooth, setCurrentBooth] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userPosition, setUserPosition] = useState({ x: 50, y: 50 });
  const [isInCall, setIsInCall] = useState(false);
  
  const canvasRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    loadFairEvents();
  }, []);

  useEffect(() => {
    if (activeFair) {
      loadBooths(activeFair.id);
      initializeVirtualEnvironment();
    }
  }, [activeFair]);

  const loadFairEvents = async () => {
    try {
      const { data } = await api.get('/virtual-fair/events');
      setFairEvents(data.events);
    } catch (error) {
      console.error('Failed to load fair events:', error);
    }
  };

  const loadBooths = async (fairId) => {
    try {
      const { data } = await api.get(`/virtual-fair/${fairId}/booths`);
      setBooths(data.booths);
    } catch (error) {
      console.error('Failed to load booths:', error);
    }
  };

  const initializeVirtualEnvironment = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 600;
    
    // Draw virtual environment
    drawEnvironment(ctx);
  };

  const drawEnvironment = (ctx) => {
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw floor
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw booths
    booths.forEach((booth, index) => {
      const x = (index % 4) * 200 + 50;
      const y = Math.floor(index / 4) * 150 + 50;
      
      // Booth background
      ctx.fillStyle = booth.color || '#3b82f6';
      ctx.fillRect(x, y, 150, 100);
      
      // Booth label
      ctx.fillStyle = 'white';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(booth.company, x + 75, y + 30);
      ctx.fillText(`${booth.visitors} visitors`, x + 75, y + 50);
    });
    
    // Draw user avatar
    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(userPosition.x, userPosition.y, 10, 0, 2 * Math.PI);
    ctx.fill();
  };

  const moveUser = (event) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    setUserPosition({ x, y });
    
    // Check if user is near a booth
    booths.forEach((booth, index) => {
      const boothX = (index % 4) * 200 + 50;
      const boothY = Math.floor(index / 4) * 150 + 50;
      
      if (x >= boothX && x <= boothX + 150 && y >= boothY && y <= boothY + 100) {
        setCurrentBooth(booth);
      }
    });
  };

  const joinFair = async (fairId) => {
    try {
      const { data } = await api.post(`/virtual-fair/${fairId}/join`);
      setActiveFair(data.fair);
    } catch (error) {
      console.error('Failed to join fair:', error);
    }
  };

  const startVideoCall = async (boothId) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsInCall(true);
      
      // Notify backend about video call
      await api.post(`/virtual-fair/booth/${boothId}/video-call`);
    } catch (error) {
      console.error('Failed to start video call:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !currentBooth) return;
    
    try {
      await api.post(`/virtual-fair/booth/${currentBooth.id}/message`, {
        message: newMessage
      });
      
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        user: 'You',
        message: newMessage,
        timestamp: new Date().toLocaleTimeString()
      }]);
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  useEffect(() => {
    if (canvasRef.current) {
      drawEnvironment(canvasRef.current.getContext('2d'));
    }
  }, [booths, userPosition]);

  if (!activeFair) {
    return (
      <div className="main-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
          <Users size={32} color="var(--primary)" />
          <div>
            <h1>Virtual Career Fair</h1>
            <p style={{ color: 'var(--text-soft)' }}>Join immersive 3D career fairs and connect with recruiters</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
          {fairEvents.map(fair => (
            <div key={fair.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-3)' }}>
                <div>
                  <h4>{fair.title}</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    <Calendar size={16} color="var(--text-soft)" />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{fair.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Users size={16} color="var(--text-soft)" />
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{fair.attendees} attendees</span>
                  </div>
                </div>
                <div style={{ 
                  padding: 'var(--space-1) var(--space-2)', 
                  borderRadius: 'var(--radius)', 
                  background: fair.status === 'live' ? 'var(--success-bg)' : 'var(--warning-bg)',
                  color: fair.status === 'live' ? 'var(--success)' : 'var(--warning)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600
                }}>
                  {fair.status}
                </div>
              </div>
              
              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{fair.description}</p>
              
              <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {fair.companies.slice(0, 3).map((company, idx) => (
                  <span key={idx} style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    borderRadius: 'var(--radius)', 
                    background: 'var(--muted)', 
                    fontSize: 'var(--text-xs)'
                  }}>
                    {company}
                  </span>
                ))}
                {fair.companies.length > 3 && (
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>
                    +{fair.companies.length - 3} more
                  </span>
                )}
              </div>
              
              <button 
                className="btn primary"
                onClick={() => joinFair(fair.id)}
                disabled={fair.status !== 'live'}
              >
                {fair.status === 'live' ? 'Join Fair' : 'Coming Soon'}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <h2>{activeFair.title}</h2>
        <button className="btn secondary" onClick={() => setActiveFair(null)}>
          Leave Fair
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-4)' }}>
        {/* Virtual Environment */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <canvas
              ref={canvasRef}
              onClick={moveUser}
              style={{ width: '100%', height: '600px', cursor: 'pointer' }}
            />
          </div>
          
          <div style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
            Click anywhere to move around the fair. Walk near booths to interact with recruiters.
          </div>
        </div>

        {/* Interaction Panel */}
        <div>
          {currentBooth ? (
            <div>
              <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <h4>{currentBooth.company}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                  {currentBooth.description}
                </p>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <Users size={16} color="var(--text-soft)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{currentBooth.visitors} visitors</span>
                  <Star size={16} color="var(--warning)" />
                  <span style={{ fontSize: 'var(--text-sm)' }}>{currentBooth.rating}</span>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn primary small"
                    onClick={() => startVideoCall(currentBooth.id)}
                  >
                    <Video size={14} />
                    Video Call
                  </button>
                  <button className="btn ghost small">
                    <MessageCircle size={14} />
                    Chat
                  </button>
                </div>
              </div>

              {/* Video Call */}
              {isInCall && (
                <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                  <h5>Video Call with {currentBooth.company}</h5>
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    style={{ width: '100%', height: '200px', borderRadius: 'var(--radius)' }}
                  />
                  <button 
                    className="btn secondary small"
                    onClick={() => setIsInCall(false)}
                    style={{ marginTop: 'var(--space-2)' }}
                  >
                    End Call
                  </button>
                </div>
              )}

              {/* Chat */}
              <div className="card">
                <h5>Chat with {currentBooth.company}</h5>
                <div style={{ 
                  height: '200px', 
                  overflowY: 'auto', 
                  border: '1px solid var(--border)', 
                  borderRadius: 'var(--radius)',
                  padding: 'var(--space-2)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {chatMessages.map(msg => (
                    <div key={msg.id} style={{ marginBottom: 'var(--space-2)' }}>
                      <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                        {msg.user} <span style={{ color: 'var(--text-soft)', fontWeight: 400 }}>{msg.timestamp}</span>
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)' }}>{msg.message}</div>
                    </div>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    style={{ flex: 1 }}
                  />
                  <button className="btn primary small" onClick={sendMessage}>
                    Send
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card">
              <div style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <MapPin size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
                <h4>Explore the Fair</h4>
                <p style={{ color: 'var(--text-soft)' }}>
                  Walk around and visit company booths to chat with recruiters and learn about opportunities.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}