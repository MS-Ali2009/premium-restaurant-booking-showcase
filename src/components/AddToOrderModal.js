import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useLocationStore } from '../store/locationStore';
import toast from 'react-hot-toast';

export default function AddToOrderModal() {
  const { isAddModalOpen, activeDish, closeAddModal, addToCart } = useCartStore();
  const { formatPrice } = useLocationStore();
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [selectedDietary, setSelectedDietary] = useState([]);

  useEffect(() => {
    if (isAddModalOpen) {
      setQuantity(1);
      setSpecialInstructions('');
      setSelectedDietary([]);
    }
  }, [isAddModalOpen]);

  if (!activeDish) return null;

  // Add mock tags based on dish name/category
  const dietaryTags = activeDish.price > 80 
    ? ['Chef\'s Signature', 'Prestige Cut', 'Contains Dairy'] 
    : activeDish.category === 'Desserts' 
    ? ['Vegetarian', 'Contains Dairy', 'Award Winning'] 
    : ['Gluten Free Option', 'Locally Sourced', 'Organic'];

  const toggleDietary = (tag) => {
    setSelectedDietary(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleAddToCart = () => {
    const customizedDish = {
      ...activeDish,
      customizations: {
        instructions: specialInstructions,
        preferences: selectedDietary
      }
    };
    addToCart(customizedDish, quantity);
    closeAddModal();
    toast.success(`${quantity}x ${activeDish.name} added to order!`, {
      style: {
        background: '#1A1A1A',
        color: '#E8D5A3',
        border: '1px solid rgba(201, 169, 110, 0.3)',
      },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
    });
  };

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  return (
    <AnimatePresence>
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-md">
          {/* Backdrop click close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            onClick={closeAddModal}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="relative max-w-lg w-full bg-white dark:bg-dark-card rounded-[2.5rem] overflow-hidden border border-charcoal/10 dark:border-white/5 shadow-luxury z-10"
          >
            {/* Header/Image */}
            <div className="h-72 overflow-hidden relative">
              <img
                src={activeDish.image}
                alt={activeDish.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/30 to-transparent" />
              
              <button
                onClick={closeAddModal}
                className="absolute top-6 right-6 w-11 h-11 rounded-full bg-charcoal/70 dark:bg-black/40 text-white flex items-center justify-center hover:bg-gold hover:text-charcoal transition-all duration-300 shadow-lg border border-white/10"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="absolute bottom-6 left-6 right-6">
                <span className="badge-gold mb-2 text-[10px] tracking-widest uppercase font-bold">
                  {activeDish.category}
                </span>
                <h3 className="font-serif text-3xl text-white font-bold leading-tight">
                  {activeDish.name}
                </h3>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <p className="text-charcoal/75 dark:text-white/70 text-sm leading-relaxed mb-6">
                {activeDish.description}
              </p>

              {/* Preferences Selection */}
              <div className="mb-6">
                <p className="text-xs text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold mb-3">
                  Dietary Preferences & Options
                </p>
                <div className="flex flex-wrap gap-2">
                  {dietaryTags.map((tag) => {
                    const isSelected = selectedDietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleDietary(tag)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                          isSelected
                            ? 'bg-gold text-charcoal border-gold shadow-md'
                            : 'bg-cream/40 dark:bg-charcoal/40 text-charcoal/75 dark:text-white/70 border-charcoal/10 dark:border-white/10 hover:border-gold/50'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Instructions */}
              <div className="mb-6">
                <p className="text-xs text-charcoal/50 dark:text-white/40 uppercase tracking-widest font-semibold mb-2">
                  Chef Instructions (Allergies/Preferences)
                </p>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g., No onions, dressing on the side, etc."
                  className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-xs text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all"
                />
              </div>

              <div className="flex items-center justify-between border-t border-charcoal/10 dark:border-white/10 pt-6 mb-6">
                <div>
                  <p className="text-[10px] text-charcoal/40 dark:text-white/40 uppercase tracking-widest mb-1">
                    Price per item
                  </p>
                  <p className="text-gold font-serif text-2xl font-bold">
                    {formatPrice(activeDish.price)}
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-5 bg-cream/50 dark:bg-charcoal/50 border border-charcoal/15 dark:border-white/15 px-4.5 py-2.5 rounded-full shadow-inner">
                  <button
                    onClick={handleDecrement}
                    className="w-7 h-7 flex items-center justify-center text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors font-bold text-lg"
                    aria-label="Decrease quantity"
                  >
                    –
                  </button>
                  <span className="text-charcoal dark:text-white font-bold min-w-[24px] text-center text-base">
                    {quantity}
                  </span>
                  <button
                    onClick={handleIncrement}
                    className="w-7 h-7 flex items-center justify-center text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors font-bold text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Total & Action Button */}
              <div className="flex items-center justify-between gap-5">
                <div className="flex-1">
                  <p className="text-[10px] text-charcoal/40 dark:text-white/40 uppercase tracking-widest mb-1">
                    Total
                  </p>
                  <p className="text-charcoal dark:text-white font-serif text-3xl font-extrabold">
                    {formatPrice(activeDish.price * quantity)}
                  </p>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="btn-primary flex-1 py-4 text-sm flex justify-center items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Confirm Order
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
