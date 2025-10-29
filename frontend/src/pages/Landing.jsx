import { Link } from 'react-router-dom';
import Logo from '../components/Logo.jsx';
import FeatureCard from '../components/FeatureCard.jsx';
import FeatureShowcase from '../components/FeatureShowcase.jsx';
import { useEffect, useState } from 'react';
import { FileSearch, Gauge, Target, UploadCloud, Sparkles, Wand2, Rocket, UserCircle, Star, ChevronDown, Briefcase, GraduationCap, Cpu, Zap, TrendingUp, Shield } from 'lucide-react';
import GradientLifeBuoy from '../components/GradientLifeBuoy.jsx';
import Footer from '../components/Footer.jsx';

export default function Landing() {
  const [openFaq, setOpenFaq] = useState([false, false, false, false]);
  // Contact form state
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
    // Ensure reveal elements are visible immediately
    const timer = setTimeout(() => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('show'));
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="container">
      {/* Hero */}
      <header className="hero">
        <div className="hero-content">
          <div className="brand-stack" style={{ display: 'grid', placeItems: 'center', gap: 'var(--space-5)' }}>
            <div style={{ position: 'relative' }}>
              <Logo size={200} pulse />
              <div style={{
                position: 'absolute',
                inset: '-20px',
                background: 'var(--gradient-primary)',
                borderRadius: '50%',
                opacity: 0.1,
                filter: 'blur(20px)',
                zIndex: -1
              }} />
            </div>
            <div style={{ textAlign: 'center' }}>
              <h1 className="brand-gradient" style={{ 
                margin: 0, 
                fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-0.02em'
              }}>
                Career AI
              </h1>
              <div style={{
                height: '4px',
                width: '120px',
                background: 'var(--gradient-primary)',
                borderRadius: '2px',
                margin: 'var(--space-3) auto',
                opacity: 0.8
              }} />
            </div>
            <p style={{ 
              marginTop: 'var(--space-3)', 
              fontSize: 'var(--text-xl)', 
              maxWidth: '650px',
              lineHeight: 1.7,
              color: 'var(--text-soft)',
              fontWeight: 400
            }}>
              Transform your career with AI-powered resume optimization. Build, analyze, and perfect your resume to land your dream job faster.
            </p>
          </div>
          <div className="cta" style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn cta gradient large" to="/builder" style={{ minWidth: '200px' }}>
              <Rocket size={20} />
              Start Building Free
            </Link>
            <Link className="btn secondary large" to="/pricing" style={{ minWidth: '160px' }}>
              View Pricing
            </Link>
          </div>
          <div style={{ 
            marginTop: 'var(--space-4)', 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)'
          }}>
            <span>✨</span>
            <span>No credit card required • Free forever plan</span>
            <span>✨</span>
          </div>
          <div className="hero-features" style={{
            marginTop: 'var(--space-8)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'var(--space-4)',
            maxWidth: '1000px',
            width: '100%'
          }}>
            <div className="feature-preview card elevated" style={{
              background: 'var(--surface)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--gradient-primary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>AI-Powered Analysis</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Get instant feedback and suggestions to improve your resume's impact and ATS compatibility.
              </p>
            </div>
            
            <div className="feature-preview card elevated" style={{
              background: 'var(--surface)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'var(--gradient-secondary)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Job Matching</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Compare your resume against job descriptions and get tailored optimization recommendations.
              </p>
            </div>
            
            <div className="feature-preview card elevated" style={{
              background: 'var(--surface)',
              padding: 'var(--space-5)',
              borderRadius: 'var(--radius-lg)',
              textAlign: 'left',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Track Progress</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Monitor your resume improvements over time with detailed analytics and scoring history.
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Features */}
      <section id="features" className="section">
        <h3>Features</h3>
        <div className="section-intro">
          <h3 className="section-title">Explore Capabilities</h3>
          <p className="muted">Discover builder, analysis, ATS insights, and export options.</p>
          <ol className="step-list">
            <li>Build or upload to start organizing content.</li>
            <li>Analyze and refine with AI suggestions.</li>
            <li>Optimize for ATS, then export polished results.</li>
          </ol>
        </div>
        <div className="grid">
          <FeatureCard
            icon={UploadCloud}
            title="Smart Resume Builder"
            description="Create and organize sections with a clean, guided editor. Build professional resumes in minutes."
            accent="var(--accent-blue)"
          />
          <FeatureCard
            icon={Sparkles}
            title="AI Rewrite & Tone"
            description="Refine clarity, quantify impact, and polish language professionally with AI assistance."
            accent="var(--info)"
          />
          <FeatureCard
            icon={Gauge}
            title="ATS Optimization"
            description="Highlight missing keywords and improve alignment to job postings for better ATS scores."
            accent="var(--success)"
          />
          <FeatureCard
            icon={Target}
            title="Job Match Analysis"
            description="Compare against job descriptions and get actionable insights to close skill gaps."
            accent="var(--warning)"
          />
          <FeatureCard
            icon={Zap}
            title="Instant Feedback"
            description="Get real-time suggestions and improvements as you build your resume."
            accent="var(--error)"
          />
          <FeatureCard
            icon={TrendingUp}
            title="Career Insights"
            description="Track your progress and see how your resume improves over time with analytics."
            accent="var(--accent-blue)"
          />
          <FeatureCard
            icon={Shield}
            title="Privacy First"
            description="Your data is encrypted and secure. We never share your information with third parties."
            accent="var(--success)"
          />
          <FeatureCard
            icon={FileSearch}
            title="Multiple Formats"
            description="Export your resume in various formats including PDF, DOCX, and plain text."
            accent="var(--info)"
          />
          <div className="card shine feature-card">
            <FileSearch size={36} color="var(--accent-blue)" />
            <h4>Resume Analysis</h4>
            <p className="sub">Score structure and content, with targeted suggestions to improve.</p>
          </div>
          <div className="card shine feature-card">
            <Rocket size={36} color="var(--accent-blue)" />
            <h4>Export & Share</h4>
            <p className="sub">Download polished versions and share with ease.</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section">
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>How It Works</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto' }}>Transform your resume in 4 simple steps with AI-powered insights</p>
        </div>
        
        <div className="how-it-works-container" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'var(--space-5)',
          marginTop: 'var(--space-6)'
        }}>
          <div className="step-card shine" style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div className="step-number" style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-sm)',
              fontWeight: '700',
              color: 'var(--bg)'
            }}>1</div>
            <div className="icon-bubble" style={{
              width: '80px',
              height: '80px',
              background: 'rgba(59,130,246,0.12)',
              color: 'var(--accent-blue)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <UploadCloud size={40} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: '700' }}>Upload or Build</h4>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>Start with an existing resume file or create sections from scratch using our intuitive builder.</p>
          </div>

          <div className="step-card shine" style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div className="step-number" style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-sm)',
              fontWeight: '700',
              color: 'var(--bg)'
            }}>2</div>
            <div className="icon-bubble" style={{
              width: '80px',
              height: '80px',
              background: 'rgba(59,130,246,0.12)',
              color: 'var(--accent-blue)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <Sparkles size={40} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: '700' }}>Analyze with AI</h4>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>Get intelligent rewrite suggestions, tone improvements, and detailed scoring from our AI engine.</p>
          </div>

          <div className="step-card shine" style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div className="step-number" style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-sm)',
              fontWeight: '700',
              color: 'var(--bg)'
            }}>3</div>
            <div className="icon-bubble" style={{
              width: '80px',
              height: '80px',
              background: 'rgba(59,130,246,0.12)',
              color: 'var(--accent-blue)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <Wand2 size={40} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: '700' }}>Optimize for ATS</h4>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>Identify missing keywords, improve ATS compatibility, and boost your resume's visibility to recruiters.</p>
          </div>

          <div className="step-card shine" style={{
            background: 'var(--panel)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-5)',
            textAlign: 'center',
            position: 'relative',
            transition: 'all var(--transition-base)'
          }}>
            <div className="step-number" style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '24px',
              height: '24px',
              background: 'linear-gradient(135deg, var(--accent-start), var(--accent-end))',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 'var(--text-sm)',
              fontWeight: '700',
              color: 'var(--bg)'
            }}>4</div>
            <div className="icon-bubble" style={{
              width: '80px',
              height: '80px',
              background: 'rgba(59,130,246,0.12)',
              color: 'var(--accent-blue)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto var(--space-4)'
            }}>
              <Rocket size={40} />
            </div>
            <h4 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: '700' }}>Export & Apply</h4>
            <p className="muted" style={{ margin: 0, lineHeight: 1.6 }}>Download your polished resume in multiple formats and start applying to your dream jobs with confidence.</p>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-6)' }}>
          <Link className="btn cta gradient large" to="/builder">
            <Rocket size={20} />
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Pricing teaser using pricing-card style */}
      <section id="pricing" className="section">
        <h3>Pricing</h3>
        <div className="section-intro">
          <h3 className="section-title">Choose Your Plan</h3>
          <p className="muted">Compare features and pick Free or Pro.</p>
          <ol className="step-list">
            <li>Review benefits of each plan.</li>
            <li>Start free or upgrade for advanced features.</li>
            <li>Manage your subscription anytime.</li>
          </ol>
        </div>
        <div className="pricing-grid">
          <div className="card shine pricing-card">
            <h3>Free</h3>
            <p className="price">₹0</p>
            <ul className="features">
              <li>Basic feedback</li>
              <li>Resume builder access</li>
              <li>Limited AI suggestions</li>
            </ul>
            <Link className="btn ghost" to="/pricing">Start Free</Link>
          </div>
          <div className="card shine pricing-card recommended">
            <span className="plan-badge">Popular</span>
            <h3>Pro</h3>
            <p className="price">Best value</p>
            <ul className="features">
              <li>AI rewrite & tone polish</li>
              <li>ATS insights & keyword gaps</li>
              <li>Priority support</li>
            </ul>
            <Link className="btn cta gradient" to="/pricing">Go Pro</Link>
          </div>
          <div className="card shine pricing-card">
            <h3>Premium</h3>
            <p className="price">Advanced</p>
            <ul className="features">
              <li>Deep analysis & benchmarking</li>
              <li>Smart job-match guidance</li>
              <li>All Pro features</li>
            </ul>
            <Link className="btn ghost" to="/pricing">See Premium</Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section">
        <h3>Testimonials</h3>
        <div className="grid">
          <div className="card shine">
            <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCircle size={36} color="var(--accent-blue)" />
              <div aria-label="stars" style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} color="var(--accent-blue)" fill="var(--accent-blue)" />
                ))}
              </div>
            </div>
            <p>“Got actionable feedback and improved interview callbacks.”</p>
          </div>
          <div className="card shine">
            <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCircle size={36} color="var(--accent-blue)" />
              <div aria-label="stars" style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} color="var(--accent-blue)" fill="var(--accent-blue)" />
                ))}
              </div>
            </div>
            <p>“Builder plus ATS insights made my resume stand out.”</p>
          </div>
          <div className="card shine">
            <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <UserCircle size={36} color="var(--accent-blue)" />
              <div aria-label="stars" style={{ display: 'flex', gap: 2 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} color="var(--accent-blue)" fill="var(--accent-blue)" />
                ))}
              </div>
            </div>
            <p>“Loved the clean UI and smart recommendations.”</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section">
        <h3>FAQ</h3>
        <div className="faq">
          {[
            { q: 'Is OCR included?', a: 'Yes. Scanned PDFs are handled with client-side OCR fallback.' },
            { q: 'Do I need a card to start?', a: 'No. Free plan requires no payment and offers basic feedback.' },
            { q: 'Can I cancel anytime?', a: 'Yes. Subscriptions are flexible; cancel anytime from settings.' },
            { q: 'Is dark mode available?', a: 'Yes. Toggle in the navbar to switch themes.' },
          ].map((item, i) => (
            <div key={i} className={`faq-item card shine ${openFaq[i] ? 'open' : ''}`}>
              <button
                className="faq-question"
                aria-expanded={openFaq[i]}
                aria-controls={`faq-answer-${i}`}
                onClick={() => setOpenFaq((s) => s.map((v, idx) => (idx === i ? !v : v)))}
              >
                <span className="faq-text">{item.q}</span>
                <span className="faq-icon" aria-hidden="true">
                  <ChevronDown size={18} />
                </span>
              </button>
              <div
                id={`faq-answer-${i}`}
                className="faq-answer"
                role="region"
                aria-hidden={!openFaq[i]}
              >
                <p>{item.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="section">
        <h3>Contact</h3>
        <p className="sub">Questions? Reach out via the support form below.</p>
        <div className="contact-grid">
          <div className="contact-visual card shine">
            <div className="support-icon-wrap">
              <GradientLifeBuoy size={120} />
            </div>
            <h4 style={{ margin: '12px 0 6px' }}>Support</h4>
            <p className="sub" style={{ margin: 0 }}>We usually reply within 24 hours.</p>
          </div>
          <form className="contact-form card" onSubmit={handleContactSubmit} noValidate>
            <div className="form-row two">
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
              <button type="submit" className="btn cta gradient" disabled={contactStatus.sending}>
                {contactStatus.sending ? 'Sending...' : 'Send Message'}
              </button>
              <span className="form-status" aria-live="polite">
                {contactStatus.error && <span className="error">{contactStatus.error}</span>}
                {contactStatus.sent && <span className="success">Message sent. We’ll be in touch!</span>}
              </span>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}