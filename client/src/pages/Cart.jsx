import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  Tag,
  CheckCircle2,
  X,
  Truck,
  Sparkles
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Cart() {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    deliveryCharge,
    gst,
    grandTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [couponInput, setCouponInput] = useState('');
  const [applyingCoupon, setApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplyingCoupon(true);
    try {
      await applyCoupon(couponInput.trim());
      addToast(`Coupon "${couponInput.toUpperCase()}" applied successfully!`, 'success');
      setCouponInput('');
    } catch (err) {
      addToast(err.message || 'Invalid coupon code', 'error');
    } finally {
      setApplyingCoupon(false);
    }
  };

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      addToast('Please sign in or create an account to complete checkout.', 'info');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-20 h-20 mx-auto bg-brand-blush rounded-full flex items-center justify-center text-brand-purple">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-brand-purple">
          Your Emergency Bag is Empty
        </h2>
        <p className="text-sm text-gray-500 max-w-sm mx-auto">
          Explore our discreet kits and make sure you're always prepared for sudden cycle starts.
        </p>
        <div className="pt-4">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-brand-purple text-white px-8 py-3.5 rounded-full text-sm font-bold hover:bg-brand-purpleDark transition shadow-soft"
          >
            <span>Explore Kits</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
          Your Shopping Bag
        </h1>
        <p className="text-xs sm:text-sm text-gray-500">
          Review your kit colors, pack sizes, and proceed to discreet delivery checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Items List */}
        <div className="lg:col-span-8 space-y-4">
          {items.map((item) => (
            <div
              key={item.variantId}
              className="bg-white rounded-3xl p-5 sm:p-6 shadow-soft border border-rose-100 flex flex-col sm:flex-row items-center gap-5 transition hover:border-purple-200"
            >
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 sm:w-28 sm:h-28 object-contain rounded-2xl bg-brand-blush p-2 border border-white shrink-0"
              />

              <div className="flex-1 text-center sm:text-left space-y-1">
                <span className="text-[10px] font-black uppercase text-brand-accent tracking-wider">
                  {item.tier || 'Emergency Kit'}
                </span>
                <h3 className="font-heading font-bold text-lg text-brand-purple">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.variantInfo}</p>
                <div className="text-sm font-bold text-gray-900 pt-1">
                  ₹{item.price}{' '}
                  {item.comparePrice > item.price && (
                    <span className="text-xs text-gray-400 line-through font-normal ml-1">
                      ₹{item.comparePrice}
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity Stepper and Remove */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-4">
                <div className="flex items-center border border-gray-200 bg-white rounded-xl overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-gray-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                  >
                    +
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-black text-brand-purple text-base">
                    ₹{item.price * item.quantity}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.variantId)}
                    className="text-gray-400 hover:text-rose-500 transition p-1"
                    title="Remove Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Discreet Delivery Guarantee Alert */}
          <div className="bg-purple-50 rounded-2xl p-4 border border-purple-200/80 flex items-center gap-3 text-xs text-brand-purple">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>
              <strong>Discreet Packaging Guaranteed:</strong> All orders are dispatched in unmarked plain brown recyclable boxes with confidential courier labels.
            </span>
          </div>
        </div>

        {/* Order Summary & Coupon Card */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border border-rose-100 space-y-5">
            <h3 className="font-heading font-black text-xl text-brand-purple">Order Summary</h3>

            {/* Coupon Section */}
            <div>
              {appliedCoupon ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800 block">
                        {appliedCoupon.code} Applied
                      </span>
                      <span className="text-[10px] text-emerald-600">Saved ₹{appliedCoupon.discount}</span>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-gray-400 hover:text-rose-500 text-xs font-semibold p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon Code (e.g. STUDENT10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:border-brand-purple uppercase font-bold"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={applyingCoupon || !couponInput.trim()}
                    className="px-4 py-2 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}
              <div className="text-[11px] text-gray-400 mt-1.5 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-brand-yellow shrink-0" />
                <span>Tip: Try <strong>STUDENT10</strong> or <strong>FIRSTBUY</strong></span>
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-2.5 text-xs pt-3 border-t border-gray-100">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-bold text-gray-900">₹{subtotal}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-600">
                <span>Discreet Shipping</span>
                <span className="font-bold text-gray-900">
                  {deliveryCharge === 0 ? <span className="text-emerald-600">FREE</span> : `₹${deliveryCharge}`}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>GST (5% sanitary hygiene)</span>
                <span className="font-bold text-gray-900">₹{gst}</span>
              </div>

              <div className="pt-3 border-t border-gray-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-gray-900">Estimated Total</span>
                <span className="text-2xl font-black text-brand-purple">₹{grandTotal}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-4 px-6 rounded-2xl bg-brand-purple text-white font-bold text-sm hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-2 group"
            >
              <span>{isAuthenticated ? 'Proceed to Delivery Address' : 'Sign In & Checkout'}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="text-center text-[11px] text-gray-400">
              Safe & Secure 256-bit SSL encrypted checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
