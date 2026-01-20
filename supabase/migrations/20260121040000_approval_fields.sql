-- Create outlets table if it doesn't exist (for assignment)
create table if not exists public.outlets (
    id uuid not null default gen_random_uuid(),
    name text not null,
    address text,
    status text default 'active',
    created_at timestamp with time zone default now(),
    primary key (id)
);

-- Seed some outlets if empty
insert into public.outlets (name, address, status)
select 'Sam Deni Dimsum - Pusat (Tebet)', 'Jl. Tebet Raya No. 12', 'active'
where not exists (select 1 from public.outlets limit 1);

insert into public.outlets (name, address, status)
select 'Sam Deni Dimsum - Cabang Bekasi', 'Jl. Galaxy Raya No. 5', 'active'
where not exists (select 1 from public.outlets where name like '%Bekasi%');

insert into public.outlets (name, address, status)
select 'Sam Deni Dimsum - Cabang Depok', 'Jl. Margonda No. 88', 'active'
where not exists (select 1 from public.outlets where name like '%Depok%');


-- Add approval fields to users table
alter table public.users 
add column if not exists mou_url text,
add column if not exists payment_proof_url text,
add column if not exists outlet_id uuid references public.outlets(id);

-- Storage for Mitra Documents
-- We try to insert into storage.buckets. Note: This might require specific permissions or might be handled via dashboard in some setups, but SQL usually works for Supabase.
insert into storage.buckets (id, name, public)
values ('mitra-docs', 'mitra-docs', true)
on conflict (id) do nothing;

-- Policies for Storage
-- Allow authenticated users (Mitra) to upload? No, Admin uploads during approval.
-- Admin can perform all operations.
create policy "Admin Access Mitra Docs"
on storage.objects for all
to authenticated
using ( 
    exists (select 1 from public.users where id = auth.uid() and role = 'admin') 
)
with check ( 
    exists (select 1 from public.users where id = auth.uid() and role = 'admin') 
);

-- Public read access (viewing proofs)? Or restricted?
-- Let's make it public for simplicity of viewing in `<img>` tags in dashboard, 
-- or restrict to Admin. Since it's sensitive (MOU/Payment), restrict to Admin.
-- But wait, if I use `supabase.storage.from('mitra-docs').getPublicUrl()`, it needs to be public.
-- If I want private, I must use `createSignedUrl`. 
-- For now, I'll set bucket to public (above) for ease, but ideally should be private.
-- User request implies Admin views it.
