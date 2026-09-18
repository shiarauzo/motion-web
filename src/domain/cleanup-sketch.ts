import type { PathPoint, SketchSample } from "./spec";

const MIN_SAMPLES = 2;
const SMOOTH_WINDOW = 5;
const CLOSE_EPSILON = 0.04;
const MIN_DURATION_MS = 400;

export type CleanedSketch = {
  path: PathPoint[];
  durationMs: number;
};

export function cleanupSketch(samples: readonly SketchSample[]): CleanedSketch {
  if (samples.length < MIN_SAMPLES) {
    throw new Error("Sketch needs at least two samples");
  }

  const sorted = [...samples].sort((left, right) => left.timeMs - right.timeMs);
  const smoothed = movingAverage(sorted, SMOOTH_WINDOW);
  const normalized = normalizeSpace(smoothed);
  const closed = closeLoop(normalized);

  return {
    path: normalizeTime(closed),
    durationMs: Math.round(
      Math.max(MIN_DURATION_MS, closed.at(-1)!.timeMs - closed[0]!.timeMs),
    ),
  };
}

function movingAverage(
  samples: readonly SketchSample[],
  window: number,
): SketchSample[] {
  const radius = Math.floor((window - 1) / 2);

  return samples.map((sample, index) => {
    const from = Math.max(0, index - radius);
    const to = Math.min(samples.length, index + radius + 1);
    let x = 0;
    let y = 0;

    for (let cursor = from; cursor < to; cursor += 1) {
      x += samples[cursor]!.x;
      y += samples[cursor]!.y;
    }

    const count = to - from;
    return { x: x / count, y: y / count, timeMs: sample.timeMs };
  });
}

function normalizeSpace(samples: readonly SketchSample[]): SketchSample[] {
  const xs = samples.map((sample) => sample.x);
  const ys = samples.map((sample) => sample.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const span = Math.max(maxX - minX, maxY - minY, 1);
  const offsetX = (span - (maxX - minX)) / 2;
  const offsetY = (span - (maxY - minY)) / 2;

  return samples.map((sample) => ({
    x: (sample.x - minX + offsetX) / span,
    y: (sample.y - minY + offsetY) / span,
    timeMs: sample.timeMs,
  }));
}

function closeLoop(samples: readonly SketchSample[]): SketchSample[] {
  const first = samples[0]!;
  const last = samples.at(-1)!;
  const distance = Math.hypot(last.x - first.x, last.y - first.y);

  if (distance < CLOSE_EPSILON) {
    return [...samples.slice(0, -1), { x: first.x, y: first.y, timeMs: last.timeMs }];
  }

  const pathLength = samples.reduce((total, sample, index) => {
    if (index === 0) return 0;
    const previous = samples[index - 1]!;
    return total + Math.hypot(sample.x - previous.x, sample.y - previous.y);
  }, 0);
  const elapsed = Math.max(last.timeMs - first.timeMs, 1);
  const speed = pathLength / elapsed;
  const closeMs = speed > 0 ? distance / speed : 80;
  const steps = Math.max(4, Math.ceil(distance / 0.05));
  const closing: SketchSample[] = [];

  for (let step = 1; step <= steps; step += 1) {
    const amount = step / steps;
    closing.push({
      x: last.x + (first.x - last.x) * amount,
      y: last.y + (first.y - last.y) * amount,
      timeMs: last.timeMs + closeMs * amount,
    });
  }

  return [...samples, ...closing];
}

function normalizeTime(samples: readonly SketchSample[]): PathPoint[] {
  const distances = samples.map((sample, index) => {
    if (index === 0) return 0;
    const previous = samples[index - 1]!;
    return Math.hypot(sample.x - previous.x, sample.y - previous.y);
  });
  const total = distances.reduce((sum, distance) => sum + distance, 0);

  if (total === 0) {
    return samples.map((sample, index) => ({
      x: roundUnit(sample.x),
      y: roundUnit(sample.y),
      t: index === 0 ? 0 : 1,
    }));
  }

  let traveled = 0;
  return samples.map((sample, index) => {
    traveled += distances[index]!;
    return {
      x: roundUnit(sample.x),
      y: roundUnit(sample.y),
      t: roundUnit(traveled / total),
    };
  });
}

function roundUnit(value: number): number {
  return Math.round(value * 1e5) / 1e5;
}
