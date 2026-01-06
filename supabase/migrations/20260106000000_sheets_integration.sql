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
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'variant') THEN
        ALTER TABLE products ADD COLUMN variant TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'pcs_per_portion') THEN
        ALTER TABLE products ADD COLUMN pcs_per_portion INTEGER DEFAULT 1;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'products' AND column_name = 'is_active') THEN
        ALTER TABLE products ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;

-- Insert products based on menu (only if not exists)
INSERT INTO products (name, category, variant, price, pcs_per_portion) VALUES
-- Dimsum variants
('Dimsum Udang', 'dimsum', 'udang', 0, 1),
('Dimsum Wortel', 'dimsum', 'wortel', 0, 1),
('Dimsum Jamur', 'dimsum', 'jamur', 0, 1),
('Dimsum Keju', 'dimsum', 'keju', 0, 1),
('Dimsum Crabstick', 'dimsum', 'crabstick', 0, 1),
('Lumpia Basah', 'dimsum', 'lumpia', 0, 1),

-- Gyoza
('Gyoza Kukus Reguler', 'gyoza', 'kukus_reguler', 10000, 4),
('Gyoza Kukus Kenyang', 'gyoza', 'kukus_kenyang', 20000, 10),
('Gyoza Goreng Reguler', 'gyoza', 'goreng_reguler', 10000, 4),
('Gyoza Goreng Kenyang', 'gyoza', 'goreng_kenyang', 20000, 10),

-- Wonton
('Wonton Kuah', 'wonton', 'kuah', 10000, 8),
('Wonton Goreng', 'wonton', 'goreng', 10000, 8),

-- Paket
('Paket Reguler', 'paket', 'reguler', 10000, 3),
('Paket Kenyang', 'paket', 'kenyang', 20000, 7),
('Dimsum Mentai', 'paket', 'dimsum_mentai', 30000, 6),
('Gyoza Mentai', 'paket', 'gyoza_mentai', 25000, 7)
ON CONFLICT DO NOTHING;

-- ============================================
-- 3. STOCK MOVEMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS stock_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('masuk', 'keluar', 'kembali')),
    quantity INTEGER NOT NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    notes TEXT,
    inputted_by UUID REFERENCES users(id),
    synced_to_sheets BOOLEAN DEFAULT FALSE,
    sheets_row_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_stock_movements_outlet ON stock_movements(outlet_id);
CREATE INDEX IF NOT EXISTS idx_stock_movements_date ON stock_movements(date);
CREATE INDEX IF NOT EXISTS idx_stock_movements_type ON stock_movements(movement_type);
CREATE INDEX IF NOT EXISTS idx_stock_movements_sync ON stock_movements(synced_to_sheets);

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
-- 5. ITEM SALES TABLE (for per-item tracking)
-- ============================================
CREATE TABLE IF NOT EXISTS item_sales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    daily_sales_id UUID REFERENCES daily_sales(id) ON DELETE CASCADE,
    outlet_id UUID NOT NULL REFERENCES outlets(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 0,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    inputted_by UUID REFERENCES users(id),
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

CREATE POLICY "Allow all access" ON products FOR ALL USING (true);
CREATE POLICY "Allow all access" ON stock_movements FOR ALL USING (true);
CREATE POLICY "Allow all access" ON item_sales FOR ALL USING (true);

-- ============================================
-- 7. GOOGLE SHEETS CONFIG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS sheets_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    outlet_id UUID UNIQUE REFERENCES outlets(id) ON DELETE CASCADE,
    spreadsheet_id TEXT NOT NULL,
    sheet_stok_masuk TEXT DEFAULT 'Stok Masuk',
    sheet_stok_keluar TEXT DEFAULT 'Stok Keluar',
    sheet_stok_kembali TEXT DEFAULT 'Stok Kembali',
    sheet_penjualan TEXT DEFAULT 'Penjualan Harian',
    last_synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE sheets_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all access" ON sheets_config FOR ALL USING (true);

-- Success
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: Products, Stock Movements, and Sheets Config tables created!';
END $$;
