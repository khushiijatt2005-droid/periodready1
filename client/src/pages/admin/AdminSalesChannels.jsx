import React, { useState, useEffect } from 'react';
import { ExternalLink, Save, CheckCircle, Search, Filter, Globe, Zap, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminSalesChannels() {
  const { adminToken, token } = useAuth();
  const authToken = adminToken || token;
  const { addToast } = useToast();
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState('All');
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    fetchChannels();
  }, [authToken]);

  const fetchChannels = () => {
    setLoading(true);
    fetch('/api/admin/sales-channels', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then((res) => res.json())
      .then((data) => {
        setChannels(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        addToast('Failed to load sales channels', 'error');
        setLoading(false);
      });
  };

  const handleUpdate = (channelId, updates) => {
    setChannels((prev) =>
      prev.map((c) => (c._id === channelId ? { ...c, ...updates } : c))
    );
  };

  const saveChannel = async (channel) => {
    setSavingId(channel._id);
    try {
      const res = await fetch(`/api/admin/sales-channels/${channel._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`
        },
        body: JSON.stringify({
          url: channel.url,
          status: channel.status,
          logo: channel.logo
        })
      });

      if (!res.ok) throw new Error('Failed to update channel');
      addToast(`Updated ${channel.platform} for ${channel.productName || 'Product'}!`, 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSavingId(null);
    }
  };

  // Distinct products
  const products = ['All', ...new Set(channels.map((c) => c.productName || c.productId))];

  const filteredChannels = channels.filter((c) => {
    if (selectedProduct !== 'All' && (c.productName || c.productId) !== selectedProduct) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900">
            Sales Channels Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure external ordering platforms per kit. Set status to <strong>Live</strong> to show active "Order" buttons, or <strong>Coming Soon / Hidden</strong>.
          </p>
        </div>
      </div>

      {/* Information Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 text-xs text-amber-900">
        <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block">Sales Channel Display Rule</span>
          Platforms are only shown as available for order when their status is explicitly set to <strong>Live</strong>. When set to <strong>Coming Soon</strong>, customers see a disabled "Launching Soon" badge. <strong>Hidden</strong> channels will not appear at all on the storefront.
        </div>
      </div>

      {/* Filter by Product */}
      <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-soft flex items-center gap-3 overflow-x-auto scrollbar-none">
        <span className="text-xs font-bold text-gray-500 shrink-0">Filter Product:</span>
        {products.map((pName) => (
          <button
            key={pName}
            onClick={() => setSelectedProduct(pName)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition ${
              selectedProduct === pName
                ? 'bg-brand-purple text-white shadow-soft'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {pName}
          </button>
        ))}
      </div>

      {/* Channels Table / Card List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-gray-100 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : filteredChannels.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200">
          <Globe className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <h3 className="font-heading font-bold text-lg text-gray-700">No Sales Channels Found</h3>
          <p className="text-xs text-gray-500 mt-1">Try switching product filter or reseed database.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredChannels.map((channel) => (
            <div
              key={channel._id}
              className="bg-white rounded-2xl p-5 border border-gray-200 shadow-soft hover:shadow-soft-lg transition space-y-4"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-purple block">
                    {channel.productName}
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-lg font-black text-gray-900">{channel.platform}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {channel.type === 'quick-commerce' ? '⚡ 10-Min App' : '📦 Marketplace'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={channel.status}
                    onChange={(e) => handleUpdate(channel._id, { status: e.target.value })}
                    className={`text-xs font-black px-3 py-1.5 rounded-xl border focus:outline-none ${
                      channel.status === 'Live'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : channel.status === 'Coming Soon'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-gray-100 text-gray-600 border-gray-300'
                    }`}
                  >
                    <option value="Live">🟢 Live</option>
                    <option value="Coming Soon">⏳ Coming Soon</option>
                    <option value="Hidden">🚫 Hidden</option>
                  </select>
                </div>
              </div>

              {/* URL Input */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600 flex items-center justify-between">
                  <span>Product URL on {channel.platform}:</span>
                  {channel.url && (
                    <a
                      href={channel.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-purple hover:underline inline-flex items-center gap-1 font-semibold text-[10px]"
                    >
                      <span>Test link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </label>
                <input
                  type="url"
                  value={channel.url || ''}
                  onChange={(e) => handleUpdate(channel._id, { url: e.target.value })}
                  placeholder={`https://${channel.platform.toLowerCase()}.com/...`}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs text-gray-800 focus:outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple"
                />
              </div>

              {/* Save Action */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => saveChannel(channel)}
                  disabled={savingId === channel._id}
                  className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingId === channel._id ? 'Saving...' : 'Save Channel'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
