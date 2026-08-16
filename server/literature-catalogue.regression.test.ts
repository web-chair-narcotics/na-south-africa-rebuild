import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("public literature catalogue safeguards", () => {
  it("routes both public literature URLs to the complete catalogue", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('import LiteraturePage from "./pages/LiteraturePage"');
    expect(app).toContain('<Route path="/literature" component={LiteraturePage} />');
    expect(app).toContain('<Route path="/na-literature" component={LiteraturePage} />');
    expect(app).toContain('<Route path="/literature/:slug">');
    expect(app).toContain('import LiteratureDetail from "./pages/LiteratureDetail"');
  });

  it("uses the complete uploaded PDF manifest and opens detail pages in a new tab", () => {
    const catalogue = read("client/src/pages/LiteraturePage.tsx");
    const manifest = read("client/src/data/literatureManifest.ts");
    const detail = read("client/src/pages/LiteratureDetail.tsx");
    expect(manifest).toContain("export const literatureManifest");
    expect((manifest.match(/\"downloadUrl\":/g) ?? []).length).toBe(56);
    expect(manifest).toContain("in-times-of-illness-in-times-of-illness");
    expect(manifest).toContain("/manus-storage/IP-1-Who-What-How-and-Why_8c3226a6.pdf");
    expect(manifest).toContain("/manus-storage/2306_PRMAT_2023_3601eb02.pdf");
    expect(catalogue).toContain("literatureManifest.length");
    expect(catalogue).toContain("target=\"_blank\" rel=\"noreferrer\"");
    expect(detail).toContain("Download PDF");
    expect(detail).toContain("item.downloadUrl");
  });

  it("retains a traceable source inventory for the South Africa source and official catalogue", () => {
    const inventory = read("LITERATURE_SOURCE_INVENTORY.md");
    expect(inventory).toContain("https://na.org.za/na-literature/");
    expect(inventory).toContain("https://na.org/literature/recovery-literature-in-english-usa/");
    expect(inventory).toContain("IP #30, Mental Health in Recovery");
    expect(inventory).toContain("Why Are We Here?");
  });
});
