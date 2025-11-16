import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Mail, X, AlertCircle } from 'lucide-react';

export default function VerificationBanner() {
  const { user } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  // Don't show if user is verified or banner is dismissed
  if (!user || user.emailVerified || dismissed) {
    return null;
  }

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '1px solid #f59e0b',
      borderRadius: '12px',
      padding: '16px',
      margin: '16px 0',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      position: 'relative'
    }}>
      <AlertCircle size={20} color="#f59e0b" />
      <div style={{ flex: 1 }}>
        <h4 style={{ 
          margin: '0 0 4px 0', 
          fontSize: '14px', 
          fontWeight: '600', 
          color: '#92400e' 
        }}>
          Email Verification Required
        </h4>
        <p style={{ 
          margin: 0, 
          fontSize: '13px', 
          color: '#92400e',
          lineHeight: '1.4'
        }}>
          Please verify your email to access all CareerAI features including resume analysis and AI tools.
        </p>
      </div>
      <Link 
        to="/verify-email"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 12px',
          background: '#f59e0b',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontSize: '13px',
          fontWeight: '500',
          transition: 'all 0.2s'
        }}
      >
        <Mail size={14} />
        Verify Email
      </Link>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#92400e',
          padding: '4px'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}