import { createClient } from '@supabase/supabase-js';
import { generateSeedOrders } from '../data/seedCampaignData';

// Environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl !== 'https://your-project.supabase.co' &&
  !supabaseUrl.includes('placeholder')
);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store keys
const STORAGE_KEYS = {
  ORDERS: 'periodready_orders_v1',
  CUSTOMERS: 'periodready_customers_v1',
  COSTS: 'periodready_costs_v1',
  CURRENT_USER: 'periodready_auth_user_v1'
};

// Default product cost benchmarks for profit analytics
const DEFAULT_COSTS = [
  { product_id: 'emergency-kit', product_name: 'Emergency Period Kit (Compact Saviour Pouch)', price: 49, cost_per_unit: 18 },
  { product_id: 'regular-kit', product_name: 'Regular Period Kit', price: 179, cost_per_unit: 65 },
  { product_id: 'travel-kit', product_name: 'Travel Period Kit (No-Wash Version)', price: 249, cost_per_unit: 95 },
  { product_id: 'master-combo', product_name: 'Over-all Master Combo Box', price: 399, cost_per_unit: 150 },
  { product_id: 'hot-water-bag', product_name: 'Cozy Knit Hot Water Bag', price: 349, cost_per_unit: 130 }
];

// Helper to get local data
const getLocalData = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage read error', e);
    return fallback;
  }
};

// Helper to save local data
const setLocalData = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage write error', e);
  }
};

// Ensure initial 1-Week Baseline & 2nd-Week Diwali Campaign (200 Sales)
export function ensureSeedData() {
  const currentOrders = getLocalData(STORAGE_KEYS.ORDERS, null);
  if (!currentOrders || currentOrders.length === 0) {
    const { orders, customers } = generateSeedOrders();
    setLocalData(STORAGE_KEYS.ORDERS, orders);
    setLocalData(STORAGE_KEYS.CUSTOMERS, customers);
    return { orders, customers };
  }
  return {
    orders: currentOrders,
    customers: getLocalData(STORAGE_KEYS.CUSTOMERS, [])
  };
}

export function dbResetCampaignData() {
  const { orders, customers } = generateSeedOrders();
  setLocalData(STORAGE_KEYS.ORDERS, orders);
  setLocalData(STORAGE_KEYS.CUSTOMERS, customers);
  return { orders, customers };
}

// ================= CUSTOMERS =================
export async function dbGetCustomers() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local store', e);
    }
  }
  const { customers } = ensureSeedData();
  return customers;
}

export async function dbUpsertCustomer(customer) {
  const customerRecord = {
    id: customer.id || `CUST-${Date.now()}`,
    name: customer.name,
    email: customer.email.toLowerCase().trim(),
    phone: customer.phone,
    created_at: customer.created_at || new Date().toISOString(),
    last_order_at: new Date().toISOString()
  };

  // 1. Save local
  const current = getLocalData(STORAGE_KEYS.CUSTOMERS, []);
  const existingIdx = current.findIndex(c => c.email === customerRecord.email);
  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...customerRecord };
  } else {
    current.unshift(customerRecord);
  }
  setLocalData(STORAGE_KEYS.CUSTOMERS, current);

  // 2. Save Supabase if configured
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('customers').upsert(customerRecord, { onConflict: 'email' });
    } catch (e) {
      console.error('Supabase customer upsert error', e);
    }
  }

  return customerRecord;
}

// ================= ORDERS =================
export async function dbGetOrders() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase orders fetch error, falling back to local', e);
    }
  }
  const { orders } = ensureSeedData();
  return orders;
}

export async function dbCreateOrder(orderData) {
  const orderRecord = {
    id: `PR-${Math.floor(100000 + Math.random() * 900000)}`,
    customer_id: orderData.customer_id || null,
    customer: orderData.customer || orderData.name,
    name: orderData.name,
    phone: orderData.phone,
    address: orderData.address,
    items: orderData.items,
    total: Number(orderData.total),
    status: 'Placed',
    payment_method: orderData.payment_method, // 'online' or 'cod'
    paid: orderData.paid || false,
    via: orderData.via || 'PeriodReady Web',
    reference: orderData.reference || null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Save local
  const current = getLocalData(STORAGE_KEYS.ORDERS, []);
  current.unshift(orderRecord);
  setLocalData(STORAGE_KEYS.ORDERS, current);

  // Update customer's last order date
  if (orderData.email) {
    await dbUpsertCustomer({
      name: orderData.name,
      email: orderData.email,
      phone: orderData.phone
    });
  }

  // 2. Save to Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase.from('orders').insert([orderRecord]);
      if (error) console.error('Supabase order insert error', error);
    } catch (e) {
      console.error('Supabase order insert caught error', e);
    }
  }

  return orderRecord;
}

export async function dbUpdateOrderStatus(orderId, newStatus) {
  // 1. Update local
  const current = getLocalData(STORAGE_KEYS.ORDERS, []);
  const idx = current.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    current[idx].status = newStatus;
    current[idx].updated_at = new Date().toISOString();
    // If delivered and was COD, mark as paid automatically
    if (newStatus === 'Delivered' && !current[idx].paid) {
      current[idx].paid = true;
    }
    setLocalData(STORAGE_KEYS.ORDERS, current);
  }

  // 2. Update Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      const updatePayload = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      };
      if (newStatus === 'Delivered') {
        updatePayload.paid = true;
      }
      await supabase.from('orders').update(updatePayload).eq('id', orderId);
    } catch (e) {
      console.error('Supabase status update error', e);
    }
  }

  return true;
}

export async function dbUpdateOrderPayment(orderId, isPaid) {
  // 1. Local
  const current = getLocalData(STORAGE_KEYS.ORDERS, []);
  const idx = current.findIndex(o => o.id === orderId);
  if (idx >= 0) {
    current[idx].paid = isPaid;
    current[idx].updated_at = new Date().toISOString();
    setLocalData(STORAGE_KEYS.ORDERS, current);
  }

  // 2. Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('orders').update({ paid: isPaid, updated_at: new Date().toISOString() }).eq('id', orderId);
    } catch (e) {
      console.error('Supabase payment update error', e);
    }
  }

  return true;
}

// ================= PROFIT COSTS =================
export async function dbGetProductCosts() {
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase.from('product_costs').select('*');
      if (!error && data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase costs fetch failed', e);
    }
  }
  return getLocalData(STORAGE_KEYS.COSTS, DEFAULT_COSTS);
}

export async function dbUpdateProductCost(productId, costPerUnit) {
  const costNum = Number(costPerUnit);
  // 1. Local
  const current = getLocalData(STORAGE_KEYS.COSTS, DEFAULT_COSTS);
  const idx = current.findIndex(c => c.product_id === productId);
  if (idx >= 0) {
    current[idx].cost_per_unit = costNum;
    current[idx].updated_at = new Date().toISOString();
    setLocalData(STORAGE_KEYS.COSTS, current);
  }

  // 2. Supabase
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('product_costs').update({
        cost_per_unit: costNum,
        updated_at: new Date().toISOString()
      }).eq('product_id', productId);
    } catch (e) {
      console.error('Supabase cost update error', e);
    }
  }

  return true;
}
