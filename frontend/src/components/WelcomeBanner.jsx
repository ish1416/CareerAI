import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import Typewriter from './Typewriter.jsx';

export default function WelcomeBanner() {
  const { user } = useAuth();
  const [showTypewriter, setShowTypewriter] = useState(true);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const welcomeText = `${greeting}, ${user?.name || 'there'}!`;
  
  return (
    <div className="welcome" style={{ 
      padding: 'var(--space-5) 0',
      borderBottom: '1px solid var(--border)',
      marginBottom: 'var(--space-5)'
    }}>
      <h2 className="welcome-title" style={{ 
        fontSize: 'var(--text-4xl)', 
        fontWeight: 800,
        marginBottom: 'var(--space-2)'
      }}>
        {showTypewriter ? (
          <Typewriter 
            text={welcomeText}
            onError={() => setShowTypewriter(false)}
          />
        ) : (
          welcomeText
        )}
      </h2>
      <p className="welcome-sub" style={{ 
        fontSize: 'var(--text-lg)',
        color: 'var(--text-soft)'
      }}>
        Let's polish your resume and boost your job search today.
      </p>
    </div>
  );
}