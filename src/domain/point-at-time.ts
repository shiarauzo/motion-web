import type { PathPoint } from "./spec";

export function pointAtTime(
  path: readonly PathPoint[],
  t: number,
): { x: number; y: number } {
  if (path.length === 0) return { x: 0.5, y: 0.5 };

  const first = path[0]!;
  const last = path.at(-1)!;
  if (path.length === 1 || t <= 0) return { x: first.x, y: first.y };
  if (t >= 1) return { x: last.x, y: last.y };

  for (let index = 0; index < path.length - 1; index += 1) {
    const start = path[index]!;
    const end = path[index + 1]!;
    if (t > end.t) continue;
    const span = Math.max(end.t - start.t, 1e-9);
    const amount = (t - start.t) / span;
    return {
      x: start.x + (end.x - start.x) * amount,
      y: start.y + (end.y - start.y) * amount,
    };
  }

  return { x: last.x, y: last.y };
}
