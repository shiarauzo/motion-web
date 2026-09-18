import type { PathPoint } from "./spec";

export function pathToSvgD(
  path: readonly PathPoint[],
  width: number,
  height: number,
): string {
  return path
    .map((point, index) => {
      const command = index === 0 ? "M" : "L";
      return `${command} ${(point.x * width).toFixed(2)} ${(point.y * height).toFixed(2)}`;
    })
    .join(" ");
}
