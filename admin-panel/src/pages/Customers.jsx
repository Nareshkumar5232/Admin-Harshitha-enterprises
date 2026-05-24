import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, Mail, Phone, ShoppingBag, TrendingUp, UserPlus } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Avatar from '../components/Avatar';

const TIER_META = {
  Gold:   { bg: '#fffbeb', color: '#d97706', border: '#fde68a' },
  Silver: { bg: '#f8fafc', color: '#64748b', border: '#e2e8f0' },
  Bronze: { bg: '#fff7ed', color: '#c2410c', border: '#fed7aa' },
};

export default function Customers() {
  const [customers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState(null);

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <MainLayout>
      {/* ── Header ────────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Customers</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{customers.length} registered customers</p>
        </div>
      </div>

      {/* ── Summary cards ─────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {[
          { icon: Users,      label: 'Total Customers', value: customers.length,  color: '#3b82f6', bg: 'linear-gradient(135deg,#3b82f6,#2563eb)' },
          { icon: UserPlus,   label: 'New This Month',  value: 0,                 color: '#10b981', bg: 'linear-gradient(135deg,#10b981,#059669)' },
          { icon: ShoppingBag,label: 'Avg. Orders',     value: '0',               color: '#8b5cf6', bg: 'linear-gradient(135deg,#8b5cf6,#7c3aed)' },
          { icon: TrendingUp, label: 'Retention Rate',  value: '—',               color: '#f59e0b', bg: 'linear-gradient(135deg,#f59e0b,#d97706)' },
        ].map(({ icon: Icon, label, value, color, bg }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="admin-card"
            style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem' }}
          >
            <div style={{ width: 42, height: 42, borderRadius: 10, background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon size={18} color="#ffffff" />
            </div>
            <div>
              <p style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</p>
              <p style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 3, fontWeight: 500 }}>{label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search ────────────────────────────── */}
      {customers.length > 0 && (
        <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search customers…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%', padding: '0.625rem 1rem 0.625rem 2.5rem',
              border: '1px solid #e2e8f0', borderRadius: 9,
              fontSize: '0.875rem', color: '#0f172a', outline: 'none',
              background: '#ffffff', boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* ── Table / Empty ─────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="admin-card"
        style={{ overflow: 'hidden' }}
      >
        {customers.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Users size={30} color="#94a3b8" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>No customers yet</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 300, lineHeight: 1.6 }}>
              Customer records will appear here as people create accounts or place orders.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>No customers match "<strong>{searchTerm}</strong>"</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Orders</th>
                  <th>Tier</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c, idx) => {
                  const meta = TIER_META[c.tier] ?? TIER_META.Silver;
                  return (
                    <motion.tr
                      key={c.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.04 }}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelected(c)}
                    >
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Avatar name={c.name} size="sm" />
                          <span style={{ fontWeight: 600, color: '#0f172a' }}>{c.name}</span>
                        </div>
                      </td>
                      <td style={{ color: '#475569' }}>{c.email}</td>
                      <td style={{ color: '#475569' }}>{c.phone ?? '—'}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{c.orders ?? 0}</td>
                      <td>
                        <span style={{
                          display: 'inline-block', padding: '2px 10px', borderRadius: 9999,
                          fontSize: '0.7rem', fontWeight: 700,
                          background: meta.bg, color: meta.color, border: `1px solid ${meta.border}`,
                        }}>
                          {c.tier ?? 'New'}
                        </span>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </MainLayout>
  );
}
