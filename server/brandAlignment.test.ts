import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, it } from "vitest";

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap(name => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? sourceFiles(path) : /\.(tsx|ts|css|html)$/.test(name) ? [path] : [];
  });
}

describe("uploaded NA brand alignment", () => {
  it("retains the supplied source palette and typography across the client system", () => {
    const source = sourceFiles(resolve(process.cwd(), "client/src")).map(path => readFileSync(path, "utf8")).join("\n");

    for (const token of ["#085C84", "#2F9B3E", "#54595F", "#7A7A7A", "#387CBB", "#20752C", "#F8F8F8", "#EEEEEE", "#AAAAAA", "Gelasio", "Neuton", "Roboto"]) {
      expect(source).toContain(token);
    }
  });

  it("does not retain the former green page-level tokens in client source", () => {
    const source = sourceFiles(resolve(process.cwd(), "client/src")).map(path => readFileSync(path, "utf8")).join("\n");
    for (const legacyToken of ["#142d2a", "#145044", "#0f3e35", "#0f584a", "#2e6756", "#e6eee3", "#d7dfd5"]) {
      expect(source.toLowerCase()).not.toContain(legacyToken.toLowerCase());
    }
  });
});
