import React, { useState } from 'react';
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
import CareerGoals from './pages/CareerGoals.jsx';
import SkillDevelopment from './pages/SkillDevelopment.jsx';
import LearningDashboard from './components/LearningDashboard.jsx';
import CommunityHub from './components/CommunityHub.jsx';
import ProfileShowcase from './components/ProfileShowcase.jsx';
import RecruiterDashboard from './components/RecruiterDashboard.jsx';
import PortfolioBuilder from './components/PortfolioBuilder.jsx';
import JobTracker from './components/JobTracker.jsx';
import InterviewSimulator from './components/InterviewSimulator.jsx';
import ProjectFinder from './components/ProjectFinder.jsx';
import AnalyticsCenter from './components/AnalyticsCenter.jsx';
import CareerDNA from './components/CareerDNA.jsx';
import CareerTwin from './components/CareerTwin.jsx';
import GlobalOpportunities from './components/GlobalOpportunities.jsx';
import VideoResume from './components/VideoResume.jsx';
import VirtualCareerFair from './components/VirtualCareerFair.jsx';
import BlockchainVerification from './components/BlockchainVerification.jsx';
import MentorMarketplace from './components/MentorMarketplace.jsx';
import AutoDistribution from './components/AutoDistribution.jsx';
import CommunicationCoach from './components/CommunicationCoach.jsx';
import JobIntelligence from './components/JobIntelligence.jsx';
import SalaryNegotiation from './components/SalaryNegotiation.jsx';
import VoiceCommands from './components/VoiceCommands.jsx';
import GoalNavigator from './components/GoalNavigator.jsx';
import { WorkspaceIntegration, DigitalID, CollaborationTools, StudentEcosystem, MultiAIAgents, CareerLab } from './components/PlaceholderComponents.jsx';
import { ConnectionStatus } from './components/LoadingSystem.jsx';
import AICopilot, { CopilotToggle } from './components/AICopilot.jsx';


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
  const [copilotOpen, setCopilotOpen] = useState(false);

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
      {showPublicNavbar && <Navbar />}
      
      {/* AI Copilot - Available on authenticated pages */}
      {user && (
        <>
          <AICopilot isOpen={copilotOpen} onToggle={() => setCopilotOpen(!copilotOpen)} />
          {!copilotOpen && <CopilotToggle onClick={() => setCopilotOpen(true)} />}
        </>
      )}
      <Routes>
        {/* Public routes wrapped with container for centered content */}
        <Route path="/" element={<Landing />} />
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
        <Route path="/goals" element={<RequireAuth><AuthShell><CareerGoals /></AuthShell></RequireAuth>} />
        <Route path="/skills" element={<RequireAuth><AuthShell><SkillDevelopment /></AuthShell></RequireAuth>} />
        <Route path="/learning" element={<RequireAuth><AuthShell><LearningDashboard /></AuthShell></RequireAuth>} />
        <Route path="/community" element={<RequireAuth><AuthShell><CommunityHub /></AuthShell></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><AuthShell><ProfileShowcase isOwnProfile={true} /></AuthShell></RequireAuth>} />
        <Route path="/profile/:userId" element={<RequireAuth><AuthShell><ProfileShowcase /></AuthShell></RequireAuth>} />
        <Route path="/recruiter" element={<RequireAuth><AuthShell><RecruiterDashboard /></AuthShell></RequireAuth>} />
        <Route path="/portfolio" element={<RequireAuth><AuthShell><PortfolioBuilder /></AuthShell></RequireAuth>} />
        <Route path="/job-tracker" element={<RequireAuth><AuthShell><JobTracker /></AuthShell></RequireAuth>} />
        <Route path="/interview" element={<RequireAuth><AuthShell><InterviewSimulator /></AuthShell></RequireAuth>} />
        <Route path="/projects" element={<RequireAuth><AuthShell><ProjectFinder /></AuthShell></RequireAuth>} />
        <Route path="/analytics" element={<RequireAuth><AuthShell><AnalyticsCenter /></AuthShell></RequireAuth>} />
        <Route path="/career-dna" element={<RequireAuth><AuthShell><CareerDNA /></AuthShell></RequireAuth>} />
        <Route path="/career-twin" element={<RequireAuth><AuthShell><CareerTwin /></AuthShell></RequireAuth>} />
        <Route path="/global-ops" element={<RequireAuth><AuthShell><GlobalOpportunities /></AuthShell></RequireAuth>} />
        <Route path="/video-resume" element={<RequireAuth><AuthShell><VideoResume /></AuthShell></RequireAuth>} />
        <Route path="/virtual-fair" element={<RequireAuth><AuthShell><VirtualCareerFair /></AuthShell></RequireAuth>} />
        <Route path="/blockchain-verify" element={<RequireAuth><AuthShell><BlockchainVerification /></AuthShell></RequireAuth>} />
        <Route path="/mentor-marketplace" element={<RequireAuth><AuthShell><MentorMarketplace /></AuthShell></RequireAuth>} />
        <Route path="/auto-distribution" element={<RequireAuth><AuthShell><AutoDistribution /></AuthShell></RequireAuth>} />
        <Route path="/communication-coach" element={<RequireAuth><AuthShell><CommunicationCoach /></AuthShell></RequireAuth>} />
        <Route path="/job-intelligence" element={<RequireAuth><AuthShell><JobIntelligence /></AuthShell></RequireAuth>} />
        <Route path="/workspace-integration" element={<RequireAuth><AuthShell><WorkspaceIntegration /></AuthShell></RequireAuth>} />
        <Route path="/digital-id" element={<RequireAuth><AuthShell><DigitalID /></AuthShell></RequireAuth>} />
        <Route path="/collaboration-tools" element={<RequireAuth><AuthShell><CollaborationTools /></AuthShell></RequireAuth>} />
        <Route path="/goal-navigator" element={<RequireAuth><AuthShell><GoalNavigator /></AuthShell></RequireAuth>} />
        <Route path="/student-ecosystem" element={<RequireAuth><AuthShell><StudentEcosystem /></AuthShell></RequireAuth>} />
        <Route path="/voice-commands" element={<RequireAuth><AuthShell><VoiceCommands /></AuthShell></RequireAuth>} />
        <Route path="/salary-negotiation" element={<RequireAuth><AuthShell><SalaryNegotiation /></AuthShell></RequireAuth>} />
        <Route path="/ai-agents" element={<RequireAuth><AuthShell><MultiAIAgents /></AuthShell></RequireAuth>} />
        <Route path="/career-lab" element={<RequireAuth><AuthShell><CareerLab /></AuthShell></RequireAuth>} />
      </Routes>
    </ToastProvider>
  );
}

export default App;
