import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard, ShoppingCart, Boxes, ClipboardList, Printer, Calendar, Truck,
  Users, Gift, Wallet, MessageCircle, UserCog, Plug, BarChart3, Utensils, Coffee,
  Beef, Pizza, Cake, Croissant, Scale, Search, Bell, X, Check, Plus, Minus,
  CreditCard, QrCode, Banknote, AlertTriangle, ArrowRight, Upload, CheckCircle2,
  Circle, Clock, MapPin, LogOut, ShieldCheck, TrendingUp, Power, Menu, Store,
  ChevronRight, ChevronLeft, Smartphone, Receipt, Zap, Hash, User, PlayCircle, Star, Lock, Delete,
  ChefHat, Volume2, VolumeX, Bell as BellIcon, Navigation, Bike, ThumbsUp, ThumbsDown, Timer, Flame,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { supabase, STORE_ID } from "./supabaseClient";

// Categorias reais da loja (para o cadastro de produtos)
const CATEGORIAS = [
  { id: "cmq05qxob0004j5kv3nr8ckjo", name: "Pães" },
  { id: "cmq05qy5o0006j5kv38pbt9hj", name: "Bolos & Tortas" },
  { id: "cmq05qyn50008j5kvkzrdb3bs", name: "Salgados" },
  { id: "cmq05qz4n000aj5kvjyacf6qc", name: "Bebidas" },
];
const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Math.random().toString(36).slice(2, 6);

/* ============================ Marca ============================ */
const ORANGE = "#FF5630";
const NAVY = "#1A2138";
const CREAM = "#F4F2EC";
const SOFT = "#FFF1EC";

const money = (n) => "R$ " + n.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ============================ Ícone da marca ============================ */
function ZipIcon({ size = 36, radius = 9 }) {
  const s = size / 100;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="0" y="0" width="100" height="100" rx={radius / s} fill={ORANGE} />
      <g transform="translate(16,16) scale(0.68)" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <line x1="6" y1="30" x2="28" y2="30" strokeWidth="6.5" opacity="0.9" />
        <line x1="2" y1="50" x2="24" y2="50" strokeWidth="6.5" opacity="0.7" />
        <line x1="6" y1="70" x2="28" y2="70" strokeWidth="6.5" opacity="0.9" />
        <path d="M48 27 H90 L40 73 H82" strokeWidth="11" />
      </g>
    </svg>
  );
}

/* ============================ Dados de exemplo ============================ */
const UNITS = [
  { k: "restaurante", label: "Restaurante", icon: Utensils },
  { k: "cafeteria", label: "Cafeteria", icon: Coffee },
  { k: "hamburgueria", label: "Hamburgueria", icon: Beef },
  { k: "pizzaria", label: "Pizzaria", icon: Pizza },
  { k: "doceria", label: "Doceria", icon: Cake },
  { k: "pastelaria", label: "Pastelaria", icon: Croissant },
  { k: "tipicas", label: "Típicas", icon: Utensils },
  { k: "pesagem", label: "Self-service (peso)", icon: Scale },
];

const PRODUTOS = {
  restaurante: [
    { n: "Prato executivo", p: 28.9 }, { n: "Strogonoff de frango", p: 32.0 },
    { n: "Filé acebolado", p: 39.9 }, { n: "Salada Caesar", p: 24.5 },
  ],
  cafeteria: [
    { n: "Café expresso", p: 6.0 }, { n: "Cappuccino", p: 11.0 },
    { n: "Pão na chapa", p: 9.5 }, { n: "Misto quente", p: 13.0 },
  ],
  hamburgueria: [
    { n: "Zip Burger clássico", p: 26.9 }, { n: "Cheddar bacon", p: 32.9 },
    { n: "Veggie", p: 28.0 }, { n: "Batata rústica", p: 18.0 },
  ],
  pizzaria: [
    { n: "Pizza margherita", p: 49.9 }, { n: "Pizza calabresa", p: 52.0 },
    { n: "Pizza portuguesa", p: 55.0 }, { n: "Broto doce", p: 32.0 },
  ],
  doceria: [
    { n: "Fatia de bolo", p: 12.0 }, { n: "Brigadeiro gourmet", p: 5.5 },
    { n: "Torta holandesa", p: 16.0 }, { n: "Pudim", p: 10.0 },
  ],
  pastelaria: [
    { n: "Pastel de carne", p: 9.0 }, { n: "Pastel de queijo", p: 9.0 },
    { n: "Caldo de cana 300ml", p: 8.0 }, { n: "Coxinha", p: 7.5 },
  ],
  tipicas: [
    { n: "Feijoada (porção)", p: 45.0 }, { n: "Acarajé", p: 18.0 },
    { n: "Tapioca recheada", p: 16.0 }, { n: "Caldo verde", p: 14.0 },
  ],
  pesagem: [{ n: "Buffet por kg", p: 69.9 }],
};

const INSUMOS = [
  { n: "Farinha de trigo", un: "kg", precoMed: 4.2, estoque: 180, min: 60, consumoDia: 35 },
  { n: "Açúcar refinado", un: "kg", precoMed: 5.1, estoque: 90, min: 40, consumoDia: 18 },
  { n: "Leite integral", un: "L", precoMed: 4.8, estoque: 120, min: 50, consumoDia: 40 },
  { n: "Fermento biológico", un: "kg", precoMed: 22.0, estoque: 8, min: 10, consumoDia: 2 },
  { n: "Manteiga", un: "kg", precoMed: 38.0, estoque: 25, min: 12, consumoDia: 6 },
  { n: "Carne moída (blend)", un: "kg", precoMed: 32.0, estoque: 44, min: 25, consumoDia: 14 },
  { n: "Queijo mussarela", un: "kg", precoMed: 41.0, estoque: 60, min: 30, consumoDia: 20 },
  { n: "Molho de tomate", un: "L", precoMed: 9.5, estoque: 70, min: 30, consumoDia: 15 },
  { n: "Caixa de hambúrguer", un: "un", precoMed: 0.9, estoque: 400, min: 200, consumoDia: 120 },
  { n: "Caixa de pizza", un: "un", precoMed: 2.3, estoque: 150, min: 120, consumoDia: 90 },
  { n: "Embalagem viagem 750ml", un: "un", precoMed: 0.75, estoque: 600, min: 250, consumoDia: 160 },
];

const FICHAS = [
  { prod: "Zip Burger clássico (viagem)", itens: ["Pão brioche x1", "Carne moída 180g", "Queijo mussarela 40g", "Caixa de hambúrguer x1"] },
  { prod: "Pizza margherita (viagem)", itens: ["Massa 320g", "Molho de tomate 120ml", "Queijo mussarela 150g", "Caixa de pizza x1"] },
  { prod: "Prato executivo (viagem)", itens: ["Arroz 200g", "Feijão 150g", "Proteína 180g", "Embalagem viagem 750ml x1"] },
];

const CLIENTES_INIC = [
  { n: "Marina Alves", tel: "(11) 99812-3344", zips: 320, gasto: 1240.5, cashback: true },
  { n: "Rafael Costa", tel: "(11) 99761-2210", zips: 85, gasto: 410.0, cashback: true },
  { n: "Júlia Mendes", tel: "(11) 99934-1100", zips: 0, gasto: 98.0, cashback: false },
  { n: "Pedro Santos", tel: "(11) 99877-5521", zips: 540, gasto: 2210.9, cashback: true },
];

const ENCOMENDAS = [
  { c: "Marina Alves", item: "Bolo 2kg chocolate", data: "16/06 14:00", status: "Em produção", valor: 180 },
  { c: "Festa Corp X", item: "100 salgados + 2 bolos", data: "18/06 09:00", status: "Confirmado", valor: 920 },
  { c: "Rafael Costa", item: "Torta holandesa G", data: "15/06 17:00", status: "Pronto p/ retirada", valor: 95 },
  { c: "Júlia Mendes", item: "20 cupcakes", data: "20/06 10:00", status: "Aguardando pagamento", valor: 160 },
];

const DELIVERIES = [
  { id: "#10482", c: "Pedro Santos", bairro: "Vila Mariana", mot: "Carlos", status: "A caminho", min: 12 },
  { id: "#10481", c: "Ana Lima", bairro: "Saúde", mot: "Bruno", status: "Saiu p/ entrega", min: 18 },
  { id: "#10480", c: "Marcos T.", bairro: "Ipiranga", mot: "—", status: "Em preparo", min: 25 },
];

const PDVS = [
  { n: "Caixa Balcão 1", local: "Frente de loja", status: "Online" },
  { n: "Caixa Restaurante", local: "Salão", status: "Online" },
  { n: "Totem Autoatendimento", local: "Entrada", status: "Offline" },
];

const USUARIOS = [
  { n: "Sr. Antônio (dono)", papel: "Administrador", acesso: "Total" },
  { n: "Fernanda", papel: "Gerente", acesso: "Operação + relatórios" },
  { n: "Lucas", papel: "Caixa", acesso: "PDV + clientes" },
  { n: "Bia", papel: "Produção", acesso: "Encomendas + estoque" },
];

const vendasSemana = [
  { d: "Seg", v: 4200 }, { d: "Ter", v: 3800 }, { d: "Qua", v: 5100 },
  { d: "Qui", v: 4700 }, { d: "Sex", v: 7300 }, { d: "Sáb", v: 9200 }, { d: "Dom", v: 6100 },
];
const vendasUnidade = [
  { u: "Restaur.", v: 12400 }, { u: "Pizzaria", v: 9800 }, { u: "Burger", v: 7600 },
  { u: "Café", v: 4200 }, { u: "Doceria", v: 3100 }, { u: "Pastel", v: 2600 },
];

/* ============================ UI base ============================ */
function Card({ children, className = "", style = {} }) {
  return <div className={"rounded-2xl bg-white border " + className} style={{ borderColor: "#ECECEC", ...style }}>{children}</div>;
}
function Section({ title, desc, children, right }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-xl font-bold" style={{ color: NAVY }}>{title}</h2>
          {desc && <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{desc}</p>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}
function Pill({ children, tone = "gray" }) {
  const map = {
    green: ["#E7F6EC", "#1B7F4B"], orange: [SOFT, ORANGE], gray: ["#F1F2F4", "#4B5563"],
    blue: ["#E8F0FE", "#2563EB"], red: ["#FDECEC", "#C0392B"], navy: ["#E9EBF1", NAVY],
  };
  const [bg, c] = map[tone] || map.gray;
  return <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: bg, color: c }}>{children}</span>;
}
function Btn({ children, onClick, variant = "primary", className = "", icon: Icon, size = "md" }) {
  const pad = size === "sm" ? "px-3 py-1.5 text-sm" : "px-4 py-2.5";
  const styles =
    variant === "primary" ? { background: ORANGE, color: "#fff" }
    : variant === "navy" ? { background: NAVY, color: "#fff" }
    : variant === "ghost" ? { background: "transparent", color: NAVY, border: "1px solid #E2E2E2" }
    : { background: "#fff", color: NAVY, border: "1px solid #E2E2E2" };
  return (
    <button onClick={onClick} className={"rounded-xl font-semibold inline-flex items-center justify-center gap-2 transition active:scale-95 " + pad + " " + className} style={styles}>
      {Icon && <Icon size={16} />}{children}
    </button>
  );
}
function Toggle({ on, onChange }) {
  return (
    <button onClick={() => onChange(!on)} className="w-11 h-6 rounded-full transition relative" style={{ background: on ? ORANGE : "#D6D8DD" }} aria-pressed={on}>
      <span className="absolute top-0.5 h-5 w-5 bg-white rounded-full transition-all" style={{ left: on ? "22px" : "2px" }} />
    </button>
  );
}
function Stat({ icon: Icon, label, value, delta, tone = "orange" }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: SOFT }}>
          <Icon size={20} color={ORANGE} />
        </div>
        {delta && <Pill tone="green">{delta}</Pill>}
      </div>
      <div className="mt-3 text-2xl font-bold" style={{ color: NAVY }}>{value}</div>
      <div className="text-sm" style={{ color: "#6B7280" }}>{label}</div>
    </Card>
  );
}

/* ============================ Planos / vendas ============================ */
const PLANOS = [
  { nome: "Início", preco: 89, sub: "Para começar a organizar", destaque: false, users: "1 usuário", whats: false, nf: "Não inclui", setup: null,
    bullets: ["1 usuário", "1 PDV", "Vendas + estoque básico", "Cardápio digital"] },
  { nome: "Balcão", preco: 199, sub: "Padaria de bairro", destaque: false, users: "3 usuários", whats: false, nf: "Até 100/mês", setup: null,
    bullets: ["3 usuários", "1 PDV", "NFC-e até 100/mês", "Clientes + cashback", "Relatórios"] },
  { nome: "Padaria", preco: 499, sub: "O mais escolhido · com WhatsApp", destaque: true, users: "6 usuários", whats: true, nf: "Até 500/mês", setup: 2800,
    bullets: ["6 usuários", "2 PDVs", "Pedidos por WhatsApp", "Delivery + encomendas", "NFC-e até 500/mês", "Clube de pontos"] },
  { nome: "Multi", preco: 899, sub: "Restaurante + café + delivery", destaque: false, users: "15 usuários", whats: true, nf: "Ilimitada", setup: 2800,
    bullets: ["15 usuários", "5 PDVs", "WhatsApp multi-atendente", "Todos os módulos", "NF-e/NFC-e ilimitada"] },
  { nome: "Rede", preco: null, sub: "Várias lojas e franquias", destaque: false, users: "Ilimitado", whats: true, nf: "Ilimitada", setup: 2800,
    bullets: ["Usuários ilimitados", "PDVs ilimitados", "Multi-lojas + API", "Gerente de conta", "NF-e ilimitada"] },
];
const FEATURES = [
  { icon: ShoppingCart, t: "PDV completo", d: "Mesa ou venda avulsa, comanda por nome e número, pesagem e pagamento." },
  { icon: Boxes, t: "Estoque inteligente", d: "Baixa por ficha técnica, preço médio e alerta de reposição." },
  { icon: Printer, t: "Fiscal & NFC-e", d: "Emissão de nota conectada à impressora fiscal e à SEFAZ." },
  { icon: Truck, t: "Delivery próprio", d: "Pedidos, entregadores e rastreio no estilo dos grandes apps." },
  { icon: Calendar, t: "Encomendas", d: "Bolos e festas agendados com acompanhamento de produção." },
  { icon: MessageCircle, t: "Pedidos no WhatsApp", d: "Receba e confirme pedidos direto na cozinha." },
  { icon: Gift, t: "Clube de pontos", d: "Cashback configurável com a moeda Zips." },
  { icon: Wallet, t: "Pagamentos", d: "Pix e cartão pelo Mercado Pago ou maquineta local." },
];
const OPERADORES = [
  { n: "Lucas", papel: "Caixa" }, { n: "Bia", papel: "Atendente" }, { n: "Fernanda", papel: "Gerente" },
];

function VideoModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(10,12,20,.85)" }}>
      <div className="w-full max-w-2xl">
        <div className="flex justify-end mb-2"><button onClick={onClose}><X size={22} color="#fff" /></button></div>
        <div className="rounded-2xl overflow-hidden" style={{ background: "#0B0E16", aspectRatio: "16 / 9" }}>
          <div className="h-full w-full flex flex-col items-center justify-center gap-3">
            <div className="h-16 w-16 rounded-full flex items-center justify-center" style={{ background: ORANGE }}><PlayCircle size={36} color="#fff" /></div>
            <div className="text-white font-semibold">Demonstração do Zipão ERP</div>
            <div className="text-white/50 text-sm">2 min · tour completo do sistema</div>
            <div className="w-2/3 h-1 rounded-full mt-2" style={{ background: "rgba(255,255,255,.15)" }}><div className="h-1 rounded-full" style={{ width: "35%", background: ORANGE }} /></div>
          </div>
        </div>
        <p className="text-white/50 text-xs mt-3 text-center">Espaço reservado para o vídeo demonstrativo (YouTube/Vimeo) na versão publicada.</p>
      </div>
    </div>
  );
}

function PlanCard({ p, onChoose }) {
  return (
    <div className="rounded-2xl bg-white border p-5 flex flex-col" style={{ borderColor: p.destaque ? ORANGE : "#ECECEC", borderWidth: p.destaque ? 2 : 1 }}>
      {p.destaque && <div className="inline-flex items-center gap-1 self-start text-xs font-bold px-2.5 py-1 rounded-full mb-2" style={{ background: SOFT, color: ORANGE }}><Star size={12} />Mais popular</div>}
      <h3 className="text-lg font-bold" style={{ color: NAVY }}>{p.nome}</h3>
      <p className="text-sm mb-3" style={{ color: "#9AA0A6" }}>{p.sub}</p>
      <div className="mb-3">
        {p.preco != null
          ? <div><span className="text-3xl font-bold" style={{ color: NAVY }}>{money(p.preco)}</span><span className="text-sm" style={{ color: "#9AA0A6" }}>/mês</span></div>
          : <div className="text-2xl font-bold" style={{ color: NAVY }}>Sob consulta</div>}
        {p.setup && <div className="text-xs mt-1" style={{ color: ORANGE }}>+ {money(p.setup)} implantação do WhatsApp (única vez)</div>}
      </div>
      <ul className="space-y-2 flex-1">
        {p.bullets.map((b) => <li key={b} className="flex items-start gap-2 text-sm" style={{ color: "#4B5563" }}><Check size={15} color="#1B7F4B" className="mt-0.5 shrink-0" />{b}</li>)}
      </ul>
      <button onClick={onChoose} className="mt-4 w-full rounded-xl font-semibold py-2.5" style={p.destaque ? { background: ORANGE, color: "#fff" } : { background: "#fff", color: NAVY, border: "1px solid #E2E2E2" }}>
        {p.preco != null ? "Assinar " + p.nome : "Falar com vendas"}
      </button>
    </div>
  );
}

function Landing({ onLogin, onCliente, toast }) {
  const [video, setVideo] = useState(false);
  const [ag, setAg] = useState({ nome: "", neg: "", tel: "", dia: "" });
  return (
    <div style={{ background: "#fff" }}>
      <header className="sticky top-0 z-40 border-b" style={{ background: "rgba(255,255,255,.92)", backdropFilter: "blur(8px)", borderColor: "#EEE" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2"><ZipIcon size={32} /><span className="font-bold text-lg" style={{ color: NAVY, fontFamily: "Fredoka, sans-serif" }}>Zipão</span></div>
          <nav className="hidden md:flex items-center gap-6 ml-6 text-sm font-medium" style={{ color: "#4B5563" }}>
            <a href="#recursos">Recursos</a><a href="#planos">Planos</a><a href="#agendar">Agendar</a>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onLogin} className="text-sm font-semibold px-3 py-2 rounded-xl" style={{ color: NAVY }}>Entrar</button>
            <a href="#planos" className="text-sm font-semibold px-4 py-2 rounded-xl" style={{ background: ORANGE, color: "#fff" }}>Começar agora</a>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-4 py-12 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="text-xs font-bold px-3 py-1.5 rounded-full" style={{ background: SOFT, color: ORANGE }}>ERP + App de delivery num só lugar</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-4 leading-tight" style={{ color: NAVY }}>O sistema que faz seu negócio voar.</h1>
          <p className="mt-4 text-lg" style={{ color: "#4B5563" }}>Estoque, fiscal, PDV, delivery, encomendas e clube de pontos — tudo integrado, do balcão à entrega. Pediu, zipou.</p>
          <div className="flex flex-wrap gap-3 mt-6">
            <a href="#agendar" className="rounded-xl font-semibold px-5 py-3 inline-flex items-center gap-2" style={{ background: ORANGE, color: "#fff" }}><Calendar size={18} />Agendar apresentação</a>
            <a href="#planos" className="rounded-xl font-semibold px-5 py-3 inline-flex items-center gap-2" style={{ border: "1px solid #E2E2E2", color: NAVY }}>Ver planos<ArrowRight size={16} /></a>
          </div>
        </div>
        <button onClick={() => setVideo(true)} className="relative w-full rounded-2xl overflow-hidden block" style={{ aspectRatio: "16 / 9", background: "linear-gradient(135deg, " + NAVY + ", #2b3553)" }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-16 w-16 rounded-full flex items-center justify-center shadow-lg" style={{ background: ORANGE }}><PlayCircle size={34} color="#fff" /></div>
            <span className="text-white font-semibold">Ver demonstração (2 min)</span>
          </div>
        </button>
      </section>

      <section className="border-y" style={{ borderColor: "#EEE", background: CREAM }}>
        <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          {[["+1.200", "pedidos/dia"], ["8", "tipos de negócio"], ["100%", "configurável"], ["5 min", "para começar"]].map((s) => (
            <div key={s[1]}><div className="text-2xl font-bold" style={{ color: ORANGE }}>{s[0]}</div><div className="text-sm" style={{ color: "#6B7280" }}>{s[1]}</div></div>
          ))}
        </div>
      </section>

      <section id="recursos" className="max-w-6xl mx-auto px-4 py-14">
        <h2 className="text-3xl font-bold text-center" style={{ color: NAVY }}>Tudo num só sistema</h2>
        <p className="text-center mt-2 mb-8" style={{ color: "#6B7280" }}>Do pedido ao caixa, da cozinha à entrega.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {FEATURES.map((f) => (
            <div key={f.t} className="p-5 rounded-2xl border" style={{ borderColor: "#ECECEC" }}>
              <div className="h-11 w-11 rounded-xl flex items-center justify-center mb-3" style={{ background: SOFT }}><f.icon size={20} color={ORANGE} /></div>
              <h3 className="font-bold" style={{ color: NAVY }}>{f.t}</h3>
              <p className="text-sm mt-1" style={{ color: "#6B7280" }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="planos" className="py-14" style={{ background: CREAM }}>
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center" style={{ color: NAVY }}>Planos para escalar com você</h2>
          <p className="text-center mt-2" style={{ color: "#6B7280" }}>Você paga pelo número de usuários. A nota fiscal entra conforme o plano.</p>
          <p className="text-center mt-1 mb-8 text-sm" style={{ color: ORANGE }}>Planos com WhatsApp partem de R$ 499/mês + implantação única de R$ 2.800.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {PLANOS.map((p) => <PlanCard key={p.nome} p={p} onChoose={() => toast(p.preco != null ? "Plano " + p.nome + " selecionado" : "Pedido de contato enviado")} />)}
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-sm bg-white rounded-2xl overflow-hidden border" style={{ borderColor: "#ECECEC" }}>
              <thead><tr><th className="text-left px-4 py-3 font-semibold" style={{ color: NAVY }}>Compare</th>{PLANOS.map((p) => <th key={p.nome} className="px-4 py-3 font-semibold" style={{ color: NAVY }}>{p.nome}</th>)}</tr></thead>
              <tbody>
                <tr className="border-t" style={{ borderColor: "#F0F0F0" }}><td className="px-4 py-3" style={{ color: "#4B5563" }}>Usuários</td>{PLANOS.map((p) => <td key={p.nome} className="px-4 py-3 text-center text-xs" style={{ color: NAVY }}>{p.users}</td>)}</tr>
                <tr className="border-t" style={{ borderColor: "#F0F0F0" }}><td className="px-4 py-3" style={{ color: "#4B5563" }}>WhatsApp</td>{PLANOS.map((p) => <td key={p.nome} className="px-4 py-3 text-center text-xs" style={{ color: p.whats ? NAVY : "#9AA0A6" }}>{p.whats ? "Sim · +R$ 2.800" : "—"}</td>)}</tr>
                <tr className="border-t" style={{ borderColor: "#F0F0F0" }}><td className="px-4 py-3" style={{ color: "#4B5563" }}>Notas fiscais</td>{PLANOS.map((p) => <td key={p.nome} className="px-4 py-3 text-center text-xs" style={{ color: NAVY }}>{p.nf}</td>)}</tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="agendar" className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold" style={{ color: NAVY }}>Agende uma apresentação</h2>
          <p className="mt-3" style={{ color: "#4B5563" }}>Mostramos o Zipão funcionando com o seu tipo de negócio em 30 minutos, online e sem compromisso.</p>
          <div className="mt-5 space-y-2 text-sm" style={{ color: "#4B5563" }}>
            <div className="flex items-center gap-2"><Check size={16} color="#1B7F4B" />Configuração inicial sem custo</div>
            <div className="flex items-center gap-2"><Check size={16} color="#1B7F4B" />Migração dos seus produtos</div>
            <div className="flex items-center gap-2"><Check size={16} color="#1B7F4B" />Treinamento da equipe</div>
          </div>
        </div>
        <Card className="p-6">
          <label className="text-sm font-medium" style={{ color: NAVY }}>Seu nome</label>
          <input value={ag.nome} onChange={(e) => setAg({ ...ag, nome: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
          <label className="text-sm font-medium" style={{ color: NAVY }}>Nome do negócio</label>
          <input value={ag.neg} onChange={(e) => setAg({ ...ag, neg: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
          <div className="grid grid-cols-2 gap-3">
            <div><label className="text-sm font-medium" style={{ color: NAVY }}>WhatsApp</label><input value={ag.tel} onChange={(e) => setAg({ ...ag, tel: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} /></div>
            <div><label className="text-sm font-medium" style={{ color: NAVY }}>Melhor dia</label><input value={ag.dia} onChange={(e) => setAg({ ...ag, dia: e.target.value })} placeholder="Ex.: seg 14h" className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} /></div>
          </div>
          <Btn className="w-full" icon={Calendar} onClick={() => toast("Apresentação solicitada! Entraremos em contato.")}>Agendar apresentação</Btn>
        </Card>
      </section>

      <section className="py-12" style={{ background: NAVY }}>
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div><h2 className="text-2xl font-bold text-white">Seus clientes pedem pelo app Zipão</h2><p className="text-white/70 mt-2">Cardápio, delivery, pagamento e cashback na mão do cliente — incluso no seu plano.</p></div>
          <button onClick={onCliente} className="rounded-xl font-semibold px-5 py-3 inline-flex items-center gap-2 whitespace-nowrap" style={{ background: ORANGE, color: "#fff" }}><Smartphone size={18} />Ver app de pedidos</button>
        </div>
      </section>

      <footer className="max-w-6xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2"><ZipIcon size={26} /><span className="font-bold" style={{ color: NAVY, fontFamily: "Fredoka, sans-serif" }}>Zipão</span></div>
        <p className="text-sm" style={{ color: "#9AA0A6" }}>Pediu, zipou. · contato@zipao.com.br</p>
        <button onClick={onLogin} className="text-sm font-semibold" style={{ color: ORANGE }}>Entrar no sistema</button>
      </footer>

      {video && <VideoModal onClose={() => setVideo(false)} />}
    </div>
  );
}

/* ============================ Login PDV (atendente) ============================ */
function PDVLogin({ onBack, onEnter }) {
  const PLAN_SEATS = 6, ATIVOS = 3; // plano Padaria
  const [sel, setSel] = useState(null);
  const [pin, setPin] = useState("");
  const press = (d) => setPin((p) => (p.length < 4 ? p + d : p));
  const ok = sel && pin.length === 4;
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: NAVY }}>
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><ZipIcon size={30} /><span className="font-bold" style={{ color: NAVY, fontFamily: "Fredoka, sans-serif" }}>Zipão PDV</span></div>
          <button onClick={onBack}><X size={20} color="#9AA0A6" /></button>
        </div>
        <p className="text-xs mb-4" style={{ color: "#9AA0A6" }}>Plano Padaria · {ATIVOS} de {PLAN_SEATS} usuários ativos</p>
        {!sel ? (
          <>
            <h3 className="font-bold mb-3" style={{ color: NAVY }}>Selecione o atendente</h3>
            <div className="space-y-2">
              {OPERADORES.map((o) => (
                <button key={o.n} onClick={() => { setSel(o); setPin(""); }} className="w-full flex items-center gap-3 p-3 rounded-xl border text-left" style={{ borderColor: "#E2E2E2" }}>
                  <div className="h-9 w-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: ORANGE }}>{o.n[0]}</div>
                  <div><div className="font-semibold text-sm" style={{ color: NAVY }}>{o.n}</div><div className="text-xs" style={{ color: "#9AA0A6" }}>{o.papel}</div></div>
                  <ChevronRight size={16} className="ml-auto" color="#9AA0A6" />
                </button>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl text-xs flex items-start gap-2" style={{ background: SOFT, color: NAVY }}>
              <Lock size={14} color={ORANGE} className="mt-0.5 shrink-0" />Novos atendentes são adicionados em Usuários — cada um ocupa uma vaga do seu plano.
            </div>
          </>
        ) : (
          <>
            <button onClick={() => setSel(null)} className="text-sm inline-flex items-center gap-1 mb-3" style={{ color: "#6B7280" }}><ChevronLeft size={16} />Trocar atendente</button>
            <div className="text-center mb-3">
              <div className="h-12 w-12 rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2" style={{ background: ORANGE }}>{sel.n[0]}</div>
              <div className="font-bold" style={{ color: NAVY }}>{sel.n}</div><div className="text-xs" style={{ color: "#9AA0A6" }}>Digite seu PIN de 4 dígitos</div>
            </div>
            <div className="flex justify-center gap-3 mb-4">{[0, 1, 2, 3].map((i) => <span key={i} className="h-3 w-3 rounded-full" style={{ background: i < pin.length ? ORANGE : "#E0E0E0" }} />)}</div>
            <div className="grid grid-cols-3 gap-2">
              {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => <button key={d} onClick={() => press(d)} className="py-3 rounded-xl font-bold text-lg" style={{ background: "#F4F4F5", color: NAVY }}>{d}</button>)}
              <button onClick={() => setPin("")} className="py-3 rounded-xl text-sm font-semibold" style={{ background: "#F4F4F5", color: "#9AA0A6" }}>Limpar</button>
              <button onClick={() => press("0")} className="py-3 rounded-xl font-bold text-lg" style={{ background: "#F4F4F5", color: NAVY }}>0</button>
              <button onClick={() => setPin((p) => p.slice(0, -1))} className="py-3 rounded-xl flex items-center justify-center" style={{ background: "#F4F4F5" }}><Delete size={18} color={NAVY} /></button>
            </div>
            <Btn className="w-full mt-4" icon={ok ? Check : Lock} onClick={() => ok && onEnter(sel.n)}>Entrar no PDV</Btn>
          </>
        )}
      </Card>
    </div>
  );
}

/* ============================ Login (hub) ============================ */
function Login({ onEnter, onDono }) {
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("dono@zipao.com.br");
  const [senha, setSenha] = useState("••••••••");
  const roles = [
    { k: "dono", label: "Dono / Gestor", desc: "Painel completo do ERP", icon: ShieldCheck },
    { k: "pdv", label: "Atendente (PDV)", desc: "Frente de caixa e comandas", icon: ShoppingCart },
    { k: "cliente", label: "Cliente", desc: "Pedir e ver meus Zips", icon: Users },
  ];
  return (
    <div className="min-h-screen w-full flex" style={{ background: CREAM }}>
      <div className="hidden md:flex flex-col justify-between p-12 w-1/2" style={{ background: NAVY }}>
        <div className="flex items-center gap-3"><ZipIcon size={44} radius={12} /><span className="text-2xl font-bold text-white" style={{ fontFamily: "Fredoka, sans-serif" }}>Zipão</span></div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight">O sistema que faz<br />seu negócio voar.</h1>
          <p className="text-white/70 mt-4 max-w-md">ERP completo de food service integrado ao app Zipão.</p>
        </div>
        <p className="text-white/40 text-sm">Pediu, zipou.</p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <button onClick={() => onEnter("home")} className="text-sm mb-6 inline-flex items-center gap-1" style={{ color: "#6B7280" }}><ChevronLeft size={16} />Voltar ao site</button>
          <div className="md:hidden flex items-center gap-2 mb-6"><ZipIcon size={36} /><span className="text-xl font-bold" style={{ color: NAVY, fontFamily: "Fredoka, sans-serif" }}>Zipão</span></div>
          {!role ? (
            <>
              <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Quem está entrando?</h2>
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Escolha seu tipo de acesso.</p>
              <div className="space-y-2">
                {roles.map((r) => (
                  <button key={r.k} onClick={() => r.k === "dono" ? setRole("dono") : onEnter(r.k === "pdv" ? "pdvlogin" : "cliente")} className="w-full flex items-center gap-3 p-3 rounded-xl border text-left bg-white" style={{ borderColor: "#E2E2E2" }}>
                    <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><r.icon size={18} color={ORANGE} /></div>
                    <div><div className="font-semibold text-sm" style={{ color: NAVY }}>{r.label}</div><div className="text-xs" style={{ color: "#9AA0A6" }}>{r.desc}</div></div>
                    <ChevronRight size={16} className="ml-auto" color="#9AA0A6" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold" style={{ color: NAVY }}>Entrar como dono</h2>
              <p className="text-sm mb-5" style={{ color: "#6B7280" }}>Acesse o painel da sua loja.</p>
              <label className="text-sm font-medium" style={{ color: NAVY }}>E-mail</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full mt-1 mb-4 px-4 py-3 rounded-xl border outline-none" style={{ borderColor: "#E2E2E2" }} />
              <label className="text-sm font-medium" style={{ color: NAVY }}>Senha</label>
              <input value={senha} onChange={(e) => setSenha(e.target.value)} type="password" className="w-full mt-1 mb-5 px-4 py-3 rounded-xl border outline-none" style={{ borderColor: "#E2E2E2" }} />
              <Btn onClick={onDono} className="w-full" icon={ShieldCheck}>Entrar no painel</Btn>
              <button onClick={() => setRole(null)} className="w-full mt-3 text-sm font-semibold" style={{ color: "#6B7280" }}>Trocar perfil</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ============================ Tour guiado ============================ */
const TOUR = [
  { m: "dashboard", t: "Visão geral", d: "O dono abre aqui e vê o pulso do negócio: vendas do dia, ticket médio, alertas de estoque baixo e o que está saindo agora. Cada número é um atalho." },
  { m: "pdv", t: "PDV / Frente de caixa", d: "Escolha a unidade (restaurante, burger, pizza...), monte a comanda em poucos toques e finalize. No fim, o pagamento e a nota saem juntos." },
  { m: "estoque", t: "Estoque & fichas técnicas", d: "Cada produto tem sua ficha: o burger de viagem já desconta o pão, a carne, o queijo E a caixa de hambúrguer. O estoque baixa sozinho a cada venda." },
  { m: "compras", t: "Compras & NF-e", d: "Importe o XML da nota do fornecedor: o sistema lê os itens, atualiza o preço médio de mercado e lança tudo no estoque automaticamente." },
  { m: "fiscal", t: "Fiscal & impressora", d: "Emissão de NFC-e e NF-e conectada à impressora fiscal. Acompanhe o status do equipamento e do certificado digital em tempo real." },
  { m: "encomendas", t: "Encomendas", d: "Bolos, festas e retiradas agendadas com data, hora e status de produção. O cliente acompanha pelo app." },
  { m: "clientes", t: "Clientes & cashback", d: "Cadastro completo. O cashback liga e desliga por cliente — você decide quem participa do clube." },
  { m: "pagamentos", t: "Pagamentos & PDVs", d: "Conecte o Mercado Pago para Pix e cartão online, configure a maquineta local e cadastre cada PDV da loja." },
  { m: "whatsapp", t: "Pedidos por WhatsApp", d: "Os pedidos chegam direto do WhatsApp para a fila da cozinha, com resposta automática. Sem digitar nada duas vezes." },
  { m: "integracoes", t: "Integrações", d: "Aqui ficam os códigos prontos para o seu dev plugar Mercado Pago, WhatsApp e nota fiscal no servidor. É só copiar." },
];
function Tour({ step, setStep, onModule, onClose }) {
  const s = TOUR[step];
  useEffect(() => { if (s) onModule(s.m); }, [step]);
  if (!s) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
      <Card className="w-full max-w-lg p-6" style={{ borderColor: ORANGE }}>
        <div className="flex items-center justify-between">
          <Pill tone="orange">Tour · {step + 1} de {TOUR.length}</Pill>
          <button onClick={onClose}><X size={20} color="#9AA0A6" /></button>
        </div>
        <h3 className="text-xl font-bold mt-3" style={{ color: NAVY }}>{s.t}</h3>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: "#4B5563" }}>{s.d}</p>
        <div className="flex items-center gap-2 mt-5">
          <div className="flex-1 flex gap-1">
            {TOUR.map((_, i) => <span key={i} className="h-1.5 rounded-full flex-1" style={{ background: i <= step ? ORANGE : "#E6E6E6" }} />)}
          </div>
        </div>
        <div className="flex justify-between mt-5">
          <Btn variant="ghost" size="sm" icon={ChevronLeft} onClick={() => setStep(Math.max(0, step - 1))}>Anterior</Btn>
          {step < TOUR.length - 1
            ? <Btn size="sm" onClick={() => setStep(step + 1)}>Próximo <ChevronRight size={16} /></Btn>
            : <Btn size="sm" variant="navy" onClick={onClose} icon={Check}>Concluir tour</Btn>}
        </div>
      </Card>
    </div>
  );
}

/* ============================ Módulos ============================ */
function Dashboard() {
  return (
    <Section title="Visão geral" desc="Domingo, 14 de junho · tudo o que está acontecendo na sua loja agora.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={TrendingUp} label="Vendas hoje" value={money(8420)} delta="+12%" />
        <Stat icon={Receipt} label="Pedidos hoje" value="183" delta="+8%" />
        <Stat icon={Wallet} label="Ticket médio" value={money(46.0)} delta="+3%" />
        <Stat icon={Gift} label="Zips distribuídos" value="1.240" delta="+19%" />
      </div>
      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: NAVY }}>Vendas na semana</h3><Pill tone="green">+14% vs. semana anterior</Pill>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={vendasSemana}>
              <defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={ORANGE} stopOpacity={0.4} /><stop offset="100%" stopColor={ORANGE} stopOpacity={0} /></linearGradient></defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="d" tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} width={40} />
              <Tooltip formatter={(v) => money(v)} />
              <Area type="monotone" dataKey="v" stroke={ORANGE} strokeWidth={3} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </Card>
        <Card className="p-5">
          <h3 className="font-bold mb-3" style={{ color: NAVY }}>Estoque baixo</h3>
          <div className="space-y-3">
            {INSUMOS.filter((i) => i.estoque <= i.min).map((i) => (
              <div key={i.n} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><AlertTriangle size={16} color={ORANGE} /><span className="text-sm" style={{ color: NAVY }}>{i.n}</span></div>
                <span className="text-sm font-semibold" style={{ color: ORANGE }}>{i.estoque} {i.un}</span>
              </div>
            ))}
            <Btn variant="ghost" size="sm" className="w-full mt-1" icon={ClipboardList}>Gerar pedido de compra</Btn>
          </div>
        </Card>
      </div>
      <Card className="p-5 mt-4">
        <h3 className="font-bold mb-3" style={{ color: NAVY }}>Vendas por unidade</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={vendasUnidade}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} />
            <XAxis dataKey="u" tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} width={50} />
            <Tooltip formatter={(v) => money(v)} />
            <Bar dataKey="v" fill={NAVY} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>
    </Section>
  );
}

function catColor(k) {
  const m = { restaurante: "#E8590C", cafeteria: "#8B5E34", hamburgueria: "#C0392B", pizzaria: "#D35400", doceria: "#C2185B", pastelaria: "#B8860B", tipicas: "#2E7D32", pesagem: "#1565C0" };
  return m[k] || ORANGE;
}
function ProdFoto({ catK, h = 88 }) {
  const U = UNITS.find((u) => u.k === catK); const I = U ? U.icon : Utensils; const c = catColor(catK);
  return <div className="w-full rounded-xl flex items-center justify-center mb-3" style={{ height: h, background: "linear-gradient(135deg, " + c + ", " + c + "bb)" }}><I size={Math.round(h * 0.4)} color="rgba(255,255,255,.92)" /></div>;
}

function PDV({ toast }) {
  const [view, setView] = useState("lista");
  const [comandas, setComandas] = useState([
    { id: 1, numero: 12, nome: "Marina Alves", tipo: "mesa", mesa: "12", itens: [{ n: "Pizza calabresa", p: 52, q: 1, cat: "pizzaria" }] },
    { id: 2, numero: 13, nome: "João P.", tipo: "avulso", mesa: null, itens: [] },
  ]);
  const [activeId, setActiveId] = useState(null);
  const [seq, setSeq] = useState(14);
  const [cat, setCat] = useState("restaurante");
  const [novo, setNovo] = useState(null);
  const [nome, setNome] = useState("");
  const [mesa, setMesa] = useState("");
  const [qtyProd, setQtyProd] = useState(null);
  const [qtd, setQtd] = useState(1);
  const [pesoProd, setPesoProd] = useState(null);
  const [kg, setKg] = useState("0.500");
  const [pay, setPay] = useState(false);

  const active = comandas.find((c) => c.id === activeId);
  const totalOf = (c) => c.itens.reduce((s, x) => s + (x.isPeso ? x.p * x.peso : x.p * x.q), 0);

  const abrir = (tipo) => { setNovo({ tipo }); setNome(tipo === "avulso" ? "Avulso" : ""); setMesa(""); };
  const confirmarAbrir = () => {
    const id = Date.now();
    const c = { id, numero: seq, nome: nome || "Cliente", tipo: novo.tipo, mesa: novo.tipo === "mesa" ? (mesa || String(seq)) : null, itens: [] };
    setComandas((cs) => [...cs, c]); setSeq((s) => s + 1); setActiveId(id); setNovo(null); setCat("restaurante"); setView("pedido");
  };
  const retomar = (id) => { setActiveId(id); setView("pedido"); };
  const addItem = (prod, q) => setComandas((cs) => cs.map((c) => {
    if (c.id !== activeId) return c;
    const f = c.itens.find((x) => x.n === prod.n && !x.isPeso);
    const itens = f ? c.itens.map((x) => x === f ? { ...x, q: x.q + q } : x) : [...c.itens, { ...prod, q, cat }];
    return { ...c, itens };
  }));
  const addPeso = (prod, peso) => setComandas((cs) => cs.map((c) => c.id === activeId ? { ...c, itens: [...c.itens, { ...prod, isPeso: true, peso, cat }] } : c));
  const decLine = (idx) => setComandas((cs) => cs.map((c) => {
    if (c.id !== activeId) return c;
    const itens = c.itens.flatMap((x, i) => i === idx ? (x.isPeso || x.q <= 1 ? [] : [{ ...x, q: x.q - 1 }]) : [x]);
    return { ...c, itens };
  }));
  const tocarProduto = (p) => { if (cat === "pesagem") { setPesoProd(p); setKg("0.500"); } else { setQtyProd(p); setQtd(1); } };
  const finalizar = (m) => { setPay(false); setComandas((cs) => cs.filter((c) => c.id !== activeId)); setActiveId(null); setView("lista"); toast("Comanda fechada · pago " + m + " · NFC-e emitida"); };

  if (view === "lista") {
    return (
      <Section title="PDV / Frente de caixa" desc="Abra uma mesa, faça uma venda avulsa ou retome uma comanda.">
        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <button onClick={() => abrir("mesa")} className="p-5 rounded-2xl text-left text-white transition active:scale-95" style={{ background: NAVY }}>
            <Utensils size={22} /><div className="font-bold mt-3">Abrir mesa</div><div className="text-sm text-white/70">Comanda por mesa, fecha no fim</div>
          </button>
          <button onClick={() => abrir("avulso")} className="p-5 rounded-2xl text-left text-white transition active:scale-95" style={{ background: ORANGE }}>
            <ShoppingCart size={22} /><div className="font-bold mt-3">Venda avulsa</div><div className="text-sm text-white/80">Balcão, pagamento imediato</div>
          </button>
        </div>
        <h3 className="font-bold mb-3" style={{ color: NAVY }}>Comandas abertas</h3>
        {comandas.length === 0 ? <p className="text-sm" style={{ color: "#9AA0A6" }}>Nenhuma comanda aberta.</p> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {comandas.map((c) => (
              <button key={c.id} onClick={() => retomar(c.id)} className="text-left p-4 rounded-2xl bg-white border hover:shadow-md transition" style={{ borderColor: "#ECECEC" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><Hash size={16} color={ORANGE} /></div>
                    <div><div className="font-bold" style={{ color: NAVY }}>Comanda {c.numero}</div><div className="text-xs" style={{ color: "#9AA0A6" }}>{c.nome}</div></div>
                  </div>
                  <Pill tone={c.tipo === "mesa" ? "navy" : "orange"}>{c.tipo === "mesa" ? "Mesa " + c.mesa : "Avulso"}</Pill>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t" style={{ borderColor: "#F0F0F0" }}>
                  <span className="text-xs" style={{ color: "#9AA0A6" }}>{c.itens.length} item(ns)</span>
                  <span className="font-bold" style={{ color: NAVY }}>{money(totalOf(c))}</span>
                </div>
              </button>
            ))}
          </div>
        )}
        {novo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
            <Card className="w-full max-w-sm p-6">
              <div className="flex items-center justify-between mb-3"><h3 className="font-bold" style={{ color: NAVY }}>{novo.tipo === "mesa" ? "Abrir mesa" : "Venda avulsa"}</h3><button onClick={() => setNovo(null)}><X size={20} color="#9AA0A6" /></button></div>
              <p className="text-sm mb-3" style={{ color: "#6B7280" }}>Comanda número <b style={{ color: ORANGE }}>{seq}</b></p>
              <label className="text-sm font-medium" style={{ color: NAVY }}>Nome do cliente</label>
              <div className="flex items-center gap-2 mt-1 mb-3 px-3 rounded-xl border" style={{ borderColor: "#E2E2E2" }}>
                <User size={16} color="#9AA0A6" /><input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex.: Marina" className="flex-1 py-2.5 outline-none text-sm bg-transparent" />
              </div>
              {novo.tipo === "mesa" && (<>
                <label className="text-sm font-medium" style={{ color: NAVY }}>Número da mesa</label>
                <input value={mesa} onChange={(e) => setMesa(e.target.value)} placeholder="Ex.: 12" className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
              </>)}
              <Btn className="w-full" onClick={confirmarAbrir} icon={Check}>Abrir comanda</Btn>
            </Card>
          </div>
        )}
      </Section>
    );
  }

  const prods = PRODUTOS[cat] || [];
  return (
    <Section title={"Comanda " + (active ? active.numero : "")} desc={active ? (active.nome + (active.tipo === "mesa" ? " · Mesa " + active.mesa : " · Venda avulsa")) : ""}
      right={<Btn variant="ghost" size="sm" icon={ChevronLeft} onClick={() => setView("lista")}>Voltar</Btn>}>
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3">
            {UNITS.map((u) => { const on = cat === u.k; const I = u.icon; return (
              <button key={u.k} onClick={() => setCat(u.k)} className="px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap inline-flex items-center gap-2" style={on ? { background: NAVY, color: "#fff" } : { background: "#fff", color: NAVY, border: "1px solid #E2E2E2" }}><I size={16} />{u.label}</button>
            ); })}
          </div>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
            {prods.map((p) => (
              <button key={p.n} onClick={() => tocarProduto(p)} className="text-left p-3 rounded-2xl bg-white border hover:shadow-md transition active:scale-95" style={{ borderColor: "#ECECEC" }}>
                <ProdFoto catK={cat} />
                <div className="font-semibold text-sm leading-tight" style={{ color: NAVY }}>{p.n}</div>
                <div className="text-sm mt-0.5" style={{ color: ORANGE }}>{money(p.p)}{cat === "pesagem" ? " /kg" : ""}</div>
              </button>
            ))}
          </div>
        </div>
        <Card className="p-5 h-fit">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-bold" style={{ color: NAVY }}>Itens</h3>
            <Pill tone={active && active.tipo === "mesa" ? "navy" : "orange"}>{active && active.tipo === "mesa" ? "Mesa " + active.mesa : "Avulso"}</Pill>
          </div>
          {(!active || active.itens.length === 0) && <p className="text-sm py-8 text-center" style={{ color: "#9AA0A6" }}>Toque num produto para lançar.</p>}
          <div className="space-y-3">
            {active && active.itens.map((x, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="text-sm" style={{ color: NAVY }}>
                  <div className="font-medium">{x.n}</div>
                  <div style={{ color: "#9AA0A6" }}>{x.isPeso ? x.peso.toFixed(3) + " kg × " + money(x.p) + "/kg" : money(x.p)}</div>
                </div>
                <div className="flex items-center gap-2">
                  {!x.isPeso && <span className="text-sm font-semibold" style={{ color: "#9AA0A6" }}>{x.q}×</span>}
                  <span className="text-sm font-semibold" style={{ color: NAVY }}>{money(x.isPeso ? x.p * x.peso : x.p * x.q)}</span>
                  <button onClick={() => decLine(i)} className="h-7 w-7 rounded-lg flex items-center justify-center" style={{ background: "#F1F2F4" }}><Minus size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          {active && active.itens.length > 0 && (<>
            <div className="flex justify-between mt-4 pt-4 border-t" style={{ borderColor: "#EEE" }}>
              <span className="font-semibold" style={{ color: NAVY }}>Total</span><span className="font-bold text-lg" style={{ color: NAVY }}>{money(totalOf(active))}</span>
            </div>
            <Btn className="w-full mt-4" icon={CreditCard} onClick={() => setPay(true)}>Finalizar e cobrar</Btn>
          </>)}
        </Card>
      </div>

      {qtyProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
          <Card className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-1"><h3 className="font-bold" style={{ color: NAVY }}>{qtyProd.n}</h3><button onClick={() => setQtyProd(null)}><X size={20} color="#9AA0A6" /></button></div>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{money(qtyProd.p)} cada</p>
            <div className="flex items-center justify-center gap-4 mb-4">
              <button onClick={() => setQtd((q) => Math.max(1, q - 1))} className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: "#F1F2F4" }}><Minus size={18} /></button>
              <span className="text-3xl font-bold w-12 text-center" style={{ color: NAVY }}>{qtd}</span>
              <button onClick={() => setQtd((q) => q + 1)} className="h-11 w-11 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><Plus size={18} color={ORANGE} /></button>
            </div>
            <div className="flex gap-2 mb-4">{[1, 2, 3, 4, 5].map((n) => <button key={n} onClick={() => setQtd(n)} className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: qtd === n ? NAVY : "#F4F4F5", color: qtd === n ? "#fff" : NAVY }}>{n}</button>)}</div>
            <Btn className="w-full" icon={Check} onClick={() => { addItem(qtyProd, qtd); toast(qtd + "× " + qtyProd.n + " lançado"); setQtyProd(null); }}>Lançar {money(qtyProd.p * qtd)}</Btn>
          </Card>
        </div>
      )}

      {pesoProd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
          <Card className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><Scale size={18} color={ORANGE} /><h3 className="font-bold" style={{ color: NAVY }}>Pesar — {pesoProd.n}</h3></div><button onClick={() => setPesoProd(null)}><X size={20} color="#9AA0A6" /></button></div>
            <p className="text-sm mb-4" style={{ color: "#6B7280" }}>{money(pesoProd.p)}/kg · informe o peso da balança</p>
            <label className="text-sm font-medium" style={{ color: NAVY }}>Peso (kg)</label>
            <input value={kg} onChange={(e) => setKg(e.target.value)} type="number" step="0.001" min="0" className="w-full mt-1 mb-3 px-3 py-3 rounded-xl border text-lg font-semibold outline-none" style={{ borderColor: "#E2E2E2", color: NAVY }} />
            <div className="flex justify-between mb-4 p-3 rounded-xl" style={{ background: SOFT }}><span className="text-sm" style={{ color: NAVY }}>Total</span><span className="font-bold" style={{ color: ORANGE }}>{money(pesoProd.p * (parseFloat(kg) || 0))}</span></div>
            <Btn className="w-full" icon={Check} onClick={() => { const v = parseFloat(kg) || 0; if (v > 0) { addPeso(pesoProd, v); toast(v.toFixed(3) + " kg lançado"); } setPesoProd(null); }}>Lançar no sistema</Btn>
          </Card>
        </div>
      )}

      {pay && active && <PayModal total={totalOf(active)} onClose={() => setPay(false)} onDone={finalizar} />}
    </Section>
  );
}

function PayModal({ total, onClose, onDone }) {
  const opts = [
    { k: "Pix (Mercado Pago)", icon: QrCode }, { k: "Cartão na maquineta", icon: CreditCard },
    { k: "Cartão online (MP)", icon: Smartphone }, { k: "Dinheiro", icon: Banknote },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
      <Card className="w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-1"><h3 className="text-lg font-bold" style={{ color: NAVY }}>Pagamento</h3><button onClick={onClose}><X size={20} color="#9AA0A6" /></button></div>
        <p className="text-sm mb-4" style={{ color: "#6B7280" }}>Total a cobrar: <b style={{ color: NAVY }}>{money(total)}</b></p>
        <div className="space-y-2">
          {opts.map((o) => { const I = o.icon; return (
            <button key={o.k} onClick={() => onDone(o.k)} className="w-full flex items-center gap-3 p-3 rounded-xl border hover:shadow-sm transition text-left" style={{ borderColor: "#E2E2E2" }}>
              <div className="h-9 w-9 rounded-lg flex items-center justify-center" style={{ background: SOFT }}><I size={18} color={ORANGE} /></div>
              <span className="font-medium text-sm" style={{ color: NAVY }}>{o.k}</span><ArrowRight size={16} className="ml-auto" color="#9AA0A6" />
            </button>
          ); })}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs" style={{ color: "#9AA0A6" }}><Printer size={14} /> Impressora fiscal conectada · NFC-e automática</div>
      </Card>
    </div>
  );
}

function Estoque() {
  return (
    <Section title="Estoque & fichas técnicas" desc="Preço médio de mercado, consumo diário e baixa automática por ficha técnica.">
      <Card className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ background: CREAM }}>{["Insumo", "Preço médio", "Estoque", "Mín.", "Consumo/dia", "Status"].map((h) => <th key={h} className="text-left font-semibold px-4 py-3" style={{ color: NAVY }}>{h}</th>)}</tr></thead>
            <tbody>
              {INSUMOS.map((i) => { const low = i.estoque <= i.min; return (
                <tr key={i.n} className="border-t" style={{ borderColor: "#F0F0F0" }}>
                  <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{i.n}</td>
                  <td className="px-4 py-3" style={{ color: "#4B5563" }}>{money(i.precoMed)}/{i.un}</td>
                  <td className="px-4 py-3" style={{ color: "#4B5563" }}>{i.estoque} {i.un}</td>
                  <td className="px-4 py-3" style={{ color: "#9AA0A6" }}>{i.min}</td>
                  <td className="px-4 py-3" style={{ color: "#4B5563" }}>{i.consumoDia} {i.un}</td>
                  <td className="px-4 py-3">{low ? <Pill tone="red">Repor</Pill> : <Pill tone="green">OK</Pill>}</td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      </Card>
      <h3 className="font-bold mt-6 mb-3" style={{ color: NAVY }}>Fichas técnicas (formação de produto + embalagem)</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {FICHAS.map((f) => (
          <Card key={f.prod} className="p-5">
            <div className="flex items-center gap-2 mb-3"><Boxes size={18} color={ORANGE} /><span className="font-semibold text-sm" style={{ color: NAVY }}>{f.prod}</span></div>
            <ul className="space-y-2">{f.itens.map((it) => <li key={it} className="text-sm flex items-center gap-2" style={{ color: "#4B5563" }}><Check size={14} color="#1B7F4B" />{it}</li>)}</ul>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Compras({ toast }) {
  const [imported, setImported] = useState(false);
  const itens = [
    { n: "Farinha de trigo", q: "50 kg", v: 205.0 }, { n: "Queijo mussarela", q: "20 kg", v: 798.0 },
    { n: "Caixa de pizza", q: "200 un", v: 442.0 }, { n: "Molho de tomate", q: "30 L", v: 279.0 },
  ];
  return (
    <Section title="Compras & entrada de nota (NF-e)" desc="Importe o XML do fornecedor: leitura automática dos itens e atualização do preço médio." right={<Btn icon={Upload} onClick={() => { setImported(true); toast("XML lido · 4 itens reconhecidos"); }}>Importar XML da NF-e</Btn>}>
      {!imported ? (
        <Card className="p-10 text-center border-dashed" style={{ borderWidth: 2, borderColor: "#E2E2E2" }}>
          <Upload size={32} color="#9AA0A6" className="mx-auto mb-3" />
          <p className="font-medium" style={{ color: NAVY }}>Arraste o XML da nota fiscal aqui</p>
          <p className="text-sm mt-1" style={{ color: "#9AA0A6" }}>O sistema reconhece itens, quantidades, valores e CNPJ do fornecedor.</p>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-4"><CheckCircle2 size={18} color="#1B7F4B" /><span className="font-semibold text-sm" style={{ color: NAVY }}>NF-e 000.142.889 · Distribuidora Pão & Cia</span></div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm"><thead><tr style={{ background: CREAM }}>{["Item", "Qtd", "Valor", "Ação"].map((h) => <th key={h} className="text-left px-4 py-2 font-semibold" style={{ color: NAVY }}>{h}</th>)}</tr></thead>
              <tbody>{itens.map((i) => (
                <tr key={i.n} className="border-t" style={{ borderColor: "#F0F0F0" }}>
                  <td className="px-4 py-2" style={{ color: NAVY }}>{i.n}</td><td className="px-4 py-2" style={{ color: "#4B5563" }}>{i.q}</td>
                  <td className="px-4 py-2" style={{ color: "#4B5563" }}>{money(i.v)}</td><td className="px-4 py-2"><Pill tone="green">Conferido</Pill></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <Btn className="mt-4" icon={Boxes} onClick={() => toast("Itens lançados no estoque · preço médio recalculado")}>Lançar tudo no estoque</Btn>
        </Card>
      )}
    </Section>
  );
}

function Fiscal({ toast }) {
  return (
    <Section title="Fiscal & impressora" desc="Emissão de NFC-e e NF-e com integração à impressora fiscal e certificado digital.">
      <div className="grid md:grid-cols-3 gap-4 mb-4">
        <Card className="p-5"><div className="flex items-center gap-2 mb-2"><Printer size={18} color="#1B7F4B" /><span className="font-semibold text-sm" style={{ color: NAVY }}>Impressora fiscal</span></div><Pill tone="green">Conectada · Epson TM-T20</Pill></Card>
        <Card className="p-5"><div className="flex items-center gap-2 mb-2"><ShieldCheck size={18} color="#1B7F4B" /><span className="font-semibold text-sm" style={{ color: NAVY }}>Certificado A1</span></div><Pill tone="green">Válido até 02/2027</Pill></Card>
        <Card className="p-5"><div className="flex items-center gap-2 mb-2"><Zap size={18} color={ORANGE} /><span className="font-semibold text-sm" style={{ color: NAVY }}>SEFAZ</span></div><Pill tone="green">Online · autorizando</Pill></Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3"><h3 className="font-bold" style={{ color: NAVY }}>Últimas notas emitidas</h3><Btn size="sm" variant="ghost" icon={Receipt} onClick={() => toast("NFC-e de teste emitida")}>Emitir NFC-e de teste</Btn></div>
        <div className="space-y-2">
          {[["NFC-e 4421", "Balcão 1", "R$ 46,90", "Autorizada"], ["NFC-e 4420", "Restaurante", "R$ 128,00", "Autorizada"], ["NF-e 889", "Festa Corp X", "R$ 920,00", "Autorizada"]].map((r) => (
            <div key={r[0]} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#FAFAFA" }}>
              <div className="text-sm"><span className="font-semibold" style={{ color: NAVY }}>{r[0]}</span> <span style={{ color: "#9AA0A6" }}>· {r[1]}</span></div>
              <div className="flex items-center gap-3"><span className="text-sm font-medium" style={{ color: NAVY }}>{r[2]}</span><Pill tone="green">{r[3]}</Pill></div>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function Encomendas() {
  const tone = (s) => s.includes("Aguardando") ? "red" : s.includes("Pronto") ? "green" : s.includes("Confirmado") ? "blue" : "orange";
  return (
    <Section title="Gestão de encomendas" desc="Pedidos agendados com data, hora e acompanhamento de produção." right={<Btn icon={Plus}>Nova encomenda</Btn>}>
      <div className="grid md:grid-cols-2 gap-4">
        {ENCOMENDAS.map((e) => (
          <Card key={e.c + e.item} className="p-5">
            <div className="flex items-start justify-between"><div><div className="font-semibold" style={{ color: NAVY }}>{e.item}</div><div className="text-sm mt-1" style={{ color: "#6B7280" }}>{e.c}</div></div><Pill tone={tone(e.status)}>{e.status}</Pill></div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t" style={{ borderColor: "#F0F0F0" }}>
              <div className="flex items-center gap-2 text-sm" style={{ color: "#4B5563" }}><Calendar size={15} />{e.data}</div>
              <div className="font-bold" style={{ color: ORANGE }}>{money(e.valor)}</div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Delivery() {
  const tone = (s) => s.includes("caminho") ? "orange" : s.includes("Saiu") ? "blue" : "gray";
  return (
    <Section title="Delivery" desc="Pedidos em rota, entregadores e tempo estimado — no estilo dos grandes apps.">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-3">
          {DELIVERIES.map((d) => (
            <Card key={d.id} className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><Truck size={18} color={ORANGE} /></div>
                <div><div className="font-semibold text-sm" style={{ color: NAVY }}>{d.id} · {d.c}</div><div className="text-sm flex items-center gap-1" style={{ color: "#9AA0A6" }}><MapPin size={13} />{d.bairro} · {d.mot}</div></div>
              </div>
              <div className="text-right"><Pill tone={tone(d.status)}>{d.status}</Pill><div className="text-sm mt-1 flex items-center gap-1 justify-end" style={{ color: "#4B5563" }}><Clock size={13} />{d.min} min</div></div>
            </Card>
          ))}
        </div>
        <Card className="p-5">
          <h3 className="font-bold mb-3" style={{ color: NAVY }}>Entregadores ativos</h3>
          {[["Carlos", "Em rota"], ["Bruno", "Em rota"], ["Diego", "Disponível"]].map((m) => (
            <div key={m[0]} className="flex items-center justify-between py-2"><span className="text-sm" style={{ color: NAVY }}>{m[0]}</span><Pill tone={m[1] === "Disponível" ? "green" : "orange"}>{m[1]}</Pill></div>
          ))}
          <Btn variant="ghost" size="sm" icon={Plus} className="w-full mt-3">Cadastrar entregador</Btn>
        </Card>
      </div>
    </Section>
  );
}

function Clientes({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("customers").select("*").eq("storeId", STORE_ID).order("name");
    if (error) toast("Erro ao carregar: " + error.message); else setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const toggleCashback = async (c, v) => {
    setList((l) => l.map((x) => x.id === c.id ? { ...x, cashbackEnabled: v } : x));
    const { error } = await supabase.from("customers").update({ cashbackEnabled: v }).eq("id", c.id);
    if (error) { toast("Erro: " + error.message); load(); }
  };
  const salvar = async () => {
    if (!form.name) { toast("Informe o nome"); return; }
    if (form.id) {
      const { error } = await supabase.from("customers").update({ name: form.name, phone: form.phone }).eq("id", form.id);
      if (error) return toast("Erro: " + error.message);
      toast("Cliente atualizado");
    } else {
      const { error } = await supabase.from("customers").insert({ storeId: STORE_ID, name: form.name, phone: form.phone, cashbackEnabled: true });
      if (error) return toast("Erro: " + error.message);
      toast("Cliente cadastrado");
    }
    setForm(null); load();
  };
  const excluir = async (c) => {
    if (!window.confirm("Excluir \"" + c.name + "\"? Esta ação remove do banco.")) return;
    const { error } = await supabase.from("customers").delete().eq("id", c.id);
    if (error) return toast("Erro: " + error.message);
    toast("Cliente excluído"); load();
  };

  return (
    <Section title="Clientes & cashback" desc="Cadastro real no banco — adicione, edite, exclua e ative o cashback por cliente."
      right={<Btn icon={Plus} onClick={() => setForm({ name: "", phone: "" })}>Novo cliente</Btn>}>
      {loading ? <p className="text-sm" style={{ color: "#9AA0A6" }}>Carregando...</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: CREAM }}>{["Cliente", "Telefone", "Zips", "Total gasto", "Cashback", ""].map((h) => <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: NAVY }}>{h}</th>)}</tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={6} className="px-4 py-8 text-center" style={{ color: "#9AA0A6" }}>Nenhum cliente. Clique em "Novo cliente".</td></tr>}
                {list.map((c) => (
                  <tr key={c.id} className="border-t" style={{ borderColor: "#F0F0F0" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{c.name}</td>
                    <td className="px-4 py-3" style={{ color: "#4B5563" }}>{c.phone || "—"}</td>
                    <td className="px-4 py-3"><span className="font-semibold" style={{ color: ORANGE }}>{Number(c.zips)}</span></td>
                    <td className="px-4 py-3" style={{ color: "#4B5563" }}>{money(Number(c.totalSpent))}</td>
                    <td className="px-4 py-3"><Toggle on={c.cashbackEnabled} onChange={(v) => toggleCashback(c, v)} /></td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setForm({ id: c.id, name: c.name, phone: c.phone || "" })} className="text-sm font-semibold mr-3" style={{ color: NAVY }}>Editar</button>
                      <button onClick={() => excluir(c)} className="text-sm font-semibold" style={{ color: "#C0392B" }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
          <Card className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-3"><h3 className="font-bold" style={{ color: NAVY }}>{form.id ? "Editar cliente" : "Novo cliente"}</h3><button onClick={() => setForm(null)}><X size={20} color="#9AA0A6" /></button></div>
            <label className="text-sm font-medium" style={{ color: NAVY }}>Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
            <label className="text-sm font-medium" style={{ color: NAVY }}>Telefone</label>
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
            <Btn className="w-full mt-2" icon={Check} onClick={salvar}>{form.id ? "Salvar alterações" : "Cadastrar"}</Btn>
          </Card>
        </div>
      )}
    </Section>
  );
}

function Clube() {
  const [ativo, setAtivo] = useState(true);
  const [pct, setPct] = useState(5);
  return (
    <Section title="Clube de pontos" desc="Cashback 100% configurável — defina a regra e ligue para a loja toda ou por cliente.">
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between"><div className="flex items-center gap-2"><Gift size={18} color={ORANGE} /><span className="font-bold" style={{ color: NAVY }}>Clube Zip ativo</span></div><Toggle on={ativo} onChange={setAtivo} /></div>
          <p className="text-sm mt-2" style={{ color: "#6B7280" }}>Os pontos do clube se chamam <b style={{ color: ORANGE }}>Zips</b>. 1 Zip = R$ 1 em compras futuras.</p>
          <div className="mt-6"><label className="text-sm font-medium" style={{ color: NAVY }}>Cashback por compra: <b style={{ color: ORANGE }}>{pct}%</b></label>
            <input type="range" min="0" max="20" value={pct} onChange={(e) => setPct(+e.target.value)} className="w-full mt-2" style={{ accentColor: ORANGE }} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="font-bold mb-3" style={{ color: NAVY }}>Simulação</h3>
          {[["Compra de R$ 100", money(100 * pct / 100) + " em Zips"], ["Compra de R$ 250", money(250 * pct / 100) + " em Zips"], ["Cliente com 540 Zips", "R$ 540 disponíveis"]].map((r) => (
            <div key={r[0]} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#F2F2F2" }}><span className="text-sm" style={{ color: "#4B5563" }}>{r[0]}</span><span className="font-semibold text-sm" style={{ color: NAVY }}>{r[1]}</span></div>
          ))}
        </Card>
      </div>
    </Section>
  );
}

function Pagamentos({ toast }) {
  const [mp, setMp] = useState(true);
  return (
    <Section title="Pagamentos & PDVs" desc="Mercado Pago (Pix + cartão online), maquineta local e cadastro de cada caixa.">
      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Wallet size={18} color={ORANGE} /><span className="font-bold" style={{ color: NAVY }}>Mercado Pago</span></div><Pill tone={mp ? "green" : "gray"}>{mp ? "Conectado" : "Desconectado"}</Pill></div>
          <label className="text-sm font-medium" style={{ color: NAVY }}>Access Token</label>
          <input defaultValue="APP_USR-••••••••••••-prod" className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm" style={{ borderColor: "#E2E2E2" }} />
          <Btn size="sm" onClick={() => { setMp(true); toast("Mercado Pago conectado"); }}>Salvar e conectar</Btn>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-3"><CreditCard size={18} color={ORANGE} /><span className="font-bold" style={{ color: NAVY }}>Maquineta local</span></div>
          <p className="text-sm mb-3" style={{ color: "#6B7280" }}>Integração com maquineta para cartão presencial (crédito, débito e Pix no balcão).</p>
          <Pill tone="green">Point Pro pareada</Pill>
        </Card>
      </div>
      <Card className="p-5">
        <div className="flex items-center justify-between mb-3"><h3 className="font-bold" style={{ color: NAVY }}>PDVs cadastrados</h3><Btn size="sm" variant="ghost" icon={Plus}>Cadastrar PDV</Btn></div>
        <div className="grid md:grid-cols-3 gap-3">
          {PDVS.map((p) => (
            <div key={p.n} className="p-4 rounded-xl border" style={{ borderColor: "#ECECEC" }}>
              <div className="flex items-center gap-2 mb-2"><Store size={16} color={NAVY} /><span className="font-semibold text-sm" style={{ color: NAVY }}>{p.n}</span></div>
              <div className="text-sm" style={{ color: "#9AA0A6" }}>{p.local}</div>
              <div className="mt-2"><Pill tone={p.status === "Online" ? "green" : "gray"}>{p.status}</Pill></div>
            </div>
          ))}
        </div>
      </Card>
    </Section>
  );
}

function Whats({ toast }) {
  const [auto, setAuto] = useState(true);
  const fila = [
    { c: "Camila R.", msg: "1 pizza calabresa + Coca 2L", t: "há 2 min" },
    { c: "João P.", msg: "2 Zip Burger + batata", t: "há 5 min" },
    { c: "Lúcia M.", msg: "Encomenda: bolo 1kg p/ sábado", t: "há 9 min" },
  ];
  return (
    <Section title="Pedidos por WhatsApp" desc="Os pedidos chegam do WhatsApp direto para a cozinha, com resposta automática.">
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-2"><MessageCircle size={18} color="#1B7F4B" /><span className="font-bold" style={{ color: NAVY }}>Conta conectada</span></div>
          <Pill tone="green">+55 11 99999-0000 · ativo</Pill>
          <div className="flex items-center justify-between mt-5"><span className="text-sm" style={{ color: NAVY }}>Resposta automática</span><Toggle on={auto} onChange={setAuto} /></div>
          <p className="text-xs mt-2" style={{ color: "#9AA0A6" }}>Confirma o pedido e envia o link de pagamento sozinho.</p>
        </Card>
        <Card className="p-5 lg:col-span-2">
          <h3 className="font-bold mb-3" style={{ color: NAVY }}>Fila de pedidos recebidos</h3>
          <div className="space-y-2">
            {fila.map((f) => (
              <div key={f.c} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "#FAFAFA" }}>
                <div><div className="font-semibold text-sm" style={{ color: NAVY }}>{f.c}</div><div className="text-sm" style={{ color: "#6B7280" }}>{f.msg}</div></div>
                <div className="flex items-center gap-2"><span className="text-xs" style={{ color: "#9AA0A6" }}>{f.t}</span><Btn size="sm" onClick={() => toast("Pedido de " + f.c + " enviado à cozinha")}>Aceitar</Btn></div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Usuarios() {
  return (
    <Section title="Usuários & permissões" desc="Equipe com papéis e níveis de acesso." right={<Btn icon={Plus}>Novo usuário</Btn>}>
      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr style={{ background: CREAM }}>{["Usuário", "Papel", "Acesso", ""].map((h) => <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: NAVY }}>{h}</th>)}</tr></thead>
          <tbody>
            {USUARIOS.map((u) => (
              <tr key={u.n} className="border-t" style={{ borderColor: "#F0F0F0" }}>
                <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{u.n}</td>
                <td className="px-4 py-3"><Pill tone="navy">{u.papel}</Pill></td>
                <td className="px-4 py-3" style={{ color: "#4B5563" }}>{u.acesso}</td>
                <td className="px-4 py-3 text-right"><button className="text-sm font-semibold" style={{ color: ORANGE }}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </Section>
  );
}

const SNIPPETS = [
  { t: "Mercado Pago — criar cobrança (Pix/cartão) · Node", c:
"// Backend Node — pacote npm: mercadopago\n// const { MercadoPagoConfig, Preference } = mp_sdk\nconst mp = new MercadoPagoConfig({ accessToken: process.env.MP_TOKEN });\n\nexport async function criarPagamento(req, res) {\n  const pref = await new Preference(mp).create({ body: {\n    items: req.body.itens, // [{ title, quantity, unit_price }]\n    notification_url: 'https://api.zipao.com.br/webhooks/mp',\n    back_urls: { success: 'https://zipao.com.br/ok' },\n  }});\n  res.json({ init_point: pref.init_point, qr: pref.point_of_interaction });\n}" },
  { t: "WhatsApp Cloud API — receber pedido (webhook) · Node", c:
"// POST /webhooks/whatsapp  — a Meta envia cada mensagem aqui\nexport async function whatsappWebhook(req, res) {\n  const msg = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];\n  if (msg) {\n    await Pedido.create({ canal: 'whatsapp', de: msg.from, texto: msg.text?.body });\n    await enviarResposta(msg.from, 'Recebemos seu pedido! Pague aqui: ' + link);\n  }\n  res.sendStatus(200);\n}" },
  { t: "Entrada de NF-e — ler XML e lançar no estoque · Node", c:
"// Backend Node — pacote npm: fast-xml-parser\n// const parser = new XMLParser()\nexport function importarNFe(xml) {\n  const nfe = parser.parse(xml);\n  const itens = [].concat(nfe.nfeProc.NFe.infNFe.det);\n  for (const det of itens) {\n    const p = det.prod;\n    estoque.entrada({ nome: p.xProd, qtd: Number(p.qCom), custo: Number(p.vUnCom) });\n  }\n}" },
  { t: "NFC-e — emitir e mandar para a impressora fiscal · Node", c:
"// Backend Node — pacote npm: node-nfe (ou ACBr / PlugNotas)\nexport async function emitirNFCe(venda) {\n  const nota = await NFe.emitir({ modelo: '65', itens: venda.itens,\n    pagamentos: venda.pagamentos, certificado: process.env.CERT_A1 });\n  await impressoraFiscal.imprimir(nota.danfceXml); // ESC/POS\n  return nota.chave;\n}" },
];
function Integracoes() {
  return (
    <Section title="Integrações (código para plugar)" desc="Snippets prontos para o servidor. Copie para a sua API e preencha as credenciais.">
      <div className="grid lg:grid-cols-2 gap-4">
        {SNIPPETS.map((s) => (
          <Card key={s.t} className="p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3" style={{ background: NAVY }}><Plug size={16} color={ORANGE} /><span className="text-sm font-semibold text-white">{s.t}</span></div>
            <pre className="text-xs p-4 overflow-x-auto" style={{ color: "#E6E6E6", background: "#11151F", margin: 0, lineHeight: 1.5 }}><code>{s.c}</code></pre>
          </Card>
        ))}
      </div>
      <Card className="p-5 mt-4" style={{ background: SOFT, borderColor: ORANGE }}>
        <div className="flex items-start gap-3"><AlertTriangle size={18} color={ORANGE} className="mt-0.5" />
          <p className="text-sm" style={{ color: NAVY }}>Estas integrações rodam no <b>servidor (backend)</b>, não no navegador — exigem credenciais reais (token do Mercado Pago, certificado A1, número aprovado no WhatsApp Business e driver da impressora). A interface acima já está pronta para consumir essas rotas.</p>
        </div>
      </Card>
    </Section>
  );
}

function Relatorios() {
  return (
    <Section title="Relatórios" desc="Desempenho por período, unidade e forma de pagamento.">
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5"><h3 className="font-bold mb-3" style={{ color: NAVY }}>Faturamento na semana</h3>
          <ResponsiveContainer width="100%" height={220}><BarChart data={vendasSemana}><CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" vertical={false} /><XAxis dataKey="d" tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} /><YAxis tick={{ fontSize: 12, fill: "#9AA0A6" }} axisLine={false} tickLine={false} width={50} /><Tooltip formatter={(v) => money(v)} /><Bar dataKey="v" fill={ORANGE} radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
        </Card>
        <Card className="p-5"><h3 className="font-bold mb-3" style={{ color: NAVY }}>Formas de pagamento</h3>
          {[["Pix (Mercado Pago)", 42], ["Cartão maquineta", 31], ["Cartão online", 18], ["Dinheiro", 9]].map((r) => (
            <div key={r[0]} className="mb-3"><div className="flex justify-between text-sm mb-1"><span style={{ color: NAVY }}>{r[0]}</span><span style={{ color: "#6B7280" }}>{r[1]}%</span></div>
              <div className="h-2 rounded-full" style={{ background: "#F0F0F0" }}><div className="h-2 rounded-full" style={{ width: r[1] + "%", background: ORANGE }} /></div></div>
          ))}
        </Card>
      </div>
    </Section>
  );
}

function Cardapio({ toast }) {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(null); // {id?, name, price, categoryId, available}
  const catName = (id) => (CATEGORIAS.find((c) => c.id === id) || {}).name || "—";

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("products").select("*").eq("storeId", STORE_ID).order("name");
    if (error) toast("Erro ao carregar: " + error.message); else setList(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const novo = () => setForm({ name: "", price: "", categoryId: CATEGORIAS[0].id, available: true });
  const salvar = async () => {
    if (!form.name || form.price === "") { toast("Preencha nome e preço"); return; }
    if (form.id) {
      const { error } = await supabase.from("products").update({
        name: form.name, price: Number(form.price), categoryId: form.categoryId, available: form.available, updatedAt: new Date().toISOString(),
      }).eq("id", form.id);
      if (error) return toast("Erro: " + error.message);
      toast("Produto atualizado");
    } else {
      const { error } = await supabase.from("products").insert({
        id: crypto.randomUUID(), storeId: STORE_ID, name: form.name, slug: slugify(form.name),
        price: Number(form.price), categoryId: form.categoryId, available: form.available,
        type: "STOCK", order: 0, updatedAt: new Date().toISOString(),
      });
      if (error) return toast("Erro: " + error.message);
      toast("Produto cadastrado");
    }
    setForm(null); load();
  };
  const excluir = async (p) => {
    if (!window.confirm("Excluir \"" + p.name + "\"? Esta ação remove do banco.")) return;
    const { error } = await supabase.from("products").delete().eq("id", p.id);
    if (error) return toast("Erro: " + error.message);
    toast("Produto excluído"); load();
  };

  return (
    <Section title="Produtos & cardápio" desc="Cadastro real no banco — adicione, edite e exclua itens."
      right={<Btn icon={Plus} onClick={novo}>Novo produto</Btn>}>
      {loading ? <p className="text-sm" style={{ color: "#9AA0A6" }}>Carregando...</p> : (
        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead><tr style={{ background: CREAM }}>{["Produto", "Categoria", "Preço", "Disponível", ""].map((h) => <th key={h} className="text-left px-4 py-3 font-semibold" style={{ color: NAVY }}>{h}</th>)}</tr></thead>
              <tbody>
                {list.length === 0 && <tr><td colSpan={5} className="px-4 py-8 text-center" style={{ color: "#9AA0A6" }}>Nenhum produto. Clique em "Novo produto".</td></tr>}
                {list.map((p) => (
                  <tr key={p.id} className="border-t" style={{ borderColor: "#F0F0F0" }}>
                    <td className="px-4 py-3 font-medium" style={{ color: NAVY }}>{p.name}</td>
                    <td className="px-4 py-3" style={{ color: "#4B5563" }}>{catName(p.categoryId)}</td>
                    <td className="px-4 py-3" style={{ color: ORANGE }}>{money(Number(p.price))}</td>
                    <td className="px-4 py-3">{p.available ? <Pill tone="green">Sim</Pill> : <Pill tone="gray">Não</Pill>}</td>
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <button onClick={() => setForm({ id: p.id, name: p.name, price: String(p.price), categoryId: p.categoryId || CATEGORIAS[0].id, available: p.available })} className="text-sm font-semibold mr-3" style={{ color: NAVY }}>Editar</button>
                      <button onClick={() => excluir(p)} className="text-sm font-semibold" style={{ color: "#C0392B" }}>Excluir</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
      {form && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(26,33,54,.55)" }}>
          <Card className="w-full max-w-sm p-6">
            <div className="flex items-center justify-between mb-3"><h3 className="font-bold" style={{ color: NAVY }}>{form.id ? "Editar produto" : "Novo produto"}</h3><button onClick={() => setForm(null)}><X size={20} color="#9AA0A6" /></button></div>
            <label className="text-sm font-medium" style={{ color: NAVY }}>Nome</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} />
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-sm font-medium" style={{ color: NAVY }}>Preço (R$)</label><input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none" style={{ borderColor: "#E2E2E2" }} /></div>
              <div><label className="text-sm font-medium" style={{ color: NAVY }}>Categoria</label>
                <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} className="w-full mt-1 mb-3 px-3 py-2.5 rounded-xl border text-sm outline-none bg-white" style={{ borderColor: "#E2E2E2" }}>
                  {CATEGORIAS.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>
            <label className="flex items-center justify-between py-2"><span className="text-sm font-medium" style={{ color: NAVY }}>Disponível</span><Toggle on={form.available} onChange={(v) => setForm({ ...form, available: v })} /></label>
            <Btn className="w-full mt-3" icon={Check} onClick={salvar}>{form.id ? "Salvar alterações" : "Cadastrar"}</Btn>
          </Card>
        </div>
      )}
    </Section>
  );
}

/* ============================ Área do cliente ============================ */
function ClienteApp({ onExit, toast }) {
  const [tab, setTab] = useState("cardapio");
  const [cart, setCart] = useState([]);
  const add = (p) => setCart((c) => [...c, p]);
  const total = cart.reduce((s, x) => s + x.p, 0);
  const tabs = [["cardapio", "Cardápio", Utensils], ["pedido", "Meu pedido", ShoppingCart], ["clube", "Meus Zips", Gift]];
  return (
    <div className="min-h-screen" style={{ background: CREAM }}>
      <header className="px-4 py-3 flex items-center justify-between" style={{ background: NAVY }}>
        <div className="flex items-center gap-2"><ZipIcon size={32} /><span className="text-white font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>Zipão</span></div>
        <button onClick={onExit} className="text-white/80 text-sm inline-flex items-center gap-1"><LogOut size={16} />Sair</button>
      </header>
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex gap-2 mb-4">
          {tabs.map(([k, l, I]) => <button key={k} onClick={() => setTab(k)} className="flex-1 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center justify-center gap-2" style={tab === k ? { background: ORANGE, color: "#fff" } : { background: "#fff", color: NAVY, border: "1px solid #E8E8E8" }}><I size={16} />{l}</button>)}
        </div>
        {tab === "cardapio" && (
          <div className="space-y-5">
            {UNITS.filter((u) => PRODUTOS[u.k] && u.k !== "pesagem").map((u) => (
              <div key={u.k}>
                <div className="flex items-center gap-2 mb-2"><u.icon size={16} color={ORANGE} /><h3 className="font-bold" style={{ color: NAVY }}>{u.label}</h3></div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {PRODUTOS[u.k].map((p) => (
                    <Card key={p.n} className="p-4 flex items-center justify-between">
                      <div><div className="font-semibold text-sm" style={{ color: NAVY }}>{p.n}</div><div className="text-sm" style={{ color: ORANGE }}>{money(p.p)}</div></div>
                      <button onClick={() => { add(p); toast(p.n + " adicionado"); }} className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><Plus size={18} color={ORANGE} /></button>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {tab === "pedido" && (
          <Card className="p-5">
            <h3 className="font-bold mb-3" style={{ color: NAVY }}>Meu pedido</h3>
            {cart.length === 0 ? <p className="text-sm text-center py-8" style={{ color: "#9AA0A6" }}>Seu carrinho está vazio.</p> : (
              <>
                {cart.map((x, i) => <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: "#F2F2F2" }}><span className="text-sm" style={{ color: NAVY }}>{x.n}</span><span className="text-sm" style={{ color: "#4B5563" }}>{money(x.p)}</span></div>)}
                <div className="flex justify-between mt-4 mb-4"><span className="font-bold" style={{ color: NAVY }}>Total</span><span className="font-bold" style={{ color: NAVY }}>{money(total)}</span></div>
                <p className="text-sm mb-2" style={{ color: "#6B7280" }}>Pagar com:</p>
                <div className="grid grid-cols-2 gap-2">
                  {[["Pix", QrCode], ["Cartão online", CreditCard], ["Na entrega", Banknote], ["Usar Zips", Gift]].map(([l, I]) => (
                    <button key={l} onClick={() => toast("Pedido confirmado via " + l)} className="p-3 rounded-xl border inline-flex items-center gap-2 text-sm font-medium" style={{ borderColor: "#E2E2E2", color: NAVY }}><I size={16} color={ORANGE} />{l}</button>
                  ))}
                </div>
              </>
            )}
          </Card>
        )}
        {tab === "clube" && (
          <Card className="p-6 text-center">
            <div className="h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: SOFT }}><Gift size={26} color={ORANGE} /></div>
            <div className="text-sm" style={{ color: "#6B7280" }}>Seu saldo no Clube Zip</div>
            <div className="text-4xl font-bold my-1" style={{ color: NAVY }}>320 <span className="text-lg" style={{ color: ORANGE }}>Zips</span></div>
            <p className="text-sm" style={{ color: "#9AA0A6" }}>Equivale a {money(320)} em compras. Você ganha 5% de cashback a cada pedido.</p>
          </Card>
        )}
      </div>
    </div>
  );
}

/* ============================ Operação ao vivo (Cozinha / Pedidos / Entregador) ============================ */
let _audioCtx = null;
function unlockAudio() {
  if (!_audioCtx) { try { _audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
  if (_audioCtx && _audioCtx.state === "suspended") _audioCtx.resume();
}
function beep() {
  if (!_audioCtx) return;
  [0, 0.18].forEach((delay) => {
    const o = _audioCtx.createOscillator(), g = _audioCtx.createGain();
    o.connect(g); g.connect(_audioCtx.destination);
    o.type = "sine"; o.frequency.value = 880;
    const t = _audioCtx.currentTime + delay;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.3, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.15);
    o.start(t); o.stop(t + 0.16);
  });
}

const STORE_COORD = { lat: -23.5895, lng: -46.6347 };
function distKm(a, b) {
  const R = 6371, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

const _now0 = Date.now();
const seedOrders = [
  { id: "o1", numero: 41, tipo: "mesa", mesa: "5", cliente: "Marina", status: "producao", createdAt: _now0 - 300000, itens: [{ n: "Pizza calabresa", q: 1 }, { n: "Refri lata", q: 2 }] },
  { id: "o2", numero: 42, tipo: "delivery", cliente: "Pedro Santos", status: "pronto", createdAt: _now0 - 540000, bairro: "Vila Mariana", endereco: "Rua Domingos de Morais, 1200 - São Paulo", lat: -23.5896, lng: -46.6388, itens: [{ n: "Zip Burger", q: 2 }, { n: "Batata", q: 1 }] },
  { id: "o3", numero: 43, tipo: "whatsapp", cliente: "Camila", status: "novo", createdAt: _now0 - 60000, itens: [{ n: "Bolo fatia", q: 3 }] },
  { id: "o4", numero: 44, tipo: "delivery", cliente: "Ana Lima", status: "pronto", createdAt: _now0 - 200000, bairro: "Saúde", endereco: "Av. Jabaquara, 500 - São Paulo", lat: -23.6200, lng: -46.6400, itens: [{ n: "Pão de metro", q: 1 }] },
];
const liveStore = (function () {
  let orders = seedOrders.slice(), subs = [], started = false, seq = 45;
  const emit = () => subs.forEach((f) => f(orders.slice()));
  const novoPedido = () => {
    const nomes = ["João", "Lúcia", "Bruno", "Carla", "Diego", "Patrícia", "Rafael"];
    const tipos = ["mesa", "delivery", "whatsapp", "avulso"];
    const pool = [{ n: "Pizza margherita", q: 1 }, { n: "Zip Burger", q: 2 }, { n: "Café", q: 1 }, { n: "Coxinha", q: 4 }, { n: "Pão francês", q: 6 }, { n: "Torta", q: 1 }];
    const ends = [{ e: "Rua Vergueiro, 1000 - São Paulo", b: "Liberdade", lat: -23.571, lng: -46.639 }, { e: "Av. Paulista, 900 - São Paulo", b: "Bela Vista", lat: -23.563, lng: -46.654 }, { e: "Rua do Ipiranga, 200 - São Paulo", b: "Ipiranga", lat: -23.591, lng: -46.610 }];
    const tipo = tipos[Math.floor(Math.random() * tipos.length)];
    const o = { id: "o" + seq, numero: seq, tipo, cliente: nomes[Math.floor(Math.random() * nomes.length)], status: "novo", createdAt: Date.now(), itens: [pool[Math.floor(Math.random() * pool.length)]] };
    if (tipo === "mesa") o.mesa = String(2 + Math.floor(Math.random() * 15));
    if (tipo === "delivery") { const a = ends[Math.floor(Math.random() * ends.length)]; o.endereco = a.e; o.bairro = a.b; o.lat = a.lat; o.lng = a.lng; }
    seq++; orders = [o, ...orders]; emit();
  };
  return {
    get: () => orders.slice(),
    sub: (f) => { subs.push(f); return () => { subs = subs.filter((s) => s !== f); }; },
    update: (id, patch) => { orders = orders.map((o) => o.id === id ? { ...o, ...patch } : o); emit(); },
    startSim: () => { if (started) return; started = true; setInterval(novoPedido, 25000); },
  };
})();
function useLive() {
  const [orders, setOrders] = useState(liveStore.get());
  useEffect(() => { const un = liveStore.sub(setOrders); liveStore.startSim(); return un; }, []);
  return orders;
}
function useNewOrderSound(orders, enabled) {
  const seen = useRef(null);
  useEffect(() => {
    const ids = new Set(orders.map((o) => o.id));
    if (seen.current === null) { seen.current = ids; return; }
    let isNew = false; ids.forEach((id) => { if (!seen.current.has(id)) isNew = true; });
    seen.current = ids;
    if (isNew && enabled) beep();
  }, [orders, enabled]);
}
function useClock() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  return now;
}
const fmtTimer = (ms) => { const s = Math.max(0, Math.floor(ms / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
function TipoPill({ tipo, mesa }) {
  const map = { mesa: ["navy", "Mesa " + (mesa || "")], delivery: ["orange", "Delivery"], avulso: ["gray", "Balcão"], whatsapp: ["green", "WhatsApp"] };
  const [tone, txt] = map[tipo] || ["gray", tipo];
  return <Pill tone={tone}>{txt}</Pill>;
}
function SoundBtn({ on, onToggle }) {
  return <button onClick={onToggle} className="rounded-xl font-semibold inline-flex items-center gap-2 px-3 py-2 text-sm" style={{ background: on ? SOFT : NAVY, color: on ? ORANGE : "#fff" }}>{on ? <Volume2 size={16} /> : <VolumeX size={16} />}{on ? "Som ligado" : "Ativar som"}</button>;
}

function Cozinha() {
  const orders = useLive();
  const now = useClock();
  const [sound, setSound] = useState(false);
  useNewOrderSound(orders, sound);
  const toggle = () => { if (!sound) { unlockAudio(); beep(); setSound(true); } else setSound(false); };
  const cols = [["novo", "Novos", "#C0392B", Flame], ["producao", "Em produção", "#D35400", ChefHat], ["pronto", "Prontos", "#1B7F4B", Check]];
  const next = { novo: "producao", producao: "pronto" };
  const label = { novo: "Iniciar produção", producao: "Marcar pronto" };
  return (
    <Section title="Cozinha (KDS)" desc="Pedidos em tempo real. Toque para avançar a produção." right={<SoundBtn on={sound} onToggle={toggle} />}>
      <div className="grid md:grid-cols-3 gap-4">
        {cols.map(([st, titulo, cor, Ic]) => {
          const list = orders.filter((o) => o.status === st);
          return (
            <div key={st}>
              <div className="flex items-center justify-between mb-2"><h3 className="font-bold inline-flex items-center gap-2" style={{ color: NAVY }}><Ic size={16} color={cor} />{titulo}</h3><span className="text-sm font-bold" style={{ color: cor }}>{list.length}</span></div>
              <div className="space-y-3">
                {list.length === 0 && <div className="text-sm rounded-xl p-4 text-center" style={{ background: "#FAFAFA", color: "#9AA0A6" }}>Vazio</div>}
                {list.map((o) => { const late = now - o.createdAt > 600000; return (
                  <Card key={o.id} className="p-4" style={{ borderLeft: "4px solid " + cor }}>
                    <div className="flex items-center justify-between">
                      <div className="font-bold" style={{ color: NAVY }}>#{o.numero} · {o.cliente}</div>
                      <span className="text-xs font-semibold inline-flex items-center gap-1" style={{ color: late ? "#C0392B" : "#9AA0A6" }}><Timer size={13} />{fmtTimer(now - o.createdAt)}</span>
                    </div>
                    <div className="mt-1 mb-3"><TipoPill tipo={o.tipo} mesa={o.mesa} /></div>
                    <ul className="text-sm space-y-1 mb-3" style={{ color: "#4B5563" }}>{o.itens.map((it, i) => <li key={i}>{it.q}× {it.n}</li>)}</ul>
                    {st !== "pronto"
                      ? <Btn size="sm" className="w-full" icon={st === "novo" ? Flame : Check} onClick={() => liveStore.update(o.id, { status: next[st] })}>{label[st]}</Btn>
                      : (o.tipo === "delivery"
                        ? <div className="text-xs text-center py-2 rounded-lg" style={{ background: SOFT, color: ORANGE }}>Aguardando entregador</div>
                        : <Btn size="sm" variant="ghost" className="w-full" icon={Check} onClick={() => liveStore.update(o.id, { status: "concluido" })}>Concluir</Btn>)}
                  </Card>
                ); })}
              </div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

function PedidosVivo({ toast }) {
  const orders = useLive();
  const now = useClock();
  const [sound, setSound] = useState(false);
  useNewOrderSound(orders, sound);
  const toggle = () => { if (!sound) { unlockAudio(); beep(); setSound(true); } else setSound(false); };
  const ativos = orders.filter((o) => o.status !== "concluido");
  const stInfo = { novo: ["Novo", "red"], producao: ["Em produção", "orange"], pronto: ["Pronto", "green"], entrega: ["Saiu p/ entrega", "blue"] };
  return (
    <Section title="Pedidos ao vivo" desc="Acompanhe os pedidos chegando e cobre a cozinha quando atrasar." right={<SoundBtn on={sound} onToggle={toggle} />}>
      <div className="space-y-2">
        {ativos.length === 0 && <Card className="p-8 text-center"><span className="text-sm" style={{ color: "#9AA0A6" }}>Nenhum pedido ativo.</span></Card>}
        {ativos.map((o) => { const [t, tone] = stInfo[o.status] || ["", "gray"]; const late = now - o.createdAt > 480000; return (
          <Card key={o.id} className="p-4 flex items-center justify-between gap-3 flex-wrap" style={o.urgent ? { borderColor: ORANGE, borderWidth: 2 } : {}}>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl flex items-center justify-center" style={{ background: SOFT }}><Receipt size={18} color={ORANGE} /></div>
              <div>
                <div className="font-bold inline-flex items-center gap-2" style={{ color: NAVY }}>#{o.numero} · {o.cliente} <TipoPill tipo={o.tipo} mesa={o.mesa} /></div>
                <div className="text-xs" style={{ color: "#9AA0A6" }}>{o.itens.map((it) => it.q + "× " + it.n).join(", ")}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs inline-flex items-center gap-1" style={{ color: late ? "#C0392B" : "#9AA0A6" }}><Timer size={13} />{fmtTimer(now - o.createdAt)}</span>
              <Pill tone={tone}>{t}</Pill>
              {(o.status === "novo" || o.status === "producao") && <Btn size="sm" variant="ghost" icon={BellIcon} onClick={() => { liveStore.update(o.id, { urgent: true }); toast("Cozinha avisada sobre #" + o.numero); }}>Cobrar</Btn>}
            </div>
          </Card>
        ); })}
      </div>
    </Section>
  );
}

function Entregador({ toast }) {
  const orders = useLive();
  const [recusados, setRecusados] = useState([]);
  const [sound, setSound] = useState(false);
  const disp = orders.filter((o) => o.tipo === "delivery" && o.status === "pronto" && !recusados.includes(o.id))
    .map((o) => ({ ...o, km: o.lat ? distKm(STORE_COORD, { lat: o.lat, lng: o.lng }) : 0 }))
    .sort((a, b) => a.km - b.km);
  const minhas = orders.filter((o) => o.status === "entrega");
  useNewOrderSound(disp, sound);
  const toggle = () => { if (!sound) { unlockAudio(); beep(); setSound(true); } else setSound(false); };
  const maps = (o) => window.open("https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(o.endereco), "_blank");
  return (
    <Section title="Entregador" desc="Aceite as entregas, veja o endereço e abra a rota no Google Maps." right={<SoundBtn on={sound} onToggle={toggle} />}>
      {minhas.length > 0 && (<>
        <h3 className="font-bold mb-2" style={{ color: NAVY }}>Minhas entregas</h3>
        <div className="space-y-2 mb-5">
          {minhas.map((o) => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between"><div className="font-bold" style={{ color: NAVY }}>#{o.numero} · {o.cliente}</div><Pill tone="blue">A caminho</Pill></div>
              <div className="text-sm mt-1 flex items-center gap-1" style={{ color: "#6B7280" }}><MapPin size={14} />{o.endereco}</div>
              <div className="flex gap-2 mt-3"><Btn size="sm" icon={Navigation} onClick={() => maps(o)}>Rota no Maps</Btn><Btn size="sm" variant="ghost" icon={Check} onClick={() => { liveStore.update(o.id, { status: "concluido" }); toast("Entrega #" + o.numero + " concluída"); }}>Entregue</Btn></div>
            </Card>
          ))}
        </div>
      </>)}
      <h3 className="font-bold mb-2" style={{ color: NAVY }}>Disponíveis (mais perto primeiro)</h3>
      <div className="space-y-2">
        {disp.length === 0 && <Card className="p-8 text-center"><span className="text-sm" style={{ color: "#9AA0A6" }}>Nenhuma entrega disponível agora.</span></Card>}
        {disp.map((o) => (
          <Card key={o.id} className="p-4">
            <div className="flex items-center justify-between"><div className="font-bold" style={{ color: NAVY }}>#{o.numero} · {o.cliente}</div><span className="text-sm font-bold inline-flex items-center gap-1" style={{ color: ORANGE }}><Bike size={14} />{o.km.toFixed(1)} km</span></div>
            <div className="text-sm mt-1 flex items-center gap-1" style={{ color: "#6B7280" }}><MapPin size={14} />{o.endereco} · {o.bairro}</div>
            <div className="text-xs mt-1" style={{ color: "#9AA0A6" }}>{o.itens.map((it) => it.q + "× " + it.n).join(", ")}</div>
            <div className="flex gap-2 mt-3">
              <Btn size="sm" icon={ThumbsUp} onClick={() => { liveStore.update(o.id, { status: "entrega" }); toast("Entrega #" + o.numero + " aceita"); }}>Aceitar</Btn>
              <Btn size="sm" variant="ghost" icon={ThumbsDown} onClick={() => setRecusados((r) => [...r, o.id])}>Recusar</Btn>
              <Btn size="sm" variant="ghost" icon={Navigation} onClick={() => maps(o)}>Rota</Btn>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/* ============================ Shell admin ============================ */
const NAV = [
  { k: "dashboard", label: "Visão geral", icon: LayoutDashboard, C: Dashboard },
  { k: "pdv", label: "PDV / Frente de caixa", icon: ShoppingCart, C: PDV },
  { k: "cozinha", label: "Cozinha (KDS)", icon: ChefHat, C: Cozinha },
  { k: "pedidos", label: "Pedidos ao vivo", icon: BellIcon, C: PedidosVivo },
  { k: "entregador", label: "Entregador", icon: Bike, C: Entregador },
  { k: "cardapio", label: "Produtos & cardápio", icon: Utensils, C: Cardapio },
  { k: "estoque", label: "Estoque & fichas técnicas", icon: Boxes, C: Estoque },
  { k: "compras", label: "Compras & NF-e (XML)", icon: ClipboardList, C: Compras },
  { k: "fiscal", label: "Fiscal & impressora", icon: Printer, C: Fiscal },
  { k: "encomendas", label: "Encomendas", icon: Calendar, C: Encomendas },
  { k: "delivery", label: "Delivery", icon: Truck, C: Delivery },
  { k: "clientes", label: "Clientes & cashback", icon: Users, C: Clientes },
  { k: "clube", label: "Clube de pontos", icon: Gift, C: Clube },
  { k: "pagamentos", label: "Pagamentos & PDVs", icon: Wallet, C: Pagamentos },
  { k: "whatsapp", label: "Pedidos WhatsApp", icon: MessageCircle, C: Whats },
  { k: "usuarios", label: "Usuários & permissões", icon: UserCog, C: Usuarios },
  { k: "integracoes", label: "Integrações (código)", icon: Plug, C: Integracoes },
  { k: "relatorios", label: "Relatórios", icon: BarChart3, C: Relatorios },
];

function Admin({ onExit, startMod, operador }) {
  const [mod, setMod] = useState(startMod || "dashboard");
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2600); };
  const Active = NAV.find((n) => n.k === mod).C;

  const NavList = (
    <nav className="p-3 space-y-0.5">
      {NAV.map((n) => { const on = mod === n.k; const I = n.icon; return (
        <button key={n.k} onClick={() => { setMod(n.k); setOpen(false); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition" style={on ? { background: "rgba(255,86,48,.14)", color: "#fff" } : { color: "rgba(255,255,255,.7)" }}>
          <I size={18} color={on ? ORANGE : "rgba(255,255,255,.6)"} />{n.label}
        </button>
      ); })}
    </nav>
  );

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F7F5" }}>
      {/* sidebar desktop */}
      <aside className="hidden md:flex md:flex-col w-64 shrink-0" style={{ background: NAVY }}>
        <div className="p-4 flex items-center gap-2 border-b" style={{ borderColor: "rgba(255,255,255,.08)" }}>
          <ZipIcon size={34} /><span className="text-white font-bold text-lg" style={{ fontFamily: "Fredoka, sans-serif" }}>Zipão</span>
          <span className="ml-auto text-xs px-2 py-1 rounded-md" style={{ background: "rgba(255,255,255,.1)", color: "#fff" }}>ERP</span>
        </div>
        <div className="flex-1 overflow-y-auto">{NavList}</div>
        <button onClick={onExit} className="m-3 p-3 rounded-xl text-sm font-medium inline-flex items-center gap-2" style={{ color: "rgba(255,255,255,.7)", background: "rgba(255,255,255,.06)" }}><LogOut size={16} />Sair</button>
      </aside>

      {/* sidebar mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div className="w-72 h-full overflow-y-auto" style={{ background: NAVY }}>
            <div className="p-4 flex items-center gap-2"><ZipIcon size={32} /><span className="text-white font-bold" style={{ fontFamily: "Fredoka, sans-serif" }}>Zipão</span><button className="ml-auto" onClick={() => setOpen(false)}><X color="#fff" size={22} /></button></div>
            {NavList}
          </div>
          <div className="flex-1" style={{ background: "rgba(0,0,0,.4)" }} onClick={() => setOpen(false)} />
        </div>
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="bg-white border-b px-4 md:px-6 py-3 flex items-center gap-3" style={{ borderColor: "#ECECEC" }}>
          <button className="md:hidden" onClick={() => setOpen(true)}><Menu color={NAVY} /></button>
          <div className="relative hidden sm:block flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-2.5" color="#9AA0A6" />
            <input placeholder="Buscar produto, cliente, pedido..." className="w-full pl-9 pr-3 py-2 rounded-xl border text-sm outline-none" style={{ borderColor: "#E8E8E8" }} />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Btn size="sm" variant="ghost" icon={Power} onClick={() => setTour(0)}>Tour guiado</Btn>
            <button className="h-9 w-9 rounded-xl flex items-center justify-center relative" style={{ background: "#F4F4F5" }}><Bell size={18} color={NAVY} /><span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full" style={{ background: ORANGE }} /></button>
            {operador && <span className="text-sm font-medium hidden sm:block" style={{ color: NAVY }}>{operador}</span>}
            <div className="h-9 w-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: ORANGE }}>{operador ? operador[0] : "A"}</div>
          </div>
        </header>
        <main className="p-4 md:p-6 overflow-y-auto flex-1"><Active toast={toast} /></main>
      </div>

      {tour !== null && <Tour step={tour} setStep={setTour} onModule={setMod} onClose={() => setTour(null)} />}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2 shadow-lg" style={{ background: NAVY }}>
          <CheckCircle2 size={16} color={ORANGE} />{toastMsg}
        </div>
      )}
    </div>
  );
}

/* ============================ Root ============================ */
export default function App() {
  const [screen, setScreen] = useState("home");
  const [adminInit, setAdminInit] = useState({ mod: "dashboard", operador: null });
  const [toastMsg, setToastMsg] = useState(null);
  const toast = (m) => { setToastMsg(m); setTimeout(() => setToastMsg(null), 2400); };
  const goAdmin = (mod, operador) => { setAdminInit({ mod: mod || "dashboard", operador: operador || null }); setScreen("admin"); };
  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
      <style>{"@import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@600&display=swap');"}</style>
      {screen === "home" && <Landing onLogin={() => setScreen("login")} onCliente={() => setScreen("cliente")} toast={toast} />}
      {screen === "login" && <Login onEnter={setScreen} onDono={() => goAdmin("dashboard", null)} />}
      {screen === "pdvlogin" && <PDVLogin onBack={() => setScreen("login")} onEnter={(op) => goAdmin("pdv", op)} />}
      {screen === "admin" && <Admin onExit={() => setScreen("home")} startMod={adminInit.mod} operador={adminInit.operador} />}
      {screen === "cliente" && <ClienteApp onExit={() => setScreen("home")} toast={toast} />}
      {toastMsg && (
        <div className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 px-4 py-3 rounded-xl text-white text-sm font-medium flex items-center gap-2 shadow-lg" style={{ background: NAVY }}>
          <CheckCircle2 size={16} color={ORANGE} />{toastMsg}
        </div>
      )}
    </div>
  );
}
