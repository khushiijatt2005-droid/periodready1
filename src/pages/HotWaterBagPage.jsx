import React, { useState, useEffect } from 'react';
import { ShoppingBag, Check, ShieldCheck, Heart, Zap, Flame, RefreshCw } from 'lucide-react';
import { PRODUCTS, HOT_WATER_BAG_COLORS } from '../data/products';
import ProductImageSlider from '../components/ProductImageSlider';
import { useCart } from '../context/CartContext';

export default function HotWaterBagPage() {
  const { addToCart } = useCart();
  const baseProduct = PRODUCTS.find(p => p.id === 'hot-water-bag');

  const [selectedColor, setSelectedColor] = useState(HOT_WATER_BAG_COLORS[0]); // Light Pink default

  // Preload all 7 color images (both Slide 1 bag and Slide 2 tag close-up) in browser cache
  useEffect(() => {
    HOT_WATER_BAG_COLORS.forEach((col) => {
      const img1 = new Image();
      img1.src = col.image;
      const img2 = new Image();
      img2.src = col.tagImage;
    });
  }, []);

  // Construct slider images: recolored full bag photo first (Slide 1), then recolored tag close-up (Slide 2)
  const sliderImages = [
    {
      url: selectedColor.image,
      alt: `Cozy Knit Hot Water Bag in ${selectedColor.name} with leaf tag`
    },
    {
      url: selectedColor.tagImage,
      alt: `Cozy Knit Hot Water Bag Signature Leaf Tag in ${selectedColor.name}`
    }
  ];

  const handleAddToCart = () => {
    addToCart(baseProduct, {
      color: selectedColor.name,
      image: selectedColor.image,
      quantity: 1
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-12">
      
      {/* Product Hero */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        
        {/* Left: Product Slider with Tag Close-up */}
        <div className="lg:col-span-7">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-lavender-border shadow-soft">
            <ProductImageSlider images={sliderImages} />
          </div>
        </div>

        {/* Right: Product Details, Colour Selector & Add to Cart */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush text-rose text-xs font-bold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5" />
              Cramp &amp; Back Ache Soother
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-indigo tracking-tight">
              {baseProduct.name}
            </h1>
            <p className="font-serif italic text-base text-rose font-medium">
              Soft cable-knit cover over a reusable, leak-resistant bag, for cramps and back ache.
            </p>
            <div className="flex items-baseline gap-3 pt-1">
              <span className="font-serif font-bold text-3xl text-indigo">
                ₹{baseProduct.price}
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                10-Min Fast Gate Delivery
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Engineered for debilitating menstrual cramps and lower back pain. Wrapped in a premium removable cable-knit sleeve that holds soothing thermal heat for hours, protecting sensitive skin against direct burns.
          </p>

          {/* 7 ROUND COLOUR BUTTONS */}
          <div className="p-5 rounded-2xl bg-white border border-lavender-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Knit Colour:
              </label>
              <span className="text-xs font-semibold text-rose">
                {selectedColor.name}
              </span>
            </div>

            {/* Seven round colour buttons */}
            <div className="flex items-center gap-3 overflow-x-auto py-1">
              {HOT_WATER_BAG_COLORS.map((col) => {
                const isSelected = selectedColor.name === col.name;
                return (
                  <button
                    key={col.name}
                    onClick={() => setSelectedColor(col)}
                    aria-label={`Select ${col.name}`}
                    title={col.name}
                    style={{ backgroundColor: col.hex }}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 transition-all flex items-center justify-center shrink-0 ${
                      isSelected 
                        ? 'border-indigo scale-110 shadow-md ring-2 ring-indigo/30' 
                        : 'border-slate-300 hover:scale-105'
                    }`}
                  >
                    {isSelected && (
                      <Check className={`w-4 h-4 stroke-[3] ${col.name === 'White' ? 'text-slate-900' : 'text-indigo'}`} />
                    )}
                  </button>
                );
              })}
            </div>
            
            <p className="text-[11px] text-slate-400">
              Tapping a colour instantly recolours the knit body of the bag while keeping the spout, handle and leaf tag authentic.
            </p>
          </div>

          {/* Add to Cart Button */}
          <div className="space-y-3 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-4 px-6 rounded-2xl bg-indigo hover:bg-indigo-dark text-white font-bold text-sm sm:text-base shadow-lg shadow-indigo/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Add {baseProduct.shortName} ({selectedColor.name}) · ₹{baseProduct.price}</span>
            </button>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Delivered in 100% plain, discreet packaging in ~10 mins</span>
            </div>
          </div>

          {/* Product Highlights */}
          <div className="border-t border-slate-200 pt-5 space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Product Highlights:
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
              {baseProduct.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Warmth & Cramp Guide Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
        <div className="p-6 rounded-3xl bg-white border border-lavender-border shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blush text-rose flex items-center justify-center mb-2">
            <Flame className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Immediate Cramp Relaxation</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Thermal heat increases pelvic blood circulation, relaxing uterine muscle contractions to ease sharp cramps in minutes.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-lavender-border shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-xl bg-lavender text-indigo flex items-center justify-center mb-2">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">Soft Cable-Knit Shield</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            No sharp plastic against your skin. The soft knit cover protects from heat spikes while providing snug hug-like warmth.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-lavender-border shadow-soft space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-slate-900">10-Min Emergency Drop</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Stuck in bed with severe cramps in your PG or hostel? We dispatch immediately to your gate so you don't have to suffer.
          </p>
        </div>
      </div>

    </div>
  );
}
