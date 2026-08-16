import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("dedicated area websites", () => {
  it("registers the four requested area routes", () => {
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    for (const slug of ["johannesburg", "cape-town", "pretoria", "kwazulu-natal"]) {
      expect(app).toContain(`/areas/${slug}`);
    }
  });

  it("registers the published-only meeting detail journey", () => {
    const app = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    const router = readFileSync(resolve(process.cwd(), "server/routers.ts"), "utf8");
    const finder = readFileSync(resolve(process.cwd(), "client/src/components/MeetingFinder.tsx"), "utf8");

    expect(app).toContain('path="/meetings/:id"');
    expect(router).toContain("detail: publicProcedure");
    expect(finder).toContain("/meetings/${meeting.id}");
  });

  it("keeps each area page connected to a verified directory name", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/AreaPage.tsx"), "utf8");
    expect(page).toContain('directoryName: "Johannesburg"');
    expect(page).toContain('directoryName: "Western Cape"');
    expect(page).toContain('directoryName: "Pretoria"');
    expect(page).toContain('directoryName: "KwaZulu-Natal"');
    expect(page).toContain("imagePromptFile");
  });

  it("preserves full-bleed, route-specific hero treatment for all five websites", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/AreaPage.tsx"), "utf8");
    for (const asset of [
      "/manus-storage/na-region-hero-replacement-20260816_e5e6151e.jpg",
      "/manus-storage/na-johannesburg-hero-replacement-20260816_84890cad.jpg",
      "/manus-storage/na-cape-town-hero-replacement-20260816_7bd0ee83.jpg",
      "/manus-storage/na-pretoria-hero-replacement-20260816_0d9d9652.jpg",
      "/manus-storage/na-kwazulu-natal-hero-replacement-20260816_87880270.jpg",
    ]) expect(page).toContain(asset);
    expect(page).toContain('src={area.imageUrl}');
    expect(page).toContain('loading="eager"');
    expect(page).toContain('fetchPriority="high"');
    expect(page).toContain("A distinct NA South Africa site");
    expect(page).toContain('linear-gradient(90deg,rgba(8,92,132,.72)');
    expect(page).not.toContain('linear-gradient(90deg,rgba(8,92,132,.94)');
  });
});
