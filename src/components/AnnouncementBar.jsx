import React from 'react';
import { Zap, Tag, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AnnouncementBar() {
  const { setIsPromoPopupOpen } = useCart();

  return (
    <div className="bg-gradient-to-r from-indigo via-[#2a245f] to-rose text-white text-xs sm:text-sm font-medium py-2 px-4 shadow-sm z-40 relative">
      <div className="max-w-7xl mx-auto flex items-center justify-center text-center gap-2 flex-wrap">
        <span className="inline-flex items-center gap-1.5 font-bold text-amber-300">
          <Sparkles className="w-3.5 h-3.5 fill-current animate-pulse" />
          FIRST ORDER?
        </span>
        <span>
          Get <strong className="text-white font-black underline decoration-amber-300 decoration-2">Flat 20% OFF</strong> with code{' '}
          <button 
            onClick={() => setIsPromoPopupOpen(true)}
            className="inline-flex items-center gap-1 font-mono font-black text-amber-300 bg-white/15 px-2 py-0.5 rounded border border-amber-300/40 hover:bg-white hover:text-indigo transition-all cursor-pointer ml-1"
            title="Click to view & apply coupon"
          >
            <Tag className="w-3 h-3" />
            <span>TRYNEW20</span>
          </button>
        </span>
        <span className="hidden md:inline opacity-60">·</span>
        <span className="hidden md:inline-flex items-center gap-1 opacity-90 text-pink-100">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          ~10 Mins Discreet Delivery in Indore
        </span>
      </div>
    </div>
  );
}
