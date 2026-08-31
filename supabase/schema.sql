-- Run this once in your Supabase project's SQL editor
-- (Dashboard → SQL Editor → New query → paste → Run)

create table if not exists care_requests (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text,
  message text,
  status text not null default 'new'  -- 'new' | 'contacted' | 'closed'
);

-- Row Level Security: locked down by default. The backend uses the
-- service role key (server-side only, never exposed to the browser),
-- which bypasses RLS, so the public/anon key can't read or write this
-- table at all. That's what we want — submissions only go in through
-- our own API, and only your brother (via the Supabase dashboard, or a
-- future admin view) can read them.
alter table care_requests enable row level security;
