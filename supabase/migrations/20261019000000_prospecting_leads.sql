-- Prospecting CRM: leads belong to the authenticated user.
-- Apply this migration to the Supabase project connected to the app before enabling cloud sync.
create table if not exists public.prospecting_leads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  business text not null check (char_length(trim(business)) between 1 and 120),
  niche text not null default 'Outro',
  city text not null default '',
  website text not null default '',
  contact text not null default '',
  notes text not null default '',
  status text not null default 'Novo'
    check (status in ('Novo', 'Contatado', 'Interessado', 'Convertido', 'Descartado')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists prospecting_leads_user_created_idx
  on public.prospecting_leads (user_id, created_at desc);

alter table public.prospecting_leads enable row level security;

drop policy if exists "Users can read their own prospecting leads" on public.prospecting_leads;
create policy "Users can read their own prospecting leads"
  on public.prospecting_leads for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create their own prospecting leads" on public.prospecting_leads;
create policy "Users can create their own prospecting leads"
  on public.prospecting_leads for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own prospecting leads" on public.prospecting_leads;
create policy "Users can update their own prospecting leads"
  on public.prospecting_leads for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own prospecting leads" on public.prospecting_leads;
create policy "Users can delete their own prospecting leads"
  on public.prospecting_leads for delete
  using (auth.uid() = user_id);

create or replace function public.set_prospecting_leads_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists prospecting_leads_updated_at on public.prospecting_leads;
create trigger prospecting_leads_updated_at
  before update on public.prospecting_leads
  for each row execute function public.set_prospecting_leads_updated_at();
