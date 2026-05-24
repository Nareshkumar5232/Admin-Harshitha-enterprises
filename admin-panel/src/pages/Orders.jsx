import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import { formatINR } from '../utils/formatting';

const statusColors = {
  Delivered: 'bg-green-100 text-green-700',
  Shipped: 'bg-blue-100 text-blue-700',
  Pending: 'bg-yellow-100 text-yellow-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  const statusOptions = ['All', 'Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.customer?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <MainLayout>
      <div className="mb-8">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <h1 className="text-4xl font-bold text-slate-900">Orders</h1>
          <p className="text-slate-600">Manage all customer orders</p>
        </motion.div>
      </div>

      {orders.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterStatus === status ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <ShoppingCart className="w-14 h-14 text-slate-300 mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">No orders available</h3>
            <p className="text-slate-500 mt-2">Orders will appear here when customers place them.</p>
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 sticky top-0">
                <tr>
                  <th className="p-4 text-sm text-slate-600">Order ID</th>
                  <th className="p-4 text-sm text-slate-600">Customer</th>
                  <th className="p-4 text-sm text-slate-600">Amount</th>
                  <th className="p-4 text-sm text-slate-600">Date</th>
                  <th className="p-4 text-sm text-slate-600">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-t">
                    <td className="p-4 font-medium text-slate-900">{order.id}</td>
                    <td className="p-4 text-slate-600">{order.customer}</td>
                    <td className="p-4 text-slate-900 font-semibold">{formatINR(order.amount)}</td>
                    <td className="p-4 text-slate-600">{order.date}</td>
                    <td className="p-4">
                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusColors[order.status]}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
