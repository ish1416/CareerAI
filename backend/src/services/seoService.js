import axios from 'axios';
import * as cheerio from 'cheerio';

class SEOService {
  constructor() {
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (compatible; SEOBot/1.0; +http://careerai.com/bot)'
    };
  }

  // Analyze page SEO
  async analyzePage(url) {
    try {
      const { data, headers } = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(data);
      
      return {
        url,
        title: $('title').text().trim(),
        titleLength: $('title').text().trim().length,
        metaDescription: $('meta[name="description"]').attr('content') || '',
        metaDescriptionLength: ($('meta[name="description"]').attr('content') || '').length,
        h1Count: $('h1').length,
        h1Text: $('h1').first().text().trim(),
        h2Count: $('h2').length,
        imageCount: $('img').length,
        imagesWithoutAlt: $('img:not([alt])').length,
        internalLinks: $('a[href^="/"], a[href*="' + new URL(url).hostname + '"]').length,
        externalLinks: $('a[href^="http"]:not([href*="' + new URL(url).hostname + '"])').length,
        wordCount: this.countWords($('body').text()),
        loadTime: headers['x-response-time'] || 'N/A',
        contentType: headers['content-type'] || 'N/A',
        statusCode: 200,
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('SEO analysis error:', error);
      return {
        url,
        error: error.message,
        statusCode: error.response?.status || 0,
        analyzedAt: new Date().toISOString()
      };
    }
  }

  // Keyword research
  async keywordResearch(seed, location = 'US') {
    try {
      // Simulate keyword research (in production, use Google Keyword Planner API)
      const keywords = [
        { keyword: seed, volume: 10000, difficulty: 45, cpc: 2.50 },
        { keyword: `${seed} jobs`, volume: 5000, difficulty: 35, cpc: 1.80 },
        { keyword: `${seed} salary`, volume: 3000, difficulty: 25, cpc: 1.20 },
        { keyword: `${seed} skills`, volume: 2000, difficulty: 30, cpc: 0.90 },
        { keyword: `${seed} career`, volume: 1500, difficulty: 40, cpc: 2.10 }
      ];

      return {
        seed,
        location,
        keywords,
        totalKeywords: keywords.length,
        averageVolume: Math.round(keywords.reduce((sum, k) => sum + k.volume, 0) / keywords.length),
        researchedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Keyword research error:', error);
      return null;
    }
  }

  // Competitor analysis
  async analyzeCompetitors(domain, competitors = []) {
    try {
      const analysis = {
        domain,
        competitors: [],
        analyzedAt: new Date().toISOString()
      };

      for (const competitor of competitors) {
        try {
          const competitorData = await this.analyzePage(`https://${competitor}`);
          analysis.competitors.push({
            domain: competitor,
            ...competitorData
          });
        } catch (error) {
          console.error(`Competitor analysis error for ${competitor}:`, error);
        }
      }

      return analysis;
    } catch (error) {
      console.error('Competitor analysis error:', error);
      return null;
    }
  }

  // Backlink analysis (simplified)
  async analyzeBacklinks(domain) {
    try {
      // In production, integrate with Ahrefs/SEMrush API
      return {
        domain,
        totalBacklinks: Math.floor(Math.random() * 10000) + 1000,
        referringDomains: Math.floor(Math.random() * 1000) + 100,
        domainRating: Math.floor(Math.random() * 100) + 1,
        topBacklinks: [
          { url: 'example.com/article', dr: 85, traffic: 50000 },
          { url: 'news.com/feature', dr: 78, traffic: 30000 },
          { url: 'blog.com/post', dr: 65, traffic: 15000 }
        ],
        analyzedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Backlink analysis error:', error);
      return null;
    }
  }

  // Technical SEO audit
  async technicalAudit(url) {
    try {
      const { data, headers } = await axios.get(url, { headers: this.headers });
      const $ = cheerio.load(data);

      return {
        url,
        https: url.startsWith('https://'),
        hasRobotsTxt: await this.checkRobotsTxt(url),
        hasSitemap: await this.checkSitemap(url),
        hasGoogleAnalytics: data.includes('google-analytics.com') || data.includes('gtag'),
        hasGoogleTagManager: data.includes('googletagmanager.com'),
        hasStructuredData: $('script[type="application/ld+json"]').length > 0,
        mobileViewport: $('meta[name="viewport"]').length > 0,
        canonicalUrl: $('link[rel="canonical"]').attr('href'),
        hreflang: $('link[rel="alternate"][hreflang]').length,
        openGraph: {
          title: $('meta[property="og:title"]').attr('content'),
          description: $('meta[property="og:description"]').attr('content'),
          image: $('meta[property="og:image"]').attr('content'),
          url: $('meta[property="og:url"]').attr('content')
        },
        twitterCard: {
          card: $('meta[name="twitter:card"]').attr('content'),
          title: $('meta[name="twitter:title"]').attr('content'),
          description: $('meta[name="twitter:description"]').attr('content')
        },
        auditedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Technical audit error:', error);
      return null;
    }
  }

  // Content optimization suggestions
  async optimizeContent(content, targetKeyword) {
    try {
      const wordCount = this.countWords(content);
      const keywordDensity = this.calculateKeywordDensity(content, targetKeyword);
      
      const suggestions = [];
      
      if (wordCount < 300) {
        suggestions.push('Content is too short. Aim for at least 300 words.');
      }
      
      if (keywordDensity < 0.5) {
        suggestions.push(`Keyword density is low (${keywordDensity.toFixed(2)}%). Include "${targetKeyword}" more naturally.`);
      }
      
      if (keywordDensity > 3) {
        suggestions.push(`Keyword density is too high (${keywordDensity.toFixed(2)}%). Reduce keyword usage to avoid over-optimization.`);
      }
      
      if (!content.toLowerCase().includes(targetKeyword.toLowerCase())) {
        suggestions.push(`Target keyword "${targetKeyword}" not found in content.`);
      }

      return {
        content: content.substring(0, 200) + '...',
        targetKeyword,
        wordCount,
        keywordDensity,
        suggestions,
        score: this.calculateContentScore(wordCount, keywordDensity, suggestions.length),
        optimizedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Content optimization error:', error);
      return null;
    }
  }

  // Helper methods
  countWords(text) {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  calculateKeywordDensity(content, keyword) {
    const words = content.toLowerCase().split(/\s+/);
    const keywordCount = words.filter(word => word.includes(keyword.toLowerCase())).length;
    return (keywordCount / words.length) * 100;
  }

  calculateContentScore(wordCount, keywordDensity, issueCount) {
    let score = 100;
    
    if (wordCount < 300) score -= 20;
    if (keywordDensity < 0.5 || keywordDensity > 3) score -= 15;
    score -= issueCount * 10;
    
    return Math.max(0, score);
  }

  async checkRobotsTxt(url) {
    try {
      const robotsUrl = new URL('/robots.txt', url).href;
      await axios.get(robotsUrl, { headers: this.headers });
      return true;
    } catch {
      return false;
    }
  }

  async checkSitemap(url) {
    try {
      const sitemapUrl = new URL('/sitemap.xml', url).href;
      await axios.get(sitemapUrl, { headers: this.headers });
      return true;
    } catch {
      return false;
    }
  }

  // Rank tracking
  async trackRankings(domain, keywords) {
    try {
      const rankings = [];
      
      for (const keyword of keywords) {
        // Simulate rank tracking (in production, use real SERP API)
        const rank = Math.floor(Math.random() * 100) + 1;
        rankings.push({
          keyword,
          rank,
          url: `https://${domain}/page`,
          change: Math.floor(Math.random() * 10) - 5 // -5 to +5 change
        });
      }

      return {
        domain,
        rankings,
        averageRank: Math.round(rankings.reduce((sum, r) => sum + r.rank, 0) / rankings.length),
        trackedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Rank tracking error:', error);
      return null;
    }
  }
}

export default SEOService;