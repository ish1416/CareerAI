import React, { useState } from 'react';
import { TrendingUp, Target, Award, Calendar, BarChart3, Users, Briefcase, Star } from 'lucide-react';

export default function ProCareerInsights() {
  const [timeRange, setTimeRange] = useState('6months');

  const insights = [
    { icon: TrendingUp, title: 'Career Growth', value: '+23%', change: 'vs last quarter', color: 'text-green-600' },
    { icon: Target, title: 'Goal Progress', value: '78%', change: 'on track', color: 'text-blue-600' },
    { icon: Award, title: 'Skills Gained', value: '12', change: 'this month', color: 'text-purple-600' },
    { icon: Users, title: 'Network Growth', value: '+45', change: 'new connections', color: 'text-orange-600' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Career Insights</h1>
          <p className="text-gray-600">Track your career progress and get personalized recommendations</p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {insights.map((insight, index) => (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <insight.icon className={`w-8 h-8 ${insight.color}`} />
                <span className="text-2xl font-bold text-gray-900">{insight.value}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-1">{insight.title}</h3>
              <p className="text-sm text-gray-500">{insight.change}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Career Timeline</h2>
            <div className="space-y-4">
              {[
                { date: '2024-01', event: 'Promoted to Senior Developer', type: 'promotion' },
                { date: '2023-10', event: 'Completed React Certification', type: 'skill' },
                { date: '2023-08', event: 'Led team project successfully', type: 'achievement' }
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-md">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-gray-900">{item.event}</p>
                    <p className="text-sm text-gray-500">{item.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-3">
              {[
                'Complete AWS certification to boost cloud skills',
                'Network with 5 new professionals this month',
                'Update portfolio with recent projects'
              ].map((rec, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 rounded-md">
                  <Star className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}