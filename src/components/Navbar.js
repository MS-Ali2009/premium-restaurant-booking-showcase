import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useLocationStore } from '../store/locationStore';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/menu', label: 'Menu' },
  { path: '/blogs', label: 'Blogs' },
  { path: '/testimonials', label: 'Reviews' },
  { path: '/gallery', label: 'Gallery' },
  { path: '/about', label: 'About' },
  { path: '/contact', label: 'Contact' },
];

/* ── SVG Icons (inline for bundle efficiency) ───────────── */
const SunIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
  </svg>
);

const MoonIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
  </svg>
);

const CartIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
  </svg>
);

const SignOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
);

export default function Navbar() {
  const [isOpen, setIsOpen]           = useState(false);
  const [scrolled, setScrolled]       = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef                   = useRef(null);
  const location                      = useLocation();

  const { isDark, toggleTheme }                         = useTheme();
  const { cart, openCart }                              = useCartStore();
  const { currentUser, openAuth, logout }               = useAuthStore();
  const { selectedLocation, setShowPopup }              = useLocationStore();

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (val) => {
    setScrolled(val > 40);
  });

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close mobile menu on resize
  useEffect(() => {
    const onResize = () => { if (window.innerWidth >= 1024) setIsOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Close user dropdown on outside click
  useEffect(() => {
    const handle = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const initials = currentUser
    ? currentUser.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  const isActive = useCallback((path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }, [location.pathname]);

  return (
    <>
      <motion.header
        role="banner"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cream/96 dark:bg-charcoal/96 backdrop-blur-2xl shadow-lg shadow-black/5 border-b border-gold/10'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[72px]">

            {/* ── Logo ── */}
            <Link
              to="/"
              className="flex items-center gap-3 flex-shrink-0 no-tap-highlight group"
              aria-label="L'Élégance – go to homepage"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center shadow-gold flex-shrink-0"
              >
                <span className="text-charcoal font-serif font-bold text-base leading-none">L</span>
              </motion.div>
              <div className="hidden sm:flex flex-col leading-none">
                <span className="font-serif text-lg font-bold text-charcoal dark:text-white group-hover:text-gold transition-colors duration-300">
                  L'Élégance
                </span>
                <span className="text-[9px] uppercase tracking-[0.25em] text-gold/70 font-medium -mt-0.5">
                  Fine Dining
                </span>
              </div>
            </Link>

            {/* ── Desktop Nav Links ── */}
            <nav role="navigation" aria-label="Main navigation" className="hidden lg:flex items-center">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 text-[13px] font-medium tracking-wide transition-colors duration-300 group no-tap-highlight ${
                    isActive(link.path)
                      ? 'text-gold'
                      : 'text-charcoal/75 dark:text-white/75 hover:text-charcoal dark:hover:text-white'
                  }`}
                >
                  {link.label}
                  {/* Active indicator */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] rounded-full bg-gold transition-all duration-300 ${
                      isActive(link.path) ? 'w-4 opacity-100' : 'w-0 opacity-0 group-hover:w-4 group-hover:opacity-40'
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* ── Action Bar ── */}
            <div className="flex items-center gap-0.5 sm:gap-1">

              {/* Location pill */}
              <button
                onClick={() => setShowPopup(true)}
                aria-label="Change location"
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide
                           text-charcoal/60 dark:text-white/60 border border-charcoal/15 dark:border-white/15
                           hover:border-gold/60 hover:text-gold transition-all duration-300"
              >
                <LocationIcon />
                <span>{selectedLocation?.city ?? 'Location'}</span>
              </button>

              {/* Theme toggle */}
              <motion.button
                onClick={toggleTheme}
                aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                whileTap={{ scale: 0.85 }}
                className="p-2.5 rounded-full text-charcoal/60 dark:text-white/60 hover:text-gold hover:bg-gold/10 transition-all duration-300 no-tap-highlight"
              >
                <motion.span
                  key={isDark ? 'moon' : 'sun'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="block"
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                </motion.span>
              </motion.button>

              {/* Cart button */}
              <motion.button
                onClick={openCart}
                aria-label={`Open cart (${cartCount} items)`}
                whileTap={{ scale: 0.85 }}
                className="relative p-2.5 rounded-full text-charcoal/70 dark:text-white/70 hover:text-gold hover:bg-gold/10 transition-all duration-300 no-tap-highlight"
              >
                <CartIcon />
                <AnimatePresence>
                  {cartCount > 0 && (
                    <motion.span
                      key="cart-badge"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-gold text-charcoal text-[10px] font-bold rounded-full flex items-center justify-center shadow-gold"
                    >
                      {cartCount > 9 ? '9+' : cartCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Auth area */}
              {currentUser ? (
                <div className="relative" ref={userMenuRef}>
                  <motion.button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                    whileTap={{ scale: 0.9 }}
                    className="w-9 h-9 rounded-full gold-gradient text-charcoal font-bold text-xs flex items-center justify-center shadow-gold hover:shadow-gold-lg transition-all duration-300 ml-1"
                  >
                    {initials}
                  </motion.button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.93 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.93 }}
                        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                        role="menu"
                        aria-label="User menu"
                        className="absolute right-0 top-12 w-52 bg-white dark:bg-dark-card rounded-2xl shadow-luxury border border-charcoal/8 dark:border-white/8 overflow-hidden z-50"
                      >
                        <div className="px-4 py-3.5 border-b border-charcoal/8 dark:border-white/8">
                          <p className="text-[13px] font-semibold text-charcoal dark:text-white truncate">{currentUser.name}</p>
                          <p className="text-[11px] text-charcoal/40 dark:text-white/40 truncate mt-0.5">{currentUser.email}</p>
                        </div>
                        <Link
                          to="/reservations"
                          className="flex items-center gap-2.5 px-4 py-3 text-[13px] text-charcoal/70 dark:text-white/70 hover:bg-gold/5 hover:text-gold transition-colors"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                          My Reservations
                        </Link>
                        <button
                          onClick={() => { logout(); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-2.5 px-4 py-3 text-[13px] text-red-400 hover:bg-red-50 dark:hover:bg-red-900/15 transition-colors"
                          role="menuitem"
                        >
                          <SignOutIcon />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  onClick={() => openAuth('login')}
                  whileTap={{ scale: 0.93 }}
                  className="hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 bg-gold text-charcoal text-[13px] font-semibold rounded-full shadow-gold hover:shadow-gold-lg hover:bg-gold-light transition-all duration-300 no-tap-highlight"
                >
                  <UserIcon />
                  Sign In
                </motion.button>
              )}

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isOpen}
                className="lg:hidden ml-1 p-2.5 rounded-xl hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors no-tap-highlight"
              >
                <div className="w-5 h-5 flex flex-col justify-center gap-[5px]">
                  <motion.span
                    animate={isOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-[2px] bg-gold rounded-full block origin-left"
                  />
                  <motion.span
                    animate={isOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.2 }}
                    className="w-4/5 h-[2px] bg-gold rounded-full block"
                  />
                  <motion.span
                    animate={isOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="w-full h-[2px] bg-gold rounded-full block origin-left"
                  />
                </div>
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Menu Overlay ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-charcoal/60 backdrop-blur-sm lg:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-0 right-0 bottom-0 w-72 z-50 bg-cream dark:bg-charcoal border-l border-gold/15 shadow-luxury lg:hidden flex flex-col"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10 dark:border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full gold-gradient flex items-center justify-center">
                    <span className="text-charcoal font-serif font-bold text-sm">L</span>
                  </div>
                  <span className="font-serif text-base font-bold text-charcoal dark:text-white">L'Élégance</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors" aria-label="Close menu">
                  <svg className="w-5 h-5 text-charcoal/60 dark:text-white/60" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04, duration: 0.3 }}
                  >
                    <Link
                      to={link.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[15px] font-medium transition-all duration-300 ${
                        isActive(link.path)
                          ? 'text-gold bg-gold/8 font-semibold'
                          : 'text-charcoal/75 dark:text-white/75 hover:text-gold hover:bg-gold/5'
                      }`}
                    >
                      {isActive(link.path) && (
                        <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                      )}
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Drawer footer */}
              <div className="px-4 pb-6 pt-4 border-t border-charcoal/10 dark:border-white/10 space-y-3">
                <button
                  onClick={() => { setShowPopup(true); setIsOpen(false); }}
                  className="w-full flex items-center gap-2 px-4 py-3 rounded-xl border border-gold/30 text-gold text-sm font-medium hover:bg-gold/10 transition-colors"
                >
                  <LocationIcon />
                  {selectedLocation ? selectedLocation.city : 'Choose Location'}
                </button>

                {!currentUser ? (
                  <button
                    onClick={() => { openAuth('login'); setIsOpen(false); }}
                    className="w-full py-3 bg-gold text-charcoal font-semibold rounded-xl text-sm hover:bg-gold-light transition-colors"
                  >
                    Sign In
                  </button>
                ) : (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="w-full py-3 border border-red-400/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                  >
                    Sign Out
                  </button>
                )}

                <button
                  onClick={toggleTheme}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm text-charcoal/60 dark:text-white/60 hover:bg-charcoal/5 dark:hover:bg-white/5 transition-colors"
                >
                  {isDark ? <SunIcon /> : <MoonIcon />}
                  {isDark ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
