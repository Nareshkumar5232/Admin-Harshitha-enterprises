import React from 'react';
import { motion } from 'framer-motion';
import {
  BarChart3,
  TrendingUp,
  ShoppingCart,
  Users,
  IndianRupee,
  Package,
  ArrowUpRight,
  Zap,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const MetricCard = ({ icon: Icon, label, value, sub, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="admin-card"
    style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}
  >
    <div style={{ width: 46, height: 46, borderRadius: 11, background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={20} color="#ffffff" />
    </div>
    <div>
      <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</p>
      <p style={{ fontSize: '0.8rem', fontWeight: 500, color: '#64748b', marginTop: 4 }}>{label}</p>
      {sub && <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{sub}</p>}
    </div>
  </motion.div>
);

/* Fake bar chart using divs */
const BarChart = ({ data, color }) => {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 100 }}>
      {data.map(({ label, value }) => (
        <div key={label} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(value / max) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{ width: '100%', background: color, borderRadius: '4px 4px 0 0', minHeight: 4 }}
          />
          <span style={{ fontSize: '0.6rem', color: '#94a3b8', textAlign: 'center' }}>{label}</span>
        </div>
      ))}
    </div>
  );
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const emptyMonths = MONTHS.map((label) => ({ label, value: 0 }));

export default function Analytics() {
  return (
    <MainLayout>
      {/* ── Header ────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Analytics</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Performance metrics & insights for your store</p>
      </div>

      {/* ── KPI cards ─────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: IndianRupee,  label: 'Total Revenue',       value: '₹0',  sub: 'All time',        color: 'linear-gradient(135deg,#8b5cf6,#7c3aed)', delay: 0.0 },
          { icon: ShoppingCart, label: 'Total Orders',        value: '0',   sub: 'All time',        color: 'linear-gradient(135deg,#3b82f6,#2563eb)', delay: 0.07 },
          { icon: Users,        label: 'Total Customers',     value: '0',   sub: 'Registered',      color: 'linear-gradient(135deg,#10b981,#059669)', delay: 0.14 },
          { icon: Package,      label: 'Products Listed',     value: '0',   sub: 'In catalogue',    color: 'linear-gradient(135deg,#f59e0b,#d97706)', delay: 0.21 },
          { icon: TrendingUp,   label: 'Avg. Order Value',    value: '₹0',  sub: 'Per transaction', color: 'linear-gradient(135deg,#06b6d4,#0891b2)', delay: 0.28 },
          { icon: Zap,          label: 'Conversion Rate',     value: '0%',  sub: 'Visitors → buyers', color: 'linear-gradient(135deg,#f43f5e,#e11d48)', delay: 0.35 },
        ].map((p) => <MetricCard key={p.label} {...p} />)}
      </div>

      {/* ── Charts row ────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {/* Revenue chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="admin-card"
          style={{ padding: '1.25rem 1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Monthly Revenue</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Year to date</p>
            </div>
            <ArrowUpRight size={18} color="#10b981" />
          </div>
          <BarChart data={emptyMonths} color="linear-gradient(to top, #3b82f6, #60a5fa)" />
        </motion.div>

        {/* Orders chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.47 }}
          className="admin-card"
          style={{ padding: '1.25rem 1.5rem' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>Monthly Orders</h3>
              <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>Year to date</p>
            </div>
            <ArrowUpRight size={18} color="#8b5cf6" />
          </div>
          <BarChart data={emptyMonths} color="linear-gradient(to top, #8b5cf6, #c4b5fd)" />
        </motion.div>
      </div>

      {/* ── Coming soon banner ─────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
          borderRadius: 14,
          padding: '1.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.25rem',
          color: '#ffffff',
        }}
      >
        <div style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <BarChart3 size={26} color="#60a5fa" />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>
            Advanced Analytics Coming Soon
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#93c5fd', lineHeight: 1.5 }}>
            Real-time charts, funnel analysis, and customer behaviour insights will be available once your store starts receiving orders.
          </p>
        </div>
      </motion.div>
    </MainLayout>
  );
}
