import React, { useState } from 'react';
import { FileText, Download, Eye, Star } from 'lucide-react';

const templates = [
  { id: 1, name: 'Modern Professional', category: 'Professional', rating: 4.9, downloads: '12.5k', preview: '/templates/modern.jpg' },
  { id: 2, name: 'Creative Designer', category: 'Creative', rating: 4.8, downloads: '8.2k', preview: '/templates/creative.jpg' },
  { id: 3, name: 'Tech Executive', category: 'Executive', rating: 4.9, downloads: '15.1k', preview: '/templates/tech.jpg' },
  { id: 4, name: 'Minimalist Clean', category: 'Minimalist', rating: 4.7, downloads: '9.8k', preview: '/templates/minimal.jpg' },
  { id: 5, name: 'Corporate Elite', category: 'Corporate', rating: 4.8, downloads: '11.3k', preview: '/templates/corporate.jpg' },
  { id: 6, name: 'Startup Founder', category: 'Startup', rating: 4.9, downloads: '7.6k', preview: '/templates/startup.jpg' }
];

const ResumeTemplates = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Professional', 'Creative', 'Executive', 'Minimalist', 'Corporate', 'Startup'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Professional Resume Templates
        </h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Choose from our collection of ATS-optimized, professionally designed templates
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map(template => (
          <div key={template.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-[3/4] bg-gray-100 dark:bg-gray-700 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText className="w-16 h-16 text-gray-400" />
              </div>
              <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
                <Star className="w-3 h-3 text-yellow-500 fill-current" />
                {template.rating}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{template.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{template.category}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mb-4">{template.downloads} downloads</p>
              
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <button 
                  onClick={() => onSelectTemplate(template)}
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeTemplates;