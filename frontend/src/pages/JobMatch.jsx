import { useState, useEffect } from 'react';
import api from '../utils/api';
import { useToast } from '../components/Toast.jsx';

export default function JobMatch() {
  const [resumeText, setResumeText] = useState('');
  const [jdText, setJdText] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [jdUploading, setJdUploading] = useState(false);
  const [jdFileName, setJdFileName] = useState('');
  const [useSavedResume, setUseSavedResume] = useState(true);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeFileName, setResumeFileName] = useState('');
  const [savedResumes, setSavedResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    // Load saved resumes on component mount
    loadSavedResumes();
  }, []);

  const loadSavedResumes = async () => {
    setLoadingResumes(true);
    try {
      const { data } = await api.get('/resume/list');
      setSavedResumes(data.resumes || []);
      if (data.resumes && data.resumes.length > 0) {
        setSelectedResumeId(data.resumes[0].id);
      }
    } catch (e) {
      console.error(e);
      showToast('Failed to load saved resumes', 'error');
    } finally {
      setLoadingResumes(false);
    }
  };

  const compare = async () => {
    if (!jdText) return;
    setLoading(true);
    try {
      const payload = { jobDescription: jdText };
      
      if (useSavedResume) {
        if (selectedResumeId) {
          payload.resumeId = selectedResumeId;
        }
      } else if (resumeText) {
        payload.resumeText = resumeText;
      }
      
      const { data } = await api.post('/job/compare', payload);
      setResult(data.result);
    } catch (e) {
      console.error(e);
      showToast('Comparison failed: ' + (e?.response?.data?.error || 'Unknown error'), 'error');
    } finally {
      setLoading(false);
    }
  };

  const uploadJDFile = async (file) => {
    if (!file) return;
    setJdUploading(true);
    setJdFileName(file.name || '');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/job/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setJdText(data.text || '');
    } catch (e) {
      console.error(e);
      showToast('Failed to parse JD. Try another PDF/DOCX.', 'error');
    } finally {
      setJdUploading(false);
    }
  };

  const uploadResumeFile = async (file) => {
    if (!file) return;
    setResumeUploading(true);
    setResumeFileName(file.name || '');
    try {
      const fd = new FormData();
      fd.append('file', file);
      const { data } = await api.post('/resume/parse', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResumeText(data.text || '');
      setUseSavedResume(false);
    } catch (e) {
      console.error(e);
      showToast('Failed to parse resume. Try another PDF/DOCX.', 'error');
    } finally {
      setResumeUploading(false);
    }
  };

  return (
    <div className="page job-match">
      <div className="page-header">
        <h1>Job Description Matching</h1>
        <p className="muted">Compare your resume to a JD and get suggestions.</p>
      </div>
      <div className="section-intro">
        <h3 className="section-title">What This Section Does</h3>
        <p className="muted">Identify how well your resume matches a job description.</p>
        <ol className="step-list">
          <li>Upload or paste the job description.</li>
          <li>Choose to use your saved resume or upload a new one.</li>
          <li>Click Compare to see match %, missing keywords, and suggestions.</li>
        </ol>
      </div>
      <div className="grid">
        <div className="card">
          <h3>Resume</h3>
          
          <div className="resume-options">
            <div className="option">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '12px' }}>
                <input 
                  type="radio" 
                  checked={useSavedResume} 
                  onChange={() => setUseSavedResume(true)} 
                  name="resumeSource"
                />
                <span>Use saved resume</span>
              </label>
              
              {useSavedResume && (
                <div className="saved-resume-selector" style={{ marginLeft: '24px', marginBottom: '12px' }}>
                  <select 
                    value={selectedResumeId || ''} 
                    onChange={(e) => setSelectedResumeId(Number(e.target.value))}
                    disabled={loadingResumes || savedResumes.length === 0}
                    className="form-select"
                  >
                    {loadingResumes ? (
                      <option>Loading resumes...</option>
                    ) : savedResumes.length === 0 ? (
                      <option>No saved resumes found</option>
                    ) : (
                      savedResumes.map(resume => (
                        <option key={resume.id} value={resume.id}>
                          {resume.title || `Resume #${resume.id}`}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              )}
            </div>
            
            <div className="option">
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: '12px' }}>
                <input 
                  type="radio" 
                  checked={!useSavedResume} 
                  onChange={() => setUseSavedResume(false)} 
                  name="resumeSource"
                />
                <span>Upload new resume</span>
              </label>
              
              {!useSavedResume && (
                <div style={{ marginLeft: '24px' }}>
                  <label htmlFor="resume-file">Upload Resume (PDF/DOCX)</label>
                  <input 
                    id="resume-file" 
                    type="file" 
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
                    onChange={(e) => e.target.files[0] && uploadResumeFile(e.target.files[0])} 
                  />
                  <div className="muted" style={{ marginTop: 6 }}>
                    {resumeUploading ? 'Parsing…' : resumeFileName ? `Loaded: ${resumeFileName}` : 'Or paste resume text below'}
                  </div>
                  <textarea 
                    rows={10} 
                    value={resumeText} 
                    onChange={(e) => setResumeText(e.target.value)} 
                    placeholder="Paste your resume text here..."
                  />
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <h3>Job Description</h3>
          <label htmlFor="jd-file">Upload JD (PDF/DOCX)</label>
          <input 
            id="jd-file" 
            type="file" 
            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" 
            onChange={(e) => e.target.files[0] && uploadJDFile(e.target.files[0])} 
          />
          <div className="muted" style={{ marginTop: 6 }}>
            {jdUploading ? 'Parsing…' : jdFileName ? `Loaded: ${jdFileName}` : 'Or paste the JD below'}
          </div>
          <textarea 
            rows={10} 
            value={jdText} 
            onChange={(e) => setJdText(e.target.value)} 
            placeholder="Paste job description here..."
          />
        </div>
      </div>
      
      <div style={{ marginTop: 12 }}>
        <button 
          className="btn primary" 
          onClick={compare} 
          disabled={loading || !jdText || (useSavedResume && !selectedResumeId && savedResumes.length === 0) || (!useSavedResume && !resumeText)}
        >
          {loading ? 'Comparing…' : 'Compare'}
        </button>
      </div>
      
      {result && (
        <div className="card shine" style={{ marginTop: 16 }}>
          <h3>Match: {result.matchPercentage}%</h3>
          <h4>Missing Keywords</h4>
          <p>{(result.missingKeywords || []).join(', ') || '—'}</p>
          
          {result.keywordSuggestions && result.keywordSuggestions.length > 0 && (
            <div>
              <h4>Keyword Placement Suggestions</h4>
              <ul className="keyword-suggestions">
                {result.keywordSuggestions.map((item, i) => (
                  <li key={i}>
                    <strong>{item.keyword}</strong>: {item.suggestion}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <h4>Suggestions</h4>
          <ul>
            {(result.suggestions || []).map((s, i) => (<li key={i}>{s}</li>))}
          </ul>
        </div>
      )}
    </div>
  );
}