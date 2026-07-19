import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, animate } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { testimonials, menuItems } from '../data/menuData';
import { useCartStore } from '../store/cartStore';
import { useLocationStore } from '../store/locationStore';

/* ── Animated Counter ───────────────────────────────────── */
function AnimatedCounter({ from = 0, to, duration = 2, suffix = '' }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [display, setDisplay] = useState(from.toLocaleString());

  useEffect(() => {
    if (!isInView) return;
    const controls = animate(from, to, {
      duration,
      ease: 'easeOut',
      onUpdate(value) {
        setDisplay(Math.round(value).toLocaleString());
      },
    });
    return () => controls.stop();
  }, [isInView, from, to, duration]);

  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Hero Section ───────────────────────────────────────── */
function HeroSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden">
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-cream dark:to-charcoal" />
      </motion.div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -100, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      <motion.div style={{ opacity }} className="relative h-full flex flex-col items-center justify-center text-center px-4">
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }} className="text-gold tracking-[0.3em] uppercase text-sm mb-6">
          Michelin Starred Excellence
        </motion.p>
        <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.8 }} className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white font-bold mb-6">
          L'Élégance
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.8 }} className="text-white/70 text-lg sm:text-xl max-w-2xl mb-10">
          Where culinary artistry meets timeless sophistication. An extraordinary dining experience awaits.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4">
          <Link to="/booking">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-lg px-10 py-4">Reserve a Table</motion.button>
          </Link>
          <Link to="/menu">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary text-lg px-10 py-4 border-white/40 text-white hover:bg-white hover:text-charcoal">Explore Menu</motion.button>
          </Link>
        </motion.div>
        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-10 left-1/2 -translate-x-1/2">
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-gold" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ── Stats Section (Animated Counters) ──────────────────── */
function StatsSection() {
  const stats = [
    { label: 'Years of Excellence', to: 25, suffix: '+' },
    { label: 'Michelin Stars',      to: 3,  suffix: '' },
    { label: 'Dishes Served Monthly', to: 50000, suffix: '+' },
    { label: 'International Awards', to: 12, suffix: '' },
  ];

  return (
    <section className="section-padding bg-cream dark:bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.15}>
              <div className="text-center">
                <h3 className="font-serif text-4xl sm:text-5xl text-gold font-bold mb-2">
                  <AnimatedCounter to={stat.to} suffix={stat.suffix} duration={2.5} />
                </h3>
                <p className="text-charcoal/60 dark:text-white/60 text-sm">{stat.label}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Signature Dishes Carousel ──────────────────────────── */
function FeaturedDishes() {
  const { openAddModal } = useCartStore();
  const { formatPrice } = useLocationStore();
  // Duplicate items to create seamless infinite loop
  const doubled = [...menuItems, ...menuItems];

  return (
    <section className="section-padding bg-cream dark:bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">Culinary Masterpieces</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold">Signature Dishes</h2>
            <p className="text-charcoal/50 dark:text-white/50 mt-4 text-sm">Hover to pause · Click to order</p>
          </div>
        </ScrollReveal>
      </div>

      {/* Full-bleed marquee */}
      <div className="marquee-wrapper overflow-hidden">
        <div className="marquee-track gap-6">
          {doubled.map((dish, i) => (
            <motion.div
              key={`${dish.id}-${i}`}
              whileHover={{ y: -8 }}
              onClick={() => openAddModal(dish)}
              className="group relative flex-shrink-0 w-64 overflow-hidden rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 cursor-pointer"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <motion.img
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <h3 className="font-serif text-base text-charcoal dark:text-white mb-1 truncate">{dish.name}</h3>
                <p className="text-charcoal/50 dark:text-white/50 text-xs line-clamp-2 mb-3">{dish.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-gold font-semibold text-sm">{formatPrice(dish.price)}</p>
                  <span className="text-xs text-gold/70 group-hover:text-gold transition-colors font-medium">+ Add →</span>
                </div>
              </div>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-1 ring-gold/40 shadow-lg shadow-gold/10" />
            </motion.div>
          ))}
        </div>
      </div>

      <ScrollReveal>
        <div className="text-center mt-12">
          <Link to="/menu">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary">
              View Full Menu
            </motion.button>
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

/* ── Chef Story ─────────────────────────────────────────── */
function ChefStory() {
  return (
    <section className="section-padding bg-cream dark:bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop" alt="Head Chef" className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }} className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-gold/20 flex items-center justify-center">
                <span className="text-gold text-xs text-center leading-tight">Est.<br />1999</span>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">The Visionary</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold mb-6">Chef Laurent Dubois</h2>
            <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-6">
              With over two decades of mastery across the world's finest kitchens, Chef Laurent brings an unparalleled passion for perfection. Each dish is a canvas, each ingredient a deliberate choice in the pursuit of culinary excellence.
            </p>
            <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-8">
              Trained under the legendary Paul Bocuse and having earned three Michelin stars, his philosophy is simple: respect the ingredient, honor the tradition, and always surprise the palate.
            </p>
            <Link to="/about">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary">Our Story</motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ── Testimonials ───────────────────────────────────────── */
function TestimonialsSection() {
  return (
    <section className="section-padding bg-cream dark:bg-charcoal relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />
      <div className="max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">Testimonials</p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold">Words of Praise</h2>
          </div>
        </ScrollReveal>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((t, i) => (
            <ScrollReveal key={t.id} delay={i * 0.1}>
              <motion.div whileHover={{ y: -5 }} className="p-8 rounded-2xl bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm border border-charcoal/10 dark:border-white/5">
                <div className="flex items-center gap-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/30" loading="lazy" />
                  <div>
                    <h4 className="text-charcoal dark:text-white font-medium">{t.name}</h4>
                    <p className="text-gold/70 text-sm">{t.role}</p>
                  </div>
                </div>
                <p className="text-charcoal/60 dark:text-white/60 italic leading-relaxed">"{t.text}"</p>
                <div className="mt-4 flex gap-1">
                  {[...Array(t.rating)].map((_, idx) => <span key={idx} className="text-gold">★</span>)}
                </div>
              </motion.div>
            </ScrollReveal>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/testimonials">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-secondary">
              View All Reviews
            </motion.button>
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ── CTA ────────────────────────────────────────────────── */
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-cover bg-center bg-fixed" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=1080&fit=crop)' }} />
      <div className="absolute inset-0 bg-cream/80 dark:bg-charcoal/80" />
      <div className="relative max-w-4xl mx-auto text-center px-4">
        <ScrollReveal>
          <h2 className="font-serif text-4xl sm:text-6xl text-charcoal dark:text-white font-bold mb-6">An Evening to Remember</h2>
          <p className="text-charcoal/70 dark:text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Join us for an extraordinary culinary journey. Reserve your table today and experience dining elevated to an art form.
          </p>
          <Link to="/booking">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="btn-primary text-lg px-12 py-4">
              Reserve Your Experience
            </motion.button>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <PageTransition>
      <HeroSection />
      <StatsSection />
      <FeaturedDishes />
      <ChefStory />
      <TestimonialsSection />
      <CTASection />
    </PageTransition>
  );
}
