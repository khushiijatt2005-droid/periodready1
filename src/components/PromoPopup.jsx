import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Sparkles, Tag, Check, ArrowRight, Zap, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';

export default function PromoPopup() {
  const { 
    isPromoPopupOpen, 
    setIsPromoPopupOpen, 
    applyCoupon, 
    couponCode,
    setIsDrawerOpen,
    items
  } = useCart();

  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Auto-open on initial visit after 1.5 seconds if not on admin page and not already dismissed
  useEffect(() => {
    if (location.pathname.startsWith('/admin')) return;

    try {
      const dismissed = sessionStorage.getItem('periodready_promo_dismissed_v1');
      if (!dismissed) {
        const timer = setTimeout(() => {
          setIsPromoPopupOpen(true);
        }, 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // safe fallback
    }
  }, [location.pathname, setIsPromoPopupOpen]);

  const handleClose = () => {
    setIsPromoPopupOpen(false);
    try {
      sessionStorage.setItem('periodready_promo_dismissed_v1', 'true');
    } catch (e) {}
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('TRYNEW20');
    setCopied(true);
    applyCoupon('TRYNEW20');
    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {}
    setTimeout(() => setCopied(false), 2500);
  };

  const handleApplyAndShop = () => {
    applyCoupon('TRYNEW20');
    handleClose();
    try {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.55 }
      });
    } catch (e) {}

    if (items.length > 0) {
      setIsDrawerOpen(true);
    } else {
      navigate('/shop');
    }
  };

  if (!isPromoPopupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-2 border-pink-200 overflow-hidden transform transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Decorative Gradient Ribbon */}
        <div className="h-3 bg-gradient-to-r from-rose via-amber-400 to-indigo"></div>

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
          title="Close Offer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 text-center space-y-5">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-rose/10 border border-rose/30 text-rose text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome Offer · 1st Order</span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h2 className="font-serif font-black text-2xl sm:text-3xl text-indigo leading-tight tracking-tight">
              Get <span className="bg-gradient-to-r from-rose to-indigo text-transparent bg-clip-text">20% OFF</span> on Your First Order!
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-sm mx-auto">
              Emergency menstrual kits delivered in ~10 minutes across Indore in 100% plain, discreet packaging.
            </p>
          </div>

          {/* Coupon Code Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#fff5f8] via-white to-[#fff0f5] border-2 border-dashed border-rose/40 space-y-2.5">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest flex items-center justify-center gap-1">
              <Tag className="w-3.5 h-3.5 text-rose" />
              <span>Use Promo Code At Checkout</span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-white p-2 sm:p-2.5 rounded-xl border border-rose-200/80 shadow-xs">
              <span className="font-mono font-black text-xl sm:text-2xl text-indigo tracking-wider pl-2 select-all">
                TRYNEW20
              </span>
              <button
                onClick={handleCopyCode}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
                  copied
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-indigo hover:bg-indigo-dark text-white shadow-xs hover:scale-105 active:scale-95'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied &amp; Applied!</span>
                  </>
                ) : (
                  <span>Copy Code</span>
                )}
              </button>
            </div>
            
            <p className="text-[11px] text-emerald-700 font-semibold">
              ✨ Flat 20% discount applies to your whole cart!
            </p>
          </div>

          {/* Action Button */}
          <div className="space-y-2.5 pt-1">
            <button
              onClick={handleApplyAndShop}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-rose via-indigo to-indigo hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-rose/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>Apply Offer &amp; {items.length > 0 ? 'View Cart' : 'Shop Kits'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={handleClose}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>

          {/* Quick Perks footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-500" /> ~10 Mins Delivery
            </span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Plain Packaging
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
