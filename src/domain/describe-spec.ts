import type { Spec } from "./spec";

export function describeSpec(spec: Spec): string {
  const motion = spec.name === "sketch" ? "custom path" : spec.name;
  return `A looping ${motion} that lasts ${spec.durationMs} milliseconds. It does not name a Target. Ask which element to apply it to.`;
}
