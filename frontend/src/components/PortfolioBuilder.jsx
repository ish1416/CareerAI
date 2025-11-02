import React, { useState, useEffect } from 'react';
import { Globe, Eye, Settings, Plus, ExternalLink, Github, Star, BarChart3, Palette } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function PortfolioBuilder() {
  const [portfolio, setPortfolio] = useState(null);
  const [projects, setProjects] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [portfolioRes, projectsRes, testimonialsRes, templatesRes, analyticsRes] = await Promise.all([
        api.get('/portfolio/portfolio').catch(() => ({ data: { portfolio: null } })),
        api.get('/portfolio/projects').catch(() => ({ data: { projects: [] } })),
        api.get('/portfolio/testimonials').catch(() => ({ data: { testimonials: [] } })),
        api.get('/portfolio/templates').catch(() => ({ data: { templates: [] } })),
        api.get('/portfolio/analytics').catch(() => ({ data: { analytics: null } }))
      ]);
      
      setPortfolio(portfolioRes.data.portfolio);
      setProjects(projectsRes.data.projects);
      setTestimonials(testimonialsRes.data.testimonials);
      setTemplates(templatesRes.data.templates);
      setAnalytics(analyticsRes.data.analytics);
    } catch (error) {
      console.error('Failed to load portfolio data:', error);
    }
  };

  const generatePortfolio = async () => {
    try {
      const { data } = await api.post('/portfolio/generate', {
        resumeData: { name: 'John Doe', title: 'Developer' },
        projects: projects
      });
      showToast('Portfolio generated successfully!', 'success');
      setPortfolio({ ...portfolio, sections: data.portfolio });
    } catch (error) {
      showToast('Failed to generate portfolio', 'error');
    }
  };

  const addProject = async (projectData) => {
    try {
      const { data } = await api.post('/portfolio/projects', projectData);
      setProjects([...projects, data.project]);
      setShowProjectForm(false);
      showToast('Project added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add project', 'error');
    }
  };

  const addTestimonial = async (testimonialData) => {
    try {
      const { data } = await api.post('/portfolio/testimonials', testimonialData);
      setTestimonials([...testimonials, data.testimonial]);
      setShowTestimonialForm(false);
      showToast('Testimonial added successfully!', 'success');
    } catch (error) {
      showToast('Failed to add testimonial', 'error');
    }
  };

  const ProjectForm = () => {
    const [formData, setFormData] = useState({
      name: '', description: '', technologies: '', githubUrl: '', liveUrl: ''
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addProject({
        ...formData,
        technologies: formData.technologies.split(',').map(t => t.trim())
      });
    };

    return (
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <h3>Add New Project</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <input
            placeholder="Project Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <textarea
            placeholder="Project Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
            required
          />
          <input
            placeholder="Technologies (comma separated)"
            value={formData.technologies}
            onChange={(e) => setFormData({...formData, technologies: e.target.value})}
            required
          />
          <input
            placeholder="GitHub URL"
            value={formData.githubUrl}
            onChange={(e) => setFormData({...formData, githubUrl: e.target.value})}
          />
          <input
            placeholder="Live Demo URL"
            value={formData.liveUrl}
            onChange={(e) => setFormData({...formData, liveUrl: e.target.value})}
          />
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="btn primary">Add Project</button>
            <button type="button" className="btn ghost" onClick={() => setShowProjectForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  const TestimonialForm = () => {
    const [formData, setFormData] = useState({
      name: '', role: '', company: '', content: '', rating: 5
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      addTestimonial(formData);
    };

    return (
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <h3>Add Testimonial</h3>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 'var(--space-3)' }}>
          <input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          <input
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            required
          />
          <input
            placeholder="Company"
            value={formData.company}
            onChange={(e) => setFormData({...formData, company: e.target.value})}
            required
          />
          <textarea
            placeholder="Testimonial Content"
            value={formData.content}
            onChange={(e) => setFormData({...formData, content: e.target.value})}
            rows={3}
            required
          />
          <select
            value={formData.rating}
            onChange={(e) => setFormData({...formData, rating: parseInt(e.target.value)})}
          >
            {[5,4,3,2,1].map(rating => (
              <option key={rating} value={rating}>{rating} Stars</option>
            ))}
          </select>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <button type="submit" className="btn primary">Add Testimonial</button>
            <button type="button" className="btn ghost" onClick={() => setShowTestimonialForm(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  };

  if (!portfolio) return <div>Loading...</div>;

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
        <h1>Portfolio Builder</h1>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <button className="btn ghost" onClick={() => window.open(`https://${portfolio.domain}`, '_blank')}>
            <Eye size={16} />
            Preview
          </button>
          <button className="btn primary" onClick={generatePortfolio}>
            <Palette size={16} />
            Auto Generate
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Globe size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>{portfolio.domain}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Portfolio URL</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Eye size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{portfolio.analytics.views}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Total Views</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <BarChart3 size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{portfolio.analytics.clicks}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Project Clicks</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Star size={20} color="var(--error)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{portfolio.analytics.recruiterViews}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Recruiter Views</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['overview', 'projects', 'testimonials', 'templates', 'analytics', 'settings'].map(tab => (
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

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-6)' }}>
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3>Portfolio Preview</h3>
              <div style={{ 
                height: '300px', 
                background: 'var(--muted)', 
                borderRadius: 'var(--radius)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                border: '2px dashed var(--border)'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Globe size={48} color="var(--text-soft)" style={{ marginBottom: 'var(--space-2)' }} />
                  <div style={{ color: 'var(--text-soft)' }}>Portfolio Preview</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{portfolio.domain}</div>
                </div>
              </div>
              <div style={{ marginTop: 'var(--space-3)', display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn primary" onClick={() => window.open(`https://${portfolio.domain}`, '_blank')}>
                  <ExternalLink size={16} />
                  View Live
                </button>
                <button className="btn ghost">
                  <Settings size={16} />
                  Customize
                </button>
              </div>
            </div>
          </div>
          
          <div>
            <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
              <h3>Quick Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Projects</span>
                  <span style={{ fontWeight: 'bold' }}>{projects.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Testimonials</span>
                  <span style={{ fontWeight: 'bold' }}>{testimonials.length}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Template</span>
                  <span style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>{portfolio.template}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status</span>
                  <span style={{ 
                    color: portfolio.isPublished ? 'var(--success)' : 'var(--warning)',
                    fontWeight: 'bold'
                  }}>
                    {portfolio.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Project Showcase</h3>
            <button className="btn primary" onClick={() => setShowProjectForm(true)}>
              <Plus size={16} />
              Add Project
            </button>
          </div>

          {showProjectForm && <ProjectForm />}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            {projects.map(project => (
              <div key={project.id} className="card">
                <div style={{ 
                  height: '200px', 
                  background: 'var(--muted)', 
                  borderRadius: 'var(--radius)', 
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'var(--text-soft)' }}>Project Preview</span>
                </div>
                
                <h4>{project.name}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{project.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {project.technologies.map(tech => (
                    <span key={tech} style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--primary-light)', 
                      color: 'var(--primary)',
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-xs)' 
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {project.githubUrl && (
                    <button className="btn ghost small" onClick={() => window.open(project.githubUrl, '_blank')}>
                      <Github size={14} />
                      Code
                    </button>
                  )}
                  {project.liveUrl && (
                    <button className="btn primary small" onClick={() => window.open(project.liveUrl, '_blank')}>
                      <ExternalLink size={14} />
                      Live Demo
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Testimonials Tab */}
      {activeTab === 'testimonials' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Testimonials</h3>
            <button className="btn primary" onClick={() => setShowTestimonialForm(true)}>
              <Plus size={16} />
              Add Testimonial
            </button>
          </div>

          {showTestimonialForm && <TestimonialForm />}
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            {testimonials.map(testimonial => (
              <div key={testimonial.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{testimonial.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>
                      {testimonial.role} at {testimonial.company}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', marginBottom: 'var(--space-2)' }}>
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={16} color="var(--warning)" fill="var(--warning)" />
                  ))}
                </div>
                
                <p style={{ fontStyle: 'italic', color: 'var(--text-soft)' }}>
                  "{testimonial.content}"
                </p>
                
                <div style={{ 
                  marginTop: 'var(--space-3)', 
                  padding: 'var(--space-2)', 
                  background: testimonial.approved ? 'var(--success-light)' : 'var(--warning-light)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  color: testimonial.approved ? 'var(--success)' : 'var(--warning)'
                }}>
                  {testimonial.approved ? 'Approved' : 'Pending Approval'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div>
          <h3>Choose Template</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {templates.map(template => (
              <div key={template.id} className="card interactive">
                <div style={{ 
                  height: '200px', 
                  background: 'var(--muted)', 
                  borderRadius: 'var(--radius)', 
                  marginBottom: 'var(--space-3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <span style={{ color: 'var(--text-soft)' }}>Template Preview</span>
                </div>
                
                <h4>{template.name}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{template.description}</p>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {template.features.map(feature => (
                    <span key={feature} style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--muted)', 
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-xs)' 
                    }}>
                      {feature}
                    </span>
                  ))}
                </div>
                
                <button 
                  className={`btn ${portfolio.template === template.id ? 'primary' : 'ghost'} small`}
                  onClick={() => setPortfolio({...portfolio, template: template.id})}
                >
                  {portfolio.template === template.id ? 'Current Template' : 'Use Template'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && analytics && (
        <div>
          <h3>Portfolio Analytics</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            <div className="card">
              <h4>Traffic Overview</h4>
              <div style={{ height: '200px', background: 'var(--muted)', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'var(--text-soft)' }}>Traffic Chart</span>
              </div>
            </div>
            
            <div className="card">
              <h4>Traffic Sources</h4>
              {analytics.sources.map(source => (
                <div key={source.source} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{source.source}</span>
                  <span style={{ fontWeight: 'bold' }}>{source.visits} ({source.percentage}%)</span>
                </div>
              ))}
            </div>
            
            <div className="card">
              <h4>Top Projects</h4>
              {analytics.topProjects.map(project => (
                <div key={project.name} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                  <span>{project.name}</span>
                  <span style={{ fontWeight: 'bold' }}>{project.clicks} clicks</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div>
          <h3>Portfolio Settings</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
            <div className="card">
              <h4>Domain Settings</h4>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label>Current Domain</label>
                <input value={portfolio.domain} readOnly style={{ background: 'var(--muted)' }} />
              </div>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label>Custom Domain</label>
                <input placeholder="yourdomain.com" />
              </div>
              <button className="btn primary">Update Domain</button>
            </div>
            
            <div className="card">
              <h4>Visibility Settings</h4>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <input type="checkbox" checked={portfolio.isPublished} readOnly />
                  Portfolio is published
                </label>
              </div>
              <div style={{ marginBottom: 'var(--space-3)' }}>
                <label>Theme</label>
                <select value={portfolio.theme}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <button className="btn primary">Save Settings</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}