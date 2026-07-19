import { motion } from 'framer-motion';

export default function LoadingSpinner({ fullPage = true, size = 'lg' }) {
  const sizes = {
    sm: { outer: 'w-8 h-8', inner: 'inset-1.5', dot: 'w-1 h-1' },
    md: { outer: 'w-12 h-12', inner: 'inset-2', dot: 'w-1.5 h-1.5' },
    lg: { outer: 'w-16 h-16', inner: 'inset-2.5', dot: 'w-2 h-2' },
  };
  const s = sizes[size] || sizes.lg;

  const spinner = (
    <div className="relative" role="status" aria-label="Loading">
      {/* Outer ring */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        className={`${s.outer} rounded-full border-2 border-transparent border-t-gold border-r-gold/50`}
      />
      {/* Inner ring (counter-rotate) */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
        className={`absolute ${s.inner} rounded-full border-2 border-transparent border-b-gold-light border-l-gold/30`}
      />
      {/* Centre pulse dot */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 1.2, repeat: Infinity }}
        className={`absolute inset-0 m-auto ${s.dot} rounded-full bg-gold`}
      />
      <span className="sr-only">Loading…</span>
    </div>
  );

  if (!fullPage) return spinner;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-cream dark:bg-charcoal">
      {spinner}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="font-serif text-charcoal/40 dark:text-white/40 text-sm tracking-widest uppercase"
      >
        L'Élégance
      </motion.p>
    </div>
  );
}
