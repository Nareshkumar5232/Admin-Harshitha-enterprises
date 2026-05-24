import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings as SettingsIcon,
  Store,
  Lock,
  Bell,
  Globe,
  Palette,
  ChevronRight,
  Save,
  Check,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

const SECTIONS = [
  { icon: Store,   label: 'Store Information',   id: 'store'   },
  { icon: Lock,    label: 'Security & Password',  id: 'security'},
  { icon: Bell,    label: 'Notifications',        id: 'notifs'  },
  { icon: Globe,   label: 'Regional & Language',  id: 'region'  },
  { icon: Palette, label: 'Appearance',           id: 'appear'  },
];

const InputRow = ({ label, type = 'text', placeholder, defaultValue }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', alignItems: 'center', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9' }}>
    <label style={{ fontSize: '0.825rem', fontWeight: 600, color: '#374151' }}>{label}</label>
    <input
      type={type}
      defaultValue={defaultValue}
      placeholder={placeholder}
      style={{
        padding: '0.5rem 0.875rem',
        border: '1px solid #e2e8f0',
        borderRadius: 8,
        fontSize: '0.85rem',
        color: '#0f172a',
        outline: 'none',
        background: '#f8fafc',
      }}
      onFocus={e => { e.target.style.borderColor = '#3b82f6'; e.target.style.boxShadow = '0 0 0 3px rgba(59,130,246,0.12)'; }}
      onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
    />
  </div>
);

const ToggleRow = ({ label, description, defaultChecked }) => {
  const [on, setOn] = useState(defaultChecked ?? false);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', borderBottom: '1px solid #f1f5f9', gap: '1rem' }}>
      <div>
        <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#374151' }}>{label}</p>
        {description && <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>{description}</p>}
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer', flexShrink: 0,
          background: on ? '#3b82f6' : '#e2e8f0',
          position: 'relative',
          transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 3, left: on ? 'calc(100% - 21px)' : 3,
          width: 18, height: 18, borderRadius: '50%', background: '#ffffff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        }} />
      </button>
    </div>
  );
};

export default function Settings() {
  const [activeSection, setActiveSection] = useState('store');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <MainLayout>
      {/* ── Header ────────────────────────────── */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Settings</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Manage your store configuration and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '1.25rem', alignItems: 'start' }}>
        {/* ── Sidebar nav ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          className="admin-card"
          style={{ padding: '0.625rem' }}
        >
          {SECTIONS.map(({ icon: Icon, label, id }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                style={{
                  width: '100%',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 9, border: 'none', cursor: 'pointer',
                  background: active ? '#eff6ff' : 'transparent',
                  color: active ? '#2563eb' : '#475569',
                  fontWeight: active ? 700 : 500,
                  fontSize: '0.825rem',
                  textAlign: 'left',
                  marginBottom: 2,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={15} />
                  {label}
                </div>
                {active && <ChevronRight size={13} />}
              </button>
            );
          })}
        </motion.div>

        {/* ── Panel ───────────────────────────── */}
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="admin-card"
          style={{ padding: '1.5rem' }}
        >
          {activeSection === 'store' && (
            <>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Store Information</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>Basic details about your business</p>
              <InputRow label="Store Name"    placeholder="Harshitha Enterprises" defaultValue="Harshitha Enterprises" />
              <InputRow label="Owner Name"    placeholder="Owner full name" />
              <InputRow label="Email"         type="email" placeholder="contact@example.com" />
              <InputRow label="Phone"         type="tel" placeholder="+91 XXXXX XXXXX" />
              <InputRow label="Address"       placeholder="Street, City, State" />
              <InputRow label="GST Number"    placeholder="27AAAAA0000A1Z5" />
            </>
          )}

          {activeSection === 'security' && (
            <>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Security & Password</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>Keep your admin account secure</p>
              <InputRow label="Current Password" type="password" placeholder="••••••••" />
              <InputRow label="New Password"     type="password" placeholder="••••••••" />
              <InputRow label="Confirm Password" type="password" placeholder="••••••••" />
              <ToggleRow label="Two-Factor Authentication" description="Require OTP on every login" />
              <ToggleRow label="Session Timeout" description="Auto-logout after 30 minutes of inactivity" defaultChecked />
            </>
          )}

          {activeSection === 'notifs' && (
            <>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Notifications</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>Choose what alerts you receive</p>
              <ToggleRow label="New Order Alert"       description="Notify when a new order is placed"       defaultChecked />
              <ToggleRow label="New Message Alert"     description="Notify when a customer sends a message"  defaultChecked />
              <ToggleRow label="Low Stock Warning"     description="Alert when product stock falls below 5"  defaultChecked />
              <ToggleRow label="Daily Summary Report"  description="Receive a daily email digest"            />
              <ToggleRow label="Marketing Updates"     description="Promotional tips and platform updates"   />
            </>
          )}

          {activeSection === 'region' && (
            <>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Regional & Language</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>Localisation settings for your store</p>
              <InputRow label="Country"    placeholder="India" defaultValue="India" />
              <InputRow label="Currency"   placeholder="INR – Indian Rupee" defaultValue="INR – Indian Rupee" />
              <InputRow label="Time Zone"  placeholder="Asia/Kolkata (IST)" defaultValue="Asia/Kolkata (IST)" />
              <InputRow label="Date Format" placeholder="DD/MM/YYYY" defaultValue="DD/MM/YYYY" />
              <InputRow label="Language"   placeholder="English" defaultValue="English" />
            </>
          )}

          {activeSection === 'appear' && (
            <>
              <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.25rem' }}>Appearance</h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1.25rem' }}>Customise the look of your admin panel</p>
              <ToggleRow label="Dark Mode"          description="Switch to a dark colour scheme" />
              <ToggleRow label="Compact Sidebar"    description="Use a narrower sidebar on desktop" />
              <ToggleRow label="Animated Transitions" description="Page and component animations" defaultChecked />
              <div style={{ paddingTop: '1rem' }}>
                <p style={{ fontSize: '0.825rem', fontWeight: 600, color: '#374151', marginBottom: 8 }}>Accent Colour</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  {['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626'].map((c) => (
                    <div key={c} style={{ width: 28, height: 28, borderRadius: '50%', background: c, cursor: 'pointer', boxShadow: c === '#2563eb' ? `0 0 0 3px #fff, 0 0 0 5px ${c}` : 'none' }} />
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Save button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1.25rem', marginTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '0.625rem 1.25rem',
                background: saved ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                color: '#ffffff', fontWeight: 700, fontSize: '0.875rem',
                borderRadius: 9, border: 'none', cursor: 'pointer',
                boxShadow: '0 3px 10px rgba(59,130,246,0.3)',
                transition: 'background 0.25s',
              }}
            >
              {saved ? <><Check size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
}
