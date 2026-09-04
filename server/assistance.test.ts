import { describe, expect, it } from "vitest";
import { buildAssistanceMessage, deviceModelsByCategory, filterDeviceModels } from "../client/src/data/assistance";

describe("assistência técnica", () => {
  it("oferece modelos de celular por marca e novas categorias", () => {
    expect(deviceModelsByCategory.Celular.Samsung).toContain("Galaxy S25 Ultra");
    expect(deviceModelsByCategory.Celular.Xiaomi).toContain("Redmi Note 14 Pro");
    expect(deviceModelsByCategory.Celular.iPhone).toContain("iPhone 16 Pro Max");
    expect(deviceModelsByCategory.Celular.Motorola).toContain("Moto G85");
    expect(deviceModelsByCategory.Celular.LG).toContain("LG Velvet");
    expect(deviceModelsByCategory.Celular.POCO).toContain("POCO F6 Pro");
    expect(deviceModelsByCategory.Tablet.iPad).toContain("iPad Pro 13\"");
    expect(deviceModelsByCategory.Smartwatch.Apple).toContain("Apple Watch Series 10");
  });

  it("filtra modelos rapidamente dentro da marca selecionada", () => {
    expect(filterDeviceModels("Celular", "Samsung", "s25 ultra")).toEqual(["Galaxy S25 Ultra"]);
    expect(filterDeviceModels("Celular", "POCO", "f6")).toContain("POCO F6 Pro");
    expect(filterDeviceModels("Tablet", "iPad", "pro")).toContain("iPad Pro 13\"");
    expect(filterDeviceModels("Smartwatch", "Apple", "modelo inexistente")).toEqual([]);
    expect(filterDeviceModels("Celular", "LG", "").length).toBeGreaterThan(5);
  });

  it("inclui marca, modelo e serviço na mensagem", () => {
    const message = buildAssistanceMessage({ storeName: "SN Store Global", deviceType: "Tablet", brand: "iPad", model: "iPad Pro 13\"", service: "Troca de tela" });
    expect(message).toContain("Tipo de aparelho: Tablet");
    expect(message).toContain("Marca: iPad");
    expect(message).toContain("Modelo: iPad Pro 13\"");
    expect(message).toContain("Serviço: Troca de tela");
  });
});
