import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, Menu, X, Shield, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItemsCount, setIsCartOpen } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop Kits', path: '/shop' },
    { name: '⚡ 10-Min Delivery', path: '/#available-everywhere' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-rose-100">
      {/* Top Banner */}
      <div className="bg-brand-purple text-[#FFF5F3] text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2 tracking-wide flex-wrap">
        <Sparkles className="w-3.5 h-3.5 text-brand-yellow shrink-0" />
        <span>⚡ Emergency? Delivered in <strong>~10 Minutes</strong> on <strong>Blinkit</strong>, <strong>Zepto</strong> & <strong>Instamart</strong> • Plain Discreet Packaging</span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <img
              src="/brand-logo.png?v=8"
              alt="PeriodReady Logo"
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain transition-transform duration-200 group-hover:scale-105 shrink-0"
            />
            <div className="flex flex-col">
              <span className="font-heading font-black text-2xl tracking-tight text-brand-purple">
                PeriodReady
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest text-brand-accent -mt-1">
                Be Ready • Feel Confident
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-semibold transition-colors duration-200 hover:text-brand-accent ${
                    isActive ? 'text-brand-purple border-b-2 border-brand-accent pb-1' : 'text-gray-600'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Bag Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full text-brand-purple hover:bg-brand-blush transition shadow-sm border border-rose-100"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-brand-accent text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-sm animate-pulse">
                  {totalItemsCount}
                </span>
              )}
            </button>

            {/* User Profile / Login Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-full border border-rose-200 hover:bg-brand-blush transition text-brand-purple"
                >
                  <div className="w-8 h-8 rounded-full bg-brand-purple text-white flex items-center justify-center font-bold text-xs uppercase">
                    {user?.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-semibold hidden sm:inline max-w-[100px] truncate">
                    {user?.name?.split(' ')[0]}
                  </span>
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-soft-lg border border-rose-100 py-2 z-50 animate-fade-in"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs font-medium text-gray-500">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user?.email}</p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-blush hover:text-brand-purple font-medium"
                    >
                      My Dashboard & Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold text-brand-purple border border-brand-purple hover:bg-purple-50 transition"
                >
                  <User className="w-3.5 h-3.5" />
                  Sign In
                </Link>
                <Link
                  to="/shop"
                  className="inline-flex items-center gap-1.5 bg-brand-accent text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brand-accentHover transition shadow-soft"
                >
                  Shop Now
                </Link>
              </div>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-purple rounded-xl"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-rose-100 px-4 pt-2 pb-6 space-y-3 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-gray-700 hover:text-brand-purple border-b border-gray-50"
            >
              {link.name}
            </Link>
          ))}
          {!isAuthenticated && (
            <div className="pt-2 flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-brand-purple text-brand-purple font-bold text-sm"
              >
                Customer Sign In / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
