import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, products } from "./catalog";

describe("catálogo e checkout WhatsApp", () => {
  it("gera mensagem detalhada com variante e subtotal", () => {
    const product = products.find((item) => item.id === "17pm-256")!;
    const message = buildWhatsAppMessage([{ product, quantity: 1, selectedColor: "Azul", selectedStorage: "256GB", unitPrice: 7699 }]);
    expect(message).toContain("iPhone 17 Pro Max");
    expect(message).toContain("Cor: Azul");
    expect(message).toContain("Subtotal: R$ 7.699");
  });

  it("mantém unidades seminovas independentes", () => {
    const units = products.filter((item) => item.name === "iPhone 13 Pro" && item.condition === "Seminovo");
    expect(units).toHaveLength(2);
    expect(units[0]?.id).not.toBe(units[1]?.id);
  });

  it("não inventa preço para o MacBook NEO", () => {
    const product = products.find((item) => item.id === "macbook-neo");
    expect(product?.price).toBeUndefined();
    expect(product?.status).toBe("Sob consulta");
  });
});
