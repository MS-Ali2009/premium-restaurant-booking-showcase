import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import { useBooking } from '../context/BookingContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const filters = ['all', 'confirmed', 'cancelled'];

function BookingCard({ booking, onCancel }) {
  const [expanded, setExpanded] = useState(false);
  const [showCancel, setShowCancel] = useState(false);

  const statusColors = {
    confirmed: 'bg-green-500/10 text-green-400 border-green-500/30',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    completed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div
        onClick={() => setExpanded(!expanded)}
        className="p-6 cursor-pointer hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
              <span className="text-gold font-serif text-lg">
                {booking.date.split('-')[2]}
              </span>
            </div>
            <div>
              <h3 className="text-charcoal dark:text-white font-medium">{booking.customerName}</h3>
              <p className="text-charcoal/50 dark:text-white/50 text-sm">
                {booking.date} at {booking.time} · {booking.guests} guests
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${
                statusColors[booking.status]
              }`}
            >
              {booking.status}
            </span>
            <motion.svg
              animate={{ rotate: expanded ? 180 : 0 }}
              className="w-5 h-5 text-charcoal/40 dark:text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 border-t border-charcoal/5 dark:border-white/5 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-charcoal/40 dark:text-white/40 text-xs mb-1">Reference ID</p>
                  <p className="text-gold font-mono text-sm">{booking.id.slice(0, 8).toUpperCase()}</p>
                </div>
                <div>
                  <p className="text-charcoal/40 dark:text-white/40 text-xs mb-1">Email</p>
                  <p className="text-charcoal dark:text-white text-sm">{booking.customerEmail}</p>
                </div>
                <div>
                  <p className="text-charcoal/40 dark:text-white/40 text-xs mb-1">Phone</p>
                  <p className="text-charcoal dark:text-white text-sm">{booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-charcoal/40 dark:text-white/40 text-xs mb-1">Special Requests</p>
                  <p className="text-charcoal dark:text-white text-sm">{booking.specialRequests || 'None'}</p>
                </div>
              </div>

              {/* QR Code */}
              <div className="flex items-center gap-6 mt-4">
                <div className="bg-white p-3 rounded-lg">
                  <QRCodeSVG value={booking.id} size={80} />
                </div>
                <div className="flex flex-col gap-2">
                  <Link to="/scanner">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-4 py-2 bg-gold/10 text-gold border border-gold/30 rounded-lg text-sm hover:bg-gold/20 transition-colors"
                    >
                      Scan QR
                    </motion.button>
                  </Link>
                  {booking.status === 'confirmed' && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowCancel(true)}
                      className="px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/30 rounded-lg text-sm hover:bg-red-500/20 transition-colors"
                    >
                      Cancel
                    </motion.button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cancel Confirmation */}
      <AnimatePresence>
        {showCancel && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-sm"
            onClick={() => setShowCancel(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-2xl p-6 max-w-sm w-full text-center"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-charcoal dark:text-white font-serif text-xl mb-2">Cancel Reservation?</h3>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancel(false)}
                  className="flex-1 py-2.5 border border-charcoal/20 dark:border-white/20 rounded-xl text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white transition-colors"
                >
                  Keep It
                </button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    onCancel(booking.id);
                    setShowCancel(false);
                    setExpanded(false);
                  }}
                  className="flex-1 py-2.5 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Reservations() {
  const [activeFilter, setActiveFilter] = useState('all');
  const { bookings, cancelBooking } = useBooking();

  const filteredBookings = bookings.filter(
    (b) => activeFilter === 'all' || b.status === activeFilter
  ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Your Bookings
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">
                My Reservations
              </h1>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal delay={0.1}>
            <div className="flex justify-center gap-3 mb-10">
              {filters.map((filter) => (
                <motion.button
                  key={filter}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveFilter(filter)}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                    activeFilter === filter
                      ? 'text-charcoal'
                      : 'text-charcoal/60 dark:text-white/60 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10'
                  }`}
                >
                  {activeFilter === filter && (
                    <motion.div
                      layoutId="reservation-filter"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{filter}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Bookings List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  onCancel={cancelBooking}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Empty State */}
          {filteredBookings.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-charcoal/5 dark:bg-dark-card flex items-center justify-center">
                <svg className="w-12 h-12 text-charcoal/20 dark:text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-charcoal/40 dark:text-white/40 text-lg mb-4">No reservations found</p>
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="btn-primary"
                >
                  Book a Table
                </motion.button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
