import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Sparkles, Building2, Lock, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-purpleDark text-white pt-16 pb-8 border-t border-purple-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-purple-800/60">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/95 p-1.5 flex items-center justify-center shadow-soft shrink-0">
                <img
                  src="/brand-logo.png?v=8"
                  alt="PeriodReady Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="font-heading font-black text-2xl tracking-tight text-[#FFF5F3]">
                  PeriodReady
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-widest text-brand-yellow">
                  Be Ready. Feel Confident. Keep Going.
                </span>
              </div>
            </div>
            <p className="text-purple-200 text-sm max-w-sm leading-relaxed">
              Discreet menstrual emergency kits for college and PG students and working professionals. Designed to keep sudden cycle surprises completely worry-free.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-purple-900/80 px-3 py-1 rounded-full text-xs text-brand-yellow font-medium border border-purple-700">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Discreet Packaging
              </span>
              <span className="inline-flex items-center gap-1.5 bg-purple-900/80 px-3 py-1 rounded-full text-xs text-rose-300 font-medium border border-purple-700">
                <Heart className="w-3.5 h-3.5 text-rose-400" />
                Skin-Safe Organic
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide">Explore</h4>
            <ul className="space-y-2.5 text-sm text-purple-200">
              <li>
                <Link to="/shop" className="hover:text-brand-yellow transition">
                  Shop All Kits
                </Link>
              </li>
              <li>
                <Link to="/#why-periodready" className="hover:text-brand-yellow transition">
                  Why PeriodReady
                </Link>
              </li>
              <li>
                <Link to="/#how-it-works" className="hover:text-brand-yellow transition">
                  How It Works (3 Steps)
                </Link>
              </li>
              <li>
                <Link to="/#available-everywhere" className="hover:text-brand-yellow transition">
                  ⚡ Available Everywhere (Blinkit, Zepto, Instamart)
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide">Company</h4>
            <ul className="space-y-2.5 text-sm text-purple-200">
              <li>
                <Link to="/about" className="hover:text-brand-yellow transition">
                  Our Mission & Story
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-brand-yellow transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/#faq" className="hover:text-brand-yellow transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <span className="text-purple-400 text-xs block pt-1">
                  Use coupon <span className="font-mono text-brand-yellow font-bold">STUDENT10</span> for 10% off!
                </span>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-heading font-bold text-white text-base mb-4 tracking-wide">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-purple-200">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <a href="mailto:Periodready1@gmail.com" className="hover:text-brand-yellow transition">
                  Periodready1@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-yellow shrink-0 mt-0.5" />
                <span>Vijay Nagar, Indore, M.P. - 452001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-purple-300 gap-4">
          <p>© {new Date().getFullYear()} PeriodReady Technologies Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Discreet shipping to 19,000+ PIN codes across India</span>
            <Link
              to="/admin/login"
              className="text-purple-400/60 hover:text-purple-200 flex items-center gap-1 transition"
              title="Restricted Staff Portal"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
