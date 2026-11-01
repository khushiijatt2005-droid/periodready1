import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, User, Phone, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login, signup } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignup) {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please fill all required fields');
        }
        await signup(formData.name, formData.email, formData.phone, formData.password);
        addToast('Welcome to PeriodReady! Your account has been created.', 'success');
      } else {
        if (!formData.email || !formData.password) {
          throw new Error('Please enter email and password');
        }
        await login(formData.email, formData.password);
        addToast('Signed in successfully! Welcome back.', 'success');
      }
      navigate(redirectPath, { replace: true });
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoCustomer = () => {
    setFormData({
      name: 'Ananya Sharma',
      email: 'customer@periodready.com',
      phone: '+91 9123456789',
      password: 'Customer@123',
    });
    setIsSignup(false);
    addToast('Demo Customer credentials loaded!', 'info');
  };

  const handleForgotSubmit = async (e) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      addToast(data.message, 'success');
      setForgotModalOpen(false);
    } catch (err) {
      addToast(err.message || 'Request failed', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-soft border border-rose-100 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <img src="/logo-circle.png" alt="PeriodReady" className="w-14 h-14 object-contain drop-shadow-md" />
            <span className="font-heading font-black text-2xl text-brand-purple">PeriodReady</span>
          </Link>
          <h2 className="text-2xl font-heading font-black text-brand-purple">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-gray-500">
            {isSignup
              ? 'Join PeriodReady for effortless emergency kit orders and fast delivery.'
              : 'Sign in to access your orders, track shipments, and manage saved addresses.'}
          </p>
        </div>

        {/* Demo Fast Login Pill */}
        <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 flex items-center justify-between">
          <div className="text-xs text-brand-purple font-medium">
            <span className="font-bold block">Testing the app?</span>
            One-click fill demo customer
          </div>
          <button
            type="button"
            onClick={handleDemoCustomer}
            className="px-3 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-sm"
          >
            Fill Demo
          </button>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex bg-brand-blush p-1 rounded-2xl border border-rose-100">
          <button
            type="button"
            onClick={() => setIsSignup(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              !isSignup ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setIsSignup(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              isSignup ? 'bg-white text-brand-purple shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="ananya@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number (Optional)</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="+91 9123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-bold text-gray-700">Password</label>
              {!isSignup && (
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(true)}
                  className="text-[11px] font-semibold text-brand-accent hover:underline"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            <span>{loading ? 'Processing...' : isSignup ? 'Register & Continue' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted with JWT & bcrypt 256-bit security</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-soft-lg">
            <h3 className="font-heading font-black text-xl text-brand-purple">Reset Password</h3>
            <p className="text-xs text-gray-500">
              Enter the email address registered with your PeriodReady account to receive a reset token.
            </p>
            <form onSubmit={handleForgotSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="your-email@example.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/40"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setForgotModalOpen(false)}
                  className="flex-1 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
                >
                  Send Reset Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
