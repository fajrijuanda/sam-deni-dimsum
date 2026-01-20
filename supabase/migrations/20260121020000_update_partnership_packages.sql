-- Update Mitra Outlet description regarding return
UPDATE public.partnership_packages
SET description = 'Paket semi-permanen dengan sistem bagi hasil 30% dari omset bulanan.',
    features = '[
        "Gerobak/Booth Premium",
        "Peralatan Masak Grade A",
        "Bahan Baku Awal 250 Porsi",
        "Neon Box Branding",
        "Seragam Karyawan (2pcs)",
        "Full Akses SDMS + Tablet Kasir",
        "Sharing Profit 30% dari Omset/Bulan"
    ]'::jsonb
WHERE name = 'Mitra Outlet';

-- Use upsert (insert if not exists) for Mitra Investasi
INSERT INTO public.partnership_packages (name, price, description, features, status, is_popular)
SELECT 
    'Mitra Investasi', 
    10000000, 
    'Investasi pasif dengan return pasti 10% per bulan selama kontrak 2 tahun.', 
    '[
        "Return 10% per Bulan (Fixed)",
        "Kontrak Kerjasama 2 Tahun",
        "Laporan Keuangan Transparan",
        "Prioritas Buyback Saham",
        "Tanpa Perlu Kelola Operasional",
        "Akses Investor Dashboard"
    ]'::jsonb, 
    'available', 
    true
WHERE NOT EXISTS (
    SELECT 1 FROM public.partnership_packages WHERE name = 'Mitra Investasi'
);
