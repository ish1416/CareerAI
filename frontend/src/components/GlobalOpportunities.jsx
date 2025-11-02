import React, { useState, useEffect } from 'react';
import { Globe, MapPin, Plane, FileText, CheckCircle, AlertCircle, TrendingUp } from 'lucide-react';
import api from '../utils/api.js';

export default function GlobalOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [visaInfo, setVisaInfo] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [readinessScore, setReadinessScore] = useState(null);

  useEffect(() => {
    loadOpportunities();
    loadReadinessScore();
  }, []);

  const loadOpportunities = async () => {
    try {
      const { data } = await api.get('/global-opportunities/jobs');
      setOpportunities(data.opportunities);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    }
  };

  const loadReadinessScore = async () => {
    try {
      const { data } = await api.get('/global-opportunities/readiness');
      setReadinessScore(data);
    } catch (error) {
      console.error('Failed to load readiness score:', error);
    }
  };

  const checkVisaEligibility = async (country) => {
    try {
      const { data } = await api.post('/global-opportunities/visa-check', { country });
      setVisaInfo(data);
      setSelectedCountry(country);
    } catch (error) {
      console.error('Failed to check visa eligibility:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Globe size={32} color="var(--primary)" />
        <div>
          <h1>Global Opportunities</h1>
          <p style={{ color: 'var(--text-soft)' }}>Explore international career opportunities and visa guidance</p>
        </div>
      </div>

      {/* Relocation Readiness Score */}
      {readinessScore && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, var(--success) 0%, var(--primary) 100%)', color: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold' }}>{readinessScore.score}</div>
            <div>
              <h3 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>Relocation Readiness Score</h3>
              <p style={{ opacity: 0.9 }}>{readinessScore.level} - {readinessScore.description}</p>
            </div>
            <Plane size={32} style={{ opacity: 0.8 }} />
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
        {/* Global Job Opportunities */}
        <div>
          <h3>International Job Opportunities</h3>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {opportunities.map((job, idx) => (
              <div key={idx} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-3)' }}>
                  <div>
                    <h4>{job.title}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                      <MapPin size={16} color="var(--text-soft)" />
                      <span style={{ color: 'var(--text-soft)' }}>{job.location}</span>
                      <span style={{ 
                        padding: 'var(--space-1) var(--space-2)', 
                        borderRadius: 'var(--radius)', 
                        background: 'var(--primary-light)', 
                        color: 'var(--primary)',
                        fontSize: 'var(--text-xs)'
                      }}>
                        {job.visaSponsorship ? 'Visa Sponsored' : 'Local Only'}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{job.company}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      {job.salary}
                    </div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      Match: {job.match}%
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                  {job.skills.slice(0, 3).map((skill, skillIdx) => (
                    <span key={skillIdx} style={{ 
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
                  <button className="btn primary small">Apply Now</button>
                  <button 
                    className="btn ghost small"
                    onClick={() => checkVisaEligibility(job.country)}
                  >
                    Check Visa
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Visa Information & Country Insights */}
        <div>
          <h3>Visa & Migration Guide</h3>
          
          {visaInfo && (
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h4>{selectedCountry} Visa Information</h4>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {visaInfo.eligible ? (
                  <CheckCircle size={20} color="var(--success)" />
                ) : (
                  <AlertCircle size={20} color="var(--error)" />
                )}
                <span style={{ 
                  color: visaInfo.eligible ? 'var(--success)' : 'var(--error)',
                  fontWeight: 600
                }}>
                  {visaInfo.eligible ? 'Eligible' : 'Not Eligible'}
                </span>
              </div>
              
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Recommended Visa Type:
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                  {visaInfo.recommendedVisa}
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Processing Time:
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                  {visaInfo.processingTime}
                </div>
              </div>
              
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: 'var(--space-1)' }}>
                  Requirements:
                </div>
                <ul style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', paddingLeft: 'var(--space-4)' }}>
                  {visaInfo.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
              
              <button className="btn primary small">
                <FileText size={14} />
                Start Application
              </button>
            </div>
          )}

          {/* Country Demand Insights */}
          <div className="card">
            <h4>Market Demand Insights</h4>
            
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {[
                { country: 'Canada', demand: 'High', growth: '+15%', color: 'var(--success)' },
                { country: 'Germany', demand: 'Medium', growth: '+8%', color: 'var(--warning)' },
                { country: 'Australia', demand: 'High', growth: '+12%', color: 'var(--success)' },
                { country: 'Singapore', demand: 'Medium', growth: '+6%', color: 'var(--warning)' }
              ].map((country, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{country.country}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      Demand: {country.demand}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                    <TrendingUp size={16} color={country.color} />
                    <span style={{ color: country.color, fontSize: 'var(--text-sm)', fontWeight: 600 }}>
                      {country.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Migration Path Suggestions */}
          <div className="card" style={{ marginTop: 'var(--space-4)' }}>
            <h4>Suggested Migration Paths</h4>
            
            <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
              {[
                'Study → Work Permit → PR',
                'Skilled Worker Visa → PR',
                'Intra-company Transfer',
                'Startup Visa Program'
              ].map((path, idx) => (
                <div key={idx} style={{ 
                  padding: 'var(--space-2)', 
                  borderRadius: 'var(--radius)', 
                  background: 'var(--muted)',
                  fontSize: 'var(--text-sm)'
                }}>
                  {path}
                </div>
              ))}
            </div>
            
            <button className="btn ghost small" style={{ marginTop: 'var(--space-3)' }}>
              Get Personalized Path
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}