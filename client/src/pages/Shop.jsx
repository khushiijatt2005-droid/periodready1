import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingBag, ShieldCheck, CheckCircle, SlidersHorizontal } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [maxPrice, setMaxPrice] = useState(500);

  const { addToCart } = useCart();
  const { addToast } = useToast();

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

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      if (selectedTier !== 'All' && product.tier.toLowerCase() !== selectedTier.toLowerCase()) {
        return false;
      }
      if (product.basePrice > maxPrice) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(q);
        const matchesTagline = product.tagline.toLowerCase().includes(q);
        const matchesTier = product.tier.toLowerCase().includes(q);
        const matchesWhat = product.whatInside?.some((item) => item.item.toLowerCase().includes(q));
        return matchesName || matchesTagline || matchesTier || matchesWhat;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.basePrice - b.basePrice;
      if (sortBy === 'price-high') return b.basePrice - a.basePrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });

  const tiers = ['All', 'Emergency', 'Regular', 'Travel', 'Combo'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-black uppercase tracking-widest text-brand-accent">
          PeriodReady Collection
        </span>
        <h1 className="text-3xl sm:text-5xl font-heading font-black text-brand-purple">
          Discreet Menstrual Emergency Kits
        </h1>
        <p className="text-sm sm:text-base text-gray-600">
          Crafted for college and PG students and working professionals. Organic cotton pads, odor-proof disposal bags, soothing wipes, and cramp care. Choose your pack size.
        </p>
      </div>

      {/* Discreet Banner Reminder */}
      <div className="bg-purple-100/70 border border-purple-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 text-xs text-brand-purple font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All kits are shipped in 100% plain, discreet boxes with zero external product markings.</span>
        </div>
        <div className="text-xs font-bold text-brand-accent">
          Code: <span className="font-mono bg-white px-2 py-0.5 rounded border border-rose-200">STUDENT10</span> for 10% off
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-3xl p-5 shadow-soft border border-rose-100 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Tier Filter Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {tiers.map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedTier === tier
                  ? 'bg-brand-purple text-white shadow-soft'
                  : 'bg-brand-blush text-gray-700 hover:bg-rose-100/60'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Search Input and Sort Dropdown */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search kits, pads, wipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple bg-brand-blush/40"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-700 bg-white focus:outline-none focus:border-brand-purple"
            >
              <option value="popular">Most Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-96 rounded-3xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-rose-100">
          <div className="w-16 h-16 mx-auto mb-4 bg-brand-blush rounded-full flex items-center justify-center text-brand-purple">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-gray-800">No emergency kits match your filter</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or selecting 'All' tiers.
          </p>
          <button
            onClick={() => {
              setSelectedTier('All');
              setSearchQuery('');
            }}
            className="mt-5 px-5 py-2.5 rounded-full bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => {
            const defaultVariant = product.variants?.find((v) => v.isDefault) || product.variants?.[0];
            const hasStock = (defaultVariant?.stock || 50) > 0;

            return (
              <div
                key={product._id || product.id}
                className="bg-white rounded-3xl p-6 shadow-soft hover:shadow-soft-lg transition-all duration-300 border border-rose-100 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Canvas */}
                  <Link
                    to={`/product/${product._id || product.id}`}
                    className="block aspect-[4/3] rounded-2xl bg-brand-blush/60 overflow-hidden mb-5 border border-white"
                  >
                    <img
                      src={product.frontImage || defaultVariant?.image || product.images?.[0]}
                      alt={product.name}
                      className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  {/* Badges */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-brand-accent">
                      {product.tier}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-gray-700">
                      <Star className="w-3.5 h-3.5 text-brand-yellow fill-brand-yellow" />
                      <span>{product.rating}</span>
                      <span className="text-gray-400">({product.reviewsCount})</span>
                    </div>
                  </div>

                  <Link to={`/product/${product._id || product.id}`}>
                    <h3 className="font-heading font-black text-xl text-brand-purple group-hover:text-brand-accent transition">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {product.tagline}
                  </p>

                  {/* Interactive Circular Color Selection Dots if product has colors */}
                  {product.colors && product.colors.length > 0 && (
                    <div className="mt-3 flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Colors:</span>
                      {product.colors.map((c, i) => (
                        <span
                          key={i}
                          className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                        />
                      ))}
                      <span className="text-[10px] text-brand-purple font-bold ml-1">7 shades</span>
                    </div>
                  )}

                  {/* What's Inside Snippet */}
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-1.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-gray-700">
                      What's Inside:
                    </p>
                    {(product.whatInside || []).slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
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

                  {/* Box Color Swatches */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-xs text-gray-500">
                      <span className="text-[11px] text-gray-700 font-bold">100% Plain Discreet Outer Box</span>
                    </div>
                  </div>
                </div>

                {/* Footer Action and Price */}
                <div className="mt-6 pt-4 border-t border-rose-100">
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <span className="text-[11px] text-gray-500">Starts at</span>
                      <div className="text-2xl font-black text-brand-purple">
                        ₹{product.basePrice}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] text-emerald-600 font-bold block">
                        {hasStock ? 'In Stock' : 'Low Stock'}
                      </span>
                      <span className="text-xs text-gray-400">Discreet packaging</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleQuickAdd(product)}
                      className="py-2.5 px-3 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Bag</span>
                    </button>
                    <Link
                      to={`/product/${product._id || product.id}`}
                      className="py-2.5 px-3 rounded-xl border border-brand-purple/30 text-brand-purple text-xs font-bold hover:bg-purple-50 transition text-center"
                    >
                      View Kit & Details
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
