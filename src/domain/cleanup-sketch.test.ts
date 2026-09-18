import { describe, expect, it } from "vitest";
import { cleanupSketch } from "./cleanup-sketch";

describe("cleanupSketch", () => {
  it("rejects a Sketch with fewer than two samples", () => {
    expect(() =>
      cleanupSketch([{ x: 0, y: 0, timeMs: 0 }]),
    ).toThrowError("Sketch needs at least two samples");
  });

  it("normalizes time from 0 to 1 and closes the loop", () => {
    const cleaned = cleanupSketch([
      { x: 0, y: 0, timeMs: 0 },
      { x: 100, y: 0, timeMs: 100 },
      { x: 100, y: 80, timeMs: 200 },
    ]);
    const first = cleaned.path[0];
    const last = cleaned.path[cleaned.path.length - 1];

    expect(first).toMatchObject({ t: 0 });
    expect(last).toMatchObject({ t: 1 });
    expect(last?.x).toBeCloseTo(first?.x ?? -1, 3);
    expect(last?.y).toBeCloseTo(first?.y ?? -1, 3);
    expect(cleaned.durationMs).toBeGreaterThanOrEqual(400);
  });

  it("keeps a horizontal stroke horizontal after space normalize", () => {
    const cleaned = cleanupSketch([
      { x: 10, y: 40, timeMs: 0 },
      { x: 110, y: 40, timeMs: 120 },
    ]);
    const ys = cleaned.path.map((point) => point.y);
    const spanY = Math.max(...ys) - Math.min(...ys);

    expect(spanY).toBeLessThan(0.2);
  });

  it("reduces jitter on a noisy straight stroke", () => {
    const cleaned = cleanupSketch([
      { x: 0, y: 0, timeMs: 0 },
      { x: 20, y: 12, timeMs: 40 },
      { x: 40, y: -12, timeMs: 80 },
      { x: 60, y: 12, timeMs: 120 },
      { x: 80, y: 0, timeMs: 160 },
    ]);
    const outgoing = cleaned.path.filter((point) => point.t <= 0.5);
    const peak = Math.max(...outgoing.map((point) => Math.abs(point.y - outgoing[0]!.y)));

    expect(peak).toBeLessThan(0.35);
  });
});
