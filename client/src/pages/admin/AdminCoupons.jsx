import React, { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, CheckCircle2, XCircle, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminCoupons() {
  const { adminToken } = useAuth();
  const { addToast } = useToast();

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    code: '',
    description: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 149,
    maxDiscount: 100,
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch('/api/admin/coupons', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setCoupons(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [adminToken]);

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create coupon');

      addToast(`Coupon "${form.code.toUpperCase()}" created!`, 'success');
      setModalOpen(false);
      setForm({
        code: '',
        description: '',
        discountType: 'percentage',
        discountValue: 10,
        minOrderValue: 149,
        maxDiscount: 100,
      });
      fetchCoupons();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      await fetch(`/api/admin/coupons/${coupon._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ isActive: !coupon.isActive }),
      });
      addToast(`Coupon ${coupon.code} updated`, 'info');
      fetchCoupons();
    } catch (err) {
      addToast('Update failed', 'error');
    }
  };

  const handleDelete = async (id, code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    try {
      await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      addToast(`Coupon deleted`, 'success');
      fetchCoupons();
    } catch (err) {
      addToast('Delete failed', 'error');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-gray-900">Discount Coupons</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Create and regulate promotional coupon codes for student campaigns and first-time buyers.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 bg-brand-purple text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-brand-purpleDark shadow-soft transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create Coupon</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Coupon Code</th>
                <th className="py-4 px-4">Discount</th>
                <th className="py-4 px-4">Min. Cart Value</th>
                <th className="py-4 px-4">Times Used</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {coupons.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <span className="font-mono font-black text-sm text-brand-purple block">{c.code}</span>
                    <span className="text-[11px] text-gray-400">{c.description}</span>
                  </td>
                  <td className="py-4 px-4 font-black text-gray-900">
                    {c.discountType === 'percentage' ? `${c.discountValue}% Off` : `₹${c.discountValue} Flat`}
                    {c.maxDiscount && (
                      <span className="block text-[10px] text-gray-400 font-normal">Max ₹{c.maxDiscount}</span>
                    )}
                  </td>
                  <td className="py-4 px-4 text-gray-600 font-semibold">₹{c.minOrderValue}</td>
                  <td className="py-4 px-4 font-bold text-gray-800">{c.usageCount || 0}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleActive(c)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${
                        c.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {c.isActive ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                      <span>{c.isActive ? 'Active' : 'Disabled'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(c._id, c.code)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-soft-lg">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-heading font-black text-xl text-brand-purple">Create Discount Code</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CAMPUS20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-mono font-black uppercase focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off for verified campus students"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-brand-blush/30 focus:outline-none focus:border-brand-purple"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Value</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 bg-brand-blush/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Min. Order (₹)</label>
                  <input
                    type="number"
                    value={form.minOrderValue}
                    onChange={(e) => setForm({ ...form, minOrderValue: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-brand-blush/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Max Cap (₹)</label>
                  <input
                    type="number"
                    value={form.maxDiscount}
                    onChange={(e) => setForm({ ...form, maxDiscount: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs font-bold bg-brand-blush/30"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
                >
                  Create Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
