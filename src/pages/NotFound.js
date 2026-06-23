import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-charcoal flex items-center justify-center px-4">
        <div className="text-center">
          {/* Animated 404 */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring' }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                className="font-serif text-8xl sm:text-9xl text-gold inline-block"
              >
                4
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.3 }}
                className="font-serif text-8xl sm:text-9xl text-white inline-block mx-2"
              >
                0
              </motion.span>
              <motion.span
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                className="font-serif text-8xl sm:text-9xl text-gold inline-block"
              >
                4
              </motion.span>
            </div>
          </motion.div>

          {/* Floating decorative elements */}
          <div className="relative">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-gold/20"
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${-50 + Math.random() * 100}px`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                }}
              />
            ))}
          </div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-3xl text-white mb-4"
          >
            Lost in Elegance
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 max-w-md mx-auto mb-10"
          >
            The page you're looking for seems to have wandered off our menu.
            Let us guide you back to our world of culinary excellence.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Link to="/">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-lg px-10 py-4"
              >
                Return Home
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
