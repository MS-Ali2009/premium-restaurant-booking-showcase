import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';
import LocationPopup from './components/LocationPopup';
import AuthModal from './components/AuthModal';
import CartDrawer from './components/CartDrawer';
import AddToOrderModal from './components/AddToOrderModal';

// Lazy-loaded pages
const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Menu'));
const Booking = lazy(() => import('./pages/Booking'));
const Reservations = lazy(() => import('./pages/Reservations'));
const Scanner = lazy(() => import('./pages/Scanner'));
const Gallery = lazy(() => import('./pages/Gallery'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Blogs = lazy(() => import('./pages/Blogs'));
const Testimonials = lazy(() => import('./pages/Testimonials'));
const Complaint = lazy(() => import('./pages/Complaint'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/reservations" element={<Reservations />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/scanner" element={<Scanner />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <BrowserRouter basename={process.env.PUBLIC_URL}>
          <div className="min-h-screen bg-cream dark:bg-charcoal transition-colors duration-300">
            <Navbar />
            <Suspense fallback={<LoadingSpinner />}>
              <AnimatedRoutes />
            </Suspense>
            <Footer />
          </div>
          {/* Global overlays & drawers */}
          <LocationPopup />
          <AuthModal />
          <CartDrawer />
          <AddToOrderModal />
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#2A2A2A',
                color: '#fff',
                border: '1px solid rgba(201, 169, 110, 0.2)',
              },
            }}
          />
        </BrowserRouter>
      </BookingProvider>
    </ThemeProvider>
  );
}

export default App;
