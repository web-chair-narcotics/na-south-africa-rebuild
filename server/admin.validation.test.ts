import { describe, expect, it } from "vitest";
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
});
