import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getProductFrontImage } from "../client/src/data/productImages";

const homeSource = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
const productSource = readFileSync(resolve(process.cwd(), "client/src/pages/Product.tsx"), "utf8");
const styles = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

describe("product image color transition", () => {
  it("keys the card and detail images by their source for a clean variant transition", () => {
    expect(homeSource).toContain('key={image} className="product-photo product-photo-transition"');
    expect(productSource).toContain('key={`${galleryView}-${galleryImage}`} className="product-page-photo-transition"');
    expect(productSource).toContain('aria-label="Galeria de imagens"');
  });

  it("maps a front view for the iPhone 17 Pro family", () => {
    expect(getProductFrontImage({ category: "iPhone", name: "iPhone 17 Pro Max" })).toContain("iphone-17-pro-max-front_");
    expect(getProductFrontImage({ category: "iPhone", name: "iPhone 16 Pro" })).toBeUndefined();
  });

  it("keeps the animation short and honors reduced-motion preferences", () => {
    expect(styles).toContain("product-image-swap .26s cubic-bezier(.23,1,.32,1)");
    expect(styles).toContain(".product-gallery-controls");
    expect(styles).toContain("@media(prefers-reduced-motion:reduce)");
    expect(styles).toContain(".product-photo-transition,.product-page-photo-transition{animation:none");
  });
});
