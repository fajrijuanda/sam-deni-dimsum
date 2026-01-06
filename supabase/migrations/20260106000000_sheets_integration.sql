-- Migration: Google Sheets Integration & Crew System
-- Date: 2026-01-06
-- Description: Add products, stock movements, and update user roles

-- ============================================
-- 1. UPDATE USER ROLE ENUM
-- ============================================
DO $$ 
BEGIN
    -- Add new role values
    -- Staff Produksi = yang bagian produksi (input stok)
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'staff_produksi' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'staff_produksi';
    END IF;
    
    -- Crew Outlet = yang jaga outlet (input penjualan)
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'crew_outlet' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE 'crew_outlet';
    END IF;
END $$;

-- ============================================
-- 2. PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'dimsum', 'gyoza', 'wonton', 'paket'
    variant TEXT,           -- 'udang', 'wortel', 'jamur', 'keju', etc.
    price INTEGER NOT NULL DEFAULT 0,
    pcs_per_portion INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
    -- Add price column (our new column)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'price') THEN
        ALTER TABLE products ADD COLUMN price INTEGER NOT NULL DEFAULT 0;
    END IF;

    -- Add category column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'category') THEN
        ALTER TABLE products ADD COLUMN category TEXT NOT NULL DEFAULT 'dimsum';
    END IF;

    -- Add variant column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'variant') THEN
        ALTER TABLE products ADD COLUMN variant TEXT;
    END IF;
    
    -- Add pcs_per_portion column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'pcs_per_portion') THEN
        ALTER TABLE products ADD COLUMN pcs_per_portion INTEGER DEFAULT 1;
    END IF;
    
    -- Add is_active column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
    
    -- Add created_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'created_at') THEN
        ALTER TABLE products ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- Add updated_at column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'updated_at') THEN
        ALTER TABLE products ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    -- If base_price exists but is nullable, update with default value
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'products' AND column_name = 'base_price') THEN
        UPDATE products SET base_price = COALESCE(base_price, 0) WHERE base_price IS NULL;
    END IF;
END $$;

-- Delete existing menu products to avoid conflicts (we'll re-insert with correct data)
DELETE FROM products WHERE name IN (
    'Dimsum Udang', 'Dimsum Wortel', 'Dimsum Jamur', 'Dimsum Keju', 'Dimsum Crabstick', 'Lumpia Basah',
    'Gyoza Kukus Reguler', 'Gyoza Kukus Kenyang', 'Gyoza Goreng Reguler', 'Gyoza Goreng Kenyang',
    'Wonton Kuah', 'Wonton Goreng', 'Paket Reguler', 'Paket Kenyang', 'Dimsum Mentai', 'Gyoza Mentai'
);

-- Insert products based on menu - using DO block to handle different schemas
DO $$
DECLARE
    has_base_price BOOLEAN;
BEGIN
    SELECT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'base_price') INTO has_base_price;
    
    IF has_base_price THEN
        -- Schema with base_price column
        INSERT INTO products (name, category, variant, price, base_price, pcs_per_portion) VALUES
        ('Dimsum Udang', 'dimsum', 'udang', 0, 0, 1),
        ('Dimsum Wortel', 'dimsum', 'wortel', 0, 0, 1),
        ('Dimsum Jamur', 'dimsum', 'jamur', 0, 0, 1),
        ('Dimsum Keju', 'dimsum', 'keju', 0, 0, 1),
        ('Dimsum Crabstick', 'dimsum', 'crabstick', 0, 0, 1),
        ('Lumpia Basah', 'dimsum', 'lumpia', 0, 0, 1),
        ('Gyoza Kukus Reguler', 'gyoza', 'kukus_reguler', 10000, 10000, 4),
        ('Gyoza Kukus Kenyang', 'gyoza', 'kukus_kenyang', 20000, 20000, 10),
        ('Gyoza Goreng Reguler', 'gyoza', 'goreng_reguler', 10000, 10000, 4),
        ('Gyoza Goreng Kenyang', 'gyoza', 'goreng_kenyang', 20000, 20000, 10),
        ('Wonton Kuah', 'wonton', 'kuah', 10000, 10000, 8),
        ('Wonton Goreng', 'wonton', 'goreng', 10000, 10000, 8),
        ('Paket Reguler', 'paket', 'reguler', 10000, 10000, 3),
        ('Paket Kenyang', 'paket', 'kenyang', 20000, 20000, 7),
        ('Dimsum Mentai', 'paket', 'dimsum_mentai', 30000, 30000, 6),
        ('Gyoza Mentai', 'paket', 'gyoza_mentai', 25000, 25000, 7);
    ELSE
        -- Schema without base_price column
        INSERT INTO products (name, category, variant, price, pcs_per_portion) VALUES
        ('Dimsum Udang', 'dimsum', 'udang', 0, 1),
        ('Dimsum Wortel', 'dimsum', 'wortel', 0, 1),
        ('Dimsum Jamur', 'dimsum', 'jamur', 0, 1),
        ('Dimsum Keju', 'dimsum', 'keju', 0, 1),
        ('Dimsum Crabstick', 'dimsum', 'crabstick', 0, 1),
        ('Lumpia Basah', 'dimsum', 'lumpia', 0, 1),
        ('Gyoza Kukus Reguler', 'gyoza', 'kukus_reguler', 10000, 4),
        ('Gyoza Kukus Kenyang', 'gyoza', 'kukus_kenyang', 20000, 10),
        ('Gyoza Goreng Reguler', 'gyoza', 'goreng_reguler', 10000, 4),
        ('Gyoza Goreng Kenyang', 'gyoza', 'goreng_kenyang', 20000, 10),
        ('Wonton Kuah', 'wonton', 'kuah', 10000, 8),
        ('Wonton Goreng', 'wonton', 'goreng', 10000, 8),
        ('Paket Reguler', 'paket', 'reguler', 10000, 3),
        ('Paket Kenyang', 'paket', 'kenyang', 20000, 7),
        ('Dimsum Mentai', 'paket', 'dimsum_mentai', 30000, 6),
        ('Gyoza Mentai', 'paket', 'gyoza_mentai', 25000, 7);
    END IF;
END $$;

-- ============================================
-- 3. OUTLETS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS outlets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. USERS TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    name TEXT,
    role TEXT DEFAULT 'crew_outlet',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. STOCK MOVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID,
    product_id UUID,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('masuk', 'keluar', 'kembali')),
    quantity INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    inputted_by UUID,
    synced_to_sheets BOOLEAN DEFAULT FALSE,
    sheets_row_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns to stock_movements if table already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'outlet_id') THEN
        ALTER TABLE stock_movements ADD COLUMN outlet_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'product_id') THEN
        ALTER TABLE stock_movements ADD COLUMN product_id UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'movement_type') THEN
        ALTER TABLE stock_movements ADD COLUMN movement_type TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'quantity') THEN
        ALTER TABLE stock_movements ADD COLUMN quantity INTEGER DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'date') THEN
        ALTER TABLE stock_movements ADD COLUMN date DATE DEFAULT CURRENT_DATE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'notes') THEN
        ALTER TABLE stock_movements ADD COLUMN notes TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'inputted_by') THEN
        ALTER TABLE stock_movements ADD COLUMN inputted_by UUID;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'synced_to_sheets') THEN
        ALTER TABLE stock_movements ADD COLUMN synced_to_sheets BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'sheets_row_id') THEN
        ALTER TABLE stock_movements ADD COLUMN sheets_row_id TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'created_at') THEN
        ALTER TABLE stock_movements ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'stock_movements' AND column_name = 'updated_at') THEN
        ALTER TABLE stock_movements ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Indexes (only create if column exists - all wrapped in DO blocks)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'stock_movements' AND column_name = 'outlet_id') THEN
        CREATE INDEX IF NOT EXISTS idx_stock_movements_outlet ON stock_movements(outlet_id);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'stock_movements' AND column_name = 'date') THEN
        CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'stock_movements' AND column_name = 'movement_type') THEN
        CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'stock_movements' AND column_name = 'synced_to_sheets') THEN
        CREATE INDEX IF NOT EXISTS idx_stock_movements_sync ON stock_movements(synced_to_sheets);
    END IF;
END $$;

-- ============================================
-- 4. UPDATE DAILY_SALES TABLE
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'daily_sales' AND column_name = 'synced_to_sheets') THEN
        ALTER TABLE daily_sales ADD COLUMN synced_to_sheets BOOLEAN DEFAULT FALSE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'daily_sales' AND column_name = 'sheets_row_id') THEN
        ALTER TABLE daily_sales ADD COLUMN sheets_row_id TEXT;
    END IF;
END $$;

-- ============================================
-- 7. ITEM SALES TABLE (for per-item tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS item_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_sales_id UUID,
    outlet_id UUID,
    product_id UUID,
    quantity INTEGER NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    inputted_by UUID,
    synced_to_sheets BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_item_sales_outlet ON item_sales(outlet_id);
CREATE INDEX IF NOT EXISTS idx_item_sales_date ON item_sales(date);

-- ============================================
-- 6. RLS POLICIES
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE item_sales ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    -- products policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'products' AND policyname = 'Allow all access'
    ) THEN
        CREATE POLICY "Allow all access" ON products FOR ALL USING (true);
    END IF;
    
    -- stock_movements policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'stock_movements' AND policyname = 'Allow all access'
    ) THEN
        CREATE POLICY "Allow all access" ON stock_movements FOR ALL USING (true);
    END IF;
    
    -- item_sales policy
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'item_sales' AND policyname = 'Allow all access'
    ) THEN
        CREATE POLICY "Allow all access" ON item_sales FOR ALL USING (true);
    END IF;
END $$;

-- ============================================
-- 9. GOOGLE SHEETS CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sheets_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID UNIQUE,
    spreadsheet_id TEXT NOT NULL,
    sheet_stok_masuk TEXT DEFAULT 'Stok Masuk',
    sheet_stok_keluar TEXT DEFAULT 'Stok Keluar',
    sheet_stok_kembali TEXT DEFAULT 'Stok Kembali',
    sheet_penjualan TEXT DEFAULT 'Penjualan Harian',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sheets_config ENABLE ROW LEVEL SECURITY;
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sheets_config' AND policyname = 'Allow all access'
    ) THEN
        CREATE POLICY "Allow all access" ON sheets_config FOR ALL USING (true);
    END IF;
END $$;

-- Success
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: Products, Stock Movements, and Sheets Config tables created!';
END $$;
