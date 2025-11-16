import React, { useState } from 'react';
import { Shield, Award, FileText, CheckCircle, Copy, QrCode, ExternalLink, Plus } from 'lucide-react';

export default function ProBlockchainVerification() {
  const [activeTab, setActiveTab] = useState('passport');
  const [selectedItem, setSelectedItem] = useState(null);

  const tabs = [
    { id: 'passport', label: 'Career Passport', icon: Shield },
    { id: 'certificates', label: 'Certificates', icon: FileText },
    { id: 'achievements', label: 'NFT Badges', icon: Award }
  ];

  const passport = {
    blockchainId: '0x742d35Cc6634C0532925a3b8D4C0532925a3b8D4',
    network: 'Ethereum',
    trustScore: 94,
    verified: true,
    createdAt: '2024-01-15'
  };

  const certificates = [
    {
      id: 1,
      title: 'AWS Solutions Architect',
      issuer: 'Amazon Web Services',
      issueDate: '2024-02-15',
      hash: '0x8f3b2c1d9e5a7b4c6f8e2a1d3c5b7e9f1a3c5d7b9e',
      verified: true,
      type: 'Professional Certification'
    },
    {
      id: 2,
      title: 'React Developer Certification',
      issuer: 'Meta',
      issueDate: '2024-01-20',
      hash: '0x1a3c5d7b9e8f3b2c1d9e5a7b4c6f8e2a1d3c5b7e9f',
      verified: true,
      type: 'Technical Certification'
    }
  ];

  const achievements = [
    {
      id: 1,
      title: 'Innovation Leader',
      description: 'Led 3+ successful product launches',
      tokenId: '1337',
      color: '#FFD700',
      rarity: 'Legendary',
      earned: '2024-03-01'
    },
    {
      id: 2,
      title: 'Team Builder',
      description: 'Built and managed high-performing teams',
      tokenId: '2468',
      color: '#FF6B6B',
      rarity: 'Epic',
      earned: '2024-02-15'
    }
  ];

  const renderPassport = () => (
    <div className="pro-passport-section">
      <div className="pro-passport-card">
        <div className="pro-passport-header">
          <div className="pro-passport-icon">
            <Shield size={48} />
          </div>
          <div className="pro-passport-info">
            <h2>Career Passport</h2>
            <p>Your tamper-proof digital identity on blockchain</p>
            <div className="pro-passport-id">
              <span>ID: {passport.blockchainId.substring(0, 16)}...</span>
              <button className="pro-copy-btn" onClick={() => navigator.clipboard.writeText(passport.blockchainId)}>
                <Copy size={14} />
              </button>
            </div>
          </div>
          <div className="pro-trust-score">
            <div className="pro-score-circle">
              <span>{passport.trustScore}</span>
            </div>
            <div className="pro-score-label">Trust Score</div>
          </div>
        </div>

        <div className="pro-passport-details">
          <div className="pro-detail-item">
            <span className="pro-detail-label">Network:</span>
            <span className="pro-detail-value">{passport.network}</span>
          </div>
          <div className="pro-detail-item">
            <span className="pro-detail-label">Status:</span>
            <span className="pro-detail-value verified">
              <CheckCircle size={16} />
              Verified
            </span>
          </div>
          <div className="pro-detail-item">
            <span className="pro-detail-label">Created:</span>
            <span className="pro-detail-value">{passport.createdAt}</span>
          </div>
        </div>

        <div className="pro-passport-actions">
          <button className="pro-btn-secondary">
            <QrCode size={16} />
            Generate QR
          </button>
          <button className="pro-btn-secondary">
            <ExternalLink size={16} />
            View on Chain
          </button>
        </div>
      </div>
    </div>
  );

  const renderCertificates = () => (
    <div className="pro-certificates-section">
      <div className="pro-section-header">
        <h3>Verified Certificates</h3>
        <button className="pro-btn-primary">
          <Plus size={16} />
          Add Certificate
        </button>
      </div>

      <div className="pro-certificates-grid">
        {certificates.map((cert) => (
          <div key={cert.id} className="pro-certificate-card">
            <div className="pro-certificate-header">
              <div className="pro-certificate-icon">
                <FileText size={24} />
              </div>
              <div className="pro-certificate-info">
                <h4>{cert.title}</h4>
                <p className="pro-certificate-issuer">{cert.issuer}</p>
                <p className="pro-certificate-type">{cert.type}</p>
              </div>
              <div className="pro-verification-badge verified">
                <CheckCircle size={16} />
                <span>Verified</span>
              </div>
            </div>

            <div className="pro-certificate-details">
              <div className="pro-certificate-meta">
                <span>Issued: {cert.issueDate}</span>
                <span>Hash: {cert.hash.substring(0, 16)}...</span>
              </div>
            </div>

            <div className="pro-certificate-actions">
              <button className="pro-btn-ghost">
                <QrCode size={14} />
                Share
              </button>
              <button className="pro-btn-ghost">
                <ExternalLink size={14} />
                Verify
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="pro-achievements-section">
      <div className="pro-section-header">
        <h3>NFT Achievement Badges</h3>
        <button className="pro-btn-primary">
          <Plus size={16} />
          Mint Achievement
        </button>
      </div>

      <div className="pro-achievements-grid">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="pro-achievement-card">
            <div className="pro-achievement-badge" style={{ backgroundColor: achievement.color }}>
              <Award size={32} />
            </div>
            
            <div className="pro-achievement-info">
              <h4>{achievement.title}</h4>
              <p className="pro-achievement-desc">{achievement.description}</p>
              
              <div className="pro-achievement-meta">
                <div className="pro-achievement-rarity">
                  <span className={`pro-rarity-badge ${achievement.rarity.toLowerCase()}`}>
                    {achievement.rarity}
                  </span>
                </div>
                <div className="pro-achievement-token">
                  Token #{achievement.tokenId}
                </div>
              </div>

              <div className="pro-achievement-date">
                Earned: {achievement.earned}
              </div>
            </div>

            <div className="pro-achievement-actions">
              <button className="pro-btn-ghost">
                <QrCode size={14} />
                Share
              </button>
              <button className="pro-btn-ghost">
                <ExternalLink size={14} />
                OpenSea
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-header-content">
          <div className="pro-header-icon">
            <Shield size={32} />
          </div>
          <div>
            <h1 className="pro-title">Blockchain Verification</h1>
            <p className="pro-subtitle">Tamper-proof digital credentials and achievements</p>
          </div>
        </div>
        <button className="pro-btn-primary">
          <Shield size={16} />
          Create Passport
        </button>
      </div>

      {/* Navigation */}
      <div className="pro-nav-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              className={`pro-nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeTab === 'passport' && renderPassport()}
        {activeTab === 'certificates' && renderCertificates()}
        {activeTab === 'achievements' && renderAchievements()}
      </div>
    </div>
  );
}