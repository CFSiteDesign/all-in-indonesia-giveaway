create table if not exists giveaway_entries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  whatsapp text not null,
  source text default 'direct',
  created_at timestamptz default now()
);

alter table giveaway_entries enable row level security;

drop policy if exists "public can insert entries" on giveaway_entries;
create policy "public can insert entries"
  on giveaway_entries for insert to anon with check (true);

drop policy if exists "admins can read entries" on giveaway_entries;
create policy "admins can read entries"
  on giveaway_entries for select to authenticated using (true);
