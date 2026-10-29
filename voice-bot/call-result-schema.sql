-- Proposed schema only. Review before running in Supabase SQL Editor.
-- This does NOT create or enable telephony by itself.
create table if not exists public.estatevoice_call_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lead_id text not null,
  provider text not null default 'exotel',
  provider_call_id text,
  purpose text not null default 'qualification',
  status text not null default 'queued'
    check (status in ('queued','initiated','ringing','in_progress','completed','no_answer','busy','failed','cancelled')),
  outcome text,
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  summary text,
  next_action text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.estatevoice_call_attempts enable row level security;
drop policy if exists estatevoice_calls_select_own on public.estatevoice_call_attempts;
create policy estatevoice_calls_select_own on public.estatevoice_call_attempts
  for select to authenticated using (user_id = (select auth.uid()));
-- Deliberately no browser INSERT/UPDATE policy. Trusted server-side code must create/update call attempts.
grant select on public.estatevoice_call_attempts to authenticated;
