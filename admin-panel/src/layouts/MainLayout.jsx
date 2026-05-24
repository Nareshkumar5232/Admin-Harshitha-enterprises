import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import '../App.css';

const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/messages': 'Messages',
  '/admin/customers': 'Customers',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
};

export default function MainLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const pageTitle = PAGE_TITLES[location.pathname] ?? 'Admin';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  return (
    <div className="admin-shell">
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay${sidebarOpen ? ' active' : ''}`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Right column */}
      <div className="main-content">
        <TopBar
          pageTitle={pageTitle}
          sidebarOpen={sidebarOpen}
          onMenuClick={() => setSidebarOpen((v) => !v)}
        />

        <main className="page-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
