import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { meetingInputSchema } from "./routers/admin";

const meeting = {
  areaId: 1,
  meetingName: "Example NA Meeting",
  daysOfWeek: ["monday"],
  startTime: "19:30",
  meetingType: "Open",
  meetingFormat: "in_person",
};

describe("meeting input validation", () => {
  it("accepts the required meeting data structure", () => {
    expect(meetingInputSchema.safeParse(meeting).success).toBe(true);
  });

  it("rejects an invalid time and empty meeting day list", () => {
    expect(meetingInputSchema.safeParse({ ...meeting, startTime: "25:61" }).success).toBe(false);
    expect(meetingInputSchema.safeParse({ ...meeting, daysOfWeek: [] }).success).toBe(false);
  });

  it("rejects invalid latitude or longitude values", () => {
    expect(meetingInputSchema.safeParse({ ...meeting, latitude: -92 }).success).toBe(false);
    expect(meetingInputSchema.safeParse({ ...meeting, longitude: 190 }).success).toBe(false);
  });

  it("strips physical venue data from every online meeting write", () => {
    const source = readFileSync(resolve(process.cwd(), "server/db.ts"), "utf8");
    expect(source).toContain('const onlineOnly = input.meetingFormat === "online"');
    expect(source).toContain('venueName: onlineOnly ? null');
    expect(source).toContain('streetAddress: onlineOnly ? null');
    expect(source).toContain('latitude: onlineOnly ? null');
    expect(source).toContain('geocodeFormattedAddress: onlineOnly ? null');
  });
});
