import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

export default function Customers() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <Users className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Customers
        </h1>
        <p className="text-slate-600 max-w-md mx-auto text-center">
          Customer management features coming soon. Track customer data, order history, and preferences.
        </p>
      </motion.div>
    </MainLayout>
  );
}
