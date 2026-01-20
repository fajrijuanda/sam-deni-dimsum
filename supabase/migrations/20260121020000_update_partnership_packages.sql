-- Update Mitra Outlet description regarding return
UPDATE public.partnership_packages
SET description = 'Investasi outlet auto-pilot (terima beres) dengan bagi hasil 30% dari omset dan kontrak 2 tahun.',
    status = 'full',
    features = '[
        "Sistem Auto-Pilot (Terima Beres)",
        "Kontrak Kerjasama 2 Tahun",
        "Sharing Profit 30% dari Omset",
        "Gerobak Premium & Aset Milik Mitra",
        "Pengelolaan SDM oleh Pusat",
        "Laporan Penjualan Real-time"
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
