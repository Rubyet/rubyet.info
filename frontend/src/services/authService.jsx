/**
 * Secure Authentication Service for Admin Access
 * Uses backend JWT authentication with encrypted passwords
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const TOKEN_KEY = 'admin_token';
const USER_KEY = 'admin_user';

class AuthService {
  // Login with backend authentication
  async login(username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        // Store token and user info in localStorage
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));

        return {
          success: true,
          user: data.user,
          session: {
            username: data.user.username,
            email: data.user.email,
            role: data.user.role,
            loginTime: new Date().toISOString()
          }
        };
      }

      return {
        success: false,
        message: data.message || 'Login failed'
      };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }

  // Get stored token
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }

  // Get stored user info
  getUser() {
    const userStr = localStorage.getItem(USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  // Get session (for compatibility with existing code)
  getSession() {
    const user = this.getUser();
    if (!user) return null;

    return {
      username: user.username,
      email: user.email,
      role: user.role,
      loginTime: new Date().toISOString()
    };
  }

  // Check if user is authenticated
  async isAuthenticated() {
    const token = this.getToken();
    
    if (!token) return false;

    try {
      // Verify token with backend
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Token verification error:', error);
      return false;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    const token = this.getToken();
    
    if (!token) {
      return {
        success: false,
        message: 'Not authenticated'
      };
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Change password error:', error);
      return {
        success: false,
        message: 'Network error. Please try again.'
      };
    }
  }

  // Get current user info from backend
  async getCurrentUser() {
    const token = this.getToken();
    
    if (!token) return null;

    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (data.success) {
        // Update stored user info
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        return data.user;
      }
      
      return null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  // Get admin info (for compatibility)
  getAdminInfo() {
    return this.getUser();
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
