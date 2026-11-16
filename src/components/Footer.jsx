import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, ShieldCheck, Heart, Lock } from 'lucide-react';
import InstagramIcon from './InstagramIcon';

export default function Footer() {
  return (
    <footer className="bg-indigo text-white mt-16 sm:mt-24 border-t border-indigo-900">
      {/* Brand & Value Band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 p-1 flex items-center justify-center border border-white/20">
                <img src="/images/logo.png" alt="PeriodReady" className="w-full h-full object-contain" />
              </div>
              <span className="font-serif font-bold text-2xl tracking-tight text-white">PeriodReady</span>
            </div>
            
            <p className="text-lavender-deep text-sm leading-relaxed max-w-md">
              "When a period surprises you, we’re 10 minutes away."
            </p>
            <p className="text-rose-light text-xs font-semibold tracking-wide uppercase">
              Be Ready. Feel Confident. Always.
            </p>
            <p className="text-slate-300 text-xs leading-relaxed max-w-md">
              India’s menstrual emergency companion for college students, PG residents and busy working professionals. Delivered directly to your campus gate, PG reception or office desk in about 10 minutes in 100% plain, discreet packaging.
            </p>

            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-medium border border-white/10">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Plain Discreet Packaging
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition-colors">Shop All Kits</Link>
              </li>
              <li>
                <Link to="/hot-water-bag" className="hover:text-white transition-colors">Cozy Knit Hot Water Bag</Link>
              </li>
              <li>
                <Link to="/delivery" className="hover:text-white transition-colors">10-Min Delivery</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">About &amp; Team</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 className="font-serif font-semibold text-white text-base mb-4 tracking-wide">
              Contact &amp; Hub
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-rose-light shrink-0 mt-0.5" />
                <div>
                  <span>Vijay Nagar, Indore, Madhya Pradesh 452001</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Vijay+Nagar,+Indore,+Madhya+Pradesh+452001"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-[11px] text-rose-light hover:underline mt-0.5"
                  >
                    Open in Maps ↗
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-light shrink-0" />
                <a href="mailto:periodready1@gmail.com" className="hover:text-white transition-colors">
                  periodready1@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-rose-light shrink-0" />
                <a 
                  href="https://www.instagram.com/periodready_1/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-colors"
                >
                  @periodready_1
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Copyright & Admin Link Bar */}
      <div className="bg-indigo-900/80 border-t border-white/10 py-5 px-4 text-xs text-slate-300">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div>
            © 2026 PeriodReady, Vijay Nagar, Indore 452001. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link 
              to="/admin"
              className="inline-flex items-center gap-1.5 text-white hover:text-rose-light transition-all px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 font-semibold shadow-xs"
            >
              <Lock className="w-3.5 h-3.5 text-rose-light" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
