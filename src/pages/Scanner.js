import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Html5Qrcode } from 'html5-qrcode';
import { useBooking } from '../context/BookingContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

function VerifiedModal({ booking, alreadyScanned, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card border border-gold/20 rounded-3xl p-8 max-w-md w-full text-center shadow-luxury"
      >
        {alreadyScanned ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-500/10 border-2 border-yellow-500 flex items-center justify-center"
            >
              <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </motion.div>
            <h3 className="font-serif text-2xl text-charcoal dark:text-white mb-2">Already Verified</h3>
            <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6">This reservation has already been verified and checked in.</p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center"
            >
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="w-10 h-10 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <motion.path
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M5 13l4 4L19 7"
                />
              </motion.svg>
            </motion.div>
            <h3 className="font-serif text-2xl text-charcoal dark:text-white mb-2">Booking Verified!</h3>
            <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6">Welcome to L'Élégance. Your table is ready.</p>
          </>
        )}

        {/* Booking Details */}
        <div className="bg-cream/50 dark:bg-charcoal/50 border border-charcoal/10 dark:border-white/10 rounded-2xl p-5 mb-6 text-left space-y-2.5">
          <div className="flex justify-between text-xs">
            <span className="text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold">Guest</span>
            <span className="text-charcoal dark:text-white font-bold">{booking.customerName}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold">Date & Time</span>
            <span className="text-charcoal dark:text-white font-bold">{booking.date} at {booking.time}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold">Party Size</span>
            <span className="text-charcoal dark:text-white font-bold">{booking.guests} guests</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold">Booking ID</span>
            <span className="font-mono text-gold font-bold">{booking.id.slice(0, 8).toUpperCase()}</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="btn-primary w-full py-3.5"
        >
          Check In Guest
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

function ErrorModal({ message, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1, x: [0, -10, 10, -10, 10, 0] }}
        exit={{ scale: 0.8 }}
        transition={{ x: { duration: 0.4 } }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card border border-red-500/20 rounded-3xl p-8 max-w-sm w-full text-center shadow-luxury"
      >
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-charcoal dark:text-white mb-2">Verification Failed</h3>
        <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6 leading-relaxed">{message}</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onClose}
          className="btn-primary w-full py-3"
        >
          Try Again
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function Scanner() {
  const [scanning, setScanning] = useState(false);
  const [manualId, setManualId] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [alreadyScanned, setAlreadyScanned] = useState(false);
  const [selectedDemoBooking, setSelectedDemoBooking] = useState('');

  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);
  const { bookings, getBookingById, markScanned } = useBooking();

  const handleScanResult = useCallback((decodedText) => {
    const booking = getBookingById(decodedText);
    if (booking) {
      if (booking.scanned) {
        setAlreadyScanned(true);
      } else {
        markScanned(booking.id);
        setAlreadyScanned(false);
      }
      setResult(booking);
    } else {
      setError('No booking found with this QR code. Please verify and try again.');
    }
    stopScanner();
  }, [getBookingById, markScanned]);

  const startScanner = useCallback(async () => {
    try {
      const html5Qr = new Html5Qrcode('qr-reader');
      html5QrRef.current = html5Qr;
      await html5Qr.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        handleScanResult,
        () => {} // ignore errors during scanning
      );
      setScanning(true);
    } catch (err) {
      setError('Unable to access camera. Please use simulation or manual entry below.');
    }
  }, [handleScanResult]);

  const stopScanner = useCallback(async () => {
    if (html5QrRef.current) {
      try {
        await html5QrRef.current.stop();
        html5QrRef.current.clear();
      } catch (e) {
        // ignore
      }
      html5QrRef.current = null;
    }
    setScanning(false);
  }, []);

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, [stopScanner]);

  const handleManualLookup = () => {
    if (!manualId.trim()) return;
    const booking = getBookingById(manualId.trim());
    if (booking) {
      if (booking.scanned) {
        setAlreadyScanned(true);
      } else {
        markScanned(booking.id);
        setAlreadyScanned(false);
      }
      setResult(booking);
    } else {
      setError('No booking found with this ID. Please check and try again.');
    }
    setManualId('');
  };

  const handleSimulateScan = () => {
    if (!selectedDemoBooking) return;
    const booking = getBookingById(selectedDemoBooking);
    if (booking) {
      if (booking.scanned) {
        setAlreadyScanned(true);
      } else {
        markScanned(booking.id);
        setAlreadyScanned(false);
      }
      setResult(booking);
    } else {
      setError('Demo booking not found.');
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Verify Booking
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">
                QR Scanner
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-md mx-auto leading-relaxed">
                Staff check-in tool. Scan a client's QR code or run a simulation to verify a reservation.
              </p>
            </div>
          </ScrollReveal>

          {/* Simulation Dashboard - Ideal for client showcase */}
          <ScrollReveal delay={0.05}>
            <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-3xl p-6 mb-6">
              <h3 className="text-charcoal dark:text-white font-serif text-lg font-bold mb-2">Showcase Simulation</h3>
              <p className="text-charcoal/50 dark:text-white/50 text-xs mb-5 leading-relaxed">
                Since you might not have a physical printed QR ticket, you can simulate scanning any reservation currently stored in the system.
              </p>

              {bookings.length === 0 ? (
                <div className="p-4 bg-gold/10 rounded-xl text-center text-xs text-gold border border-gold/20 font-medium">
                  No reservations are registered. Please create a booking first!
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <select
                    value={selectedDemoBooking}
                    onChange={(e) => setSelectedDemoBooking(e.target.value)}
                    className="flex-1 px-4 py-3 bg-cream dark:bg-charcoal border border-charcoal/10 dark:border-white/10 rounded-xl text-xs text-charcoal dark:text-white focus:outline-none focus:border-gold/50 cursor-pointer"
                  >
                    <option value="">Select a reservation to scan...</option>
                    {bookings.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.customerName} ({b.guests} Guests) - {b.date} [{b.id.slice(0, 8).toUpperCase()}]
                      </option>
                    ))}
                  </select>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!selectedDemoBooking}
                    onClick={handleSimulateScan}
                    className="btn-primary py-3 px-6 text-xs disabled:opacity-50 disabled:cursor-not-allowed font-bold"
                  >
                    Simulate Verification
                  </motion.button>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Scanner Area */}
          <ScrollReveal delay={0.1}>
            <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-3xl p-6 mb-6">
              <div
                id="qr-reader"
                ref={scannerRef}
                className="rounded-2xl overflow-hidden bg-cream dark:bg-charcoal aspect-square max-w-sm mx-auto mb-6 border border-charcoal/5 dark:border-white/5 relative flex items-center justify-center"
              >
                {!scanning && (
                  <div className="absolute text-center p-8">
                    <span className="text-5xl block mb-3 opacity-40">📷</span>
                    <span className="text-xs text-charcoal/40 dark:text-white/40">Camera stream will load here</span>
                  </div>
                )}
              </div>

              <div className="flex justify-center">
                {!scanning ? (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startScanner}
                    className="btn-primary flex items-center gap-2 text-xs py-3 px-6"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Activate Camera Scanner
                  </motion.button>
                ) : (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={stopScanner}
                    className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-full font-bold text-xs shadow-lg transition-colors"
                  >
                    Deactivate Camera
                  </motion.button>
                )}
              </div>
            </div>
          </ScrollReveal>

          {/* Manual Entry */}
          <ScrollReveal delay={0.15}>
            <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-3xl p-6">
              <h3 className="text-charcoal dark:text-white font-serif text-lg font-bold mb-1">Manual Code Lookup</h3>
              <p className="text-charcoal/50 dark:text-white/50 text-xs mb-4">
                If the camera isn't working or you have a written reservation code, enter it below.
              </p>
              <div className="flex gap-3">
                <input
                  type="text"
                  value={manualId}
                  onChange={(e) => setManualId(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualLookup()}
                  placeholder="e.g., booking-..."
                  className="flex-1 px-4 py-3 bg-cream dark:bg-charcoal border border-charcoal/10 dark:border-white/10 rounded-xl text-xs text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all font-mono"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleManualLookup}
                  className="btn-primary px-6 py-3 text-xs font-bold"
                >
                  Verify Code
                </motion.button>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {result && (
          <VerifiedModal
            booking={result}
            alreadyScanned={alreadyScanned}
            onClose={() => setResult(null)}
          />
        )}
        {error && (
          <ErrorModal
            message={error}
            onClose={() => setError(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
