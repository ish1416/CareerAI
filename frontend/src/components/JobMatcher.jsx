import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, ExternalLink, Star, Filter } from 'lucide-react';
import api from '../utils/api.js';
import { useToast } from './Toast.jsx';

const JobMatcher = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('software engineer');
  const [location, setLocation] = useState('us');
  const [categories, setCategories] = useState([]);
  const { showToast } = useToast();

  const searchJobs = async (query = searchQuery, loc = location) => {
    try {
      setLoading(true);
      const { data } = await api.get('/job/search', {
        params: { query, location: loc, limit: 20 }
      });
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Job search error:', error);
      showToast('Failed to search jobs', 'error');
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data } = await api.get('/job/categories');
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Categories error:', error);
    }
  };

  useEffect(() => {
    searchJobs();
    loadCategories();
  }, []);

  const getMatchColor = (match) => {
    if (match >= 90) return 'text-green-600 bg-green-100';
    if (match >= 80) return 'text-blue-600 bg-blue-100';
    if (match >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI Job Matcher
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Find jobs that match your resume and skills with AI-powered recommendations
        </p>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr auto', gap: 'var(--space-3)' }}>
          <div>
            <input
              type="text"
              placeholder="Job title, skills, or company"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Location (us, uk, etc.)"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
          <button 
            className="btn primary" 
            onClick={() => searchJobs(searchQuery, location)}
            disabled={loading}
          >
            <Search size={16} />
            Search
          </button>
        </div>
      </div>

      {/* Job Results */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Finding matching jobs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map(job => (
            <div key={job.id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-3)' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 var(--space-1)', fontSize: 'var(--text-xl)', fontWeight: 'bold' }}>{job.title}</h3>
                  <p style={{ margin: '0 0 var(--space-2)', fontSize: 'var(--text-lg)', color: 'var(--text-soft)' }}>{job.company}</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <MapPin size={14} />
                      {job.location}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <DollarSign size={14} />
                      {job.salary}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}>
                      <Clock size={14} />
                      {job.contractType}
                    </span>
                  </div>
                </div>
                <button 
                  className="btn primary" 
                  onClick={() => window.open(job.url, '_blank')}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)' }}
                >
                  Apply Now
                  <ExternalLink size={14} />
                </button>
              </div>

              <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)', fontSize: 'var(--text-sm)' }}>
                {job.description?.substring(0, 200)}...
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)', marginBottom: 'var(--space-3)' }}>
                {job.skills?.slice(0, 5).map(skill => (
                  <span key={skill} style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    background: 'var(--muted)', 
                    borderRadius: 'var(--radius)', 
                    fontSize: 'var(--text-xs)' 
                  }}>
                    {skill}
                  </span>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                <span>Posted {new Date(job.postedDate).toLocaleDateString()}</span>
                <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                  <span style={{ color: 'var(--primary)' }}>{job.category}</span>
                  {job.remote && <span style={{ color: 'var(--success)' }}>Remote</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default JobMatcher;