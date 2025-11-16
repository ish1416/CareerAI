import React, { useState } from 'react';
import { Globe, Eye, Settings, Plus, ExternalLink, Github, Star, BarChart3, Palette, Upload, Share2 } from 'lucide-react';

export default function ProPortfolio() {
  const [currentStep, setCurrentStep] = useState(1);
  const [portfolio, setPortfolio] = useState({
    domain: 'john-doe.careerai.dev',
    isPublished: true,
    template: 'modern',
    analytics: { views: 1247, clicks: 89, recruiterViews: 23 }
  });

  const steps = [
    { id: 1, title: 'Setup', desc: 'Basic configuration' },
    { id: 2, title: 'Content', desc: 'Add projects & content' },
    { id: 3, title: 'Design', desc: 'Choose template & style' },
    { id: 4, title: 'Publish', desc: 'Go live & share' }
  ];

  const projects = [
    {
      id: 1,
      name: 'E-commerce Platform',
      description: 'Full-stack web application with React and Node.js',
      technologies: ['React', 'Node.js', 'MongoDB'],
      githubUrl: 'https://github.com/user/ecommerce',
      liveUrl: 'https://ecommerce-demo.com',
      image: null
    },
    {
      id: 2,
      name: 'AI Chat Bot',
      description: 'Intelligent chatbot using natural language processing',
      technologies: ['Python', 'TensorFlow', 'Flask'],
      githubUrl: 'https://github.com/user/chatbot',
      liveUrl: null,
      image: null
    }
  ];

  const templates = [
    { id: 'modern', name: 'Modern', preview: 'Clean and minimal design' },
    { id: 'creative', name: 'Creative', preview: 'Bold and artistic layout' },
    { id: 'professional', name: 'Professional', preview: 'Corporate-friendly design' }
  ];

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div>
          <h1 className="pro-title">Portfolio Builder</h1>
          <p className="pro-subtitle">Create your professional online presence</p>
        </div>
        <div className="pro-header-actions">
          <button className="pro-btn-secondary">
            <Eye size={16} />
            Preview
          </button>
          <button className="pro-btn-primary">
            <Share2 size={16} />
            Share Portfolio
          </button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="pro-steps">
        {steps.map((step) => (
          <div
            key={step.id}
            className={`pro-step ${currentStep >= step.id ? 'active' : ''} ${currentStep === step.id ? 'current' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="pro-step-number">{step.id}</div>
            <div className="pro-step-content">
              <div className="pro-step-title">{step.title}</div>
              <div className="pro-step-desc">{step.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Overview */}
      <div className="pro-stats-grid">
        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Globe size={20} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{portfolio.domain}</div>
            <div className="pro-stat-label">Portfolio URL</div>
          </div>
        </div>
        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Eye size={20} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{portfolio.analytics.views.toLocaleString()}</div>
            <div className="pro-stat-label">Total Views</div>
          </div>
        </div>
        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <BarChart3 size={20} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{portfolio.analytics.clicks}</div>
            <div className="pro-stat-label">Project Clicks</div>
          </div>
        </div>
        <div className="pro-stat-card">
          <div className="pro-stat-icon">
            <Star size={20} />
          </div>
          <div className="pro-stat-content">
            <div className="pro-stat-value">{portfolio.analytics.recruiterViews}</div>
            <div className="pro-stat-label">Recruiter Views</div>
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="pro-content">
        {/* Step 1: Setup */}
        {currentStep === 1 && (
          <div className="pro-step-content-wrapper">
            <div className="pro-section-header">
              <h2>Portfolio Setup</h2>
              <p>Configure your basic portfolio settings</p>
            </div>
            
            <div className="pro-form-grid">
              <div className="pro-form-section">
                <h3>Domain Settings</h3>
                <div className="pro-form-group">
                  <label>Portfolio URL</label>
                  <div className="pro-input-group">
                    <input 
                      type="text" 
                      value="john-doe" 
                      className="pro-input"
                    />
                    <span className="pro-input-suffix">.careerai.dev</span>
                  </div>
                </div>
                <div className="pro-form-group">
                  <label>Custom Domain (Optional)</label>
                  <input 
                    type="text" 
                    placeholder="yourdomain.com" 
                    className="pro-input"
                  />
                </div>
              </div>

              <div className="pro-form-section">
                <h3>Visibility</h3>
                <div className="pro-form-group">
                  <div className="pro-toggle-group">
                    <label className="pro-toggle">
                      <input type="checkbox" checked={portfolio.isPublished} />
                      <span className="pro-toggle-slider"></span>
                    </label>
                    <div>
                      <div className="pro-toggle-label">Portfolio is live</div>
                      <div className="pro-toggle-desc">Make your portfolio publicly accessible</div>
                    </div>
                  </div>
                </div>
                <div className="pro-form-group">
                  <div className="pro-toggle-group">
                    <label className="pro-toggle">
                      <input type="checkbox" />
                      <span className="pro-toggle-slider"></span>
                    </label>
                    <div>
                      <div className="pro-toggle-label">SEO Optimization</div>
                      <div className="pro-toggle-desc">Optimize for search engines</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pro-step-actions">
              <button 
                className="pro-btn-primary"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Content
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Content */}
        {currentStep === 2 && (
          <div className="pro-step-content-wrapper">
            <div className="pro-section-header">
              <h2>Portfolio Content</h2>
              <p>Add and manage your projects and achievements</p>
            </div>

            <div className="pro-content-section">
              <div className="pro-section-header-small">
                <h3>Projects</h3>
                <button className="pro-btn-secondary">
                  <Plus size={16} />
                  Add Project
                </button>
              </div>

              <div className="pro-projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="pro-project-card">
                    <div className="pro-project-image">
                      {project.image ? (
                        <img src={project.image} alt={project.name} />
                      ) : (
                        <div className="pro-project-placeholder">
                          <Upload size={24} />
                          <span>Add Screenshot</span>
                        </div>
                      )}
                    </div>
                    <div className="pro-project-content">
                      <h4>{project.name}</h4>
                      <p>{project.description}</p>
                      <div className="pro-project-tech">
                        {project.technologies.map((tech) => (
                          <span key={tech} className="pro-tech-tag">{tech}</span>
                        ))}
                      </div>
                      <div className="pro-project-actions">
                        {project.githubUrl && (
                          <button className="pro-btn-ghost">
                            <Github size={14} />
                            Code
                          </button>
                        )}
                        {project.liveUrl && (
                          <button className="pro-btn-ghost">
                            <ExternalLink size={14} />
                            Live Demo
                          </button>
                        )}
                        <button className="pro-btn-ghost">
                          <Settings size={14} />
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pro-step-actions">
              <button 
                className="pro-btn-secondary"
                onClick={() => setCurrentStep(1)}
              >
                Back
              </button>
              <button 
                className="pro-btn-primary"
                onClick={() => setCurrentStep(3)}
              >
                Continue to Design
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Design */}
        {currentStep === 3 && (
          <div className="pro-step-content-wrapper">
            <div className="pro-section-header">
              <h2>Design & Templates</h2>
              <p>Choose a template and customize your portfolio appearance</p>
            </div>

            <div className="pro-templates-grid">
              {templates.map((template) => (
                <div 
                  key={template.id} 
                  className={`pro-template-card ${portfolio.template === template.id ? 'selected' : ''}`}
                  onClick={() => setPortfolio({...portfolio, template: template.id})}
                >
                  <div className="pro-template-preview">
                    <div className="pro-template-mockup">
                      <div className="pro-mockup-header"></div>
                      <div className="pro-mockup-content">
                        <div className="pro-mockup-text"></div>
                        <div className="pro-mockup-text short"></div>
                      </div>
                    </div>
                  </div>
                  <div className="pro-template-info">
                    <h4>{template.name}</h4>
                    <p>{template.preview}</p>
                  </div>
                  {portfolio.template === template.id && (
                    <div className="pro-template-selected">
                      <Star size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="pro-customization-section">
              <h3>Customization</h3>
              <div className="pro-customization-grid">
                <div className="pro-form-group">
                  <label>Primary Color</label>
                  <div className="pro-color-picker">
                    <input type="color" value="#0070f3" />
                    <span>#0070f3</span>
                  </div>
                </div>
                <div className="pro-form-group">
                  <label>Font Style</label>
                  <select className="pro-select">
                    <option>Inter (Recommended)</option>
                    <option>Roboto</option>
                    <option>Open Sans</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="pro-step-actions">
              <button 
                className="pro-btn-secondary"
                onClick={() => setCurrentStep(2)}
              >
                Back
              </button>
              <button 
                className="pro-btn-primary"
                onClick={() => setCurrentStep(4)}
              >
                Continue to Publish
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Publish */}
        {currentStep === 4 && (
          <div className="pro-step-content-wrapper">
            <div className="pro-section-header">
              <h2>Publish & Share</h2>
              <p>Make your portfolio live and share it with the world</p>
            </div>

            <div className="pro-publish-preview">
              <div className="pro-preview-card">
                <div className="pro-preview-header">
                  <Globe size={20} />
                  <div>
                    <h4>Your Portfolio is Ready!</h4>
                    <p>{portfolio.domain}</p>
                  </div>
                  <div className={`pro-status ${portfolio.isPublished ? 'live' : 'draft'}`}>
                    {portfolio.isPublished ? 'Live' : 'Draft'}
                  </div>
                </div>
                <div className="pro-preview-actions">
                  <button className="pro-btn-primary">
                    <ExternalLink size={16} />
                    View Live Portfolio
                  </button>
                  <button className="pro-btn-secondary">
                    <Share2 size={16} />
                    Share Link
                  </button>
                </div>
              </div>
            </div>

            <div className="pro-sharing-section">
              <h3>Share Your Portfolio</h3>
              <div className="pro-sharing-grid">
                <div className="pro-share-option">
                  <h4>Direct Link</h4>
                  <div className="pro-copy-link">
                    <input 
                      type="text" 
                      value={`https://${portfolio.domain}`} 
                      readOnly 
                      className="pro-input"
                    />
                    <button className="pro-btn-ghost">Copy</button>
                  </div>
                </div>
                <div className="pro-share-option">
                  <h4>QR Code</h4>
                  <div className="pro-qr-placeholder">
                    <div className="pro-qr-code"></div>
                    <button className="pro-btn-ghost">Download QR</button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pro-step-actions">
              <button 
                className="pro-btn-secondary"
                onClick={() => setCurrentStep(3)}
              >
                Back
              </button>
              <button className="pro-btn-primary">
                <Palette size={16} />
                Generate with AI
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}