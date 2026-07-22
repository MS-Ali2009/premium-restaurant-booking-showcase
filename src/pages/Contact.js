import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import PageTransition from '../components/PageTransition';
import ScrollReveal from '../components/ScrollReveal';
import { useLocationStore } from '../store/locationStore';

const contactSchema = yup.object({
  name: yup.string().required('Name is required').min(2, 'Name too short'),
  email: yup
    .string()
    .required('Email is required')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
  phone: yup.string().optional(),
  message: yup.string().required('Message is required').min(10, 'Message too short'),
});

const philosophyPillars = [
  { icon: '🌿', title: 'Farm to Table', description: 'Seasonal, ethically sourced ingredients from trusted European artisans and farms.' },
  { icon: '🔥', title: 'Culinary Mastery', description: 'Decades of training manifest in every plate — precision, passion, and artistry in harmony.' },
  { icon: '🤝', title: 'Human Connection', description: 'Every meal is a celebration of togetherness, crafted to create lasting memories.' },
  { icon: '🌍', title: 'Sustainable Luxury', description: 'Responsible sourcing and minimal waste are woven into the fabric of our operations.' },
];

export default function Contact() {
  const [sending, setSending] = useState(false);
  const { selectedLocation } = useLocationStore();
  const loc = selectedLocation || {
    city: 'Paris',
    address: '42 Rue de Rivoli, 75001 Paris, France',
    phone: '+33 1 42 60 82 00',
    hours: { weekday: '18:00 – 23:00', weekend: '12:00 – 23:30' },
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.9916256937595!2d2.3364881!3d48.8583701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e2964e34e2d%3A0x8ddca9ee380ef7e0!2sTour%20Eiffel!5e0!3m2!1sen!2sfr!4v1234567890',
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm({ resolver: yupResolver(contactSchema) });

  const onSubmit = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    toast.success("Message sent! We'll get back to you shortly.", {
      style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' },
      iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' },
    });
    reset();
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-cream dark:bg-charcoal pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Hero */}
          <ScrollReveal>
            <div className="text-center mb-20">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Reach Out</p>
              <h1 className="font-serif text-5xl sm:text-6xl text-charcoal dark:text-white font-bold mb-6">
                Contact Us
              </h1>
              <p className="text-charcoal/60 dark:text-white/60 max-w-2xl mx-auto text-lg leading-relaxed">
                We'd love to hear from you. Whether it's a question about our menu, a private event enquiry, or feedback on your experience – our team is ready.
              </p>
            </div>
          </ScrollReveal>

          {/* Contact details strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
            {[
              { icon: '📍', label: 'Visit Us', value: loc.address },
              { icon: '📞', label: 'Call Us', value: loc.phone },
              { icon: '⏰', label: 'Opening Hours', value: `Mon–Thu ${loc.hours.weekday} · Fri–Sun ${loc.hours.weekend}` },
            ].map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.1}>
                <div className="text-center p-6 bg-white dark:bg-dark-card rounded-2xl border border-charcoal/10 dark:border-white/5">
                  <span className="text-3xl block mb-3">{item.icon}</span>
                  <p className="text-gold text-xs uppercase tracking-widest mb-2">{item.label}</p>
                  <p className="text-charcoal dark:text-white text-sm font-medium">{item.value}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>

          {/* Complaint Banner */}
          <ScrollReveal delay={0.3}>
            <div className="mb-20 p-6 sm:p-8 bg-gradient-to-r from-gold/15 via-gold/5 to-transparent border border-gold/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="font-serif text-xl sm:text-2xl text-charcoal dark:text-white font-bold mb-2">
                  Have a Concern or Complaint?
                </h3>
                <p className="text-charcoal/70 dark:text-white/70 text-sm max-w-xl leading-relaxed">
                  Our Guest Relations department takes all feedback seriously. Submit a complaint ticket and our team will get back to you within 24 hours.
                </p>
              </div>
              <Link to="/complaint">
                <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} className="btn-primary text-sm px-6 py-3 font-semibold whitespace-nowrap shadow-gold">
                  Submit a Complaint
                </motion.button>
              </Link>
            </div>
          </ScrollReveal>

          {/* Contact Form + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
            <ScrollReveal direction="left">
              <p className="text-gold tracking-widest uppercase text-sm mb-3">Send a Message</p>
              <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold mb-8">Get in Touch</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <input type="text" {...register('name')} placeholder="Your Name"
                    className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all" />
                  {errors.name && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.name.message}</motion.p>}
                </div>
                <div>
                  <input type="email" {...register('email')} placeholder="Your Email"
                    className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all" />
                  {errors.email && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.email.message}</motion.p>}
                </div>
                <div>
                  <input type="text" {...register('phone')} placeholder="Phone Number (optional)"
                    className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all" />
                </div>
                <div>
                  <textarea rows={5} {...register('message')} placeholder="Your Message"
                    className="w-full px-5 py-4 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white placeholder:text-charcoal/30 dark:placeholder:text-white/30 focus:outline-none focus:border-gold/50 transition-all resize-none" />
                  {errors.message && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-400 text-sm mt-1">{errors.message.message}</motion.p>}
                </div>
                <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={sending} className="btn-primary w-full disabled:opacity-50">
                  {sending ? 'Sending...' : 'Send Message'}
                </motion.button>
              </form>
            </ScrollReveal>

            {/* Map */}
            <ScrollReveal direction="right">
              <div className="h-full min-h-[500px] rounded-3xl overflow-hidden border border-charcoal/10 dark:border-white/5">
                <iframe
                  title="Restaurant Location"
                  src={loc.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.9) contrast(1.1)', minHeight: 500 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </ScrollReveal>
          </div>

          {/* Our Philosophy */}
          <div>
            <ScrollReveal>
              <div className="text-center mb-16">
                <p className="text-gold tracking-widest uppercase text-sm mb-3">What We Stand For</p>
                <h2 className="font-serif text-4xl text-charcoal dark:text-white font-bold">Our Philosophy</h2>
                <p className="text-charcoal/50 dark:text-white/50 mt-4 max-w-xl mx-auto">
                  Every decision we make — from sourcing to service — is guided by a set of core values that define who we are.
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {philosophyPillars.map((pillar, i) => (
                <ScrollReveal key={pillar.title} delay={i * 0.1}>
                  <motion.div whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(201,169,110,0.1)' }} className="p-7 bg-white dark:bg-dark-card border border-charcoal/10 dark:border-white/5 rounded-2xl text-center">
                    <span className="text-4xl mb-4 block">{pillar.icon}</span>
                    <h3 className="font-serif text-lg text-charcoal dark:text-white font-bold mb-3">{pillar.title}</h3>
                    <p className="text-charcoal/60 dark:text-white/60 text-sm leading-relaxed">{pillar.description}</p>
                  </motion.div>
                </ScrollReveal>
              ))}
            </div>
          </div>

        </div>
      </div>
    </PageTransition>
  );
}
