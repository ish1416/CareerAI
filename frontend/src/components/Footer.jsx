import { Link } from 'react-router-dom';
import Logo from './Logo.jsx';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="footer-columns">
        <div>
          <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
            <Logo size={32} />
            <span className="brand-name gradient-text" style={{ fontSize: 'var(--text-xl)' }}>Career AI</span>
          </div>
          <p className="muted" style={{ fontSize: 'var(--text-sm)', lineHeight: 1.6, maxWidth: '280px' }}>
            AI-powered resume builder and analysis platform. Build better resumes, land better jobs.
          </p>
        </div>
        <div>
          <h4>Product</h4>
          <nav className="footer-nav" aria-label="Product">
            <a href="#features">Features</a>
            <Link to="/builder">Builder</Link>
            <Link to="/analysis">Analysis</Link>
            <Link to="/match">Job Match</Link>
            <Link to="/cover">Cover Letters</Link>
          </nav>
        </div>
        <div>
          <h4>Company</h4>
          <nav className="footer-nav" aria-label="Company">
            <Link to="/pricing">Pricing</Link>
            <a href="#contact">Contact</a>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </div>
        <div>
          <h4>Resources</h4>
          <nav className="footer-nav" aria-label="Resources">
            <a href="/#how">How It Works</a>
            <a href="/#faq">FAQ</a>
            <a href="/#testimonials">Testimonials</a>
          </nav>
        </div>
        <div>
          <h4>Legal</h4>
          <nav className="footer-nav" aria-label="Legal">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
          </nav>
        </div>
      </div>
      <div className="footer-bottom">
        <p style={{ margin: 0, fontSize: 'var(--text-sm)' }}>
          © {new Date().getFullYear()} Career AI. All rights reserved. Built with ❤️ for job seekers.
        </p>
      </div>
    </footer>
  );
}