import React from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import Logo from './Logo.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { Sun, Moon, Menu, Rocket } from 'lucide-react';

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
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="navbar">
      <div className="brand">
        {/* Single brand link to align logo + name consistently */}
        <Link to="/" className="brand-link" aria-label="Career AI">
          <Logo size={48} pulse />
          <span className="brand-name gradient-text" style={{ fontSize: '1.4rem' }}>Career AI</span>
        </Link>
        <button
          type="button"
          className="menu-toggle"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          <Menu size={18} />
        </button>
      </div>
      <nav className={`nav-links ${menuOpen ? 'open' : ''}`} aria-label="Primary navigation">
        {user ? (
          <>
            <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'active' : undefined}>Dashboard</NavLink>
            <NavLink to="/templates" className={({ isActive }) => isActive ? 'active' : undefined}>Templates</NavLink>
            <NavLink to="/jobs" className={({ isActive }) => isActive ? 'active' : undefined}>Jobs</NavLink>
            <NavLink to="/interview" className={({ isActive }) => isActive ? 'active' : undefined}>Interview Prep</NavLink>
            <NavLink to="/insights" className={({ isActive }) => isActive ? 'active' : undefined}>Career Insights</NavLink>
          </>
        ) : (
          <>
            <a href="/#features" onClick={navigateToSection('features')} aria-current={hash === '#features' ? 'page' : undefined}>Features</a>
            <NavLink to="/pricing" className={({ isActive }) => isActive ? 'active' : undefined}>Pricing</NavLink>
            <a href="/#testimonials" onClick={navigateToSection('testimonials')} aria-current={hash === '#testimonials' ? 'page' : undefined}>Testimonials</a>
            <a href="/#contact" onClick={navigateToSection('contact')} aria-current={hash === '#contact' ? 'page' : undefined}>Contact</a>
          </>
        )}
      </nav>
      <div className="nav-actions">
        <button
          type="button"
          className="btn small ghost"
          aria-label="Toggle theme"
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span>{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </button>
        <Link to="/dashboard" className="btn cta gradient small">
          <Rocket size={16} />
          Get Started
        </Link>
        {user ? (
          <>
            <button type="button" className="btn small ghost" onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn small ghost">Login</Link>
          </>
        )}
      </div>
    </header>
  );
}