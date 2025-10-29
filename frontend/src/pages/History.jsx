import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';

export default function History() {
  const [resumes, setResumes] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();
  const location = useLocation();
  const [filters, setFilters] = useState({ days: 0, minATS: 0 });

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/resume/list');
        setResumes(data?.resumes || []);
        // Auto-expand if resumeId present
        const params = new URLSearchParams(location.search);
        const idParam = params.get('resumeId');
        const id = idParam ? parseInt(idParam, 10) : NaN;
        if (Number.isFinite(id)) {
          expandHistory(id);
        }
      } catch (e) {
        console.error(e);
        setError(e?.response?.data?.error || e.message || 'Failed to load resumes');
      } finally {
        setLoading(false);
      }
    })();
  }, [location.search]);

  const fmtDate = (d) => (d ? new Date(d).toLocaleString() : '—');

  const expandHistory = async (resumeId) => {
    setExpanded((prev) => ({ ...prev, [resumeId]: { loading: true, reports: prev[resumeId]?.reports || [], openReports: prev[resumeId]?.openReports || {} } }));
    try {
      const { data } = await api.get(`/resume/${resumeId}/history`);
      setExpanded((prev) => ({ ...prev, [resumeId]: { loading: false, reports: data?.reports || [], openReports: prev[resumeId]?.openReports || {} } }));
    } catch (e) {
      console.error(e);
      showToast(e?.response?.data?.error || e.message || 'Failed to load history', 'error');
      setExpanded((prev) => ({ ...prev, [resumeId]: { loading: false, reports: [] } }));
    }
  };

  const toggleReportDetails = (resumeId, reportId) => {
    setExpanded((prev) => {
      const block = prev[resumeId] || { loading: false, reports: [], openReports: {} };
      return {
        ...prev,
        [resumeId]: {
          ...block,
          openReports: { ...(block.openReports || {}), [reportId]: !block.openReports?.[reportId] },
        },
      };
    });
  };

  const exportCSV = (resumeId) => {
    const block = expanded[resumeId];
    if (!block || !Array.isArray(block.reports) || block.reports.length === 0) return;
    const now = new Date();
    const threshold = filters.days > 0 ? new Date(now.getTime() - filters.days * 24 * 60 * 60 * 1000) : null;
    const filtered = block.reports.filter((rep) => {
      const passATS = typeof rep.atsScore === 'number' ? rep.atsScore >= filters.minATS : true;
      const passDate = threshold ? new Date(rep.date) >= threshold : true;
      return passATS && passDate;
    });
    const rows = [
      ['id', 'atsScore', 'date', 'suggestionsCount', 'missingKeywordsCount', 'suggestions', 'missingKeywords'],
      ...filtered.map((rep) => [
        rep.id,
        rep.atsScore,
        new Date(rep.date).toISOString(),
        Array.isArray(rep.suggestions) ? rep.suggestions.length : 0,
        Array.isArray(rep.missingKeywords) ? rep.missingKeywords.length : 0,
        Array.isArray(rep.suggestions) ? rep.suggestions.map((s) => (typeof s === 'string' ? s : JSON.stringify(s))).join('|') : '',
        Array.isArray(rep.missingKeywords) ? rep.missingKeywords.join('|') : '',
      ]),
    ];
    const csv = rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resume_${resumeId}_analysis_history.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="page history">
        <div className="page-header">
          <h1>Analysis History</h1>
          <p className="muted">Browse reports, filter by date and ATS, and export CSV.</p>
        </div>
        <div className="section-intro">
          <h3 className="section-title">What This Section Does</h3>
          <p className="muted">Review and export your resume analysis reports over time.</p>
          <ol className="step-list">
            <li>Use filters to narrow reports by date and ATS.</li>
            <li>Click “View History” to load a resume’s analyses.</li>
            <li>Export CSV for offline tracking and sharing.</li>
          </ol>
        </div>
        <div className="card shine" style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div>
              <label className="muted">Date range</label>
              <select value={filters.days} onChange={(e) => setFilters((f) => ({ ...f, days: parseInt(e.target.value, 10) }))}>
                <option value={0}>All time</option>
                <option value={7}>Last 7 days</option>
                <option value={30}>Last 30 days</option>
                <option value={90}>Last 90 days</option>
              </select>
            </div>
            <div>
              <label className="muted">Min ATS</label>
              <input type="number" min={0} max={100} value={filters.minATS} onChange={(e) => setFilters((f) => ({ ...f, minATS: Math.max(0, Math.min(100, parseInt(e.target.value || '0', 10))) }))} style={{ width: 100 }} />
            </div>
          </div>
        </div>
      {loading ? (
        <div className="card">Loading…</div>
      ) : error ? (
        <div className="card">{error}</div>
      ) : resumes.length === 0 ? (
        <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>No resumes yet. Build or upload one to get started.</div>
          <Link to="/builder" className="btn small">Open Builder</Link>
        </div>
      ) : (
        <div className="grid">
          {resumes.map((r) => {
            const last = Array.isArray(r.analysisReport) ? r.analysisReport[0] : null;
            const exp = expanded[r.id] || { loading: false, reports: [], openReports: {} };
            const now = new Date();
            const threshold = filters.days > 0 ? new Date(now.getTime() - filters.days * 24 * 60 * 60 * 1000) : null;
            const filtered = exp.reports.filter((rep) => {
              const passATS = typeof rep.atsScore === 'number' ? rep.atsScore >= filters.minATS : true;
              const passDate = threshold ? new Date(rep.date) >= threshold : true;
              return passATS && passDate;
            });
            return (
              <div className="card" key={r.id}>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
                  <h4 style={{ margin: 0 }}>{r.title || 'Untitled Resume'}</h4>
                  <small className="muted">Updated {fmtDate(r.updatedAt)}</small>
                </div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {last ? (
                    <>
                      <span className="badge" style={{
                        background: last.atsScore >= 80 ? 'var(--success-bg)' : 
                                   last.atsScore >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                        color: last.atsScore >= 80 ? 'var(--success)' : 
                               last.atsScore >= 60 ? 'var(--warning)' : 'var(--error)',
                        marginRight: 'var(--space-2)'
                      }}>
                        ATS {last.atsScore}%
                      </span>
                      Analyzed {fmtDate(last.date)}
                    </>
                  ) : (
                    <>No analysis yet - <Link to={`/analysis?resumeId=${r.id}`} style={{ color: 'var(--primary)' }}>Analyze now</Link></>
                  )}
                </div>
                <div className="card-actions">
                    <button className="btn small" onClick={() => expandHistory(r.id)} disabled={exp.loading}>
                      {exp.loading ? 'Loading…' : 'View History'}
                    </button>
                    <button className="btn small ghost" onClick={() => exportCSV(r.id)} disabled={(filtered.length === 0)}>
                      Export CSV
                    </button>
                    <Link to={`/analysis?resumeId=${r.id}`} className="btn small ghost">Analyze</Link>
                    <Link to={`/builder?resumeId=${r.id}`} className="btn small ghost">Open Builder</Link>
                    <Link to={`/trends?resumeId=${r.id}`} className="btn small ghost">View Trends</Link>
                  </div>
                {exp.reports.length > 0 && (
                  <div style={{ marginTop: 12 }}>
                    <div className="muted" style={{ marginBottom: 8, fontWeight: 600 }}>Analysis History ({filtered.length} reports)</div>
                    <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
                      {filtered.map((rep) => (
                        <div key={rep.id} className="card" style={{ padding: 'var(--space-3)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                            <div>
                              <span className="badge" style={{
                                background: rep.atsScore >= 80 ? 'var(--success-bg)' : 
                                           rep.atsScore >= 60 ? 'var(--warning-bg)' : 'var(--error-bg)',
                                color: rep.atsScore >= 80 ? 'var(--success)' : 
                                       rep.atsScore >= 60 ? 'var(--warning)' : 'var(--error)',
                                marginRight: 'var(--space-2)'
                              }}>
                                ATS {rep.atsScore}%
                              </span>
                              <span className="muted">{fmtDate(rep.date)}</span>
                            </div>
                            <button className="btn small ghost" onClick={() => toggleReportDetails(r.id, rep.id)}>
                              {exp.openReports?.[rep.id] ? 'Hide Details' : 'View Details'}
                            </button>
                          </div>
                          
                          <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                            <span>{Array.isArray(rep.suggestions) ? `${rep.suggestions.length} suggestions` : '0 suggestions'}</span>
                            <span>{Array.isArray(rep.missingKeywords) ? `${rep.missingKeywords.length} missing keywords` : '0 keywords'}</span>
                          </div>
                          
                          {exp.openReports?.[rep.id] && (
                            <div style={{ marginTop: 'var(--space-3)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                              {Array.isArray(rep.suggestions) && rep.suggestions.length > 0 && (
                                <div style={{ marginBottom: 'var(--space-3)' }}>
                                  <h5 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Suggestions</h5>
                                  <ul style={{ margin: 0, paddingLeft: 'var(--space-4)' }}>
                                    {rep.suggestions.slice(0, 5).map((s, i) => (
                                      <li key={i} style={{ marginBottom: 'var(--space-1)', fontSize: 'var(--text-sm)' }}>
                                        {typeof s === 'string' ? s : JSON.stringify(s)}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {Array.isArray(rep.missingKeywords) && rep.missingKeywords.length > 0 && (
                                <div>
                                  <h5 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-sm)', fontWeight: 600 }}>Missing Keywords</h5>
                                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                                    {rep.missingKeywords.slice(0, 10).map((kw, i) => (
                                      <span key={i} className="badge outline" style={{ fontSize: 'var(--text-xs)' }}>
                                        {kw}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}