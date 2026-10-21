# PDV Terminal

PDV em React + Vite. Os dados são salvos automaticamente no navegador (localStorage) e,
opcionalmente, sincronizados com o Supabase para usar os mesmos dados em vários dispositivos.

## Rodar localmente
```bash
npm install
npm run dev
```
Login inicial: `admin` / `admin123` — **troque a senha** em Usuários → "Alterar minha senha".

## Onde os dados ficam
- **Sem configuração:** apenas neste navegador. Limpar os dados do navegador apaga tudo — use Configurações → Backup.
- **Com Supabase:** também na nuvem, com atualização em tempo real entre dispositivos.

## Ativar a nuvem (Supabase)
1. Crie um projeto em https://supabase.com.
2. **SQL Editor** → cole e execute `supabase/schema.sql` (cria a tabela `pdv_records`).
3. **Authentication → Users → Add user**: crie um e-mail/senha (login da *nuvem*, diferente do login do PDV).
4. **Project Settings → API**: copie a *Project URL* e a chave *anon public*.
5. No **Vercel → Settings → Environment Variables**: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` e, opcionalmente, `VITE_PDV_STORE_ID`.
6. Novo deploy. Em cada dispositivo: Configurações → **Nuvem** → entre com o usuário do passo 3.

## Como a sincronização funciona
- Cada venda, compra, produto, movimentação etc. é **uma linha** na tabela. Dois caixas vendendo ao mesmo tempo
  criam linhas diferentes e nada se sobrescreve.
- **Estoque** = estoque-base do produto + soma das movimentações (não é gravado direto). **Saldo devedor** do cliente =
  soma das contas a receber em aberto. Por isso nunca há "perda" de baixa de estoque entre dispositivos.
- Exclusões viram "lápides" para propagar. Mudanças chegam em tempo real e há uma conferência a cada 20 s.
- Offline: continua funcionando e reenvia ao reconectar.

## Limitações conhecidas
- **Mesmo registro editado em dois dispositivos ao mesmo tempo** (ex.: o mesmo produto, ou a configuração): vale a última gravação.
- **Número da venda** (#0012) é sequencial por dispositivo; em vendas simultâneas pode repetir. O sistema usa um id interno
  único, então nada se mistura — só o número exibido pode coincidir.
- **Caixa:** o estado do caixa (aberto/fechado) é um só para a loja. Vários operadores com caixas separados exigem
  um caixa por operador (não implementado).
- **Segurança:** quem tiver o login da nuvem enxerga todos os dados (inclui CPF/telefone de clientes). As permissões de
  perfil valem na interface, não no banco.
- Dados criados antes desta versão continuam funcionando; o estoque-base é calculado automaticamente na primeira abertura.
