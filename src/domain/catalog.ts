import { specFromSketch } from "./spec-from-sketch";
import type { SketchSample, Spec } from "./spec";

export const CATALOG_NAMES = ["bounce", "spiral", "orbit"] as const;
export type CatalogName = (typeof CATALOG_NAMES)[number];

const recipes: Record<CatalogName, () => SketchSample[]> = {
  bounce: bounceSamples,
  spiral: spiralSamples,
  orbit: orbitSamples,
};

const catalog: Record<CatalogName, Spec> = {
  bounce: specFromSketch("bounce", recipes.bounce()),
  spiral: specFromSketch("spiral", recipes.spiral()),
  orbit: specFromSketch("orbit", recipes.orbit()),
};

export function listCatalog(): Spec[] {
  return CATALOG_NAMES.map((name) => catalog[name]);
}

export function catalogItem(name: CatalogName): Spec {
  return catalog[name];
}

function bounceSamples(): SketchSample[] {
  return Array.from({ length: 41 }, (_, index) => {
    const progress = index / 40;
    return {
      x: 0.5,
      y: 1 - Math.abs(Math.sin(progress * Math.PI * 2)),
      timeMs: progress * 800,
    };
  });
}

function spiralSamples(): SketchSample[] {
  const turns = 2.5;
  return Array.from({ length: 65 }, (_, index) => {
    const progress = index / 64;
    const angle = progress * turns * Math.PI * 2;
    const radius = 0.08 + progress * 0.38;
    return {
      x: 0.5 + Math.cos(angle) * radius,
      y: 0.5 + Math.sin(angle) * radius,
      timeMs: progress * 1400,
    };
  });
}

function orbitSamples(): SketchSample[] {
  return Array.from({ length: 49 }, (_, index) => {
    const progress = index / 48;
    const angle = progress * Math.PI * 2;
    return {
      x: 0.5 + Math.cos(angle) * 0.35,
      y: 0.5 + Math.sin(angle) * 0.35,
      timeMs: progress * 1200,
    };
  });
}
