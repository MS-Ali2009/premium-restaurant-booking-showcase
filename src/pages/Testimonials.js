import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { testimonials as seedTestimonials } from '../data/menuData';

const STORAGE_KEY = 'luxury_restaurant_testimonials';

function getStoredTestimonials() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

const feedbackSchema = yup.object({
  name: yup.string().required('Name is required').min(2),
  rating: yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
  message: yup.string().required('Feedback is required').min(20, 'Please share a little more (min 20 chars)'),
});

function StarSelector({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className={`text-3xl transition-all duration-150 ${(hovered || value) >= star ? 'text-gold scale-110' : 'text-charcoal/20 dark:text-white/20'}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [userTestimonials, setUserTestimonials] = useState(getStoredTestimonials);
  const [ratingFilter, setRatingFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  const allTestimonials = useMemo(() => {
    const seed = seedTestimonials.map((t) => ({
      ...t,
      date: '2025-01-01',
      isSeeded: true,
    }));
    return [...seed, ...userTestimonials];
  }, [userTestimonials]);

  const filtered = useMemo(() => {
    let list = [...allTestimonials];
    if (ratingFilter !== 'all') {
      list = list.filter((t) => t.rating === Number(ratingFilter));
    }
    if (sortOrder === 'latest') {
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
    }
    return list;
  }, [allTestimonials, ratingFilter, sortOrder]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(feedbackSchema),
    defaultValues: { name: '', rating: 0, message: '' },
  });

  const ratingValue = watch('rating');

  const onSubmit = async (data) => {
    await new Promise((r) => setTimeout(r, 1000));
    const newEntry = {
      id: Date.now(),
      name: data.name,
      rating: data.rating,
      text: data.message,
      date: new Date().toISOString().split('T')[0],
      role: 'Guest',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=C9A96E&color=1A1A1A&bold=true`,
    };
    const updated = [...userTestimonials, newEntry];
    setUserTestimonials(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    toast.success('Thank you for your feedback!', {
      style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
    });
    reset();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-16">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Guest Voices</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">Testimonials</h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto">
                Hear what our guests say about their experience at L'Élégance, and share your own story below.
              </p>
            </div>
          </ScrollReveal>

          {/* Submission Form */}
          <ScrollReveal>
            <div className="max-w-2xl mx-auto mb-20 p-8 bg-white dark:bg-dark-card rounded-3xl border border-charcoal/10 dark:border-white/5 shadow-xl">
              <h2 className="font-serif text-2xl text-charcoal dark:text-white font-bold mb-1">Share Your Experience</h2>
              <p className="text-charcoal/50 dark:text-white/50 text-sm mb-6">Your feedback helps us continuously raise the standard of excellence.</p>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 dark:text-white/50 mb-1">Your Name</label>
                  <input type="text" {...register('name')} placeholder="e.g. Victoria Ashworth"
                    className="w-full px-5 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 dark:text-white/50 mb-2">Your Rating</label>
                  <input type="hidden" {...register('rating', { valueAsNumber: true })} />
                  <StarSelector value={ratingValue} onChange={(val) => setValue('rating', val, { shouldValidate: true })} />
                  {errors.rating && <p className="text-red-400 text-xs mt-1">{errors.rating.message}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/50 dark:text-white/50 mb-1">Your Feedback</label>
                  <textarea rows={5} {...register('message')} placeholder="Tell us about your dining experience..."
                    className="w-full px-5 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all resize-none" />
                  {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isSubmitting} className="btn-primary w-full py-3.5 disabled:opacity-50">
                  {isSubmitting ? 'Submitting...' : 'Submit Testimonial'}
                </motion.button>
              </form>
            </div>
          </ScrollReveal>

          {/* Filters */}
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
              <div className="flex flex-wrap gap-2">
                {['all', '5', '4', '3', '2', '1'].map((r) => (
                  <button
                    key={r}
                    onClick={() => setRatingFilter(r)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      ratingFilter === r
                        ? 'bg-gold text-charcoal shadow-md'
                        : 'bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 text-charcoal/70 dark:text-white/70 hover:border-gold/50'
                    }`}
                  >
                    {r === 'all' ? 'All Ratings' : `${r} ★`}
                  </button>
                ))}
              </div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2.5 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-full text-sm text-charcoal dark:text-white focus:outline-none focus:border-gold/50 cursor-pointer"
              >
                <option value="latest">Latest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </ScrollReveal>

          {/* Testimonials List */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-charcoal/40 dark:text-white/40">
              <p className="font-serif text-xl mb-2">No reviews for this rating yet.</p>
              <p className="text-sm">Be the first to leave your feedback above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <AnimatePresence>
                {filtered.map((t, i) => (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: i * 0.04 }}
                    whileHover={{ y: -4 }}
                    className="p-7 bg-white dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-white/5 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/30" />
                        <div>
                          <h4 className="text-charcoal dark:text-white font-semibold text-sm">{t.name}</h4>
                          <p className="text-charcoal/40 dark:text-white/40 text-xs">{t.role || 'Guest'}</p>
                        </div>
                      </div>
                      <span className="text-xs text-charcoal/30 dark:text-white/30">
                        {new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex gap-0.5 mb-3">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <span key={s} className={s <= t.rating ? 'text-gold text-sm' : 'text-charcoal/20 dark:text-white/20 text-sm'}>★</span>
                      ))}
                    </div>
                    <p className="text-charcoal/70 dark:text-white/70 text-sm leading-relaxed italic">"{t.text}"</p>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
