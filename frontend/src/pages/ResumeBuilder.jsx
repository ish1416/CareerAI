import { useState, useRef, useEffect } from 'react';
import { Sparkles, UploadCloud, CheckCircle } from 'lucide-react';
import api from '../utils/api';
import { ocrPdf } from '../utils/ocr.js';
import { useToast } from '../components/Toast.jsx';
import { Link } from 'react-router-dom';

const initial = {
  personal: { name: '', email: '', phone: '' },
  education: '',
  experience: '',
  skills: '',
  achievements: '',
  projects: '',
};

function parseResumeText(text) {
  const result = {
    personal: { name: '', email: '', phone: '' },
    education: '',
    experience: '',
    skills: '',
    achievements: '',
    projects: '',
  };
  if (!text) return result;

  const emailMatch = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  if (emailMatch) result.personal.email = emailMatch[0];

  const phoneMatch = text.match(/(?:\+?\d[\d\s\-().]{7,}\d)/);
  if (phoneMatch) result.personal.phone = phoneMatch[0];

  const lines = text.split(/\r?\n/).map((l) => l.trim()).filter((l) => l.length > 0);

  const firstLine = lines[0] || '';
  if (firstLine && firstLine.length < 80 && !firstLine.includes('@')) {
    const words = firstLine.split(/\s+/);
    if (words.length <= 6) result.personal.name = firstLine;
  }

  const headingDefs = [
    { key: 'experience', tests: [/^experience\b/i, /^work experience\b/i, /^employment\b/i, /^professional experience\b/i] },
    { key: 'education', tests: [/^education\b/i, /^academic\b/i, /^qualifications?\b/i, /^certifications?\b/i] },
    { key: 'skills', tests: [/^skills?\b/i, /^technical skills?\b/i, /^skills & tools\b/i, /^technologies?\b/i] },
    { key: 'projects', tests: [/^projects?\b/i, /^personal projects?\b/i] },
    { key: 'achievements', tests: [/^achievements?\b/i, /^awards?\b/i, /^honors?\b/i] },
  ];

  const sections = {};
  let current = null;

  for (const line of lines) {
    const header = headingDefs.find((h) => h.tests.some((t) => t.test(line)));
    if (header) {
      current = header.key;
      if (!sections[current]) sections[current] = [];
      continue;
    }
    if (current) sections[current].push(line);
  }

  for (const key of Object.keys(result)) {
    if (key === 'personal') continue;
    result[key] = (sections[key] || []).join('\n');
  }

  if (!result.skills) {
    const skillsLine = lines.find((l) => /^skills?:/i.test(l));
    if (skillsLine) result.skills = skillsLine.replace(/^skills?:\s*/i, '');
  }

  if (!result.experience) {
    const expCandidates = lines.filter((l) => /\b(20\d{2}|19\d{2})\b/.test(l) || /\b(Inc\.?|LLC|Ltd\.?|Company|Corp\.?)\b/i.test(l));
    result.experience = expCandidates.slice(0, 20).join('\n');
  }

  return result;
}

export default function ResumeBuilder() {
  const [form, setForm] = useState(initial);
  const [title, setTitle] = useState('My Resume');
  const [resumeId, setResumeId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [templateStyle, setTemplateStyle] = useState('classic');
  const [hydrating, setHydrating] = useState(false);
  const { showToast } = useToast();

  const onChange = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const [enhancing, setEnhancing] = useState({});
  
  const enhance = async (key) => {
    const text = form[key];
    if (!text || !text.trim()) {
      showToast('Please add some content first', 'warning');
      return;
    }
    
    setEnhancing(prev => ({ ...prev, [key]: true }));
    try {
      const { data } = await api.post('/resume/rewrite', { text });
      const rewritten = (data?.rewritten || '').trim();
      if (!rewritten) {
        showToast('AI enhancement returned empty text', 'error');
        return;
      }
      if (/^AI is offline/i.test(rewritten)) {
        showToast('AI is currently offline. Please configure API keys in backend .env file.', 'warning');
        return;
      }
      onChange(key, rewritten);
      showToast('Content enhanced successfully!', 'success');
    } catch (e) {
      console.error('Enhancement error:', e);
      const errorMsg = e?.response?.data?.error || e.message || 'Enhancement failed';
      showToast(errorMsg, 'error');
    } finally {
      setEnhancing(prev => ({ ...prev, [key]: false }));
    }
  };

  const save = async (opts = {}) => {
    try {
      setSaving(true);
      setSaveMessage('');
      
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        showToast('Resume title cannot be empty', 'error');
        setSaveMessage('Title required');
        return;
      }
      
      const payload = { title: trimmedTitle, content: form, resumeId };
      const { data } = await api.post('/resume/build', payload);
      setResumeId(data.resume.id);
      setTitle(trimmedTitle); // Update with trimmed title
      setSaveMessage(opts.autosave ? 'Autosaved' : 'Saved');
      
      if (!opts.autosave) {
        showToast('Resume saved successfully!', 'success');
      }
    } catch (err) {
      console.error(err);
      const errorMsg = err?.response?.data?.error || err.message || 'Save failed';
      setSaveMessage(errorMsg);
      
      if (err?.response?.status === 409) {
        // Duplicate name error
        showToast(errorMsg, 'error');
      } else if (!opts.autosave) {
        // Only show toast for manual saves, not autosaves
        showToast(errorMsg, 'error');
      }
    } finally {
      setSaving(false);
    }
  };

  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const applyParsed = (text) => {
    const mapped = parseResumeText(text || '');
    setForm((prev) => ({
      ...prev,
      personal: { ...prev.personal, ...mapped.personal },
      education: mapped.education || prev.education,
      experience: mapped.experience || prev.experience,
      skills: mapped.skills || prev.skills,
      achievements: mapped.achievements || prev.achievements,
      projects: mapped.projects || prev.projects,
    }));
  };

  const processFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setUploadComplete(false);
    setUploadProgress(0);
    setOcrStatus('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const { data } = await api.post('/resume/upload', formData, {
        onUploadProgress: (e) => {
          if (e.total) {
            const pct = Math.round((e.loaded / e.total) * 100);
            setUploadProgress(pct);
          }
        },
      });
      if (data.structured) {
        setForm((prev) => ({
          ...prev,
          personal: { ...prev.personal, ...(data.structured.personal || {}) },
          education: data.structured.education || prev.education,
          experience: data.structured.experience || prev.experience,
          skills: data.structured.skills || prev.skills,
          achievements: data.structured.achievements || prev.achievements,
          projects: data.structured.projects || prev.projects,
        }));
      } else {
        applyParsed(data.text);
      }
      setUploadComplete(true);
    } catch (err) {
      console.error(err);
      const isPDF = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (isPDF) {
        try {
          const text = await ocrPdf(file, {
            onProgress: (m) => {
              if (m?.status === 'recognizing text' && typeof m?.progress === 'number') {
                const pct = Math.max(1, Math.round(m.progress * 100));
                setUploadProgress(pct);
                setOcrStatus(`${pct}%`);
              } else if (m?.status === 'page_done') {
                const pct = Math.round((m.pageNum / m.total) * 100);
                setUploadProgress(pct);
                setOcrStatus(`Page ${m.pageNum}/${m.total}`);
              }
            },
          });
          if (text && text.trim()) {
            applyParsed(text);
            setUploadComplete(true);
          } else {
            showToast('OCR did not detect readable text. Try a higher-quality scan or DOCX.', 'error');
          }
        } catch (ocrErr) {
          console.error('OCR fallback failed:', ocrErr);
          showToast(err?.response?.data?.error || err.message || 'Upload failed', 'error');
        }
      } else {
        showToast(err?.response?.data?.error || err.message || 'Upload failed', 'error');
      }
    } finally {
      setUploading(false);
      setOcrStatus('');
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    processFile(file);
  };

  const triggerFilePicker = () => fileInputRef.current?.click();
  const onDrop = (e) => { e.preventDefault(); setDragActive(false); const file = e.dataTransfer.files?.[0]; processFile(file); };
  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);

  const isValidEmail = (val) => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isValidPhone = (val) => !val || /(?:(?:\+?\d[\d\s\-().]{7,}\d))/.test(val);

  const templates = {
    education: [
      'B.S. in Computer Science — XYZ University (2019–2023)',
      'Relevant Coursework: Data Structures, Algorithms, Databases, Operating Systems',
    ].join('\n'),
    experience: [
      '- Led development of web features, improving conversion by 12%',
      '- Implemented CI/CD and testing, reducing regressions',
      '- Collaborated with product/design to ship user-facing improvements',
    ].join('\n'),
    skills: [
      'JavaScript • React • Node.js • Express • SQL • Prisma • Git',
    ].join('\n'),
    achievements: [
      '- Hackathon finalist (2023)',
      '- Dean’s list (multiple semesters)',
    ].join('\n'),
    projects: [
      '- Resume Builder — React, Node.js; AI-powered parsing and rewriting',
      '- Job Match — Scored matching against job descriptions',
    ].join('\n'),
  };

  const insertTemplate = (key) => {
    const tpl = templates[key];
    if (!tpl) return;
    setForm((prev) => ({ ...prev, [key]: (prev[key] ? prev[key] + '\n' : '') + tpl }));
  };

  useEffect(() => {
    // Debounced autosave on content edits (skip during upload or initial hydration)
    if (uploading || hydrating) return;
    const t = setTimeout(() => { save({ autosave: true }); }, 1500);
    return () => clearTimeout(t);
  }, [title, form, uploading, hydrating]);

  useEffect(() => {
    // Load existing resume if resumeId is present in query params
    const qs = new URLSearchParams(window.location.search);
    const idStr = qs.get('resumeId');
    const id = idStr ? parseInt(idStr, 10) : NaN;
    if (!Number.isFinite(id)) return;
    (async () => {
      try {
        setHydrating(true);
        const { data } = await api.get(`/resume/${id}`);
        const r = data?.resume;
        if (r) {
          setTitle(r.title || 'My Resume');
          setForm(r.content || initial);
          setResumeId(r.id);
        }
      } catch (e) {
        console.error('Failed to load existing resume', e);
        showToast(e?.response?.data?.error || e.message || 'Unable to load resume', 'error');
      } finally {
        setHydrating(false);
      }
    })();
  }, []);

  return (
    <div className="page builder">
      <div className="page-header">
        <h1>Resume Builder</h1>
        <p className="muted">Create and refine your resume; upload, edit, and preview.</p>
      </div>
      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Build or import a resume, then customize sections and preview.</p>
        <ol className="step-list">
          <li>Set a title and upload or paste an existing resume.</li>
          <li>Edit each section for clarity, keywords, and impact.</li>
          <li>Preview with templates and save your latest version.</li>
        </ol>
      </div>
      <div className="card shine">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} />

        <label>Upload resume</label>
        <div
          className={`upload-box ${dragActive ? 'drag' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          onClick={triggerFilePicker}
          role="button"
        >
          {!uploadComplete ? (
            <div className="upload-content">
              <UploadCloud size={32} color="var(--accent-blue)" />
              <div>
                <strong>Drag & drop PDF/DOCX here</strong>
                <div className="muted">or click to select a file</div>
              </div>
              {uploading && (
                <div className="progress-circle" style={{ background: `conic-gradient(var(--accent-blue) ${uploadProgress}%, transparent 0)` }}>
                  <div className="progress-inner">{uploadProgress}%</div>
                </div>
              )}
            </div>
          ) : (
            <div className="upload-complete">
              <div className="upload-check">
                <CheckCircle size={28} />
              </div>
              <span>Uploaded and parsed successfully</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          disabled={uploading}
        />
        {uploading && !!ocrStatus && (
          <small className="muted">OCR scanning: {ocrStatus}</small>
        )}
      </div>

      <div className="card">
        <label>Template Style</label>
        <div className="template-picker">
          {[
            { key: 'classic', name: 'Classic', desc: 'Traditional layout' },
            { key: 'modern', name: 'Modern', desc: 'Colored header' },
            { key: 'minimal', name: 'Minimal', desc: 'Clean & simple' },
            { key: 'professional', name: 'Professional', desc: 'Corporate style' },
            { key: 'creative', name: 'Creative', desc: 'Unique design' },
          ].map((t) => (
            <button
              key={t.key}
              type="button"
              className={`template-card ${templateStyle === t.key ? 'selected' : ''}`}
              onClick={() => setTemplateStyle(t.key)}
              aria-pressed={templateStyle === t.key}
              title={`${t.name}: ${t.desc}`}
            >
              <div className="template-title">{t.name}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)', marginTop: 'var(--space-1)' }}>
                {t.desc}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="builder-grid">
        <div className="left">
          <section className="card">
            <h3>Personal Info</h3>
            <input placeholder="Name" value={form.personal.name} onChange={(e) => setForm((f) => ({ ...f, personal: { ...f.personal, name: e.target.value } }))} />
            <input placeholder="Email" value={form.personal.email} onChange={(e) => setForm((f) => ({ ...f, personal: { ...f.personal, email: e.target.value } }))} />
            {!isValidEmail(form.personal.email) && (<small className="muted">Invalid email format</small>)}
            <input placeholder="Phone" value={form.personal.phone} onChange={(e) => setForm((f) => ({ ...f, personal: { ...f.personal, phone: e.target.value } }))} />
            {!isValidPhone(form.personal.phone) && (<small className="muted">Invalid phone format</small>)}
          </section>

          <section className="card">
            <h3>Education</h3>
            <textarea rows={6} value={form.education} onChange={(e) => onChange('education', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="ai-enhance" 
                onClick={() => enhance('education')}
                disabled={enhancing.education}
              >
                {enhancing.education ? 'Enhancing...' : 'AI Enhance'}
              </button>
              <button className="btn small ghost" onClick={() => insertTemplate('education')}>Insert Template</button>
            </div>
          </section>

          <section className="card">
            <h3>Experience</h3>
            <textarea rows={10} value={form.experience} onChange={(e) => onChange('experience', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="ai-enhance" 
                onClick={() => enhance('experience')}
                disabled={enhancing.experience}
              >
                {enhancing.experience ? 'Enhancing...' : 'AI Enhance'}
              </button>
              <button className="btn small ghost" onClick={() => insertTemplate('experience')}>Insert Template</button>
            </div>
          </section>

          <section className="card">
            <h3>Skills</h3>
            <textarea rows={6} value={form.skills} onChange={(e) => onChange('skills', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="ai-enhance" 
                onClick={() => enhance('skills')}
                disabled={enhancing.skills}
              >
                {enhancing.skills ? 'Enhancing...' : 'AI Enhance'}
              </button>
              <button className="btn small ghost" onClick={() => insertTemplate('skills')}>Insert Template</button>
            </div>
          </section>

          <section className="card">
            <h3>Achievements</h3>
            <textarea rows={6} value={form.achievements} onChange={(e) => onChange('achievements', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="ai-enhance" 
                onClick={() => enhance('achievements')}
                disabled={enhancing.achievements}
              >
                {enhancing.achievements ? 'Enhancing...' : 'AI Enhance'}
              </button>
              <button className="btn small ghost" onClick={() => insertTemplate('achievements')}>Insert Template</button>
            </div>
          </section>

          <section className="card">
            <h3>Projects</h3>
            <textarea rows={6} value={form.projects} onChange={(e) => onChange('projects', e.target.value)} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button 
                className="ai-enhance" 
                onClick={() => enhance('projects')}
                disabled={enhancing.projects}
              >
                {enhancing.projects ? 'Enhancing...' : 'AI Enhance'}
              </button>
              <button className="btn small ghost" onClick={() => insertTemplate('projects')}>Insert Template</button>
            </div>
          </section>
        </div>
        <aside className="card resume-preview">
          <ResumePreview title={title} form={form} templateStyle={templateStyle} />
        </aside>
      </div>

      <div style={{ marginTop: 16 }}>
        <button className="btn primary" onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save Version'}</button>
        {!!saveMessage && (<small className="muted" style={{ marginLeft: 8 }}>{saveMessage}</small>)}
        {!!resumeId && !!saveMessage && (
          <>
            <Link to={`/analysis?resumeId=${resumeId}`} className="btn small ghost" style={{ marginLeft: 8 }}>
              Open in Analysis
            </Link>
            <Link to={`/history?resumeId=${resumeId}`} className="btn small" style={{ marginLeft: 8 }}>
              View History
            </Link>
          </>
        )}
      </div>
    </div>
  );
}

function ResumePreview({ title, form, templateStyle }) {
  const name = form.personal?.name || title || 'Your Name';
  const email = form.personal?.email || '';
  const phone = form.personal?.phone || '';
  
  const renderLines = (text) => {
    const lines = (text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    if (!lines.length) return (<p style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No content added yet</p>);
    return (
      <ul className="resume-list">
        {lines.map((l, i) => (<li key={i}>{l}</li>))}
      </ul>
    );
  };
  
  const hasContent = (text) => text && text.trim().length > 0;
  
  return (
    <div className={`preview-root tpl-${templateStyle || 'classic'}`}>
      <div className="resume-header">
        <div className="name">{name}</div>
        <div className="contact">
          {[email, phone].filter(Boolean).join(' • ') || 'email@example.com • (555) 123-4567'}
        </div>
      </div>
      
      {hasContent(form.education) && (
        <div className="resume-section">
          <h4>Education</h4>
          {renderLines(form.education)}
        </div>
      )}
      
      {hasContent(form.experience) && (
        <div className="resume-section">
          <h4>Experience</h4>
          {renderLines(form.experience)}
        </div>
      )}
      
      {hasContent(form.skills) && (
        <div className="resume-section">
          <h4>Skills</h4>
          {renderLines(form.skills)}
        </div>
      )}
      
      {hasContent(form.achievements) && (
        <div className="resume-section">
          <h4>Achievements</h4>
          {renderLines(form.achievements)}
        </div>
      )}
      
      {hasContent(form.projects) && (
        <div className="resume-section">
          <h4>Projects</h4>
          {renderLines(form.projects)}
        </div>
      )}
      
      {!hasContent(form.education) && !hasContent(form.experience) && !hasContent(form.skills) && !hasContent(form.achievements) && !hasContent(form.projects) && (
        <div style={{ 
          textAlign: 'center', 
          padding: 'var(--space-8)', 
          color: 'var(--text-muted)',
          fontStyle: 'italic'
        }}>
          <p>Start adding content to see your resume preview</p>
          <p style={{ fontSize: 'var(--text-sm)', marginTop: 'var(--space-2)' }}>
            Fill out the sections on the left to see them appear here
          </p>
        </div>
      )}
    </div>
  );
}