import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Masonry from 'react-masonry-css';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import 'yet-another-react-lightbox/styles.css';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { galleryImages } from '../data/menuData';

const categories = ['All', 'Interior', 'Food', 'Events'];

const breakpointCols = {
  default: 3,
  1024: 2,
  640: 1,
};

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4 } },
};

const GalleryImage = memo(function GalleryImage({ image, index, onClick }) {
  const heights = ['h-[400px]', 'h-[300px]', 'h-[350px]'];
  const heightClass = heights[index % 3];

  return (
    <motion.div
      variants={fadeUp}
      layout
      className="group cursor-pointer mb-4"
      onClick={() => onClick(index)}
    >
      <div className="relative overflow-hidden rounded-2xl">
        <motion.img
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.5 }}
          src={image.src}
          alt={image.alt}
          className={`w-full object-cover ${heightClass}`}
          loading="lazy"
          style={{ backgroundColor: '#2a2a2a' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
          <div>
            <h4 className="text-white font-serif text-lg">{image.alt}</h4>
            <p className="text-gold text-sm">{image.category}</p>
          </div>
        </div>
        <div className="absolute inset-0 rounded-2xl ring-0 group-hover:ring-2 ring-gold/30 transition-all duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
});

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const filteredImages = galleryImages.filter(
    (img) => activeCategory === 'All' || img.category === activeCategory
  );

  const slides = filteredImages.map((img) => ({
    src: img.src.replace('w=600&h=400', 'w=1400&h=900'),
    alt: img.alt,
  }));

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Visual Journey
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">
                Our Gallery
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                A glimpse into the world of L'Élégance – from our stunning interiors
                to our culinary masterpieces.
              </p>
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
                    <motion.div
                      layoutId="gallery-filter"
                      className="absolute inset-0 bg-gold rounded-full"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </motion.button>
              ))}
            </div>
          </ScrollReveal>

          {/* Masonry Grid */}
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            <AnimatePresence>
              <Masonry
                breakpointCols={breakpointCols}
                className="flex -ml-4 w-auto"
                columnClassName="pl-4 bg-clip-padding"
              >
                {filteredImages.map((image, i) => (
                  <GalleryImage
                    key={image.id}
                    image={image}
                    index={i}
                    onClick={setLightboxIndex}
                  />
                ))}
              </Masonry>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* yet-another-react-lightbox */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
        plugins={[Zoom]}
        styles={{
          container: { backgroundColor: 'rgba(26, 26, 26, 0.95)' },
        }}
        zoom={{
          maxZoomPixelRatio: 3,
        }}
      />
    </PageTransition>
  );
}
