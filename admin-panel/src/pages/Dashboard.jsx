import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  MessageSquare,
  IndianRupee,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Avatar from '../components/Avatar';
import { formatINR, formatNumber } from '../utils/formatting';

/* ── Stat Card ─────────────────────────────────────────────── */
const StatCard = ({ icon: Icon, title, value, change, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.3 }}
    whileHover={{ y: -3 }}
    style={{
      background: '#ffffff',
      borderRadius: 12,
      padding: '1.25rem 1.5rem',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem',
      cursor: 'default',
    }}
  >
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={20} color="#ffffff" />
      </div>
      <span style={{
        display: 'flex',
        alignItems: 'center',
        gap: 3,
        fontSize: '0.72rem',
        fontWeight: 600,
        color: change >= 0 ? '#16a34a' : '#dc2626',
        background: change >= 0 ? '#f0fdf4' : '#fef2f2',
        padding: '0.2rem 0.5rem',
        borderRadius: 9999,
      }}>
        {change >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
        {Math.abs(change)}%
      </span>
    </div>

    <div>
      <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4, fontWeight: 500 }}>{title}</p>
    </div>
  </motion.div>
);

/* ── Empty State ───────────────────────────────────────────── */
const EmptyState = ({ icon: Icon, title, description }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center' }}>
    <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
      <Icon size={28} color="#94a3b8" />
    </div>
    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: 6 }}>{title}</h3>
    <p style={{ fontSize: '0.825rem', color: '#94a3b8', maxWidth: 280, lineHeight: 1.6 }}>{description}</p>
  </div>
);

/* ── Dashboard ─────────────────────────────────────────────── */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalMessages: 0,
  });
  const [orders] = useState([]);
  const [messages] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  const statCards = [
    { icon: ShoppingCart, title: 'Total Orders',    value: formatNumber(stats.totalOrders),    change: 0, color: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
    { icon: TrendingUp,   title: 'Pending Orders',  value: formatNumber(stats.pendingOrders),  change: 0, color: 'linear-gradient(135deg, #f59e0b, #d97706)' },
    { icon: Package,      title: 'Delivered',       value: formatNumber(stats.deliveredOrders),change: 0, color: 'linear-gradient(135deg, #10b981, #059669)' },
    { icon: IndianRupee,  title: 'Total Revenue',   value: formatINR(stats.totalRevenue),      change: 0, color: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
    { icon: Package,      title: 'Total Products',  value: formatNumber(stats.totalProducts),  change: 0, color: 'linear-gradient(135deg, #6366f1, #4f46e5)' },
    { icon: MessageSquare,title: 'New Messages',    value: formatNumber(stats.totalMessages),  change: 0, color: 'linear-gradient(135deg, #06b6d4, #0891b2)' },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400, gap: 12 }}>
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
            <AlertCircle size={28} color="#3b82f6" />
          </motion.div>
          <p style={{ color: '#64748b', fontWeight: 500 }}>Loading dashboard…</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* ── Welcome banner ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #06b6d4 100%)',
          borderRadius: 14,
          padding: '1.5rem 2rem',
          marginBottom: '1.75rem',
          color: '#ffffff',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ position: 'absolute', bottom: -20, right: 80, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            Welcome back
          </p>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            Harshitha Enterprises
          </h1>
          <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>
            Here's an overview of your store today.
          </p>
        </div>
      </motion.div>

      {/* ── Stats grid ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem',
        marginBottom: '1.75rem',
      }}>
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} delay={i * 0.07} />
        ))}
      </div>

      {/* ── Bottom panels ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1rem' }}>
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="admin-card"
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Recent Orders</h3>
            <span style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
          </div>
          {orders.length === 0 ? (
            <EmptyState icon={ShoppingCart} title="No orders yet" description="Orders will appear here when customers place them." />
          ) : (
            <div style={{ padding: '0.75rem 1rem' }}>
              {orders.map((order) => (
                <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid #f8fafc' }}>
                  <div>
                    <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>{order.id}</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b' }}>{order.customer}</p>
                  </div>
                  <span style={{ fontSize: '0.825rem', fontWeight: 700, color: '#0f172a' }}>{formatINR(order.amount)}</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="admin-card"
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Recent Messages</h3>
            <span style={{ fontSize: '0.72rem', color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}>View all →</span>
          </div>
          {messages.length === 0 ? (
            <EmptyState icon={MessageSquare} title="No messages yet" description="Customer inquiries and messages will appear here." />
          ) : (
            <div style={{ padding: '0.75rem 1rem' }}>
              {messages.map((msg, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0', borderBottom: '1px solid #f8fafc' }}>
                  <Avatar name={msg.name} size="sm" />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#0f172a' }}>{msg.name}</p>
                    <p style={{ fontSize: '0.72rem', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</p>
                  </div>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="admin-card"
        >
          <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Quick Actions</h3>
          </div>
          <div style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {[
              { label: 'Add New Product', color: '#3b82f6', bg: '#eff6ff' },
              { label: 'View All Orders', color: '#10b981', bg: '#f0fdf4' },
              { label: 'Check Messages', color: '#8b5cf6', bg: '#f5f3ff' },
              { label: 'Manage Customers', color: '#f59e0b', bg: '#fffbeb' },
            ].map(({ label, color, bg }) => (
              <button
                key={label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 9,
                  border: 'none',
                  background: bg,
                  color,
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  width: '100%',
                }}
              >
                {label}
                <ArrowUpRight size={14} />
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
