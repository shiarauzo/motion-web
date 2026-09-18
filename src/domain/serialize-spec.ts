import type { Spec } from "./spec";

export function serializeSpec(spec: Spec): string {
  return [
    "Motion Spec v1",
    "",
    "This Spec describes a looping Motion only.",
    "It does not name a Target.",
    "Ask which element to apply it to, then replay this path as a loop.",
    "",
    `Name: ${spec.name}`,
    `Duration: ${spec.durationMs}ms`,
    "Loop: true",
    "",
    "```json",
    JSON.stringify(spec, null, 2),
    "```",
  ].join("\n");
}
