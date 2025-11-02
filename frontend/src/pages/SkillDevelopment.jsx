import React, { useState, useEffect } from 'react';
import { BookOpen, TrendingUp, Target, ExternalLink, Play, CheckCircle } from 'lucide-react';
import { useToast } from '../components/Toast.jsx';
import api from '../utils/api.js';

export default function SkillDevelopment() {
  const [skillGaps, setSkillGaps] = useState([]);
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadSkillData();
  }, []);

  const loadSkillData = async () => {
    try {
      const { data } = await api.get('/ai/skills/analysis');
      setSkillGaps(data.skillGaps || []);
      setLearningPaths(data.learningPaths || []);
    } catch (error) {
      showToast('Failed to load skill analysis', 'error');
    } finally {
      setLoading(false);
    }
  };

  const analyzeSkillGaps = async () => {
    if (!selectedJob.trim()) {
      showToast('Please enter a job title or description', 'error');
      return;
    }

    setAnalyzing(true);
    try {
      const { data } = await api.post('/ai/skills/analyze', { jobDescription: selectedJob });
      setSkillGaps(data.skillGaps || []);
      setLearningPaths(data.learningPaths || []);
      showToast('Skill analysis completed!', 'success');
    } catch (error) {
      showToast('Failed to analyze skills', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  const markResourceCompleted = async (pathId, resourceId) => {
    try {
      await api.patch(`/ai/skills/learning-paths/${pathId}/resources/${resourceId}`, { completed: true });
      setLearningPaths(prev => prev.map(path => 
        path.id === pathId ? {
          ...path,
          resources: path.resources.map(resource =>
            resource.id === resourceId ? { ...resource, completed: true } : resource
          )
        } : path
      ));
      showToast('Resource marked as completed!', 'success');
    } catch (error) {
      showToast('Failed to update progress', 'error');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-4)' }}>
        <div className="skeleton card" style={{ height: '200px' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--space-4)', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-6)' }}>
        <h1 style={{ fontSize: 'var(--text-4xl)', margin: '0 0 var(--space-2)', fontWeight: 800 }}>
          Skill Development 📚
        </h1>
        <p style={{ color: 'var(--text-soft)', fontSize: 'var(--text-lg)', margin: 0 }}>
          Identify skill gaps and get personalized learning recommendations
        </p>
      </div>

      {/* Skill Gap Analysis */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
        <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
          Skill Gap Analysis
        </h2>
        
        <div style={{ marginBottom: 'var(--space-4)' }}>
          <label>Target Job Title or Description</label>
          <textarea
            rows={3}
            value={selectedJob}
            onChange={(e) => setSelectedJob(e.target.value)}
            placeholder="Enter a job title (e.g., 'Senior React Developer') or paste a job description..."
          />
        </div>
        
        <button 
          className="btn primary"
          onClick={analyzeSkillGaps}
          disabled={analyzing || !selectedJob.trim()}
          style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}
        >
          <Target size={16} />
          {analyzing ? 'Analyzing...' : 'Analyze Skill Gaps'}
        </button>
      </div>

      {/* Skill Gaps Results */}
      {skillGaps.length > 0 && (
        <div className="card" style={{ marginBottom: 'var(--space-6)', padding: 'var(--space-5)' }}>
          <h3 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            Identified Skill Gaps
          </h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: 'var(--space-3)'
          }}>
            {skillGaps.map((skill, index) => (
              <div key={index} style={{
                padding: 'var(--space-3)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                background: 'var(--bg-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', fontWeight: 600 }}>
                    {skill.name}
                  </h4>
                  <div style={{
                    background: skill.priority === 'high' ? 'var(--error-bg)' : 
                               skill.priority === 'medium' ? 'var(--warning-bg)' : 'var(--info-bg)',
                    color: skill.priority === 'high' ? 'var(--error)' : 
                           skill.priority === 'medium' ? 'var(--warning)' : 'var(--info)',
                    padding: 'var(--space-1) var(--space-2)',
                    borderRadius: 'var(--radius)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600
                  }}>
                    {skill.priority}
                  </div>
                </div>
                <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                  {skill.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Paths */}
      {learningPaths.length > 0 && (
        <div>
          <h2 style={{ margin: '0 0 var(--space-4)', fontSize: 'var(--text-2xl)', fontWeight: 700 }}>
            Recommended Learning Paths
          </h2>
          
          <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
            {learningPaths.map(path => (
              <LearningPathCard 
                key={path.id} 
                path={path} 
                onMarkCompleted={markResourceCompleted}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {skillGaps.length === 0 && learningPaths.length === 0 && !loading && (
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-8)',
          border: '2px dashed var(--border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--bg-subtle)'
        }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: 'var(--space-3)' }} />
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)' }}>
            Start Your Skill Analysis
          </h3>
          <p style={{ margin: '0 0 var(--space-4)', color: 'var(--text-soft)' }}>
            Enter a target job description above to identify skill gaps and get personalized learning recommendations
          </p>
        </div>
      )}
    </div>
  );
}

function LearningPathCard({ path, onMarkCompleted }) {
  const [expanded, setExpanded] = useState(false);
  
  const completedResources = path.resources?.filter(r => r.completed).length || 0;
  const totalResources = path.resources?.length || 0;
  const progressPercentage = totalResources > 0 ? (completedResources / totalResources) * 100 : 0;

  return (
    <div className="card" style={{ padding: 'var(--space-5)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
        <div>
          <h3 style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-xl)', fontWeight: 700 }}>
            {path.title}
          </h3>
          <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>
            {path.description}
          </p>
        </div>
        
        <div style={{
          background: 'var(--primary-bg)',
          color: 'var(--primary)',
          padding: 'var(--space-2) var(--space-3)',
          borderRadius: 'var(--radius)',
          fontSize: 'var(--text-sm)',
          fontWeight: 600
        }}>
          {path.estimatedHours}h
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: 'var(--space-1)'
        }}>
          <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Progress</span>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--primary)' }}>
            {completedResources}/{totalResources} completed
          </span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          background: 'var(--muted)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: 'var(--primary)',
            transition: 'width var(--transition-base)'
          }} />
        </div>
      </div>

      {/* Toggle Resources */}
      <button 
        className="btn ghost"
        onClick={() => setExpanded(!expanded)}
        style={{ marginBottom: expanded ? 'var(--space-4)' : 0 }}
      >
        {expanded ? 'Hide' : 'Show'} Resources ({totalResources})
      </button>

      {/* Resources List */}
      {expanded && path.resources && (
        <div style={{ display: 'grid', gap: 'var(--space-3)' }}>
          {path.resources.map(resource => (
            <div key={resource.id} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-3)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              background: resource.completed ? 'var(--success-bg)' : 'var(--bg-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: resource.completed ? 'var(--success)' : 'var(--primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {resource.completed ? 
                    <CheckCircle size={16} color="white" /> : 
                    <Play size={16} color="white" />
                  }
                </div>
                
                <div>
                  <h4 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-base)', fontWeight: 600 }}>
                    {resource.title}
                  </h4>
                  <p style={{ margin: 0, fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    {resource.type} • {resource.duration}
                  </p>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {resource.url && (
                  <a 
                    href={resource.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="btn small secondary"
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                  >
                    <ExternalLink size={14} />
                    Open
                  </a>
                )}
                
                {!resource.completed && (
                  <button 
                    className="btn small primary"
                    onClick={() => onMarkCompleted(path.id, resource.id)}
                  >
                    Mark Complete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}