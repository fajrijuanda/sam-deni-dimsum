-- Migration: Attendance and Disbursements
-- Date: 2026-01-21
-- Description: Add attendance tracking for crew/staff and disbursement history for mitra

-- ============================================
-- 1. ATTENDANCE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    check_in TIME,
    check_out TIME,
    photo_url TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    status TEXT NOT NULL DEFAULT 'hadir' CHECK (status IN ('hadir', 'izin', 'sakit', 'alpha')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'attendance' AND column_name = 'outlet_id') THEN
        ALTER TABLE attendance ADD COLUMN outlet_id UUID REFERENCES outlets(id) ON DELETE SET NULL;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'attendance' AND column_name = 'photo_url') THEN
        ALTER TABLE attendance ADD COLUMN photo_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'attendance' AND column_name = 'latitude') THEN
        ALTER TABLE attendance ADD COLUMN latitude DECIMAL(10, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'attendance' AND column_name = 'longitude') THEN
        ALTER TABLE attendance ADD COLUMN longitude DECIMAL(11, 8);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'attendance' AND column_name = 'notes') THEN
        ALTER TABLE attendance ADD COLUMN notes TEXT;
    END IF;
END $$;

-- Indexes for attendance
CREATE INDEX IF NOT EXISTS idx_attendance_user ON attendance(user_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_attendance_outlet ON attendance(outlet_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON attendance(status);

-- Unique constraint: one attendance record per user per day
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_user_date_attendance'
    ) THEN
        ALTER TABLE attendance ADD CONSTRAINT unique_user_date_attendance UNIQUE (user_id, date);
    END IF;
END $$;

-- ============================================
-- 2. DISBURSEMENTS TABLE (for mitra)
-- ============================================
CREATE TABLE IF NOT EXISTS disbursements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mitra_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    month VARCHAR(7) NOT NULL, -- Format: '2026-01'
    amount INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processed', 'completed')),
    processed_at TIMESTAMPTZ,
    processed_by UUID REFERENCES auth.users(id),
    bank_name TEXT,
    bank_account TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add missing columns if table already exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'disbursements' AND column_name = 'bank_name') THEN
        ALTER TABLE disbursements ADD COLUMN bank_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'disbursements' AND column_name = 'bank_account') THEN
        ALTER TABLE disbursements ADD COLUMN bank_account TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'disbursements' AND column_name = 'processed_by') THEN
        ALTER TABLE disbursements ADD COLUMN processed_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Indexes for disbursements
CREATE INDEX IF NOT EXISTS idx_disbursements_mitra ON disbursements(mitra_id);
CREATE INDEX IF NOT EXISTS idx_disbursements_month ON disbursements(month);
CREATE INDEX IF NOT EXISTS idx_disbursements_status ON disbursements(status);

-- Unique constraint: one disbursement per mitra per month
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'unique_mitra_month_disbursement'
    ) THEN
        ALTER TABLE disbursements ADD CONSTRAINT unique_mitra_month_disbursement UNIQUE (mitra_id, month);
    END IF;
END $$;

-- ============================================
-- 3. RLS POLICIES
-- ============================================
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE disbursements ENABLE ROW LEVEL SECURITY;

-- Attendance policies
DO $$
BEGIN
    -- Allow users to see their own attendance
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'attendance' AND policyname = 'Users can view own attendance'
    ) THEN
        CREATE POLICY "Users can view own attendance" ON attendance 
            FOR SELECT USING (auth.uid() = user_id);
    END IF;
    
    -- Allow users to insert their own attendance
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'attendance' AND policyname = 'Users can insert own attendance'
    ) THEN
        CREATE POLICY "Users can insert own attendance" ON attendance 
            FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    
    -- Allow users to update their own attendance (same day only)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'attendance' AND policyname = 'Users can update own attendance'
    ) THEN
        CREATE POLICY "Users can update own attendance" ON attendance 
            FOR UPDATE USING (auth.uid() = user_id AND date = CURRENT_DATE);
    END IF;
    
    -- Admin can view all attendance (temporary: allow all for now)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'attendance' AND policyname = 'Admin can view all attendance'
    ) THEN
        CREATE POLICY "Admin can view all attendance" ON attendance 
            FOR SELECT USING (true);
    END IF;
END $$;

-- Disbursement policies
DO $$
BEGIN
    -- Mitra can view their own disbursements
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disbursements' AND policyname = 'Mitra can view own disbursements'
    ) THEN
        CREATE POLICY "Mitra can view own disbursements" ON disbursements 
            FOR SELECT USING (auth.uid() = mitra_id);
    END IF;
    
    -- Admin can view all disbursements (temporary: allow all for now)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disbursements' AND policyname = 'Admin can view all disbursements'
    ) THEN
        CREATE POLICY "Admin can view all disbursements" ON disbursements 
            FOR SELECT USING (true);
    END IF;
    
    -- Only admin can insert/update disbursements (temporary: allow all for now)
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'disbursements' AND policyname = 'Admin can manage disbursements'
    ) THEN
        CREATE POLICY "Admin can manage disbursements" ON disbursements 
            FOR ALL USING (true);
    END IF;
END $$;

-- ============================================
-- 4. UPDATE USERS TABLE (add mitra role if not exists)
-- ============================================
DO $$ 
BEGIN
    -- Ensure role column allows 'mitra' value
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'mitra' AND enumtypid = 'user_role'::regtype) THEN
        ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'mitra';
    END IF;
EXCEPTION
    WHEN undefined_object THEN
        -- user_role type doesn't exist, it's using TEXT - no action needed
        NULL;
END $$;

-- ============================================
-- 5. INSERT SAMPLE DATA (for testing)
-- ============================================
-- Note: Uncomment below to insert sample data for testing

-- INSERT INTO disbursements (mitra_id, month, amount, status, processed_at, notes)
-- SELECT 
--     id, 
--     '2026-01', 
--     15000000, 
--     'pending', 
--     NULL, 
--     'Komisi Januari 2026'
-- FROM auth.users 
-- WHERE raw_user_meta_data->>'role' = 'mitra'
-- ON CONFLICT (mitra_id, month) DO NOTHING;

-- Success
DO $$
BEGIN
    RAISE NOTICE 'Migration completed: Attendance and Disbursements tables created!';
END $$;
