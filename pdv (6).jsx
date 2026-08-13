import React, { useState, useMemo, useEffect } from 'react';
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
  Barcode, ScanLine, LayoutGrid, Clock
} from 'lucide-react';

const C = {
  bgDark: '#14161A',
  bgDark2: '#1B1E24',
  bgDark3: '#22262E',
  bgLight: '#F3F4F1',
  panel: '#FFFFFF',
  accent: '#2DD4BF',
  accentDark: '#0F9C8C',
  accentGlow: 'rgba(45,212,191,0.35)',
  danger: '#EF4444',
  dangerBg: '#FEF2F2',
  warn: '#F59E0B',
  warnBg: '#FFFBEB',
  textDark: '#181B20',
  textLight: '#F5F6F4',
  muted: '#8A93A3',
  mutedDark: '#5B6472',
  borderDark: '#2A2E37',
  borderLight: '#E4E6E1',
};

const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap');

* { box-sizing: border-box; }
button { font-family: inherit; transition: filter 0.15s ease, transform 0.12s ease, background 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease; }
button:not(:disabled):hover { filter: brightness(1.06); }
button:not(:disabled):active { transform: scale(0.97); }
input, select { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
input:focus, select:focus { border-color: ${C.accentDark} !important; box-shadow: 0 0 0 3px ${C.accentGlow}; }
.nav-btn:not(:disabled):hover { background: ${C.bgDark3} !important; color: ${C.textLight} !important; }
.prod-card:not(:disabled):hover { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(20,22,26,0.10); border-color: ${C.accentDark}66 !important; }
.table-row:hover { background: ${C.bgLight}; }
.scroll-thin::-webkit-scrollbar { width: 7px; height: 7px; }
.scroll-thin::-webkit-scrollbar-thumb { background: ${C.borderLight}; border-radius: 99px; }
@keyframes fadeSlideIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
.fade-in { animation: fadeSlideIn 0.28s ease; }
@keyframes toastIn { from { opacity: 0; transform: translate(-50%, 10px); } to { opacity: 1; transform: translate(-50%, 0); } }
.toast-anim { animation: toastIn 0.25s ease; }
`;

const fmt = (v) => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const hora = (d) => new Date(d).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
const dataHora = (d) => new Date(d).toLocaleString('pt-BR');

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
  { id: 1, nome: 'Água Mineral 500ml', preco: 3.5, estoque: 48, categoria: 'Bebidas', codigoBarras: '7891000000013' },
  { id: 2, nome: 'Refrigerante Lata 350ml', preco: 5.0, estoque: 36, categoria: 'Bebidas', codigoBarras: '7891000000020' },
  { id: 3, nome: 'Café Torrado 500g', preco: 18.9, estoque: 20, categoria: 'Alimentos', codigoBarras: '7891000000037' },
  { id: 4, nome: 'Arroz Branco 1kg', preco: 7.2, estoque: 40, categoria: 'Alimentos', codigoBarras: '7891000000044' },
  { id: 5, nome: 'Feijão Carioca 1kg', preco: 8.5, estoque: 35, categoria: 'Alimentos', codigoBarras: '7891000000051' },
  { id: 6, nome: 'Sabonete 90g', preco: 2.8, estoque: 60, categoria: 'Higiene', codigoBarras: '7891000000068' },
  { id: 7, nome: 'Papel Higiênico 4un', preco: 9.9, estoque: 25, categoria: 'Higiene', codigoBarras: '7891000000075' },
  { id: 8, nome: 'Detergente 500ml', preco: 3.2, estoque: 30, categoria: 'Limpeza', codigoBarras: '7891000000082' },
  { id: 9, nome: 'Sabão em Pó 1kg', preco: 12.5, estoque: 18, categoria: 'Limpeza', codigoBarras: '7891000000099' },
  { id: 10, nome: 'Biscoito Recheado 130g', preco: 4.3, estoque: 50, categoria: 'Alimentos', codigoBarras: '7891000000105' },
];

const USUARIOS_INICIAIS = [
  { login: 'admin', senha: 'admin123', pergunta: 'Qual o nome do seu primeiro animal de estimação?', resposta: 'rex' },
];

const FLOW = [
  { key: 'abrirCaixa', label: 'Abrir Caixa' },
  { key: 'pdv', label: 'PDV' },
  { key: 'pagamento', label: 'Pagamento' },
  { key: 'cupom', label: 'Cupom' },
];

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

  const [screen, setScreen] = useState('login');
  const [usuario, setUsuario] = useState({ login: '', senha: '' });
  const [operador, setOperador] = useState(null);
  const [erro, setErro] = useState('');
  const [msgSucesso, setMsgSucesso] = useState('');

  const [usuarios, setUsuarios] = useState(USUARIOS_INICIAIS);
  const [authScreen, setAuthScreen] = useState('login'); // login | cadastro | esqueci
  const [cadastro, setCadastro] = useState({ login: '', senha: '', confirmar: '', pergunta: '', resposta: '' });
  const [esqueci, setEsqueci] = useState({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' });

  const [produtos, setProdutos] = useState(PRODUTOS_INICIAIS);
  const [busca, setBusca] = useState('');
  const [carrinho, setCarrinho] = useState([]);

  const [caixa, setCaixa] = useState({ aberto: false, valorAbertura: 0, dataAbertura: null, operador: null });
  const [valorAberturaInput, setValorAberturaInput] = useState('');

  const [pagamento, setPagamento] = useState({ forma: null, valorRecebido: '', desconto: '' });
  const [vendas, setVendas] = useState([]);
  const [ultimaVenda, setUltimaVenda] = useState(null);
  const [financeiro, setFinanceiro] = useState([]);
  const [sangrias, setSangrias] = useState([]);
  const [contagemFechamento, setContagemFechamento] = useState('');
  const [ultimoFechamento, setUltimoFechamento] = useState(null);

  const [sangriaInput, setSangriaInput] = useState({ valor: '', motivo: '' });
  const [config, setConfig] = useState({
    nomeLoja: 'Minha Loja',
    cnpj: '',
    endereco: '',
    mensagemRodape: 'Obrigado pela preferência, volte sempre!',
    larguraCupom: '58mm',
    chavePix: '',
    nomeRecebedorPix: 'Minha Loja',
    cidadeRecebedorPix: 'SAO PAULO',
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
  const categorias = useMemo(() => ['Todos', ...Array.from(new Set(produtos.map((p) => p.categoria)))], [produtos]);

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

  function handleLogin(e) {
    e.preventDefault();
    const login = usuario.login.trim();
    if (!login || !usuario.senha.trim()) {
      setErro('Informe usuário e senha.');
      return;
    }
    const user = usuarios.find((u) => u.login.toLowerCase() === login.toLowerCase());
    if (!user || user.senha !== usuario.senha) {
      setErro('Usuário ou senha inválidos.');
      return;
    }
    setOperador(user.login);
    setErro('');
    setMsgSucesso('');
    setScreen('dashboard');
  }

  function handleLogout() {
    setOperador(null);
    setUsuario({ login: '', senha: '' });
    setAuthScreen('login');
    setErro('');
    setScreen('login');
  }

  function handleCadastro(e) {
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
    setUsuarios((prev) => [...prev, { login: login.trim(), senha, pergunta: pergunta.trim(), resposta: resposta.trim() }]);
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

  function handleEsqueciConfirmar(e) {
    e.preventDefault();
    const user = usuarios.find((u) => u.login.toLowerCase() === esqueci.login.trim().toLowerCase());
    if (!user) {
      setErro('Usuário não encontrado.');
      setEsqueci({ etapa: 1, login: '', perguntaEncontrada: '', resposta: '', novaSenha: '', confirmar: '' });
      return;
    }
    if (user.resposta.trim().toLowerCase() !== esqueci.resposta.trim().toLowerCase()) {
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
    setUsuarios((prev) => prev.map((u) => (u.login.toLowerCase() === user.login.toLowerCase() ? { ...u, senha: esqueci.novaSenha } : u)));
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
    setFinanceiro((prev) => [...prev, { id: prev.length + 1, tipo: 'Abertura de Caixa', valor, hora: Date.now() }]);
    setValorAberturaInput('');
    setErro('');
    showToast('Caixa aberto com sucesso');
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
    setPagamento({ forma: null, valorRecebido: '', desconto: '' });
    setErro('');
    setScreen('pagamento');
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

    const numero = vendas.length + 1;
    const venda = {
      numero,
      itens: carrinho,
      subtotal: totalCarrinho,
      desconto: descontoAplicado,
      total: totalComDesconto,
      forma: pagamento.forma,
      troco,
      hora: Date.now(),
      operador,
    };

    // Baixar estoque
    setProdutos((prev) =>
      prev.map((p) => {
        const item = carrinho.find((i) => i.id === p.id);
        return item ? { ...p, estoque: p.estoque - item.qtd } : p;
      })
    );

    // Registrar financeiro
    setFinanceiro((prev) => [
      ...prev,
      { id: prev.length + 1, tipo: `Venda #${numero} (${pagamento.forma})`, valor: totalComDesconto, hora: venda.hora },
    ]);

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
    const id = produtos.length ? Math.max(...produtos.map((p) => p.id)) + 1 : 1;
    setProdutos((prev) => [...prev, { id, ...novo }]);
    showToast('Produto cadastrado');
  }

  function editarProduto(id, dados) {
    setProdutos((prev) => prev.map((p) => (p.id === id ? { ...p, ...dados } : p)));
    showToast('Produto atualizado');
  }

  function excluirProduto(id) {
    setProdutos((prev) => prev.filter((p) => p.id !== id));
    showToast('Produto removido', 'alerta');
  }

  function cancelarVenda(numero) {
    const venda = vendas.find((v) => v.numero === numero);
    if (!venda || venda.cancelada) return;
    setProdutos((prev) =>
      prev.map((p) => {
        const item = venda.itens.find((i) => i.id === p.id);
        return item ? { ...p, estoque: p.estoque + item.qtd } : p;
      })
    );
    setFinanceiro((prev) => [
      ...prev,
      { id: prev.length + 1, tipo: `Estorno Venda #${venda.numero}`, valor: -venda.total, hora: Date.now() },
    ]);
    setVendas((prev) => prev.map((v) => (v.numero === numero ? { ...v, cancelada: true } : v)));
    showToast(`Venda #${String(numero).padStart(4, '0')} cancelada`, 'alerta');
  }

  function registrarSangria(e) {
    e.preventDefault();
    if (!caixa.aberto) { setErro('Abra o caixa antes de registrar uma sangria.'); return; }
    const valor = parseFloat(String(sangriaInput.valor).replace(',', '.'));
    if (isNaN(valor) || valor <= 0) { setErro('Informe um valor de sangria válido.'); return; }
    if (valor > valorEsperadoCaixa) { setErro('Valor de sangria maior que o saldo disponível em caixa.'); return; }
    const registro = { id: sangrias.length + 1, valor, motivo: sangriaInput.motivo.trim() || 'Não informado', hora: Date.now(), operador };
    setSangrias((prev) => [...prev, registro]);
    setFinanceiro((prev) => [
      ...prev,
      { id: prev.length + 1, tipo: `Sangria: ${registro.motivo}`, valor: -valor, hora: registro.hora },
    ]);
    setSangriaInput({ valor: '', motivo: '' });
    setErro('');
    showToast('Sangria registrada');
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
      { id: prev.length + 1, tipo: 'Fechamento de Caixa', valor: contado, hora: Date.now() },
    ]);
    setUltimoFechamento(fechamento);
    setCaixa({ aberto: false, valorAbertura: 0, dataAbertura: null, operador: null });
    setContagemFechamento('');
    setErro('');
    showToast('Caixa fechado com sucesso');
    setScreen('dashboard');
  }

  // ---------- LOGIN / CADASTRO / ESQUECI SENHA ----------
  if (screen === 'login') {
    const trocarView = (v) => { setAuthScreen(v); setErro(''); setMsgSucesso(''); };

    return (
      <div style={{ minHeight: '100%', background: C.bgDark, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter',sans-serif", padding: 20 }}>
        <style>{FONTS}</style>
        <div style={{ width: 360, background: C.bgDark2, border: `1px solid ${C.borderDark}`, borderRadius: 14, padding: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 9, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Store size={19} color={C.bgDark} strokeWidth={2.4} />
            </div>
            <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 20, color: C.textLight, letterSpacing: -0.3 }}>PDV Terminal</span>
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

              <button type="submit" style={{ width: '100%', background: C.accent, color: C.bgDark, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif" }}>
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
              <p style={{ color: C.textLight, fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 4, fontFamily: "'Space Grotesk',sans-serif" }}>Criar conta de operador</p>
              <p style={{ color: C.muted, fontSize: 12.5, marginTop: 0, marginBottom: 18 }}>A pergunta de segurança é usada para recuperar a senha.</p>

              <FieldDark icon={User} placeholder="Login desejado" value={cadastro.login} onChange={(v) => setCadastro({ ...cadastro, login: v })} />
              <FieldDark icon={Lock} type="password" placeholder="Senha (mín. 4 caracteres)" value={cadastro.senha} onChange={(v) => setCadastro({ ...cadastro, senha: v })} />
              <FieldDark icon={Lock} type="password" placeholder="Confirmar senha" value={cadastro.confirmar} onChange={(v) => setCadastro({ ...cadastro, confirmar: v })} />
              <FieldDark icon={HelpCircle} placeholder="Pergunta de segurança" value={cadastro.pergunta} onChange={(v) => setCadastro({ ...cadastro, pergunta: v })} />
              <FieldDark icon={KeyRound} placeholder="Resposta" value={cadastro.resposta} onChange={(v) => setCadastro({ ...cadastro, resposta: v })} last />

              {erro && <ErroBox erro={erro} />}

              <button type="submit" style={{ width: '100%', background: C.accent, color: C.bgDark, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif", display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
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
              <p style={{ color: C.textLight, fontSize: 15, fontWeight: 700, marginTop: 0, marginBottom: 4, fontFamily: "'Space Grotesk',sans-serif" }}>Recuperar senha</p>

              {esqueci.etapa === 1 && (
                <form onSubmit={handleEsqueciBuscar}>
                  <p style={{ color: C.muted, fontSize: 12.5, marginTop: 0, marginBottom: 18 }}>Informe seu login para localizar sua pergunta de segurança.</p>
                  <FieldDark icon={User} placeholder="Seu login" value={esqueci.login} onChange={(v) => setEsqueci({ ...esqueci, login: v })} last />
                  {erro && <ErroBox erro={erro} />}
                  <button type="submit" style={{ width: '100%', background: C.accent, color: C.bgDark, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif" }}>
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
                  <button type="submit" style={{ width: '100%', background: C.accent, color: C.bgDark, border: 'none', borderRadius: 8, padding: '11px 0', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif" }}>
                    Redefinir senha
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- SHELL (post-login) ----------
  const navItems = [
    { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { key: 'pdv', label: 'PDV', icon: ShoppingCart, disabled: !caixa.aberto },
    { key: 'relatorios', label: 'Relatórios', icon: BarChart3 },
    { key: 'produtos', label: 'Produtos', icon: Package },
    { key: 'vendas', label: 'Vendas', icon: ListChecks },
    { key: 'financeiro', label: 'Financeiro', icon: Receipt },
  ];
  const navItemsCaixa = [
    { key: 'sangria', label: 'Sangria', icon: ArrowDownCircle, disabled: !caixa.aberto },
    { key: 'fecharCaixa', label: 'Fechar Caixa', icon: Wallet, disabled: !caixa.aberto, danger: true },
  ];

  const stepIdx = FLOW.findIndex((f) => f.key === screen);

  return (
    <div style={{ minHeight: '100%', display: 'flex', background: C.bgLight, fontFamily: "'Inter',sans-serif", color: C.textDark }}>
      <style>{FONTS}</style>

      {/* SIDEBAR */}
      <div style={{ width: 208, background: C.bgDark, display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '20px 18px 16px' }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: C.accent, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Store size={16} color={C.bgDark} strokeWidth={2.4} />
          </div>
          <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: 15.5, color: C.textLight }}>PDV Terminal</span>
        </div>

        <div style={{ margin: '4px 14px 18px', padding: '9px 12px', borderRadius: 9, background: caixa.aberto ? 'rgba(45,212,191,0.12)' : C.bgDark2, border: `1px solid ${caixa.aberto ? 'rgba(45,212,191,0.4)' : C.borderDark}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 7, height: 7, borderRadius: 99, background: caixa.aberto ? C.accent : C.mutedDark, boxShadow: caixa.aberto ? `0 0 6px ${C.accent}` : 'none' }} />
            <span style={{ fontSize: 11.5, fontWeight: 600, color: caixa.aberto ? C.accent : C.muted, textTransform: 'uppercase', letterSpacing: 0.4 }}>
              Caixa {caixa.aberto ? 'Aberto' : 'Fechado'}
            </span>
          </div>
          {caixa.aberto && (
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: C.textLight, marginTop: 4 }}>{fmt(valorEsperadoCaixa)}</div>
          )}
        </div>

        <div style={{ flex: 1, padding: '0 10px', display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = screen === item.key || (item.key === 'pdv' && ['pdv', 'pagamento', 'cupom', 'abrirCaixa'].includes(screen));
            return (
              <button
                key={item.key}
                className="nav-btn"
                disabled={item.disabled}
                onClick={() => { setErro(''); setScreen(item.key); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none',
                  background: active ? C.bgDark2 : 'transparent',
                  color: item.disabled ? C.mutedDark : active ? C.textLight : C.muted,
                  fontSize: 13.5, fontWeight: 500, cursor: item.disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}

          <div style={{ height: 1, background: C.borderDark, margin: '8px 2px' }} />

          {navItemsCaixa.map((item) => {
            const Icon = item.icon;
            const active = screen === item.key;
            return (
              <button
                key={item.key}
                className="nav-btn"
                disabled={item.disabled}
                onClick={() => { setErro(''); if (item.key === 'fecharCaixa') setContagemFechamento(''); setScreen(item.key); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none',
                  background: active ? C.bgDark2 : 'transparent',
                  color: item.disabled ? C.mutedDark : active ? (item.danger ? '#FCA5A5' : C.textLight) : (item.danger ? '#E88A8A' : C.muted),
                  fontSize: 13.5, fontWeight: 500, cursor: item.disabled ? 'not-allowed' : 'pointer', textAlign: 'left',
                }}
              >
                <Icon size={16} strokeWidth={2} />
                {item.label}
              </button>
            );
          })}
        </div>

        <div style={{ padding: '4px 10px' }}>
          <button
            onClick={() => { setErro(''); setScreen('configuracoes'); }}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 8, border: 'none', width: '100%',
              background: screen === 'configuracoes' ? C.bgDark2 : 'transparent',
              color: screen === 'configuracoes' ? C.textLight : C.muted, fontSize: 13.5, fontWeight: 500, cursor: 'pointer', textAlign: 'left',
            }}
          >
            <Settings size={16} strokeWidth={2} />
            Configurações
          </button>
        </div>

        <div style={{ padding: 14, borderTop: `1px solid ${C.borderDark}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 99, background: C.bgDark3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <User size={14} color={C.muted} />
          </div>
          <span style={{ fontSize: 12.5, color: C.textLight, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{operador}</span>
          <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
            <LogOut size={15} color={C.muted} />
          </button>
        </div>
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
          <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: caixa.aberto ? C.accentDark : C.muted }}>
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
                      background: done ? C.accent : active ? C.bgDark : C.bgLight,
                      border: `1px solid ${done ? C.accent : active ? C.bgDark : C.borderLight}`,
                      fontSize: 11, fontWeight: 700, color: done ? C.bgDark : active ? C.textLight : C.muted,
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
              categorias={categorias} categoriaAtiva={categoriaAtiva} setCategoriaAtiva={setCategoriaAtiva}
              carrinho={carrinho} onAdd={addProduto} onQtd={alterarQtd} onRemover={removerItem}
              total={totalCarrinho} onFinalizar={irParaPagamento}
            />
          )}

          {screen === 'pagamento' && (
            <PagamentoScreen subtotal={totalCarrinho} desconto={descontoAplicado} total={totalComDesconto} pagamento={pagamento} setPagamento={setPagamento} onConfirmar={confirmarPagamento} onVoltar={() => setScreen('pdv')} config={config} />
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

          {screen === 'relatorios' && (
            <RelatoriosScreen vendas={vendas} sangrias={sangrias} />
          )}

          {screen === 'configuracoes' && (
            <ConfiguracoesScreen config={config} setConfig={setConfig} />
          )}

          {screen === 'produtos' && (
            <ProdutosScreen produtos={produtos} onAdd={adicionarProdutoCadastro} onEdit={editarProduto} onDelete={excluirProduto} />
          )}

          {screen === 'vendas' && <VendasScreen vendas={vendas} onCancelar={cancelarVenda} />}

          {screen === 'financeiro' && <FinanceiroScreen financeiro={financeiro} />}
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}

// ---------- SUBCOMPONENTES ----------

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

function Card({ children, style }) {
  return <div style={{ background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 18, boxShadow: '0 1px 2px rgba(20,22,26,0.03)', ...style }}>{children}</div>;
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

function KpiCard({ icon: Icon, iconColor, label, value, sub, accentBar }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 16,
        boxShadow: hover ? '0 8px 20px rgba(20,22,26,0.08)' : '0 1px 2px rgba(20,22,26,0.03)',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)', transition: 'all 0.18s ease', position: 'relative', overflow: 'hidden',
      }}
    >
      {accentBar && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentBar }} />}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{ width: 26, height: 26, borderRadius: 7, background: `${iconColor}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={13.5} color={iconColor} strokeWidth={2.3} />
        </div>
        <span style={{ fontSize: 11, color: C.muted, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.4 }}>{label}</span>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 21, color: C.textDark }}>{value}</div>
      {sub && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function Dashboard({ caixa, valorEsperadoCaixa, vendasDoTurno, produtos, ultimoFechamento, vendas, onAbrirCaixa, onIrPDV }) {
  const totalVendido = vendasDoTurno.reduce((s, v) => s + v.total, 0);
  const ticketMedio = vendasDoTurno.length ? totalVendido / vendasDoTurno.length : 0;
  const baixoEstoque = produtos.filter((p) => p.estoque <= 20);

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
          <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Dashboard</h1>
          <p style={{ color: C.muted, fontSize: 13.5, margin: 0 }}>Visão geral do turno atual e desempenho recente.</p>
        </div>
        {!caixa.aberto ? (
          <button onClick={onAbrirCaixa} style={btnPrimary}><Wallet size={15} /> Abrir Caixa</button>
        ) : (
          <button onClick={onIrPDV} style={btnPrimary}><ShoppingCart size={15} /> Ir para o PDV</button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 18 }}>
        <KpiCard icon={Wallet} iconColor={caixa.aberto ? C.accentDark : C.danger} accentBar={caixa.aberto ? C.accent : C.danger}
          label="Status do Caixa" value={caixa.aberto ? 'Aberto' : 'Fechado'} sub={caixa.aberto ? `desde ${hora(caixa.dataAbertura)}` : 'nenhum turno ativo'} />
        <KpiCard icon={Receipt} iconColor={C.accentDark} accentBar={C.accent}
          label="Vendas do Turno" value={fmt(totalVendido)} sub={`${vendasDoTurno.length} venda(s)`} />
        <KpiCard icon={TrendingUp} iconColor="#60A5FA" accentBar="#60A5FA"
          label="Ticket Médio" value={fmt(ticketMedio)} sub="por venda no turno" />
        <KpiCard icon={Banknote} iconColor="#F59E0B" accentBar="#F59E0B"
          label="Saldo em Caixa" value={caixa.aberto ? fmt(valorEsperadoCaixa) : '—'} sub={caixa.aberto ? 'dinheiro em espécie' : 'caixa fechado'} />
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
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Abrir Caixa</h1>
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
          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 16 }}>
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
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

            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 22 }}>{fmt(total)}</span>
          </div>
          <button onClick={onFinalizar} disabled={carrinho.length === 0} style={{ ...btnPrimary, width: '100%', justifyContent: 'center', opacity: carrinho.length === 0 ? 0.5 : 1, cursor: carrinho.length === 0 ? 'not-allowed' : 'pointer' }}>
            Finalizar Venda
          </button>
        </div>
      </div>
    </div>
  );
}

function PagamentoScreen({ subtotal, desconto, total, pagamento, setPagamento, onConfirmar, onVoltar, config }) {
  const formas = [
    { key: 'Dinheiro', icon: Banknote },
    { key: 'Cartão Débito', icon: CreditCard },
    { key: 'Cartão Crédito', icon: CreditCard },
    { key: 'Pix', icon: QrCode },
  ];
  const recebido = parseFloat(String(pagamento.valorRecebido).replace(',', '.'));
  const troco = !isNaN(recebido) ? recebido - total : null;

  return (
    <div style={{ maxWidth: 480 }}>
      <button onClick={onVoltar} style={btnGhost}><ArrowLeft size={13} /> Voltar ao PDV</button>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, margin: '14px 0 18px' }}>Receber Pagamento</h1>

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

      <div style={{ background: C.bgDark, borderRadius: 12, padding: 20, marginBottom: 18, textAlign: 'center' }}>
        <div style={{ fontSize: 11.5, color: C.muted, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 600 }}>Total a pagar</div>
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 36, color: C.accent, textShadow: `0 0 18px ${C.accentGlow}`, marginTop: 4 }}>{fmt(total)}</div>
        {desconto > 0 && <div style={{ fontSize: 11.5, color: C.muted, marginTop: 4 }}>desconto de {fmt(desconto)} aplicado</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginBottom: 16 }}>
        {formas.map((f) => {
          const Icon = f.icon;
          const active = pagamento.forma === f.key;
          return (
            <button key={f.key} onClick={() => setPagamento({ forma: f.key, valorRecebido: '' })} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px', borderRadius: 9,
              border: `1.5px solid ${active ? C.accentDark : C.borderLight}`, background: active ? 'rgba(45,212,191,0.08)' : C.panel, cursor: 'pointer',
            }}>
              <Icon size={16} color={active ? C.accentDark : C.muted} />
              <span style={{ fontSize: 13, fontWeight: 600, color: active ? C.accentDark : C.textDark }}>{f.key}</span>
            </button>
          );
        })}
      </div>

      {pagamento.forma === 'Dinheiro' && (
        <Card style={{ marginBottom: 16 }}>
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

      <button onClick={onConfirmar} style={{ ...btnPrimary, width: '100%', justifyContent: 'center' }}>
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
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, margin: '0 0 18px' }}>Cupom Emitido</h1>

      <div style={{ background: C.panel, border: `1px solid ${C.borderLight}`, borderRadius: 12, padding: 20, fontFamily: "'JetBrains Mono',monospace", marginBottom: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 10 }}>
          <div style={{ fontWeight: 700, fontSize: 13.5, fontFamily: "'Space Grotesk',sans-serif" }}>PDV TERMINAL</div>
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
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Fechar Caixa</h1>
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

function FinanceiroScreen({ financeiro }) {
  return (
    <div style={{ maxWidth: 640 }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Financeiro</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Lançamentos registrados automaticamente pelo PDV.</p>
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
            <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", fontWeight: 600 }}>{fmt(f.valor)}</span>
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

function ProdutosScreen({ produtos, onAdd, onEdit, onDelete }) {
  const [novo, setNovo] = useState({ nome: '', categoria: '', preco: '', estoque: '', codigoBarras: '' });
  const [erroForm, setErroForm] = useState('');
  const [editId, setEditId] = useState(null);
  const [editValues, setEditValues] = useState({});

  function submitNovo(e) {
    e.preventDefault();
    const preco = parseFloat(String(novo.preco).replace(',', '.'));
    const estoque = parseInt(novo.estoque, 10);
    if (!novo.nome.trim() || !novo.categoria.trim() || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) {
      setErroForm('Preencha nome, categoria, preço e estoque corretamente.');
      return;
    }
    if (novo.codigoBarras && produtos.some((p) => p.codigoBarras === novo.codigoBarras.trim())) {
      setErroForm('Já existe um produto com esse código de barras.');
      return;
    }
    onAdd({ nome: novo.nome.trim(), categoria: novo.categoria.trim(), preco, estoque, codigoBarras: novo.codigoBarras.trim() || gerarCodigoBarras() });
    setNovo({ nome: '', categoria: '', preco: '', estoque: '', codigoBarras: '' });
    setErroForm('');
  }

  function iniciarEdicao(p) {
    setEditId(p.id);
    setEditValues({ nome: p.nome, categoria: p.categoria, preco: String(p.preco), estoque: String(p.estoque), codigoBarras: p.codigoBarras || '' });
  }

  function salvarEdicao(id) {
    const preco = parseFloat(String(editValues.preco).replace(',', '.'));
    const estoque = parseInt(editValues.estoque, 10);
    if (!editValues.nome.trim() || !editValues.categoria.trim() || isNaN(preco) || preco < 0 || isNaN(estoque) || estoque < 0) return;
    onEdit(id, { nome: editValues.nome.trim(), categoria: editValues.categoria.trim(), preco, estoque, codigoBarras: editValues.codigoBarras.trim() });
    setEditId(null);
  }

  const cellInput = { width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 6, padding: '5px 7px', fontSize: 12.5, fontFamily: "'Inter',sans-serif" };
  const cellInputMono = { ...cellInput, fontFamily: "'JetBrains Mono',monospace" };

  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Cadastro de Produtos</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Adicione, edite ou remova itens do catálogo, incluindo código de barras.</p>

      <form onSubmit={submitNovo}>
        <Card style={{ marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Novo produto</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
            <div>
              <label style={labelSm}>Nome</label>
              <input value={novo.nome} onChange={(e) => setNovo({ ...novo, nome: e.target.value })} placeholder="Ex: Suco de Laranja 1L" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Categoria</label>
              <input value={novo.categoria} onChange={(e) => setNovo({ ...novo, categoria: e.target.value })} placeholder="Bebidas" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Preço (R$)</label>
              <input value={novo.preco} onChange={(e) => setNovo({ ...novo, preco: e.target.value })} placeholder="0,00" inputMode="decimal" style={cellInput} />
            </div>
            <div>
              <label style={labelSm}>Estoque</label>
              <input value={novo.estoque} onChange={(e) => setNovo({ ...novo, estoque: e.target.value })} placeholder="0" inputMode="numeric" style={cellInput} />
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
          <span style={{ flex: 1.8 }}>Produto</span>
          <span style={{ flex: 1 }}>Categoria</span>
          <span style={{ width: 120 }}>Código de barras</span>
          <span style={{ width: 90, textAlign: 'right' }}>Preço</span>
          <span style={{ width: 70, textAlign: 'right' }}>Estoque</span>
          <span style={{ width: 76, textAlign: 'right' }}>Ações</span>
        </div>
        {produtos.map((p) => {
          const editando = editId === p.id;
          return (
            <div key={p.id} className="table-row" style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', borderTop: `1px solid ${C.borderLight}`, fontSize: 13, gap: 8 }}>
              {editando ? (
                <>
                  <input value={editValues.nome} onChange={(e) => setEditValues({ ...editValues, nome: e.target.value })} style={{ ...cellInput, flex: 1.8 }} />
                  <input value={editValues.categoria} onChange={(e) => setEditValues({ ...editValues, categoria: e.target.value })} style={{ ...cellInput, flex: 1 }} />
                  <input value={editValues.codigoBarras} onChange={(e) => setEditValues({ ...editValues, codigoBarras: e.target.value })} style={{ ...cellInputMono, width: 120 }} />
                  <input value={editValues.preco} onChange={(e) => setEditValues({ ...editValues, preco: e.target.value })} style={{ ...cellInput, width: 90 }} />
                  <input value={editValues.estoque} onChange={(e) => setEditValues({ ...editValues, estoque: e.target.value })} style={{ ...cellInput, width: 70 }} />
                  <div style={{ width: 76, display: 'flex', justifyContent: 'flex-end', gap: 4 }}>
                    <button onClick={() => salvarEdicao(p.id)} style={iconBtn}><Check size={13} color={C.accentDark} /></button>
                    <button onClick={() => setEditId(null)} style={iconBtn}><X size={13} color={C.muted} /></button>
                  </div>
                </>
              ) : (
                <>
                  <span style={{ flex: 1.8, fontWeight: 500 }}>{p.nome}</span>
                  <span style={{ flex: 1, color: C.muted }}>{p.categoria}</span>
                  <span style={{ width: 120, color: C.muted, fontFamily: "'JetBrains Mono',monospace", fontSize: 11.5, display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Barcode size={12} />{p.codigoBarras || '—'}
                  </span>
                  <span style={{ width: 90, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace" }}>{fmt(p.preco)}</span>
                  <span style={{ width: 70, textAlign: 'right', fontFamily: "'JetBrains Mono',monospace", color: p.estoque <= 5 ? C.danger : p.estoque <= 20 ? C.warn : C.textDark }}>{p.estoque}</span>
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
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Vendas</h1>
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
          const aberto = expandido === v.numero;
          return (
            <div key={v.numero} className="table-row" style={{ borderTop: `1px solid ${C.borderLight}` }}>
              <div style={{ display: 'flex', alignItems: 'center', padding: '9px 16px', fontSize: 13 }}>
                <button onClick={() => setExpandido(aberto ? null : v.numero)} style={{ width: 70, textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, color: C.textDark, padding: 0 }}>
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
                    <button onClick={() => onCancelar(v.numero)} style={{ ...btnGhost, color: C.danger, fontSize: 11.5, justifyContent: 'flex-end', width: '100%' }}>
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
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 20, margin: '0 0 4px' }}>Sangria de Caixa</h1>
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

function RelatoriosScreen({ vendas, sangrias }) {
  const [periodo, setPeriodo] = useState('diario');

  const inicioPeriodo = useMemo(() => {
    const agora = new Date();
    if (periodo === 'diario') {
      return new Date(agora.getFullYear(), agora.getMonth(), agora.getDate()).getTime();
    }
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

  const totalVendido = vendasFiltradas.reduce((s, v) => s + v.total, 0);
  const ticketMedio = vendasFiltradas.length ? totalVendido / vendasFiltradas.length : 0;
  const totalSangriasPeriodo = sangriasFiltradas.reduce((s, x) => s + x.valor, 0);

  const porForma = useMemo(() => {
    const t = { Dinheiro: 0, 'Cartão Débito': 0, 'Cartão Crédito': 0, Pix: 0 };
    vendasFiltradas.forEach((v) => { t[v.forma] = (t[v.forma] || 0) + v.total; });
    return t;
  }, [vendasFiltradas]);

  const produtosMaisVendidos = useMemo(() => {
    const mapa = {};
    vendasFiltradas.forEach((v) => v.itens.forEach((i) => {
      mapa[i.nome] = (mapa[i.nome] || 0) + i.qtd;
    }));
    return Object.entries(mapa).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [vendasFiltradas]);

  const periodos = [
    { key: 'diario', label: 'Diário', icon: Calendar },
    { key: 'semanal', label: 'Semanal', icon: CalendarDays },
    { key: 'mensal', label: 'Mensal', icon: CalendarRange },
  ];

  function exportarCSV() {
    const linhas = [['Numero', 'Data/Hora', 'Forma', 'Subtotal', 'Desconto', 'Total', 'Operador']];
    vendasFiltradas.forEach((v) => {
      linhas.push([v.numero, dataHora(v.hora), v.forma, (v.subtotal ?? v.total).toFixed(2), (v.desconto ?? 0).toFixed(2), v.total.toFixed(2), v.operador]);
    });
    const csv = linhas.map((l) => l.join(';')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-${periodo}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 920 }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Relatórios</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 18px' }}>Desempenho de vendas por período.</p>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'space-between', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {periodos.map((p) => {
            const Icon = p.icon;
            const active = periodo === p.key;
            return (
              <button key={p.key} onClick={() => setPeriodo(p.key)} style={{
                display: 'flex', alignItems: 'center', gap: 7, padding: '8px 14px', borderRadius: 8,
                border: `1.5px solid ${active ? C.accentDark : C.borderLight}`, background: active ? 'rgba(45,212,191,0.08)' : C.panel, cursor: 'pointer',
                color: active ? C.accentDark : C.textDark, fontWeight: 600, fontSize: 13,
              }}>
                <Icon size={14} /> {p.label}
              </button>
            );
          })}
        </div>
        <button onClick={exportarCSV} style={btnGhostSolid}>
          <Receipt size={14} /> Exportar CSV
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 20 }}>
        <Card>
          <span style={labelSm}>Total vendido</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(totalVendido)}</div>
        </Card>
        <Card>
          <span style={labelSm}>Vendas concluídas</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{vendasFiltradas.length}</div>
        </Card>
        <Card>
          <span style={labelSm}>Ticket médio</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6 }}>{fmt(ticketMedio)}</div>
        </Card>
        <Card>
          <span style={labelSm}>Sangrias no período</span>
          <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 700, fontSize: 19, marginTop: 6, color: C.danger }}>{fmt(totalSangriasPeriodo)}</div>
        </Card>
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
                <div style={{ height: '100%', width: totalVendido ? `${(valor / totalVendido) * 100}%` : '0%', background: C.accent }} />
              </div>
            </div>
          ))}
          {totalVendido === 0 && <div style={{ color: C.muted, fontSize: 12.5 }}>Sem vendas neste período.</div>}
        </Card>

        <Card>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 12 }}>Produtos mais vendidos</div>
          {produtosMaisVendidos.length === 0 && <div style={{ color: C.muted, fontSize: 12.5 }}>Sem vendas neste período.</div>}
          {produtosMaisVendidos.map(([nome, qtd], i) => (
            <div key={nome} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, padding: '6px 0', borderTop: i > 0 ? `1px solid ${C.borderLight}` : 'none' }}>
              <span>{nome}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 600, color: C.muted }}>{qtd} un.</span>
            </div>
          ))}
        </Card>
      </div>

      {canceladasFiltradas.length > 0 && (
        <div style={{ marginTop: 14, fontSize: 12, color: C.muted }}>
          {canceladasFiltradas.length} venda(s) cancelada(s) no período não entram nos totais acima.
        </div>
      )}
    </div>
  );
}

function ConfiguracoesScreen({ config, setConfig }) {
  const [local, setLocal] = useState(config);
  const [salvo, setSalvo] = useState(false);

  function salvar(e) {
    e.preventDefault();
    setConfig(local);
    setSalvo(true);
    setTimeout(() => setSalvo(false), 2000);
  }

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 22, margin: '0 0 4px' }}>Configurações</h1>
      <p style={{ color: C.muted, fontSize: 13.5, margin: '0 0 20px' }}>Dados usados na emissão de cupons e identificação da loja.</p>

      <form onSubmit={salvar}>
        <Card>
          <label style={labelSm}>Nome da loja</label>
          <input value={local.nomeLoja} onChange={(e) => setLocal({ ...local, nomeLoja: e.target.value })} style={inputLightStyle} />

          <label style={{ ...labelSm, marginTop: 14 }}>CNPJ</label>
          <input value={local.cnpj} onChange={(e) => setLocal({ ...local, cnpj: e.target.value })} placeholder="00.000.000/0000-00" style={inputLightStyle} />

          <label style={{ ...labelSm, marginTop: 14 }}>Endereço</label>
          <input value={local.endereco} onChange={(e) => setLocal({ ...local, endereco: e.target.value })} placeholder="Rua, número, bairro, cidade" style={inputLightStyle} />

          <label style={{ ...labelSm, marginTop: 14 }}>Mensagem de rodapé do cupom</label>
          <input value={local.mensagemRodape} onChange={(e) => setLocal({ ...local, mensagemRodape: e.target.value })} style={inputLightStyle} />

          <label style={{ ...labelSm, marginTop: 14 }}>Largura da bobina térmica</label>
          <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
            {['58mm', '80mm'].map((l) => (
              <button type="button" key={l} onClick={() => setLocal({ ...local, larguraCupom: l })} style={{
                flex: 1, padding: '9px 0', borderRadius: 8, border: `1.5px solid ${local.larguraCupom === l ? C.accentDark : C.borderLight}`,
                background: local.larguraCupom === l ? 'rgba(45,212,191,0.08)' : C.panel, color: local.larguraCupom === l ? C.accentDark : C.textDark,
                fontWeight: 600, fontSize: 13, cursor: 'pointer',
              }}>
                {l}
              </button>
            ))}
          </div>

          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 20 }}>
            <Check size={15} /> Salvar Configurações
          </button>
          {salvo && (
            <div style={{ display: 'flex', gap: 7, alignItems: 'center', justifyContent: 'center', color: C.accentDark, fontSize: 12.5, fontWeight: 600, marginTop: 10 }}>
              <CheckCircle2 size={14} /> Configurações salvas
            </div>
          )}
        </Card>

        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 4 }}>
            <QrCode size={15} color={C.accentDark} />
            <span style={{ fontWeight: 700, fontSize: 13.5 }}>Recebimento via Pix</span>
          </div>
          <p style={{ fontSize: 12, color: C.muted, margin: '0 0 14px' }}>
            O QR Code exibido na tela de pagamento é gerado com esses dados — o valor cai direto nesta chave.
          </p>

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
          <p style={{ fontSize: 11, color: C.muted, margin: '6px 0 0' }}>
            Digite a chave exatamente como está cadastrada no banco (para CPF/CNPJ, só números; para telefone, use o formato +55DDNÚMERO).
          </p>

          <label style={{ ...labelSm, marginTop: 14 }}>Nome do recebedor</label>
          <input value={local.nomeRecebedorPix} onChange={(e) => setLocal({ ...local, nomeRecebedorPix: e.target.value })} maxLength={25} style={inputLightStyle} />

          <label style={{ ...labelSm, marginTop: 14 }}>Cidade do recebedor</label>
          <input value={local.cidadeRecebedorPix} onChange={(e) => setLocal({ ...local, cidadeRecebedorPix: e.target.value })} maxLength={15} style={inputLightStyle} />

          <button type="submit" style={{ ...btnPrimary, width: '100%', justifyContent: 'center', marginTop: 20 }}>
            <Check size={15} /> Salvar Configurações
          </button>
        </Card>
      </form>
    </div>
  );
}

// ---------- ESTILOS COMPARTILHADOS ----------
const btnPrimary = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.accent, color: C.bgDark, border: 'none',
  borderRadius: 9, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif",
};
const btnDanger = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.danger, color: '#fff', border: 'none',
  borderRadius: 9, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif",
};
const btnGhost = {
  display: 'inline-flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: C.muted, fontSize: 12.5, cursor: 'pointer', padding: 0, fontWeight: 600,
};
const btnGhostSolid = {
  display: 'inline-flex', alignItems: 'center', gap: 7, background: C.panel, color: C.textDark, border: `1px solid ${C.borderLight}`,
  borderRadius: 9, padding: '11px 18px', fontWeight: 700, fontSize: 13.5, cursor: 'pointer', fontFamily: "'Space Grotesk',sans-serif",
};
const qtyBtn = {
  width: 20, height: 20, borderRadius: 5, border: `1px solid ${C.borderLight}`, background: C.bgLight, display: 'flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: C.textDark, flexShrink: 0,
};
const iconBtn = {
  width: 24, height: 24, borderRadius: 6, border: `1px solid ${C.borderLight}`, background: C.panel, display: 'flex',
  alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0,
};
const labelSm = { fontSize: 10.5, color: C.muted, display: 'block', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.3 };
const inputLightStyle = {
  width: '100%', boxSizing: 'border-box', border: `1px solid ${C.borderLight}`, borderRadius: 8,
  padding: '9px 12px', fontSize: 13.5, outline: 'none', fontFamily: "'Inter',sans-serif", marginTop: 2,
};
