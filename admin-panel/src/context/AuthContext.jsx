import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

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
        localStorage.removeItem('admin_token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Direct local bypass during development if backend is not reachable/desired
      if (import.meta.env.DEV && email === 'admin@gmail.com' && password === 'admin@123') {
        const userData = {
          id: 1,
          email,
          name: 'Dev Admin',
          role: 'admin',
          avatar: null,
        };
        setUser(userData);
        localStorage.setItem('admin_user', JSON.stringify(userData));
        localStorage.setItem('admin_token', 'dev-mock-token');
        return { success: true };
      }

      const response = await api.post('/api/auth/login', { email, password });
      const { token, user: userData } = response.data;

      if (userData.role !== 'admin') {
        return { success: false, error: 'Access Denied: Admin privileges required.' };
      }

      setUser(userData);
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(userData));
      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      const errorMsg = err.response?.data?.message || 'Invalid email or password';
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('admin_user');
    localStorage.removeItem('admin_token');
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
