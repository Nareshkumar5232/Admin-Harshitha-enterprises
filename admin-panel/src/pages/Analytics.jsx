import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';

export default function Analytics() {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm"
      >
        <BarChart3 className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-4xl font-bold text-slate-900 mb-4">
          Analytics
        </h1>
        <p className="text-slate-600 max-w-md mx-auto text-center">
          Advanced analytics and reporting features coming soon. Track sales, revenue, and customer behavior.
        </p>
      </motion.div>
    </MainLayout>
  );
}
