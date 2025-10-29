import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Landing from './pages/Landing.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/PerfectDashboard.jsx';
import ResumeBuilder from './pages/ResumeBuilder.jsx';
import Analysis from './pages/Analysis.jsx';
import JobMatch from './pages/JobMatch.jsx';
import Settings from './pages/Settings.jsx';
import CoverLetter from './pages/CoverLetter.jsx';
import Pricing from './pages/Pricing.jsx';
import Navbar from './components/Navbar.jsx';
import AuthShell from './components/AuthShell.jsx';
import { ToastProvider } from './components/Toast.jsx';
import History from './pages/History.jsx';
import Trends from './pages/Trends.jsx';
import ResumeTemplates from './components/ResumeTemplates.jsx';
import JobMatcher from './components/JobMatcher.jsx';
import InterviewPrep from './components/InterviewPrep.jsx';
import CareerInsights from './components/CareerInsights.jsx';
import Forgot from './pages/Forgot.jsx';
import Reset from './pages/Reset.jsx';
import VerifyEmail from './pages/VerifyEmail.jsx';
import Verify from './pages/Verify.jsx';
import { ConnectionStatus } from './components/LoadingSystem.jsx';
import AIStatus from './components/AIStatus.jsx';
import ConnectionTest from './components/ConnectionTest.jsx';


function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function RequireVerified({ children }) {
  const { user } = useAuth();
  if (user && !user.emailVerified) return <Navigate to="/verify-email" />;
  return children;
}

function App() {
  const { user } = useAuth(); // initialize and read auth context
  const location = useLocation();

  // Show public navbar only for public pages, except pricing when user is authenticated
  const showPublicNavbar = (
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot' ||
    location.pathname === '/reset' ||
    (location.pathname === '/pricing' && !user)
  );

  return (
    <ToastProvider>
      <ConnectionStatus />
      <AIStatus />
      <ConnectionTest />
      {showPublicNavbar && <Navbar />}
      <Routes>
        {/* Public routes wrapped with container for centered content */}
        <Route path="/" element={<div className="container"><Landing /></div>} />
        <Route path="/login" element={<div className="container"><Login /></div>} />
        <Route path="/register" element={<div className="container"><Register /></div>} />
        <Route path="/forgot" element={<div className="container"><Forgot /></div>} />
        <Route path="/reset" element={<div className="container"><Reset /></div>} />
        <Route path="/verify" element={<div className="container"><Verify /></div>} />

        {/* Pricing should render in auth shell if logged in; otherwise public container */}
        <Route
          path="/pricing"
          element={
            user
              ? (<AuthShell><Pricing /></AuthShell>)
              : (<div className="container"><Pricing /></div>)
          }
        />

        {/* Verify email (authenticated but not verified) */}
        <Route path="/verify-email" element={<RequireAuth><div className="container"><VerifyEmail /></div></RequireAuth>} />

        {/* Authenticated routes use full-width AuthShell layout */}
        <Route path="/dashboard" element={<RequireAuth><RequireVerified><AuthShell><Dashboard /></AuthShell></RequireVerified></RequireAuth>} />
        <Route path="/builder" element={<RequireAuth><AuthShell><ResumeBuilder /></AuthShell></RequireAuth>} />
        <Route path="/analysis" element={<RequireAuth><AuthShell><Analysis /></AuthShell></RequireAuth>} />
        <Route path="/match" element={<RequireAuth><AuthShell><JobMatch /></AuthShell></RequireAuth>} />
        <Route path="/job-match" element={<RequireAuth><AuthShell><JobMatch /></AuthShell></RequireAuth>} />
        <Route path="/cover" element={<RequireAuth><AuthShell><CoverLetter /></AuthShell></RequireAuth>} />
        <Route path="/cover-letters" element={<RequireAuth><AuthShell><CoverLetter /></AuthShell></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><AuthShell><Settings /></AuthShell></RequireAuth>} />
        <Route path="/history" element={<RequireAuth><AuthShell><History /></AuthShell></RequireAuth>} />
        <Route path="/trends" element={<RequireAuth><AuthShell><Trends /></AuthShell></RequireAuth>} />
        <Route path="/templates" element={<RequireAuth><AuthShell><ResumeTemplates /></AuthShell></RequireAuth>} />
        <Route path="/jobs" element={<RequireAuth><AuthShell><JobMatcher /></AuthShell></RequireAuth>} />
        <Route path="/interview" element={<RequireAuth><AuthShell><InterviewPrep /></AuthShell></RequireAuth>} />
        <Route path="/insights" element={<RequireAuth><AuthShell><CareerInsights /></AuthShell></RequireAuth>} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
