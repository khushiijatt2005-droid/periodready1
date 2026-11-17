import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Zap, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  Package, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  HeartHandshake,
  ShoppingBag
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import { useCart } from '../context/CartContext';

export default function HomePage() {
  const { addToCart } = useCart();
  const emergencyKit = PRODUCTS.find(p => p.id === 'emergency-kit');

  // Live 10:00 countdown-style timer
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => (prev > 1 ? prev - 1 : 600));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 sm:pt-14 pb-12 sm:pb-20 bg-gradient-to-b from-[#fdeaf2] via-[#fff0f5] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Emergency Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush border border-blush-border text-xs font-bold text-rose tracking-wide shadow-sm">
                <Zap className="w-3.5 h-3.5 fill-current animate-pulse" />
                <span>India’s 10-Min Menstrual Emergency Companion</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif font-bold text-3xl sm:text-5xl lg:text-6xl text-indigo leading-[1.15] tracking-tight">
                When a period surprises you, we’re{' '}
                <span className="italic text-rose underline decoration-blush-border decoration-wavy decoration-2">
                  10 minutes
                </span>{' '}
                away.
              </h1>

              {/* Slogan & Short Intro */}
              <div className="space-y-2">
                <p className="font-serif italic font-semibold text-indigo/90 text-base sm:text-lg">
                  "Be Ready. Feel Confident. Always."
                </p>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto lg:mx-0">
                  India’s menstrual emergency companion for college students, PG residents and busy working professionals. Delivered to your campus gate, PG reception or office desk in about 10 minutes via Blinkit, Zepto and Instamart, in 100% plain, discreet packaging.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => addToCart(emergencyKit)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-indigo hover:bg-indigo-dark text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo/25 flex items-center justify-center gap-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add Emergency Kit · ₹49</span>
                </button>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-white hover:bg-lavender text-indigo font-bold text-sm sm:text-base border border-lavender-border shadow-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <span>Shop all kits</span>
                  <ArrowRight className="w-4 h-4 text-rose" />
                </Link>
              </div>

              {/* Live 10:00 Delivery Timer Card */}
              <div className="mt-6 p-4 rounded-2xl bg-white border border-lavender-border shadow-soft max-w-md mx-auto lg:mx-0 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-xl bg-blush flex items-center justify-center text-rose">
                    <Clock className="w-6 h-6 animate-pulse" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>Live Dispatch Radar</span>
                      <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">Active</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Rider standing by near Vijay Nagar, Indore
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-mono font-bold text-xl sm:text-2xl text-indigo tracking-wider">
                    {formatTimer(secondsLeft)}
                  </div>
                  <div className="text-[10px] text-rose font-bold uppercase tracking-wider">
                    Est. Delivery
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Emergency Kit Single Hero Showcase with Transparent Background */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Soft ambient atmospheric glow */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr from-pink-200/50 via-rose/20 to-purple-200/40 rounded-full blur-3xl pointer-events-none"></div>

              <div className="relative z-10 w-full flex flex-col items-center">
                {/* Clean, Floating Emergency Kit Image with Transparent Background */}
                <div className="relative group w-full flex items-center justify-center py-4">
                  <img
                    src="/images/emergency-kit-hero.png"
                    alt="PeriodReady Emergency Period Kit (Compact Saviour Pouch)"
                    className="w-full max-w-md sm:max-w-lg max-h-[380px] sm:max-h-[440px] object-contain drop-shadow-[0_20px_35px_rgba(214,69,127,0.22)] group-hover:scale-105 transition-all duration-500"
                  />

                  {/* Floating Badge: Pocket Saviour · ₹49 */}
                  <div className="absolute top-2 left-4 sm:left-6 px-4 py-1.5 rounded-full bg-rose text-white text-xs sm:text-sm font-bold shadow-md shadow-rose/30 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Emergency Kit · ₹49</span>
                  </div>

                  {/* Floating Badge: 10-Min Arrival */}
                  <div className="absolute bottom-2 right-4 sm:right-6 px-3.5 py-1.5 rounded-full bg-indigo text-white text-xs font-bold shadow-md shadow-indigo/30 flex items-center gap-1.5 backdrop-blur-sm">
                    <Zap className="w-3.5 h-3.5 text-amber-300" />
                    <span>10-Min Arrival</span>
                  </div>
                </div>

                {/* Subtitle / Contents pill */}
                <div className="mt-2 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-pink-200/80 text-xs text-slate-700 shadow-sm backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="font-semibold text-indigo">Compact Saviour Pouch:</span>
                  <span>1 Pad + 2 Coin Tissues + 2 Pain Relief Tablets</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-indigo text-white rounded-3xl p-6 sm:p-10 shadow-lift">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y md:divide-y-0 md:divide-x divide-white/10 text-center">
            
            {/* Stat 1 */}
            <div className="space-y-1.5 pt-3 md:pt-0">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-rose-light mb-1">
                <Clock className="w-5 h-5" />
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-white">~10 Mins</div>
              <p className="text-xs text-lavender-deep font-medium">Blinkit, Zepto &amp; Instamart</p>
            </div>

            {/* Stat 2 */}
            <div className="space-y-1.5 pt-3 md:pt-0">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-emerald-300 mb-1">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-white">100% Plain</div>
              <p className="text-xs text-lavender-deep font-medium">Discreet Tamper-Proof Packaging</p>
            </div>

            {/* Stat 3 */}
            <div className="space-y-1.5 pt-3 md:pt-0">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-rose-light mb-1">
                <Package className="w-5 h-5" />
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-white">4 Kits + Bag</div>
              <p className="text-xs text-lavender-deep font-medium">Starting at just ₹49</p>
            </div>

            {/* Stat 4 */}
            <div className="space-y-1.5 pt-3 md:pt-0">
              <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-emerald-300 mb-1">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="font-serif font-bold text-2xl sm:text-3xl text-white">Indore Hub</div>
              <p className="text-xs text-lavender-deep font-medium">Vijay Nagar, College Gates &amp; PGs</p>
            </div>
          </div>
        </div>
      </section>

      {/* "PICK WHAT YOU NEED" PRODUCT TILES GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-rose">
            Emergency Care Collection
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-indigo tracking-tight">
            Pick What You Need Right Now
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Every kit is purpose-engineered to solve menstrual surprises wherever you are — whether in college, commuting, or enduring intense cramp pain.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PRODUCTS.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white rounded-3xl p-5 border border-lavender-border shadow-soft hover:shadow-lift transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-b from-[#fff2f6]/70 via-white to-white overflow-hidden mb-4 border border-pink-200/60 flex items-center justify-center p-3 sm:p-4">
                  <img
                    src={prod.images[0].url}
                    alt={prod.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_10px_20px_rgba(68,60,130,0.14)]"
                    onError={(e) => {
                      if (e.target.src.endsWith('.png')) {
                        e.target.src = e.target.src.replace('.png', '.jpg');
                      }
                    }}
                  />
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-indigo text-white shadow-sm">
                    {prod.badge}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-indigo transition-colors line-clamp-1">
                      {prod.shortName}
                    </h3>
                    <span className="font-bold text-lg text-indigo">₹{prod.price}</span>
                  </div>
                  <p className="text-xs text-rose font-medium line-clamp-1">
                    {prod.tagline}
                  </p>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                    {prod.description}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => addToCart(prod)}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-xs shadow-md shadow-indigo/20 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add · ₹{prod.price}</span>
                </button>

                <Link
                  to={prod.isHotWaterBag ? "/hot-water-bag" : "/shop"}
                  className="p-2.5 rounded-xl bg-lavender hover:bg-lavender-alt text-indigo font-semibold text-xs border border-lavender-border transition-colors"
                  title="View details"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white hover:bg-lavender text-indigo font-bold text-sm border border-lavender-border shadow-sm hover:scale-105 transition-all"
          >
            <span>View All Kit Contents &amp; Full Specs</span>
            <ArrowRight className="w-4 h-4 text-rose" />
          </Link>
        </div>
      </section>

      {/* DISCREET PACKAGING GUARANTEE BAND */}
      <section className="bg-[#fdeaf2]/80 border-y border-[#f8c9dc] py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-white flex items-center justify-center text-rose shadow-sm border border-blush-border">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-serif font-bold text-2xl sm:text-3xl text-indigo">
            100% Plain, Discreet &amp; Zero-Embarrassment Packaging
          </h3>
          <p className="text-slate-600 text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            No logos or product names on the outer shipping sleeve. Your delivery rider, PG guard, or college security will see only a sealed, tamper-proof courier package. Handed directly to you in about 10 minutes.
          </p>
        </div>
      </section>

    </div>
  );
}
