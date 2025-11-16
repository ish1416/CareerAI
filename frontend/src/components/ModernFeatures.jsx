import React from 'react';
import { 
  FileText, 
  Zap, 
  Target, 
  BarChart3, 
  MessageSquare, 
  Download,
  Users,
  BookOpen,
  Trophy,
  Calendar,
  Search,
  Brain
} from 'lucide-react';
import ModernFeatureCard from './ModernFeatureCard';

export default function ModernFeatures() {
  const featureGroups = [
    {
      title: 'Core Features',
      description: 'Essential tools to build and optimize your resume',
      features: [
        {
          icon: FileText,
          title: 'Resume Builder',
          description: 'Intuitive drag-and-drop builder with professional templates and real-time preview.',
          badge: 'Popular'
        },
        {
          icon: Zap,
          title: 'AI Analysis',
          description: 'Instant AI-powered feedback on content, structure, and ATS compatibility.',
          badge: 'AI'
        },
        {
          icon: Target,
          title: 'Job Matching',
          description: 'Compare your resume against job descriptions for better optimization.',
        },
        {
          icon: BarChart3,
          title: 'ATS Scoring',
          description: 'Ensure your resume passes Applicant Tracking Systems with detailed scoring.',
        },
        {
          icon: MessageSquare,
          title: 'Cover Letters',
          description: 'Generate personalized cover letters that complement your resume.',
        },
        {
          icon: Download,
          title: 'Export Options',
          description: 'Download in multiple formats: PDF, DOCX, or share via link.',
        }
      ]
    },
    {
      title: 'Career Growth',
      description: 'Tools to advance your career and develop skills',
      features: [
        {
          icon: BookOpen,
          title: 'Learning Hub',
          description: 'Access courses, skill tests, and learning paths tailored to your goals.',
        },
        {
          icon: Users,
          title: 'Professional Network',
          description: 'Connect with professionals and join industry communities.',
        },
        {
          icon: Trophy,
          title: 'Skill Verification',
          description: 'Take assessments and earn badges to showcase your expertise.',
        },
        {
          icon: Calendar,
          title: 'Job Tracking',
          description: 'Manage applications with CRM-style tracking and reminders.',
        },
        {
          icon: Search,
          title: 'Opportunity Finder',
          description: 'Discover relevant jobs, internships, and projects with AI matching.',
        },
        {
          icon: Brain,
          title: 'Career Intelligence',
          description: 'Get insights on market trends, salaries, and career paths.',
        }
      ]
    }
  ];

  return (
    <section className="section-lg">
      <div className="container">
        {featureGroups.map((group, groupIndex) => (
          <div key={groupIndex} className={groupIndex > 0 ? 'mt-20' : ''}>
            {/* Section Header */}
            <div className="text-center" style={{ marginBottom: 'var(--space-12)' }}>
              <h2 className="text-4xl font-bold mb-4">{group.title}</h2>
              <p
                className="text-xl text-secondary"
                style={{
                  maxWidth: 600,
                  margin: '0 auto',
                  lineHeight: 1.6
                }}
              >
                {group.description}
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
              {group.features.map((feature, index) => (
                <ModernFeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  badge={feature.badge}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}