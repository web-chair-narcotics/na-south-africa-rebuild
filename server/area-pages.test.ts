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

  it("keeps each area page connected to a verified directory name", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/AreaPage.tsx"), "utf8");
    expect(page).toContain('directoryName: "Johannesburg"');
    expect(page).toContain('directoryName: "Western Cape"');
    expect(page).toContain('directoryName: "Pretoria"');
    expect(page).toContain('directoryName: "KwaZulu-Natal"');
    expect(page).toContain("imagePromptFile");
  });
});
