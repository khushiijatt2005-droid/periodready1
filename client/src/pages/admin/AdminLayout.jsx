import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  MessageSquare,
  LogOut,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Globe,
  FileText,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminLayout() {
  const { adminUser, isAdminAuthenticated, adminLogout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!isAdminAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAdminAuthenticated, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!isAdminAuthenticated) return null;

  const navItems = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products & Variants', path: '/admin/products', icon: Package },
    { label: 'Sales Channels', path: '/admin/sales-channels', icon: Globe },
    { label: 'Orders & Fulfillment', path: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Coupons & Discounts', path: '/admin/coupons', icon: Tag },
    { label: 'Pages & Content', path: '/admin/content', icon: FileText },
    { label: 'Contact Messages', path: '/admin/enquiries', icon: MessageSquare },
  ];

  const currentNav = navItems.find((n) => location.pathname.startsWith(n.path)) || navItems[0];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-gray-800">
      {/* Desktop Sidebar (Permanent on md+) */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-white flex-col justify-between shrink-0 border-r border-slate-800 min-h-screen sticky top-0 h-screen">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/95 p-1 flex items-center justify-center shadow-xs shrink-0">
                <img src="/brand-logo.png?v=8" alt="PeriodReady" className="w-full h-full object-contain" />
              </div>
              <div>
                <span className="font-heading font-black text-lg text-white block">PeriodReady</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand-yellow">
                  Control Center
                </span>
              </div>
            </div>
          </div>

          {/* Nav links */}
          <nav className="p-4 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-brand-purple text-white shadow-soft font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer info & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-slate-400 hover:text-white transition px-2 py-1"
          >
            <span>View Public Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-purple text-white font-bold text-xs flex items-center justify-center">
                A
              </div>
              <div className="text-left text-xs">
                <span className="font-bold text-white block truncate max-w-[100px]">{adminUser?.name || 'Admin'}</span>
                <span className="text-[10px] text-slate-400">Staff Account</span>
              </div>
            </div>
            <button
              onClick={() => {
                adminLogout();
                navigate('/admin/login');
              }}
              title="Logout from Admin"
              className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Header Bar & Drawer (Mobile Only) */}
      <div className="md:hidden bg-slate-900 text-white sticky top-0 z-50 border-b border-slate-800">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/95 p-0.5 flex items-center justify-center shadow-xs shrink-0">
              <img src="/brand-logo.png?v=8" alt="PeriodReady" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-heading font-black text-sm text-white block">PeriodReady Admin</span>
              <span className="text-[10px] text-amber-300 font-bold block">{currentNav.label}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              target="_blank"
              className="p-2 text-slate-400 hover:text-white text-xs flex items-center gap-1"
              title="View Public Site"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-800 text-white hover:bg-slate-700 transition"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Drawer */}
        {mobileMenuOpen && (
          <div className="bg-slate-900/98 border-t border-slate-800 p-4 space-y-2 backdrop-blur-md">
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname.startsWith(item.path);
                return (
                  <NavLink
                    key={item.label}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isActive
                        ? 'bg-brand-purple text-white font-bold shadow-soft'
                        : 'text-slate-300 bg-slate-800/80 hover:bg-slate-800'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
              <span>Logged in as <strong>{adminUser?.name || 'Admin'}</strong></span>
              <button
                onClick={() => {
                  adminLogout();
                  navigate('/admin/login');
                }}
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" /> Logout
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        <header className="hidden md:flex bg-white border-b border-gray-200 px-6 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
            <span>PeriodReady Operations</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-gray-900 font-bold">{currentNav.label}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              API Online • Live Mode
            </span>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
