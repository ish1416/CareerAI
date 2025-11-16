import React, { useState } from 'react';
import { Dna, TrendingUp, Target, Brain, Zap, Award, Calendar, ArrowRight, Sparkles, BarChart3 } from 'lucide-react';

export default function ProCareerDNA() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeSection, setActiveSection] = useState('genome');
  
  const dnaData = {
    score: 92,
    classification: 'Elite Performer',
    skills: [
      { name: 'JavaScript', level: 95, growth: 8, category: 'technical' },
      { name: 'React', level: 92, growth: 12, category: 'technical' },
      { name: 'Leadership', level: 78, growth: 15, category: 'soft' },
      { name: 'Problem Solving', level: 88, growth: 5, category: 'cognitive' }
    ],
    traits: [
      { name: 'Innovation', score: 94, description: 'Exceptional creative thinking and solution design' },
      { name: 'Collaboration', score: 87, description: 'Strong team player with excellent communication' },
      { name: 'Adaptability', score: 91, description: 'Thrives in changing environments and new challenges' },
      { name: 'Technical Depth', score: 89, description: 'Deep understanding of complex technical concepts' }
    ],
    predictions: [
      { role: 'Senior Software Engineer', match: 96, timeframe: '6-12 months', confidence: 'high' },
      { role: 'Tech Lead', match: 84, timeframe: '1-2 years', confidence: 'high' },
      { role: 'Engineering Manager', match: 72, timeframe: '2-3 years', confidence: 'medium' }
    ],
    roadmap: [
      { 
        title: 'Master System Design', 
        description: 'Deepen your understanding of scalable architecture patterns',
        timeline: '3 months',
        priority: 'high',
        progress: 65
      },
      { 
        title: 'Develop Leadership Skills', 
        description: 'Take on mentoring responsibilities and lead small projects',
        timeline: '6 months',
        priority: 'medium',
        progress: 30
      },
      { 
        title: 'Cloud Architecture Certification', 
        description: 'Get AWS Solutions Architect certification',
        timeline: '4 months',
        priority: 'high',
        progress: 0
      }
    ]
  };

  const sections = [
    { id: 'genome', label: 'DNA Genome', icon: Dna },
    { id: 'evolution', label: 'Skill Evolution', icon: TrendingUp },
    { id: 'predictions', label: 'Career Predictions', icon: Target },
    { id: 'roadmap', label: 'Growth Roadmap', icon: ArrowRight }
  ];

  const generateDNA = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  const renderGenome = () => (
    <div className="pro-dna-genome">
      <div className="pro-dna-visualization">
        <div className="pro-dna-helix">
          <div className="pro-dna-strand">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="pro-dna-base" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="pro-dna-pair"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="pro-dna-info">
          <div className="pro-dna-score-large">{dnaData.score}</div>
          <div className="pro-dna-classification">{dnaData.classification}</div>
          <div className="pro-dna-description">
            Your unique career fingerprint based on skills, traits, and potential
          </div>
        </div>
      </div>

      <div className="pro-genome-grid">
        <div className="pro-genome-section">
          <h3>Skill DNA</h3>
          <div className="pro-skills-dna">
            {dnaData.skills.map((skill) => (
              <div key={skill.name} className="pro-skill-dna-item">
                <div className="pro-skill-dna-header">
                  <span className="pro-skill-name">{skill.name}</span>
                  <div className="pro-skill-badges">
                    <span className={`pro-skill-category ${skill.category}`}>
                      {skill.category}
                    </span>
                    <span className="pro-skill-level">{skill.level}%</span>
                  </div>
                </div>
                <div className="pro-skill-progress">
                  <div 
                    className="pro-skill-fill" 
                    style={{ width: `${skill.level}%` }}
                  ></div>
                </div>
                <div className="pro-skill-growth">
                  <TrendingUp size={12} />
                  <span>+{skill.growth}% this month</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-genome-section">
          <h3>Personality Traits</h3>
          <div className="pro-traits-dna">
            {dnaData.traits.map((trait) => (
              <div key={trait.name} className="pro-trait-dna-item">
                <div className="pro-trait-header">
                  <div className="pro-trait-icon">
                    <Brain size={20} />
                  </div>
                  <div className="pro-trait-info">
                    <span className="pro-trait-name">{trait.name}</span>
                    <span className="pro-trait-score">{trait.score}</span>
                  </div>
                </div>
                <p className="pro-trait-description">{trait.description}</p>
                <div className="pro-trait-bar">
                  <div 
                    className="pro-trait-fill" 
                    style={{ width: `${trait.score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvolution = () => (
    <div className="pro-dna-evolution">
      <div className="pro-evolution-header">
        <h3>Skill Evolution Timeline</h3>
        <p>Track your professional growth over time</p>
      </div>

      <div className="pro-evolution-chart">
        <div className="pro-evolution-timeline">
          {[
            { date: 'Jan 2024', milestone: 'React Mastery', description: 'Achieved advanced React proficiency', type: 'skill' },
            { date: 'Mar 2024', milestone: 'Team Leadership', description: 'Led first cross-functional project', type: 'leadership' },
            { date: 'May 2024', milestone: 'System Design', description: 'Designed scalable microservices architecture', type: 'technical' },
            { date: 'Jul 2024', milestone: 'Mentoring Program', description: 'Started mentoring junior developers', type: 'leadership' },
            { date: 'Sep 2024', milestone: 'AI Integration', description: 'Implemented ML models in production', type: 'innovation' }
          ].map((event, index) => (
            <div key={index} className="pro-evolution-event">
              <div className="pro-evolution-date">{event.date}</div>
              <div className="pro-evolution-connector">
                <div className={`pro-evolution-dot ${event.type}`}></div>
                <div className="pro-evolution-line"></div>
              </div>
              <div className="pro-evolution-content">
                <h4>{event.milestone}</h4>
                <p>{event.description}</p>
                <span className={`pro-evolution-type ${event.type}`}>
                  {event.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="pro-dna-predictions">
      <div className="pro-predictions-header">
        <h3>AI Career Predictions</h3>
        <p>Personalized career path recommendations based on your DNA profile</p>
      </div>

      <div className="pro-predictions-grid">
        {dnaData.predictions.map((prediction, index) => (
          <div key={prediction.role} className="pro-prediction-card">
            <div className="pro-prediction-rank">#{index + 1}</div>
            <div className="pro-prediction-content">
              <h4>{prediction.role}</h4>
              <div className="pro-prediction-metrics">
                <div className="pro-prediction-match">
                  <span className="pro-match-label">Match Score</span>
                  <div className="pro-match-circle">
                    <span>{prediction.match}%</span>
                  </div>
                </div>
                <div className="pro-prediction-timeline">
                  <Calendar size={16} />
                  <span>{prediction.timeframe}</span>
                </div>
                <div className={`pro-prediction-confidence ${prediction.confidence}`}>
                  <Zap size={16} />
                  <span>{prediction.confidence} confidence</span>
                </div>
              </div>
              <button className="pro-btn-ghost">
                <Target size={14} />
                View Path
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="pro-prediction-insights">
        <div className="pro-insight-card">
          <Sparkles size={24} />
          <div>
            <h4>Key Insight</h4>
            <p>Your technical skills and leadership potential make you an ideal candidate for senior engineering roles. Focus on system design to accelerate your growth.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRoadmap = () => (
    <div className="pro-dna-roadmap">
      <div className="pro-roadmap-header">
        <h3>Personalized Growth Roadmap</h3>
        <p>AI-curated action plan to achieve your career goals</p>
      </div>

      <div className="pro-roadmap-list">
        {dnaData.roadmap.map((step, index) => (
          <div key={index} className="pro-roadmap-item">
            <div className="pro-roadmap-number">{index + 1}</div>
            <div className="pro-roadmap-content">
              <div className="pro-roadmap-header-item">
                <h4>{step.title}</h4>
                <div className="pro-roadmap-badges">
                  <span className={`pro-priority ${step.priority}`}>
                    {step.priority} priority
                  </span>
                  <span className="pro-timeline">
                    <Calendar size={14} />
                    {step.timeline}
                  </span>
                </div>
              </div>
              <p className="pro-roadmap-description">{step.description}</p>
              <div className="pro-roadmap-progress">
                <div className="pro-progress-info">
                  <span>Progress: {step.progress}%</span>
                </div>
                <div className="pro-progress-bar">
                  <div 
                    className="pro-progress-fill" 
                    style={{ width: `${step.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="pro-roadmap-actions">
                <button className="pro-btn-primary">
                  {step.progress === 0 ? 'Start' : 'Continue'}
                </button>
                <button className="pro-btn-ghost">View Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Dna size={32} />
          </div>
          <div>
            <h1 className="pro-title">Career DNA</h1>
            <p className="pro-subtitle">Your unique professional genetic code</p>
          </div>
        </div>
        <button 
          className="pro-btn-primary"
          onClick={generateDNA}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? (
            <>
              <div className="pro-spinner"></div>
              Analyzing...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              Regenerate DNA
            </>
          )}
        </button>
      </div>

      {/* DNA Score Banner */}
      <div className="pro-dna-banner">
        <div className="pro-dna-score-section">
          <div className="pro-dna-score-circle">
            <span className="pro-score-number">{dnaData.score}</span>
            <span className="pro-score-suffix">/100</span>
          </div>
          <div className="pro-dna-score-info">
            <h2>{dnaData.classification}</h2>
            <p>Elite-level career DNA with exceptional growth potential</p>
          </div>
        </div>
        <div className="pro-dna-stats">
          <div className="pro-dna-stat">
            <BarChart3 size={20} />
            <div>
              <span className="pro-stat-value">4.8/5</span>
              <span className="pro-stat-label">Skill Diversity</span>
            </div>
          </div>
          <div className="pro-dna-stat">
            <TrendingUp size={20} />
            <div>
              <span className="pro-stat-value">+23%</span>
              <span className="pro-stat-label">Growth Rate</span>
            </div>
          </div>
          <div className="pro-dna-stat">
            <Target size={20} />
            <div>
              <span className="pro-stat-value">89%</span>
              <span className="pro-stat-label">Market Fit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="pro-nav-tabs">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <button
              key={section.id}
              className={`pro-nav-tab ${activeSection === section.id ? 'active' : ''}`}
              onClick={() => setActiveSection(section.id)}
            >
              <Icon size={16} />
              <span>{section.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeSection === 'genome' && renderGenome()}
        {activeSection === 'evolution' && renderEvolution()}
        {activeSection === 'predictions' && renderPredictions()}
        {activeSection === 'roadmap' && renderRoadmap()}
      </div>
    </div>
  );
}