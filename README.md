# PDV Terminal

PDV em React + Vite. Os dados são salvos automaticamente no navegador (localStorage).
Opcionalmente, sincroniza com o Supabase para usar os mesmos dados em vários dispositivos.

## Rodar localmente
```bash
npm install
npm run dev
```
Login inicial: `admin` / `admin123` — **troque a senha** em Usuários → "Alterar minha senha".

## Onde os dados ficam
- **Sem configuração:** apenas neste navegador/dispositivo. Limpar os dados do navegador apaga tudo — use Configurações → Backup.
- **Com Supabase:** também na nuvem, com atualização em tempo real entre dispositivos.

## Ativar a nuvem (Supabase)
1. Crie um projeto em https://supabase.com.
2. **SQL Editor** → cole e execute `supabase/schema.sql`.
3. **Authentication → Users → Add user**: crie um e-mail/senha (é o login da *nuvem*, diferente do login do PDV).
4. **Project Settings → API**: copie a *Project URL* e a chave *anon public*.
5. No **Vercel → Settings → Environment Variables**, crie:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - (opcional) `VITE_PDV_STORE_ID`
6. Faça um novo deploy. Em cada dispositivo: Configurações → **Nuvem** → entre com o usuário do passo 3.

## Limitações conhecidas
- A sincronização grava o **estado inteiro**; se dois dispositivos alterarem ao mesmo tempo, vale a última gravação (pode perder a alteração mais antiga). Para vários caixas vendendo simultaneamente, o próximo passo é migrar para tabelas separadas (vendas, produtos…).
- Perfis e permissões são aplicados na interface; quem tiver acesso ao usuário da nuvem enxerga todos os dados. Regras no servidor exigiriam login unificado via Supabase Auth.
- Offline: continua salvando localmente e reenvia ao reconectar; se a nuvem tiver dados mais novos, eles prevalecem.
