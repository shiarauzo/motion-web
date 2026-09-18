import { describe, expect, it } from "vitest";
import { pointAtTime } from "./point-at-time";
import type { PathPoint } from "./spec";

const path: PathPoint[] = [
  { x: 0, y: 0, t: 0 },
  { x: 1, y: 0, t: 0.25 },
  { x: 1, y: 1, t: 1 },
];

describe("pointAtTime", () => {
  it("holds the first point at t 0 and the last point at t 1", () => {
    expect(pointAtTime(path, 0)).toEqual({ x: 0, y: 0 });
    expect(pointAtTime(path, 1)).toEqual({ x: 1, y: 1 });
  });

  it("uses Spec time, not path length", () => {
    expect(pointAtTime(path, 0.125)).toEqual({ x: 0.5, y: 0 });
    expect(pointAtTime(path, 0.625).x).toBe(1);
    expect(pointAtTime(path, 0.625).y).toBeCloseTo(0.5);
  });
});
