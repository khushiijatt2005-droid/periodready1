import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { dbGetOrders } from '../lib/supabase';
import { User, Package, Calendar, MapPin, Printer, LogOut, CheckCircle2, Clock, ChevronRight } from 'lucide-react';
import PrintableInvoice from '../components/PrintableInvoice';

export default function AccountPage() {
  const { user, logout, setAuthModalOpen, setAuthModalMode } = useAuth();
  const { setRecentOrder } = useCart();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    async function loadUserOrders() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const allOrders = await dbGetOrders();
        // Match user's email or phone or customer_id
        const userOrders = allOrders.filter(o => 
          (user.email && o.customer?.toLowerCase() === user.name?.toLowerCase()) ||
          (user.email && o.name?.toLowerCase() === user.name?.toLowerCase()) ||
          o.customer_id === user.id ||
          (user.phone && o.phone === user.phone)
        );
        setOrders(userOrders);
      } catch (e) {
        console.error('Failed to load user orders', e);
      } finally {
        setLoading(false);
      }
    }

    loadUserOrders();
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-16 h-16 mx-auto rounded-full bg-lavender flex items-center justify-center text-indigo">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-indigo">Account Sign In</h2>
        <p className="text-xs sm:text-sm text-slate-600">
          Sign in to view your previous period emergency orders, track deliveries, and print tax invoices.
        </p>
        <button
          onClick={() => {
            setAuthModalMode('login');
            setAuthModalOpen(true);
          }}
          className="px-6 py-3 rounded-full bg-indigo hover:bg-indigo-dark text-white font-bold text-sm shadow-md transition-colors"
        >
          Sign In / Create Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      
      {/* Account Overview Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-lavender-border shadow-soft flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-lavender border border-lavender-border flex items-center justify-center text-indigo font-serif font-bold text-2xl shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-rose">
              Verified Customer
            </span>
            <h1 className="font-serif font-bold text-2xl text-slate-900">
              {user.name}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {user.email} {user.phone && `· ${user.phone}`}
            </p>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors border border-slate-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Orders History Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-indigo flex items-center gap-2">
            <Package className="w-5 h-5 text-rose" />
            <span>Your Emergency Order History</span>
          </h2>
          <span className="text-xs font-semibold text-slate-500">
            {orders.length} {orders.length === 1 ? 'order' : 'orders'} placed
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading your orders…</div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-lavender-border space-y-3">
            <p className="text-sm text-slate-500">You haven't placed any emergency orders yet.</p>
            <p className="text-xs text-slate-400">All your future orders and printable invoices will appear right here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white rounded-2xl p-5 sm:p-6 border border-lavender-border shadow-soft flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-indigo/40 transition-colors"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-sm text-slate-900">Order #{ord.id}</span>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">
                      {new Date(ord.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-lavender text-indigo border border-lavender-border">
                      {ord.status}
                    </span>
                    {ord.paid ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        PAID
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        <Clock className="w-3 h-3 text-amber-600" />
                        COD
                      </span>
                    )}
                  </div>

                  {/* Items summary */}
                  <div className="text-xs text-slate-600">
                    {ord.items?.map(it => `${it.quantity}x ${it.name}`).join(', ')}
                  </div>

                  <div className="text-xs text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose shrink-0" />
                    <span className="truncate max-w-md">{ord.address}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-left md:text-right">
                    <div className="font-serif font-bold text-lg text-indigo">₹{ord.total}</div>
                    <div className="text-[10px] text-emerald-600 font-semibold uppercase">10-Min Free Drop</div>
                  </div>

                  <button
                    onClick={() => setSelectedInvoiceOrder(ord)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-lavender hover:bg-indigo hover:text-white text-indigo text-xs font-semibold border border-lavender-border transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View Invoice</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <PrintableInvoice
          order={selectedInvoiceOrder}
          isOpen={Boolean(selectedInvoiceOrder)}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}

    </div>
  );
}
