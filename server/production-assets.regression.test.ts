import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("production public asset delivery", () => {
  it("permits HTTPS signed storage targets and relays assets from the same-origin proxy", () => {
    const server = read("server/_core/index.ts");
    const storageProxy = read("server/_core/storageProxy.ts");

    expect(server).toContain("img-src 'self' data: https:");
    expect(server).toContain("registerStorageProxy(app)");
    expect(storageProxy).toContain("const assetResp = await fetch(url)");
    expect(storageProxy).toContain('res.status(200).send(assetBytes)');
  });

  it("uses explicit production-loadable image elements for the shared logo and all five hero routes", () => {
    const layout = read("client/src/components/PublicLayout.tsx");
    const areas = read("client/src/pages/AreaPage.tsx");

    expect(layout).toContain('/manus-storage/na-south-africa-logo_8d811636.png');
    expect(layout).toContain('src={logoUrl}');
    expect(areas).toContain('src={area.imageUrl}');
    expect(areas).toContain('loading="eager"');
    expect(areas).toContain('fetchPriority="high"');
  });
});
