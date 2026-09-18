import { describe, expect, it } from "vitest";
import { describeSpec } from "./describe-spec";
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

describe("describeSpec", () => {
  it("names a Catalog Motion without a Target", () => {
    expect(describeSpec(bounce)).toBe(
      "A looping bounce that lasts 800 milliseconds. It does not name a Target. Ask which element to apply it to.",
    );
  });

  it("calls a Sketch a custom path", () => {
    expect(describeSpec({ ...bounce, name: "sketch", durationMs: 400 })).toBe(
      "A looping custom path that lasts 400 milliseconds. It does not name a Target. Ask which element to apply it to.",
    );
  });
});
