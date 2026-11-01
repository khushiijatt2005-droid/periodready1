import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Heart,
  Clock,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  Package,
  Flame,
  CheckCircle2,
  Smile,
  BadgeDollarSign,
  Zap,
  Mail,
  Users,
  MapPin,
  Building2
} from 'lucide-react';
import AvailableEverywhere from '../components/AvailableEverywhere';

export default function About() {
  const [content, setContent] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    // Fetch live content and live products concurrently
    Promise.all([
      fetch('/api/content/about').then((r) => r.json()).catch(() => null),
      fetch('/api/products').then((r) => r.json()).catch(() => [])
    ])
      .then(([contentData, productsData]) => {
        if (contentData) {
          setContent(contentData);
          if (contentData.seoTitle) {
            document.title = contentData.seoTitle;
          }
          if (contentData.seoDescription) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) metaDesc.setAttribute('content', contentData.seoDescription);
          }
        }
        if (Array.isArray(productsData)) {
          setProducts(productsData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error loading about data:', err);
        setLoading(false);
      });
  }, []);

  // Derive live pricing from database products
  const regProd = products.find((p) => p.tier === 'Regular') || { basePrice: 179 };
  const trvProd = products.find((p) => p.tier === 'Travel') || { basePrice: 249 };
  const emgProd = products.find((p) => p.tier === 'Emergency') || { basePrice: 49 };
  const comboProd = products.find((p) => p.tier === 'Combo' || p.category === 'combo') || { basePrice: 399 };

  const regPrice = regProd.basePrice || 179;
  const trvPrice = trvProd.basePrice || 249;
  const emgPrice = emgProd.basePrice || 49;
  const comboPrice = comboProd.basePrice || 399;

  // Dynamic calculations for the combo savings
  const sumOfThree = regPrice + trvPrice + emgPrice;
  const dynamicSavings = Math.max(0, sumOfThree - comboPrice);

  const problem = content?.problemSection || {
    badge: 'The Problem',
    title: 'Periods Often Arrive Unexpectedly',
    paragraph: 'Periods often arrive unexpectedly: in a lecture, at the office, on a commute or while travelling. The nearest store may be far or closed, buying pads feels awkward, and one surprise can ruin a whole day.'
  };

  const whatIs = content?.whatIsSection || {
    badge: 'What PeriodReady Is',
    title: 'A Stylish, Discreet, Ready-to-Use Kit',
    paragraph: 'PeriodReady is a stylish, discreet, ready-to-use kit designed for exactly that moment. Everything needed comes in one small pack that looks like a normal pouch, so you are never caught unprepared.'
  };

  const gains = content?.whyItMatters || [
    {
      title: 'Saves Time',
      description: 'No last-minute store search, and in an emergency you can order on a quick-commerce app and get it in about 10 minutes (where available).'
    },
    {
      title: 'Saves Stress & Embarrassment',
      description: 'Discreet look, plain packaging with zero awkward labels.'
    },
    {
      title: 'Saves Money',
      description: 'Low entry price starting at ₹49, and a combo cheaper than buying all three kits separately.'
    },
    {
      title: 'Everything in One Grab',
      description: 'No running to buy five different things. All hygiene and comfort essentials together in one pack.'
    },
    {
      title: 'Stay Confident & Keep Going',
      description: 'Stay confident and keep going with your day without pausing what you love.'
    }
  ];

  const promise = content?.ourPromise || {
    title: 'Our Promise',
    statement: 'Quality products, honest pricing, discreet delivery.',
    tagline: 'Be Ready. Feel Confident. Keep Going.'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20 md:space-y-28">
      {/* 
        ============================================================
        HERO BANNER
        ============================================================
      */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent bg-rose-100/70 px-4 py-1.5 rounded-full inline-block">
          About PeriodReady
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-brand-purple tracking-tight leading-tight">
          Be Ready. Feel Confident. Keep Going.
        </h1>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          Thoughtfully curated menstrual emergency kits created specifically for college & PG students and busy working professionals.
        </p>
      </div>

      {/* 
        ============================================================
        SECTION A: THE PROBLEM
        ============================================================
      */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-8 space-y-4">
          <span className="text-xs font-black uppercase tracking-wider text-brand-accent block">
            {problem.badge || 'The Problem'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple">
            {problem.title || 'Periods Often Arrive Unexpectedly'}
          </h2>
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
            {problem.paragraph}
          </p>
        </div>

        <div className="lg:col-span-4 bg-brand-blush rounded-2xl p-6 border border-rose-200/60 space-y-3">
          <div className="flex items-center gap-2 text-brand-purple font-bold text-xs">
            <Clock className="w-4 h-4 text-brand-accent shrink-0" />
            <span>Common Everyday Situations</span>
          </div>
          <ul className="text-xs text-gray-600 space-y-2 font-medium">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></span>
              <span>Midst of a college lecture or exam hall</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></span>
              <span>During an intensive office work shift</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0"></span>
              <span>On a train, flight, or road-trip commute</span>
            </li>
          </ul>
        </div>
      </section>

      {/* 
        ============================================================
        SECTION B: WHAT PERIODREADY IS
        ============================================================
      */}
      <section className="bg-gradient-to-br from-purple-900 via-brand-purple to-brand-purpleDark text-white rounded-3xl p-8 sm:p-12 shadow-soft-lg space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-brand-yellow">
            {whatIs.badge || 'What PeriodReady Is'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black leading-tight text-white">
            {whatIs.title || 'A Stylish, Discreet, Ready-to-Use Kit'}
          </h2>
          <p className="text-sm sm:text-base text-purple-100 leading-relaxed">
            {whatIs.paragraph}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10 text-xs text-purple-200">
          <div className="flex items-center gap-2.5 bg-white/10 p-3.5 rounded-xl border border-white/10">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Looks Like a Normal Cosmetic Pouch</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/10 p-3.5 rounded-xl border border-white/10">
            <Package className="w-4 h-4 text-brand-yellow shrink-0" />
            <span>Complete Essentials in One Grab</span>
          </div>
          <div className="flex items-center gap-2.5 bg-white/10 p-3.5 rounded-xl border border-white/10">
            <Heart className="w-4 h-4 text-rose-300 shrink-0" />
            <span>Skin-Safe Organic Cotton Protection</span>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        SECTION C: OUR THREE KITS AND WHO EACH IS FOR
        (Prices pulled directly from database, dynamic combo savings)
        ============================================================
      */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Curated Preparedness
          </span>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-brand-purple">
            Our Kits and Who Each Is For
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Every kit features live, honest pricing stored directly in our database.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Regular Period Kit */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex flex-col justify-between hover:shadow-soft-lg transition">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-brand-blush/60 p-3 flex items-center justify-center overflow-hidden">
                <img src="/images/products/regular-front.jpg" alt="Regular Period Kit" className="max-h-full object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block">
                Daily Comfort
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple">
                Regular Period Kit
              </h3>
              <div className="text-xl font-black text-brand-purple">
                ₹{regPrice}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                For everyday comfort, with XL pads, breathable liners, mini sanitizer, disposal bags and a guide card. Best for keeping in your room or bag.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                to={`/product/${regProd._id || 'prod_regular'}`}
                className="w-full py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Kit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 2. Travel Period Kit */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex flex-col justify-between hover:shadow-soft-lg transition">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-brand-blush/60 p-3 flex items-center justify-center overflow-hidden">
                <img src="/images/products/travel-front.jpg" alt="Travel Period Kit" className="max-h-full object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full inline-block">
                Hassle-Free Travel
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple">
                Travel Period Kit
              </h3>
              <div className="text-xl font-black text-brand-purple">
                ₹{trvPrice}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                For trips and long days. No-wash, with roll-on pain relief, stain remover, travel pads and wipes. Best for hassle-free travel.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                to={`/product/${trvProd._id || 'prod_travel'}`}
                className="w-full py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Kit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 3. Emergency Period Kit */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex flex-col justify-between hover:shadow-soft-lg transition">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-brand-blush/60 p-3 flex items-center justify-center overflow-hidden">
                <img src="/images/products/emergency-front.jpg" alt="Emergency Period Kit" className="max-h-full object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full inline-block">
                Compact Saviour
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple">
                Emergency Period Kit
              </h3>
              <div className="text-xl font-black text-brand-purple">
                ₹{emgPrice}
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                A tiny, very low-priced saviour pouch for sudden situations. Best to keep in every bag, pocket or drawer.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-gray-100">
              <Link
                to={`/product/${emgProd._id || 'prod_emergency'}`}
                className="w-full py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition flex items-center justify-center gap-1 shadow-xs"
              >
                <span>View Kit</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* 4. Complete Combo Box (with dynamically calculated savings) */}
          <div className="bg-gradient-to-b from-purple-50/70 via-white to-pink-50/50 rounded-3xl p-6 shadow-soft border-2 border-brand-purple/40 flex flex-col justify-between hover:shadow-soft-lg transition relative">
            <div className="space-y-3">
              <div className="aspect-[4/3] rounded-2xl bg-brand-blush/60 p-2 flex items-center justify-center overflow-hidden">
                <img src="/images/products/trio-combo.jpg" alt="Complete Combo Box" className="max-h-full object-contain" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-brand-yellow text-gray-950 px-2.5 py-0.5 rounded-full inline-block shadow-2xs">
                Best Value Bundle
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple">
                Complete Combo Box
              </h3>
              <div>
                <div className="text-xl font-black text-brand-purple">
                  ₹{comboPrice}
                </div>
                <div className="text-xs font-bold text-emerald-700 mt-0.5">
                  You save ₹{dynamicSavings}! (₹{sumOfThree} separate value)
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed">
                All three kits in one premium navy-blue box with custom stickers and tissue wrapping. Total cycle preparedness.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-purple-200">
              <Link
                to={`/product/${comboProd._id || 'prod_combo_box'}`}
                className="w-full py-2 px-3 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition flex items-center justify-center gap-1 shadow-soft"
              >
                <span>View Combo Box</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        SECTION D: WHY IT MATTERS / WHAT THE CUSTOMER GAINS
        ============================================================
      */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-soft space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Real Customer Benefits
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple">
            Why It Matters (What You Gain)
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Plainly speaking, PeriodReady takes away the friction and discomfort of unexpected cycle days.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gains.map((gain, idx) => (
            <div
              key={idx}
              className="bg-brand-blush/40 rounded-2xl p-5 border border-rose-100/80 space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs text-brand-purple font-black text-sm">
                0{idx + 1}
              </div>
              <h3 className="font-heading font-bold text-base text-brand-purple">
                {gain.title}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {gain.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 
        ============================================================
        SECTION E: HOW AND WHERE TO GET IT
        (Reusing Available Everywhere multi-channel section)
        ============================================================
      */}
      <AvailableEverywhere
        title="How and Where to Get PeriodReady"
      />

      {/* 
        ============================================================
        LEADERSHIP TEAM & COMPANY HEADQUARTERS
        ============================================================
      */}
      <section className="bg-white rounded-3xl p-8 sm:p-12 border border-rose-100 shadow-soft space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>The Minds Behind PeriodReady</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-heading font-black text-brand-purple">
            Meet Our Leadership Team
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Dedicated to eliminating period anxiety for students and working professionals across India.
          </p>
        </div>

        {/* 4 Team Member Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* 1. Khushi Jat - CEO */}
          <div className="bg-gradient-to-b from-purple-50/60 to-white rounded-3xl p-6 border border-purple-200/70 shadow-xs hover:shadow-soft transition text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-purple text-brand-yellow font-heading font-black text-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              KJ
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-brand-purple text-white px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                Leadership
              </span>
              <h3 className="font-heading font-black text-xl text-brand-purple">
                Khushi Jat
              </h3>
              <p className="text-xs font-bold text-brand-accent mt-0.5">
                Chief Executive Officer (CEO)
              </p>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Driving the brand vision of accessibility, discreet wellness, and student-first innovation.
              </p>
            </div>
          </div>

          {/* 2. Mohammad Farhan Mansuri - Marketing Manager */}
          <div className="bg-gradient-to-b from-purple-50/60 to-white rounded-3xl p-6 border border-purple-200/70 shadow-xs hover:shadow-soft transition text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-brand-accent text-white font-heading font-black text-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              FM
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-rose-100 text-rose-800 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                Marketing
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple leading-tight">
                Mohammad Farhan Mansuri
              </h3>
              <p className="text-xs font-bold text-brand-accent mt-0.5">
                Marketing Manager
              </p>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Leading multi-channel awareness, campus outreach, and quick-commerce brand positioning.
              </p>
            </div>
          </div>

          {/* 3. Anushka Khandelwal - Finance Manager */}
          <div className="bg-gradient-to-b from-purple-50/60 to-white rounded-3xl p-6 border border-purple-200/70 shadow-xs hover:shadow-soft transition text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-emerald-700 text-white font-heading font-black text-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              AK
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                Finance
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple leading-tight">
                Anushka Khandelwal
              </h3>
              <p className="text-xs font-bold text-brand-accent mt-0.5">
                Finance Manager
              </p>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Ensuring pocket-friendly kit pricing, ethical unit economics, and sustainable operations.
              </p>
            </div>
          </div>

          {/* 4. Sachin Gangbhoj - Sales Manager */}
          <div className="bg-gradient-to-b from-purple-50/60 to-white rounded-3xl p-6 border border-purple-200/70 shadow-xs hover:shadow-soft transition text-center space-y-4 group">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-amber-600 text-white font-heading font-black text-2xl flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform">
              SG
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                Sales
              </span>
              <h3 className="font-heading font-black text-lg text-brand-purple leading-tight">
                Sachin Gangbhoj
              </h3>
              <p className="text-xs font-bold text-brand-accent mt-0.5">
                Sales Manager
              </p>
              <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                Managing distribution networks, platform partnerships, and driving regional retail & institutional sales.
              </p>
            </div>
          </div>
        </div>

        {/* Company Location & Official Contact Bar */}
        <div className="pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600 bg-brand-blush/60 p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 text-brand-purple">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-brand-purple block text-sm">Company Headquarters</span>
              <span>Vijay Nagar, Indore, M.P. - 452001 (Madhya Pradesh)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center shrink-0 text-brand-purple">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-brand-purple block text-sm">Official Inquiries</span>
              <a href="mailto:Periodready1@gmail.com" className="text-brand-accent hover:underline font-bold">
                Periodready1@gmail.com
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ============================================================
        SECTION F: OUR PROMISE
        ============================================================
      */}
      <section className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 rounded-3xl p-8 sm:p-12 border border-purple-200 text-center space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-brand-accent">
          {promise.title || 'Our Promise'}
        </span>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple max-w-xl mx-auto">
          {promise.statement || 'Quality products, honest pricing, discreet delivery.'}
        </h2>
        <p className="font-heading italic text-lg sm:text-xl text-brand-accent font-bold">
          "{promise.tagline || 'Be Ready. Feel Confident. Keep Going.'}"
        </p>
      </section>

      {/* 
        ============================================================
        SECTION G: CLOSING CTA BUTTONS
        ============================================================
      */}
      <section className="text-center space-y-6 pt-4 pb-8">
        <h3 className="text-xl sm:text-2xl font-heading font-bold text-gray-900">
          Ready to feel completely prepared?
        </h3>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-brand-purple text-white text-sm font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Shop Kits</span>
          </Link>
          <Link
            to="/contact"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-white border-2 border-brand-purple text-brand-purple text-sm font-bold hover:bg-purple-50 transition shadow-xs flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contact Us</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
