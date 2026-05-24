import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Edit2, Trash2, Search, Package, X, Upload,
  ImageIcon, Tag, IndianRupee, Layers, FileText,
  Star, Wifi, Zap, CheckCircle, AlertTriangle, Eye,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { formatINR } from '../utils/formatting';

/* ─── Constants ──────────────────────────────────────────── */
const STORAGE_KEY = 'he_products';

const CATEGORIES = [
  'Televisions',
  'Laptops & Computers',
  'Air Conditioners',
  'Washing Machines',
  'Refrigerators',
  'Audio & Speakers',
  'Mobile Phones',
  'Accessories',
  'Other Electronics',
];

const BRANDS = [
  'Samsung', 'LG', 'Sony', 'Philips', 'Panasonic',
  'Whirlpool', 'Godrej', 'Haier', 'Bosch', 'Voltas',
  'Blue Star', 'Daikin', 'Hitachi', 'OnePlus', 'Apple',
  'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Other',
];

const CATEGORY_COLORS = {
  'Televisions':           { bg: '#eff6ff', accent: '#2563eb', border: '#bfdbfe' },
  'Laptops & Computers':   { bg: '#f5f3ff', accent: '#7c3aed', border: '#ddd6fe' },
  'Air Conditioners':      { bg: '#ecfdf5', accent: '#059669', border: '#a7f3d0' },
  'Washing Machines':      { bg: '#fff7ed', accent: '#ea580c', border: '#fed7aa' },
  'Refrigerators':         { bg: '#f0f9ff', accent: '#0284c7', border: '#bae6fd' },
  'Audio & Speakers':      { bg: '#fdf4ff', accent: '#a21caf', border: '#f0abfc' },
  'Mobile Phones':         { bg: '#fff1f2', accent: '#be123c', border: '#fecdd3' },
  'Accessories':           { bg: '#f7fee7', accent: '#4d7c0f', border: '#bbf7d0' },
  'Other Electronics':     { bg: '#f8fafc', accent: '#475569', border: '#e2e8f0' },
};

const DEFAULT_FORM = {
  name: '', brand: '', category: '', model: '',
  price: '', mrp: '', stock: '',
  description: '', warranty: '', features: '',
  image: null, // base64 string
};

/* ─── Helpers ────────────────────────────────────────────── */
function loadProducts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveProducts(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/* ─── Sub-components ─────────────────────────────────────── */
const FormField = ({ label, icon: Icon, required, children, hint }) => (
  <div>
    <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', fontWeight: 700, color: '#374151', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
      {Icon && <Icon size={12} />}
      {label}
      {required && <span style={{ color: '#ef4444' }}>*</span>}
    </label>
    {children}
    {hint && <p style={{ fontSize: '0.68rem', color: '#94a3b8', marginTop: 4 }}>{hint}</p>}
  </div>
);

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

/* ─── Product Card ───────────────────────────────────────── */
const ProductCard = ({ product, onEdit, onDelete, onPreview, idx }) => {
  const colors = CATEGORY_COLORS[product.category] ?? CATEGORY_COLORS['Other Electronics'];
  const discount = product.mrp && product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.05 }}
      whileHover={{ y: -4, boxShadow: '0 12px 35px rgba(0,0,0,0.12)' }}
      style={{
        background: '#ffffff',
        borderRadius: 14,
        border: `1px solid ${colors.border}`,
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'default',
      }}
    >
      {/* Image area */}
      <div
        onClick={() => onPreview(product)}
        style={{
          height: 160,
          background: product.image ? `url(${product.image}) center/cover no-repeat` : colors.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        {!product.image && <Package size={48} color={colors.accent} style={{ opacity: 0.35 }} />}

        {/* Category badge */}
        <div style={{
          position: 'absolute', top: 10, left: 10,
          background: colors.accent,
          color: '#ffffff',
          fontSize: '0.6rem', fontWeight: 700,
          padding: '3px 8px', borderRadius: 9999,
          textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          {product.category?.split(' ')[0]}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#dc2626', color: '#ffffff',
            fontSize: '0.65rem', fontWeight: 800,
            padding: '3px 8px', borderRadius: 9999,
          }}>
            {discount}% OFF
          </div>
        )}

        {/* Preview overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.25)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0)'}
        >
          <Eye size={24} color="white" style={{ opacity: 0 }} className="preview-icon" />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div>
          {product.brand && (
            <p style={{ fontSize: '0.68rem', fontWeight: 700, color: colors.accent, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>
              {product.brand}
            </p>
          )}
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, marginBottom: 2 }}>{product.name}</h3>
          {product.model && (
            <p style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Model: {product.model}</p>
          )}
        </div>

        {/* Price */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{formatINR(product.price)}</span>
          {product.mrp && parseFloat(product.mrp) > parseFloat(product.price) && (
            <span style={{ fontSize: '0.78rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatINR(product.mrp)}</span>
          )}
        </div>

        {/* Stock */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            fontSize: '0.7rem', fontWeight: 600,
            padding: '3px 8px', borderRadius: 9999,
            background: parseInt(product.stock) > 5 ? '#f0fdf4' : parseInt(product.stock) > 0 ? '#fffbeb' : '#fef2f2',
            color: parseInt(product.stock) > 5 ? '#16a34a' : parseInt(product.stock) > 0 ? '#d97706' : '#dc2626',
          }}>
            {parseInt(product.stock) > 5
              ? <><CheckCircle size={10} /> In Stock ({product.stock})</>
              : parseInt(product.stock) > 0
              ? <><AlertTriangle size={10} /> Low Stock ({product.stock})</>
              : <><X size={10} /> Out of Stock</>
            }
          </span>
          {product.warranty && (
            <span style={{ fontSize: '0.68rem', color: '#64748b' }}>🛡 {product.warranty}</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', borderTop: '1px solid #f1f5f9' }}>
        <button
          onClick={() => onEdit(product)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0.625rem', border: 'none', background: 'transparent', color: '#2563eb', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer', borderRight: '1px solid #f1f5f9' }}
          onMouseEnter={e => e.currentTarget.style.background = '#eff6ff'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Edit2 size={13} /> Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, padding: '0.625rem', border: 'none', background: 'transparent', color: '#dc2626', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }}
          onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          <Trash2 size={13} /> Delete
        </button>
      </div>
    </motion.div>
  );
};

/* ─── Main Component ─────────────────────────────────────── */
export default function Products() {
  const [products, setProducts]     = useState(loadProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCat, setFilterCat]   = useState('All');
  const [modalOpen, setModalOpen]   = useState(false);
  const [editId, setEditId]         = useState(null);
  const [formData, setFormData]     = useState(DEFAULT_FORM);
  const [imagePreview, setImagePreview]   = useState(null);
  const [previewProduct, setPreviewProduct] = useState(null);
  const [dragOver, setDragOver]     = useState(false);
  const [saving, setSaving]         = useState(false);
  const fileInputRef = useRef(null);

  // Persist to localStorage whenever products change
  useEffect(() => { saveProducts(products); }, [products]);

  const filtered = products.filter((p) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      p.name?.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.model?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q);
    const matchCat = filterCat === 'All' || p.category === filterCat;
    return matchSearch && matchCat;
  });

  const categoryCounts = products.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {});

  /* ── Modal helpers ──────────────────────────── */
  const openAdd = () => {
    setEditId(null);
    setFormData(DEFAULT_FORM);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditId(product.id);
    setFormData({ ...DEFAULT_FORM, ...product });
    setImagePreview(product.image || null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditId(null);
    setFormData(DEFAULT_FORM);
    setImagePreview(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this product? This cannot be undone.')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  /* ── Image handling ─────────────────────────── */
  const handleImageFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5 MB.'); return; }
    const b64 = await readFileAsBase64(file);
    setImagePreview(b64);
    setFormData((prev) => ({ ...prev, image: b64 }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  /* ── Submit ─────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.price) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350));

    const entry = {
      ...formData,
      id:    editId ?? Date.now(),
      price: parseFloat(formData.price) || 0,
      mrp:   formData.mrp ? parseFloat(formData.mrp) : null,
      stock: parseInt(formData.stock) || 0,
    };

    setProducts((prev) =>
      editId
        ? prev.map((p) => (p.id === editId ? entry : p))
        : [entry, ...prev]
    );
    setSaving(false);
    closeModal();
  };

  /* ─────────────────────────────────────────────────────── */
  return (
    <MainLayout>
      {/* ── Page header ─────────────────────────── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Products</h1>
          <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
            {products.length} product{products.length !== 1 ? 's' : ''} · Saved to local storage
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={openAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '0.65rem 1.25rem',
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            color: '#fff', fontWeight: 700, fontSize: '0.875rem',
            borderRadius: 10, border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37,99,235,0.35)',
          }}
        >
          <Plus size={18} /> Add Product
        </motion.button>
      </div>

      {/* ── Category filter chips ─────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {['All', ...CATEGORIES].map((cat) => {
          const active = filterCat === cat;
          const count = cat === 'All' ? products.length : (categoryCounts[cat] || 0);
          return (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '0.35rem 0.875rem',
                borderRadius: 9999, border: active ? '1.5px solid #2563eb' : '1.5px solid #e2e8f0',
                background: active ? '#eff6ff' : '#ffffff',
                color: active ? '#1d4ed8' : '#64748b',
                fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              {cat}
              <span style={{
                fontSize: '0.65rem', fontWeight: 700,
                background: active ? '#dbeafe' : '#f1f5f9',
                color: active ? '#1d4ed8' : '#94a3b8',
                borderRadius: 9999, padding: '1px 6px',
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Search ──────────────────────────────── */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
        <input
          type="text"
          placeholder="Search by name, brand, model, or category…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ ...inputStyle, paddingLeft: '2.375rem' }}
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 2 }}>
            <X size={14} />
          </button>
        )}
      </div>

      {/* ── Grid / Empty ─────────────────────────── */}
      {products.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            background: '#ffffff', borderRadius: 14, border: '2px dashed #e2e8f0',
            padding: '4rem 2rem', textAlign: 'center',
          }}
        >
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Package size={36} color="#3b82f6" style={{ opacity: 0.7 }} />
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#334155', marginBottom: 8 }}>No products yet</h3>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginBottom: '1.75rem', maxWidth: 320, margin: '0 auto 1.75rem' }}>
            Add your first product from Sree Harshitha Enterprises' catalogue — TVs, laptops, ACs, and more.
          </p>
          <button
            onClick={openAdd}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '0.75rem 1.5rem', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', borderRadius: 10, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.35)' }}
          >
            <Plus size={18} /> Add First Product
          </button>
        </motion.div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#ffffff', borderRadius: 14, border: '1px solid #e2e8f0', padding: '3rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontWeight: 500 }}>No products match your search or filter.</p>
          <button onClick={() => { setSearchTerm(''); setFilterCat('All'); }} style={{ marginTop: 12, fontSize: '0.825rem', color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
            Clear filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.125rem' }}>
          {filtered.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              idx={idx}
              onEdit={openEdit}
              onDelete={handleDelete}
              onPreview={setPreviewProduct}
            />
          ))}
        </div>
      )}

      {/* ═══════════════ ADD / EDIT MODAL ════════════════════ */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', zIndex: 50, padding: '1.5rem 1rem', overflowY: 'auto' }}
          >
            <motion.div
              initial={{ scale: 0.93, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.93, y: 24 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 640, background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 25px 60px rgba(0,0,0,0.18)', overflow: 'hidden', margin: 'auto' }}
            >
              {/* Modal header */}
              <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={18} color="#fff" />
                  </div>
                  <div>
                    <h2 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>
                      {editId ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 2 }}>
                      Sree Harshitha Enterprises · Chennai
                    </p>
                  </div>
                </div>
                <button onClick={closeModal} style={{ padding: 7, borderRadius: 9, border: '1px solid #e2e8f0', background: '#ffffff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={16} color="#64748b" />
                </button>
              </div>

              <form onSubmit={handleSubmit}>
                <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto' }}>

                  {/* ── Image upload zone ──────────────── */}
                  <FormField label="Product Image" icon={ImageIcon} hint="Upload from your computer. JPG, PNG, WEBP · max 5 MB">
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      style={{
                        border: `2px dashed ${dragOver ? '#2563eb' : imagePreview ? '#bfdbfe' : '#e2e8f0'}`,
                        borderRadius: 12,
                        background: dragOver ? '#eff6ff' : imagePreview ? '#f8fafc' : '#f8fafc',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        overflow: 'hidden',
                        position: 'relative',
                      }}
                    >
                      {imagePreview ? (
                        <div style={{ position: 'relative' }}>
                          <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ width: '100%', height: 180, objectFit: 'contain', background: '#f1f5f9', display: 'block' }}
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setImagePreview(null); setFormData((prev) => ({ ...prev, image: null })); }}
                            style={{ position: 'absolute', top: 8, right: 8, padding: 5, borderRadius: 8, border: 'none', background: 'rgba(0,0,0,0.55)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                          >
                            <X size={14} color="#fff" />
                          </button>
                          <div style={{ padding: '0.5rem 0.875rem', background: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: 6 }}>
                            <CheckCircle size={12} color="#16a34a" /> Image uploaded · Click to replace
                          </div>
                        </div>
                      ) : (
                        <div style={{ padding: '2.25rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: 52, height: 52, borderRadius: 12, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Upload size={22} color="#3b82f6" />
                          </div>
                          <div style={{ textAlign: 'center' }}>
                            <p style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>
                              Click or drag & drop image
                            </p>
                            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 3 }}>
                              JPG, PNG, WEBP up to 5 MB
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageFile(e.target.files[0])}
                    />
                  </FormField>

                  {/* ── Core details ──────────────────── */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                    <FormField label="Brand" icon={Star} required>
                      <select
                        value={formData.brand}
                        onChange={(e) => setFormData((p) => ({ ...p, brand: e.target.value }))}
                        style={{ ...inputStyle, appearance: 'none' }}
                        required
                        onFocus={focusStyle} onBlur={blurStyle}
                      >
                        <option value="">Select brand…</option>
                        {BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </FormField>

                    <FormField label="Category" icon={Tag} required>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData((p) => ({ ...p, category: e.target.value }))}
                        style={{ ...inputStyle, appearance: 'none' }}
                        required
                        onFocus={focusStyle} onBlur={blurStyle}
                      >
                        <option value="">Select category…</option>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </FormField>
                  </div>

                  <FormField label="Product Name" icon={Package} required>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData((p) => ({ ...p, name: e.target.value }))}
                      placeholder="e.g. Samsung 55-inch 4K QLED Smart TV"
                      required
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </FormField>

                  <FormField label="Model Number" icon={Layers}>
                    <input
                      type="text"
                      value={formData.model}
                      onChange={(e) => setFormData((p) => ({ ...p, model: e.target.value }))}
                      placeholder="e.g. QA55Q80CAKLXL"
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </FormField>

                  {/* Pricing */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.875rem' }}>
                    <FormField label="Selling Price (₹)" icon={IndianRupee} required>
                      <input
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData((p) => ({ ...p, price: e.target.value }))}
                        placeholder="0"
                        required min="0" step="0.01"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </FormField>
                    <FormField label="MRP (₹)" icon={IndianRupee} hint="For discount badge">
                      <input
                        type="number"
                        value={formData.mrp}
                        onChange={(e) => setFormData((p) => ({ ...p, mrp: e.target.value }))}
                        placeholder="0"
                        min="0" step="0.01"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </FormField>
                    <FormField label="Stock Qty" icon={Layers}>
                      <input
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData((p) => ({ ...p, stock: e.target.value }))}
                        placeholder="0"
                        min="0"
                        style={inputStyle}
                        onFocus={focusStyle} onBlur={blurStyle}
                      />
                    </FormField>
                  </div>

                  {/* Warranty */}
                  <FormField label="Warranty" icon={Zap}>
                    <input
                      type="text"
                      value={formData.warranty}
                      onChange={(e) => setFormData((p) => ({ ...p, warranty: e.target.value }))}
                      placeholder="e.g. 1 Year Manufacturer Warranty"
                      style={inputStyle}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </FormField>

                  {/* Description */}
                  <FormField label="Product Description" icon={FileText}>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Describe the product — resolution, capacity, features, energy rating…"
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </FormField>

                  {/* Key features */}
                  <FormField label="Key Features" icon={Wifi} hint="One feature per line">
                    <textarea
                      value={formData.features}
                      onChange={(e) => setFormData((p) => ({ ...p, features: e.target.value }))}
                      placeholder={'4K UHD Display\nBuilt-in Wi-Fi & Bluetooth\n5 Star Energy Rating\nVoice Control'}
                      rows={4}
                      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
                      onFocus={focusStyle} onBlur={blurStyle}
                    />
                  </FormField>
                </div>

                {/* Modal footer */}
                <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #f1f5f9', display: 'flex', gap: '0.75rem', background: '#fafafa' }}>
                  <button
                    type="button"
                    onClick={closeModal}
                    style={{ flex: 1, padding: '0.7rem', borderRadius: 10, border: '1px solid #e2e8f0', background: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '0.875rem', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    disabled={saving}
                    whileHover={{ scale: saving ? 1 : 1.02 }}
                    whileTap={{ scale: saving ? 1 : 0.98 }}
                    style={{
                      flex: 2, padding: '0.7rem',
                      borderRadius: 10, border: 'none',
                      background: saving ? '#93c5fd' : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#ffffff', fontWeight: 700, fontSize: '0.875rem', cursor: saving ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                      boxShadow: saving ? 'none' : '0 4px 14px rgba(37,99,235,0.3)',
                    }}
                  >
                    {saving ? (
                      <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.7, ease: 'linear' }} style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', display: 'inline-block' }} /> Saving…</>
                    ) : (
                      <><CheckCircle size={16} /> {editId ? 'Save Changes' : 'Add Product'}</>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════════ PRODUCT PREVIEW MODAL ════════════════ */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPreviewProduct(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '1.5rem' }}
          >
            <motion.div
              initial={{ scale: 0.94, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{ width: '100%', maxWidth: 560, background: '#ffffff', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 30px 80px rgba(0,0,0,0.25)', overflow: 'hidden' }}
            >
              {/* Image */}
              <div style={{ height: 240, background: previewProduct.image ? `url(${previewProduct.image}) center/contain no-repeat #f8fafc` : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {!previewProduct.image && <Package size={64} color="#94a3b8" />}
                <button onClick={() => setPreviewProduct(null)} style={{ position: 'absolute', top: 12, right: 12, padding: 7, borderRadius: 9, border: 'none', background: 'rgba(0,0,0,0.45)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <X size={16} color="#fff" />
                </button>
              </div>

              {/* Details */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  {previewProduct.brand && <p style={{ fontSize: '0.72rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{previewProduct.brand}</p>}
                  <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{previewProduct.name}</h2>
                  {previewProduct.model && <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Model: {previewProduct.model}</p>}
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: '1rem' }}>
                  <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>{formatINR(previewProduct.price)}</span>
                  {previewProduct.mrp && <span style={{ fontSize: '0.9rem', color: '#94a3b8', textDecoration: 'line-through' }}>{formatINR(previewProduct.mrp)}</span>}
                </div>

                {previewProduct.description && (
                  <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.7, marginBottom: '1rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                    {previewProduct.description}
                  </p>
                )}

                {previewProduct.features && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ fontSize: '0.75rem', fontWeight: 700, color: '#374151', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Key Features</p>
                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                      {previewProduct.features.split('\n').filter(Boolean).map((f, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 7, fontSize: '0.825rem', color: '#475569' }}>
                          <CheckCircle size={13} color="#22c55e" style={{ flexShrink: 0, marginTop: 2 }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8, paddingTop: '1rem', borderTop: '1px solid #f1f5f9' }}>
                  <button
                    onClick={() => { setPreviewProduct(null); openEdit(previewProduct); }}
                    style={{ flex: 1, padding: '0.625rem', borderRadius: 9, border: 'none', background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                  >
                    <Edit2 size={14} /> Edit Product
                  </button>
                  <button
                    onClick={() => setPreviewProduct(null)}
                    style={{ flex: 1, padding: '0.625rem', borderRadius: 9, border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569', fontWeight: 600, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </MainLayout>
  );
}
