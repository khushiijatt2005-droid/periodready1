import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Star,
  ShoppingBag,
  Zap,
  CheckCircle,
  Truck,
  RotateCcw,
  Package,
  Sparkles,
  Flame,
  Feather,
  Heart,
  HelpCircle,
  Clock,
  Layers,
  AlertCircle,
  ArrowRight,
  Camera,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  Eye,
  Check,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import AvailableEverywhere from '../components/AvailableEverywhere';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPackSize, setSelectedPackSize] = useState('1 Kit');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [selectedColor, setSelectedColor] = useState(null);

  const { addToCart } = useCart();
  const { addToast } = useToast();

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setActiveImageIndex(0);
    setPhotoZoom(1);
    fetch(`/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('Product not found');
        return res.json();
      })
      .then((result) => {
        setData(result);
        if (result.product?.colors && result.product.colors.length > 0) {
          setSelectedColor(result.product.colors[0]);
        } else {
          setSelectedColor(null);
        }
        if (result.variants && result.variants.length > 0) {
          const defaultVar = result.variants.find((v) => v.isDefault) || result.variants[0];
          setSelectedPackSize(defaultVar.packSize);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleColorSelect = (col) => {
    setSelectedColor(col);
    if (data?.variants) {
      const match = data.variants.find(
        (v) => (v.colorName && v.colorName.toLowerCase() === col.name.toLowerCase()) ||
               (v.packSize && v.packSize.toLowerCase() === col.name.toLowerCase())
      );
      if (match) setSelectedPackSize(match.packSize);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs text-gray-500 font-semibold tracking-wider uppercase">Loading Product Experience...</p>
      </div>
    );
  }

  if (!data || !data.product) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-heading font-bold text-gray-800">Kit Not Found</h2>
        <p className="text-gray-500">The requested emergency kit does not exist or has been relocated.</p>
        <Link to="/shop" className="inline-block bg-brand-purple text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-soft">
          Back to Shop
        </Link>
      </div>
    );
  }

  const { product, variants, related, salesChannels } = data;
  const isCombo = product.tier === 'Combo' || product.category === 'combo';

  // Find currently active variant based on selectedPackSize
  const currentVariant =
    variants.find((v) => v.packSize.toLowerCase() === selectedPackSize.toLowerCase()) ||
    variants[0] || {
      price: product.basePrice,
      comparePrice: product.comparePrice || Math.round(product.basePrice * 1.3),
      stock: 50,
      sku: 'PR-DEFAULT',
      packSize: isCombo ? '1 Complete Box' : '1 Kit'
    };

  const handleAddToCart = () => {
    addToCart(product, currentVariant, quantity);
    addToast(`Added ${quantity}x ${product.name} (${currentVariant.packSize}) to bag!`, 'success');
  };

  const handleBuyNow = () => {
    addToCart(product, currentVariant, quantity);
    navigate('/checkout');
  };

  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'Flame':
        return <Flame className="w-5 h-5 text-brand-accent" />;
      case 'Feather':
        return <Feather className="w-5 h-5 text-purple-600" />;
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-amber-500" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-indigo-500" />;
      case 'Package':
        return <Package className="w-5 h-5 text-brand-purple" />;
      case 'CheckCircle':
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-gray-500 flex items-center gap-2">
        <Link to="/" className="hover:text-brand-purple">
          Home
        </Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-brand-purple">
          Shop Kits
        </Link>
        <span>/</span>
        <span className="text-brand-purple font-semibold">{product.name}</span>
      </nav>

      {/* 
        ============================================================
        1. FIRST ELEMENT ON PRODUCT PAGE: 2-SLIDE PRODUCT GALLERY
        ============================================================
        - Exactly 2 slides per product (Slide 1: Exterior / Slide 2: Inside)
        - Dark charcoal spotlight stage, zero crops, object-fit: contain
        - Left & Right navigation arrows, Zoom controls HUD
      */}
      {(() => {
        const slideLabels = isCombo
          ? [
              { title: 'Master Mailer Box', sub: 'Slide 1: Luxury navy mailer box with sticker seal' },
              { title: "All 3 Kits Inside", sub: 'Slide 2: Regular, Travel & Emergency kits unpacked' }
            ]
          : product._id === 'prod_hot_water_bag'
          ? [
              { title: 'Cozy Cable-Knit Bag', sub: 'Slide 1: Front standing view with signature logo tag' },
              { title: 'Branded Tag & Texture Detail', sub: 'Slide 2: Close-up showing knit texture & metal ring tag' }
            ]
          : [
              { title: 'Kit Box Exterior', sub: 'Slide 1: Front box design with signature branding' },
              { title: "What's Inside (Unboxed)", sub: 'Slide 2: Complete hygiene essentials unpacked inside' }
            ];

        const slides = (product.images && product.images.length >= 2)
          ? product.images.slice(0, 2)
          : [product.frontImage || '/images/products/regular-front.jpg', product.insideImage || product.frontImage];

        const handlePrevSlide = () => {
          setActiveImageIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
          setPhotoZoom(1);
        };

        const handleNextSlide = () => {
          setActiveImageIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
          setPhotoZoom(1);
        };

        return (
          <section className="space-y-4">
            {/* Gallery Header Pill */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-brand-purple px-4 py-2 rounded-2xl border border-purple-200 shadow-2xs font-bold text-xs">
                <Camera className="w-4 h-4 text-brand-accent" />
                <span>High-Resolution Photo Gallery (2 Slides)</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-semibold">
                  Slide {activeImageIndex + 1} of {slides.length}:
                </span>
                <span className="text-xs font-bold text-brand-purple">
                  {slideLabels[activeImageIndex]?.title || `Slide ${activeImageIndex + 1}`}
                </span>
              </div>
            </div>

            {/* Media Stage */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 group">
              <div
                className="relative w-full aspect-[4/3] sm:aspect-[16/9] lg:aspect-[2/1] flex items-center justify-center p-4 sm:p-8 overflow-hidden select-none"
                style={{
                  background: 'radial-gradient(ellipse at 50% 55%, #2a203b 0%, #171522 45%, #0d0c13 80%, #060608 100%)',
                }}
              >
                {/* Spotlight Glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: 'radial-gradient(circle at 50% 50%, rgba(217, 70, 239, 0.09) 0%, rgba(85, 29, 130, 0.12) 30%, transparent 70%)',
                  }}
                />

                {/* Soft Vignette Overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    boxShadow: 'inset 0 0 100px rgba(0,0,0,0.85)',
                  }}
                />

                {/* High-Resolution Photo */}
                <div
                  className="relative z-10 w-full h-full flex items-center justify-center transition-transform duration-200"
                  style={{
                    transform: `scale(${photoZoom})`,
                  }}
                >
                  <div className="relative w-full h-full max-h-[92%] flex items-center justify-center">
                    <img
                      src={slides[activeImageIndex]}
                      alt={`${product.name} - ${slideLabels[activeImageIndex]?.title}`}
                      style={{
                        filter: (product._id === 'prod_hot_water_bag' && activeImageIndex !== 0)
                          ? 'none'
                          : (selectedColor?.colorFilter || 'none')
                      }}
                      className="w-full h-full object-contain pointer-events-none select-none transition-all duration-300 drop-shadow-2xl product-gallery-img"
                    />
                    {/* Hot Water Bag Signature Tag Overlay: Keeps PeriodReady Logo and Canvas Tag 100% Original and Brand-Consistent When Bag Color Changes */}
                    {product._id === 'prod_hot_water_bag' && activeImageIndex === 0 && (
                      <img
                        src="/images/products/hot-water-bag-tag.png"
                        alt="PeriodReady Signature Logo Tag"
                        style={{ filter: 'none' }}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none select-none product-gallery-img"
                      />
                    )}
                  </div>
                </div>

                {/* Previous Slide Arrow */}
                <button
                  onClick={handlePrevSlide}
                  className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-brand-purple text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
                  title="Previous Slide"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Next Slide Arrow */}
                <button
                  onClick={handleNextSlide}
                  className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-brand-purple text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95"
                  title="Next Slide"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Slide Info Pill (Top Left) */}
                <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-black/75 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-white shadow-lg">
                  <Camera className="w-3.5 h-3.5 text-brand-yellow" />
                  <span className="text-xs font-bold tracking-wide">
                    {slideLabels[activeImageIndex]?.title}
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    ({activeImageIndex + 1}/2)
                  </span>
                </div>

                {/* Slide Indicator Dots (Top Right) */}
                <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 shadow-lg">
                  {slides.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setPhotoZoom(1);
                      }}
                      className={`h-2 rounded-full transition-all ${
                        activeImageIndex === idx ? 'w-6 bg-brand-yellow' : 'w-2 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Zoom Controls HUD (Bottom Right) */}
                <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md p-1.5 rounded-2xl border border-white/15 text-white shadow-xl">
                  <button
                    onClick={() => setPhotoZoom((z) => Math.max(1.0, z - 0.25))}
                    disabled={photoZoom <= 1.0}
                    className="p-2 rounded-xl hover:bg-white/10 transition disabled:opacity-30"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[11px] font-mono px-2 font-bold text-amber-300">
                    {Math.round(photoZoom * 100)}%
                  </span>
                  <button
                    onClick={() => setPhotoZoom((z) => Math.min(2.5, z + 0.25))}
                    disabled={photoZoom >= 2.5}
                    className="p-2 rounded-xl hover:bg-white/10 transition disabled:opacity-30"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                  {photoZoom > 1.0 && (
                    <button
                      onClick={() => setPhotoZoom(1.0)}
                      className="p-2 rounded-xl text-gray-400 hover:text-white transition"
                      title="Reset Zoom"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Exactly 2 Thumbnails Cards Row */}
            <div className="bg-white rounded-3xl p-4 sm:p-5 border border-rose-100 shadow-soft">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="font-bold text-gray-800">Product Views (Click to Switch):</span>
                <span className="text-[11px] text-gray-500 font-semibold">2 Slides Total</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {slides.map((img, idx) => {
                  const label = slideLabels[idx] || { title: `Slide ${idx + 1}`, sub: '' };
                  const isActive = activeImageIndex === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setActiveImageIndex(idx);
                        setPhotoZoom(1);
                      }}
                      className={`rounded-2xl p-3 border-2 text-left transition flex items-center gap-3.5 ${
                        isActive
                          ? 'border-brand-purple bg-purple-50/80 ring-2 ring-brand-purple/20 shadow-soft'
                          : 'border-gray-200 bg-white hover:border-brand-purple/40 hover:bg-gray-50'
                      }`}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-brand-blush/60 p-1 shrink-0 overflow-hidden border border-gray-100 flex items-center justify-center">
                        <img src={img} alt={label.title} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isActive ? 'bg-brand-purple text-white' : 'bg-gray-100 text-gray-600'
                          }`}>
                            Slide {idx + 1} of 2
                          </span>
                          {isActive && (
                            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-bold text-gray-900 block mt-1 truncate">
                          {label.title}
                        </span>
                        <span className="text-xs text-gray-500 block truncate">
                          {label.sub}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* 
        ============================================================
        2. PRODUCT DETAILS, PRICING, VARIANTS & ACTIONS
        ============================================================
      */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Kit Key Benefits & Packaging */}
        <div className="lg:col-span-5 space-y-4">
          {/* Key Features Quick Card */}
          <div className="bg-white rounded-3xl p-6 border border-rose-100 shadow-soft space-y-4">
            <h3 className="font-heading font-black text-lg text-brand-purple">
              Why Choose the {product.name.split('(')[0].trim()}
            </h3>
            <div className="space-y-3">
              {(product.features || []).map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs text-gray-700 leading-relaxed">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Discreet Shipping Box Pill */}
          <div className="bg-purple-50/80 border border-purple-200/80 rounded-2xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-brand-purple shrink-0 mt-0.5" />
            <div className="text-xs text-brand-purple leading-relaxed">
              <span className="font-bold block">100% Discreet Outer Packaging Guaranteed</span>
              Delivered in an unmarked plain brown recyclable carton with zero external product markings or sanitary branding.
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Variant Selector & CTAs */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-black uppercase tracking-wider bg-brand-purple text-white px-3 py-1 rounded-full">
                {product.tier} Tier
              </span>
              {isCombo && (
                <span className="text-xs font-black uppercase tracking-wider bg-brand-yellow text-gray-950 px-3 py-1 rounded-full shadow-2xs">
                  ★ Best Value Bundle
                </span>
              )}
              <div className="flex items-center gap-1 text-xs font-bold text-gray-700 ml-2">
                <Star className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
                <span>{product.rating}</span>
                <span className="text-gray-400">({product.reviewsCount} verified reviews)</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-heading font-black text-brand-purple">
              {product.name}
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-brand-accent mt-1">
              {product.tagline}
            </p>
            <p className="text-sm text-gray-600 mt-3 leading-relaxed">{product.description}</p>
          </div>

          {/* Price Box */}
          <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-amber-50 p-5 rounded-2xl border border-purple-200 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
                ₹{currentVariant.price}
              </span>
              {currentVariant.comparePrice && currentVariant.comparePrice > currentVariant.price && (
                <>
                  <span className="text-base text-gray-400 line-through font-semibold">
                    ₹{currentVariant.comparePrice}
                  </span>
                  <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                    Save ₹{currentVariant.comparePrice - currentVariant.price}
                  </span>
                </>
              )}
            </div>

            {isCombo && (
              <div className="text-xs text-brand-purple font-bold pt-1 border-t border-purple-200/50 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-yellow shrink-0" />
                <span>Individual Value: ₹179 + ₹249 + ₹49 = ₹477 • <strong>You Save ₹78 on this Combo!</strong></span>
              </div>
            )}
          </div>

          {/* Color Selector: 7 Circular Pastel Swatches for Hot Water Bag or custom color products */}
          {product.colors && product.colors.length > 0 ? (
            <div className="space-y-3 bg-brand-blush/40 p-4 rounded-2xl border border-rose-100">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-800">
                  Select Color: <span className="text-brand-purple font-black">{selectedColor?.name || product.colors[0].name}</span>
                </span>
                <span className="text-[11px] text-brand-accent font-bold">7 Pastel Knit Colors</span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                {product.colors.map((col, idx) => {
                  const isSelected = (selectedColor?.name || product.colors[0].name) === col.name;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleColorSelect(col)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-2xs ${
                        isSelected
                          ? 'border-brand-purple bg-white text-brand-purple ring-2 ring-brand-purple/30 font-black scale-105'
                          : 'border-gray-200 bg-white/80 text-gray-700 hover:bg-white hover:border-gray-300'
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full border border-black/15 shrink-0"
                        style={{ backgroundColor: col.hex }}
                      />
                      <span>{col.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Variant Selector: Pack Size */
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-gray-800">
                  Select Pack Size: <span className="text-brand-purple font-black">{selectedPackSize}</span>
                </span>
                {!isCombo && (
                  <span className="text-emerald-700 font-bold">Multi-packs save up to 15%</span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2.5">
                {variants.map((v) => {
                  const isSelected = selectedPackSize.toLowerCase() === v.packSize.toLowerCase();
                  return (
                    <button
                      key={v._id || v.packSize}
                      onClick={() => setSelectedPackSize(v.packSize)}
                      className={`py-3 px-3 rounded-2xl border text-center transition ${
                        isSelected
                          ? 'border-brand-purple bg-purple-50 text-brand-purple font-black shadow-soft ring-2 ring-brand-purple/20'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-xs font-bold">{v.packSize}</div>
                      <div className="text-sm font-black mt-0.5">₹{v.price}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stock, SKU & Quantity Stepper */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="text-xs">
              <span className="text-gray-500">SKU: </span>
              <span className="font-mono font-bold text-gray-700">{currentVariant.sku}</span>
              <div className="text-emerald-600 font-bold mt-0.5">
                {currentVariant.stock > 0 ? `✓ In Stock (${currentVariant.stock} available)` : 'Out of stock'}
              </div>
            </div>

            <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm"
              >
                -
              </button>
              <span className="px-4 py-2 text-sm font-bold text-gray-800">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(currentVariant.stock, quantity + 1))}
                className="px-3.5 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm"
              >
                +
              </button>
            </div>
          </div>

          {/* Action CTAs: Add to Cart and Buy Now */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={currentVariant.stock <= 0}
              className="py-4 px-6 rounded-2xl bg-white border-2 border-brand-purple text-brand-purple font-bold text-sm hover:bg-purple-50 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Add to Bag</span>
            </button>
            <button
              onClick={handleBuyNow}
              disabled={currentVariant.stock <= 0}
              className="py-4 px-6 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleDark transition flex items-center justify-center gap-2 shadow-soft hover:shadow-soft-lg disabled:opacity-50"
            >
              <Zap className="w-4 h-4 text-brand-yellow fill-brand-yellow" />
              <span>Buy Now (Direct Checkout)</span>
            </button>
          </div>

          {/* Delivery Note */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-brand-purple shrink-0" />
              <span>Standard Website Delivery (2-4 Days)</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-purple shrink-0" />
              <span>Free Exchanges & Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* 
        ============================================================
        3. "WHAT'S INSIDE" CHECKLIST
        ============================================================
      */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-soft border border-rose-100 space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs uppercase font-extrabold tracking-widest text-brand-accent">
            Uncompromising Readiness
          </span>
          <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple">
            What's Inside Every {product.name}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600">
            Each item is individually sanitized, sealed, and ready for discreet emergency use.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(product.whatInside || []).map((item, idx) => (
            <div
              key={idx}
              className="bg-brand-blush/60 rounded-2xl p-4 border border-rose-100 flex items-start gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm shrink-0">
                {renderIcon(item.icon)}
              </div>
              <div>
                <span className="text-[10px] font-black text-brand-accent uppercase tracking-wider block">
                  {typeof item.count === 'number' ? `${item.count} Included` : item.count}
                </span>
                <h4 className="font-heading font-bold text-sm text-brand-purple mt-0.5">{item.item}</h4>
              </div>
            </div>
          ))}
        </div>

        {/* Drug Licensing Disclaimer for Emergency Kit Painkiller Tablets */}
        {product.tier === 'Emergency' && !product.includePainkillerTablets && (
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-gray-500">
            <AlertCircle className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
            <span>
              <strong>Note on Painkiller Tablets:</strong> Under standard drug-licensing regulations, OTC painkiller tablets are excluded by default and can be enabled only where permitted by qualified medical dispensary licenses.
            </span>
          </div>
        )}

        {product.tier === 'Emergency' && product.includePainkillerTablets && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>2 x Approved Painkiller Tablets Included:</strong> Sealed in pharmaceutical tamper-evident foil blister for quick, unexpected cramp relief on the go.
            </span>
          </div>
        )}
      </div>

      {/* 
        ============================================================
        4. "AVAILABLE EVERYWHERE" MULTI-CHANNEL SECTION
        ============================================================
      */}
      <AvailableEverywhere
        productId={product._id}
        initialChannels={salesChannels}
        title={`Order ${product.name} on Your Favourite App`}
      />

      {/* 
        ============================================================
        5. RELATED KITS
        ============================================================
      */}
      {related && related.length > 0 && (
        <div className="space-y-6">
          <h3 className="font-heading font-black text-2xl text-brand-purple">Compare Other Kit Tiers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {related.map((rel) => (
              <div
                key={rel._id || rel.id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex flex-col justify-between group"
              >
                <div>
                  <div className="aspect-[4/3] rounded-2xl bg-brand-blush/50 p-3 mb-4 overflow-hidden flex items-center justify-center">
                    <img src={rel.frontImage || rel.images?.[0]} alt={rel.name} className="max-h-full object-contain group-hover:scale-105 transition-transform" />
                  </div>
                  <span className="text-[10px] font-black uppercase text-brand-accent tracking-wider">
                    {rel.tier} Tier
                  </span>
                  <h4 className="font-heading font-bold text-base text-brand-purple mt-1">{rel.name}</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rel.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between">
                  <div className="text-lg font-black text-brand-purple">₹{rel.basePrice}</div>
                  <Link
                    to={`/product/${rel._id || rel.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft"
                  >
                    View Kit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
