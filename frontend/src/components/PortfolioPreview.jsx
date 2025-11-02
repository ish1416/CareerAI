import React from 'react';
import { ExternalLink, Github, Mail, Linkedin, MapPin } from 'lucide-react';

export default function PortfolioPreview({ portfolio, projects, testimonials }) {
  if (!portfolio) return <div>Loading portfolio...</div>;

  const { sections } = portfolio;

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: 'var(--space-4)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Hero Section */}
      <section style={{ 
        textAlign: 'center', 
        padding: 'var(--space-8) 0',
        background: 'linear-gradient(135deg, var(--primary), var(--primary-dark))',
        borderRadius: 'var(--radius-lg)',
        color: 'white',
        marginBottom: 'var(--space-6)'
      }}>
        <div style={{ 
          width: '120px', 
          height: '120px', 
          borderRadius: '50%', 
          background: 'rgba(255,255,255,0.2)', 
          margin: '0 auto var(--space-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'var(--text-4xl)',
          fontWeight: 'bold'
        }}>
          {sections?.hero?.name?.charAt(0) || 'J'}
        </div>
        <h1 style={{ fontSize: 'var(--text-4xl)', margin: '0 0 var(--space-2)' }}>
          {sections?.hero?.name || 'John Doe'}
        </h1>
        <h2 style={{ fontSize: 'var(--text-xl)', margin: '0 0 var(--space-4)', opacity: 0.9 }}>
          {sections?.hero?.title || 'Software Developer'}
        </h2>
        <p style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto', opacity: 0.8 }}>
          {sections?.hero?.bio || 'Passionate developer building amazing digital experiences'}
        </p>
      </section>

      {/* About Section */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>About Me</h2>
        <div style={{ 
          background: 'var(--panel)', 
          padding: 'var(--space-6)', 
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border)'
        }}>
          <p style={{ fontSize: 'var(--text-lg)', lineHeight: 1.6, margin: 0 }}>
            {sections?.about?.content || 'I am a passionate full-stack developer with expertise in modern web technologies. I love creating efficient, scalable solutions and learning new technologies.'}
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Skills</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          {(sections?.skills || ['JavaScript', 'React', 'Node.js', 'Python']).map(skill => (
            <span key={skill} style={{ 
              padding: 'var(--space-2) var(--space-3)', 
              background: 'var(--primary-light)', 
              color: 'var(--primary)',
              borderRadius: 'var(--radius)', 
              fontSize: 'var(--text-sm)',
              fontWeight: '500'
            }}>
              {skill}
            </span>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section style={{ marginBottom: 'var(--space-8)' }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Featured Projects</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
          {(projects || []).slice(0, 3).map(project => (
            <div key={project.id} style={{ 
              background: 'var(--panel)', 
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden'
            }}>
              <div style={{ 
                height: '200px', 
                background: 'var(--muted)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center'
              }}>
                <span style={{ color: 'var(--text-soft)' }}>Project Image</span>
              </div>
              <div style={{ padding: 'var(--space-4)' }}>
                <h3 style={{ margin: '0 0 var(--space-2)' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{project.description}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                  {project.technologies.map(tech => (
                    <span key={tech} style={{ 
                      padding: 'var(--space-1) var(--space-2)', 
                      background: 'var(--muted)', 
                      borderRadius: 'var(--radius)', 
                      fontSize: 'var(--text-xs)' 
                    }}>
                      {tech}
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  {project.githubUrl && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-1)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--muted)',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'none',
                      color: 'var(--text)',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <Github size={14} />
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 'var(--space-1)',
                      padding: 'var(--space-2) var(--space-3)',
                      background: 'var(--primary)',
                      color: 'white',
                      borderRadius: 'var(--radius)',
                      textDecoration: 'none',
                      fontSize: 'var(--text-sm)'
                    }}>
                      <ExternalLink size={14} />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section style={{ marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Testimonials</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {testimonials.slice(0, 3).map(testimonial => (
              <div key={testimonial.id} style={{ 
                background: 'var(--panel)', 
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-4)'
              }}>
                <p style={{ fontStyle: 'italic', marginBottom: 'var(--space-3)', fontSize: 'var(--text-base)' }}>
                  "{testimonial.content}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
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
                    <div style={{ fontWeight: '600' }}>{testimonial.name}</div>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {testimonial.role} at {testimonial.company}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section style={{ 
        background: 'var(--panel)', 
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-6)',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: 'var(--space-4)' }}>Get In Touch</h2>
        <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
          Let's connect and discuss opportunities
        </p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
          <a href={`mailto:${sections?.contact?.email || 'john@example.com'}`} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 'var(--space-2)',
            padding: 'var(--space-3) var(--space-4)',
            background: 'var(--primary)',
            color: 'white',
            borderRadius: 'var(--radius)',
            textDecoration: 'none'
          }}>
            <Mail size={16} />
            Email Me
          </a>
          {sections?.contact?.linkedin && (
            <a href={sections.contact.linkedin} target="_blank" rel="noopener noreferrer" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-4)',
              background: 'var(--muted)',
              color: 'var(--text)',
              borderRadius: 'var(--radius)',
              textDecoration: 'none'
            }}>
              <Linkedin size={16} />
              LinkedIn
            </a>
          )}
        </div>
      </section>
    </div>
  );
}