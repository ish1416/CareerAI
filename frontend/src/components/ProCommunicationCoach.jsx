import React, { useState } from 'react';
import { MessageSquare, Mic, Send, CheckCircle, Lightbulb, BarChart3, Target } from 'lucide-react';

export default function ProCommunicationCoach() {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [message, setMessage] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tabs = [
    { id: 'analyzer', label: 'Text Analyzer', icon: MessageSquare },
    { id: 'templates', label: 'Templates', icon: Send },
    { id: 'progress', label: 'Progress', icon: BarChart3 }
  ];

  const sampleAnalysis = {
    tone: 'Professional',
    clarity: 8.5,
    confidence: 7.2,
    engagement: 6.8,
    suggestions: [
      'Consider using more active voice in your sentences',
      'Add specific examples to support your points',
      'The tone is appropriate for professional communication'
    ],
    improvements: [
      { aspect: 'Clarity', score: 85, improvement: '+12%' },
      { aspect: 'Confidence', score: 72, improvement: '+8%' },
      { aspect: 'Engagement', score: 68, improvement: '+15%' }
    ]
  };

  const templates = [
    {
      id: 1,
      title: 'Follow-up Email',
      category: 'Networking',
      content: `Hi [Name],

Thank you for taking the time to speak with me about [topic] yesterday. I found our conversation about [specific detail] particularly insightful.

As discussed, I'm attaching [document/information] that might be helpful for your [project/initiative]. I'd love to continue our conversation and explore potential collaboration opportunities.

Would you be available for a brief call next week?

Best regards,
[Your Name]`
    },
    {
      id: 2,
      title: 'Interview Thank You',
      category: 'Interview',
      content: `Dear [Interviewer Name],

Thank you for the opportunity to interview for the [Position] role at [Company]. I enjoyed our discussion about [specific topic discussed] and learning more about your team's innovative approach to [relevant area].

Our conversation reinforced my enthusiasm for this position. I'm particularly excited about the opportunity to [specific contribution you could make] and contribute to [company goal/project].

Please let me know if you need any additional information. I look forward to hearing about the next steps.

Best regards,
[Your Name]`
    }
  ];

  const analyzeMessage = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysis(sampleAnalysis);
      setIsAnalyzing(false);
    }, 2000);
  };

  const renderAnalyzer = () => (
    <div className="pro-analyzer-section">
      <div className="pro-analyzer-header">
        <h3>Communication Analyzer</h3>
        <p>Get AI-powered feedback on your professional communication</p>
      </div>

      <div className="pro-analyzer-grid">
        <div className="pro-message-input">
          <div className="pro-input-header">
            <h4>Your Message</h4>
            <div className="pro-input-actions">
              <button className="pro-btn-ghost">
                <Mic size={16} />
                Voice Input
              </button>
            </div>
          </div>
          
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your email, message, or any professional communication here..."
            className="pro-message-textarea"
          />
          
          <div className="pro-input-footer">
            <div className="pro-message-stats">
              <span>{message.length} characters</span>
              <span>{message.split(' ').filter(word => word.length > 0).length} words</span>
            </div>
            <button 
              className="pro-btn-primary"
              onClick={analyzeMessage}
              disabled={!message.trim() || isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div className="pro-spinner"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Analyze Communication
                </>
              )}
            </button>
          </div>
        </div>

        {analysis && (
          <div className="pro-analysis-results">
            <div className="pro-results-header">
              <h4>Analysis Results</h4>
              <div className="pro-overall-score">
                <span className="pro-score-value">
                  {Math.round((analysis.clarity + analysis.confidence + analysis.engagement) / 3)}
                </span>
                <span className="pro-score-label">/10</span>
              </div>
            </div>

            <div className="pro-metrics-grid">
              {analysis.improvements.map((metric) => (
                <div key={metric.aspect} className="pro-metric-card">
                  <div className="pro-metric-header">
                    <span className="pro-metric-name">{metric.aspect}</span>
                    <span className="pro-metric-improvement">{metric.improvement}</span>
                  </div>
                  <div className="pro-metric-score">{metric.score}/100</div>
                  <div className="pro-metric-bar">
                    <div 
                      className="pro-metric-fill" 
                      style={{ width: `${metric.score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pro-suggestions-section">
              <div className="pro-suggestions-header">
                <Lightbulb size={20} />
                <h5>Improvement Suggestions</h5>
              </div>
              <div className="pro-suggestions-list">
                {analysis.suggestions.map((suggestion, index) => (
                  <div key={index} className="pro-suggestion-item">
                    <Target size={16} />
                    <span>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-tone-analysis">
              <h5>Communication Tone</h5>
              <div className="pro-tone-badge">
                {analysis.tone}
              </div>
              <p>Your message conveys a {analysis.tone.toLowerCase()} tone, which is appropriate for business communication.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderTemplates = () => (
    <div className="pro-templates-section">
      <div className="pro-templates-header">
        <h3>Communication Templates</h3>
        <p>Professional templates for common business scenarios</p>
      </div>

      <div className="pro-templates-grid">
        {templates.map((template) => (
          <div key={template.id} className="pro-template-card">
            <div className="pro-template-header">
              <h4>{template.title}</h4>
              <span className="pro-template-category">{template.category}</span>
            </div>
            
            <div className="pro-template-content">
              <pre>{template.content}</pre>
            </div>
            
            <div className="pro-template-actions">
              <button className="pro-btn-primary">
                <Send size={16} />
                Use Template
              </button>
              <button className="pro-btn-ghost">
                <CheckCircle size={16} />
                Analyze
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProgress = () => (
    <div className="pro-progress-section">
      <div className="pro-progress-header">
        <h3>Communication Progress</h3>
        <p>Track your improvement in professional communication skills</p>
      </div>

      <div className="pro-progress-stats">
        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <MessageSquare size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">47</div>
            <div className="pro-stat-label">Messages Analyzed</div>
            <div className="pro-stat-trend">+12 this week</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Target size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">8.2</div>
            <div className="pro-stat-label">Avg Score</div>
            <div className="pro-stat-trend">+0.8 improvement</div>
          </div>
        </div>

        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">23%</div>
            <div className="pro-stat-label">Improvement</div>
            <div className="pro-stat-trend">Last 30 days</div>
          </div>
        </div>
      </div>

      <div className="pro-skills-progress">
        <h4>Skill Development</h4>
        <div className="pro-skills-list">
          {[
            { skill: 'Clarity', current: 85, target: 90 },
            { skill: 'Confidence', current: 72, target: 85 },
            { skill: 'Engagement', current: 68, target: 80 },
            { skill: 'Professionalism', current: 91, target: 95 }
          ].map((skill) => (
            <div key={skill.skill} className="pro-skill-progress">
              <div className="pro-skill-header">
                <span className="pro-skill-name">{skill.skill}</span>
                <span className="pro-skill-score">{skill.current}/{skill.target}</span>
              </div>
              <div className="pro-skill-bar">
                <div 
                  className="pro-skill-fill" 
                  style={{ width: `${(skill.current / skill.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <MessageSquare size={32} />
          </div>
          <div>
            <h1 className="pro-title">Communication Coach</h1>
            <p className="pro-subtitle">AI-powered feedback for professional communication</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Mic size={16} />
          Voice Analysis
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
        {activeTab === 'templates' && renderTemplates()}
        {activeTab === 'progress' && renderProgress()}
      </div>
    </div>
  );
}