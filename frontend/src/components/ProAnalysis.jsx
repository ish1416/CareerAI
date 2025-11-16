import React, { useState } from 'react';
import { Upload, FileText, BarChart3, Target, Zap, CheckCircle, AlertCircle, TrendingUp, Download, Eye } from 'lucide-react';

export default function ProAnalysis() {
  const [activeTab, setActiveTab] = useState('upload');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const tabs = [
    { id: 'upload', label: 'Upload Resume', icon: Upload },
    { id: 'analysis', label: 'Analysis Results', icon: BarChart3 },
    { id: 'suggestions', label: 'Improvements', icon: Target },
    { id: 'preview', label: 'Preview', icon: Eye }
  ];

  const mockAnalysis = {
    overallScore: 87,
    sections: {
      ats: { score: 92, status: 'excellent' },
      keywords: { score: 84, status: 'good' },
      format: { score: 89, status: 'excellent' },
      content: { score: 81, status: 'good' }
    },
    suggestions: [
      'Add more quantified achievements with specific metrics',
      'Include relevant technical skills for your target role',
      'Optimize summary section with industry keywords'
    ],
    missingKeywords: ['React', 'Node.js', 'AWS', 'Agile', 'CI/CD']
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setAnalysisResult(mockAnalysis);
      setIsAnalyzing(false);
      setActiveTab('analysis');
    }, 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'var(--success)';
    if (score >= 70) return 'var(--warning)';
    return 'var(--error)';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'excellent': return <CheckCircle size={16} style={{ color: 'var(--success)' }} />;
      case 'good': return <TrendingUp size={16} style={{ color: 'var(--warning)' }} />;
      default: return <AlertCircle size={16} style={{ color: 'var(--error)' }} />;
    }
  };

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Resume Analysis
        </h1>
        <p className="text-secondary">
          Get AI-powered insights to optimize your resume for ATS systems and recruiters.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-2)',
                padding: 'var(--space-3) var(--space-4)',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                borderBottom: isActive ? '2px solid var(--primary)' : '2px solid transparent',
                cursor: 'pointer',
                transition: 'var(--transition)',
                fontSize: 'var(--text-sm)',
                fontWeight: isActive ? 600 : 500
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Upload Tab */}
      {activeTab === 'upload' && (
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
            <div
              style={{
                width: 80,
                height: 80,
                background: 'var(--gray-100)',
                borderRadius: 'var(--radius-xl)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto var(--space-6)',
                color: 'var(--primary)'
              }}
            >
              <Upload size={32} />
            </div>
            
            <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-3)' }}>
              Upload Your Resume
            </h2>
            <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
              Upload your resume in PDF or DOCX format for comprehensive analysis
            </p>

            <div
              style={{
                border: '2px dashed var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-8)',
                marginBottom: 'var(--space-6)',
                cursor: 'pointer',
                transition: 'var(--transition)'
              }}
              onMouseEnter={(e) => e.target.style.borderColor = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.borderColor = 'var(--border)'}
            >
              <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }} />
              <p className="text-sm text-secondary">
                Drag and drop your resume here, or click to browse
              </p>
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'center' }}>
              <button className="btn">
                Choose File
              </button>
              <button 
                className="btn btn-primary"
                onClick={handleAnalyze}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <div style={{ width: 16, height: 16, border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap size={16} />
                    Start Analysis
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results Tab */}
      {activeTab === 'analysis' && analysisResult && (
        <div>
          {/* Overall Score */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
                  Overall Score
                </h2>
                <p className="text-secondary">Your resume performance across all criteria</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  className="text-4xl font-bold"
                  style={{ color: getScoreColor(analysisResult.overallScore), marginBottom: 'var(--space-2)' }}
                >
                  {analysisResult.overallScore}%
                </div>
                <div style={{ width: 120, height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                  <div
                    style={{
                      width: `${analysisResult.overallScore}%`,
                      height: '100%',
                      background: getScoreColor(analysisResult.overallScore),
                      borderRadius: 4
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Scores */}
          <div className="grid grid-2" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {Object.entries(analysisResult.sections).map(([key, data]) => (
              <div key={key} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    {getStatusIcon(data.status)}
                    <h3 className="text-lg font-semibold" style={{ textTransform: 'capitalize' }}>
                      {key === 'ats' ? 'ATS Compatibility' : key}
                    </h3>
                  </div>
                  <span
                    className="text-xl font-bold"
                    style={{ color: getScoreColor(data.score) }}
                  >
                    {data.score}%
                  </span>
                </div>
                <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                  <div
                    style={{
                      width: `${data.score}%`,
                      height: '100%',
                      background: getScoreColor(data.score),
                      borderRadius: 3
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Missing Keywords */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
              Missing Keywords
            </h3>
            <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
              Add these keywords to improve your ATS score
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {analysisResult.missingKeywords.map((keyword, index) => (
                <span
                  key={index}
                  style={{
                    padding: 'var(--space-1) var(--space-3)',
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-sm)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suggestions Tab */}
      {activeTab === 'suggestions' && analysisResult && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Improvement Suggestions
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {analysisResult.suggestions.map((suggestion, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  background: 'var(--gray-50)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border)'
                }}
              >
                <div
                  style={{
                    width: 24,
                    height: 24,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'bold',
                    flexShrink: 0
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <p className="text-sm" style={{ margin: 0, lineHeight: 1.5 }}>
                    {suggestion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      {analysisResult && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
          <button className="btn">
            <Download size={16} />
            Download Report
          </button>
          <button className="btn btn-primary">
            <Zap size={16} />
            Optimize Resume
          </button>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}