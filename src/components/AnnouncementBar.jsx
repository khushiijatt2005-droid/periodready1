import React from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

export default function AnnouncementBar() {
  return (
    <div className="bg-indigo text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm z-50 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2">
        <span className="inline-flex items-center gap-1.5 font-semibold text-rose-light">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
          Emergency?
        </span>
        <span>
          Delivered in 10 minutes on Blinkit, Zepto &amp; Instamart
        </span>
        <span className="hidden sm:inline opacity-60">·</span>
        <span className="hidden sm:inline-flex items-center gap-1 opacity-95">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          Plain, discreet packaging
        </span>
      </div>
    </div>
  );
}
