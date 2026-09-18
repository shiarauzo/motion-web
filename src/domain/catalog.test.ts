import { describe, expect, it } from "vitest";
import { catalogItem, listCatalog } from "./catalog";
import { serializeSpec } from "./serialize-spec";

describe("catalog", () => {
  it("lists bounce, spiral, and orbit as Specs", () => {
    expect(listCatalog().map((item) => item.name)).toEqual([
      "bounce",
      "spiral",
      "orbit",
    ]);
  });

  it("emits the same Spec shape Copy to agent can serialize", () => {
    const spiral = catalogItem("spiral");

    expect(spiral.version).toBe(1);
    expect(spiral.loop).toBe(true);
    expect(spiral.path.length).toBeGreaterThan(8);
    expect(spiral.path[0]?.t).toBe(0);
    expect(spiral.path[spiral.path.length - 1]?.t).toBe(1);
    expect(serializeSpec(spiral)).toContain('"name": "spiral"');
    expect(serializeSpec(spiral)).toContain("does not name a Target");
  });
});
