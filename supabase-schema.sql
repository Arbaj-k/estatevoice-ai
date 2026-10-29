-- EstateVoice AI: single-builder pilot schema (Supabase/Postgres)
-- Review before running. This creates new tables; it does not delete existing data.
create schema if not exists private;

create table if not exists public.builder_accounts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.builder_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  builder_id uuid not null references public.builder_accounts(id) on delete cascade,
  role text not null default 'owner' check (role in ('owner','manager','viewer')),
  created_at timestamptz not null default now(),
  unique (user_id, builder_id)
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builder_accounts(id) on delete cascade,
  name text not null,
  phone text not null,
  budget text,
  preferred_location text,
  property_type text,
  status text not null default 'New' check (status in ('New','Hot','Warm','Cold','Callback','Not Interested','Do Not Call')),
  calling_permission text not null default 'unknown' check (calling_permission in ('yes','no','unknown')),
  purchase_timeline text,
  notes text,
  last_contact_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (builder_id, phone)
);

create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builder_accounts(id) on delete cascade,
  name text not null,
  location text,
  price_range text,
  configurations text,
  amenities text,
  possession_timeline text,
  verified_facts text,
  brochure_url text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.call_logs (
  id uuid primary key default gen_random_uuid(),
  builder_id uuid not null references public.builder_accounts(id) on delete cascade,
  lead_id uuid references public.leads(id) on delete set null,
  property_id uuid references public.properties(id) on delete set null,
  call_mode text not null default 'demo' check (call_mode in ('demo','real')),
  provider_call_id text,
  outcome text not null default 'Pending' check (outcome in ('Pending','Hot','Warm','Cold','Callback','Not Interested','Do Not Call','No Answer','Failed')),
  duration_seconds integer check (duration_seconds is null or duration_seconds >= 0),
  summary text,
  customer_interest text,
  callback_at timestamptz,
  transcript jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists leads_builder_status_idx on public.leads(builder_id, status);
create index if not exists call_logs_builder_created_idx on public.call_logs(builder_id, created_at desc);
create index if not exists properties_builder_active_idx on public.properties(builder_id, is_active);

create or replace function private.current_builder_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select bm.builder_id
  from public.builder_members bm
  where bm.user_id = (select auth.uid())
  limit 1;
$$;
revoke all on function private.current_builder_id() from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.current_builder_id() to authenticated;

alter table public.builder_accounts enable row level security;
alter table public.builder_members enable row level security;
alter table public.leads enable row level security;
alter table public.properties enable row level security;
alter table public.call_logs enable row level security;

-- Accounts: a member may read only their own builder account.
drop policy if exists builder_accounts_member_select on public.builder_accounts;
create policy builder_accounts_member_select on public.builder_accounts
for select to authenticated
using (id = (select private.current_builder_id()));

-- Members: users can see only members of their builder. Membership changes are admin-only
-- and should be done through a trusted server/admin workflow, not the browser client.
drop policy if exists builder_members_same_builder_select on public.builder_members;
create policy builder_members_same_builder_select on public.builder_members
for select to authenticated
using (builder_id = (select private.current_builder_id()));

-- Leads: owner/manager may write; viewer is read-only.
drop policy if exists leads_member_select on public.leads;
create policy leads_member_select on public.leads for select to authenticated
using (builder_id = (select private.current_builder_id()));
drop policy if exists leads_manager_insert on public.leads;
create policy leads_manager_insert on public.leads for insert to authenticated
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));
drop policy if exists leads_manager_update on public.leads;
create policy leads_manager_update on public.leads for update to authenticated
using (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
))
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));
drop policy if exists leads_owner_delete on public.leads;
create policy leads_owner_delete on public.leads for delete to authenticated
using (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role = 'owner'
));

-- Properties: members can read; owner/manager can maintain.
drop policy if exists properties_member_select on public.properties;
create policy properties_member_select on public.properties for select to authenticated
using (builder_id = (select private.current_builder_id()));
drop policy if exists properties_manager_insert on public.properties;
create policy properties_manager_insert on public.properties for insert to authenticated
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));
drop policy if exists properties_manager_update on public.properties;
create policy properties_manager_update on public.properties for update to authenticated
using (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
))
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));
drop policy if exists properties_owner_delete on public.properties;
create policy properties_owner_delete on public.properties for delete to authenticated
using (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role = 'owner'
));

-- Call logs: members can read; owner/manager can add/update. No browser-side deletes.
drop policy if exists call_logs_member_select on public.call_logs;
create policy call_logs_member_select on public.call_logs for select to authenticated
using (builder_id = (select private.current_builder_id()));
drop policy if exists call_logs_manager_insert on public.call_logs;
create policy call_logs_manager_insert on public.call_logs for insert to authenticated
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));
drop policy if exists call_logs_manager_update on public.call_logs;
create policy call_logs_manager_update on public.call_logs for update to authenticated
using (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
))
with check (builder_id = (select private.current_builder_id()) and exists (
  select 1 from public.builder_members bm where bm.user_id = (select auth.uid()) and bm.role in ('owner','manager')
));

-- Explicit table grants for authenticated app users; RLS still controls row access.
grant select on public.builder_accounts, public.builder_members to authenticated;
grant select, insert, update, delete on public.leads to authenticated;
grant select, insert, update, delete on public.properties to authenticated;
grant select, insert, update on public.call_logs to authenticated;


-- Cloud sync for the browser MVP. Each signed-in user can access only their own state.
create table if not exists public.estatevoice_workspace_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  workspace jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.estatevoice_workspace_state enable row level security;
drop policy if exists estatevoice_state_select_own on public.estatevoice_workspace_state;
create policy estatevoice_state_select_own on public.estatevoice_workspace_state
  for select to authenticated using (user_id = (select auth.uid()));
drop policy if exists estatevoice_state_insert_own on public.estatevoice_workspace_state;
create policy estatevoice_state_insert_own on public.estatevoice_workspace_state
  for insert to authenticated with check (user_id = (select auth.uid()));
drop policy if exists estatevoice_state_update_own on public.estatevoice_workspace_state;
create policy estatevoice_state_update_own on public.estatevoice_workspace_state
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
grant select, insert, update on public.estatevoice_workspace_state to authenticated;
