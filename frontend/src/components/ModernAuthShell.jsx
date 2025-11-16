import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import ModernLogo from './ModernLogo.jsx';
import { 
  LayoutDashboard, FilePlus2, SearchCheck, Briefcase, Mail, User, Settings, LogOut, 
  Sun, Moon, CreditCard, TrendingUp, History, BookOpen, Users, Globe, Calendar, 
  Mic, Rocket, BarChart, Menu, X, Video, Shield, Headphones, DollarSign, Zap, 
  UserCheck, MessageSquare, Bot, Target, Bell, Search, FileText
} from 'lucide-react';

export default function ModernAuthShell({ children }) {
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigationGroups = [
    {
      label: 'Core',
      items: [
        { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/pro-templates', icon: FileText, label: 'Templates' },
        { to: '/builder', icon: FilePlus2, label: 'Resume Builder' },
        { to: '/analysis', icon: SearchCheck, label: 'Analysis' },
        { to: '/job-match', icon: Briefcase, label: 'Job Match' },
        { to: '/cover-letters', icon: Mail, label: 'Cover Letters' }
      ]
    },
    {
      label: 'Growth',
      items: [
        { to: '/pro-learning', icon: BookOpen, label: 'Learning Hub' },
        { to: '/pro-learning-dashboard', icon: TrendingUp, label: 'Learning Dashboard' },
        { to: '/pro-community', icon: Users, label: 'Community' },
        { to: '/pro-community-hub', icon: MessageSquare, label: 'Community Hub' },
        { to: '/pro-portfolio', icon: Globe, label: 'Portfolio' },
        { to: '/pro-career-insights', icon: BarChart, label: 'Career Insights' }
      ]
    },
    {
      label: 'Tools',
      items: [
        { to: '/pro-job-tracker', icon: Calendar, label: 'Job Tracker' },
        { to: '/pro-interview', icon: Mic, label: 'Interview Prep' },
        { to: '/pro-templates', icon: FileText, label: 'Templates' },
        { to: '/pro-job-matcher', icon: Briefcase, label: 'Job Matcher' },
        { to: '/pro-interview-prep', icon: Video, label: 'Interview Prep Pro' },
        { to: '/pro-job-matcher', icon: Search, label: 'Job Matcher' },
        { to: '/pro-projects', icon: Rocket, label: 'Projects' },
        { to: '/pro-analytics', icon: BarChart, label: 'Analytics' }
      ]
    },
    {
      label: 'AI Advanced',
      items: [
        { to: '/pro-career-dna', icon: TrendingUp, label: 'Career DNA' },
        { to: '/pro-career-twin', icon: User, label: 'Career Twin' },
        { to: '/pro-video-resume', icon: Video, label: 'Video Resume' },
        { to: '/pro-salary-negotiation', icon: DollarSign, label: 'Salary Assistant' }
      ]
    },
    {
      label: 'Marketplace',
      items: [
        { to: '/pro-virtual-fair', icon: Users, label: 'Virtual Fair' },
        { to: '/pro-mentor-marketplace', icon: UserCheck, label: 'Mentors' },
        { to: '/pro-global-opportunities', icon: Globe, label: 'Global Jobs' }
      ]
    },
    {
      label: 'Advanced Tools',
      items: [
        { to: '/pro-blockchain-verification', icon: Shield, label: 'Blockchain ID' },
        { to: '/pro-auto-distribution', icon: Zap, label: 'Auto Distribution' },
        { to: '/pro-communication-coach', icon: MessageSquare, label: 'Communication' },
        { to: '/pro-job-intelligence', icon: BarChart, label: 'Job Intelligence' },
        { to: '/pro-voice-commands', icon: Headphones, label: 'Voice Control' },
        { to: '/pro-goal-navigator', icon: Target, label: 'Goal Navigator' }
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--background)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 280,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'var(--transition)',
          zIndex: 50,
          overflowY: 'auto'
        }}
        className="sidebar-modern"
      >
        <div style={{ padding: 'var(--space-6)', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Brand */}
          <Link
            to="/dashboard"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              textDecoration: 'none',
              color: 'inherit',
              marginBottom: 'var(--space-8)',
              paddingBottom: 'var(--space-6)',
              borderBottom: '1px solid var(--border)'
            }}
          >
            <ModernLogo size={32} />
            <span className="text-lg font-bold">CareerAI</span>
          </Link>

          {/* Navigation */}
          <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            {navigationGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <div
                  className="text-xs font-semibold text-muted"
                  style={{
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginBottom: 'var(--space-3)',
                    paddingLeft: 'var(--space-3)'
                  }}
                >
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setSidebarOpen(false)}
                        style={({ isActive }) => ({
                          display: 'flex',
                          alignItems: 'center',
                          gap: 'var(--space-3)',
                          padding: 'var(--space-3)',
                          borderRadius: 'var(--radius)',
                          textDecoration: 'none',
                          fontSize: 'var(--text-sm)',
                          fontWeight: isActive ? 600 : 500,
                          color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                          background: isActive ? 'rgba(0, 112, 243, 0.1)' : 'transparent',
                          transition: 'var(--transition)',
                          position: 'relative'
                        })}
                        onMouseEnter={(e) => {
                          if (!e.target.classList.contains('active')) {
                            e.target.style.background = 'var(--gray-100)';
                            e.target.style.color = 'var(--text)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!e.target.classList.contains('active')) {
                            e.target.style.background = 'transparent';
                            e.target.style.color = 'var(--text-secondary)';
                          }
                        }}
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer Actions */}
          <div
            style={{
              borderTop: '1px solid var(--border)',
              paddingTop: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-2)'
            }}
          >
            <Link
              to="/pro-pricing"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                textDecoration: 'none',
                fontSize: 'var(--text-sm)',
                fontWeight: 600,
                background: 'var(--primary)',
                color: 'white',
                transition: 'var(--transition)'
              }}
            >
              <CreditCard size={18} />
              <span>Upgrade Plan</span>
            </Link>

            <button
              onClick={toggleTheme}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'transparent',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
              <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>

            <Link
              to="/pro-settings"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                textDecoration: 'none',
                color: 'var(--text-secondary)',
                fontSize: 'var(--text-sm)',
                transition: 'var(--transition)'
              }}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>

            <button
              onClick={logout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-3)',
                padding: 'var(--space-3)',
                borderRadius: 'var(--radius)',
                border: 'none',
                background: 'transparent',
                color: 'var(--error)',
                fontSize: 'var(--text-sm)',
                cursor: 'pointer',
                transition: 'var(--transition)',
                width: '100%',
                textAlign: 'left'
              }}
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 40
          }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div style={{ flex: 1, marginLeft: 280, display: 'flex', flexDirection: 'column' }}>
        {/* Top Header */}
        <header
          style={{
            height: 64,
            background: 'var(--background)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 var(--space-6)',
            position: 'sticky',
            top: 0,
            zIndex: 30
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: 'var(--surface)',
              cursor: 'pointer'
            }}
            className="mobile-menu-btn"
          >
            <Menu size={18} />
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={18}
                style={{
                  position: 'absolute',
                  left: 'var(--space-3)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--text-muted)'
                }}
              />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  width: 300,
                  padding: 'var(--space-2) var(--space-3) var(--space-2) var(--space-10)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  background: 'var(--surface)',
                  fontSize: 'var(--text-sm)'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <button
              style={{
                width: 40,
                height: 40,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <Bell size={18} />
            </button>

            <div
              style={{
                width: 40,
                height: 40,
                background: 'var(--primary)',
                borderRadius: 'var(--radius)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 600,
                fontSize: 'var(--text-sm)'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, padding: 'var(--space-6)', background: 'var(--gray-50)' }}>
          {children}
        </main>
      </div>

      <style jsx>{`
        @media (max-width: 1024px) {
          .sidebar-modern {
            margin-left: 0 !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
}