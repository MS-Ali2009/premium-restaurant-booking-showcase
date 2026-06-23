import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';

const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2),
  email: yup.string().email('Invalid email').required('Email is required'),
  message: yup.string().required('Message is required').min(10, 'Message too short'),
});

const timeline = [
  { year: '1999', title: 'The Beginning', description: 'Chef Laurent opens the doors to L\'Élégance in the heart of Paris.' },
  { year: '2003', title: 'First Star', description: 'Awarded our first Michelin star within four years of opening.' },
  { year: '2008', title: 'Second Star', description: 'Recognized for our innovative seasonal tasting menu and wine program.' },
  { year: '2012', title: 'Global Recognition', description: 'Named in the World\'s 50 Best Restaurants list.' },
  { year: '2016', title: 'Third Star', description: 'Achieved the coveted third Michelin star – the highest honor in gastronomy.' },
  { year: '2024', title: 'New Chapter', description: 'Unveiled our redesigned dining space and introduced the Chef\'s Table experience.' },
];

export default function About() {
  const [sending, setSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ resolver: yupResolver(contactSchema) });

  const onSubmit = async (data) => {
    setSending(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success('Message sent! We\'ll get back to you shortly.', {
      style: {
        background: '#2A2A2A',
        color: '#fff',
        border: '1px solid rgba(201, 169, 110, 0.3)',
      },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
    });
    reset();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        {/* Hero */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Our Story
              </p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-6">
                About L'Élégance
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-3xl mx-auto text-lg leading-relaxed">
                For over two decades, L'Élégance has been a beacon of culinary excellence.
                Founded on the belief that dining should be an art form, we craft each experience
                to be as memorable as it is delicious.
              </p>
            </div>
          </ScrollReveal>

          {/* Chef Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
            <ScrollReveal direction="left">
              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="aspect-[3/4] rounded-3xl overflow-hidden"
                >
                  <img
                    src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=600&h=800&fit=crop"
                    alt="Chef Laurent Dubois"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </motion.div>
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -bottom-6 -right-6 bg-gold text-charcoal p-6 rounded-2xl shadow-2xl"
                >
                  <p className="font-serif text-3xl font-bold">25+</p>
                  <p className="text-sm">Years of Excellence</p>
                </motion.div>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">
                Master of Flavour
              </p>
              <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold mb-6">
                Chef Laurent Dubois
              </h2>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-4">
                Born in Lyon, France, Chef Laurent's journey began in his grandmother's
                kitchen. His passion for transforming the finest ingredients into works of
                art led him to train under Paul Bocuse and Alain Ducasse before opening
                L'Élégance in 1999.
              </p>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-4">
                His culinary philosophy harmonizes French classical technique with global
                influences, resulting in dishes that surprise and delight even the most
                seasoned palates.
              </p>
              <p className="text-charcoal/60 dark:text-white/60 leading-relaxed">
                "Food is not just sustenance – it is poetry on a plate. Every ingredient
                has a story, every dish an emotion. My role is to be the narrator."
              </p>
            </ScrollReveal>
          </div>

          {/* Timeline */}
          <div className="mb-32">
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-gold tracking-widest uppercase text-sm mb-3">
                  Our Journey
                </p>
                <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold">
                  A Legacy of Excellence
                </h2>
              </div>
            </ScrollReveal>

            <div className="relative">
              {/* Center line */}
              <motion.div
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="absolute left-1/2 -translate-x-0.5 top-0 bottom-0 w-px bg-gold/20 hidden md:block origin-top"
              />

              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.6, delay: i * 0.15 }}
                >
                  <div className={`flex items-center mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                    <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                      <motion.div
                        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(201, 169, 110, 0.15)' }}
                        className="bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-2xl p-6 inline-block"
                      >
                        <span className="text-gold font-serif text-2xl font-bold">{item.year}</span>
                        <h3 className="text-charcoal dark:text-white font-medium text-lg mt-1">{item.title}</h3>
                        <p className="text-charcoal/50 dark:text-white/50 text-sm mt-2">{item.description}</p>
                      </motion.div>
                    </div>
                    {/* Center dot with pulse animation */}
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.15 + 0.3, type: 'spring', stiffness: 300 }}
                      className="hidden md:flex w-5 h-5 rounded-full bg-gold shadow-lg shadow-gold/30 relative z-10 flex-shrink-0"
                    />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Contact Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ScrollReveal direction="left">
              <div>
                <p className="text-gold tracking-widest uppercase text-sm mb-3">
                  Get in Touch
                </p>
                <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold mb-6">
                  Contact Us
                </h2>
                <p className="text-charcoal/60 dark:text-white/60 leading-relaxed mb-8">
                  We'd love to hear from you. Whether it's a question about our menu,
                  a private event inquiry, or feedback on your experience.
                </p>

                {/* Contact Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      {...register('name')}
                      placeholder="Your Name"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.name.message}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <input
                      type="email"
                      {...register('email')}
                      placeholder="Your Email"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all"
                    />
                    {errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.email.message}
                      </motion.p>
                    )}
                  </div>
                  <div>
                    <textarea
                      rows={5}
                      {...register('message')}
                      placeholder="Your Message"
                      className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all resize-none"
                    />
                    {errors.message && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-400 text-sm mt-1"
                      >
                        {errors.message.message}
                      </motion.p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={sending}
                    className="btn-primary w-full disabled:opacity-50"
                  >
                    {sending ? 'Sending...' : 'Send Message'}
                  </motion.button>
                </form>
              </div>
            </ScrollReveal>

            {/* Map */}
            <ScrollReveal direction="right">
              <div className="h-full min-h-[400px] rounded-3xl overflow-hidden border border-charcoal/10 dark:border-white/5">
                <iframe
                  title="Restaurant Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3364881!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sen!2sfr!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
