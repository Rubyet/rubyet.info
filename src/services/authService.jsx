/**
 * Authentication Service for Admin Access
 * Simple password-based authentication using localStorage
 */

const AUTH_STORAGE_KEY = 'portfolio_admin_auth';
const SESSION_STORAGE_KEY = 'portfolio_admin_session';

// Default admin credentials (change these!)
const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin123', // CHANGE THIS in production!
  email: 'rittick.2012@gmail.com'
};

class AuthService {
  constructor() {
    this.initializeAuth();
  }

  // Initialize auth system
  initializeAuth() {
    if (!localStorage.getItem(AUTH_STORAGE_KEY)) {
      // Store hashed password (in production, use proper encryption)
      const adminData = {
        ...DEFAULT_ADMIN,
        password: this.hashPassword(DEFAULT_ADMIN.password)
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminData));
    }
  }

  // Simple hash function (use bcrypt in production!)
  hashPassword(password) {
    // This is NOT secure - just for demonstration
    // In production, handle authentication on server-side
    return btoa(password);
  }

  // Login
  login(username, password) {
    const adminData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    const hashedPassword = this.hashPassword(password);

    if (adminData.username === username && adminData.password === hashedPassword) {
      // Create session
      const session = {
        username,
        email: adminData.email,
        loginTime: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      };
      
      sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return { success: false, message: 'Invalid username or password' };
  }

  // Logout
  logout() {
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    
    if (!session) return false;

    // Check if session expired
    if (new Date(session.expiresAt) < new Date()) {
      this.logout();
      return false;
    }

    return true;
  }

  // Get current session
  getSession() {
    const sessionData = sessionStorage.getItem(SESSION_STORAGE_KEY);
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Update admin password
  updatePassword(currentPassword, newPassword) {
    const adminData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    const hashedCurrentPassword = this.hashPassword(currentPassword);

    if (adminData.password !== hashedCurrentPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }

    adminData.password = this.hashPassword(newPassword);
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminData));

    return { success: true, message: 'Password updated successfully' };
  }

  // Get admin info
  getAdminInfo() {
    const adminData = JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY));
    return {
      username: adminData.username,
      email: adminData.email
    };
  }
}

// Export singleton instance
const authService = new AuthService();
export default authService;
