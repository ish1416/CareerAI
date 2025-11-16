import axios from 'axios';
import * as cheerio from 'cheerio';

class WebScrapingService {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };
  }

  // Scrape job details from URL
  async scrapeJobDetails(jobUrl) {
    try {
      const { data } = await axios.get(jobUrl, { headers: this.headers });
      const $ = cheerio.load(data);
      
      // Generic selectors for common job sites
      const selectors = {
        title: ['h1', '.job-title', '[data-testid="job-title"]', '.jobsearch-JobInfoHeader-title'],
        company: ['.company', '.employer', '[data-testid="company-name"]', '.jobsearch-InlineCompanyRating'],
        location: ['.location', '.job-location', '[data-testid="job-location"]'],
        salary: ['.salary', '.pay', '[data-testid="salary"]', '.jobsearch-SalaryInfoContainer'],
        description: ['.job-description', '.description', '[data-testid="job-description"]', '#jobDescriptionText'],
        requirements: ['.requirements', '.qualifications', '.job-requirements']
      };

      const extractText = (selectors) => {
        for (const selector of selectors) {
          const element = $(selector).first();
          if (element.length) {
            return element.text().trim();
          }
        }
        return null;
      };

      return {
        title: extractText(selectors.title),
        company: extractText(selectors.company),
        location: extractText(selectors.location),
        salary: extractText(selectors.salary),
        description: extractText(selectors.description),
        requirements: extractText(selectors.requirements),
        url: jobUrl,
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Job scraping error:', error);
      return null;
    }
  }

  // Scrape company information
  async scrapeCompanyInfo(companyName) {
    try {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(companyName + ' company info')}`;
      const { data } = await axios.get(searchUrl, { headers: this.headers });
      const $ = cheerio.load(data);

      return {
        name: companyName,
        description: $('.BNeawe.s3v9rd.AP7Wnd').first().text().trim(),
        website: $('a[href*="http"]').first().attr('href'),
        industry: null, // Would need specific selectors
        size: null,
        founded: null,
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Company scraping error:', error);
      return null;
    }
  }

  // Scrape salary data from multiple sources
  async scrapeSalaryData(jobTitle, location = 'United States') {
    try {
      const sources = [];
      
      // Glassdoor-style scraping (simplified)
      const glassdoorUrl = `https://www.glassdoor.com/Salaries/${jobTitle.replace(/\s+/g, '-')}-salary-SRCH_KO0,${jobTitle.length}.htm`;
      
      try {
        const { data } = await axios.get(glassdoorUrl, { headers: this.headers });
        const $ = cheerio.load(data);
        
        const salary = $('.salary-estimate').first().text().trim();
        if (salary) {
          sources.push({
            source: 'Glassdoor',
            salary,
            url: glassdoorUrl
          });
        }
      } catch (err) {
        console.log('Glassdoor scraping failed:', err.message);
      }

      return {
        jobTitle,
        location,
        sources,
        averageSalary: this.calculateAverageSalary(sources),
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Salary scraping error:', error);
      return null;
    }
  }

  // Scrape trending skills and technologies
  async scrapeTrendingSkills() {
    try {
      const skills = [];
      
      // GitHub trending (simplified)
      try {
        const { data } = await axios.get('https://github.com/trending', { headers: this.headers });
        const $ = cheerio.load(data);
        
        $('.repo-language-color').each((i, el) => {
          const skill = $(el).next().text().trim();
          if (skill && !skills.includes(skill)) {
            skills.push(skill);
          }
        });
      } catch (err) {
        console.log('GitHub trending scraping failed:', err.message);
      }

      return {
        skills: skills.slice(0, 20),
        source: 'GitHub Trending',
        scrapedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Skills scraping error:', error);
      return { skills: [], source: 'fallback', scrapedAt: new Date().toISOString() };
    }
  }

  // Scrape job market insights
  async scrapeJobMarketInsights(industry) {
    try {
      const insights = {
        industry,
        growth: null,
        demand: null,
        topCompanies: [],
        averageSalary: null,
        scrapedAt: new Date().toISOString()
      };

      // Bureau of Labor Statistics (simplified)
      const blsUrl = `https://www.bls.gov/ooh/computer-and-information-technology/home.htm`;
      
      try {
        const { data } = await axios.get(blsUrl, { headers: this.headers });
        const $ = cheerio.load(data);
        
        // Extract growth data
        const growthText = $('.bls-ooh-outlook-growth').first().text();
        if (growthText) {
          insights.growth = growthText.trim();
        }
      } catch (err) {
        console.log('BLS scraping failed:', err.message);
      }

      return insights;
    } catch (error) {
      console.error('Market insights scraping error:', error);
      return null;
    }
  }

  // Helper methods
  calculateAverageSalary(sources) {
    if (!sources.length) return null;
    
    const salaries = sources.map(s => {
      const match = s.salary.match(/\$?([\d,]+)/);
      return match ? parseInt(match[1].replace(/,/g, '')) : 0;
    }).filter(s => s > 0);
    
    if (!salaries.length) return null;
    
    return Math.round(salaries.reduce((a, b) => a + b, 0) / salaries.length);
  }

  // Rate limiting helper
  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Batch scraping with rate limiting
  async batchScrape(urls, scrapeFunction, delayMs = 1000) {
    const results = [];
    
    for (const url of urls) {
      try {
        const result = await scrapeFunction(url);
        results.push(result);
        await this.delay(delayMs);
      } catch (error) {
        console.error(`Batch scraping error for ${url}:`, error);
        results.push(null);
      }
    }
    
    return results.filter(r => r !== null);
  }
}

export default WebScrapingService;