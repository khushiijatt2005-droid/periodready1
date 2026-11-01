import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { jsPDF } from 'jspdf';
import {
  CheckCircle2,
  Package,
  Truck,
  ShieldCheck,
  Download,
  ArrowRight,
  Clock,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const { token } = useAuth();
  const { addToast } = useToast();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#551D82', '#E05A74', '#FFD166', '#F8BBD0'],
      });
    } catch (e) {
      // Ignore if confetti fails
    }

    if (orderId && token) {
      fetch(`/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          setOrder(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [orderId, token]);

  const downloadPDFInvoice = () => {
    if (!order) return;

    try {
      const doc = new jsPDF();

      // Brand Header
      doc.setFillColor(85, 29, 130); // #551D82
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('PeriodReady', 16, 18);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text('Be Ready. Feel Confident. Keep Going. — Discreet Menstrual Care', 16, 26);
      doc.text('GSTIN: 29AABCP1234F1Z8 | support@periodready.in', 16, 31);

      // Invoice Details Block
      doc.setTextColor(50, 50, 50);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('TAX INVOICE & ORDER RECEIPT', 16, 50);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Order Number: ${order.orderNumber || order._id}`, 16, 58);
      doc.text(`Order Date: ${new Date(order.createdAt || Date.now()).toLocaleDateString()}`, 16, 64);
      doc.text(`Payment Method: ${order.paymentMethod}`, 16, 70);
      doc.text(`Payment Status: ${order.paymentStatus?.toUpperCase()}`, 16, 76);

      // Customer Address
      doc.text('Billed & Shipped To:', 120, 58);
      doc.setFont('helvetica', 'bold');
      doc.text(`${order.customerName}`, 120, 64);
      doc.setFont('helvetica', 'normal');
      doc.text(`${order.shippingAddress?.addressLine || ''}`, 120, 70);
      doc.text(
        `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${
          order.shippingAddress?.pincode || ''
        }`,
        120,
        76
      );
      doc.text(`Phone: ${order.shippingAddress?.phone || order.customerPhone || ''}`, 120, 82);

      // Items Table Header
      let y = 96;
      doc.setFillColor(245, 240, 250);
      doc.rect(16, y - 6, 178, 9, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(85, 29, 130);
      doc.text('Item Description', 20, y);
      doc.text('Qty', 130, y);
      doc.text('Unit Price', 150, y);
      doc.text('Total (INR)', 175, y);

      // Items rows
      y += 8;
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(60, 60, 60);

      (order.items || []).forEach((item) => {
        doc.text(`${item.title} (${item.variantInfo || 'Standard'})`, 20, y);
        doc.text(`${item.quantity}`, 133, y);
        doc.text(`Rs. ${item.price}`, 150, y);
        doc.text(`Rs. ${item.price * item.quantity}`, 175, y);
        y += 7;
      });

      // Price Breakdown Line
      y += 6;
      doc.setDrawColor(200, 200, 200);
      doc.line(16, y, 194, y);
      y += 8;

      doc.text(`Subtotal: Rs. ${order.subtotal}`, 145, y);
      y += 6;
      if (order.discount > 0) {
        doc.text(`Coupon Discount: -Rs. ${order.discount}`, 145, y);
        y += 6;
      }
      doc.text(`Discreet Delivery Charge: Rs. ${order.deliveryCharge}`, 145, y);
      y += 6;
      doc.text(`GST (5% Hygiene items): Rs. ${order.gst}`, 145, y);
      y += 8;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(85, 29, 130);
      doc.text(`Grand Total: Rs. ${order.total}`, 145, y);

      // Footer discreet notice
      y += 24;
      doc.setFontSize(8);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(120, 120, 120);
      doc.text(
        'Packaging Note: Shipped in plain, unbranded discreet brown packaging. No product details on exterior label.',
        16,
        y
      );
      y += 5;
      doc.text('Thank you for choosing PeriodReady! Feel confident and keep going.', 16, y);

      doc.save(`PeriodReady_Invoice_${order.orderNumber || 'receipt'}.pdf`);
      addToast('Invoice PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('PDF error:', err);
      addToast('Could not generate PDF invoice', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Confirmation Top Hero */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 text-center shadow-soft border border-rose-100 space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3.5 py-1 rounded-full">
          Order Confirmed & Placed
        </span>

        <h1 className="text-3xl sm:text-4xl font-heading font-black text-brand-purple">
          You're All Set! Be Ready, Feel Confident.
        </h1>

        <p className="text-sm text-gray-600 max-w-lg mx-auto">
          We have received your order. Your emergency kit is being sealed in our signature 100% plain, discreet unbranded outer parcel.
        </p>

        {order && (
          <div className="inline-block bg-purple-50 text-brand-purple px-5 py-2 rounded-2xl text-xs font-mono font-bold border border-purple-100">
            Order Reference: {order.orderNumber}
          </div>
        )}
      </div>

      {order && (
        <div className="space-y-6">
          {/* Order Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Delivery Timeline and Details */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 space-y-4">
              <div className="flex items-center gap-2 text-brand-purple">
                <Truck className="w-5 h-5 text-brand-accent" />
                <h3 className="font-heading font-bold text-lg">Delivery Information</h3>
              </div>

              <div className="text-xs text-gray-600 space-y-2">
                <p>
                  <strong className="text-gray-900">Recipient:</strong> {order.customerName}
                </p>
                <p>
                  <strong className="text-gray-900">Address:</strong> {order.shippingAddress?.addressLine},{' '}
                  {order.shippingAddress?.city}, {order.shippingAddress?.state} -{' '}
                  <span className="font-bold text-gray-900">{order.shippingAddress?.pincode}</span>
                </p>
                <p>
                  <strong className="text-gray-900">Estimated Delivery:</strong> 2-3 Business Days
                </p>
                <p>
                  <strong className="text-gray-900">Packaging Type:</strong> Plain unmarked brown parcel
                </p>
              </div>

              {/* Status Timeline */}
              <div className="pt-4 border-t border-gray-100">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">
                  Current Status: <strong className="text-brand-purple">{order.status}</strong>
                </span>
                <div className="space-y-2">
                  {(order.timeline || []).map((tl, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div>
                        <span className="font-bold text-gray-800">{tl.status}: </span>
                        <span className="text-gray-500">{tl.note}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment & Action Summary */}
            <div className="bg-white rounded-3xl p-6 shadow-soft border border-rose-100 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-brand-purple mb-4">
                  <CreditCard className="w-5 h-5 text-brand-accent" />
                  <h3 className="font-heading font-bold text-lg">Payment & Bill</h3>
                </div>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="font-bold text-gray-800">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <span className="font-bold text-emerald-600 uppercase">{order.paymentStatus}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{order.subtotal}</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Discount:</span>
                      <span>-₹{order.discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Delivery:</span>
                    <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>GST (5%):</span>
                    <span>₹{order.gst}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-brand-purple">
                    <span>Total Paid / Payable:</span>
                    <span>₹{order.total}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <button
                  onClick={downloadPDFInvoice}
                  className="w-full py-3 px-4 rounded-xl border border-brand-purple text-brand-purple text-xs font-bold hover:bg-purple-50 transition flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Tax Invoice (PDF)</span>
                </button>
                <Link
                  to="/shop"
                  className="w-full py-3 px-4 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark transition flex items-center justify-center gap-2 shadow-soft"
                >
                  <span>Continue Shopping</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
