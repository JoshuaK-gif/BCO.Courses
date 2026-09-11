-- BCO Courses — Supabase (PostgreSQL) migration
-- Run this in the Supabase SQL Editor

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- Categories
-- ============================================================
create table public.categories (
  id          text primary key default gen_random_uuid()::text,
  name        text unique not null,
  slug        text unique not null,
  description text,
  icon        text,
  sort_order  integer not null default 0,
  show_on_home boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.categories enable row level security;

create policy "Public can read categories"
  on public.categories for select
  using (true);

create policy "Service role can manage categories"
  on public.categories for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Providers
-- ============================================================
create table public.providers (
  id              text primary key default gen_random_uuid()::text,
  name            text unique not null,
  slug            text unique not null,
  website_url     text,
  logo_url        text,
  description     text,
  commission_note text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.providers enable row level security;

create policy "Public can read providers"
  on public.providers for select
  using (true);

create policy "Service role can manage providers"
  on public.providers for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Courses
-- ============================================================
create table public.courses (
  id                text primary key default gen_random_uuid()::text,
  title             text not null,
  slug              text unique not null,
  short_description text not null,
  description       text not null,

  category_id       text not null references public.categories(id) on delete restrict,
  provider_id       text not null references public.providers(id) on delete restrict,

  level             text,
  price             double precision,
  currency          text not null default 'USD',
  is_free           boolean not null default false,
  duration          text,
  certificate       boolean not null default false,
  language          text,
  format            text,

  image_url         text,

  learning_outcomes  text not null default '[]',
  target_audience    text not null default '[]',
  why_recommended    text,

  affiliate_url      text,
  external_course_url text,

  rating            double precision,
  featured          boolean not null default false,
  published         boolean not null default false,
  last_verified     timestamptz,

  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

alter table public.courses enable row level security;

create policy "Public can read published courses"
  on public.courses for select
  using (published = true);

create policy "Service role can manage courses"
  on public.courses for all
  using (auth.role() = 'service_role');

create index idx_courses_category_id on public.courses(category_id);
create index idx_courses_provider_id on public.courses(provider_id);
create index idx_courses_published_featured on public.courses(published, featured);
create index idx_courses_slug on public.courses(slug);

-- ============================================================
-- Course Views (analytics)
-- ============================================================
create table public.course_views (
  id         text primary key default gen_random_uuid()::text,
  course_id  text not null references public.courses(id) on delete cascade,
  path       text,
  referrer   text,
  created_at timestamptz not null default now()
);

alter table public.course_views enable row level security;

create policy "Service role can manage course_views"
  on public.course_views for all
  using (auth.role() = 'service_role');

create index idx_course_views_course_id on public.course_views(course_id);
create index idx_course_views_created_at on public.course_views(created_at);

-- ============================================================
-- Course Clicks (analytics)
-- ============================================================
create table public.course_clicks (
  id         text primary key default gen_random_uuid()::text,
  course_id  text not null references public.courses(id) on delete cascade,
  referrer   text,
  user_agent text,
  created_at timestamptz not null default now()
);

alter table public.course_clicks enable row level security;

create policy "Service role can manage course_clicks"
  on public.course_clicks for all
  using (auth.role() = 'service_role');

create index idx_course_clicks_course_id on public.course_clicks(course_id);
create index idx_course_clicks_created_at on public.course_clicks(created_at);

-- ============================================================
-- Settings
-- ============================================================
create table public.settings (
  key   text primary key,
  value text not null
);

alter table public.settings enable row level security;

create policy "Service role can manage settings"
  on public.settings for all
  using (auth.role() = 'service_role');

-- ============================================================
-- Updated_at trigger
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.providers
  for each row execute function public.handle_updated_at();

create trigger set_updated_at
  before update on public.courses
  for each row execute function public.handle_updated_at();
