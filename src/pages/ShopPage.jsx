import React from 'react';
import { ShoppingBag, Check, ShieldCheck, Zap, Sparkles, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';
import ProductImageSlider from '../components/ProductImageSlider';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

export default function ShopPage() {
  const { addToCart } = useCart();

  // The 4 kits strictly in the requested order: Emergency, Regular, Travel, Master Combo
  const kits = PRODUCTS.filter(p => !p.isHotWaterBag);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Page Title & Breadcrumbs */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush text-rose text-xs font-bold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 fill-current" />
          10-Minute Instant Delivery
        </div>
        <h1 className="font-serif font-bold text-3xl sm:text-5xl text-indigo tracking-tight">
          Shop All Period Emergency Kits
        </h1>
        <p className="text-slate-600 text-sm sm:text-base">
          Choose your rescue kit. All orders dispatched instantly in 100% plain, discreet packaging to your campus gate, PG reception, or office desk in about 10 minutes.
        </p>
      </div>

      {/* 4 Kit Cards in Strict Sequence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {kits.map((kit, index) => (
          <div
            key={kit.id}
            className="bg-white rounded-3xl border border-lavender-border shadow-soft hover:shadow-lift transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Swipeable Photo Slider (Flipkart/Amazon style) */}
              <div className="p-4 sm:p-6 bg-gradient-to-b from-[#fff2f6]/50 via-white to-white border-b border-pink-100">
                <ProductImageSlider images={kit.images} />
              </div>

              {/* Kit Details */}
              <div className="p-6 sm:p-8 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase mb-1.5 bg-lavender text-indigo border border-lavender-border">
                      {kit.badge}
                    </span>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                      {kit.name}
                    </h2>
                    <p className="text-xs sm:text-sm text-rose font-medium mt-0.5">
                      {kit.tagline}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-serif font-bold text-2xl sm:text-3xl text-indigo">
                      ₹{kit.price}
                    </span>
                    <div className="text-[10px] text-emerald-600 font-bold uppercase">
                      Free 10-Min Drop
                    </div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {kit.description}
                </p>

                {/* Exact Text Kit Features */}
                <div className="pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                    What’s Inside This Kit:
                  </h4>
                  <ul className="space-y-2">
                    {kit.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Best For Scenario */}
                <div className="p-3 rounded-2xl bg-lavender/50 border border-lavender-border text-xs text-indigo">
                  <strong className="font-semibold">Ideal For:</strong> {kit.idealFor}
                </div>
              </div>
            </div>

            {/* Bottom Add to Cart Button */}
            <div className="p-6 sm:p-8 pt-0">
              <button
                onClick={() => addToCart(kit)}
                className="w-full py-3.5 px-6 rounded-2xl bg-indigo hover:bg-indigo-dark text-white font-bold text-sm shadow-md shadow-indigo/20 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {kit.shortName} · ₹{kit.price}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Cross link to Hot Water Bag */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-[#fdeaf2] via-[#fdf2f7] to-[#fff0f5] border border-[#f8c9dc] flex flex-col sm:flex-row items-center justify-between gap-6 shadow-soft">
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-rose">
            Pair with Warmth
          </span>
          <h3 className="font-serif font-bold text-2xl text-indigo">
            Cozy Knit Hot Water Bag · ₹349
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg">
            Soft cable-knit cover over a leak-resistant reusable bag. Available in 7 aesthetic pastel knit colours.
          </p>
        </div>
        <Link
          to="/hot-water-bag"
          className="shrink-0 px-6 py-3.5 rounded-full bg-indigo hover:bg-indigo-dark text-white font-bold text-sm shadow-md flex items-center gap-2 transition-transform hover:scale-105"
        >
          <span>Choose Knit Colour</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

    </div>
  );
}
