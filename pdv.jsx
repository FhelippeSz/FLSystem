import React, { useState, useMemo, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import {
  LayoutDashboard, ShoppingCart, Wallet, Receipt, LogOut, Lock, User,
  Plus, Minus, X, Check, ArrowLeft, Search, CreditCard, Banknote, QrCode,
  AlertTriangle, TrendingUp, Package, ListChecks, Printer, Store,
  UserPlus, KeyRound, HelpCircle, Trash2, Pencil, Ban, CheckCircle2,
  BarChart3, ArrowDownCircle, Settings, Calendar, CalendarDays, CalendarRange,
  Barcode, ScanLine, LayoutGrid, Clock, ClipboardList, Truck, ChevronDown,
  ChevronRight, PackageSearch, SlidersHorizontal, BellRing, ShoppingBag, History,
  Users, Tags, Boxes, ArrowLeftRight, Undo2, Activity, ArrowUpCircle, UserCog,
  ShieldCheck, Cog, Database, Download, Upload, Building2, Percent, TrendingDown
} from 'lucide-react';

const C = {
  bgDark: '#131320',
  bgDark2: '#1B1B2C',
  bgDark3: '#242438',
  bgLight: '#F6F6FB',
  panel: '#FFFFFF',
  accent: '#2DD4BF',
  accentDark: '#0F9C8C',
  accentGlow: 'rgba(45,212,191,0.35)',
  primary: '#6D5DF6',
  primaryDark: '#5646D8',
  primarySoft: '#EFEDFF',
  primaryGlow: 'rgba(109,93,246,0.35)',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  warn: '#F59E0B',
  warnBg: '#FFFBEB',
  textDark: '#16151F',
  textLight: '#F5F5FA',
  muted: '#8B8DA0',
  mutedDark: '#63647A',
  borderDark: '#2E2E44',
  borderLight: '#ECECF3',
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
html, body { scroll-behavior: smooth; }
button { font-family: inherit; transition: filter 0.15s ease, transform 0.12s cubic-bezier(.34,1.56,.64,1), background 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease; }
button:not(:disabled):hover { filter: brightness(1.06); }
button:not(:disabled):active { transform: scale(0.96); }
input, select { transition: border-color 0.18s ease, box-shadow 0.18s ease, transform 0.15s ease; }
input:focus, select:focus { border-color: ${C.primaryDark} !important; box-shadow: 0 0 0 3px ${C.primaryGlow}; }
.nav-btn { position: relative; }
.nav-btn:not(:disabled):hover { background: ${C.primarySoft} !important; color: ${C.primaryDark} !important; }
.nav-btn:not(:disabled):hover svg { transform: scale(1.1); }
.nav-btn svg { transition: transform 0.2s cubic-bezier(.34,1.56,.64,1); }
.prod-card { transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease, border-color 0.22s ease; }
.prod-card:not(:disabled):hover { transform: translateY(-3px) scale(1.015); box-shadow: 0 14px 28px rgba(30,20,60,0.10); border-color: ${C.primaryDark}55 !important; }
.prod-card:not(:disabled):active { transform: translateY(-1px) scale(0.99); }
.table-row { transition: background 0.15s ease; }
.table-row:hover { background: ${C.bgLight}; }
.card-hover { transition: transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease; }
.card-hover:hover { transform: translateY(-2px); box-shadow: 0 12px 26px rgba(30,20,60,0.08); }
.scroll-thin::-webkit-scrollbar { width: 7px; height: 7px; }
.scroll-thin::-webkit-scrollbar-thumb { background: ${C.borderLight}; border-radius: 99px; }
.scroll-thin::-webkit-scrollbar-thumb:hover { background: ${C.mutedDark}; }

@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeSlideIn 0.32s cubic-bezier(.22,1,.36,1); }

@keyframes toastIn { from { opacity: 0; transform: translate(-50%, 14px) scale(0.96); } to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
.toast-anim { animation: toastIn 0.3s cubic-bezier(.34,1.56,.64,1); }

@keyframes popIn { from { opacity: 0; transform: scale(0.92) translateY(6px); } to { opacity: 1; transform: scale(1) translateY(0); } }
.pop-in { animation: popIn 0.3s cubic-bezier(.34,1.56,.64,1) both; }

@keyframes staggerIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
.stagger > * { animation: staggerIn 0.4s cubic-bezier(.22,1,.36,1) both; }
.stagger > *:nth-child(1) { animation-delay: 0.02s; }
.stagger > *:nth-child(2) { animation-delay: 0.06s; }
.stagger > *:nth-child(3) { animation-delay: 0.10s; }
.stagger > *:nth-child(4) { animation-delay: 0.14s; }
.stagger > *:nth-child(5) { animation-delay: 0.18s; }
.stagger > *:nth-child(6) { animation-delay: 0.22s; }
.stagger > *:nth-child(n+7) { animation-delay: 0.26s; }

@keyframes pulseDot { 0% { box-shadow: 0 0 0 0 ${C.accentGlow}; } 70% { box-shadow: 0 0 0 7px rgba(45,212,191,0); } 100% { box-shadow: 0 0 0 0 rgba(45,212,191,0); } }
.pulse-dot { animation: pulseDot 2s cubic-bezier(.4,0,.6,1) infinite; }

@keyframes gradientMove { 0% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } 100% { background-position: 0% 50%; } }
.gradient-bg {
  background: linear-gradient(120deg, ${C.bgDark} 0%, #2c204f 25%, ${C.bgDark} 50%, #143733 75%, ${C.bgDark} 100%);
  background-size: 300% 300%;
  animation: gradientMove 14s ease infinite;
}

@keyframes floatBlob { 0%,100% { transform: translate(0,0) scale(1); } 33% { transform: translate(20px,-24px) scale(1.08); } 66% { transform: translate(-16px,14px) scale(0.94); } }
.blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.35; animation: floatBlob 12s ease-in-out infinite; pointer-events: none; }

.ripple { position: relative; overflow: hidden; }
@keyframes rippleAnim { from { width: 0; height: 0; opacity: 0.45; } to { width: 340px; height: 340px; opacity: 0; } }
.ripple.rippling::after {
  content: ''; position: absolute; left: var(--rx, 50%); top: var(--ry, 50%); width: 0; height: 0;
  background: radial-gradient(circle, rgba(255,255,255,0.65), rgba(255,255,255,0) 70%);
  border-radius: 50%; transform: translate(-50%, -50%); animation: rippleAnim 0.55s ease-out; pointer-events: none;
}

.accordion-body { overflow: hidden; transition: max-height 0.32s cubic-bezier(.22,1,.36,1), opacity 0.25s ease; }

@keyframes spinSlow { to { transform: rotate(360deg); } }
.spin-slow { animation: spinSlow 6s linear infinite; }

@keyframes shimmer { 0% { background-position: -200px 0; } 100% { background-position: 200px 0; } }
.skeleton { background: linear-gradient(90deg, ${C.bgLight} 25%, #ececea 37%, ${C.bgLight} 63%); background-size: 400px 100%; animation: shimmer 1.4s ease infinite; }
`;

function rippleEffect(e) {
  const btn = e.currentTarget;
  const rect = btn.getBoundingClientRect();
  btn.style.setProperty('--rx', `${e.clientX - rect.left}px`);
  btn.style.setProperty('--ry', `${e.clientY - rect.top}px`);
  btn.classList.remove('rippling');
  void btn.offsetWidth;
  btn.classList.add('rippling');
}

function AnimatedNumber({ value, formatter = (v) => v, duration = 550 }) {
  const [display, setDisplay] = useState(value);
  const prevRef = useRef(value);
  useEffect(() => {
    const from = prevRef.current;
    const to = value;
    if (from === to) { setDisplay(to); return; }
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(from + (to - from) * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else prevRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return <>{formatter(display)}</>;
}

const fmt = (v) => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const hora = (d) => new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dataHora = (d) => new Date(d).toLocaleString('pt-BR');

function gerarParcelas(valorTotal, vencimentoInicial, qtd) {
  const grupoId = Date.now();
  const n = Math.max(1, qtd || 1);
  const base = Math.floor((valorTotal / n) * 100) / 100;
  const parcelas = [];
  let soma = 0;
  for (let i = 0; i < n; i++) {
    const valor = i === n - 1 ? Math.round((valorTotal - soma) * 100) / 100 : base;
    soma += valor;
    const venc = new Date(vencimentoInicial);
    venc.setMonth(venc.getMonth() + i);
    parcelas.push({ valor, vencimento: venc.getTime(), parcela: i + 1, totalParcelas: n, grupoId });
  }
  return parcelas;
}

// ---------- PIX (BR Code / EMV) ----------
function sanitizePix(s) {
  return (s || '')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\x20-\x7E]/g, '')
    .toUpperCase();
}

function normalizarChavePix(chave) {
  const c = (chave || '').trim();
  if (!c) return '';
  if (c.includes('@')) return c.toLowerCase(); // e-mail
  // CPF/CNPJ/telefone/chave aleatória: remove pontuação, mantém dígitos, letras e '+' inicial (telefone)
  const semFormatacao = c.replace(/[.\-/()\s]/g, '');
  return semFormatacao;
}

function detectarTipoChavePix(chaveOriginal) {
  const c = normalizarChavePix(chaveOriginal);
  if (!c) return null;
  if (c.includes('@')) return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(c) ? { tipo: 'E-mail', ok: true } : { tipo: 'E-mail', ok: false, aviso: 'formato de e-mail inválido' };
  if (/^\+55\d{10,11}$/.test(c)) return { tipo: 'Telefone', ok: true };
  if (/^\d{11}$/.test(c)) return { tipo: 'CPF ou celular', ok: true, aviso: 'se for celular, use +55 antes do número' };
  if (/^\d{14}$/.test(c)) return { tipo: 'CNPJ', ok: true };
  if (/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(c)) return { tipo: 'Chave aleatória', ok: true };
  return { tipo: 'Formato não reconhecido', ok: false, aviso: 'confira se a chave está correta' };
}

function campoPix(id, valor) {
  const len = String(valor.length).padStart(2, '0');
  return `${id}${len}${valor}`;
}

function crc16Pix(payload) {
  let crc = 0xffff;
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) !== 0 ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function gerarPayloadPix({ chave, nome, cidade, valor, txid }) {
  if (!chave) return null;
  const chaveSan = normalizarChavePix(chave);
  const nomeSan = sanitizePix(nome).slice(0, 25) || 'PDV';
  const cidadeSan = sanitizePix(cidade).slice(0, 15) || 'BRASIL';
  const txidSan = (sanitizePix(txid).replace(/[^A-Z0-9]/g, '').slice(0, 25)) || '***';
  const valorStr = Number(valor).toFixed(2);

  const merchantAccount = campoPix('00', 'BR.GOV.BCB.PIX') + campoPix('01', chaveSan);
  const semCrc =
    campoPix('00', '01') +
    campoPix('01', '11') +
    campoPix('26', merchantAccount) +
    campoPix('52', '0000') +
    campoPix('53', '986') +
    campoPix('54', valorStr) +
    campoPix('58', 'BR') +
    campoPix('59', nomeSan) +
    campoPix('60', cidadeSan) +
    campoPix('62', campoPix('05', txidSan)) +
    '6304';

  return semCrc + crc16Pix(semCrc);
}

const PRODUTOS_INICIAIS = [
  { id: 1, nome: 'Água Mineral 500ml', preco: 3.5, custo: 1.8, estoque: 48, estoqueMinimo: 15, categoria: 'Bebidas', codigoBarras: '7891000000013' },
  { id: 2, nome: 'Refrigerante Lata 350ml', preco: 5.0, custo: 2.6, estoque: 36, estoqueMinimo: 15, categoria: 'Bebidas', codigoBarras: '7891000000020' },
  { id: 3, nome: 'Café Torrado 500g', preco: 18.9, custo: 11.5, estoque: 20, estoqueMinimo: 10, categoria: 'Alimentos', codigoBarras: '7891000000037' },
  { id: 4, nome: 'Arroz Branco 1kg', preco: 7.2, custo: 4.3, estoque: 40, estoqueMinimo: 15, categoria: 'Alimentos', codigoBarras: '7891000000044' },
  { id: 5, nome: 'Feijão Carioca 1kg', preco: 8.5, custo: 5.2, estoque: 35, estoqueMinimo: 15, categoria: 'Alimentos', codigoBarras: '7891000000051' },
  { id: 6, nome: 'Sabonete 90g', preco: 2.8, custo: 1.3, estoque: 60, estoqueMinimo: 20, categoria: 'Higiene', codigoBarras: '7891000000068' },
  { id: 7, nome: 'Papel Higiênico 4un', preco: 9.9, custo: 6.0, estoque: 25, estoqueMinimo: 10, categoria: 'Higiene', codigoBarras: '7891000000075' },
  { id: 8, nome: 'Detergente 500ml', preco: 3.2, custo: 1.7, estoque: 30, estoqueMinimo: 15, categoria: 'Limpeza', codigoBarras: '7891000000082' },
  { id: 9, nome: 'Sabão em Pó 1kg', preco: 12.5, custo: 7.8, estoque: 18, estoqueMinimo: 10, categoria: 'Limpeza', codigoBarras: '7891000000099' },
  { id: 10, nome: 'Biscoito Recheado 130g', preco: 4.3, custo: 2.4, estoque: 50, estoqueMinimo: 15, categoria: 'Alimentos', codigoBarras: '7891000000105' },
].map((p) => ({ ...p, estoqueBase: p.estoque }));

const FORNECEDORES_INICIAIS = [
  { id: 1, nome: 'Distribuidora X', contato: 'Carlos Souza', telefone: '(11) 98888-1234', cnpj: '12.345.678/0001-90' },
  { id: 2, nome: 'Atacado Bebidas Sul', contato: 'Marina Alves', telefone: '(11) 97777-5678', cnpj: '98.765.432/0001-10' },
];

const USUARIOS_INICIAIS = [
  { login: 'admin', senha: 'admin123', pergunta: 'Qual o nome do seu primeiro animal de estimação?', resposta: 'rex', perfil: 'Administrador', ativo: true },
];

const CATEGORIAS_INICIAIS = [
  { id: 1, nome: 'Bebidas' },
  { id: 2, nome: 'Alimentos' },
  { id: 3, nome: 'Higiene' },
  { id: 4, nome: 'Limpeza' },
];

const AREAS_SISTEMA = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'pdv', label: 'PDV' },
  { key: 'clientes', label: 'Clientes' },
  { key: 'produtos', label: 'Produtos' },
  { key: 'compras', label: 'Compras' },
  { key: 'vendas', label: 'Vendas' },
  { key: 'financeiro', label: 'Financeiro' },
  { key: 'caixa', label: 'Caixa' },
  { key: 'relatorios', label: 'Relatórios' },
  { key: 'usuarios', label: 'Usuários' },
  { key: 'configuracoes', label: 'Configurações' },
];

const SCREEN_AREA = {
  dashboard: 'dashboard',
  pdv: 'pdv', pagamento: 'pdv', cupom: 'pdv',
  clientes: 'clientes',
  produtos: 'produtos', categorias: 'produtos', estoqueVisao: 'produtos', movimentacoes: 'produtos', inventario: 'produtos',
  novaCompra: 'compras', historicoCompras: 'compras', fornecedores: 'compras',
  vendas: 'vendas', trocas: 'vendas', devolucoes: 'vendas', credario: 'vendas',
  fluxoCaixa: 'financeiro', contasPagar: 'financeiro', contasReceber: 'financeiro', receitas: 'financeiro', despesas: 'financeiro',
  abrirCaixa: 'caixa', sangria: 'caixa', suprimento: 'caixa', fecharCaixa: 'caixa',
  relatorios: 'relatorios',
  usuarios: 'usuarios', perfis: 'usuarios', auditoria: 'usuarios',
  configuracoes: 'configuracoes',
};

const PERFIS_INICIAIS = [
  { nome: 'Administrador', descricao: 'Acesso total a todas as áreas do sistema.', areasPermitidas: AREAS_SISTEMA.map((a) => a.key) },
  { nome: 'Operador', descricao: 'Acesso ao dia a dia do caixa: PDV, vendas, clientes e caixa — sem estoque, compras, financeiro ou configurações.', areasPermitidas: ['dashboard', 'pdv', 'clientes', 'vendas', 'caixa'] },
];

const APP_VERSAO = '0.3.2';
const APP_BUILD = '23/10/2026';
const ADMIN_PERFIL = 'Administrador';
const usuarioEhAdmin = (u) => !!u && u.perfil === ADMIN_PERFIL;
// Administrador sempre tem acesso total (não pode ser restringido nem se trancar para fora).
// Demais: permissões individuais do usuário (se definidas) ou as do perfil.
function areasEfetivas(u, perfis) {
  if (!u) return [];
  if (usuarioEhAdmin(u)) return AREAS_SISTEMA.map((a) => a.key);
  const perfil = perfis.find((p) => p.nome === (u.perfil || 'Operador'));
  return u.areasPermitidas ?? (perfil ? perfil.areasPermitidas : []);
}
const adminsAtivos = (lista, exceto) => lista.filter((u) => usuarioEhAdmin(u) && u.ativo !== false && u.login !== exceto).length;

const FLOW = [
  { key: 'abrirCaixa', label: 'Abrir Caixa' },
  { key: 'pdv', label: 'PDV' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'cupom', label: 'Cupom' },
];

const CONFIG_PADRAO = {
  nomeLoja: 'Minha Loja',
  cnpj: '',
  endereco: '',
  mensagemRodape: 'Obrigado pela preferência, volte sempre!',
  larguraCupom: '58mm',
  chavePix: '',
  nomeRecebedorPix: 'Minha Loja',
  cidadeRecebedorPix: 'SAO PAULO',
  formasAceitas: { Dinheiro: true, 'Cartão Débito': true, 'Cartão Crédito': true, Pix: true, Credário: true },
};

// ---------- PERSISTÊNCIA (localStorage + nuvem opcional via Supabase) ----------
const STORE_KEY = 'pdv:estado:v1';
const SESSAO_KEY = 'pdv:sessao:v1';
const DEVICE_KEY = 'pdv:device:v1';
const CLOUD_URL = import.meta.env.VITE_SUPABASE_URL;
const CLOUD_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const CLOUD_ID = import.meta.env.VITE_PDV_STORE_ID || 'loja-principal';
const CLOUD_ATIVA = !!(CLOUD_URL && CLOUD_KEY);

function lerEstadoLocal() {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
const SALVO = normalizarEstadoSalvo(lerEstadoLocal());
const SESSAO0 = (() => { try { return localStorage.getItem(SESSAO_KEY); } catch { return null; } })();

function obterDeviceId() {
  try {
    let id = localStorage.getItem(DEVICE_KEY);
    if (!id) {
      id = `dev-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_KEY, id);
    }
    return id;
  } catch {
    return `dev-${Math.random().toString(36).slice(2, 10)}`;
  }
}

// ---------- IDs únicos e sincronização por registro ----------
let _ultimoId = 0;
function novoId() {
  // ms * 1000 + sufixo aleatório: único neste dispositivo (sempre crescente) e, na prática, entre dispositivos
  let id = Date.now() * 1000 + Math.floor(Math.random() * 1000);
  if (id <= _ultimoId) id = _ultimoId + 1;
  _ultimoId = id;
  return id;
}
function proximoNumero(lista) {
  return lista.reduce((m, x) => Math.max(m, Number(x.numero) || 0), 0) + 1;
}

// Cada item das listas abaixo vira uma linha própria na nuvem (chave = campo indicado)
const COLECOES = [
  { nome: 'produtos', chave: 'id' }, { nome: 'categorias', chave: 'id' }, { nome: 'clientes', chave: 'id' },
  { nome: 'fornecedores', chave: 'id' }, { nome: 'compras', chave: 'id' }, { nome: 'vendas', chave: 'id' },
  { nome: 'trocas', chave: 'id' }, { nome: 'devolucoes', chave: 'id' }, { nome: 'financeiro', chave: 'id' },
  { nome: 'sangrias', chave: 'id' }, { nome: 'suprimentos', chave: 'id' }, { nome: 'contasPagar', chave: 'id' },
  { nome: 'contasReceber', chave: 'id' }, { nome: 'movimentos', chave: 'id' }, { nome: 'auditoria', chave: 'id' },
  { nome: 'usuarios', chave: 'login' }, { nome: 'perfis', chave: 'nome' },
];
const CHAVE_COLECAO = Object.fromEntries(COLECOES.map((c) => [c.nome, c.chave]));
const SINGLETONS = ['caixa', 'config', 'ultimoFechamento'];
const COLECOES_COM_HORA = ['vendas', 'financeiro', 'movimentos', 'auditoria', 'sangrias', 'suprimentos', 'compras', 'trocas', 'devolucoes'];

// Estoque e saldo devedor são DERIVADOS (estoque-base + movimentações; soma das contas a receber em aberto).
// Por isso não vão para a nuvem: assim dois caixas vendendo ao mesmo tempo nunca sobrescrevem um ao outro.
function paraNuvem(colecao, item) {
  if (colecao === 'produtos') { const { estoque, ...resto } = item; return resto; }
  if (colecao === 'clientes') { const { saldoDevedor, ...resto } = item; return resto; }
  return item;
}

function estavel(v) {
  if (v === null || typeof v !== 'object') return JSON.stringify(v) ?? 'null';
  if (Array.isArray(v)) return `[${v.map((x) => (x === undefined ? 'null' : estavel(x))).join(',')}]`;
  return `{${Object.keys(v).filter((k) => v[k] !== undefined).sort().map((k) => `${JSON.stringify(k)}:${estavel(v[k])}`).join(',')}}`;
}
function cyrb53(str) {
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}
const _cacheHash = new WeakMap();
function hashDe(item, colecao) {
  if (item && typeof item === 'object' && _cacheHash.has(item)) return _cacheHash.get(item);
  const h = cyrb53(estavel(paraNuvem(colecao, item)));
  if (item && typeof item === 'object') _cacheHash.set(item, h);
  return h;
}

function linhasDoEstado(est) {
  const m = new Map();
  COLECOES.forEach(({ nome, chave }) => {
    (est[nome] || []).forEach((item) => {
      const id = String(item[chave]);
      const pendente = nome === 'usuarios' && (item.senha !== undefined || item.resposta !== undefined); // ainda sem hash: não envia
      m.set(`${nome}/${id}`, { colecao: nome, id, item, hash: pendente ? `PEND:${id}` : hashDe(item, nome), pendente });
    });
  });
  SINGLETONS.forEach((nome) => {
    const v = est[nome];
    if (v !== null && v !== undefined) m.set(`singleton/${nome}`, { colecao: 'singleton', id: nome, item: v, hash: hashDe(v, 'singleton'), pendente: false });
  });
  return m;
}

const BASELINE_KEY = 'pdv:baseline:v2';
function lerBaseline() {
  try { return JSON.parse(localStorage.getItem(BASELINE_KEY) || '{}'); } catch { return {}; }
}
function salvarBaseline(b) {
  try { localStorage.setItem(BASELINE_KEY, JSON.stringify(b)); } catch { /* ignora */ }
}

// Dados antigos: define o estoque-base (estoque atual - movimentações) e ids únicos
function normalizarEstadoSalvo(e) {
  if (!e || typeof e !== 'object') return {};
  const mov = Array.isArray(e.movimentos) ? e.movimentos : [];
  const soma = {};
  mov.forEach((m) => { soma[m.produtoId] = (soma[m.produtoId] || 0) + (m.quantidade || 0); });
  if (Array.isArray(e.produtos)) {
    e.produtos = e.produtos.map((p) => (p.estoqueBase === undefined ? { ...p, estoqueBase: (p.estoque || 0) - (soma[p.id] || 0) } : p));
  }
  ['vendas', 'compras', 'trocas', 'devolucoes'].forEach((c) => {
    if (Array.isArray(e[c])) e[c] = e[c].map((x) => (x.id === undefined ? { ...x, id: `legado-${c}-${x.numero}` } : x));
  });
  return e;
}

function fundirRemoto(colecao, atual, data) {
  if (colecao === 'produtos') return { estoque: atual ? atual.estoque : (data.estoqueBase ?? 0), ...data };
  if (colecao === 'clientes') return { saldoDevedor: atual ? atual.saldoDevedor : 0, ...data };
  return data;
}

// ---------- SENHAS (PBKDF2 via Web Crypto) ----------
function bufParaHex(buf) {
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function novoSalt() {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return bufParaHex(a);
}
async function derivarHash(texto, salt) {
  const enc = new TextEncoder();
  const chave = await crypto.subtle.importKey('raw', enc.encode(texto), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: enc.encode(salt), iterations: 100000 }, chave, 256);
  return bufParaHex(bits);
}
const normResposta = (r) => `resp:${(r || '').trim().toLowerCase()}`;

export default function App() {
  const [relogio, setRelogio] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setRelogio(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  const [toast, setToast] = useState(null);
  function showToast(msg, tipo = 'ok') {
    setToast({ msg, tipo, id: Date.now() });
  }
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const [screen, setScreen] = useState(SESSAO0 ? 'dashboard' : 'login');
  const [usuario, setUsuario] = useState({ login: '', senha: '' });
  const [operador, setOperador] = useState(SESSAO0 || null);
  const [erro, setErro] = useState('');
  const [msgSucesso, setMsgSucesso] = useState('');

  const [usuarios, setUsuarios] = useState(SALVO.usuarios ?? USUARIOS_INICIAIS);
  const [perfis, setPerfis] = useState(SALVO.perfis ?? PERFIS_INICIAIS);
  const [authScreen, setAuthScreen] = useState('login'); // login | cadastro | esqueci
  const [cadastro, setCadastro] = useState({ login: '', senha: '', confirmar: '', pergunta: '', resposta: '' });
  const [esqueci, setEsqueci] = useState({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' });

  const [produtos, setProdutos] = useState(SALVO.produtos ?? PRODUTOS_INICIAIS);
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);

  const [caixa, setCaixa] = useState(SALVO.caixa ?? { aberto: false, valorAbertura: 0, dataAbertura: null, operador: null });
  const [valorAberturaInput, setValorAberturaInput] = useState('');

  const [pagamento, setPagamento] = useState({ forma: null, valorRecebido: '', desconto: '', clienteId: '' });
  const [vendas, setVendas] = useState(SALVO.vendas ?? []);
  const [ultimaVenda, setUltimaVenda] = useState(null);
  const [financeiro, setFinanceiro] = useState(SALVO.financeiro ?? []);
  const [sangrias, setSangrias] = useState(SALVO.sangrias ?? []);
  const [suprimentos, setSuprimentos] = useState(SALVO.suprimentos ?? []);
  const [fornecedores, setFornecedores] = useState(SALVO.fornecedores ?? FORNECEDORES_INICIAIS);
  const [compras, setCompras] = useState(SALVO.compras ?? []);
  const [movimentos, setMovimentos] = useState(SALVO.movimentos ?? []);
  const [categorias, setCategorias] = useState(SALVO.categorias ?? CATEGORIAS_INICIAIS);
  const [clientes, setClientes] = useState(SALVO.clientes ?? []);
  const [trocas, setTrocas] = useState(SALVO.trocas ?? []);
  const [devolucoes, setDevolucoes] = useState(SALVO.devolucoes ?? []);
  const [contasPagar, setContasPagar] = useState(SALVO.contasPagar ?? []);
  const [contasReceber, setContasReceber] = useState(SALVO.contasReceber ?? []);
  const [auditoria, setAuditoria] = useState(SALVO.auditoria ?? []);

  const [grupoProdutosAberto, setGrupoProdutosAberto] = useState(true);
  const [grupoComprasAberto, setGrupoComprasAberto] = useState(false);
  const [grupoVendasAberto, setGrupoVendasAberto] = useState(false);
  const [grupoFinanceiroAberto, setGrupoFinanceiroAberto] = useState(false);
  const [grupoCaixaAberto, setGrupoCaixaAberto] = useState(false);
  const [grupoRelatoriosAberto, setGrupoRelatoriosAberto] = useState(false);
  const [grupoUsuariosAberto, setGrupoUsuariosAberto] = useState(false);
  const [grupoConfigAberto, setGrupoConfigAberto] = useState(false);

  const [contagemFechamento, setContagemFechamento] = useState('');
  const [ultimoFechamento, setUltimoFechamento] = useState(SALVO.ultimoFechamento ?? null);
  const [suprimentoInput, setSuprimentoInput] = useState({ valor: '', motivo: '' });
  const [relatoriosAba, setRelatoriosAba] = useState('Vendas');
  const [configAba, setConfigAba] = useState('Empresa');

  const [sangriaInput, setSangriaInput] = useState({ valor: '', motivo: '' });
  const [config, setConfig] = useState({
    ...CONFIG_PADRAO,
    ...(SALVO.config || {}),
  });

  const totalCarrinho = useMemo(
    () => carrinho.reduce((s, i) => s + i.preco * i.qtd, 0),
    [carrinho]
  );

  const descontoAplicado = useMemo(() => {
    const d = parseFloat(String(pagamento.desconto).replace(',', '.'));
    if (isNaN(d) || d <= 0) return 0;
    return Math.min(d, totalCarrinho);
  }, [pagamento.desconto, totalCarrinho]);

  const totalComDesconto = totalCarrinho - descontoAplicado;

  const vendasDoTurno = useMemo(() => {
    if (!caixa.dataAbertura) return [];
    return vendas.filter((v) => v.hora >= caixa.dataAbertura && !v.cancelada);
  }, [vendas, caixa.dataAbertura]);

  const totaisPorForma = useMemo(() => {
    const t = { Dinheiro: 0, 'Cartão Débito': 0, 'Cartão Crédito': 0, Pix: 0 };
    vendasDoTurno.forEach((v) => { t[v.forma] = (t[v.forma] || 0) + v.total; });
    return t;
  }, [vendasDoTurno]);

  const sangriasDoTurno = useMemo(() => {
    if (!caixa.dataAbertura) return [];
    return sangrias.filter((s) => s.hora >= caixa.dataAbertura);
  }, [sangrias, caixa.dataAbertura]);

  const totalSangrias = useMemo(() => sangriasDoTurno.reduce((s, x) => s + x.valor, 0), [sangriasDoTurno]);

  const valorEsperadoCaixa = caixa.valorAbertura + (totaisPorForma.Dinheiro || 0) - totalSangrias;

  const [categoriaAtiva, setCategoriaAtiva] = useState('Todos');
  const categoriasPdv = useMemo(() => ['Todos', ...Array.from(new Set([...categorias.map((c) => c.nome), ...produtos.map((p) => p.categoria)].filter(Boolean)))], [categorias, produtos]);

  const produtosFiltrados = useMemo(() => {
    let lista = produtos;
    if (categoriaAtiva !== 'Todos') lista = lista.filter((p) => p.categoria === categoriaAtiva);
    if (!busca.trim()) return lista;
    const b = busca.toLowerCase();
    return lista.filter((p) => p.nome.toLowerCase().includes(b) || p.categoria.toLowerCase().includes(b) || (p.codigoBarras || '').includes(b));
  }, [produtos, busca, categoriaAtiva]);

  function handleBuscaSubmit(e) {
    e.preventDefault();
    const termo = busca.trim();
    if (!termo) return;
    const porCodigo = produtos.find((p) => p.codigoBarras === termo);
    if (porCodigo) {
      addProduto(porCodigo);
      setBusca('');
      return;
    }
    if (produtosFiltrados.length === 1) {
      addProduto(produtosFiltrados[0]);
      setBusca('');
    }
  }

  async function handleLogin(e) {
    e.preventDefault();
    const login = usuario.login.trim();
    if (!login || !usuario.senha.trim()) {
      setErro('Informe usuário e senha.');
      return;
    }
    const user = usuarios.find((u) => u.login.toLowerCase() === login.toLowerCase());
    let senhaOk = false;
    if (user) {
      try {
        senhaOk = user.senhaHash
          ? (await derivarHash(usuario.senha, user.salt)) === user.senhaHash
          : user.senha === usuario.senha; // legado (migrado automaticamente em seguida)
      } catch {
        setErro('Este navegador não suporta a verificação segura de senha. Use HTTPS ou um navegador atualizado.');
        return;
      }
    }
    if (!user || !senhaOk) {
      setErro('Usuário ou senha inválidos.');
      return;
    }
    if (user.ativo === false) {
      setErro('Este usuário está inativo. Contate um administrador.');
      return;
    }
    try { localStorage.setItem(SESSAO_KEY, user.login); } catch { /* ignora */ }
    setOperador(user.login);
    setErro('');
    setMsgSucesso('');
    registrarAuditoria({ acao: 'Login', detalhe: 'Acesso ao sistema', operadorOverride: user.login });
    setScreen('dashboard');
  }

  function handleLogout() {
    try { localStorage.removeItem(SESSAO_KEY); } catch { /* ignora */ }
    setOperador(null);
    setUsuario({ login: '', senha: '' });
    setAuthScreen('login');
    setErro('');
    setScreen('login');
  }

  function souAdmin() {
    return usuarioEhAdmin(usuarios.find((u) => u.login === operador));
  }

  function alterarPermissaoUsuario(login, area, permitido) {
    if (!souAdmin()) { showToast('Somente administradores alteram permissões', 'alerta'); return; }
    const alvo = usuarios.find((u) => u.login === login);
    if (!alvo) return;
    if (usuarioEhAdmin(alvo)) { showToast('Administradores têm acesso total e permanente', 'alerta'); return; }
    const base = areasEfetivas(alvo, perfis);
    const novas = permitido ? [...new Set([...base, area])] : base.filter((a) => a !== area);
    setUsuarios((prev) => prev.map((u) => (u.login === login ? { ...u, areasPermitidas: novas } : u)));
    registrarAuditoria({ acao: 'Permissão de Usuário', detalhe: `${login}: ${area} ${permitido ? 'liberado' : 'bloqueado'}` });
    showToast('Permissões atualizadas');
  }

  function resetarPermissoesUsuario(login) {
    if (!souAdmin()) { showToast('Somente administradores alteram permissões', 'alerta'); return; }
    setUsuarios((prev) => prev.map((u) => (u.login === login ? { ...u, areasPermitidas: undefined } : u)));
    registrarAuditoria({ acao: 'Permissão de Usuário', detalhe: `${login}: voltou a seguir o perfil` });
    showToast('Usuário voltou a seguir as permissões do perfil');
  }

  function alterarPermissaoPerfil(nomePerfil, area, permitido) {
    if (!souAdmin()) { showToast('Somente administradores alteram permissões', 'alerta'); return; }
    if (nomePerfil === ADMIN_PERFIL) { showToast('O perfil Administrador tem acesso total e não pode ser alterado', 'alerta'); return; }
    setPerfis((prev) => prev.map((p) => {
      if (p.nome !== nomePerfil) return p;
      const areas = permitido ? [...new Set([...p.areasPermitidas, area])] : p.areasPermitidas.filter((a) => a !== area);
      return { ...p, areasPermitidas: areas };
    }));
    showToast('Permissões atualizadas');
    registrarAuditoria({ acao: 'Alteração de Permissão', detalhe: `${nomePerfil}: ${area} ${permitido ? 'liberado' : 'bloqueado'}` });
  }

  async function handleCadastro(e) {
    e.preventDefault();
    const { login, senha, confirmar, pergunta, resposta } = cadastro;
    if (!login.trim() || !senha.trim() || !pergunta.trim() || !resposta.trim()) {
      setErro('Preencha todos os campos.');
      return;
    }
    if (senha.length < 4) {
      setErro('A senha deve ter ao menos 4 caracteres.');
      return;
    }
    if (senha !== confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (usuarios.some((u) => u.login.toLowerCase() === login.trim().toLowerCase())) {
      setErro('Já existe um usuário com esse login.');
      return;
    }
    let salt, senhaHash, respostaHash;
    try {
      salt = novoSalt();
      senhaHash = await derivarHash(senha, salt);
      respostaHash = await derivarHash(normResposta(resposta), salt);
    } catch {
      setErro('Este navegador não suporta o cadastro seguro de senha. Use HTTPS ou um navegador atualizado.');
      return;
    }
    setUsuarios((prev) => [...prev, { login: login.trim(), salt, senhaHash, pergunta: pergunta.trim(), respostaHash, perfil: 'Operador', ativo: true }]);
    setCadastro({ login: '', senha: '', confirmar: '', pergunta: '', resposta: '' });
    setErro('');
    setMsgSucesso('Cadastro realizado com sucesso. Faça login.');
    setAuthScreen('login');
  }

  function handleEsqueciBuscar(e) {
    e.preventDefault();
    const user = usuarios.find((u) => u.login.toLowerCase() === esqueci.login.trim().toLowerCase());
    if (!user) {
      setErro('Usuário não encontrado.');
      return;
    }
    setErro('');
    setEsqueci((prev) => ({ ...prev, etapa: 2, perguntaEncontrada: user.pergunta }));
  }

  async function handleEsqueciConfirmar(e) {
    e.preventDefault();
    const user = usuarios.find((u) => u.login.toLowerCase() === esqueci.login.trim().toLowerCase());
    if (!user) {
      setErro('Usuário não encontrado.');
      setEsqueci({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' });
      return;
    }
    let respostaOk = false;
    try {
      respostaOk = user.respostaHash
        ? (await derivarHash(normResposta(esqueci.resposta), user.salt)) === user.respostaHash
        : (user.resposta || '').trim().toLowerCase() === esqueci.resposta.trim().toLowerCase();
    } catch {
      setErro('Este navegador não suporta a verificação segura. Use HTTPS ou um navegador atualizado.');
      return;
    }
    if (!respostaOk) {
      setErro('Resposta de segurança incorreta.');
      return;
    }
    if (esqueci.novaSenha.length < 4) {
      setErro('A nova senha deve ter ao menos 4 caracteres.');
      return;
    }
    if (esqueci.novaSenha !== esqueci.confirmar) {
      setErro('As senhas não coincidem.');
      return;
    }
    const saltNovo = user.salt || novoSalt();
    const novoHash = await derivarHash(esqueci.novaSenha, saltNovo);
    setUsuarios((prev) => prev.map((u) => (u.login.toLowerCase() === user.login.toLowerCase() ? { ...u, salt: saltNovo, senhaHash: novoHash, senha: undefined } : u)));
    setEsqueci({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' });
    setErro('');
    setMsgSucesso('Senha redefinida com sucesso. Faça login com a nova senha.');
    setAuthScreen('login');
  }

  function handleAbrirCaixa(e) {
    e.preventDefault();
    const valor = parseFloat(valorAberturaInput.replace(',', '.'));
    if (isNaN(valor) || valor < 0) {
      setErro('Informe um valor de abertura válido.');
      return;
    }
    setCaixa({ aberto: true, valorAbertura: valor, dataAbertura: Date.now(), operador });
    setFinanceiro((prev) => [...prev, { id: novoId(), tipo: 'Abertura de Caixa', valor, hora: Date.now() }]);
    setValorAberturaInput('');
    setErro('');
    showToast('Caixa aberto com sucesso');
    registrarAuditoria({ acao: 'Abertura de Caixa', detalhe: `Valor inicial: ${fmt(valor)}` });
    setScreen('pdv');
  }

  function addProduto(p) {
    if (p.estoque <= 0) return;
    setCarrinho((prev) => {
      const existe = prev.find((i) => i.id === p.id);
      if (existe) {
        if (existe.qtd >= p.estoque) return prev;
        return prev.map((i) => (i.id === p.id ? { ...i, qtd: i.qtd + 1 } : i));
      }
      return [...prev, { id: p.id, nome: p.nome, preco: p.preco, codigoBarras: p.codigoBarras || '', qtd: 1 }];
    });
    showToast(`${p.nome} adicionado`);
  }

  function alterarQtd(id, delta) {
    setCarrinho((prev) => {
      const produto = produtos.find((p) => p.id === id);
      return prev
        .map((i) => {
          if (i.id !== id) return i;
          const novaQtd = i.qtd + delta;
          if (produto && novaQtd > produto.estoque) return i;
          return { ...i, qtd: novaQtd };
        })
        .filter((i) => i.qtd > 0);
    });
  }

  function removerItem(id) {
    setCarrinho((prev) => prev.filter((i) => i.id !== id));
  }

  function irParaPagamento() {
    if (carrinho.length === 0) return;
    setPagamento({ forma: null, valorRecebido: '', desconto: '', clienteId: '' });
    setErro('');
    setScreen('pagamento');
  }

  function registrarMovimento({ tipo, produtoId, produtoNome, quantidade, motivo }) {
    setMovimentos((prev) => [...prev, { id: novoId(), tipo, produtoId, produtoNome, quantidade, motivo, hora: Date.now(), operador }]);
  }

  function registrarAuditoria({ acao, detalhe, operadorOverride }) {
    setAuditoria((prev) => [...prev, { id: novoId(), acao, detalhe, operador: operadorOverride || operador, hora: Date.now() }]);
  }

  function confirmarPagamento() {
    if (!pagamento.forma) {
      setErro('Selecione a forma de pagamento.');
      return;
    }
    let troco = 0;
    if (pagamento.forma === 'Dinheiro') {
      const recebido = parseFloat(String(pagamento.valorRecebido).replace(',', '.'));
      if (isNaN(recebido) || recebido < totalComDesconto) {
        setErro('Valor recebido insuficiente.');
        return;
      }
      troco = recebido - totalComDesconto;
    }
    if (pagamento.forma === 'Credário' && !pagamento.clienteId) {
      setErro('Selecione o cliente para venda no credário.');
      return;
    }

    const numero = proximoNumero(vendas);
    const cliente = pagamento.forma === 'Credário' ? clientes.find((c) => c.id === Number(pagamento.clienteId)) : null;
    const venda = {
      id: novoId(),
      numero,
      itens: carrinho,
      subtotal: totalCarrinho,
      desconto: descontoAplicado,
      total: totalComDesconto,
      forma: pagamento.forma,
      troco,
      hora: Date.now(),
      operador,
      clienteId: cliente ? cliente.id : null,
      clienteNome: cliente ? cliente.nome : null,
    };

    // Baixar estoque
    setProdutos((prev) =>
      prev.map((p) => {
        const item = carrinho.find((i) => i.id === p.id);
        return item ? { ...p, estoque: p.estoque - item.qtd } : p;
      })
    );
    carrinho.forEach((i) => registrarMovimento({ tipo: 'Venda', produtoId: i.id, produtoNome: i.nome, quantidade: -i.qtd, motivo: `Venda #${String(numero).padStart(4, '0')}` }));

    if (pagamento.forma === 'Credário' && cliente) {
      setClientes((prev) => prev.map((c) => (c.id === cliente.id ? { ...c, saldoDevedor: (c.saldoDevedor || 0) + totalComDesconto } : c)));
      setContasReceber((prev) => [
        ...prev,
        { id: novoId(), descricao: `Credário — Venda #${numero}`, clienteId: cliente.id, clienteNome: cliente.nome, valor: totalComDesconto, vencimento: Date.now() + 30 * 86400000, recebido: false, dataRecebimento: null, origemVenda: numero },
      ]);
    } else {
      // Registrar financeiro (vendas à vista)
      setFinanceiro((prev) => [
        ...prev,
        { id: novoId(), tipo: `Venda #${numero} (${pagamento.forma})`, valor: totalComDesconto, hora: venda.hora },
      ]);
    }

    setVendas((prev) => [...prev, venda]);
    setUltimaVenda(venda);
    setCarrinho([]);
    setErro('');
    setScreen('cupom');
  }

  function novaVenda() {
    setCarrinho([]);
    setScreen('pdv');
  }

  function adicionarProdutoCadastro(novo) {
    const id = novoId();
    setProdutos((prev) => [...prev, { id, estoqueBase: novo.estoque, ...novo }]);
    showToast('Produto cadastrado');
  }

  function editarProduto(id, dados) {
    const atual = produtos.find((p) => p.id === id);
    if (atual && typeof dados.estoque === 'number' && dados.estoque !== atual.estoque) {
      // o estoque é a soma do estoque-base com as movimentações; edição manual vira um ajuste registrado
      registrarMovimento({ tipo: 'Ajuste', produtoId: id, produtoNome: dados.nome || atual.nome, quantidade: dados.estoque - atual.estoque, motivo: 'Edição manual do cadastro' });
    }
    setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)));
    showToast('Produto atualizado');
  }

  function excluirProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    showToast('Produto removido', 'alerta');
    registrarAuditoria({ acao: 'Exclusão de Produto', detalhe: `Produto #${id} removido` });
  }

  function cancelarVenda(vendaId) {
    const venda = vendas.find((v) => v.id === vendaId);
    if (!venda || venda.cancelada) return;
    const numero = venda.numero;
    setProdutos((prev) =>
      prev.map((p) => {
        const item = venda.itens.find((i) => i.id === p.id);
        return item ? { ...p, estoque: p.estoque + item.qtd } : p;
      })
    );
    setFinanceiro((prev) => [
      ...prev,
      { id: novoId(), tipo: `Estorno Venda #${venda.numero}`, valor: -venda.total, hora: Date.now() },
    ]);
    venda.itens.forEach((i) => registrarMovimento({ tipo: 'Estorno', produtoId: i.id, produtoNome: i.nome, quantidade: i.qtd, motivo: `Cancelamento Venda #${String(numero).padStart(4, '0')}` }));
    setVendas((prev) => prev.map((v) => (v.id === vendaId ? { ...v, cancelada: true } : v)));
    showToast(`Venda #${String(numero).padStart(4, '0')} cancelada`, 'alerta');
    registrarAuditoria({ acao: 'Cancelamento de Venda', detalhe: `Venda #${String(numero).padStart(4, '0')}` });
  }

  function registrarSangria(e) {
    e.preventDefault();
    if (!caixa.aberto) { setErro('Abra o caixa antes de registrar uma sangria.'); return; }
    const valor = parseFloat(String(sangriaInput.valor).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) { setErro('Informe um valor de sangria válido.'); return; }
    if (valor > valorEsperadoCaixa) { setErro('Valor de sangria maior que o saldo disponível em caixa.'); return; }
    const registro = { id: novoId(), valor, motivo: sangriaInput.motivo.trim() || 'Não informado', hora: Date.now(), operador };
    setSangrias((prev) => [...prev, registro]);
    setFinanceiro((prev) => [
      ...prev,
      { id: novoId(), tipo: `Sangria: ${registro.motivo}`, valor: -valor, hora: registro.hora },
    ]);
    setSangriaInput({ valor: '', motivo: '' });
    setErro('');
    showToast('Sangria registrada');
  }

  function confirmarCompra({ fornecedorId, itens, frete, desconto }) {
    const fornecedor = fornecedores.find((f) => f.id === fornecedorId);
    const subtotal = itens.reduce((s, i) => s + i.qtd * i.custo, 0);
    const total = Math.max(subtotal + (frete || 0) - (desconto || 0), 0);
    const numero = proximoNumero(compras);
    const itensCompra = itens.map((i) => {
      const p = produtos.find((pp) => pp.id === i.produtoId);
      return { ...i, nome: p ? p.nome : '?' };
    });
    const compra = {
      id: novoId(), numero, fornecedorId, fornecedorNome: fornecedor ? fornecedor.nome : 'Não informado',
      itens: itensCompra, subtotal, frete: frete || 0, desconto: desconto || 0, total, hora: Date.now(), operador,
    };

    setProdutos((prev) =>
      prev.map((p) => {
        const item = itens.find((i) => i.produtoId === p.id);
        return item ? { ...p, estoque: p.estoque + item.qtd, custo: item.custo } : p;
      })
    );
    itensCompra.forEach((i) => registrarMovimento({ tipo: 'Compra', produtoId: i.produtoId, produtoNome: i.nome, quantidade: i.qtd, motivo: `Compra #${String(numero).padStart(4, '0')} · ${compra.fornecedorNome}` }));
    setFinanceiro((prev) => [
      ...prev,
      { id: novoId(), tipo: `Compra #${numero} (${compra.fornecedorNome})`, valor: -total, hora: compra.hora },
    ]);
    setCompras((prev) => [...prev, compra]);
    showToast('Compra registrada — estoque e custo atualizados');
    setScreen('historicoCompras');
  }

  function adicionarFornecedor(f) {
    const id = novoId();
    setFornecedores((prev) => [...prev, { id, ...f }]);
    showToast('Fornecedor cadastrado');
  }

  function editarFornecedor(id, dados) {
    setFornecedores((prev) => prev.map((f) => (f.id === id ? { ...f, ...dados } : f)));
    showToast('Fornecedor atualizado');
  }

  function excluirFornecedor(id) {
    setFornecedores((prev) => prev.filter((f) => f.id !== id));
    showToast('Fornecedor removido', 'alerta');
    registrarAuditoria({ acao: 'Exclusão de Fornecedor', detalhe: `Fornecedor #${id} removido` });
  }

  function ajustarEstoque({ produtoId, quantidade, motivo }) {
    const produto = produtos.find((p) => p.id === produtoId);
    if (!produto || !quantidade) return;
    const efetiva = Math.max(quantidade, -produto.estoque); // não deixa o estoque ficar negativo
    if (!efetiva) return;
    setProdutos((prev) => prev.map((p) => (p.id === produtoId ? { ...p, estoque: p.estoque + efetiva } : p)));
    registrarMovimento({ tipo: 'Ajuste', produtoId, produtoNome: produto.nome, quantidade: efetiva, motivo: motivo || 'Ajuste manual' });
    showToast('Estoque ajustado');
  }

  function aplicarInventario(contagens) {
    let houveAjuste = false;
    Object.entries(contagens).forEach(([pid, qtdContada]) => {
      const produto = produtos.find((p) => p.id === Number(pid));
      if (!produto) return;
      const diff = qtdContada - produto.estoque;
      if (diff === 0) return;
      houveAjuste = true;
      registrarMovimento({ tipo: 'Inventário', produtoId: Number(pid), produtoNome: produto.nome, quantidade: diff, motivo: 'Contagem física (inventário)' });
    });
    setProdutos((prev) => prev.map((p) => (contagens[p.id] !== undefined ? { ...p, estoque: contagens[p.id] } : p)));
    showToast(houveAjuste ? 'Inventário aplicado — estoque atualizado' : 'Nenhuma divergência encontrada');
  }

  // ---------- Categorias ----------
  function adicionarCategoria(nome) {
    if (!nome.trim()) return;
    if (categorias.some((c) => c.nome.toLowerCase() === nome.trim().toLowerCase())) { showToast('Categoria já existe', 'alerta'); return; }
    const id = novoId();
    setCategorias((prev) => [...prev, { id, nome: nome.trim() }]);
    showToast('Categoria cadastrada');
  }
  function editarCategoria(id, nome) {
    const atual = categorias.find((c) => c.id === id);
    if (!atual || !nome.trim()) return;
    setProdutos((prev) => prev.map((p) => (p.categoria === atual.nome ? { ...p, categoria: nome.trim() } : p)));
    setCategorias((prev) => prev.map((c) => (c.id === id ? { ...c, nome: nome.trim() } : c)));
    showToast('Categoria atualizada');
  }
  function excluirCategoria(id) {
    setCategorias((prev) => prev.filter((c) => c.id !== id));
    showToast('Categoria removida', 'alerta');
  }

  // ---------- Clientes ----------
  function adicionarCliente(c) {
    const id = novoId();
    setClientes((prev) => [...prev, { id, saldoDevedor: 0, ...c }]);
    showToast('Cliente cadastrado');
  }
  function editarCliente(id, dados) {
    setClientes((prev) => prev.map((c) => (c.id === id ? { ...c, ...dados } : c)));
    showToast('Cliente atualizado');
  }
  function excluirCliente(id) {
    setClientes((prev) => prev.filter((c) => c.id !== id));
    showToast('Cliente removido', 'alerta');
  }

  // ---------- Trocas ----------
  function confirmarTroca({ produtoSaidaId, qtdSaida, produtoEntradaId, qtdEntrada, motivo }) {
    const pSai = produtos.find((p) => p.id === produtoSaidaId);
    const pEnt = produtos.find((p) => p.id === produtoEntradaId);
    if (!pSai || !pEnt) return;
    const diferenca = pEnt.preco * qtdEntrada - pSai.preco * qtdSaida;
    const numero = proximoNumero(trocas);
    setProdutos((prev) => prev.map((p) => {
      if (p.id === produtoSaidaId) return { ...p, estoque: p.estoque + qtdSaida };
      if (p.id === produtoEntradaId) return { ...p, estoque: Math.max(0, p.estoque - qtdEntrada) };
      return p;
    }));
    registrarMovimento({ tipo: 'Estorno', produtoId: pSai.id, produtoNome: pSai.nome, quantidade: qtdSaida, motivo: `Troca #${numero} — devolução` });
    registrarMovimento({ tipo: 'Venda', produtoId: pEnt.id, produtoNome: pEnt.nome, quantidade: -qtdEntrada, motivo: `Troca #${numero} — novo item` });
    if (diferenca !== 0) {
      setFinanceiro((prev) => [...prev, { id: novoId(), tipo: `Troca #${numero} (diferença)`, valor: diferenca, hora: Date.now() }]);
    }
    setTrocas((prev) => [...prev, { id: novoId(), numero, produtoSaida: pSai.nome, qtdSaida, produtoEntrada: pEnt.nome, qtdEntrada, diferenca, motivo: motivo || '—', hora: Date.now(), operador }]);
    showToast('Troca registrada');
  }

  // ---------- Devoluções ----------
  function confirmarDevolucao({ vendaNumero, itens, motivo }) {
    const numero = proximoNumero(devolucoes);
    const valorTotal = itens.reduce((s, i) => s + i.preco * i.qtd, 0);
    setProdutos((prev) => prev.map((p) => {
      const item = itens.find((i) => i.produtoId === p.id);
      return item ? { ...p, estoque: p.estoque + item.qtd } : p;
    }));
    itens.forEach((i) => registrarMovimento({ tipo: 'Estorno', produtoId: i.produtoId, produtoNome: i.nome, quantidade: i.qtd, motivo: `Devolução #${numero}${vendaNumero ? ` (Venda #${vendaNumero})` : ''}` }));
    setFinanceiro((prev) => [...prev, { id: novoId(), tipo: `Devolução #${numero}`, valor: -valorTotal, hora: Date.now() }]);
    setDevolucoes((prev) => [...prev, { id: novoId(), numero, vendaNumero: vendaNumero || null, itens, valorTotal, motivo: motivo || '—', hora: Date.now(), operador }]);
    showToast('Devolução registrada — estoque e financeiro atualizados');
  }

  // ---------- Suprimento (entrada de dinheiro no caixa) ----------
  function registrarSuprimento(e) {
    e.preventDefault();
    if (!caixa.aberto) { setErro('Abra o caixa antes de registrar um suprimento.'); return; }
    const valor = parseFloat(String(suprimentoInput.valor).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) { setErro('Informe um valor de suprimento válido.'); return; }
    const registro = { id: novoId(), valor, motivo: suprimentoInput.motivo.trim() || 'Não informado', hora: Date.now(), operador };
    setSuprimentos((prev) => [...prev, registro]);
    setFinanceiro((prev) => [...prev, { id: novoId(), tipo: `Suprimento: ${registro.motivo}`, valor, hora: registro.hora }]);
    setSuprimentoInput({ valor: '', motivo: '' });
    setErro('');
    showToast('Suprimento registrado');
  }

  // ---------- Contas a pagar / receber ----------
  function adicionarContaPagar({ descricao, fornecedorId, fornecedorNome, valorTotal, vencimentoInicial, qtdParcelas }) {
    const parcelas = gerarParcelas(valorTotal, vencimentoInicial, qtdParcelas);
    setContasPagar((prev) => {
      const novas = parcelas.map((p) => ({ id: novoId(), descricao, fornecedorId, fornecedorNome, pago: false, dataPagamento: null, ...p }));
      return [...prev, ...novas];
    });
    showToast(parcelas.length > 1 ? `${parcelas.length} parcelas cadastradas` : 'Conta a pagar cadastrada');
  }
  function pagarConta(id) {
    const conta = contasPagar.find((c) => c.id === id);
    if (!conta || conta.pago) return;
    setContasPagar((prev) => prev.map((c) => (c.id === id ? { ...c, pago: true, dataPagamento: Date.now() } : c)));
    setFinanceiro((prev) => [...prev, { id: novoId(), tipo: `Pagamento: ${conta.descricao}`, valor: -conta.valor, hora: Date.now() }]);
    showToast('Conta paga e lançada no financeiro');
  }
  function excluirContaPagar(id) {
    setContasPagar((prev) => prev.filter((c) => c.id !== id));
  }

  function adicionarContaReceber({ descricao, clienteId, clienteNome, valorTotal, vencimentoInicial, qtdParcelas }) {
    const parcelas = gerarParcelas(valorTotal, vencimentoInicial, qtdParcelas);
    setContasReceber((prev) => {
      const novas = parcelas.map((p) => ({ id: novoId(), descricao, clienteId, clienteNome, recebido: false, dataRecebimento: null, ...p }));
      return [...prev, ...novas];
    });
    if (clienteId) {
      setClientes((prev) => prev.map((cl) => (cl.id === clienteId ? { ...cl, saldoDevedor: (cl.saldoDevedor || 0) + valorTotal } : cl)));
    }
    showToast(parcelas.length > 1 ? `${parcelas.length} parcelas cadastradas` : 'Conta a receber cadastrada');
  }
  function receberConta(id) {
    const conta = contasReceber.find((c) => c.id === id);
    if (!conta || conta.recebido) return;
    setContasReceber((prev) => prev.map((c) => (c.id === id ? { ...c, recebido: true, dataRecebimento: Date.now() } : c)));
    setFinanceiro((prev) => [...prev, { id: novoId(), tipo: `Recebimento: ${conta.descricao}`, valor: conta.valor, hora: Date.now() }]);
    if (conta.clienteId) {
      setClientes((prev) => prev.map((cl) => (cl.id === conta.clienteId ? { ...cl, saldoDevedor: Math.max(0, (cl.saldoDevedor || 0) - conta.valor) } : cl)));
    }
    showToast('Recebimento confirmado');
  }
  function excluirContaReceber(id) {
    setContasReceber((prev) => prev.filter((c) => c.id !== id));
  }

  // ---------- Usuários ----------
  function alternarAtivoUsuario(login) {
    if (!souAdmin()) { showToast('Somente administradores gerenciam usuários', 'alerta'); return; }
    const alvo = usuarios.find((u) => u.login === login);
    if (alvo && usuarioEhAdmin(alvo) && alvo.ativo !== false && adminsAtivos(usuarios, login) === 0) {
      showToast('Mantenha ao menos um administrador ativo', 'alerta');
      return;
    }
    setUsuarios((prev) => prev.map((u) => (u.login === login ? { ...u, ativo: u.ativo === false ? true : false } : u)));
    showToast('Status do usuário atualizado');
  }
  function alterarPerfilUsuario(login, perfil) {
    if (!souAdmin()) { showToast('Somente administradores gerenciam usuários', 'alerta'); return; }
    const alvo = usuarios.find((u) => u.login === login);
    if (alvo && usuarioEhAdmin(alvo) && perfil !== ADMIN_PERFIL && adminsAtivos(usuarios, login) === 0) {
      showToast('Mantenha ao menos um administrador ativo', 'alerta');
      return;
    }
    // ao trocar de perfil, o usuário passa a seguir as permissões do novo perfil
    setUsuarios((prev) => prev.map((u) => (u.login === login ? { ...u, perfil, areasPermitidas: undefined } : u)));
    registrarAuditoria({ acao: 'Alteração de Perfil', detalhe: `${login} → ${perfil}` });
    showToast('Perfil atualizado');
  }
  function excluirUsuario(login) {
    if (!souAdmin()) { showToast('Somente administradores gerenciam usuários', 'alerta'); return; }
    if (login === operador) { showToast('Você não pode remover o usuário logado', 'alerta'); return; }
    const alvo = usuarios.find((u) => u.login === login);
    if (alvo && usuarioEhAdmin(alvo) && alvo.ativo !== false && adminsAtivos(usuarios, login) === 0) {
      showToast('Mantenha ao menos um administrador ativo', 'alerta');
      return;
    }
    setUsuarios((prev) => prev.filter((u) => u.login !== login));
    registrarAuditoria({ acao: 'Exclusão de Usuário', detalhe: login });
    showToast('Usuário removido', 'alerta');
  }

  // ---------- Estado persistido / Backup ----------
  function aplicarEstado(d) {
    if (!d || typeof d !== 'object') return;
    const arr = Array.isArray;
    if (arr(d.produtos)) setProdutos(d.produtos);
    if (arr(d.categorias)) setCategorias(d.categorias);
    if (arr(d.clientes)) setClientes(d.clientes);
    if (arr(d.fornecedores)) setFornecedores(d.fornecedores);
    if (arr(d.compras)) setCompras(d.compras);
    if (arr(d.vendas)) setVendas(d.vendas);
    if (arr(d.trocas)) setTrocas(d.trocas);
    if (arr(d.devolucoes)) setDevolucoes(d.devolucoes);
    if (arr(d.financeiro)) setFinanceiro(d.financeiro);
    if (arr(d.sangrias)) setSangrias(d.sangrias);
    if (arr(d.suprimentos)) setSuprimentos(d.suprimentos);
    if (arr(d.contasPagar)) setContasPagar(d.contasPagar);
    if (arr(d.contasReceber)) setContasReceber(d.contasReceber);
    if (arr(d.movimentos)) setMovimentos(d.movimentos);
    if (arr(d.auditoria)) setAuditoria(d.auditoria);
    if (arr(d.usuarios) && d.usuarios.length) setUsuarios(d.usuarios);
    if (arr(d.perfis) && d.perfis.length) setPerfis(d.perfis);
    if (d.config && typeof d.config === 'object') setConfig({ ...CONFIG_PADRAO, ...d.config });
    if (d.caixa && typeof d.caixa === 'object') setCaixa(d.caixa);
    if ('ultimoFechamento' in d) setUltimoFechamento(d.ultimoFechamento ?? null);
  }

  function exportarBackup() {
    const dados = { ...estadoPersistido, exportadoEm: Date.now() };
    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup-pdv-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup exportado');
  }

  function importarBackup(dados) {
    if (!dados || typeof dados !== 'object' || !Array.isArray(dados.produtos)) {
      showToast('Arquivo de backup inválido', 'alerta');
      return;
    }
    aplicarEstado(normalizarEstadoSalvo({ ...dados }));
    registrarAuditoria({ acao: 'Restauração de Backup', detalhe: 'Dados substituídos por arquivo de backup' });
    showToast('Backup restaurado com sucesso');
  }

  function resetarSistema() {
    setProdutos(PRODUTOS_INICIAIS); setCategorias(CATEGORIAS_INICIAIS); setClientes([]); setFornecedores(FORNECEDORES_INICIAIS);
    setCompras([]); setVendas([]); setTrocas([]); setDevolucoes([]); setFinanceiro([]); setSangrias([]); setSuprimentos([]);
    setContasPagar([]); setContasReceber([]); setMovimentos([]); setAuditoria([]); setCaixa({ aberto: false, valorAbertura: 0, dataAbertura: null, operador: null });
    setUltimoFechamento(null); setPerfis(PERFIS_INICIAIS);
    registrarAuditoria({ acao: 'Reset do Sistema', detalhe: 'Dados restaurados para o padrão de fábrica' });
    showToast('Sistema restaurado para os dados iniciais', 'alerta');
  }

  async function alterarMinhaSenha({ atual, nova }) {
    const user = usuarios.find((u) => u.login === operador);
    if (!user) return 'Usuário não encontrado.';
    if (!nova || nova.length < 4) return 'A nova senha deve ter ao menos 4 caracteres.';
    try {
      const ok = user.senhaHash ? (await derivarHash(atual, user.salt)) === user.senhaHash : user.senha === atual;
      if (!ok) return 'Senha atual incorreta.';
      const salt = user.salt || novoSalt();
      const hash = await derivarHash(nova, salt);
      setUsuarios((prev) => prev.map((u) => (u.login === operador ? { ...u, salt, senhaHash: hash, senha: undefined } : u)));
    } catch {
      return 'Não foi possível alterar a senha neste navegador.';
    }
    registrarAuditoria({ acao: 'Alteração de Senha', detalhe: operador });
    showToast('Senha alterada com sucesso');
    return null;
  }

  function imprimirCupomTermico(venda) {
    const largura = config.larguraCupom === '80mm' ? 302 : 220;
    const linhas = venda.itens.map((i) =>
      `<div class="linha"><span>${i.qtd}x ${i.nome}</span><span>${fmt(i.preco * i.qtd)}</span></div><div class="sku">${i.codigoBarras || ''}</div>`
    ).join('');
    const html = `
      <html><head><title>Cupom</title>
      <style>
        @page { margin: 0; }
        body { width:${largura}px; font-family: 'Courier New', monospace; font-size: 11px; margin:0; padding:8px; color:#000; }
        .center { text-align:center; }
        .linha { display:flex; justify-content:space-between; gap:6px; }
        .sku { font-size:9px; color:#555; margin-bottom:3px; }
        .separador { border-top:1px dashed #000; margin:6px 0; }
        .total { font-weight:bold; font-size:13px; }
        h3 { margin: 2px 0; font-size:13px; }
        p { margin: 2px 0; }
      </style></head>
      <body>
        <div class="center">
          <h3>${config.nomeLoja}</h3>
          ${config.cnpj ? `<p>CNPJ: ${config.cnpj}</p>` : ''}
          ${config.endereco ? `<p>${config.endereco}</p>` : ''}
          <p>Cupom Não Fiscal · Venda #${String(venda.numero).padStart(4, '0')}</p>
          <p>${dataHora(venda.hora)} · ${venda.operador}</p>
        </div>
        <div class="separador"></div>
        ${linhas}
        <div class="separador"></div>
        ${venda.desconto > 0 ? `<div class="linha"><span>Subtotal</span><span>${fmt(venda.subtotal)}</span></div><div class="linha"><span>Desconto</span><span>-${fmt(venda.desconto)}</span></div>` : ''}
        <div class="linha total"><span>TOTAL</span><span>${fmt(venda.total)}</span></div>
        <div class="linha"><span>Pagamento</span><span>${venda.forma}</span></div>
        ${venda.forma === 'Dinheiro' ? `<div class="linha"><span>Troco</span><span>${fmt(venda.troco)}</span></div>` : ''}
        <div class="separador"></div>
        <p class="center">${config.mensagemRodape}</p>
      </body></html>`;
    const win = window.open('', '_blank', 'width=400,height=600');
    if (!win) return;
    win.document.write(html);
    win.document.close();
    win.focus();
    win.print();
  }

  function confirmarFechamento(e) {
    e.preventDefault();
    const contado = parseFloat(contagemFechamento.replace(',', '.'));
    if (isNaN(contado) || contado < 0) {
      setErro('Informe o valor contado em caixa.');
      return;
    }
    const diferenca = contado - valorEsperadoCaixa;
    const fechamento = {
      dataAbertura: caixa.dataAbertura,
      dataFechamento: Date.now(),
      valorAbertura: caixa.valorAbertura,
      totaisPorForma,
      valorEsperado: valorEsperadoCaixa,
      valorContado: contado,
      diferenca,
      qtdVendas: vendasDoTurno.length,
    };
    setFinanceiro((prev) => [
      ...prev,
      { id: novoId(), tipo: 'Fechamento de Caixa', valor: contado, hora: Date.now() },
    ]);
    setUltimoFechamento(fechamento);
    setCaixa({ aberto: false, valorAbertura: 0, dataAbertura: null, operador: null });
    setContagemFechamento('');
    setErro('');
    showToast('Caixa fechado com sucesso');
    registrarAuditoria({ acao: 'Fechamento de Caixa', detalhe: `Diferença: ${fmt(diferenca)}` });
    setScreen('dashboard');
  }

  // ---------- PERSISTÊNCIA: efeitos ----------
  const estadoPersistido = {
    produtos, categorias, clientes, fornecedores, compras, vendas, trocas, devolucoes, financeiro,
    sangrias, suprimentos, contasPagar, contasReceber, movimentos, auditoria, usuarios, perfis, config, caixa, ultimoFechamento,
  };
  const estadoRef = useRef(estadoPersistido);
  estadoRef.current = estadoPersistido;
  const SETTERS = {
    produtos: setProdutos, categorias: setCategorias, clientes: setClientes, fornecedores: setFornecedores, compras: setCompras,
    vendas: setVendas, trocas: setTrocas, devolucoes: setDevolucoes, financeiro: setFinanceiro, sangrias: setSangrias,
    suprimentos: setSuprimentos, contasPagar: setContasPagar, contasReceber: setContasReceber, movimentos: setMovimentos,
    auditoria: setAuditoria, usuarios: setUsuarios, perfis: setPerfis,
    caixa: setCaixa, config: setConfig, ultimoFechamento: setUltimoFechamento,
  };
  const deviceRef = useRef(obterDeviceId());
  const conectarRef = useRef(null);
  const nuvem = useRef(null);
  if (nuvem.current === null) {
    nuvem.current = {
      sb: null, canal: null, authSub: null, pronta: false, timer: null, poll: null, cancelado: false,
      baseline: CLOUD_ATIVA ? lerBaseline() : {}, enviando: false, reenviar: false, cursor: null, cursorMs: 0,
    };
  }
  const [syncStatus, setSyncStatus] = useState(CLOUD_ATIVA ? 'conectando' : 'local');
  const [syncTick, setSyncTick] = useState(0);
  const [erroLocal, setErroLocal] = useState(false);

  // Estoque = estoque-base + soma das movimentações (não sofre conflito entre dispositivos)
  useEffect(() => {
    const soma = {};
    movimentos.forEach((m) => { soma[m.produtoId] = (soma[m.produtoId] || 0) + (m.quantidade || 0); });
    let mudou = false;
    const novos = produtos.map((p) => {
      if (p.estoqueBase === undefined) return p;
      const alvo = p.estoqueBase + (soma[p.id] || 0);
      if (p.estoque === alvo) return p;
      mudou = true;
      return { ...p, estoque: alvo };
    });
    if (mudou) setProdutos(novos);
  }, [movimentos, produtos]);

  // Saldo devedor do cliente = soma das contas a receber em aberto
  useEffect(() => {
    const soma = {};
    contasReceber.forEach((c) => { if (c.clienteId && !c.recebido) soma[c.clienteId] = (soma[c.clienteId] || 0) + (c.valor || 0); });
    const arred = (n) => Math.round((n || 0) * 100) / 100;
    let mudou = false;
    const novos = clientes.map((cl) => {
      const alvo = arred(soma[cl.id]);
      if (arred(cl.saldoDevedor) === alvo) return cl;
      mudou = true;
      return { ...cl, saldoDevedor: alvo };
    });
    if (mudou) setClientes(novos);
  }, [contasReceber, clientes]);

  // Migra senhas/respostas em texto puro (dados antigos ou backups antigos) para hash PBKDF2
  useEffect(() => {
    const precisa = usuarios.some((u) => u.senha !== undefined || u.resposta !== undefined);
    if (!precisa) return undefined;
    let cancelado = false;
    (async () => {
      try {
        const novos = await Promise.all(usuarios.map(async (u) => {
          if (u.senha === undefined && u.resposta === undefined) return u;
          const salt = u.salt || novoSalt();
          const { senha, resposta, ...resto } = u;
          return {
            ...resto,
            salt,
            senhaHash: u.senhaHash || (senha !== undefined ? await derivarHash(senha, salt) : undefined),
            respostaHash: u.respostaHash || (resposta !== undefined ? await derivarHash(normResposta(resposta), salt) : undefined),
          };
        }));
        if (!cancelado) setUsuarios(novos);
      } catch (e) {
        console.error('Migração de senhas indisponível neste navegador:', e);
      }
    })();
    return () => { cancelado = true; };
  }, [usuarios]);

  const DEPS_ESTADO = [produtos, categorias, clientes, fornecedores, compras, vendas, trocas, devolucoes, financeiro, sangrias, suprimentos, contasPagar, contasReceber, movimentos, auditoria, usuarios, perfis, config, caixa, ultimoFechamento];

  // Cópia local (localStorage), sempre
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({ ...estadoRef.current, __salvoEm: Date.now() }));
        setErroLocal(false);
      } catch {
        setErroLocal(true);
      }
    }, 400);
    return () => clearTimeout(t);
  }, DEPS_ESTADO);

  // ----- Nuvem: sincronização por registro (cada venda, produto etc. é uma linha) -----
  function mesclarLinhas(rows) {
    const N = nuvem.current;
    const locais = linhasDoEstado(estadoRef.current);
    const porColecao = {};
    let baselineMudou = false;

    rows.forEach((row) => {
      const key = `${row.collection}/${row.id}`;
      const remoto = row.deleted || row.data == null ? null : row.data;
      const rHash = remoto ? hashDe(remoto, row.collection) : 'DEL';
      const local = locais.get(key);
      const lHash = local ? local.hash : 'DEL';
      const base = N.baseline[key] ?? 'DEL';

      if (rHash === lHash) {
        if (remoto) { if (N.baseline[key] !== rHash) { N.baseline[key] = rHash; baselineMudou = true; } }
        else if (key in N.baseline) { delete N.baseline[key]; baselineMudou = true; }
        return;
      }
      const localMudou = lHash !== base;
      // exclusão registrada na nuvem de algo que este dispositivo nunca sincronizou (ex.: dados de exemplo) também prevalece
      const remotoMudou = rHash !== base || (!remoto && !(key in N.baseline));
      if (localMudou && !remotoMudou) return; // alteração local ainda não enviada: ela será enviada

      // o remoto prevalece (local não mudou, ou houve conflito no mesmo registro)
      if (!porColecao[row.collection]) porColecao[row.collection] = { ups: new Map(), dels: new Set() };
      if (remoto) { porColecao[row.collection].ups.set(row.id, remoto); N.baseline[key] = rHash; }
      else { porColecao[row.collection].dels.add(row.id); delete N.baseline[key]; }
      baselineMudou = true;
    });

    Object.entries(porColecao).forEach(([colecao, { ups, dels }]) => {
      if (colecao === 'singleton') {
        ups.forEach((data, id) => {
          if (id === 'caixa') setCaixa(data);
          else if (id === 'config') setConfig({ ...CONFIG_PADRAO, ...data });
          else if (id === 'ultimoFechamento') setUltimoFechamento(data);
        });
        return;
      }
      const campo = CHAVE_COLECAO[colecao];
      const setter = SETTERS[colecao];
      if (!campo || !setter) return;
      setter((prev) => {
        const resultado = [];
        const vistos = new Set();
        prev.forEach((item) => {
          const id = String(item[campo]);
          if (dels.has(id)) return;
          if (ups.has(id)) { resultado.push(fundirRemoto(colecao, item, ups.get(id))); vistos.add(id); } else resultado.push(item);
        });
        ups.forEach((data, id) => { if (!vistos.has(id)) resultado.push(fundirRemoto(colecao, null, data)); });
        return COLECOES_COM_HORA.includes(colecao) ? resultado.sort((a, b) => (a.hora || 0) - (b.hora || 0)) : resultado;
      });
    });

    if (baselineMudou) salvarBaseline(N.baseline);
  }

  async function puxarMudancas(completo) {
    const N = nuvem.current;
    const linhas = [];
    for (let de = 0; ; de += 1000) {
      let q = N.sb.from('pdv_records').select('collection,id,data,deleted,updated_at,updated_by').eq('store_id', CLOUD_ID);
      if (!completo && N.cursor) q = q.gte('updated_at', N.cursor);
      const { data, error } = await q
        .order('updated_at', { ascending: true }).order('collection', { ascending: true }).order('id', { ascending: true })
        .range(de, de + 999);
      if (error) throw error;
      linhas.push(...data);
      if (data.length < 1000) break;
    }
    const relevantes = completo
      ? linhas
      : linhas.filter((r) => !(r.updated_by === deviceRef.current && `${r.collection}/${r.id}` in N.baseline));
    mesclarLinhas(relevantes);
    let max = N.cursorMs;
    linhas.forEach((r) => { const t = Date.parse(r.updated_at); if (t > max) max = t; });
    if (max) { N.cursorMs = max; N.cursor = new Date(max - 5000).toISOString(); } // margem p/ commits tardios
  }

  async function enviarAlteracoes() {
    const N = nuvem.current;
    if (!CLOUD_ATIVA || !N.pronta || !N.sb) return;
    if (N.enviando) { N.reenviar = true; return; }
    N.enviando = true;
    try {
      const linhas = linhasDoEstado(estadoRef.current);
      const ups = [];
      linhas.forEach((l, key) => { if (!l.pendente && N.baseline[key] !== l.hash) ups.push([key, l]); });
      const dels = Object.keys(N.baseline).filter((k) => !linhas.has(k));
      if (!ups.length && !dels.length) { setSyncStatus('sincronizado'); return; }
      setSyncStatus('sincronizando');
      const registros = [
        ...ups.map(([, l]) => ({ store_id: CLOUD_ID, collection: l.colecao, id: l.id, data: paraNuvem(l.colecao, l.item), deleted: false, updated_by: deviceRef.current })),
        ...dels.map((k) => { const i = k.indexOf('/'); return { store_id: CLOUD_ID, collection: k.slice(0, i), id: k.slice(i + 1), data: null, deleted: true, updated_by: deviceRef.current }; }),
      ];
      for (let i = 0; i < registros.length; i += 200) {
        const { error } = await N.sb.from('pdv_records').upsert(registros.slice(i, i + 200), { onConflict: 'store_id,collection,id' });
        if (error) throw error;
      }
      ups.forEach(([key, l]) => { N.baseline[key] = l.hash; });
      dels.forEach((k) => { delete N.baseline[k]; });
      salvarBaseline(N.baseline);
      setSyncStatus('sincronizado');
    } catch (e) {
      console.error('Falha ao enviar para a nuvem:', e);
      setSyncStatus('erro');
    } finally {
      N.enviando = false;
      if (N.reenviar) { N.reenviar = false; setSyncTick((x) => x + 1); }
    }
  }

  // Envia alterações pendentes (debounce)
  useEffect(() => {
    if (!CLOUD_ATIVA) return undefined;
    const t = setTimeout(() => { enviarAlteracoes(); }, 600);
    return () => clearTimeout(t);
  }, [...DEPS_ESTADO, syncTick]);

  // Conexão: carrega tudo, assina mudanças em tempo real e confere de 20 em 20 s (rede de segurança)
  useEffect(() => {
    if (!CLOUD_ATIVA) return undefined;
    const N = nuvem.current;
    N.cancelado = false;

    async function conectar() {
      if (N.cancelado) return;
      clearTimeout(N.timer);
      try {
        setSyncStatus('conectando');
        if (!N.sb) {
          const { createClient } = await import('@supabase/supabase-js');
          N.sb = createClient(CLOUD_URL, CLOUD_KEY);
          const { data: sub } = N.sb.auth.onAuthStateChange((evento) => {
            if (evento === 'SIGNED_OUT') { N.pronta = false; setSyncStatus('precisa-login'); }
          });
          N.authSub = sub.subscription;
        }
        const { data: sessao } = await N.sb.auth.getSession();
        if (!sessao.session) { N.pronta = false; setSyncStatus('precisa-login'); return; }

        await puxarMudancas(true);
        if (N.cancelado) return;
        N.pronta = true;

        if (N.canal) N.sb.removeChannel(N.canal);
        N.canal = N.sb
          .channel(`pdv-${CLOUD_ID}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'pdv_records', filter: `store_id=eq.${CLOUD_ID}` }, (payload) => {
            const nova = payload.new;
            if (!nova || !nova.collection || nova.updated_by === deviceRef.current) return;
            mesclarLinhas([nova]);
          })
          .subscribe((status) => { if (status === 'SUBSCRIBED') puxarMudancas(false).catch(() => {}); });

        clearInterval(N.poll);
        N.poll = setInterval(() => {
          if (!N.pronta || document.hidden) return;
          puxarMudancas(false).then(() => setSyncStatus((st) => (st === 'erro' ? 'sincronizado' : st))).catch(() => setSyncStatus('erro'));
        }, 20000);

        setSyncStatus('sincronizado');
        setSyncTick((x) => x + 1); // envia o que só existe localmente
      } catch (e) {
        console.error('Sincronização com a nuvem:', e);
        setSyncStatus('erro');
        N.timer = setTimeout(conectar, 15000);
      }
    }

    conectarRef.current = conectar;
    conectar();
    const aoVoltarOnline = () => conectar();
    window.addEventListener('online', aoVoltarOnline);
    return () => {
      N.cancelado = true;
      clearTimeout(N.timer);
      clearInterval(N.poll);
      window.removeEventListener('online', aoVoltarOnline);
      if (N.canal && N.sb) N.sb.removeChannel(N.canal);
      if (N.authSub) N.authSub.unsubscribe();
      N.canal = null;
      N.authSub = null;
    };
  }, []);

  async function entrarNuvem(email, senhaNuvem) {
    const N = nuvem.current;
    if (!N.sb) return 'A nuvem ainda está carregando. Tente de novo em instantes.';
    const { error } = await N.sb.auth.signInWithPassword({ email, password: senhaNuvem });
    if (error) return error.message;
    if (conectarRef.current) conectarRef.current();
    return null;
  }
  async function sairNuvem() {
    const N = nuvem.current;
    if (N.sb) await N.sb.auth.signOut();
    N.pronta = false;
    clearInterval(N.poll);
    setSyncStatus('precisa-login');
  }
  async function sincronizarAgora() {
    const N = nuvem.current;
    try {
      setSyncStatus('sincronizando');
      await puxarMudancas(false);
      setSyncTick((x) => x + 1);
    } catch (e) {
      console.error(e);
      setSyncStatus('erro');
    }
    return N;
  }

  // ---------- LOGIN / CADASTRO / ESQUECI SENHA ----------
  if (screen === 'login') {
    const trocarView = (v) => { setAuthScreen(v); setErro(''); setMsgSucesso(''); };

    return (
      <div className="gradient-bg" style={{ minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif", padding: 20, position: 'relative', overflow: 'hidden' }}>
        <style>{FONTS}</style>
        <div className="blob" style={{ width: 320, height: 320, background: C.primary, top: '10%', left: '8%' }} />
        <div className="blob" style={{ width: 260, height: 260, background: C.accent, bottom: '8%', right: '10%', animationDelay: '3s' }} />
        <div className="pop-in" style={{ width: 360, background: C.bgDark2, border: `1px solid ${C.borderDark}`, borderRadius: 14, padding: 32, position: 'relative', zIndex: 1, boxShadow: '0 30px 60px rgba(0,0,0,0.35)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={19} color={C.textLight} strokeWidth={2.4} />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 20, color: C.textLight, letterSpacing: -0.3 }}>PDV Terminal</span>
          </div>

          {msgSucesso && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.35)', borderRadius: 8, padding: '8px 10px', marginTop: 16 }}>
              <CheckCircle2 size={14} color={C.accent} />
              <span style={{ color: C.accent, fontSize: 12.5 }}>{msgSucesso}</span>
            </div>
          )}

          {/* ---- LOGIN ---- */}
          {authScreen === 'login' && (
            <form onSubmit={handleLogin}>
              <p style={{ color: C.muted, fontSize: 13, marginTop: msgSucesso ? 14 : 4, marginBottom: 22 }}>Acesse com seu usuário operador.</p>

              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Usuário</label>
              <div style={{ position: 'relative', marginBottom: 16 }}>
                <User size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  value={usuario.login}
                  onChange={(e) => setUsuario({ ...usuario, login: e.target.value })}
                  placeholder="admin"
                  style={inputDarkStyle}
                />
              </div>

              <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 6 }}>Senha</label>
              <div style={{ position: 'relative', marginBottom: 10 }}>
                <Lock size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: 12 }} />
                <input
                  type="password"
                  value={usuario.senha}
                  onChange={(e) => setUsuario({ ...usuario, senha: e.target.value })}
                  placeholder="••••••••"
                  style={inputDarkStyle}
                />
              </div>

              <div style={{ textAlign: 'right', marginBottom: 18 }}>
                <button type="button" onClick={() => trocarView('esqueci')} style={{ ...btnGhost, color: C.accent, fontSize: 12 }}>
                  Esqueceu a senha?
                </button>
              </div>

              {erro && <ErroBox erro={erro} />}

              <button type="submit" onMouseDown={rippleEffect} className="ripple" style={{ width: '100%', background: C.primary, color: C.textLight, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                Entrar
              </button>

              <div style={{ textAlign: 'center', marginTop: 16, fontSize: 12.5, color: C.muted }}>
                Não tem uma conta?{' '}
                <button type="button" onClick={() => trocarView('cadastro')} style={{ ...btnGhost, color: C.accent, fontSize: 12.5 }}>
                  Cadastre-se
                </button>
              </div>
            </form>
          )}

          {/* ---- CADASTRO ---- */}
          {authScreen === 'cadastro' && (
            <form onSubmit={handleCadastro}>
              <button type="button" onClick={() => trocarView('login')} style={{ ...btnGhost, color: C.muted, marginTop: 16, marginBottom: 10 }}>
                <ArrowLeft size={13} /> Voltar
              </button>
              <p style={{ color: C.textLight, fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Criar conta de operador</p>
              <p style={{ color: C.muted, fontSize: 12.5, marginTop: 0, marginBottom: 18 }}>A pergunta de segurança é usada para recuperar a senha.</p>

              <FieldDark icon={User} placeholder="Login desejado" value={cadastro.login} onChange={(v) => setCadastro({ ...cadastro, login: v })} />
              <FieldDark icon={Lock} type="password" placeholder="Senha (mín. 4 caracteres)" value={cadastro.senha} onChange={(v) => setCadastro({ ...cadastro, senha: v })} />
              <FieldDark icon={Lock} type="password" placeholder="Confirmar senha" value={cadastro.confirmar} onChange={(v) => setCadastro({ ...cadastro, confirmar: v })} />
              <FieldDark icon={HelpCircle} placeholder="Pergunta de segurança" value={cadastro.pergunta} onChange={(v) => setCadastro({ ...cadastro, pergunta: v })} />
              <FieldDark icon={KeyRound} placeholder="Resposta" value={cadastro.resposta} onChange={(v) => setCadastro({ ...cadastro, resposta: v })} last />

              {erro && <ErroBox erro={erro} />}

              <button type="submit" style={{ width: '100%', background: C.primary, color: C.textLight, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
                <UserPlus size={15} /> Cadastrar
              </button>
            </form>
          )}

          {/* ---- ESQUECI A SENHA ---- */}
          {authScreen === 'esqueci' && (
            <div>
              <button type="button" onClick={() => { trocarView('login'); setEsqueci({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' }); }} style={{ ...btnGhost, color: C.muted, marginTop: 16, marginBottom: 10 }}>
                <ArrowLeft size={13} /> Voltar ao login
              </button>
              <p style={{ color: C.textLight, fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 4, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>Recuperar senha</p>

              {esqueci.etapa === 1 && (
                <form onSubmit={handleEsqueciBuscar}>
                  <p style={{ color: C.muted, fontSize: 12.5, marginTop: 0, marginBottom: 18 }}>Informe seu login para localizar sua pergunta de segurança.</p>
                  <FieldDark icon={User} placeholder="Seu login" value={esqueci.login} onChange={(v) => setEsqueci({ ...esqueci, login: v })} last />
                  {erro && <ErroBox erro={erro} />}
                  <button type="submit" style={{ width: '100%', background: C.primary, color: C.textLight, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Continuar
                  </button>
                </form>
              )}

              {esqueci.etapa === 2 && (
                <form onSubmit={handleEsqueciConfirmar}>
                  <div style={{ background: C.bgDark3, borderRadius: 8, padding: '10px 12px', marginBottom: 16, fontSize: 12.5, color: C.textLight }}>
                    <strong style={{ color: C.muted, fontWeight: 600, display: 'block', fontSize: 11, textTransform: 'uppercase', marginBottom: 4 }}>Pergunta de segurança</strong>
                    {esqueci.perguntaEncontrada}
                  </div>
                  <FieldDark icon={KeyRound} placeholder="Sua resposta" value={esqueci.resposta} onChange={(v) => setEsqueci({ ...esqueci, resposta: v })} />
                  <FieldDark icon={Lock} type="password" placeholder="Nova senha" value={esqueci.novaSenha} onChange={(v) => setEsqueci({ ...esqueci, novaSenha: v })} />
                  <FieldDark icon={Lock} type="password" placeholder="Confirmar nova senha" value={esqueci.confirmar} onChange={(v) => setEsqueci({ ...esqueci, confirmar: v })} last />
                  {erro && <ErroBox erro={erro} />}
                  <button type="submit" style={{ width: '100%', background: C.primary, color: C.textLight, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                    Redefinir senha
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
        <div style={{ position: 'absolute', bottom: 14, left: 0, right: 0, textAlign: 'center', fontSize: 11, color: C.muted, zIndex: 1 }}>
          PDV Terminal v{APP_VERSAO} · {APP_BUILD}
        </div>
      </div>
    );
  }

  // ---------- SHELL (post-login) ----------
  const usuarioAtual = usuarios.find((u) => u.login === operador);
  const ehAdmin = usuarioEhAdmin(usuarioAtual);
  const perfilAtual = perfis.find((p) => p.nome === (usuarioAtual?.perfil || 'Operador')) || perfis[perfis.length - 1];
  const areasPermitidas = areasEfetivas(usuarioAtual, perfis);
  const temPermissao = (area) => areasPermitidas.includes(area);
  const telaPermitida = !SCREEN_AREA[screen] || temPermissao(SCREEN_AREA[screen]);

  const navItemsTop = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'pdv', label: 'PDV', icon: ShoppingCart, disabled: !caixa.aberto },
  ].filter((i) => temPermissao(SCREEN_AREA[i.key]));
  const clienteItem = { key: 'clientes', label: 'Clientes', icon: Users };
  const mostrarClientes = temPermissao('clientes');

  const alertasEstoqueCount = produtos.filter((p) => p.estoque <= (p.estoqueMinimo ?? 10)).length;
  const contasPagarPendentesCount = contasPagar.filter((c) => !c.pago).length;
  const contasReceberPendentesCount = contasReceber.filter((c) => !c.recebido).length;

  const produtosItems = [
    { key: 'produtos', label: 'Produtos', icon: Package },
    { key: 'categorias', label: 'Categorias', icon: Tags },
    { key: 'estoqueVisao', label: 'Estoque', icon: Boxes, badge: alertasEstoqueCount },
    { key: 'movimentacoes', label: 'Movimentações', icon: History },
    { key: 'inventario', label: 'Inventário', icon: ClipboardList },
  ];
  const comprasItems = [
    { key: 'novaCompra', label: 'Nova Compra', icon: Plus },
    { key: 'historicoCompras', label: 'Histórico', icon: ListChecks },
    { key: 'fornecedores', label: 'Fornecedores', icon: Truck },
  ];
  const vendasItems = [
    { key: 'vendas', label: 'Vendas', icon: ListChecks },
    { key: 'trocas', label: 'Trocas', icon: ArrowLeftRight },
    { key: 'devolucoes', label: 'Devoluções', icon: Undo2 },
    { key: 'credario', label: 'Credário', icon: CreditCard },
  ];
  const financeiroItems = [
    { key: 'fluxoCaixa', label: 'Fluxo de Caixa', icon: Activity },
    { key: 'contasPagar', label: 'Contas a Pagar', icon: ArrowUpCircle, badge: contasPagarPendentesCount },
    { key: 'contasReceber', label: 'Contas a Receber', icon: ArrowDownCircle, badge: contasReceberPendentesCount },
    { key: 'receitas', label: 'Receitas', icon: TrendingUp },
    { key: 'despesas', label: 'Despesas', icon: TrendingDown },
  ];
  const caixaItems = [
    { key: 'abrirCaixa', label: 'Abrir Caixa', icon: Wallet, disabled: caixa.aberto },
    { key: 'sangria', label: 'Sangria', icon: ArrowDownCircle, disabled: !caixa.aberto },
    { key: 'suprimento', label: 'Suprimento', icon: ArrowUpCircle, disabled: !caixa.aberto },
    { key: 'fecharCaixa', label: 'Fechar Caixa', icon: Wallet, disabled: !caixa.aberto, onClick: () => { setContagemFechamento(''); setScreen('fecharCaixa'); } },
  ];
  const relatoriosItems = ['Vendas', 'Produtos', 'Estoque', 'Financeiro', 'Operadores', 'Lucro'].map((aba) => ({
    key: `relatorios-${aba}`, label: aba, icon: BarChart3,
    onClick: () => { setRelatoriosAba(aba); setErro(''); setScreen('relatorios'); },
    isActive: () => screen === 'relatorios' && relatoriosAba === aba,
  }));
  const usuariosItems = [
    { key: 'usuarios', label: 'Usuários', icon: UserCog },
    { key: 'perfis', label: 'Perfis', icon: ShieldCheck },
    { key: 'auditoria', label: 'Auditoria', icon: History },
  ];
  const configItems = ['Empresa', 'Impressora', 'Pagamentos', 'Pix', 'Backup', 'Nuvem', ...(ehAdmin ? ['Permissões'] : []), 'Sistema'].map((aba) => ({
    key: `config-${aba}`, label: aba, icon: Settings,
    onClick: () => { setConfigAba(aba); setErro(''); setScreen('configuracoes'); },
    isActive: () => screen === 'configuracoes' && configAba === aba,
  }));

  const grupos = [
    { key: 'grp-produtos', area: 'produtos', label: 'Produtos', Icon: Package, aberto: grupoProdutosAberto, setAberto: setGrupoProdutosAberto, itens: produtosItems },
    { key: 'grp-compras', area: 'compras', label: 'Compras', Icon: ShoppingBag, aberto: grupoComprasAberto, setAberto: setGrupoComprasAberto, itens: comprasItems },
    { key: 'grp-vendas', area: 'vendas', label: 'Vendas', Icon: Receipt, aberto: grupoVendasAberto, setAberto: setGrupoVendasAberto, itens: vendasItems },
    { key: 'grp-financeiro', area: 'financeiro', label: 'Financeiro', Icon: TrendingUp, aberto: grupoFinanceiroAberto, setAberto: setGrupoFinanceiroAberto, itens: financeiroItems },
    { key: 'grp-caixa', area: 'caixa', label: 'Caixa', Icon: Wallet, aberto: grupoCaixaAberto, setAberto: setGrupoCaixaAberto, itens: caixaItems },
    { key: 'grp-relatorios', area: 'relatorios', label: 'Relatórios', Icon: BarChart3, aberto: grupoRelatoriosAberto, setAberto: setGrupoRelatoriosAberto, itens: relatoriosItems },
    { key: 'grp-usuarios', area: 'usuarios', label: 'Usuários', Icon: UserCog, aberto: grupoUsuariosAberto, setAberto: setGrupoUsuariosAberto, itens: usuariosItems },
    { key: 'grp-config', area: 'configuracoes', label: 'Configurações', Icon: Cog, aberto: grupoConfigAberto, setAberto: setGrupoConfigAberto, itens: configItems },
  ].filter((g) => temPermissao(g.area));
  const gruposAtivos = grupos.map((g) => ({ ...g, ativo: g.itens.some((i) => (i.isActive ? i.isActive() : screen === i.key)) }));

  function renderNavBtn(item) {
    const Icon = item.icon;
    const active = screen === item.key || (item.key === 'pdv' && ['pdv', 'pagamento', 'cupom'].includes(screen));
    return (
      <button
        key={item.key}
        className="nav-btn"
        disabled={item.disabled}
        onClick={() => { setErro(''); setScreen(item.key); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none',
          background: active ? C.primarySoft : 'transparent',
          color: item.disabled ? C.mutedDark : active ? C.primaryDark : C.muted,
          fontSize: 13.5, fontWeight: active ? 600 : 500, cursor: item.disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
        }}
      >
        <Icon size={16} strokeWidth={2} />
        {item.label}
      </button>
    );
  }

  function renderSubNavBtn(item) {
    const Icon = item.icon;
    const active = item.isActive ? item.isActive() : screen === item.key;
    return (
      <button
        key={item.key}
        className="nav-btn"
        disabled={item.disabled}
        onClick={() => { setErro(''); if (item.onClick) item.onClick(); else setScreen(item.key); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 9, padding: '7px 12px 7px 30px', borderRadius: 9, border: 'none',
          background: active ? C.primarySoft : 'transparent', color: item.disabled ? C.mutedDark : active ? C.primaryDark : C.muted,
          fontSize: 12.5, fontWeight: active ? 600 : 500, cursor: item.disabled ? 'not-allowed' : 'pointer', textAlign: 'left', position: 'relative',
        }}
      >
        {active && <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 4, height: 4, borderRadius: 99, background: C.primary }} />}
        <Icon size={13} strokeWidth={2} />
        {item.label}
        {!!item.badge && (
          <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: C.danger, color: '#fff', borderRadius: 99, padding: '1px 6px' }}>{item.badge}</span>
        )}
      </button>
    );
  }

  function GrupoNav({ label, Icon, aberto, ativo, onToggle, itens }) {
    const mostrarAberto = aberto || ativo;
    return (
      <div>
        <button
          className="nav-btn"
          onClick={onToggle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 9, border: 'none',
            background: ativo && !aberto ? C.primarySoft : 'transparent', color: ativo ? C.primaryDark : C.muted,
            fontSize: 13.5, fontWeight: ativo ? 600 : 500, cursor: 'pointer', textAlign: 'left',
          }}
        >
          <Icon size={16} strokeWidth={2} />
          {label}
          <ChevronDown size={14} style={{ marginLeft: 'auto', transition: 'transform 0.25s cubic-bezier(.22,1,.36,1)', transform: mostrarAberto ? 'rotate(0deg)' : 'rotate(-90deg)' }} />
        </button>
        <div className="accordion-body" style={{ maxHeight: mostrarAberto ? itens.length * 34 + 8 : 0, opacity: mostrarAberto ? 1 : 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, marginTop: 1 }}>{itens.map(renderSubNavBtn)}</div>
        </div>
      </div>
    );
  }

  const stepIdx = FLOW.findIndex((f) => f.key === screen);

  return (
    <div style={{ minHeight: '100%', display: 'flex', background: C.bgLight, fontFamily: "'Inter',sans-serif", color: C.textDark }}>
      <style>{FONTS}</style>

      {/* SIDEBAR */}
      <div style={{ width: 216, background: C.panel, display: 'flex', flexDirection: 'column', flexShrink: 0, borderRight: `1px solid ${C.borderLight}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '20px 18px 16px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 9, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryDark})`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 10px rgba(109,93,246,0.35)' }}>
            <Store size={16} color="#fff" strokeWidth={2.4} />
          </div>
          <span style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, fontSize: 15.5, color: C.textDark }}>PDV Terminal</span>
        </div>

        <div style={{ margin: '4px 14px 18px', padding: '9px 12px', borderRadius: 11, background: caixa.aberto ? 'rgba(45,212,191,0.10)' : C.bgLight, border: `1px solid ${caixa.aberto ? 'rgba(45,212,191,0.35)' : C.borderLight}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={caixa.aberto ? 'pulse-dot' : ''} style={{ width: 7, height: 7, borderRadius: 99, background: caixa.aberto ? C.accent : C.mutedDark, boxShadow: caixa.aberto ? `0 0 6px ${C.accent}` : 'none' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: caixa.aberto ? C.accentDark : C.muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Caixa {caixa.aberto ? 'Aberto' : 'Fechado'}
            </span>
          </div>
          {caixa.aberto && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.textDark, marginTop: 4, fontWeight: 600 }}>{fmt(valorEsperadoCaixa)}</div>
          )}
        </div>

        <div className="scroll-thin" style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          {navItemsTop.map(renderNavBtn)}
          {mostrarClientes && renderNavBtn(clienteItem)}

          <div style={{ height: 1, background: C.borderLight, margin: '6px 2px' }} />

          {gruposAtivos.map((g) => (
            <GrupoNav key={g.key} label={g.label} Icon={g.Icon} aberto={g.aberto} ativo={g.ativo} onToggle={() => g.setAberto((v) => !v)} itens={g.itens} />
          ))}
        </div>

        <div style={{ padding: 14, borderTop: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: C.primarySoft, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={14} color={C.primaryDark} />
          </div>
          <span style={{ fontSize: 12.5, color: C.textDark, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>{operador}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <LogOut size={15} color={C.muted} />
          </button>
        </div>
        <div style={{ padding: '0 14px 10px', fontSize: 10.5, color: C.muted }}>v{APP_VERSAO} · {APP_BUILD}</div>
      </div>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '10px 28px', background: C.panel, borderBottom: `1px solid ${C.borderLight}`, fontSize: 12 }}>
          <span style={{ fontWeight: 700, color: C.textDark, fontSize: 13 }}>{config.nomeLoja}</span>
          <span style={{ color: C.borderLight }}>|</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: C.muted }}>
            <Clock size={12} />
            {relogio.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })} · {relogio.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </span>
          <SyncBadge status={syncStatus} erroLocal={erroLocal} onClick={() => { if (CLOUD_ATIVA) { setConfigAba('Nuvem'); setScreen('configuracoes'); } }} />
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: caixa.aberto ? C.accentDark : C.muted }}>
            <span style={{ width: 6, height: 6, borderRadius: 99, background: caixa.aberto ? C.accent : C.mutedDark }} />
            {caixa.aberto ? `Caixa aberto · ${fmt(valorEsperadoCaixa)}` : 'Caixa fechado'}
          </span>
        </div>
        {stepIdx >= 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, padding: '16px 28px', background: C.panel, borderBottom: `1px solid ${C.borderLight}` }}>
            {FLOW.map((f, i) => {
              const done = i < stepIdx || (f.key === 'abrirCaixa' && caixa.aberto);
              const active = i === stepIdx;
              return (
                <React.Fragment key={f.key}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{
                      width: 22, height: 22, borderRadius: 99, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: done ? C.accent : active ? C.primary : C.bgLight,
                      border: `1px solid ${done ? C.accent : active ? C.primary : C.borderLight}`,
                      fontSize: 11, fontWeight: 700, color: done ? '#fff' : active ? '#fff' : C.muted,
                    }}>
                      {done ? <Check size={12} /> : i + 1}
                    </div>
                    <span style={{ fontSize: 12.5, fontWeight: active ? 700 : 500, color: active ? C.textDark : C.muted }}>{f.label}</span>
                  </div>
                  {i < FLOW.length - 1 && <div style={{ width: 34, height: 1, background: C.borderLight, margin: '0 10px' }} />}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div key={screen} className="fade-in scroll-thin" style={{ flex: 1, overflow: 'auto', padding: 28 }}>
          {erro && screen !== 'login' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: C.dangerBg, border: `1px solid #FCA5A5`, borderRadius: 8, padding: '9px 12px', marginBottom: 18, maxWidth: 640 }}>
              <AlertTriangle size={14} color={C.danger} />
              <span style={{ color: '#B91C1C', fontSize: 12.5 }}>{erro}</span>
            </div>
          )}

          {!telaPermitida ? (
            <AccessDeniedScreen area={SCREEN_AREA[screen]} perfil={perfilAtual?.nome} onVoltar={() => setScreen('dashboard')} />
          ) : (
          <>
          {screen === 'dashboard' && (
            <Dashboard
              caixa={caixa} valorEsperadoCaixa={valorEsperadoCaixa} vendasDoTurno={vendasDoTurno}
              produtos={produtos} ultimoFechamento={ultimoFechamento} vendas={vendas}
              onAbrirCaixa={() => { setErro(''); setScreen('abrirCaixa'); }}
              onIrPDV={() => setScreen('pdv')}
            />
          )}

          {screen === 'abrirCaixa' && (
            <AbrirCaixa valor={valorAberturaInput} setValor={setValorAberturaInput} onConfirmar={handleAbrirCaixa} />
          )}

          {screen === 'pdv' && (
            <PDVScreen
              produtos={produtosFiltrados} busca={busca} setBusca={setBusca} onBuscaSubmit={handleBuscaSubmit}
              categorias={categoriasPdv} categoriaAtiva={categoriaAtiva} setCategoriaAtiva={setCategoriaAtiva}
              carrinho={carrinho} onAdd={addProduto} onQtd={alterarQtd} onRemover={removerItem}
              total={totalCarrinho} onFinalizar={irParaPagamento}
            />
          )}

          {screen === 'pagamento' && (
            <PagamentoScreen subtotal={totalCarrinho} desconto={descontoAplicado} total={totalComDesconto} pagamento={pagamento} setPagamento={setPagamento} onConfirmar={confirmarPagamento} onVoltar={() => setScreen('pdv')} config={config} clientes={clientes} />
          )}

          {screen === 'cupom' && ultimaVenda && (
            <CupomScreen venda={ultimaVenda} onNovaVenda={novaVenda} onImprimir={() => imprimirCupomTermico(ultimaVenda)} />
          )}

          {screen === 'fecharCaixa' && (
            <FecharCaixaScreen
              caixa={caixa} totaisPorForma={totaisPorForma} valorEsperado={valorEsperadoCaixa}
              qtdVendas={vendasDoTurno.length} valorContado={contagemFechamento} setValorContado={setContagemFechamento}
              onConfirmar={confirmarFechamento} totalSangrias={totalSangrias} qtdSangrias={sangriasDoTurno.length}
            />
          )}

          {screen === 'sangria' && (
            <SangriaScreen
              caixa={caixa} valorDisponivel={valorEsperadoCaixa} sangriaInput={sangriaInput} setSangriaInput={setSangriaInput}
              onConfirmar={registrarSangria} historico={sangriasDoTurno}
            />
          )}

          {screen === 'suprimento' && (
            <SuprimentoScreen suprimentoInput={suprimentoInput} setSuprimentoInput={setSuprimentoInput} onConfirmar={registrarSuprimento} historico={suprimentos.filter((s) => caixa.dataAbertura && s.hora >= caixa.dataAbertura)} />
          )}

          {screen === 'relatorios' && (
            <RelatoriosScreen aba={relatoriosAba} setAba={setRelatoriosAba} vendas={vendas} sangrias={sangrias} produtos={produtos} financeiro={financeiro} />
          )}

          {screen === 'configuracoes' && (
            <ConfiguracoesScreen aba={configAba} setAba={setConfigAba} config={config} setConfig={setConfig} onExportar={exportarBackup} onImportar={importarBackup} onResetar={resetarSistema} ehAdmin={ehAdmin} usuarios={usuarios} perfis={perfis} operadorAtual={operador} onAlterarPermissaoUsuario={alterarPermissaoUsuario} onResetarPermissoesUsuario={resetarPermissoesUsuario} onIrPerfis={() => setScreen('perfis')} nuvem={{ ativa: CLOUD_ATIVA, status: syncStatus, erroLocal, entrar: entrarNuvem, sair: sairNuvem, sincronizar: sincronizarAgora }} />
          )}

          {screen === 'produtos' && (
            <ProdutosScreen produtos={produtos} categorias={categorias} onAdd={adicionarProdutoCadastro} onEdit={editarProduto} onDelete={excluirProduto} />
          )}

          {screen === 'categorias' && (
            <CategoriasScreen categorias={categorias} produtos={produtos} onAdd={adicionarCategoria} onEdit={editarCategoria} onDelete={excluirCategoria} />
          )}

          {screen === 'estoqueVisao' && (
            <EstoqueVisaoScreen produtos={produtos} onAjustar={ajustarEstoque} />
          )}

          {screen === 'movimentacoes' && <MovimentacoesScreen movimentos={movimentos} />}

          {screen === 'inventario' && <InventarioScreen produtos={produtos} onAplicar={aplicarInventario} />}

          {screen === 'novaCompra' && (
            <NovaCompraScreen produtos={produtos} fornecedores={fornecedores} onConfirmar={confirmarCompra} />
          )}

          {screen === 'historicoCompras' && <HistoricoComprasScreen compras={compras} />}

          {screen === 'fornecedores' && (
            <FornecedoresScreen fornecedores={fornecedores} onAdd={adicionarFornecedor} onEdit={editarFornecedor} onDelete={excluirFornecedor} />
          )}

          {screen === 'clientes' && (
            <ClientesScreen clientes={clientes} onAdd={adicionarCliente} onEdit={editarCliente} onDelete={excluirCliente} />
          )}

          {screen === 'vendas' && <VendasScreen vendas={vendas} onCancelar={cancelarVenda} />}

          {screen === 'trocas' && <TrocasScreen produtos={produtos} trocas={trocas} onConfirmar={confirmarTroca} />}

          {screen === 'devolucoes' && <DevolucoesScreen vendas={vendas} devolucoes={devolucoes} onConfirmar={confirmarDevolucao} />}

          {screen === 'credario' && <CredarioScreen clientes={clientes} contasReceber={contasReceber} onReceber={receberConta} />}

          {screen === 'fluxoCaixa' && <FluxoCaixaScreen financeiro={financeiro} />}

          {screen === 'contasPagar' && <ContasPagarScreen contas={contasPagar} fornecedores={fornecedores} onAdd={adicionarContaPagar} onPagar={pagarConta} onDelete={excluirContaPagar} />}

          {screen === 'contasReceber' && <ContasReceberScreen contas={contasReceber} clientes={clientes} onAdd={adicionarContaReceber} onReceber={receberConta} onDelete={excluirContaReceber} />}

          {screen === 'receitas' && <ReceitasDespesasScreen financeiro={financeiro} tipo="receitas" />}

          {screen === 'despesas' && <ReceitasDespesasScreen financeiro={financeiro} tipo="despesas" />}

          {screen === 'usuarios' && <UsuariosScreen usuarios={usuarios} perfis={perfis} operadorAtual={operador} onToggleAtivo={alternarAtivoUsuario} onAlterarPerfil={alterarPerfilUsuario} onDelete={excluirUsuario} onAlterarSenha={alterarMinhaSenha} podeGerenciar={ehAdmin} />}

          {screen === 'perfis' && <PerfisScreen usuarios={usuarios} perfis={perfis} onAlterarPermissao={alterarPermissaoPerfil} podeEditar={ehAdmin} />}

          {screen === 'auditoria' && <AuditoriaScreen auditoria={auditoria} />}
          </>
          )}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

// ---------- SUBCOMPONENTES ----------

const SYNC_INFO = {
  local: { texto: 'Salvo neste dispositivo', cor: '#8B8DA0' },
  conectando: { texto: 'Conectando à nuvem…', cor: '#F59E0B' },
  'precisa-login': { texto: 'Nuvem: faça login', cor: '#F59E0B' },
  sincronizando: { texto: 'Sincronizando…', cor: '#6D5DF6' },
  sincronizado: { texto: 'Sincronizado', cor: '#0F9C8C' },
  erro: { texto: 'Sem conexão — salvo localmente', cor: '#EF4444' },
};

function SyncBadge({ status, erroLocal, onClick }) {
  const info = erroLocal ? { texto: 'Falha ao salvar neste navegador', cor: '#EF4444' } : (SYNC_INFO[status] || SYNC_INFO.local);
  return (
    <button onClick={onClick} title="Estado de salvamento dos dados" style={{ marginLeft: 'auto', marginRight: 14, display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: CLOUD_ATIVA ? 'pointer' : 'default', padding: 0, fontSize: 11.5, fontWeight: 600, color: info.cor }}>
      <span style={{ width: 6, height: 6, borderRadius: 99, background: info.cor }} />
      {info.texto}
    </button>
  );
}

function NuvemPanel({ nuvem }) {
  const [email, setEmail] = useState('');
  const [senhaNuvem, setSenhaNuvem] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  async function entrar(e) {
    e.preventDefault();
    setErro('');
    setCarregando(true);
    const r = await nuvem.entrar(email.trim(), senhaNuvem);
    setCarregando(false);
    if (r) setErro(r); else setSenhaNuvem('');
  }

  const info = nuvem.erroLocal ? { texto: 'Falha ao salvar neste navegador', cor: C.danger } : (SYNC_INFO[nuvem.status] || SYNC_INFO.local);

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
        <Database size={15} color={C.primaryDark} />
        <span style={{ fontWeight: 700, fontSize: 13.5 }}>Nuvem (Supabase)</span>
        <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontSize: 11.5, fontWeight: 600, color: info.cor }}>
          <span style={{ width: 6, height: 6, borderRadius: 99, background: info.cor }} />{info.texto}
        </span>
      </div>

      {!nuvem.ativa ? (
        <div style={{ fontSize: 12.5, color: C.muted, lineHeight: 1.5 }}>
          <p style={{ margin: '8px 0' }}>Os dados já são salvos <strong>neste navegador</strong>. Para acessar os mesmos dados de vários dispositivos, configure o Supabase:</p>
          <ol style={{ margin: '0 0 8px', paddingLeft: 18 }}>
            <li>Crie um projeto em supabase.com e rode o arquivo <code>supabase/schema.sql</code> no SQL Editor.</li>
            <li>Crie um usuário em Authentication → Users (e-mail e senha).</li>
            <li>No Vercel, defina <code>VITE_SUPABASE_URL</code> e <code>VITE_SUPABASE_ANON_KEY</code> e faça um novo deploy.</li>
          </ol>
          <p style={{ margin: 0 }}>Passo a passo completo no <code>README.md</code> do projeto.</p>
        </div>
      ) : nuvem.status === 'precisa-login' ? (
        <form onSubmit={entrar}>
          <p style={{ fontSize: 12.5, color: C.muted, margin: '8px 0 14px' }}>Entre com o usuário criado no Supabase (Authentication) para liberar a sincronização neste dispositivo. É um login diferente do login do PDV.</p>
          <label style={labelSm}>E-mail</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={inputLightStyle} />
          <label style={{ ...labelSm, marginTop: 12 }}>Senha</label>
          <input type="password" value={senhaNuvem} onChange={(e) => setSenhaNuvem(e.target.value)} style={inputLightStyle} />
          {erro && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erro}</div>}
          <button type="submit" disabled={carregando} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16, opacity: carregando ? 0.6 : 1 }}>
            {carregando ? 'Entrando…' : 'Conectar à nuvem'}
          </button>
        </form>
      ) : (
        <div>
          <p style={{ fontSize: 12.5, color: C.muted, margin: '8px 0 14px' }}>Cada venda, compra, produto etc. é gravado como um registro separado, enviado automaticamente; as alterações de outros dispositivos chegam em tempo real. Dois caixas vendendo ao mesmo tempo não se sobrescrevem — só edições do mesmo registro (ex.: o mesmo produto) disputam, e vale a última.</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" onClick={nuvem.sincronizar} style={btnPrimary}><Upload size={14} /> Sincronizar agora</button>
            <button type="button" onClick={nuvem.sair} style={btnGhostSolid}><LogOut size={14} /> Sair da nuvem</button>
          </div>
        </div>
      )}
    </Card>
  );
}

function TrocarSenhaCard({ onAlterarSenha }) {
  const [atual, setAtual] = useState('');
  const [nova, setNova] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [msg, setMsg] = useState({ tipo: '', texto: '' });
  const [carregando, setCarregando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    if (nova !== confirmar) { setMsg({ tipo: 'erro', texto: 'As senhas novas não coincidem.' }); return; }
    setCarregando(true);
    const r = await onAlterarSenha({ atual, nova });
    setCarregando(false);
    if (r) { setMsg({ tipo: 'erro', texto: r }); return; }
    setAtual(''); setNova(''); setConfirmar('');
    setMsg({ tipo: 'ok', texto: 'Senha alterada.' });
  }

  return (
    <form onSubmit={enviar}>
      <Card style={{ marginTop: 18, maxWidth: 420 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
          <KeyRound size={15} color={C.primaryDark} />
          <span style={{ fontWeight: 700, fontSize: 13.5 }}>Alterar minha senha</span>
        </div>
        <label style={labelSm}>Senha atual</label>
        <input type="password" value={atual} onChange={(e) => setAtual(e.target.value)} style={inputLightStyle} />
        <label style={{ ...labelSm, marginTop: 12 }}>Nova senha (mín. 4 caracteres)</label>
        <input type="password" value={nova} onChange={(e) => setNova(e.target.value)} style={inputLightStyle} />
        <label style={{ ...labelSm, marginTop: 12 }}>Confirmar nova senha</label>
        <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} style={inputLightStyle} />
        {msg.texto && <div style={{ color: msg.tipo === 'erro' ? C.danger : C.accentDark, fontSize: 12, marginTop: 10 }}>{msg.texto}</div>}
        <button type="submit" disabled={carregando} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 14, opacity: carregando ? 0.6 : 1 }}>
          <Check size={14} /> {carregando ? 'Salvando…' : 'Alterar senha'}
        </button>
      </Card>
    </form>
  );
}

function AccessDeniedScreen({ area, perfil, onVoltar }) {
  const label = AREAS_SISTEMA.find((a) => a.key === area)?.label || area;
  return (
    <div style={{ maxWidth: 440, textAlign: 'center', margin: '60px auto 0' }}>
      <div style={{ width: 52, height: 52, borderRadius: 14, background: C.dangerBg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
        <ShieldCheck size={24} color={C.danger} />
      </div>
      <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 17, margin: '0 0 6px' }}>Acesso restrito</h2>
      <p style={{ color: C.muted, fontSize: 13, margin: '0 0 18px' }}>
        O perfil <strong>{perfil}</strong> não tem permissão para acessar <strong>{label}</strong>. Peça a um administrador para liberar essa área em Configurações → Permissões.
      </p>
      <button onClick={onVoltar} style={btnPrimary}><LayoutDashboard size={15} /> Voltar ao Dashboard</button>
    </div>
  );
}

function Toast({ toast }) {
  if (!toast) return null;
  const cor = toast.tipo === 'alerta' ? C.danger : C.accent;
  return (
    <div className="toast-anim" style={{
      position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)', zIndex: 1000,
      display: 'flex', alignItems: 'center', gap: 9, background: C.bgDark, color: C.textLight,
      padding: '11px 18px', borderRadius: 10, boxShadow: '0 10px 30px rgba(0,0,0,0.3)', border: `1px solid ${C.borderDark}`,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: 99, background: cor, boxShadow: `0 0 8px ${cor}` }} />
      <span style={{ fontSize: 13, fontWeight: 500 }}>{toast.msg}</span>
    </div>
  );
}

function BarcodeBars({ value = '', height = 14, width = 46 }) {
  const seed = String(value).split('').reduce((s, c) => s + c.charCodeAt(0), 0) || 42;
  const bars = Array.from({ length: 20 }, (_, i) => (((seed * (i + 3)) % 5) + 1));
  return (
    <svg width={width} height={height} viewBox={`0 0 ${bars.length * 2} 20`} preserveAspectRatio="none" style={{ display: 'block' }}>
      {bars.map((w, i) => (
        <rect key={i} x={i * 2} y="0" width={w > 2 ? 1.4 : 0.8} height="20" fill={C.textDark} />
      ))}
    </svg>
  );
}

const inputDarkStyle = {
  width: '100%', boxSizing: 'border-box', background: C.bgDark3, border: `1px solid ${C.borderDark}`,
  borderRadius: 8, padding: '10px 12px 10px 36px', color: C.textLight, fontSize: 14, outline: 'none',
};

function FieldDark({ icon: Icon, type = 'text', placeholder, value, onChange, last }) {
  return (
    <div style={{ position: 'relative', marginBottom: last ? 18 : 12 }}>
      <Icon size={16} color={C.muted} style={{ position: 'absolute', left: 12, top: 12 }} />
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={inputDarkStyle} />
    </div>
  );
}

function ErroBox({ erro }) {
  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.35)', borderRadius: 8, padding: '8px 10px', marginBottom: 16 }}>
      <AlertTriangle size={14} color={C.danger} />
      <span style={{ color: '#FCA5A5', fontSize: 12.5 }}>{erro}</span>
    </div>
  );
}

function Card({ children, style, className }) {
  return <div className={className} style={{ background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 16, padding: 18, boxShadow: '0 1px 3px rgba(30,20,60,0.04)', ...style }}>{children}</div>;
}

const CHART_COLORS = { Dinheiro: '#2DD4BF', 'Cartão Débito': '#60A5FA', 'Cartão Crédito': '#F59E0B', Pix: '#A78BFA' };

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: C.bgDark, border: `1px solid ${C.borderDark}`, borderRadius: 8, padding: '8px 12px', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}>
      {label && <div style={{ fontSize: 11, color: C.muted, marginBottom: 4, fontWeight: 600 }}>{label}</div>}
      {payload.map((p, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: C.textLight }}>
          <span style={{ width: 7, height: 7, borderRadius: 99, background: p.color || p.fill }} />
          {p.name}: <strong style={{ fontFamily: "'JetBrains Mono',monospace" }}>{formatter ? formatter(p.value) : p.value}</strong>
        </div>
      ))}
    </div>
  );
}

function KpiCard({ icon: Icon, iconColor, label, value, numericValue, formatter, sub, accentBar }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="pop-in"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 16,
        boxShadow: hover ? '0 10px 24px rgba(20,22,26,0.09)' : '0 1px 2px rgba(20,22,26,0.03)',
        transform: hover ? 'translateY(-3px)' : 'translateY(0)', transition: 'transform 0.22s cubic-bezier(.22,1,.36,1), box-shadow 0.22s ease', position: 'relative', overflow: 'hidden',
      }}
    >
      {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'transform 0.2s ease' }}>
          <Icon size={13.5} color={iconColor} strokeWidth={2.3} />
        </div>
        <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 21, color: C.textDark }}>
        {numericValue !== undefined ? <AnimatedNumber value={numericValue} formatter={formatter || ((v) => v)} /> : value}
      </div>
      {sub && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ caixa, valorEsperadoCaixa, vendasDoTurno, produtos, ultimoFechamento, vendas, onAbrirCaixa, onIrPDV }) {
  const totalVendido = vendasDoTurno.reduce((s, v) => s + v.total, 0);
  const ticketMedio = vendasDoTurno.length ? totalVendido / vendasDoTurno.length : 0;
  const baixoEstoque = produtos.filter((p) => p.estoque <= (p.estoqueMinimo ?? 10));

  const dados7dias = useMemo(() => {
    const dias = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const fimDia = d.getTime() + 86400000;
      const totalDia = vendas
        .filter((v) => !v.cancelada && v.hora >= d.getTime() && v.hora < fimDia)
        .reduce((s, v) => s + v.total, 0);
      dias.push({ dia: d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', ''), total: totalDia });
    }
    return dias;
  }, [vendas]);

  const vendas7diasFlat = useMemo(() => {
    const limite = Date.now() - 7 * 86400000;
    return vendas.filter((v) => !v.cancelada && v.hora >= limite);
  }, [vendas]);

  const dadosFormaPagamento = useMemo(() => {
    const t = {};
    vendas7diasFlat.forEach((v) => { t[v.forma] = (t[v.forma] || 0) + v.total; });
    return Object.entries(t).map(([forma, valor]) => ({ forma, valor }));
  }, [vendas7diasFlat]);

  const totalFormaPagamento = dadosFormaPagamento.reduce((s, d) => s + d.valor, 0);

  const topProdutos = useMemo(() => {
    const mapa = {};
    vendas7diasFlat.forEach((v) => v.itens.forEach((i) => { mapa[i.nome] = (mapa[i.nome] || 0) + i.qtd; }));
    return Object.entries(mapa).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([nome, qtd]) => ({ nome: nome.length > 18 ? nome.slice(0, 17) + '…' : nome, qtd }));
  }, [vendas7diasFlat]);

  return (
    <div style={{ maxWidth: 980 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 22, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Dashboard</h1>
          <p style={{ color: C.muted, fontSize: 13.5, margin: 0 }}>Visão geral do turno atual e desempenho recente.</p>
        </div>
        {!caixa.aberto ? (
          <button onClick={onAbrirCaixa} onMouseDown={rippleEffect} className="ripple" style={btnPrimary}><Wallet size={15} /> Abrir Caixa</button>
        ) : (
          <button onClick={onIrPDV} onMouseDown={rippleEffect} className="ripple" style={btnPrimary}><ShoppingCart size={15} /> Ir para o PDV</button>
        )}
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        <KpiCard icon={Wallet} iconColor={caixa.aberto ? C.accentDark : C.danger} accentBar={caixa.aberto ? C.accent : C.danger}
          label="Status do Caixa" value={caixa.aberto ? 'Aberto' : 'Fechado'} sub={caixa.aberto ? `desde ${hora(caixa.dataAbertura)}` : 'nenhum turno ativo'} />
        <KpiCard icon={Receipt} iconColor={C.accentDark} accentBar={C.accent}
          label="Vendas do Turno" numericValue={totalVendido} formatter={fmt} sub={`${vendasDoTurno.length} venda(s)`} />
        <KpiCard icon={TrendingUp} iconColor="#60A5FA" accentBar="#60A5FA"
          label="Ticket Médio" numericValue={ticketMedio} formatter={fmt} sub="por venda no turno" />
        <KpiCard icon={Banknote} iconColor="#F59E0B" accentBar="#F59E0B"
          label="Saldo em Caixa" value={caixa.aberto ? undefined : '—'} numericValue={caixa.aberto ? valorEsperadoCaixa : undefined} formatter={fmt} sub={caixa.aberto ? 'dinheiro em espécie' : 'caixa fechado'} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.7fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Vendas — últimos 7 dias</span>
            <BarChart3 size={14} color={C.muted} />
          </div>
          <div style={{ height: 220, marginTop: 8 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dados7dias} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="corVendas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.accent} stopOpacity={0.35} />
                    <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={C.borderLight} vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 11.5, fill: C.muted }} axisLine={{ stroke: C.borderLight }} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: C.muted }} axisLine={false} tickLine={false} width={0} />
                <Tooltip content={<ChartTooltip formatter={fmt} />} />
                <Area type="monotone" dataKey="total" name="Vendas" stroke={C.accentDark} strokeWidth={2.2} fill="url(#corVendas)" dot={{ r: 3, fill: C.accentDark, strokeWidth: 0 }} activeDot={{ r: 5 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Formas de pagamento</span>
            <span style={{ fontSize: 10.5, color: C.muted }}>7 dias</span>
          </div>
          {totalFormaPagamento === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 12.5 }}>Sem vendas no período.</div>
          ) : (
            <>
              <div style={{ height: 160, marginTop: 4 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={dadosFormaPagamento} dataKey="valor" nameKey="forma" innerRadius={44} outerRadius={68} paddingAngle={2} strokeWidth={0}>
                      {dadosFormaPagamento.map((d, i) => <Cell key={i} fill={CHART_COLORS[d.forma] || C.muted} />)}
                    </Pie>
                    <Tooltip content={<ChartTooltip formatter={fmt} />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 6 }}>
                {dadosFormaPagamento.map((d) => (
                  <div key={d.forma} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 99, background: CHART_COLORS[d.forma] || C.muted }} />
                    <span style={{ flex: 1, color: C.muted }}>{d.forma}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{fmt(d.valor)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
        <Card>
          <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Top produtos — últimos 7 dias</div>
          {topProdutos.length === 0 ? (
            <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 12.5 }}>Sem vendas no período.</div>
          ) : (
            <div style={{ height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProdutos} layout="vertical" margin={{ top: 4, right: 20, left: 4, bottom: 4 }}>
                  <CartesianGrid stroke={C.borderLight} horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 10.5, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="nome" width={110} tick={{ fontSize: 11.5, fill: C.textDark }} axisLine={false} tickLine={false} />
                  <Tooltip content={<ChartTooltip formatter={(v) => `${v} un.`} />} cursor={{ fill: C.bgLight }} />
                  <Bar dataKey="qtd" name="Qtd." fill={C.accent} radius={[0, 5, 5, 0]} barSize={14} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {baixoEstoque.length > 0 && (
            <Card>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <Package size={15} color={C.warn} />
                <span style={{ fontWeight: 700, fontSize: 13.5 }}>Estoque baixo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 120, overflow: 'auto' }}>
                {baixoEstoque.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                    <span>{p.nome}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", color: p.estoque <= 5 ? C.danger : C.warn, fontWeight: 600 }}>{p.estoque} un</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {ultimoFechamento && (
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 8 }}>Último fechamento</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5 }}>
                <span style={{ color: C.muted }}>Diferença de caixa</span>
                <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: ultimoFechamento.diferenca === 0 ? C.accentDark : ultimoFechamento.diferenca > 0 ? C.accentDark : C.danger }}>
                  {ultimoFechamento.diferenca > 0 ? '+' : ''}{fmt(ultimoFechamento.diferenca)}
                </span>
              </div>
            </Card>
          )}

          {baixoEstoque.length === 0 && !ultimoFechamento && (
            <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 12.5, minHeight: 100 }}>
              Tudo em ordem por aqui.
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

function AbrirCaixa({ valor, setValor, onConfirmar }) {
  return (
    <div style={{ maxWidth: 420 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Abrir Caixa</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Informe o valor inicial (fundo de troco) em dinheiro.</p>
      <form onSubmit={onConfirmar}>
        <Card>
          <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 8 }}>Valor de abertura</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgLight, border: `1px solid ${C.borderLight}`, borderRadius: 9, padding: '10px 14px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>R$</span>
            <input
              autoFocus value={valor} onChange={(e) => setValor(e.target.value)} placeholder="0,00" inputMode="decimal"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: 18, fontWeight: 600, flex: 1 }}
            />
          </div>
          <button type="submit" onMouseDown={rippleEffect} className="ripple" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <Check size={15} /> Confirmar Abertura
          </button>
        </Card>
      </form>
    </div>
  );
}

function PDVScreen({ produtos, busca, setBusca, onBuscaSubmit, categorias, categoriaAtiva, setCategoriaAtiva, carrinho, onAdd, onQtd, onRemover, total, onFinalizar }) {
  const qtdNoCarrinho = (id) => carrinho.find((i) => i.id === id)?.qtd || 0;

  return (
    <div style={{ display: 'flex', gap: 20, height: '100%' }}>
      <div style={{ flex: 1.4, minWidth: 0 }}>
        <form onSubmit={onBuscaSubmit} style={{ position: 'relative', marginBottom: 14 }}>
          <ScanLine size={17} color={C.accentDark} style={{ position: 'absolute', left: 13, top: 12.5 }} />
          <input
            value={busca} onChange={(e) => setBusca(e.target.value)} autoFocus
            placeholder="Bipar código de barras ou buscar por nome..."
            style={{
              width: '100%', boxSizing: 'border-box', padding: '11px 12px 11px 40px', borderRadius: 10,
              border: `1.5px solid ${C.borderLight}`, background: C.panel, fontSize: 14,
              fontFamily: "'JetBrains Mono',monospace", outline: 'none',
            }}
          />
          {busca && (
            <button type="button" onClick={() => setBusca('')} style={{ position: 'absolute', right: 10, top: 9, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X size={14} color={C.muted} />
            </button>
          )}
        </form>

        <div className="scroll-thin" style={{ display: 'flex', gap: 7, marginBottom: 16, overflowX: 'auto', paddingBottom: 2 }}>
          {categorias.map((c) => {
            const active = categoriaAtiva === c;
            return (
              <button key={c} onClick={() => setCategoriaAtiva(c)} style={{
                flexShrink: 0, padding: '7px 14px', borderRadius: 99, border: `1.5px solid ${active ? C.accentDark : C.borderLight}`,
                background: active ? C.accentDark : C.panel, color: active ? '#fff' : C.textDark, fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
              }}>
                {c}
              </button>
            );
          })}
        </div>

        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
          {produtos.map((p) => {
            const qtd = qtdNoCarrinho(p.id);
            return (
              <button key={p.id} className="prod-card" onClick={() => onAdd(p)} disabled={p.estoque <= 0} style={{
                position: 'relative', textAlign: 'left', background: C.panel, border: `1px solid ${qtd > 0 ? C.accentDark + '55' : C.borderLight}`, borderRadius: 11, padding: 14,
                cursor: p.estoque <= 0 ? 'not-allowed' : 'pointer', opacity: p.estoque <= 0 ? 0.45 : 1,
              }}>
                {qtd > 0 && (
                  <span style={{
                    position: 'absolute', top: -7, right: -7, minWidth: 20, height: 20, borderRadius: 99, background: C.accent,
                    color: C.bgDark, fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px',
                    boxShadow: '0 2px 6px rgba(45,212,191,0.5)',
                  }}>{qtd}</span>
                )}
                <div style={{ fontSize: 10.5, color: C.muted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 }}>{p.categoria}</div>
                <div style={{ fontSize: 13.5, fontWeight: 600, margin: '4px 0 6px', lineHeight: 1.25, minHeight: 34 }}>{p.nome}</div>
                <div style={{ fontSize: 9.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace", marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                  {p.codigoBarras ? <BarcodeBars value={p.codigoBarras} width={30} height={11} /> : <Barcode size={11} />} {p.codigoBarras || '—'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 15, color: C.accentDark }}>{fmt(p.preco)}</span>
                  <span style={{ fontSize: 11, color: p.estoque <= 5 ? C.danger : C.muted, fontWeight: 600 }}>{p.estoque <= 0 ? 'sem estoque' : `${p.estoque} un`}</span>
                </div>
              </button>
            );
          })}
          {produtos.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px 0', color: C.muted, fontSize: 13 }}>
              <Search size={20} style={{ marginBottom: 8, opacity: 0.5 }} /><br />Nenhum produto encontrado.
            </div>
          )}
        </div>
      </div>

      <div style={{ width: 330, flexShrink: 0, background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, display: 'flex', flexDirection: 'column', height: 'fit-content', position: 'sticky', top: 0, boxShadow: '0 1px 2px rgba(20,22,26,0.03)' }}>
        <div style={{ padding: '14px 16px', borderBottom: `1px solid ${C.borderLight}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <ShoppingCart size={15} />
          <span style={{ fontWeight: 700, fontSize: 13.5 }}>Carrinho</span>
          <span style={{ marginLeft: 'auto', fontSize: 11.5, fontWeight: 700, color: C.accentDark, background: 'rgba(45,212,191,0.12)', padding: '2px 8px', borderRadius: 99 }}>
            {carrinho.reduce((s, i) => s + i.qtd, 0)} itens
          </span>
        </div>
        <div className="scroll-thin" style={{ maxHeight: 380, overflow: 'auto', padding: '6px 10px' }}>
          {carrinho.length === 0 && (
            <div style={{ color: C.muted, fontSize: 12.5, textAlign: 'center', padding: '30px 0' }}>
              <ShoppingCart size={20} style={{ opacity: 0.35, marginBottom: 6 }} /><br />Carrinho vazio.<br />Bipe ou selecione um produto.
            </div>
          )}
          {carrinho.map((i) => (
            <div key={i.id} className="table-row fade-in" style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 6px', borderBottom: `1px solid ${C.borderLight}`, borderRadius: 6 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{i.nome}</div>
                <div style={{ fontSize: 11.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace", display: 'flex', alignItems: 'center', gap: 6 }}>
                  {fmt(i.preco)} · {fmt(i.preco * i.qtd)}
                  {i.codigoBarras && <BarcodeBars value={i.codigoBarras} width={26} height={10} />}
                </div>
              </div>
              <button onClick={() => onQtd(i.id, -1)} style={qtyBtn}><Minus size={11} /></button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12.5, width: 18, textAlign: 'center' }}>{i.qtd}</span>
              <button onClick={() => onQtd(i.id, 1)} style={qtyBtn}><Plus size={11} /></button>
              <button onClick={() => onRemover(i.id)} style={{ ...qtyBtn, color: C.danger }}><X size={11} /></button>
            </div>
          ))}
        </div>
        <div style={{ padding: 16, borderTop: `1px solid ${C.borderLight}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>Total</span>

            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 22 }}><AnimatedNumber value={total} formatter={fmt} /></span>
          </div>
          <button onClick={onFinalizar} onMouseDown={rippleEffect} disabled={carrinho.length === 0} className="ripple" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', opacity: carrinho.length === 0 ? 0.5 : 1, cursor: carrinho.length === 0 ? 'not-allowed' : 'pointer' }}>
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}

function PagamentoScreen({ subtotal, desconto, total, pagamento, setPagamento, onConfirmar, onVoltar, config, clientes }) {
  const formas = [
    { key: 'Dinheiro', icon: Banknote },
    { key: 'Cartão Débito', icon: CreditCard },
    { key: 'Cartão Crédito', icon: CreditCard },
    { key: 'Pix', icon: QrCode },
    { key: 'Credário', icon: Users },
  ];
  const recebido = parseFloat(String(pagamento.valorRecebido).replace(',', '.'));
  const troco = !isNaN(recebido) ? recebido - total : null;

  return (
    <div style={{ maxWidth: 480 }}>
      <button onClick={onVoltar} style={btnGhost}><ArrowLeft size={13} /> Voltar ao PDV</button>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '14px 0 18px' }}>Receber Pagamento</h1>

      <Card style={{ marginBottom: 14 }}>
        <Row label="Subtotal" value={fmt(subtotal)} muted />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>Desconto (R$)</span>
          <input
            value={pagamento.desconto} onChange={(e) => setPagamento({ ...pagamento, desconto: e.target.value })} placeholder="0,00" inputMode="decimal"
            style={{ width: 100, boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'right' }}
          />
        </div>
      </Card>

      <div className="pop-in" style={{ background: C.bgDark, borderRadius: 12, padding: 20, marginBottom: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 11.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Total a pagar</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 36, color: C.accent, textShadow: `0 0 18px ${C.accentGlow}`, marginTop: 4 }}><AnimatedNumber value={total} formatter={fmt} /></div>
        {desconto > 0 && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>desconto de {fmt(desconto)} aplicado</div>}
      </div>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 16 }}>
        {formas.map((f) => {
          const Icon = f.icon;
          const active = pagamento.forma === f.key;
          return (
            <button key={f.key} onClick={() => setPagamento((prev) => ({ ...prev, forma: f.key, valorRecebido: '', clienteId: '' }))} onMouseDown={rippleEffect} className="ripple" style={{
              display: 'flex', alignItems: 'center', gap: 7, padding: '11px 10px', borderRadius: 9,
              border: `1.5px solid ${active ? C.accentDark : C.borderLight}`, background: active ? 'rgba(45,212,191,0.08)' : C.panel, cursor: 'pointer',
            }}>
              <Icon size={15} color={active ? C.accentDark : C.muted} />
              <span style={{ fontSize: 12.5, fontWeight: 600, color: active ? C.accentDark : C.textDark }}>{f.key}</span>
            </button>
          );
        })}
      </div>

      {pagamento.forma === 'Dinheiro' && (
        <Card className="pop-in" style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 8 }}>Valor recebido do cliente</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgLight, border: `1px solid ${C.borderLight}`, borderRadius: 9, padding: '10px 14px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>R$</span>
            <input autoFocus value={pagamento.valorRecebido} onChange={(e) => setPagamento({ ...pagamento, valorRecebido: e.target.value })} placeholder="0,00" inputMode="decimal"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 600, flex: 1 }} />
          </div>
          {troco !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}>
              <span style={{ color: C.muted }}>Troco</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: troco < 0 ? C.danger : C.accentDark }}>{fmt(Math.max(troco, 0))}</span>
            </div>
          )}
        </Card>
      )}

      {pagamento.forma === 'Pix' && <PixCobranca config={config} valor={total} />}

      {pagamento.forma === 'Credário' && (
        <Card className="pop-in" style={{ marginBottom: 16 }}>
          <label style={labelSm}>Cliente</label>
          {clientes.length === 0 ? (
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 4 }}>Nenhum cliente cadastrado. Cadastre em <strong>Clientes</strong> antes de vender no credário.</div>
          ) : (
            <select value={pagamento.clienteId} onChange={(e) => setPagamento({ ...pagamento, clienteId: e.target.value })} style={inputLightStyle}>
              <option value="">Selecione o cliente...</option>
              {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome} {c.limiteCredito ? `(limite ${fmt(c.limiteCredito)})` : ''}</option>)}
            </select>
          )}
          <div style={{ fontSize: 11.5, color: C.muted, marginTop: 8 }}>O valor entra como conta a receber, com vencimento em 30 dias.</div>
        </Card>
      )}

      <button onClick={onConfirmar} onMouseDown={rippleEffect} className="ripple" style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>
        <Check size={15} /> Confirmar Pagamento
      </button>
    </div>
  );
}

function PixCobranca({ config, valor }) {
  const [qrUrl, setQrUrl] = useState('');
  const [copiado, setCopiado] = useState(false);

  const payload = useMemo(() => {
    if (!config.chavePix) return null;
    return gerarPayloadPix({
      chave: config.chavePix,
      nome: config.nomeRecebedorPix,
      cidade: config.cidadeRecebedorPix,
      valor,
      txid: `PDV${Date.now()}`,
    });
  }, [config.chavePix, config.nomeRecebedorPix, config.cidadeRecebedorPix, valor]);

  useEffect(() => {
    if (!payload) { setQrUrl(''); return; }
    let ativo = true;
    QRCode.toDataURL(payload, { width: 220, margin: 1, color: { dark: C.bgDark, light: '#FFFFFF' } })
      .then((url) => { if (ativo) setQrUrl(url); })
      .catch(() => { if (ativo) setQrUrl(''); });
    return () => { ativo = false; };
  }, [payload]);

  function copiar() {
    if (!payload) return;
    navigator.clipboard?.writeText(payload).then(() => {
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    });
  }

  if (!config.chavePix) {
    return (
      <Card style={{ marginBottom: 16, textAlign: 'center' }}>
        <AlertTriangle size={18} color={C.warn} style={{ marginBottom: 6 }} />
        <div style={{ fontSize: 12.5, color: C.muted }}>
          Nenhuma chave Pix configurada. Cadastre em <strong>Configurações</strong> para gerar o QR Code automaticamente.
        </div>
      </Card>
    );
  }

  return (
    <Card style={{ marginBottom: 16, textAlign: 'center' }}>
      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>
        O cliente escaneia o QR abaixo — o valor de <strong style={{ color: C.textDark }}>{fmt(valor)}</strong> já vem preenchido e cai direto na chave <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{normalizarChavePix(config.chavePix)}</span>.
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        {qrUrl ? (
          <img src={qrUrl} alt="QR Code Pix" width={200} height={200} style={{ borderRadius: 10, border: `1px solid ${C.borderLight}` }} />
        ) : (
          <div style={{ width: 200, height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.muted, fontSize: 12 }}>Gerando QR Code…</div>
        )}
      </div>
      <button type="button" onClick={copiar} style={{ ...btnGhostSolid, width: '100%', justifyContent: 'center' }}>
        {copiado ? <CheckCircle2 size={14} color={C.accentDark} /> : <QrCode size={14} />}
        {copiado ? 'Código copiado!' : 'Copiar Pix Copia e Cola'}
      </button>
    </Card>
  );
}

function CupomScreen({ venda, onNovaVenda, onImprimir }) {
  return (
    <div style={{ maxWidth: 420 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 18px' }}>Cupom Emitido</h1>

      <div style={{ background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 20, fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, fontFamily: "'Plus Jakarta Sans',sans-serif" }}>PDV TERMINAL</div>
          <div style={{ fontSize: 10.5, color: C.muted }}>Cupom Não Fiscal — Venda #{String(venda.numero).padStart(4, '0')}</div>
          <div style={{ fontSize: 10.5, color: C.muted }}>{dataHora(venda.hora)} · {venda.operador}</div>
        </div>
        <div style={{ borderTop: `1px dashed ${C.borderLight}`, borderBottom: `1px dashed ${C.borderLight}`, padding: '10px 0', margin: '10px 0' }}>
          {venda.itens.map((i) => (
            <div key={i.id} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span>{i.qtd}x {i.nome}</span>
                <span>{fmt(i.preco * i.qtd)}</span>
              </div>
              {i.codigoBarras && <div style={{ fontSize: 9, color: C.muted, marginTop: 1 }}>{i.codigoBarras}</div>}
            </div>
          ))}
        </div>
        {venda.desconto > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, marginBottom: 4 }}>
            <span>Subtotal</span><span>{fmt(venda.subtotal)}</span>
          </div>
        )}
        {venda.desconto > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.danger, marginBottom: 6 }}>
            <span>Desconto</span><span>-{fmt(venda.desconto)}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, fontWeight: 700 }}>
          <span>TOTAL</span><span>{fmt(venda.total)}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.muted, marginTop: 6 }}>
          <span>Forma de pagamento</span><span>{venda.forma}</span>
        </div>
        {venda.forma === 'Dinheiro' && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: C.muted }}>
            <span>Troco</span><span>{fmt(venda.troco)}</span>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 18 }}>
        <ProcessLine label="Estoque baixado" detail={`${venda.itens.reduce((s, i) => s + i.qtd, 0)} item(ns) atualizados`} />
        <ProcessLine label="Lançamento financeiro registrado" detail={fmt(venda.total)} />
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={onImprimir} style={{ ...btnGhostSolid, flex: 1, justifyContent: 'center' }}><Printer size={14} /> Imprimir</button>
        <button onClick={onNovaVenda} style={{ ...btnPrimary, flex: 1, justifyContent: 'center' }}><Plus size={14} /> Nova Venda</button>
      </div>
    </div>
  );
}

function ProcessLine({ label, detail }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9, background: 'rgba(45,212,191,0.08)', border: `1px solid rgba(45,212,191,0.3)`, borderRadius: 8, padding: '8px 12px' }}>
      <Check size={14} color={C.accentDark} />
      <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>{label}</span>
      <span style={{ fontSize: 11.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>{detail}</span>
    </div>
  );
}

function FecharCaixaScreen({ caixa, totaisPorForma, valorEsperado, qtdVendas, valorContado, setValorContado, onConfirmar, totalSangrias, qtdSangrias }) {
  const contado = parseFloat(String(valorContado).replace(',', '.'));
  const diferenca = !isNaN(contado) ? contado - valorEsperado : null;
  return (
    <div style={{ maxWidth: 460 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Fechar Caixa</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Conferência do turno iniciado às {hora(caixa.dataAbertura)}.</p>

      <Card style={{ marginBottom: 16 }}>
        <Row label="Abertura de caixa" value={fmt(caixa.valorAbertura)} />
        <Row label="Vendas em dinheiro" value={fmt(totaisPorForma.Dinheiro || 0)} />
        <Row label="Vendas cartão débito" value={fmt(totaisPorForma['Cartão Débito'] || 0)} muted />
        <Row label="Vendas cartão crédito" value={fmt(totaisPorForma['Cartão Crédito'] || 0)} muted />
        <Row label="Vendas Pix" value={fmt(totaisPorForma.Pix || 0)} muted />
        {qtdSangrias > 0 && <Row label={`Sangrias (${qtdSangrias})`} value={`- ${fmt(totalSangrias)}`} />}
        <div style={{ borderTop: `1px solid ${C.borderLight}`, margin: '10px 0' }} />
        <Row label={`Esperado em espécie (${qtdVendas} venda(s))`} value={fmt(valorEsperado)} bold />
      </Card>

      <form onSubmit={onConfirmar}>
        <Card>
          <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 8 }}>Valor contado no caixa (dinheiro)</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgLight, border: `1px solid ${C.borderLight}`, borderRadius: 9, padding: '10px 14px' }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>R$</span>
            <input autoFocus value={valorContado} onChange={(e) => setValorContado(e.target.value)} placeholder="0,00" inputMode="decimal"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 600, flex: 1 }} />
          </div>
          {diferenca !== null && (
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 13 }}>
              <span style={{ color: C.muted }}>Diferença</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: diferenca === 0 ? C.accentDark : diferenca > 0 ? C.warn : C.danger }}>
                {diferenca > 0 ? '+' : ''}{fmt(diferenca)}
              </span>
            </div>
          )}
          <button type="submit" style={{ ...btnDanger, width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <Wallet size={15} /> Confirmar Fechamento
          </button>
        </Card>
      </form>
    </div>
  );
}

function Row({ label, value, bold, muted }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
      <span style={{ fontSize: 13, color: muted ? C.muted : C.textDark }}>{label}</span>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: bold ? 700 : 500, color: muted ? C.muted : C.textDark }}>{value}</span>
    </div>
  );
}

const MOV_COLORS = { Venda: C.danger, Compra: C.accentDark, Ajuste: '#F59E0B', Estorno: '#60A5FA', Inventário: '#A78BFA' };

function MovimentacoesScreen({ movimentos }) {
  const [filtro, setFiltro] = useState('Todos');
  const tipos = ['Todos', 'Venda', 'Compra', 'Ajuste', 'Estorno', 'Inventário'];
  const lista = useMemo(() => {
    const l = filtro === 'Todos' ? movimentos : movimentos.filter((m) => m.tipo === filtro);
    return [...l].reverse();
  }, [movimentos, filtro]);

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Movimentações de Estoque</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 16px' }}>Histórico completo de entradas e saídas.</p>

      <div style={{ display: 'flex', gap: 7, marginBottom: 16, flexWrap: 'wrap' }}>
        {tipos.map((t) => (
          <button key={t} onClick={() => setFiltro(t)} style={{
            padding: '6px 13px', borderRadius: 99, border: `1.5px solid ${filtro === t ? C.accentDark : C.borderLight}`,
            background: filtro === t ? 'rgba(45,212,191,0.08)' : C.panel, color: filtro === t ? C.accentDark : C.textDark,
            fontSize: 12.5, fontWeight: 600, cursor: 'pointer',
          }}>
            {t}
          </button>
        ))}
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 90 }}>Tipo</span>
          <span style={{ flex: 1.4 }}>Produto</span>
          <span style={{ flex: 1 }}>Motivo</span>
          <span style={{ width: 80, textAlign: 'right' }}>Qtd.</span>
          <span style={{ width: 110, textAlign: 'right' }}>Data/Hora</span>
        </div>
        {lista.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma movimentação registrada.</div>}
        {lista.map((m) => (
          <div key={m.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 12.5 }}>
            <span style={{ width: 90 }}>
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: `${MOV_COLORS[m.tipo] || C.muted}18`, color: MOV_COLORS[m.tipo] || C.muted }}>{m.tipo}</span>
            </span>
            <span style={{ flex: 1.4, fontWeight: 500 }}>{m.produtoNome}</span>
            <span style={{ flex: 1, color: C.muted, fontSize: 12 }}>{m.motivo}</span>
            <span style={{ width: 80, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: m.quantidade > 0 ? C.accentDark : C.danger }}>
              {m.quantidade > 0 ? '+' : ''}{m.quantidade}
            </span>
            <span style={{ width: 110, textAlign: 'right', color: C.muted, fontSize: 11.5, fontFamily: "'JetBrains Mono',monospace" }}>{dataHora(m.hora)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function InventarioScreen({ produtos, onAplicar }) {
  const [contagens, setContagens] = useState({});

  function setContagem(id, valor) {
    setContagens((prev) => ({ ...prev, [id]: valor }));
  }

  const diffs = useMemo(() => {
    const d = {};
    Object.entries(contagens).forEach(([id, valor]) => {
      const produto = produtos.find((p) => p.id === Number(id));
      if (!produto || valor === '') return;
      const n = parseInt(valor, 10);
      if (isNaN(n)) return;
      d[id] = n - produto.estoque;
    });
    return d;
  }, [contagens, produtos]);

  const qtdDivergencias = Object.values(diffs).filter((d) => d !== 0).length;

  function aplicar() {
    const contagensNum = {};
    Object.entries(contagens).forEach(([id, valor]) => {
      const n = parseInt(valor, 10);
      if (!isNaN(n)) contagensNum[id] = n;
    });
    onAplicar(contagensNum);
    setContagens({});
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Inventário</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 16px' }}>Faça a contagem física e aplique os ajustes de uma vez.</p>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Produto</span>
          <span style={{ width: 90, textAlign: 'right' }}>Sistema</span>
          <span style={{ width: 100, textAlign: 'right' }}>Contagem</span>
          <span style={{ width: 90, textAlign: 'right' }}>Diferença</span>
        </div>
        {produtos.map((p) => {
          const diff = diffs[p.id];
          return (
            <div key={p.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <span style={{ flex: 1.6, fontWeight: 500 }}>{p.nome}</span>
              <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{p.estoque}</span>
              <span style={{ width: 100, textAlign: 'right' }}>
                <input
                  value={contagens[p.id] ?? ''} onChange={(e) => setContagem(p.id, e.target.value)} placeholder="—" inputMode="numeric"
                  style={{ width: 70, boxSizing: 'border-box', textAlign: 'right', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5, fontFamily: "'JetBrains Mono',monospace" }}
                />
              </span>
              <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: diff === undefined || diff === 0 ? C.muted : diff > 0 ? C.accentDark : C.danger }}>
                {diff === undefined ? '—' : `${diff > 0 ? '+' : ''}${diff}`}
              </span>
            </div>
          );
        })}
      </Card>

      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <button onClick={aplicar} disabled={qtdDivergencias === 0} style={{ ...btnPrimary, opacity: qtdDivergencias === 0 ? 0.5 : 1, cursor: qtdDivergencias === 0 ? 'not-allowed' : 'pointer' }}>
          <Check size={15} /> Aplicar Ajustes
        </button>
        <span style={{ fontSize: 12.5, color: C.muted }}>{qtdDivergencias} divergência(s) encontrada(s)</span>
      </div>
    </div>
  );
}

function AjusteEstoqueScreen({ produtos, onAjustar }) {
  const [produtoId, setProdutoId] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  const produto = produtos.find((p) => p.id === Number(produtoId));

  function submit(e) {
    e.preventDefault();
    const n = parseInt(quantidade, 10);
    if (!produtoId) { setErro('Selecione um produto.'); return; }
    if (isNaN(n) || n <= 0) { setErro('Informe uma quantidade válida.'); return; }
    if (tipo === 'saida' && produto && n > produto.estoque) { setErro('Quantidade maior que o estoque disponível.'); return; }
    onAjustar({ produtoId: Number(produtoId), quantidade: tipo === 'entrada' ? n : -n, motivo: motivo.trim() || (tipo === 'entrada' ? 'Ajuste de entrada' : 'Ajuste de saída') });
    setProdutoId(''); setQuantidade(''); setMotivo(''); setErro('');
  }

  return (
    <div style={{ maxWidth: 460 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Ajuste de Estoque</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Correções pontuais — perdas, quebras, doações, achados.</p>

      <form onSubmit={submit}>
        <Card>
          <label style={labelSm}>Produto</label>
          <select value={produtoId} onChange={(e) => setProdutoId(e.target.value)} style={{ ...inputLightStyle, marginBottom: 14 }}>
            <option value="">Selecione um produto...</option>
            {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} (estoque: {p.estoque})</option>)}
          </select>

          <label style={labelSm}>Tipo de ajuste</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14, marginTop: 4 }}>
            {[{ v: 'entrada', l: 'Entrada (+)' }, { v: 'saida', l: 'Saída (−)' }].map((o) => (
              <button type="button" key={o.v} onClick={() => setTipo(o.v)} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${tipo === o.v ? C.accentDark : C.borderLight}`,
                background: tipo === o.v ? 'rgba(45,212,191,0.08)' : C.panel, color: tipo === o.v ? C.accentDark : C.textDark, fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>
                {o.l}
              </button>
            ))}
          </div>

          <label style={labelSm}>Quantidade</label>
          <input value={quantidade} onChange={(e) => setQuantidade(e.target.value)} inputMode="numeric" placeholder="0" style={{ ...inputLightStyle, marginBottom: 14 }} />

          <label style={labelSm}>Motivo</label>
          <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: produto vencido, quebra no transporte..." style={inputLightStyle} />

          {erro && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erro}</div>}

          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 18 }}>
            <SlidersHorizontal size={15} /> Aplicar Ajuste
          </button>
        </Card>
      </form>
    </div>
  );
}

function AlertasEstoqueScreen({ produtos, onIrCompras }) {
  const alertas = produtos.filter((p) => p.estoque <= (p.estoqueMinimo ?? 10)).sort((a, b) => a.estoque - b.estoque);
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Alertas de Estoque</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Produtos no ou abaixo do estoque mínimo cadastrado.</p>

      {alertas.length === 0 ? (
        <Card style={{ textAlign: 'center', padding: 32, color: C.muted, fontSize: 13 }}>
          <CheckCircle2 size={20} color={C.accentDark} style={{ marginBottom: 8 }} /><br />Nenhum produto abaixo do mínimo.
        </Card>
      ) : (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
            <span style={{ flex: 1.6 }}>Produto</span>
            <span style={{ width: 90, textAlign: 'right' }}>Estoque</span>
            <span style={{ width: 90, textAlign: 'right' }}>Mínimo</span>
          </div>
          {alertas.map((p) => (
            <div key={p.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <span style={{ flex: 1.6, display: 'flex', alignItems: 'center', gap: 7 }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: p.estoque === 0 ? C.danger : C.warn }} />
                {p.nome}
              </span>
              <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: p.estoque === 0 ? C.danger : C.warn }}>{p.estoque}</span>
              <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{p.estoqueMinimo ?? 10}</span>
            </div>
          ))}
        </Card>
      )}

      <button onClick={onIrCompras} style={{ ...btnPrimary, marginTop: 16 }}>
        <Truck size={15} /> Registrar nova compra
      </button>
    </div>
  );
}

function NovaCompraScreen({ produtos, fornecedores, onConfirmar }) {
  const [fornecedorId, setFornecedorId] = useState('');
  const [itens, setItens] = useState([]);
  const [produtoSel, setProdutoSel] = useState('');
  const [qtdSel, setQtdSel] = useState('');
  const [custoSel, setCustoSel] = useState('');
  const [frete, setFrete] = useState('');
  const [desconto, setDesconto] = useState('');
  const [erro, setErro] = useState('');

  function adicionarItem() {
    const produto = produtos.find((p) => p.id === Number(produtoSel));
    const qtd = parseInt(qtdSel, 10);
    const custo = parseFloat(String(custoSel).replace(',', '.'));
    if (!produto) { setErro('Selecione um produto.'); return; }
    if (isNaN(qtd) || qtd <= 0) { setErro('Informe uma quantidade válida.'); return; }
    if (isNaN(custo) || custo < 0) { setErro('Informe um custo unitário válido.'); return; }
    setItens((prev) => {
      const existe = prev.find((i) => i.produtoId === produto.id);
      if (existe) return prev.map((i) => (i.produtoId === produto.id ? { ...i, qtd: i.qtd + qtd, custo } : i));
      return [...prev, { produtoId: produto.id, nome: produto.nome, qtd, custo }];
    });
    setProdutoSel(''); setQtdSel(''); setCustoSel(''); setErro('');
  }

  function removerItem(id) {
    setItens((prev) => prev.filter((i) => i.produtoId !== id));
  }

  const subtotal = itens.reduce((s, i) => s + i.qtd * i.custo, 0);
  const freteNum = parseFloat(String(frete).replace(',', '.')) || 0;
  const descontoNum = parseFloat(String(desconto).replace(',', '.')) || 0;
  const total = Math.max(subtotal + freteNum - descontoNum, 0);

  function finalizarCompra() {
    if (!fornecedorId) { setErro('Selecione um fornecedor.'); return; }
    if (itens.length === 0) { setErro('Adicione ao menos um item à compra.'); return; }
    onConfirmar({ fornecedorId: Number(fornecedorId), itens, frete: freteNum, desconto: descontoNum });
    setFornecedorId(''); setItens([]); setFrete(''); setDesconto(''); setErro('');
  }

  const cellInput = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '6px 8px', fontSize: 12.5 };

  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Nova Compra</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Ao confirmar, o estoque aumenta e o custo do produto é atualizado.</p>

      <Card style={{ marginBottom: 16 }}>
        <label style={labelSm}>Fornecedor</label>
        <select value={fornecedorId} onChange={(e) => setFornecedorId(e.target.value)} style={inputLightStyle}>
          <option value="">Selecione um fornecedor...</option>
          {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
        </select>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Adicionar item</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 0.8fr 1fr auto', gap: 8, alignItems: 'end' }}>
          <div>
            <label style={labelSm}>Produto</label>
            <select value={produtoSel} onChange={(e) => { setProdutoSel(e.target.value); const p = produtos.find(pp => pp.id === Number(e.target.value)); if (p) setCustoSel(String(p.custo || '')); }} style={cellInput}>
              <option value="">Selecione...</option>
              {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
            </select>
          </div>
          <div>
            <label style={labelSm}>Qtd.</label>
            <input value={qtdSel} onChange={(e) => setQtdSel(e.target.value)} inputMode="numeric" placeholder="0" style={cellInput} />
          </div>
          <div>
            <label style={labelSm}>Custo unit. (R$)</label>
            <input value={custoSel} onChange={(e) => setCustoSel(e.target.value)} inputMode="decimal" placeholder="0,00" style={cellInput} />
          </div>
          <button type="button" onClick={adicionarItem} style={{ ...btnGhostSolid, height: 33, padding: '0 14px' }}><Plus size={14} /> Adicionar</button>
        </div>
        {erro && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erro}</div>}
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Produto</span>
          <span style={{ width: 70, textAlign: 'right' }}>Qtd.</span>
          <span style={{ width: 90, textAlign: 'right' }}>Custo</span>
          <span style={{ width: 100, textAlign: 'right' }}>Subtotal</span>
          <span style={{ width: 40 }} />
        </div>
        {itens.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>Nenhum item adicionado ainda.</div>}
        {itens.map((i) => (
          <div key={i.produtoId} style={{ display: 'flex', alignItems: 'center', padding: '8px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
            <span style={{ flex: 1.6 }}>{i.nome}</span>
            <span style={{ width: 70, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{i.qtd}</span>
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{fmt(i.custo)}</span>
            <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{fmt(i.qtd * i.custo)}</span>
            <span style={{ width: 40, textAlign: 'right' }}>
              <button onClick={() => removerItem(i.produtoId)} style={iconBtn}><X size={13} color={C.danger} /></button>
            </span>
          </div>
        ))}
      </Card>

      <Card>
        <Row label="Subtotal" value={fmt(subtotal)} muted />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>Frete (R$)</span>
          <input value={frete} onChange={(e) => setFrete(e.target.value)} placeholder="0,00" inputMode="decimal" style={{ width: 100, boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'right' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ fontSize: 13, color: C.muted, flex: 1 }}>Desconto (R$)</span>
          <input value={desconto} onChange={(e) => setDesconto(e.target.value)} placeholder="0,00" inputMode="decimal" style={{ width: 100, boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 8px', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, textAlign: 'right' }} />
        </div>
        <div style={{ borderTop: `1px solid ${C.borderLight}`, margin: '10px 0' }} />
        <Row label="TOTAL" value={fmt(total)} bold />
        <button onClick={finalizarCompra} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16 }}>
          <Check size={15} /> Confirmar Compra
        </button>
      </Card>
    </div>
  );
}

function HistoricoComprasScreen({ compras }) {
  const [expandido, setExpandido] = useState(null);
  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Histórico de Compras</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Todas as compras registradas de fornecedores.</p>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 60 }}>Nº</span>
          <span style={{ flex: 1 }}>Fornecedor / Data</span>
          <span style={{ width: 100, textAlign: 'right' }}>Total</span>
        </div>
        {compras.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma compra registrada ainda.</div>}
        {[...compras].reverse().map((c) => {
          const aberto = expandido === c.id;
          return (
            <div key={c.id} className="table-row" style={{ borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', fontSize: 13 }}>
                <button onClick={() => setExpandido(aberto ? null : c.id)} style={{ width: 60, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, padding: 0 }}>
                  #{String(c.numero).padStart(4, '0')}
                </button>
                <span style={{ flex: 1, color: C.muted, fontSize: 12.5 }}>{c.fornecedorNome} · {dataHora(c.hora)}</span>
                <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmt(c.total)}</span>
              </div>
              {aberto && (
                <div style={{ padding: '0 16px 12px 76px' }}>
                  {c.itens.map((i) => (
                    <div key={i.produtoId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: C.muted, padding: '2px 0' }}>
                      <span>{i.qtd}x {i.nome} · custo {fmt(i.custo)}</span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(i.qtd * i.custo)}</span>
                    </div>
                  ))}
                  <div style={{ fontSize: 11.5, color: C.muted, marginTop: 6 }}>
                    Frete: {fmt(c.frete)} · Desconto: {fmt(c.desconto)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function FornecedoresScreen({ fornecedores, onAdd, onEdit, onDelete }) {
  const [novo, setNovo] = useState({ nome: '', contato: '', telefone: '', cnpj: '' });
  const [erroForm, setErroForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const cellInput = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5 };

  function submitNovo(e) {
    e.preventDefault();
    if (!novo.nome.trim()) { setErroForm('Informe ao menos o nome do fornecedor.'); return; }
    onAdd({ nome: novo.nome.trim(), contato: novo.contato.trim(), telefone: novo.telefone.trim(), cnpj: novo.cnpj.trim() });
    setNovo({ nome: '', contato: '', telefone: '', cnpj: '' });
    setErroForm('');
  }

  function iniciarEdicao(f) {
    setEditId(f.id);
    setEditValues({ nome: f.nome, contato: f.contato, telefone: f.telefone, cnpj: f.cnpj });
  }

  function salvarEdicao(id) {
    if (!editValues.nome.trim()) return;
    onEdit(id, editValues);
    setEditId(null);
  }

  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Fornecedores</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Cadastro usado nas compras de mercadoria.</p>

      <form onSubmit={submitNovo}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Novo fornecedor</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div>
              <label style={labelSm}>Nome</label>
              <input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Distribuidora X" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Contato</label>
              <input value={novo.contato} onChange={(e) => setNovo({ ...novo, contato: e.target.value })} placeholder="Nome do vendedor" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Telefone</label>
              <input value={novo.telefone} onChange={(e) => setNovo({ ...novo, telefone: e.target.value })} placeholder="(11) 99999-9999" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>CNPJ</label>
              <input value={novo.cnpj} onChange={(e) => setNovo({ ...novo, cnpj: e.target.value })} placeholder="00.000.000/0000-00" style={cellInput} />
            </div>
            <button type="submit" style={{ ...btnPrimary, height: 33, padding: '0 14px' }}><Plus size={14} /> Adicionar</button>
          </div>
          {erroForm && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erroForm}</div>}
        </Card>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Nome</span>
          <span style={{ flex: 1.2 }}>Contato</span>
          <span style={{ flex: 1 }}>Telefone</span>
          <span style={{ flex: 1 }}>CNPJ</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {fornecedores.map((f) => {
          const editando = editId === f.id;
          return (
            <div key={f.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
              {editando ? (
                <>
                  <input value={editValues.nome} onChange={(e) => setEditValues({ ...editValues, nome: e.target.value })} style={{ ...cellInput, flex: 1.6 }} />
                  <input value={editValues.contato} onChange={(e) => setEditValues({ ...editValues, contato: e.target.value })} style={{ ...cellInput, flex: 1.2 }} />
                  <input value={editValues.telefone} onChange={(e) => setEditValues({ ...editValues, telefone: e.target.value })} style={{ ...cellInput, flex: 1 }} />
                  <input value={editValues.cnpj} onChange={(e) => setEditValues({ ...editValues, cnpj: e.target.value })} style={{ ...cellInput, flex: 1 }} />
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => salvarEdicao(f.id)} style={iconBtn}><Check size={13} color={C.accentDark} /></button>
                    <button onClick={() => setEditId(null)} style={iconBtn}><X size={13} color={C.muted} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: 1.6, fontWeight: 500 }}>{f.nome}</span>
                  <span style={{ flex: 1.2, color: C.muted }}>{f.contato || '—'}</span>
                  <span style={{ flex: 1, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{f.telefone || '—'}</span>
                  <span style={{ flex: 1, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{f.cnpj || '—'}</span>
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => iniciarEdicao(f)} style={iconBtn}><Pencil size={13} color={C.muted} /></button>
                    <button onClick={() => onDelete(f.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {fornecedores.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum fornecedor cadastrado.</div>}
      </Card>
    </div>
  );
}

function FluxoCaixaScreen({ financeiro }) {
  const entradas = financeiro.filter((f) => f.valor > 0).reduce((s, f) => s + f.valor, 0);
  const saidas = financeiro.filter((f) => f.valor < 0).reduce((s, f) => s + f.valor, 0);
  const saldo = entradas + saidas;
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Fluxo de Caixa</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Todos os lançamentos registrados automaticamente pelo sistema.</p>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        <Card>
          <span style={labelSm}>Entradas</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.accentDark }}>{fmt(entradas)}</div>
        </Card>
        <Card>
          <span style={labelSm}>Saídas</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.danger }}>{fmt(Math.abs(saidas))}</div>
        </Card>
        <Card>
          <span style={labelSm}>Saldo</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: saldo >= 0 ? C.accentDark : C.danger }}>{fmt(saldo)}</div>
        </Card>
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11.5, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1 }}>Lançamento</span>
          <span style={{ width: 90, textAlign: 'right' }}>Valor</span>
          <span style={{ width: 70, textAlign: 'right' }}>Hora</span>
        </div>
        {financeiro.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}><ListChecks size={18} style={{ marginBottom: 6 }} /><br />Nenhum lançamento ainda.</div>}
        {[...financeiro].reverse().map((f) => (
          <div key={f.id} className="table-row" style={{ display: 'flex', padding: '10px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
            <span style={{ flex: 1 }}>{f.tipo}</span>
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: f.valor < 0 ? C.danger : C.textDark }}>{fmt(f.valor)}</span>
            <span style={{ width: 70, textAlign: 'right', color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{hora(f.hora)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function gerarCodigoBarras() {
  let n = '789';
  for (let i = 0; i < 10; i++) n += Math.floor(Math.random() * 10);
  return n;
}

function ProdutosScreen({ produtos, categorias, onAdd, onEdit, onDelete }) {
  const [novo, setNovo] = useState({ nome: '', categoria: '', preco: '', custo: '', estoque: '', estoqueMinimo: '', codigoBarras: '' });
  const [erroForm, setErroForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});

  function submitNovo(e) {
    e.preventDefault();
    const preco = parseFloat(String(novo.preco).replace(',', '.'));
    const custo = novo.custo ? parseFloat(String(novo.custo).replace(',', '.')) : 0;
    const estoque = parseInt(novo.estoque, 10);
    const estoqueMinimo = novo.estoqueMinimo ? parseInt(novo.estoqueMinimo, 10) : 10;
    if (!novo.nome.trim() || !novo.categoria.trim() || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) {
      setErroForm('Preencha nome, categoria, preço e estoque corretamente.');
      return;
    }
    if (novo.codigoBarras && produtos.some((p) => p.codigoBarras === novo.codigoBarras.trim())) {
      setErroForm('Já existe um produto com esse código de barras.');
      return;
    }
    onAdd({ nome: novo.nome.trim(), categoria: novo.categoria.trim(), preco, custo: isNaN(custo) ? 0 : custo, estoque, estoqueMinimo: isNaN(estoqueMinimo) ? 10 : estoqueMinimo, codigoBarras: novo.codigoBarras.trim() || gerarCodigoBarras() });
    setNovo({ nome: '', categoria: '', preco: '', custo: '', estoque: '', estoqueMinimo: '', codigoBarras: '' });
    setErroForm('');
  }

  function iniciarEdicao(p) {
    setEditId(p.id);
    setEditValues({ nome: p.nome, categoria: p.categoria, preco: String(p.preco), custo: String(p.custo || 0), estoque: String(p.estoque), estoqueMinimo: String(p.estoqueMinimo ?? 10), codigoBarras: p.codigoBarras || '' });
  }

  function salvarEdicao(id) {
    const preco = parseFloat(String(editValues.preco).replace(',', '.'));
    const custo = parseFloat(String(editValues.custo).replace(',', '.'));
    const estoque = parseInt(editValues.estoque, 10);
    const estoqueMinimo = parseInt(editValues.estoqueMinimo, 10);
    if (!editValues.nome.trim() || !editValues.categoria.trim() || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) return;
    onEdit(id, { nome: editValues.nome.trim(), categoria: editValues.categoria.trim(), preco, custo: isNaN(custo) ? 0 : custo, estoque, estoqueMinimo: isNaN(estoqueMinimo) ? 10 : estoqueMinimo, codigoBarras: editValues.codigoBarras.trim() });
    setEditId(null);
  }

  const cellInput = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5, fontFamily: "'Inter',sans-serif" };
  const cellInputMono = { ...cellInput, fontFamily: "'JetBrains Mono',monospace" };

  return (
    <div style={{ maxWidth: 980 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Cadastro de Produtos</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Adicione, edite ou remova itens do catálogo, incluindo código de barras.</p>

      <form onSubmit={submitNovo}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Novo produto</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.1fr 0.8fr 0.8fr 0.8fr 0.8fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelSm}>Nome</label>
              <input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Ex: Suco de Laranja 1L" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Categoria</label>
              <input value={novo.categoria} onChange={(e) => setNovo({ ...novo, categoria: e.target.value })} placeholder="Bebidas" style={cellInput} list="lista-categorias" />
              <datalist id="lista-categorias">
                {categorias.map((c) => <option key={c.id} value={c.nome} />)}
              </datalist>
            </div>
            <div>
              <label style={labelSm}>Preço (R$)</label>
              <input value={novo.preco} onChange={(e) => setNovo({ ...novo, preco: e.target.value })} placeholder="0,00" inputMode="decimal" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Custo (R$)</label>
              <input value={novo.custo} onChange={(e) => setNovo({ ...novo, custo: e.target.value })} placeholder="0,00" inputMode="decimal" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Estoque</label>
              <input value={novo.estoque} onChange={(e) => setNovo({ ...novo, estoque: e.target.value })} placeholder="0" inputMode="numeric" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Estoque mín.</label>
              <input value={novo.estoqueMinimo} onChange={(e) => setNovo({ ...novo, estoqueMinimo: e.target.value })} placeholder="10" inputMode="numeric" style={cellInput} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelSm}>Código de barras</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <Barcode size={14} color={C.muted} style={{ position: 'absolute', left: 9, top: 9 }} />
                  <input
                    value={novo.codigoBarras}
                    onChange={(e) => setNovo({ ...novo, codigoBarras: e.target.value })}
                    placeholder="Bipe ou digite — deixe em branco para gerar automático"
                    style={{ ...cellInputMono, paddingLeft: 28, width: '100%' }}
                  />
                </div>
                <button type="button" onClick={() => setNovo({ ...novo, codigoBarras: gerarCodigoBarras() })} style={{ ...btnGhostSolid, padding: '0 12px', height: 33 }} title="Gerar código automático">
                  <Barcode size={13} /> Gerar
                </button>
              </div>
            </div>
            <button type="submit" style={{ ...btnPrimary, height: 33, padding: '0 18px', flexShrink: 0 }}><Plus size={14} /> Adicionar</button>
          </div>
          {erroForm && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erroForm}</div>}
        </Card>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Produto</span>
          <span style={{ flex: 0.9 }}>Categoria</span>
          <span style={{ width: 110 }}>Cód. barras</span>
          <span style={{ width: 80, textAlign: 'right' }}>Custo</span>
          <span style={{ width: 80, textAlign: 'right' }}>Preço</span>
          <span style={{ width: 60, textAlign: 'right' }}>Estoq.</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {produtos.map((p) => {
          const editando = editId === p.id;
          return (
            <div key={p.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
              {editando ? (
                <>
                  <input value={editValues.nome} onChange={(e) => setEditValues({ ...editValues, nome: e.target.value })} style={{ ...cellInput, flex: 1.6 }} />
                  <input value={editValues.categoria} onChange={(e) => setEditValues({ ...editValues, categoria: e.target.value })} style={{ ...cellInput, flex: 0.9 }} />
                  <input value={editValues.codigoBarras} onChange={(e) => setEditValues({ ...editValues, codigoBarras: e.target.value })} style={{ ...cellInputMono, width: 110 }} />
                  <input value={editValues.custo} onChange={(e) => setEditValues({ ...editValues, custo: e.target.value })} style={{ ...cellInput, width: 80 }} />
                  <input value={editValues.preco} onChange={(e) => setEditValues({ ...editValues, preco: e.target.value })} style={{ ...cellInput, width: 80 }} />
                  <input value={editValues.estoque} onChange={(e) => setEditValues({ ...editValues, estoque: e.target.value })} style={{ ...cellInput, width: 60 }} />
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => salvarEdicao(p.id)} style={iconBtn}><Check size={13} color={C.accentDark} /></button>
                    <button onClick={() => setEditId(null)} style={iconBtn}><X size={13} color={C.muted} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: 1.6, fontWeight: 500 }}>{p.nome}</span>
                  <span style={{ flex: 0.9, color: C.muted }}>{p.categoria}</span>
                  <span style={{ width: 110, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Barcode size={11} />{p.codigoBarras || '—'}
                  </span>
                  <span style={{ width: 80, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{fmt(p.custo || 0)}</span>
                  <span style={{ width: 80, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{fmt(p.preco)}</span>
                  <span style={{ width: 60, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: p.estoque <= (p.estoqueMinimo ?? 10) ? C.danger : C.textDark }}>{p.estoque}</span>
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => iniciarEdicao(p)} style={iconBtn}><Pencil size={13} color={C.muted} /></button>
                    <button onClick={() => onDelete(p.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {produtos.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum produto cadastrado.</div>}
      </Card>
    </div>
  );
}

function VendasScreen({ vendas, onCancelar }) {
  const [expandido, setExpandido] = useState(null);
  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Vendas</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Histórico completo, incluindo turnos anteriores.</p>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 70 }}>Nº</span>
          <span style={{ flex: 1 }}>Forma / Hora</span>
          <span style={{ width: 90, textAlign: 'right' }}>Total</span>
          <span style={{ width: 100, textAlign: 'right' }}>Status</span>
          <span style={{ width: 90, textAlign: 'right' }}>Ação</span>
        </div>
        {vendas.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma venda registrada ainda.</div>}
        {[...vendas].reverse().map((v) => {
          const aberto = expandido === v.id;
          return (
            <div key={v.id} className="table-row" style={{ borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', fontSize: 13 }}>
                <button onClick={() => setExpandido(aberto ? null : v.id)} style={{ width: 70, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.textDark, padding: 0 }}>
                  #{String(v.numero).padStart(4, '0')}
                </button>
                <span style={{ flex: 1, color: C.muted, fontSize: 12.5 }}>{v.forma} · {dataHora(v.hora)}</span>
                <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, textDecoration: v.cancelada ? 'line-through' : 'none', color: v.cancelada ? C.muted : C.textDark }}>{fmt(v.total)}</span>
                <span style={{ width: 100, textAlign: 'right' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99, background: v.cancelada ? C.dangerBg : 'rgba(45,212,191,0.12)', color: v.cancelada ? C.danger : C.accentDark }}>
                    {v.cancelada ? 'Cancelada' : 'Concluída'}
                  </span>
                </span>
                <span style={{ width: 90, textAlign: 'right' }}>
                  {!v.cancelada && (
                    <button onClick={() => onCancelar(v.id)} style={{ ...btnGhost, color: C.danger, fontSize: 11.5, justifyContent: 'flex-end', width: '100%' }}>
                      <Ban size={12} /> Cancelar
                    </button>
                  )}
                </span>
              </div>
              {aberto && (
                <div style={{ padding: '0 16px 12px 86px' }}>
                  {v.itens.map((i) => (
                    <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: C.muted, padding: '2px 0' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {i.qtd}x {i.nome}
                        {i.codigoBarras && <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, opacity: 0.7 }}>({i.codigoBarras})</span>}
                      </span>
                      <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(i.preco * i.qtd)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </Card>
    </div>
  );
}

function SangriaScreen({ caixa, valorDisponivel, sangriaInput, setSangriaInput, onConfirmar, historico }) {
  return (
    <div style={{ maxWidth: 460 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Sangria de Caixa</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Retirada de dinheiro do caixa durante o turno.</p>

      <div style={{ background: C.bgDark, borderRadius: 12, padding: 18, marginBottom: 16, textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Saldo disponível</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 28, color: C.accent, marginTop: 4 }}>{fmt(valorDisponivel)}</div>
      </div>

      <form onSubmit={onConfirmar}>
        <Card style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 8 }}>Valor a retirar</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgLight, border: `1px solid ${C.borderLight}`, borderRadius: 9, padding: '10px 14px', marginBottom: 12 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>R$</span>
            <input value={sangriaInput.valor} onChange={(e) => setSangriaInput({ ...sangriaInput, valor: e.target.value })} placeholder="0,00" inputMode="decimal"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 600, flex: 1 }} />
          </div>
          <label style={{ fontSize: 12, color: C.muted, display: 'block', marginBottom: 8 }}>Motivo</label>
          <input value={sangriaInput.motivo} onChange={(e) => setSangriaInput({ ...sangriaInput, motivo: e.target.value })} placeholder="Ex: depósito bancário, troco para fornecedor..."
            style={{ width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 8, padding: '9px 12px', fontSize: 13 }} />
          <button type="submit" style={{ ...btnDanger, width: '100%', justifyContent: 'center', marginTop: 16 }}>
            <ArrowDownCircle size={15} /> Confirmar Sangria
          </button>
        </Card>
      </form>

      {historico.length > 0 && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: C.bgLight, fontWeight: 700, fontSize: 12.5 }}>Sangrias deste turno</div>
          {historico.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <div>
                <div>{s.motivo}</div>
                <div style={{ fontSize: 11, color: C.muted }}>{hora(s.hora)}</div>
              </div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: C.danger }}>-{fmt(s.valor)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function RelatoriosScreen({ aba, setAba, vendas, sangrias, produtos, financeiro }) {
  const [periodo, setPeriodo] = useState('diario');
  const abas = ['Vendas', 'Produtos', 'Estoque', 'Financeiro', 'Operadores', 'Lucro'];

  const inicioPeriodo = useMemo(() => {
    const agora = new Date();
    if (periodo === 'diario') return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
    if (periodo === 'semanal') {
      const diaSemana = agora.getDay();
      const seg = new Date(agora);
      seg.setDate(agora.getDate() - ((diaSemana + 6) % 7));
      seg.setHours(0, 0, 0, 0);
      return seg.getTime();
    }
    return new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();
  }, [periodo]);

  const vendasFiltradas = useMemo(() => vendas.filter((v) => v.hora >= inicioPeriodo && !v.cancelada), [vendas, inicioPeriodo]);
  const canceladasFiltradas = useMemo(() => vendas.filter((v) => v.hora >= inicioPeriodo && v.cancelada), [vendas, inicioPeriodo]);
  const sangriasFiltradas = useMemo(() => sangrias.filter((s) => s.hora >= inicioPeriodo), [sangrias, inicioPeriodo]);
  const financeiroFiltrado = useMemo(() => financeiro.filter((f) => f.hora >= inicioPeriodo), [financeiro, inicioPeriodo]);

  const totalVendido = vendasFiltradas.reduce((s, v) => s + v.total, 0);
  const ticketMedio = vendasFiltradas.length ? totalVendido / vendasFiltradas.length : 0;
  const totalSangriasPeriodo = sangriasFiltradas.reduce((s, x) => s + x.valor, 0);

  const porForma = useMemo(() => {
    const t = { Dinheiro: 0, 'Cartão Débito': 0, 'Cartão Crédito': 0, Pix: 0, Credário: 0 };
    vendasFiltradas.forEach((v) => { t[v.forma] = (t[v.forma] || 0) + v.total; });
    return t;
  }, [vendasFiltradas]);

  const produtosMaisVendidos = useMemo(() => {
    const mapa = {};
    vendasFiltradas.forEach((v) => v.itens.forEach((i) => { mapa[i.nome] = (mapa[i.nome] || 0) + i.qtd; }));
    return Object.entries(mapa).sort((a, b) => b[1] - a[1]);
  }, [vendasFiltradas]);

  const porOperador = useMemo(() => {
    const mapa = {};
    vendasFiltradas.forEach((v) => {
      if (!mapa[v.operador]) mapa[v.operador] = { total: 0, qtd: 0 };
      mapa[v.operador].total += v.total;
      mapa[v.operador].qtd += 1;
    });
    return Object.entries(mapa).sort((a, b) => b[1].total - a[1].total);
  }, [vendasFiltradas]);

  const custoVendido = useMemo(() => {
    return vendasFiltradas.reduce((s, v) => s + v.itens.reduce((s2, i) => {
      const p = produtos.find((pp) => pp.id === i.id);
      return s2 + (p ? (p.custo || 0) * i.qtd : 0);
    }, 0), 0);
  }, [vendasFiltradas, produtos]);
  const lucroBruto = totalVendido - custoVendido;
  const margem = totalVendido ? (lucroBruto / totalVendido) * 100 : 0;

  const entradasFin = financeiroFiltrado.filter((f) => f.valor > 0).reduce((s, f) => s + f.valor, 0);
  const saidasFin = financeiroFiltrado.filter((f) => f.valor < 0).reduce((s, f) => s + Math.abs(f.valor), 0);

  const valorTotalEstoque = produtos.reduce((s, p) => s + p.estoque * (p.custo || 0), 0);
  const baixoEstoque = produtos.filter((p) => p.estoque <= (p.estoqueMinimo ?? 10));

  const periodos = [
    { key: 'diario', label: 'Diário', icon: Calendar },
    { key: 'semanal', label: 'Semanal', icon: CalendarDays },
    { key: 'mensal', label: 'Mensal', icon: CalendarRange },
  ];

  function exportarCSV() {
    const linhas = [['Numero', 'Data/Hora', 'Forma', 'Subtotal', 'Desconto', 'Total', 'Operador']];
    vendasFiltradas.forEach((v) => linhas.push([v.numero, dataHora(v.hora), v.forma, (v.subtotal ?? v.total).toFixed(2), (v.desconto ?? 0).toFixed(2), v.total.toFixed(2), v.operador]));
    const csv = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `relatorio-${periodo}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 960 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Relatórios</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 16px' }}>Desempenho do negócio por período.</p>

      <div className="scroll-thin" style={{ display: 'flex', gap: 6, marginBottom: 16, overflowX: 'auto', borderBottom: `1px solid ${C.borderLight}`, paddingBottom: 2 }}>
        {abas.map((a) => (
          <button key={a} onClick={() => setAba(a)} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: '9px 9px 0 0', border: 'none', borderBottom: `2px solid ${aba === a ? C.primary : 'transparent'}`,
            background: 'transparent', color: aba === a ? C.primaryDark : C.muted, fontWeight: aba === a ? 700 : 500, fontSize: 13, cursor: 'pointer',
          }}>
            {a}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {periodos.map((p) => {
            const Icon = p.icon;
            const active = periodo === p.key;
            return (
              <button key={p.key} onClick={() => setPeriodo(p.key)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8,
                border: `1.5px solid ${active ? C.primaryDark : C.borderLight}`, background: active ? C.primarySoft : C.panel, cursor: 'pointer',
                color: active ? C.primaryDark : C.textDark, fontWeight: 600, fontSize: 13,
              }}>
                <Icon size={14} /> {p.label}
              </button>
            );
          })}
        </div>
        {aba === 'Vendas' && <button onClick={exportarCSV} style={btnGhostSolid}><Download size={14} /> Exportar CSV</button>}
      </div>

      {aba === 'Vendas' && (
        <>
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
            <Card><span style={labelSm}>Total vendido</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(totalVendido)}</div></Card>
            <Card><span style={labelSm}>Vendas concluídas</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{vendasFiltradas.length}</div></Card>
            <Card><span style={labelSm}>Ticket médio</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(ticketMedio)}</div></Card>
            <Card><span style={labelSm}>Sangrias no período</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.danger }}>{fmt(totalSangriasPeriodo)}</div></Card>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Vendas por forma de pagamento</div>
              {Object.entries(porForma).map(([forma, valor]) => (
                <div key={forma} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ color: C.muted }}>{forma}</span>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{fmt(valor)}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: C.bgLight, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: totalVendido ? `${(valor / totalVendido) * 100}%` : '0%', background: C.primary }} />
                  </div>
                </div>
              ))}
              {totalVendido === 0 && <div style={{ color: C.muted, fontSize: 12.5 }}>Sem vendas neste período.</div>}
            </Card>
            <Card>
              <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Produtos mais vendidos</div>
              {produtosMaisVendidos.length === 0 && <div style={{ color: C.muted, fontSize: 12.5 }}>Sem vendas neste período.</div>}
              {produtosMaisVendidos.slice(0, 5).map(([nome, qtd], i) => (
                <div key={nome} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderTop: i > 0 ? `1px solid ${C.borderLight}` : 'none' }}>
                  <span>{nome}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: C.muted }}>{qtd} un.</span>
                </div>
              ))}
            </Card>
          </div>
          {canceladasFiltradas.length > 0 && (
            <div style={{ marginTop: 14, fontSize: 12, color: C.muted }}>{canceladasFiltradas.length} venda(s) cancelada(s) no período não entram nos totais acima.</div>
          )}
        </>
      )}

      {aba === 'Produtos' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>
            <span style={{ flex: 1 }}>Produto</span><span style={{ width: 100, textAlign: 'right' }}>Qtd. vendida</span>
          </div>
          {produtosMaisVendidos.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Sem vendas no período.</div>}
          {produtosMaisVendidos.map(([nome, qtd]) => (
            <div key={nome} className="table-row" style={{ display: 'flex', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <span style={{ flex: 1 }}>{nome}</span>
              <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{qtd}</span>
            </div>
          ))}
        </Card>
      )}

      {aba === 'Estoque' && (
        <>
          <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14, marginBottom: 18 }}>
            <Card><span style={labelSm}>Valor total em estoque</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(valorTotalEstoque)}</div></Card>
            <Card><span style={labelSm}>Produtos abaixo do mínimo</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: baixoEstoque.length ? C.danger : C.accentDark }}>{baixoEstoque.length}</div></Card>
          </div>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            {baixoEstoque.map((p) => (
              <div key={p.id} className="table-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
                <span>{p.nome}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.danger }}>{p.estoque} un.</span>
              </div>
            ))}
            {baixoEstoque.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum produto abaixo do mínimo.</div>}
          </Card>
        </>
      )}

      {aba === 'Financeiro' && (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
          <Card><span style={labelSm}>Entradas</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.accentDark }}>{fmt(entradasFin)}</div></Card>
          <Card><span style={labelSm}>Saídas</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.danger }}>{fmt(saidasFin)}</div></Card>
          <Card><span style={labelSm}>Saldo do período</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(entradasFin - saidasFin)}</div></Card>
        </div>
      )}

      {aba === 'Operadores' && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase' }}>
            <span style={{ flex: 1 }}>Operador</span><span style={{ width: 90, textAlign: 'right' }}>Vendas</span><span style={{ width: 110, textAlign: 'right' }}>Total</span>
          </div>
          {porOperador.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Sem vendas no período.</div>}
          {porOperador.map(([nome, dados]) => (
            <div key={nome} className="table-row" style={{ display: 'flex', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <span style={{ flex: 1 }}>{nome}</span>
              <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{dados.qtd}</span>
              <span style={{ width: 110, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmt(dados.total)}</span>
            </div>
          ))}
        </Card>
      )}

      {aba === 'Lucro' && (
        <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          <Card><span style={labelSm}>Receita</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(totalVendido)}</div></Card>
          <Card><span style={labelSm}>Custo dos produtos</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.danger }}>{fmt(custoVendido)}</div></Card>
          <Card><span style={labelSm}>Lucro bruto</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.accentDark }}>{fmt(lucroBruto)}</div></Card>
          <Card><span style={labelSm}>Margem</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{margem.toFixed(1)}%</div></Card>
        </div>
      )}
    </div>
  );
}

function ConfiguracoesScreen({ aba, setAba, config, setConfig, onExportar, onImportar, onResetar, nuvem, ehAdmin, usuarios, perfis, operadorAtual, onAlterarPermissaoUsuario, onResetarPermissoesUsuario, onIrPerfis }) {
  const [local, setLocal] = useState(config);
  const [salvo, setSalvo] = useState(false);
  const [confirmarReset, setConfirmarReset] = useState(false);
  const abas = ['Empresa', 'Impressora', 'Pagamentos', 'Pix', 'Backup', 'Nuvem', ...(ehAdmin ? ['Permissões'] : []), 'Sistema'];

  function salvar(e) {
    e.preventDefault();
    setConfig(local);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try { onImportar(JSON.parse(reader.result)); } catch { /* ignorado */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  const SalvarBtn = () => (
    <>
      <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 20 }}>
        <Check size={15} /> Salvar Configurações
      </button>
      {salvo && (
        <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center', color: C.accentDark, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>
          <CheckCircle2 size={14} /> Configurações salvas
        </div>
      )}
    </>
  );

  return (
    <div style={{ maxWidth: aba === 'Permissões' ? 860 : 520 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Configurações</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 16px' }}>Preferências gerais do sistema.</p>

      <div className="scroll-thin" style={{ display: 'flex', gap: 6, marginBottom: 18, overflowX: 'auto', borderBottom: `1px solid ${C.borderLight}`, paddingBottom: 2 }}>
        {abas.map((a) => (
          <button key={a} onClick={() => setAba(a)} style={{
            flexShrink: 0, padding: '8px 14px', borderRadius: '9px 9px 0 0', border: 'none', borderBottom: `2px solid ${aba === a ? C.primary : 'transparent'}`,
            background: 'transparent', color: aba === a ? C.primaryDark : C.muted, fontWeight: aba === a ? 700 : 500, fontSize: 13, cursor: 'pointer',
          }}>
            {a}
          </button>
        ))}
      </div>

      {aba === 'Empresa' && (
        <form onSubmit={salvar}>
          <Card>
            <label style={labelSm}>Nome da loja</label>
            <input value={local.nomeLoja} onChange={(e) => setLocal({ ...local, nomeLoja: e.target.value })} style={inputLightStyle} />
            <label style={{ ...labelSm, marginTop: 14 }}>CNPJ</label>
            <input value={local.cnpj} onChange={(e) => setLocal({ ...local, cnpj: e.target.value })} placeholder="00.000.000/0000-00" style={inputLightStyle} />
            <label style={{ ...labelSm, marginTop: 14 }}>Endereço</label>
            <input value={local.endereco} onChange={(e) => setLocal({ ...local, endereco: e.target.value })} placeholder="Rua, número, bairro, cidade" style={inputLightStyle} />
            <SalvarBtn />
          </Card>
        </form>
      )}

      {aba === 'Impressora' && (
        <form onSubmit={salvar}>
          <Card>
            <label style={labelSm}>Mensagem de rodapé do cupom</label>
            <input value={local.mensagemRodape} onChange={(e) => setLocal({ ...local, mensagemRodape: e.target.value })} style={inputLightStyle} />
            <label style={{ ...labelSm, marginTop: 14 }}>Largura da bobina térmica</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {['58mm', '80mm'].map((l) => (
                <button type="button" key={l} onClick={() => setLocal({ ...local, larguraCupom: l })} style={{
                  flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${local.larguraCupom === l ? C.primaryDark : C.borderLight}`,
                  background: local.larguraCupom === l ? C.primarySoft : C.panel, color: local.larguraCupom === l ? C.primaryDark : C.textDark,
                  fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>
                  {l}
                </button>
              ))}
            </div>
            <SalvarBtn />
          </Card>
        </form>
      )}

      {aba === 'Pagamentos' && (
        <form onSubmit={salvar}>
          <Card>
            <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 14px' }}>Ative ou desative formas de pagamento aceitas no PDV.</p>
            {Object.keys(local.formasAceitas || {}).map((forma) => (
              <label key={forma} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 0', borderTop: `1px solid ${C.borderLight}`, fontSize: 13.5 }}>
                {forma}
                <input type="checkbox" checked={local.formasAceitas[forma]} onChange={(e) => setLocal({ ...local, formasAceitas: { ...local.formasAceitas, [forma]: e.target.checked } })} />
              </label>
            ))}
            <SalvarBtn />
          </Card>
        </form>
      )}

      {aba === 'Pix' && (
        <form onSubmit={salvar}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
              <QrCode size={15} color={C.accentDark} />
              <span style={{ fontWeight: 700, fontSize: 13.5 }}>Recebimento via Pix</span>
            </div>
            <p style={{ fontSize: 12, color: C.muted, margin: '0 0 14px' }}>O QR Code exibido na tela de pagamento é gerado com esses dados — o valor cai direto nesta chave.</p>

            <label style={labelSm}>Chave Pix (CPF/CNPJ, e-mail, telefone ou aleatória)</label>
            <input value={local.chavePix} onChange={(e) => setLocal({ ...local, chavePix: e.target.value })} placeholder="exemplo@banco.com.br" style={{ ...inputLightStyle, fontFamily: "'JetBrains Mono',monospace" }} />
            {local.chavePix.trim() && (() => {
              const info = detectarTipoChavePix(local.chavePix);
              return info ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6, fontSize: 11.5, color: info.ok ? C.accentDark : C.danger }}>
                  {info.ok ? <CheckCircle2 size={12} /> : <AlertTriangle size={12} />}
                  <span>{info.tipo}{info.aviso ? ` — ${info.aviso}` : ''}</span>
                </div>
              ) : null;
            })()}
            <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>Digite a chave exatamente como está cadastrada no banco (para CPF/CNPJ, só números; para telefone, use o formato +55DDNÚMERO).</p>

            <label style={{ ...labelSm, marginTop: 14 }}>Nome do recebedor</label>
            <input value={local.nomeRecebedorPix} onChange={(e) => setLocal({ ...local, nomeRecebedorPix: e.target.value })} maxLength={25} style={inputLightStyle} />

            <label style={{ ...labelSm, marginTop: 14 }}>Cidade do recebedor</label>
            <input value={local.cidadeRecebedorPix} onChange={(e) => setLocal({ ...local, cidadeRecebedorPix: e.target.value })} maxLength={15} style={inputLightStyle} />

            <SalvarBtn />
          </Card>
        </form>
      )}

      {aba === 'Backup' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <Database size={15} color={C.primaryDark} />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Backup dos dados</span>
          </div>
          <p style={{ fontSize: 12.5, color: C.muted, margin: '4px 0 16px' }}>Exporte todos os dados do sistema em um arquivo JSON, ou restaure a partir de um backup anterior.</p>
          <button type="button" onClick={onExportar} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginBottom: 10 }}>
            <Download size={15} /> Exportar Backup
          </button>
          <label style={{ ...btnGhostSolid, width: '100%', justifyContent: 'center', boxSizing: 'border-box', cursor: 'pointer' }}>
            <Upload size={15} /> Importar Backup
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>
        </Card>
      )}

      {aba === 'Nuvem' && <NuvemPanel nuvem={nuvem} />}

      {aba === 'Permissões' && (
        <PermissoesPanel ehAdmin={ehAdmin} usuarios={usuarios} perfis={perfis} operadorAtual={operadorAtual} onToggle={onAlterarPermissaoUsuario} onReset={onResetarPermissoesUsuario} onIrPerfis={onIrPerfis} />
      )}

      {aba === 'Sistema' && (
        <Card>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <Cog size={15} color={C.primaryDark} />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Sistema</span>
          </div>
          <p style={{ fontSize: 12.5, color: C.muted, margin: '4px 0 16px' }}>PDV Terminal — versão {APP_VERSAO} ({APP_BUILD}). Os dados ficam salvos neste navegador (localStorage) e, se a nuvem estiver configurada, também no Supabase. Limpar os dados do navegador apaga a cópia local — mantenha backups.</p>
          <div style={{ borderTop: `1px solid ${C.borderLight}`, paddingTop: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 12.5, color: C.danger, marginBottom: 8 }}>Zona de risco</div>
            {!confirmarReset ? (
              <button type="button" onClick={() => setConfirmarReset(true)} style={{ ...btnGhostSolid, borderColor: C.danger, color: C.danger }}>
                <Trash2 size={14} /> Restaurar dados de fábrica
              </button>
            ) : (
              <div>
                <p style={{ fontSize: 12.5, color: C.danger, marginBottom: 8 }}>Isso apaga vendas, produtos cadastrados, financeiro e tudo mais. Confirma?</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => { onResetar(); setConfirmarReset(false); }} style={btnDanger}><Check size={14} /> Sim, restaurar</button>
                  <button type="button" onClick={() => setConfirmarReset(false)} style={btnGhostSolid}>Cancelar</button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}

function CategoriasScreen({ categorias, produtos, onAdd, onEdit, onDelete }) {
  const [novo, setNovo] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValor, setEditValor] = useState('');

  function contar(nome) {
    return produtos.filter((p) => p.categoria === nome).length;
  }

  return (
    <div style={{ maxWidth: 560 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Categorias</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Organize os produtos por categoria. Renomear atualiza todos os produtos vinculados.</p>

      <form onSubmit={(e) => { e.preventDefault(); onAdd(novo); setNovo(''); }} style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <input value={novo} onChange={(e) => setNovo(e.target.value)} placeholder="Nova categoria (ex: Padaria)" style={{ ...inputLightStyle, flex: 1 }} />
        <button type="submit" style={btnPrimary}><Plus size={14} /> Adicionar</button>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1 }}>Categoria</span>
          <span style={{ width: 90, textAlign: 'right' }}>Produtos</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {categorias.map((c) => {
          const editando = editId === c.id;
          return (
            <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
              {editando ? (
                <>
                  <input value={editValor} onChange={(e) => setEditValor(e.target.value)} style={{ flex: 1, border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5 }} />
                  <span style={{ width: 90 }} />
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => { onEdit(c.id, editValor); setEditId(null); }} style={iconBtn}><Check size={13} color={C.accentDark} /></button>
                    <button onClick={() => setEditId(null)} style={iconBtn}><X size={13} color={C.muted} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: 1, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7 }}><Tags size={13} color={C.muted} />{c.nome}</span>
                  <span style={{ width: 90, textAlign: 'right', color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>{contar(c.nome)}</span>
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => { setEditId(c.id); setEditValor(c.nome); }} style={iconBtn}><Pencil size={13} color={C.muted} /></button>
                    <button onClick={() => onDelete(c.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {categorias.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma categoria cadastrada.</div>}
      </Card>
    </div>
  );
}

function EstoqueVisaoScreen({ produtos, onAjustar }) {
  const [busca, setBusca] = useState('');
  const [ajusteAberto, setAjusteAberto] = useState(null);
  const [ajusteQtd, setAjusteQtd] = useState('');
  const [ajusteTipo, setAjusteTipo] = useState('entrada');

  const lista = produtos.filter((p) => p.nome.toLowerCase().includes(busca.toLowerCase()));
  const valorTotalEstoque = produtos.reduce((s, p) => s + p.estoque * (p.custo || 0), 0);
  const totalUnidades = produtos.reduce((s, p) => s + p.estoque, 0);
  const alertas = produtos.filter((p) => p.estoque <= (p.estoqueMinimo ?? 10)).length;

  function aplicarAjuste(id) {
    const n = parseInt(ajusteQtd, 10);
    if (isNaN(n) || n <= 0) return;
    onAjustar({ produtoId: id, quantidade: ajusteTipo === 'entrada' ? n : -n, motivo: 'Ajuste rápido — visão de estoque' });
    setAjusteAberto(null);
    setAjusteQtd('');
  }

  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Estoque</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Visão geral de níveis de estoque, com ajuste rápido.</p>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 18 }}>
        <Card><span style={labelSm}>Valor total em estoque (custo)</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(valorTotalEstoque)}</div></Card>
        <Card><span style={labelSm}>Unidades em estoque</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{totalUnidades}</div></Card>
        <Card><span style={labelSm}>Produtos em alerta</span><div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: alertas > 0 ? C.danger : C.accentDark }}>{alertas}</div></Card>
      </div>

      <div style={{ position: 'relative', marginBottom: 14, maxWidth: 320 }}>
        <Search size={14} color={C.muted} style={{ position: 'absolute', left: 11, top: 10 }} />
        <input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar produto..." style={{ ...inputLightStyle, paddingLeft: 32 }} />
      </div>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Produto</span>
          <span style={{ width: 90, textAlign: 'right' }}>Estoque</span>
          <span style={{ width: 90, textAlign: 'right' }}>Mínimo</span>
          <span style={{ width: 100, textAlign: 'right' }}>Ação</span>
        </div>
        {lista.map((p) => {
          const baixo = p.estoque <= (p.estoqueMinimo ?? 10);
          const aberto = ajusteAberto === p.id;
          return (
            <div key={p.id} style={{ borderTop: `1px solid ${C.borderLight}` }}>
              <div className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', fontSize: 13 }}>
                <span style={{ flex: 1.6, display: 'flex', alignItems: 'center', gap: 7 }}>
                  {baixo && <span style={{ width: 7, height: 7, borderRadius: 99, background: p.estoque === 0 ? C.danger : C.warn }} />}
                  {p.nome}
                </span>
                <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: baixo ? (p.estoque === 0 ? C.danger : C.warn) : C.textDark }}>{p.estoque}</span>
                <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{p.estoqueMinimo ?? 10}</span>
                <span style={{ width: 100, textAlign: 'right' }}>
                  <button onClick={() => { setAjusteAberto(aberto ? null : p.id); setAjusteQtd(''); }} style={{ ...btnGhostSolid, padding: '4px 10px', fontSize: 11.5 }}>
                    <SlidersHorizontal size={12} /> Ajustar
                  </button>
                </span>
              </div>
              {aberto && (
                <div style={{ padding: '0 16px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
                  {['entrada', 'saida'].map((t) => (
                    <button key={t} onClick={() => setAjusteTipo(t)} style={{
                      padding: '5px 10px', borderRadius: 7, fontSize: 11.5, fontWeight: 600, cursor: 'pointer',
                      border: `1.5px solid ${ajusteTipo === t ? C.primaryDark : C.borderLight}`,
                      background: ajusteTipo === t ? C.primarySoft : C.panel, color: ajusteTipo === t ? C.primaryDark : C.textDark,
                    }}>
                      {t === 'entrada' ? 'Entrada (+)' : 'Saída (−)'}
                    </button>
                  ))}
                  <input value={ajusteQtd} onChange={(e) => setAjusteQtd(e.target.value)} placeholder="Qtd." inputMode="numeric" style={{ width: 80, border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: '5px 8px', fontSize: 12.5 }} />
                  <button onClick={() => aplicarAjuste(p.id)} style={{ ...btnPrimary, padding: '5px 12px', fontSize: 11.5 }}><Check size={12} /> Aplicar</button>
                </div>
              )}
            </div>
          );
        })}
        {lista.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum produto encontrado.</div>}
      </Card>
    </div>
  );
}

function ClientesScreen({ clientes, onAdd, onEdit, onDelete }) {
  const [novo, setNovo] = useState({ nome: '', telefone: '', cpf: '', endereco: '', limiteCredito: '' });
  const [erroForm, setErroForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});
  const cellInput = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5 };

  function submitNovo(e) {
    e.preventDefault();
    if (!novo.nome.trim()) { setErroForm('Informe ao menos o nome do cliente.'); return; }
    onAdd({ nome: novo.nome.trim(), telefone: novo.telefone.trim(), cpf: novo.cpf.trim(), endereco: novo.endereco.trim(), limiteCredito: parseFloat(String(novo.limiteCredito).replace(',', '.')) || 0 });
    setNovo({ nome: '', telefone: '', cpf: '', endereco: '', limiteCredito: '' });
    setErroForm('');
  }

  function iniciarEdicao(c) {
    setEditId(c.id);
    setEditValues({ nome: c.nome, telefone: c.telefone, cpf: c.cpf, endereco: c.endereco, limiteCredito: String(c.limiteCredito || 0) });
  }

  function salvarEdicao(id) {
    if (!editValues.nome.trim()) return;
    onEdit(id, { ...editValues, limiteCredito: parseFloat(String(editValues.limiteCredito).replace(',', '.')) || 0 });
    setEditId(null);
  }

  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Clientes</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Cadastro usado no credário e na identificação de vendas.</p>

      <form onSubmit={submitNovo}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Novo cliente</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1.4fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div><label style={labelSm}>Nome</label><input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Nome completo" style={cellInput} /></div>
            <div><label style={labelSm}>Telefone</label><input value={novo.telefone} onChange={(e) => setNovo({ ...novo, telefone: e.target.value })} placeholder="(11) 99999-9999" style={cellInput} /></div>
            <div><label style={labelSm}>CPF</label><input value={novo.cpf} onChange={(e) => setNovo({ ...novo, cpf: e.target.value })} placeholder="000.000.000-00" style={cellInput} /></div>
            <div><label style={labelSm}>Endereço</label><input value={novo.endereco} onChange={(e) => setNovo({ ...novo, endereco: e.target.value })} placeholder="Rua, número, bairro" style={cellInput} /></div>
            <div><label style={labelSm}>Limite credário</label><input value={novo.limiteCredito} onChange={(e) => setNovo({ ...novo, limiteCredito: e.target.value })} placeholder="0,00" inputMode="decimal" style={cellInput} /></div>
            <button type="submit" style={{ ...btnPrimary, height: 33, padding: '0 14px' }}><Plus size={14} /> Adicionar</button>
          </div>
          {erroForm && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erroForm}</div>}
        </Card>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1.6 }}>Nome</span>
          <span style={{ flex: 1 }}>Telefone</span>
          <span style={{ width: 100, textAlign: 'right' }}>Limite</span>
          <span style={{ width: 100, textAlign: 'right' }}>Saldo devedor</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {clientes.map((c) => {
          const editando = editId === c.id;
          return (
            <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
              {editando ? (
                <>
                  <input value={editValues.nome} onChange={(e) => setEditValues({ ...editValues, nome: e.target.value })} style={{ ...cellInput, flex: 1.6 }} />
                  <input value={editValues.telefone} onChange={(e) => setEditValues({ ...editValues, telefone: e.target.value })} style={{ ...cellInput, flex: 1 }} />
                  <input value={editValues.limiteCredito} onChange={(e) => setEditValues({ ...editValues, limiteCredito: e.target.value })} style={{ ...cellInput, width: 100 }} />
                  <span style={{ width: 100 }} />
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => salvarEdicao(c.id)} style={iconBtn}><Check size={13} color={C.accentDark} /></button>
                    <button onClick={() => setEditId(null)} style={iconBtn}><X size={13} color={C.muted} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: 1.6, fontWeight: 500 }}>{c.nome}</span>
                  <span style={{ flex: 1, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 12 }}>{c.telefone || '—'}</span>
                  <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{fmt(c.limiteCredito || 0)}</span>
                  <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: (c.saldoDevedor || 0) > 0 ? C.danger : C.accentDark }}>{fmt(c.saldoDevedor || 0)}</span>
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => iniciarEdicao(c)} style={iconBtn}><Pencil size={13} color={C.muted} /></button>
                    <button onClick={() => onDelete(c.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
                  </div>
                </>
              )}
            </div>
          );
        })}
        {clientes.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum cliente cadastrado.</div>}
      </Card>
    </div>
  );
}

function TrocasScreen({ produtos, trocas, onConfirmar }) {
  const [saidaId, setSaidaId] = useState('');
  const [qtdSaida, setQtdSaida] = useState('1');
  const [entradaId, setEntradaId] = useState('');
  const [qtdEntrada, setQtdEntrada] = useState('1');
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  function submit(e) {
    e.preventDefault();
    if (!saidaId || !entradaId) { setErro('Selecione o produto devolvido e o novo produto.'); return; }
    const qs = parseInt(qtdSaida, 10), qe = parseInt(qtdEntrada, 10);
    if (isNaN(qs) || qs <= 0 || isNaN(qe) || qe <= 0) { setErro('Informe quantidades válidas.'); return; }
    const pEnt = produtos.find((p) => p.id === Number(entradaId));
    if (pEnt && qe > pEnt.estoque) { setErro('Estoque insuficiente do novo produto.'); return; }
    onConfirmar({ produtoSaidaId: Number(saidaId), qtdSaida: qs, produtoEntradaId: Number(entradaId), qtdEntrada: qe, motivo });
    setSaidaId(''); setEntradaId(''); setQtdSaida('1'); setQtdEntrada('1'); setMotivo(''); setErro('');
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Trocas</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Troca de um produto por outro — estoque e financeiro ajustados automaticamente.</p>

      <form onSubmit={submit}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 8, color: C.danger }}>Produto devolvido</div>
              <label style={labelSm}>Produto</label>
              <select value={saidaId} onChange={(e) => setSaidaId(e.target.value)} style={{ ...inputLightStyle, marginBottom: 10 }}>
                <option value="">Selecione...</option>
                {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome}</option>)}
              </select>
              <label style={labelSm}>Quantidade</label>
              <input value={qtdSaida} onChange={(e) => setQtdSaida(e.target.value)} inputMode="numeric" style={inputLightStyle} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 12.5, marginBottom: 8, color: C.accentDark }}>Novo produto</div>
              <label style={labelSm}>Produto</label>
              <select value={entradaId} onChange={(e) => setEntradaId(e.target.value)} style={{ ...inputLightStyle, marginBottom: 10 }}>
                <option value="">Selecione...</option>
                {produtos.map((p) => <option key={p.id} value={p.id}>{p.nome} ({p.estoque} un.)</option>)}
              </select>
              <label style={labelSm}>Quantidade</label>
              <input value={qtdEntrada} onChange={(e) => setQtdEntrada(e.target.value)} inputMode="numeric" style={inputLightStyle} />
            </div>
          </div>
          <label style={{ ...labelSm, marginTop: 14 }}>Motivo (opcional)</label>
          <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: tamanho errado, cliente preferiu outro sabor..." style={inputLightStyle} />
          {erro && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erro}</div>}
          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16 }}><ArrowLeftRight size={15} /> Confirmar Troca</button>
        </Card>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 60 }}>Nº</span>
          <span style={{ flex: 1 }}>Troca</span>
          <span style={{ width: 100, textAlign: 'right' }}>Diferença</span>
        </div>
        {[...trocas].reverse().map((t) => (
          <div key={t.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 12.5 }}>
            <span style={{ width: 60, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>#{String(t.numero).padStart(4, '0')}</span>
            <span style={{ flex: 1, color: C.muted }}>{t.qtdSaida}x {t.produtoSaida} → {t.qtdEntrada}x {t.produtoEntrada} · {dataHora(t.hora)}</span>
            <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: t.diferenca >= 0 ? C.accentDark : C.danger }}>{t.diferenca >= 0 ? '+' : ''}{fmt(t.diferenca)}</span>
          </div>
        ))}
        {trocas.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma troca registrada.</div>}
      </Card>
    </div>
  );
}

function DevolucoesScreen({ vendas, devolucoes, onConfirmar }) {
  const [vendaNumero, setVendaNumero] = useState('');
  const [itensSelecionados, setItensSelecionados] = useState({});
  const [motivo, setMotivo] = useState('');
  const [erro, setErro] = useState('');

  const venda = vendas.find((v) => v.numero === Number(vendaNumero) && !v.cancelada);

  function toggleItem(item) {
    setItensSelecionados((prev) => {
      const copy = { ...prev };
      if (copy[item.id]) delete copy[item.id];
      else copy[item.id] = { produtoId: item.id, nome: item.nome, preco: item.preco, qtd: item.qtd };
      return copy;
    });
  }

  function submit(e) {
    e.preventDefault();
    const itens = Object.values(itensSelecionados);
    if (itens.length === 0) { setErro('Selecione ao menos um item para devolver.'); return; }
    onConfirmar({ vendaNumero: venda ? venda.numero : null, itens, motivo });
    setVendaNumero(''); setItensSelecionados({}); setMotivo(''); setErro('');
  }

  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Devoluções</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Devolução parcial de itens de uma venda, com reposição de estoque.</p>

      <form onSubmit={submit}>
        <Card style={{ marginBottom: 20 }}>
          <label style={labelSm}>Número da venda</label>
          <input value={vendaNumero} onChange={(e) => setVendaNumero(e.target.value)} placeholder="Ex: 12" inputMode="numeric" style={{ ...inputLightStyle, maxWidth: 160, marginBottom: 12 }} />

          {venda ? (
            <div>
              <div style={{ fontSize: 12, color: C.muted, marginBottom: 8 }}>Selecione os itens a devolver:</div>
              {venda.itens.map((i) => (
                <label key={i.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', fontSize: 13, cursor: 'pointer' }}>
                  <input type="checkbox" checked={!!itensSelecionados[i.id]} onChange={() => toggleItem(i)} />
                  {i.qtd}x {i.nome} — {fmt(i.preco * i.qtd)}
                </label>
              ))}
            </div>
          ) : (
            vendaNumero && <div style={{ fontSize: 12.5, color: C.warn }}>Venda não encontrada.</div>
          )}

          <label style={{ ...labelSm, marginTop: 14 }}>Motivo</label>
          <input value={motivo} onChange={(e) => setMotivo(e.target.value)} placeholder="Ex: produto com defeito, arrependimento..." style={inputLightStyle} />

          {erro && <div style={{ color: C.danger, fontSize: 12, marginTop: 10 }}>{erro}</div>}
          <button type="submit" style={{ ...btnDanger, width: '100%', justifyContent: 'center', marginTop: 16 }}><Undo2 size={15} /> Confirmar Devolução</button>
        </Card>
      </form>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 60 }}>Nº</span>
          <span style={{ flex: 1 }}>Referente</span>
          <span style={{ width: 100, textAlign: 'right' }}>Valor</span>
        </div>
        {[...devolucoes].reverse().map((d) => (
          <div key={d.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 12.5 }}>
            <span style={{ width: 60, fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>#{String(d.numero).padStart(4, '0')}</span>
            <span style={{ flex: 1, color: C.muted }}>{d.vendaNumero ? `Venda #${d.vendaNumero}` : 'Avulsa'} · {d.itens.length} item(ns) · {dataHora(d.hora)}</span>
            <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.danger }}>-{fmt(d.valorTotal)}</span>
          </div>
        ))}
        {devolucoes.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma devolução registrada.</div>}
      </Card>
    </div>
  );
}


function CredarioScreen({ clientes, contasReceber, onReceber }) {
  const devedores = clientes.filter((c) => (c.saldoDevedor || 0) > 0);
  const pendencias = contasReceber.filter((c) => c.clienteId && !c.recebido);

  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Credário</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Clientes com saldo em aberto e parcelas pendentes.</p>

      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1 }}>Cliente</span>
          <span style={{ width: 100, textAlign: 'right' }}>Limite</span>
          <span style={{ width: 100, textAlign: 'right' }}>Saldo devedor</span>
        </div>
        {devedores.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
            <span style={{ flex: 1, fontWeight: 500 }}>{c.nome}</span>
            <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>{fmt(c.limiteCredito || 0)}</span>
            <span style={{ width: 100, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.danger }}>{fmt(c.saldoDevedor)}</span>
          </div>
        ))}
        {devedores.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum cliente com saldo em aberto.</div>}
      </Card>

      <div style={{ fontWeight: 700, fontSize: 13.5, marginBottom: 10 }}>Parcelas pendentes</div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1 }}>Descrição</span>
          <span style={{ width: 100, textAlign: 'right' }}>Vencimento</span>
          <span style={{ width: 90, textAlign: 'right' }}>Valor</span>
          <span style={{ width: 90, textAlign: 'right' }}>Ação</span>
        </div>
        {pendencias.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
            <span style={{ flex: 1 }}>{c.descricao}<br /><span style={{ fontSize: 11, color: C.muted }}>{c.clienteNome}</span></span>
            <span style={{ width: 100, textAlign: 'right', fontSize: 11.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>{new Date(c.vencimento).toLocaleDateString('pt-BR')}</span>
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmt(c.valor)}</span>
            <span style={{ width: 90, textAlign: 'right' }}>
              <button onClick={() => onReceber(c.id)} style={{ ...btnGhostSolid, padding: '4px 10px', fontSize: 11.5 }}><Check size={12} /> Receber</button>
            </span>
          </div>
        ))}
        {pendencias.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhuma parcela pendente.</div>}
      </Card>
    </div>
  );
}

function ContasPagarScreen({ contas, fornecedores, onAdd, onPagar, onDelete }) {
  const [novo, setNovo] = useState({ descricao: '', fornecedorId: '', valor: '', vencimento: '', parcelas: '1' });
  const pendentes = contas.filter((c) => !c.pago);
  const pagas = contas.filter((c) => c.pago);

  function submit(e) {
    e.preventDefault();
    const valor = parseFloat(String(novo.valor).replace(',', '.'));
    if (!novo.descricao.trim() || isNaN(valor) || valor <= 0 || !novo.vencimento) return;
    const fornecedor = fornecedores.find((f) => f.id === Number(novo.fornecedorId));
    const qtdParcelas = Math.min(48, Math.max(1, parseInt(novo.parcelas, 10) || 1));
    onAdd({ descricao: novo.descricao.trim(), fornecedorId: fornecedor ? fornecedor.id : null, fornecedorNome: fornecedor ? fornecedor.nome : null, valorTotal: valor, vencimentoInicial: new Date(novo.vencimento + 'T12:00:00').getTime(), qtdParcelas });
    setNovo({ descricao: '', fornecedorId: '', valor: '', vencimento: '', parcelas: '1' });
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Contas a Pagar</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Compromissos financeiros — ao pagar, lança automaticamente no fluxo de caixa.</p>

      <form onSubmit={submit}>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 0.7fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div><label style={labelSm}>Descrição</label><input value={novo.descricao} onChange={(e) => setNovo({ ...novo, descricao: e.target.value })} placeholder="Ex: Aluguel, energia..." style={inputLightStyle} /></div>
            <div><label style={labelSm}>Fornecedor (opcional)</label>
              <select value={novo.fornecedorId} onChange={(e) => setNovo({ ...novo, fornecedorId: e.target.value })} style={inputLightStyle}>
                <option value="">—</option>
                {fornecedores.map((f) => <option key={f.id} value={f.id}>{f.nome}</option>)}
              </select>
            </div>
            <div><label style={labelSm}>Valor total (R$)</label><input value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: e.target.value })} inputMode="decimal" placeholder="0,00" style={inputLightStyle} /></div>
            <div><label style={labelSm}>Parcelas</label><input value={novo.parcelas} onChange={(e) => setNovo({ ...novo, parcelas: e.target.value })} inputMode="numeric" style={inputLightStyle} /></div>
            <div><label style={labelSm}>1º vencimento</label><input type="date" value={novo.vencimento} onChange={(e) => setNovo({ ...novo, vencimento: e.target.value })} style={inputLightStyle} /></div>
            <button type="submit" style={{ ...btnPrimary, height: 33 }}><Plus size={14} /> Adicionar</button>
          </div>
        </Card>
      </form>

      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Pendentes</div>
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        {pendentes.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>Nenhuma conta pendente.</div>}
        {pendentes.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
            <span style={{ flex: 1 }}>{c.descricao} {c.totalParcelas > 1 ? <span style={{ fontSize: 10.5, fontWeight: 700, background: C.primarySoft, color: C.primaryDark, borderRadius: 99, padding: '2px 7px', marginLeft: 4 }}>{c.parcela}/{c.totalParcelas}</span> : null} {c.fornecedorNome ? `— ${c.fornecedorNome}` : ''}</span>
            <span style={{ fontSize: 11.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>venc. {new Date(c.vencimento).toLocaleDateString('pt-BR')}</span>
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmt(c.valor)}</span>
            <button onClick={() => onPagar(c.id)} style={{ ...btnGhostSolid, padding: '4px 10px', fontSize: 11.5 }}><Check size={12} /> Pagar</button>
            <button onClick={() => onDelete(c.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
          </div>
        ))}
      </Card>

      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Pagas</div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {pagas.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>Nenhuma conta paga ainda.</div>}
        {pagas.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, color: C.muted }}>
            <span style={{ flex: 1, textDecoration: 'line-through' }}>{c.descricao}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(c.valor)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ContasReceberScreen({ contas, clientes, onAdd, onReceber, onDelete }) {
  const [novo, setNovo] = useState({ descricao: '', clienteId: '', valor: '', vencimento: '', parcelas: '1' });
  const pendentes = contas.filter((c) => !c.recebido);
  const recebidas = contas.filter((c) => c.recebido);

  function submit(e) {
    e.preventDefault();
    const valor = parseFloat(String(novo.valor).replace(',', '.'));
    if (!novo.descricao.trim() || isNaN(valor) || valor <= 0 || !novo.vencimento) return;
    const cliente = clientes.find((c) => c.id === Number(novo.clienteId));
    const qtdParcelas = Math.min(48, Math.max(1, parseInt(novo.parcelas, 10) || 1));
    onAdd({ descricao: novo.descricao.trim(), clienteId: cliente ? cliente.id : null, clienteNome: cliente ? cliente.nome : null, valorTotal: valor, vencimentoInicial: new Date(novo.vencimento + 'T12:00:00').getTime(), qtdParcelas });
    setNovo({ descricao: '', clienteId: '', valor: '', vencimento: '', parcelas: '1' });
  }

  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Contas a Receber</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Inclui parcelas do credário e outros recebíveis avulsos.</p>

      <form onSubmit={submit}>
        <Card style={{ marginBottom: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.2fr 1fr 0.7fr 1fr auto', gap: 10, alignItems: 'end' }}>
            <div><label style={labelSm}>Descrição</label><input value={novo.descricao} onChange={(e) => setNovo({ ...novo, descricao: e.target.value })} placeholder="Ex: Venda avulsa a prazo..." style={inputLightStyle} /></div>
            <div><label style={labelSm}>Cliente (opcional)</label>
              <select value={novo.clienteId} onChange={(e) => setNovo({ ...novo, clienteId: e.target.value })} style={inputLightStyle}>
                <option value="">—</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
            </div>
            <div><label style={labelSm}>Valor total (R$)</label><input value={novo.valor} onChange={(e) => setNovo({ ...novo, valor: e.target.value })} inputMode="decimal" placeholder="0,00" style={inputLightStyle} /></div>
            <div><label style={labelSm}>Parcelas</label><input value={novo.parcelas} onChange={(e) => setNovo({ ...novo, parcelas: e.target.value })} inputMode="numeric" style={inputLightStyle} /></div>
            <div><label style={labelSm}>1º vencimento</label><input type="date" value={novo.vencimento} onChange={(e) => setNovo({ ...novo, vencimento: e.target.value })} style={inputLightStyle} /></div>
            <button type="submit" style={{ ...btnPrimary, height: 33 }}><Plus size={14} /> Adicionar</button>
          </div>
        </Card>
      </form>

      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Pendentes</div>
      <Card style={{ padding: 0, overflow: 'hidden', marginBottom: 18 }}>
        {pendentes.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>Nenhuma conta pendente.</div>}
        {pendentes.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
            <span style={{ flex: 1 }}>{c.descricao} {c.totalParcelas > 1 ? <span style={{ fontSize: 10.5, fontWeight: 700, background: C.primarySoft, color: C.primaryDark, borderRadius: 99, padding: '2px 7px', marginLeft: 4 }}>{c.parcela}/{c.totalParcelas}</span> : null} {c.clienteNome ? `— ${c.clienteNome}` : ''}</span>
            <span style={{ fontSize: 11.5, color: C.muted, fontFamily: "'JetBrains Mono',monospace" }}>venc. {new Date(c.vencimento).toLocaleDateString('pt-BR')}</span>
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700 }}>{fmt(c.valor)}</span>
            <button onClick={() => onReceber(c.id)} style={{ ...btnGhostSolid, padding: '4px 10px', fontSize: 11.5 }}><Check size={12} /> Receber</button>
            <button onClick={() => onDelete(c.id)} style={iconBtn}><Trash2 size={13} color={C.danger} /></button>
          </div>
        ))}
      </Card>

      <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>Recebidas</div>
      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {recebidas.length === 0 && <div style={{ padding: 20, textAlign: 'center', color: C.muted, fontSize: 12.5 }}>Nenhuma conta recebida ainda.</div>}
        {recebidas.map((c) => (
          <div key={c.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, color: C.muted }}>
            <span style={{ flex: 1, textDecoration: 'line-through' }}>{c.descricao}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace" }}>{fmt(c.valor)}</span>
          </div>
        ))}
      </Card>
    </div>
  );
}

function ReceitasDespesasScreen({ financeiro, tipo }) {
  const receitas = tipo === 'receitas';
  const lista = financeiro.filter((f) => (receitas ? f.valor > 0 : f.valor < 0));
  const total = lista.reduce((s, f) => s + Math.abs(f.valor), 0);

  return (
    <div style={{ maxWidth: 680 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>{receitas ? 'Receitas' : 'Despesas'}</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>{receitas ? 'Todas as entradas financeiras registradas.' : 'Todas as saídas financeiras registradas.'}</p>

      <Card style={{ marginBottom: 16, maxWidth: 260 }}>
        <span style={labelSm}>Total {receitas ? 'de receitas' : 'de despesas'}</span>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 22, marginTop: 6, color: receitas ? C.accentDark : C.danger }}>{fmt(total)}</div>
      </Card>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        {[...lista].reverse().map((f) => (
          <div key={f.id} className="table-row" style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
            <span>{f.tipo}</span>
            <span style={{ display: 'flex', gap: 14 }}>
              <span style={{ color: C.muted, fontSize: 11.5, fontFamily: "'JetBrains Mono',monospace" }}>{hora(f.hora)}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: receitas ? C.accentDark : C.danger }}>{fmt(Math.abs(f.valor))}</span>
            </span>
          </div>
        ))}
        {lista.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum lançamento ainda.</div>}
      </Card>
    </div>
  );
}

function SuprimentoScreen({ suprimentoInput, setSuprimentoInput, onConfirmar, historico }) {
  return (
    <div style={{ maxWidth: 460 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Suprimento de Caixa</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Reforço de troco — adiciona dinheiro ao caixa durante o turno.</p>

      <form onSubmit={onConfirmar}>
        <Card style={{ marginBottom: 16 }}>
          <label style={labelSm}>Valor a adicionar</label>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: C.bgLight, border: `1px solid ${C.borderLight}`, borderRadius: 9, padding: '10px 14px', marginBottom: 12, marginTop: 4 }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", color: C.muted }}>R$</span>
            <input value={suprimentoInput.valor} onChange={(e) => setSuprimentoInput({ ...suprimentoInput, valor: e.target.value })} placeholder="0,00" inputMode="decimal"
              style={{ border: 'none', background: 'transparent', outline: 'none', fontFamily: "'JetBrains Mono',monospace", fontSize: 17, fontWeight: 600, flex: 1 }} />
          </div>
          <label style={labelSm}>Motivo</label>
          <input value={suprimentoInput.motivo} onChange={(e) => setSuprimentoInput({ ...suprimentoInput, motivo: e.target.value })} placeholder="Ex: reforço de troco" style={inputLightStyle} />
          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16 }}><ArrowUpCircle size={15} /> Confirmar Suprimento</button>
        </Card>
      </form>

      {historico.length > 0 && (
        <Card style={{ padding: 0, overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', background: C.bgLight, fontWeight: 700, fontSize: 12.5 }}>Suprimentos deste turno</div>
          {historico.map((s) => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13 }}>
              <div><div>{s.motivo}</div><div style={{ fontSize: 11, color: C.muted }}>{hora(s.hora)}</div></div>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: C.accentDark }}>+{fmt(s.valor)}</span>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function UsuariosScreen({ usuarios, perfis, operadorAtual, onToggleAtivo, onAlterarPerfil, onDelete, onAlterarSenha, podeGerenciar }) {
  return (
    <div style={{ maxWidth: 720 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Usuários</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>
        Novos usuários são criados pela tela de login ("Cadastre-se"). O perfil define o acesso padrão; para ajustar o que cada pessoa pode acessar, use <strong>Configurações → Permissões</strong>.
        {!podeGerenciar && ' Somente administradores podem alterar usuários.'}
      </p>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ flex: 1 }}>Login</span>
          <span style={{ width: 150 }}>Perfil</span>
          <span style={{ width: 90 }}>Status</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {usuarios.map((u) => (
          <div key={u.login} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
            <span style={{ flex: 1, fontWeight: 500 }}>
              {u.login}{u.login === operadorAtual ? ' (você)' : ''}
              {u.areasPermitidas && !usuarioEhAdmin(u) && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: C.primaryDark, background: C.primarySoft, borderRadius: 99, padding: '2px 7px' }}>permissões personalizadas</span>}
            </span>
            <span style={{ width: 150 }}>
              <select value={u.perfil || 'Operador'} disabled={!podeGerenciar} onChange={(e) => onAlterarPerfil(u.login, e.target.value)} style={{ border: `1px solid ${C.borderLight}`, borderRadius: 7, padding: '4px 6px', fontSize: 12 }}>
                {perfis.map((p) => <option key={p.nome} value={p.nome}>{p.nome}</option>)}
              </select>
            </span>
            <span style={{ width: 90 }}>
              <button disabled={!podeGerenciar} onClick={() => onToggleAtivo(u.login)} style={{ fontSize: 10.5, fontWeight: 700, padding: '3px 8px', borderRadius: 99, border: 'none', cursor: podeGerenciar ? 'pointer' : 'not-allowed', background: u.ativo === false ? C.dangerBg : 'rgba(45,212,191,0.12)', color: u.ativo === false ? C.danger : C.accentDark }}>
                {u.ativo === false ? 'Inativo' : 'Ativo'}
              </button>
            </span>
            <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end' }}>
              <button disabled={!podeGerenciar} onClick={() => onDelete(u.login)} style={{ ...iconBtn, opacity: podeGerenciar ? 1 : 0.4 }}><Trash2 size={13} color={C.danger} /></button>
            </div>
          </div>
        ))}
      </Card>

      <TrocarSenhaCard onAlterarSenha={onAlterarSenha} />
    </div>
  );
}

function PerfisScreen({ usuarios, perfis, onAlterarPermissao, podeEditar }) {
  return (
    <div style={{ maxWidth: 820 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Perfis</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>
        Acesso padrão de cada perfil: vale para todos os usuários do perfil que não tenham permissões personalizadas.
        {!podeEditar && ' Somente administradores podem editar.'}
      </p>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
        {perfis.map((p) => {
          const qtd = usuarios.filter((u) => (u.perfil || 'Operador') === p.nome).length;
          const fixo = p.nome === ADMIN_PERFIL;
          return (
            <Card key={p.nome}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <UserCog size={16} color={C.primaryDark} />
                <span style={{ fontWeight: 700, fontSize: 14.5 }}>{p.nome}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11, color: C.muted }}>{qtd} usuário(s)</span>
              </div>
              <p style={{ fontSize: 12.5, color: C.muted, margin: '0 0 12px' }}>{fixo ? 'Acesso total e permanente a todas as áreas — não pode ser restringido.' : p.descricao}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 10px' }}>
                {AREAS_SISTEMA.map((area) => {
                  const permitido = fixo || p.areasPermitidas.includes(area.key);
                  return (
                    <label key={area.key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, cursor: fixo || !podeEditar ? 'not-allowed' : 'pointer', padding: '4px 0', opacity: fixo || !podeEditar ? 0.7 : 1 }}>
                      <input type="checkbox" checked={permitido} disabled={fixo || !podeEditar} onChange={(e) => onAlterarPermissao(p.nome, area.key, e.target.checked)} />
                      {area.label}
                    </label>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function PermissoesPanel({ ehAdmin, usuarios, perfis, operadorAtual, onToggle, onReset, onIrPerfis }) {
  if (!ehAdmin) {
    return (
      <Card style={{ textAlign: 'center', color: C.muted, fontSize: 13 }}>
        <ShieldCheck size={20} color={C.danger} style={{ marginBottom: 6 }} /><br />Somente administradores podem gerenciar permissões.
      </Card>
    );
  }
  return (
    <div>
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <ShieldCheck size={16} color={C.primaryDark} />
          <span style={{ fontWeight: 700, fontSize: 14 }}>Permissões por usuário</span>
          <button onClick={onIrPerfis} style={{ ...btnGhostSolid, marginLeft: 'auto', padding: '6px 12px', fontSize: 12 }}><UserCog size={13} /> Editar perfis padrão</button>
        </div>
        <p style={{ fontSize: 12.5, color: C.muted, margin: 0, lineHeight: 1.5 }}>
          <strong>Administradores têm acesso total e permanente</strong> (não podem ser restringidos). Para os demais, marque as áreas que cada pessoa pode acessar.
          Sem ajustes, cada usuário segue o perfil dele; ao personalizar, vale a sua escolha. As mudanças valem na hora.
        </p>
      </Card>

      <div className="stagger" style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
        {usuarios.map((u) => {
          const admin = usuarioEhAdmin(u);
          const areas = areasEfetivas(u, perfis);
          const personalizado = !admin && !!u.areasPermitidas;
          return (
            <Card key={u.login}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                <User size={15} color={C.primaryDark} />
                <span style={{ fontWeight: 700, fontSize: 14 }}>{u.login}{u.login === operadorAtual ? ' (você)' : ''}</span>
                {u.ativo === false && <span style={{ fontSize: 10, fontWeight: 700, color: C.danger, background: C.dangerBg, borderRadius: 99, padding: '2px 7px' }}>inativo</span>}
                <span style={{ marginLeft: 'auto', fontSize: 10.5, fontWeight: 700, borderRadius: 99, padding: '3px 9px', background: admin ? 'rgba(45,212,191,0.12)' : personalizado ? C.primarySoft : C.bgLight, color: admin ? C.accentDark : personalizado ? C.primaryDark : C.muted }}>
                  {admin ? 'Acesso total (fixo)' : personalizado ? 'Personalizado' : `Segue o perfil ${u.perfil || 'Operador'}`}
                </span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 10px', marginTop: 10 }}>
                {AREAS_SISTEMA.map((area) => (
                  <label key={area.key} style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 12.5, padding: '3px 0', cursor: admin ? 'not-allowed' : 'pointer', opacity: admin ? 0.7 : 1 }}>
                    <input type="checkbox" checked={areas.includes(area.key)} disabled={admin} onChange={(e) => onToggle(u.login, area.key, e.target.checked)} />
                    {area.label}
                  </label>
                ))}
              </div>
              {personalizado && (
                <button onClick={() => onReset(u.login)} style={{ ...btnGhost, marginTop: 10, color: C.primaryDark }}>
                  <Undo2 size={12} /> Voltar a seguir o perfil
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function AuditoriaScreen({ auditoria }) {
  return (
    <div style={{ maxWidth: 780 }}>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Auditoria</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Registro de ações sensíveis realizadas no sistema.</p>

      <Card style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', padding: '10px 16px', background: C.bgLight, fontSize: 11, fontWeight: 700, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          <span style={{ width: 160 }}>Ação</span>
          <span style={{ flex: 1 }}>Detalhe</span>
          <span style={{ width: 90 }}>Operador</span>
          <span style={{ width: 110, textAlign: 'right' }}>Data/Hora</span>
        </div>
        {[...auditoria].reverse().map((a) => (
          <div key={a.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 12.5 }}>
            <span style={{ width: 160, display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={12} color={C.primaryDark} />{a.acao}</span>
            <span style={{ flex: 1, color: C.muted }}>{a.detalhe}</span>
            <span style={{ width: 90, color: C.muted }}>{a.operador}</span>
            <span style={{ width: 110, textAlign: 'right', color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>{dataHora(a.hora)}</span>
          </div>
        ))}
        {auditoria.length === 0 && <div style={{ padding: 24, textAlign: 'center', color: C.muted, fontSize: 13 }}>Nenhum registro de auditoria ainda.</div>}
      </Card>
    </div>
  );
}

// ---------- ESTILOS COMPARTILHADOS ----------
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.primary, color: C.textLight, border: 'none',
  borderRadius: 11, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif",
  boxShadow: '0 4px 14px rgba(109,93,246,0.32)',
};
const btnDanger = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.danger, color: '#fff', border: 'none',
  borderRadius: 11, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif",
  boxShadow: '0 4px 14px rgba(239,68,68,0.28)',
};
const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.muted, fontSize: 12.5, cursor: 'pointer', padding: 0, fontWeight: 600,
};
const btnGhostSolid = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.panel, color: C.textDark, border: `1px solid ${C.borderLight}`,
  borderRadius: 11, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans',sans-serif",
};
const qtyBtn = {
  width: 22, height: 22, borderRadius: 7, border: `1px solid ${C.borderLight}`, background: C.bgLight, display: 'flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textDark, flexShrink: 0,
};
const iconBtn = {
  width: 26, height: 26, borderRadius: 8, border: `1px solid ${C.borderLight}`, background: C.panel, display: 'flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
};
const labelSm = { fontSize: 10.5, color: C.muted, display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 };
const inputLightStyle = {
  width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 10,
  padding: '9px 12px', fontSize: 13.5, outline: 'none', fontFamily: "'Inter',sans-serif", marginTop: 2, background: C.panel,
};
