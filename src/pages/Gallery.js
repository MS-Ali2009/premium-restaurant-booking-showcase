import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { galleryImages } from '../data/menuData';
import ThreeSixtyViewer from '../components/ThreeSixtyViewer';

const categories = ['All', 'Interior', 'Food', 'Events'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  const filteredImages = useMemo(() =>
    galleryImages.filter((img) => {
      const matchCat = activeCategory === 'All' || img.category === activeCategory;
      const matchSearch = img.alt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        img.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    }), [activeCategory, searchQuery]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Visual Journey</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">Our Gallery</h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                A glimpse into the world of L'Élégance. Click any image to explore it interactively.
              </p>
            </div>
          </ScrollReveal>

          {/* Search */}
          <ScrollReveal delay={0.05}>
            <div className="max-w-md mx-auto mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by image name or category..."
                  className="w-full px-6 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-full text-charcoal dark:text-white placeholder:text-charcoal/40 dark:placeholder:text-white/40 focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40 dark:text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </ScrollReveal>

          {/* Category Filter */}
          <ScrollReveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map((cat) => (
                <motion.button
                  key={cat}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveCategory(cat)}
                  className={`relative px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'text-charcoal'
                      : 'text-charcoal/70 dark:text-white/70 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10'
                  }`}
                >
                  {activeCategory === cat && (
                    <motion.div layoutId="gallery-filter" className="absolute inset-0 bg-gold rounded-full" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Grid */}
          {filteredImages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
              <span className="text-5xl block mb-4">🖼️</span>
              <p className="font-serif text-xl text-charcoal dark:text-white mb-2">No Images Found</p>
              <p className="text-charcoal/40 dark:text-white/40 text-sm">Try a different search term or category.</p>
            </motion.div>
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredImages.map((image, i) => (
                  <motion.div
                    key={image.id}
                    layout
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.92 }}
                    transition={{ duration: 0.35, delay: i * 0.04 }}
                    className="group cursor-pointer"
                    onClick={() => setSelectedImage(image)}
                  >
                    <div className="relative overflow-hidden rounded-2xl">
                      <motion.img
                        whileHover={{ scale: 1.06 }}
                        transition={{ duration: 0.5 }}
                        src={image.src}
                        alt={image.alt}
                        className="w-full object-cover"
                        loading="lazy"
                        style={{ height: i % 3 === 0 ? '380px' : i % 3 === 1 ? '280px' : '330px' }}
                      />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                        <div className="flex items-end justify-between w-full">
                          <div>
                            <h4 className="text-white font-serif text-lg">{image.alt}</h4>
                            <p className="text-gold text-sm">{image.category}</p>
                          </div>
                          <div className="bg-gold/20 border border-gold/50 rounded-full p-2 text-white">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      {/* Border glow */}
                      <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-gold/30 transition-all duration-500 pointer-events-none" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* 360° Viewer */}
      <AnimatePresence>
        {selectedImage && <ThreeSixtyViewer image={selectedImage} onClose={() => setSelectedImage(null)} />}
      </AnimatePresence>
    </PageTransition>
  );
}
