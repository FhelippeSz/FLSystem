-- Execute no Supabase: SQL Editor -> New query -> Run

create table if not exists public.pdv_state (
  id         text primary key,
  data       jsonb       not null,
  updated_at timestamptz not null default now()
);

alter table public.pdv_state enable row level security;

-- Somente usuários autenticados (Authentication -> Users) podem ler e gravar.
-- A chave "anon" fica no código do site, então NÃO libere acesso ao papel anon.
drop policy if exists "pdv_select_auth" on public.pdv_state;
drop policy if exists "pdv_insert_auth" on public.pdv_state;
drop policy if exists "pdv_update_auth" on public.pdv_state;

create policy "pdv_select_auth" on public.pdv_state
  for select to authenticated using (true);
create policy "pdv_insert_auth" on public.pdv_state
  for insert to authenticated with check (true);
create policy "pdv_update_auth" on public.pdv_state
  for update to authenticated using (true) with check (true);

-- Atualizações em tempo real entre dispositivos
alter publication supabase_realtime add table public.pdv_state;
