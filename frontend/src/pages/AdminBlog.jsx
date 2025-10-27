import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiPlus, 
  FiEdit, 
  FiTrash2, 
  FiEye, 
  FiEyeOff, 
  FiSearch,
  FiFilter,
  FiLogOut,
  FiBarChart2,
  FiSun,
  FiMoon
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import * as blogService from '../services/apiService';
import './AdminBlog.css';

const AdminBlog = ({ darkMode, toggleTheme }) => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { logout, session } = useAuth();
  const navigate = useNavigate();

  const loadData = React.useCallback(async () => {
    setLoading(true);
    try {
      const loadedPosts = await blogService.getAllPosts(filter);
      const stats = await blogService.getStatistics();
      setPosts(loadedPosts);
      setFilteredPosts(loadedPosts);
      setStatistics(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const handleSearch = React.useCallback(async () => {
    if (!searchQuery.trim()) {
      setFilteredPosts(posts);
      return;
    }

    try {
      const results = await blogService.searchPosts(searchQuery, filter === 'all' ? undefined : filter);
      setFilteredPosts(results);
    } catch (error) {
      console.error('Error searching posts:', error);
    }
  }, [searchQuery, posts, filter]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    handleSearch();
  }, [handleSearch]);

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      try {
        await blogService.deletePost(id);
        loadData();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await blogService.updatePost(id, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating post status:', error);
      alert('Failed to update post status. Please try again.');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="admin-blog-page">
      {/* Header */}
      <motion.header 
        className="admin-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-header-content">
          <div>
            <h1>Blog Management</h1>
            <p>Welcome back, {session?.username}!</p>
          </div>
          <div className="admin-header-actions">
            <button onClick={toggleTheme} className="theme-toggle-btn">
              {darkMode ? <FiSun /> : <FiMoon />}
            </button>
            <button onClick={handleLogout} className="logout-btn">
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </motion.header>

      {/* Statistics */}
      {statistics && (
        <motion.div 
          className="statistics-grid"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="stat-card">
            <div className="stat-icon total">
              <FiBarChart2 />
            </div>
            <div className="stat-content">
              <h3>{statistics.totalPosts}</h3>
              <p>Total Posts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon published">
              <FiEye />
            </div>
            <div className="stat-content">
              <h3>{statistics.published}</h3>
              <p>Published</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon drafts">
              <FiEyeOff />
            </div>
            <div className="stat-content">
              <h3>{statistics.drafts}</h3>
              <p>Drafts</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon views">
              <FiEye />
            </div>
            <div className="stat-content">
              <h3>{statistics.totalViews}</h3>
              <p>Total Views</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Controls */}
      <motion.div 
        className="admin-controls"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="search-box">
          <FiSearch />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          <button
            className={filter === 'all' ? 'active' : ''}
            onClick={() => setFilter('all')}
          >
            <FiFilter /> All
          </button>
          <button
            className={filter === 'published' ? 'active' : ''}
            onClick={() => setFilter('published')}
          >
            <FiEye /> Published
          </button>
          <button
            className={filter === 'draft' ? 'active' : ''}
            onClick={() => setFilter('draft')}
          >
            <FiEyeOff /> Drafts
          </button>
        </div>

        <Link to="/admin/blog/new" className="create-btn">
          <FiPlus /> Create New Post
        </Link>
      </motion.div>

      {/* Posts Table */}
      <motion.div 
        className="posts-table-container"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        {loading ? (
          <div className="loading-state">Loading posts...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="empty-state">
            <FiEdit size={48} />
            <h3>No posts found</h3>
            <p>
              {searchQuery 
                ? 'Try adjusting your search query'
                : 'Start creating your first blog post!'
              }
            </p>
            {!searchQuery && (
              <Link to="/admin/blog/new" className="create-btn">
                <FiPlus /> Create First Post
              </Link>
            )}
          </div>
        ) : (
          <table className="posts-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Date</th>
                <th>Views</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPosts.map((post) => (
                <motion.tr
                  key={post.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <td>
                    <div className="post-title-cell">
                      <h4>{post.title}</h4>
                      {post.excerpt && (
                        <p className="post-excerpt">{post.excerpt}</p>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${post.status}`}>
                      {post.status === 'published' ? <FiEye /> : <FiEyeOff />}
                      {post.status}
                    </span>
                  </td>
                  <td>
                    <div className="date-cell">
                      <span className="date-label">
                        {post.status === 'published' ? 'Published' : 'Updated'}
                      </span>
                      <span className="date-value">
                        {formatDate(post.status === 'published' ? post.publishedDate : post.updatedAt)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="views-count">{post.views || 0}</span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleToggleStatus(post.id, post.status)}
                        className="action-btn toggle"
                        title={post.status === 'published' ? 'Unpublish' : 'Publish'}
                      >
                        {post.status === 'published' ? <FiEyeOff /> : <FiEye />}
                      </button>
                      <Link
                        to={`/admin/blog/edit/${post.id}`}
                        className="action-btn edit"
                        title="Edit"
                      >
                        <FiEdit />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id, post.title)}
                        className="action-btn delete"
                        title="Delete"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default AdminBlog;
