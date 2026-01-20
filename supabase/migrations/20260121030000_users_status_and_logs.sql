-- Ensure users table has status and other necessary fields
create table if not exists public.users (
    id uuid references auth.users not null primary key,
    name text,
    email text,
    role text default 'user',
    status text default 'active', -- 'active', 'pending_approval', 'banned'
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Add status column if it doesn't exist
do $$
begin
    if not exists (select 1 from information_schema.columns where table_name = 'users' and column_name = 'status') then
        alter table public.users add column status text default 'active';
    end if;
end $$;

-- Enable RLS
alter table public.users enable row level security;

-- Drop existing policy if it conflicts or create new one
drop policy if exists "Public profiles are viewable by everyone" on public.users;
create policy "Public profiles are viewable by everyone"
  on public.users for select
  using ( true );

drop policy if exists "Users can insert their own profile" on public.users;
create policy "Users can insert their own profile"
  on public.users for insert
  with check ( auth.uid() = id );

drop policy if exists "Users can update own profile" on public.users;
create policy "Users can update own profile"
  on public.users for update
  using ( auth.uid() = id );

-- Create table for OTP/Verification logs if needed (optional, Supabase Auth handles most)
-- But user wants OTP flow. Supabase Auth supports Email OTP natively.
