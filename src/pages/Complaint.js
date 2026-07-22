import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const complaintCategories = [
  'Food Quality & Taste',
  'Delivery Delay / Late Delivery',
  'Missing or Incorrect Order Items',
  'Staff Behavior & Customer Service',
  'Pricing & Billing Issue',
  'Packaging / Hygiene Issue',
  'Website / App Technical Problem',
  'Other',
];

const complaintSchema = yup.object({
  name: yup.string().required('Full Name is required').min(2, 'Name must be at least 2 characters'),
  email: yup
    .string()
    .required('Email address is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address'),
  phone: yup
    .string()
    .required('Phone number is required')
    .min(7, 'Please enter a valid phone number'),
  category: yup.string().required('Please select a complaint category'),
  orderNumber: yup.string().optional(),
  message: yup
    .string()
    .required('Complaint details are required')
    .min(10, 'Please provide more details (at least 10 characters)'),
});

export default function Complaint() {
  const [submitting, setSubmitting] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(complaintSchema),
    defaultValues: {
      category: complaintCategories[0],
    },
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));

    const complaintRecord = {
      id: `CMP-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      ...data,
      status: 'Received',
    };

    // Save to localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('legance_complaints') || '[]');
      existing.unshift(complaintRecord);
      localStorage.setItem('legance_complaints', JSON.stringify(existing));
    } catch (e) {
      console.error('Failed to save complaint to localStorage', e);
    }

    setSubmitting(false);
    setSubmittedComplaint(complaintRecord);
    reset();

    toast.success('Your complaint has been submitted successfully.', {
      style: { background: '#1A1A1A', color: '#E8D5A3', border: '1px solid rgba(201, 169, 110, 0.3)' },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
      duration: 5000,
    });
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="text-gold tracking-widest uppercase text-xs font-semibold px-3 py-1 bg-gold/10 rounded-full border border-gold/20 inline-block mb-3">
                Customer Care & Support
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl text-charcoal dark:text-white font-bold mb-4">
                Submit a Complaint
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
                We strive for perfection in every detail. If your experience was anything less than exceptional, please let us know so we can resolve it immediately.
              </p>
            </div>
          </ScrollReveal>

          {/* Success Screen Modal / View */}
          <AnimatePresence>
            {submittedComplaint ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-dark-card border border-gold/30 rounded-3xl p-8 shadow-luxury text-center"
              >
                <div className="w-16 h-16 bg-gold/15 text-gold rounded-full flex items-center justify-center mx-auto mb-5 border border-gold/30">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl text-charcoal dark:text-white font-bold mb-3">
                  Complaint Received
                </h2>

                <p className="text-gold font-medium text-base mb-6">
                  Your complaint has been submitted successfully.
                </p>

                <div className="bg-cream/40 dark:bg-charcoal/40 border border-charcoal/10 dark:border-white/10 rounded-2xl p-5 mb-8 text-left space-y-2.5 max-w-md mx-auto text-sm">
                  <div className="flex justify-between items-center border-b border-charcoal/10 dark:border-white/10 pb-2">
                    <span className="text-charcoal/50 dark:text-white/50 text-xs uppercase tracking-wider">Ticket Reference</span>
                    <span className="font-mono text-gold font-bold text-sm">{submittedComplaint.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/50 dark:text-white/50">Name</span>
                    <span className="text-charcoal dark:text-white font-medium">{submittedComplaint.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-charcoal/50 dark:text-white/50">Category</span>
                    <span className="text-charcoal dark:text-white font-medium">{submittedComplaint.category}</span>
                  </div>
                  {submittedComplaint.orderNumber && (
                    <div className="flex justify-between">
                      <span className="text-charcoal/50 dark:text-white/50">Order #</span>
                      <span className="text-charcoal dark:text-white font-medium">{submittedComplaint.orderNumber}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-charcoal/50 dark:text-white/50">Submitted On</span>
                    <span className="text-charcoal dark:text-white font-medium">{new Date(submittedComplaint.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>

                <p className="text-xs text-charcoal/60 dark:text-white/60 mb-8 max-w-md mx-auto">
                  Our Guest Relations team will review your feedback and reach out to you at <strong className="text-gold">{submittedComplaint.email}</strong> within 24 hours.
                </p>

                <button
                  onClick={() => setSubmittedComplaint(null)}
                  className="btn-primary px-8 py-3.5 text-sm font-semibold rounded-full"
                >
                  Submit Another Complaint
                </button>
              </motion.div>
            ) : (
              /* Complaint Form */
              <ScrollReveal delay={0.1}>
                <div className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-3xl p-6 sm:p-10 shadow-luxury">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    
                    {/* Row 1: Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                          Your Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          {...register('name')}
                          placeholder="e.g. Sarah Jenkins"
                          className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                        />
                        {errors.name && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.name.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                          Email Address <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="email"
                          {...register('email')}
                          placeholder="sarah@example.com"
                          className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                        />
                        {errors.email && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Row 2: Phone & Order Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                          Phone Number <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="tel"
                          {...register('phone')}
                          placeholder="+1 (555) 234-5678"
                          className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                        />
                        {errors.phone && (
                          <p className="text-red-400 text-xs mt-1.5">{errors.phone.message}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                          Order Number <span className="text-charcoal/40 dark:text-white/40 font-normal">(Optional)</span>
                        </label>
                        <input
                          type="text"
                          {...register('orderNumber')}
                          placeholder="e.g. ORD-89210 or Reference ID"
                          className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                        />
                      </div>
                    </div>

                    {/* Complaint Category */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                        Complaint Category <span className="text-red-400">*</span>
                      </label>
                      <select
                        {...register('category')}
                        className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm"
                      >
                        {complaintCategories.map((cat) => (
                          <option key={cat} value={cat} className="bg-white dark:bg-charcoal text-charcoal dark:text-white">
                            {cat}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.category.message}</p>
                      )}
                    </div>

                    {/* Complaint Details */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-charcoal/70 dark:text-white/70 mb-2">
                        Complaint Details / Message <span className="text-red-400">*</span>
                      </label>
                      <textarea
                        rows={5}
                        {...register('message')}
                        placeholder="Please describe your complaint in detail (what happened, date, item, or staff member involved)..."
                        className="w-full px-4 py-3.5 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/15 dark:border-white/15 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/30 transition-all text-sm resize-none"
                      />
                      {errors.message && (
                        <p className="text-red-400 text-xs mt-1.5">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-2">
                      <motion.button
                        type="submit"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={submitting}
                        className="btn-primary w-full py-4 text-base font-semibold shadow-gold hover:shadow-gold-lg flex justify-center items-center gap-2 disabled:opacity-50"
                      >
                        {submitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-charcoal" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Submitting Complaint...
                          </>
                        ) : (
                          'Submit Complaint'
                        )}
                      </motion.button>
                    </div>

                  </form>
                </div>
              </ScrollReveal>
            )}
          </AnimatePresence>

        </div>
      </div>
    </PageTransition>
  );
}
