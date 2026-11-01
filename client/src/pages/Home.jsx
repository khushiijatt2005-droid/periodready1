import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Heart,
  Package,
  Clock,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  Flame,
  Star,
  Gift,
  Leaf,
  Zap,
  Truck,
  Layers,
  Smartphone,
  Search,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import AvailableEverywhere from '../components/AvailableEverywhere';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState(null);
  const { addToCart } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleQuickAdd = (product) => {
    const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
    if (defaultVariant) {
      addToCart(product, defaultVariant, 1);
      addToast(`Added ${product.name} to your bag!`, 'success');
    }
  };

  const faqs = [
    {
      q: 'How fast can I get a PeriodReady kit in an emergency?',
      a: 'If you order via our quick-commerce partners (Blinkit, Zepto, or Swiggy Instamart), your kit will arrive at your door or campus in about 10 minutes. Orders placed directly on our website are fulfilled with standard shipping (2-4 days).'
    },
    {
      q: 'How discreet is the packaging?',
      a: '100% confidential and discreet. All orders—whether from quick-commerce apps or our website—arrive in plain, unbranded packaging with zero external product markings or sanitary logos.'
    },
    {
      q: 'What makes PeriodReady different from buying a regular pad pack?',
      a: 'Regular pads come in loud, crinkly plastics without wipes, disposal bags, or cramp care. PeriodReady provides complete emergency kits: certified organic pads, sealable biodegradable disposal bags, intimate wipes, and relief aids (cramp roll-on or relief aids) in a stylish, compact box.'
    },
    {
      q: 'Who is PeriodReady designed for?',
      a: 'PeriodReady is tailored specifically for college & PG students and busy working professionals who need fast, reliable, and discreet menstrual hygiene solutions on the go.'
    },
    {
      q: 'What is inside the Over-all Master Combo Box?',
      a: 'The Over-all Master Combo Box includes all three full kits: the Regular Period Kit (₹179), the Travel Period Kit (₹249), and the Emergency Period Kit (₹49), beautifully packed inside a premium navy-blue mailer box with custom wrapping & sticker seal at ₹399 (saving ₹78 compared to buying individually).'
    }
  ];

  return (
    <div className="space-y-20 md:space-y-28">
      {/* 
        ============================================================
        1. HERO SECTION: "EMERGENCY? GET IT IN 10 MINUTES"
        ============================================================
      */}
      <section className="relative overflow-hidden pt-10 pb-16 md:py-20 lg:py-24 bg-gradient-to-b from-brand-blush via-brand-blushAlt to-[#FFF5F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Emergency Alert Tag */}
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 to-brand-accent/15 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black text-amber-950 tracking-wide shadow-xs">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
                <span>EMERGENCY? GET IT IN ABOUT 10 MINUTES</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-brand-purple tracking-tight leading-[1.12]">
                When a period surprises you,{' '}
                <span className="text-brand-accent italic font-normal">we're 10 minutes away.</span>
              </h1>

              <p className="text-base sm:text-lg text-gray-700 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                When a cycle surprise catches you off guard, order on your favourite quick-commerce app and get a complete menstrual emergency kit delivered in about 10 minutes, wherever you are.
              </p>

              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                Targeted for College & PG Students and Working Professionals
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <a
                  href="#available-everywhere"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-950 px-8 py-4 rounded-full text-sm font-black transition shadow-soft hover:shadow-soft-lg transform hover:-translate-y-0.5"
                >
                  <Zap className="w-4 h-4 fill-gray-950" />
                  <span>Get in 10 Mins (Blinkit / Zepto / Instamart)</span>
                </a>

                <Link
                  to="/shop"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-purple hover:bg-brand-purpleDark text-white px-7 py-3.5 rounded-full text-sm font-bold transition shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Shop All Kits</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-rose-200/60 grid grid-cols-3 gap-3 max-w-md mx-auto lg:mx-0 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>10-Min Fast Delivery</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Plain Discreet Box</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                  <Leaf className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Organic Cotton Pads</span>
                </div>
              </div>
            </div>

            {/* Right Hero Product Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-r from-brand-accent/20 to-brand-yellow/30 rounded-3xl blur-2xl opacity-70 transform rotate-2"></div>

                <div className="relative bg-white rounded-3xl p-6 shadow-soft-lg border border-rose-100 space-y-4">
                  <div className="relative overflow-hidden rounded-2xl bg-brand-blush aspect-[4/3] flex items-center justify-center">
                    <img
                      src="/images/products/emergency-front.jpg"
                      alt="PeriodReady Emergency Kit"
                      className="w-full h-full object-contain p-2 hover:scale-105 transition-transform duration-500 rounded-xl"
                    />
                    <div className="absolute top-3 left-3 bg-brand-purple text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      Emergency Kit • ₹49
                    </div>
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm text-brand-purple text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm border border-purple-100 flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>~10 Mins via Blinkit/Zepto</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-black text-xl text-brand-purple">Emergency Period Kit</h3>
                      <p className="text-xs text-gray-500">1 Sanitary Pad + 2 Coin Tissues + Saviour Pouch</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-brand-purple">₹49</div>
                      <span className="text-[11px] text-gray-400 line-through">₹79</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center gap-3">
                    <Link
                      to="/product/prod_emergency"
                      className="flex-1 bg-brand-purple text-white py-3 rounded-xl text-xs font-bold hover:bg-brand-purpleDark transition text-center shadow-soft flex items-center justify-center gap-1.5"
                    >
                      <span>View Kit & Buy</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        2. HOW IT WORKS (3 STEPS)
        ============================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Simple & Immediate
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
            How PeriodReady Works in 3 Steps
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            No panic, no awkward dashes to far-off pharmacies. Emergency menstrual readiness delivered right to you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-soft hover:shadow-soft-lg transition space-y-4 text-center md:text-left relative group">
            <div className="w-14 h-14 rounded-2xl bg-purple-100 text-brand-purple font-black text-xl flex items-center justify-center shadow-xs">
              01
            </div>
            <h3 className="font-heading font-black text-xl text-brand-purple">
              Open Your App
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Open your preferred quick-commerce app—<strong>Blinkit</strong>, <strong>Zepto</strong>, or <strong>Swiggy Instamart</strong>—on your phone.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-soft hover:shadow-soft-lg transition space-y-4 text-center md:text-left relative group">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-brand-accent font-black text-xl flex items-center justify-center shadow-xs">
              02
            </div>
            <h3 className="font-heading font-black text-xl text-brand-purple">
              Search "PeriodReady"
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Select your required kit: <strong>Emergency Kit (₹49)</strong>, <strong>Regular Kit (₹179)</strong>, <strong>Travel Kit (₹249)</strong>, or the <strong>Over-all Master Combo Box (₹399)</strong>.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-soft hover:shadow-soft-lg transition space-y-4 text-center md:text-left relative group">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 font-black text-xl flex items-center justify-center shadow-xs">
              03
            </div>
            <h3 className="font-heading font-black text-xl text-brand-purple">
              Get It in ~10 Minutes
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Fulfill your order instantly. Delivered right to your campus gate, PG reception, or office desk in 100% plain, discreet packaging.
            </p>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        3. PRODUCT COLLECTION (4 SPECIFIC PRODUCTS)
        ============================================================
      */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Our Emergency Collection
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
            Engineered for Preparedness. Ready in Seconds.
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Every kit features a detailed high-resolution gallery showing inside contents and exterior packaging.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, idx) => {
              const isCombo = product.tier === 'Combo' || product.category === 'combo';
              const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];

              return (
                <div
                  key={product._id || product.id}
                  className={`bg-white rounded-3xl p-5 shadow-soft hover:shadow-soft-lg transition-all duration-300 border flex flex-col justify-between relative group ${
                    isCombo
                      ? 'border-brand-purple ring-2 ring-brand-purple/40 bg-gradient-to-b from-purple-50/40 via-white to-pink-50/30'
                      : 'border-rose-100'
                  }`}
                >
                  {isCombo && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-purple text-brand-yellow text-[11px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-md border border-purple-300">
                      ★ Best Value (Save ₹78)
                    </div>
                  )}

                  <div>
                    {/* Front Photo */}
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="block aspect-[4/3] rounded-2xl bg-brand-blush/60 overflow-hidden mb-4 border border-white"
                    >
                      <img
                        src={product.frontImage || product.images?.[0]}
                        alt={product.name}
                        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-300 rounded-xl"
                      />
                    </Link>

                    {/* Step order & Rating */}
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-accent">
                        {isCombo ? 'Complete Box' : `${product.tier} Kit`}
                      </span>
                      <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                        <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                        <span>{product.rating}</span>
                        <span className="text-gray-400">({product.reviewsCount})</span>
                      </div>
                    </div>

                    <Link to={`/product/${product._id || product.id}`}>
                      <h3 className="font-heading font-black text-lg text-brand-purple group-hover:text-brand-accent transition leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    <p className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                      {product.tagline}
                    </p>

                    {/* What's Included Preview */}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-gray-700">
                        Key Items Inside:
                      </p>
                      {(product.whatInside || []).slice(0, 3).map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-[11px] text-gray-600">
                          <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>
                            <strong className="text-gray-900">
                              {typeof item.count === 'number' ? `${item.count}x` : `${item.count} •`}
                            </strong>{' '}
                            {item.item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-5 pt-3 border-t border-rose-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <div>
                        <span className="text-[10px] text-gray-400 block font-semibold">Price</span>
                        <div className="text-2xl font-black text-brand-purple">
                          ₹{product.basePrice}
                        </div>
                      </div>
                      {product.comparePrice > product.basePrice && (
                        <div className="text-right">
                          <span className="text-[10px] text-emerald-600 font-bold block">
                            Save ₹{product.comparePrice - product.basePrice}
                          </span>
                          <span className="text-xs text-gray-400 line-through">₹{product.comparePrice}</span>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => handleQuickAdd(product)}
                        className="py-2.5 px-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-1"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Bag</span>
                      </button>
                      <Link
                        to={`/product/${product._id || product.id}`}
                        className="py-2.5 px-2 rounded-xl border border-brand-purple/30 text-brand-purple text-xs font-bold hover:bg-purple-50 transition text-center"
                      >
                        View Kit
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 
        ============================================================
        4. "AVAILABLE EVERYWHERE" SECTION
        ============================================================
      */}
      <div id="available-everywhere" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AvailableEverywhere title="Available Everywhere: Quick Commerce & Marketplaces" />
      </div>

      {/* 
        ============================================================
        5. "WHY PERIODREADY" (REWRITTEN AROUND 5 CORE PILLARS)
        ============================================================
        1. 10 minutes away in an emergency
        2. Available everywhere
        3. Discreet and stylish
        4. Pocket-friendly
        5. Complete pack
      */}
      <section id="why-periodready" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Designed for Real Emergencies
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
            Why PeriodReady is the Go-To Emergency Choice
          </h2>
          <p className="text-gray-600 text-sm sm:text-base">
            Crafted for college and PG students and working professionals who value speed, dignity, and preparedness.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Pillar 1 */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-purple">
              10 Minutes Away in an Emergency
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              When an unexpected cycle begins during a lecture, meeting, or exam, you can't wait hours. Hyperlocal delivery gets your kit to you in ~10 minutes flat.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 text-brand-purple flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-purple">
              Available Everywhere
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Listed on India's top 10-minute platforms (Blinkit, Zepto, Swiggy Instamart) and verified marketplaces (Amazon, Flipkart, Myntra), plus direct website delivery.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 text-brand-accent flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-purple">
              Discreet & Stylish
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              No awkward graphics or loud labels. Outer boxes are 100% plain and unmarked, while inner kits resemble chic aesthetic pouches you can carry anywhere with pride.
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-purple">
              Pocket-Friendly
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              Emergency preparedness shouldn't cost a fortune. Our Emergency Kit starts at just ₹49, giving every student and professional accessible peace of mind.
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-3 sm:col-span-2 lg:col-span-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-lg text-brand-purple">
              Complete Pack (Not Just a Pad)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              A regular pad alone doesn't solve disposal issues or hygiene worries. Every PeriodReady kit is a complete solution: organic cotton pads, odor-barrier disposal bags, hypoallergenic wipes, and cramp care (cramp roll-on or relief aids).
            </p>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        6. FAQS SECTION
        ============================================================
      */}
      <section id="faq" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Got Questions?
          </span>
          <h2 className="text-3xl font-heading font-black text-brand-purple">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-rose-100 shadow-soft overflow-hidden transition"
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full py-4 px-6 text-left flex items-center justify-between gap-4 font-heading font-bold text-brand-purple text-sm sm:text-base hover:text-brand-accent transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                      isOpen ? 'rotate-180 text-brand-purple' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-rose-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
