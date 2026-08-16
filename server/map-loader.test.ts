import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("managed Maps loader safeguards", () => {
  it("waits for the Map constructor and retries transient loader failures before showing fallback", () => {
    const source = readFileSync(resolve(process.cwd(), "client/src/components/Map.tsx"), "utf8");

    expect(source).toContain("window.google?.maps?.Map");
    expect(source).toContain('script[data-na-maps-loader="true"]');
    expect(source).toContain("scriptPromise = null");
    expect(source).toContain("retryCount.current < 2");
    expect(source).toContain("retryCount.current * 900");
    expect(source).toContain("Google Maps fallback");
    expect(source).toContain("https://www.google.com/maps/search/?api=1");
    expect(source).toContain("https://www.google.com/maps?q=");
    expect(source).toContain("const fallbackCenter = firstPoint");
  });
});
