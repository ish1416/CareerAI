import React, { useState } from 'react';
import { Search, Filter, MapPin, Calendar, Trophy, Users, Plus, Star, Clock, Target, Zap, Award } from 'lucide-react';

export default function ProProjects() {
  const [activeCategory, setActiveCategory] = useState('internships');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);

  const categories = [
    { id: 'internships', label: 'Internships', count: 24 },
    { id: 'hackathons', label: 'Hackathons', count: 12 },
    { id: 'teams', label: 'Team Projects', count: 8 },
    { id: 'certifications', label: 'Certifications', count: 15 }
  ];

  const internships = [
    {
      id: 1,
      title: 'Frontend Developer Intern',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'Remote',
      duration: '3 months',
      stipend: '$2,000/month',
      deadline: '2024-02-15',
      skills: ['React', 'JavaScript', 'CSS'],
      description: 'Work on cutting-edge web applications with our frontend team.',
      applicants: 45,
      match: 92
    },
    {
      id: 2,
      title: 'Data Science Intern',
      company: 'DataFlow Inc',
      location: 'New York, NY',
      type: 'Hybrid',
      duration: '6 months',
      stipend: '$2,500/month',
      deadline: '2024-02-20',
      skills: ['Python', 'Machine Learning', 'SQL'],
      description: 'Analyze large datasets and build predictive models.',
      applicants: 67,
      match: 78
    }
  ];

  const hackathons = [
    {
      id: 1,
      name: 'AI Innovation Challenge',
      organizer: 'TechHub',
      startDate: '2024-03-15',
      endDate: '2024-03-17',
      location: 'Virtual',
      prize: '$50,000',
      theme: 'Artificial Intelligence for Social Good',
      participants: 500,
      registrationDeadline: '2024-03-10',
      difficulty: 'Advanced'
    },
    {
      id: 2,
      name: 'Sustainable Tech Hackathon',
      organizer: 'GreenCode',
      startDate: '2024-04-01',
      endDate: '2024-04-03',
      location: 'Austin, TX',
      prize: '$25,000',
      theme: 'Climate Change Solutions',
      participants: 300,
      registrationDeadline: '2024-03-25',
      difficulty: 'Intermediate'
    }
  ];

  const teams = [
    {
      id: 1,
      name: 'EcoTracker App',
      description: 'Building a mobile app to track personal carbon footprint',
      lookingFor: ['UI/UX Designer', 'Backend Developer'],
      skills: ['React Native', 'Node.js', 'MongoDB'],
      members: 2,
      maxMembers: 4,
      stage: 'MVP Development',
      timeline: '3 months',
      commitment: '10-15 hours/week'
    },
    {
      id: 2,
      name: 'AI Study Buddy',
      description: 'AI-powered study companion for students',
      lookingFor: ['ML Engineer', 'Frontend Developer'],
      skills: ['Python', 'TensorFlow', 'React'],
      members: 3,
      maxMembers: 5,
      stage: 'Research Phase',
      timeline: '6 months',
      commitment: '15-20 hours/week'
    }
  ];

  const certifications = [
    {
      id: 1,
      name: 'AWS Solutions Architect',
      provider: 'Amazon Web Services',
      level: 'Associate',
      duration: '3-6 months',
      cost: '$150',
      skills: ['Cloud Computing', 'AWS', 'Architecture'],
      difficulty: 'Intermediate',
      passingRate: '65%',
      nextExam: '2024-03-01'
    },
    {
      id: 2,
      name: 'Google Data Analytics Certificate',
      provider: 'Google',
      level: 'Professional',
      duration: '3-6 months',
      cost: '$49/month',
      skills: ['Data Analysis', 'SQL', 'Tableau'],
      difficulty: 'Beginner',
      passingRate: '78%',
      nextExam: 'Self-paced'
    }
  ];

  const renderInternships = () => (
    <div className="pro-opportunities-grid">
      {internships.map((internship) => (
        <div key={internship.id} className="pro-opportunity-card">
          <div className="pro-opportunity-header">
            <div>
              <h3>{internship.title}</h3>
              <p className="pro-company">{internship.company}</p>
            </div>
            <div className="pro-match-score">
              <div className="pro-match-value">{internship.match}%</div>
              <div className="pro-match-label">Match</div>
            </div>
          </div>

          <div className="pro-opportunity-meta">
            <div className="pro-meta-item">
              <MapPin size={14} />
              <span>{internship.location}</span>
            </div>
            <div className="pro-meta-item">
              <Clock size={14} />
              <span>{internship.duration}</span>
            </div>
            <div className="pro-meta-item">
              <Star size={14} />
              <span>{internship.stipend}</span>
            </div>
            <div className="pro-meta-item">
              <Users size={14} />
              <span>{internship.applicants} applicants</span>
            </div>
          </div>

          <p className="pro-opportunity-desc">{internship.description}</p>

          <div className="pro-skills-tags">
            {internship.skills.map((skill) => (
              <span key={skill} className="pro-skill-tag">{skill}</span>
            ))}
          </div>

          <div className="pro-opportunity-footer">
            <div className="pro-deadline">
              <Calendar size={14} />
              <span>Deadline: {internship.deadline}</span>
            </div>
            <button className="pro-btn-primary">Apply Now</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderHackathons = () => (
    <div className="pro-opportunities-grid">
      {hackathons.map((hackathon) => (
        <div key={hackathon.id} className="pro-opportunity-card">
          <div className="pro-opportunity-header">
            <div>
              <h3>{hackathon.name}</h3>
              <p className="pro-company">by {hackathon.organizer}</p>
            </div>
            <div className="pro-prize">
              <Trophy size={16} />
              <span>{hackathon.prize}</span>
            </div>
          </div>

          <div className="pro-hackathon-details">
            <div className="pro-detail-row">
              <div className="pro-detail-item">
                <span className="pro-detail-label">Date</span>
                <span>{hackathon.startDate} - {hackathon.endDate}</span>
              </div>
              <div className="pro-detail-item">
                <span className="pro-detail-label">Location</span>
                <span>{hackathon.location}</span>
              </div>
            </div>
            <div className="pro-detail-row">
              <div className="pro-detail-item">
                <span className="pro-detail-label">Participants</span>
                <span>{hackathon.participants}</span>
              </div>
              <div className="pro-detail-item">
                <span className="pro-detail-label">Difficulty</span>
                <span className={`pro-difficulty ${hackathon.difficulty.toLowerCase()}`}>
                  {hackathon.difficulty}
                </span>
              </div>
            </div>
          </div>

          <div className="pro-theme-section">
            <span className="pro-theme-label">Theme</span>
            <p className="pro-theme-text">{hackathon.theme}</p>
          </div>

          <div className="pro-opportunity-footer">
            <div className="pro-deadline">
              <Calendar size={14} />
              <span>Register by: {hackathon.registrationDeadline}</span>
            </div>
            <button className="pro-btn-primary">Register</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTeams = () => (
    <div className="pro-opportunities-grid">
      {teams.map((team) => (
        <div key={team.id} className="pro-opportunity-card">
          <div className="pro-opportunity-header">
            <div>
              <h3>{team.name}</h3>
              <p className="pro-team-stage">{team.stage}</p>
            </div>
            <div className="pro-team-progress">
              <div className="pro-progress-circle">
                <span>{team.members}/{team.maxMembers}</span>
              </div>
            </div>
          </div>

          <p className="pro-opportunity-desc">{team.description}</p>

          <div className="pro-team-details">
            <div className="pro-detail-row">
              <div className="pro-detail-item">
                <span className="pro-detail-label">Timeline</span>
                <span>{team.timeline}</span>
              </div>
              <div className="pro-detail-item">
                <span className="pro-detail-label">Commitment</span>
                <span>{team.commitment}</span>
              </div>
            </div>
          </div>

          <div className="pro-looking-for">
            <span className="pro-section-label">Looking for:</span>
            <div className="pro-roles-tags">
              {team.lookingFor.map((role) => (
                <span key={role} className="pro-role-tag">{role}</span>
              ))}
            </div>
          </div>

          <div className="pro-skills-section">
            <span className="pro-section-label">Skills needed:</span>
            <div className="pro-skills-tags">
              {team.skills.map((skill) => (
                <span key={skill} className="pro-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="pro-opportunity-footer">
            <div className="pro-team-info">
              <Users size={14} />
              <span>{team.members} members</span>
            </div>
            <button className="pro-btn-primary">Join Team</button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCertifications = () => (
    <div className="pro-opportunities-grid">
      {certifications.map((cert) => (
        <div key={cert.id} className="pro-opportunity-card">
          <div className="pro-opportunity-header">
            <div>
              <h3>{cert.name}</h3>
              <p className="pro-company">{cert.provider}</p>
            </div>
            <div className="pro-cert-level">
              <Award size={16} />
              <span>{cert.level}</span>
            </div>
          </div>

          <div className="pro-cert-details">
            <div className="pro-detail-row">
              <div className="pro-detail-item">
                <span className="pro-detail-label">Duration</span>
                <span>{cert.duration}</span>
              </div>
              <div className="pro-detail-item">
                <span className="pro-detail-label">Cost</span>
                <span>{cert.cost}</span>
              </div>
            </div>
            <div className="pro-detail-row">
              <div className="pro-detail-item">
                <span className="pro-detail-label">Difficulty</span>
                <span className={`pro-difficulty ${cert.difficulty.toLowerCase()}`}>
                  {cert.difficulty}
                </span>
              </div>
              <div className="pro-detail-item">
                <span className="pro-detail-label">Pass Rate</span>
                <span>{cert.passingRate}</span>
              </div>
            </div>
          </div>

          <div className="pro-skills-section">
            <span className="pro-section-label">Skills covered:</span>
            <div className="pro-skills-tags">
              {cert.skills.map((skill) => (
                <span key={skill} className="pro-skill-tag">{skill}</span>
              ))}
            </div>
          </div>

          <div className="pro-opportunity-footer">
            <div className="pro-exam-info">
              <Calendar size={14} />
              <span>Next exam: {cert.nextExam}</span>
            </div>
            <button className="pro-btn-primary">Start Learning</button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="pro-container">
      {/* Header */}
      <div className="pro-header">
        <div>
          <h1 className="pro-title">Project Finder</h1>
          <p className="pro-subtitle">Discover opportunities that match your skills and interests</p>
        </div>
        <button className="pro-btn-primary">
          <Target size={16} />
          AI Match Projects
        </button>
      </div>

      {/* Search & Filters */}
      <div className="pro-search-section">
        <div className="pro-search-bar">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search opportunities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pro-search-input"
          />
        </div>
        <button className="pro-btn-secondary">
          <Filter size={16} />
          Filters
        </button>
      </div>

      {/* Categories */}
      <div className="pro-categories">
        {categories.map((category) => (
          <button
            key={category.id}
            className={`pro-category-btn ${activeCategory === category.id ? 'active' : ''}`}
            onClick={() => setActiveCategory(category.id)}
          >
            <span>{category.label}</span>
            <span className="pro-category-count">{category.count}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="pro-content">
        {activeCategory === 'internships' && renderInternships()}
        {activeCategory === 'hackathons' && renderHackathons()}
        {activeCategory === 'teams' && renderTeams()}
        {activeCategory === 'certifications' && renderCertifications()}
      </div>

      {/* Empty State for AI Matches */}
      {activeCategory === 'matches' && (
        <div className="pro-empty-state">
          <Target size={48} />
          <h3>No AI matches yet</h3>
          <p>Click "AI Match Projects" to find opportunities that perfectly match your profile</p>
          <button className="pro-btn-primary">
            <Zap size={16} />
            Find My Matches
          </button>
        </div>
      )}
    </div>
  );
}