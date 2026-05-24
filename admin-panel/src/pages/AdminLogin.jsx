import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Mail, Eye, EyeOff, Zap, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

export default function AdminLogin() {
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const { login } = useAuth();
  const navigate  = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600)); // simulate network
    try {
      if (login(email, password)) {
        navigate('/admin/dashboard');
      } else {
        setError('Invalid email or password. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 40%, #0c1a3d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "'Inter', system-ui, sans-serif",
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* ── Animated background blobs ─── */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ position: 'absolute', top: '-15%', right: '-10%', width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,0.4) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          style={{ position: 'absolute', bottom: '-10%', left: '-8%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 70%)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.08, 0.14, 0.08] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 600, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)' }}
        />

        {/* Grid overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(59,130,246,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.05) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }} />
      </div>

      {/* ── Card ─────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        style={{ width: '100%', maxWidth: 440, position: 'relative', zIndex: 10 }}
      >
        {/* Glassmorphism card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderRadius: 20,
          border: '1px solid rgba(59,130,246,0.18)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04) inset',
          overflow: 'hidden',
        }}>
          {/* Top accent bar */}
          <div style={{ height: 3, background: 'linear-gradient(90deg, #3b82f6, #06b6d4, #8b5cf6)' }} />

          <div style={{ padding: '2.5rem 2.25rem' }}>
            {/* ── Brand header ──────────── */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <motion.div
                initial={{ scale: 0, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 180, delay: 0.2 }}
                style={{
                  width: 70, height: 70,
                  margin: '0 auto 1.25rem',
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 32px rgba(59,130,246,0.4)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <img
                  src={logo}
                  alt="Harshitha Enterprises"
                  style={{ width: 44, height: 44, objectFit: 'contain' }}
                  onError={(e) => { e.target.style.display = 'none'; e.target.parentNode.innerHTML += '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'; }}
                />
                {/* Shine effect */}
                <div style={{ position: 'absolute', top: 0, left: '-100%', width: '60%', height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)', transform: 'skewX(-20deg)', animation: 'shine 3s infinite 1s' }} />
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f1f5f9', letterSpacing: '-0.03em', marginBottom: 6 }}>
                  Admin Portal
                </h1>
                <p style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500 }}>
                  Sree Harshitha Enterprises
                </p>
                <p style={{ fontSize: '0.72rem', color: '#475569', marginTop: 3 }}>
                  Premium Electronics · Chennai
                </p>
              </motion.div>
            </div>

            {/* ── Error banner ──────────── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: 'auto', marginBottom: '1.25rem' }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  style={{
                    padding: '0.75rem 1rem',
                    background: 'rgba(239,68,68,0.12)',
                    border: '1px solid rgba(239,68,68,0.3)',
                    borderRadius: 10,
                    fontSize: '0.825rem',
                    color: '#fca5a5',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  <ShieldCheck size={15} style={{ flexShrink: 0 }} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Form ──────────────────── */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Email */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Email Address
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    id="admin-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@harshithaenterprises.com"
                    required
                    autoComplete="username"
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.75rem',
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(100,116,139,0.3)',
                      borderRadius: 11,
                      fontSize: '0.875rem',
                      color: '#e2e8f0',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(100,116,139,0.3)'; e.target.style.boxShadow = 'none'; }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#475569' }} />
                  <input
                    id="admin-password"
                    type={showPwd ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    style={{
                      width: '100%',
                      padding: '0.75rem 3rem 0.75rem 2.75rem',
                      background: 'rgba(15,23,42,0.6)',
                      border: '1px solid rgba(100,116,139,0.3)',
                      borderRadius: 11,
                      fontSize: '0.875rem',
                      color: '#e2e8f0',
                      outline: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 0.2s, box-shadow 0.2s',
                    }}
                    onFocus={e => { e.target.style.borderColor = 'rgba(59,130,246,0.7)'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor = 'rgba(100,116,139,0.3)'; e.target.style.boxShadow = 'none'; }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: 4 }}
                    tabIndex={-1}
                  >
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                style={{
                  marginTop: '0.5rem',
                  width: '100%',
                  padding: '0.875rem',
                  background: loading
                    ? 'rgba(59,130,246,0.5)'
                    : 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #06b6d4 100%)',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.925rem',
                  borderRadius: 11,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: loading ? 'none' : '0 4px 20px rgba(59,130,246,0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'background 0.3s, box-shadow 0.3s',
                  letterSpacing: '0.01em',
                }}
              >
                {loading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
                      style={{ width: 18, height: 18, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#ffffff', borderRadius: '50%', display: 'inline-block' }}
                    />
                    Authenticating…
                  </>
                ) : (
                  <>
                    <Zap size={17} />
                    Sign In to Dashboard
                  </>
                )}
              </motion.button>
            </form>

            {/* ── Hint ──────────────────── */}
            <div style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              background: 'rgba(59,130,246,0.07)',
              border: '1px solid rgba(59,130,246,0.15)',
              borderRadius: 10,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 8,
            }}>
              <ShieldCheck size={14} style={{ color: '#60a5fa', flexShrink: 0, marginTop: 1 }} />
              <p style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.5 }}>
                <span style={{ color: '#93c5fd', fontWeight: 600 }}>Dev credentials:</span> admin@gmail.com / admin@123
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', fontSize: '0.72rem', color: '#334155', marginTop: '1.25rem' }}>
          © 2026 Sree Harshitha Enterprises · Chennai, Tamil Nadu
        </p>
      </motion.div>

      <style>{`
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 200%; }
        }
        input::placeholder { color: #334155 !important; }
      `}</style>
    </div>
  );
}
