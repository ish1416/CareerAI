import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, ExternalLink, Star, Filter } from 'lucide-react';

const JobMatcher = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    type: '',
    experience: ''
  });

  // Mock job data - in production, this would come from job APIs
  const mockJobs = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      salary: '$120k - $180k',
      type: 'Full-time',
      experience: 'Senior',
      match: 95,
      description: 'Join our team building next-generation web applications...',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
      posted: '2 days ago'
    },
    {
      id: 2,
      title: 'Frontend Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      salary: '$80k - $120k',
      type: 'Full-time',
      experience: 'Mid-level',
      match: 88,
      description: 'Build beautiful user interfaces for our SaaS platform...',
      skills: ['React', 'CSS', 'JavaScript', 'Figma'],
      posted: '1 week ago'
    },
    {
      id: 3,
      title: 'Full Stack Developer',
      company: 'InnovateLab',
      location: 'New York, NY',
      salary: '$90k - $140k',
      type: 'Contract',
      experience: 'Mid-level',
      match: 82,
      description: 'Work on cutting-edge fintech applications...',
      skills: ['Python', 'React', 'PostgreSQL', 'Docker'],
      posted: '3 days ago'
    }
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
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

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="City, State or Remote"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={filters.location}
                onChange={(e) => setFilters({...filters, location: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Salary Range
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={filters.salary}
              onChange={(e) => setFilters({...filters, salary: e.target.value})}
            >
              <option value="">Any Salary</option>
              <option value="50k-80k">$50k - $80k</option>
              <option value="80k-120k">$80k - $120k</option>
              <option value="120k+">$120k+</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Type
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={filters.type}
              onChange={(e) => setFilters({...filters, type: e.target.value})}
            >
              <option value="">Any Type</option>
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="part-time">Part-time</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Experience
            </label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={filters.experience}
              onChange={(e) => setFilters({...filters, experience: e.target.value})}
            >
              <option value="">Any Level</option>
              <option value="entry">Entry Level</option>
              <option value="mid">Mid Level</option>
              <option value="senior">Senior Level</option>
            </select>
          </div>
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
            <div key={job.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{job.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(job.match)}`}>
                      {job.match}% Match
                    </span>
                  </div>
                  <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">{job.company}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {job.salary}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Apply Now
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map(skill => (
                  <span key={skill} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-500">
                <span>Posted {job.posted}</span>
                <div className="flex items-center gap-4">
                  <button className="text-blue-600 hover:text-blue-700">Save Job</button>
                  <button className="text-blue-600 hover:text-blue-700">View Details</button>
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