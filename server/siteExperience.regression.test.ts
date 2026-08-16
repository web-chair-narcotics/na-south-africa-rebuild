import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("five-site experience safeguards", () => {
  it("keeps a regional route alongside all four area routes", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('/areas/south-africa-region');
    for (const slug of ["johannesburg", "cape-town", "pretoria", "kwazulu-natal"]) expect(app).toContain(`/areas/${slug}`);
  });

  it("keeps homepage shortcuts actionable", () => {
    const home = read("client/src/pages/Home.tsx");
    expect(home).toContain('href: "/meetings"');
    expect(home).toContain('href: "tel:+27861006962"');
    expect(home).toContain('href: "/recovery"');
    expect(home).toContain("Take this step");
  });

  it("keeps emergency notices independent of meeting status", () => {
    const schema = read("drizzle/schema.ts");
    const admin = read("server/routers/admin.ts");
    const layout = read("client/src/components/PublicLayout.tsx");
    const adminUi = read("client/src/pages/AdminPortal.tsx");
    expect(schema).toContain('mysqlTable("emergencyNotices"');
    expect(admin).toContain("emergency: router");
    expect(layout).toContain('trpc.emergency.active.useQuery()');
    expect(layout).toContain('role="alert"');
    expect(adminUi).toContain("It does not publish, reactivate, or change any meeting record.");
  });

  it("keeps the five image filenames and acceptance contract traceable", () => {
    const prompts = read("AREA_SITE_IMAGE_PROMPTS.md");
    for (const filename of [
      "na-region-south-africa-hero.webp",
      "na-area-johannesburg-hero.webp",
      "na-area-cape-town-hero.webp",
      "na-area-pretoria-hero.webp",
      "na-area-kwazulu-natal-hero.webp",
    ]) expect(prompts).toContain(filename);
    expect(prompts).toContain("2400 × 1350 px");
    expect(prompts).toContain("left third");
  });
});
