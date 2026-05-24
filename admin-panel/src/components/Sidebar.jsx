import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  X,
  ChevronRight,
} from 'lucide-react';
import logo from '../assets/logo.png';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/admin/dashboard' },
  { icon: Package,         label: 'Products',   path: '/admin/products'  },
  { icon: ShoppingCart,    label: 'Orders',     path: '/admin/orders'    },
  { icon: MessageSquare,   label: 'Messages',   path: '/admin/messages'  },
  { icon: Users,           label: 'Customers',  path: '/admin/customers' },
  { icon: BarChart3,       label: 'Analytics',  path: '/admin/analytics' },
  { icon: Settings,        label: 'Settings',   path: '/admin/settings'  },
];

const navGroups = [
  { label: 'Main',      items: navItems.slice(0, 4) },
  { label: 'Insights',  items: navItems.slice(4, 6) },
  { label: 'System',    items: navItems.slice(6) },
];

export default function Sidebar({ open, onClose }) {
  const location = useLocation();

  return (
    <aside className={`sidebar${open ? ' open' : ''}`}>
      {/* ── Brand ─────────────────────────────── */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
          <img
            src={logo}
            alt="Harshitha Enterprises"
            style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0, borderRadius: 8 }}
          />
          <div style={{ minWidth: 0 }}>
            <p style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a', lineHeight: 1.2, whiteSpace: 'nowrap' }}>
              Harshitha
            </p>
            <p style={{ fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase', marginTop: 2 }}>
              Admin Panel
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="lg:hidden"
          style={{
            padding: '0.375rem',
            borderRadius: 8,
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: '#64748b',
            flexShrink: 0,
          }}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* ── Navigation ────────────────────────── */}
      <nav style={{ flex: 1, padding: '0.75rem 0.75rem', overflowY: 'auto' }}>
        {navGroups.map((group) => (
          <div key={group.label} style={{ marginBottom: '1.25rem' }}>
            <p style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: '#94a3b8',
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              padding: '0 0.5rem',
              marginBottom: '0.375rem',
            }}>
              {group.label}
            </p>

            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && onClose()}
                  style={{ display: 'block', marginBottom: '0.125rem' }}
                >
                  <motion.div
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.15 }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.625rem 0.75rem',
                      borderRadius: 9,
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      position: 'relative',
                      background: isActive
                        ? 'linear-gradient(135deg, #eff6ff, #dbeafe)'
                        : 'transparent',
                      color: isActive ? '#1d4ed8' : '#475569',
                      border: isActive ? '1px solid #bfdbfe' : '1px solid transparent',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 3,
                          height: 20,
                          background: '#2563eb',
                          borderRadius: '0 3px 3px 0',
                        }}
                      />
                    )}
                    <Icon size={17} style={{ flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {isActive && (
                      <ChevronRight size={14} style={{ opacity: 0.5 }} />
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Footer ────────────────────────────── */}
      <div style={{
        padding: '0.875rem 1.25rem',
        borderTop: '1px solid #f1f5f9',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
          © 2026 Harshitha Enterprises
        </p>
      </div>
    </aside>
  );
}
