import { motion } from 'framer-motion';
import { useState } from 'react';
import { FiCheckCircle, FiKey, FiLock, FiMoon, FiSun, FiUser } from 'react-icons/fi';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './PasswordReset.css';

const PasswordReset = ({ darkMode, toggleTheme }) => {
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get('token');
  
  const [formData, setFormData] = useState({ 
    username: '',
    newPassword: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  
  const navigate = useNavigate();
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const validatePassword = (password) => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(password)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(password)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(password)) {
      return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return 'Password must contain at least one special character (!@#$%^&*)';
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate username
    if (!formData.username.trim()) {
      setError('Username is required for verification');
      setLoading(false);
      return;
    }

    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const validationError = validatePassword(formData.newPassword);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: resetToken,
          username: formData.username,
          newPassword: formData.newPassword
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/admin/login');
        }, 3000);
      } else {
        setError(data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!resetToken) {
    return (
      <div className="password-reset-page">
        <div className="password-reset-container">
          <div className="password-reset-header">
            <div className="password-reset-icon error">
              <FiLock size={32} />
            </div>
            <h1>Invalid Reset Link</h1>
            <p>This password reset link is invalid or has expired.</p>
            <button 
              className="back-button"
              onClick={() => navigate('/admin/login')}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="password-reset-page">
        <button 
          className="reset-theme-toggle" 
          onClick={toggleTheme}
          aria-label="Toggle theme"
        >
          {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        
        <motion.div
          className="password-reset-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="password-reset-header">
            <div className="password-reset-icon success">
              <FiCheckCircle size={48} />
            </div>
            <h1>Password Reset Successful!</h1>
            <p>Your password has been changed successfully.</p>
            <p className="redirect-message">Redirecting to login page...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="password-reset-page">
      <button 
        className="reset-theme-toggle" 
        onClick={toggleTheme}
        aria-label="Toggle theme"
      >
        {darkMode ? <FiSun size={20} /> : <FiMoon size={20} />}
      </button>
      
      <motion.div
        className="password-reset-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="password-reset-header">
          <div className="password-reset-icon">
            <FiKey size={32} />
          </div>
          <h1>Reset Your Password</h1>
          <p>Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="password-reset-form">
          <div className="form-group">
            <label htmlFor="username">
              <FiUser size={18} /> Username (for verification)
            </label>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
              placeholder="Enter your username"
              required
              autoComplete="username"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">
              <FiLock size={18} /> New Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showPasswords ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                placeholder="Enter new password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">
              <FiLock size={18} /> Confirm Password
            </label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showPasswords ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder="Confirm new password"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="show-password-toggle">
            <label>
              <input
                type="checkbox"
                checked={showPasswords}
                onChange={(e) => setShowPasswords(e.target.checked)}
                disabled={loading}
              />
              <span>Show passwords</span>
            </label>
          </div>

          <div className="password-requirements">
            <p>Password must contain:</p>
            <ul>
              <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                At least 8 characters
              </li>
              <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                One uppercase letter
              </li>
              <li className={/[a-z]/.test(formData.newPassword) ? 'valid' : ''}>
                One lowercase letter
              </li>
              <li className={/[0-9]/.test(formData.newPassword) ? 'valid' : ''}>
                One number
              </li>
              <li className={/[!@#$%^&*]/.test(formData.newPassword) ? 'valid' : ''}>
                One special character (!@#$%^&*)
              </li>
            </ul>
          </div>

          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {error}
            </motion.div>
          )}

          <motion.button
            type="submit"
            className="reset-button"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </motion.button>

          <button
            type="button"
            className="back-link"
            onClick={() => navigate('/admin/login')}
            disabled={loading}
          >
            Back to Login
          </button>
        </form>
      </motion.div>

      {/* Background decoration */}
      <div className="reset-bg-decoration">
        <div className="decoration-circle circle-1"></div>
        <div className="decoration-circle circle-2"></div>
        <div className="decoration-circle circle-3"></div>
      </div>
    </div>
  );
};

export default PasswordReset;
