import React, { useState } from 'react';
import { Upload, FileText, Target, TrendingUp, AlertCircle, CheckCircle, Zap, ArrowRight } from 'lucide-react';

export default function ProJobMatch() {
  const [step, setStep] = useState(1);
  const [resumeData, setResumeData] = useState(null);
  const [jobData, setJobData] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const mockMatchResult = {
    overallMatch: 78,
    sections: {
      skills: { match: 85, missing: ['React Native', 'GraphQL'] },
      experience: { match: 72, missing: ['Team Leadership', 'Agile'] },
      keywords: { match: 80, missing: ['CI/CD', 'Docker'] }
    },
    suggestions: [
      'Add React Native experience to mobile development section',
      'Highlight team leadership and project management skills',
      'Include DevOps tools like Docker and CI/CD pipelines'
    ]
  };

  const handleAnalyze = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setMatchResult(mockMatchResult);
      setIsAnalyzing(false);
      setStep(3);
    }, 2000);
  };

  const getMatchColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Job Match Analysis
        </h1>
        <p className="text-secondary">
          Compare your resume against job requirements and get optimization suggestions.
        </p>
      </div>

      {/* Progress Steps */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
        {[
          { num: 1, label: 'Upload Resume', active: step >= 1, completed: step > 1 },
          { num: 2, label: 'Add Job Description', active: step >= 2, completed: step > 2 },
          { num: 3, label: 'View Results', active: step >= 3, completed: false }
        ].map((s, index) => (
          <React.Fragment key={s.num}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: s.completed ? 'var(--success)' : s.active ? 'var(--primary)' : 'var(--gray-200)',
                  color: s.active || s.completed ? 'white' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 600,
                  fontSize: 'var(--text-sm)'
                }}
              >
                {s.completed ? <CheckCircle size={20} /> : s.num}
              </div>
              <span className={`text-sm ${s.active ? 'font-medium' : 'text-muted'}`}>
                {s.label}
              </span>
            </div>
            {index < 2 && (
              <div
                style={{
                  flex: 1,
                  height: 2,
                  background: step > s.num ? 'var(--success)' : 'var(--gray-200)',
                  margin: '0 var(--space-4)'
                }}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Step 1: Upload Resume */}
      {step === 1 && (
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
            <FileText size={32} />
          </div>
          
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-3)' }}>
            Upload Your Resume
          </h2>
          <p className="text-secondary" style={{ marginBottom: 'var(--space-6)' }}>
            Upload your current resume to analyze against job requirements
          </p>

          <div
            style={{
              border: '2px dashed var(--border)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-8)',
              marginBottom: 'var(--space-6)',
              cursor: 'pointer'
            }}
          >
            <Upload size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-3)' }} />
            <p className="text-sm text-secondary">
              Drag and drop your resume here, or click to browse
            </p>
          </div>

          <button 
            className="btn btn-primary"
            onClick={() => {
              setResumeData({ name: 'resume.pdf' });
              setStep(2);
            }}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* Step 2: Job Description */}
      {step === 2 && (
        <div className="card" style={{ padding: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold" style={{ marginBottom: 'var(--space-6)' }}>
            Add Job Description
          </h2>
          
          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Job Title
            </label>
            <input className="input" placeholder="e.g., Senior Software Engineer" />
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Company
            </label>
            <input className="input" placeholder="e.g., Google" />
          </div>

          <div style={{ marginBottom: 'var(--space-6)' }}>
            <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
              Job Description
            </label>
            <textarea
              className="input"
              rows={8}
              placeholder="Paste the complete job description here..."
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button className="btn" onClick={() => setStep(1)}>
              Back
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <div style={{ width: 16, height: 16, border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Analyzing Match...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Analyze Match
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Results */}
      {step === 3 && matchResult && (
        <div>
          {/* Overall Match Score */}
          <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 className="text-2xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
                  Match Score
                </h2>
                <p className="text-secondary">How well your resume matches this job</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div
                  className="text-4xl font-bold"
                  style={{ color: getMatchColor(matchResult.overallMatch), marginBottom: 'var(--space-2)' }}
                >
                  {matchResult.overallMatch}%
                </div>
                <div style={{ width: 120, height: 8, background: 'var(--gray-200)', borderRadius: 4 }}>
                  <div
                    style={{
                      width: `${matchResult.overallMatch}%`,
                      height: '100%',
                      background: getMatchColor(matchResult.overallMatch),
                      borderRadius: 4
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section Breakdown */}
          <div className="grid grid-3" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
            {Object.entries(matchResult.sections).map(([key, data]) => (
              <div key={key} className="card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                  <h3 className="text-lg font-semibold" style={{ textTransform: 'capitalize' }}>
                    {key}
                  </h3>
                  <span
                    className="text-xl font-bold"
                    style={{ color: getMatchColor(data.match) }}
                  >
                    {data.match}%
                  </span>
                </div>
                
                <div style={{ marginBottom: 'var(--space-4)' }}>
                  <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
                    <div
                      style={{
                        width: `${data.match}%`,
                        height: '100%',
                        background: getMatchColor(data.match),
                        borderRadius: 3
                      }}
                    />
                  </div>
                </div>

                {data.missing.length > 0 && (
                  <div>
                    <p className="text-xs text-muted" style={{ marginBottom: 'var(--space-2)' }}>
                      Missing:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                      {data.missing.map((item, index) => (
                        <span
                          key={index}
                          style={{
                            padding: '2px 6px',
                            background: 'var(--error)',
                            color: 'white',
                            borderRadius: 'var(--radius-sm)',
                            fontSize: 'var(--text-xs)'
                          }}
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Suggestions */}
          <div className="card" style={{ padding: 'var(--space-6)' }}>
            <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
              Optimization Suggestions
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {matchResult.suggestions.map((suggestion, index) => (
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
                  <Target size={20} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: 2 }} />
                  <p className="text-sm" style={{ margin: 0, lineHeight: 1.5 }}>
                    {suggestion}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-4)', marginTop: 'var(--space-8)' }}>
            <button className="btn" onClick={() => setStep(1)}>
              Try Another Job
            </button>
            <button className="btn btn-primary">
              <Zap size={16} />
              Optimize Resume
            </button>
          </div>
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