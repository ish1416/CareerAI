import React, { useState } from 'react';
import { Users, MessageSquare, TrendingUp, Plus, Search, Filter } from 'lucide-react';

export default function ProCommunityHub() {
  const [activeTab, setActiveTab] = useState('discussions');

  const discussions = [
    { id: 1, title: 'Best practices for React performance optimization', author: 'Sarah Chen', replies: 23, likes: 45, time: '2h ago', category: 'React' },
    { id: 2, title: 'Career transition from frontend to full-stack', author: 'Mike Johnson', replies: 18, likes: 32, time: '4h ago', category: 'Career' },
    { id: 3, title: 'Remote work productivity tips', author: 'Lisa Wang', replies: 31, likes: 67, time: '6h ago', category: 'Remote Work' }
  ];

  const groups = [
    { name: 'React Developers', members: 1250, description: 'Community for React enthusiasts', active: true },
    { name: 'Career Growth', members: 890, description: 'Professional development discussions', active: false },
    { name: 'Remote Workers', members: 2100, description: 'Tips and support for remote professionals', active: true }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Hub</h1>
            <p className="text-gray-600">Connect with professionals and share knowledge</p>
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2">
            <Plus size={16} />
            New Discussion
          </button>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'discussions', name: 'Discussions' },
                    { id: 'trending', name: 'Trending' },
                    { id: 'my-posts', name: 'My Posts' }
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
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search discussions..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Filter size={16} />
                    Filter
                  </button>
                </div>

                <div className="space-y-4">
                  {discussions.map((discussion) => (
                    <div key={discussion.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{discussion.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>by {discussion.author}</span>
                            <span>{discussion.time}</span>
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs">
                              {discussion.category}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare size={16} />
                          {discussion.replies} replies
                        </span>
                        <span className="flex items-center gap-1">
                          👍 {discussion.likes} likes
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">My Groups</h2>
              <div className="space-y-3">
                {groups.map((group, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{group.name}</h3>
                      <div className={`w-2 h-2 rounded-full ${group.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                    <p className="text-xs text-gray-500">{group.members} members</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Community Stats</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Members</span>
                  <span className="font-semibold">12,450</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Active Today</span>
                  <span className="font-semibold">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discussions</span>
                  <span className="font-semibold">5,678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}