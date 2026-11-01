import React, { useState, useEffect } from 'react';
import { ExternalLink, Zap, ShoppingBag, Clock, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function AvailableEverywhere({ productId = null, initialChannels = null, title = "Available Everywhere" }) {
  const [channels, setChannels] = useState(initialChannels || []);
  const [loading, setLoading] = useState(!initialChannels);

  useEffect(() => {
    if (initialChannels && initialChannels.length > 0) {
      setChannels(initialChannels);
      setLoading(false);
      return;
    }

    const url = productId ? `/api/sales-channels?productId=${productId}` : '/api/sales-channels';
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load sales channels:', err);
        setLoading(false);
      });
  }, [productId, initialChannels]);

  // Filter out any hidden channels
  const visibleChannels = channels.filter((c) => c.status !== 'Hidden');

  // Deduplicate by platform so each platform appears EXACTLY ONCE (no 4x duplicates!)
  const uniqueChannelsMap = new Map();
  visibleChannels.forEach((c) => {
    if (!uniqueChannelsMap.has(c.platform)) {
      uniqueChannelsMap.set(c.platform, c);
    }
  });
  const uniqueChannels = Array.from(uniqueChannelsMap.values());

  // Separate into 10-min apps and marketplaces (exactly 1 card per platform)
  const quickCommerce = uniqueChannels.filter((c) => c.type === 'quick-commerce');
  const marketplaces = uniqueChannels.filter((c) => c.type === 'marketplace');

  // Color schemes for platforms
  const platformStyles = {
    Blinkit: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      badge: 'bg-yellow-400 text-gray-950',
      button: 'bg-yellow-400 hover:bg-yellow-500 text-gray-950 font-black',
      tag: '10-Min Delivery'
    },
    Zepto: {
      bg: 'bg-purple-50',
      border: 'border-purple-200',
      badge: 'bg-purple-700 text-white',
      button: 'bg-purple-700 hover:bg-purple-800 text-white font-black',
      tag: '10-Min Delivery'
    },
    Instamart: {
      bg: 'bg-orange-50',
      border: 'border-orange-200',
      badge: 'bg-orange-500 text-white',
      button: 'bg-orange-500 hover:bg-orange-600 text-white font-black',
      tag: '10-Min Delivery'
    },
    Amazon: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      badge: 'bg-slate-800 text-white',
      button: 'bg-slate-900 hover:bg-black text-white font-black',
      tag: 'Marketplace'
    },
    Flipkart: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      badge: 'bg-blue-600 text-white',
      button: 'bg-blue-600 hover:bg-blue-700 text-white font-black',
      tag: 'Marketplace'
    },
    Myntra: {
      bg: 'bg-pink-50',
      border: 'border-pink-200',
      badge: 'bg-pink-600 text-white',
      button: 'bg-pink-600 hover:bg-pink-700 text-white font-black',
      tag: 'Marketplace'
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-8 border border-rose-100 shadow-soft animate-pulse">
        <div className="h-6 w-48 bg-gray-200 rounded-full mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-32 bg-gray-100 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  if (visibleChannels.length === 0) {
    return null;
  }

  const renderCard = (channel) => {
    const style = platformStyles[channel.platform] || {
      bg: 'bg-gray-50',
      border: 'border-gray-200',
      badge: 'bg-gray-800 text-white',
      button: 'bg-gray-800 hover:bg-gray-900 text-white font-bold',
      tag: channel.badge || 'Platform'
    };
    const isLive = channel.status === 'Live';

    return (
      <div
        key={channel._id || `${channel.productId}-${channel.platform}`}
        className={`rounded-2xl p-5 border ${style.border} ${style.bg} transition-all duration-200 hover:shadow-soft flex flex-col justify-between`}
      >
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className={`text-[10px] uppercase font-black px-2.5 py-1 rounded-full ${style.badge}`}>
              {channel.platform}
            </span>
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                isLive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-gray-200/80 text-gray-600 font-medium'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-600 animate-pulse' : 'bg-gray-400'}`} />
              {isLive ? 'LIVE' : 'COMING SOON'}
            </span>
          </div>

          <h4 className="font-heading font-black text-base text-gray-900">
            {channel.platform}
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            {channel.type === 'quick-commerce'
              ? '⚡ Instant door delivery in ~10 minutes'
              : '📦 Standard delivery via verified store'}
          </p>
        </div>

        <div className="mt-5 pt-3 border-t border-black/5">
          {isLive ? (
            <a
              href={channel.url || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className={`w-full py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-xs ${style.button}`}
            >
              <span>Order on {channel.platform}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <button
              disabled
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-gray-200 text-gray-500 cursor-not-allowed flex items-center justify-center gap-1.5"
            >
              <span>Launching Soon</span>
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white rounded-3xl p-6 sm:p-10 border border-rose-100 shadow-soft space-y-8">
      <div className="max-w-3xl space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-accent/10 text-brand-accent text-xs font-black uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>Multi-Channel Availability</span>
        </div>
        <h3 className="font-heading font-black text-2xl sm:text-3xl text-brand-purple">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Need an emergency kit right away? Order on India's top 10-minute delivery apps, or shop via trusted online marketplaces.
        </p>
      </div>

      {/* Quick-Commerce Section (10-Minute Apps) */}
      {quickCommerce.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <Clock className="w-4 h-4 text-brand-purple" />
            <span>10-Minute Quick Commerce (Instant Emergency Delivery)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {quickCommerce.map(renderCard)}
          </div>
        </div>
      )}

      {/* Marketplaces Section */}
      {marketplaces.length > 0 && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
            <ShoppingBag className="w-4 h-4 text-brand-purple" />
            <span>E-Commerce Marketplaces</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marketplaces.map(renderCard)}
          </div>
        </div>
      )}

      {/* Plain Discreet Packaging Guarantee Note */}
      <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2.5 text-xs text-brand-purple font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>All orders across every platform are fulfilled in 100% plain, discreet boxes with zero external sanitary markings.</span>
        </div>
        <div className="text-[11px] font-bold text-gray-500">
          Target Audience: College & PG Students and Working Professionals
        </div>
      </div>
    </section>
  );
}
