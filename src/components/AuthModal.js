import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const loginSchema = yup.object({
  email: yup.string().required('Email is required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
});

const registerSchema = yup.object({
  name: yup.string().required('Name is required').min(2),
  email: yup.string().required('Email is required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
  password: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('password')], 'Passwords do not match').required('Please confirm your password'),
});

const forgotSchema = yup.object({
  email: yup.string().required('Email is required').matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address.'),
});

const resetSchema = yup.object({
  newPassword: yup.string().required('Password is required').min(6, 'Password must be at least 6 characters'),
  confirmPassword: yup.string().oneOf([yup.ref('newPassword')], 'Passwords do not match').required('Please confirm your password'),
});

function LoginForm({ onSwitch }) {
  const { loginUser, setAuthMode, closeAuth, resetEmail } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    try {
      loginUser(data.email, data.password);
      toast.success('Welcome back! Logged in successfully.', { style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' }, iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input type="email" {...register('email')} placeholder="Email Address" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="Password" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <button type="button" onClick={() => setAuthMode('forgot')} className="text-gold text-sm hover:underline text-right w-full">
        Forgot Password?
      </button>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-base">
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>
      <p className="text-center text-sm text-charcoal/60 dark:text-white/60">
        No account?{' '}
        <button type="button" onClick={() => onSwitch('register')} className="text-gold hover:underline font-medium">
          Create one
        </button>
      </p>
    </form>
  );
}

function RegisterForm({ onSwitch }) {
  const { registerUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    try {
      registerUser(data.name, data.email, data.password);
      toast.success(`Welcome, ${data.name}! Account created.`, { style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' }, iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <input type="text" {...register('name')} placeholder="Full Name" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <input type="email" {...register('email')} placeholder="Email Address" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <input type="password" {...register('password')} placeholder="Password (min. 6 chars)" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-base">
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </button>
      <p className="text-center text-sm text-charcoal/60 dark:text-white/60">
        Have an account?{' '}
        <button type="button" onClick={() => onSwitch('login')} className="text-gold hover:underline font-medium">
          Sign in
        </button>
      </p>
    </form>
  );
}

function ForgotForm({ onBack }) {
  const { forgotPassword } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(forgotSchema) });

  const onSubmit = async (data) => {
    try {
      forgotPassword(data.email);
      toast.success('Verification code sent! Check your email.', { style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' }, iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' } });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-charcoal/60 dark:text-white/60 text-sm mb-2">Enter the email address associated with your account.</p>
      <div>
        <input type="email" {...register('email')} placeholder="Your email address" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-base">
        Send Reset Code
      </button>
      <button type="button" onClick={onBack} className="text-gold text-sm hover:underline text-center w-full block">
        ← Back to Login
      </button>
    </form>
  );
}

function ResetForm({ onDone }) {
  const { resetPassword, resetEmail } = useAuthStore();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: yupResolver(resetSchema) });

  const onSubmit = async (data) => {
    try {
      resetPassword(resetEmail, data.newPassword);
      toast.success('Password reset successfully! Please sign in.', { style: { background: '#2A2A2A', color: '#fff', border: '1px solid rgba(201, 169, 110, 0.3)' }, iconTheme: { primary: '#C9A96E', secondary: '#1A1A1A' } });
      onDone();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <p className="text-charcoal/60 dark:text-white/60 text-sm mb-2">Set a new password for <span className="text-gold font-medium">{resetEmail}</span></p>
      <div>
        <input type="password" {...register('newPassword')} placeholder="New Password (min. 6 chars)" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
      </div>
      <div>
        <input type="password" {...register('confirmPassword')} placeholder="Confirm New Password" className="w-full px-4 py-3 bg-cream/30 dark:bg-charcoal/30 border border-charcoal/10 dark:border-white/10 rounded-xl text-charcoal dark:text-white focus:outline-none focus:border-gold/50 transition-all" />
        {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="btn-primary w-full py-3.5 text-base">
        {isSubmitting ? 'Resetting...' : 'Reset Password'}
      </button>
    </form>
  );
}

export default function AuthModal() {
  const { isOpen, authMode, setAuthMode, closeAuth } = useAuthStore();

  const titles = {
    login: 'Welcome Back',
    register: 'Join L\'Élégance',
    forgot: 'Forgot Password',
    reset: 'Reset Password',
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/80 backdrop-blur-md">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0" onClick={closeAuth} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 250 }}
            className="relative max-w-md w-full bg-white dark:bg-dark-card rounded-3xl overflow-hidden border border-charcoal/10 dark:border-white/5 shadow-2xl z-10"
          >
            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-charcoal/10 dark:border-white/10">
              <div className="flex items-center justify-between mb-2">
                <div className="w-10 h-10 rounded-full gold-gradient flex items-center justify-center">
                  <span className="text-charcoal font-serif font-bold text-lg">L</span>
                </div>
                <button onClick={closeAuth} className="p-2 rounded-full hover:bg-charcoal/10 dark:hover:bg-white/10 text-charcoal/40 dark:text-white/40 hover:text-charcoal dark:hover:text-white transition-colors focus:outline-none">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h2 className="font-serif text-2xl font-bold text-charcoal dark:text-white">
                {titles[authMode]}
              </h2>
              {authMode === 'login' && <p className="text-charcoal/50 dark:text-white/50 text-sm mt-1">Sign in to your L'Élégance account</p>}
              {authMode === 'register' && <p className="text-charcoal/50 dark:text-white/50 text-sm mt-1">Create your exclusive dining account</p>}
            </div>

            {/* Form body */}
            <div className="px-8 py-6">
              <AnimatePresence mode="wait">
                <motion.div key={authMode} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
                  {authMode === 'login' && <LoginForm onSwitch={setAuthMode} />}
                  {authMode === 'register' && <RegisterForm onSwitch={setAuthMode} />}
                  {authMode === 'forgot' && <ForgotForm onBack={() => setAuthMode('login')} />}
                  {authMode === 'reset' && <ResetForm onDone={() => setAuthMode('login')} />}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
