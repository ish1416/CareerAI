import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, MapPin, Users, Award, Target, BarChart3, PieChart } from 'lucide-react';

const CareerInsights = () => {
  const [selectedRole, setSelectedRole] = useState('Software Engineer');
  const [timeframe, setTimeframe] = useState('6months');

  const roles = [
    'Software Engineer',
    'Product Manager',
    'Data Scientist',
    'UX Designer',
    'DevOps Engineer',
    'Marketing Manager'
  ];

  const insights = {
    'Software Engineer': {
      averageSalary: '$125,000',
      salaryRange: '$85k - $180k',
      jobGrowth: '+22%',
      demandLevel: 'Very High',
      topSkills: ['React', 'Python', 'AWS', 'Node.js', 'TypeScript'],
      topLocations: ['San Francisco', 'Seattle', 'New York', 'Austin', 'Remote'],
      careerPath: [
        { level: 'Junior', salary: '$75k', years: '0-2' },
        { level: 'Mid-level', salary: '$105k', years: '2-5' },
        { level: 'Senior', salary: '$140k', years: '5-8' },
        { level: 'Staff/Principal', salary: '$180k+', years: '8+' }
      ],
      industryTrends: [
        { trend: 'AI/ML Integration', growth: '+45%' },
        { trend: 'Cloud Computing', growth: '+38%' },
        { trend: 'Cybersecurity', growth: '+32%' },
        { trend: 'Mobile Development', growth: '+28%' }
      ]
    }
  };

  const currentInsights = insights[selectedRole] || insights['Software Engineer'];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Career Insights & Analytics
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Get data-driven insights about your career path and industry trends
        </p>
      </div>

      {/* Role Selection */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Select Career Role
        </label>
        <div className="flex flex-wrap gap-2">
          {roles.map(role => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedRole === role
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Average Salary</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentInsights.averageSalary}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Range: {currentInsights.salaryRange}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Job Growth</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentInsights.jobGrowth}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Next 5 years
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Target className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Demand Level</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {currentInsights.demandLevel}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Market demand
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Users className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">Open Positions</span>
          </div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            12,500+
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            Currently available
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Skills */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5" />
            Top Skills in Demand
          </h3>
          <div className="space-y-3">
            {currentInsights.topSkills.map((skill, index) => (
              <div key={skill} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${90 - index * 10}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    {90 - index * 10}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Locations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Top Hiring Locations
          </h3>
          <div className="space-y-3">
            {currentInsights.topLocations.map((location, index) => (
              <div key={location} className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">{location}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${85 - index * 8}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">
                    {85 - index * 8}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Career Path */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Career Progression Path
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {currentInsights.careerPath.map((level, index) => (
            <div key={level.level} className="relative">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600 rounded-lg p-4 text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {level.level}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {level.salary}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {level.years} years
                </div>
              </div>
              {index < currentInsights.careerPath.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-2 transform -translate-y-1/2">
                  <div className="w-4 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
                  <div className="absolute -right-1 -top-1 w-2 h-2 bg-gray-300 dark:bg-gray-600 rotate-45"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Industry Trends */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <PieChart className="w-5 h-5" />
          Industry Trends & Growth Areas
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentInsights.industryTrends.map(trend => (
            <div key={trend.trend} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <span className="font-medium text-gray-900 dark:text-white">{trend.trend}</span>
              <span className="text-green-600 dark:text-green-400 font-semibold">{trend.growth}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CareerInsights;