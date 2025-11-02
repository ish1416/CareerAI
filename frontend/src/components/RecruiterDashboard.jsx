import React, { useState, useEffect } from 'react';
import { Plus, Search, Users, Briefcase, Eye, Star } from 'lucide-react';
import api from '../utils/api.js';

export default function RecruiterDashboard() {
  const [activeTab, setActiveTab] = useState('jobs');
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [showJobForm, setShowJobForm] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [jobsRes, candidatesRes] = await Promise.all([
        api.get('/network/recruiter/jobs').catch(() => ({ data: { jobs: [] } })),
        api.get('/network/recruiter/candidates').catch(() => ({ data: { candidates: [] } }))
      ]);
      
      setJobs(jobsRes.data.jobs);
      setCandidates(candidatesRes.data.candidates);
    } catch (error) {
      console.error('Failed to load recruiter data:', error);
    }
  };

  const JobForm = () => (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <h3>Post New Job</h3>
      <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
        <input placeholder="Job Title" />
        <input placeholder="Location" />
        <input placeholder="Salary Range" />
        <textarea placeholder="Job Description" rows={4} />
        <textarea placeholder="Requirements" rows={3} />
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn primary">Post Job</button>
          <button className="btn ghost" onClick={() => setShowJobForm(false)}>Cancel</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>Recruiter Dashboard</h1>
      
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{jobs.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Active Jobs</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Users size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>127</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Total Applicants</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Eye size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>1.2k</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Profile Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['jobs', 'candidates', 'analytics'].map(tab => (
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

      {/* Jobs Tab */}
      {activeTab === 'jobs' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>My Job Posts</h3>
            <button className="btn primary" onClick={() => setShowJobForm(true)}>
              <Plus size={16} />
              Post Job
            </button>
          </div>

          {showJobForm && <JobForm />}
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {jobs.map(job => (
              <div key={job.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h4>{job.title}</h4>
                    <p style={{ color: 'var(--text-soft)', margin: 'var(--space-1) 0' }}>{job.company} • {job.location}</p>
                    <p style={{ color: 'var(--primary)', fontWeight: 'bold', margin: 0 }}>{job.salary}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{job.applicants}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>applicants</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>{job.posted}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  <button className="btn ghost small">View Applicants</button>
                  <button className="btn ghost small">Edit</button>
                  <button className="btn ghost small">Analytics</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Candidate Search</h3>
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 'var(--space-2)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
              <input 
                type="text" 
                placeholder="Search by skills, location..." 
                style={{ paddingLeft: 'var(--space-8)', width: '300px' }}
              />
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            {candidates.map(candidate => (
              <div key={candidate.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {candidate.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{candidate.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{candidate.title}</p>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-xs)' }}>{candidate.location}</p>
                  </div>
                </div>
                
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontSize: 'var(--text-sm)' }}>ATS Score</span>
                    <span style={{ fontSize: 'var(--text-sm)', fontWeight: 'bold', color: 'var(--success)' }}>{candidate.atsScore}%</span>
                  </div>
                  <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '4px' }}>
                    <div style={{ background: 'var(--success)', height: '100%', borderRadius: 'var(--radius)', width: `${candidate.atsScore}%` }} />
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {candidate.skills.slice(0, 3).map(skill => (
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
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn primary small">View Profile</button>
                  <button className="btn ghost small">
                    <Star size={14} />
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          <h3>Recruitment Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4>Application Trends</h4>
              <div style={{ height: '200px', background: 'var(--muted)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-soft)' }}>Chart placeholder</span>
              </div>
            </div>
            
            <div className="card">
              <h4>Top Skills in Demand</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {['JavaScript', 'React', 'Python', 'Node.js', 'AWS'].map((skill, idx) => (
                  <div key={skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>{skill}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: '60px', height: '4px', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                        <div style={{ width: `${(5-idx) * 20}%`, height: '100%', background: 'var(--primary)', borderRadius: 'var(--radius)' }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{(5-idx) * 20}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}