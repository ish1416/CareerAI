import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Mail } from 'lucide-react';
import ModernLogo from './ModernLogo';

export default function ModernFooter() {
  const footerSections = [
    {
      title: 'Product',
      links: [
        { name: 'Features', href: '#features' },
        { name: 'Pricing', href: '#pricing' },
        { name: 'Templates', href: '/templates' },
        { name: 'API', href: '/api' }
      ]
    },
    {
      title: 'Resources',
      links: [
        { name: 'Documentation', href: '/docs' },
        { name: 'Help Center', href: '/help' },
        { name: 'Career Guide', href: '/guide' },
        { name: 'Blog', href: '/blog' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Contact', href: '/contact' },
        { name: 'Press', href: '/press' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
        { name: 'Security', href: '/security' },
        { name: 'Cookies', href: '/cookies' }
      ]
    }
  ];

  const socialLinks = [
    { icon: Github, href: 'https://github.com/careerai', label: 'GitHub' },
    { icon: Twitter, href: 'https://twitter.com/careerai', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com/company/careerai', label: 'LinkedIn' },
    { icon: Mail, href: 'mailto:hello@careerai.com', label: 'Email' }
  ];

  return (
    <footer
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--border)',
        padding: 'var(--space-16) 0 var(--space-8)'
      }}
    >
      <div className="container">
        {/* Main Footer Content */}
        <div className="grid" style={{ gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: 'var(--space-8)', marginBottom: 'var(--space-12)' }}>
          {/* Brand Section */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <ModernLogo size={32} />
              <span className="text-lg font-bold">CareerAI</span>
            </div>
            <p className="text-sm text-secondary mb-6" style={{ maxWidth: 280, lineHeight: 1.6 }}>
              The most comprehensive AI-powered career platform. Build resumes, develop skills, and land your dream job.
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  style={{
                    width: 32,
                    height: 32,
                    background: 'var(--gray-100)',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    transition: 'var(--transition)',
                    textDecoration: 'none'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'var(--primary)';
                    e.target.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'var(--gray-100)';
                    e.target.style.color = 'var(--text-secondary)';
                  }}
                >
                  <social.icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section, index) => (
            <div key={index}>
              <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--text)' }}>
                {section.title}
              </h3>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex} style={{ marginBottom: 'var(--space-2)' }}>
                    <Link
                      to={link.href}
                      className="text-sm text-secondary"
                      style={{
                        textDecoration: 'none',
                        transition: 'var(--transition)'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div
          className="flex items-center justify-between"
          style={{
            paddingTop: 'var(--space-8)',
            borderTop: '1px solid var(--border)',
            flexWrap: 'wrap',
            gap: 'var(--space-4)'
          }}
        >
          <p className="text-sm text-muted m-0">
            © 2024 CareerAI. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-xs text-muted">Made with ❤️ for job seekers</span>
            <div className="flex items-center gap-2">
              <div
                style={{
                  width: 8,
                  height: 8,
                  background: 'var(--success)',
                  borderRadius: '50%'
                }}
              />
              <span className="text-xs text-muted">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}