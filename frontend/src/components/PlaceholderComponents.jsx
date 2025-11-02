import React from 'react';
import { Shield, Users, Target, BookOpen, Bot, Rocket, BriefcaseIcon } from 'lucide-react';

export const WorkspaceIntegration = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <BriefcaseIcon size={32} color="var(--primary)" />
      <div>
        <h1>Workspace Integration</h1>
        <p style={{ color: 'var(--text-soft)' }}>Connect with Notion, Slack, GitHub, and more</p>
      </div>
    </div>
    <div className="card">
      <p>Workspace integration features coming soon...</p>
    </div>
  </div>
);

export const DigitalID = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <Shield size={32} color="var(--primary)" />
      <div>
        <h1>Digital ID & Verification</h1>
        <p style={{ color: 'var(--text-soft)' }}>Secure identity verification for recruiters</p>
      </div>
    </div>
    <div className="card">
      <p>Digital ID features coming soon...</p>
    </div>
  </div>
);

export const CollaborationTools = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <Users size={32} color="var(--primary)" />
      <div>
        <h1>AI-Powered Collaboration Tools</h1>
        <p style={{ color: 'var(--text-soft)' }}>Team resume building and collaboration</p>
      </div>
    </div>
    <div className="card">
      <p>Collaboration tools coming soon...</p>
    </div>
  </div>
);

export const StudentEcosystem = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <BookOpen size={32} color="var(--primary)" />
      <div>
        <h1>Student Ecosystem</h1>
        <p style={{ color: 'var(--text-soft)' }}>Campus placements and student features</p>
      </div>
    </div>
    <div className="card">
      <p>Student ecosystem features coming soon...</p>
    </div>
  </div>
);

export const MultiAIAgents = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <Bot size={32} color="var(--primary)" />
      <div>
        <h1>Multi-AI Agent System</h1>
        <p style={{ color: 'var(--text-soft)' }}>Specialized AI agents for different tasks</p>
      </div>
    </div>
    <div className="card">
      <p>Multi-AI agent system coming soon...</p>
    </div>
  </div>
);

export const CareerLab = () => (
  <div className="main-content">
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
      <Rocket size={32} color="var(--primary)" />
      <div>
        <h1>CareerAI Lab</h1>
        <p style={{ color: 'var(--text-soft)' }}>R&D and experimental features</p>
      </div>
    </div>
    <div className="card">
      <p>CareerAI Lab features coming soon...</p>
    </div>
  </div>
);