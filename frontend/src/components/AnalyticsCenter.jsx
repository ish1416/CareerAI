import React, { useState, useEffect } from 'react';
import { TrendingUp, MapPin, DollarSign, Brain, AlertTriangle, BarChart3 } from 'lucide-react';
import api from '../utils/api.js';

export default function AnalyticsCenter() {
  const [salaryInsights, setSalaryInsights] = useState(null);
  const [marketHeatmap, setMarketHeatmap] = useState(null);
  const [careerPrediction, setCareerPrediction] = useState(null);
  const [sentimentAnalysis, setSentimentAnalysis] = useState(null);
  const [biasDetection, setBiasDetection] = useState(null);
  const [trends, setTrends] = useState(null);
  const [activeTab, setActiveTab] = useState('salary');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [salaryRes, heatmapRes, trendsRes] = await Promise.all([
        api.get('/analytics/salary-insights?skill=JavaScript&location=San Francisco&experience=3').catch(() => ({ data: { insights: null } })),
        api.get('/analytics/market-heatmap').catch(() => ({ data: { heatmap: null } })),
        api.get('/analytics/trends').catch(() => ({ data: { trends: null } }))
      ]);
      
      setSalaryInsights(salaryRes.data.insights);
      setMarketHeatmap(heatmapRes.data.heatmap);
      setTrends(trendsRes.data.trends);
    } catch (error) {
      console.error('Failed to load analytics data:', error);
    }
  };

  const predictCareer = async () => {
    try {
      const { data } = await api.post('/analytics/career-predictor', {
        skills: ['JavaScript', 'React', 'Node.js'],
        experience: '3 years',
        education: 'BS Computer Science',
        interests: ['Web Development', 'AI']
      });
      setCareerPrediction(data);
    } catch (error) {
      console.error('Failed to predict career:', error);
    }
  };

  const analyzeSentiment = async () => {
    try {
      const { data } = await api.post('/analytics/resume-sentiment', {
        resumeText: 'Experienced software engineer with strong problem-solving skills and passion for innovation...'
      });
      setSentimentAnalysis(data.analysis);
    } catch (error) {
      console.error('Failed to analyze sentiment:', error);
    }
  };

  const detectBias = async () => {
    try {
      const { data } = await api.post('/analytics/bias-detector', {
        resumeText: 'Recent graduate with fresh perspective and modern technical skills...'
      });
      setBiasDetection(data.detection);
    } catch (error) {
      console.error('Failed to detect bias:', error);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>AI Research & Analytics Center</h1>
      
      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['salary', 'market', 'career', 'sentiment', 'bias', 'trends'].map(tab => (
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

      {/* Salary Insights Tab */}
      {activeTab === 'salary' && salaryInsights && (
        <div>
          <h3>Industry Salary Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4>Salary Overview</h4>
              <div style={{ textAlign: 'center', marginBottom: 'var(--space-4)' }}>
                <div style={{ fontSize: 'var(--text-3xl)', fontWeight: 'bold', color: 'var(--primary)' }}>
                  ${(salaryInsights.averageSalary / 1000).toFixed(0)}k
                </div>
                <div style={{ color: 'var(--text-soft)' }}>Average Salary</div>
                <div style={{ color: 'var(--success)', fontSize: 'var(--text-sm)' }}>
                  {salaryInsights.trend} {salaryInsights.trendPeriod}
                </div>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span>25th Percentile</span>
                <span style={{ fontWeight: 'bold' }}>${(salaryInsights.percentile25 / 1000).toFixed(0)}k</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                <span>50th Percentile</span>
                <span style={{ fontWeight: 'bold' }}>${(salaryInsights.percentile50 / 1000).toFixed(0)}k</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>75th Percentile</span>
                <span style={{ fontWeight: 'bold' }}>${(salaryInsights.percentile75 / 1000).toFixed(0)}k</span>
              </div>
            </div>
            
            <div className="card">
              <h4>Top Paying Companies</h4>
              {salaryInsights.topPayingCompanies.map(company => (
                <div key={company.company} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{company.company}</span>
                  <span style={{ fontWeight: 'bold' }}>${(company.avgSalary / 1000).toFixed(0)}k</span>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Skill Premium</h4>
              {salaryInsights.skillPremium.map(skill => (
                <div key={skill.skill} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{skill.skill}</span>
                  <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{skill.premium}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Market Heatmap Tab */}
      {activeTab === 'market' && marketHeatmap && (
        <div>
          <h3>Job Market Heatmaps</h3>
          <div style={{ display: 'grid', gap: 'var(--space-6)' }}>
            <div className="card">
              <h4>Regional Demand-Supply Analysis</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 'var(--space-3)' }}>
                {marketHeatmap.regions.map(region => (
                  <div key={region.name} style={{ 
                    padding: 'var(--space-3)', 
                    border: '1px solid var(--border)', 
                    borderRadius: 'var(--radius)' 
                  }}>
                    <h5>{region.name}</h5>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <span>Demand</span>
                      <span style={{ fontWeight: 'bold' }}>{region.demand}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <span>Supply</span>
                      <span style={{ fontWeight: 'bold' }}>{region.supply}%</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                      <span>Ratio</span>
                      <span style={{ fontWeight: 'bold', color: region.ratio > 1.1 ? 'var(--success)' : 'var(--warning)' }}>
                        {region.ratio}
                      </span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Avg Salary</span>
                      <span style={{ fontWeight: 'bold' }}>${(region.avgSalary / 1000).toFixed(0)}k</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="card">
                <h4>Skills in Demand</h4>
                {marketHeatmap.skills.map(skill => (
                  <div key={skill.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                    <span>{skill.skill}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                      <div style={{ width: '60px', height: '4px', background: 'var(--muted)', borderRadius: 'var(--radius)' }}>
                        <div style={{ width: `${skill.demand}%`, height: '100%', background: 'var(--primary)', borderRadius: 'var(--radius)' }} />
                      </div>
                      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--success)' }}>{skill.growth}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="card">
                <h4>Industry Growth</h4>
                {marketHeatmap.industries.map(industry => (
                  <div key={industry.industry} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span>{industry.industry}</span>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: 'bold' }}>{industry.jobs.toLocaleString()}</div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--success)' }}>{industry.growth}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Career Predictor Tab */}
      {activeTab === 'career' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>AI Career Predictor</h3>
            <button className="btn primary" onClick={predictCareer}>
              <Brain size={16} />
              Predict Career Path
            </button>
          </div>
          
          {careerPrediction ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
              {careerPrediction.predictions.map((prediction, idx) => (
                <div key={idx} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                    <h4>{prediction.role}</h4>
                    <div style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-sm)',
                      fontWeight: 'bold'
                    }}>
                      {prediction.probability}%
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 'var(--space-3)' }}>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Timeframe</div>
                    <div style={{ fontWeight: '500' }}>{prediction.timeframe}</div>
                  </div>
                  
                  <div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-1)' }}>
                      Requirements
                    </div>
                    <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                      {prediction.requirements.map((req, reqIdx) => (
                        <li key={reqIdx} style={{ marginBottom: 'var(--space-1)' }}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <Brain size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4>AI Career Path Prediction</h4>
              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
                Get AI-powered predictions about your future career opportunities
              </p>
              <button className="btn primary" onClick={predictCareer}>
                <Brain size={16} />
                Analyze My Career Path
              </button>
            </div>
          )}
        </div>
      )}

      {/* Sentiment Analysis Tab */}
      {activeTab === 'sentiment' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Resume Sentiment Analysis</h3>
            <button className="btn primary" onClick={analyzeSentiment}>
              <BarChart3 size={16} />
              Analyze Sentiment
            </button>
          </div>
          
          {sentimentAnalysis ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
              <div className="card">
                <h4>Sentiment Breakdown</h4>
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span>Positive</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--success)' }}>{sentimentAnalysis.sentiment.positive}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span>Neutral</span>
                    <span style={{ fontWeight: 'bold' }}>{sentimentAnalysis.sentiment.neutral}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Negative</span>
                    <span style={{ fontWeight: 'bold', color: 'var(--error)' }}>{sentimentAnalysis.sentiment.negative}%</span>
                  </div>
                </div>
                
                <h5>Tone Analysis</h5>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span>Professional</span>
                    <span style={{ fontWeight: 'bold' }}>{sentimentAnalysis.tone.professional}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span>Confident</span>
                    <span style={{ fontWeight: 'bold' }}>{sentimentAnalysis.tone.confident}%</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Enthusiastic</span>
                    <span style={{ fontWeight: 'bold' }}>{sentimentAnalysis.tone.enthusiastic}%</span>
                  </div>
                </div>
              </div>
              
              <div className="card">
                <h4>Improvement Suggestions</h4>
                <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                  {sentimentAnalysis.suggestions.map((suggestion, idx) => (
                    <li key={idx} style={{ marginBottom: 'var(--space-2)' }}>{suggestion}</li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <BarChart3 size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4>Resume Sentiment Map</h4>
              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
                Analyze the tone and professionalism of your resume content
              </p>
              <button className="btn primary" onClick={analyzeSentiment}>
                <BarChart3 size={16} />
                Analyze My Resume
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bias Detection Tab */}
      {activeTab === 'bias' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>AI Bias Detector</h3>
            <button className="btn primary" onClick={detectBias}>
              <AlertTriangle size={16} />
              Detect Bias
            </button>
          </div>
          
          {biasDetection ? (
            <div>
              <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <h4>Overall Bias Score</h4>
                  <div style={{ 
                    fontSize: 'var(--text-2xl)', 
                    fontWeight: 'bold',
                    color: biasDetection.overallScore >= 90 ? 'var(--success)' : 
                           biasDetection.overallScore >= 70 ? 'var(--warning)' : 'var(--error)'
                  }}>
                    {biasDetection.overallScore}/100
                  </div>
                </div>
                <p style={{ color: 'var(--text-soft)' }}>
                  {biasDetection.overallScore >= 90 ? 'Excellent! Your resume shows minimal bias.' :
                   biasDetection.overallScore >= 70 ? 'Good, but there are some areas to improve.' :
                   'Several bias issues detected that should be addressed.'}
                </p>
              </div>
              
              {biasDetection.biases.length > 0 && (
                <div className="card">
                  <h4>Detected Biases</h4>
                  {biasDetection.biases.map((bias, idx) => (
                    <div key={idx} style={{ 
                      padding: 'var(--space-3)', 
                      border: '1px solid var(--border)', 
                      borderRadius: 'var(--radius)',
                      marginBottom: 'var(--space-3)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                        <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{bias.type} Bias</span>
                        <span style={{ 
                          padding: 'var(--space-1) var(--space-2)', 
                          borderRadius: 'var(--radius)', 
                          fontSize: 'var(--text-xs)',
                          background: bias.severity === 'high' ? 'var(--error-light)' : 
                                     bias.severity === 'medium' ? 'var(--warning-light)' : 'var(--success-light)',
                          color: bias.severity === 'high' ? 'var(--error)' : 
                                 bias.severity === 'medium' ? 'var(--warning)' : 'var(--success)',
                          textTransform: 'capitalize'
                        }}>
                          {bias.severity}
                        </span>
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>
                        Found: "{bias.text}"
                      </div>
                      <div style={{ fontSize: 'var(--text-sm)' }}>
                        <strong>Suggestion:</strong> {bias.suggestion}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <AlertTriangle size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
              <h4>AI Bias Detection</h4>
              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
                Detect and remove potential gender, age, or cultural bias from your resume
              </p>
              <button className="btn primary" onClick={detectBias}>
                <AlertTriangle size={16} />
                Scan for Bias
              </button>
            </div>
          )}
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && trends && (
        <div>
          <h3>Market Trends & Insights</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4>Emerging Skills</h4>
              {trends.emergingSkills.map(skill => (
                <div key={skill.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span>{skill.skill}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--success)', fontWeight: 'bold' }}>{skill.growth}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>{skill.demand}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Hot Job Roles</h4>
              {trends.hotJobs.map(job => (
                <div key={job.role} style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-1)' }}>
                    <span style={{ fontWeight: '500' }}>{job.role}</span>
                    <span style={{ color: 'var(--success)' }}>{job.growth}</span>
                  </div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    Avg Salary: ${(job.avgSalary / 1000).toFixed(0)}k
                  </div>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Declining Skills</h4>
              {trends.decliningSkills.map(skill => (
                <div key={skill.skill} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <span>{skill.skill}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--error)', fontWeight: 'bold' }}>{skill.growth}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-soft)' }}>{skill.demand}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Industry Growth</h4>
              {trends.industryGrowth.map(industry => (
                <div key={industry.industry} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{industry.industry}</span>
                  <span style={{ color: 'var(--success)', fontWeight: 'bold' }}>{industry.growth}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}