import { describe, expect, it } from "vitest";
import { legacyRouteMap } from "../client/src/legacyRouteMap";

describe("generated legacy route map", () => {
  it("contains concrete destinations for every generated path", () => {
    const destinations = new Set(["/meetings", "/areas", "/about", "/recovery", "/literature", "/contact", "/news", "/404"]);
    const entries = Object.entries(legacyRouteMap);
    expect(entries.length).toBeGreaterThan(1000);
    expect(entries.every(([path, destination]) => path.startsWith("/") && destinations.has(destination))).toBe(true);
  });
});
