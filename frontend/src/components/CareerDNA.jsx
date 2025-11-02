import React, { useState, useEffect } from 'react';
import { Dna, TrendingUp, Target, Brain, Zap, Award, Calendar, ArrowRight } from 'lucide-react';
import api from '../utils/api.js';

export default function CareerDNA() {
  const [dnaData, setDnaData] = useState(null);
  const [activeTab, setActiveTab] = useState('genome');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    loadDNAData();
  }, []);

  const loadDNAData = async () => {
    try {
      const { data } = await api.get('/career-dna/profile');
      setDnaData(data);
    } catch (error) {
      console.error('Failed to load DNA data:', error);
    }
  };

  const generateDNA = async () => {
    setIsAnalyzing(true);
    try {
      const { data } = await api.post('/career-dna/generate');
      setDnaData(data);
    } catch (error) {
      console.error('Failed to generate DNA:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!dnaData) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Dna size={64} color="var(--primary)" style={{ margin: '0 auto var(--space-4)' }} />
          <h1>AI Career DNA</h1>
          <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-6)' }}>
            Build your unique career fingerprint using AI analysis
          </p>
          <button 
            className="btn primary large" 
            onClick={generateDNA}
            disabled={isAnalyzing}
          >
            {isAnalyzing ? 'Analyzing...' : 'Generate My Career DNA'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Dna size={32} color="var(--primary)" />
        <div>
          <h1>Your Career DNA</h1>
          <p style={{ color: 'var(--text-soft)' }}>Personal Career Genome Analysis</p>
        </div>
      </div>

      {/* DNA Score */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-end) 100%)', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 'var(--space-4)' }}>
          <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold' }}>{dnaData.score}</div>
          <div>
            <h3 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>Career DNA Score</h3>
            <p style={{ opacity: 0.9 }}>{dnaData.classification}</p>
          </div>
          <button className="btn secondary" onClick={generateDNA}>
            Refresh DNA
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['genome', 'evolution', 'predictions', 'roadmap'].map(tab => (
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

      {/* Tab Content */}
      {activeTab === 'genome' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
          <div>
            <h3>Skill DNA</h3>
            {dnaData.skills.map((skill, idx) => (
              <div key={idx} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span style={{ fontWeight: 600 }}>{skill.name}</span>
                  <span style={{ color: 'var(--primary)' }}>{skill.level}%</span>
                </div>
                <div style={{ background: 'var(--muted)', borderRadius: 'var(--radius)', height: '8px' }}>
                  <div style={{ background: 'var(--primary)', height: '100%', borderRadius: 'var(--radius)', width: `${skill.level}%` }} />
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginTop: 'var(--space-1)' }}>
                  {skill.growth > 0 ? '+' : ''}{skill.growth}% this month
                </div>
              </div>
            ))}
          </div>
          
          <div>
            <h3>Personality Traits</h3>
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              {dnaData.traits.map((trait, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <Brain size={24} color="var(--success)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600 }}>{trait.name}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{trait.description}</div>
                    </div>
                    <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)' }}>
                      {trait.score}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'evolution' && (
        <div>
          <h3>Skill Evolution Timeline</h3>
          <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
              {dnaData.evolution.map((period, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                  <div style={{ minWidth: '100px', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    {period.date}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, marginBottom: 'var(--space-1)' }}>{period.milestone}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{period.description}</div>
                  </div>
                  <TrendingUp size={20} color="var(--success)" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'predictions' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
          {dnaData.predictions.map((prediction, idx) => (
            <div key={idx} className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <Target size={20} color="var(--primary)" />
                <h4>{prediction.role}</h4>
              </div>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Match Score</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--primary)' }}>
                  {prediction.match}%
                </div>
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                {prediction.reasoning}
              </div>
              <button className="btn ghost small">
                <ArrowRight size={14} />
                View Details
              </button>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'roadmap' && (
        <div>
          <h3>Personalized Career Roadmap</h3>
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {dnaData.roadmap.map((step, idx) => (
              <div key={idx} className="card">
                <div style={{ display: 'flex', alignItems: 'start', gap: 'var(--space-4)' }}>
                  <div style={{ 
                    minWidth: '40px', 
                    height: '40px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 'bold'
                  }}>
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h4>{step.title}</h4>
                    <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>{step.description}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Calendar size={16} color="var(--text-soft)" />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{step.timeline}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                        <Zap size={16} color="var(--warning)" />
                        <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{step.priority}</span>
                      </div>
                    </div>
                  </div>
                  <button className="btn primary small">Start</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}