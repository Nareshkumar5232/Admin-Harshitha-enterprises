import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user:', e);
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Authentication should be implemented via backend API in production.
    // The local fallback below is only allowed during development (import.meta.env.DEV).
    // Remove this block before deploying to production or replace with real auth.
    if (import.meta.env.DEV) {
      if (email === 'admin@gmail.com' && password === 'admin@123') {
        const userData = {
          id: 1,
          email,
          name: 'Admin',
          role: 'admin',
          // Use local initials-based Avatar component instead of external dicebear images
          avatar: null,
        };
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        return true;
      }
    }

    // In non-development environments, return false to prevent accidental bypass.
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
