export type CatalogProduct = {
  id: string; name: string; category: string; condition: "Novo" | "Seminovo" | "Acessório"; badge: string; subtitle: string; price?: number; priceByColor?: Record<string, number>; storage?: string; storages?: string[]; colors?: string[]; color?: string; battery?: number; cycles?: number; warranty?: string; sku?: string; stock?: number; status: "Disponível" | "Reservado" | "Vendido" | "Sob consulta"; sim?: string; featured?: boolean;
};

export const storeConfig = {
  name: "SN Store Global", whatsapp: "5541995156702", instagram: "https://www.instagram.com/snstoreglobal/", defaultWhatsappMessage: "Olá! Vim pelo site da SN Store Global e gostaria de falar com um atendente.",
};
export const categories = ["iPhone", "Seminovos", "AirPods", "Apple Watch", "iPad", "Mac", "Acessórios"];
export function getStoreConfig() {
  if (typeof window === "undefined") return storeConfig;
  try {
    const saved = JSON.parse(window.localStorage.getItem("sn-store-settings") || "{}") as Partial<typeof storeConfig>;
    const instagram = saved.instagram?.trim();
    return { ...storeConfig, ...saved, whatsapp: saved.whatsapp?.replace(/\D/g, "") || storeConfig.whatsapp, instagram: instagram ? (instagram.startsWith("http") ? instagram : `https://www.instagram.com/${instagram.replace(/^@/, "")}/`) : storeConfig.instagram };
  } catch { return storeConfig; }
}
const newPhone = (id: string, name: string, storage: string, colors: string[], price: number, badge = "NOVO"): CatalogProduct => ({ id, name, category: "iPhone", condition: "Novo", badge, subtitle: `${storage} • E-SIM`, storage, storages: [storage], colors, price, priceByColor: Object.fromEntries(colors.map((color) => [color, price])), sku: `SN-${id.toUpperCase()}`, stock: 1, status: "Disponível", sim: "E-SIM", featured: true });
const used = (id: string, name: string, storage: string, color: string, battery: number, price: number, cycles?: number): CatalogProduct => ({ id, name, category: "Seminovos", condition: "Seminovo", badge: "SEMINOVO", subtitle: `${storage} • ${color}`, storage, color, battery, cycles, price, sku: `SN-${id.toUpperCase()}`, stock: 1, status: "Disponível", warranty: "90 dias de garantia da loja" });
const accessory = (id: string, name: string, subtitle: string): CatalogProduct => ({ id, name, category: "Acessórios", condition: "Acessório", badge: "ACESSÓRIO", subtitle, sku: `SN-${id.toUpperCase()}`, status: "Sob consulta" });
const accessories: CatalogProduct[] = [
  accessory("cabo-usb-c-usb-c", "Cabo USB-C para USB-C", "Carregamento rápido • 1m"),
  accessory("cabo-usb-c-lightning", "Cabo USB-C para Lightning", "iPhone • carregamento e dados"),
  accessory("cabo-usb-a-usb-c", "Cabo USB-A para USB-C", "Carregamento • 1m"),
  accessory("cabo-lightning", "Cabo Lightning", "iPhone e acessórios Apple"),
  accessory("cabo-micro-usb", "Cabo Micro USB", "Celulares e acessórios compatíveis"),
  accessory("carregador-usb-c-20w", "Carregador USB-C 20W", "Carga rápida • tomada padrão"),
  accessory("carregador-usb-c-35w", "Carregador USB-C 35W", "Duas portas • carga rápida"),
  accessory("carregador-veicular", "Carregador veicular USB-C", "Carga rápida para carro"),
  accessory("carregador-wireless", "Carregador sem fio", "Base Qi • carregamento por indução"),
  accessory("power-bank-10000", "Power Bank 10.000mAh", "Bateria portátil • USB-C"),
  accessory("power-bank-20000", "Power Bank 20.000mAh", "Bateria portátil • alta capacidade"),
  accessory("capinha-transparente", "Capinha transparente", "Proteção diária • vários modelos"),
  accessory("capinha-anti-impacto", "Capinha anti-impacto", "Bordas reforçadas • vários modelos"),
  accessory("capinha-magsafe", "Capinha compatível com MagSafe", "Ímã integrado • vários modelos"),
  accessory("capinha-carteira", "Capinha carteira", "Proteção e porta-cartões"),
  accessory("capinha-silicone", "Capinha de silicone", "Acabamento macio • várias cores"),
  accessory("pelicula-vidro-3d", "Película de vidro 3D", "Proteção de tela • aplicação"),
  accessory("pelicula-privacidade", "Película de privacidade", "Visibilidade lateral reduzida"),
  accessory("pelicula-hidrogel", "Película de hidrogel", "Proteção flexível • aplicação"),
  accessory("pelicula-camera", "Película para câmera", "Proteção das lentes"),
  accessory("fones-bluetooth", "Fone Bluetooth", "Áudio sem fio • estojo de carga"),
  accessory("fone-p2", "Fone com fio P2", "Microfone integrado"),
  accessory("fone-usb-c", "Fone com fio USB-C", "Compatível com USB-C"),
  accessory("adaptador-usb-c-p2", "Adaptador USB-C para P2", "Áudio para celulares compatíveis"),
  accessory("adaptador-usb-c-usb-a", "Adaptador USB-C para USB-A", "Conexão de periféricos"),
  accessory("hub-usb-c", "Hub USB-C", "Portas USB, HDMI e leitor de cartão"),
  accessory("suporte-veicular", "Suporte veicular para celular", "Fixação para painel ou ventilação"),
  accessory("suporte-mesa", "Suporte de mesa", "Vídeos, chamadas e carregamento"),
  accessory("suporte-bike", "Suporte para bicicleta ou moto", "Fixação com proteção"),
  accessory("anel-pop", "Suporte anel para celular", "Pegada e apoio"),
  accessory("selfie-stick", "Bastão de selfie", "Controle remoto Bluetooth"),
  accessory("teclado-bluetooth", "Teclado Bluetooth", "Para tablets e celulares"),
  accessory("mouse-bluetooth", "Mouse Bluetooth", "Para tablets e notebooks"),
  accessory("caneta-ipad", "Caneta para iPad", "Escrita e desenho"),
  accessory("capa-ipad", "Capa para iPad", "Proteção e suporte"),
  accessory("pelicula-ipad", "Película para iPad", "Proteção de tela • aplicação"),
  accessory("capa-macbook", "Capa para MacBook", "Proteção externa"),
  accessory("case-airpods", "Case para AirPods", "Proteção para estojo de carga"),
  accessory("pulseira-apple-watch", "Pulseira para Apple Watch", "Diversos tamanhos e estilos"),
  accessory("pulseira-smartwatch", "Pulseira para smartwatch", "Compatibilidade por tamanho"),
  accessory("limpeza-eletronicos", "Kit de limpeza para eletrônicos", "Higienização de telas e acessórios"),
  accessory("organizador-cabos", "Organizador de cabos", "Mesa, bolsa e viagem"),
  accessory("cartao-memoria", "Cartão de memória", "Armazenamento para dispositivos compatíveis"),
];

export const products: CatalogProduct[] = [
  newPhone("17pm-1tb", "iPhone 17 Pro Max", "1TB", ["Prata", "Laranja"], 10199),
  newPhone("17pm-512", "iPhone 17 Pro Max", "512GB", ["Prata", "Azul", "Laranja"], 8999),
  newPhone("17pm-256", "iPhone 17 Pro Max", "256GB", ["Prata", "Azul", "Laranja"], 7699),
  newPhone("17pro-512", "iPhone 17 Pro", "512GB", ["Prata"], 8499),
  newPhone("17pro-256", "iPhone 17 Pro", "256GB", ["Prata", "Azul", "Laranja"], 7149),
  newPhone("17-256", "iPhone 17", "256GB", ["Azul", "Branco", "Lavanda", "Preto", "Verde"], 5699),
  { ...newPhone("16-512", "iPhone 16", "512GB", ["Preto"], 5599), subtitle: "512GB • C.F + E-SIM", sim: "C.F + E-SIM" },
  { ...newPhone("16-256", "iPhone 16", "256GB", ["Preto"], 5299), subtitle: "256GB • C.F + E-SIM", sim: "C.F + E-SIM" },
  { ...newPhone("16-cpo", "iPhone 16 CPO", "128GB", ["Branco", "Preto"], 4799, "CPO"), subtitle: "128GB • C.F + E-SIM", sim: "C.F + E-SIM" },
  { ...newPhone("15-128-a", "iPhone 15", "128GB", ["Preto"], 4399), subtitle: "128GB • C.F + E-SIM", sim: "C.F + E-SIM" },
  { ...newPhone("15-128-b", "iPhone 15", "128GB", ["Preto"], 4349), subtitle: "128GB • C.F + E-SIM", sim: "C.F + E-SIM" },
  { id: "airpods-pro-3", name: "AirPods Pro 3", category: "AirPods", condition: "Novo", badge: "NOVO", subtitle: "Cancelamento de ruído", price: 2249, status: "Disponível", featured: true },
  { id: "airpods-4-anc", name: "AirPods 4 ANC", category: "AirPods", condition: "Novo", badge: "NOVO", subtitle: "Cancelamento de ruído ativo", price: 1849, status: "Disponível" },
  { id: "airpods-4", name: "AirPods 4", category: "AirPods", condition: "Novo", badge: "NOVO", subtitle: "Áudio espacial", price: 1549, status: "Disponível" },
  { id: "watch-s11", name: "Apple Watch S11", category: "Apple Watch", condition: "Novo", badge: "NOVO", subtitle: "42mm • Rose", price: 2949, color: "Rose", status: "Disponível" },
  { id: "watch-se3", name: "Apple Watch SE 3", category: "Apple Watch", condition: "Novo", badge: "NOVO", subtitle: "40mm • Estelar", price: 2399, color: "Estelar", status: "Disponível" },
  { id: "watch-se2", name: "Apple Watch SE 2", category: "Apple Watch", condition: "Novo", badge: "NOVO", subtitle: "44mm • Meia-Noite", price: 2099, color: "Meia-Noite", status: "Disponível" },
  { id: "ipad-silver", name: "iPad 11 A16", category: "iPad", condition: "Novo", badge: "NOVO", subtitle: "11” • 128GB • Silver", price: 3449, storage: "128GB", color: "Silver", status: "Disponível" },
  { id: "ipad-rosa", name: "iPad 11 A16", category: "iPad", condition: "Novo", badge: "NOVO", subtitle: "11” • 128GB • Rosa", price: 3399, storage: "128GB", color: "Rosa", status: "Disponível" },
  { id: "ipad-azul", name: "iPad 11 A16", category: "iPad", condition: "Novo", badge: "NOVO", subtitle: "11” • 128GB • Azul", price: 3399, storage: "128GB", color: "Azul", status: "Disponível" },
  { id: "ipad-amarelo", name: "iPad 11 A16", category: "iPad", condition: "Novo", badge: "NOVO", subtitle: "11” • 128GB • Amarelo", price: 3349, storage: "128GB", color: "Amarelo", status: "Disponível" },
  { id: "macbook-pro-m5", name: "MacBook Pro M5", category: "Mac", condition: "Novo", badge: "NOVO", subtitle: "13” • 1TB • 16GB RAM • Preto", price: 13099, storage: "1TB", color: "Preto", status: "Disponível" },
  { id: "macbook-air-m5", name: "MacBook Air M5", category: "Mac", condition: "Novo", badge: "NOVO", subtitle: "13” • 512GB • 16GB RAM", price: 8849, storage: "512GB", colors: ["Meia-Noite", "Estelar"], status: "Disponível" },
  { id: "macbook-neo", name: "MacBook NEO", category: "Mac", condition: "Novo", badge: "RASCUNHO", subtitle: "13” • 256GB • 8GB RAM • Prata", storage: "256GB", color: "Prata", status: "Sob consulta" },
  used("used-16pm-black", "iPhone 16 Pro Max", "256GB", "Preto", 100, 5999, 52), used("used-16pm-desert-89", "iPhone 16 Pro Max", "256GB", "Desert", 89, 5599), used("used-16pm-desert-86", "iPhone 16 Pro Max", "256GB", "Desert", 86, 5499),
  used("used-16pro-black-90", "iPhone 16 Pro", "256GB", "Preto", 90, 5199), used("used-16pro-black-93", "iPhone 16 Pro", "128GB", "Preto", 93, 4799), used("used-16pro-black-91", "iPhone 16 Pro", "128GB", "Preto", 91, 4799), used("used-16pro-desert-91", "iPhone 16 Pro", "128GB", "Desert", 91, 4799), used("used-16pro-black-90b", "iPhone 16 Pro", "128GB", "Preto", 90, 4799), used("used-16pro-desert-90", "iPhone 16 Pro", "128GB", "Desert", 90, 4799),
  used("used-16-black-92", "iPhone 16", "256GB", "Preto", 92, 4399), used("used-16-black-90", "iPhone 16", "256GB", "Preto", 90, 4399), used("used-16-white-88", "iPhone 16", "256GB", "Branco", 88, 4399), { ...used("used-16-apple", "iPhone 16", "128GB", "Preto", 98, 4399), warranty: "Garantia Apple até 17/11/2026" }, used("used-16-white-94", "iPhone 16", "128GB", "Branco", 94, 4299), used("used-16-pink-91", "iPhone 16", "128GB", "Rosa", 91, 4199),
  used("used-15pro-natural", "iPhone 15 Pro", "128GB", "Natural", 86, 3999), used("used-15plus-green", "iPhone 15 Plus", "128GB", "Verde", 86, 3399), used("used-15-black", "iPhone 15", "128GB", "Preto", 88, 3299), used("used-14plus-white", "iPhone 14 Plus", "256GB", "Branco", 85, 3099), used("used-14plus-blue", "iPhone 14 Plus", "128GB", "Azul", 84, 2799), used("used-14-white-100", "iPhone 14", "128GB", "Branco", 100, 2779), used("used-14-white-99", "iPhone 14", "128GB", "Branco", 99, 2779), used("used-14-blue-91", "iPhone 14", "128GB", "Azul", 91, 2779), used("used-14-blue-88", "iPhone 14", "128GB", "Azul", 88, 2699), used("used-14-blue-87", "iPhone 14", "128GB", "Azul", 87, 2699), used("used-14-white-83", "iPhone 14", "128GB", "Branco", 83, 2499),
  used("used-13pm-gray", "iPhone 13 Pro Max", "256GB", "Cinza", 100, 3699), used("used-13pm-blue", "iPhone 13 Pro Max", "256GB", "Azul", 100, 3699), used("used-13pm-green", "iPhone 13 Pro Max", "128GB", "Verde", 100, 3599), used("used-13pm-white", "iPhone 13 Pro Max", "128GB", "Branco", 100, 3599), used("used-13pm-blue-128", "iPhone 13 Pro Max", "128GB", "Azul", 100, 3599), used("used-13pm-gold", "iPhone 13 Pro Max", "128GB", "Dourado", 100, 3699), used("used-13pm-green-86", "iPhone 13 Pro Max", "128GB", "Verde", 86, 3499), used("used-13pro-blue-a", "iPhone 13 Pro", "128GB", "Azul", 100, 3399), used("used-13pro-blue-b", "iPhone 13 Pro", "128GB", "Azul", 100, 3399), used("used-13-blue-256", "iPhone 13", "256GB", "Azul", 100, 2899), used("used-13-red", "iPhone 13", "128GB", "Vermelho", 100, 2599), used("used-13-pink", "iPhone 13", "128GB", "Rosa", 100, 2599), used("used-13-black-100", "iPhone 13", "128GB", "Preto", 100, 2599), used("used-13-black-88", "iPhone 13", "128GB", "Preto", 88, 2499), used("used-13-black-83", "iPhone 13", "128GB", "Preto", 83, 2499), used("used-12pm-blue", "iPhone 12 Pro Max", "512GB", "Azul", 100, 3299), used("used-12-white-a", "iPhone 12", "128GB", "Branco", 100, 2199), used("used-12-white-b", "iPhone 12", "128GB", "Branco", 100, 2199), used("used-12-white-64", "iPhone 12", "64GB", "Branco", 100, 1999), used("used-12-blue-64", "iPhone 12", "64GB", "Azul", 100, 1999), used("used-12-black-90", "iPhone 12", "64GB", "Preto", 90, 1949), used("used-11pm-gray", "iPhone 11 Pro Max", "64GB", "Cinza", 85, 2099), used("used-11-white", "iPhone 11", "128GB", "Branco", 100, 1799),
  ...accessories,
];

const exactColorPrices: Record<string, Record<string, number>> = {
  "17pm-1tb": { Prata: 10399, Laranja: 10199 },
  "17pm-512": { Prata: 8999, Azul: 9099, Laranja: 8999 },
  "17pm-256": { Prata: 7749, Azul: 7699, Laranja: 7749 },
  "17pro-512": { Prata: 8499 },
  "17pro-256": { Prata: 7249, Azul: 7249, Laranja: 7149 },
  "macbook-air-m5": { "Meia-Noite": 8999, Estelar: 8849 },
};
products.forEach((product) => { if (exactColorPrices[product.id]) product.priceByColor = exactColorPrices[product.id]; });
export function getCatalogProducts() {
  if (typeof window === "undefined") return products;
  try { return [...products, ...JSON.parse(window.localStorage.getItem("sn-custom-products") || "[]") as CatalogProduct[]]; } catch { return products; }
}

export function getVariantSku(product: CatalogProduct, color?: string, storage?: string) {
  const base = product.sku || `SN-${product.id.toUpperCase()}`;
  const suffix = [storage || product.storage, color || product.color].filter(Boolean).map((part) => String(part).replace(/[^a-zA-Z0-9]+/g, "").toUpperCase()).join("-");
  return suffix ? `${base}-${suffix}` : base;
}
export function formatBRL(value: number) { return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(value); }
export function buildWhatsAppMessage(items: Array<{ product: CatalogProduct; quantity: number; selectedColor?: string; selectedStorage?: string; unitPrice?: number }>, customer?: { name?: string; city?: string; state?: string; contact?: string }) {
  const lines = ["Olá!", "", "Estou fazendo um pedido através da SN Store Global.", "", "🛒 MEU PEDIDO", ...items.map((item, index) => `${index + 1}. ${item.product.name}\n   • Armazenamento: ${item.selectedStorage || item.product.storage || "Conforme cadastro"}\n   • Cor: ${item.selectedColor || item.product.color || "Conforme cadastro"}\n   • Quantidade: ${item.quantity}\n   • Valor: ${item.unitPrice || item.product.price ? formatBRL(item.unitPrice || item.product.price || 0) : "Sob consulta"}`), "", "━━━━━━━━━━━━", `💰 Subtotal: ${formatBRL(items.reduce((sum, item) => sum + (item.unitPrice || item.product.price || 0) * item.quantity, 0))}`, "", "Gostaria de confirmar a disponibilidade destes produtos e receber informações sobre pagamento e entrega.", "", "Gerado através da loja SN Store Global."];
  if (customer && (customer.name || customer.city || customer.state || customer.contact)) lines.splice(lines.length - 2, 0, "", `Cliente: ${customer.name || "Não informado"}`, `Localização: ${[customer.city, customer.state].filter(Boolean).join(" - ") || "Não informado"}`, `Contato preferido: ${customer.contact || "Não informado"}`);
  return lines.join("\n");
}

export function getAccessoryCompatibilityOptions(product: Pick<CatalogProduct, "name">) {
  const name = product.name.toLocaleLowerCase("pt-BR");
  if (name.includes("capinha") || name.includes("capa") || name.includes("película")) return ["iPhone 17 / 17 Pro / 17 Pro Max", "iPhone 16 / 16 Pro / 16 Pro Max", "iPhone 15 / 15 Pro / 15 Pro Max", "Samsung Galaxy S ou A", "Xiaomi / Redmi / POCO", "Motorola / LG", "Outro modelo"];
  if (name.includes("cabo") || name.includes("carregador") || name.includes("adaptador") || name.includes("hub")) return ["USB-C universal", "iPhone / Lightning", "Samsung / Xiaomi / Motorola / LG / POCO", "iPad / MacBook", "AirPods / Apple Watch", "Outro dispositivo"];
  if (name.includes("fone")) return ["Bluetooth universal", "Android / USB-C", "iPhone / Lightning", "Tablet ou notebook", "Outro dispositivo"];
  if (name.includes("power bank")) return ["Celular", "Tablet", "Celular + tablet", "Outro dispositivo"];
  if (name.includes("suporte") || name.includes("selfie") || name.includes("anel")) return ["Celular compacto", "Celular grande / Pro Max", "Tablet", "Bicicleta / moto", "Carro", "Outro dispositivo"];
  if (name.includes("pulseira")) return ["Apple Watch 38 / 40 / 41mm", "Apple Watch 42 / 44 / 45 / 49mm", "Smartwatch 20mm", "Smartwatch 22mm", "Outro tamanho"];
  if (name.includes("ipad") || name.includes("caneta")) return ["iPad 10ª / 11ª geração", "iPad Air", "iPad Pro", "Outro modelo de iPad"];
  if (name.includes("macbook")) return ["MacBook Air 13\"", "MacBook Air 15\"", "MacBook Pro 14\"", "MacBook Pro 16\"", "Outro modelo"];
  if (name.includes("airpods")) return ["AirPods 4", "AirPods Pro", "AirPods 1 / 2 / 3", "Outro modelo"];
  return ["Celular", "Tablet", "Smartwatch", "Outro dispositivo"];
}

export function buildAccessoryWhatsAppMessage(product: CatalogProduct, details?: { quantity?: number; compatibility?: string }) {
  return [
    "Olá!",
    "",
    "Tenho interesse em um acessório da SN Store Global.",
    "",
    `Produto: ${product.name}`,
    `Categoria: ${product.category}`,
    `SKU: ${getVariantSku(product)}`,
    `Quantidade: ${details?.quantity || 1}`,
    `Compatibilidade: ${details?.compatibility || "A confirmar com a equipe"}`,
    `Preço unitário: ${product.price ? formatBRL(product.price) : "Sob consulta"}`,
    `Total estimado: ${product.price ? formatBRL(product.price * (details?.quantity || 1)) : "Sob consulta"}`,
    `Disponibilidade: ${product.status}`,
    "",
    "Gostaria de confirmar o preço, a compatibilidade e a disponibilidade deste item.",
  ].join("\n");
}
