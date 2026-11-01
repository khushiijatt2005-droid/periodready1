import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  ShoppingBag,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Calendar,
  CheckCircle,
  Truck,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { adminToken } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/dashboard', {
      headers: { Authorization: `Bearer ${adminToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [adminToken]);

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-brand-purple border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!metrics) return <div>Failed to load metrics</div>;

  const maxRevenue = Math.max(...(metrics.salesLast7Days || []).map((d) => d.revenue), 1000);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-black text-gray-900">
          Operations Overview
        </h1>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">
          Real-time metrics, order fulfillments, and stock alerts for PeriodReady.
        </p>
      </div>

      {/* 4 KPI Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Sales */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Total Revenue</span>
            <div className="p-2 rounded-xl bg-purple-50 text-brand-purple">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">₹{metrics.totalSales.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
            <span>₹{metrics.todaySales} from today's orders</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">All Orders</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{metrics.totalOrders}</div>
          <div className="text-[11px] text-gray-500 font-semibold">
            {metrics.todayOrdersCount} placed today
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Customers</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-gray-900">{metrics.totalCustomers}</div>
          <div className="text-[11px] text-purple-600 font-semibold">Registered D2C Accounts</div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-bold uppercase tracking-wider">Stock Alerts</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-600">{metrics.lowStockAlerts?.length || 0}</div>
          <div className="text-[11px] text-gray-500 font-semibold">Variants require restock</div>
        </div>
      </div>

      {/* 7-Day Revenue Trend Chart & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-lg text-gray-900">7-Day Sales Performance</h3>
              <p className="text-xs text-gray-500">Daily gross sales recorded in INR</p>
            </div>
            <span className="text-xs font-bold text-brand-purple bg-purple-50 px-3 py-1 rounded-full">
              Last 7 Days
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-48 flex items-end gap-3 sm:gap-6 justify-between px-2">
              {(metrics.salesLast7Days || []).map((day, idx) => {
                const heightPct = Math.max(12, Math.round((day.revenue / maxRevenue) * 100));
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[10px] font-bold py-1 px-2 rounded pointer-events-none whitespace-nowrap mb-1">
                      ₹{day.revenue} ({day.ordersCount} orders)
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-brand-purple to-brand-purpleLight rounded-xl transition-all duration-300 group-hover:from-brand-accent group-hover:to-rose-400"
                    />
                    <span className="text-[11px] font-bold text-gray-500 mt-1">{day.dayName}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <h3 className="font-heading font-black text-lg text-gray-900">Top Selling Kits</h3>
          <p className="text-xs text-gray-500">Most requested product tiers</p>

          <div className="space-y-3 pt-2">
            {(metrics.topProducts || []).length === 0 ? (
              <p className="text-xs text-gray-400 py-4">No order items recorded yet</p>
            ) : (
              metrics.topProducts.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-purple-100 text-brand-purple font-black text-xs flex items-center justify-center">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-xs text-gray-900 block truncate max-w-[150px]">
                        {p.name}
                      </span>
                      <span className="text-[10px] text-gray-400">Emergency Kit</span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-brand-purple">{p.sold} sold</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Low Stock Alerts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Low Stock Watchlist */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-heading font-bold text-base">Low Stock Watchlist</h3>
            </div>
            <Link to="/admin/products" className="text-xs text-brand-purple font-bold hover:underline">
              Manage All
            </Link>
          </div>

          <div className="space-y-2 pt-1 max-h-72 overflow-y-auto pr-1">
            {metrics.lowStockAlerts?.length === 0 ? (
              <p className="text-xs text-gray-400 py-4 text-center">All variants are well-stocked!</p>
            ) : (
              metrics.lowStockAlerts?.map((v) => (
                <div key={v._id} className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/60 border border-amber-200/60">
                  <div>
                    <span className="font-bold text-xs text-gray-900 block">{v.productName}</span>
                    <span className="text-[10px] text-gray-500">
                      {v.colorName} • {v.packSize} (SKU: {v.sku})
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-amber-700 block">{v.stock} left</span>
                    <span className="text-[10px] text-gray-500">₹{v.price}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Orders Overview */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-gray-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-lg text-gray-900">Recent Dispatches</h3>
            <Link to="/admin/orders" className="text-xs text-brand-purple font-bold hover:underline">
              View All Orders →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-gray-100 text-gray-400 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Amount</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(metrics.recentOrders || []).map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/50">
                    <td className="py-3 font-mono font-bold text-brand-purple">{o.orderNumber}</td>
                    <td className="py-3 text-gray-800 font-medium">{o.customerName}</td>
                    <td className="py-3 font-bold text-gray-900">₹{o.total}</td>
                    <td className="py-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          o.status === 'Delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : o.status === 'Shipped'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-purple-100 text-brand-purple'
                        }`}
                      >
                        {o.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
