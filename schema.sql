-- Execute no Supabase: SQL Editor -> New query -> Run
-- Modelo: cada venda, produto, movimentação etc. é UMA linha (por loja e coleção).

create table if not exists public.pdv_records (
  store_id   text        not null,
  collection text        not null,
  id         text        not null,
  data       jsonb,
  deleted    boolean     not null default false,   -- exclusões viram "lápide" para propagar aos outros dispositivos
  updated_at timestamptz not null default now(),
  updated_by text,
  primary key (store_id, collection, id)
);

create index if not exists pdv_records_store_updated
  on public.pdv_records (store_id, updated_at);

-- O horário de gravação é sempre o do servidor (não depende do relógio do dispositivo)
create or replace function public.pdv_touch() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

drop trigger if exists pdv_records_touch on public.pdv_records;
create trigger pdv_records_touch
  before insert or update on public.pdv_records
  for each row execute function public.pdv_touch();

-- Somente usuários autenticados (Authentication -> Users) podem ler e gravar.
-- A chave "anon" fica no código do site, então NÃO libere acesso ao papel anon.
alter table public.pdv_records enable row level security;

drop policy if exists "pdv_select_auth" on public.pdv_records;
drop policy if exists "pdv_insert_auth" on public.pdv_records;
drop policy if exists "pdv_update_auth" on public.pdv_records;

create policy "pdv_select_auth" on public.pdv_records
  for select to authenticated using (true);
create policy "pdv_insert_auth" on public.pdv_records
  for insert to authenticated with check (true);
create policy "pdv_update_auth" on public.pdv_records
  for update to authenticated using (true) with check (true);

-- Atualizações em tempo real entre dispositivos
do $$
begin
  alter publication supabase_realtime add table public.pdv_records;
exception when duplicate_object then null;
end $$;

-- (Opcional) a versão anterior usava a tabela pdv_state, que não é mais usada:
-- drop table if exists public.pdv_state;
