import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Send, RefreshCw, CheckCircle, AlertCircle,
  IndianRupee, CreditCard, User, Landmark, HelpCircle, X
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { formatINR } from '../utils/formatting';
import { payoutsAPI } from '../services/api';

const STATUS_COLORS = {
  SUCCESS:  { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  PENDING:  { bg: '#fffbeb', color: '#d97706', dot: '#f59e0b' },
  FAILED:   { bg: '#fef2f2', color: '#dc2626', dot: '#ef4444' },
  REJECTED: { bg: '#fbf7f7', color: '#7f1d1d', dot: '#991b1b' },
};

const inputStyle = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  border: '1px solid #e2e8f0',
  borderRadius: 9,
  fontSize: '0.875rem',
  color: '#0f172a',
  outline: 'none',
  background: '#f8fafc',
  boxSizing: 'border-box',
  fontFamily: 'inherit',
};

const focusStyle = (e) => {
  e.target.style.borderColor = '#3b82f6';
  e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.1)';
  e.target.style.background = '#ffffff';
};

const blurStyle = (e) => {
  e.target.style.borderColor = '#e2e8f0';
  e.target.style.boxShadow = 'none';
  e.target.style.background = '#f8fafc';
};

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiaryModalOpen, setBeneficiaryModalOpen] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  
  // Forms state
  const [beneForm, setBeneForm] = useState({
    beneficiary_id: '',
    beneficiary_name: '',
    email: '',
    phone: '',
    payment_method: 'bank',
    bank_account_number: '',
    bank_ifsc: '',
    vpa: ''
  });
  
  const [transferForm, setTransferForm] = useState({
    beneficiary_id: '',
    amount: '',
    transfer_mode: 'banktransfer',
    remarks: ''
  });

  const [savingBene, setSavingBene] = useState(false);
  const [savingTransfer, setSavingTransfer] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const fetchPayouts = async () => {
    setLoading(true);
    try {
      const response = await payoutsAPI.list();
      if (response.data && response.data.payouts) {
        setPayouts(response.data.payouts);
      }
    } catch (err) {
      console.error('Failed to fetch payouts list:', err);
      // Fallback placeholder during dev if backend server variables are not set up yet
      setPayouts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts();
  }, []);

  const showFeedback = (message, tone = 'success') => {
    setFeedback({ message, tone });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleAddBeneficiary = async (e) => {
    e.preventDefault();
    if (!beneForm.beneficiary_id || !beneForm.beneficiary_name) {
      alert('Please fill out Beneficiary ID and Name.');
      return;
    }
    setSavingBene(true);
    try {
      const payload = {
        beneficiary_id: beneForm.beneficiary_id,
        beneficiary_name: beneForm.beneficiary_name,
        email: beneForm.email,
        phone: beneForm.phone,
        payment_method: beneForm.payment_method,
        bank_account_number: beneForm.payment_method === 'bank' ? beneForm.bank_account_number : undefined,
        bank_ifsc: beneForm.payment_method === 'bank' ? beneForm.bank_ifsc : undefined,
        vpa: beneForm.payment_method === 'upi' ? beneForm.vpa : undefined,
      };

      await payoutsAPI.addBeneficiary(payload);
      showFeedback(`Beneficiary "${beneForm.beneficiary_name}" registered successfully!`);
      setBeneficiaryModalOpen(false);
      setBeneForm({
        beneficiary_id: '',
        beneficiary_name: '',
        email: '',
        phone: '',
        payment_method: 'bank',
        bank_account_number: '',
        bank_ifsc: '',
        vpa: ''
      });
    } catch (err) {
      console.error('Failed to register beneficiary:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to register beneficiary with Cashfree.';
      alert(errMsg);
    } finally {
      setSavingBene(false);
    }
  };

  const handleInitiateTransfer = async (e) => {
    e.preventDefault();
    if (!transferForm.beneficiary_id || !transferForm.amount) {
      alert('Please fill out Beneficiary ID and Amount.');
      return;
    }
    setSavingTransfer(true);
    try {
      const payload = {
        beneficiary_id: transferForm.beneficiary_id,
        amount: parseFloat(transferForm.amount),
        transfer_mode: transferForm.transfer_mode,
        remarks: transferForm.remarks
      };

      const response = await payoutsAPI.initiateTransfer(payload);
      showFeedback(`Payout transfer of ${formatINR(payload.amount)} initiated!`);
      setTransferModalOpen(false);
      setTransferForm({
        beneficiary_id: '',
        amount: '',
        transfer_mode: 'banktransfer',
        remarks: ''
      });
      // Refresh logs
      fetchPayouts();
    } catch (err) {
      console.error('Failed to initiate payout transfer:', err);
      const errMsg = err.response?.data?.message || err.response?.data?.error?.message || 'Failed to initiate transfer.';
      alert(errMsg);
    } finally {
      setSavingTransfer(false);
    }
  };

  const handleVerifyStatus = async (transfer_id) => {
    setVerifyingId(transfer_id);
    try {
      const response = await payoutsAPI.verifyStatus(transfer_id);
      const updatedPayout = response.data.payout;
      showFeedback(`Payout status updated to: ${updatedPayout.status}`);
      setPayouts(prev => prev.map(p => p.transfer_id === transfer_id ? updatedPayout : p));
    } catch (err) {
      console.error('Failed to verify payout status:', err);
      alert('Failed to verify transfer status.');
    } finally {
      setVerifyingId(null);
    }
  };

  const filtered = payouts.filter((p) => {
    const q = searchTerm.toLowerCase();
    return (
      p.transfer_id?.toLowerCase().includes(q) ||
      p.beneficiary_id?.toLowerCase().includes(q) ||
      p.status?.toLowerCase().includes(q) ||
      p.utr?.toLowerCase().includes(q)
    );
  });

  // Calculate quick stats
  const totalAmountDisbursed = payouts
    .filter(p => p.status === 'SUCCESS')
    .reduce((sum, p) => sum + p.amount, 0);

  const pendingCount = payouts.filter(p => p.status === 'PENDING').length;
  const failedCount = payouts.filter(p => p.status === 'FAILED' || p.status === 'REJECTED').length;

  return (
    <MainLayout>
      {/* ── Page Header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Payouts Management</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            Register beneficiaries and disburse funds securely via Cashfree Payout V2.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setBeneficiaryModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.6rem 1.1rem',
              background: '#ffffff',
              color: '#3b82f6', fontWeight: 700, fontSize: '0.85rem',
              borderRadius: 10, border: '1.5px solid #dbeafe', cursor: 'pointer',
              boxShadow: '0 2px 4px rgba(59,130,246,0.05)',
            }}
          >
            <Landmark size={15} /> Add Beneficiary
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setTransferModalOpen(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0.6rem 1.1rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', fontWeight: 700, fontSize: '0.85rem',
              borderRadius: 10, border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(37,99,235,0.3)',
            }}
          >
            <Send size={15} /> Request Payout
          </motion.button>
        </div>
      </div>

      {/* ── Feedback Notification ──────────────── */}
      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: feedback.tone === 'success' ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${feedback.tone === 'success' ? '#bbf7d0' : '#fecdd3'}`,
              color: feedback.tone === 'success' ? '#15803d' : '#b91c1c',
              padding: '0.75rem 1rem', borderRadius: 9, marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.85rem', fontWeight: 500
            }}
          >
            {feedback.tone === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            {feedback.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Stats widgets ──────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Total Disbursed</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{formatINR(totalAmountDisbursed)}</p>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Pending Transfers</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#d97706' }}>{pendingCount}</p>
        </div>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, padding: '1.25rem', boxShadow: '0 2px 6px rgba(0,0,0,0.02)' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>Failed Transfers</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 800, color: '#dc2626' }}>{failedCount}</p>
        </div>
      </div>

      {/* ── Search Bar ─────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by Transfer ID, Beneficiary ID, UTR, or status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, paddingLeft: '2.375rem', background: '#ffffff' }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Payouts Table ──────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="admin-card"
        style={{ overflow: 'hidden' }}
      >
        {loading ? (
          <div style={{ padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <RefreshCw size={24} className="animate-spin" color="#3b82f6" />
            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Loading payouts list...</p>
          </div>
        ) : payouts.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
              <Send size={28} color="#3b82f6" />
            </div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', marginBottom: 8 }}>No payouts initiated yet</h3>
            <p style={{ fontSize: '0.85rem', color: '#94a3b8', maxWidth: 320, margin: '0 auto 1.5rem', lineHeight: 1.6 }}>
              Payout request records will show up here as you disburse funds to vendors or process customer refunds.
            </p>
            <button
              onClick={() => setTransferModalOpen(true)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.55rem 1.25rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', borderRadius: 9, border: 'none', cursor: 'pointer' }}
            >
              <Send size={14} /> Initiate First Payout
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            <p>No payout records matched your search terms.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transfer ID</th>
                  <th>Beneficiary ID</th>
                  <th>Amount</th>
                  <th>Mode</th>
                  <th>Status</th>
                  <th>UTR / Failure Msg</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item, idx) => {
                  const meta = STATUS_COLORS[item.status] || STATUS_COLORS.PENDING;
                  return (
                    <motion.tr
                      key={item.transfer_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                    >
                      <td style={{ color: '#64748b', fontSize: '0.78rem' }}>
                        {new Date(item.createdAt).toLocaleString()}
                      </td>
                      <td>
                        <span style={{ fontWeight: 700, color: '#0f172a', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                          {item.transfer_id}
                        </span>
                      </td>
                      <td style={{ color: '#334155', fontWeight: 500 }}>
                        {item.beneficiary_id}
                      </td>
                      <td style={{ fontWeight: 700, color: '#0f172a' }}>
                        {formatINR(item.amount)}
                      </td>
                      <td style={{ textTransform: 'uppercase', fontSize: '0.72rem', color: '#475569', fontWeight: 600 }}>
                        {item.transfer_mode}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-flex', alignItems: 'center', gap: 5,
                          padding: '3px 8px', borderRadius: 9999,
                          background: meta.bg, color: meta.color,
                          fontWeight: 700, fontSize: '0.7rem',
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: meta.dot }} />
                          {item.status}
                        </span>
                      </td>
                      <td style={{ color: '#475569', fontSize: '0.78rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.status === 'SUCCESS' ? (
                          <span style={{ fontFamily: 'monospace', color: '#16a34a', fontWeight: 600 }}>
                            UTR: {item.utr || 'N/A'}
                          </span>
                        ) : (
                          <span style={{ color: '#dc2626' }}>
                            {item.failure_reason || 'N/A'}
                          </span>
                        )}
                      </td>
                      <td>
                        {item.status === 'PENDING' ? (
                          <button
                            disabled={verifyingId === item.transfer_id}
                            onClick={() => handleVerifyStatus(item.transfer_id)}
                            style={{
                              display: 'inline-flex', alignItems: 'center', gap: 5,
                              padding: '4px 8px', border: '1px solid #bfdbfe',
                              borderRadius: 6, background: '#eff6ff', color: '#2563eb',
                              fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer'
                            }}
                          >
                            <RefreshCw size={11} className={verifyingId === item.transfer_id ? 'animate-spin' : ''} />
                            Verify
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontStyle: 'italic' }}>
                            Verified
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* ═══════════════ REGISTER BENEFICIARY MODAL ════════════════════ */}
      <AnimatePresence>
        {beneficiaryModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBeneficiaryModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 500, background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Landmark size={18} color="#2563eb" />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Register Beneficiary</h2>
                </div>
                <button onClick={() => setBeneficiaryModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleAddBeneficiary} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Beneficiary ID (Unique)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. USER_1002_BANK"
                    value={beneForm.beneficiary_id}
                    onChange={e => setBeneForm(p => ({ ...p, beneficiary_id: e.target.value }))}
                    style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajesh Kumar"
                    value={beneForm.beneficiary_name}
                    onChange={e => setBeneForm(p => ({ ...p, beneficiary_name: e.target.value }))}
                    style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Email</label>
                    <input
                      type="email"
                      placeholder="e.g. rajesh@gmail.com"
                      value={beneForm.email}
                      onChange={e => setBeneForm(p => ({ ...p, email: e.target.value }))}
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Mobile Number</label>
                    <input
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={beneForm.phone}
                      onChange={e => setBeneForm(p => ({ ...p, phone: e.target.value }))}
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Payment Method</label>
                  <select
                    value={beneForm.payment_method}
                    onChange={e => setBeneForm(p => ({ ...p, payment_method: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="bank">Bank Account Transfer</option>
                    <option value="upi">UPI ID (VPA)</option>
                  </select>
                </div>

                {beneForm.payment_method === 'bank' ? (
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.75rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Account Number</label>
                      <input
                        type="text"
                        required
                        placeholder="12233344445"
                        value={beneForm.bank_account_number}
                        onChange={e => setBeneForm(p => ({ ...p, bank_account_number: e.target.value }))}
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>IFSC Code</label>
                      <input
                        type="text"
                        required
                        placeholder="SBIN0001234"
                        value={beneForm.bank_ifsc}
                        onChange={e => setBeneForm(p => ({ ...p, bank_ifsc: e.target.value }))}
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </div>
                  </div>
                ) : (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>UPI VPA / ID</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. rajesh@ybl"
                      value={beneForm.vpa}
                      onChange={e => setBeneForm(p => ({ ...p, vpa: e.target.value }))}
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setBeneficiaryModalOpen(false)}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingBene}
                    style={{
                      flex: 1.5, padding: '0.6rem', borderRadius: 9, border: 'none',
                      background: savingBene ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: savingBene ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {savingBene ? 'Saving...' : 'Register Beneficiary'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ REQUEST PAYOUT MODAL ════════════════════ */}
      <AnimatePresence>
        {transferModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setTransferModalOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(3px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 450, background: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}
            >
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Send size={18} color="#2563eb" />
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>Initiate Payout Transfer</h2>
                </div>
                <button onClick={() => setTransferModalOpen(false)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: '#64748b' }}>
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleInitiateTransfer} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Beneficiary ID</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter pre-registered beneficiary ID"
                    value={transferForm.beneficiary_id}
                    onChange={e => setTransferForm(p => ({ ...p, beneficiary_id: e.target.value }))}
                    style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                  <p style={{ fontSize: '0.65rem', color: '#94a3b8', marginTop: 4 }}>Make sure this ID is already added in Cashfree Payout.</p>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Payout Amount (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    placeholder="0.00"
                    value={transferForm.amount}
                    onChange={e => setTransferForm(p => ({ ...p, amount: e.target.value }))}
                    style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Transfer Mode</label>
                  <select
                    value={transferForm.transfer_mode}
                    onChange={e => setTransferForm(p => ({ ...p, transfer_mode: e.target.value }))}
                    style={inputStyle}
                  >
                    <option value="banktransfer">Automatic / Bank Transfer</option>
                    <option value="imps">IMPS (Instant)</option>
                    <option value="neft">NEFT (Standard)</option>
                    <option value="rtgs">RTGS (Large Value)</option>
                    <option value="upi">UPI</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase', marginBottom: 4 }}>Remarks (Alphanumeric)</label>
                  <input
                    type="text"
                    maxLength="70"
                    placeholder="e.g. Vendor payment may 2026"
                    value={transferForm.remarks}
                    onChange={e => setTransferForm(p => ({ ...p, remarks: e.target.value }))}
                    style={inputStyle}
                    onFocus={focusStyle} onBlur={blurStyle}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setTransferModalOpen(false)}
                    style={{ flex: 1, padding: '0.6rem', borderRadius: 9, border: '1px solid #e2e8f0', background: '#fff', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingTransfer}
                    style={{
                      flex: 1.5, padding: '0.6rem', borderRadius: 9, border: 'none',
                      background: savingTransfer ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: savingTransfer ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {savingTransfer ? 'Processing...' : 'Confirm & Send Payout'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
