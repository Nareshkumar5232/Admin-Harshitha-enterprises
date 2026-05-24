import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu,
  Bell,
  LogOut,
  User,
  Settings,
  ChevronDown,
  Search,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

export default function TopBar({ pageTitle, sidebarOpen, onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      height: 64,
      gap: '1rem',
      flexShrink: 0,
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onMenuClick}
          style={{
            padding: '0.5rem',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        <div>
          <h2 style={{
            fontSize: '1.05rem',
            fontWeight: 700,
            color: '#0f172a',
            lineHeight: 1,
          }}>
            {pageTitle}
          </h2>
          <p style={{ fontSize: '0.7rem', color: '#94a3b8', marginTop: 2 }}>
            {new Date().toLocaleDateString('en-IN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
            })}
          </p>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.06 }}
          whileTap={{ scale: 0.94 }}
          style={{
            position: 'relative',
            padding: '0.5rem',
            borderRadius: 8,
            border: '1px solid #f1f5f9',
            background: '#f8fafc',
            cursor: 'pointer',
            color: '#475569',
            display: 'flex',
            alignItems: 'center',
          }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span style={{
            position: 'absolute',
            top: 6,
            right: 6,
            width: 7,
            height: 7,
            background: '#ef4444',
            borderRadius: '50%',
            border: '1.5px solid #ffffff',
          }} />
        </motion.button>

        {/* Profile dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <motion.button
            onClick={() => setProfileOpen((v) => !v)}
            whileHover={{ scale: 1.02 }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.375rem 0.625rem 0.375rem 0.375rem',
              borderRadius: 9,
              border: '1px solid #e2e8f0',
              background: profileOpen ? '#f1f5f9' : '#ffffff',
              cursor: 'pointer',
            }}
            aria-label="Profile menu"
          >
            <Avatar name={user?.name || 'Admin'} size="sm" />
            <span style={{ fontSize: '0.825rem', fontWeight: 600, color: '#334155' }} className="hidden md:inline">
              {user?.name || 'Admin'}
            </span>
            <ChevronDown
              size={14}
              style={{
                color: '#94a3b8',
                transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
              }}
              className="hidden md:block"
            />
          </motion.button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, y: -4 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 'calc(100% + 8px)',
                  width: 210,
                  background: '#ffffff',
                  borderRadius: 12,
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.10)',
                  overflow: 'hidden',
                  zIndex: 50,
                }}
              >
                {/* User info */}
                <div style={{
                  padding: '0.875rem 1rem',
                  borderBottom: '1px solid #f1f5f9',
                  background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                }}>
                  <p style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>
                    {user?.name || 'Admin'}
                  </p>
                  <p style={{ fontSize: '0.7rem', color: '#64748b', marginTop: 2 }}>
                    {user?.email || '—'}
                  </p>
                </div>

                {/* Menu items */}
                <div style={{ padding: '0.375rem' }}>
                  {[
                    { icon: User, label: 'My Profile', action: () => setProfileOpen(false) },
                    { icon: Settings, label: 'Settings', action: () => { navigate('/admin/settings'); setProfileOpen(false); } },
                  ].map(({ icon: Icon, label, action }) => (
                    <button
                      key={label}
                      onClick={action}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.625rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: 8,
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.825rem',
                        color: '#334155',
                        fontWeight: 500,
                        textAlign: 'left',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon size={15} />
                      {label}
                    </button>
                  ))}

                  <div style={{ height: 1, background: '#f1f5f9', margin: '0.375rem 0' }} />

                  <button
                    onClick={handleLogout}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.625rem',
                      padding: '0.5rem 0.75rem',
                      borderRadius: 8,
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.825rem',
                      color: '#dc2626',
                      fontWeight: 500,
                      textAlign: 'left',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
