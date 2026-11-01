import React, { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import {
  ShoppingBag,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Package,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminOrders() {
  const { adminToken } = useAuth();
  const { addToast } = useToast();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders', {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      const data = await res.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [adminToken]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      addToast(`Order updated to ${newStatus}`, 'success');
      fetchOrders();
      if (selectedOrder && (selectedOrder._id === orderId || selectedOrder.id === orderId)) {
        setSelectedOrder(data.order);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  const handleExportCSV = () => {
    window.open('/api/admin/reports/csv', '_blank');
    addToast('Exporting orders CSV report...', 'info');
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
      doc.text('Tax Invoice & Packing Slip', 16, 26);

      doc.setTextColor(50, 50, 50);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(`Order: ${order.orderNumber}`, 16, 48);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, 16, 55);
      doc.text(`Payment: ${order.paymentMethod}`, 16, 61);

      doc.text('Customer:', 120, 48);
      doc.setFont('helvetica', 'bold');
      doc.text(`${order.customerName}`, 120, 55);
      doc.setFont('helvetica', 'normal');
      doc.text(`${order.shippingAddress?.addressLine || ''}`, 120, 61);
      doc.text(
        `${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${
          order.shippingAddress?.pincode || ''
        }`,
        120,
        67
      );

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

      y += 8;
      doc.setFont('helvetica', 'bold');
      doc.text(`Total: Rs. ${order.total}`, 145, y);

      doc.save(`PeriodReady_Invoice_${order.orderNumber}.pdf`);
      addToast('Invoice downloaded', 'success');
    } catch (e) {
      addToast('Error generating PDF', 'error');
    }
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'All' && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber?.toLowerCase().includes(q);
      const matchCust = o.customerName?.toLowerCase().includes(q);
      const matchMail = o.customerEmail?.toLowerCase().includes(q);
      return matchNum || matchCust || matchMail;
    }
    return true;
  });

  const statuses = ['All', 'Placed', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-black text-gray-900">Orders & Fulfillment</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Process orders, track parcel dispatch status, and download tax invoices.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold hover:bg-emerald-700 shadow-sm transition"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export All Orders to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-gray-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {statuses.map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                statusFilter === st
                  ? 'bg-brand-purple text-white shadow-soft'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search order #, customer, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-brand-purple bg-gray-50/50"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-200 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="py-4 px-6">Order ID & Date</th>
                <th className="py-4 px-4">Customer Details</th>
                <th className="py-4 px-4">Items Summary</th>
                <th className="py-4 px-4">Payment</th>
                <th className="py-4 px-4">Total</th>
                <th className="py-4 px-4">Fulfillment Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((o) => (
                <tr key={o._id || o.id} className="hover:bg-gray-50/50">
                  <td className="py-4 px-6">
                    <span className="font-mono font-black text-brand-purple text-sm block">
                      {o.orderNumber}
                    </span>
                    <span className="text-[11px] text-gray-400">
                      {new Date(o.createdAt).toLocaleDateString()}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-bold text-gray-900 block">{o.customerName}</span>
                    <span className="text-[11px] text-gray-500">{o.customerEmail}</span>
                    <span className="text-[11px] text-gray-400 block">{o.customerPhone}</span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="text-gray-700 font-medium block">
                      {o.items?.length || 0} items
                    </span>
                    <span className="text-[10px] text-gray-400 line-clamp-1">
                      {o.items?.map((i) => i.title).join(', ')}
                    </span>
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-medium text-gray-800 block text-[11px]">
                      {o.paymentMethod}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase ${
                        o.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}
                    >
                      {o.paymentStatus}
                    </span>
                  </td>

                  <td className="py-4 px-4 font-black text-gray-900 text-sm">₹{o.total}</td>

                  {/* Status Dropdown */}
                  <td className="py-4 px-4">
                    <select
                      value={o.status}
                      onChange={(e) => handleUpdateStatus(o._id, e.target.value)}
                      className={`px-2.5 py-1 rounded-xl text-xs font-bold border ${
                        o.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : o.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : 'bg-purple-50 text-brand-purple border-purple-200'
                      }`}
                    >
                      <option value="Placed">Placed</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Packed">Packed</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="p-1.5 text-gray-500 hover:text-brand-purple rounded-lg hover:bg-gray-100"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => downloadPDFInvoice(o)}
                      className="p-1.5 text-gray-500 hover:text-emerald-600 rounded-lg hover:bg-gray-100"
                      title="Print Invoice"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-soft-lg max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <div>
                <h3 className="font-heading font-black text-xl text-brand-purple">Order Summary</h3>
                <span className="font-mono text-xs text-gray-500 font-bold">
                  {selectedOrder.orderNumber}
                </span>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Customer & Shipping */}
              <div className="p-3 bg-gray-50 rounded-2xl space-y-1">
                <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-gray-500">{selectedOrder.customerEmail} • {selectedOrder.customerPhone}</p>
                <p className="text-gray-600 mt-1">
                  <strong>Delivery:</strong> {selectedOrder.shippingAddress?.addressLine},{' '}
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} -{' '}
                  {selectedOrder.shippingAddress?.pincode}
                </p>
              </div>

              {/* Items */}
              <div className="space-y-2">
                <span className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">
                  Ordered Kits:
                </span>
                {(selectedOrder.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-purple-50/50">
                    <div>
                      <span className="font-bold text-gray-900 block">{it.title}</span>
                      <span className="text-[11px] text-gray-500">{it.variantInfo} x{it.quantity}</span>
                    </div>
                    <span className="font-bold text-brand-purple">₹{it.price * it.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-2 border-t border-gray-100 space-y-1 text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount:</span>
                    <span>-₹{selectedOrder.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>₹{selectedOrder.deliveryCharge}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST:</span>
                  <span>₹{selectedOrder.gst}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-brand-purple pt-1 border-t border-gray-100">
                  <span>Grand Total:</span>
                  <span>₹{selectedOrder.total}</span>
                </div>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  onClick={() => downloadPDFInvoice(selectedOrder)}
                  className="w-full py-2.5 rounded-xl bg-brand-purple text-white text-xs font-bold hover:bg-brand-purpleDark"
                >
                  Download PDF Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
