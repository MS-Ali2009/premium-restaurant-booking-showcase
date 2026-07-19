import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { menuItems, menuCategories } from '../data/menuData';
import { useCartStore } from '../store/cartStore';
import { useLocationStore } from '../store/locationStore';

function DishCard({ dish, index }) {
  const { openAddModal } = useCartStore();
  const { formatPrice } = useLocationStore();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -8, rotateX: 2, rotateY: 2 }}
      onClick={() => openAddModal(dish)}
      className="group relative overflow-hidden rounded-2xl bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 cursor-pointer"
      style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
    >
      {/* Image */}
      <div className="aspect-[4/3] overflow-hidden relative">
        <motion.img
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.6 }}
          src={dish.image}
          alt={dish.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 dark:from-charcoal/80" />
        {/* Price badge */}
        <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} className="absolute top-4 right-4 bg-gold text-charcoal font-bold px-3 py-1 rounded-full text-sm shadow-lg">
          {formatPrice(dish.price)}
        </motion.div>
        {/* Hover "Add to Order" overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="bg-gold text-charcoal font-bold px-5 py-2 rounded-full text-sm shadow-lg">
            + Add to Order
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-serif text-lg text-charcoal dark:text-white group-hover:text-gold transition-colors">
            {dish.name}
          </h3>
        </div>
        <p className="text-charcoal/50 dark:text-white/50 text-sm leading-relaxed line-clamp-2">
          {dish.description}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className="px-2 py-0.5 bg-gold/10 text-gold text-xs rounded-full">{dish.category}</span>
        </div>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-2xl ring-1 ring-gold/0 group-hover:ring-gold/30 transition-all duration-500 pointer-events-none shadow-none group-hover:shadow-lg group-hover:shadow-gold/5" />
    </motion.div>
  );
}

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Discover Our Flavours</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">The Menu</h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                Each dish is a masterpiece crafted with the finest ingredients, bringing together tradition and innovation. Click any item to order.
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
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
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
                    <motion.div layoutId="menu-filter" className="absolute inset-0 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Menu Grid */}
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredItems.map((dish, i) => (
                <DishCard key={dish.id} dish={dish} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <span className="text-5xl block mb-4">🍽️</span>
              <p className="text-charcoal/40 dark:text-white/40 text-lg font-serif">No dishes found.</p>
              <p className="text-charcoal/30 dark:text-white/30 text-sm mt-2">Try a different search term or category.</p>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
