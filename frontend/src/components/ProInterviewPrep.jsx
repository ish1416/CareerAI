import React, { useState } from 'react';
import { Play, Pause, RotateCcw, Mic, MicOff, Video, VideoOff, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';

const ProInterviewPrep = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [sessionActive, setSessionActive] = useState(false);

  const interviewTypes = [
    { id: 'behavioral', name: 'Behavioral', description: 'Tell me about a time when...', questions: 15 },
    { id: 'technical', name: 'Technical', description: 'Coding and system design', questions: 20 },
    { id: 'leadership', name: 'Leadership', description: 'Management and team scenarios', questions: 12 },
    { id: 'case-study', name: 'Case Study', description: 'Business problem solving', questions: 8 }
  ];

  const sampleQuestions = [
    "Tell me about yourself and your background.",
    "Why are you interested in this position?",
    "Describe a challenging project you worked on.",
    "How do you handle tight deadlines?",
    "Where do you see yourself in 5 years?"
  ];

  const mockSessions = [
    {
      id: 1,
      type: 'Behavioral',
      date: '2024-01-15',
      duration: '25 min',
      score: 85,
      feedback: 'Great storytelling, work on being more concise'
    },
    {
      id: 2,
      type: 'Technical',
      date: '2024-01-12',
      duration: '45 min',
      score: 78,
      feedback: 'Strong technical knowledge, improve communication'
    }
  ];

  const tips = [
    {
      category: 'Preparation',
      items: [
        'Research the company and role thoroughly',
        'Prepare STAR method examples',
        'Practice common questions out loud',
        'Prepare thoughtful questions to ask'
      ]
    },
    {
      category: 'During Interview',
      items: [
        'Maintain good eye contact',
        'Speak clearly and at moderate pace',
        'Use specific examples with metrics',
        'Show enthusiasm and engagement'
      ]
    },
    {
      category: 'Follow-up',
      items: [
        'Send thank you email within 24 hours',
        'Reiterate your interest and qualifications',
        'Address any concerns raised',
        'Follow up appropriately if no response'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Interview Preparation</h1>
          <p className="text-gray-600">
            Practice interviews with AI feedback and improve your performance
          </p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'practice', name: 'Practice Session' },
                { id: 'history', name: 'Session History' },
                { id: 'tips', name: 'Interview Tips' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'practice' && (
              <div>
                {!sessionActive ? (
                  <div>
                    {/* Interview Type Selection */}
                    <div className="mb-8">
                      <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Interview Type</h2>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {interviewTypes.map((type) => (
                          <div
                            key={type.id}
                            className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                          >
                            <h3 className="font-semibold text-gray-900 mb-2">{type.name}</h3>
                            <p className="text-sm text-gray-600 mb-3">{type.description}</p>
                            <p className="text-xs text-gray-500">{type.questions} questions available</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Start Session */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Start?</h3>
                      <p className="text-gray-600 mb-4">
                        Your session will be recorded for AI analysis. Make sure you're in a quiet environment with good lighting.
                      </p>
                      <button
                        onClick={() => setSessionActive(true)}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                      >
                        <Play size={20} />
                        Start Practice Session
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Active Session */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Behavioral Interview</h2>
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-600">Question {currentQuestion + 1} of 5</span>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock size={16} />
                            <span>02:34</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${((currentQuestion + 1) / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Question Display */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        {sampleQuestions[currentQuestion]}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Take your time to think about your answer. Use the STAR method (Situation, Task, Action, Result) for behavioral questions.
                      </p>
                    </div>

                    {/* Recording Controls */}
                    <div className="flex items-center justify-center gap-4 mb-6">
                      <button
                        onClick={() => setIsRecording(!isRecording)}
                        className={`p-4 rounded-full ${
                          isRecording 
                            ? 'bg-red-600 text-white' 
                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                        }`}
                      >
                        {isRecording ? <Pause size={24} /> : <Play size={24} />}
                      </button>
                      <button className="p-4 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <RotateCcw size={24} />
                      </button>
                      <button className="p-4 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <Mic size={24} />
                      </button>
                      <button className="p-4 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300">
                        <Video size={24} />
                      </button>
                    </div>

                    {/* Navigation */}
                    <div className="flex justify-between">
                      <button
                        onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                        disabled={currentQuestion === 0}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous Question
                      </button>
                      <button
                        onClick={() => setSessionActive(false)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        End Session
                      </button>
                      <button
                        onClick={() => setCurrentQuestion(Math.min(4, currentQuestion + 1))}
                        disabled={currentQuestion === 4}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next Question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'history' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Practice History</h2>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Export Report
                  </button>
                </div>

                <div className="space-y-4">
                  {mockSessions.map((session) => (
                    <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{session.type} Interview</h3>
                          <p className="text-sm text-gray-600">{session.date} • {session.duration}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-500 fill-current" />
                              <span className="font-semibold">{session.score}/100</span>
                            </div>
                            <p className="text-xs text-gray-500">Overall Score</p>
                          </div>
                          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{session.feedback}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tips' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Interview Success Tips</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  {tips.map((section, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-6">
                      <h3 className="font-semibold text-gray-900 mb-4">{section.category}</h3>
                      <ul className="space-y-3">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-600">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProInterviewPrep;