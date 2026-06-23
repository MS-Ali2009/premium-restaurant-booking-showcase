import { useState, useMemo, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { menuItems, menuCategories } from '../data/menuData';

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

function DishSpotlight({ dish, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 20 }}
        transition={{ type: 'spring', stiffness: 200, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card border border-gold/20 rounded-3xl overflow-hidden max-w-lg w-full shadow-2xl"
      >
        <div className="aspect-[16/10] overflow-hidden relative">
          <img
            src={dish.image.replace('w=400&h=300', 'w=800&h=500')}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <span className="px-3 py-1 bg-gold/90 text-charcoal text-xs font-medium rounded-full">
              {dish.category}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between mb-4">
            <h2 className="font-serif text-2xl sm:text-3xl text-charcoal dark:text-white font-bold">
              {dish.name}
            </h2>
            <span className="text-gold font-serif text-2xl font-bold">${dish.price}</span>
          </div>
          <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-6">
            {dish.description}
          </p>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 10px 30px rgba(201, 169, 110, 0.3)' }}
              whileTap={{ scale: 0.97 }}
              className="flex-1 btn-primary"
            >
              Add to Order
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              className="px-6 py-3 border border-charcoal/20 dark:border-white/20 rounded-full text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white transition-colors"
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

const DishCard = memo(function DishCard({ dish, index, onClick }) {
  return (
    <motion.div
      layout
      variants={fadeUp}
      whileHover={{ y: -8, rotateX: 2, rotateY: 2, boxShadow: '0 20px 40px rgba(201, 169, 110, 0.2)' }}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 cursor-pointer"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
      onClick={() => onClick(dish)}
    >
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          className="absolute top-4 right-4 bg-gold text-charcoal font-bold px-3 py-1 rounded-full text-sm shadow-lg"
        >
          ${dish.price}
        </motion.div>
      </div>

      <div className="p-5">
        <h3 className="font-serif text-lg text-charcoal dark:text-white group-hover:text-gold transition-colors">
          {dish.name}
        </h3>
        <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed line-clamp-2 mt-1">
          {dish.description}
        </p>
        <div className="mt-3">
          <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded-full">
            {dish.category}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/0 group-hover:ring-gold/30 transition-all duration-500 pointer-events-none" />
    </motion.div>
  );
});

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [spotlightDish, setSpotlightDish] = useState(null);

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleDishClick = useCallback((dish) => {
    setSpotlightDish(dish);
  }, []);

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Discover Our Flavours
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">
                The Menu
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                Each dish is a masterpiece crafted with the finest ingredients,
                bringing together tradition and innovation.
              </p>
            </div>
          </ScrollReveal>

          {/* Search */}
          <ScrollReveal delay={0.1}>
            <div className="max-w-md mx-auto mb-10">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search dishes..."
                  className="w-full px-6 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-full text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <svg
                  className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40 dark:text-white/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal delay={0.2}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {menuCategories.map((cat) => (
                <motion.button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? 'text-charcoal'
                      : 'text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10'
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.div
                      layoutId="menu-filter"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Menu Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredItems.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} index={i} onClick={handleDishClick} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-charcoal/40 dark:text-white/40 text-lg">
                No dishes found. Try a different search or category.
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Dish Spotlight Modal */}
      <AnimatePresence>
        {spotlightDish && (
          <DishSpotlight dish={spotlightDish} onClose={() => setSpotlightDish(null)} />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
