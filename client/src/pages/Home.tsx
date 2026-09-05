import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Link } from "wouter";
import { ArrowRight, Check, ChevronDown, Headphones, Heart, Instagram, Laptop, Menu, MessageCircle, Minus, Plus, Search, ShieldCheck, ShoppingBag, Smartphone, Tablet, Trash2, Watch, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { categories, products, type CatalogProduct, formatBRL, buildWhatsAppMessage, buildAccessoryWhatsAppMessage, getAccessoryCompatibilityOptions, storeConfig, getStoreConfig, getCatalogProducts } from "@/data/catalog";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";
import { buildAssistanceMessage, deviceModelsByCategory, filterDeviceModels } from "@/data/assistance";
import { getProductImage } from "@/data/productImages";
import { getColorSwatchBackground, getColorSwatchBorder } from "@/data/colorSwatches";

const iconByCategory = { iPhone: Smartphone, Seminovos: Smartphone, AirPods: Headphones, "Apple Watch": Watch, iPad: Tablet, Mac: Laptop, Acessórios: ShoppingBag };


type CartItem = CatalogProduct & { quantity: number; selectedColor?: string; selectedStorage?: string; unitPrice: number };

function ProductVisual({ product, large = false, color }: { product: CatalogProduct; large?: boolean; color?: string }) {
  const Icon = iconByCategory[product.category as keyof typeof iconByCategory] ?? ShoppingBag;
  const [failed, setFailed] = useState(false);
  const activeColor = color || product.color || product.colors?.[0];
  const image = getProductImage(product, activeColor);
  return <div className={`product-visual ${large ? "product-visual-large" : ""} visual-${product.category.toLowerCase().replace(" ", "-")} color-${(activeColor || "default").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} data-color={activeColor || "default"}>{failed ? <div className="visual-fallback"><div className="visual-orbit" /><Icon size={large ? 82 : 48} strokeWidth={1.15} /><span>{product.category}</span></div> : <img key={image} className="product-photo product-photo-transition" src={image} alt={`${product.name}${activeColor ? ` — ${activeColor}` : ""} — foto do produto`} loading={large ? "eager" : "lazy"} onError={() => setFailed(true)} />}</div>;
}

function WhatsAppLink({ children, message, className = "" }: { children: React.ReactNode; message: string; className?: string }) {
  const publicStore = getStoreConfig();
  const url = `https://wa.me/${publicStore.whatsapp}?text=${encodeURIComponent(message)}`;
  return <a href={publicStore.whatsapp ? url : "#contato"} target={publicStore.whatsapp ? "_blank" : undefined} rel="noreferrer" className={className} onClick={() => !publicStore.whatsapp && toast.info("O WhatsApp será configurado pelo painel administrativo.")}>{children}</a>;
}

function ProductCard({ product, onAdd, onAccessoryBuy }: { product: CatalogProduct; onAdd: (p: CatalogProduct) => void; onAccessoryBuy: (p: CatalogProduct) => void }) {
  return <article className="product-card group">
    <div className="product-card-image"><Badge className={product.condition === "Seminovo" ? "badge-used" : "badge-new"}>{product.badge}</Badge><button aria-label={`Favoritar ${product.name}`} className="favorite"><Heart size={17} /></button><ProductVisual product={product} color={product.color || product.colors?.[0]} /></div>
    <div className="product-card-body"><p className="eyebrow">{product.category} {product.condition === "Seminovo" && `• ${product.battery}% bateria`}</p><h3>{product.name}</h3><div className="product-meta">{product.storage ?? product.subtitle}{product.color ? ` • ${product.color}` : ""}{(product.colors || (product.color ? [product.color] : [])).length > 0 && <span className="color-chips" aria-label={`Cores: ${(product.colors || [product.color]).filter(Boolean).join(", ")}`}>{(product.colors || [product.color]).filter(Boolean).slice(0, 5).map((color) => <i key={color} title={color} style={{ "--swatch-bg": getColorSwatchBackground(color), "--swatch-border": getColorSwatchBorder(color), backgroundImage: getColorSwatchBackground(color) } as CSSProperties} data-color={color} />)}</span>}</div><div className="product-price-label">A partir de</div><strong className="product-price">{product.price ? formatBRL(product.price) : "Sob consulta"}</strong><div className="product-card-actions"><Button className="w-full mt-4" onClick={() => onAdd(product)} disabled={product.status !== "Disponível"}>{product.status === "Disponível" ? "Ver opções" : product.status}</Button>{product.category === "Acessórios" && <button type="button" className="accessory-whatsapp-button" onClick={(event) => { event.stopPropagation(); onAccessoryBuy(product); }}><MessageCircle size={14} /> Comprar pelo WhatsApp</button>}</div></div>
  </article>;
}

export default function Home() {
  const catalogItems = useMemo(() => getCatalogProducts(), []);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeCondition, setActiveCondition] = useState("Todos");
  const [maxPrice, setMaxPrice] = useState(15000);
  const [minBattery, setMinBattery] = useState(0);
  const [activeAvailability, setActiveAvailability] = useState("Todos");
  const [customer, setCustomer] = useState({ name: "", city: "", state: "", contact: "" });
  const [assistForm, setAssistForm] = useState({ deviceType: "Celular", name: "", city: "", state: "", brand: "", model: "", service: "Troca de tela", problem: "", contact: "" });
  const [modelSearch, setModelSearch] = useState("");
  const createOrderMutation = trpc.orders.create.useMutation();
  const [cart, setCart] = useState<CartItem[]>(() => { try { return JSON.parse(localStorage.getItem("sn-cart") || "[]"); } catch { return []; } });
  useEffect(() => { localStorage.setItem("sn-cart", JSON.stringify(cart)); }, [cart]);
  const store = useMemo(() => getStoreConfig(), []);
  const filteredModels = useMemo(() => filterDeviceModels(assistForm.deviceType, assistForm.brand, modelSearch), [assistForm.deviceType, assistForm.brand, modelSearch]);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<CatalogProduct | null>(null);
  const [selectedAccessory, setSelectedAccessory] = useState<CatalogProduct | null>(null);
  const [accessoryQuantity, setAccessoryQuantity] = useState(1);
  const [accessoryCompatibility, setAccessoryCompatibility] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedStorage, setSelectedStorage] = useState("");
  const [quantity, setQuantity] = useState(1);

  const filtered = useMemo(() => catalogItems.filter((product) => {
    const matchesQuery = `${product.name} ${product.category} ${product.storage ?? ""} ${product.color ?? ""} ${product.condition}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
    const matchesCondition = activeCondition === "Todos" || product.condition === activeCondition;
    const matchesPrice = (product.price ?? 0) <= maxPrice || product.status === "Sob consulta";
    const matchesBattery = (product.battery ?? 100) >= minBattery;
    const matchesAvailability = activeAvailability === "Todos" || product.status === activeAvailability;
    return matchesQuery && matchesCategory && matchesCondition && matchesPrice && matchesBattery && matchesAvailability;
  }), [catalogItems, query, activeCategory, activeCondition, maxPrice, minBattery, activeAvailability]);

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice ?? item.price ?? 0) * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function openProduct(product: CatalogProduct) {
    setSelectedProduct(product); setSelectedColor(product.colors?.[0] ?? product.color ?? ""); setSelectedStorage(product.storages?.[0] ?? product.storage ?? ""); setQuantity(1);
  }
  function addToCart(product: CatalogProduct) {
    const unitPrice = product.priceByColor?.[selectedColor || product.color || ""] ?? product.price ?? 0;
    if (!unitPrice) { const message = buildWhatsAppMessage([{ product, quantity: 1 }]); window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`, "_blank"); return; }
    const key = `${product.id}-${selectedColor}-${selectedStorage}`;
    setCart((current) => { const existing = current.find((item) => item.id === key); return existing ? current.map((item) => item.id === key ? { ...item, quantity: item.quantity + quantity } : item) : [...current, { ...product, id: key, quantity, selectedColor, selectedStorage, unitPrice }]; });
    setSelectedProduct(null); setCartOpen(true); toast.success("Produto adicionado ao carrinho");
  }
  function removeItem(id: string) { setCart((items) => items.filter((item) => item.id !== id)); }
  function adjust(id: string, delta: number) { setCart((items) => items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item)); }
  function openAccessoryPurchase(product: CatalogProduct) {
    const options = getAccessoryCompatibilityOptions(product);
    setAccessoryQuantity(1);
    setAccessoryCompatibility(options[0] || "Outro dispositivo");
    setSelectedAccessory(product);
  }
  function confirmAccessoryPurchase() {
    if (!selectedAccessory) return;
    const publicStore = getStoreConfig();
    if (!publicStore.whatsapp) { toast.info("Configure o telefone da loja no painel administrativo antes de solicitar."); return; }
    const message = buildAccessoryWhatsAppMessage(selectedAccessory, { quantity: accessoryQuantity, compatibility: accessoryCompatibility });
    window.open(`https://wa.me/${publicStore.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
    setSelectedAccessory(null);
  }
  function requestAssistance() {
    const publicStore = getStoreConfig();
    const message = buildAssistanceMessage({ storeName: publicStore.name, ...assistForm }); if (!publicStore.whatsapp) { toast.info("Configure o telefone da loja no painel administrativo antes de solicitar."); return; } window.open(`https://wa.me/${publicStore.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  }
  function checkout() {
    if (!cart.length) return;
    const message = buildWhatsAppMessage(cart.map((item) => ({ product: item, quantity: item.quantity, selectedColor: item.selectedColor, selectedStorage: item.selectedStorage, unitPrice: item.unitPrice })), customer);
    createOrderMutation.mutate({ customerName: customer.name || undefined, city: customer.city || undefined, state: customer.state || undefined, subtotal: String(subtotal), items: cart.map((item) => ({ productName: item.name, variantLabel: [item.selectedStorage || item.storage, item.selectedColor || item.color].filter(Boolean).join(" • "), quantity: item.quantity, unitPrice: String(item.unitPrice) })) });
    if (!store.whatsapp) { toast.info("Configure o telefone da loja no painel administrativo antes de finalizar."); return; }
    window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  }

  return <div className="store-shell"><div className="site-background-overlay" aria-hidden="true" />
    <header className={scrolled ? "scrolled" : ""}>
      <button className="menu-btn" onClick={() => setMobileMenu(true)} aria-label="Menu">
        <Menu size={24} />
      </button>
      <div className="brand">
        <span className="brand-logo" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>SN Store Global <span style={{ color: "rgba(255,255,255,0.5)" }}>—</span></span>
      </div>
      <nav className="desktop-nav">{categories.slice(0, 7).map((category) => <a key={category} href="#catalogo" onClick={() => setActiveCategory(category)}>{category}</a>)}<a href="#assistencia">Assistência móvel</a></nav><div className="header-actions"><button className="header-search" onClick={() => document.getElementById("catalog-search")?.focus()} aria-label="Buscar"><Search size={18} /></button><WhatsAppLink message={store.defaultWhatsappMessage} className="header-whatsapp"><MessageCircle size={18} /><span>WhatsApp</span></WhatsAppLink><button className="cart-trigger" onClick={() => setCartOpen(true)} aria-label="Abrir carrinho"><ShoppingBag size={19} />{cartCount > 0 && <span>{cartCount}</span>}</button></div></header>

    <main>
      <section className="hero-banner-section">
        <h1 className="sr-only">Tecnologia que acompanha o seu próximo nível — SN Store Global</h1>
        <div className="hero-banner-wrap">
          <div className="hero-banner-ambient-glow" aria-hidden="true" />
          <div className="hero-banner-stage">
            <img 
              src="/hero_banner_apple_hd.jpg" 
              alt="Tecnologia que acompanha o seu próximo nível - Apple, smartphones e acessórios na SN Store Global" 
              className="hero-banner-img"
              loading="eager"
            />
          </div>
          <div className="hero-banner-bar">
            <div className="hero-banner-actions">
              <Button 
                size="lg" 
                className="hero-banner-btn-primary" 
                onClick={() => { setActiveCategory("iPhone"); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}
              >
                Ver iPhones <ArrowRight size={17} />
              </Button>
              <a href="#catalogo" className="hero-banner-btn-secondary">
                Explorar catálogo <ArrowRight size={16} />
              </a>
            </div>
            <div className="hero-banner-badges">
              <span>✦ Pronta entrega</span>
              <span>✦ Garantia oficial</span>
              <span>✦ Atendimento WhatsApp</span>
            </div>
          </div>
        </div>
      </section><section className="hero-benefit-panel"><div><ShieldCheck size={28} /><strong>100%</strong><span>Produtos originais<br />e lacrados</span></div><div><Check size={28} /><strong>1 ANO</strong><span>Garantia Apple<br />e fabricante</span></div><div><ShoppingBag size={28} /><strong>ENVIO</strong><span>Para todo<br />o Brasil</span></div><div><MessageCircle size={28} /><strong>COMPRA</strong><span>Segura e dados<br />protegidos</span></div></section><section className="character-section" id="personagem">
      <div className="character-portrait">
        <img src="https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&q=80&w=800" alt="Responsável pela SN Store Global atendendo em uma loja de tecnologia" loading="lazy" />
      </div>
      <div className="character-copy"><p className="eyebrow accent">POR TRÁS DA SN STORE GLOBAL</p><h2>Atendimento próximo, do nosso jeito.</h2><p>Na SN Store Global, cada escolha passa por curadoria, confiança e atendimento humano. Fale diretamente com nossa equipe para encontrar o aparelho ideal ou solicitar assistência técnica móvel.</p><div className="character-highlights"><span><Check size={15} /> Curadoria de produtos</span><span><Check size={15} /> Atendimento personalizado</span><span><Check size={15} /> Compra simples pelo WhatsApp</span></div><div className="character-actions"><WhatsAppLink message={store.defaultWhatsappMessage} className="text-link">Falar com a equipe <ArrowRight size={16} /></WhatsAppLink><a className="instagram-link" href={store.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> @snstoreglobal</a></div></div></section><section className="assistance-section" id="assistencia"><div className="assistance-copy"><div className="assistance-kicker"><span className="assistance-pulse" /> <strong>SN CARE</strong><span>ATENDIMENTO MÓVEL</span><small>AGENDAMENTO PELO WHATSAPP</small></div><p className="eyebrow accent">ASSISTÊNCIA PARA AS PRINCIPAIS MARCAS</p><h2>Seu aparelho, cuidado onde você estiver.</h2><p>Solicite atendimento técnico móvel para troca de tela, bateria, conector de carga, câmera, diagnóstico e outros reparos. Escolha a marca e o modelo do aparelho no formulário ao lado.</p><div className="assistance-brands">{Object.keys(deviceModelsByCategory[assistForm.deviceType] || {}).map((brand) => <span key={brand}>{brand}</span>)}</div><div className="service-pills"><span>Troca de tela</span><span>Troca de bateria</span><span>Conector de carga</span><span>Diagnóstico</span></div></div><div className="assistance-form"><div className="form-heading"><h3>Solicite seu atendimento</h3><span>Escolha marca + modelo • Retorno pelo WhatsApp</span></div><div className="form-grid"><select className="device-type-select" aria-label="Tipo de aparelho" value={assistForm.deviceType} onChange={(e) => { setAssistForm({ ...assistForm, deviceType: e.target.value, brand: "", model: "" }); setModelSearch(""); }}><option>Celular</option><option>Tablet</option><option>Smartwatch</option></select><input aria-label="Nome" placeholder="Seu nome" value={assistForm.name} onChange={(e) => setAssistForm({ ...assistForm, name: e.target.value })} /><select aria-label="Marca do aparelho" value={assistForm.brand} onChange={(e) => { setAssistForm({ ...assistForm, brand: e.target.value, model: "" }); setModelSearch(""); }}><option value="">Marca do aparelho</option>{Object.keys(deviceModelsByCategory[assistForm.deviceType] || {}).map((brand) => <option key={brand}>{brand}</option>)}</select><div className="model-picker"><div className="model-search"><Search size={15} /><input aria-label="Buscar modelo do aparelho" placeholder={assistForm.brand ? "Buscar modelo..." : "Selecione a marca primeiro"} value={modelSearch} onChange={(e) => setModelSearch(e.target.value)} disabled={!assistForm.brand} /><button type="button" aria-label="Limpar busca de modelo" onClick={() => setModelSearch("")} disabled={!modelSearch}><X size={14} /></button></div><select aria-label="Modelo do aparelho" value={assistForm.model} onChange={(e) => { setAssistForm({ ...assistForm, model: e.target.value }); setModelSearch(""); }} disabled={!assistForm.brand}><option value="">{assistForm.brand ? (filteredModels.length ? "Selecione o modelo" : "Nenhum modelo encontrado") : "Selecione a marca primeiro"}</option>{filteredModels.map((model) => <option key={model}>{model}</option>)}</select></div><input aria-label="Cidade" placeholder="Cidade" value={assistForm.city} onChange={(e) => setAssistForm({ ...assistForm, city: e.target.value })} /><input aria-label="Estado" placeholder="UF" value={assistForm.state} onChange={(e) => setAssistForm({ ...assistForm, state: e.target.value })} /><select aria-label="Serviço" value={assistForm.service} onChange={(e) => setAssistForm({ ...assistForm, service: e.target.value })}><option>Troca de tela</option><option>Troca de bateria</option><option>Conector de carga</option><option>Câmera</option><option>Diagnóstico</option><option>Outro reparo</option></select><input aria-label="Contato preferido" placeholder="Contato preferido" value={assistForm.contact} onChange={(e) => setAssistForm({ ...assistForm, contact: e.target.value })} /></div><textarea aria-label="Descrição do problema" placeholder="Conte brevemente o que aconteceu" value={assistForm.problem} onChange={(e) => setAssistForm({ ...assistForm, problem: e.target.value })} /><Button onClick={requestAssistance}><MessageCircle size={17} /> Solicitar pelo WhatsApp</Button></div></section><section className="benefits"><div><ShieldCheck size={22} /><span><b>Produtos Originais</b><small>Seleção de dispositivos e acessórios.</small></span></div><div><MessageCircle size={22} /><span><b>Atendimento Rápido</b><small>Fale diretamente com nossa equipe.</small></span></div><div><ShoppingBag size={22} /><span><b>Compra Segura</b><small>Confirme disponibilidade antes da compra.</small></span></div><div><Check size={22} /><span><b>Garantia</b><small>Condições exibidas em cada produto.</small></span></div></section>
      <section className="stock-notice"><span className="status-dot" /><div><b>Estoque dinâmico</b><span>A disponibilidade pode mudar rapidamente. Consulte nossa equipe antes de concluir sua compra.</span></div><WhatsAppLink message={store.defaultWhatsappMessage} className="notice-link">Falar com a equipe <ArrowRight size={15} /></WhatsAppLink></section>

      <section className="section-block categories-section"><div className="section-heading"><div><p className="eyebrow accent">EXPLORE A COLEÇÃO</p><h2>Encontre o que procura.</h2></div><p>Uma seleção precisa para acompanhar<br />a sua rotina, trabalho e criação.</p></div><div className="category-grid">{categories.map((category) => { const Icon = iconByCategory[category as keyof typeof iconByCategory] ?? ShoppingBag; return <button key={category} className="category-card" onClick={() => { setActiveCategory(category); document.getElementById("catalogo")?.scrollIntoView({ behavior: "smooth" }); }}><Icon size={28} strokeWidth={1.2} /><span>{category}</span><ArrowRight size={16} /></button>; })}</div></section>

      <section className="section-block catalog-section" id="catalogo"><div className="catalog-top"><div><p className="eyebrow accent">CURADORIA SN</p><h2>Produtos em destaque.</h2></div><div className="catalog-search"><Search size={18} /><Input id="catalog-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Busque por modelo, cor ou armazenamento" /></div></div><div className="filter-row"><div className="filter-tabs">{["Todos", ...categories].map((category) => <button className={activeCategory === category ? "active" : ""} key={category} onClick={() => setActiveCategory(category)}>{category}</button>)}</div><div className="condition-select"><select value={activeCondition} onChange={(e) => setActiveCondition(e.target.value)} aria-label="Filtrar condição"><option>Todos</option><option>Novo</option><option>Seminovo</option></select><ChevronDown size={15} /></div><div className="condition-select"><select value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Filtrar faixa de preço"><option value="15000">Qualquer preço</option><option value="3000">Até R$ 3.000</option><option value="5000">Até R$ 5.000</option><option value="8000">Até R$ 8.000</option></select><ChevronDown size={15} /></div><div className="condition-select"><select value={minBattery} onChange={(e) => setMinBattery(Number(e.target.value))} aria-label="Filtrar saúde da bateria"><option value="0">Qualquer bateria</option><option value="90">Bateria acima de 90%</option><option value="95">Bateria acima de 95%</option></select><ChevronDown size={15} /></div><div className="condition-select"><select value={activeAvailability} onChange={(e) => setActiveAvailability(e.target.value)} aria-label="Filtrar disponibilidade"><option>Todos</option><option>Disponível</option><option>Reservado</option><option>Vendido</option><option>Sob consulta</option></select><ChevronDown size={15} /></div></div><div className="catalog-grid">{filtered.map((product) => <div key={product.id} onClick={() => openProduct(product)}><ProductCard product={product} onAdd={openProduct} onAccessoryBuy={openAccessoryPurchase} /></div>)}</div>{!filtered.length && <div className="empty-state"><Search size={28} /><h3>Nenhum produto encontrado</h3><p>Tente outro modelo, cor ou categoria.</p></div>}</section>

      <section className="feature-band"><div><p className="eyebrow accent">SEMINOVOS SELECIONADOS</p><h2>Transparência em<br /><span>cada detalhe.</span></h2><p>Aparelhos avaliados individualmente, com informações claras sobre armazenamento, bateria e garantia.</p><a href="#catalogo" className="text-link">Ver seminovos <ArrowRight size={16} /></a></div><div className="feature-stats"><div><strong>100%</strong><span>saúde de bateria<br />em unidades selecionadas</span></div><div><strong>90 dias</strong><span>garantia padrão<br />da loja</span></div></div></section>
      <section className="section-block trust-section"><div className="section-heading"><div><p className="eyebrow accent">COMO FUNCIONA</p><h2>Comprar tecnologia<br />deveria ser simples.</h2></div><p>Você escolhe. Nós cuidamos<br />do resto pelo WhatsApp.</p></div><div className="steps"><div><span>01</span><h3>Escolha</h3><p>Encontre o dispositivo ideal para o seu momento.</p></div><div><span>02</span><h3>Monte seu pedido</h3><p>Adicione produtos e variantes ao carrinho.</p></div><div><span>03</span><h3>Finalize pelo WhatsApp</h3><p>Nossa equipe confirma estoque, pagamento e entrega.</p></div></div></section>
      <section className="faq-section"><div className="section-heading"><div><p className="eyebrow accent">DÚVIDAS FREQUENTES</p><h2>Antes de decidir.</h2></div></div><Accordion type="single" collapsible className="faq-list">{[
        { q: "Os produtos são originais?", a: "Sim! Todos os nossos produtos são 100% originais. Aparelhos novos são lacrados de fábrica com garantia oficial Apple de 1 ano. Seminovos passam por rigorosa inspeção técnica e conferência de procedência." },
        { q: "Qual a garantia dos aparelhos novos?", a: "Todos os produtos novos contam com 1 ano de garantia mundial oficial da Apple a partir da ativação do dispositivo, válida em qualquer autorizada ou Apple Store." },
        { q: "Qual a garantia dos seminovos?", a: "Os seminovos possuem garantia padrão de 90 dias da loja, com suporte dedicado para qualquer necessidade técnica." },
        { q: "Os seminovos possuem caixa?", a: "Os seminovos são entregues rigorosamente testados, higienizados e em perfeito estado de funcionamento, conforme os detalhes descritos na vitrine." },
        { q: "Posso comprar pelo site?", a: "Você escolhe o modelo, capacidade e cor na vitrine e adiciona ao carrinho. A finalização e confirmação de estoque é feita com nosso atendimento exclusivo pelo WhatsApp." },
        { q: "Como funciona o pagamento?", a: "Aceitamos Pix ou dinheiro com condições diferenciadas, e parcelamento em até 18x no cartão de crédito. Nossa equipe simula as condições na hora pelo WhatsApp." }
      ].map((faq, i) => <AccordionItem value={`item-${i}`} key={faq.q}><AccordionTrigger>{faq.q}</AccordionTrigger><AccordionContent>{faq.a}</AccordionContent></AccordionItem>)}</Accordion></section>
    </main>
    <footer className="site-footer"><div className="footer-top"><div><Link href="/" className="brand"><span className="brand-logo" style={{ fontSize: "20px", fontWeight: 700 }}>SN Store Global</span></Link><p>Tecnologia, confiança e atendimento personalizado em um só lugar.</p></div><div className="footer-links"><a href="#catalogo">Produtos</a><a href="#catalogo">iPhones</a><a href="#catalogo">Seminovos</a><a href="#assistencia">Assistência móvel</a><a href="#faq">FAQ</a><Link href="/admin">Administração</Link></div><div className="footer-contact"><p>Fale com a nossa equipe</p><WhatsAppLink message={store.defaultWhatsappMessage} className="text-link">Abrir WhatsApp <ArrowRight size={16} /></WhatsAppLink><a className="instagram-link" href={store.instagram} target="_blank" rel="noreferrer"><Instagram size={16} /> @snstoreglobal</a></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} SN Store Global. Todos os direitos reservados.</span><span>Política de Privacidade&nbsp;&nbsp; Termos de Uso</span></div></footer>

    <button className="floating-whatsapp" aria-label="Falar pelo WhatsApp" title="Falar pelo WhatsApp" onClick={() => { if (store.whatsapp) window.open(`https://wa.me/${store.whatsapp}?text=${encodeURIComponent(store.defaultWhatsappMessage)}`, "_blank"); else toast.info("Configure o WhatsApp no painel administrativo."); }}><MessageCircle size={21} /><span>WhatsApp</span></button>

    <Sheet open={mobileMenu} onOpenChange={setMobileMenu}>
      <SheetContent side="left" className="mobile-sheet">
        <SheetHeader>
          <SheetTitle>
            <span className="brand-logo" style={{ fontSize: "20px", fontWeight: 700, letterSpacing: "-0.5px" }}>SN Store Global</span>
          </SheetTitle>
        </SheetHeader>
        <nav>{categories.map((category) => <a key={category} href="#catalogo" onClick={() => { setActiveCategory(category); setMobileMenu(false); }}>{category}</a>)}<a href="#assistencia" onClick={() => setMobileMenu(false)}>Assistência móvel</a><Link href="/admin" onClick={() => setMobileMenu(false)}>Área administrativa</Link></nav></SheetContent></Sheet>
    <Sheet open={cartOpen} onOpenChange={setCartOpen}><SheetContent className="cart-sheet"><SheetHeader><SheetTitle>Meu carrinho <span>{cartCount} {cartCount === 1 ? "item" : "itens"}</span></SheetTitle></SheetHeader>{cart.length ? <><div className="cart-items">{cart.map((item) => <div className="cart-item" key={item.id}><ProductVisual product={item} color={item.selectedColor} /><div className="cart-item-info"><b>{item.name}</b><small>{item.selectedStorage || item.storage} {item.selectedColor || item.color ? `• ${item.selectedColor || item.color}` : ""}</small><strong>{formatBRL(item.unitPrice)}</strong><div className="quantity"><button onClick={() => adjust(item.id, -1)}><Minus size={13} /></button><span>{item.quantity}</span><button onClick={() => adjust(item.id, 1)}><Plus size={13} /></button><button className="remove" onClick={() => removeItem(item.id)}><Trash2 size={14} /></button></div></div></div>)}</div><div className="cart-summary"><div className="customer-fields"><p>Se quiser, deixe seus dados para agilizar o atendimento.</p><input aria-label="Nome" placeholder="Nome (opcional)" value={customer.name} onChange={(e) => setCustomer({ ...customer, name: e.target.value })} /><div><input aria-label="Cidade" placeholder="Cidade" value={customer.city} onChange={(e) => setCustomer({ ...customer, city: e.target.value })} /><input aria-label="Estado" placeholder="UF" value={customer.state} onChange={(e) => setCustomer({ ...customer, state: e.target.value })} /></div><input aria-label="Contato preferido" placeholder="Contato preferido" value={customer.contact} onChange={(e) => setCustomer({ ...customer, contact: e.target.value })} /></div><span>Subtotal <strong>{formatBRL(subtotal)}</strong></span><small>Frete e condições de pagamento serão confirmados pelo atendimento.</small><Button className="w-full" size="lg" onClick={checkout}><MessageCircle size={18} /> Finalizar pelo WhatsApp</Button><button className="continue" onClick={() => setCartOpen(false)}>Continuar comprando</button></div></> : <div className="cart-empty"><ShoppingBag size={32} /><h3>Seu carrinho está vazio.</h3><p>Adicione produtos para montar seu pedido.</p></div>}</SheetContent></Sheet>

    {selectedProduct && <div className="product-modal-backdrop" onClick={() => setSelectedProduct(null)}><div className="product-modal" onClick={(e) => e.stopPropagation()}><button className="modal-close" onClick={() => setSelectedProduct(null)}><X size={18} /></button><div className="modal-visual"><ProductVisual product={selectedProduct} large color={selectedColor} /></div><div className="modal-details"><p className="eyebrow accent">{selectedProduct.badge} • {selectedProduct.category}</p><h2>{selectedProduct.name}</h2><p className="modal-subtitle">{selectedProduct.subtitle}</p>{selectedProduct.battery && <div className="battery"><span>Saúde da bateria · {selectedProduct.battery >= 95 ? "Excelente" : selectedProduct.battery >= 90 ? "Muito boa" : selectedProduct.battery >= 85 ? "Boa" : "Conforme cadastro"}</span><strong>{selectedProduct.battery}%</strong><div><i style={{ width: `${selectedProduct.battery}%` }} /></div></div>}<div className="modal-price">{(selectedProduct.priceByColor?.[selectedColor] ?? selectedProduct.price) ? formatBRL(selectedProduct.priceByColor?.[selectedColor] ?? selectedProduct.price ?? 0) : "Sob consulta"}</div><div className="product-facts"><span>SKU <b>{selectedProduct.sku || "A consultar"}</b></span><span>Disponibilidade <b>{selectedProduct.status}</b></span><span>Garantia <b>{selectedProduct.warranty || "Conforme cadastro"}</b></span>{selectedProduct.sim && <span>SIM <b>{selectedProduct.sim}</b></span>}{selectedProduct.cycles && <span>Ciclos <b>{selectedProduct.cycles}</b></span>}</div>{selectedProduct.storages && <div className="variant-group"><label>Armazenamento</label><div>{selectedProduct.storages.map((storage) => <button className={selectedStorage === storage ? "selected" : ""} key={storage} onClick={() => setSelectedStorage(storage)}>{storage}</button>)}</div></div>}{selectedProduct.colors && <div className="variant-group"><label>Cor <span>{selectedColor}</span></label><div className="color-options">{selectedProduct.colors.map((color) => <button aria-label={color} className={`color-dot color-${color.toLowerCase()} ${selectedColor === color ? "selected" : ""}`} key={color} onClick={() => setSelectedColor(color)} />)}</div></div>}<div className="modal-actions"><div className="quantity"><button onClick={() => setQuantity(Math.max(1, quantity - 1))}><Minus size={14} /></button><span>{quantity}</span><button onClick={() => setQuantity(quantity + 1)}><Plus size={14} /></button></div><Button onClick={() => addToCart(selectedProduct)} className="flex-1">Adicionar ao carrinho</Button></div><WhatsAppLink message={buildWhatsAppMessage([{ product: selectedProduct, quantity, selectedColor, selectedStorage, unitPrice: selectedProduct.priceByColor?.[selectedColor] ?? selectedProduct.price }])} className="direct-whatsapp"><MessageCircle size={17} /> Comprar pelo WhatsApp</WhatsAppLink><small className="availability-note">Consulte disponibilidade antes da concluir a compra.</small></div></div></div>}

    <Dialog open={Boolean(selectedAccessory)} onOpenChange={(open: boolean) => !open && setSelectedAccessory(null)}>
      <DialogContent className="accessory-quick-buy-dialog">
        {selectedAccessory && <>
          <DialogHeader>
            <DialogTitle>Comprar {selectedAccessory.name}</DialogTitle>
            <DialogDescription>Confirme a compatibilidade e a quantidade antes de falar com a equipe pelo WhatsApp.</DialogDescription>
          </DialogHeader>
          <div className="accessory-quick-buy-summary"><span>Preço unitário<strong>{selectedAccessory.price ? formatBRL(selectedAccessory.price) : "Sob consulta"}</strong></span><span className="accessory-total"><span>Total estimado</span><strong>{selectedAccessory.price ? formatBRL(selectedAccessory.price * accessoryQuantity) : "Sob consulta"}</strong></span></div>
          {!selectedAccessory.price && <small className="accessory-price-note">Valor final será confirmado pelo atendimento no WhatsApp.</small>}
          <div className="accessory-quick-buy-fields">
            <label>Compatibilidade<select aria-label="Compatibilidade do acessório" value={accessoryCompatibility} onChange={(event) => setAccessoryCompatibility(event.target.value)}>{getAccessoryCompatibilityOptions(selectedAccessory).map((option) => <option key={option}>{option}</option>)}</select></label>
            <div className="accessory-quantity-field"><span>Quantidade</span><div className="accessory-quantity-control"><button type="button" aria-label="Diminuir quantidade" onClick={() => setAccessoryQuantity((current) => Math.max(1, current - 1))}><Minus size={15} /></button><strong>{accessoryQuantity}</strong><button type="button" aria-label="Aumentar quantidade" onClick={() => setAccessoryQuantity((current) => Math.min(99, current + 1))}><Plus size={15} /></button></div></div>
          </div>
          <DialogFooter><Button className="accessory-quick-buy-submit" onClick={confirmAccessoryPurchase}><MessageCircle size={17} /> Continuar pelo WhatsApp</Button></DialogFooter>
        </>}
      </DialogContent>
    </Dialog>
  </div>;
}
