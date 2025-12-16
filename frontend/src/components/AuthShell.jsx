import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import Logo from './Logo.jsx';
import { LayoutDashboard, FilePlus2, SearchCheck, Briefcase, Mail, User, Settings, LogOut, Sun, Moon, CreditCard, TrendingUp, History, BookOpen, Users, Globe, Calendar, Mic, Rocket, BarChart, Menu, X, Video, Shield, Headphones, DollarSign, Zap, UserCheck, MessageSquare, Briefcase as BriefcaseIcon, Bot, Target, Search, BarChart3, Code } from 'lucide-react';

export default function AuthShell({ children }) {
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const sidebarRef = React.useRef(null);
  
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    function onDocClick(e) {
      if (!menuOpen) return;
      const el = menuRef.current;
      if (el && !el.contains(e.target)) setMenuOpen(false);
    }
    function onEsc(e) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setSidebarOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onDocClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [menuOpen]);

  React.useEffect(() => {
    if (sidebarOpen) {
      sidebarRef.current?.focus();
    }
  }, [sidebarOpen]);

  const navigationItems = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', group: 'main' },
    { to: '/builder', icon: FilePlus2, label: 'Resume Builder', group: 'main' },
    { to: '/analysis', icon: SearchCheck, label: 'Analysis', group: 'main' },
    { to: '/job-match', icon: Briefcase, label: 'Job Match', group: 'main' },
    { to: '/cover-letters', icon: Mail, label: 'Cover Letters', group: 'main' },
    { to: '/learning', icon: BookOpen, label: 'Learning Hub', group: 'growth' },
    { to: '/coding-questions', icon: Code, label: 'Coding Practice', group: 'growth' },
    { to: '/community', icon: Users, label: 'Community', group: 'growth' },
    { to: '/portfolio', icon: Globe, label: 'Portfolio', group: 'growth' },
    { to: '/job-tracker', icon: Calendar, label: 'Job Tracker', group: 'tools' },
    { to: '/interview', icon: Mic, label: 'Interview Prep', group: 'tools' },
    { to: '/projects', icon: Rocket, label: 'Projects', group: 'tools' },
    { to: '/web-scraper', icon: Search, label: 'Web Scraper', group: 'tools' },
    { to: '/seo-tools', icon: BarChart3, label: 'SEO Tools', group: 'tools' },
    { to: '/ai-advanced', icon: Bot, label: 'AI Advanced Hub', group: 'advanced' },
    { to: '/analytics', icon: BarChart, label: 'Analytics', group: 'insights' },
    { to: '/history', icon: History, label: 'History', group: 'insights' }
  ];

  const groupedNav = {
    main: navigationItems.filter(item => item.group === 'main'),
    growth: navigationItems.filter(item => item.group === 'growth'),
    tools: navigationItems.filter(item => item.group === 'tools'),
    advanced: navigationItems.filter(item => item.group === 'advanced'),
    insights: navigationItems.filter(item => item.group === 'insights')
  };

  return (
    <div className="app-shell-sidebar">
      <a href="#main" className="skip-link">Skip to main content</a>
      {/* Mobile Header */}
      <header className="mobile-header">
        <button 
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label="Toggle sidebar"
        >
          {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        <Link to="/dashboard" className="brand-link">
          <Logo size={32} variant="accent" />
          <span className="gradient-text">CareerAI</span>
        </Link>
      </header>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`} role="dialog" aria-modal={sidebarOpen} tabIndex={-1} ref={sidebarRef}>
        <div className="sidebar-content">
          <Link to="/" className="sidebar-brand" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Logo size={28} variant="accent" />
            <span className="gradient-text">CareerAI</span>
          </Link>
          
          <nav className="sidebar-nav">
            <div className="nav-group">
              <div className="nav-group-label">Core Features</div>
              {groupedNav.main.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="nav-group">
              <div className="nav-group-label">Growth & Learning</div>
              {groupedNav.growth.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="nav-group">
              <div className="nav-group-label">Tools & Tracking</div>
              {groupedNav.tools.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="nav-group">
              <div className="nav-group-label">AI Advanced</div>
              {groupedNav.advanced.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="nav-group">
              <div className="nav-group-label">Insights</div>
              {groupedNav.insights.map(item => {
                const Icon = item.icon;
                return (
                  <NavLink 
                    key={item.to}
                    to={item.to} 
                    className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </div>
            
            <div className="sidebar-footer">
              <NavLink to="/pricing" className="sidebar-action upgrade">
                <CreditCard size={18} />
                <span>Upgrade Plan</span>
              </NavLink>
              
              <button
                className="sidebar-action"
                onClick={toggleTheme}
                title={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
              </button>
              
              <NavLink to="/settings" className="sidebar-action">
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
              
              <button className="sidebar-action logout" onClick={logout}>
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <main className="main-content" id="main">
        {children}
      </main>
    </div>
  );
}