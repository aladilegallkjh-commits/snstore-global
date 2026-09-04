import type { CatalogProduct } from "./catalog";

const productFrontImages = {
  iPhone17Pro: "/api-storage/iphone-17-pro-max-front_37432b3a.png",
};

const accessoryImages = {
  cable: "/api-storage/earbuds-cable_ef719aa8-transparent_a05bc9e4.png",
  charger: "/api-storage/wireless-charger_cbc54003-transparent_209f13e0.png",
  case: "/api-storage/cases-collection_e33f218c-transparent_1d37cbea.png",
  protector: "/api-storage/screen-protector_3f020269-transparent_10971081.png",
  audio: "/api-storage/earbuds-charger_b132318c-transparent_38d730f7.png",
  power: "/api-storage/power-bank_1bea729c-transparent_13d0f46f.png",
  holder: "/api-storage/car-holder_6d20f381-transparent_bf9bb09b.png",
  apple: "/api-storage/apple-accessories_1e479e58-transparent_df38a0dc.png",
  collection: "/api-storage/accessory-collection_eb801ecd-transparent_9e053401.png",
};

const proColorImages: Array<[string[], string]> = [
  [["laranja", "orange"], "/api-storage/iphone-17-pro-orange-card-clean_2261ea45.png"],
    [["azul", "deep blue", "blue"], "/api-storage/iphone-17-pro-blue-card-clean_ae8f0061.png"],
    [["prata", "silver"], "/api-storage/iphone-17-pro-master-card-clean_f1090054.png"],
];

const colorImages: Record<string, Array<[string[], string]>> = {
  iPhone: [
    [["laranja", "orange"], "/api-storage/iphone-17-orange-transparent-cutout_7fe7f66a.png"],
    [["lavanda", "purple"], "/api-storage/iphone-17-lavender_6dc9d5ef-transparent_68901f71.png"],
    [["preto", "black"], "/api-storage/iphone-17-black_9c554f73-transparent_6f081eda.png"],
    [["branco", "white"], "/api-storage/iphone-17-white_ef512e57-transparent_351776ef.png"],
    [["verde", "sage", "green"], "/api-storage/iphone-17-sage_8032ed3d-transparent_b8019fd8.png"],
    [["azul", "mist blue", "light blue"], "/api-storage/iphone-17-mist-blue_2ee41e09-transparent_4537863a.png"],
    [["prata", "silver"], "/api-storage/iphone-17-colors_64071915.png"],
  ],
  iPad: [
    [["rosa", "pink"], "/api-storage/ipad-11-pink-single-transparent_86a6c8ce.png"],
    [["azul", "blue"], "/api-storage/ipad-11-blue-single-transparent_5f1eeeb6.png"],
    [["amarelo", "yellow"], "/api-storage/ipad-11-yellow-single-transparent_569e1eac.png"],
    [["prata", "silver"], "/api-storage/ipad-11-single-transparent_9e2017a5.png"],
  ],
  "Apple Watch": [
    [["rose", "rosa"], "/api-storage/apple-watch-rose_629925a5-transparent_95b84614.png"],
    [["estelar", "starlight"], "/api-storage/apple-watch-starlight_78aa7b41-transparent_8be293e0.png"],
    [["meia-noite", "midnight"], "/api-storage/apple-watch-midnight_7ff642a2-transparent_60cfe797.png"],
  ],
};

function getColorImage(product: Pick<CatalogProduct, "category" | "name">, color?: string) {
  const selectedColor = (color || "").toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const entries = product.category === "iPhone" && product.name.includes("iPhone 17 Pro") ? proColorImages : colorImages[product.category] || [];
  return entries.find(([names]) => names.some((name) => selectedColor.includes(name)))?.[1];
}

export function getProductFrontImage(product: Pick<CatalogProduct, "category" | "name">) {
  if (product.category === "iPhone" && product.name.includes("iPhone 17 Pro")) return productFrontImages.iPhone17Pro;
  return undefined;
}

export function getProductImage(product: Pick<CatalogProduct, "category" | "name"> & { color?: string }, color?: string) {
  const colorImage = getColorImage(product, color || product.color);
  if (colorImage && ((product.category === "iPhone" && product.name.includes("iPhone 17")) || product.category === "iPad" || product.category === "Apple Watch")) return colorImage;
  if (product.category === "Acessórios") {
    const name = product.name.toLocaleLowerCase("pt-BR");
    if (name.includes("cabo")) return accessoryImages.cable;
    if (name.includes("carregador") || name.includes("wireless")) return accessoryImages.charger;
    if (name.includes("capinha") || name.includes("capa") || name.includes("case")) return accessoryImages.case;
    if (name.includes("película")) return accessoryImages.protector;
    if (name.includes("fone") || name.includes("áudio")) return accessoryImages.audio;
    if (name.includes("power bank")) return accessoryImages.power;
    if (name.includes("suporte") || name.includes("selfie")) return accessoryImages.holder;
    if (name.includes("pulseira") || name.includes("airpods") || name.includes("apple watch") || name.includes("ipad") || name.includes("macbook")) return accessoryImages.apple;
    if (name.includes("adaptador") || name.includes("hub")) return accessoryImages.collection;
    return accessoryImages.collection;
  }
  if (product.category === "Seminovos") return "/api-storage/iphone-product_fb6f9cfc-transparent_d75d6344.png";
  if (product.category === "iPhone" && product.name.includes("iPhone 17 Pro")) return "/api-storage/iphone-17-pro-master-card-clean_f1090054.png";
  if (product.category === "iPhone" && product.name.includes("iPhone 17")) return "/api-storage/iphone-17-pro-master-card-clean_f1090054.png";
  if (product.category === "iPhone" && product.name.includes("iPhone 16")) return "/api-storage/iphone-16-single-transparent_7635f3c5.png";
  if (product.category === "iPhone" && product.name.includes("iPhone 15")) return "/api-storage/iphone-15-new_2991e81f-transparent_817fbd1a.png";
  if (product.category === "iPhone") return "/api-storage/iphone-product_fb6f9cfc-transparent_d75d6344.png";
  if (product.category === "AirPods" && product.name.includes("4")) return "/api-storage/airpods-4-native_f1d9a044.png";
  if (product.category === "AirPods") return "/api-storage/airpods-pro-native_cf48aed3.png";
  if (product.category === "Apple Watch" && product.name.includes("SE")) return "/api-storage/apple-watch-se3_4e3601d0-transparent_6e1ca901.png";
  if (product.category === "Apple Watch") return "/api-storage/apple-watch-product_6ef6204b-transparent_798ded43.png";
  if (product.category === "iPad") return "/api-storage/ipad-11-single-transparent_9e2017a5.png";
  if (product.category === "Mac" && (product.name.includes("Air") || product.name.includes("NEO"))) return "/api-storage/macbook-air-native_1d804fa4.png";
  if (product.category === "Mac" && product.name.includes("Pro")) return "/api-storage/macbook-pro-native_b3354a98.png";
  if (product.category === "Mac") return "/api-storage/macbook-air-native_1d804fa4.png";
  return accessoryImages.collection;
}
