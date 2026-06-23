import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { useBooking } from '../context/BookingContext';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const steps = ['Date & Time', 'Details', 'Contact'];

const step1Schema = yup.object({
  date: yup.string().required('Please select a date'),
  time: yup.string().required('Please select a time'),
});

const step2Schema = yup.object({
  guests: yup.number().min(1, 'At least 1 guest').max(12, 'Maximum 12 guests').required('Required'),
  tableNumber: yup.number().nullable(),
  specialRequests: yup.string(),
});

const step3Schema = yup.object({
  customerName: yup.string().required('Name is required').min(2, 'Name too short'),
  customerEmail: yup.string().email('Invalid email').required('Email is required'),
  customerPhone: yup.string().required('Phone is required').min(8, 'Phone too short'),
});

const schemas = [step1Schema, step2Schema, step3Schema];

function TimeSlot({ time, available, isFull, isSelected, onClick }) {
  return (
    <motion.button
      type="button"
      whileHover={{ scale: isFull ? 1 : 1.05 }}
      whileTap={{ scale: isFull ? 1 : 0.95 }}
      onClick={() => !isFull && onClick(time)}
      disabled={isFull}
      className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
        isSelected
          ? 'bg-gold text-charcoal shadow-lg shadow-gold/30'
          : isFull
          ? 'bg-red-900/20 text-red-400/50 border border-red-900/30 cursor-not-allowed'
          : 'bg-white dark:bg-dark-card text-charcoal/70 dark:text-white/70 border border-charcoal/10 dark:border-white/10 hover:border-gold/30 hover:text-gold'
      }`}
    >
      <div>{time}</div>
      <div className={`text-xs mt-1 ${isFull ? 'text-red-400/50' : isSelected ? 'text-charcoal/70' : 'text-charcoal/40 dark:text-white/40'}`}>
        {isFull ? 'Full' : `${available} left`}
      </div>
    </motion.button>
  );
}

function TableSelection({ selectedTable, onSelect }) {
  const tables = Array.from({ length: 16 }, (_, i) => i + 1);

  return (
    <div>
      <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-3">Select a Table (Optional)</label>
      <div className="grid grid-cols-4 gap-3 p-4 bg-cream/50 dark:bg-charcoal/30 rounded-2xl border border-charcoal/5 dark:border-white/5">
        {tables.map((num) => (
          <motion.button
            key={num}
            type="button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onSelect(selectedTable === num ? null : num)}
            className={`w-full aspect-square rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
              selectedTable === num
                ? 'bg-gold text-charcoal ring-4 ring-gold/30 shadow-lg shadow-gold/20'
                : 'bg-white dark:bg-dark-card text-charcoal/60 dark:text-white/60 border border-charcoal/10 dark:border-white/10 hover:border-gold/40'
            }`}
          >
            {num}
          </motion.button>
        ))}
      </div>
      <p className="text-charcoal/40 dark:text-white/40 text-xs mt-2">
        {selectedTable ? `Table ${selectedTable} selected` : 'Tap a table to select your preferred spot'}
      </p>
    </div>
  );
}

function SuccessModal({ booking, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 200 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white dark:bg-dark-card border border-gold/20 rounded-3xl p-8 max-w-md w-full text-center"
      >
        {/* Success icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center"
        >
          <motion.svg
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </motion.svg>
        </motion.div>

        <h3 className="font-serif text-2xl text-charcoal dark:text-white mb-2">Reservation Confirmed!</h3>
        <p className="text-charcoal/60 dark:text-white/60 text-sm mb-6">
          Your table has been reserved. Show this QR code upon arrival.
        </p>

        {/* Booking Details */}
        <div className="bg-cream dark:bg-charcoal/50 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/50 dark:text-white/50">Reference</span>
            <span className="text-gold font-mono text-xs">{booking.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/50 dark:text-white/50">Date</span>
            <span className="text-charcoal dark:text-white">{booking.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/50 dark:text-white/50">Time</span>
            <span className="text-charcoal dark:text-white">{booking.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/50 dark:text-white/50">Guests</span>
            <span className="text-charcoal dark:text-white">{booking.guests}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-charcoal/50 dark:text-white/50">Name</span>
            <span className="text-charcoal dark:text-white">{booking.customerName}</span>
          </div>
        </div>

        {/* QR Code */}
        <div className="bg-white p-4 rounded-xl inline-block mb-6">
          <QRCodeSVG value={booking.id} size={160} level="H" />
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClose}
          className="btn-primary w-full"
        >
          Done
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

export default function Booking() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [completedBooking, setCompletedBooking] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const { createBooking, getAvailability } = useBooking();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schemas[currentStep]),
    mode: 'onChange',
  });

  const selectedDate = watch('date');
  const selectedTime = watch('time');

  const availability = selectedDate ? getAvailability(selectedDate) : {};

  const getTodayStr = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const onNext = useCallback(async (data) => {
    const merged = { ...formData, ...data, tableNumber: selectedTable };
    setFormData(merged);

    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    } else {
      const booking = createBooking(merged);
      setCompletedBooking(booking);
      toast.success('Reservation confirmed!', {
        style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201,169,110,0.3)' },
        iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
      });
    }
  }, [currentStep, formData, selectedTable, createBooking]);

  const onPrev = () => {
    if (currentStep > 0) setCurrentStep((prev) => prev - 1);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Experience Awaits
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-4">
                Book a Table
              </h1>
            </div>
          </ScrollReveal>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              {steps.map((step, i) => (
                <div key={step} className="flex items-center">
                  <motion.div
                    animate={{
                      scale: i === currentStep ? 1.1 : 1,
                      backgroundColor: i <= currentStep ? '#C9A96E' : '#2A2A2A',
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 border-gold/30"
                  >
                    <span className={i <= currentStep ? 'text-charcoal' : 'text-charcoal/50 dark:text-white/50'}>
                      {i < currentStep ? '✓' : i + 1}
                    </span>
                  </motion.div>
                  {i < steps.length - 1 && (
                    <div className="hidden sm:block w-20 lg:w-32 h-0.5 mx-2">
                      <motion.div
                        animate={{ scaleX: i < currentStep ? 1 : 0 }}
                        className="h-full bg-gold origin-left"
                      />
                      <div className="h-full bg-white/10 -mt-0.5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between px-1">
              {steps.map((step, i) => (
                <span
                  key={step}
                  className={`text-xs ${
                    i === currentStep ? 'text-gold' : 'text-charcoal/40 dark:text-white/40'
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>

          {/* Form Steps */}
          <form onSubmit={handleSubmit(onNext)}>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Date Input */}
                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Select Date</label>
                    <input
                      type="date"
                      min={getTodayStr()}
                      {...register('date')}
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.date && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.date.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Time Slots */}
                  {selectedDate && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-3">Select Time</label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                        {Object.entries(availability).map(([time, slot]) => (
                          <TimeSlot
                            key={time}
                            time={time}
                            available={slot.available}
                            isFull={slot.isFull}
                            isSelected={selectedTime === time}
                            onClick={(t) => setValue('time', t, { shouldValidate: true })}
                          />
                        ))}
                      </div>
                      <input type="hidden" {...register('time')} />
                      {errors.time && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-400 text-sm mt-2"
                        >
                          {errors.time.message}
                        </motion.p>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {currentStep === 1 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Number of Guests</label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      defaultValue={formData.guests || 2}
                      {...register('guests')}
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.guests && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.guests.message}
                      </motion.p>
                    )}
                  </div>

                  {/* Interactive Table Selection */}
                  <TableSelection
                    selectedTable={selectedTable}
                    onSelect={setSelectedTable}
                  />

                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Special Requests</label>
                    <textarea
                      rows={4}
                      defaultValue={formData.specialRequests || ''}
                      {...register('specialRequests')}
                      placeholder="Window seat, birthday celebration, dietary requirements..."
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all resize-none"
                    />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={formData.customerName || ''}
                      {...register('customerName')}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.customerName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.customerName.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={formData.customerEmail || ''}
                      {...register('customerEmail')}
                      placeholder="john@email.com"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.customerEmail && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.customerEmail.message}
                      </motion.p>
                    )}
                  </div>

                  <div>
                    <label className="block text-charcoal/70 dark:text-white/70 text-sm mb-2">Phone</label>
                    <input
                      type="tel"
                      defaultValue={formData.customerPhone || ''}
                      {...register('customerPhone')}
                      placeholder="+1 234 567 890"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.customerPhone && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-2"
                      >
                        {errors.customerPhone.message}
                      </motion.p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              {currentStep > 0 ? (
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onPrev}
                  className="px-6 py-3 text-charcoal/70 dark:text-white/70 hover:text-charcoal dark:hover:text-white border border-charcoal/20 dark:border-white/20 rounded-full transition-colors"
                >
                  Back
                </motion.button>
              ) : (
                <div />
              )}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary"
              >
                {currentStep === 2 ? 'Confirm Reservation' : 'Next'}
              </motion.button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {completedBooking && (
          <SuccessModal
            booking={completedBooking}
            onClose={() => setCompletedBooking(null)}
          />
        )}
      </AnimatePresence>
    </PageTransition>
  );
}
