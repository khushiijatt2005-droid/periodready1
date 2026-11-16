import React, { useState, useEffect, useMemo } from 'react';
import { 
  Lock, 
  DollarSign, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Truck, 
  MoreVertical, 
  Phone, 
  Printer, 
  Settings, 
  ShieldCheck, 
  FileText, 
  LogOut, 
  AlertTriangle,
  Save,
  Search,
  ExternalLink,
  ChevronDown,
  Sparkles,
  Flame,
  RefreshCw,
  Package
} from 'lucide-react';
import { 
  dbGetOrders, 
  dbUpdateOrderStatus, 
  dbUpdateOrderPayment, 
  dbGetCustomers, 
  dbGetProductCosts, 
  dbUpdateProductCost,
  dbResetCampaignData,
  isSupabaseConfigured
} from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import PrintableInvoice from '../components/PrintableInvoice';

export default function AdminPage() {
  const { user, isAdmin, login, logout } = useAuth();

  // Login form state for protected view
  const [adminEmail, setAdminEmail] = useState('periodready1@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Data states
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [productCosts, setProductCosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [dateRange, setDateRange] = useState('all'); // 'today' | '7days' | '30days' | 'all'
  const [campaignFilter, setCampaignFilter] = useState('all'); // 'all' | 'diwali' | 'week1'
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'Placed' | 'Shipped' | 'Delivered' | 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Modals & Drawers
  const [activeMenuOrderId, setActiveMenuOrderId] = useState(null);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [isCostModalOpen, setIsCostModalOpen] = useState(false);
  const [editedCosts, setEditedCosts] = useState({});
  const [saveCostSuccess, setSaveCostSuccess] = useState(false);

  // Load Admin Data
  const loadData = async () => {
    setLoading(true);
    try {
      const [allOrders, allCustomers, costs] = await Promise.all([
        dbGetOrders(),
        dbGetCustomers(),
        dbGetProductCosts()
      ]);
      setOrders(allOrders || []);
      setCustomers(allCustomers || []);
      setProductCosts(costs || []);

      const costMap = {};
      (costs || []).forEach(c => {
        costMap[c.product_id] = c.cost_per_unit;
      });
      setEditedCosts(costMap);
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  const handleAdminLogin = async (e) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    const passToUse = adminPassword.trim() || 'Admin@PeriodReady2026';
    try {
      await login(adminEmail, passToUse);
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleDirectAdminLogin = async () => {
    setLoginError('');
    setLoginLoading(true);
    setAdminEmail('periodready1@gmail.com');
    setAdminPassword('Admin@PeriodReady2026');
    try {
      await login('periodready1@gmail.com', 'Admin@PeriodReady2026');
    } catch (err) {
      setLoginError(err.message || 'Invalid admin credentials');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleResetCampaign = async () => {
    if (window.confirm('Reset & load fresh 1st Week (50 sales) + 2nd Week Diwali Campaign (200 sales)?')) {
      dbResetCampaignData();
      await loadData();
    }
  };

  // Date & Campaign Filtering logic
  const filteredOrders = useMemo(() => {
    const now = new Date();
    return orders.filter(o => {
      const orderDate = new Date(o.created_at);
      
      // Date range filter
      if (dateRange === 'today') {
        const isToday = orderDate.toDateString() === now.toDateString();
        if (!isToday) return false;
      } else if (dateRange === '7days') {
        const past7 = new Date();
        past7.setDate(now.getDate() - 7);
        if (orderDate < past7) return false;
      } else if (dateRange === '30days') {
        const past30 = new Date();
        past30.setDate(now.getDate() - 30);
        if (orderDate < past30) return false;
      }

      // Campaign filter
      if (campaignFilter === 'diwali') {
        if (!o.campaign?.includes('Diwali') && !o.via?.includes('Diwali')) return false;
      } else if (campaignFilter === 'week1') {
        if (o.campaign?.includes('Diwali') || o.via?.includes('Diwali')) return false;
      }

      // Status filter
      if (statusFilter !== 'all' && o.status !== statusFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.name?.toLowerCase().includes(q);
        const matchesPhone = o.phone?.includes(q);
        const matchesId = o.id?.toLowerCase().includes(q);
        const matchesAddress = o.address?.toLowerCase().includes(q);
        const matchesCampaign = o.campaign?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId && !matchesAddress && !matchesCampaign) return false;
      }

      return true;
    });
  }, [orders, dateRange, campaignFilter, statusFilter, searchQuery]);

  // Separate Diwali Campaign & Week 1 Summary Stats
  const diwaliStats = useMemo(() => {
    const diwaliOrders = orders.filter(o => (o.campaign?.includes('Diwali') || o.via?.includes('Diwali')) && o.status !== 'Cancelled');
    const revenue = diwaliOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    let cost = 0;
    diwaliOrders.forEach(ord => {
      (ord.items || []).forEach(it => {
        const matchingCost = productCosts.find(c => c.product_id === it.id);
        const unitCost = matchingCost ? Number(matchingCost.cost_per_unit) : (it.price * 0.4);
        cost += unitCost * (it.quantity || 1);
      });
    });
    const profit = Math.max(0, revenue - cost);
    return {
      count: diwaliOrders.length,
      revenue,
      profit: Math.round(profit),
      margin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0'
    };
  }, [orders, productCosts]);

  const week1Stats = useMemo(() => {
    const w1Orders = orders.filter(o => !o.campaign?.includes('Diwali') && !o.via?.includes('Diwali') && o.status !== 'Cancelled');
    const revenue = w1Orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    let cost = 0;
    w1Orders.forEach(ord => {
      (ord.items || []).forEach(it => {
        const matchingCost = productCosts.find(c => c.product_id === it.id);
        const unitCost = matchingCost ? Number(matchingCost.cost_per_unit) : (it.price * 0.4);
        cost += unitCost * (it.quantity || 1);
      });
    });
    const profit = Math.max(0, revenue - cost);
    return {
      count: w1Orders.length,
      revenue,
      profit: Math.round(profit),
      margin: revenue > 0 ? ((profit / revenue) * 100).toFixed(1) : '0'
    };
  }, [orders, productCosts]);

  // KPI Calculations (Cancelled orders strictly excluded from revenue & profit)
  const kpis = useMemo(() => {
    const validOrders = filteredOrders.filter(o => o.status !== 'Cancelled');
    const cancelledOrders = filteredOrders.filter(o => o.status === 'Cancelled');

    const totalRevenue = validOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    const paidOnline = validOrders.filter(o => o.payment_method === 'online' && o.paid).reduce((sum, o) => sum + Number(o.total || 0), 0);
    const collected = validOrders.filter(o => o.paid).reduce((sum, o) => sum + Number(o.total || 0), 0);
    const stillToCollect = validOrders.filter(o => !o.paid).reduce((sum, o) => sum + Number(o.total || 0), 0);

    let unitsSold = 0;
    let totalCost = 0;

    validOrders.forEach(ord => {
      (ord.items || []).forEach(it => {
        const qty = Number(it.quantity || 1);
        unitsSold += qty;
        const matchingCost = productCosts.find(c => c.product_id === it.id);
        const unitCost = matchingCost ? Number(matchingCost.cost_per_unit) : (it.price * 0.4);
        totalCost += unitCost * qty;
      });
    });

    const estimatedProfit = Math.max(0, totalRevenue - totalCost);
    const profitMargin = totalRevenue > 0 ? ((estimatedProfit / totalRevenue) * 100).toFixed(1) : '0';
    const averageOrderValue = validOrders.length > 0 ? Math.round(totalRevenue / validOrders.length) : 0;

    // Customer metrics
    const customerOrderCounts = {};
    orders.forEach(o => {
      const email = o.name || o.customer;
      customerOrderCounts[email] = (customerOrderCounts[email] || 0) + 1;
    });
    const repeatCount = Object.values(customerOrderCounts).filter(c => c > 1).length;
    const newCount = customers.length;

    return {
      totalRevenue,
      paidOnline,
      collected,
      stillToCollect,
      estimatedProfit,
      profitMargin,
      ordersCount: validOrders.length,
      unitsSold,
      averageOrderValue,
      newCustomers: newCount,
      repeatCustomers: repeatCount,
      cancelledCount: cancelledOrders.length
    };
  }, [filteredOrders, productCosts, orders, customers]);

  // Last 14 days chart data
  const chart14Days = useMemo(() => {
    const days = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });

      const dayOrders = orders.filter(o => {
        if (o.status === 'Cancelled') return false;
        return o.created_at && o.created_at.startsWith(dateStr);
      });

      const dayRevenue = dayOrders.reduce((sum, o) => sum + Number(o.total || 0), 0);
      days.push({
        date: dateStr,
        label,
        orders: dayOrders.length,
        revenue: dayRevenue
      });
    }
    return days;
  }, [orders]);

  const maxRevenueInChart = Math.max(...chart14Days.map(d => d.revenue), 100);

  // Product Revenue & Profit Breakdown
  const productAnalytics = useMemo(() => {
    const map = {};
    orders.filter(o => o.status !== 'Cancelled').forEach(ord => {
      (ord.items || []).forEach(it => {
        const id = it.id;
        const name = it.shortName || it.name;
        const qty = Number(it.quantity || 1);
        const rev = Number(it.price || 0) * qty;

        const costObj = productCosts.find(c => c.product_id === id);
        const cost = (costObj ? costObj.cost_per_unit : it.price * 0.4) * qty;

        if (!map[id]) {
          map[id] = { id, name, revenue: 0, units: 0, profit: 0 };
        }
        map[id].revenue += rev;
        map[id].units += qty;
        map[id].profit += (rev - cost);
      });
    });

    const totalRev = Object.values(map).reduce((sum, p) => sum + p.revenue, 0) || 1;
    return Object.values(map).map(p => ({
      ...p,
      share: ((p.revenue / totalRev) * 100).toFixed(1)
    })).sort((a, b) => b.revenue - a.revenue);
  }, [orders, productCosts]);

  // Handlers for Order Status change
  const handleUpdateStatus = async (orderId, newStatus) => {
    await dbUpdateOrderStatus(orderId, newStatus);
    setActiveMenuOrderId(null);
    loadData();
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm(`Are you sure you want to cancel order #${orderId}? This will exclude it from total revenue calculations.`)) {
      await dbUpdateOrderStatus(orderId, 'Cancelled');
      setActiveMenuOrderId(null);
      loadData();
    }
  };

  // Save Profit Settings
  const handleSaveCosts = async () => {
    for (const [prodId, costVal] of Object.entries(editedCosts)) {
      await dbUpdateProductCost(prodId, costVal);
    }
    setSaveCostSuccess(true);
    setTimeout(() => {
      setSaveCostSuccess(false);
      setIsCostModalOpen(false);
      loadData();
    }, 800);
  };

  // Protected View: If not logged in as Admin
  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-lavender-border shadow-lift space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-indigo text-white flex items-center justify-center shadow-md">
              <Lock className="w-7 h-7 text-rose-light" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-indigo">
              Owner Admin Portal
            </h1>
            <p className="text-xs text-slate-500">
              Restricted to PeriodReady authorized operations &amp; finance team.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* 1-Click Auto Fill & Credentials Display */}
          <div className="p-4 rounded-2xl bg-lavender border border-lavender-border space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-indigo font-bold">
              <span>Admin Login Credentials</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold border border-emerald-200">Authorized Owner</span>
            </div>
            <div className="text-[11px] text-slate-700 space-y-1 font-mono bg-white/80 p-2.5 rounded-xl border border-lavender-border">
              <div>Email: <strong className="text-indigo font-bold">periodready1@gmail.com</strong></div>
              <div>Password: <strong className="text-indigo font-bold">Admin@PeriodReady2026</strong></div>
            </div>
            <button
              type="button"
              onClick={handleDirectAdminLogin}
              disabled={loginLoading}
              className="w-full py-2.5 px-3 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-bold text-xs shadow-md shadow-indigo/20 transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4 text-rose-light" />
              <span>{loginLoading ? 'Opening Dashboard…' : '🚀 1-Click Instant Login to Dashboard'}</span>
            </button>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Owner Email
              </label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="periodready1@gmail.com"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Enter password or click Auto-Fill above"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo/30"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-3 rounded-xl bg-indigo hover:bg-indigo-dark text-white font-semibold text-xs sm:text-sm shadow-md shadow-indigo/20 flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              {loginLoading ? 'Authenticating…' : 'Log In to Admin Dashboard'}
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-slate-400">
            Backed by shared real-time database with live order sync.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      
      {/* Top Header & Admin Action Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-lavender-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Cloud Database
            </span>
            {isSupabaseConfigured ? (
              <span className="text-[11px] text-emerald-600 font-semibold">● Supabase Connected</span>
            ) : (
              <span className="text-[11px] text-indigo font-medium bg-lavender px-2 py-0.5 rounded-full">
                Integrated Shared Store (Add Supabase keys in .env to connect cloud instance)
              </span>
            )}
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-indigo mt-1">
            PeriodReady Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500">
            Live orders, revenue tracking, profit analytics, and customer roster.
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          <button
            onClick={handleResetCampaign}
            title="Reload 1st Week Baseline + 2nd Week Diwali Campaign data"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200 shadow-xs transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
            <span>Reload 200 Diwali Sales</span>
          </button>

          <button
            onClick={() => setIsCostModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-lavender text-indigo text-xs font-semibold border border-lavender-border shadow-xs transition-colors"
          >
            <Settings className="w-3.5 h-3.5 text-rose" />
            <span>Profit Settings</span>
          </button>

          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors border border-slate-200"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* 2nd Week Diwali Campaign & 1st Week Analytics Spotlight Banner */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-amber-500 via-rose to-indigo text-white shadow-soft relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-200" />
              <span>Diwali Special Campaign 2026 · 200 Sales Milestone Achieved!</span>
            </div>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-white tracking-tight">
              Indore Diwali Gifting &amp; Emergency Surge
            </h2>
            <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
              2nd Week Diwali Festive Campaign achieved exactly <strong>200 orders</strong> across Indore colleges, hostels, and PGs. The Over-all Master Combo Box (₹399) was the #1 gifting bestseller alongside the Cozy Knit Hot Water Bag (₹349) and Week 1 emergency rescues!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0 w-full lg:w-auto">
            <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">Diwali Sales</span>
              <div className="font-serif font-bold text-2xl text-white">200</div>
              <span className="text-[10px] text-white/80">Target 100% Met</span>
            </div>
            <div className="bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">Diwali Revenue</span>
              <div className="font-serif font-bold text-2xl text-white">₹{diwaliStats.revenue}</div>
              <span className="text-[10px] text-emerald-200 font-semibold">Profit: ₹{diwaliStats.profit}</span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-white/15 backdrop-blur-md p-3.5 rounded-2xl border border-white/20 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-200 tracking-wider">Week 1 Baseline</span>
              <div className="font-serif font-bold text-2xl text-white">₹{week1Stats.revenue}</div>
              <span className="text-[10px] text-emerald-200 font-semibold">Profit: ₹{week1Stats.profit} ({week1Stats.count} sales)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar: Date Range + Campaign Selector */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-white p-3.5 rounded-2xl border border-lavender-border shadow-xs">
        <div className="flex items-center flex-wrap gap-2">
          <Calendar className="w-4 h-4 text-indigo" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700 mr-2">
            View:
          </span>

          {/* Campaign Selector Tabs */}
          {[
            { id: 'all', label: `All Orders (${orders.length})` },
            { id: 'diwali', label: `Diwali Campaign (${diwaliStats.count} Sales)`, icon: Sparkles },
            { id: 'week1', label: `Week 1 (${week1Stats.count} Sales)` },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setCampaignFilter(c.id)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                campaignFilter === c.id
                  ? 'bg-indigo text-white shadow-xs'
                  : 'text-slate-600 bg-lavender/60 hover:bg-lavender'
              }`}
            >
              {c.icon && <c.icon className="w-3.5 h-3.5 text-amber-400" />}
              <span>{c.label}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs text-slate-400 mr-1 hidden sm:inline">Date:</span>
          {[
            { id: 'today', label: 'Today' },
            { id: '7days', label: '7 Days' },
            { id: '30days', label: '30 Days' },
            { id: 'all', label: 'All Time' },
          ].map((d) => (
            <button
              key={d.id}
              onClick={() => setDateRange(d.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                dateRange === d.id
                  ? 'bg-indigo text-white shadow-xs'
                  : 'text-slate-600 hover:bg-lavender'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* 12 ESSENTIAL KPIS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* 1. Total Revenue */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total Revenue</span>
          <div className="font-serif font-bold text-2xl text-indigo">₹{kpis.totalRevenue}</div>
          <span className="text-[10px] text-emerald-600 font-semibold">Active orders</span>
        </div>

        {/* 2. Estimated Profit */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Estimated Profit</span>
          <div className="font-serif font-bold text-2xl text-emerald-600">₹{kpis.estimatedProfit}</div>
          <span className="text-[10px] text-slate-500 font-medium">Margin: {kpis.profitMargin}%</span>
        </div>

        {/* 3. Paid Online */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Paid Online</span>
          <div className="font-serif font-bold text-2xl text-indigo">₹{kpis.paidOnline}</div>
          <span className="text-[10px] text-indigo font-medium">UPI / Card demo</span>
        </div>

        {/* 4. Collected */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Collected</span>
          <div className="font-serif font-bold text-2xl text-indigo">₹{kpis.collected}</div>
          <span className="text-[10px] text-emerald-600 font-medium">Received in hand</span>
        </div>

        {/* 5. Still To Collect (COD) */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Still to Collect (COD)</span>
          <div className="font-serif font-bold text-2xl text-amber-600">₹{kpis.stillToCollect}</div>
          <span className="text-[10px] text-amber-600 font-medium">Pending at gate</span>
        </div>

        {/* 6. Total Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Orders</span>
          <div className="font-serif font-bold text-2xl text-slate-900">{kpis.ordersCount}</div>
          <span className="text-[10px] text-slate-400 font-medium">Fulfillment requests</span>
        </div>

        {/* 7. Units Sold */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Units Sold</span>
          <div className="font-serif font-bold text-2xl text-slate-900">{kpis.unitsSold}</div>
          <span className="text-[10px] text-slate-400 font-medium">Kits &amp; bags dispatched</span>
        </div>

        {/* 8. Average Order Value */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Avg Order Value (AOV)</span>
          <div className="font-serif font-bold text-2xl text-indigo">₹{kpis.averageOrderValue}</div>
          <span className="text-[10px] text-slate-400 font-medium">Per checkout ticket</span>
        </div>

        {/* 9. Profit Margin */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Profit Margin</span>
          <div className="font-serif font-bold text-2xl text-emerald-600">{kpis.profitMargin}%</div>
          <span className="text-[10px] text-emerald-600 font-medium">Net product yield</span>
        </div>

        {/* 10. New Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">New Customers</span>
          <div className="font-serif font-bold text-2xl text-slate-900">{kpis.newCustomers}</div>
          <span className="text-[10px] text-slate-400 font-medium">Registered profiles</span>
        </div>

        {/* 11. Repeat Customers */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Repeat Customers</span>
          <div className="font-serif font-bold text-2xl text-indigo">{kpis.repeatCustomers}</div>
          <span className="text-[10px] text-rose font-medium">&gt; 1 emergency order</span>
        </div>

        {/* 12. Cancelled Orders */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-lavender-border shadow-soft space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Cancelled Orders</span>
          <div className="font-serif font-bold text-2xl text-rose">{kpis.cancelledCount}</div>
          <span className="text-[10px] text-rose font-medium">Excluded from revenue</span>
        </div>

      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 14-Day Revenue Bar Chart */}
        <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-lavender-border shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-lg text-indigo">
                14-Day Revenue &amp; Orders Trend
              </h3>
              <p className="text-xs text-slate-500">
                Daily sales performance across Indore hubs.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-indigo">Last 14 Days</span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-56 flex items-end justify-between gap-1.5 sm:gap-2 pt-8 pb-2 border-b border-slate-100">
            {chart14Days.map((day) => {
              const heightPercent = maxRevenueInChart > 0 ? (day.revenue / maxRevenueInChart) * 100 : 0;
              return (
                <div key={day.date} className="flex-1 flex flex-col items-center gap-1 group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-900 text-white text-[10px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-20 shadow-md">
                    <div>{day.label}: ₹{day.revenue}</div>
                    <div className="text-rose-light">{day.orders} {day.orders === 1 ? 'order' : 'orders'}</div>
                  </div>

                  <div 
                    style={{ height: `${Math.max(4, heightPercent)}%` }}
                    className={`w-full rounded-t-md transition-all ${
                      day.revenue > 0 ? 'bg-indigo group-hover:bg-rose' : 'bg-slate-100'
                    }`}
                  />
                  <span className="text-[9px] text-slate-400 truncate max-w-full">
                    {day.label.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span>Left: 14 days ago</span>
            <span>Right: Today</span>
          </div>
        </div>

        {/* Revenue & Profit by Product Share */}
        <div className="lg:col-span-4 bg-white p-6 sm:p-8 rounded-3xl border border-lavender-border shadow-soft space-y-4">
          <div>
            <h3 className="font-serif font-bold text-lg text-indigo">
              Product Sales Share
            </h3>
            <p className="text-xs text-slate-500">
              Contribution to gross emergency volume.
            </p>
          </div>

          {productAnalytics.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No product sales recorded yet.
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {productAnalytics.map((prod) => (
                <div key={prod.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[160px]">{prod.name}</span>
                    <span className="font-bold text-indigo">₹{prod.revenue} ({prod.share}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${prod.share}%` }}
                      className="bg-indigo h-full rounded-full"
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400">
                    <span>{prod.units} units sold</span>
                    <span className="text-emerald-600 font-medium">Est. Profit: ₹{Math.round(prod.profit)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ORDERS MANAGEMENT TABLE WITH STATUS TABS */}
      <div className="bg-white rounded-3xl border border-lavender-border shadow-soft overflow-hidden space-y-4 p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-indigo">
              Orders Management
            </h2>
            <p className="text-xs text-slate-500">
              Real-time feed with customer calling, status transitions, and invoices.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search customer, order id..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo/30"
            />
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto border-b border-slate-100 pb-3">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'Placed', label: 'Placed' },
            { id: 'Shipped', label: 'Shipped' },
            { id: 'Delivered', label: 'Delivered' },
            { id: 'Cancelled', label: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === tab.id
                  ? 'bg-indigo text-white shadow-xs'
                  : 'text-slate-600 hover:bg-lavender'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders Table */}
        {filteredOrders.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No orders found</p>
            <p className="text-xs text-slate-400">
              {searchQuery ? 'Try adjusting your search criteria.' : 'When customers place emergency orders, they will appear here in real-time.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-2 font-bold">Order ID &amp; Time</th>
                  <th className="py-3 px-2 font-bold">Customer &amp; Phone</th>
                  <th className="py-3 px-2 font-bold">Delivery Address</th>
                  <th className="py-3 px-2 font-bold">Items</th>
                  <th className="py-3 px-2 font-bold">Total &amp; Payment</th>
                  <th className="py-3 px-2 font-bold">Status</th>
                  <th className="py-3 px-2 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* ID & Date */}
                    <td className="py-3 px-2 font-semibold text-slate-900">
                      <div>#{ord.id}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(ord.created_at).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                      {(ord.campaign?.includes('Diwali') || ord.via?.includes('Diwali')) ? (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-100 text-amber-800 border border-amber-200 mt-1">
                          <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Diwali Campaign
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 mt-1">
                          Week 1 Baseline
                        </span>
                      )}
                    </td>

                    {/* Customer & Phone */}
                    <td className="py-3 px-2">
                      <div className="font-semibold text-slate-900">{ord.name}</div>
                      <div className="text-[11px] text-indigo flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{ord.phone}</span>
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-2 max-w-[200px]">
                      <div className="text-slate-600 truncate" title={ord.address}>
                        {ord.address}
                      </div>
                    </td>

                    {/* Items */}
                    <td className="py-3 px-2">
                      <div className="space-y-0.5">
                        {ord.items?.map((it, idx) => (
                          <div key={idx} className="text-slate-700">
                            <span className="font-bold text-indigo">{it.quantity}x</span> {it.shortName || it.name}
                            {it.color && <span className="text-[10px] text-slate-400"> ({it.color})</span>}
                          </div>
                        ))}
                      </div>
                    </td>

                    {/* Total & Payment */}
                    <td className="py-3 px-2">
                      <div className="font-bold text-slate-900">₹{ord.total}</div>
                      {ord.paid ? (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          PAID ({ord.reference || 'ONLINE'})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          COD Pending
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3 px-2">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-100 text-blue-800'
                          : ord.status === 'Cancelled'
                          ? 'bg-rose/10 text-rose'
                          : 'bg-lavender text-indigo'
                      }`}>
                        {ord.status}
                      </span>
                    </td>

                    {/* Three-Dot Actions Menu (Mark Placed, Shipped, Delivered, View invoice, Call customer, Cancel) */}
                    <td className="py-3 px-2 text-right relative">
                      <button
                        onClick={() => setActiveMenuOrderId(activeMenuOrderId === ord.id ? null : ord.id)}
                        className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 transition-colors"
                        title="Actions"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {activeMenuOrderId === ord.id && (
                        <div 
                          className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-lavender-border py-2 z-30 text-left space-y-1 animate-fade-in"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Update Status
                          </div>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'Placed')}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-lavender flex items-center gap-2"
                          >
                            <Clock className="w-3.5 h-3.5 text-indigo" />
                            <span>Mark as Placed</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'Shipped')}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-lavender flex items-center gap-2"
                          >
                            <Truck className="w-3.5 h-3.5 text-blue-600" />
                            <span>Mark as Shipped</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(ord.id, 'Delivered')}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-lavender flex items-center gap-2"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Mark as Delivered</span>
                          </button>

                          <div className="border-t border-slate-100 my-1"></div>

                          <button
                            onClick={() => {
                              setSelectedInvoiceOrder(ord);
                              setActiveMenuOrderId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-lavender flex items-center gap-2"
                          >
                            <Printer className="w-3.5 h-3.5 text-slate-600" />
                            <span>View Invoice</span>
                          </button>

                          <a
                            href={`tel:${ord.phone}`}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-lavender flex items-center gap-2"
                          >
                            <Phone className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Call Customer</span>
                          </a>

                          <div className="border-t border-slate-100 my-1"></div>

                          <button
                            onClick={() => handleCancelOrder(ord.id)}
                            className="w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Cancel Order</span>
                          </button>
                        </div>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CUSTOMERS ROSTER TABLE */}
      <div className="bg-white rounded-3xl border border-lavender-border shadow-soft overflow-hidden p-6 sm:p-8 space-y-4">
        <div>
          <h2 className="font-serif font-bold text-xl sm:text-2xl text-indigo">
            Registered Customers
          </h2>
          <p className="text-xs text-slate-500">
            Customer directory with verified contact credentials and lifetime order frequencies.
          </p>
        </div>

        {customers.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No customer accounts registered yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2 font-bold">Joined Date</th>
                  <th className="py-2.5 px-2 font-bold">Customer Name</th>
                  <th className="py-2.5 px-2 font-bold">Email</th>
                  <th className="py-2.5 px-2 font-bold">Phone Number</th>
                  <th className="py-2.5 px-2 text-right font-bold">Total Orders</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((cust) => {
                  const custOrders = orders.filter(o => 
                    o.customer_id === cust.id || 
                    (cust.email && o.customer?.toLowerCase() === cust.name?.toLowerCase()) ||
                    (cust.phone && o.phone === cust.phone)
                  );
                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-2 text-slate-500">
                        {cust.created_at ? new Date(cust.created_at).toLocaleDateString('en-IN') : 'Recent'}
                      </td>
                      <td className="py-3 px-2 font-semibold text-slate-900">{cust.name}</td>
                      <td className="py-3 px-2 text-slate-600">{cust.email}</td>
                      <td className="py-3 px-2 text-slate-600">{cust.phone || 'N/A'}</td>
                      <td className="py-3 px-2 text-right font-bold text-indigo">
                        {custOrders.length}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PROFIT SETTINGS MODAL */}
      {isCostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div 
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-lavender-border overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-indigo text-white p-6 flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-xl">Profit Settings</h3>
                <p className="text-xs text-lavender-deep mt-0.5">
                  Update estimated cost per unit for each product to calculate net margins.
                </p>
              </div>
              <button
                onClick={() => setIsCostModalOpen(false)}
                className="p-1 rounded-full text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {saveCostSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Cost settings saved to database successfully!</span>
                </div>
              )}

              <div className="space-y-3">
                {productCosts.map((prod) => (
                  <div key={prod.product_id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-xs text-slate-900 truncate">
                        {prod.product_name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Selling Price: ₹{prod.price}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-xs font-bold text-slate-500">Cost: ₹</span>
                      <input
                        type="number"
                        min="0"
                        value={editedCosts[prod.product_id] ?? prod.cost_per_unit}
                        onChange={(e) => setEditedCosts({
                          ...editedCosts,
                          [prod.product_id]: e.target.value
                        })}
                        className="w-20 p-2 rounded-xl border border-slate-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo/30 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCostModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveCosts}
                  className="px-5 py-2.5 rounded-xl bg-indigo hover:bg-indigo-dark text-white text-xs font-semibold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save to Database</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal Reopen */}
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
