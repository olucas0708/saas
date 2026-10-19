create type public.workspace_role as enum ('owner','admin','member');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "own profile read" on public.profiles for select to authenticated using (id = auth.uid());
create policy "own profile update" on public.profiles for update to authenticated using (id = auth.uid());

create table public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  owner_id uuid not null,
  created_at timestamptz not null default now()
);
create table public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null,
  role public.workspace_role not null default 'member',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant all on public.workspaces to service_role;
grant all on public.workspace_members to service_role;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;

create or replace function public.is_workspace_member(_ws uuid, _uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.workspace_members where workspace_id=_ws and user_id=_uid)
$$;
create or replace function public.has_workspace_role(_ws uuid, _uid uuid, _roles public.workspace_role[])
returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.workspace_members where workspace_id=_ws and user_id=_uid and role = any(_roles))
$$;

create policy "members read ws" on public.workspaces for select to authenticated using (public.is_workspace_member(id, auth.uid()));
create policy "admins update ws" on public.workspaces for update to authenticated using (public.has_workspace_role(id, auth.uid(), array['owner','admin']::public.workspace_role[]));
create policy "members read members" on public.workspace_members for select to authenticated using (public.is_workspace_member(workspace_id, auth.uid()));
create policy "admins manage members" on public.workspace_members for all to authenticated
  using (public.has_workspace_role(workspace_id, auth.uid(), array['owner','admin']::public.workspace_role[]))
  with check (public.has_workspace_role(workspace_id, auth.uid(), array['owner','admin']::public.workspace_role[]));

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  name text not null,
  niche text,
  data jsonb not null default '{}'::jsonb,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
alter table public.projects enable row level security;
create policy "members all projects" on public.projects for all to authenticated
  using (public.is_workspace_member(workspace_id, auth.uid()))
  with check (public.is_workspace_member(workspace_id, auth.uid()));

create table public.project_versions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  data jsonb not null,
  label text,
  created_by uuid not null default auth.uid(),
  created_at timestamptz not null default now()
);
grant select, insert, delete on public.project_versions to authenticated;
grant all on public.project_versions to service_role;
alter table public.project_versions enable row level security;
create policy "members versions" on public.project_versions for all to authenticated
  using (exists(select 1 from public.projects p where p.id=project_id and public.is_workspace_member(p.workspace_id, auth.uid())))
  with check (exists(select 1 from public.projects p where p.id=project_id and public.is_workspace_member(p.workspace_id, auth.uid())));

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare ws uuid; nm text;
begin
  nm := coalesce(new.raw_user_meta_data->>'display_name', new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1));
  insert into public.profiles(id, display_name) values (new.id, nm);
  insert into public.workspaces(name, owner_id) values (nm || ' — Workspace', new.id) returning id into ws;
  insert into public.workspace_members(workspace_id, user_id, role) values (ws, new.id, 'owner');
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at() returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end $$;
create trigger projects_touch before update on public.projects for each row execute function public.touch_updated_at();