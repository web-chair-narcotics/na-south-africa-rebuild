import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public accessibility regression safeguards", () => {
  it("keeps the skip link connected to a focusable main landmark", () => {
    const layout = readFileSync(resolve(process.cwd(), "client/src/components/PublicLayout.tsx"), "utf8");

    expect(layout).toContain('href="#main-content"');
    expect(layout).toContain('<main id="main-content" tabIndex={-1}>');
  });

  it("keeps the meeting finder search input explicitly associated with its label", () => {
    const finder = readFileSync(resolve(process.cwd(), "client/src/components/MeetingFinder.tsx"), "utf8");

    expect(finder).toContain('htmlFor="meeting-search"');
    expect(finder).toContain('id="meeting-search"');
  });
});
