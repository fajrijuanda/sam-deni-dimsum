-- Create partnership_packages table
create table if not exists public.partnership_packages (
    id uuid not null default gen_random_uuid(),
    name text not null,
    price numeric not null default 0,
    description text,
    features jsonb default '[]'::jsonb,
    image_url text,
    status text not null default 'available', -- 'available', 'full', 'closed'
    is_popular boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    constraint partnership_packages_pkey primary key (id)
);

-- Enable RLS
alter table public.partnership_packages enable row level security;

-- Policies
create policy "Public read access"
on public.partnership_packages for select
to public
using ( true );

create policy "Admin full access"
on public.partnership_packages for all
to authenticated
using ( 
    exists (
        select 1 from public.users 
        where users.id = auth.uid() 
        and users.role = 'admin'
    )
);

-- Seed initial data (Mitra Rumahan)
insert into public.partnership_packages (name, price, description, features, status, is_popular)
values 
(
    'Mitra Rumahan', 
    3500000, 
    'Paket usaha pemula cocok untuk ibu rumah tangga atau usaha sampingan di rumah.',
    '[
        "Booth Portable Exclusive",
        "Peralatan Masak Lengkap (Kukusan, Kompor)",
        "Bahan Baku Awal 100 Porsi",
        "Media Promosi (Banner, Menu)",
        "Pelatihan Karyawan",
        "Akses Aplikasi SDMS"
    ]'::jsonb,
    'available',
    true
),
(
    'Mitra Outlet', 
    7500000, 
    'Paket semi-permanen untuk lokasi strategis seperti teras minimarket atau foodcourt.',
    '[
        "Gerobak/Booth Premium",
        "Peralatan Masak Grade A",
        "Bahan Baku Awal 250 Porsi",
        "Neon Box Branding",
        "Seragam Karyawan (2pcs)",
        "Full Akses SDMS + Tablet Kasir"
    ]'::jsonb,
    'available',
    false
);
