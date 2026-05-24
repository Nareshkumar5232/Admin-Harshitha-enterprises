import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  TrendingUp,
  Package,
  Users,
  MessageSquare,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Avatar from '../components/Avatar';
import { formatINR, formatNumber } from '../utils/formatting';

const StatCard = ({ icon: Icon, title, value, change, color }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5 }}
    className="bg-white rounded-lg p-6 border border-slate-200 shadow-sm hover:shadow-md transition h-full"
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-slate-600 text-sm font-medium mb-1">{title}</p>
        <p className="text-3xl font-bold text-slate-900 mb-2">{value}</p>
        <p className={`text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {change >= 0 ? '↑' : '↓'} {Math.abs(change)}% vs last month
        </p>
      </div>
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
);

const EmptyState = ({ icon: Icon, title, description }) => (
  <div className="flex flex-col items-center justify-center py-12 px-6">
    <Icon className="w-16 h-16 text-slate-300 mb-4" />
    <h3 className="text-lg font-semibold text-slate-700 mb-2">{title}</h3>
    <p className="text-slate-500 text-center max-w-sm">{description}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalMessages: 0,
  });

  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const statCards = [
    {
      icon: ShoppingCart,
      title: 'Total Orders',
      value: formatNumber(stats.totalOrders),
      change: 0,
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: TrendingUp,
      title: 'Pending Orders',
      value: formatNumber(stats.pendingOrders),
      change: 0,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      icon: Package,
      title: 'Delivered',
      value: formatNumber(stats.deliveredOrders),
      change: 0,
      color: 'from-green-500 to-green-600',
    },
    {
      icon: DollarSign,
      title: 'Total Revenue',
      value: formatINR(stats.totalRevenue),
      change: 0,
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: Package,
      title: 'Total Products',
      value: formatNumber(stats.totalProducts),
      change: 0,
      color: 'from-indigo-500 to-indigo-600',
    },
    {
      icon: MessageSquare,
      title: 'New Messages',
      value: formatNumber(stats.totalMessages),
      change: 0,
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-96">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }}>
            <AlertCircle className="w-8 h-8 text-blue-500" />
          </motion.div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, Admin!
          </h1>
          <p className="text-slate-600">
            Here's what's happening with your store today.
          </p>
        </motion.div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch">
        {statCards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
          >
            <StatCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Recent Orders & Messages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
            className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 h-full"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Orders</h3>
          {orders.length === 0 ? (
            <EmptyState
              icon={ShoppingCart}
              title="No orders available"
              description="Orders will appear here as customers place them."
            />
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <div>
                    <p className="font-medium text-slate-900">{order.id}</p>
                    <p className="text-sm text-slate-500">{order.customer}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-semibold text-slate-900">{formatINR(order.amount)}</span>
                    <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Recent Messages */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 h-full"
        >
          <h3 className="text-lg font-bold text-slate-900 mb-6">Recent Messages</h3>
          {messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Customer messages and inquiries will appear here."
            />
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition">
                  <Avatar name={msg.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm">{msg.name}</p>
                    <p className="text-xs text-slate-500 truncate">{msg.subject}</p>
                  </div>
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </MainLayout>
  );
}
