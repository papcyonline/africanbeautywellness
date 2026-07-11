-- ============================================================
-- Africa Beauty & Wellness — database schema
-- Run this once in the Supabase SQL editor (Dashboard → SQL → New query).
-- Safe to re-run.
-- ============================================================

-- Enums -------------------------------------------------------
do $$ begin
  create type registration_status as enum ('pending', 'approved', 'rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_tier as enum ('free', 'featured');
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_payment as enum ('none', 'pending', 'paid');
exception when duplicate_object then null; end $$;

-- Human-friendly reference (REG-1051, REG-1052, …) ------------
create sequence if not exists registration_ref_seq start 1051;

-- Registrations ----------------------------------------------
create table if not exists registrations (
  id                     uuid primary key default gen_random_uuid(),
  ref                    text unique not null
                           default ('REG-' || lpad(nextval('registration_ref_seq')::text, 4, '0')),
  created_at             timestamptz not null default now(),

  company                text not null,
  country                text not null,
  website                text,
  contact                text not null,
  email                  text not null,
  phone                  text not null,

  business_type          text not null,
  products               text,

  manufactures           boolean not null default false,
  manufacturing_country  text,
  interested_africa      boolean not null default false,
  interested_cameroon    boolean not null default false,

  african_pct            int not null default 0 check (african_pct between 0 and 100),
  ingredients            text,
  capacity               text,

  company_profile_url    text,
  product_catalogue_url  text,
  anything_else          text,

  tier                   registration_tier   not null default 'free',
  payment                registration_payment not null default 'none',
  status                 registration_status  not null default 'pending'
);

create index if not exists registrations_status_idx  on registrations (status);
create index if not exists registrations_country_idx on registrations (country);
create index if not exists registrations_tier_idx    on registrations (tier);

-- Row Level Security -----------------------------------------
-- Reads/updates happen server-side with the service-role key (bypasses RLS).
alter table registrations enable row level security;

drop policy if exists "Public can submit a registration" on registrations;
create policy "Public can submit a registration"
  on registrations for insert
  to anon
  with check (true);

-- Private storage bucket for uploaded company profiles / catalogues.
insert into storage.buckets (id, name, public)
values ('company-docs', 'company-docs', false)
on conflict (id) do nothing;
