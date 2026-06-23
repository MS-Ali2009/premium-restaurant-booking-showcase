import { useRef, useState, useCallback, memo } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { testimonials, menuItems } from '../data/menuData';

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

function HeroSection() {
  const ref = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 20, y: yPos * 20 });
  }, []);

  return (
    <section ref={ref} className="relative h-screen overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Background with mouse-follow parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          animate={{ x: mousePos.x, y: mousePos.y }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
          className="absolute inset-[-20px] bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&h=1080&fit=crop)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/70 via-charcoal/50 to-cream dark:to-charcoal" />
      </motion.div>

      {/* Animated gradient overlay */}
      <motion.div
        animate={{
          background: [
            'radial-gradient(circle at 20% 50%, rgba(201,169,110,0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 50%, rgba(201,169,110,0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 50% 80%, rgba(201,169,110,0.08) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 50%, rgba(201,169,110,0.08) 0%, transparent 50%)',
          ],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Floating gold circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ y: [0, -30, 0], x: [0, 10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[20%] left-[10%] w-16 h-16 rounded-full border border-gold/20 bg-gold/5"
        />
        <motion.div
          animate={{ y: [0, 20, 0], x: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute top-[60%] right-[15%] w-24 h-24 rounded-full border border-gold/15 bg-gold/5"
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[25%] left-[70%] w-10 h-10 rounded-full bg-gold/10"
        />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <motion.div
        style={{ opacity }}
        className="relative h-full flex flex-col items-center justify-center text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-gold tracking-[0.3em] uppercase text-sm mb-6"
        >
          Michelin Starred Excellence
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-serif text-5xl sm:text-7xl lg:text-8xl text-white font-bold mb-6"
        >
          L'Élégance
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="text-white/70 text-lg sm:text-xl max-w-2xl mb-10"
        >
          Where culinary artistry meets timeless sophistication. An extraordinary
          dining experience awaits.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link to="/booking">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-10 py-4"
            >
              Reserve a Table
            </motion.button>
          </Link>
          <Link to="/menu">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(255, 255, 255, 0.1)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-lg px-10 py-4 border-white/40 text-white hover:bg-white hover:text-charcoal"
            >
              Explore Menu
            </motion.button>
          </Link>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-gold/50 flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-gold"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { value: '25+', label: 'Years of Excellence' },
    { value: '3', label: 'Michelin Stars' },
    { value: '50K+', label: 'Dishes Served Monthly' },
    { value: '12', label: 'International Awards' },
  ];

  return (
    <section className="section-padding bg-cream dark:bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {stats.map((stat, i) => (
            <motion.div key={stat.label} variants={fadeUp} className="text-center">
              <motion.h3
                className="font-serif text-4xl sm:text-5xl text-gold font-bold mb-2"
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, type: 'spring' }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-charcoal/60 dark:text-white/60 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

const DishCard = memo(function DishCard({ dish, i }) {
  return (
    <ScrollReveal delay={i * 0.1}>
      <motion.div
        whileHover={{ y: -10, rotateY: 5, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)' }}
        className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5"
        style={{ perspective: '1000px' }}
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
        <div className="p-5">
          <h3 className="font-serif text-lg text-charcoal dark:text-white mb-1">
            {dish.name}
          </h3>
          <p className="text-charcoal/50 dark:text-white/50 text-sm line-clamp-2 mb-3">
            {dish.description}
          </p>
          <p className="text-gold font-semibold">${dish.price}</p>
        </div>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl ring-1 ring-gold/30 shadow-lg shadow-gold/10" />
      </motion.div>
    </ScrollReveal>
  );
});

function FeaturedDishes() {
  const featured = menuItems.slice(0, 4);

  return (
    <section className="section-padding bg-cream dark:bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">
              Culinary Masterpieces
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold">
              Signature Dishes
            </h2>
          </div>
        </ScrollReveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {featured.map((dish, i) => (
            <DishCard key={dish.id} dish={dish} i={i} />
          ))}
        </motion.div>

        <ScrollReveal>
          <div className="text-center mt-12">
            <Link to="/menu">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                View Full Menu
              </motion.button>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

function PhilosophySection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);
  const textY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <section ref={ref} className="relative py-32 overflow-hidden">
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-[-20%] bg-cover bg-center"
      >
        <div
          className="w-full h-full bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=1080&fit=crop)',
          }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-cream/85 dark:bg-charcoal/85" />

      <motion.div style={{ y: textY }} className="relative max-w-4xl mx-auto text-center px-4">
        <ScrollReveal>
          <p className="text-gold tracking-widest uppercase text-sm mb-3">
            Our Philosophy
          </p>
          <h2 className="font-serif text-4xl sm:text-6xl text-charcoal dark:text-white font-bold mb-8">
            The Art of Dining
          </h2>
          <p className="text-charcoal/70 dark:text-white/70 text-lg leading-relaxed max-w-3xl mx-auto mb-6">
            At L'Élégance, we believe that a meal is not merely sustenance — it is a symphony
            of flavors, textures, and emotions. Every ingredient is sourced with intention,
            every plate composed with the precision of a master artist.
          </p>
          <p className="text-charcoal/60 dark:text-white/60 text-lg leading-relaxed max-w-3xl mx-auto">
            Our commitment extends beyond the kitchen. From the warm glow of candlelight to
            the carefully curated wine list, every detail conspires to create moments that
            linger long after the last course.
          </p>
        </ScrollReveal>
      </motion.div>
    </section>
  );
}

function WhyUsSection() {
  const items = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      ),
      title: 'Fresh Ingredients',
      description: 'Sourced daily from local organic farms and premium artisan suppliers across France.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      ),
      title: 'Master Chefs',
      description: 'A brigade of award-winning chefs led by three-Michelin-starred Chef Laurent Dubois.',
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: 'Elegant Ambiance',
      description: 'An atmosphere where modern luxury meets Parisian grandeur in every detail.',
    },
  ];

  return (
    <section className="section-padding bg-cream dark:bg-charcoal">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">
              Why Choose Us
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold">
              The L'Élégance Difference
            </h2>
          </div>
        </ScrollReveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              variants={fadeUp}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.15)' }}
              className="text-center p-8 rounded-3xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5"
            >
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gold/10 flex items-center justify-center text-gold"
              >
                {item.icon}
              </motion.div>
              <h3 className="font-serif text-xl text-charcoal dark:text-white mb-3">{item.title}</h3>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ChefStory() {
  return (
    <section className="section-padding bg-cream dark:bg-charcoal overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="left">
            <div className="relative">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop"
                  alt="Head Chef"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="absolute -top-4 -left-4 w-full h-full border-2 border-gold/30 rounded-2xl -z-10" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full border border-gold/20 flex items-center justify-center"
              >
                <span className="text-gold text-xs text-center leading-tight">
                  Est.<br />1999
                </span>
              </motion.div>
            </div>
          </ScrollReveal>

          <ScrollReveal direction="right">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">
              The Visionary
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold mb-6">
              Chef Laurent Dubois
            </h2>
            <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-6">
              With over two decades of mastery across the world's finest kitchens,
              Chef Laurent brings an unparalleled passion for perfection. Each dish
              is a canvas, each ingredient a deliberate choice in the pursuit of
              culinary excellence.
            </p>
            <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-8">
              Trained under the legendary Paul Bocuse and having earned three
              Michelin stars, his philosophy is simple: respect the ingredient, honor
              the tradition, and always surprise the palate.
            </p>
            <Link to="/about">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)' }}
                whileTap={{ scale: 0.95 }}
                className="btn-secondary"
              >
                Our Story
              </motion.button>
            </Link>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  return (
    <section className="section-padding bg-cream dark:bg-charcoal relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-7xl mx-auto relative">
        <ScrollReveal>
          <div className="text-center mb-16">
            <p className="text-gold tracking-widest uppercase text-sm mb-3">
              Testimonials
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold">
              Words of Praise
            </h2>
          </div>
        </ScrollReveal>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {testimonials.map((t) => (
            <motion.div
              key={t.id}
              variants={fadeUp}
              whileHover={{ y: -5 }}
              className="p-8 rounded-2xl bg-white/80 dark:bg-dark-card/50 backdrop-blur-sm border border-charcoal/10 dark:border-white/5"
            >
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/30"
                  loading="lazy"
                />
                <div>
                  <h4 className="text-charcoal dark:text-white font-medium">{t.name}</h4>
                  <p className="text-gold/70 text-sm">{t.role}</p>
                </div>
              </div>
              <p className="text-charcoal/60 dark:text-white/60 italic leading-relaxed">"{t.text}"</p>
              <div className="mt-4 flex gap-1">
                {[...Array(t.rating)].map((_, idx) => (
                  <span key={idx} className="text-gold">★</span>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1920&h=1080&fit=crop)',
        }}
      />
      <div className="absolute inset-0 bg-cream/80 dark:bg-charcoal/80" />

      <div className="relative max-w-4xl mx-auto text-center px-4">
        <ScrollReveal>
          <h2 className="font-serif text-4xl sm:text-6xl text-charcoal dark:text-white font-bold mb-6">
            An Evening to Remember
          </h2>
          <p className="text-charcoal/70 dark:text-white/70 text-lg mb-10 max-w-2xl mx-auto">
            Join us for an extraordinary culinary journey. Reserve your table today
            and experience dining elevated to an art form.
          </p>
          <Link to="/booking">
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              className="btn-primary text-lg px-12 py-4"
            >
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
      <PhilosophySection />
      <WhyUsSection />
      <ChefStory />
      <TestimonialsSection />
      <CTASection />
    </PageTransition>
  );
}
