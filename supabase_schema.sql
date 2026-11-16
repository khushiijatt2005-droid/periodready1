-- ===================================================
-- PeriodReady Supabase Database Schema
-- Run this in your Supabase Project -> SQL Editor -> Run
-- ===================================================

-- 1. Create customers table
CREATE TABLE IF NOT EXISTS customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_order_at TIMESTAMPTZ
);

-- 2. Create orders table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    customer_id TEXT,
    customer TEXT NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    total NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Placed', -- 'Placed', 'Shipped', 'Delivered', 'Cancelled'
    payment_method TEXT NOT NULL DEFAULT 'cod', -- 'online' or 'cod'
    paid BOOLEAN NOT NULL DEFAULT false,
    via TEXT DEFAULT 'PeriodReady Web',
    reference TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create product_costs table (for Profit settings)
CREATE TABLE IF NOT EXISTS product_costs (
    product_id TEXT PRIMARY KEY,
    product_name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    cost_per_unit NUMERIC NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Initial default product costs for accurate profit calculation
INSERT INTO product_costs (product_id, product_name, price, cost_per_unit)
VALUES 
    ('emergency-kit', 'Emergency Period Kit (Compact Saviour Pouch)', 49, 18),
    ('regular-kit', 'Regular Period Kit', 179, 65),
    ('travel-kit', 'Travel Period Kit (No-Wash Version)', 249, 95),
    ('master-combo', 'Over-all Master Combo Box', 399, 150),
    ('hot-water-bag', 'Cozy Knit Hot Water Bag', 349, 130)
ON CONFLICT (product_id) DO UPDATE 
SET price = EXCLUDED.price;

-- Enable Row Level Security (RLS)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_costs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous and authenticated read/write for demo and real transactions
-- (You can tighten this with auth policies in production if needed)
DROP POLICY IF EXISTS "Public access to customers" ON customers;
CREATE POLICY "Public access to customers" ON customers FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to orders" ON orders;
CREATE POLICY "Public access to orders" ON orders FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public access to product_costs" ON product_costs;
CREATE POLICY "Public access to product_costs" ON product_costs FOR ALL USING (true) WITH CHECK (true);
