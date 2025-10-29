import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import html2pdf from 'html2pdf.js';
import { UploadCloud, CheckCircle, Sparkles } from 'lucide-react';
import api from '../utils/api';
import { ocrPdf } from '../utils/ocr.js';
import { Link } from 'react-router-dom';
import { useToast } from '../components/Toast.jsx';

const SECTION_ALIASES = {
  summary: ['summary', 'objective', 'profile', 'about me', 'professional summary'],
  experience: ['experience', 'work experience', 'employment', 'professional experience'],
  education: ['education', 'academics', 'qualifications'],
  skills: ['skills', 'technical skills', 'core competencies'],
  achievements: ['achievements', 'awards', 'honors'],
  projects: ['projects', 'personal projects'],
  certifications: ['certifications', 'certificates'],
};

function normalizeHeading(h) {
  const s = h.toLowerCase().trim();
  for (const key of Object.keys(SECTION_ALIASES)) {
    if (SECTION_ALIASES[key].some((a) => s.includes(a))) return key;
  }
  return s;
}

function extractSections(text) {
  const lines = (text || '').split(/\r?\n/);
  const sections = {};
  let current = 'summary';
  sections[current] = [];
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const isHeading = /^(summary|objective|profile|experience|work experience|employment|education|skills|technical skills|achievements|awards|projects|certifications)[:]?$/i.test(line);
    if (isHeading) {
      const key = normalizeHeading(line.replace(/:$/, ''));
      current = key;
      if (!sections[current]) sections[current] = [];
    } else {
      if (!sections[current]) sections[current] = [];
      sections[current].push(line);
    }
  }
  const result = {};
  for (const [k, arr] of Object.entries(sections)) {
    result[k] = arr.join('\n');
  }
  return result;
}

// ---- Automated formatting helpers ----
function tokenizeSkills(text) {
  const raw = (text || '')
    .replace(/•/g, '')
    .replace(/\u2022/g, '')
    .replace(/\n/g, ',')
    .replace(/\//g, ',');
  const parts = raw.split(/[|,;]+/).map((s) => s.trim()).filter(Boolean);
  return Array.from(new Set(parts.map((s) => s.replace(/\s+/g, ' '))));
}

function normalizeSkills(text) {
  const tokens = tokenizeSkills(text);
  const cat = {
    Languages: [],
    Frameworks: [],
    Libraries: [],
    Tools: [],
    Databases: [],
    Cloud: [],
    AI: [],
    Design: [],
    Other: [],
  };
  for (const t of tokens) {
    const l = t.toLowerCase();
    if (/(python|javascript|typescript|java|c\+\+|c#|c\b|html|css)\b/.test(l)) cat.Languages.push(t);
    else if (/(react|next\.js|node\.js|express|vue|angular|svelte)\b/.test(l)) cat.Frameworks.push(t);
    else if (/(redux|jest|vitest|webpack|babel|tailwind|mui|material ui|chakra)\b/.test(l)) cat.Libraries.push(t);
    else if (/(git|docker|kubernetes|npm|yarn|pnpm|vs code|vscode)\b/.test(l)) cat.Tools.push(t);
    else if (/(mongodb|mongo|mysql|postgres|postgresql|sqlite|redis)\b/.test(l)) cat.Databases.push(t);
    else if (/(aws|gcp|azure|vercel|netlify|heroku)\b/.test(l)) cat.Cloud.push(t);
    else if (/(tensorflow|pytorch|scikit|sklearn|machine learning|ml|ai|nlp)\b/.test(l)) cat.AI.push(t);
    else if (/(figma|ui|ux|adobe|photoshop|illustrator)\b/.test(l)) cat.Design.push(t);
    else cat.Other.push(t);
  }
  const lines = [];
  for (const [label, items] of Object.entries(cat)) {
    if (items.length) lines.push(`${label}: ${items.join(', ')}`);
  }
  return lines.join('\n');
}

function normalizeTextBlock(text) {
  return (text || '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean).join('\n');
}

function normalizeSections(sections) {
  return {
    summary: normalizeTextBlock(sections.summary),
    education: normalizeTextBlock(sections.education),
    skills: normalizeSkills(sections.skills),
    projects: normalizeTextBlock(sections.projects),
    experience: normalizeTextBlock(sections.experience),
    achievements: normalizeTextBlock(sections.achievements),
  };
}

function deriveHeaderFromText(text) {
  const content = (text || '').replace(/\s+/g, ' ').trim();
  const emailMatch = content.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  const linkedinMatch = content.match(/https?:\/\/(?:www\.)?linkedin\.com\/[^\s)]+/i);
  const githubMatch = content.match(/https?:\/\/(?:www\.)?github\.com\/[^\s)]+/i);
  const phoneMatch = content.match(/(\+?\d[\d\s\-()]{7,}\d)/);
  const firstLine = (text || '').split(/\r?\n/).map((s) => s.trim()).filter(Boolean)[0] || '';
  const name = /^[A-Z][A-Za-z.\- ]{1,60}$/.test(firstLine) ? firstLine.split(/\s+/).slice(0, 5).join(' ') : '';
  const degreeLine = (text || '').split(/\r?\n/).find((l) => /(B\.?Tech|Bachelor|BSc|M\.?Tech|MSc|BE|ME|Computer Science|AI)/i.test(l)) || '';
  const degree = degreeLine ? degreeLine.trim() : '';
  const locMatch = content.match(/\b([A-Z][A-Za-z]+(?:[ -][A-Za-z]+)*),\s*([A-Z][A-Za-z]+)\b/);
  return {
    name,
    degree,
    location: locMatch ? `${locMatch[1]}, ${locMatch[2]}` : '',
    phone: phoneMatch ? phoneMatch[1].trim() : '',
    email: emailMatch ? emailMatch[0].trim() : '',
    linkedin: linkedinMatch ? linkedinMatch[0].trim() : '',
    github: githubMatch ? githubMatch[0].trim() : '',
  };
}

export default function Analysis() {
  const [resumeText, setResumeText] = useState('');
  const [sections, setSections] = useState({ summary: '', experience: '', education: '', skills: '', projects: '', achievements: '' });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [ocrStatus, setOcrStatus] = useState('');
  const [autoAnalyzed, setAutoAnalyzed] = useState(false);
  const [sectionScores, setSectionScores] = useState({});
  const [sectionScoring, setSectionScoring] = useState({});
  const [sectionEnhancing, setSectionEnhancing] = useState({});
  const [scoreAllProgress, setScoreAllProgress] = useState(0);
  const fileInputRef = useRef(null);
  const previewRef = useRef(null);
  const [showParty, setShowParty] = useState(false);
  const [loadedResumeTitle, setLoadedResumeTitle] = useState('');
  const [loadedResumeId, setLoadedResumeId] = useState(null);
  const [header, setHeader] = useState({
    name: '',
    degree: '',
    location: '',
    phone: '',
    email: '',
    linkedin: '',
    github: '',
  });
  const { showToast } = useToast();
  const normalizedSections = useMemo(() => normalizeSections(sections), [sections]);
  // Loading trackers for recommendation additions
  const [addingOverall, setAddingOverall] = useState({});
  const [addingSection, setAddingSection] = useState({});
  useEffect(() => {
    const hasHeader = [header.name, header.email, header.phone, header.linkedin, header.github, header.degree, header.location]
      .some((v) => (v || '').trim());
    if (hasHeader) return;
    const srcText = resumeText || Object.values(sections).join('\n');
    if (!srcText.trim()) return;
    const derived = deriveHeaderFromText(srcText);
    if (Object.values(derived).some((v) => (v || '').trim())) {
      setHeader((h) => ({ ...h, ...derived }));
    }
  }, [resumeText, sections]);

  const applyText = (text) => {
    setResumeText(text);
    setSections(extractSections(text));
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processFile(file);
  };

  const triggerFilePicker = () => fileInputRef.current?.click();

  const downloadResumePdf = useCallback(() => {
    const node = previewRef.current;
    if (!node) return;
    const opt = {
      margin: 0.5,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
    };
    html2pdf().set(opt).from(node).save();
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragActive(true); };
  const onDragLeave = () => setDragActive(false);
  const onDrop = async (e) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await processFile(file);
  };

  useEffect(() => {
    if (uploadComplete && !autoAnalyzed && !loading) {
      setAutoAnalyzed(true);
      // Fire and forget; errors still alert inside analyze()
      analyze();
    }
  }, [uploadComplete]);

  // Show party popup when ATS score hits 100
  useEffect(() => {
    if (result?.atsScore === 100) {
      setShowParty(true);
    }
  }, [result?.atsScore]);

  const processFile = async (file) => {
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
      applyText(data.text);
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
            applyText(text);
            setUploadComplete(true);
          } else {
            showToast('OCR could not extract text. Try a text-based PDF/DOCX or paste text.', 'error');
          }
        } catch (e2) {
          console.error(e2);
          showToast('OCR failed. Try a text-based PDF/DOCX or paste text.', 'error');
        }
      } else {
        showToast('Failed to parse file. Try a text-based PDF/DOCX or paste text.', 'error');
      }
    } finally {
      setUploading(false);
    }
  };

  const analyze = async (explicitResumeId = null) => {
    const txt = resumeText || Object.values(sections).join('\n');
    if (!txt) return;
    setLoading(true);
    try {
      const { data } = await api.post('/resume/analyze', { resumeText: txt, resumeId: explicitResumeId ?? loadedResumeId });
      setResult(data.analysis);
    } catch (e) {
      console.error(e);
      if (e.response?.status === 429) {
        showToast('Plan limit reached. Upgrade to continue.', 'error');
      } else {
        showToast('Analysis failed', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Load saved resume via query parameter and prefill text
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const idParam = params.get('resumeId');
    const id = idParam ? parseInt(idParam, 10) : NaN;
    if (!Number.isFinite(id)) return;
    setLoadedResumeId(id);
    (async () => {
      try {
        const { data } = await api.get(`/resume/${id}`);
        const r = data?.resume;
        if (!r) return;
        const c = r.content || {};
        const headerLine = [c.personal?.name, c.personal?.email, c.personal?.phone].filter(Boolean).join(' • ');
        const blocks = ['summary', 'experience', 'projects', 'education', 'skills', 'achievements', 'certifications']
          .map((k) => c[k])
          .map((v) => (typeof v === 'string' ? v.trim() : ''))
          .filter(Boolean);
        const joined = [headerLine, ...blocks].filter(Boolean).join('\n');
        if (joined.trim()) {
          applyText(joined);
        }
        setLoadedResumeTitle(r.title || '');
        // Optionally run analysis immediately when a saved resume is loaded
        if (joined.trim()) {
          analyze(id);
        }
      } catch (e) {
        console.error(e);
        showToast(e?.response?.data?.error || e.message || 'Failed to load saved resume', 'error');
      }
    })();
  }, []);

  const enhanceSection = async (key) => {
    const content = sections[key] || '';
    if (!content.trim()) return;
    setSectionEnhancing((s) => ({ ...s, [key]: true }));
    try {
      const { data } = await api.post('/resume/rewrite', { text: content });
      const rewritten = (data?.rewritten || '').trim();
      if (!rewritten) {
        showToast('Enhance returned empty text', 'error');
        return;
      }
      if (/^AI is offline/i.test(rewritten)) {
        showToast('AI is offline. Configure backend AI keys in .env to enable enhancements.', 'error');
        return;
      }
      setSections((s) => ({ ...s, [key]: rewritten }));
    } catch (e) {
      console.error(e);
      if (e.response?.status === 429) {
        showToast('Plan limit reached. Upgrade to continue.', 'error');
      } else {
        showToast('Enhance failed', 'error');
      }
    } finally {
      setSectionEnhancing((s) => ({ ...s, [key]: false }));
    }
  };

  // Contextual insertion of a single keyword into a section using backend rewrite
  const insertKeywordContextual = async (key, kw) => {
    const content = sections[key] || '';
    if (!content.trim() || !kw) return;
    try {
      const { data } = await api.post('/resume/rewrite', { text: content, keywords: [kw], section: key });
      const rewritten = (data?.rewritten || '').trim();
      if (!rewritten) {
        showToast('Keyword insertion returned empty text', 'error');
        return;
      }
      if (/^AI is offline/i.test(rewritten)) {
        showToast('AI is offline. Configure backend AI keys in .env to enable enhancements.', 'error');
        return;
      }
      setSections((prev) => ({ ...prev, [key]: rewritten }));
      // If the section had a score already, refresh it
      if (sectionScores[key]) {
        await scoreSection(key);
      }
    } catch (e) {
      console.error(e);
      if (e.response?.status === 429) {
        showToast('Plan limit reached. Upgrade to continue.', 'error');
      } else {
        showToast('Failed to insert keyword contextually', 'error');
      }
    }
  };

  const scoreSection = async (key) => {
    const content = sections[key] || '';
    if (!content.trim()) {
      showToast('Section is empty', 'info');
      return;
    }
    setSectionScoring((s) => ({ ...s, [key]: true }));
    try {
      const { data } = await api.post('/resume/analyze', { resumeText: content });
      const analysis = data?.analysis || {};
      setSectionScores((ss) => ({ ...ss, [key]: { score: analysis.atsScore || 0, message: analysis.atsMessage || null } }));
    } catch (e) {
      console.error(e);
      showToast('Section scoring failed', 'error');
    } finally {
      setSectionScoring((s) => ({ ...s, [key]: false }));
    }
  };

  const scoreAll = async () => {
    const keys = Object.keys(sections);
    if (keys.length === 0) return;
    setSectionScoring((s) => ({ ...s, __all: true }));
    setScoreAllProgress(0);
    try {
      let completed = 0;
      for (const key of keys) {
        await scoreSection(key);
        completed += 1;
        setScoreAllProgress(Math.round((completed / keys.length) * 100));
      }
    } finally {
      setSectionScoring((s) => ({ ...s, __all: false }));
    }
  };

  // Heuristic: map a suggestion to the most relevant section
  const suggestionTargetSection = useCallback((text) => {
    const t = (text || '').toLowerCase();
    if (/(skill|technology|stack|tools|framework|language)/.test(t)) return 'skills';
    if (/(experience|role|responsibilit|impact|results|metrics|achieve)/.test(t)) return 'experience';
    if (/(project|portfolio|open\s?source|hackathon)/.test(t)) return 'projects';
    if (/(achieve|award|recognition|certification)/.test(t)) return 'achievements';
    if (/(education|degree|university|course|certification)/.test(t)) return 'education';
    if (/(summary|objective|profile|headline)/.test(t)) return 'summary';
    return 'summary';
  }, []);

  // Add overall suggestion into appropriate section as a bullet
  const addSuggestion = useCallback(async (text) => {
    // Mark this overall suggestion as being added
    setAddingOverall((prev) => ({ ...prev, [text]: true }));
    try {
      const target = suggestionTargetSection(text);
      setSections((prev) => {
        const existing = prev[target] || '';
        const prefix = existing && !existing.endsWith('\n') ? '\n' : '';
        const updated = (existing || '') + `${prefix}- ${text}`;
        return { ...prev, [target]: updated };
      });
      // Remove it from the visible suggestions list
      setResult((prev) => {
        if (!prev) return prev;
        const nextSuggestions = (prev.suggestions || []).filter((s) => s !== text);
        return { ...prev, suggestions: nextSuggestions };
      });
    } finally {
      // Clear loading tracker (item will disappear from list)
      setAddingOverall((prev) => {
        const { [text]: _ignored, ...rest } = prev;
        return rest;
      });
    }
  }, [suggestionTargetSection]);

  // Add section-specific feedback into the given section as a bullet
  const addSectionSuggestion = useCallback(async (sectionKey, text) => {
    const id = `${sectionKey}::${text}`;
    setAddingSection((prev) => ({ ...prev, [id]: true }));
    try {
      setSections((prev) => {
        const existing = prev[sectionKey] || '';
        const prefix = existing && !existing.endsWith('\n') ? '\n' : '';
        const updated = (existing || '') + `${prefix}- ${text}`;
        return { ...prev, [sectionKey]: updated };
      });
      // Remove it from section feedback suggestions list
      setResult((prev) => {
        if (!prev) return prev;
        const items = prev.sectionFeedback?.[sectionKey];
        const arr = Array.isArray(items) ? items : (items ? [items] : []);
        const filtered = arr.filter((t) => t !== text);
        const nextSectionFeedback = { ...(prev.sectionFeedback || {}), [sectionKey]: filtered };
        return { ...prev, sectionFeedback: nextSectionFeedback };
      });
    } finally {
      setAddingSection((prev) => {
        const { [id]: _ignored, ...rest } = prev;
        return rest;
      });
    }
  }, []);

  const getSectionMissingKeywords = useCallback((key) => {
    const list = result?.sectionMissingKeywords?.[key];
    if (Array.isArray(list)) return list;
    return [];
  }, [result]);

  const addKeywordToSection = useCallback((key, kw) => {
    insertKeywordContextual(key, kw);
  }, [insertKeywordContextual]);

  return (
    <div className="page analysis">
      <div className="page-header">
        <h1>Analyze Resume</h1>
        <p className="muted">Upload or paste your resume; extract sections, and export PDF.</p>
      </div>
      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Analyze your resume content and structure, then export polished output.</p>
        <ol className="step-list">
          <li>Upload or paste your resume to parse content.</li>
          <li>Edit detected sections and improve ATS readiness.</li>
          <li>Export PDF or copy text for job tailoring.</li>
        </ol>
      </div>
      <div className="card shine no-print" style={{ marginTop: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div>
            <div><strong>Already have a resume?</strong> Upload or paste it below and analyze.</div>
            <div className="muted">New here? Create one in the Resume Builder first.</div>
            {loadedResumeTitle && (
              <div className="muted" style={{ marginTop: 6 }}>Loaded saved resume: {loadedResumeTitle}</div>
            )}
          </div>
          <Link to="/builder" className="btn cta gradient small">Go to Resume Builder</Link>
        </div>
        <div style={{ marginTop: 8 }}>
          <div className="muted">Next steps: after analysis, compare against a JD and tailor a cover letter.</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
            <Link to="/job-match" className="btn small">Open Job Match</Link>
            <Link to="/cover-letters" className="btn small">Generate Cover Letter</Link>
          </div>
        </div>
      </div>
      <div className="card">
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

        <label style={{ marginTop: 12 }}>Or paste text</label>
        <textarea rows={8} value={resumeText} onChange={(e) => applyText(e.target.value)} />
        <div style={{ marginTop: 12 }}>
          <button onClick={analyze} disabled={loading}>{loading ? 'Analyzing…' : 'Analyze'}</button>
        </div>
      </div>

      {Object.keys(sections).length > 0 && (
        <div className="builder-grid" style={{ marginTop: 16 }}>
          <div className="left">
            <div className="card section-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3>Section Editor</h3>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <button className="btn primary small" onClick={scoreAll} disabled={!!sectionScoring.__all}>{sectionScoring.__all ? 'Scoring All…' : 'Score All Sections'}</button>
                {sectionScoring.__all && (
                  <small className="muted">Progress: {scoreAllProgress}%</small>
                )}
              </div>
            </div>
            {Object.keys(sections).map((key) => (
              <section className="card" key={key}>
                <h3 style={{ textTransform: 'capitalize' }}>{key}</h3>
                {sectionScores[key] && (
                  <div className="muted" style={{ margin: '4px 0 8px' }}>
                    <span className="badge success">Section ATS: {sectionScores[key].score}%</span>
                    {sectionScores[key].message && (
                      <div className="good" style={{ marginTop: 4 }}>{sectionScores[key].message}</div>
                    )}
                  </div>
                )}
                {result?.sectionFeedback?.[key] && (
                  <div className="muted" style={{ marginBottom: 8 }}>
                    {(Array.isArray(result.sectionFeedback[key]) ? result.sectionFeedback[key] : [result.sectionFeedback[key]])
                      .slice(0, 3)
                      .map((f, i) => (<div key={i}>• {f}</div>))}
                  </div>
                )}
                {getSectionMissingKeywords(key).length > 0 && (
                  <div style={{ marginBottom: 8 }}>
                    <div style={{ fontWeight: 600 }}>Missing Keywords (this section)</div>
                    <div className="keywords" style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                      {getSectionMissingKeywords(key).map((kw, idx) => (
                        <div key={`${key}-kw-${idx}`} className="badge outline" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                          <span>{kw}</span>
                          <button className="btn small ghost" onClick={() => addKeywordToSection(key, kw)}>Add</button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <textarea rows={8} value={sections[key]} onChange={(e) => setSections((s) => ({ ...s, [key]: e.target.value }))} />
                <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                  <button className="ai-enhance" onClick={() => enhanceSection(key)} disabled={!!sectionEnhancing[key]}>
                    <Sparkles size={16} /> <span>{sectionEnhancing[key] ? 'Enhancing…' : 'Enhance'}</span>
                  </button>
                  <button className="btn ghost" onClick={() => scoreSection(key)} disabled={!!sectionScoring[key]}>
                    {sectionScoring[key] ? 'Scoring…' : 'Score Section'}
                  </button>
                </div>
              </section>
            ))}
          </div>
          <div className="right">
            <div className="card no-print">
              <h3>Header Info</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input placeholder="Full Name" value={header.name} onChange={(e) => setHeader((h) => ({ ...h, name: e.target.value }))} />
                <input placeholder="Degree (e.g., B.Tech CSE (AI))" value={header.degree} onChange={(e) => setHeader((h) => ({ ...h, degree: e.target.value }))} />
                <input placeholder="Location (City, Country)" value={header.location} onChange={(e) => setHeader((h) => ({ ...h, location: e.target.value }))} />
                <input placeholder="Phone" value={header.phone} onChange={(e) => setHeader((h) => ({ ...h, phone: e.target.value }))} />
                <input placeholder="Email" value={header.email} onChange={(e) => setHeader((h) => ({ ...h, email: e.target.value }))} />
                <input placeholder="LinkedIn URL" value={header.linkedin} onChange={(e) => setHeader((h) => ({ ...h, linkedin: e.target.value }))} />
                <input placeholder="GitHub URL" value={header.github} onChange={(e) => setHeader((h) => ({ ...h, github: e.target.value }))} />
              </div>
            </div>
            <div className="card no-print">
              <h3>Resume Quality</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${result?.atsScore || 0}%` }} />
              </div>
              <div className="muted" style={{ marginTop: 6 }}>
                {result ? `${result.atsScore}% complete` : 'Analyze to see progress'}
              </div>
              {showParty && (
                <div className="good" style={{ marginTop: 6 }}>🎉 100%! Great job!</div>
              )}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn primary small" onClick={() => window.print()}>Print</button>
                <button className="btn small" onClick={downloadResumePdf}>Download PDF</button>
              </div>
            </div>
            {result && (
              <div className="card" style={{ marginTop: 16 }}>
                <h3>ATS Analysis</h3>
                <div className="muted">Score: {result.atsScore}%</div>
                {(result.atsMessage || result.atsScore === 100) && (
                  <div className="good" style={{ marginTop: 6 }}>
                    {result.atsMessage || 'Great job! Your resume shows perfect ATS alignment.'}
                  </div>
                )}
                <h4 style={{ marginTop: 8 }}>Suggestions</h4>
                <ul>
                  {(result.suggestions || []).map((s, i) => (<li key={i}>{s}</li>))}
                </ul>
                <h4 style={{ marginTop: 8 }}>Missing Keywords</h4>
                <p>{(result.missingKeywords || []).join(', ') || '—'}</p>
              </div>
            )}

            {result?.improvements && (
              <div className="card" style={{ marginTop: 16 }}>
                <h3>Improvements</h3>
                <p className="muted">Exact, specific, and detailed feedback per section.</p>
                {Object.entries(result.improvements).map(([sec, items]) => (
                  <div key={`imp-${sec}`} style={{ marginTop: 10 }}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{sec}</div>
                    <ul style={{ marginTop: 6 }}>
                      {(Array.isArray(items) ? items : []).slice(0, 5).map((it, idx) => (
                        <li key={`${sec}-${idx}`} style={{ marginBottom: 6 }}>
                          <div><strong>Issue:</strong> {it.issue}</div>
                          <div><strong>Recommendation:</strong> {it.recommendation}</div>
                          <div><strong>Example:</strong> {it.example}</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <div className="card print-area no-print" ref={previewRef} style={{ position: 'absolute', left: '-9999px', top: '-9999px' }}>
         {/* Header Line */}
         {(() => {
           const parts = [header.name, header.degree, header.location, header.phone, header.email, header.linkedin, header.github]
             .filter((v) => (v || '').trim());
           return parts.length > 0 ? (
             <div className="header-line" style={{ fontWeight: 600 }}>
               {parts.join(' | ')}
             </div>
           ) : null;
         })()}

         {/* Summary */}
         <div style={{ marginTop: 12 }}>
           <h4>Professional Summary</h4>
           <div style={{ whiteSpace: 'pre-wrap' }}>{normalizedSections.summary || '—'}</div>
         </div>

         {/* Education */}
         <div style={{ marginTop: 12 }}>
           <h4>Education</h4>
           <div style={{ whiteSpace: 'pre-wrap' }}>{normalizedSections.education || '—'}</div>
         </div>

         {/* Technical Skills */}
         <div style={{ marginTop: 12 }}>
           <h4>Technical Skills</h4>
           <div>
             {(normalizedSections.skills || '').split(/\r?\n/).filter(Boolean).map((line, idx) => {
               const i = line.indexOf(':');
               if (i > 0) {
                 const label = line.slice(0, i).trim();
                 const rest = line.slice(i + 1).trim();
                 return (
                   <div key={`skill-${idx}`}>
                     <strong>{label}:</strong> <span>{rest}</span>
                   </div>
                 );
               }
               return <div key={`skill-${idx}`}>{line}</div>;
             })}
           </div>
         </div>

         {/* Projects */}
         <div style={{ marginTop: 12 }}>
           <h4>Projects</h4>
           <div style={{ whiteSpace: 'pre-wrap' }}>{normalizedSections.projects || '—'}</div>
         </div>

         {/* Experience */}
         <div style={{ marginTop: 12 }}>
           <h4>Experience / Internships</h4>
           <div style={{ whiteSpace: 'pre-wrap' }}>{normalizedSections.experience || '—'}</div>
         </div>

         {/* Achievements */}
         <div style={{ marginTop: 12 }}>
           <h4>Achievements / Leadership / Activities</h4>
           <div style={{ whiteSpace: 'pre-wrap' }}>{normalizedSections.achievements || '—'}</div>
         </div>
       </div>
      {/* Recommendations & Suggestions Panel */}
      {result && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Recommendations & Suggestions</h3>

          {/* Overall Suggestions */}
          {Array.isArray(result.suggestions) && result.suggestions.length > 0 && (
            <div style={{ marginTop: 8 }}>
              <h4>Overall Suggestions</h4>
              <ul>
                {result.suggestions.map((s, idx) => (
                  <li key={`overall-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span>{s}</span>
                    <button onClick={() => addSuggestion(s)} className="btn" style={{ whiteSpace: 'nowrap' }} disabled={!!addingOverall[s]}>
                      {addingOverall[s] ? 'Adding…' : 'Add'}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Section-wise Suggestions from Feedback */}
          {result.sectionFeedback && (
            <div style={{ marginTop: 12 }}>
              <h4>Section Suggestions</h4>
              {Object.entries(result.sectionFeedback).map(([key, items]) => (
                <div key={`fb-${key}`} style={{ marginTop: 8 }}>
                  <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>{key}</div>
                  <ul>
                    {(Array.isArray(items) ? items : [items]).filter(Boolean).map((text, idx) => (
                      <li key={`${key}-${idx}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                        <span>{text}</span>
                        <button onClick={() => addSectionSuggestion(key, text)} className="btn" style={{ whiteSpace: 'nowrap' }} disabled={!!addingSection[`${key}::${text}`]}>
                          {addingSection[`${key}::${text}`] ? 'Adding…' : 'Add'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      {showParty && (
        <div className="party-popup">
          <div className="confetti">
            <span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" />
            <span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" /><span className="confetti-piece" />
            <span className="confetti-piece" /><span className="confetti-piece" />
          </div>
          <div className="panel">
            <h3>Congratulations! 🎉</h3>
            <p>Your resume is 100% aligned. You can print or download it now.</p>
            <div className="party-actions">
              <button className="btn primary" onClick={() => window.print()}>Print</button>
              <button className="btn" onClick={downloadResumePdf}>Download PDF</button>
              <button className="btn ghost" onClick={() => setShowParty(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* moved inside component */