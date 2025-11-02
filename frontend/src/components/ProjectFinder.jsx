import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Trophy, Users, Plus, Star, Clock } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function ProjectFinder() {
  const [internships, setInternships] = useState([]);
  const [hackathons, setHackathons] = useState([]);
  const [teams, setTeams] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [matches, setMatches] = useState([]);
  const [activeTab, setActiveTab] = useState('internships');
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [internshipsRes, hackathonsRes, teamsRes, certificationsRes] = await Promise.all([
        api.get('/projects/internships').catch(() => ({ data: { internships: [] } })),
        api.get('/projects/hackathons').catch(() => ({ data: { hackathons: [] } })),
        api.get('/projects/teams').catch(() => ({ data: { teams: [] } })),
        api.get('/projects/certifications').catch(() => ({ data: { certifications: [] } }))
      ]);
      
      setInternships(internshipsRes.data.internships);
      setHackathons(hackathonsRes.data.hackathons);
      setTeams(teamsRes.data.teams);
      setCertifications(certificationsRes.data.certifications);
    } catch (error) {
      console.error('Failed to load project data:', error);
    }
  };

  const findMatches = async () => {
    try {
      const { data } = await api.post('/projects/match', {
        skills: ['JavaScript', 'React', 'Node.js'],
        interests: ['Web Development', 'AI'],
        experience: 'Intermediate'
      });
      setMatches(data.matches);
      showToast('AI matches found!', 'success');
    } catch (error) {
      showToast('Failed to find matches', 'error');
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1>Project & Opportunity Finder</h1>
        <button className="btn primary" onClick={findMatches}>
          <Search size={16} />
          AI Match Projects
        </button>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['internships', 'hackathons', 'teams', 'certifications', 'matches'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-soft)',
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Internships Tab */}
      {activeTab === 'internships' && (
        <div>
          <h3>Available Internships</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
            {internships.map(internship => (
              <div key={internship.id} className="card">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <h4>{internship.title}</h4>
                  <p style={{ fontSize: 'var(--text-lg)', fontWeight: '500', color: 'var(--primary)' }}>
                    {internship.company}
                  </p>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <MapPin size={16} color="var(--text-soft)" />
                    <span>{internship.location}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Clock size={16} color="var(--text-soft)" />
                    <span>{internship.duration}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <Star size={16} color="var(--text-soft)" />
                    <span>{internship.stipend}</span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {internship.skills.map(skill => (
                    <span key={skill} style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-xs)' 
                    }}>
                      {skill}
                    </span>
                  ))}
                </div>
                
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                  {internship.description}
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    Deadline: {internship.deadline}
                  </span>
                  <button className="btn primary small">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hackathons Tab */}
      {activeTab === 'hackathons' && (
        <div>
          <h3>Upcoming Hackathons</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
            {hackathons.map(hackathon => (
              <div key={hackathon.id} className="card">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <h4>{hackathon.name}</h4>
                  <p style={{ color: 'var(--text-soft)' }}>by {hackathon.organizer}</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Date</div>
                    <div>{hackathon.startDate} - {hackathon.endDate}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Prize</div>
                    <div style={{ fontWeight: 'bold', color: 'var(--success)' }}>{hackathon.prize}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Location</div>
                    <div>{hackathon.location}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Participants</div>
                    <div>{hackathon.participants}</div>
                  </div>
                </div>
                
                <div style={{ 
                  padding: 'var(--space-3)', 
                  background: 'var(--muted)', 
                  borderRadius: 'var(--radius)', 
                  marginBottom: 'var(--space-3)' 
                }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                    Theme
                  </div>
                  <div style={{ fontWeight: '500' }}>{hackathon.theme}</div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    Register by: {hackathon.registrationDeadline}
                  </span>
                  <button className="btn primary small">Register</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Teams Tab */}
      {activeTab === 'teams' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Find Teammates</h3>
            <button className="btn primary">
              <Plus size={16} />
              Create Team
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: 'var(--space-4)' }}>
            {teams.map(team => (
              <div key={team.id} className="card">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <h4>{team.name}</h4>
                  <p style={{ color: 'var(--text-soft)' }}>{team.description}</p>
                </div>
                
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                    Looking for:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {team.lookingFor.map(role => (
                      <span key={role} style={{ 
                        padding: 'var(--space-1) var(--space-2)', 
                        background: 'var(--warning-light)', 
                        color: 'var(--warning)',
                        borderRadius: 'var(--radius)', 
                        fontSize: 'var(--text-xs)' 
                      }}>
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                    Skills needed:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {team.skills.map(skill => (
                      <span key={skill} style={{ 
                        padding: 'var(--space-1) var(--space-2)', 
                        background: 'var(--muted)', 
                        borderRadius: 'var(--radius)', 
                        fontSize: 'var(--text-xs)' 
                      }}>
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Users size={16} color="var(--text-soft)" />
                      <span style={{ fontSize: 'var(--text-sm)' }}>
                        {team.members}/{team.maxMembers} members
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>
                      {team.stage}
                    </div>
                  </div>
                  <button className="btn primary small">Join Team</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications Tab */}
      {activeTab === 'certifications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Certification Tracker</h3>
            <button className="btn primary">
              <Plus size={16} />
              Add Certification
            </button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {certifications.map(cert => (
              <div key={cert.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4>{cert.name}</h4>
                    <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>
                      {cert.provider}
                    </p>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-2)' }}>
                      {cert.skills.map(skill => (
                        <span key={skill} style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          background: 'var(--primary-light)', 
                          color: 'var(--primary)',
                          borderRadius: 'var(--radius)', 
                          fontSize: 'var(--text-xs)' 
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-sm)',
                      background: cert.status === 'completed' ? 'var(--success-light)' : 
                                 cert.status === 'in-progress' ? 'var(--warning-light)' : 'var(--muted)',
                      color: cert.status === 'completed' ? 'var(--success)' : 
                             cert.status === 'in-progress' ? 'var(--warning)' : 'var(--text-soft)',
                      textTransform: 'capitalize'
                    }}>
                      {cert.status.replace('-', ' ')}
                    </span>
                    
                    {cert.status === 'in-progress' && (
                      <div style={{ marginTop: 'var(--space-2)' }}>
                        <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                          Progress: {cert.progress}%
                        </div>
                        <div style={{ width: '100px', height: '4px', background: 'var(--muted)', borderRadius: 'var(--radius)', marginTop: 'var(--space-1)' }}>
                          <div style={{ width: `${cert.progress}%`, height: '100%', background: 'var(--primary)', borderRadius: 'var(--radius)' }} />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
                  {cert.completedDate && (
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Completed</div>
                      <div>{cert.completedDate}</div>
                    </div>
                  )}
                  {cert.expiryDate && (
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Expires</div>
                      <div>{cert.expiryDate}</div>
                    </div>
                  )}
                  {cert.targetDate && (
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Target Date</div>
                      <div>{cert.targetDate}</div>
                    </div>
                  )}
                  {cert.credentialId && (
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Credential ID</div>
                      <div style={{ fontSize: 'var(--text-sm)', fontFamily: 'monospace' }}>{cert.credentialId}</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Matches Tab */}
      {activeTab === 'matches' && (
        <div>
          <h3>AI Project Matches</h3>
          {matches.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <Search size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4>No matches yet</h4>
              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
                Click "AI Match Projects" to find projects that match your skills and interests
              </p>
              <button className="btn primary" onClick={findMatches}>
                <Search size={16} />
                Find Matches
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
              {matches.map((match, idx) => (
                <div key={idx} className="card">
                  <h4>{match.title}</h4>
                  <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                    {match.description}
                  </p>
                  
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                      Skills required:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                      {match.skills.map(skill => (
                        <span key={skill} style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          background: 'var(--primary-light)', 
                          color: 'var(--primary)',
                          borderRadius: 'var(--radius)', 
                          fontSize: 'var(--text-xs)' 
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                        {match.type} • {match.difficulty}
                      </div>
                    </div>
                    <button className="btn primary small">Start Project</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}