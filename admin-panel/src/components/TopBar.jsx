import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Avatar from './Avatar';

export default function TopBar({ sidebarOpen, onMenuClick }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin-login');
  };

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between px-4 md:px-8 py-4 gap-4">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold text-slate-900 hidden md:block">
            Dashboard
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 hover:bg-slate-100 rounded-lg transition text-slate-600"
          >
            <Bell className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setProfileOpen(!profileOpen)}
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <Avatar name={user?.name || 'Admin'} size="sm" />
              <span className="text-sm font-medium hidden md:inline text-slate-700">
                {user?.name || 'Admin'}
              </span>
            </motion.button>

            {/* Dropdown Menu */}
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-200 overflow-hidden z-50"
              >
                <div className="p-4 border-b border-slate-200">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                <div className="p-2">
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition">
                    <User className="w-4 h-4" />
                    Profile
                  </button>
                  <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-slate-100 rounded-lg text-sm text-slate-700 transition">
                    <Settings className="w-4 h-4" />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-50 rounded-lg text-sm text-red-600 transition"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
