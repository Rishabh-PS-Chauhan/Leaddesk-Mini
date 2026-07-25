-- LeadDesk Mini — initial schema

create type public.lead_status as enum ('new', 'contacted', 'closed');
create type public.budget_range as enum ('under_1k', '1k_5k', '5k_15k', '15k_plus');

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  budget_range public.budget_range not null,
  message text not null,
  status public.lead_status not null default 'new',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint name_length check (char_length(trim(name)) between 2 and 100),
  constraint email_format check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint message_length check (char_length(message) between 10 and 2000)
);

create index leads_status_idx on public.leads (status);
create index leads_created_at_idx on public.leads (created_at desc);

-- keep updated_at honest
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger leads_set_updated_at
before update on public.leads
for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.leads enable row level security;

-- Anyone can create a lead (the public form). No read-back granted here.
create policy "public_can_insert_leads"
on public.leads
for insert
to anon
with check (true);

-- Only authenticated admins can read leads.
create policy "authenticated_can_select_leads"
on public.leads
for select
to authenticated
using (true);

-- Only authenticated admins can update leads (app layer restricts this to status only).
create policy "authenticated_can_update_leads"
on public.leads
for update
to authenticated
using (true)
with check (true);

-- Deliberately no delete policy: leads are not deletable via the app in this MVP.
