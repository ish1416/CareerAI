import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, Menu, X, Sparkles, Zap, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  const { hash } = useLocation();
  const navigate = useNavigate();
  
  const navigateToSection = React.useCallback((id) => (e) => {
    e.preventDefault();
    const target = document.getElementById(id);
    const path = '/';
    if (window.location.pathname !== path) {
      navigate(`${path}#${id}`);
      setTimeout(() => {
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 0);
    } else {
      window.history.pushState(null, '', `#${id}`);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setMenuOpen(false);
  }, [navigate]);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  React.useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menuOpen]);

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border)',
        height: '64px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 24px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          {/* Logo */}
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
            color: 'var(--text)',
            fontWeight: '700',
            fontSize: '20px',
            transition: 'transform 0.2s'
          }}>
            <Logo size={32} />
            <span>CareerAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '24px'
          }}>
            {user ? (
              <>
                <NavLink to="/dashboard" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Dashboard</NavLink>
                <NavLink to="/builder" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Builder</NavLink>
                <NavLink to="/analysis" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Analysis</NavLink>
                <NavLink to="/templates" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Templates</NavLink>
                <NavLink to="/learning" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Learning</NavLink>
                <NavLink to="/jobs" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Jobs</NavLink>
              </>
            ) : (
              <>
                <a href="/#features" onClick={navigateToSection('features')} style={{
                  textDecoration: 'none',
                  color: 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}>Features</a>
                <a href="/#how" onClick={navigateToSection('how')} style={{
                  textDecoration: 'none',
                  color: 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}>How it Works</a>
                <NavLink to="/pricing" style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  transition: 'color 0.2s'
                })}>Pricing</NavLink>
                <a href="/#testimonials" onClick={navigateToSection('testimonials')} style={{
                  textDecoration: 'none',
                  color: 'var(--text-soft)',
                  fontWeight: '500',
                  fontSize: '14px',
                  cursor: 'pointer',
                  transition: 'color 0.2s'
                }}>Reviews</a>
              </>
            )}
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <button
              onClick={toggleTheme}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px',
                borderRadius: '6px',
                cursor: 'pointer',
                color: 'var(--text-soft)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {!user ? (
              <>
                <Link to="/login" style={{
                  textDecoration: 'none',
                  color: 'var(--text)',
                  fontWeight: '500',
                  fontSize: '14px',
                  padding: '8px 16px',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                  background: 'transparent',
                  transition: 'all 0.2s'
                }}>Sign In</Link>
                <Link to="/register" style={{
                  textDecoration: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '14px',
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>Get Started</Link>
              </>
            ) : (
              <>
                <button
                  onClick={logout}
                  style={{
                    background: 'none',
                    border: '1px solid var(--border)',
                    color: 'var(--text-soft)',
                    fontWeight: '500',
                    fontSize: '14px',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >Logout</button>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '8px',
                cursor: 'pointer',
                color: 'var(--text-soft)'
              }}
              className="mobile-menu-btn"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px'
          }} className="mobile-menu">
            {user ? (
              <>
                <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Dashboard</NavLink>
                <NavLink to="/builder" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Builder</NavLink>
                <NavLink to="/analysis" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Analysis</NavLink>
                <NavLink to="/templates" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Templates</NavLink>
                <NavLink to="/learning" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Learning</NavLink>
                <NavLink to="/jobs" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Jobs</NavLink>
              </>
            ) : (
              <>
                <a href="/#features" onClick={navigateToSection('features')} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Features</a>
                <a href="/#how" onClick={navigateToSection('how')} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>How it Works</a>
                <NavLink to="/pricing" onClick={() => setMenuOpen(false)} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Pricing</NavLink>
                <a href="/#testimonials" onClick={navigateToSection('testimonials')} style={{ textDecoration: 'none', color: 'var(--text-soft)', fontWeight: '500', padding: '8px 0' }}>Reviews</a>
              </>
            )}
          </div>
        )}
      </nav>

      <style jsx>{`
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          nav > div > div:nth-child(2) {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}