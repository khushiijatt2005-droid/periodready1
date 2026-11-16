import React, { useState } from 'react';
import { X, ShieldAlert, CreditCard, Smartphone, Building2, CheckCircle2 } from 'lucide-react';

export default function DemoPaymentModal({ isOpen, onClose, amount, onComplete }) {
  const [selectedMethod, setSelectedMethod] = useState('upi');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setIsProcessing(true);
    // Simulate payment gateway delay (approx 1.5s as requested)
    setTimeout(() => {
      setIsProcessing(false);
      const referenceId = `DEMO${Math.floor(1000 + Math.random() * 9000)}`;
      onComplete({
        paid: true,
        reference: referenceId,
        method: selectedMethod
      });
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-lavender-border overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning / Notice Banner */}
        <div className="bg-amber-500 text-slate-950 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-slate-950 shrink-0" />
            <span className="font-bold text-xs sm:text-sm tracking-wide uppercase">
              DEMO MODE · No real money is charged
            </span>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="text-center mb-6">
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
              Total Payable Amount
            </span>
            <div className="font-serif font-bold text-3xl text-indigo mt-1">
              ₹{amount}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Select any method below. No sensitive card or UPI details are collected.
            </p>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 mb-6">
            <label
              onClick={() => setSelectedMethod('upi')}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'upi'
                  ? 'border-indigo bg-lavender text-indigo shadow-sm'
                  : 'border-slate-200 hover:border-indigo/40 bg-white text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMethod === 'upi' ? 'bg-indigo text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Smartphone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">UPI (GPay / PhonePe / Paytm)</div>
                <div className="text-xs text-slate-500">Instant demo verification</div>
              </div>
              <input
                type="radio"
                name="demo_method"
                checked={selectedMethod === 'upi'}
                onChange={() => setSelectedMethod('upi')}
                className="w-4 h-4 text-indigo accent-indigo"
              />
            </label>

            <label
              onClick={() => setSelectedMethod('card')}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'card'
                  ? 'border-indigo bg-lavender text-indigo shadow-sm'
                  : 'border-slate-200 hover:border-indigo/40 bg-white text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMethod === 'card' ? 'bg-indigo text-white' : 'bg-slate-100 text-slate-600'}`}>
                <CreditCard className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Debit / Credit Card</div>
                <div className="text-xs text-slate-500">Demo sandbox gateway simulation</div>
              </div>
              <input
                type="radio"
                name="demo_method"
                checked={selectedMethod === 'card'}
                onChange={() => setSelectedMethod('card')}
                className="w-4 h-4 text-indigo accent-indigo"
              />
            </label>

            <label
              onClick={() => setSelectedMethod('netbanking')}
              className={`flex items-center gap-3.5 p-3.5 rounded-2xl border cursor-pointer transition-all ${
                selectedMethod === 'netbanking'
                  ? 'border-indigo bg-lavender text-indigo shadow-sm'
                  : 'border-slate-200 hover:border-indigo/40 bg-white text-slate-700'
              }`}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMethod === 'netbanking' ? 'bg-indigo text-white' : 'bg-slate-100 text-slate-600'}`}>
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">Net Banking</div>
                <div className="text-xs text-slate-500">HDFC, ICICI, SBI, Axis simulated</div>
              </div>
              <input
                type="radio"
                name="demo_method"
                checked={selectedMethod === 'netbanking'}
                onChange={() => setSelectedMethod('netbanking')}
                className="w-4 h-4 text-indigo accent-indigo"
              />
            </label>
          </div>

          {/* Action Button */}
          <button
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-sm shadow-lg shadow-indigo/20 flex items-center justify-center gap-2 transition-all disabled:opacity-75"
          >
            {isProcessing ? (
              <>
                <span className="inline-block animate-spin mr-2">⟳</span>
                <span>Processing…</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Pay ₹{amount} (Demo)</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-400 mt-3">
            Note: This mock payment processor is ready to be swapped with Razorpay in production.
          </p>
        </div>
      </div>
    </div>
  );
}
