import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';

export default function CoverLetter() {
  const [jobTitle, setJobTitle] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [useSavedResume, setUseSavedResume] = useState(true);
  const [loadStatus, setLoadStatus] = useState('');
  const { showToast } = useToast();
  const [latestResume, setLatestResume] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [latestAts, setLatestAts] = useState(null); // { score, date }

  function composeResumeTextFromContent(content) {
    try {
      const lines = [];
      const personal = content.personal || {};
      const header = [personal.name, personal.email, personal.phone].filter(Boolean).join(' \u2022 ');
      if (header) lines.push(header);
      for (const key of ['summary', 'experience', 'projects', 'education', 'skills', 'achievements', 'certifications']) {
        const val = content[key];
        if (typeof val === 'string' && val.trim()) lines.push(val);
      }
      return lines.join('\n');
    } catch (e) {
      console.error('Failed to compose resumeText', e);
      return '';
    }
  }

  async function loadLatestAnalysis(resumeId) {
    try {
      const { data } = await api.get(`/resume/${resumeId}/history`);
      const reports = Array.isArray(data?.reports) ? data.reports : [];
      const last = reports[0] || null; // backend returns desc order
      if (last) setLatestAts({ score: last.atsScore, date: last.date });
      else setLatestAts(null);
    } catch (e) {
      console.error('Failed to load latest analysis', e);
      setLatestAts(null);
    }
  }

  async function loadLatestResume() {
    try {
      setLoadStatus('Loading saved resume…');
      const listRes = await api.get('/resume/list');
      const latest = (listRes.data?.resumes || [])[0];
      if (!latest) {
        setLoadStatus('No saved resumes found');
        showToast('No saved resumes found. Build or upload one first.', 'error');
        return;
      }
      const res = await api.get(`/resume/${latest.id}`);
      const resume = res.data?.resume;
      if (!resume || !resume.content) {
        setLoadStatus('Failed to load resume content');
        showToast('Failed to load resume content', 'error');
        return;
      }
      const text = composeResumeTextFromContent(resume.content);
      setResumeText(text);
      setLatestResume(resume);
      await loadLatestAnalysis(latest.id);
      setLoadStatus(`Loaded: ${latest.title || 'Untitled Resume'}`);
    } catch (e) {
      console.error(e);
      setLoadStatus('Error loading resume');
      showToast(e?.response?.data?.error || e.message || 'Error loading resume', 'error');
    }
  }

  const generate = async () => {
    const jt = jobTitle.trim();
    const rt = resumeText.trim();
    if (!jt) return; 
    if (!rt) {
      if (useSavedResume) {
        await loadLatestResume();
      }
    }
    if (!jt || !resumeText.trim()) return;
    setLoading(true);
    try {
      const { data } = await api.post('/coverletter/generate', { jobTitle: jt, resumeText: resumeText.trim() });
      setContent(data.content);
    } catch (e) {
      console.error(e);
      showToast('Generation failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  function slugify(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  async function copyContent() {
    try {
      if (!content) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(content);
      } else {
        const ta = document.createElement('textarea');
        ta.value = content;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      showToast('Copied cover letter to clipboard', 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to copy to clipboard', 'error');
    }
  }

  function downloadContent() {
    try {
      if (!content) return;
      const name = `cover-letter-${slugify(jobTitle) || 'untitled'}.txt`;
      const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      showToast(`Downloaded ${name}`, 'success');
    } catch (e) {
      console.error(e);
      showToast('Failed to download file', 'error');
    }
  }

  async function togglePreview() {
    try {
      if (!showPreview && !latestResume) {
        await loadLatestResume();
      }
      setShowPreview(prev => !prev);
    } catch (e) {
      console.error(e);
      showToast('Failed to load resume for preview', 'error');
    }
  }

  function fmtDate(d) {
    try { return d ? new Date(d).toLocaleDateString() : '—'; } catch { return '—'; }
  }

  function downloadPreviewPDF() {
    try {
      if (!latestResume) return;
      const name = latestResume?.content?.personal?.name || latestResume?.title || 'Resume';
      const email = latestResume?.content?.personal?.email || '';
      const phone = latestResume?.content?.personal?.phone || '';
      const keys = ['summary','experience','projects','education','skills','achievements','certifications'];
      const sectionsHtml = keys.map((key) => {
        const val = latestResume?.content?.[key];
        if (!val || !String(val).trim()) return '';
        const safe = String(val).replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return `<div class="section"><h4>${key[0].toUpperCase() + key.slice(1)}</h4><div class="text">${safe.replace(/\n/g, '<br/>')}</div></div>`;
      }).join('');
      const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${name} - Resume</title><style>
        @page { margin: 16mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, system-ui, sans-serif; color: #111827; }
        .hdr { margin-bottom: 10px; }
        .name { font-size: 24px; font-weight: 700; }
        .contact { color: #6b7280; margin-top: 4px; }
        .section { margin-top: 14px; }
        .section h4 { margin: 0 0 6px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.4px; color: #374151; }
        .text { font-size: 13px; line-height: 1.5; white-space: pre-wrap; }
      </style></head><body>
        <div class="hdr">
          <div class="name">${name}</div>
          <div class="contact">${[email, phone].filter(Boolean).join(' • ')}</div>
        </div>
        ${sectionsHtml}
        <script>
          window.onload = function() {
            setTimeout(function(){ window.print(); }, 150);
            setTimeout(function(){ window.close(); }, 1200);
          };
        </script>
      </body></html>`;
      const w = window.open('', '_blank');
      if (!w) { showToast('Popup blocked. Allow popups to download PDF.', 'error'); return; }
      w.document.open();
      w.document.write(html);
      w.document.close();
      showToast('Opening PDF preview. Use Save as PDF.', 'info');
    } catch (e) {
      console.error(e);
      showToast('Failed to prepare PDF', 'error');
    }
  }

  return (
    <div className="page cover-letters">
      <div className="page-header">
        <h1>Cover Letter Generator</h1>
        <p className="muted">Tailor a professional cover letter using your resume.</p>
      </div>
      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Generate a tailored cover letter from your resume content.</p>
        <ol className="step-list">
          <li>Provide the job title and use a saved resume or paste text.</li>
          <li>Generate an initial draft and edit to personalize.</li>
          <li>Copy and save for sending with your application.</li>
        </ol>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Inputs</h3>
          <label>Job Title</label>
          <input value={jobTitle} onChange={(e) => setJobTitle(e.target.value)} />
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" checked={useSavedResume} onChange={(e) => setUseSavedResume(e.target.checked)} />
              <span>Use my latest saved resume</span>
            </label>
            {useSavedResume && (
              <>
                <button className="btn small" onClick={loadLatestResume}>Load</button>
                <button className="btn small ghost" onClick={togglePreview}>{showPreview ? 'Hide Preview' : 'Preview Latest Resume'}</button>
              </>
            )}
          </div>
          <div className="muted" style={{ marginTop: 6 }}>{loadStatus || (useSavedResume ? 'We will use your latest saved resume.' : 'Or paste your resume below')}</div>
          <label>Resume Text</label>
          <textarea rows={8} value={resumeText} onChange={(e) => setResumeText(e.target.value)} disabled={useSavedResume} />
          <div style={{ marginTop: 12 }}>
            <button className="btn primary" onClick={generate} disabled={loading}>{loading ? 'Generating…' : 'Generate'}</button>
          </div>
        </div>
      </div>
      {useSavedResume && showPreview && latestResume && (
        <div className="card" style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3>Latest Resume Preview</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <Link to={`/builder?resumeId=${latestResume.id}`} className="btn small">Open in Builder</Link>
              <button className="btn small ghost" onClick={downloadPreviewPDF}>Download PDF</button>
              {latestAts && (
                <span className="badge outline" title={`Analyzed ${fmtDate(latestAts.date)}`}>
                  ATS {latestAts.score} • {fmtDate(latestAts.date)}
                </span>
              )}
            </div>
          </div>
          <div>
            <div>
              <strong>{latestResume?.content?.personal?.name || latestResume?.title || 'Untitled'}</strong>
              <div className="muted" style={{ marginTop: 4 }}>
                {[latestResume?.content?.personal?.email, latestResume?.content?.personal?.phone].filter(Boolean).join(' • ')}
              </div>
            </div>
            {['summary','experience','projects','education','skills','achievements','certifications'].map((key) => {
              const val = latestResume?.content?.[key];
              if (!val || !String(val).trim()) return null;
              return (
                <div key={key} style={{ marginTop: 12 }}>
                  <div style={{ fontWeight: 600, marginBottom: 4, textTransform: 'capitalize' }}>{key}</div>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{String(val)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {content && (
        <div className="card shine" style={{ marginTop: 16 }}>
          <h3>Editable Cover Letter</h3>
          <textarea rows={12} value={content} onChange={(e) => setContent(e.target.value)} />
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            <button className="btn small" onClick={copyContent}>Copy</button>
            <button className="btn small ghost" onClick={downloadContent}>Download .txt</button>
          </div>
        </div>
      )}
    </div>
  );
}