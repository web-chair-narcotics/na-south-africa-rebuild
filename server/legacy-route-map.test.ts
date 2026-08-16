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


  it("preserves online and in-person directory intent for every site path", async () => {
    const { getLegacyDestination } = await import("../client/src/pages/LegacyRouteRedirect");
    expect(getLegacyDestination("/online-meetings/")).toBe("/meetings?meetingFormat=online");
    expect(getLegacyDestination("/jhb/online-meetings/")).toBe("/meetings?meetingFormat=online");
    expect(getLegacyDestination("/pta/online-meetings/")).toBe("/meetings?meetingFormat=online");
    expect(getLegacyDestination("/wc/online-meetings/")).toBe("/meetings?meetingFormat=online");
    expect(getLegacyDestination("/kzn/online-meetings/")).toBe("/meetings?meetingFormat=online");
    expect(getLegacyDestination("/in-person-meetings/")).toBe("/meetings?meetingFormat=in_person");
    expect(getLegacyDestination("/wc/in-person-meetings/")).toBe("/meetings?meetingFormat=in_person");
  });
