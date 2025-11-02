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
  Search, DollarSign, Megaphone, Link as LinkIcon, Layers, Gamepad2
} from 'lucide-react';
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
    <div className="container" style={{ marginTop: '60px', padding: '0 24px', maxWidth: '100%', boxSizing: 'border-box' }}>
      {/* Hero */}
      <header style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        background: 'var(--bg)',
        padding: 'var(--space-8) var(--space-4)'
      }}>
        <div style={{
          display: 'grid',
          placeItems: 'center',
          gap: 'var(--space-5)',
          maxWidth: '1200px',
          width: '100%'
        }}>
          <div style={{ display: 'grid', placeItems: 'center', gap: 'var(--space-4)' }}>
            <Logo size={120} />
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ 
                margin: 0, 
                fontSize: 'clamp(3rem, 8vw, 5.5rem)', 
                lineHeight: 1.1,
                fontWeight: 900,
                letterSpacing: '-0.02em',
                color: 'var(--text)'
              }}>
                Career AI
              </h1>
              <div style={{
                height: '4px',
                width: '120px',
                background: '#000000',
                margin: 'var(--space-3) auto'
              }} />
            </div>
            <p style={{ 
              marginTop: 'var(--space-3)', 
              fontSize: 'var(--text-xl)', 
              maxWidth: '750px',
              lineHeight: 1.7,
              color: 'var(--text-soft)',
              fontWeight: 400
            }}>
              The world's most comprehensive AI-powered career platform. Build resumes, develop skills, network professionally, and land your dream job with 32+ advanced features.
            </p>
          </div>
          <div className="cta" style={{ marginTop: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn cta gradient large" to="/register" style={{ minWidth: '220px' }}>
              <Rocket size={20} />
              Start Free Today
            </Link>
            <a className="btn secondary large" href="#features" style={{ minWidth: '180px', textDecoration: 'none' }}>
              <Eye size={20} />
              Explore Features
            </a>
          </div>
          <div style={{ 
            marginTop: 'var(--space-4)', 
            fontSize: 'var(--text-sm)', 
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'var(--space-2)',
            flexWrap: 'wrap'
          }}>
            <span>🚀 32+ AI Features</span>
            <span>•</span>
            <span>🎯 Free Forever Plan</span>
            <span>•</span>
            <span>⚡ No Credit Card Required</span>
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
                  background: '#000000',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Sparkles size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>AI-Powered Analysis</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Advanced AI analyzes your resume for ATS compatibility, keyword optimization, and provides actionable improvement suggestions.
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
                  background: '#333333',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Target size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Job Matching</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Smart matching algorithm compares your profile with job requirements and provides personalized optimization strategies.
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
                  background: '#666666',
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp size={24} color="white" />
                </div>
                <h3 style={{ margin: 0, fontSize: 'var(--text-lg)', fontWeight: 600 }}>Track Progress</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.5 }}>
                Comprehensive analytics dashboard tracks your career progress, skill development, and job search success metrics.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Platform Statistics */}
      <section className="section" style={{ padding: 'var(--space-6) 0', background: '#000000', color: 'white' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-6)', textAlign: 'center' }}>
          <div>
            <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>32+</div>
            <div style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>AI-Powered Features</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>15+</div>
            <div style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>Resume Templates</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>98%</div>
            <div style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>ATS Compatibility</div>
          </div>
          <div>
            <div style={{ fontSize: 'var(--text-4xl)', fontWeight: 'bold', marginBottom: 'var(--space-2)' }}>24/7</div>
            <div style={{ fontSize: 'var(--text-lg)', opacity: 0.9 }}>AI Assistant Support</div>
          </div>
        </div>
      </section>

      {/* How to Use Platform */}
      <section id="how-to-use" className="section" style={{ padding: 'var(--space-8) 0', background: 'var(--panel)' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>How to Use CareerAI</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '700px', margin: '0 auto var(--space-6)' }}>Your complete guide to leveraging our 32+ features for career success</p>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <div className="card shine" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--gradient-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Rocket size={24} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 600 }}>Core Features</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>Start with our essential tools:</p>
            <ul style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, paddingLeft: 'var(--space-4)' }}>
              <li>Build resumes with our drag-and-drop editor</li>
              <li>Get AI analysis and optimization suggestions</li>
              <li>Match your resume to specific job descriptions</li>
              <li>Ensure ATS compatibility with keyword analysis</li>
              <li>Generate personalized cover letters</li>
              <li>Track your improvement with career insights</li>
            </ul>
          </div>
          
          <div className="card shine" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', background: 'var(--gradient-secondary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={24} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 600 }}>Growth & Learning</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>Develop your skills and network:</p>
            <ul style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, paddingLeft: 'var(--space-4)' }}>
              <li>Take AI-recommended courses and skill tests</li>
              <li>Join professional communities and forums</li>
              <li>Earn badges and showcase your expertise</li>
              <li>Create detailed professional profiles</li>
              <li>Connect with recruiters and mentors</li>
              <li>Access personalized career guidance</li>
            </ul>
          </div>
          
          <div className="card shine" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Calendar size={24} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 600 }}>Tools & Tracking</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>Manage your job search effectively:</p>
            <ul style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, paddingLeft: 'var(--space-4)' }}>
              <li>Build stunning online portfolios</li>
              <li>Track job applications with CRM-style tools</li>
              <li>Practice interviews with AI simulation</li>
              <li>Find projects and collaboration opportunities</li>
              <li>Access comprehensive career analytics</li>
              <li>Automate resume distribution to job boards</li>
            </ul>
          </div>
          
          <div className="card shine" style={{ padding: 'var(--space-6)', textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Brain size={24} color="white" />
              </div>
              <h3 style={{ margin: 0, fontSize: 'var(--text-xl)', fontWeight: 600 }}>AI Advanced</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', lineHeight: 1.6 }}>Leverage cutting-edge AI technology:</p>
            <ul style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)', lineHeight: 1.6, paddingLeft: 'var(--space-4)' }}>
              <li>Discover your unique Career DNA profile</li>
              <li>Find Career Twins with similar backgrounds</li>
              <li>Explore global job opportunities</li>
              <li>Create professional video resumes</li>
              <li>Attend virtual career fairs</li>
              <li>Use blockchain for credential verification</li>
            </ul>
          </div>
        </div>
        
        <div style={{ textAlign: 'center' }}>
          <Link className="btn cta gradient large" to="/register" style={{ minWidth: '200px' }}>
            <Rocket size={20} />
            Get Started Free
          </Link>
          <p style={{ marginTop: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>All features available • No credit card required</p>
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase />

      {/* Core Features */}
      <section id="features" className="section" style={{ padding: 'var(--space-8) 0' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Core Features</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Essential tools to build, analyze, and optimize your resume with AI-powered insights</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-primary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
          <FeatureCard icon={UploadCloud} title="Resume Builder" description="Create professional resumes with our intuitive drag-and-drop builder. Choose from multiple templates and customize every detail." accent="var(--accent-blue)" />
          <FeatureCard icon={Sparkles} title="AI Analysis" description="Get instant AI-powered feedback on content, structure, and ATS compatibility with actionable improvement suggestions." accent="var(--info)" />
          <FeatureCard icon={Target} title="Job Matching" description="Compare your resume against job descriptions and receive tailored optimization recommendations for better matches." accent="var(--success)" />
          <FeatureCard icon={Gauge} title="ATS Optimization" description="Ensure your resume passes Applicant Tracking Systems with keyword analysis and formatting optimization." accent="var(--warning)" />
          <FeatureCard icon={MessageSquare} title="Cover Letters" description="Generate personalized cover letters that complement your resume and match specific job requirements." accent="var(--error)" />
          <FeatureCard icon={TrendingUp} title="Career Insights" description="Track your progress over time with detailed analytics, scoring history, and improvement recommendations." accent="var(--accent-blue)" />
        </div>
      </section>

      {/* Growth & Learning */}
      <section id="growth-learning" className="section" style={{ padding: 'var(--space-8) 0', background: 'var(--muted)' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Growth & Learning</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Develop your skills and advance your career with gamified learning and professional networking</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-secondary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          <FeatureCard icon={BookOpen} title="Learning Dashboard" description="Access AI-recommended courses, skill tests, and learning paths tailored to your career goals with progress tracking." accent="var(--success)" />
          <FeatureCard icon={Users} title="Community Hub" description="Connect with professionals, join industry forums, and participate in discussions to expand your network." accent="var(--info)" />
          <FeatureCard icon={Trophy} title="Skill Tests" description="Take comprehensive skill assessments, earn badges, and showcase your expertise to potential employers." accent="var(--warning)" />
          <FeatureCard icon={Network} title="Professional Profiles" description="Create detailed professional profiles, showcase achievements, and connect with recruiters and peers." accent="var(--accent-blue)" />
          <FeatureCard icon={Building} title="Recruiter Dashboard" description="Access recruiter tools for talent discovery, candidate management, and streamlined hiring processes." accent="var(--error)" />
          <FeatureCard icon={Handshake} title="Mentor Marketplace" description="Find experienced mentors in your field, book sessions, and get personalized career guidance and advice." accent="var(--success)" />
        </div>
      </section>

      {/* Tools & Tracking */}
      <section id="tools-tracking" className="section" style={{ padding: 'var(--space-8) 0' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Tools & Tracking</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Comprehensive suite of career management tools to track applications and showcase your work</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-primary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          <FeatureCard icon={Palette} title="Portfolio Builder" description="Create stunning online portfolios with custom domains, project showcases, and integrated analytics." accent="var(--accent-blue)" />
          <FeatureCard icon={Calendar} title="Job Tracker" description="Manage job applications with CRM-style tracking, calendar integration, and automated reminders." accent="var(--info)" />
          <FeatureCard icon={Mic} title="Interview Simulator" description="Practice with AI-powered mock interviews, get real-time feedback, and improve your interview skills." accent="var(--success)" />
          <FeatureCard icon={Search} title="Project Finder" description="Discover internships, hackathons, and collaborative projects with AI-powered matching and team formation." accent="var(--warning)" />
          <FeatureCard icon={BarChart3} title="Analytics Center" description="Access comprehensive career analytics, salary insights, and market trends with AI-powered research tools." accent="var(--error)" />
          <FeatureCard icon={Megaphone} title="Auto Distribution" description="Automatically distribute your resume to relevant job boards and recruiters based on your preferences." accent="var(--accent-blue)" />
        </div>
      </section>

      {/* AI Advanced Features */}
      <section id="ai-advanced" className="section" style={{ padding: 'var(--space-8) 0', background: 'var(--muted)' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>AI Advanced Features</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Cutting-edge AI technology for personalized career guidance and next-generation job search</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-secondary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          <FeatureCard icon={Brain} title="Career DNA" description="Discover your unique career profile with AI analysis of skills, interests, and personality traits for personalized guidance." accent="var(--success)" />
          <FeatureCard icon={Users} title="Career Twin" description="Find professionals with similar backgrounds who achieved your dream role and learn from their career paths." accent="var(--info)" />
          <FeatureCard icon={Globe} title="Global Opportunities" description="Explore international job markets with visa guidance, cultural insights, and location-specific optimization." accent="var(--warning)" />
          <FeatureCard icon={Video} title="Video Resume" description="Create compelling video resumes with AI-powered script generation and professional editing tools." accent="var(--accent-blue)" />
          <FeatureCard icon={Building} title="Virtual Career Fair" description="Attend virtual career events, network with employers, and participate in live interviews and presentations." accent="var(--error)" />
          <FeatureCard icon={Shield} title="Blockchain Verification" description="Secure credential verification using blockchain technology for tamper-proof skill and education certificates." accent="var(--success)" />
          <FeatureCard icon={MessageSquare} title="Communication Coach" description="Improve your professional communication with AI feedback on emails, messages, and presentation skills." accent="var(--info)" />
          <FeatureCard icon={Cpu} title="Job Intelligence" description="Get AI-powered insights on company culture, salary ranges, and hiring trends for informed decision making." accent="var(--warning)" />
          <FeatureCard icon={DollarSign} title="Salary Negotiation" description="Prepare for salary negotiations with market data, personalized scripts, and negotiation strategy guidance." accent="var(--accent-blue)" />
          <FeatureCard icon={Headphones} title="Voice Commands" description="Control the platform hands-free with voice commands for accessibility and improved user experience." accent="var(--error)" />
          <FeatureCard icon={Compass} title="Goal Navigator" description="Set and track career goals with AI-powered milestone planning and progress monitoring." accent="var(--success)" />
          <FeatureCard icon={Bot} title="Multi AI Agents" description="Deploy specialized AI agents for different career tasks like job searching, skill development, and networking." accent="var(--info)" />
        </div>
      </section>

      {/* Future Innovation */}
      <section id="future-features" className="section" style={{ padding: 'var(--space-8) 0' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Future Innovation</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Next-generation features for the future of work and career development</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-primary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          <FeatureCard icon={Code} title="Workspace Integration" description="Seamlessly integrate with popular development tools, project management platforms, and productivity suites." accent="var(--accent-blue)" />
          <FeatureCard icon={LinkIcon} title="Digital ID" description="Create a unified digital identity that connects all your professional profiles and achievements across platforms." accent="var(--info)" />
          <FeatureCard icon={Layers} title="Collaboration Tools" description="Work together on projects, share resources, and collaborate with team members in real-time environments." accent="var(--success)" />
          <FeatureCard icon={GraduationCap} title="Student Ecosystem" description="Specialized tools for students including academic project tracking, internship matching, and career planning." accent="var(--warning)" />
          <FeatureCard icon={Lightbulb} title="Career Lab" description="Experimental features and beta testing ground for cutting-edge career development technologies." accent="var(--error)" />
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="section" style={{ padding: 'var(--space-8) 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)', fontWeight: '800' }}>How It Works</h2>
          <p style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto', color: 'var(--text-soft)' }}>Transform your resume in 4 simple steps</p>
        </div>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-8)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          {/* Step 1 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)'
            }}>
              <UploadCloud size={40} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>1</span>
                <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: '700' }}>Upload or Build</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>Start with an existing resume file or create sections from scratch using our intuitive drag-and-drop builder.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexDirection: 'row-reverse' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)'
            }}>
              <Sparkles size={40} color="white" />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: '700' }}>Analyze with AI</h3>
                <span style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>2</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>Get intelligent rewrite suggestions, tone improvements, and detailed ATS compatibility scoring from our AI engine.</p>
            </div>
          </div>

          {/* Step 3 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)'
            }}>
              <Wand2 size={40} color="white" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                <span style={{
                  background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>3</span>
                <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: '700' }}>Optimize for ATS</h3>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>Identify missing keywords, improve ATS compatibility, and boost your resume's visibility to recruiters and hiring managers.</p>
            </div>
          </div>

          {/* Step 4 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)', flexDirection: 'row-reverse' }}>
            <div style={{
              minWidth: '80px',
              height: '80px',
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 10px 30px rgba(67, 233, 123, 0.3)'
            }}>
              <Rocket size={40} color="white" />
            </div>
            <div style={{ flex: 1, textAlign: 'right' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', justifyContent: 'flex-end' }}>
                <h3 style={{ margin: 0, fontSize: 'var(--text-2xl)', fontWeight: '700' }}>Export & Apply</h3>
                <span style={{
                  background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                  color: 'white',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>4</span>
              </div>
              <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-lg)', lineHeight: 1.6 }}>Download your polished resume in multiple formats (PDF, DOCX) and start applying to your dream jobs with confidence.</p>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <Link className="btn cta gradient large" to="/builder" style={{ minWidth: '200px' }}>
            <Rocket size={20} />
            Start Building Now
          </Link>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="section" style={{ padding: 'var(--space-8) 0', background: 'var(--bg-subtle)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)', fontWeight: '800' }}>Simple, Transparent Pricing</h2>
          <p style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto', color: 'var(--text-soft)' }}>Choose the perfect plan for your career journey</p>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-6)', maxWidth: '1000px', margin: '0 auto', flexWrap: 'wrap' }}>
          {/* Free Plan */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'var(--space-6)',
            width: '300px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Free</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text)', marginBottom: 'var(--space-4)' }}>₹0</div>
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Resume Builder</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Basic AI Analysis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>5 Templates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#10b981', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>PDF Export</span>
              </div>
            </div>
            <Link to="/register" style={{
              display: 'block',
              width: '100%',
              padding: '12px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontWeight: '500',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>Get Started</Link>
          </div>

          {/* Pro Plan */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            border: 'none',
            borderRadius: '16px',
            padding: 'var(--space-6)',
            width: '300px',
            textAlign: 'center',
            color: 'white',
            position: 'relative',
            transform: 'scale(1.05)',
            boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)'
          }}>
            <div style={{
              position: 'absolute',
              top: '-12px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'white',
              color: '#667eea',
              padding: '4px 16px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>POPULAR</div>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', marginBottom: 'var(--space-2)', color: 'white' }}>Pro</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', marginBottom: 'var(--space-1)' }}>₹499</div>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8, marginBottom: 'var(--space-4)' }}>per month</div>
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Everything in Free</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Advanced AI Analysis</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>15+ Premium Templates</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Unlimited Downloads</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Cover Letter Generator</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Priority Support</span>
              </div>
            </div>
            <Link to="/pricing" style={{
              display: 'block',
              width: '100%',
              padding: '12px 24px',
              background: 'white',
              border: 'none',
              borderRadius: '8px',
              textDecoration: 'none',
              color: '#667eea',
              fontWeight: '600',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>Upgrade to Pro</Link>
          </div>

          {/* Enterprise Plan */}
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '16px',
            padding: 'var(--space-6)',
            width: '300px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: 'var(--text-2xl)', fontWeight: '700', marginBottom: 'var(--space-2)' }}>Enterprise</h3>
            <div style={{ fontSize: '48px', fontWeight: '800', color: 'var(--text)', marginBottom: 'var(--space-4)' }}>Custom</div>
            <div style={{ textAlign: 'left', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Everything in Pro</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Team Management</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>Custom Branding</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <span style={{ color: '#f59e0b', fontSize: '16px' }}>✓</span>
                <span style={{ fontSize: 'var(--text-sm)' }}>API Access</span>
              </div>
            </div>
            <Link to="/pricing" style={{
              display: 'block',
              width: '100%',
              padding: '12px 24px',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              textDecoration: 'none',
              color: 'var(--text)',
              fontWeight: '500',
              textAlign: 'center',
              transition: 'all 0.2s'
            }}>Contact Sales</Link>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)' }}>All plans include 14-day free trial • No credit card required</p>
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
      <section id="contact" className="section" style={{ padding: 'var(--space-8) 0' }}>
        <div className="section-intro" style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
          <h2 className="section-title" style={{ fontSize: 'var(--text-4xl)', marginBottom: 'var(--space-3)' }}>Get in Touch</h2>
          <p className="muted" style={{ fontSize: 'var(--text-lg)', maxWidth: '600px', margin: '0 auto var(--space-4)' }}>Have questions about CareerAI? We're here to help you succeed in your career journey.</p>
          <div style={{ height: '3px', width: '80px', background: 'var(--gradient-primary)', borderRadius: '2px', margin: '0 auto' }} />
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 'var(--space-8)', maxWidth: '1200px', margin: '0 auto' }}>
          <div className="card shine" style={{ padding: 'var(--space-6)', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <Logo size={300} pulse />
          </div>
          <form className="card" style={{ padding: 'var(--space-6)' }} onSubmit={handleContactSubmit} noValidate>
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