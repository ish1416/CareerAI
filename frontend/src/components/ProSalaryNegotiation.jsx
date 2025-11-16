import React, { useState } from 'react';
import { DollarSign, TrendingUp, Target, Calculator, Lightbulb, MessageSquare, FileText, Award } from 'lucide-react';

export default function ProSalaryNegotiation() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [currentOffer, setCurrentOffer] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  const tabs = [
    { id: 'analyzer', label: 'Salary Analyzer', icon: Calculator },
    { id: 'negotiation', label: 'Negotiation Guide', icon: MessageSquare },
    { id: 'market', label: 'Market Data', icon: TrendingUp },
    { id: 'scripts', label: 'Email Scripts', icon: FileText }
  ];

  const marketData = {
    averageSalary: 125000,
    percentile25: 95000,
    percentile50: 115000,
    percentile75: 145000,
    yourTarget: 135000,
    negotiationPower: 'High'
  };

  const negotiationTips = [
    {
      title: 'Research Market Rates',
      description: 'Know your worth by researching industry standards for your role and experience level.',
      priority: 'high'
    },
    {
      title: 'Highlight Your Value',
      description: 'Prepare specific examples of your achievements and contributions to the company.',
      priority: 'high'
    },
    {
      title: 'Consider Total Compensation',
      description: 'Look beyond base salary - consider benefits, equity, bonuses, and growth opportunities.',
      priority: 'medium'
    },
    {
      title: 'Time Your Request Well',
      description: 'Choose the right moment, such as after a successful project or during performance reviews.',
      priority: 'medium'
    }
  ];

  const emailScripts = [
    {
      title: 'Initial Salary Negotiation',
      scenario: 'Responding to a job offer',
      script: `Thank you for the offer for the [Position] role. I'm excited about the opportunity to join [Company] and contribute to [specific project/goal].

After reviewing the compensation package, I was hoping we could discuss the base salary. Based on my research of market rates for similar positions and my [X years] of experience in [relevant skills], I believe a salary of $[amount] would be more aligned with the value I can bring to the role.

I'm confident that my experience in [specific achievements] will allow me to make an immediate impact. Would you be open to discussing this adjustment?

I look forward to hearing from you.`
    },
    {
      title: 'Performance Review Raise Request',
      scenario: 'Asking for a raise during review',
      script: `I wanted to discuss my compensation as part of this performance review. Over the past year, I've consistently exceeded my goals and taken on additional responsibilities including [specific examples].

Key achievements include:
• [Achievement 1 with quantifiable impact]
• [Achievement 2 with quantifiable impact]
• [Achievement 3 with quantifiable impact]

Based on my expanded role and contributions, I'd like to request a salary adjustment to $[amount], which reflects the current market rate for my position and experience level.

I'm committed to continuing this level of performance and would appreciate your consideration.`
    }
  ];

  const analyzeOffer = () => {
    const offer = parseInt(currentOffer);
    if (!offer) return;

    const analysis = {
      offerAmount: offer,
      marketPosition: offer >= marketData.percentile75 ? 'Above Market' : 
                     offer >= marketData.percentile50 ? 'Market Rate' : 'Below Market',
      recommendation: offer < marketData.yourTarget ? 'Negotiate Higher' : 'Consider Accepting',
      negotiationRoom: Math.max(0, marketData.percentile75 - offer),
      confidence: offer >= marketData.percentile50 ? 'High' : 'Medium'
    };

    setAnalysisResult(analysis);
  };

  const renderAnalyzer = () => (
    <div className="pro-salary-analyzer">
      <div className="pro-analyzer-header">
        <h3>Salary Offer Analyzer</h3>
        <p>Get AI-powered insights on your salary offer and negotiation strategy</p>
      </div>

      <div className="pro-analyzer-grid">
        <div className="pro-analyzer-input">
          <div className="pro-offer-input">
            <label>Current Offer Amount</label>
            <div className="pro-salary-input-group">
              <span className="pro-currency">$</span>
              <input
                type="number"
                value={currentOffer}
                onChange={(e) => setCurrentOffer(e.target.value)}
                placeholder="Enter offer amount"
                className="pro-salary-input"
              />
            </div>
            <button 
              className="pro-btn-primary"
              onClick={analyzeOffer}
              disabled={!currentOffer}
            >
              <Calculator size={16} />
              Analyze Offer
            </button>
          </div>

          <div className="pro-market-overview">
            <h4>Market Overview</h4>
            <div className="pro-market-stats">
              <div className="pro-market-stat">
                <span className="pro-stat-label">Market Average</span>
                <span className="pro-stat-value">${marketData.averageSalary.toLocaleString()}</span>
              </div>
              <div className="pro-market-stat">
                <span className="pro-stat-label">Your Target</span>
                <span className="pro-stat-value">${marketData.yourTarget.toLocaleString()}</span>
              </div>
              <div className="pro-market-stat">
                <span className="pro-stat-label">Negotiation Power</span>
                <span className={`pro-stat-badge ${marketData.negotiationPower.toLowerCase()}`}>
                  {marketData.negotiationPower}
                </span>
              </div>
            </div>
          </div>
        </div>

        {analysisResult && (
          <div className="pro-analysis-result">
            <div className="pro-result-header">
              <h4>Analysis Result</h4>
              <div className={`pro-result-badge ${analysisResult.recommendation.toLowerCase().replace(' ', '-')}`}>
                {analysisResult.recommendation}
              </div>
            </div>

            <div className="pro-result-details">
              <div className="pro-result-item">
                <span className="pro-result-label">Market Position</span>
                <span className="pro-result-value">{analysisResult.marketPosition}</span>
              </div>
              <div className="pro-result-item">
                <span className="pro-result-label">Negotiation Room</span>
                <span className="pro-result-value">
                  ${analysisResult.negotiationRoom.toLocaleString()}
                </span>
              </div>
              <div className="pro-result-item">
                <span className="pro-result-label">Confidence Level</span>
                <span className="pro-result-value">{analysisResult.confidence}</span>
              </div>
            </div>

            <div className="pro-result-recommendation">
              <Lightbulb size={20} />
              <div>
                <h5>Recommendation</h5>
                <p>
                  {analysisResult.recommendation === 'Negotiate Higher' 
                    ? `Your offer is below market rate. Consider negotiating for $${(analysisResult.offerAmount + analysisResult.negotiationRoom).toLocaleString()} based on market data.`
                    : 'Your offer is competitive with market rates. You may still negotiate for additional benefits or a higher amount based on your unique value proposition.'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderNegotiation = () => (
    <div className="pro-negotiation-guide">
      <div className="pro-guide-header">
        <h3>Negotiation Strategy Guide</h3>
        <p>Expert tips and strategies for successful salary negotiations</p>
      </div>

      <div className="pro-tips-grid">
        {negotiationTips.map((tip, index) => (
          <div key={index} className="pro-tip-card">
            <div className="pro-tip-header">
              <div className={`pro-tip-priority ${tip.priority}`}>
                {tip.priority === 'high' ? <Award size={16} /> : <Target size={16} />}
              </div>
              <h4>{tip.title}</h4>
            </div>
            <p>{tip.description}</p>
          </div>
        ))}
      </div>

      <div className="pro-negotiation-framework">
        <h4>Negotiation Framework</h4>
        <div className="pro-framework-steps">
          <div className="pro-framework-step">
            <div className="pro-step-number">1</div>
            <div className="pro-step-content">
              <h5>Prepare Your Case</h5>
              <p>Research market rates, document your achievements, and prepare specific examples of your value.</p>
            </div>
          </div>
          <div className="pro-framework-step">
            <div className="pro-step-number">2</div>
            <div className="pro-step-content">
              <h5>Choose the Right Time</h5>
              <p>Schedule a dedicated meeting or bring it up during performance reviews when you have their attention.</p>
            </div>
          </div>
          <div className="pro-framework-step">
            <div className="pro-step-number">3</div>
            <div className="pro-step-content">
              <h5>Present Your Request</h5>
              <p>Be confident, specific, and focus on the value you bring rather than personal financial needs.</p>
            </div>
          </div>
          <div className="pro-framework-step">
            <div className="pro-step-number">4</div>
            <div className="pro-step-content">
              <h5>Handle Objections</h5>
              <p>Listen actively, address concerns professionally, and be prepared with alternative solutions.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMarket = () => (
    <div className="pro-market-data">
      <div className="pro-market-header">
        <h3>Market Salary Data</h3>
        <p>Comprehensive salary benchmarks for your role and experience</p>
      </div>

      <div className="pro-salary-range">
        <h4>Salary Distribution</h4>
        <div className="pro-range-chart">
          <div className="pro-range-bar">
            <div className="pro-range-segment p25">
              <span>${(marketData.percentile25 / 1000).toFixed(0)}k</span>
              <div className="pro-range-label">25th Percentile</div>
            </div>
            <div className="pro-range-segment p50">
              <span>${(marketData.percentile50 / 1000).toFixed(0)}k</span>
              <div className="pro-range-label">Median</div>
            </div>
            <div className="pro-range-segment p75">
              <span>${(marketData.percentile75 / 1000).toFixed(0)}k</span>
              <div className="pro-range-label">75th Percentile</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pro-market-factors">
        <h4>Factors Affecting Salary</h4>
        <div className="pro-factors-grid">
          <div className="pro-factor-card">
            <h5>Experience Level</h5>
            <div className="pro-factor-range">
              <span>Entry: $75k - $95k</span>
              <span>Mid: $95k - $125k</span>
              <span>Senior: $125k - $165k</span>
            </div>
          </div>
          <div className="pro-factor-card">
            <h5>Company Size</h5>
            <div className="pro-factor-range">
              <span>Startup: -10% to +20%</span>
              <span>Mid-size: Market rate</span>
              <span>Enterprise: +10% to +30%</span>
            </div>
          </div>
          <div className="pro-factor-card">
            <h5>Location</h5>
            <div className="pro-factor-range">
              <span>SF Bay Area: +25%</span>
              <span>NYC: +20%</span>
              <span>Remote: Market rate</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderScripts = () => (
    <div className="pro-email-scripts">
      <div className="pro-scripts-header">
        <h3>Negotiation Email Templates</h3>
        <p>Professional email templates for different negotiation scenarios</p>
      </div>

      <div className="pro-scripts-list">
        {emailScripts.map((script, index) => (
          <div key={index} className="pro-script-card">
            <div className="pro-script-header">
              <h4>{script.title}</h4>
              <span className="pro-script-scenario">{script.scenario}</span>
            </div>
            <div className="pro-script-content">
              <pre>{script.script}</pre>
            </div>
            <div className="pro-script-actions">
              <button className="pro-btn-secondary">
                <FileText size={16} />
                Copy Template
              </button>
              <button className="pro-btn-ghost">
                Customize
              </button>
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
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="pro-title">Salary Negotiation</h1>
            <p className="pro-subtitle">AI-powered salary analysis and negotiation guidance</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Calculator size={16} />
          Quick Analysis
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
        {activeTab === 'analyzer' && renderAnalyzer()}
        {activeTab === 'negotiation' && renderNegotiation()}
        {activeTab === 'market' && renderMarket()}
        {activeTab === 'scripts' && renderScripts()}
      </div>
    </div>
  );
}