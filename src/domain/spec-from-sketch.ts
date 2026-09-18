import { cleanupSketch } from "./cleanup-sketch";
import type { SketchSample, Spec } from "./spec";

export function specFromSketch(name: string, samples: readonly SketchSample[]): Spec {
  const cleaned = cleanupSketch(samples);

  return {
    version: 1,
    name,
    durationMs: cleaned.durationMs,
    loop: true,
    path: cleaned.path,
  };
}
