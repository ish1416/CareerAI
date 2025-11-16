import React, { useState } from 'react';
import { 
  Save, Download, Eye, Settings, Plus, Trash2, Move, 
  FileText, User, Briefcase, GraduationCap, Award, 
  Code, Languages, Heart, Zap, BarChart3
} from 'lucide-react';

export default function ModernResumeBuilder() {
  const [activeSection, setActiveSection] = useState('personal');
  const [resumeScore, setResumeScore] = useState(87);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: User, completed: true },
    { id: 'experience', label: 'Experience', icon: Briefcase, completed: true },
    { id: 'education', label: 'Education', icon: GraduationCap, completed: true },
    { id: 'skills', label: 'Skills', icon: Code, completed: false },
    { id: 'projects', label: 'Projects', icon: FileText, completed: false },
    { id: 'certifications', label: 'Certifications', icon: Award, completed: false }
  ];

  const templates = [
    { id: 1, name: 'Professional', preview: '/api/placeholder/200/280' },
    { id: 2, name: 'Modern', preview: '/api/placeholder/200/280' },
    { id: 3, name: 'Creative', preview: '/api/placeholder/200/280' },
    { id: 4, name: 'Minimal', preview: '/api/placeholder/200/280' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr 350px', gap: 'var(--space-6)', height: 'calc(100vh - 120px)' }}>
      {/* Left Sidebar - Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Resume Score */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
            <span className="text-sm font-medium">Resume Score</span>
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--success)', marginBottom: 'var(--space-2)' }}>
            {resumeScore}/100
          </div>
          <div style={{ width: '100%', height: 6, background: 'var(--gray-200)', borderRadius: 3 }}>
            <div
              style={{
                width: `${resumeScore}%`,
                height: '100%',
                background: 'var(--success)',
                borderRadius: 3
              }}
            />
          </div>
          <p className="text-xs text-muted" style={{ marginTop: 'var(--space-2)' }}>
            Great! Add skills to reach 90+
          </p>
        </div>

        {/* Sections */}
        <div className="card" style={{ padding: 'var(--space-4)', flex: 1 }}>
          <h3 className="text-base font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
            Resume Sections
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    padding: 'var(--space-3)',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    background: activeSection === section.id ? 'var(--primary)' : 'transparent',
                    color: activeSection === section.id ? 'white' : 'var(--text)',
                    cursor: 'pointer',
                    transition: 'var(--transition)',
                    width: '100%',
                    textAlign: 'left'
                  }}
                >
                  <Icon size={18} />
                  <span className="text-sm font-medium">{section.label}</span>
                  {section.completed && (
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: activeSection === section.id ? 'white' : 'var(--success)',
                        marginLeft: 'auto'
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
          <button className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Save size={16} />
            Save Resume
          </button>
          <button className="btn" style={{ justifyContent: 'center' }}>
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Main Content - Form */}
      <div className="card" style={{ padding: 'var(--space-6)', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
          <h2 className="text-xl font-semibold">
            {sections.find(s => s.id === activeSection)?.label}
          </h2>
          <button className="btn btn-sm">
            <Plus size={16} />
            Add Item
          </button>
        </div>

        {/* Personal Info Form */}
        {activeSection === 'personal' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  First Name
                </label>
                <input className="input" placeholder="John" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Last Name
                </label>
                <input className="input" placeholder="Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Professional Title
              </label>
              <input className="input" placeholder="Senior Software Engineer" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Email
                </label>
                <input className="input" type="email" placeholder="john@example.com" />
              </div>
              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Phone
                </label>
                <input className="input" placeholder="+1 (555) 123-4567" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Professional Summary
              </label>
              <textarea
                className="input"
                rows={4}
                placeholder="Write a compelling summary of your professional experience..."
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>
        )}

        {/* Experience Form */}
        {activeSection === 'experience' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <div className="card" style={{ padding: 'var(--space-4)', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'between', marginBottom: 'var(--space-4)' }}>
                <h4 className="text-base font-medium">Senior Software Engineer</h4>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button style={{ padding: 'var(--space-1)', border: 'none', background: 'transparent', cursor: 'pointer' }}>
                    <Move size={16} />
                  </button>
                  <button style={{ padding: 'var(--space-1)', border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--error)' }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Company
                  </label>
                  <input className="input" placeholder="Google" />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Location
                  </label>
                  <input className="input" placeholder="Mountain View, CA" />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    Start Date
                  </label>
                  <input className="input" type="month" />
                </div>
                <div>
                  <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                    End Date
                  </label>
                  <input className="input" type="month" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                  Description
                </label>
                <textarea
                  className="input"
                  rows={3}
                  placeholder="Describe your key responsibilities and achievements..."
                />
              </div>
            </div>
          </div>
        )}

        {/* Skills Form */}
        {activeSection === 'skills' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div>
              <label className="text-sm font-medium" style={{ display: 'block', marginBottom: 'var(--space-2)' }}>
                Technical Skills
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {['React', 'Node.js', 'Python', 'AWS', 'Docker'].map((skill) => (
                  <span
                    key={skill}
                    style={{
                      padding: 'var(--space-1) var(--space-3)',
                      background: 'var(--gray-100)',
                      borderRadius: 'var(--radius)',
                      fontSize: 'var(--text-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 'var(--space-2)'
                    }}
                  >
                    {skill}
                    <button style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
                      <Trash2 size={12} />
                    </button>
                  </span>
                ))}
              </div>
              <input className="input" placeholder="Add a skill..." />
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Preview & Templates */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {/* Preview */}
        <div className="card" style={{ padding: 'var(--space-4)', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
            <h3 className="text-base font-semibold">Preview</h3>
            <button className="btn btn-sm">
              <Eye size={16} />
              Full View
            </button>
          </div>
          <div
            style={{
              width: '100%',
              height: 400,
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <FileText size={48} style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-2)' }} />
              <p className="text-sm text-muted">Resume preview will appear here</p>
            </div>
          </div>
        </div>

        {/* Templates */}
        <div className="card" style={{ padding: 'var(--space-4)' }}>
          <h3 className="text-base font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
            Templates
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)' }}>
            {templates.map((template) => (
              <button
                key={template.id}
                style={{
                  padding: 'var(--space-2)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--background)',
                  cursor: 'pointer',
                  transition: 'var(--transition)'
                }}
              >
                <div
                  style={{
                    width: '100%',
                    height: 80,
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--radius-sm)',
                    marginBottom: 'var(--space-2)'
                  }}
                />
                <span className="text-xs">{template.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}