import React, { useState } from 'react';
import { Search, BarChart3, Users, Link, Settings, Target, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

export default function SEOTools() {
  const [activeTab, setActiveTab] = useState('page-analyzer');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { showToast } = useToast();

  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [domain, setDomain] = useState('');
  const [content, setContent] = useState('');
  const [competitors, setCompetitors] = useState('');

  const normalizeUrl = (inputUrl) => {
    if (!inputUrl.trim()) return '';
    const trimmed = inputUrl.trim();
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      return `https://${trimmed}`;
    }
    return trimmed;
  };

  const analyzePage = async () => {
    if (!url.trim()) {
      showToast('Please enter a URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(url);
      const { data } = await api.post('/seo/analyze-page', { url: normalizedUrl });
      setResults(data.analysis);
      showToast('Page analysis completed!', 'success');
    } catch (error) {
      showToast('Failed to analyze page', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const keywordResearch = async () => {
    if (!keyword.trim()) {
      showToast('Please enter a keyword', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/seo/keyword-research', { seed: keyword });
      setResults(data.research);
      showToast('Keyword research completed!', 'success');
    } catch (error) {
      showToast('Failed to perform keyword research', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const analyzeCompetitors = async () => {
    if (!domain.trim()) {
      showToast('Please enter a domain', 'error');
      return;
    }

    try {
      setLoading(true);
      const competitorList = competitors.split(',').map(c => c.trim()).filter(c => c);
      const { data } = await api.post('/seo/competitor-analysis', { domain, competitors: competitorList });
      setResults(data.analysis);
      showToast('Competitor analysis completed!', 'success');
    } catch (error) {
      showToast('Failed to analyze competitors', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const technicalAudit = async () => {
    if (!url.trim()) {
      showToast('Please enter a URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(url);
      const { data } = await api.post('/seo/technical-audit', { url: normalizedUrl });
      setResults(data.audit);
      showToast('Technical audit completed!', 'success');
    } catch (error) {
      showToast('Failed to perform technical audit', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const optimizeContent = async () => {
    if (!content.trim() || !keyword.trim()) {
      showToast('Please enter content and target keyword', 'error');
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.post('/seo/optimize-content', { content, targetKeyword: keyword });
      setResults(data.optimization);
      showToast('Content optimization completed!', 'success');
    } catch (error) {
      showToast('Failed to optimize content', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const generateDashboard = async () => {
    if (!url.trim()) {
      showToast('Please enter a URL', 'error');
      return;
    }

    try {
      setLoading(true);
      const normalizedUrl = normalizeUrl(url);
      const { data } = await api.post('/seo/dashboard', { url: normalizedUrl, domain });
      setResults(data.dashboard);
      showToast('SEO dashboard generated!', 'success');
    } catch (error) {
      showToast('Failed to generate dashboard', 'error');
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'var(--success)';
    if (score >= 60) return 'var(--warning)';
    return 'var(--error)';
  };

  const renderResults = () => {
    if (!results) return null;

    if (activeTab === 'page-analyzer' && results.title) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card">
            <h4>Page Title</h4>
            <p>{results.title}</p>
            <small style={{ color: results.titleLength >= 30 && results.titleLength <= 60 ? 'var(--success)' : 'var(--warning)' }}>
              Length: {results.titleLength} characters
            </small>
          </div>
          
          <div className="card">
            <h4>Meta Description</h4>
            <p>{results.metaDescription || 'No meta description found'}</p>
            <small style={{ color: results.metaDescriptionLength >= 120 && results.metaDescriptionLength <= 160 ? 'var(--success)' : 'var(--warning)' }}>
              Length: {results.metaDescriptionLength} characters
            </small>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)' }}>
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: results.h1Count === 1 ? 'var(--success)' : 'var(--warning)' }}>
                {results.h1Count}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>H1 Tags</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{results.wordCount}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Words</div>
            </div>
            
            <div className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: results.imagesWithoutAlt === 0 ? 'var(--success)' : 'var(--warning)' }}>
                {results.imagesWithoutAlt}
              </div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Missing Alt Tags</div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'keyword-research' && results.keywords) {
      return (
        <div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <h4>Keyword Research for "{results.seed}"</h4>
            <p style={{ color: 'var(--text-soft)' }}>
              Found {results.totalKeywords} keywords with average volume of {results.averageVolume.toLocaleString()}
            </p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {results.keywords.map((kw, idx) => (
              <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: '500' }}>{kw.keyword}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    Volume: {kw.volume.toLocaleString()} • Difficulty: {kw.difficulty}% • CPC: ${kw.cpc}
                  </div>
                </div>
                <div style={{ 
                  padding: 'var(--space-1) var(--space-2)', 
                  borderRadius: 'var(--radius)', 
                  background: kw.difficulty < 30 ? 'var(--success-bg)' : kw.difficulty < 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                  color: kw.difficulty < 30 ? 'var(--success)' : kw.difficulty < 60 ? 'var(--warning)' : 'var(--error)',
                  fontSize: 'var(--text-sm)',
                  fontWeight: '500'
                }}>
                  {kw.difficulty < 30 ? 'Easy' : kw.difficulty < 60 ? 'Medium' : 'Hard'}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (activeTab === 'technical-audit' && results.url) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
            {[
              { label: 'HTTPS', value: results.https, icon: results.https ? CheckCircle : AlertCircle },
              { label: 'Mobile Viewport', value: results.mobileViewport, icon: results.mobileViewport ? CheckCircle : AlertCircle },
              { label: 'Robots.txt', value: results.hasRobotsTxt, icon: results.hasRobotsTxt ? CheckCircle : AlertCircle },
              { label: 'Sitemap', value: results.hasSitemap, icon: results.hasSitemap ? CheckCircle : AlertCircle },
              { label: 'Structured Data', value: results.hasStructuredData, icon: results.hasStructuredData ? CheckCircle : AlertCircle },
              { label: 'Google Analytics', value: results.hasGoogleAnalytics, icon: results.hasGoogleAnalytics ? CheckCircle : AlertCircle }
            ].map((item, idx) => (
              <div key={idx} className="card" style={{ textAlign: 'center' }}>
                <item.icon size={24} color={item.value ? 'var(--success)' : 'var(--error)'} style={{ marginBottom: 'var(--space-2)' }} />
                <div style={{ fontSize: 'var(--text-sm)', fontWeight: '500' }}>{item.label}</div>
                <div style={{ fontSize: 'var(--text-xs)', color: item.value ? 'var(--success)' : 'var(--error)' }}>
                  {item.value ? 'Passed' : 'Failed'}
                </div>
              </div>
            ))}
          </div>

          {results.openGraph && (
            <div className="card">
              <h4>Open Graph</h4>
              <div style={{ display: 'grid', gap: 'var(--space-2)' }}>
                <div><strong>Title:</strong> {results.openGraph.title || 'Not set'}</div>
                <div><strong>Description:</strong> {results.openGraph.description || 'Not set'}</div>
                <div><strong>Image:</strong> {results.openGraph.image || 'Not set'}</div>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (activeTab === 'content-optimizer' && results.wordCount) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div className="card">
            <h4>Content Analysis</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{results.wordCount}</div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Words</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: getScoreColor(results.keywordDensity) }}>
                  {results.keywordDensity.toFixed(2)}%
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Keyword Density</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: getScoreColor(results.score) }}>
                  {results.score}
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>SEO Score</div>
              </div>
            </div>
          </div>

          {results.suggestions.length > 0 && (
            <div className="card">
              <h4>Optimization Suggestions</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {results.suggestions.map((suggestion, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <AlertCircle size={16} color="var(--warning)" />
                    <span style={{ fontSize: 'var(--text-sm)' }}>{suggestion}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

    // Professional stat cards for any JSON response
    const renderStatCards = (data) => {
      const entries = Object.entries(data).filter(([key, value]) => 
        typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean'
      );
      
      return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          {entries.map(([key, value], idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
              <div style={{ 
                fontSize: 'var(--text-2xl)', 
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
      );
    };

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {renderStatCards(results)}
        
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
            {JSON.stringify(results, null, 2)}
          </pre>
        </details>
      </div>
    );
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>SEO Tools</h1>
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-4)' }}>
          Analyze and optimize your website's search engine performance to boost your career visibility
        </p>
        
        <div className="card" style={{ background: 'var(--success-bg)', border: '1px solid var(--success)', padding: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
          <h3 style={{ color: 'var(--success)', marginBottom: 'var(--space-4)', textAlign: 'center', fontSize: 'var(--text-xl)', fontWeight: '600' }}>Professional Growth Benefits</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-4)' }}>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Digital Portfolio Enhancement</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Optimize your personal website and portfolio to rank higher in recruiter searches and effectively showcase your professional skills</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Strategic Keyword Research</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Discover search terms recruiters use to optimize your LinkedIn profile, resume, and online presence for maximum visibility</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Competitive Intelligence</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Analyze successful professionals' websites to learn proven SEO strategies and content approaches for career advancement</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Technical Skill Development</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Master valuable SEO and digital marketing skills that are increasingly sought after by employers across industries</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Content Strategy Mastery</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Learn to create SEO-optimized content for professional blogs, articles, and profiles that attract opportunities</p>
            </div>
            <div style={{ padding: 'var(--space-3)', background: 'var(--background)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              <h4 style={{ color: 'var(--success)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-lg)', fontWeight: '600' }}>Performance Analytics</h4>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.5', color: 'var(--text)' }}>Monitor and measure your online presence to track the effectiveness of your digital career strategy</p>
            </div>
          </div>
        </div>
        
        <div className="card" style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning)', padding: 'var(--space-3)' }}>
          <h4 style={{ color: 'var(--warning)', marginBottom: 'var(--space-2)' }}>⚠️ Service Limitations</h4>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text)', lineHeight: '1.5' }}>
            SEO analysis tools may have limited functionality due to:
            • CORS restrictions preventing direct website access
            • Anti-bot measures on target websites
            • Rate limiting from external APIs
            • Dynamic content requiring JavaScript execution
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {[
          { id: 'page-analyzer', label: 'Page Analyzer', icon: Search },
          { id: 'keyword-research', label: 'Keywords', icon: Target },
          { id: 'competitor-analysis', label: 'Competitors', icon: Users },
          { id: 'technical-audit', label: 'Technical Audit', icon: Settings },
          { id: 'content-optimizer', label: 'Content Optimizer', icon: BarChart3 },
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 }
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
              gap: 'var(--space-2)',
              fontSize: 'var(--text-sm)'
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
          
          {(activeTab === 'page-analyzer' || activeTab === 'technical-audit' || activeTab === 'dashboard') && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Website URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              {activeTab === 'dashboard' && (
                <div>
                  <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                    Domain (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="example.com"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              )}
              <button 
                className="btn primary" 
                onClick={activeTab === 'page-analyzer' ? analyzePage : activeTab === 'technical-audit' ? technicalAudit : generateDashboard}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <Search size={16} />}
                {activeTab === 'page-analyzer' ? 'Analyze Page' : activeTab === 'technical-audit' ? 'Run Audit' : 'Generate Dashboard'}
              </button>
            </div>
          )}

          {activeTab === 'keyword-research' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Seed Keyword
                </label>
                <input
                  type="text"
                  placeholder="software engineer, marketing..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn primary" 
                onClick={keywordResearch}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <Target size={16} />}
                Research Keywords
              </button>
            </div>
          )}

          {activeTab === 'competitor-analysis' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Your Domain
                </label>
                <input
                  type="text"
                  placeholder="yoursite.com"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Competitors (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="competitor1.com, competitor2.com"
                  value={competitors}
                  onChange={(e) => setCompetitors(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn primary" 
                onClick={analyzeCompetitors}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <Users size={16} />}
                Analyze Competitors
              </button>
            </div>
          )}

          {activeTab === 'content-optimizer' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Target Keyword
                </label>
                <input
                  type="text"
                  placeholder="career advice, job search..."
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)', fontWeight: '500' }}>
                  Content
                </label>
                <textarea
                  placeholder="Paste your content here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  style={{ width: '100%' }}
                />
              </div>
              <button 
                className="btn primary" 
                onClick={optimizeContent}
                disabled={loading}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
              >
                {loading ? <Loader2 size={16} className="spinner" /> : <BarChart3 size={16} />}
                Optimize Content
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
              <p style={{ color: 'var(--text-soft)' }}>Analyzing...</p>
            </div>
          )}

          {!loading && !results && (
            <div style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-soft)' }}>
              <BarChart3 size={48} style={{ marginBottom: 'var(--space-3)', opacity: 0.5 }} />
              <p>No analysis performed yet. Use the tools on the left to get started.</p>
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