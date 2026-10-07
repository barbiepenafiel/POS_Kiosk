-- ============================================================
-- CS Campus Store POS Kiosk — Stock Quantity Migration
-- Paste this in the Supabase SQL Editor and run it.
-- Safe to re-run.
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
