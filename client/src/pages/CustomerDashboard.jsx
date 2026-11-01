import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import {
  User,
  ShoppingBag,
  MapPin,
  Clock,
  RotateCw,
  Download,
  ShieldCheck,
  CheckCircle2,
  Package,
  Plus,
  Truck,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

export default function CustomerDashboard() {
  const { user, token, logout, updateProfile } = useAuth();
  const { addToCart, setIsCartOpen } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders'); // 'orders', 'addresses', 'profile'
  const [trackingOrder, setTrackingOrder] = useState(null);

  // Profile Edit State
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  // New Address State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
    isDefault: true,
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    Promise.all([
      fetch('/api/orders/my-orders', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
      fetch('/api/addresses', { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()),
    ])
      .then(([ordersData, addrData]) => {
        if (Array.isArray(ordersData)) setOrders(ordersData);
        if (Array.isArray(addrData)) setAddresses(addrData);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [token, navigate]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      updateProfile({ name: profileForm.name, phone: profileForm.phone });
      setEditingProfile(false);
      addToast('Profile updated successfully!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to update profile', 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newAddress),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setAddresses([...addresses, data]);
      setShowAddressModal(false);
      addToast('Address added to your account!', 'success');
    } catch (err) {
      addToast(err.message || 'Failed to save address', 'error');
    }
  };

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(
        { _id: item.productId, id: item.productId, name: item.title, tier: 'Regular' },
        { _id: item.variantId, id: item.variantId, colorName: item.variantInfo?.split('•')[0]?.trim() || 'Pastel', packSize: item.variantInfo?.split('•')[1]?.trim() || '1 Kit', price: item.price, stock: 50, image: item.image },
        item.quantity
      );
    });
    addToast('Items re-added to your bag!', 'success');
    setIsCartOpen(true);
  };

  const downloadPDFInvoice = (order) => {
    try {
      const doc = new jsPDF();
      doc.setFillColor(85, 29, 130);
      doc.rect(0, 0, 210, 34, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PeriodReady', 16, 18);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Discreet Menstrual Care | Official Tax Invoice', 16, 26);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Invoice: ${order.orderNumber}`, 16, 48);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 16, 55);
      doc.text(`Payment: ${order.paymentMethod} (${order.paymentStatus?.toUpperCase()})`, 16, 61);

      doc.text('Customer:', 120, 48);
      doc.setFont('helvetica', 'bold');
      doc.text(`${order.customerName}`, 120, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(`${order.shippingAddress?.addressLine || ''}`, 120, 61);
      doc.text(`${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}`, 120, 67);

      let y = 80;
      doc.setFillColor(245, 240, 250);
      doc.rect(16, y - 5, 178, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(85, 29, 130);
      doc.text('Item', 20, y);
      doc.text('Qty', 130, y);
      doc.text('Price', 150, y);
      doc.text('Total', 175, y);

      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);
      (order.items || []).forEach((item) => {
        doc.text(`${item.title} (${item.variantInfo || ''})`, 20, y);
        doc.text(`${item.quantity}`, 133, y);
        doc.text(`Rs. ${item.price}`, 150, y);
        doc.text(`Rs. ${item.price * item.quantity}`, 175, y);
        y += 7;
      });

      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.text(`Grand Total: Rs. ${order.total}`, 145, y);

      y += 20;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text('100% Plain discreet outer delivery guaranteed. Thank you for choosing PeriodReady.', 16, y);

      doc.save(`PeriodReady_${order.orderNumber}.pdf`);
      addToast('Invoice PDF downloaded!', 'success');
    } catch (e) {
      addToast('Failed to generate PDF', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-soft border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-brand-purple text-white font-heading font-black text-2xl flex items-center justify-center uppercase shadow-soft">
            {user?.name ? user.name[0] : 'U'}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple">
              Hello, {user?.name}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">{user?.email} • Customer Account</p>
          </div>
        </div>

        <button
          onClick={() => {
            logout();
            navigate('/');
          }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-rose-200 text-xs font-bold text-rose-600 hover:bg-rose-50 transition"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-rose-100 gap-6 text-sm font-bold">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'text-brand-purple border-b-2 border-brand-purple'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order History ({orders.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('addresses')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'addresses'
              ? 'text-brand-purple border-b-2 border-brand-purple'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 transition flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'text-brand-purple border-b-2 border-brand-purple'
              : 'text-gray-400 hover:text-gray-700'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Settings</span>
        </button>
      </div>

      {/* TAB 1: ORDER HISTORY */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center shadow-soft border border-rose-100 space-y-4">
              <ShoppingBag className="w-12 h-12 text-brand-purple/40 mx-auto" />
              <h3 className="font-heading font-bold text-xl text-gray-800">No Orders Placed Yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Get your first discreet emergency kit so you're never caught off guard.
              </p>
              <Link
                to="/shop"
                className="inline-block bg-brand-purple text-white px-6 py-2.5 rounded-full text-xs font-bold hover:bg-brand-purpleDark"
              >
                Shop Kits
              </Link>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id || order.id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-2">
                  <div>
                    <span className="text-xs font-bold text-gray-500 block">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : order.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-purple-100 text-brand-purple'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="font-black text-brand-purple text-base">₹{order.total}</span>
                  </div>
                </div>

                {/* Items */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="flex gap-3 items-center bg-brand-blush/40 p-2.5 rounded-2xl">
                      <img src={it.image} alt="" className="w-12 h-12 object-contain bg-white rounded-xl p-1" />
                      <div className="flex-1 text-xs">
                        <span className="font-bold text-gray-900 block truncate">{it.title}</span>
                        <span className="text-gray-500">{it.variantInfo} • Qty {it.quantity}</span>
                        <span className="font-bold text-brand-purple block">₹{it.price * it.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-gray-100 gap-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTrackingOrder(order)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <Truck className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Track Status</span>
                    </button>
                    <button
                      onClick={() => downloadPDFInvoice(order)}
                      className="px-3 py-1.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-brand-purple" />
                      <span>Download Invoice</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleReorder(order)}
                    className="px-4 py-1.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark flex items-center gap-1.5 shadow-sm"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Reorder Kit</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 2: SAVED ADDRESSES */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-heading font-bold text-xl text-brand-purple">Your Delivery Locations</h3>
            <button
              onClick={() => setShowAddressModal(true)}
              className="inline-flex items-center gap-1.5 bg-brand-purple text-white px-4 py-2 rounded-full text-xs font-bold hover:bg-brand-purpleDark"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-2 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-4 right-4 bg-purple-100 text-brand-purple text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    Default Delivery Address
                  </span>
                )}
                <h4 className="font-bold text-sm text-gray-900">{addr.name}</h4>
                <p className="text-xs text-gray-600">{addr.addressLine}</p>
                <p className="text-xs text-gray-500">
                  {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                </p>
                <p className="text-xs font-semibold text-gray-700">Phone: {addr.phone}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: PROFILE SETTINGS */}
      {activeTab === 'profile' && (
        <div className="bg-white rounded-3xl p-8 shadow-soft border border-rose-100 max-w-lg space-y-5">
          <h3 className="font-heading font-bold text-xl text-brand-purple">Personal Information</h3>
          {editingProfile ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={profileForm.name}
                  onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={profileForm.phone}
                  onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3 text-xs text-gray-700">
              <div>
                <span className="text-gray-400 block font-medium">Name:</span>
                <span className="font-bold text-sm text-gray-900">{user?.name}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Email Address:</span>
                <span className="font-bold text-sm text-gray-900">{user?.email}</span>
              </div>
              <div>
                <span className="text-gray-400 block font-medium">Phone Number:</span>
                <span className="font-bold text-sm text-gray-900">{user?.phone || 'Not provided'}</span>
              </div>
              <button
                onClick={() => setEditingProfile(true)}
                className="mt-2 px-4 py-2 rounded-xl border border-brand-purple text-brand-purple text-xs font-bold hover:bg-purple-50"
              >
                Edit Details
              </button>
            </div>
          )}
        </div>
      )}

      {/* TRACKING MODAL */}
      {trackingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-soft-lg">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-xl text-brand-purple">Order Timeline</h3>
                <p className="text-xs text-gray-500 font-mono">#{trackingOrder.orderNumber}</p>
              </div>
              <button onClick={() => setTrackingOrder(null)} className="p-1 text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {(trackingOrder.timeline || []).map((step, idx) => (
                <div key={idx} className="flex gap-3 text-xs">
                  <div className="flex flex-col items-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
                    {idx < trackingOrder.timeline.length - 1 && <div className="w-0.5 h-10 bg-gray-200 mt-1" />}
                  </div>
                  <div>
                    <span className="font-bold text-gray-900 block">{step.status}</span>
                    <span className="text-[11px] text-gray-400 block">{new Date(step.timestamp).toLocaleString()}</span>
                    <span className="text-gray-600 mt-0.5 block">{step.note}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-purple-50 p-3 rounded-2xl text-xs text-brand-purple font-medium flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Delivered in plain, unmarked discreet box.</span>
            </div>
          </div>
        </div>
      )}

      {/* ADD ADDRESS MODAL */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-4 shadow-soft-lg">
            <div className="flex justify-between items-center">
              <h3 className="font-heading font-black text-xl text-brand-purple">Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Recipient Name</label>
                <input
                  type="text"
                  required
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  required
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Address Line</label>
                <input
                  type="text"
                  required
                  placeholder="Flat / Room, Street, Landmark"
                  value={newAddress.addressLine}
                  onChange={(e) => setNewAddress({ ...newAddress, addressLine: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">PIN</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={newAddress.pincode}
                    onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
                >
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
