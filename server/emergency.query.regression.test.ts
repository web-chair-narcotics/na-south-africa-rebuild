import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const dbSource = readFileSync(new URL("./db.ts", import.meta.url), "utf8");
const routerSource = readFileSync(new URL("./routers.ts", import.meta.url), "utf8");
const publicLayoutSource = readFileSync(new URL("../client/src/components/PublicLayout.tsx", import.meta.url), "utf8");

describe("emergency.active query contract", () => {
  it("returns null when the database is unavailable or no active notice exists", () => {
    expect(dbSource).toContain("if (!db) return null");
    expect(dbSource).toContain(".limit(1))[0] ?? null");
  });

  it("keeps the public tRPC procedure wired to the defined helper", () => {
    expect(routerSource).toContain("active: publicProcedure.query(() => getActiveEmergencyNotice())");
  });

  it("renders no banner for the empty null state and renders notice fields when present", () => {
    expect(publicLayoutSource).toContain("{emergencyNotice && (");
    expect(publicLayoutSource).toContain("emergencyNotice.title");
    expect(publicLayoutSource).toContain("emergencyNotice.message");
  });
});
