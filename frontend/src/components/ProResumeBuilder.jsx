import React, { useState } from 'react';
import { Save, Download, Eye, Upload, Plus, Trash2, ChevronRight, FileText, User, Briefcase, GraduationCap, Award, Code, Target } from 'lucide-react';

export default function ProResumeBuilder() {
  const [activeStep, setActiveStep] = useState(0);
  const [resumeData, setResumeData] = useState({
    personal: { name: '', email: '', phone: '', title: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  const steps = [
    { id: 'personal', label: 'Personal', icon: User, progress: 100 },
    { id: 'summary', label: 'Summary', icon: FileText, progress: 80 },
    { id: 'experience', label: 'Experience', icon: Briefcase, progress: 60 },
    { id: 'education', label: 'Education', icon: GraduationCap, progress: 40 },
    { id: 'skills', label: 'Skills', icon: Code, progress: 20 },
    { id: 'projects', label: 'Projects', icon: Target, progress: 0 }
  ];

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, {
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      }]
    }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 0, height: 'calc(100vh - 120px)' }}>
      {/* Left Sidebar - Steps */}
      <div style={{ background: 'var(--surface)', borderRight: '1px solid var(--border)', padding: 'var(--space-6)' }}>
        <div style={{ marginBottom: 'var(--space-8)' }}>
          <h2 className="text-xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>Resume Builder</h2>
          <p className="text-sm text-secondary">Complete each step to build your resume</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            const isCompleted = step.progress === 100;
            
            return (
              <button
                key={step.id}
                onClick={() => setActiveStep(index)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--space-3)',
                  padding: 'var(--space-4)',
                  border: 'none',
                  borderRadius: 'var(--radius-lg)',
                  background: isActive ? 'var(--primary)' : 'transparent',
                  color: isActive ? 'white' : 'var(--text)',
                  cursor: 'pointer',
                  transition: 'var(--transition)',
                  width: '100%',
                  textAlign: 'left'
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--radius)',
                    background: isActive ? 'rgba(255,255,255,0.2)' : isCompleted ? 'var(--success)' : 'var(--gray-100)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isActive ? 'white' : isCompleted ? 'white' : 'var(--text-secondary)'
                  }}
                >
                  <Icon size={18} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="text-sm font-medium">{step.label}</div>
                  <div style={{ width: '100%', height: 4, background: isActive ? 'rgba(255,255,255,0.2)' : 'var(--gray-200)', borderRadius: 2, marginTop: 4 }}>
                    <div
                      style={{
                        width: `${step.progress}%`,
                        height: '100%',
                        background: isActive ? 'white' : 'var(--primary)',
                        borderRadius: 2,
                        transition: 'var(--transition)'
                      }}
                    />
                  </div>
                </div>
                <ChevronRight size={16} style={{ opacity: isActive ? 1 : 0.5 }} />
              </button>
            );
          })}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 'var(--space-8)' }}>
          <button className="btn btn-primary" style={{ width: '100%', marginBottom: 'var(--space-3)' }}>
            <Save size={16} />
            Save Resume
          </button>
          <button className="btn" style={{ width: '100%' }}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: 'var(--space-8)', overflow: 'auto' }}>
        {/* Personal Information */}
        {activeStep === 0 && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ marginBottom: 'var(--space-8)' }}>
              <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>Personal Information</h1>
              <p className="text-secondary">Let's start with your basic information</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    First Name *
                  </label>
                  <input className="input" placeholder="John" />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Last Name *
                  </label>
                  <input className="input" placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Professional Title *
                </label>
                <input className="input" placeholder="Senior Software Engineer" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Email Address *
                  </label>
                  <input className="input" type="email" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Phone Number
                  </label>
                  <input className="input" placeholder="+1 (555) 123-4567" />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => setActiveStep(1)}
                >
                  Continue
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Experience */}
        {activeStep === 2 && (
          <div style={{ maxWidth: 800 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-8)' }}>
              <div>
                <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>Work Experience</h1>
                <p className="text-secondary">Add your professional experience</p>
              </div>
              <button className="btn btn-primary" onClick={addExperience}>
                <Plus size={16} />
                Add Experience
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {resumeData.experience.length === 0 ? (
                <div className="card" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
                  <Briefcase size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-4)' }} />
                  <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-2)' }}>No experience added yet</h3>
                  <p className="text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
                    Click "Add Experience" to get started
                  </p>
                  <button className="btn btn-primary" onClick={addExperience}>
                    <Plus size={16} />
                    Add Your First Job
                  </button>
                </div>
              ) : (
                resumeData.experience.map((exp, index) => (
                  <div key={exp.id} className="card" style={{ padding: 'var(--space-6)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
                      <h3 className="text-lg font-semibold">Experience #{index + 1}</h3>
                      <button
                        style={{
                          padding: 'var(--space-2)',
                          border: 'none',
                          background: 'transparent',
                          color: 'var(--error)',
                          cursor: 'pointer',
                          borderRadius: 'var(--radius)'
                        }}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                      <div>
                        <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                          Job Title *
                        </label>
                        <input className="input" placeholder="Software Engineer" />
                      </div>
                      <div>
                        <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                          Company *
                        </label>
                        <input className="input" placeholder="Google" />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                      <div>
                        <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                          Start Date *
                        </label>
                        <input className="input" type="month" />
                      </div>
                      <div>
                        <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                          End Date
                        </label>
                        <input className="input" type="month" />
                      </div>
                      <div style={{ display: 'flex', alignItems: 'end' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                          <input type="checkbox" />
                          <span className="text-sm">Currently working here</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                        Description
                      </label>
                      <textarea
                        className="input"
                        rows={4}
                        placeholder="Describe your key responsibilities and achievements..."
                      />
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'var(--space-8)' }}>
              <button className="btn" onClick={() => setActiveStep(1)}>
                Back
              </button>
              <button className="btn btn-primary" onClick={() => setActiveStep(3)}>
                Continue
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}