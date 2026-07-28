import React, { useState, useMemo } from "react";
import {
  Smartphone,
  MessageCircle,
  Plus,
  Trash2,
  Pencil,
  X,
  Lock,
  Settings,
  ArrowLeftRight,
  ShieldCheck,
  Store,
  LayoutDashboard,
  Search,
  ChevronRight,
  PackageCheck,
  Wallet,
} from "lucide-react";

/* ---------------------------------------------------------
   TOKENS — palette "tech" : bleu nuit profond en fond, accents
   bleu électrique (CTA/prix), violet (badges premium/échange)
   et cyan (confiance/garantie), pour une lecture immédiate
   "boutique high-tech" plutôt que marché générique.
   ink        #E9EDF8  blanc froid
   nuit       #0A0F1E  fond
   surface    #121A2E  cartes
   surface-2  #182238  cartes surélevées / inputs
   bleu       #4C8CFF  accent "étiquette prix" / CTA
   cyan       #35D6C4  accent confiance / garantie
   violet     #8B6BFF  accent échange / premium
--------------------------------------------------------- */
const C = {
  ink: "#E9EDF8",
  inkDim: "#8892B0",
  charcoal: "#0A0F1E",
  surface: "#121A2E",
  surface2: "#182238",
  coral: "#4C8CFF",
  teal: "#35D6C4",
  gold: "#8B6BFF",
  line: "#243252",
};

const CONDITIONS = ["Comme neuf", "Bon état", "État moyen"];
const CONDITION_MULT = { "Comme neuf": 1, "Bon état": 0.85, "État moyen": 0.65 };

const seedProducts = [
  { id: 1, model: "iPhone 12 Pro", storage: "128 Go", price: 165000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 210, camera: 4, perf: 3, battery: 3, value: 4 },
  { id: 2, model: "iPhone 12 Pro Max", storage: "128 Go", price: 145000, condition: "Bon état", warranty: 1, exchange: true, hue: 260, note: "Face ID désactivé", camera: 4, perf: 3, battery: 4, value: 4 },
  { id: 3, model: "iPhone 13", storage: "128 Go", price: 185000, condition: "État moyen", warranty: 3, exchange: true, hue: 20, note: "2ème main", camera: 3, perf: 3, battery: 3, value: 3 },
  { id: 4, model: "iPhone 13 Pro Max", storage: "128 Go", price: 275000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 340, camera: 5, perf: 4, battery: 4, value: 3 },
  { id: 5, model: "iPhone 13 Pro Max", storage: "128 Go", price: 180000, condition: "Bon état", warranty: 2, exchange: true, hue: 340, note: "2ème main", camera: 5, perf: 4, battery: 4, value: 5 },
  { id: 6, model: "iPhone 11 Pro Max", storage: "64 Go", price: 80000, condition: "Bon état", warranty: 2, exchange: true, hue: 40, camera: 3, perf: 2, battery: 3, value: 5 },
  { id: 7, model: "iPhone 14 Pro", storage: "256 Go", price: 250000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 200, camera: 5, perf: 4, battery: 4, value: 3 },
  { id: 8, model: "iPhone 15 Pro Max", storage: "256 Go", price: 375000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 210, note: "eSIM", camera: 5, perf: 5, battery: 5, value: 2 },
  { id: 9, model: "iPhone 15 Pro Max", storage: "512 Go", price: 450000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 210, note: "eSIM", camera: 5, perf: 5, battery: 5, value: 2 },
  { id: 10, model: "iPhone 16 Plus", storage: "128 Go", price: 430000, condition: "Comme neuf", warranty: 3, exchange: true, hue: 300, note: "eSIM", camera: 5, perf: 5, battery: 5, value: 2 },
  { id: 11, model: "iPhone XR", storage: "64 Go", price: 55000, condition: "État moyen", warranty: 1, exchange: true, hue: 0, note: "Vente flash · 2ème main", camera: 2, perf: 2, battery: 2, value: 5 },
];

const seedTradeIn = [
  { id: 1, model: "iPhone 11", storage: "64 Go", baseValue: 70000 },
  { id: 2, model: "iPhone 12", storage: "128 Go", baseValue: 140000 },
  { id: 3, model: "iPhone 12 Pro", storage: "128 Go", baseValue: 160000 },
  { id: 4, model: "iPhone 12 Pro Max", storage: "128 Go", baseValue: 175000 },
  { id: 5, model: "iPhone 13", storage: "128 Go", baseValue: 170000 },
  { id: 6, model: "iPhone 13 Pro Max", storage: "128 Go", baseValue: 200000 },
  { id: 7, model: "iPhone 14 Pro", storage: "128 Go", baseValue: 230000 },
  { id: 8, model: "iPhone 14 Pro", storage: "256 Go", baseValue: 260000 },
  { id: 9, model: "iPhone 15 Pro Max", storage: "256 Go", baseValue: 320000 },
  { id: 10, model: "iPhone 16 Plus", storage: "128 Go", baseValue: 380000 },
];

const fmt = (n) => n.toLocaleString("fr-FR").replace(/,/g, " ") + " FCFA";

function DeviceGlyph({ hue, size = 1 }) {
  return (
    <div
      className="relative flex items-center justify-center rounded-2xl"
      style={{
        width: size === 1 ? 96 : 56,
        height: size === 1 ? 140 : 82,
        background: `linear-gradient(155deg, hsl(${hue} 45% 22%), hsl(${hue} 55% 12%))`,
        border: `1px solid hsl(${hue} 40% 35%)`,
      }}
    >
      <div
        className="absolute top-1.5 left-1/2 -translate-x-1/2 rounded-full"
        style={{ width: size === 1 ? 28 : 18, height: 5, background: "rgba(0,0,0,0.35)" }}
      />
      <Smartphone size={size === 1 ? 34 : 22} color={`hsl(${hue} 30% 78%)`} strokeWidth={1.4} />
    </div>
  );
}

function PriceTag({ amount }) {
  return (
    <div
      className="absolute -top-3 -right-3 px-2.5 py-1 rounded-md text-xs font-semibold shadow-lg"
      style={{
        background: C.coral,
        color: "#071022",
        transform: "rotate(-7deg)",
        fontFamily: "'JetBrains Mono', monospace",
        boxShadow: "0 6px 14px rgba(76,140,255,0.45)",
      }}
    >
      {fmt(amount)}
    </div>
  );
}

function Badge({ children, tone = "line" }) {
  const bg = tone === "teal" ? "rgba(53,214,196,0.14)" : tone === "gold" ? "rgba(139,107,255,0.16)" : "rgba(255,255,255,0.06)";
  const fg = tone === "teal" ? C.teal : tone === "gold" ? C.gold : C.inkDim;
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
      style={{ background: bg, color: fg, border: `1px solid ${fg}33` }}
    >
      {children}
    </span>
  );
}

export default function PhoneShopPrototype() {
  const [view, setView] = useState("store");
  const [products, setProducts] = useState(seedProducts);
  const [tradeIn, setTradeIn] = useState(seedTradeIn);
  const [waNumber, setWaNumber] = useState("221757473307");
  const [shopName, setShopName] = useState("Miss Easy Business");

  const [query, setQuery] = useState("");
  const [budget, setBudget] = useState("all");
  const [selected, setSelected] = useState(null);

  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [pinError, setPinError] = useState(false);

  const [editingProduct, setEditingProduct] = useState(null); // object or 'new'
  const [editingTrade, setEditingTrade] = useState(null);

  const [tiModel, setTiModel] = useState(seedTradeIn[0].model + "|" + seedTradeIn[0].storage);
  const [tiCondition, setTiCondition] = useState("Comme neuf");

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesQuery = (p.model + " " + p.storage).toLowerCase().includes(query.toLowerCase());
      const matchesBudget =
        budget === "all"
          ? true
          : budget === "b1"
          ? p.price < 100000
          : budget === "b2"
          ? p.price >= 100000 && p.price < 200000
          : budget === "b3"
          ? p.price >= 200000 && p.price < 350000
          : p.price >= 350000;
      return matchesQuery && matchesBudget;
    });
  }, [products, query, budget]);

  const tradeInEstimate = useMemo(() => {
    const entry = tradeIn.find((t) => t.model + "|" + t.storage === tiModel);
    if (!entry) return null;
    const mult = CONDITION_MULT[tiCondition];
    const mid = Math.round(entry.baseValue * mult);
    const low = Math.round(mid * 0.9);
    const high = Math.round(mid * 1.08);
    return { entry, low, high };
  }, [tiModel, tiCondition, tradeIn]);

  const waLink = (message) => `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

  const stockValue = products.reduce((s, p) => s + p.price, 0);

  return (
    <div style={{ background: C.charcoal, color: C.ink, minHeight: "100vh", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .disp { font-family: 'Space Grotesk', sans-serif; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        input, select { outline: none; }
        input:focus, select:focus, button:focus-visible { box-shadow: 0 0 0 2px ${C.teal}; }
        ::placeholder { color: #566089; }
      `}</style>

      {/* HEADER */}
      <header
        className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-3"
        style={{ background: "rgba(10,15,30,0.88)", backdropFilter: "blur(8px)", borderBottom: `1px solid ${C.line}` }}
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center disp font-bold"
            style={{ background: C.teal, color: C.charcoal }}
          >
            M
          </div>
          <span className="disp font-semibold text-sm sm:text-base">{shopName}</span>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full" style={{ background: C.surface }}>
          <button
            onClick={() => setView("store")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition"
            style={{ background: view === "store" ? C.teal : "transparent", color: view === "store" ? C.charcoal : C.inkDim }}
          >
            <Store size={14} /> Boutique
          </button>
          <button
            onClick={() => setView("admin")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition"
            style={{ background: view === "admin" ? C.teal : "transparent", color: view === "admin" ? C.charcoal : C.inkDim }}
          >
            <LayoutDashboard size={14} /> Espace gérant
          </button>
        </div>
      </header>

      {view === "store" ? (
        <StoreView
          products={filtered}
          catalog={products}
          allCount={products.length}
          query={query}
          setQuery={setQuery}
          budget={budget}
          setBudget={setBudget}
          selected={selected}
          setSelected={setSelected}
          waLink={waLink}
          tradeIn={tradeIn}
          tiModel={tiModel}
          setTiModel={setTiModel}
          tiCondition={tiCondition}
          setTiCondition={setTiCondition}
          tradeInEstimate={tradeInEstimate}
          shopName={shopName}
        />
      ) : !unlocked ? (
        <div className="flex flex-col items-center justify-center px-6" style={{ minHeight: "70vh" }}>
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Lock size={16} color={C.teal} />
              <h2 className="disp font-semibold">Espace gérant</h2>
            </div>
            <p className="text-sm mb-4" style={{ color: C.inkDim }}>
              Entrez le code d'accès pour gérer les produits et les reprises.
            </p>
            <input
              type="password"
              value={pin}
              placeholder="Code PIN (essai : 1234)"
              onChange={(e) => {
                setPin(e.target.value);
                setPinError(false);
              }}
              className="w-full px-3 py-2 rounded-lg text-sm mb-2"
              style={{ background: C.surface2, color: C.ink, border: `1px solid ${pinError ? C.coral : C.line}` }}
            />
            {pinError && (
              <p className="text-xs mb-2" style={{ color: C.coral }}>
                Code incorrect. Réessayez.
              </p>
            )}
            <button
              onClick={() => (pin === "1234" ? setUnlocked(true) : setPinError(true))}
              className="w-full py-2 rounded-lg text-sm font-semibold"
              style={{ background: C.teal, color: C.charcoal }}
            >
              Déverrouiller
            </button>
            <p className="text-[11px] mt-3" style={{ color: C.inkDim }}>
              Prototype : dans la version finale, cet accès serait sécurisé par un vrai compte (email + mot de passe).
            </p>
          </div>
        </div>
      ) : (
        <AdminView
          products={products}
          setProducts={setProducts}
          tradeIn={tradeIn}
          setTradeIn={setTradeIn}
          waNumber={waNumber}
          setWaNumber={setWaNumber}
          shopName={shopName}
          setShopName={setShopName}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
          editingTrade={editingTrade}
          setEditingTrade={setEditingTrade}
          stockValue={stockValue}
        />
      )}

      {/* PRODUCT MODAL */}
      {selected && (
        <div
          className="fixed inset-0 z-40 flex items-end sm:items-center justify-center p-0 sm:p-6"
          style={{ background: "rgba(0,0,0,0.6)" }}
          onClick={() => setSelected(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6"
            style={{ background: C.surface, border: `1px solid ${C.line}` }}
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex gap-4">
                <DeviceGlyph hue={selected.hue} />
                <div>
                  <h3 className="disp font-semibold text-lg">{selected.model}</h3>
                  <p className="text-sm" style={{ color: C.inkDim }}>
                    {selected.storage} · {selected.condition}
                  </p>
                  {selected.note && <p className="text-xs mt-1" style={{ color: C.gold }}>{selected.note}</p>}
                </div>
              </div>
              <button onClick={() => setSelected(null)}>
                <X size={20} color={C.inkDim} />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5 mb-4">
              <Badge tone="teal"><ShieldCheck size={11} /> Garantie {selected.warranty} mois</Badge>
              {selected.exchange && <Badge tone="gold"><ArrowLeftRight size={11} /> Échange possible</Badge>}
              <Badge>Vendu sur facture</Badge>
            </div>
            <p className="mono text-2xl font-semibold mb-4">{fmt(selected.price)}</p>
            <a
              href={waLink(`Bonjour, je suis intéressé(e) par le ${selected.model} ${selected.storage} (${selected.condition}) à ${fmt(selected.price)}. Est-il toujours disponible ?`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-lg font-semibold text-sm"
              style={{ background: "#25D366", color: "#0B2E1D" }}
            >
              <MessageCircle size={17} /> Commander sur WhatsApp
            </a>
          </div>
        </div>
      )}

      {/* PRODUCT EDIT MODAL (admin) */}
      {editingProduct && (
        <ProductEditor
          value={editingProduct}
          onCancel={() => setEditingProduct(null)}
          onSave={(p) => {
            setProducts((prev) => {
              if (p.id) return prev.map((x) => (x.id === p.id ? p : x));
              const nextId = Math.max(0, ...prev.map((x) => x.id)) + 1;
              return [...prev, { ...p, id: nextId }];
            });
            setEditingProduct(null);
          }}
        />
      )}

      {editingTrade && (
        <TradeEditor
          value={editingTrade}
          onCancel={() => setEditingTrade(null)}
          onSave={(t) => {
            setTradeIn((prev) => {
              if (t.id) return prev.map((x) => (x.id === t.id ? t : x));
              const nextId = Math.max(0, ...prev.map((x) => x.id)) + 1;
              return [...prev, { ...t, id: nextId }];
            });
            setEditingTrade(null);
          }}
        />
      )}
    </div>
  );
}

/* ============================= STORE VIEW ============================= */
function StoreView({ products, catalog, allCount, query, setQuery, budget, setBudget, selected, setSelected, waLink, tradeIn, tiModel, setTiModel, tiCondition, setTiCondition, tradeInEstimate, shopName }) {
  const budgets = [
    { id: "all", label: "Tous" },
    { id: "b1", label: "< 100k" },
    { id: "b2", label: "100–200k" },
    { id: "b3", label: "200–350k" },
    { id: "b4", label: "350k+" },
  ];

  return (
    <main>
      {/* HERO */}
      <section className="px-4 sm:px-8 pt-10 pb-8 sm:pt-16 sm:pb-12 max-w-5xl mx-auto">
        <p className="mono text-xs mb-3" style={{ color: C.teal }}>DAKAR · VENDU SUR FACTURE · AUTHENTIQUE</p>
        <h1 className="disp font-bold leading-tight mb-4" style={{ fontSize: "clamp(1.9rem, 5vw, 3rem)" }}>
          Le téléphone qu'il vous faut,<br />au prix affiché.
        </h1>
        <p className="text-sm sm:text-base mb-6 max-w-lg" style={{ color: C.inkDim }}>
          {allCount} modèles disponibles, garantis et échangeables. Commandez en un message WhatsApp, ou estimez la reprise de votre ancien téléphone en 30 secondes.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href="#assistant" className="px-4 py-2.5 rounded-lg text-sm font-semibold" style={{ background: C.teal, color: C.charcoal }}>
            Trouver mon téléphone
          </a>
          <a href="#catalogue" className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            Voir le catalogue
          </a>
          <a href="#reprise" className="px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-1.5" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            <ArrowLeftRight size={15} /> Estimer un échange
          </a>
        </div>
      </section>

      {/* ASSISTANT INTERACTIF */}
      <PhoneFinder catalog={catalog} setSelected={setSelected} />

      {/* CATALOGUE */}
      <section id="catalogue" className="px-4 sm:px-8 py-8 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg flex-1" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
            <Search size={15} color={C.inkDim} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un modèle (ex: 13 Pro Max)"
              className="bg-transparent text-sm w-full"
              style={{ color: C.ink }}
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto">
            {budgets.map((b) => (
              <button
                key={b.id}
                onClick={() => setBudget(b.id)}
                className="px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap"
                style={{
                  background: budget === b.id ? C.teal : C.surface,
                  color: budget === b.id ? C.charcoal : C.inkDim,
                  border: `1px solid ${budget === b.id ? C.teal : C.line}`,
                }}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>

        {products.length === 0 ? (
          <p className="text-sm py-10 text-center" style={{ color: C.inkDim }}>
            Aucun modèle ne correspond à cette recherche pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {products.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="text-left rounded-2xl p-4 relative transition hover:-translate-y-0.5"
                style={{ background: C.surface, border: `1px solid ${C.line}` }}
              >
                <PriceTag amount={p.price} />
                <div className="flex justify-center mb-3 mt-2">
                  <DeviceGlyph hue={p.hue} />
                </div>
                <p className="disp font-semibold text-sm leading-snug">{p.model}</p>
                <p className="mono text-xs mb-2" style={{ color: C.inkDim }}>{p.storage} · {p.condition}</p>
                <div className="flex flex-wrap gap-1">
                  <Badge tone="teal">{p.warranty}m garantie</Badge>
                  {p.exchange && <Badge tone="gold">échange</Badge>}
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      {/* TRADE-IN */}
      <section id="reprise" className="px-4 sm:px-8 py-10 max-w-5xl mx-auto">
        <div className="rounded-2xl p-6 sm:p-8" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
          <div className="flex items-center gap-2 mb-1">
            <ArrowLeftRight size={16} color={C.gold} />
            <h2 className="disp font-semibold text-lg">Estimer la reprise de votre téléphone</h2>
          </div>
          <p className="text-sm mb-6" style={{ color: C.inkDim }}>
            Choisissez votre modèle et son état pour obtenir une estimation immédiate. Confirmation finale en magasin ou via WhatsApp.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className="text-xs block mb-1.5" style={{ color: C.inkDim }}>Modèle et stockage</label>
              <select
                value={tiModel}
                onChange={(e) => setTiModel(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
              >
                {tradeIn.map((t) => (
                  <option key={t.id} value={t.model + "|" + t.storage}>{t.model} · {t.storage}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs block mb-1.5" style={{ color: C.inkDim }}>État de l'appareil</label>
              <select
                value={tiCondition}
                onChange={(e) => setTiCondition(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm"
                style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
              >
                {CONDITIONS.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {tradeInEstimate && (
            <div className="rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4" style={{ background: C.surface2 }}>
              <div>
                <p className="text-xs mb-1" style={{ color: C.inkDim }}>Estimation de reprise</p>
                <p className="disp font-bold text-xl sm:text-2xl mono">
                  {fmt(tradeInEstimate.low)} – {fmt(tradeInEstimate.high)}
                </p>
              </div>
              <a
                href={waLink(`Bonjour, je souhaite faire estimer la reprise de mon ${tradeInEstimate.entry.model} ${tradeInEstimate.entry.storage}, état "${tiCondition}". L'estimation en ligne indique ${fmt(tradeInEstimate.low)} à ${fmt(tradeInEstimate.high)}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-semibold text-sm whitespace-nowrap"
                style={{ background: "#25D366", color: "#0B2E1D" }}
              >
                <MessageCircle size={16} /> Confirmer via WhatsApp
              </a>
            </div>
          )}
        </div>
      </section>

      <footer className="px-4 sm:px-8 py-8 text-center text-xs" style={{ color: C.inkDim, borderTop: `1px solid ${C.line}` }}>
        {shopName} · Dakar, Sénégal · Prototype de démonstration
      </footer>
    </main>
  );
}

/* ============================= ASSISTANT INTERACTIF ============================= */
function PhoneFinder({ catalog, setSelected }) {
  const [step, setStep] = useState(0);
  const [budget, setBudget] = useState(null);
  const [priority, setPriority] = useState(null);

  const budgetOptions = [
    { id: "b1", label: "Moins de 100 000 FCFA", test: (p) => p.price < 100000 },
    { id: "b2", label: "100 000 – 200 000 FCFA", test: (p) => p.price >= 100000 && p.price < 200000 },
    { id: "b3", label: "200 000 – 350 000 FCFA", test: (p) => p.price >= 200000 && p.price < 350000 },
    { id: "b4", label: "Plus de 350 000 FCFA", test: (p) => p.price >= 350000 },
  ];

  const priorityOptions = [
    { id: "camera", label: "La photo", hint: "meilleur appareil photo", key: "camera" },
    { id: "perf", label: "La puissance", hint: "jeux et multitâche", key: "perf" },
    { id: "battery", label: "L'autonomie", hint: "tenir toute la journée" },
    { id: "value", label: "Le prix", hint: "meilleur rapport qualité/prix", key: "value" },
  ];

  const results = useMemo(() => {
    if (!budget || !priority) return [];
    const b = budgetOptions.find((x) => x.id === budget);
    const key = priorityOptions.find((x) => x.id === priority).key || (priority === "battery" ? "battery" : "value");
    return [...catalog]
      .filter((p) => b.test(p))
      .sort((a, c) => c[key] - a[key] || a.price - c.price)
      .slice(0, 3);
  }, [budget, priority, catalog]);

  const reset = () => {
    setStep(0);
    setBudget(null);
    setPriority(null);
  };

  return (
    <section id="assistant" className="px-4 sm:px-8 py-8 max-w-5xl mx-auto">
      <div
        className="rounded-2xl p-6 sm:p-8 relative overflow-hidden"
        style={{ background: C.surface, border: `1px solid ${C.line}` }}
      >
        {/* motif circuit discret, signature visuelle */}
        <svg
          className="absolute top-0 right-0 opacity-20 pointer-events-none"
          width="220" height="220" viewBox="0 0 220 220" fill="none"
        >
          <circle cx="180" cy="40" r="3" fill={C.teal} />
          <circle cx="180" cy="100" r="3" fill={C.coral} />
          <path d="M180 40 L180 100 M140 100 L180 100 M140 100 L140 160" stroke={C.line} strokeWidth="1.5" />
          <circle cx="140" cy="160" r="3" fill={C.gold} />
        </svg>

        <div className="flex items-center gap-2 mb-1">
          <Search size={16} color={C.teal} />
          <h2 className="disp font-semibold text-lg">Assistant : trouvez votre téléphone idéal</h2>
        </div>
        <p className="text-sm mb-6" style={{ color: C.inkDim }}>
          Deux questions, trois recommandations personnalisées parmi le catalogue.
        </p>

        {/* indicateur d'étapes */}
        <div className="flex items-center gap-2 mb-6">
          {[0, 1, 2].map((s) => (
            <div
              key={s}
              className="h-1.5 flex-1 rounded-full"
              style={{ background: s <= step ? C.teal : C.line }}
            />
          ))}
        </div>

        {step === 0 && (
          <div>
            <p className="text-sm font-medium mb-3">Quel est votre budget ?</p>
            <div className="grid sm:grid-cols-2 gap-2.5">
              {budgetOptions.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    setBudget(b.id);
                    setStep(1);
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium text-left transition hover:-translate-y-0.5"
                  style={{ background: C.surface2, border: `1px solid ${C.line}` }}
                >
                  {b.label} <ChevronRight size={15} color={C.inkDim} />
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div>
            <p className="text-sm font-medium mb-3">Qu'est-ce qui compte le plus pour vous ?</p>
            <div className="grid sm:grid-cols-2 gap-2.5 mb-3">
              {priorityOptions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setPriority(p.id);
                    setStep(2);
                  }}
                  className="text-left px-4 py-3 rounded-lg transition hover:-translate-y-0.5"
                  style={{ background: C.surface2, border: `1px solid ${C.line}` }}
                >
                  <p className="text-sm font-medium">{p.label}</p>
                  <p className="text-xs" style={{ color: C.inkDim }}>{p.hint}</p>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(0)} className="text-xs" style={{ color: C.inkDim }}>
              ← revenir au budget
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            {results.length === 0 ? (
              <p className="text-sm py-4" style={{ color: C.inkDim }}>
                Aucun modèle ne correspond exactement à ce budget pour l'instant.
              </p>
            ) : (
              <div className="grid sm:grid-cols-3 gap-3 mb-4">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setSelected(p)}
                    className="text-left rounded-xl p-3 transition hover:-translate-y-0.5"
                    style={{ background: C.surface2, border: `1px solid ${C.teal}55` }}
                  >
                    <div className="flex justify-center mb-2">
                      <DeviceGlyph hue={p.hue} size={2} />
                    </div>
                    <p className="disp font-semibold text-xs leading-snug">{p.model}</p>
                    <p className="mono text-xs mb-1" style={{ color: C.inkDim }}>{p.storage}</p>
                    <p className="mono text-sm font-semibold" style={{ color: C.teal }}>{fmt(p.price)}</p>
                  </button>
                ))}
              </div>
            )}
            <button onClick={reset} className="text-xs" style={{ color: C.inkDim }}>
              ← recommencer l'assistant
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================= ADMIN VIEW ============================= */
function AdminView({ products, setProducts, tradeIn, setTradeIn, waNumber, setWaNumber, shopName, setShopName, editingProduct, setEditingProduct, editingTrade, setEditingTrade, stockValue }) {
  return (
    <main className="px-4 sm:px-8 py-8 max-w-5xl mx-auto">
      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        <StatCard icon={<PackageCheck size={16} />} label="Produits en ligne" value={products.length} />
        <StatCard icon={<Wallet size={16} />} label="Valeur du stock affiché" value={fmt(stockValue)} />
        <StatCard icon={<ArrowLeftRight size={16} />} label="Modèles de reprise configurés" value={tradeIn.length} />
      </div>

      {/* PRODUCTS */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="disp font-semibold text-lg">Catalogue produits</h2>
          <button
            onClick={() => setEditingProduct({ model: "", storage: "", price: 0, condition: "Comme neuf", warranty: 3, exchange: true, hue: 200, note: "" })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: C.teal, color: C.charcoal }}
          >
            <Plus size={14} /> Ajouter un produit
          </button>
        </div>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          {products.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              style={{ background: i % 2 ? C.surface : C.surface2, borderTop: i ? `1px solid ${C.line}` : "none" }}
            >
              <div className="min-w-0">
                <p className="font-medium truncate">{p.model} · {p.storage}</p>
                <p className="mono text-xs" style={{ color: C.inkDim }}>{fmt(p.price)} · {p.condition} · garantie {p.warranty}m</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditingProduct(p)} className="p-2 rounded-lg" style={{ background: C.surface2 }}>
                  <Pencil size={14} color={C.inkDim} />
                </button>
                <button
                  onClick={() => setProducts((prev) => prev.filter((x) => x.id !== p.id))}
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(255,93,115,0.12)" }}
                >
                  <Trash2 size={14} color={C.coral} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* TRADE-IN CATALOG */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="disp font-semibold text-lg">Valeurs de reprise (échange)</h2>
          <button
            onClick={() => setEditingTrade({ model: "", storage: "", baseValue: 0 })}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold"
            style={{ background: C.teal, color: C.charcoal }}
          >
            <Plus size={14} /> Ajouter un modèle
          </button>
        </div>
        <p className="text-xs mb-3" style={{ color: C.inkDim }}>
          Valeur de base pour un appareil "Comme neuf". Les états "Bon état" (×0.85) et "État moyen" (×0.65) sont calculés automatiquement.
        </p>
        <div className="rounded-xl overflow-hidden" style={{ border: `1px solid ${C.line}` }}>
          {tradeIn.map((t, i) => (
            <div
              key={t.id}
              className="flex items-center justify-between gap-3 px-4 py-3 text-sm"
              style={{ background: i % 2 ? C.surface : C.surface2, borderTop: i ? `1px solid ${C.line}` : "none" }}
            >
              <p className="font-medium">{t.model} · {t.storage}</p>
              <div className="flex items-center gap-3 shrink-0">
                <p className="mono text-xs" style={{ color: C.inkDim }}>{fmt(t.baseValue)}</p>
                <button onClick={() => setEditingTrade(t)} className="p-2 rounded-lg" style={{ background: C.surface2 }}>
                  <Pencil size={14} color={C.inkDim} />
                </button>
                <button
                  onClick={() => setTradeIn((prev) => prev.filter((x) => x.id !== t.id))}
                  className="p-2 rounded-lg"
                  style={{ background: "rgba(255,93,115,0.12)" }}
                >
                  <Trash2 size={14} color={C.coral} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SETTINGS */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Settings size={16} color={C.inkDim} />
          <h2 className="disp font-semibold text-lg">Paramètres de la boutique</h2>
        </div>
        <div className="rounded-xl p-5 grid sm:grid-cols-2 gap-4" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
          <div>
            <label className="text-xs block mb-1.5" style={{ color: C.inkDim }}>Nom de la boutique</label>
            <input
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg text-sm"
              style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
            />
          </div>
          <div>
            <label className="text-xs block mb-1.5" style={{ color: C.inkDim }}>Numéro WhatsApp (avec indicatif, sans +)</label>
            <input
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value.replace(/[^0-9]/g, ""))}
              className="w-full px-3 py-2 rounded-lg text-sm mono"
              style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
            />
          </div>
        </div>
        <p className="text-[11px] mt-3" style={{ color: C.inkDim }}>
          Prototype : ces réglages vivent dans la session en cours. En production, ils seraient enregistrés dans une base de données (ex. Supabase) pour rester après un rafraîchissement de la page.
        </p>
      </section>
    </main>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: C.surface2, color: C.teal }}>
        {icon}
      </div>
      <div>
        <p className="text-xs" style={{ color: C.inkDim }}>{label}</p>
        <p className="disp font-semibold">{value}</p>
      </div>
    </div>
  );
}

/* ============================= EDITORS ============================= */
function FieldShell({ children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.65)" }}
    >
      <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: C.surface, border: `1px solid ${C.line}` }}>
        {children}
      </div>
    </div>
  );
}

function Label({ children }) {
  return <label className="text-xs block mb-1.5" style={{ color: C.inkDim }}>{children}</label>;
}

function Input(props) {
  return (
    <input
      {...props}
      className="w-full px-3 py-2 rounded-lg text-sm mb-3"
      style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
    />
  );
}

function ProductEditor({ value, onCancel, onSave }) {
  const [form, setForm] = useState(value);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <FieldShell>
      <div className="flex justify-between items-center mb-4">
        <h3 className="disp font-semibold">{form.id ? "Modifier le produit" : "Nouveau produit"}</h3>
        <button onClick={onCancel}><X size={18} color={C.inkDim} /></button>
      </div>
      <Label>Modèle</Label>
      <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="iPhone 13 Pro Max" />
      <Label>Stockage</Label>
      <Input value={form.storage} onChange={(e) => set("storage", e.target.value)} placeholder="128 Go" />
      <Label>Prix (FCFA)</Label>
      <Input type="number" value={form.price} onChange={(e) => set("price", Number(e.target.value))} />
      <Label>État</Label>
      <select
        value={form.condition}
        onChange={(e) => set("condition", e.target.value)}
        className="w-full px-3 py-2 rounded-lg text-sm mb-3"
        style={{ background: C.surface2, color: C.ink, border: `1px solid ${C.line}` }}
      >
        {CONDITIONS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <Label>Garantie (mois)</Label>
      <Input type="number" value={form.warranty} onChange={(e) => set("warranty", Number(e.target.value))} />
      <Label>Note (optionnel)</Label>
      <Input value={form.note || ""} onChange={(e) => set("note", e.target.value)} placeholder="eSIM, 2ème main..." />
      <label className="flex items-center gap-2 text-sm mb-4">
        <input type="checkbox" checked={form.exchange} onChange={(e) => set("exchange", e.target.checked)} />
        Échange possible
      </label>
      <button
        onClick={() => onSave(form)}
        disabled={!form.model || !form.storage || !form.price}
        className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
        style={{ background: C.teal, color: C.charcoal }}
      >
        Enregistrer
      </button>
    </FieldShell>
  );
}

function TradeEditor({ value, onCancel, onSave }) {
  const [form, setForm] = useState(value);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <FieldShell>
      <div className="flex justify-between items-center mb-4">
        <h3 className="disp font-semibold">{form.id ? "Modifier la reprise" : "Nouveau modèle de reprise"}</h3>
        <button onClick={onCancel}><X size={18} color={C.inkDim} /></button>
      </div>
      <Label>Modèle</Label>
      <Input value={form.model} onChange={(e) => set("model", e.target.value)} placeholder="iPhone 13" />
      <Label>Stockage</Label>
      <Input value={form.storage} onChange={(e) => set("storage", e.target.value)} placeholder="128 Go" />
      <Label>Valeur de base — état "Comme neuf" (FCFA)</Label>
      <Input type="number" value={form.baseValue} onChange={(e) => set("baseValue", Number(e.target.value))} />
      <button
        onClick={() => onSave(form)}
        disabled={!form.model || !form.storage || !form.baseValue}
        className="w-full py-2.5 rounded-lg text-sm font-semibold disabled:opacity-40"
        style={{ background: C.teal, color: C.charcoal }}
      >
        Enregistrer
      </button>
    </FieldShell>
  );
}
