import React, { useState } from 'react';
import { FileText, Download, Eye, Star, Filter, Grid, List } from 'lucide-react';

const templates = [
  { id: 1, name: 'Modern Professional', category: 'Professional', rating: 4.9, downloads: '12.5k', preview: '/templates/modern.jpg', isPro: false },
  { id: 2, name: 'Creative Designer', category: 'Creative', rating: 4.8, downloads: '8.2k', preview: '/templates/creative.jpg', isPro: true },
  { id: 3, name: 'Tech Executive', category: 'Executive', rating: 4.9, downloads: '15.1k', preview: '/templates/tech.jpg', isPro: true },
  { id: 4, name: 'Minimalist Clean', category: 'Minimalist', rating: 4.7, downloads: '9.8k', preview: '/templates/minimal.jpg', isPro: false },
  { id: 5, name: 'Corporate Elite', category: 'Corporate', rating: 4.8, downloads: '11.3k', preview: '/templates/corporate.jpg', isPro: true },
  { id: 6, name: 'Startup Founder', category: 'Startup', rating: 4.9, downloads: '7.6k', preview: '/templates/startup.jpg', isPro: false },
  { id: 7, name: 'Academic Scholar', category: 'Academic', rating: 4.6, downloads: '5.2k', preview: '/templates/academic.jpg', isPro: true },
  { id: 8, name: 'Sales Professional', category: 'Sales', rating: 4.7, downloads: '6.8k', preview: '/templates/sales.jpg', isPro: false }
];

const ProResumeTemplates = ({ onSelectTemplate }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('popular');
  
  const categories = ['All', 'Professional', 'Creative', 'Executive', 'Minimalist', 'Corporate', 'Startup', 'Academic', 'Sales'];

  const filteredTemplates = selectedCategory === 'All' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory);

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch(sortBy) {
      case 'rating': return b.rating - a.rating;
      case 'downloads': return parseInt(b.downloads) - parseInt(a.downloads);
      case 'name': return a.name.localeCompare(b.name);
      default: return b.rating - a.rating;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Resume Templates</h1>
          <p className="text-gray-600 max-w-2xl">
            Choose from our collection of ATS-optimized, professionally designed templates. 
            All templates are crafted by career experts and tested with major ATS systems.
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Sort by:</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="downloads">Most Downloaded</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
              
              <div className="flex border border-gray-300 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Templates Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                    <FileText className="w-16 h-16 text-gray-400" />
                  </div>
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="bg-white text-gray-900 px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-100 flex items-center gap-1">
                      <Eye size={14} />
                      Preview
                    </button>
                    <button 
                      onClick={() => onSelectTemplate(template)}
                      className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Download size={14} />
                      Use
                    </button>
                  </div>
                  
                  {/* Pro Badge */}
                  {template.isPro && (
                    <div className="absolute top-2 left-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-1 rounded-md text-xs font-medium">
                      PRO
                    </div>
                  )}
                  
                  {/* Rating */}
                  <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    {template.rating}
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1">{template.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{template.category}</p>
                  <p className="text-xs text-gray-500">{template.downloads} downloads</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {sortedTemplates.map(template => (
              <div key={template.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-24 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                          {template.isPro && (
                            <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-2 py-0.5 rounded text-xs font-medium">
                              PRO
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-1">{template.category}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            {template.rating}
                          </span>
                          <span>{template.downloads} downloads</span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2 text-sm">
                          <Eye size={16} />
                          Preview
                        </button>
                        <button 
                          onClick={() => onSelectTemplate(template)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 text-sm"
                        >
                          <Download size={16} />
                          Use Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {sortedTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more templates.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProResumeTemplates;