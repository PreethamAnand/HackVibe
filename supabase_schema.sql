-- HackVibe 2025 - Supabase (PostgreSQL) schema for registrations
-- Safe to run multiple times

-- 1) Table
create table if not exists public.registrations (
  id bigserial primary key,
  leader_name text not null,
  leader_email text not null,
  leader_phone text not null,
  leader_tshirt_size text not null,
  college_name text not null,
  team_name text not null,
  member2_name text not null,
  member2_email text not null,
  member2_phone text not null,
  member2_tshirt_size text not null,
  member3_name text not null,
  member3_email text not null,
  member3_phone text not null,
  member3_tshirt_size text not null,
  utr_number text not null,
  account_holder_name text not null,
  project_idea text,
  ip_address text,
  unique_code text,
  status text not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_leader_size check (leader_tshirt_size in ('S','M','L','XL','XXL')),
  constraint chk_m2_size check (member2_tshirt_size in ('S','M','L','XL','XXL')),
  constraint chk_m3_size check (member3_tshirt_size in ('S','M','L','XL','XXL')),
  constraint chk_utr_digits check (utr_number ~ '^[0-9]{12}$')
);

-- 2) Uniques required by the app (duplicates validation)
create unique index if not exists uq_registrations_team_name on public.registrations(team_name);
create unique index if not exists uq_registrations_leader_email on public.registrations(leader_email);
create unique index if not exists uq_registrations_utr_number on public.registrations(utr_number);
create unique index if not exists uq_registrations_unique_code on public.registrations(unique_code);

-- Optional globals (uncomment if you want to enforce these too)
-- create unique index if not exists uq_registrations_leader_phone on public.registrations(leader_phone);
-- create unique index if not exists uq_registrations_member2_email on public.registrations(member2_email);
-- create unique index if not exists uq_registrations_member2_phone on public.registrations(member2_phone);
-- create unique index if not exists uq_registrations_member3_email on public.registrations(member3_email);
-- create unique index if not exists uq_registrations_member3_phone on public.registrations(member3_phone);

-- 3) Helpful indexes
create index if not exists idx_registrations_created_at on public.registrations(created_at);
create index if not exists idx_registrations_college_name on public.registrations(college_name);

-- 4) updated_at trigger
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists trg_set_updated_at on public.registrations;
create trigger trg_set_updated_at
before update on public.registrations
for each row execute function public.set_updated_at();

-- 5) Storage bucket for payment screenshots (Supabase Storage)
-- Bucket ID/name uses the exact string requested: 'payment-screenshort'
insert into storage.buckets (id, name, public)
values ('payment-screenshort','payment-screenshort', true)
on conflict (id) do nothing;

-- Ensure a column exists to store the storage object path (relative path inside bucket)
alter table public.registrations
add column if not exists payment_screenshot_path text;

-- Helpful note: public URL will be
--   https://<your-project-ref>.supabase.co/storage/v1/object/public/payment-screenshort/<payment_screenshot_path>

-- RLS policies for storage.objects scoped to this bucket
-- Enable read for everyone (anon) for objects in 'payment-screenshort'
drop policy if exists storage_payment_screenshort_anon_select on storage.objects;
create policy storage_payment_screenshort_anon_select
on storage.objects
for select
to anon
using (bucket_id = 'payment-screenshort');

-- Enable uploads (insert) for everyone (anon) into this bucket
drop policy if exists storage_payment_screenshort_anon_insert on storage.objects;
create policy storage_payment_screenshort_anon_insert
on storage.objects
for insert
to anon
with check (bucket_id = 'payment-screenshort');

-- Optional: allow authenticated role as well
drop policy if exists storage_payment_screenshort_auth_select on storage.objects;
create policy storage_payment_screenshort_auth_select
on storage.objects
for select
to authenticated
using (bucket_id = 'payment-screenshort');

drop policy if exists storage_payment_screenshort_auth_insert on storage.objects;
create policy storage_payment_screenshort_auth_insert
on storage.objects
for insert
to authenticated
with check (bucket_id = 'payment-screenshort');

-- 6) RLS policies for anon (required by the site) - registrations
alter table public.registrations enable row level security;

drop policy if exists registrations_anon_select on public.registrations;
create policy registrations_anon_select
on public.registrations
for select
to anon
using (true);

drop policy if exists registrations_anon_insert on public.registrations;
create policy registrations_anon_insert
on public.registrations
for insert
to anon
with check (true);

-- Optional: allow authenticated role as well
drop policy if exists registrations_auth_select on public.registrations;
create policy registrations_auth_select
on public.registrations
for select
to authenticated
using (true);

drop policy if exists registrations_auth_insert on public.registrations;
create policy registrations_auth_insert
on public.registrations
for insert
to authenticated
with check (true);


