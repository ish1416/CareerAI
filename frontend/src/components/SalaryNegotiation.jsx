import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, Target, Calculator } from 'lucide-react';
import api from '../utils/api.js';

export default function SalaryNegotiation() {
  const [salaryData, setSalaryData] = useState(null);
  const [negotiationTips, setNegotiationTips] = useState([]);
  const [currentOffer, setCurrentOffer] = useState('');

  useEffect(() => {
    loadSalaryData();
    loadNegotiationTips();
  }, []);

  const loadSalaryData = async () => {
    try {
      const { data } = await api.get('/salary-negotiation/data');
      setSalaryData(data);
    } catch (error) {
      console.error('Failed to load salary data:', error);
    }
  };

  const loadNegotiationTips = async () => {
    try {
      const { data } = await api.get('/salary-negotiation/tips');
      setNegotiationTips(data.tips);
    } catch (error) {
      console.error('Failed to load tips:', error);
    }
  };

  const analyzeSalary = async () => {
    try {
      const { data } = await api.post('/salary-negotiation/analyze', { 
        currentOffer: parseInt(currentOffer) 
      });
      setSalaryData(data);
    } catch (error) {
      console.error('Failed to analyze salary:', error);
    }
  };

  if (!salaryData) return <div>Loading...</div>;

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <DollarSign size={32} color="var(--primary)" />
        <div>
          <h1>Salary Negotiation Assistant</h1>
          <p style={{ color: 'var(--text-soft)' }}>Get market insights and negotiation strategies</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        <div>
          <h3>Market Analysis</h3>
          <div className="card">
            <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Market Average</div>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--primary)' }}>
                  ${salaryData.marketAverage.toLocaleString()}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Your Target Range</div>
                <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold' }}>
                  ${salaryData.targetMin.toLocaleString()} - ${salaryData.targetMax.toLocaleString()}
                </div>
              </div>
              <div>
                <label>Current Offer</label>
                <input
                  type="number"
                  value={currentOffer}
                  onChange={(e) => setCurrentOffer(e.target.value)}
                  placeholder="Enter offer amount"
                />
                <button className="btn primary small" onClick={analyzeSalary} style={{ marginTop: 'var(--space-2)' }}>
                  <Calculator size={14} />
                  Analyze Offer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3>Negotiation Tips</h3>
          {negotiationTips.map((tip, idx) => (
            <div key={idx} className="card" style={{ marginBottom: 'var(--space-3)' }}>
              <h5>{tip.title}</h5>
              <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}