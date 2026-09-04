import { describe, expect, it } from "vitest";
import { getColorSwatchBackground, getColorSwatchBorder } from "../client/src/data/colorSwatches";

describe("color swatches", () => {
  it("uses distinct metallic gradients for the iPhone 17 Pro finishes", () => {
    const silver = getColorSwatchBackground("Prata");
    const blue = getColorSwatchBackground("Azul");
    const orange = getColorSwatchBackground("Laranja");

    expect(silver).toContain("#f7f9fb");
    expect(blue).toContain("#5a7fa2");
    expect(orange).toContain("#ff751e");
    expect(new Set([silver, blue, orange]).size).toBe(3);
  });

  it("normalizes accented names and keeps a contrast border", () => {
    expect(getColorSwatchBackground("Meia-Noite")).toContain("#202d41");
    expect(getColorSwatchBackground("silver")).toBe(getColorSwatchBackground("Prata"));
    expect(getColorSwatchBorder("Preto")).toContain("184, 218, 244");
    expect(getColorSwatchBorder("Laranja")).toContain("255, 255, 255");
  });
});
