import React, { useState } from 'react';
import { X, User, Mail, Phone, Lock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function AuthModal() {
  const { 
    authModalOpen, 
    setAuthModalOpen, 
    authModalMode, 
    setAuthModalMode, 
    signup, 
    login,
    pendingAddToCart 
  } = useAuth();
  
  const { executePendingAdd } = useCart();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!authModalOpen) return null;

  const isSignup = authModalMode === 'signup';

  const validatePhone = (p) => {
    // 10 digits Indian mobile validation
    const clean = p.replace(/\D/g, '');
    return clean.length >= 10;
  };

  const validateEmail = (e) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (isSignup) {
      if (!name.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!validatePhone(phone)) {
        setError('Please enter a valid 10-digit mobile number.');
        return;
      }
      if (password.length < 6) {
        setError('Password should be at least 6 characters long.');
        return;
      }
    } else {
      if (!password) {
        setError('Please enter your password.');
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignup) {
        await signup({ name, email, phone, password });
        setSuccessMsg('Account created successfully!');
      } else {
        await login(email, password);
        setSuccessMsg('Welcome back!');
      }

      // If user clicked Add to Cart before signing up, add the item automatically!
      if (pendingAddToCart) {
        setTimeout(() => {
          executePendingAdd(pendingAddToCart);
        }, 300);
      }

      setTimeout(() => {
        setAuthModalOpen(false);
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setError('');
        setSuccessMsg('');
      }, 600);

    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-lavender-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo to-indigo-dark text-white px-6 py-6 text-center relative">
          <button
            onClick={() => setAuthModalOpen(false)}
            aria-label="Close modal"
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
            <img src="/images/logo.png" alt="PeriodReady" className="w-full h-full object-contain" />
          </div>

          <h3 className="font-serif font-bold text-xl sm:text-2xl tracking-tight">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h3>
          <p className="text-lavender-deep text-xs sm:text-sm mt-1">
            {pendingAddToCart ? (
              <span className="text-rose-light font-medium">
                Sign up to add {pendingAddToCart.product.shortName} to your cart
              </span>
            ) : (
              'Save orders, track 10-min deliveries & get instant invoices'
            )}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2">
              <span className="shrink-0 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Priya Sharma"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo text-sm bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@college.edu or gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo text-sm bg-slate-50/50"
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Phone (for Delivery SMS &amp; Gate Calling)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo text-sm bg-slate-50/50"
                  />
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
                {!isSignup && (
                  <span className="text-[11px] text-indigo font-medium hover:underline cursor-pointer">
                    Forgot?
                  </span>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo text-sm bg-slate-50/50"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-sm shadow-md shadow-indigo/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-block animate-spin mr-2">⟳</span>
              ) : (
                <ArrowRight className="w-4 h-4" />
              )}
              {isSignup ? 'Create Account & Continue' : 'Sign In to Account'}
            </button>
          </form>

          {/* Toggle between Signup and Login */}
          <div className="mt-5 text-center text-xs text-slate-500">
            {isSignup ? (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthModalMode('login');
                  }}
                  className="font-semibold text-indigo hover:underline"
                >
                  Log in here
                </button>
              </p>
            ) : (
              <p>
                Don't have an account yet?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setError('');
                    setAuthModalMode('signup');
                  }}
                  className="font-semibold text-indigo hover:underline"
                >
                  Create free account
                </button>
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>100% Secure &amp; Confidential Indian Menstrual Care</span>
          </div>
        </div>
      </div>
    </div>
  );
}
