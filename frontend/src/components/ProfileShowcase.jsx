import React, { useState, useEffect } from 'react';
import { MapPin, Briefcase, Users, Edit, Share, Eye, EyeOff } from 'lucide-react';
import api from '../utils/api.js';

export default function ProfileShowcase({ userId, isOwnProfile = false }) {
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const { data } = await api.get(`/network/profile/${userId || 'me'}`);
      setProfile(data.profile);
      setFormData(data.profile);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleSave = async () => {
    try {
      await api.put('/network/profile', formData);
      setProfile(formData);
      setEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (!profile) return <div>Loading...</div>;

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      {/* Header */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-4)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
            <div style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: 'var(--primary)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white',
              fontSize: 'var(--text-2xl)',
              fontWeight: 'bold'
            }}>
              {profile.name.charAt(0)}
            </div>
            <div>
              {editing ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                  <input 
                    value={formData.name} 
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}
                  />
                  <input 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="Professional title"
                  />
                </div>
              ) : (
                <>
                  <h1 style={{ margin: 0, marginBottom: 'var(--space-1)' }}>{profile.name}</h1>
                  <p style={{ margin: 0, fontSize: 'var(--text-lg)', color: 'var(--text-soft)' }}>{profile.title}</p>
                </>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
                <MapPin size={16} color="var(--text-soft)" />
                <span style={{ color: 'var(--text-soft)' }}>{profile.location}</span>
              </div>
            </div>
          </div>
          
          {isOwnProfile && (
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              {editing ? (
                <>
                  <button className="btn ghost small" onClick={() => setEditing(false)}>Cancel</button>
                  <button className="btn primary small" onClick={handleSave}>Save</button>
                </>
              ) : (
                <>
                  <button className="btn ghost small">
                    <Share size={16} />
                    Share
                  </button>
                  <button className="btn ghost small" onClick={() => setEditing(true)}>
                    <Edit size={16} />
                    Edit
                  </button>
                  <button className="btn ghost small">
                    {profile.isPublic ? <Eye size={16} /> : <EyeOff size={16} />}
                    {profile.isPublic ? 'Public' : 'Private'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 'var(--space-6)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{profile.connections}</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Connections</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>24</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Posts</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>156</div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Profile Views</div>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Main Content */}
        <div>
          {/* About */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3>About</h3>
            {editing ? (
              <textarea 
                value={formData.bio} 
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                rows={4}
                placeholder="Tell people about yourself..."
                style={{ width: '100%', resize: 'vertical' }}
              />
            ) : (
              <p>{profile.bio}</p>
            )}
          </div>

          {/* Experience */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3>Experience</h3>
            {profile.experience.map((exp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: 'var(--radius)', 
                  background: 'var(--muted)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center'
                }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h4 style={{ margin: 0 }}>{exp.role}</h4>
                  <p style={{ margin: 0, color: 'var(--text-soft)' }}>{exp.company}</p>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{exp.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div>
          {/* Skills */}
          <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
            <h3>Skills</h3>
            {editing ? (
              <input 
                value={formData.skills?.join(', ')} 
                onChange={(e) => setFormData({...formData, skills: e.target.value.split(', ')})}
                placeholder="JavaScript, React, Node.js"
              />
            ) : (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                {profile.skills.map(skill => (
                  <span key={skill} style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    background: 'var(--primary-light)', 
                    color: 'var(--primary)',
                    borderRadius: 'var(--radius)', 
                    fontSize: 'var(--text-sm)' 
                  }}>
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Activity */}
          <div className="card">
            <h3>Recent Activity</h3>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
              <div style={{ marginBottom: 'var(--space-2)' }}>• Posted in React Developers forum</div>
              <div style={{ marginBottom: 'var(--space-2)' }}>• Connected with 3 new people</div>
              <div style={{ marginBottom: 'var(--space-2)' }}>• Updated resume</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}