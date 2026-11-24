import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, MapPin, CreditCard, Banknote, Sparkles, User, Phone, Navigation, Tag, Check } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { dbCreateOrder } from '../lib/supabase';
import DemoPaymentModal from './DemoPaymentModal';

export default function CartDrawer() {
  const { 
    items, 
    itemCount, 
    subtotal,
    discountAmount,
    couponCode,
    couponDiscountPercent,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon,
    deliveryFee,
    total, 
    selectedZone,
    setSelectedZone,
    currentZone,
    deliveryZones,
    isDrawerOpen, 
    setIsDrawerOpen, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    address, 
    setAddress,
    setRecentOrder,
    setIsInvoiceOpen
  } = useCart();

  const { user, setAuthModalOpen } = useAuth();

  const [paymentChoice, setPaymentChoice] = useState('online'); // 'online' | 'cod'
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [inputCoupon, setInputCoupon] = useState('');
  const [addressError, setAddressError] = useState('');
  const [contactError, setContactError] = useState('');

  if (!isDrawerOpen) return null;

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
    } catch (e) {
      // safe fallback
    }
  };

  const handleCheckoutClick = () => {
    if (!user) {
      if (!guestName.trim()) {
        setContactError('Please enter your name for delivery.');
        return;
      }
      if (!guestPhone.trim() || guestPhone.replace(/\D/g, '').length < 10) {
        setContactError('Please enter a valid 10-digit mobile number.');
        return;
      }
    }
    setContactError('');

    if (!address.trim()) {
      setAddressError('Please enter your campus gate, PG reception, or office address for 10-minute delivery.');
      return;
    }
    setAddressError('');

    if (paymentChoice === 'online') {
      setIsDemoModalOpen(true);
    } else {
      processOrder({
        paid: false,
        reference: null,
        method: 'cod'
      });
    }
  };

  const processOrder = async ({ paid, reference, method }) => {
    setIsSubmitting(true);
    try {
      const finalName = user?.name || guestName.trim() || 'Indore Customer';
      const finalPhone = user?.phone || guestPhone.trim();
      const finalEmail = user?.email || (guestPhone.trim() ? `${guestPhone.replace(/\D/g, '')}@periodready.in` : 'guest@periodready.in');

      const orderData = {
        customer_id: user?.id || `GUEST-${Date.now()}`,
        customer: finalName,
        name: finalName,
        email: finalEmail,
        phone: finalPhone,
        address: `${address.trim()} [${currentZone?.name || 'Indore'}]`,
        delivery_zone: currentZone?.name || 'Indore',
        delivery_fee: deliveryFee,
        subtotal: subtotal,
        discount: discountAmount,
        coupon_code: couponCode || null,
        items: items,
        total: total,
        payment_method: method === 'online' ? 'online' : 'cod',
        paid: paid,
        reference: reference,
        via: 'PeriodReady Web'
      };

      const newOrder = await dbCreateOrder(orderData);
      setRecentOrder(newOrder);
      clearCart();
      setIsDrawerOpen(false);
      setIsDemoModalOpen(false);
      triggerConfetti();
      setIsInvoiceOpen(true);
    } catch (err) {
      console.error('Order creation error', err);
      alert('Unable to process order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={() => setIsDrawerOpen(false)}
      >
        <div 
          className="fixed inset-y-0 right-0 max-w-full flex pl-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col justify-between">
            
            {/* Drawer Header */}
            <div className="p-4 sm:p-6 border-b border-lavender-border flex items-center justify-between bg-lavender/40">
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-xl text-indigo">Your Cart</span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo text-white text-xs font-semibold">
                  {itemCount} {itemCount === 1 ? 'kit' : 'kits'}
                </span>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-white transition-colors"
                aria-label="Close cart drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body: Item List & Address */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {items.length === 0 ? (
                <div className="text-center py-16 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-lavender flex items-center justify-center text-indigo">
                    <Sparkles className="w-8 h-8" />
                  </div>
                  <h4 className="font-serif font-bold text-lg text-slate-800">Your cart is empty</h4>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-xs mx-auto">
                    Add an Emergency Kit or Cozy Knit Hot Water Bag to be ready whenever cramps or surprise periods strike.
                  </p>
                  <button
                    onClick={() => setIsDrawerOpen(false)}
                    className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-indigo text-white text-xs font-semibold shadow hover:bg-indigo-dark transition-colors"
                  >
                    Browse Emergency Kits
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items */}
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div 
                        key={item.key} 
                        className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-100"
                      >
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-16 h-16 object-contain p-1 rounded-xl bg-gradient-to-b from-[#fff5f8] to-white border border-pink-200/70 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <h5 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                            {item.name}
                          </h5>
                          <p className="text-indigo font-bold text-xs mt-0.5">
                            ₹{item.price}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <div className="inline-flex items-center rounded-lg border border-slate-200 bg-white">
                              <button
                                onClick={() => updateQuantity(item.key, -1)}
                                className="p-1 hover:bg-slate-100 rounded-l-lg text-slate-600 transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="px-2.5 text-xs font-semibold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.key, 1)}
                                className="p-1 hover:bg-slate-100 rounded-r-lg text-slate-600 transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <button
                              onClick={() => removeFromCart(item.key)}
                              className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                              title="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="font-bold text-xs sm:text-sm text-slate-900">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Customer Contact Fields (If not logged in) */}
                  {!user && (
                    <div className="pt-2 space-y-2.5 bg-lavender/30 p-3 rounded-2xl border border-lavender-border">
                      <div className="text-xs font-bold text-indigo flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-rose" />
                        <span>Recipient Details (For Delivery Rider)</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">Your Name</label>
                          <input
                            type="text"
                            value={guestName}
                            onChange={(e) => {
                              setGuestName(e.target.value);
                              if (contactError) setContactError('');
                            }}
                            placeholder="e.g. Pooja Sharma"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-600 mb-1">Mobile Number (Calling)</label>
                          <input
                            type="tel"
                            value={guestPhone}
                            onChange={(e) => {
                              setGuestPhone(e.target.value);
                              if (contactError) setContactError('');
                            }}
                            placeholder="e.g. 98260 12345"
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo"
                          />
                        </div>
                      </div>
                      {contactError && (
                        <p className="text-red-500 text-[11px] font-medium">{contactError}</p>
                      )}
                    </div>
                  )}

                  {/* Delivery Location / Area Selector */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Navigation className="w-3.5 h-3.5 text-indigo" />
                        Delivery Area (Indore)
                      </span>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                        +₹{deliveryFee} Delivery
                      </span>
                    </label>
                    <select
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo"
                    >
                      {deliveryZones && deliveryZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name} — ₹{zone.fee} ({zone.time})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Delivery Address Field */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-rose" />
                        10-Min Delivery Address
                      </span>
                      <span className="text-[10px] text-slate-400 font-normal">Campus / PG / Desk</span>
                    </label>
                    <textarea
                      rows={2}
                      value={address}
                      onChange={(e) => {
                        setAddress(e.target.value);
                        if (addressError) setAddressError('');
                      }}
                      placeholder="e.g. Prestige Institute, Main Campus Gate 2, or Room 304, Green PG, Vijay Nagar, Indore"
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo/30 focus:border-indigo text-xs sm:text-sm bg-slate-50/50 resize-none"
                    />
                    {addressError && (
                      <p className="text-red-500 text-[11px] mt-1 font-medium">{addressError}</p>
                    )}
                  </div>

                  {/* Payment Choice */}
                  <div className="pt-1">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                      Payment Choice
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setPaymentChoice('online')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                          paymentChoice === 'online'
                            ? 'border-indigo bg-lavender text-indigo font-bold shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 mb-1" />
                        <span className="text-xs">Pay online (Demo)</span>
                        <span className="text-[10px] text-slate-400 font-normal">No real money</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentChoice('cod')}
                        className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                          paymentChoice === 'cod'
                            ? 'border-indigo bg-lavender text-indigo font-bold shadow-sm'
                            : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
                        }`}
                      >
                        <Banknote className="w-4 h-4 mb-1" />
                        <span className="text-xs">Cash on delivery</span>
                        <span className="text-[10px] text-slate-400 font-normal">Pay at gate</span>
                      </button>
                    </div>
                  </div>

                  {/* Promo / Coupon Code Section */}
                  <div className="pt-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-rose" />
                        Have a Promo Code?
                      </span>
                      {!couponCode && (
                        <button
                          type="button"
                          onClick={() => {
                            applyCoupon('TRYNEW20');
                          }}
                          className="text-[10px] text-rose font-bold hover:underline"
                        >
                          Use TRYNEW20 (20% OFF)
                        </button>
                      )}
                    </label>

                    {couponCode ? (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          <div>
                            <div className="text-xs font-bold text-emerald-900">
                              Code <span className="font-mono">{couponCode}</span> Applied!
                            </div>
                            <div className="text-[11px] text-emerald-700">
                              20% OFF (-₹{discountAmount}) saved on your order
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeCoupon}
                          className="text-xs font-bold text-red-600 hover:text-red-800 p-1 rounded"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-1.5">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={inputCoupon}
                            onChange={(e) => setInputCoupon(e.target.value.toUpperCase())}
                            placeholder="e.g. TRYNEW20"
                            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono font-bold uppercase tracking-wider bg-white focus:outline-none focus:ring-2 focus:ring-indigo/20 focus:border-indigo"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              applyCoupon(inputCoupon);
                              setInputCoupon('');
                            }}
                            className="px-4 py-2 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-bold text-xs shadow-xs transition-colors"
                          >
                            Apply
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-[11px] text-red-500 font-medium">{couponError}</p>
                        )}
                        {couponSuccess && (
                          <p className="text-[11px] text-emerald-600 font-medium">{couponSuccess}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Discreet Packaging Note */}
                  <div className="p-3 rounded-xl bg-lavender/60 border border-lavender-border flex items-center gap-2 text-xs text-indigo">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Dispatched in 100% plain, unmarked, tamper-evident envelope.</span>
                  </div>
                </>
              )}
            </div>

            {/* Drawer Footer Checkout Button */}
            {items.length > 0 && (
              <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 space-y-3">
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between text-slate-600">
                    <span>Kits Subtotal:</span>
                    <span className="font-semibold text-slate-900">₹{subtotal}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>First Order Discount ({couponCode}):</span>
                      </span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      <span>Rider Delivery:</span>
                      <span className="text-[10px] text-slate-400">({currentZone?.time || '~10 Mins'})</span>
                    </span>
                    <span className="font-semibold text-indigo">₹{deliveryFee}</span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-indigo pt-2 border-t border-slate-200">
                    <span>Total Amount:</span>
                    <div className="text-right">
                      <span>₹{total}</span>
                      {discountAmount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-semibold">
                          You saved ₹{discountAmount} (20% OFF)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutClick}
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-sm shadow-lg shadow-indigo/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-block animate-spin mr-2">⟳ Placing Order…</span>
                  ) : (
                    <>
                      <span>Place 10-Minute Order · ₹{total}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Demo Online Payment Gateway Modal */}
      <DemoPaymentModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        amount={total}
        onComplete={(paymentRes) => {
          processOrder({
            paid: paymentRes.paid,
            reference: paymentRes.reference,
            method: 'online'
          });
        }}
      />
    </>
  );
}
