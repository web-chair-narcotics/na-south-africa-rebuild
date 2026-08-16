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
  });

  it("lists every verified official booklet, IP, and group-reading destination", () => {
    const catalogue = read("client/src/pages/LiteraturePage.tsx");
    expect(catalogue).toContain("const booklets: LiteratureItem[]");
    expect(catalogue).toContain("const informationPamphlets: LiteratureItem[]");
    expect(catalogue).toContain("const groupReadings: LiteratureItem[]");
    expect(catalogue).toContain("ip-1-who-what-how-and-why");
    expect(catalogue).toContain("ip-30-mental-health-in-recovery");
    expect(catalogue).toContain("how-it-works-group-reading");
    expect(catalogue).toContain("why-are-we-here-group-reading");
    expect(catalogue).toContain("https://na.org/purchase-na-literature/");
    expect(catalogue).toContain('target="_blank" rel="noreferrer"');
  });

  it("retains a traceable source inventory for the South Africa source and official catalogue", () => {
    const inventory = read("LITERATURE_SOURCE_INVENTORY.md");
    expect(inventory).toContain("https://na.org.za/na-literature/");
    expect(inventory).toContain("https://na.org/literature/recovery-literature-in-english-usa/");
    expect(inventory).toContain("IP #30, Mental Health in Recovery");
    expect(inventory).toContain("Why Are We Here?");
  });
});
