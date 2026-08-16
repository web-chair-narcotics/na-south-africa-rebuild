import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const readClient = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("public accessibility regression safeguards", () => {
  it("keeps the skip link connected to a focusable main landmark", () => {
    const layout = readClient("client/src/components/PublicLayout.tsx");

    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('<main id="main-content" tabIndex={-1}>');
  });

  it("keeps the meeting finder search input explicitly associated with its label", () => {
    const finder = readClient("client/src/components/MeetingFinder.tsx");

    expect(finder).toContain('htmlFor="meeting-search"');
    expect(finder).toContain('id="meeting-search"');
  });

  it("preserves keyboard-reachable navigation and primary actions across updated routes", () => {
    const routes = [
      readClient("client/src/components/PublicLayout.tsx"),
      readClient("client/src/index.css"),
      readClient("client/src/pages/Home.tsx"),
      readClient("client/src/pages/Meetings.tsx"),
      readClient("client/src/pages/MeetingDetail.tsx"),
      readClient("client/src/pages/AreaPage.tsx"),
      readClient("client/src/pages/AdminPortal.tsx"),
    ].join("\n");

    expect(routes).toContain("focus-visible:ring-2");
    expect(routes).toContain('aria-label={menuOpen ? "Close navigation" : "Open navigation"}');
    expect(routes).toContain('aria-controls="mobile-navigation"');
    expect(routes).toContain('href="/meetings"');
    expect(routes).toContain('href="/about"');
    expect(routes).toContain('href="/recovery"');
    expect(routes).toContain('href="/literature"');
    expect(routes).toContain('href="/areas"');
    expect(routes).toContain('href="/contact"');
    expect(routes).not.toContain('href="/admin"');
    expect(routes).toContain("Johannesburg");
    expect(routes).toContain("Find a meeting");
    expect(routes).toContain("Get exact Google Maps directions");
  });
});
