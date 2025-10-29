import React from 'react';
import { FileText, Brain, Target, TrendingUp, Users, Award, Zap, Shield } from 'lucide-react';

const FeatureShowcase = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Get instant ATS compatibility scores and personalized improvement suggestions',
      color: 'from-blue-500 to-purple-600'
    },
    {
      icon: FileText,
      title: 'Professional Templates',
      description: '15+ ATS-optimized templates designed by career experts',
      color: 'from-green-500 to-teal-600'
    },
    {
      icon: Target,
      title: 'Job Matching',
      description: 'Find jobs that match your skills with AI-powered recommendations',
      color: 'from-orange-500 to-red-600'
    },
    {
      icon: TrendingUp,
      title: 'Career Insights',
      description: 'Real-time salary data, growth trends, and industry analytics',
      color: 'from-purple-500 to-pink-600'
    },
    {
      icon: Users,
      title: 'Interview Preparation',
      description: 'Practice with AI-generated questions and get real-time feedback',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      icon: Award,
      title: 'Performance Tracking',
      description: 'Monitor your progress and see improvement over time',
      color: 'from-yellow-500 to-orange-600'
    },
    {
      icon: Zap,
      title: 'Instant Optimization',
      description: 'One-click resume enhancement with AI-powered suggestions',
      color: 'from-cyan-500 to-blue-600'
    },
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'Your data is encrypted and never shared with third parties',
      color: 'from-gray-500 to-gray-700'
    }
  ];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Everything You Need to Land Your Dream Job
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Our comprehensive suite of AI-powered tools helps you create, optimize, and track your career documents
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>

                <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              </div>
            );
          })}
        </div>

        {/* Stats Section */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">50K+</div>
            <div className="text-gray-600 dark:text-gray-400">Resumes Created</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">95%</div>
            <div className="text-gray-600 dark:text-gray-400">ATS Pass Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">2.5x</div>
            <div className="text-gray-600 dark:text-gray-400">More Interviews</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
            <div className="text-gray-600 dark:text-gray-400">AI Support</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeatureShowcase;