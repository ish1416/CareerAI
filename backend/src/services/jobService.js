import axios from 'axios';

class JobService {
  constructor() {
    this.adzunaAppId = process.env.ADZUNA_APP_ID;
    this.adzunaAppKey = process.env.ADZUNA_APP_KEY;
    this.baseURL = 'https://api.adzuna.com/v1/api/jobs';
  }

  // Search jobs using Adzuna API
  async searchJobs(query, location = 'us', page = 1, resultsPerPage = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/${location}/search/${page}`, {
        params: {
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey,
          what: query,
          results_per_page: resultsPerPage,
          sort_by: 'relevance'
        }
      });

      return {
        jobs: response.data.results.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          description: job.description,
          salary: this.formatSalary(job.salary_min, job.salary_max),
          salaryMin: job.salary_min,
          salaryMax: job.salary_max,
          url: job.redirect_url,
          postedDate: job.created,
          category: job.category.label,
          contractType: job.contract_type || 'Full-time',
          remote: job.location.display_name.toLowerCase().includes('remote'),
          skills: this.extractSkills(job.description),
          provider: 'Adzuna'
        })),
        totalResults: response.data.count,
        currentPage: page,
        totalPages: Math.ceil(response.data.count / resultsPerPage)
      };
    } catch (error) {
      console.error('Job search error:', error);
      return this.getFallbackJobs(query);
    }
  }

  // Get jobs by location
  async getJobsByLocation(location, limit = 20) {
    try {
      const response = await axios.get(`${this.baseURL}/us/search/1`, {
        params: {
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey,
          where: location,
          results_per_page: limit,
          sort_by: 'date'
        }
      });

      return response.data.results.map(job => ({
        id: job.id,
        title: job.title,
        company: job.company.display_name,
        location: job.location.display_name,
        salary: this.formatSalary(job.salary_min, job.salary_max),
        url: job.redirect_url,
        postedDate: job.created,
        category: job.category.label
      }));
    } catch (error) {
      console.error('Jobs by location error:', error);
      return this.getFallbackJobsByLocation(location);
    }
  }

  // Get salary statistics
  async getSalaryStats(jobTitle, location = 'us') {
    try {
      const response = await axios.get(`${this.baseURL}/${location}/histogram`, {
        params: {
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey,
          what: jobTitle
        }
      });

      return {
        average: response.data.histogram.reduce((sum, item) => sum + (item.salary * item.count), 0) / 
                response.data.histogram.reduce((sum, item) => sum + item.count, 0),
        min: Math.min(...response.data.histogram.map(item => item.salary)),
        max: Math.max(...response.data.histogram.map(item => item.salary)),
        distribution: response.data.histogram
      };
    } catch (error) {
      console.error('Salary stats error:', error);
      return this.getFallbackSalaryStats(jobTitle);
    }
  }

  // Get job categories
  async getJobCategories() {
    try {
      const response = await axios.get(`${this.baseURL}/us/categories`, {
        params: {
          app_id: this.adzunaAppId,
          app_key: this.adzunaAppKey
        }
      });

      return response.data.results.map(category => ({
        id: category.tag,
        name: category.label,
        count: category.count || 0
      }));
    } catch (error) {
      console.error('Job categories error:', error);
      return this.getFallbackCategories();
    }
  }

  // Get trending jobs
  async getTrendingJobs(limit = 10) {
    try {
      const trendingQueries = ['software engineer', 'data scientist', 'product manager', 'designer'];
      const allJobs = [];

      for (const query of trendingQueries) {
        const result = await this.searchJobs(query, 'us', 1, 5);
        allJobs.push(...result.jobs);
      }

      return allJobs.slice(0, limit);
    } catch (error) {
      console.error('Trending jobs error:', error);
      return this.getFallbackTrendingJobs();
    }
  }

  // Helper methods
  formatSalary(min, max) {
    if (!min && !max) return 'Salary not specified';
    if (min && max) return `$${Math.round(min/1000)}k - $${Math.round(max/1000)}k`;
    if (min) return `$${Math.round(min/1000)}k+`;
    if (max) return `Up to $${Math.round(max/1000)}k`;
    return 'Competitive';
  }

  extractSkills(description) {
    const commonSkills = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'Docker',
      'Kubernetes', 'Git', 'HTML', 'CSS', 'TypeScript', 'MongoDB', 'PostgreSQL',
      'Machine Learning', 'Data Analysis', 'Project Management', 'Agile', 'Scrum'
    ];

    return commonSkills.filter(skill => 
      description.toLowerCase().includes(skill.toLowerCase())
    );
  }

  // Fallback data
  getFallbackJobs(query) {
    return {
      jobs: [
        {
          id: '1',
          title: `${query} Developer`,
          company: 'Tech Corp',
          location: 'San Francisco, CA',
          description: `Looking for a skilled ${query} developer to join our team.`,
          salary: '$80k - $120k',
          salaryMin: 80000,
          salaryMax: 120000,
          url: '#',
          postedDate: new Date().toISOString(),
          category: 'Technology',
          contractType: 'Full-time',
          remote: false,
          skills: ['JavaScript', 'React', 'Node.js'],
          provider: 'Adzuna'
        }
      ],
      totalResults: 1,
      currentPage: 1,
      totalPages: 1
    };
  }

  getFallbackJobsByLocation(location) {
    return [
      {
        id: '1',
        title: 'Software Engineer',
        company: 'Local Tech',
        location: location,
        salary: '$70k - $100k',
        url: '#',
        postedDate: new Date().toISOString(),
        category: 'Technology'
      }
    ];
  }

  getFallbackSalaryStats(jobTitle) {
    return {
      average: 85000,
      min: 60000,
      max: 150000,
      distribution: [
        { salary: 70000, count: 10 },
        { salary: 85000, count: 25 },
        { salary: 100000, count: 15 }
      ]
    };
  }

  getFallbackCategories() {
    return [
      { id: 'it-jobs', name: 'IT Jobs', count: 1500 },
      { id: 'engineering-jobs', name: 'Engineering', count: 800 },
      { id: 'sales-jobs', name: 'Sales', count: 600 },
      { id: 'marketing-jobs', name: 'Marketing', count: 400 }
    ];
  }

  getFallbackTrendingJobs() {
    return [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechStart',
        location: 'Remote',
        salary: '$100k - $140k',
        category: 'Technology',
        provider: 'Adzuna'
      }
    ];
  }
}

export default JobService;