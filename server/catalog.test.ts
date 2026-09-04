import { describe, expect, it } from "vitest";
import { buildAccessoryWhatsAppMessage, buildWhatsAppMessage, formatBRL, getAccessoryCompatibilityOptions, getStoreConfig, getVariantSku, products, storeConfig } from "../client/src/data/catalog";
import { getProductImage } from "../client/src/data/productImages";

describe("SN Store Global catalog", () => {
  it("includes selected variant and subtotal in WhatsApp message", () => {
    const product = products.find((item) => item.id === "17pm-256")!;
    const message = buildWhatsAppMessage([{ product, quantity: 1, selectedColor: "Azul", selectedStorage: "256GB", unitPrice: 7699 }]);
    expect(message).toContain("Cor: Azul");
    expect(message).toContain("Subtotal: R$\u00a07.699");
  });

  it("creates a deterministic SKU for the selected color and storage", () => {
    const product = products.find((item) => item.id === "17pm-512")!;
    expect(getVariantSku(product, "Azul", "512GB")).toBe("SN-17PM-512-512GB-AZUL");
  });

  it("keeps duplicate used devices as separate inventory units", () => {
    const units = products.filter((item) => item.name === "iPhone 13 Pro" && item.condition === "Seminovo");
    expect(units).toHaveLength(2);
    expect(units[0]?.id).not.toBe(units[1]?.id);
  });

  it("keeps incomplete MacBook NEO price as consultation", () => {
    const product = products.find((item) => item.id === "macbook-neo");
    expect(product?.price).toBeUndefined();
    expect(product?.status).toBe("Sob consulta");
  });

  it("includes the main accessory families for a mobile store", () => {
    const accessoryNames = products.filter((item) => item.category === "Acessórios").map((item) => item.name.toLocaleLowerCase("pt-BR"));
    for (const family of ["cabo", "carregador", "capinha", "película", "fone", "adaptador", "suporte", "power bank", "pulseira"]) expect(accessoryNames.some((name) => name.includes(family))).toBe(true);
    expect(products.filter((item) => item.category === "Acessórios").length).toBeGreaterThan(30);
  });

  it("maps accessory families to specific product photos", () => {
    expect(getProductImage({ category: "Acessórios", name: "Cabo USB-C para USB-C" })).toContain("earbuds-cable_");
    expect(getProductImage({ category: "Acessórios", name: "Capinha anti-impacto" })).toContain("cases-collection_");
    expect(getProductImage({ category: "Acessórios", name: "Película de vidro 3D" })).toContain("screen-protector_");
    expect(getProductImage({ category: "Acessórios", name: "Power Bank 10.000mAh" })).toContain("power-bank_");
    expect(getProductImage({ category: "Acessórios", name: "Suporte veicular para celular" })).toContain("car-holder_");
  });

  it("maps new product categories to specific model photos", () => {
    expect(getProductImage({ category: "iPhone", name: "iPhone 17 Pro Max" })).toContain("iphone-17-pro-master-card-clean_f1090054");
    expect(getProductImage({ category: "iPhone", name: "iPhone 15" })).toContain("iphone-15-new_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 16" })).toContain("iphone-16-single-transparent_");
    expect(getProductImage({ category: "Mac", name: "MacBook Pro M5" })).toContain("macbook-pro-native_b3354a98");
    expect(getProductImage({ category: "Mac", name: "MacBook Air M5" })).toContain("macbook-air-native_1d804fa4");
    expect(getProductImage({ category: "Mac", name: "MacBook NEO" })).toContain("macbook-air-native_1d804fa4");
  });

  it("maps each Apple variant color to its specific product photo", () => {
    expect(getProductImage({ category: "iPhone", name: "iPhone 17" }, "Preto")).toContain("iphone-17-black_9c554f73-transparent_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17" }, "Branco")).toContain("iphone-17-white_ef512e57-transparent_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17" }, "Verde")).toContain("iphone-17-sage_8032ed3d-transparent_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17" }, "Lavanda")).toContain("iphone-17-lavender_6dc9d5ef-transparent_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17" }, "Azul")).toContain("iphone-17-mist-blue_2ee41e09-transparent_");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17 Pro Max" }, "Prata")).toContain("iphone-17-pro-master-card-clean_f1090054");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17 Pro Max" }, "Azul")).toContain("iphone-17-pro-blue-card-clean_ae8f0061");
    expect(getProductImage({ category: "iPhone", name: "iPhone 17 Pro Max" }, "Laranja")).toContain("iphone-17-pro-orange-card-clean_2261ea45");
    expect(getProductImage({ category: "iPad", name: "iPad 11 A16" }, "Rosa")).toContain("ipad-11-pink-single-transparent_");
    expect(getProductImage({ category: "iPad", name: "iPad 11 A16" }, "Azul")).toContain("ipad-11-blue-single-transparent_");
    expect(getProductImage({ category: "iPad", name: "iPad 11 A16" }, "Amarelo")).toContain("ipad-11-yellow-single-transparent_");
    expect(getProductImage({ category: "iPad", name: "iPad 11 A16" }, "Silver")).toContain("ipad-11-single-transparent_");
    expect(getProductImage({ category: "Apple Watch", name: "Apple Watch S11" }, "Rose")).toContain("apple-watch-rose_629925a5-transparent_");
    expect(getProductImage({ category: "Apple Watch", name: "Apple Watch SE 3" }, "Estelar")).toContain("apple-watch-starlight_78aa7b41-transparent_");
    expect(getProductImage({ category: "Apple Watch", name: "Apple Watch SE 2" }, "Meia-Noite")).toContain("apple-watch-midnight_7ff642a2-transparent_");
    expect(getProductImage({ category: "AirPods", name: "AirPods 4" })).toContain("airpods-4-native_f1d9a044");
    expect(getProductImage({ category: "AirPods", name: "AirPods Pro 3" })).toContain("airpods-pro-native_cf48aed3");
  });

  it("formats direct accessory purchase details for WhatsApp", () => {
    const product = { ...products.find((item) => item.id === "cabo-usb-c-usb-c")!, price: 29.9 };
    const message = buildAccessoryWhatsAppMessage(product, { quantity: 3, compatibility: "iPhone / Lightning" });
    expect(message).toContain("Produto: Cabo USB-C para USB-C");
    expect(message).toContain("Categoria: Acessórios");
    expect(message).toContain("SKU: SN-CABO-USB-C-USB-C");
    expect(message).toContain("Quantidade: 3");
    expect(message).toContain("Compatibilidade: iPhone / Lightning");
    expect(message).toContain(`Preço unitário: ${formatBRL(product.price)}`);
    expect(message).toContain(`Total estimado: ${formatBRL(product.price * 3)}`);
  });

  it("suggests compatibility choices according to the accessory family", () => {
    const caseOptions = getAccessoryCompatibilityOptions({ name: "Capinha transparente" });
    const audioOptions = getAccessoryCompatibilityOptions({ name: "Fone Bluetooth" });
    expect(caseOptions).toContain("Samsung Galaxy S ou A");
    expect(audioOptions).toContain("Bluetooth universal");
  });

  it("keeps the official contact defaults ready for WhatsApp and Instagram", () => {
    expect(storeConfig.whatsapp).toBe("5541995156702");
    expect(storeConfig.instagram).toBe("https://www.instagram.com/snstoreglobal/");
    expect(getStoreConfig().whatsapp).toBe("5541995156702");
  });
});
