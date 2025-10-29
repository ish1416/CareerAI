import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Logo from './Logo.jsx';
import { LayoutDashboard, FilePlus2, SearchCheck, Briefcase, Mail, User, Settings, LogOut, Sun, Moon, CreditCard, TrendingUp, History } from 'lucide-react';

export default function AuthShell({ children }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  // Add ref and outside-click close
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;
      const el = menuRef.current;
      if (el && !el.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') setMenuOpen(false);
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <Link to="/dashboard" className="brand-name" aria-label="Career AI" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-3)',
            textDecoration: 'none',
            color: 'var(--text)',
            fontWeight: 700,
            fontSize: 'var(--text-xl)'
          }}>
            <Logo size={44} />
            <span className="gradient-text">Career AI</span>
          </Link>
        </div>
        <div className="app-header-actions" ref={menuRef} style={{ position: 'relative' }}>
          <Link
            to="/pricing"
            className="btn small cta gradient"
            aria-label="Upgrade plan"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            <CreditCard size={16} />
            <span>Upgrade</span>
          </Link>
          <button
            type="button"
            className="btn small ghost"
            aria-label="Toggle theme"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)' }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button type="button" className="avatar" aria-label="User menu" aria-expanded={menuOpen} onClick={() => setMenuOpen((o) => !o)}>
            <User size={18} />
          </button>
          {menuOpen && (
            <div className="menu" role="menu">
              <Link to="/settings" className="menu-item"><Settings size={16} /> <span>Settings</span></Link>
              <button type="button" className="menu-item" onClick={logout}><LogOut size={16} /> <span>Logout</span></button>
            </div>
          )}
        </div>
      </header>

      <nav className="app-topnav" aria-label="Application navigation">
        <NavLink to="/dashboard" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={18} /> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/builder" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <FilePlus2 size={18} /> <span>Builder</span>
        </NavLink>
        <NavLink to="/analysis" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <SearchCheck size={18} /> <span>Analysis</span>
        </NavLink>
        <NavLink to="/job-match" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <Briefcase size={18} /> <span>Job Match</span>
        </NavLink>
        <NavLink to="/cover-letters" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <Mail size={18} /> <span>Cover Letters</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `topnav-link ${isActive ? 'active' : ''}`}>
          <History size={18} /> <span>History</span>
        </NavLink>
      </nav>

      <main className="content" role="main">
        {children}
      </main>
    </div>
  );
}