import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("managed Maps loader safeguards", () => {
  it("waits for the Map constructor and removes stale loader scripts before retrying", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");

    expect(source).toContain("window.google?.maps?.Map");
    expect(source).toContain('script[data-na-maps-loader="true"]');
    expect(source).toContain("scriptPromise = null");
  });
});
