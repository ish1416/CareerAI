import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, User, Settings, LogOut } from 'lucide-react';
import ModernLogo from './ModernLogo';
import ModernButton from './ModernButton';

export default function ModernNavbar({ user = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const navigation = [
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 50
      }}
    >
      <div className="container">
        <div className="flex items-center justify-between" style={{ height: 64, padding: '0 var(--space-2)' }}>
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" style={{ textDecoration: 'none', color: 'inherit' }}>
            <ModernLogo size={32} />
            <span className="text-lg font-bold">CareerAI</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="flex items-center gap-6" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm text-secondary"
                style={{
                  textDecoration: 'none',
                  transition: 'var(--transition)',
                  padding: 'var(--space-2) 0'
                }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 'var(--radius)',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <User size={16} />
                </button>
                
                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: '100%',
                      marginTop: 'var(--space-2)',
                      background: 'var(--background)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-lg)',
                      minWidth: 180,
                      padding: 'var(--space-2)',
                      zIndex: 60
                    }}
                  >
                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 text-sm"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius)',
                        textDecoration: 'none',
                        color: 'var(--text)',
                        transition: 'var(--transition)',
                        display: 'block'
                      }}
                    >
                      <User size={14} />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 text-sm"
                      style={{
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius)',
                        textDecoration: 'none',
                        color: 'var(--text)',
                        transition: 'var(--transition)',
                        display: 'block'
                      }}
                    >
                      <Settings size={14} />
                      Settings
                    </Link>
                    <button
                      className="flex items-center gap-2 text-sm"
                      style={{
                        width: '100%',
                        padding: 'var(--space-2) var(--space-3)',
                        borderRadius: 'var(--radius)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--error)',
                        cursor: 'pointer',
                        transition: 'var(--transition)',
                        textAlign: 'left'
                      }}
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login">
                  <ModernButton variant="ghost" size="sm">Sign in</ModernButton>
                </Link>
                <Link to="/register">
                  <ModernButton variant="primary" size="sm">Get started</ModernButton>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              style={{
                display: window.innerWidth <= 768 ? 'flex' : 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--surface)',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            style={{
              borderTop: '1px solid var(--border)',
              padding: 'var(--space-4) 0',
              display: window.innerWidth <= 768 ? 'block' : 'none'
            }}
          >
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm"
                style={{
                  display: 'block',
                  padding: 'var(--space-3) 0',
                  textDecoration: 'none',
                  color: 'var(--text)',
                  borderBottom: '1px solid var(--border)'
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}