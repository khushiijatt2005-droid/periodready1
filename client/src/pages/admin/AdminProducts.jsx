import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Edit2,
  Trash2,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Save,
  CheckCircle2,
  RotateCw,
  ExternalLink,
  Flame,
  AlertCircle,
  Box,
  ChevronLeft,
  ChevronRight,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminProducts() {
  const { adminToken } = useAuth();
  const { addToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Product Modal State
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: '',
    tier: 'Regular',
    tagline: '',
    description: '',
    basePrice: 149,
    comparePrice: 199,
    includePainkillerTablets: false,
    whatInside: [],
    frontImage: '',
    insideImage: '',
    images: ['', ''],
    isActive: true,
  });

  // Variant Modal State
  const [variantModalOpen, setVariantModalOpen] = useState(false);
  const [selectedProductForVariants, setSelectedProductForVariants] = useState(null);
  const [variantsList, setVariantsList] = useState([]);
  const [editingVariant, setEditingVariant] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSlide, setUploadingSlide] = useState({ 0: false, 1: false });

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save / Update Product
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(productForm),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to save product');

      addToast(editingProduct ? 'Product updated successfully!' : 'New product created!', 'success');
      setProductModalOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Operation failed', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" and all its variants?`)) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (!res.ok) throw new Error('Failed to delete');
      addToast(`Deleted ${name}`, 'success');
      fetchProducts();
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Open Variants Management Modal
  const handleOpenVariants = (product) => {
    setSelectedProductForVariants(product);
    setVariantsList(product.variants || []);
    setVariantModalOpen(true);
  };

  // Save Variant Updates (Price, Stock, SKU, Image)
  const handleSaveVariant = async (variantId, payload) => {
    try {
      const res = await fetch(`/api/variants/${variantId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update variant');

      addToast('Variant updated successfully in database!', 'success');
      setVariantsList((prev) =>
        prev.map((v) => (v._id === variantId ? { ...v, ...payload } : v))
      );
      setEditingVariant(null);
      fetchProducts();
    } catch (err) {
      addToast(err.message || 'Failed to update variant', 'error');
    }
  };

  // Upload Slide 1 or Slide 2 Image directly from file picker
  const handleSlideUpload = async (e, slideIndex) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingSlide((prev) => ({ ...prev, [slideIndex]: true }));
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      if (slideIndex === 0) {
        const newImages = [data.url, productForm.images?.[1] || productForm.insideImage || ''];
        setProductForm((prev) => ({
          ...prev,
          frontImage: data.url,
          images: newImages,
        }));
      } else {
        const newImages = [productForm.images?.[0] || productForm.frontImage || '', data.url];
        setProductForm((prev) => ({
          ...prev,
          insideImage: data.url,
          images: newImages,
        }));
      }
      addToast(`Slide ${slideIndex + 1} uploaded successfully!`, 'success');
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploadingSlide((prev) => ({ ...prev, [slideIndex]: false }));
    }
  };

  // Single Image Upload for Variant
  const handleImageFileUpload = async (e, variantId) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setUploadingImage(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');

      await handleSaveVariant(variantId, { image: data.url });
      addToast('Image updated!', 'success');
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900">
            Products & Variants Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit live prices, descriptions, what's inside lists, stock counts, and 360-degree sequences in real-time.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProduct(null);
            setProductForm({
              name: '',
              tier: 'Regular',
              tagline: '',
              description: '',
              basePrice: 149,
              comparePrice: 199,
              includePainkillerTablets: false,
              whatInside: [
                { item: 'Sanitary pads', count: 3, icon: 'ShieldCheck' },
                { item: 'Biodegradable disposal bags', count: 3, icon: 'Package' },
                { item: 'Intimate wipes', count: 3, icon: 'CheckCircle' }
              ],
              frontImage: '',
              insideImage: '',
              images: ['', ''],
              category: 'kits',
              isActive: true,
            });
            setProductModalOpen(true);
          }}
          className="inline-flex items-center gap-2 bg-brand-purple hover:bg-brand-purpleDark text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-soft transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Kit</span>
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-4">Tier</th>
                <th className="py-4 px-4">Base Price</th>
                <th className="py-4 px-4">Compare Price</th>
                <th className="py-4 px-4">Pack Variants</th>
                <th className="py-4 px-4">Gallery Slides</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p._id || p.id} className="hover:bg-gray-50/60 transition">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.frontImage || p.images?.[0] || '/images/products/regular-front.jpg'}
                        alt=""
                        className="w-12 h-12 rounded-xl object-contain bg-brand-blush p-1 border border-gray-100 shrink-0"
                      />
                      <div>
                        <span className="font-bold text-gray-900 block text-sm">{p.name}</span>
                        <span className="text-[11px] text-gray-400 line-clamp-1">{p.tagline}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-black bg-purple-100 text-brand-purple">
                      {p.tier}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-black text-gray-900 text-sm">₹{p.basePrice}</td>
                  <td className="py-4 px-4 text-gray-400 line-through">₹{p.comparePrice || '-'}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleOpenVariants(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-brand-purple hover:bg-purple-100 font-bold text-xs"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span>{p.variants?.length || 0} Pack Sizes</span>
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <Camera className="w-3 h-3" />
                      <span>{p.images?.length || 2} Slides (2 max)</span>
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Active
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProduct(p);
                        setProductForm({
                          name: p.name,
                          tier: p.tier,
                          tagline: p.tagline || '',
                          description: p.description || '',
                          basePrice: p.basePrice,
                          comparePrice: p.comparePrice || Math.round(p.basePrice * 1.3),
                          includePainkillerTablets: !!p.includePainkillerTablets,
                          whatInside: p.whatInside || [],
                          frontImage: p.frontImage || p.images?.[0] || '',
                          insideImage: p.insideImage || p.images?.[1] || '',
                          images: p.images || [p.frontImage || '', p.insideImage || ''],
                          category: p.category || 'kits',
                          isActive: p.isActive !== false,
                        });
                        setProductModalOpen(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-brand-purple rounded-lg hover:bg-gray-100"
                      title="Edit Product"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p._id, p.name)}
                      className="p-1.5 text-gray-400 hover:text-rose-500 rounded-lg hover:bg-gray-100"
                      title="Delete Product"
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

      {/* MODAL 1: ADD / EDIT PRODUCT */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-heading font-black text-xl text-brand-purple">
                {editingProduct ? 'Edit Kit Details' : 'Add New Emergency Kit'}
              </h3>
              <button onClick={() => setProductModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Kit Title</label>
                <input
                  type="text"
                  required
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="e.g. Regular Period Kit (with mini hot water bag)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30 font-medium"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Category / Tier</label>
                  <select
                    value={productForm.tier}
                    onChange={(e) => setProductForm({ ...productForm, tier: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 bg-brand-blush/30 focus:outline-none focus:border-brand-purple"
                  >
                    <option value="Regular">Regular</option>
                    <option value="Travel">Travel</option>
                    <option value="Emergency">Emergency</option>
                    <option value="Combo">Combo</option>
                    <option value="Relief Aid">Relief Aid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">Compare Price (₹)</label>
                  <input
                    type="number"
                    value={productForm.comparePrice}
                    onChange={(e) => setProductForm({ ...productForm, comparePrice: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                <input
                  type="text"
                  value={productForm.tagline}
                  onChange={(e) => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="e.g. daily comfort"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              {/* Drug Licensing Toggle for Painkiller Tablets (Only for Emergency Kit) */}
              {productForm.tier === 'Emergency' && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-amber-600" />
                      <span className="text-xs font-bold text-amber-950">Include 2 Painkiller Tablets</span>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={productForm.includePainkillerTablets}
                        onChange={(e) => setProductForm({ ...productForm, includePainkillerTablets: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                    </label>
                  </div>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    Under drug-licensing regulations, painkiller tablets are turned <strong>OFF by default</strong>. Only toggle ON if your entity holds a valid dispensary OTC license.
                  </p>
                </div>
              )}

              {/* 2-Slide Product Gallery Configuration (Exact 2 Slides Rule) */}
              <div className="bg-purple-50/50 border border-purple-200/60 rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-brand-purple" />
                    <h4 className="font-heading font-black text-sm text-brand-purple">
                      Product Gallery (Exactly 2 Slides)
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-brand-purple bg-purple-100 px-2.5 py-0.5 rounded-full">
                    2 Slides Maximum
                  </span>
                </div>

                <p className="text-xs text-gray-500">
                  Each product has exactly two slides: <strong>Slide 1 (Exterior Box)</strong> and <strong>Slide 2 (Inside Kit Essentials)</strong>.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Slide 1 */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">Slide 1: Exterior / Front</span>
                      <span className="text-[10px] font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded">Primary View</span>
                    </div>
                    <div className="aspect-[4/3] rounded-lg bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={productForm.frontImage || productForm.images?.[0] || '/images/products/regular-front.jpg'}
                        alt="Slide 1"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold rounded-lg shadow-2xs transition shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingSlide[0] ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSlideUpload(e, 0)}
                          disabled={uploadingSlide[0]}
                        />
                      </label>
                      <input
                        type="text"
                        value={productForm.frontImage || productForm.images?.[0] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newImages = [val, productForm.images?.[1] || productForm.insideImage || ''];
                          setProductForm((prev) => ({
                            ...prev,
                            frontImage: val,
                            images: newImages
                          }));
                        }}
                        placeholder="/images/products/regular-front.jpg"
                        className="flex-1 text-xs font-mono p-2 border border-gray-200 rounded-lg min-w-0"
                      />
                    </div>
                  </div>

                  {/* Slide 2 */}
                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-800">Slide 2: Inside Contents</span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">Unpacked View</span>
                    </div>
                    <div className="aspect-[4/3] rounded-lg bg-gray-50 border border-gray-100 p-2 flex items-center justify-center overflow-hidden">
                      <img
                        src={productForm.insideImage || productForm.images?.[1] || '/images/products/regular-inside.jpg'}
                        alt="Slide 2"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-purple hover:bg-brand-purpleDark text-white text-xs font-bold rounded-lg shadow-2xs transition shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingSlide[1] ? 'Uploading...' : 'Upload Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleSlideUpload(e, 1)}
                          disabled={uploadingSlide[1]}
                        />
                      </label>
                      <input
                        type="text"
                        value={productForm.insideImage || productForm.images?.[1] || ''}
                        onChange={(e) => {
                          const val = e.target.value;
                          const newImages = [productForm.images?.[0] || productForm.frontImage || '', val];
                          setProductForm((prev) => ({
                            ...prev,
                            insideImage: val,
                            images: newImages
                          }));
                        }}
                        placeholder="/images/products/regular-inside.jpg"
                        className="flex-1 text-xs font-mono p-2 border border-gray-200 rounded-lg min-w-0"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark shadow-soft"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PACK SIZE VARIANTS MANAGEMENT */}
      {variantModalOpen && selectedProductForVariants && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full space-y-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-xl text-brand-purple">
                  Pack Size Variants: {selectedProductForVariants.name}
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Set live prices, stock levels, and SKUs per pack size.
                </p>
              </div>
              <button onClick={() => setVariantModalOpen(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {variantsList.map((variant) => (
                <div
                  key={variant._id}
                  className="bg-brand-blush/40 rounded-2xl p-4 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="w-12 h-12 rounded-xl bg-white p-1 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden relative group">
                      <img src={variant.image} alt="" className="w-full h-full object-contain" />
                      <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition">
                        <Upload className="w-4 h-4 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageFileUpload(e, variant._id)}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="font-heading font-bold text-sm text-gray-900 block">
                        {variant.packSize}
                      </span>
                      <span className="text-[10px] font-mono font-semibold text-gray-400">
                        SKU: {variant.sku}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Price (₹)</label>
                      <input
                        type="number"
                        defaultValue={variant.price}
                        id={`price-${variant._id}`}
                        className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 text-center bg-white"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-500 block mb-0.5">Stock</label>
                      <input
                        type="number"
                        defaultValue={variant.stock}
                        id={`stock-${variant._id}`}
                        className="w-20 px-2 py-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 text-center bg-white"
                      />
                    </div>

                    <button
                      onClick={() => {
                        const price = Number(document.getElementById(`price-${variant._id}`).value);
                        const stock = Number(document.getElementById(`stock-${variant._id}`).value);
                        handleSaveVariant(variant._id, { price, stock });
                      }}
                      className="mt-4 px-3.5 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition shadow-soft flex items-center gap-1"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-gray-100">
              <button
                onClick={() => setVariantModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
