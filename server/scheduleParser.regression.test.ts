import { describe, expect, it } from "vitest";
// @ts-expect-error The retained import pipeline is an ESM .mjs module.
import { parseLegacyTsmlSchedule } from "../scripts/legacySchedule.mjs";

describe("legacy schedule repair parser", () => {
  it("decodes the TSML numeric Sunday value before a meeting enters finder storage", () => {
    expect(parseLegacyTsmlSchedule({ day: 0, time: "7:30 pm" }, "Sunday Meeting")).toEqual({
      days: ["sunday"],
      time: "19:30",
    });
  });

  it("uses a verified Daily meeting name when a legacy TSML row lacks day and time values", () => {
    expect(parseLegacyTsmlSchedule({ day: "", time: "" }, "Esihlahleni Tsakane - Daily - 17:30")).toEqual({
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      time: "17:30",
    });
  });
});
