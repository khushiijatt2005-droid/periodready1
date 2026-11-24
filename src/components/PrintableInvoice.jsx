import React from 'react';
import { X, Printer, Download, CheckCircle2, Clock, MapPin, Phone, Mail } from 'lucide-react';

export default function PrintableInvoice({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const itemsText = (order.items || []).map(i => `${i.name} (x${i.quantity || 1})`).join(', ');
    const message = `🌸 *PeriodReady Order #${order.id}*\n\n👤 *Customer:* ${order.name}\n📞 *Phone:* ${order.phone}\n📍 *Address:* ${order.address}\n📦 *Items:* ${itemsText}\n💰 *Total:* ₹${order.total} (${order.payment_method?.toUpperCase() || 'COD'})\n\n⏰ *10-Minute Emergency Menstrual Delivery*`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const invoiceDate = new Date(order.created_at || Date.now()).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto animate-fade-in no-print">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-lavender-border my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Controls Toolbar (Hidden when printing) */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center justify-between no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tax Invoice &amp; Delivery Receipt
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <span>💬 Send on WhatsApp</span>
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo hover:bg-indigo-dark text-white text-xs font-semibold shadow-sm transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-invoice" className="p-8 sm:p-10 bg-white text-slate-800">
          
          {/* WhatsApp Confirmation Banner for Customer */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 no-print">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <div className="text-xs font-bold text-emerald-900">
                  Instant WhatsApp Order Receipt &amp; Rider Tracking
                </div>
                <div className="text-[11px] text-emerald-700">
                  Tap to save or share your complete order receipt on WhatsApp.
                </div>
              </div>
            </div>
            <button
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all hover:scale-[1.02] shrink-0"
            >
              <span>Open on WhatsApp ↗</span>
            </button>
          </div>

          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-200 pb-8">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-lavender p-1.5 border border-lavender-border flex items-center justify-center">
                <img src="/images/logo.png" alt="PeriodReady" className="w-full h-full object-contain" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl text-indigo tracking-tight">PeriodReady</h1>
                <p className="text-xs text-rose font-semibold tracking-wider uppercase">
                  10-Minute Emergency Menstrual Kits
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  Vijay Nagar, Indore, Madhya Pradesh 452001
                </p>
                <p className="text-xs text-slate-500">
                  periodready1@gmail.com
                </p>
              </div>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-2 bg-indigo/10 text-indigo border border-indigo/20">
                Invoice #{order.id}
              </span>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-700">Date:</strong> {invoiceDate}
              </p>
              <p className="text-xs text-slate-500">
                <strong className="text-slate-700">Status:</strong> {order.status}
              </p>
              <div className="mt-2">
                {order.paid ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    PAID ({order.reference || 'ONLINE'})
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                    <Clock className="w-3 h-3 text-amber-600" />
                    Cash on delivery (Pending)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Billed To */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 p-4 rounded-2xl bg-lavender/50 border border-lavender-border">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                Billed To &amp; Delivery Destination:
              </span>
              <p className="font-bold text-sm text-slate-900">{order.name}</p>
              <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-indigo shrink-0" />
                {order.phone}
              </p>
              <p className="text-xs text-slate-600 mt-1 flex items-start gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose shrink-0 mt-0.5" />
                <span>{order.address}</span>
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-400 block mb-1">
                Fulfillment Logistics:
              </span>
              <p className="text-xs text-slate-700 font-medium">10-Min Fast Track Gate Delivery</p>
              <p className="text-xs text-slate-600 mt-0.5">Packaging: 100% Plain Discreet Envelope</p>
              <p className="text-xs text-slate-600 mt-0.5">Dispatched from: Vijay Nagar Hub, Indore</p>
            </div>
          </div>

          {/* Items Table */}
          <div className="overflow-x-auto my-6">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 font-bold">Item Description</th>
                  <th className="py-2.5 text-center font-bold">Qty</th>
                  <th className="py-2.5 text-right font-bold">Unit Price</th>
                  <th className="py-2.5 text-right font-bold">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-3 pr-2">
                      <div className="font-semibold text-slate-900">{item.name}</div>
                      {item.color && (
                        <div className="text-[11px] text-slate-500">Colour: {item.color}</div>
                      )}
                    </td>
                    <td className="py-3 px-2 text-center text-slate-700">{item.quantity}</td>
                    <td className="py-3 px-2 text-right text-slate-700">₹{item.price}</td>
                    <td className="py-3 pl-2 text-right font-semibold text-slate-900">
                      ₹{item.price * item.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Summary */}
          <div className="border-t border-slate-200 pt-4 flex flex-col items-end">
            <div className="w-full max-w-xs space-y-1.5 text-xs sm:text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span>₹{order.subtotal || order.total}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>First Order Discount ({order.coupon_code || 'TRYNEW20'}):</span>
                  <span>-₹{order.discount}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Rider Delivery:</span>
                <span className="font-semibold text-indigo">
                  {order.delivery_fee ? `₹${order.delivery_fee}` : (order.delivery_zone ? '₹15' : 'FREE')}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold text-indigo pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Bottom Stamp / Note */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div>
              Thank you for choosing PeriodReady! Stay confident &amp; prepared.
            </div>
            <div>
              Generated on {new Date().toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
