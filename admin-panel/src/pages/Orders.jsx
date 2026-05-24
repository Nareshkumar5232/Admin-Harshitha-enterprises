import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, ChevronDown } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { formatINR } from '../utils/formatting';

const STATUS_META = {
  Delivered: { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  Shipped:   { bg: '#eff6ff', color: '#2563eb', dot: '#3b82f6' },
  Pending:   { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  Cancelled: { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
};

const STATUS_OPTIONS = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

export default function Orders() {
  const [orders]         = useState([]);
  const [searchTerm, setSearchTerm]     = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const counts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = s === 'All' ? orders.length : orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <MainLayout>
      {/* ── Header ────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Orders</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{orders.length} total orders</p>
      </div>

      {orders.length > 0 && (
        <>
          {/* ── Filters ─────────────────────────── */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem' }}>
            {STATUS_OPTIONS.map((status) => {
              const active = filterStatus === status;
              return (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.45rem 0.875rem',
                    borderRadius: 9999,
                    border: active ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                    background: active ? '#eff6ff' : '#ffffff',
                    color: active ? '#2563eb' : '#475569',
                    fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer',
                  }}
                >
                  {status}
                  <span style={{
                    fontSize: '0.65rem', fontWeight: 700,
                    background: active ? '#dbeafe' : '#f1f5f9',
                    color: active ? '#1d4ed8' : '#64748b',
                    borderRadius: 9999, padding: '1px 7px',
                  }}>
                    {counts[status]}
                  </span>
                </button>
              );
            })}
          </div>

          {/* ── Search ─────────────────────────── */}
          <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search by Order ID or Customer…"
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
        </>
      )}

      {/* ── Table card ────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card"
        style={{ overflow: 'hidden' }}
      >
        {filtered.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <ShoppingCart size={30} color="#94a3b8" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>No orders yet</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 300, lineHeight: 1.6 }}>
              Orders will appear here once customers start placing them.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order, idx) => {
                  const meta = STATUS_META[order.status] ?? STATUS_META.Pending;
                  return (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                    >
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {order.id}
                        </span>
                      </td>
                      <td style={{ color: '#334155', fontWeight: 500 }}>{order.customer}</td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>{formatINR(order.amount)}</td>
                      <td style={{ color: '#64748b' }}>{order.date}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 10px', borderRadius: 9999,
                          background: meta.bg, color: meta.color,
                          fontWeight: 600, fontSize: '0.72rem',
                        }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: meta.dot }} />
                          {order.status}
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
