import type { CatalogProduct } from "./catalog";

const appleCDN = {
  iphonePro: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=512&hei=512&fmt=png-alpha",
  iphone: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-finish-select-202309-6-1inch-black?wid=512&hei=512&fmt=png-alpha",
  ipad: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-10th-gen-finish-select-202212-blue?wid=512&hei=512&fmt=png-alpha",
  watch: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-card-40-se-202409?wid=512&hei=512&fmt=png-alpha",
  airpods: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MME73?wid=512&hei=512&fmt=png-alpha",
  airpodsPro: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MTJV3?wid=512&hei=512&fmt=png-alpha",
  macbook: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=512&hei=512&fmt=png-alpha",
  cable: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MU2G3?wid=512&hei=512&fmt=png-alpha",
  charger: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MHXH3?wid=512&hei=512&fmt=png-alpha",
  case: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MT223?wid=512&hei=512&fmt=png-alpha"
};

export function getProductFrontImage(product: Pick<CatalogProduct, "category" | "name">) {
  if (product.category === "iPhone" && product.name.includes("Pro")) return appleCDN.iphonePro;
  return undefined;
}

export function getProductImage(product: Pick<CatalogProduct, "category" | "name"> & { color?: string }, color?: string) {
  if (product.category === "Acessórios") {
    const name = product.name.toLocaleLowerCase("pt-BR");
    if (name.includes("airpods") || name.includes("fone") || name.includes("áudio")) return appleCDN.airpods;
    if (name.includes("cabo")) return appleCDN.cable;
    if (name.includes("carregador") || name.includes("wireless") || name.includes("magsafe") || name.includes("power bank")) return appleCDN.charger;
    if (name.includes("capinha") || name.includes("capa") || name.includes("case") || name.includes("película")) return appleCDN.case;
    if (name.includes("pulseira") || name.includes("watch")) return appleCDN.watch;
    if (name.includes("ipad") || name.includes("caneta")) return appleCDN.ipad;
    if (name.includes("macbook")) return appleCDN.macbook;
    return appleCDN.cable; // Default accessory
  }
  
  if (product.category === "iPhone") {
    if (product.name.includes("Pro")) return appleCDN.iphonePro;
    return appleCDN.iphone;
  }
  
  if (product.category === "AirPods") {
    if (product.name.includes("Pro")) return appleCDN.airpodsPro;
    return appleCDN.airpods;
  }
  
  if (product.category === "Apple Watch") return appleCDN.watch;
  if (product.category === "iPad") return appleCDN.ipad;
  if (product.category === "Mac") return appleCDN.macbook;
  if (product.category === "Seminovos") return appleCDN.iphone;
  
  return appleCDN.iphone; // Fallback
}
