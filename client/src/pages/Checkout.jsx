import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Truck,
  ArrowRight,
  MapPin,
  Lock,
  Plus,
  Building,
  AlertCircle
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Checkout() {
  const {
    items,
    subtotal,
    discount,
    deliveryCharge,
    gst,
    grandTotal,
    appliedCoupon,
    clearCart,
  } = useCart();
  const { user, token, isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // If items empty or unauthenticated, handle redirect
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    }
  }, [isAuthenticated, navigate]);

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);

  const [addressForm, setAddressForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI (Razorpay Test)');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [pincodeError, setPincodeError] = useState('');

  // Fetch customer's saved addresses
  useEffect(() => {
    if (token) {
      fetch('/api/addresses', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) {
            setSavedAddresses(data);
            setSelectedAddressIndex(0);
          } else {
            setIsAddingNewAddress(true);
          }
        })
        .catch((err) => console.error(err));
    }
  }, [token]);

  const validatePincode = (pin) => {
    const regex = /^[1-9][0-9]{5}$/;
    return regex.test(pin.toString().trim());
  };

  const handlePincodeChange = (val) => {
    setAddressForm({ ...addressForm, pincode: val });
    if (val && !validatePincode(val)) {
      setPincodeError('Please enter a valid 6-digit Indian PIN code.');
    } else {
      setPincodeError('');
    }
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      addToast('Your bag is empty!', 'error');
      navigate('/shop');
      return;
    }

    let shippingAddress = null;

    if (savedAddresses.length > 0 && !isAddingNewAddress) {
      shippingAddress = savedAddresses[selectedAddressIndex];
    } else {
      // Validate current form
      if (!addressForm.name || !addressForm.phone || !addressForm.addressLine || !addressForm.pincode) {
        addToast('Please fill out all address fields.', 'error');
        return;
      }
      if (!validatePincode(addressForm.pincode)) {
        addToast('Please enter a valid 6-digit Indian PIN code.', 'error');
        return;
      }
      shippingAddress = addressForm;
    }

    setIsPlacingOrder(true);

    try {
      // 1. If Razorpay Test is chosen, simulate order verification
      let razorpayData = null;
      if (paymentMethod.includes('Razorpay')) {
        const rzpRes = await fetch('/api/orders/razorpay/create-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: grandTotal }),
        });
        razorpayData = await rzpRes.json();
      }

      // 2. Place Order in Backend
      const orderPayload = {
        items: items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        })),
        shippingAddress,
        paymentMethod,
        couponCode: appliedCoupon?.code || null,
        razorpayOrderId: razorpayData?.id || null,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order placement failed');

      clearCart();
      addToast('Order successfully confirmed! Delivering in discreet packaging.', 'success');
      navigate(`/order-confirmation/${data.order._id || data.order.id}`);
    } catch (err) {
      addToast(err.message || 'Failed to place order. Please try again.', 'error');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
          Discreet Checkout
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Step-by-step secure delivery & payment selection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Delivery Address & Payment Method */}
        <div className="lg:col-span-8 space-y-8">
          {/* Step 1: Customer Account Info */}
          <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
                  Step 1: Account Verified
                </span>
                <span className="font-bold text-sm text-gray-900">
                  {user?.name} ({user?.email})
                </span>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Logged In
            </span>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-rose-100 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <h3 className="font-heading font-bold text-xl text-brand-purple">Delivery Address</h3>
              </div>
              {savedAddresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-bold text-brand-accent hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAddingNewAddress ? 'Use Saved Address' : 'Add New Address'}</span>
                </button>
              )}
            </div>

            {/* Saved Addresses Selector */}
            {savedAddresses.length > 0 && !isAddingNewAddress ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedAddresses.map((addr, idx) => (
                  <div
                    key={addr._id || idx}
                    onClick={() => setSelectedAddressIndex(idx)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                      selectedAddressIndex === idx
                        ? 'border-brand-purple bg-purple-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-gray-900">{addr.name}</span>
                      {selectedAddressIndex === idx && (
                        <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                      )}
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{addr.addressLine}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {addr.city}, {addr.state} - <strong className="text-gray-800">{addr.pincode}</strong>
                    </p>
                    <p className="text-[11px] text-gray-500 mt-1 font-semibold">Ph: {addr.phone}</p>
                  </div>
                ))}
              </div>
            ) : (
              /* New Address Form */
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Receiver's name"
                      value={addressForm.name}
                      onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Street Address / Flat / PG Room No.
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flat 302, Green Glen Residency, Outer Ring Road"
                    value={addressForm.addressLine}
                    onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">PIN Code</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 560100"
                      value={addressForm.pincode}
                      onChange={(e) => handlePincodeChange(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-brand-blush/30 font-bold"
                    />
                  </div>
                </div>
                {pincodeError && (
                  <p className="text-xs text-rose-500 font-semibold">{pincodeError}</p>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-rose-100 space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-purple text-white text-xs font-bold flex items-center justify-center">
                3
              </div>
              <h3 className="font-heading font-bold text-xl text-brand-purple">Payment Method</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Razorpay Test Mode */}
              <div
                onClick={() => setPaymentMethod('UPI / Cards (Razorpay Test)')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod.includes('Razorpay')
                    ? 'border-brand-purple bg-purple-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-brand-purple">UPI / Card / NetBanking</span>
                  {paymentMethod.includes('Razorpay') && (
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Instant verification via Razorpay (Test Mode enabled for UPI, Google Pay, Cards).
                </p>
                <div className="mt-3 inline-block bg-white px-2 py-0.5 rounded text-[10px] font-bold text-emerald-700 border border-emerald-200">
                  Instant Confirmation
                </div>
              </div>

              {/* Cash on Delivery */}
              <div
                onClick={() => setPaymentMethod('Cash on Delivery')}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition ${
                  paymentMethod === 'Cash on Delivery'
                    ? 'border-brand-purple bg-purple-50/50 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm text-brand-purple">Cash on Delivery (COD)</span>
                  {paymentMethod === 'Cash on Delivery' && (
                    <CheckCircle2 className="w-4 h-4 text-brand-purple" />
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Pay discreetly in cash or UPI QR code at your doorstep upon parcel receipt.
                </p>
                <div className="mt-3 inline-block bg-white px-2 py-0.5 rounded text-[10px] font-bold text-purple-700 border border-purple-200">
                  Pay on Arrival
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Review & Confirmation CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-rose-100 space-y-5">
            <h3 className="font-heading font-black text-xl text-brand-purple">Review Items ({items.length})</h3>

            {/* Compact items list */}
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {items.map((i) => (
                <div key={i.variantId} className="flex gap-3 text-xs items-center">
                  <img src={i.image} alt="" className="w-12 h-12 object-contain bg-brand-blush rounded-xl p-1" />
                  <div className="flex-1">
                    <span className="font-bold text-gray-900 block truncate">{i.title}</span>
                    <span className="text-[11px] text-gray-400">{i.variantInfo} x{i.quantity}</span>
                  </div>
                  <span className="font-bold text-brand-purple">₹{i.price * i.quantity}</span>
                </div>
              ))}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 text-xs pt-4 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon ({appliedCoupon?.code})</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Discreet Delivery</span>
                <span className="font-bold text-gray-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryCharge}`}
                </span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>GST (5%)</span>
                <span className="font-bold text-gray-900">₹{gst}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Grand Total</span>
                <span className="text-2xl font-black text-brand-purple">₹{grandTotal}</span>
              </div>
            </div>

            {/* Packaging Assurance Card */}
            <div className="bg-purple-50 p-3 rounded-2xl border border-purple-100 flex items-start gap-2.5 text-xs text-brand-purple">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Plain Packaging Guaranteed:</strong> Sealed in an unmarked kraft box with zero indication of menstrual contents on the exterior label.
              </span>
            </div>

            {/* Place Order CTA */}
            <button
              onClick={handlePlaceOrder}
              disabled={isPlacingOrder || items.length === 0}
              className="w-full py-4 px-6 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Lock className="w-4 h-4 text-brand-yellow" />
              <span>{isPlacingOrder ? 'Confirming Your Order...' : `Place Order (₹${grandTotal})`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
