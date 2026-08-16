import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("public meeting visibility regression safeguards", () => {
  it("uses the same published and active-area condition for results, totals, and map points", () => {
    const source = readFileSync(resolve(process.cwd(), "server/db.ts"), "utf8");

    expect(source).toContain('const conditions = [eq(meetings.status, "published"), eq(areas.active, true)]');
    expect(source).toContain('from.where(where).orderBy');
    expect(source).toContain('.where(where),');
    expect(source).toContain('.where(and(where, isNotNull(meetings.latitude), isNotNull(meetings.longitude)))');
  });

  it("does not expose archived meeting-detail records as a false current meeting", () => {
    const source = readFileSync(resolve(process.cwd(), "server/db.ts"), "utf8");

    expect(source).toContain('eq(meetings.id, id), eq(meetings.status, "published"), eq(areas.active, true)');
  });
});
