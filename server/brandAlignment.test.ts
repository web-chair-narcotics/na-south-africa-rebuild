import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("legacy NA brand alignment", () => {
  it("retains the supplied source palette and typography in the global stylesheet", () => {
    const stylesheet = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");

    for (const token of ["#085C84", "#2F9B3E", "#54595F", "#F8F8F8", "#EEEEEE", "#AAAAAA", "Gelasio", "Neuton", "Roboto"]) {
      expect(stylesheet).toContain(token);
    }
  });
});
