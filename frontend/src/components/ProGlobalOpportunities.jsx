import React, { useState } from 'react';
import { Globe, MapPin, Plane, FileText, CheckCircle, AlertCircle, TrendingUp, Search, Filter } from 'lucide-react';

export default function ProGlobalOpportunities() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [visaInfo, setVisaInfo] = useState(null);

  const tabs = [
    { id: 'opportunities', label: 'Global Jobs', icon: Globe },
    { id: 'visa', label: 'Visa Guide', icon: FileText },
    { id: 'relocation', label: 'Relocation', icon: Plane },
    { id: 'insights', label: 'Market Insights', icon: TrendingUp }
  ];

  const opportunities = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'Shopify',
      location: 'Toronto, Canada',
      country: 'Canada',
      salary: 'CAD $120,000 - $160,000',
      visaSponsorship: true,
      match: 94,
      skills: ['React', 'Node.js', 'GraphQL'],
      type: 'Full-time',
      remote: 'Hybrid'
    },
    {
      id: 2,
      title: 'Product Manager',
      company: 'SAP',
      location: 'Berlin, Germany',
      country: 'Germany',
      salary: '€85,000 - €110,000',
      visaSponsorship: true,
      match: 87,
      skills: ['Product Strategy', 'Agile', 'Analytics'],
      type: 'Full-time',
      remote: 'On-site'
    },
    {
      id: 3,
      title: 'Data Scientist',
      company: 'Atlassian',
      location: 'Sydney, Australia',
      country: 'Australia',
      salary: 'AUD $130,000 - $170,000',
      visaSponsorship: true,
      match: 91,
      skills: ['Python', 'Machine Learning', 'SQL'],
      type: 'Full-time',
      remote: 'Hybrid'
    }
  ];

  const readinessScore = {
    score: 87,
    level: 'High',
    description: 'You are well-prepared for international relocation'
  };

  const visaGuide = {
    Canada: {
      eligible: true,
      recommendedVisa: 'Express Entry - Federal Skilled Worker',
      processingTime: '6-8 months',
      requirements: [
        'Bachelor\'s degree or equivalent',
        'Minimum 1 year work experience',
        'English/French language proficiency',
        'Proof of funds (CAD $13,310 for single applicant)'
      ],
      score: 450
    },
    Germany: {
      eligible: true,
      recommendedVisa: 'EU Blue Card',
      processingTime: '2-3 months',
      requirements: [
        'University degree',
        'Job offer with minimum salary €56,800',
        'German language skills (B1 level preferred)',
        'Health insurance coverage'
      ],
      score: null
    }
  };

  const marketInsights = [
    {
      country: 'Canada',
      demand: 'High',
      growth: '+18%',
      avgSalary: 'CAD $95,000',
      topCities: ['Toronto', 'Vancouver', 'Montreal'],
      inDemandSkills: ['AI/ML', 'Cloud Computing', 'Cybersecurity']
    },
    {
      country: 'Germany',
      demand: 'High',
      growth: '+15%',
      avgSalary: '€75,000',
      topCities: ['Berlin', 'Munich', 'Hamburg'],
      inDemandSkills: ['Software Engineering', 'Data Science', 'DevOps']
    },
    {
      country: 'Australia',
      demand: 'Medium',
      growth: '+12%',
      avgSalary: 'AUD $110,000',
      topCities: ['Sydney', 'Melbourne', 'Brisbane'],
      inDemandSkills: ['Full-stack Development', 'Product Management', 'UX Design']
    }
  ];

  const renderOpportunities = () => (
    <div className="pro-global-opportunities">
      <div className="pro-opportunities-header">
        <div className="pro-search-filters">
          <div className="pro-search-bar">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search international opportunities..."
              className="pro-search-input"
            />
          </div>
          <button className="pro-btn-secondary">
            <Filter size={16} />
            Filters
          </button>
        </div>
      </div>

      <div className="pro-readiness-banner">
        <div className="pro-readiness-score">
          <div className="pro-score-circle">
            <span className="pro-score-number">{readinessScore.score}</span>
            <span className="pro-score-suffix">/100</span>
          </div>
          <div className="pro-readiness-info">
            <h3>Relocation Readiness Score</h3>
            <p>{readinessScore.level} - {readinessScore.description}</p>
          </div>
        </div>
        <Plane size={32} />
      </div>

      <div className="pro-jobs-list">
        {opportunities.map((job) => (
          <div key={job.id} className="pro-job-card">
            <div className="pro-job-header">
              <div className="pro-job-info">
                <h3>{job.title}</h3>
                <p className="pro-job-company">{job.company}</p>
                <div className="pro-job-location">
                  <MapPin size={16} />
                  <span>{job.location}</span>
                </div>
              </div>
              <div className="pro-job-match">
                <div className="pro-match-score">{job.match}%</div>
                <div className="pro-match-label">Match</div>
              </div>
            </div>

            <div className="pro-job-details">
              <div className="pro-job-salary">{job.salary}</div>
              <div className="pro-job-badges">
                {job.visaSponsorship && (
                  <span className="pro-job-badge visa">Visa Sponsored</span>
                )}
                <span className="pro-job-badge type">{job.type}</span>
                <span className="pro-job-badge remote">{job.remote}</span>
              </div>
            </div>

            <div className="pro-job-skills">
              {job.skills.map((skill) => (
                <span key={skill} className="pro-skill-tag">{skill}</span>
              ))}
            </div>

            <div className="pro-job-actions">
              <button className="pro-btn-primary">Apply Now</button>
              <button 
                className="pro-btn-secondary"
                onClick={() => {
                  setSelectedCountry(job.country);
                  setVisaInfo(visaGuide[job.country]);
                  setActiveTab('visa');
                }}
              >
                <FileText size={16} />
                Visa Info
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderVisa = () => (
    <div className="pro-visa-guide">
      <div className="pro-visa-header">
        <h3>Visa & Immigration Guide</h3>
        <p>Get personalized visa guidance for your target countries</p>
      </div>

      <div className="pro-country-selector">
        <label>Select Country</label>
        <select 
          className="pro-select"
          value={selectedCountry}
          onChange={(e) => {
            setSelectedCountry(e.target.value);
            setVisaInfo(visaGuide[e.target.value]);
          }}
        >
          <option value="">Choose a country</option>
          <option value="Canada">Canada</option>
          <option value="Germany">Germany</option>
          <option value="Australia">Australia</option>
        </select>
      </div>

      {visaInfo && (
        <div className="pro-visa-info">
          <div className="pro-visa-eligibility">
            <div className="pro-eligibility-header">
              <div className="pro-eligibility-status">
                <CheckCircle size={24} color="var(--success)" />
                <div>
                  <h4>Visa Eligibility</h4>
                  <p className="pro-eligibility-result">You appear to be eligible</p>
                </div>
              </div>
            </div>

            <div className="pro-visa-details">
              <div className="pro-visa-detail">
                <span className="pro-detail-label">Recommended Visa:</span>
                <span className="pro-detail-value">{visaInfo.recommendedVisa}</span>
              </div>
              <div className="pro-visa-detail">
                <span className="pro-detail-label">Processing Time:</span>
                <span className="pro-detail-value">{visaInfo.processingTime}</span>
              </div>
              {visaInfo.score && (
                <div className="pro-visa-detail">
                  <span className="pro-detail-label">CRS Score:</span>
                  <span className="pro-detail-value">{visaInfo.score} points</span>
                </div>
              )}
            </div>
          </div>

          <div className="pro-requirements">
            <h4>Key Requirements</h4>
            <div className="pro-requirements-list">
              {visaInfo.requirements.map((req, index) => (
                <div key={index} className="pro-requirement-item">
                  <CheckCircle size={16} />
                  <span>{req}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pro-visa-actions">
            <button className="pro-btn-primary">
              <FileText size={16} />
              Start Application
            </button>
            <button className="pro-btn-secondary">
              Calculate CRS Score
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const renderRelocation = () => (
    <div className="pro-relocation-guide">
      <div className="pro-relocation-header">
        <h3>Relocation Planning</h3>
        <p>Comprehensive guide to planning your international move</p>
      </div>

      <div className="pro-relocation-checklist">
        <h4>Relocation Checklist</h4>
        <div className="pro-checklist-categories">
          <div className="pro-checklist-category">
            <h5>Before Moving</h5>
            <div className="pro-checklist-items">
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Secure job offer with visa sponsorship</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Apply for work visa/permit</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Research housing options</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Arrange international health insurance</span>
              </div>
            </div>
          </div>

          <div className="pro-checklist-category">
            <h5>First Month</h5>
            <div className="pro-checklist-items">
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Open local bank account</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Get local phone number</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Register with local authorities</span>
              </div>
              <div className="pro-checklist-item">
                <input type="checkbox" />
                <span>Find permanent housing</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-cost-calculator">
        <h4>Relocation Cost Estimator</h4>
        <div className="pro-cost-grid">
          <div className="pro-cost-category">
            <h5>Moving Expenses</h5>
            <div className="pro-cost-items">
              <div className="pro-cost-item">
                <span>Flights:</span>
                <span>$1,200 - $2,500</span>
              </div>
              <div className="pro-cost-item">
                <span>Shipping:</span>
                <span>$2,000 - $5,000</span>
              </div>
              <div className="pro-cost-item">
                <span>Visa fees:</span>
                <span>$500 - $1,500</span>
              </div>
            </div>
          </div>

          <div className="pro-cost-category">
            <h5>Initial Setup</h5>
            <div className="pro-cost-items">
              <div className="pro-cost-item">
                <span>Temporary housing:</span>
                <span>$2,000 - $4,000</span>
              </div>
              <div className="pro-cost-item">
                <span>Security deposits:</span>
                <span>$3,000 - $6,000</span>
              </div>
              <div className="pro-cost-item">
                <span>Initial expenses:</span>
                <span>$2,000 - $3,000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInsights = () => (
    <div className="pro-market-insights">
      <div className="pro-insights-header">
        <h3>Global Market Insights</h3>
        <p>Stay informed about international job market trends</p>
      </div>

      <div className="pro-insights-grid">
        {marketInsights.map((insight) => (
          <div key={insight.country} className="pro-insight-card">
            <div className="pro-insight-header">
              <h4>{insight.country}</h4>
              <div className={`pro-demand-badge ${insight.demand.toLowerCase()}`}>
                {insight.demand} Demand
              </div>
            </div>

            <div className="pro-insight-stats">
              <div className="pro-insight-stat">
                <TrendingUp size={16} />
                <div>
                  <span className="pro-stat-value">{insight.growth}</span>
                  <span className="pro-stat-label">Job Growth</span>
                </div>
              </div>
              <div className="pro-insight-stat">
                <span className="pro-stat-value">{insight.avgSalary}</span>
                <span className="pro-stat-label">Avg Salary</span>
              </div>
            </div>

            <div className="pro-insight-details">
              <div className="pro-insight-section">
                <h5>Top Cities</h5>
                <div className="pro-cities-list">
                  {insight.topCities.map((city) => (
                    <span key={city} className="pro-city-tag">{city}</span>
                  ))}
                </div>
              </div>

              <div className="pro-insight-section">
                <h5>In-Demand Skills</h5>
                <div className="pro-skills-list">
                  {insight.inDemandSkills.map((skill) => (
                    <span key={skill} className="pro-skill-tag">{skill}</span>
                  ))}
                </div>
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
            <Globe size={32} />
          </div>
          <div>
            <h1 className="pro-title">Global Opportunities</h1>
            <p className="pro-subtitle">Explore international career opportunities and visa guidance</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Plane size={16} />
          Relocation Assessment
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
        {activeTab === 'opportunities' && renderOpportunities()}
        {activeTab === 'visa' && renderVisa()}
        {activeTab === 'relocation' && renderRelocation()}
        {activeTab === 'insights' && renderInsights()}
      </div>
    </div>
  );
}