import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocationStore, locations } from '../store/locationStore';
import toast from 'react-hot-toast';

export default function LocationPopup() {
  const { showPopup, setLocation, setShowPopup, selectedLocation } = useLocationStore();
  const [detecting, setDetecting] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);

  // Prevent body scroll when popup is open
  useEffect(() => {
    if (showPopup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showPopup]);

  const handleDetectLocation = () => {
    setDetecting(true);
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      setDetecting(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        // Simple proximity detection
        const coords = [
          { loc: locations[0], lat: 48.858, lon: 2.294 },   // Paris
          { loc: locations[1], lat: 40.758, lon: -73.985 },  // New York
          { loc: locations[2], lat: 51.507, lon: -0.127 },   // London
          { loc: locations[3], lat: 35.661, lon: 139.729 },  // Tokyo
        ];
        let closest = coords[0];
        let minDist = Infinity;
        coords.forEach(({ loc, lat, lon }) => {
          const d = Math.sqrt((latitude - lat) ** 2 + (longitude - lon) ** 2);
          if (d < minDist) { minDist = d; closest = { loc, lat, lon }; }
        });
        setLocation(closest.loc);
        setDetecting(false);
        toast.success(`Welcome! Set to ${closest.loc.city}.`, {
          style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' },
          iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
        });
      },
      () => {
        setDetecting(false);
        toast.error('Location access denied. Please select manually.');
      },
      { timeout: 10000 }
    );
  };

  const locationFlags = { paris: '🇫🇷', 'new-york': '🇺🇸', london: '🇬🇧', tokyo: '🇯🇵' };
  const locationImages = {
    paris: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=400&h=200&fit=crop',
    'new-york': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=200&fit=crop',
    london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&h=200&fit=crop',
    tokyo: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=200&fit=crop',
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal/95 backdrop-blur-xl">
          {/* Floating particles */}
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-gold/30"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [0, -80, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 4 }}
            />
          ))}

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-charcoal/10 dark:border-white/5 shadow-2xl z-10"
          >
            {/* Decorative gold top-strip */}
            <div className="h-1 gold-gradient w-full" />

            <div className="p-8">
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-charcoal font-serif font-bold text-2xl">L</span>
                </motion.div>
                <p className="text-gold tracking-widest uppercase text-xs mb-2">Welcome to</p>
                <h2 className="font-serif text-3xl font-bold text-charcoal dark:text-white mb-3">
                  L'Élégance
                </h2>
                <p className="text-charcoal/50 dark:text-white/50 text-sm max-w-sm mx-auto">
                  Choose your preferred dining destination to personalise your experience.
                </p>
              </div>

              {/* Auto detect */}
              <button
                onClick={handleDetectLocation}
                disabled={detecting}
                className="w-full flex items-center justify-center gap-3 py-3 mb-6 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-all text-sm font-medium"
              >
                {detecting ? (
                  <>
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full" />
                    Detecting location...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Detect My Location Automatically
                  </>
                )}
              </button>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-charcoal/10 dark:bg-white/10" />
                <span className="text-xs text-charcoal/40 dark:text-white/40 uppercase tracking-wider">or select manually</span>
                <div className="flex-1 h-px bg-charcoal/10 dark:bg-white/10" />
              </div>

              {/* Location grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {locations.map((loc) => (
                  <motion.button
                    key={loc.id}
                    whileHover={{ scale: 1.03, y: -3 }}
                    whileTap={{ scale: 0.97 }}
                    onHoverStart={() => setHoveredId(loc.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    onClick={() => {
                      setLocation(loc);
                      toast.success(`Location set to ${loc.city}!`, {
                        style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' },
                        iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
                      });
                    }}
                    className="relative overflow-hidden rounded-2xl border border-charcoal/10 dark:border-white/10 group text-left"
                  >
                    <div className="h-20 overflow-hidden">
                      <img
                        src={locationImages[loc.id]}
                        alt={loc.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-2.5">
                      <span className="text-lg">{locationFlags[loc.id]}</span>
                      <p className="text-white font-serif text-sm font-bold leading-tight">{loc.city}</p>
                      <p className="text-gold/80 text-xs">{loc.symbol} {loc.currency}</p>
                    </div>
                    {/* Hover glow ring */}
                    <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-gold/50 transition-all duration-300 pointer-events-none" />
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
