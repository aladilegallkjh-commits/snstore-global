export const deviceModels: Record<string, string[]> = {
  Samsung: [
    "Galaxy S25 Ultra", "Galaxy S25+", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24+", "Galaxy S24", "Galaxy S23 Ultra", "Galaxy S23+", "Galaxy S23", "Galaxy S22 Ultra", "Galaxy S22+", "Galaxy S22", "Galaxy S21 FE", "Galaxy S20 FE", "Galaxy Note 20 Ultra", "Galaxy Note 20", "Galaxy Z Fold7", "Galaxy Z Flip7", "Galaxy Z Fold6", "Galaxy Z Flip6", "Galaxy Z Fold5", "Galaxy Z Flip5", "Galaxy A56", "Galaxy A55", "Galaxy A36", "Galaxy A35", "Galaxy A26", "Galaxy A25", "Galaxy A16", "Galaxy A15", "Galaxy A14", "Galaxy M55", "Galaxy M35", "Galaxy M15", "Outro Samsung"
  ],
  Xiaomi: [
    "Xiaomi 15 Ultra", "Xiaomi 15", "Xiaomi 14 Ultra", "Xiaomi 14", "Xiaomi 14T Pro", "Xiaomi 14T", "Xiaomi 13T Pro", "Xiaomi 13T", "Xiaomi 13", "Redmi Note 14 Pro+", "Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro+", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi Note 12", "Redmi 14C", "Redmi 13C", "Redmi 12", "Mi 11", "Outro Xiaomi/Redmi"
  ],
  iPhone: [
    "iPhone 17 Pro Max", "iPhone 17 Pro", "iPhone 17 Air", "iPhone 17", "iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16 Plus", "iPhone 16", "iPhone 16e", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15 Plus", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14 Plus", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 13 mini", "iPhone 12 Pro Max", "iPhone 12 Pro", "iPhone 12", "iPhone 12 mini", "iPhone 11 Pro Max", "iPhone 11 Pro", "iPhone 11", "iPhone XS Max", "iPhone XS", "iPhone XR", "iPhone X", "iPhone 8 Plus", "iPhone 8", "iPhone 7 Plus", "iPhone 7", "iPhone SE (3ª geração)", "iPhone SE (2ª geração)", "Outro iPhone"
  ],
  Motorola: [
    "Razr 60 Ultra", "Razr 60", "Razr 50 Ultra", "Razr 50", "Edge 60 Pro", "Edge 60 Fusion", "Edge 60", "Edge 50 Ultra", "Edge 50 Pro", "Edge 50 Fusion", "Edge 50 Neo", "Moto G85", "Moto G75", "Moto G55", "Moto G35", "Moto G15", "Moto G05", "Moto G84", "Moto G54", "Moto G34", "Moto G24", "Moto G14", "Moto E14", "Outro Motorola"
  ],
  LG: [
    "LG Velvet", "LG Wing", "LG V60 ThinQ", "LG V50 ThinQ", "LG V40 ThinQ", "LG G8 ThinQ", "LG G7 ThinQ", "LG K62", "LG K52", "LG K51S", "LG K42", "LG K41S", "LG K22", "LG K10", "LG K8", "LG K4", "Outro LG"
  ],
  POCO: [
    "POCO F7 Ultra", "POCO F7 Pro", "POCO F7", "POCO F6 Pro", "POCO F6", "POCO F5 Pro", "POCO F5", "POCO X7 Pro", "POCO X7", "POCO X6 Pro", "POCO X6", "POCO X5 Pro", "POCO X5", "POCO M7 Pro", "POCO M6 Pro", "POCO M5", "POCO C75", "POCO C65", "Outro POCO"
  ],
  Outra: ["Outro modelo"]
};

export const deviceModelsByCategory: Record<string, Record<string, string[]>> = {
  Celular: deviceModels,
  Tablet: {
    Samsung: ["Galaxy Tab S10 Ultra", "Galaxy Tab S10+", "Galaxy Tab S10 FE+", "Galaxy Tab S9 Ultra", "Galaxy Tab S9+", "Galaxy Tab S9", "Galaxy Tab S9 FE+", "Galaxy Tab S9 FE", "Galaxy Tab S8 Ultra", "Galaxy Tab S8+", "Galaxy Tab S8", "Galaxy Tab A9+", "Galaxy Tab A9", "Galaxy Tab A8", "Outro tablet Samsung"],
    Xiaomi: ["Xiaomi Pad 7 Ultra", "Xiaomi Pad 7 Pro", "Xiaomi Pad 7", "Xiaomi Pad 6S Pro", "Xiaomi Pad 6", "Redmi Pad Pro", "Redmi Pad SE", "Outro tablet Xiaomi/Redmi"],
    iPad: ["iPad Pro 13\"", "iPad Pro 11\"", "iPad Air 13\"", "iPad Air 11\"", "iPad (A16)", "iPad (10ª geração)", "iPad mini (A17 Pro)", "iPad mini (6ª geração)", "Outro iPad"],
    Lenovo: ["Lenovo Tab P12", "Lenovo Tab P11 Pro", "Lenovo Tab P11", "Lenovo Tab M11", "Lenovo Tab M10", "Outro tablet Lenovo"],
    Motorola: ["Moto Tab G70", "Moto Tab G62", "Outro tablet Motorola"],
    Outra: ["Outro tablet"]
  },
  Smartwatch: {
    Samsung: ["Galaxy Watch8 Classic", "Galaxy Watch8", "Galaxy Watch7", "Galaxy Watch6 Classic", "Galaxy Watch6", "Galaxy Watch5 Pro", "Galaxy Watch5", "Galaxy Watch4 Classic", "Galaxy Watch4", "Outro Galaxy Watch"],
    Apple: ["Apple Watch Ultra 2", "Apple Watch Ultra", "Apple Watch Series 10", "Apple Watch Series 9", "Apple Watch Series 8", "Apple Watch SE (2ª geração)", "Apple Watch SE (1ª geração)", "Outro Apple Watch"],
    Xiaomi: ["Xiaomi Watch S4", "Xiaomi Watch 2 Pro", "Xiaomi Watch 2", "Redmi Watch 5", "Redmi Watch 4", "Outro smartwatch Xiaomi/Redmi"],
    Huawei: ["Huawei Watch GT 5 Pro", "Huawei Watch GT 5", "Huawei Watch 4 Pro", "Huawei Watch Fit 4", "Huawei Watch Fit 3", "Outro smartwatch Huawei"],
    Amazfit: ["Amazfit Balance", "Amazfit Active 2", "Amazfit GTR 4", "Amazfit GTS 4", "Amazfit Bip 5", "Outro Amazfit"],
    Motorola: ["Moto Watch 100", "Moto Watch 70", "Outro smartwatch Motorola"],
    Outra: ["Outro smartwatch"]
  }
};

export function filterDeviceModels(category: string, brand: string, query: string) {
  const normalizedQuery = query.trim().toLocaleLowerCase("pt-BR");
  return (deviceModelsByCategory[category]?.[brand] || []).filter((model) => model.toLocaleLowerCase("pt-BR").includes(normalizedQuery));
}

export function buildAssistanceMessage(input: { storeName: string; deviceType?: string; name?: string; city?: string; state?: string; brand?: string; model?: string; service: string; problem?: string; contact?: string }) {
  return [`Olá! Gostaria de solicitar assistência técnica móvel da ${input.storeName}.`, "", `Tipo de aparelho: ${input.deviceType || "Celular"}`, `Nome: ${input.name || "Não informado"}`, `Cidade/UF: ${[input.city, input.state].filter(Boolean).join(" - ") || "Não informado"}`, `Marca: ${input.brand || "Não informada"}`, `Modelo: ${input.model || "Não informado"}`, `Serviço: ${input.service}`, `Problema: ${input.problem || "Não informado"}`, `Contato preferido: ${input.contact || "Não informado"}`, "", "Gostaria de saber a disponibilidade e o orçamento do atendimento."].join("\n");
}
