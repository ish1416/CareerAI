import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import FeatureShowcase from '../components/FeatureShowcase.jsx';
import { useEffect, useState } from 'react';
import { 
  FileSearch, Gauge, Target, UploadCloud, Sparkles, Wand2, Rocket, UserCircle, Star, ChevronDown, 
  Briefcase, GraduationCap, Cpu, Zap, TrendingUp, Shield, Brain, Users, Globe, Video, 
  Calendar, MessageSquare, Award, BarChart3, Mic, Eye, Network, Building, Handshake,
  BookOpen, Trophy, Camera, Headphones, Bot, Compass, Lightbulb, Code, Palette,
  Search, DollarSign, Megaphone, Link as LinkIcon, Layers, Gamepad2, Check
} from 'lucide-react';
import GradientLifeBuoy from '../components/GradientLifeBuoy.jsx';
import Footer from '../components/Footer.jsx';
import '../styles/landing.css';

export default function PremiumLanding() {
  const [openFaq, setOpenFaq] = useState([false, false, false, false]);
  const [contact, setContact] = useState({ name: '', email: '', subject: '', message: '' });
  const [contactStatus, setContactStatus] = useState({ sending: false, sent: false, error: null });
  
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email);
    if (!contact.name || !emailOk || contact.message.trim().length < 10) {
      setContactStatus({ sending: false, sent: false, error: 'Please provide name, valid email, and a detailed message.' });
      return;
    }
    setContactStatus({ sending: true, sent: false, error: null });
    try {
      await new Promise((r) => setTimeout(r, 600));
      setContactStatus({ sending: false, sent: true, error: null });
      setContact({ name: '', email: '', subject: '', message: '' });
    } catch {
      setContactStatus({ sending: false, sent: false, error: 'Failed to send. Please try again.' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('show'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="landing-container">
      {/* Hero */}
      <section className="hero-section animate-fade-in">
        <div className="hero-content">
          <div className="hero-header">
            <Logo size={120} variant="accent" />
            <div>
              <h1 className="hero-title text-gradient">
                Career AI
              </h1>
              <div className="hero-divider" />
            </div>
            <p className="hero-description">
              The world's most comprehensive AI-powered career platform. Build resumes, develop skills, network professionally, and land your dream job with 32+ advanced features.
            </p>
          </div>
          
          <div className="hero-cta">
            <Link className="btn btn-primary btn-xl hover-lift" to="/register">
              <Rocket size={20} />
              Start Free Today
            </Link>
            <a className="btn btn-ghost btn-xl" href="#features">
              <Eye size={20} />
              Explore Features
            </a>
          </div>
          
          <div className="hero-features">
            <span>🚀 32+ AI Features</span>
            <span>•</span>
            <span>🎯 Free Forever Plan</span>
            <span>•</span>
            <span>⚡ No Credit Card Required</span>
          </div>
          
          <div className="hero-preview-grid">
            <div className="hero-preview-card hover-lift">
              <div className="hero-preview-header">
                <div className="hero-preview-icon">
                  <Sparkles size={24} color="white" />
                </div>
                <h3 className="hero-preview-title">AI-Powered Analysis</h3>
              </div>
              <p className="hero-preview-description">
                Advanced AI analyzes your resume for ATS compatibility, keyword optimization, and provides actionable improvement suggestions.
              </p>
            </div>
            
            <div className="hero-preview-card hover-lift">
              <div className="hero-preview-header">
                <div className="hero-preview-icon">
                  <Target size={24} color="white" />
                </div>
                <h3 className="hero-preview-title">Job Matching</h3>
              </div>
              <p className="hero-preview-description">
                Smart matching algorithm compares your profile with job requirements and provides personalized optimization strategies.
              </p>
            </div>
            
            <div className="hero-preview-card hover-lift">
              <div className="hero-preview-header">
                <div className="hero-preview-icon">
                  <TrendingUp size={24} color="white" />
                </div>
                <h3 className="hero-preview-title">Track Progress</h3>
              </div>
              <p className="hero-preview-description">
                Comprehensive analytics dashboard tracks your career progress, skill development, and job search success metrics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">32+</div>
              <div className="stat-label">AI-Powered Features</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">15+</div>
              <div className="stat-label">Resume Templates</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">ATS Compatibility</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">AI Assistant Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="landing-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-title">What Our Users Say</h2>
            <p className="section-description">Join thousands of professionals who've transformed their careers with CareerAI</p>
            <div className="section-divider" />
          </div>
          
          <div className="testimonials-grid">
            <div className="testimonial-card hover-lift">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <UserCircle size={48} color="var(--primary)" />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Sarah Chen</div>
                  <div className="testimonial-role">Software Engineer</div>
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} color="var(--warning)" fill="var(--warning)" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="testimonial-quote">
                Got actionable feedback and improved interview callbacks by 300%. The AI suggestions were spot-on and helped me land my dream job at Google!
              </blockquote>
            </div>
            
            <div className="testimonial-card hover-lift">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <UserCircle size={48} color="var(--secondary)" />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Marcus Johnson</div>
                  <div className="testimonial-role">Product Manager</div>
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} color="var(--warning)" fill="var(--warning)" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="testimonial-quote">
                Builder plus ATS insights made my resume stand out. Landed my dream job in just 2 weeks after using CareerAI. Absolutely game-changing!
              </blockquote>
            </div>
            
            <div className="testimonial-card hover-lift">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <UserCircle size={48} color="var(--accent)" />
                </div>
                <div className="testimonial-info">
                  <div className="testimonial-name">Emily Rodriguez</div>
                  <div className="testimonial-role">UX Designer</div>
                  <div className="testimonial-stars">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} color="var(--warning)" fill="var(--warning)" />
                    ))}
                  </div>
                </div>
              </div>
              <blockquote className="testimonial-quote">
                Loved the clean UI and smart recommendations. Best career platform I've ever used. The AI analysis is incredibly detailed and helpful!
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="landing-section section-alt">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-description">Everything you need to know about CareerAI</p>
            <div className="section-divider" />
          </div>
          
          <div className="faq-list">
            {[
              { q: 'Is OCR included?', a: 'Yes. Scanned PDFs are handled with client-side OCR fallback.' },
              { q: 'Do I need a card to start?', a: 'No. Free plan requires no payment and offers basic feedback.' },
              { q: 'Can I cancel anytime?', a: 'Yes. Subscriptions are flexible; cancel anytime from settings.' },
              { q: 'Is dark mode available?', a: 'Yes. Toggle in the navbar to switch themes.' },
            ].map((item, i) => (
              <div key={i} className={`faq-item card ${openFaq[i] ? 'open' : ''}`}>
                <button
                  className="faq-question"
                  aria-expanded={openFaq[i]}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenFaq((s) => s.map((v, idx) => (idx === i ? !v : v)))}
                >
                  <span>{item.q}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <ChevronDown size={18} />
                  </span>
                </button>
                {openFaq[i] && (
                  <div
                    id={`faq-answer-${i}`}
                    className="faq-answer"
                    role="region"
                  >
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="landing-section">
        <div className="container">
          <div className="section-intro">
            <h2 className="section-title">Get in Touch</h2>
            <p className="section-description">Have questions about CareerAI? We're here to help you succeed in your career journey.</p>
            <div className="section-divider" />
          </div>
          
          <div className="contact-grid">
            <div className="card hover-lift contact-visual">
              <Logo size={300} pulse variant="accent" />
            </div>
            <form className="card contact-form" onSubmit={handleContactSubmit} noValidate>
              <div className="form-row form-row-two">
                <div className="form-field">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={contact.name}
                    onChange={(e) => setContact((s) => ({ ...s, [e.target.name]: e.target.value }))}
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-field">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={contact.email}
                    onChange={(e) => setContact((s) => ({ ...s, [e.target.name]: e.target.value }))}
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contact-subject">Subject</label>
                  <input
                    id="contact-subject"
                    type="text"
                    name="subject"
                    value={contact.subject}
                    onChange={(e) => setContact((s) => ({ ...s, [e.target.name]: e.target.value }))}
                    placeholder="How can we help?"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label htmlFor="contact-message">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    value={contact.message}
                    onChange={(e) => setContact((s) => ({ ...s, [e.target.name]: e.target.value }))}
                    placeholder="Share details of the issue or request"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary" disabled={contactStatus.sending}>
                  {contactStatus.sending ? 'Sending...' : 'Send Message'}
                </button>
                <span className="form-status" aria-live="polite">
                  {contactStatus.error && <span className="error">{contactStatus.error}</span>}
                  {contactStatus.sent && <span className="success">Message sent. We'll be in touch!</span>}
                </span>
              </div>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}