import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';
import { Github, Twitter, Linkedin, Mail, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ 
      background: 'var(--surface)', 
      borderTop: '1px solid var(--border)', 
      padding: 'var(--space-6) 0 var(--space-4)',
      color: 'var(--text)'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--space-4)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: 'var(--space-6)', 
          marginBottom: 'var(--space-6)' 
        }}>
          {/* Brand Section */}
          <div style={{ maxWidth: '300px' }}>
            <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-4)' }}>
              <Logo size={36} variant="accent" />
              <span className="brand-name gradient-text" style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>CareerAI</span>
            </div>
            <p className="muted" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
              The world's most comprehensive AI-powered career platform. Build resumes, develop skills, network professionally, and land your dream job with 32+ advanced features.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <a href="https://github.com/careerai" style={{ color: 'var(--text-soft)', transition: 'color 0.2s' }}>
                <Github size={20} />
              </a>
              <a href="https://twitter.com/careerai" style={{ color: 'var(--text-soft)', transition: 'color 0.2s' }}>
                <Twitter size={20} />
              </a>
              <a href="https://linkedin.com/company/careerai" style={{ color: 'var(--text-soft)', transition: 'color 0.2s' }}>
                <Linkedin size={20} />
              </a>
              <a href="mailto:hello@careerai.com" style={{ color: 'var(--text-soft)', transition: 'color 0.2s' }}>
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Core Features */}
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>Core Features</h4>
            <nav className="footer-nav" aria-label="Core Features" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/builder" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Resume Builder</Link>
              <Link to="/analysis" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>AI Analysis</Link>
              <Link to="/job-match" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Job Matching</Link>
              <Link to="/cover-letters" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Cover Letters</Link>
              <Link to="/templates" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Templates</Link>
              <Link to="/insights" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Career Insights</Link>
            </nav>
          </div>

          {/* AI Advanced */}
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>AI Advanced</h4>
            <nav className="footer-nav" aria-label="AI Advanced" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/career-dna" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Career DNA</Link>
              <Link to="/career-twin" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Career Twin</Link>
              <Link to="/global-ops" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Global Opportunities</Link>
              <Link to="/video-resume" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Video Resume</Link>
              <Link to="/virtual-fair" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Virtual Career Fair</Link>
              <Link to="/blockchain-verify" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Blockchain Verify</Link>
            </nav>
          </div>

          {/* Tools & Growth */}
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>Tools & Growth</h4>
            <nav className="footer-nav" aria-label="Tools & Growth" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/learning" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Learning Hub</Link>
              <Link to="/community" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Community</Link>
              <Link to="/portfolio" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Portfolio Builder</Link>
              <Link to="/job-tracker" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Job Tracker</Link>
              <Link to="/interview" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Interview Prep</Link>
              <Link to="/analytics" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Analytics</Link>
            </nav>
          </div>

          {/* Company & Support */}
          <div>
            <h4 style={{ fontSize: 'var(--text-lg)', fontWeight: 600, marginBottom: 'var(--space-4)', color: 'var(--text)' }}>Company</h4>
            <nav className="footer-nav" aria-label="Company" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Link to="/pricing" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Pricing</Link>
              <a href="#contact" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Contact Us</a>
              <a href="#testimonials" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Testimonials</a>
              <a href="#faq" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>FAQ</a>
              <a href="/blog" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Blog</a>
              <a href="/careers" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Careers</a>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div style={{ 
          borderTop: '1px solid var(--border)', 
          paddingTop: 'var(--space-4)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          flexWrap: 'wrap', 
          gap: 'var(--space-4)' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', flexWrap: 'wrap' }}>
            <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
              © {new Date().getFullYear()} CareerAI. All rights reserved.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
              <a href="/privacy" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Privacy Policy</a>
              <a href="/terms" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Terms of Service</a>
              <a href="/cookies" style={{ color: 'var(--text-soft)', textDecoration: 'none', fontSize: 'var(--text-sm)', transition: 'color 0.2s' }}>Cookie Policy</a>
            </div>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
            <Zap size={16} />
            <span>Powered by AI • Built with ❤️ for job seekers</span>
          </div>
        </div>
      </div>
    </footer>
  );
}