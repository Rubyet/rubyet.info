import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiLogOut,
  FiSun,
  FiMoon,
  FiFileText,
  FiMail
} from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import AdminBlogContent from '../components/admin/AdminBlogContent';
import AdminContactsContent from '../components/admin/AdminContactsContent';
import './AdminDashboard.css';

const AdminDashboard = ({ darkMode, toggleTheme }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'blog');
  const { logout, session } = useAuth();
  const navigate = useNavigate();

  // Update tab based on URL parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && (tabParam === 'blog' || tabParam === 'contacts')) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  return (
    <div className="admin-dashboard-page">
      {/* Header */}
      <motion.header 
        className="admin-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-header-content">
          <div>
            <h1>Admin Dashboard</h1>
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

      {/* Tab Navigation */}
      <motion.div 
        className="admin-tabs"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <button
          className={`tab-btn ${activeTab === 'blog' ? 'active' : ''}`}
          onClick={() => handleTabChange('blog')}
        >
          <FiFileText /> Blog Management
        </button>
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => handleTabChange('contacts')}
        >
          <FiMail /> Contact Submissions
        </button>
      </motion.div>

      {/* Tab Content */}
      <div className="admin-tab-content">
        {activeTab === 'blog' && <AdminBlogContent />}
        {activeTab === 'contacts' && <AdminContactsContent />}
      </div>
    </div>
  );
};

export default AdminDashboard;
