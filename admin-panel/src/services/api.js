import axios from 'axios';

const API_BASE_URL = 'https://harshitha-enterprises-backend.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_token');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

// Products API
export const productsAPI = {
  getAll: (params) => api.get('/api/product', { params }),
  getById: (id) => api.get(`/api/product/${id}`),
  create: (data) => api.post('/api/product/createProduct', data),
  update: (id, data) => api.put(`/api/product/update/${id}`, data),
  delete: (id) => api.delete(`/api/product/delete/${id}`),
};

// Orders API
export const ordersAPI = {
  getAll: (params) => api.get('/api/orders', { params }),
  getById: (id) => api.get(`/api/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/api/orders/${id}/status`, { status }),
};

// Messages/Contact API
export const messagesAPI = {
  getAll: (params) => api.get('/api/messages', { params }),
  getById: (id) => api.get(`/api/messages/${id}`),
  markAsRead: (id) => api.patch(`/api/messages/${id}/read`),
  delete: (id) => api.delete(`/api/messages/${id}`),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/api/admin/stats'),
  getRecentOrders: () => api.get('/api/admin/recent-orders'),
  getRecentMessages: () => api.get('/api/admin/recent-messages'),
  getRevenue: () => api.get('/api/admin/revenue'),
};

export default api;
