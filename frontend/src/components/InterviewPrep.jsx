import React, { useState } from 'react';
import { Play, Pause, RotateCcw, CheckCircle, Clock, Brain, Mic } from 'lucide-react';

const InterviewPrep = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [answers, setAnswers] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('behavioral');

  const questionCategories = {
    behavioral: [
      "Tell me about yourself and your career journey.",
      "Describe a challenging project you worked on and how you overcame obstacles.",
      "Give me an example of when you had to work with a difficult team member.",
      "Tell me about a time you failed and what you learned from it.",
      "Describe your greatest professional achievement."
    ],
    technical: [
      "Explain the difference between REST and GraphQL APIs.",
      "How would you optimize a slow-loading web application?",
      "Describe your approach to debugging a complex issue.",
      "What are the key principles of good software architecture?",
      "How do you ensure code quality in your projects?"
    ],
    situational: [
      "How would you handle a tight deadline with limited resources?",
      "What would you do if you disagreed with your manager's decision?",
      "How would you approach learning a new technology quickly?",
      "Describe how you would handle conflicting priorities.",
      "What would you do if you discovered a security vulnerability?"
    ]
  };

  const categories = [
    { id: 'behavioral', name: 'Behavioral', icon: Brain },
    { id: 'technical', name: 'Technical', icon: CheckCircle },
    { id: 'situational', name: 'Situational', icon: Clock }
  ];

  const questions = questionCategories[selectedCategory];

  const startRecording = () => {
    setIsRecording(true);
    // In a real app, start actual recording here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // In a real app, stop recording and process audio
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          AI Interview Preparation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Practice with AI-generated questions and get real-time feedback
        </p>
      </div>

      {/* Category Selection */}
      <div className="flex justify-center gap-4 mb-8">
        {categories.map(category => {
          const Icon = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setCurrentQuestion(0);
              }}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              {category.name}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-center mb-6">
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
          </span>
        </div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-8">
          {questions[currentQuestion]}
        </h3>

        {/* Recording Controls */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isRecording ? (
              <>
                <Pause className="w-5 h-5" />
                Stop Recording
              </>
            ) : (
              <>
                <Mic className="w-5 h-5" />
                Start Recording
              </>
            )}
          </button>

          {isRecording && (
            <div className="flex items-center gap-2 text-red-600">
              <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Recording...</span>
            </div>
          )}
        </div>

        {/* Answer Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Your Answer (or use voice recording above)
          </label>
          <textarea
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
            placeholder="Type your answer here or use the voice recording feature above..."
            value={answers[currentQuestion] || ''}
            onChange={(e) => setAnswers({...answers, [currentQuestion]: e.target.value})}
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={prevQuestion}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600'
                    : answers[index]
                    ? 'bg-green-500'
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
              />
            ))}
          </div>

          <button
            onClick={nextQuestion}
            disabled={currentQuestion === questions.length - 1}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* AI Feedback Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-lg p-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          AI Feedback & Tips
        </h4>
        <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Use the STAR method (Situation, Task, Action, Result) for behavioral questions</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Be specific with examples and quantify your achievements when possible</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <span>Practice speaking clearly and at a moderate pace</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPrep;