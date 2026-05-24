import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Trash2, Mail, Phone, MessageCircle } from 'lucide-react';
import MainLayout from '../layouts/MainLayout';
import Avatar from '../components/Avatar';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRead, setFilterRead] = useState('All');

  const filtered = messages.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterRead === 'All' || (filterRead === 'Unread' ? !m.read : m.read);
    return matchesSearch && matchesFilter;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const handleMarkAsRead = (id) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  const handleDeleteMessage = (id) => {
    setMessages(messages.filter((m) => m.id !== id));
    if (selectedMessage?.id === id) {
      setSelectedMessage(null);
    }
  };

  return (
    <MainLayout>
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-4xl font-bold text-slate-900">
            Messages {unreadCount > 0 && <span className="text-blue-600">({unreadCount})</span>}
          </h1>
          <p className="text-slate-600">Customer feedback and inquiries</p>
        </motion.div>
      </div>

      {/* Filters */}
      {messages.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col md:flex-row gap-4 mb-8"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            {['All', 'Unread', 'Read'].map((filter) => (
              <button
                key={filter}
                onClick={() => setFilterRead(filter)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                  filterRead === filter
                    ? 'bg-blue-500 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty State */}
      {messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center py-16 bg-white rounded-lg border border-slate-200 shadow-sm"
        >
          <MessageCircle className="w-16 h-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No messages yet</h3>
          <p className="text-slate-600 text-center max-w-sm">
            Customer messages and inquiries will appear here. Respond to feedback and track customer communication.
          </p>
        </motion.div>
      ) : (
        /* Messages List */
        <div className="space-y-4">
          {filtered.map((msg, idx) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => {
                setSelectedMessage(msg);
                if (!msg.read) {
                  handleMarkAsRead(msg.id);
                }
              }}
              className={`bg-white rounded-lg p-6 border cursor-pointer transition-all shadow-sm hover:shadow-md ${
                msg.read ? 'border-slate-200 opacity-70' : 'border-blue-200 ring-1 ring-blue-100'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Left */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <Avatar name={msg.name} />
                    <div>
                      <h3 className="font-semibold text-slate-900">{msg.name}</h3>
                      <p className="text-xs text-slate-600">{msg.email}</p>
                    </div>
                  </div>

                  <p className="text-sm font-medium text-blue-600 mb-1">{msg.subject}</p>
                  <p className="text-slate-600 text-sm line-clamp-2 mb-2">{msg.message}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-600">
                    <span>{msg.date} at {msg.time}</span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {msg.phone}
                      </span>
                    )}
                  </div>
                </div>

                {/* Right */}
                <div className="flex flex-col items-end gap-3">
                  {!msg.read && (
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteMessage(msg.id);
                    }}
                    className="p-2 hover:bg-red-50 rounded-lg transition-all text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Message Details Modal */}
      {selectedMessage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedMessage(null)}
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-lg p-8 border border-slate-200 shadow-lg"
          >
            <div className="flex items-center gap-4 mb-6">
              <Avatar name={selectedMessage.name} size="lg" />
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedMessage.name}</h2>
                <p className="text-slate-600">{selectedMessage.email}</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-600 mb-1">Email</p>
                  <a href={`mailto:${selectedMessage.email}`} className="text-blue-600 hover:text-blue-700 transition">
                    {selectedMessage.email}
                  </a>
                </div>
                <div>
                  <p className="text-sm text-slate-600 mb-1">Phone</p>
                  <a href={`tel:${selectedMessage.phone}`} className="text-blue-600 hover:text-blue-700 transition">
                    {selectedMessage.phone}
                  </a>
                </div>
              </div>

              {/* Subject */}
              <div>
                <p className="text-sm text-slate-600 mb-1">Subject</p>
                <p className="text-lg font-semibold text-blue-600">{selectedMessage.subject}</p>
              </div>

              {/* Message */}
              <div>
                <p className="text-sm text-slate-600 mb-2">Message</p>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                  <p className="text-slate-900 whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-slate-600">
                Received on {selectedMessage.date} at {selectedMessage.time}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4 border-t border-slate-200">
                <button className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 font-medium flex items-center justify-center gap-2">
                  <Mail className="w-4 h-4" />
                  Reply
                </button>
                <button
                  onClick={() => {
                    handleDeleteMessage(selectedMessage.id);
                    setSelectedMessage(null);
                  }}
                  className="flex-1 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={() => setSelectedMessage(null)}
                  className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg transition-all duration-200 font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </MainLayout>
  );
}
