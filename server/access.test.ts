import { describe, expect, it } from "vitest";
import { canAccessArea, hasCompletedQualityChecks } from "./access";

describe("area-scoped access", () => {
  it("allows a national administrator to access every area", () => {
    expect(canAccessArea({ role: "admin" }, [], 999)).toBe(true);
  });

  it("allows an area administrator to access an assigned area only", () => {
    expect(canAccessArea({ role: "area_admin" }, [4, 8], 4)).toBe(true);
    expect(canAccessArea({ role: "area_admin" }, [4, 8], 3)).toBe(false);
  });

  it("does not grant ordinary users area access", () => {
    expect(canAccessArea({ role: "user" }, [4], 4)).toBe(false);
  });
});

describe("national quality gate", () => {
  it("requires every exact QA item before publication", () => {
    expect(hasCompletedQualityChecks({ addressVerified: true, mapPinConfirmed: true, spellingChecked: true, contactConfirmed: true })).toBe(true);
    expect(hasCompletedQualityChecks({ addressVerified: true, mapPinConfirmed: true, spellingChecked: false, contactConfirmed: true })).toBe(false);
  });
});
