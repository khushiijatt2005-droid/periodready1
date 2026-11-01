import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { adminLogin } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await adminLogin(email, password);
      addToast('Administrative access granted. Welcome back!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Administrative login rejected', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@periodready.com');
    setPassword('Admin@123');
    addToast('Admin credentials populated!', 'info');
  };

  const handleInstantLogin = async () => {
    setEmail('admin@periodready.com');
    setPassword('Admin@123');
    setLoading(true);
    try {
      await adminLogin('admin@periodready.com', 'Admin@123');
      addToast('Administrative access granted. Welcome!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Administrative login rejected', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl space-y-6 text-white">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-brand-purple flex items-center justify-center shadow-soft">
            <Lock className="w-7 h-7 text-brand-yellow" />
          </div>
          <h1 className="font-heading font-black text-2xl text-white">PeriodReady Staff Portal</h1>
          <p className="text-xs text-slate-400">
            Restricted access. Authorized brand managers and operations team only.
          </p>
        </div>

        {/* 1-Click Instant Login Banner */}
        <div className="bg-gradient-to-r from-purple-900/60 to-slate-800 p-4 rounded-2xl border border-purple-500/40 flex items-center justify-between gap-3 shadow-lg">
          <div>
            <span className="font-bold block text-sm text-amber-300">⚡ Quick Demo Access</span>
            <span className="text-[11px] text-slate-300">Click to enter directly without typing</span>
          </div>
          <button
            type="button"
            onClick={handleInstantLogin}
            disabled={loading}
            className="px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purpleLight text-white text-xs font-bold transition shadow-soft shrink-0 flex items-center gap-1.5 active:scale-95"
          >
            <span>{loading ? 'Entering...' : '1-Click Login'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@periodready.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 text-xs focus:outline-none focus:border-brand-purple bg-slate-900/60 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">Master Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-600 text-xs focus:outline-none focus:border-brand-purple bg-slate-900/60 text-white placeholder-slate-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleLight transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Operations'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2">
          <a href="/" className="text-xs text-slate-400 hover:text-white transition">
            ← Return to Public Website
          </a>
        </div>
      </div>
    </div>
  );
}
