import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, subtotal, totalItemsCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-purpleDark/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-soft-lg flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-rose-100 flex items-center justify-between bg-brand-blush">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-purple" />
              <h2 className="text-lg font-heading font-bold text-brand-purple">Your Bag ({totalItemsCount})</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Discreet Packaging Pill */}
          <div className="bg-purple-50 px-4 py-2 text-xs text-brand-purple flex items-center gap-2 border-b border-purple-100">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>100% Plain, discreet unbranded outer parcel guaranteed.</span>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-brand-blush rounded-full flex items-center justify-center text-brand-purple">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="font-heading font-semibold text-gray-800 text-lg">Your emergency kit bag is empty</h3>
                <p className="text-sm text-gray-500 mt-1 max-w-xs mx-auto">
                  Be prepared anytime, anywhere. Pick a kit that fits your everyday routine.
                </p>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/shop');
                  }}
                  className="mt-6 inline-flex items-center gap-2 bg-brand-purple text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-brand-purpleDark transition shadow-soft"
                >
                  Explore Kits
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.variantId} className="flex gap-4 p-3 rounded-2xl bg-brand-blush/60 border border-rose-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-xl border border-white shadow-sm bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-heading font-bold text-brand-purple text-sm leading-tight">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-0.5">{item.variantInfo}</p>
                      <div className="mt-1 font-bold text-brand-purple text-sm">₹{item.price}</div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 bg-white rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                          className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-semibold text-gray-800">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                          className="px-2.5 py-0.5 text-gray-600 hover:bg-gray-100 text-xs font-bold"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.variantId)}
                        className="text-gray-400 hover:text-rose-500 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-rose-100 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-bold text-gray-900 text-base">₹{subtotal}</span>
              </div>
              <p className="text-xs text-gray-500">Taxes, coupons, and free delivery calculated at checkout.</p>
              
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/cart');
                  }}
                  className="w-full py-3 px-4 rounded-xl border border-brand-purple text-brand-purple font-semibold text-sm hover:bg-purple-50 transition text-center"
                >
                  View Full Bag
                </button>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-brand-purple text-white font-semibold text-sm hover:bg-brand-purpleDark transition shadow-soft flex items-center justify-center gap-1.5"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
