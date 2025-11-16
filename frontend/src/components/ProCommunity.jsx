import React, { useState } from 'react';
import { Users, MessageCircle, Search, Plus, UserPlus, Briefcase, TrendingUp, Eye, Heart } from 'lucide-react';

export default function ProCommunity() {
  const [activeTab, setActiveTab] = useState('feed');

  const stats = [
    { label: 'Connections', value: '247', icon: Users, color: 'var(--primary)' },
    { label: 'Forum Posts', value: '18', icon: MessageCircle, color: 'var(--success)' },
    { label: 'Profile Views', value: '1.2k', icon: Eye, color: 'var(--warning)' },
    { label: 'Referrals', value: '5', icon: Briefcase, color: 'var(--error)' }
  ];

  const feedPosts = [
    {
      id: 1,
      author: 'Sarah Chen',
      title: 'Senior Software Engineer',
      company: 'Google',
      time: '2h ago',
      content: 'Just completed my first year at Google! Here are 5 key lessons I learned about scaling systems...',
      likes: 24,
      comments: 8,
      type: 'post'
    },
    {
      id: 2,
      author: 'Mike Johnson',
      title: 'Product Manager',
      company: 'Microsoft',
      time: '4h ago',
      content: 'Looking for talented frontend developers to join our team. Remote-friendly position with great benefits.',
      likes: 15,
      comments: 12,
      type: 'job'
    }
  ];

  const connections = [
    { name: 'Alex Rodriguez', title: 'Full Stack Developer', company: 'Stripe', mutual: 12 },
    { name: 'Emma Wilson', title: 'UX Designer', company: 'Figma', mutual: 8 },
    { name: 'David Kim', title: 'DevOps Engineer', company: 'AWS', mutual: 15 }
  ];

  const forums = [
    { name: 'Frontend Developers', members: '12.5k', posts: '2.1k', description: 'React, Vue, Angular discussions' },
    { name: 'Career Advice', members: '8.3k', posts: '1.8k', description: 'Professional growth tips' },
    { name: 'Remote Work', members: '15.2k', posts: '3.2k', description: 'Remote work best practices' }
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <h1 className="text-3xl font-bold" style={{ marginBottom: 'var(--space-2)' }}>
          Professional Community
        </h1>
        <p className="text-secondary">
          Connect with professionals, share insights, and grow your network.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-4" style={{ gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    background: stat.color,
                    borderRadius: 'var(--radius-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Icon size={24} color="white" />
                </div>
                <div>
                  <div className="text-2xl font-bold" style={{ marginBottom: 'var(--space-1)' }}>
                    {stat.value}
                  </div>
                  <div className="text-sm text-secondary">{stat.label}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: 'var(--space-1)', marginBottom: 'var(--space-8)', borderBottom: '1px solid var(--border)' }}>
        {[
          { id: 'feed', label: 'Feed' },
          { id: 'connections', label: 'Connections' },
          { id: 'forums', label: 'Forums' },
          { id: 'discover', label: 'Discover' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'transparent',
              color: activeTab === tab.id ? 'var(--primary)' : 'var(--text-secondary)',
              borderBottom: activeTab === tab.id ? '2px solid var(--primary)' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'var(--transition)',
              fontSize: 'var(--text-sm)',
              fontWeight: activeTab === tab.id ? 600 : 500
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Feed Section */}
      {activeTab === 'feed' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 'var(--space-8)' }}>
          {/* Main Feed */}
          <div>
            {/* Create Post */}
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600
                  }}
                >
                  J
                </div>
                <input
                  className="input"
                  placeholder="Share your thoughts with the community..."
                  style={{ flex: 1 }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn-sm">📷 Photo</button>
                  <button className="btn btn-sm">📊 Poll</button>
                </div>
                <button className="btn btn-primary btn-sm">Post</button>
              </div>
            </div>

            {/* Feed Posts */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
              {feedPosts.map((post) => (
                <div key={post.id} className="card" style={{ padding: 'var(--space-6)' }}>
                  {/* Post Header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        background: 'var(--primary)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 600
                      }}
                    >
                      {post.author.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-semibold">{post.author}</div>
                      <div className="text-xs text-secondary">{post.title} at {post.company}</div>
                      <div className="text-xs text-muted">{post.time}</div>
                    </div>
                    {post.type === 'job' && (
                      <span
                        style={{
                          padding: 'var(--space-1) var(--space-2)',
                          background: 'var(--success)',
                          color: 'white',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: 'var(--text-xs)',
                          fontWeight: 600
                        }}
                      >
                        Job
                      </span>
                    )}
                  </div>

                  {/* Post Content */}
                  <p className="text-sm" style={{ marginBottom: 'var(--space-4)', lineHeight: 1.6 }}>
                    {post.content}
                  </p>

                  {/* Post Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--border)' }}>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      <Heart size={16} />
                      {post.likes}
                    </button>
                    <button
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-2)',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      <MessageCircle size={16} />
                      {post.comments}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div>
            {/* Trending Topics */}
            <div className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
              <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                Trending Topics
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
                {['#RemoteWork', '#TechCareers', '#WebDevelopment', '#AIJobs'].map((topic, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>{topic}</span>
                    <span className="text-xs text-muted">2.1k posts</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Connections */}
            <div className="card" style={{ padding: 'var(--space-6)' }}>
              <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-4)' }}>
                People You May Know
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {connections.slice(0, 3).map((connection, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: 'var(--gray-200)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 'var(--text-sm)'
                      }}
                    >
                      {connection.name.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-medium">{connection.name}</div>
                      <div className="text-xs text-secondary">{connection.title}</div>
                      <div className="text-xs text-muted">{connection.mutual} mutual</div>
                    </div>
                    <button className="btn btn-sm">
                      <UserPlus size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Connections Section */}
      {activeTab === 'connections' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2 className="text-xl font-semibold">My Connections</h2>
            <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input className="input" placeholder="Search connections..." style={{ paddingLeft: 'var(--space-10)' }} />
              </div>
              <button className="btn btn-primary">
                <UserPlus size={16} />
                Find People
              </button>
            </div>
          </div>

          <div className="grid grid-3" style={{ gap: 'var(--space-6)' }}>
            {connections.map((connection, index) => (
              <div key={index} className="card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div
                  style={{
                    width: 64,
                    height: 64,
                    background: 'var(--primary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: 'var(--text-lg)',
                    margin: '0 auto var(--space-4)'
                  }}
                >
                  {connection.name.charAt(0)}
                </div>
                <h3 className="text-base font-semibold" style={{ marginBottom: 'var(--space-1)' }}>
                  {connection.name}
                </h3>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-1)' }}>
                  {connection.title}
                </p>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
                  {connection.company}
                </p>
                <button className="btn" style={{ width: '100%' }}>
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Forums Section */}
      {activeTab === 'forums' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-6)' }}>
            <h2 className="text-xl font-semibold">Discussion Forums</h2>
            <button className="btn btn-primary">
              <Plus size={16} />
              Create Forum
            </button>
          </div>

          <div className="grid grid-2" style={{ gap: 'var(--space-6)' }}>
            {forums.map((forum, index) => (
              <div key={index} className="card" style={{ padding: 'var(--space-6)' }}>
                <h3 className="text-lg font-semibold" style={{ marginBottom: 'var(--space-2)' }}>
                  {forum.name}
                </h3>
                <p className="text-sm text-secondary" style={{ marginBottom: 'var(--space-4)' }}>
                  {forum.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', gap: 'var(--space-4)' }}>
                    <span className="text-sm text-secondary">{forum.members} members</span>
                    <span className="text-sm text-secondary">{forum.posts} posts</span>
                  </div>
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}>
                  Join Forum
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}