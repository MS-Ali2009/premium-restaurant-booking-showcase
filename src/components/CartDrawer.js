import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCartStore } from '../store/cartStore';
import { useLocationStore } from '../store/locationStore';
import { useAuthStore } from '../store/authStore';
import { useBooking } from '../context/BookingContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

const checkoutSchema = yup.object({
  tableNumber: yup.string().required('Table number is required').matches(/^\d+$/, 'Must be a valid number'),
  name: yup.string().required('Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup.string().required('Email is required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
  phone: yup.string().required('Phone number is required').min(6, 'Please enter a valid phone number'),
  notes: yup.string().max(200),
});

export default function CartDrawer() {
  const { cart, isOpen, closeCart, updateQuantity, removeFromCart, getTotals, clearCart } = useCartStore();
  const { selectedLocation, formatPrice } = useLocationStore();
  const { currentUser } = useAuthStore();
  const { createBooking } = useBooking();
  const [step, setStep] = useState(1); // 1: Cart, 2: Checkout, 3: Success
  const [placedOrder, setPlacedOrder] = useState(null);

  const rate = selectedLocation ? selectedLocation.rate : 1.0;
  const { subtotal, tax, total } = getTotals(rate);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      tableNumber: '',
      name: '',
      email: '',
      phone: '',
      notes: '',
    },
  });

  // Prefill details if user is logged in
  useEffect(() => {
    if (currentUser) {
      setValue('name', currentUser.name);
      setValue('email', currentUser.email);
    }
  }, [currentUser, setValue, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      // Reset step and state on close
      const timer = setTimeout(() => {
        setStep(1);
        setPlacedOrder(null);
        reset();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, reset]);

  // Prevent scroll behind drawer
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const onCheckoutSubmit = (data) => {
    const orderItemsSummary = cart.map(item => {
      const tags = item.dish.customizations?.preferences?.join(', ');
      const note = item.dish.customizations?.instructions;
      return `${item.quantity}x ${item.dish.name}${tags ? ` (${tags})` : ''}${note ? ` [Note: ${note}]` : ''}`;
    }).join(', ');
    
    // Create reservation object
    const bookingData = {
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      guests: 1, 
      specialRequests: `Order: [${orderItemsSummary}]. Notes: ${data.notes || 'None'}. Table: ${data.tableNumber}`,
      customerName: data.name,
      customerEmail: data.email,
      customerPhone: data.phone,
      isOrder: true, 
      orderItems: cart,
      orderTotal: total,
    };

    const booking = createBooking(bookingData);
    setPlacedOrder(booking);
    clearCart();
    setStep(3);

    toast.success('Your culinary order is in the kitchen!', {
      style: {
        background: '#1A1A1A',
        color: '#E8D5A3',
        border: '1px solid rgba(201, 169, 110, 0.3)',
      },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-charcoal/80 backdrop-blur-md"
            onClick={closeCart}
          />

          {/* Drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="w-screen max-w-md bg-white dark:bg-dark-card border-l border-charcoal/10 dark:border-white/10 flex flex-col shadow-luxury"
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-charcoal/10 dark:border-white/10 flex items-center justify-between">
                <h2 className="font-serif text-2xl font-bold text-charcoal dark:text-white">
                  {step === 1 && 'Shopping Cart'}
                  {step === 2 && 'Checkout Details'}
                  {step === 3 && 'Order Placed'}
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2.5 rounded-full hover:bg-charcoal/10 dark:hover:bg-white/10 text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors focus:outline-none"
                  aria-label="Close cart"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Step 1: Cart Items */}
              {step === 1 && (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-60">
                        <svg className="w-16 h-16 text-gold/30 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <p className="font-serif text-lg text-charcoal dark:text-white mb-1.5 font-bold">Your cart is empty</p>
                        <p className="text-xs text-charcoal/50 dark:text-white/40 max-w-xs mx-auto leading-relaxed">
                          Explore our signature menu and add items to begin your dining experience.
                        </p>
                      </div>
                    ) : (
                      cart.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-4 bg-cream/20 dark:bg-charcoal/20 border border-charcoal/10 dark:border-white/5 p-3.5 rounded-2xl relative"
                        >
                          <img
                            src={item.dish.image}
                            alt={item.dish.name}
                            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-serif font-bold text-charcoal dark:text-white truncate">
                              {item.dish.name}
                            </h4>
                            {item.dish.customizations?.preferences?.length > 0 && (
                              <p className="text-[10px] text-gold/80 font-medium truncate mt-0.5">
                                {item.dish.customizations.preferences.join(', ')}
                              </p>
                            )}
                            {item.dish.customizations?.instructions && (
                              <p className="text-[10px] text-charcoal/40 dark:text-white/40 italic truncate mt-0.5">
                                "{item.dish.customizations.instructions}"
                              </p>
                            )}
                            <p className="text-gold text-xs font-semibold mt-1">
                              {formatPrice(item.dish.price)}
                            </p>
                            
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-3 bg-cream dark:bg-charcoal border border-charcoal/10 dark:border-white/10 px-3 py-1 rounded-full w-fit mt-2.5">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="text-xs text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors font-bold"
                                aria-label="Decrease quantity"
                              >
                                –
                              </button>
                              <span className="text-xs text-charcoal dark:text-white font-bold min-w-[14px] text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="text-xs text-charcoal/60 dark:text-white/60 hover:text-gold transition-colors font-bold"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-400/60 hover:text-red-400 p-2 focus:outline-none transition-colors"
                            aria-label="Remove item"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {cart.length > 0 && (
                    <div className="p-6 border-t border-charcoal/10 dark:border-white/10 bg-cream/10 dark:bg-charcoal/10">
                      <div className="space-y-2.5 mb-5 text-sm text-charcoal/70 dark:text-white/70">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span className="font-semibold text-charcoal dark:text-white">{formatPrice(subtotal / rate)}</span>
                        </div>
                        <div className="flex justify-between text-xs opacity-80">
                          <span>Service Charge & Tax (10%)</span>
                          <span>{formatPrice(tax / rate)}</span>
                        </div>
                        <div className="flex justify-between border-t border-charcoal/15 dark:border-white/15 pt-3.5 text-lg font-serif font-extrabold text-charcoal dark:text-white">
                          <span>Total Amount</span>
                          <span className="text-gold">{formatPrice(total / rate)}</span>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setStep(2)}
                        className="btn-primary w-full py-4 text-sm flex justify-center items-center gap-2"
                      >
                        Proceed to Checkout
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </motion.button>
                    </div>
                  )}
                </>
              )}

              {/* Step 2: Checkout Form */}
              {step === 2 && (
                <form onSubmit={handleSubmit(onCheckoutSubmit)} className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-white/40 mb-1.5">
                        Table / Suite Number
                      </label>
                      <input
                        type="text"
                        {...register('tableNumber')}
                        placeholder="e.g. 5"
                        className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 text-sm"
                      />
                      {errors.tableNumber && (
                        <p className="text-red-400 text-xs mt-1">{errors.tableNumber.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-white/40 mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 text-sm"
                      />
                      {errors.name && (
                        <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-white/40 mb-1.5">
                        Email Address
                      </label>
                      <input
                        type="email"
                        {...register('email')}
                        placeholder="john@example.com"
                        className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 text-sm"
                      />
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-white/40 mb-1.5">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        {...register('phone')}
                        placeholder="+1 (555) 0199"
                        className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 text-sm"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-charcoal/50 dark:text-white/40 mb-1.5">
                        Special Prep Requests
                      </label>
                      <textarea
                        rows={3}
                        {...register('notes')}
                        placeholder="e.g. Allergies, service preferences, extra condiments, etc."
                        className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 text-sm resize-none"
                      />
                      {errors.notes && (
                        <p className="text-red-400 text-xs mt-1">{errors.notes.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Pricing and Submit */}
                  <div className="p-6 border-t border-charcoal/10 dark:border-white/10 bg-cream/10 dark:bg-charcoal/10 space-y-4">
                    <div className="flex justify-between items-center text-lg font-serif font-extrabold text-charcoal dark:text-white">
                      <span>Total</span>
                      <span className="text-gold">{formatPrice(total / rate)}</span>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setStep(1)}
                        className="btn-secondary flex-1 py-3 text-sm flex justify-center items-center font-bold"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn-primary flex-1 py-3 text-sm flex justify-center items-center font-bold"
                      >
                        Place Order
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Step 3: Success screen */}
              {step === 3 && placedOrder && (
                <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 15 }}
                    className="w-20 h-20 rounded-full bg-gold/10 text-gold flex items-center justify-center mb-6"
                  >
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>

                  <h3 className="font-serif text-3xl font-bold text-charcoal dark:text-white mb-2">
                    Order Transmitted!
                  </h3>
                  <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6 max-w-xs leading-relaxed">
                    Your table culinary request has been received by our head chef. Preparation has begun.
                  </p>

                  <div className="w-full bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-2xl p-5 mb-8 text-left space-y-3">
                    <div className="flex justify-between text-xs text-charcoal/50 dark:text-white/50">
                      <span>Reference ID</span>
                      <span className="font-mono text-charcoal dark:text-white font-bold select-all">{placedOrder.id.slice(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-xs text-charcoal/50 dark:text-white/50">
                      <span>Time Received</span>
                      <span className="font-semibold text-charcoal dark:text-white">{placedOrder.time}</span>
                    </div>
                    <div className="flex justify-between text-xs text-charcoal/50 dark:text-white/50">
                      <span>Customer</span>
                      <span className="font-semibold text-charcoal dark:text-white">{placedOrder.customerName}</span>
                    </div>
                    <div className="flex justify-between text-xs text-charcoal/50 dark:text-white/50 border-t border-charcoal/10 dark:border-white/10 pt-3">
                      <span>Amount Billed</span>
                      <span className="font-serif text-base font-extrabold text-gold">{formatPrice(placedOrder.orderTotal / rate)}</span>
                    </div>
                  </div>

                  <button
                    onClick={closeCart}
                    className="btn-primary w-full py-4 text-sm font-bold"
                  >
                    Return to Menu
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
