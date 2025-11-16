import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function VerificationGuard({ children }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !user.emailVerified) {
      navigate('/verify-email', { replace: true });
    }
  }, [user, navigate]);

  // Don't render children if user is not verified
  if (user && !user.emailVerified) {
    return null;
  }

  return children;
}