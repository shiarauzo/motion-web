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

  it("spaces time by path distance so a rushed segment does not stay a spike", () => {
    const cleaned = cleanupSketch([
      { x: 0, y: 0, timeMs: 0 },
      { x: 25, y: 0, timeMs: 4 },
      { x: 50, y: 0, timeMs: 8 },
      { x: 75, y: 0, timeMs: 12 },
      { x: 100, y: 0, timeMs: 16 },
      { x: 125, y: 0, timeMs: 80 },
      { x: 150, y: 0, timeMs: 160 },
      { x: 175, y: 0, timeMs: 240 },
      { x: 200, y: 0, timeMs: 320 },
    ]);
    const mid = cleaned.path.find((point) => point.x > 0.45 && point.x < 0.55);

    expect(mid?.t).toBeGreaterThan(0.2);
    expect(mid?.t).toBeLessThan(0.3);
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
