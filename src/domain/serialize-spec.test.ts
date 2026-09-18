import { describe, expect, it } from "vitest";
import { serializeSpec } from "./serialize-spec";
import type { Spec } from "./spec";

const bounce: Spec = {
  version: 1,
  name: "bounce",
  durationMs: 800,
  loop: true,
  path: [
    { x: 0.5, y: 0, t: 0 },
    { x: 0.5, y: 1, t: 1 },
  ],
};

describe("serializeSpec", () => {
  it("includes the Spec JSON and forbids inventing a Target", () => {
    const text = serializeSpec(bounce);

    expect(text).toContain("Motion Spec v1");
    expect(text).toContain('"name": "bounce"');
    expect(text).toContain('"durationMs": 800');
    expect(text).toContain("does not name a Target");
    expect(text).toContain("Ask which element to apply it to");
    expect(text).not.toContain("querySelector");
    expect(text).not.toContain("img.hero");
  });
});
