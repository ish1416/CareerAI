import React, { useState, useEffect } from 'react';
import { Search, MapPin, DollarSign, Clock, ExternalLink, Star, Filter, Bookmark, TrendingUp, Users, Building } from 'lucide-react';

const ProJobMatcher = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: '',
    salary: '',
    type: '',
    experience: '',
    remote: false
  });
  const [savedJobs, setSavedJobs] = useState(new Set());

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
      description: 'Join our team building next-generation web applications with React, Node.js, and cloud technologies.',
      skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker'],
      posted: '2 days ago',
      applicants: 45,
      companySize: '500-1000',
      remote: true,
      benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible PTO']
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
      description: 'Build beautiful user interfaces for our SaaS platform used by thousands of customers worldwide.',
      skills: ['React', 'CSS', 'JavaScript', 'Figma', 'Redux'],
      posted: '1 week ago',
      applicants: 23,
      companySize: '50-100',
      remote: true,
      benefits: ['Health Insurance', 'Remote Work', 'Learning Budget']
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
      description: 'Work on cutting-edge fintech applications handling millions of transactions daily.',
      skills: ['Python', 'React', 'PostgreSQL', 'Docker', 'Kubernetes'],
      posted: '3 days ago',
      applicants: 67,
      companySize: '200-500',
      remote: false,
      benefits: ['Health Insurance', 'Gym Membership', 'Catered Meals']
    }
  ];

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
  }, []);

  const getMatchColor = (match) => {
    if (match >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (match >= 80) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (match >= 70) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = new Set(savedJobs);
    if (newSavedJobs.has(jobId)) {
      newSavedJobs.delete(jobId);
    } else {
      newSavedJobs.add(jobId);
    }
    setSavedJobs(newSavedJobs);
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = !filters.location || job.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesType = !filters.type || job.type === filters.type;
    const matchesExperience = !filters.experience || job.experience === filters.experience;
    const matchesRemote = !filters.remote || job.remote;
    
    return matchesSearch && matchesLocation && matchesType && matchesExperience && matchesRemote;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Job Matcher</h1>
          <p className="text-gray-600">
            Find jobs that match your resume and skills with AI-powered recommendations
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search jobs by title, company, or keywords..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="City, State"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={filters.location}
                  onChange={(e) => setFilters({...filters, location: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
              >
                <option value="">Any Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
              <select 
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.experience}
                onChange={(e) => setFilters({...filters, experience: e.target.value})}
              >
                <option value="">Any Level</option>
                <option value="Entry">Entry Level</option>
                <option value="Mid-level">Mid Level</option>
                <option value="Senior">Senior Level</option>
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={filters.remote}
                  onChange={(e) => setFilters({...filters, remote: e.target.checked})}
                />
                Remote Only
              </label>
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredJobs.length}</span> matching jobs
          </p>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Best Match</option>
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
            </select>
          </div>
        </div>

        {/* Job Results */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Finding matching jobs...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map(job => (
              <div key={job.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getMatchColor(job.match)}`}>
                        {job.match}% Match
                      </span>
                      {job.remote && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-md text-xs font-medium">
                          Remote
                        </span>
                      )}
                    </div>
                    <p className="text-lg text-gray-700 mb-3">{job.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
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
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {job.applicants} applicants
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-4 h-4" />
                        {job.companySize} employees
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => toggleSaveJob(job.id)}
                      className={`p-2 rounded-md border transition-colors ${
                        savedJobs.has(job.id) 
                          ? 'bg-blue-50 border-blue-200 text-blue-600' 
                          : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">{job.description}</p>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.skills.map(skill => (
                    <span key={skill} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Benefits */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Benefits:</h4>
                  <div className="flex flex-wrap gap-2">
                    {job.benefits.map(benefit => (
                      <span key={benefit} className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs">
                        {benefit}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
                  <span>Posted {job.posted}</span>
                  <div className="flex items-center gap-4">
                    <button className="text-blue-600 hover:text-blue-700 font-medium">View Company</button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Similar Jobs</button>
                    <button className="text-blue-600 hover:text-blue-700 font-medium">Job Details</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Clear all filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProJobMatcher;