import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Briefcase, UserPlus, Search, Plus, Eye, MessageSquare } from 'lucide-react';
import api from '../utils/api.js';

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState('forums');
  const [forums, setForums] = useState([]);
  const [connections, setConnections] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [forumsRes, connectionsRes, groupsRes] = await Promise.all([
        api.get('/network/forums').catch(() => ({ data: { forums: [] } })),
        api.get('/network/connections').catch(() => ({ data: { connections: [] } })),
        api.get('/network/recommendations/groups').catch(() => ({ data: { groups: [] } }))
      ]);
      
      setForums(forumsRes.data.forums || []);
      setConnections(connectionsRes.data.connections || []);
      setRecommendations(groupsRes.data.groups || []);
    } catch (error) {
      console.error('Failed to load community data:', error);
      setForums([]);
      setConnections([]);
      setRecommendations([]);
    }
  };

  const connectToPerson = async (userId) => {
    try {
      await api.post(`/network/connect/${userId}`, {
        message: 'I would like to connect with you!'
      });
      loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to send connection request:', error);
    }
  };

  const joinGroup = async (groupId) => {
    try {
      await api.post(`/network/groups/join/${groupId}`);
      loadData(); // Refresh data
    } catch (error) {
      console.error('Failed to join group:', error);
    }
  };

  const loadForumPosts = async (forumId) => {
    try {
      const { data } = await api.get(`/network/forums/${forumId}/posts`);
      setPosts(data.posts);
    } catch (error) {
      console.error('Failed to load posts:', error);
    }
  };

  return (
    <div style={{ padding: 'var(--space-6)' }}>
      <h1>Community Hub</h1>
      
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Users size={20} color="var(--primary)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{connections.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Connections</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <MessageCircle size={20} color="var(--success)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{forums.length}</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Forums Joined</div>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Briefcase size={20} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>12</div>
              <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>Job Referrals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ borderBottom: '1px solid var(--border)', marginBottom: 'var(--space-4)' }}>
        {['forums', 'connections', 'discover', 'messages'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'none',
              borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
              color: activeTab === tab ? 'var(--primary)' : 'var(--text-soft)',
              textTransform: 'capitalize',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Forums Tab */}
      {activeTab === 'forums' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>Discussion Forums</h3>
            <button className="btn primary">
              <Plus size={16} />
              New Post
            </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: 'var(--space-4)' }}>
            {forums.map(forum => (
              <div key={forum.id} className="card interactive" onClick={() => loadForumPosts(forum.id)}>
                <h4>{forum.title}</h4>
                <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>{forum.description}</p>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                  <span>{forum.posts} posts</span>
                  <span>{forum.members} members</span>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Posts */}
          {posts.length > 0 && (
            <div style={{ marginTop: 'var(--space-6)' }}>
              <h3>Recent Posts</h3>
              {posts.map(post => (
                <div key={post.id} className="card" style={{ marginBottom: 'var(--space-3)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 'var(--space-2)' }}>
                    <h4 style={{ margin: 0 }}>{post.title}</h4>
                    <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{post.timestamp}</span>
                  </div>
                  <p style={{ color: 'var(--text-soft)', marginBottom: 'var(--space-2)' }}>by {post.author}</p>
                  <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                    {post.tags.map(tag => (
                      <span key={tag} style={{ 
                        padding: 'var(--space-1) var(--space-2)', 
                        background: 'var(--muted)', 
                        borderRadius: 'var(--radius)', 
                        fontSize: 'var(--text-xs)' 
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: 'var(--space-4)', fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>
                    <span><MessageSquare size={14} style={{ marginRight: 'var(--space-1)' }} />{post.replies} replies</span>
                    <span><Eye size={14} style={{ marginRight: 'var(--space-1)' }} />{post.views} views</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
            <h3>My Connections</h3>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 'var(--space-2)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-soft)' }} />
                <input 
                  type="text" 
                  placeholder="Search connections..." 
                  style={{ paddingLeft: 'var(--space-8)' }}
                />
              </div>
              <button className="btn primary">
                <UserPlus size={16} />
                Find People
              </button>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {connections.map(connection => (
              <div key={connection.id} className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <div style={{ 
                    width: '48px', 
                    height: '48px', 
                    borderRadius: '50%', 
                    background: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 'bold'
                  }}>
                    {connection.name.charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0 }}>{connection.name}</h4>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{connection.title}</p>
                    <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-xs)' }}>{connection.company}</p>
                  </div>
                </div>
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)', marginBottom: 'var(--space-3)' }}>
                  {connection.mutual} mutual connections
                </div>
                <button className="btn ghost small">
                  <MessageCircle size={14} />
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Discover Tab */}
      {activeTab === 'discover' && (
        <div>
          <h3>Recommended Groups</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-4)' }}>
            {recommendations.map(group => (
              <div key={group.id} className="card">
                <div style={{ marginBottom: 'var(--space-3)' }}>
                  <h4 style={{ margin: 0, marginBottom: 'var(--space-1)' }}>{group.name}</h4>
                  <p style={{ margin: 0, color: 'var(--text-soft)', fontSize: 'var(--text-sm)' }}>{group.description}</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-soft)' }}>{group.memberCount} members</span>
                  <span style={{ 
                    padding: 'var(--space-1) var(--space-2)', 
                    background: 'var(--muted)', 
                    borderRadius: 'var(--radius)', 
                    fontSize: 'var(--text-xs)' 
                  }}>
                    {group.industry}
                  </span>
                </div>
                <button 
                  className="btn primary small"
                  onClick={() => joinGroup(group.id)}
                >
                  <UserPlus size={14} />
                  Join Group
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div>
          <h3>Messages</h3>
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-6)' }}>
            <MessageCircle size={48} color="var(--text-soft)" style={{ margin: '0 auto var(--space-3)' }} />
            <h4>No messages yet</h4>
            <p style={{ color: 'var(--text-soft)' }}>Start connecting with people to begin conversations</p>
            <button className="btn primary">Find People to Connect</button>
          </div>
        </div>
      )}
    </div>
  );
}