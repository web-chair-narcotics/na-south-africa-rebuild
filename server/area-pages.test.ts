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
      "/manus-storage/na-region-south-africa-hero_03348d2b.webp",
      "/manus-storage/na-area-johannesburg-hero_c81eaedf.webp",
      "/manus-storage/na-area-cape-town-hero_2c81ddbc.webp",
      "/manus-storage/na-area-pretoria-hero_5bad0679.webp",
      "/manus-storage/na-area-kwazulu-natal-hero_792f5d0c.webp",
    ]) expect(page).toContain(asset);
    expect(page).toContain("backgroundImage");
    expect(page).toContain("A distinct NA South Africa site");
  });
});
