import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

const COLORS = ['#2563eb', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6', '#06b6d4', '#84cc16', '#f472b6'];

const MultiSparkline = React.forwardRef(({ seriesList, width = 360, height = 72, strokeWidth = 2, timestamps = [] }, ref) => {
  const [hover, setHover] = useState(null);
  const allValues = seriesList.flatMap(s => s.values).filter(v => typeof v === 'number' && !Number.isNaN(v));
  const pad = 4;
  const usableW = width - pad * 2;
  const usableH = height - pad * 2;
  const n = seriesList[0]?.values?.length || 0;
  const dx = n > 1 ? usableW / (n - 1) : 0;
  if (!allValues.length) return <div style={{ width, height }} className="sparkline-empty" />;
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;

  const makePath = (values) => {
    const points = values.map((v, i) => {
      const x = pad + i * dx;
      const yNorm = (v - min) / range;
      const y = pad + usableH - yNorm * usableH;
      return [x, y];
    });
    const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ');
    const first = points[0];
    const last = points[points.length - 1];
    return { d, first, last, points };
  };

  function handleMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    let idx = Math.round((mx - pad) / dx);
    idx = Math.max(0, Math.min(n - 1, idx));
    const x = pad + idx * dx;
    setHover({ idx, x });
  }
  function handleMouseLeave() { setHover(null); }

  const tooltipData = hover ? {
    date: timestamps[hover.idx] ? new Date(timestamps[hover.idx]).toLocaleDateString() : '',
    series: seriesList.map((s) => ({ label: s.label || s.key, value: s.values[hover.idx] }))
  } : null;

  return (
    <div style={{ position: 'relative', width, height }}>
      <svg ref={ref} width={width} height={height} className="sparkline" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
        <line x1={pad} y1={height - pad} x2={width - pad} y2={height - pad} stroke="var(--border)" strokeWidth="1" />
        {hover && (
          <line x1={hover.x} y1={pad} x2={hover.x} y2={height - pad} stroke="var(--border)" strokeWidth="1" />
        )}
        {seriesList.map((s, idx) => {
          const { d, first, last } = makePath(s.values);
          return (
            <g key={s.key || idx}>
              <path d={d} fill="none" stroke={s.color} strokeWidth={strokeWidth} strokeLinecap="round" />
              <circle cx={first[0]} cy={first[1]} r="2.2" fill={s.color} />
              <circle cx={last[0]} cy={last[1]} r="3.2" fill={s.color} />
            </g>
          );
        })}
      </svg>
      {tooltipData && (
        <div style={{ position: 'absolute', left: Math.min(Math.max(hover.x + 8, 8), width - 140), top: 8, background: 'var(--panel)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 8px', boxShadow: '0 2px 8px var(--shadow)', pointerEvents: 'none' }}>
          <div style={{ fontWeight: 600, marginBottom: 4 }}>{tooltipData.date}</div>
          {tooltipData.series.map((s, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ color: 'var(--text-soft)' }}>{s.label}</span>
              <span>{typeof s.value === 'number' ? Math.round(s.value) : '—'}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

export default function Trends() {
  const query = useQuery();
  const { showToast } = useToast();
  const [resumes, setResumes] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [histories, setHistories] = useState({}); // {id: [reports]}
  const [loading, setLoading] = useState(false);
  const [loadedOnce, setLoadedOnce] = useState(false);
  const [showATS, setShowATS] = useState(true);
  const [showSug, setShowSug] = useState(true);
  const [showMissing, setShowMissing] = useState(true);
  const [smooth, setSmooth] = useState(false);
  const [windowSize, setWindowSize] = useState(3);
  const atsRef = useRef(null);
  const sugRef = useRef(null);
  const missRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    async function loadResumes() {
      try {
        const { data } = await api.get('/resume/list');
        const list = data?.resumes || [];
        if (cancelled) return;
        setResumes(list);
        const qId = query.get('resumeId');
        const initialId = qId ? Number(qId) : (list[0]?.id ?? null);
        setSelectedIds(initialId ? [initialId] : []);
      } catch (err) {
        console.error(err);
        showToast('Failed to load resumes', 'error');
      }
    }
    loadResumes();
    return () => { cancelled = true; };
  }, [query]);

  useEffect(() => {
    let cancelled = false;
    async function loadHistory() {
      if (!selectedIds.length) {
        setHistories({});
        setLoadedOnce(false);
        return;
      }
      setLoading(true);
      setLoadedOnce(false);
      try {
        const promises = selectedIds.map((id) => api.get(`/resume/${id}/history`).then(r => ({ id, history: (r.data?.reports || []).sort((a, b) => new Date(a.date) - new Date(b.date)) })));
        const results = await Promise.all(promises);
        if (cancelled) return;
        const next = {};
        results.forEach(({ id, history }) => { next[id] = history; });
        setHistories(next);
        setLoadedOnce(true);
      } catch (err) {
        console.error(err);
        if (!cancelled) showToast('Failed to load history', 'error');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadHistory();
    return () => { cancelled = true; };
  }, [selectedIds]);

  const unionDates = useMemo(() => {
    const s = new Set();
    Object.values(histories).forEach((list) => list.forEach((h) => s.add(new Date(h.date).toISOString())));
    return Array.from(s).sort((a, b) => new Date(a) - new Date(b));
  }, [histories]);

  function carryForward(values) {
    const filled = [...values];
    for (let i = 1; i < filled.length; i++) {
      if (typeof filled[i] !== 'number' || Number.isNaN(filled[i])) {
        filled[i] = filled[i - 1];
      }
    }
    if (typeof filled[0] !== 'number' || Number.isNaN(filled[0])) filled[0] = 0;
    return filled;
  }

  function movingAverage(arr, w) {
    if (!w || w <= 1) return arr;
    const out = [];
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - w + 1);
      const slice = arr.slice(start, i + 1);
      const sum = slice.reduce((a, b) => a + b, 0);
      out.push(sum / slice.length);
    }
    return out;
  }

  function buildSeries(metric) {
    return selectedIds.map((id, idx) => {
      const history = histories[id] || [];
      const dateToValue = new Map();
      history.forEach(h => {
        let v = 0;
        if (metric === 'atsScore') v = Number(h.atsScore || 0);
        else if (metric === 'suggestions') v = Array.isArray(h.suggestions) ? h.suggestions.length : 0;
        else if (metric === 'missingKeywords') v = Array.isArray(h.missingKeywords) ? h.missingKeywords.length : 0;
        dateToValue.set(new Date(h.date).toISOString(), v);
      });
      const values = unionDates.map((d) => dateToValue.has(d) ? dateToValue.get(d) : NaN);
      const cf = carryForward(values);
      const sm = smooth ? movingAverage(cf, windowSize) : cf;
      const title = resumes.find(r => r.id === id)?.title || `Resume #${id}`;
      return { key: id, label: title, values: sm, color: COLORS[idx % COLORS.length] };
    });
  }

  const atsSeries = useMemo(() => buildSeries('atsScore'), [histories, selectedIds, unionDates, smooth, windowSize]);
  const sugSeries = useMemo(() => buildSeries('suggestions'), [histories, selectedIds, unionDates, smooth, windowSize]);
  const missSeries = useMemo(() => buildSeries('missingKeywords'), [histories, selectedIds, unionDates, smooth, windowSize]);

  const stats = useMemo(() => {
    function calc(values) {
      if (!values.length) return { avg: 0, start: 0, end: 0, delta: 0 };
      const sum = values.reduce((a, b) => a + b, 0);
      const avg = sum / values.length;
      const start = values[0];
      const end = values[values.length - 1];
      const delta = end - start;
      return { avg, start, end, delta };
    }
    return {
      ats: calc(atsSeries[0]?.values || []),
      sug: calc(sugSeries[0]?.values || []),
      miss: calc(missSeries[0]?.values || []),
    };
  }, [atsSeries, sugSeries, missSeries]);

  function toggleId(id) {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  function selectAll() {
    setSelectedIds(resumes.map(r => r.id));
  }

  function clearSelection() {
    setSelectedIds([]);
  }

  async function exportPNG() {
    try {
      const serialize = (svg) => new XMLSerializer().serializeToString(svg);
      const svgStrings = [atsRef.current, sugRef.current, missRef.current]
        .filter(Boolean)
        .map(serialize);
      const images = await Promise.all(svgStrings.map((s) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s);
      })));
      const width = Math.max(...images.map(img => img.width));
      const height = images.reduce((acc, img) => acc + img.height, 0) + (images.length - 1) * 8;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      let y = 0;
      images.forEach((img) => {
        ctx.drawImage(img, 0, y);
        y += img.height + 8;
      });
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analysis-trends.png';
      a.click();
    } catch (e) {
      console.error(e);
      showToast('Failed to export chart as PNG', 'error');
    }
  }

  function exportCSV() {
    try {
      const headers = ['date'];
      selectedIds.forEach((id) => {
        const label = resumes.find(r => r.id === id)?.title || `Resume #${id}`;
        headers.push(`ATS: ${label}`);
        headers.push(`Suggestions: ${label}`);
        headers.push(`Missing: ${label}`);
      });
      const rows = [headers];
      for (let i = 0; i < unionDates.length; i++) {
        const dateIso = new Date(unionDates[i]).toISOString();
        const row = [dateIso];
        selectedIds.forEach((id) => {
          const a = atsSeries.find(s => s.key === id)?.values[i];
          const su = sugSeries.find(s => s.key === id)?.values[i];
          const mi = missSeries.find(s => s.key === id)?.values[i];
          row.push(typeof a === 'number' ? Math.round(a) : '');
          row.push(typeof su === 'number' ? Math.round(su) : '');
          row.push(typeof mi === 'number' ? Math.round(mi) : '');
        });
        rows.push(row);
      }
      const csv = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'analysis-trends.csv';
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) {
      console.error(e);
      showToast('Failed to export CSV', 'error');
    }
  }

  return (
    <div className="page trends">
      <div className="page-header">
        <h1>Analysis Trends</h1>
        <p>Compare resumes over time. Toggle smoothing and export charts.</p>
      </div>

      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Visualize how ATS scores and key metrics change over time.</p>
        <ol className="step-list">
          <li>Select resumes to include in the comparison.</li>
          <li>Toggle smoothing and window size for clearer trends.</li>
          <li>Export charts as PNG to share or archive.</li>
        </ol>
      </div>

      <div className="card">
        <div className="card-header" style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div className="muted">Select resumes</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {resumes.map((r, idx) => (
                <label key={r.id} className="badge outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <input type="checkbox" checked={selectedIds.includes(r.id)} onChange={() => toggleId(r.id)} />
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: COLORS[idx % COLORS.length] }} />
                  <span>{r.title || `Resume #${r.id}`}</span>
                </label>
              ))}
            </div>
            <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
              <button className="btn small" onClick={selectAll}>Select All</button>
              <button className="btn small ghost" onClick={clearSelection}>Clear</button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <input type="checkbox" checked={smooth} onChange={(e) => setSmooth(e.target.checked)} /> Smoothing
            </label>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              Window
              <input type="number" value={windowSize} min={2} max={10} onChange={(e) => setWindowSize(Math.max(2, Math.min(10, parseInt(e.target.value || '3', 10))))} style={{ width: 64 }} />
            </label>
            <button className="btn small" onClick={exportPNG}>Export PNG</button>
            <button className="btn small ghost" onClick={exportCSV}>Export CSV</button>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <p>Loading history…</p>
          ) : !selectedIds.length ? (
            <p>Select one or more resumes to view trends.</p>
          ) : unionDates.length === 0 && loadedOnce ? (
            <p>No analysis history yet for selected resumes.</p>
          ) : unionDates.length === 0 ? (
            <p>Loading history…</p>
          ) : (
            <div className="trends-grid" style={{ display: 'grid', gap: 16 }}>
              <div className="trend-row">
                <div className="trend-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong>ATS Score</strong>
                    {atsSeries[0] && (
                      <span style={{ marginLeft: 8, color: stats.ats.delta >= 0 ? '#16a34a' : '#dc2626' }}>
                        {stats.ats.delta >= 0 ? '↑' : '↓'} {Math.round(Math.abs(stats.ats.delta))} (avg {Math.round(stats.ats.avg)})
                      </span>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={showATS} onChange={e => setShowATS(e.target.checked)} /> Show
                  </label>
                </div>
                {showATS && <MultiSparkline ref={atsRef} seriesList={atsSeries} timestamps={unionDates} />}
                {!showATS && <div className="muted">Hidden</div>}
              </div>

              <div className="trend-row">
                <div className="trend-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong>Suggestions Count</strong>
                    {sugSeries[0] && (
                      <span style={{ marginLeft: 8, color: (sugSeries[0].values[sugSeries[0].values.length - 1] - sugSeries[0].values[0]) <= 0 ? '#16a34a' : '#dc2626' }}>
                        {(sugSeries[0].values[sugSeries[0].values.length - 1] - sugSeries[0].values[0]) <= 0 ? '↓' : '↑'} {Math.round(Math.abs((sugSeries[0].values[sugSeries[0].values.length - 1] - sugSeries[0].values[0])))}
                      </span>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={showSug} onChange={e => setShowSug(e.target.checked)} /> Show
                  </label>
                </div>
                {showSug && <MultiSparkline ref={sugRef} seriesList={sugSeries} timestamps={unionDates} />}
                {!showSug && <div className="muted">Hidden</div>}
              </div>

              <div className="trend-row">
                <div className="trend-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <strong>Missing Keywords</strong>
                    {missSeries[0] && (
                      <span style={{ marginLeft: 8, color: (missSeries[0].values[missSeries[0].values.length - 1] - missSeries[0].values[0]) <= 0 ? '#16a34a' : '#dc2626' }}>
                        {(missSeries[0].values[missSeries[0].values.length - 1] - missSeries[0].values[0]) <= 0 ? '↓' : '↑'} {Math.round(Math.abs((missSeries[0].values[missSeries[0].values.length - 1] - missSeries[0].values[0])))}
                      </span>
                    )}
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <input type="checkbox" checked={showMissing} onChange={e => setShowMissing(e.target.checked)} /> Show
                  </label>
                </div>
                {showMissing && <MultiSparkline ref={missRef} seriesList={missSeries} timestamps={unionDates} />}
                {!showMissing && <div className="muted">Hidden</div>}
              </div>

              <div className="trend-meta" style={{ color: '#6b7280' }}>
                <small>
                  Points: {unionDates.length}. Range: {new Date(unionDates[0]).toLocaleDateString()} → {new Date(unionDates[unionDates.length - 1]).toLocaleDateString()}
                </small>
              </div>

              <div className="trend-legend" style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {selectedIds.map((id, idx) => (
                  <span key={`legend-${id}`} className="badge outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ width: 10, height: 10, borderRadius: 999, background: COLORS[idx % COLORS.length] }} />
                    {resumes.find(r => r.id === id)?.title || `Resume #${id}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Link to="/history" className="btn btn-secondary">Back to History</Link>
      </div>
    </div>
  );
}