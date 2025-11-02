import React, { useState, useEffect } from 'react';
import { Shield, Award, FileText, CheckCircle, ExternalLink, Copy, QrCode } from 'lucide-react';
import api from '../utils/api.js';

export default function BlockchainVerification() {
  const [passport, setPassport] = useState(null);
  const [certificates, setCertificates] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [verificationStatus, setVerificationStatus] = useState('pending');
  const [selectedItem, setSelectedItem] = useState(null);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    loadPassportData();
    loadCertificates();
    loadAchievements();
  }, []);

  const loadPassportData = async () => {
    try {
      const { data } = await api.get('/blockchain/passport');
      setPassport(data.passport);
      setVerificationStatus(data.status);
    } catch (error) {
      console.error('Failed to load passport:', error);
    }
  };

  const loadCertificates = async () => {
    try {
      const { data } = await api.get('/blockchain/certificates');
      setCertificates(data.certificates);
    } catch (error) {
      console.error('Failed to load certificates:', error);
    }
  };

  const loadAchievements = async () => {
    try {
      const { data } = await api.get('/blockchain/achievements');
      setAchievements(data.achievements);
    } catch (error) {
      console.error('Failed to load achievements:', error);
    }
  };

  const createPassport = async () => {
    try {
      const { data } = await api.post('/blockchain/create-passport');
      setPassport(data.passport);
      setVerificationStatus('verified');
    } catch (error) {
      console.error('Failed to create passport:', error);
    }
  };

  const verifyCredential = async (credentialId) => {
    try {
      const { data } = await api.post(`/blockchain/verify/${credentialId}`);
      return data.verified;
    } catch (error) {
      console.error('Failed to verify credential:', error);
      return false;
    }
  };

  const generateQRCode = async (item) => {
    try {
      const { data } = await api.post('/blockchain/generate-qr', {
        itemId: item.id,
        type: item.type
      });
      setQrCode(data.qrCode);
      setSelectedItem(item);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!passport) {
    return (
      <div className="main-content">
        <div style={{ textAlign: 'center', padding: 'var(--space-8)' }}>
          <Shield size={64} color="var(--primary)" style={{ margin: '0 auto var(--space-4)' }} />
          <h1>Career Blockchain Verification</h1>
          <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-6)' }}>
            Create your tamper-proof digital career passport on blockchain
          </p>
          <button className="btn primary large" onClick={createPassport}>
            Create Career Passport
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Shield size={32} color="var(--primary)" />
        <div>
          <h1>Blockchain Career Verification</h1>
          <p style={{ color: 'var(--text-soft)' }}>Tamper-proof digital identity and credentials</p>
        </div>
      </div>

      {/* Career Passport */}
      <div className="card" style={{ 
        marginBottom: 'var(--space-6)', 
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-end) 100%)', 
        color: 'white' 
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', alignItems: 'center', gap: 'var(--space-4)' }}>
          <Shield size={48} />
          <div>
            <h3 style={{ color: 'white', marginBottom: 'var(--space-1)' }}>Career Passport</h3>
            <p style={{ opacity: 0.9, marginBottom: 'var(--space-2)' }}>
              Blockchain ID: {passport.blockchainId}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <CheckCircle size={16} />
              <span>Verified on {passport.network} Network</span>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>Trust Score</div>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{passport.trustScore}%</div>
          </div>
        </div>
        
        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
          <button 
            className="btn secondary small"
            onClick={() => copyToClipboard(passport.blockchainId)}
          >
            <Copy size={14} />
            Copy ID
          </button>
          <button 
            className="btn secondary small"
            onClick={() => generateQRCode(passport)}
          >
            <QrCode size={14} />
            QR Code
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Verified Certificates */}
        <div>
          <h3>Verified Certificates</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {certificates.map(cert => (
              <div key={cert.id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <FileText size={20} color="var(--primary)" />
                    <div>
                      <h5>{cert.title}</h5>
                      <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                        {cert.issuer}
                      </div>
                    </div>
                  </div>
                  <div style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    borderRadius: 'var(--radius)', 
                    background: cert.verified ? 'var(--success-bg)' : 'var(--warning-bg)',
                    color: cert.verified ? 'var(--success)' : 'var(--warning)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600
                  }}>
                    {cert.verified ? 'Verified' : 'Pending'}
                  </div>
                </div>
                
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                  Issued: {cert.issueDate} • Hash: {cert.hash.substring(0, 16)}...
                </div>
                
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button 
                    className="btn ghost small"
                    onClick={() => generateQRCode(cert)}
                  >
                    <QrCode size={14} />
                    Share
                  </button>
                  <button className="btn ghost small">
                    <ExternalLink size={14} />
                    View on Chain
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NFT Achievements */}
        <div>
          <h3>NFT Achievement Badges</h3>
          <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
            {achievements.map(achievement => (
              <div key={achievement.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: achievement.color || 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}>
                    <Award size={24} />
                  </div>
                  <div>
                    <h5>{achievement.title}</h5>
                    <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                      {achievement.description}
                    </div>
                  </div>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    Token ID: #{achievement.tokenId}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                    <button 
                      className="btn ghost small"
                      onClick={() => generateQRCode(achievement)}
                    >
                      <QrCode size={14} />
                      Share
                    </button>
                    <button className="btn ghost small">
                      <ExternalLink size={14} />
                      OpenSea
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedItem && qrCode && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          background: 'rgba(0,0,0,0.8)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <h4>Share {selectedItem.title}</h4>
            <div style={{ margin: 'var(--space-4) 0' }}>
              <img 
                src={qrCode} 
                alt="QR Code" 
                style={{ width: '200px', height: '200px', margin: '0 auto' }}
              />
            </div>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
              Scan this QR code to verify the authenticity of this credential on the blockchain.
            </p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', justifyContent: 'center' }}>
              <button 
                className="btn secondary"
                onClick={() => {setSelectedItem(null); setQrCode('');}}
              >
                Close
              </button>
              <button 
                className="btn primary"
                onClick={() => copyToClipboard(selectedItem.verificationUrl)}
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}