import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingBag, User, Lock, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { itemCount, setIsDrawerOpen } = useCart();
  const { user, isAdmin, setAuthModalOpen, setAuthModalMode } = useAuth();

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop All Kits', path: '/shop' },
    { name: 'Hot Water Bag', path: '/hot-water-bag' },
    { name: '10-Min Delivery', path: '/delivery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
    { name: 'Admin', path: '/admin', isSpecial: true },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-lavender-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
          
          {/* Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-lavender flex items-center justify-center p-1 border border-lavender-border group-hover:scale-105 transition-transform">
              <img 
                src="/images/logo.png" 
                alt="PeriodReady Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg sm:text-2xl tracking-tight text-indigo leading-tight group-hover:text-indigo-dark transition-colors">
                PeriodReady
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-rose font-semibold -mt-0.5">
                10-Min Emergency Kit
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-indigo text-white shadow-sm shadow-indigo/20 font-semibold'
                      : 'text-slate-600 hover:text-indigo hover:bg-lavender'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Account & Cart */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {user ? (
              <Link
                to="/account"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-indigo bg-lavender hover:bg-lavender-alt border border-lavender-border transition-colors"
                title="View My Account & Orders"
              >
                <User className="w-3.5 h-3.5 text-indigo" />
                <span className="max-w-[80px] sm:max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthModalMode('signup');
                  setAuthModalOpen(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold text-indigo bg-lavender hover:bg-lavender-alt border border-lavender-border transition-colors"
              >
                <User className="w-3.5 h-3.5 text-indigo" />
                <span className="hidden xs:inline">Sign up / Account</span>
                <span className="xs:hidden">Sign in</span>
              </button>
            )}

            {/* Cart Button with Count Badge */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              aria-label="Open Shopping Cart"
              className="relative inline-flex items-center justify-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-indigo hover:bg-indigo-dark text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Cart</span>
              {itemCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-rose text-white text-[11px] font-bold shadow-sm animate-bounce">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Direct Admin Portal Link */}
            <Link
              to="/admin"
              title="Owner Admin Dashboard"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-full text-xs font-bold text-indigo bg-rose/10 hover:bg-rose/20 border border-rose/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Lock className="w-3 h-3 text-rose" />
              <span>Admin</span>
            </Link>
          </div>
        </div>

        {/* Mobile Horizontally Scrollable Nav Row */}
        <div className="md:hidden flex items-center gap-1 py-2 overflow-x-auto hide-scrollbar border-t border-lavender-border">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-indigo text-white shadow-sm font-semibold'
                    : 'text-slate-600 hover:text-indigo hover:bg-lavender'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
}
