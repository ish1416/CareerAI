import React, { useState, useRef, useEffect } from 'react';
import { Video, Play, Pause, Square, Upload, Download, Mic, MicOff, Camera, CameraOff } from 'lucide-react';
import api from '../utils/api.js';

export default function VideoResume() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordedVideo, setRecordedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [avatarMode, setAvatarMode] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('professional');
  const [script, setScript] = useState('');
  const [generatedScript, setGeneratedScript] = useState('');
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    loadResumeData();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const loadResumeData = async () => {
    try {
      const { data } = await api.get('/video-resume/script');
      setGeneratedScript(data.script);
      setScript(data.script);
    } catch (error) {
      console.error('Failed to load resume data:', error);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: videoEnabled,
        audio: audioEnabled
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Failed to access camera:', error);
    }
  };

  const startRecording = async () => {
    if (!streamRef.current) {
      await startCamera();
    }
    
    const mediaRecorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = mediaRecorder;
    
    const chunks = [];
    mediaRecorder.ondataavailable = (event) => {
      chunks.push(event.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      setRecordedVideo(blob);
      setVideoUrl(url);
    };
    
    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const generateAvatarVideo = async () => {
    try {
      const { data } = await api.post('/video-resume/generate-avatar', {
        script,
        avatar: selectedAvatar,
        voiceStyle: 'professional'
      });
      setVideoUrl(data.videoUrl);
    } catch (error) {
      console.error('Failed to generate avatar video:', error);
    }
  };

  const uploadVideo = async () => {
    if (!recordedVideo) return;
    
    const formData = new FormData();
    formData.append('video', recordedVideo);
    formData.append('script', script);
    
    try {
      const { data } = await api.post('/video-resume/upload', formData);
      console.log('Video uploaded:', data);
    } catch (error) {
      console.error('Failed to upload video:', error);
    }
  };

  return (
    <div className="main-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
        <Video size={32} color="var(--primary)" />
        <div>
          <h1>AI Video Resume Generator</h1>
          <p style={{ color: 'var(--text-soft)' }}>Create professional video resumes with AI avatars or record yourself</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-6)' }}>
        {/* Recording/Preview Area */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Video Recording</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input 
                  type="checkbox" 
                  checked={avatarMode}
                  onChange={(e) => setAvatarMode(e.target.checked)}
                />
                AI Avatar Mode
              </label>
            </div>
          </div>

          <div className="card" style={{ padding: 0, overflow: 'hidden', minHeight: '400px' }}>
            {!avatarMode ? (
              <video
                ref={videoRef}
                autoPlay
                muted
                style={{ width: '100%', height: '400px', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ 
                height: '400px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-end) 100%)',
                color: 'white'
              }}>
                <div style={{ textAlign: 'center' }}>
                  <Video size={64} style={{ margin: '0 auto var(--space-4)' }} />
                  <h4>AI Avatar Preview</h4>
                  <p>Select avatar and generate video</p>
                </div>
              </div>
            )}
          </div>

          {/* Recording Controls */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
            {!avatarMode ? (
              <>
                <button 
                  className="btn secondary"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Mic size={16} /> : <MicOff size={16} />}
                </button>
                <button 
                  className="btn secondary"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <Camera size={16} /> : <CameraOff size={16} />}
                </button>
                {!isRecording ? (
                  <button className="btn primary" onClick={startRecording}>
                    <Play size={16} />
                    Start Recording
                  </button>
                ) : (
                  <button className="btn secondary" onClick={stopRecording}>
                    <Square size={16} />
                    Stop Recording
                  </button>
                )}
              </>
            ) : (
              <button className="btn primary" onClick={generateAvatarVideo}>
                <Video size={16} />
                Generate Avatar Video
              </button>
            )}
          </div>

          {/* Avatar Selection */}
          {avatarMode && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h4>Select Avatar</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-2)' }}>
                {['professional', 'friendly', 'confident'].map(avatar => (
                  <button
                    key={avatar}
                    className={`btn ${selectedAvatar === avatar ? 'primary' : 'ghost'} small`}
                    onClick={() => setSelectedAvatar(avatar)}
                  >
                    {avatar}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Script Editor */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Video Script</h3>
            <button 
              className="btn ghost small"
              onClick={loadResumeData}
            >
              Generate from Resume
            </button>
          </div>

          <div className="card">
            <textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter your video resume script..."
              style={{ 
                width: '100%', 
                minHeight: '300px', 
                border: 'none', 
                resize: 'vertical',
                background: 'transparent'
              }}
            />
          </div>

          {/* Generated Script Template */}
          {generatedScript && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h4>AI Generated Script</h4>
              <div className="card" style={{ background: 'var(--muted)' }}>
                <p style={{ fontSize: 'var(--text-sm)', whiteSpace: 'pre-line' }}>
                  {generatedScript}
                </p>
                <button 
                  className="btn ghost small"
                  onClick={() => setScript(generatedScript)}
                  style={{ marginTop: 'var(--space-2)' }}
                >
                  Use This Script
                </button>
              </div>
            </div>
          )}

          {/* Video Actions */}
          {videoUrl && (
            <div style={{ marginTop: 'var(--space-4)' }}>
              <h4>Video Actions</h4>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <button className="btn primary small" onClick={uploadVideo}>
                  <Upload size={14} />
                  Save Video
                </button>
                <a 
                  href={videoUrl} 
                  download="video-resume.webm"
                  className="btn secondary small"
                >
                  <Download size={14} />
                  Download
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Video Preview */}
      {videoUrl && (
        <div style={{ marginTop: 'var(--space-6)' }}>
          <h3>Video Preview</h3>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <video
              src={videoUrl}
              controls
              style={{ width: '100%', maxHeight: '400px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}