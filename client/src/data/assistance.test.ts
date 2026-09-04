import { describe, expect, it } from "vitest";
import { buildAssistanceMessage, deviceModelsByCategory, filterDeviceModels } from "./assistance";

describe("assistência técnica", () => {
  it("oferece modelos separados por categoria", () => {
    expect(deviceModelsByCategory.Celular.Samsung).toContain("Galaxy S25 Ultra");
    expect(deviceModelsByCategory.Tablet.iPad).toContain("iPad Pro 13\"");
    expect(deviceModelsByCategory.Smartwatch.Apple).toContain("Apple Watch Series 10");
  });

  it("filtra modelos dentro da categoria e marca selecionadas", () => {
    expect(filterDeviceModels("Celular", "Samsung", "s25 ultra")).toEqual(["Galaxy S25 Ultra"]);
    expect(filterDeviceModels("Tablet", "iPad", "pro")).toContain("iPad Pro 13\"");
    expect(filterDeviceModels("Smartwatch", "Apple", "modelo inexistente")).toEqual([]);
  });

  it("inclui categoria, marca, modelo e serviço na mensagem", () => {
    const message = buildAssistanceMessage({ storeName: "SN Store Global", deviceType: "Smartwatch", brand: "Apple", model: "Apple Watch Series 10", service: "Diagnóstico" });
    expect(message).toContain("Tipo de aparelho: Smartwatch");
    expect(message).toContain("Marca: Apple");
    expect(message).toContain("Modelo: Apple Watch Series 10");
    expect(message).toContain("Serviço: Diagnóstico");
  });
});
