import React, { useState } from 'react';
import { Search, Link, Building, DollarSign, TrendingUp, Download, Loader2 } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function WebScraper() {
  const [activeTab, setActiveTab] = useState('job-scraper');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { showToast } = useToast();

  const [jobUrl, setJobUrl] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const normalizeUrl = (inputUrl) => {
    if (!inputUrl.trim()) return '';
    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const scrapeJobDetails = async () => {
    if (!jobUrl.trim()) {
      showToast('Please enter a job URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(jobUrl);
      const { data } = await api.post('/scraping/job-details', { jobUrl: normalizedUrl });
      setResults(data.jobDetails);
      showToast('Job details scraped successfully!', 'success');
    } catch {
      showToast('Failed to scrape job details', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const scrapeCompanyInfo = async () => {
    if (!companyName.trim()) {
      showToast('Please enter a company name', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/scraping/company-info', { companyName });
      setResults(data.companyInfo);
      showToast('Company information scraped successfully!', 'success');
    } catch {
      showToast('Failed to scrape company information', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const scrapeSalaryData = async () => {
    if (!jobTitle.trim()) {
      showToast('Please enter a job title', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/scraping/salary-data', { jobTitle, location });
      setResults(data.salaryData);
      showToast('Salary data scraped successfully!', 'success');
    } catch {
      showToast('Failed to scrape salary data', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const getTrendingSkills = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/scraping/trending-skills');
      setResults(data.trendingSkills);
      showToast('Trending skills fetched successfully!', 'success');
    } catch {
      showToast('Failed to fetch trending skills', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const autoFillFromUrl = async () => {
    if (!jobUrl.trim()) {
      showToast('Please enter a job URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(jobUrl);
      const { data } = await api.post('/scraping/auto-fill', { jobUrl: normalizedUrl });
      setResults(data);
      showToast('Auto-fill data generated!', 'success');
    } catch {
      showToast('Failed to generate auto-fill data', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const renderResults = () => {
    if (!results) return null;

    // Job Details Results
    if (activeTab === 'job-scraper' && (results.title || results.company)) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                {results.title || 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Job Title</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                {results.company || 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Company</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                {results.location || 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Location</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--success)', marginBottom: 'var(--space-2)' }}>
                {results.salary || 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Salary</div>
            </div>
          </div>
          {results.description && (
            <div className="card">
              <h4>Description</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5' }}>
                {results.description.substring(0, 300)}...
              </p>
            </div>
          )}
        </div>
      );
    }

    // Company Info Results
    if (activeTab === 'company-info' && results.name) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
              {results.name}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Company Name</div>
          </div>
          {results.description && (
            <div className="card">
              <h4>Description</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5' }}>{results.description}</p>
            </div>
          )}
        </div>
      );
    }

    // Salary Data Results
    if (activeTab === 'salary-data' && results.jobTitle) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
                {results.jobTitle}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Job Title</div>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ fontSize: 'var(--text-lg)', fontWeight: 'bold', color: 'var(--success)', marginBottom: 'var(--space-2)' }}>
                {results.averageSalary ? `$${results.averageSalary.toLocaleString()}` : 'N/A'}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Average Salary</div>
            </div>
          </div>
          {results.sources && results.sources.length > 0 && (
            <div className="card">
              <h4>Sources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {results.sources.map((source, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '500' }}>{source.source}</span>
                    <span style={{ color: 'var(--success)' }}>{source.salary}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Trending Skills Results
    if (activeTab === 'trending-skills' && results.skills) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--primary)', marginBottom: 'var(--space-2)' }}>
              {results.skills.length}
            </div>
            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Trending Skills Found</div>
          </div>
          <div className="card">
            <h4>Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
              {results.skills.map((skill, idx) => (
                <span key={idx} style={{
                  padding: 'var(--space-1) var(--space-2)',
                  background: 'var(--primary-bg)',
                  color: 'var(--primary)',
                  borderRadius: 'var(--radius)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500'
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Generic stat cards for any other results
    const renderStatCards = (data) => {
      const entries = Object.entries(data).filter(([, value]) => 
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      );
      
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {entries.map(([key, value], idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ 
                  fontSize: 'var(--text-lg)', 
                  fontWeight: 'bold', 
                  color: typeof value === 'boolean' ? (value ? 'var(--success)' : 'var(--error)') : 'var(--primary)',
                  marginBottom: 'var(--space-2)'
                }}>
                  {typeof value === 'boolean' ? (value ? '✓' : '✗') : value}
                </div>
                <div style={{ 
                  fontSize: 'var(--text-sm)', 
                  color: 'var(--text-soft)', 
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>
          
          <details style={{ marginTop: 'var(--space-4)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: '500', marginBottom: 'var(--space-2)' }}>
              View Raw Data
            </summary>
            <pre style={{ 
              background: 'var(--muted)', 
              padding: 'var(--space-3)', 
              borderRadius: 'var(--radius)', 
              fontSize: 'var(--text-sm)',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </details>
        </div>
      );
    };

    return renderStatCards(results);
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>Web Scraping Tools</h1>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
          Extract job details, company information, and market data from the web to accelerate your career growth
        </p>
        
        <div className="card" style={{ background: 'var(--primary-bg)', border: '1px solid var(--primary)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--primary)', marginBottom: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xl)', fontWeight: '600' }}>Career Development Advantages</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Job Analysis & Preparation</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Extract detailed job requirements, skills, and qualifications to tailor your resume and prepare strategically for interviews</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Company Intelligence</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Gather comprehensive company insights and culture information to make informed career decisions and excel in interviews</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Salary Negotiation</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Research accurate market rates and compensation data to negotiate better salaries and plan your career progression</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--primary)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Skills Development</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Stay ahead by identifying trending technologies and in-demand skills that employers value most</p>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', padding: 'var(--space-3)' }}>
          <h4 style={{ color: 'var(--warning)', marginBottom: 'var(--space-2)' }}>⚠️ Service Limitations</h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: '1.5' }}>
            Web scraping tools may have limited functionality due to:
            • Anti-bot protection on target websites
            • Rate limiting and CORS restrictions
            • Dynamic content requiring JavaScript execution
            • Website structure changes affecting selectors
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {[
          { id: 'job-scraper', label: 'Job Scraper', icon: Search },
          { id: 'company-info', label: 'Company Info', icon: Building },
          { id: 'salary-data', label: 'Salary Data', icon: DollarSign },
          { id: 'trending-skills', label: 'Trending Skills', icon: TrendingUp }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-soft)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Input Panel */}
        <div className="card">
          <h3>Input</h3>
          
          {activeTab === 'job-scraper' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Job URL
                </label>
                <input
                  type="url"
                  placeholder="https://company.com/jobs/position"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button 
                  className="btn primary" 
                  onClick={scrapeJobDetails}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  {loading ? <Loader2 size={16} className="spinner" /> : <Search size={16} />}
                  Scrape Job
                </button>
                <button 
                  className="btn ghost" 
                  onClick={autoFillFromUrl}
                  disabled={loading}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
                >
                  <Download size={16} />
                  Auto-Fill
                </button>
              </div>
            </div>
          )}

          {activeTab === 'company-info' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Company Name
                </label>
                <input
                  type="text"
                  placeholder="Google, Microsoft, Apple..."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn primary" 
                onClick={scrapeCompanyInfo}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <Building size={16} />}
                Get Company Info
              </button>
            </div>
          )}

          {activeTab === 'salary-data' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Job Title
                </label>
                <input
                  type="text"
                  placeholder="Software Engineer, Data Scientist..."
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Location (Optional)
                </label>
                <input
                  type="text"
                  placeholder="San Francisco, New York..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn primary" 
                onClick={scrapeSalaryData}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <DollarSign size={16} />}
                Get Salary Data
              </button>
            </div>
          )}

          {activeTab === 'trending-skills' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>
                Discover the most in-demand skills and technologies from GitHub trending repositories.
              </p>
              <button 
                className="btn primary" 
                onClick={getTrendingSkills}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <TrendingUp size={16} />}
                Get Trending Skills
              </button>
            </div>
          )}
        </div>

        {/* Results Panel */}
        <div className="card">
          <h3>Results</h3>
          
          {loading && (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
              <Loader2 size={32} className="spinner" style={{ marginBottom: 'var(--space-2)' }} />
              <p style={{ color: 'var(--text-soft)' }}>Scraping data...</p>
            </div>
          )}

          {!loading && !results && (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-soft)' }}>
              <Search size={48} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p>No data scraped yet. Use the tools on the left to get started.</p>
            </div>
          )}

          {!loading && results && (
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {renderResults()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}