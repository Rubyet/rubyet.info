import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService.jsx';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const authenticated = await authService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setSession(authService.getSession());
    }
    setLoading(false);
  };

  const login = async (username, password) => {
    const result = await authService.login(username, password);
    if (result.success) {
      setIsAuthenticated(true);
      setSession(result.session);
    }
    return result;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setSession(null);
  };

  const value = {
    isAuthenticated,
    session,
    loading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
