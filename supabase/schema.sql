-- ============================================================
-- CS Campus Store POS Kiosk — Supabase Schema
-- Paste this in the Supabase SQL Editor and run it.
-- ============================================================

-- Products table (public catalog — no RLS needed)
CREATE TABLE IF NOT EXISTS products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  category    TEXT NOT NULL CHECK (category IN ('Drinks', 'Food', 'Snacks')),
  price       NUMERIC(10, 2) NOT NULL CHECK (price > 0),
  image_url   TEXT,
  available   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category  ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products (available);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_number TEXT NOT NULL UNIQUE,
  total_amount       NUMERIC(10, 2) NOT NULL,
  payment_method     TEXT NOT NULL CHECK (payment_method IN ('Cash', 'QR', 'Card')),
  amount_paid        NUMERIC(10, 2) NOT NULL,
  change_amount      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_status     TEXT NOT NULL CHECK (payment_status IN ('completed', 'pending', 'failed')) DEFAULT 'completed',
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_number     ON transactions (transaction_number);

-- Transaction items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID NOT NULL REFERENCES transactions (id) ON DELETE CASCADE,
  product_id     UUID REFERENCES products (id) ON DELETE SET NULL,
  product_name   TEXT NOT NULL,
  quantity       INTEGER NOT NULL CHECK (quantity > 0),
  unit_price     NUMERIC(10, 2) NOT NULL,
  subtotal       NUMERIC(10, 2) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_transaction_items_txn ON transaction_items (transaction_id);

-- ============================================================
-- Permissions — grant anon role access for kiosk use
-- ============================================================

GRANT SELECT, INSERT, UPDATE ON products          TO anon;
GRANT SELECT, INSERT          ON transactions       TO anon;
GRANT SELECT, INSERT          ON transaction_items  TO anon;

-- ============================================================
-- Row Level Security
-- ============================================================

-- Products: enable RLS, allow all operations for anon (public catalog)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "products_all" ON products
  USING (TRUE)
  WITH CHECK (TRUE);

-- Transactions: enable RLS, allow anon to insert and read
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions_insert" ON transactions
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "transactions_select" ON transactions
  FOR SELECT USING (TRUE);

-- Transaction items: enable RLS, allow anon to insert and read
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transaction_items_insert" ON transaction_items
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "transaction_items_select" ON transaction_items
  FOR SELECT USING (TRUE);

-- ============================================================
-- Seed: Sample Products
-- ============================================================

INSERT INTO products (name, category, price, available) VALUES
  ('Coffee',        'Drinks', 45.00, TRUE),
  ('Sandwich',      'Food',   50.00, TRUE),
  ('Soft Drink',    'Drinks', 35.00, TRUE),
  ('Cookies',       'Snacks', 25.00, TRUE),
  ('Bottled Water', 'Drinks', 20.00, TRUE),
  ('Chocolate',     'Snacks', 25.00, TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Seed: Additional Menu Items
-- ============================================================

INSERT INTO products (name, category, price, available) VALUES
  ('Burger',        'Food',   50.00,  TRUE),
  ('Pizza',         'Food',   100.00, TRUE),
  ('Fried Chicken', 'Food',   30.00,  TRUE),
  ('Hotdog',        'Food',   30.00,  TRUE),
  ('Matcha',        'Drinks', 70.00,  TRUE),
  ('Frappe',        'Drinks', 100.00, TRUE),
  ('Juice',         'Drinks', 20.00,  TRUE),
  ('Ice Cream',     'Snacks', 30.00,  TRUE),
  ('Candies',       'Snacks', 20.00,  TRUE),
  ('Gummy Bear',    'Snacks', 20.00,  TRUE),
  ('Marshmallows',  'Snacks', 30.00,  TRUE)
ON CONFLICT DO NOTHING;

-- ============================================================
-- Stock Quantity (same as supabase/add-stock.sql)
-- ============================================================

-- Stock quantity per product (every existing product starts at 10)
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS stock INTEGER NOT NULL DEFAULT 10 CHECK (stock >= 0);

-- Deduct sold quantity from stock (never goes below zero)
CREATE OR REPLACE FUNCTION decrement_stock(p_product_id UUID, p_quantity INTEGER)
RETURNS VOID
LANGUAGE sql
AS $$
  UPDATE products
  SET stock = GREATEST(stock - p_quantity, 0)
  WHERE id = p_product_id;
$$;

GRANT EXECUTE ON FUNCTION decrement_stock(UUID, INTEGER) TO anon;
