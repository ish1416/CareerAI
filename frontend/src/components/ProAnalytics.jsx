import React, { useState } from 'react';
import { TrendingUp, DollarSign, MapPin, Brain, AlertTriangle, BarChart3, Target, Zap, Award, Users, Globe } from 'lucide-react';

export default function ProAnalytics() {
  const [activeView, setActiveView] = useState('overview');
  const [selectedMetric, setSelectedMetric] = useState('salary');

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'salary', label: 'Salary Insights', icon: DollarSign },
    { id: 'market', label: 'Market Trends', icon: TrendingUp },
    { id: 'predictions', label: 'AI Predictions', icon: Brain },
    { id: 'bias', label: 'Bias Analysis', icon: AlertTriangle }
  ];

  const salaryData = {
    averageSalary: 95000,
    percentile25: 75000,
    percentile50: 90000,
    percentile75: 120000,
    trend: '+12%',
    trendPeriod: 'vs last year',
    topCompanies: [
      { company: 'Google', avgSalary: 165000 },
      { company: 'Meta', avgSalary: 158000 },
      { company: 'Apple', avgSalary: 152000 },
      { company: 'Netflix', avgSalary: 148000 }
    ],
    skillPremium: [
      { skill: 'Machine Learning', premium: '+25%' },
      { skill: 'React', premium: '+18%' },
      { skill: 'AWS', premium: '+15%' },
      { skill: 'Python', premium: '+12%' }
    ]
  };

  const marketData = {
    regions: [
      { name: 'San Francisco', demand: 85, supply: 45, ratio: 1.9, avgSalary: 145000 },
      { name: 'New York', demand: 78, supply: 52, ratio: 1.5, avgSalary: 125000 },
      { name: 'Seattle', demand: 72, supply: 48, ratio: 1.5, avgSalary: 118000 },
      { name: 'Austin', demand: 68, supply: 55, ratio: 1.2, avgSalary: 95000 }
    ],
    skills: [
      { skill: 'AI/ML', demand: 92, growth: '+45%' },
      { skill: 'Cloud Computing', demand: 88, growth: '+38%' },
      { skill: 'Cybersecurity', demand: 85, growth: '+32%' },
      { skill: 'Data Science', demand: 82, growth: '+28%' }
    ],
    industries: [
      { industry: 'Technology', jobs: 125000, growth: '+22%' },
      { industry: 'Healthcare', jobs: 89000, growth: '+18%' },
      { industry: 'Finance', jobs: 76000, growth: '+15%' },
      { industry: 'E-commerce', jobs: 65000, growth: '+25%' }
    ]
  };

  const predictions = [
    {
      role: 'Senior Software Engineer',
      probability: 89,
      timeframe: '2-3 years',
      requirements: ['Advanced React skills', 'System design knowledge', 'Leadership experience']
    },
    {
      role: 'Tech Lead',
      probability: 76,
      timeframe: '3-4 years',
      requirements: ['Team management', 'Architecture design', 'Mentoring skills']
    },
    {
      role: 'Product Manager',
      probability: 62,
      timeframe: '4-5 years',
      requirements: ['Business acumen', 'User research', 'Strategic thinking']
    }
  ];

  const biasAnalysis = {
    overallScore: 85,
    biases: [
      {
        type: 'gender',
        severity: 'low',
        text: 'Strong communication skills',
        suggestion: 'Consider using "effective" instead of "strong" for more neutral language'
      },
      {
        type: 'age',
        severity: 'medium',
        text: 'Digital native with fresh perspective',
        suggestion: 'Focus on specific skills rather than generational references'
      }
    ]
  };

  const renderOverview = () => (
    <div className="pro-analytics-overview">
      <div className="pro-metrics-grid">
        <div className="pro-metric-card primary">
          <div className="pro-metric-icon">
            <DollarSign size={24} />
          </div>
          <div className="pro-metric-content">
            <div className="pro-metric-value">${(salaryData.averageSalary / 1000).toFixed(0)}k</div>
            <div className="pro-metric-label">Average Salary</div>
            <div className="pro-metric-trend positive">{salaryData.trend} {salaryData.trendPeriod}</div>
          </div>
        </div>

        <div className="pro-metric-card">
          <div className="pro-metric-icon">
            <TrendingUp size={24} />
          </div>
          <div className="pro-metric-content">
            <div className="pro-metric-value">92%</div>
            <div className="pro-metric-label">Market Demand</div>
            <div className="pro-metric-trend positive">+15% this quarter</div>
          </div>
        </div>

        <div className="pro-metric-card">
          <div className="pro-metric-icon">
            <Target size={24} />
          </div>
          <div className="pro-metric-content">
            <div className="pro-metric-value">89%</div>
            <div className="pro-metric-label">Career Match</div>
            <div className="pro-metric-trend positive">Excellent fit</div>
          </div>
        </div>

        <div className="pro-metric-card">
          <div className="pro-metric-icon">
            <Globe size={24} />
          </div>
          <div className="pro-metric-content">
            <div className="pro-metric-value">4.2k</div>
            <div className="pro-metric-label">Open Positions</div>
            <div className="pro-metric-trend positive">+8% this month</div>
          </div>
        </div>
      </div>

      <div className="pro-insights-grid">
        <div className="pro-insight-card">
          <h3>Top Skills in Demand</h3>
          <div className="pro-skills-chart">
            {marketData.skills.slice(0, 4).map((skill) => (
              <div key={skill.skill} className="pro-skill-bar">
                <div className="pro-skill-info">
                  <span className="pro-skill-name">{skill.skill}</span>
                  <span className="pro-skill-growth">{skill.growth}</span>
                </div>
                <div className="pro-skill-progress">
                  <div 
                    className="pro-skill-fill" 
                    style={{ width: `${skill.demand}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-insight-card">
          <h3>Salary Benchmarks</h3>
          <div className="pro-salary-chart">
            <div className="pro-salary-range">
              <div className="pro-salary-bar">
                <div className="pro-salary-segment p25" style={{ width: '25%' }}>
                  <span>${(salaryData.percentile25 / 1000).toFixed(0)}k</span>
                </div>
                <div className="pro-salary-segment p50" style={{ width: '25%' }}>
                  <span>${(salaryData.percentile50 / 1000).toFixed(0)}k</span>
                </div>
                <div className="pro-salary-segment p75" style={{ width: '50%' }}>
                  <span>${(salaryData.percentile75 / 1000).toFixed(0)}k</span>
                </div>
              </div>
              <div className="pro-salary-labels">
                <span>25th</span>
                <span>50th</span>
                <span>75th</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSalaryInsights = () => (
    <div className="pro-salary-insights">
      <div className="pro-salary-header">
        <div className="pro-salary-main">
          <div className="pro-salary-amount">${(salaryData.averageSalary / 1000).toFixed(0)}k</div>
          <div className="pro-salary-subtitle">Average for your profile</div>
          <div className="pro-salary-trend">{salaryData.trend} {salaryData.trendPeriod}</div>
        </div>
        <div className="pro-salary-distribution">
          <div className="pro-percentile">
            <span className="pro-percentile-label">25th</span>
            <span className="pro-percentile-value">${(salaryData.percentile25 / 1000).toFixed(0)}k</span>
          </div>
          <div className="pro-percentile">
            <span className="pro-percentile-label">50th</span>
            <span className="pro-percentile-value">${(salaryData.percentile50 / 1000).toFixed(0)}k</span>
          </div>
          <div className="pro-percentile">
            <span className="pro-percentile-label">75th</span>
            <span className="pro-percentile-value">${(salaryData.percentile75 / 1000).toFixed(0)}k</span>
          </div>
        </div>
      </div>

      <div className="pro-salary-grid">
        <div className="pro-salary-section">
          <h3>Top Paying Companies</h3>
          <div className="pro-companies-list">
            {salaryData.topCompanies.map((company, index) => (
              <div key={company.company} className="pro-company-item">
                <div className="pro-company-rank">{index + 1}</div>
                <div className="pro-company-info">
                  <span className="pro-company-name">{company.company}</span>
                  <span className="pro-company-salary">${(company.avgSalary / 1000).toFixed(0)}k</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-salary-section">
          <h3>Skill Premium</h3>
          <div className="pro-premium-list">
            {salaryData.skillPremium.map((skill) => (
              <div key={skill.skill} className="pro-premium-item">
                <span className="pro-premium-skill">{skill.skill}</span>
                <span className="pro-premium-value">{skill.premium}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarketTrends = () => (
    <div className="pro-market-trends">
      <div className="pro-regions-section">
        <h3>Regional Market Analysis</h3>
        <div className="pro-regions-grid">
          {marketData.regions.map((region) => (
            <div key={region.name} className="pro-region-card">
              <h4>{region.name}</h4>
              <div className="pro-region-metrics">
                <div className="pro-region-metric">
                  <span className="pro-metric-label">Demand</span>
                  <span className="pro-metric-value">{region.demand}%</span>
                </div>
                <div className="pro-region-metric">
                  <span className="pro-metric-label">Supply</span>
                  <span className="pro-metric-value">{region.supply}%</span>
                </div>
                <div className="pro-region-metric">
                  <span className="pro-metric-label">Ratio</span>
                  <span className={`pro-metric-value ${region.ratio > 1.5 ? 'positive' : 'neutral'}`}>
                    {region.ratio}
                  </span>
                </div>
                <div className="pro-region-metric">
                  <span className="pro-metric-label">Avg Salary</span>
                  <span className="pro-metric-value">${(region.avgSalary / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pro-trends-grid">
        <div className="pro-trends-section">
          <h3>Skills in Demand</h3>
          <div className="pro-skills-trends">
            {marketData.skills.map((skill) => (
              <div key={skill.skill} className="pro-skill-trend">
                <div className="pro-skill-trend-info">
                  <span className="pro-skill-name">{skill.skill}</span>
                  <span className="pro-skill-growth">{skill.growth}</span>
                </div>
                <div className="pro-skill-demand-bar">
                  <div 
                    className="pro-skill-demand-fill" 
                    style={{ width: `${skill.demand}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pro-trends-section">
          <h3>Industry Growth</h3>
          <div className="pro-industries-trends">
            {marketData.industries.map((industry) => (
              <div key={industry.industry} className="pro-industry-trend">
                <div className="pro-industry-info">
                  <span className="pro-industry-name">{industry.industry}</span>
                  <span className="pro-industry-jobs">{industry.jobs.toLocaleString()} jobs</span>
                </div>
                <span className="pro-industry-growth">{industry.growth}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPredictions = () => (
    <div className="pro-predictions">
      <div className="pro-predictions-header">
        <h3>AI Career Path Predictions</h3>
        <p>Based on your skills, experience, and market trends</p>
      </div>

      <div className="pro-predictions-grid">
        {predictions.map((prediction, index) => (
          <div key={prediction.role} className="pro-prediction-card">
            <div className="pro-prediction-header">
              <div className="pro-prediction-rank">{index + 1}</div>
              <div className="pro-prediction-info">
                <h4>{prediction.role}</h4>
                <span className="pro-prediction-timeframe">{prediction.timeframe}</span>
              </div>
              <div className="pro-prediction-probability">
                <div className="pro-probability-circle">
                  <span>{prediction.probability}%</span>
                </div>
              </div>
            </div>

            <div className="pro-prediction-requirements">
              <span className="pro-requirements-label">Key Requirements:</span>
              <ul className="pro-requirements-list">
                {prediction.requirements.map((req) => (
                  <li key={req}>{req}</li>
                ))}
              </ul>
            </div>

            <button className="pro-btn-ghost">View Roadmap</button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderBiasAnalysis = () => (
    <div className="pro-bias-analysis">
      <div className="pro-bias-header">
        <div className="pro-bias-score">
          <div className="pro-score-circle">
            <span className="pro-score-value">{biasAnalysis.overallScore}</span>
            <span className="pro-score-label">/100</span>
          </div>
          <div className="pro-score-info">
            <h3>Bias Score</h3>
            <p className={`pro-score-status ${biasAnalysis.overallScore >= 80 ? 'good' : 'warning'}`}>
              {biasAnalysis.overallScore >= 80 ? 'Excellent - Minimal bias detected' : 'Good - Some improvements possible'}
            </p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <AlertTriangle size={16} />
          Scan Resume
        </button>
      </div>

      {biasAnalysis.biases.length > 0 && (
        <div className="pro-bias-issues">
          <h3>Detected Issues</h3>
          <div className="pro-bias-list">
            {biasAnalysis.biases.map((bias, index) => (
              <div key={index} className="pro-bias-item">
                <div className="pro-bias-item-header">
                  <span className="pro-bias-type">{bias.type} bias</span>
                  <span className={`pro-bias-severity ${bias.severity}`}>
                    {bias.severity}
                  </span>
                </div>
                <div className="pro-bias-text">"{bias.text}"</div>
                <div className="pro-bias-suggestion">
                  <strong>Suggestion:</strong> {bias.suggestion}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div>
          <h1 className="pro-title">Analytics Center</h1>
          <p className="pro-subtitle">AI-powered insights for your career growth</p>
        </div>
        <button className="pro-btn-primary">
          <Brain size={16} />
          Generate Report
        </button>
      </div>

      {/* Navigation */}
      <div className="pro-nav-tabs">
        {views.map((view) => {
          const Icon = view.icon;
          return (
            <button
              key={view.id}
              className={`pro-nav-tab ${activeView === view.id ? 'active' : ''}`}
              onClick={() => setActiveView(view.id)}
            >
              <Icon size={16} />
              <span>{view.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeView === 'overview' && renderOverview()}
        {activeView === 'salary' && renderSalaryInsights()}
        {activeView === 'market' && renderMarketTrends()}
        {activeView === 'predictions' && renderPredictions()}
        {activeView === 'bias' && renderBiasAnalysis()}
      </div>
    </div>
  );
}