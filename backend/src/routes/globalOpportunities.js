import express from 'express';
import { groqChat } from '../utils/groqClient.js';
const router = express.Router();

// Get global job opportunities
router.get('/jobs', async (req, res) => {
  try {
    const opportunities = [
      {
        title: "Senior Software Engineer",
        company: "Google Canada",
        location: "Toronto, Canada",
        country: "Canada",
        salary: "CAD $120,000 - $160,000",
        match: 92,
        visaSponsorship: true,
        skills: ["React", "Node.js", "Python", "AWS", "Kubernetes"]
      },
      {
        title: "Full Stack Developer",
        company: "SAP Germany",
        location: "Berlin, Germany",
        country: "Germany",
        salary: "€70,000 - €90,000",
        match: 87,
        visaSponsorship: true,
        skills: ["JavaScript", "Vue.js", "Java", "Docker", "PostgreSQL"]
      },
      {
        title: "Tech Lead",
        company: "Atlassian",
        location: "Sydney, Australia",
        country: "Australia",
        salary: "AUD $140,000 - $180,000",
        match: 83,
        visaSponsorship: true,
        skills: ["Leadership", "React", "Microservices", "AWS", "Agile"]
      },
      {
        title: "Software Architect",
        company: "Grab",
        location: "Singapore",
        country: "Singapore",
        salary: "SGD $100,000 - $140,000",
        match: 78,
        visaSponsorship: false,
        skills: ["System Design", "Java", "Kubernetes", "Distributed Systems"]
      }
    ];

    res.json({ opportunities });
  } catch (error) {
    console.error('Global opportunities error:', error);
    res.status(500).json({ error: 'Failed to load global opportunities' });
  }
});

// Get relocation readiness score
router.get('/readiness', async (req, res) => {
  try {
    const readinessScore = {
      score: 78,
      level: "High Readiness",
      description: "Strong candidate for international relocation with good skill match and experience"
    };

    res.json(readinessScore);
  } catch (error) {
    console.error('Readiness score error:', error);
    res.status(500).json({ error: 'Failed to load readiness score' });
  }
});

// Check visa eligibility
router.post('/visa-check', async (req, res) => {
  try {
    const { country } = req.body;
    
    // Mock visa information based on country
    const visaData = {
      "Canada": {
        eligible: true,
        recommendedVisa: "Express Entry - Federal Skilled Worker",
        processingTime: "6-8 months",
        requirements: [
          "IELTS score of 7.0 or higher",
          "Educational Credential Assessment (ECA)",
          "Minimum 1 year work experience",
          "Proof of funds (CAD $13,310 for single applicant)"
        ]
      },
      "Germany": {
        eligible: true,
        recommendedVisa: "EU Blue Card",
        processingTime: "2-3 months",
        requirements: [
          "University degree or equivalent qualification",
          "Job offer with salary ≥ €56,800/year",
          "German language skills (B1 level preferred)",
          "Health insurance coverage"
        ]
      },
      "Australia": {
        eligible: true,
        recommendedVisa: "Skilled Independent Visa (189)",
        processingTime: "8-12 months",
        requirements: [
          "Skills assessment for nominated occupation",
          "IELTS score of 6.0 or higher",
          "Age under 45 years",
          "Meet health and character requirements"
        ]
      }
    };

    const visaInfo = visaData[country] || {
      eligible: false,
      recommendedVisa: "Tourist Visa",
      processingTime: "2-4 weeks",
      requirements: ["Valid passport", "Proof of funds", "Return ticket"]
    };

    res.json(visaInfo);
  } catch (error) {
    console.error('Visa check error:', error);
    res.status(500).json({ error: 'Failed to check visa eligibility' });
  }
});

export default router;