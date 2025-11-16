import React, { useState } from 'react';
import { BookOpen, Play, Clock, Award, TrendingUp, CheckCircle } from 'lucide-react';

export default function ProLearningDashboard() {
  const [activeTab, setActiveTab] = useState('courses');

  const courses = [
    { id: 1, title: 'Advanced React Patterns', progress: 75, duration: '8h', level: 'Advanced', rating: 4.8 },
    { id: 2, title: 'System Design Fundamentals', progress: 45, duration: '12h', level: 'Intermediate', rating: 4.9 },
    { id: 3, title: 'AWS Cloud Practitioner', progress: 90, duration: '6h', level: 'Beginner', rating: 4.7 }
  ];

  const achievements = [
    { title: 'React Expert', description: 'Completed 5 React courses', icon: Award, earned: true },
    { title: 'Quick Learner', description: 'Finished 3 courses this month', icon: TrendingUp, earned: true },
    { title: 'Consistent Student', description: 'Studied 7 days in a row', icon: CheckCircle, earned: false }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Learning Dashboard</h1>
          <p className="text-gray-600">Track your learning progress and discover new skills</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-blue-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">12</h3>
                <p className="text-gray-600">Courses Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-green-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">48h</h3>
                <p className="text-gray-600">Learning Time</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <Award className="w-8 h-8 text-purple-600" />
              <div>
                <h3 className="text-2xl font-bold text-gray-900">8</h3>
                <p className="text-gray-600">Certificates Earned</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'courses', name: 'My Courses' },
                { id: 'achievements', name: 'Achievements' },
                { id: 'recommendations', name: 'Recommended' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'courses' && (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{course.title}</h3>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
                        <Play size={16} />
                        Continue
                      </button>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                      <span className="flex items-center gap-1">
                        ⭐ {course.rating}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${course.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{course.progress}% complete</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="grid md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${achievement.earned ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                    <div className="flex items-center gap-3 mb-2">
                      <achievement.icon className={`w-6 h-6 ${achievement.earned ? 'text-green-600' : 'text-gray-400'}`} />
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'recommendations' && (
              <div className="space-y-4">
                {[
                  { title: 'Node.js Masterclass', reason: 'Based on your React skills', duration: '10h' },
                  { title: 'Docker for Developers', reason: 'Popular in your field', duration: '6h' },
                  { title: 'GraphQL Fundamentals', reason: 'Trending technology', duration: '4h' }
                ].map((rec, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-1">{rec.title}</h3>
                        <p className="text-sm text-gray-600 mb-1">{rec.reason}</p>
                        <p className="text-sm text-gray-500">{rec.duration}</p>
                      </div>
                      <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
                        Enroll
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}