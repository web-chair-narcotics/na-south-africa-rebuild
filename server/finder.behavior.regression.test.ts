import { describe, expect, it } from "vitest";
import { searchPublicMeetings } from "./db";

describe("published finder behavioural regression safeguards", () => {
  it("returns the repaired Daily meeting when visitors filter for Sunday", async () => {
    const result = await searchPublicMeetings({ day: "sunday", page: 1, pageSize: 25 });

    expect(result.total).toBeGreaterThanOrEqual(34);
    expect(result.items).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 328, meetingName: "Esihlahleni Tsakane - Daily - 17:30" }),
    ]));
  });

  it("keeps the repaired meeting discoverable under its area and meeting-type filters", async () => {
    const byArea = await searchPublicMeetings({ areaSlug: "johannesburg", day: "sunday", page: 1, pageSize: 25 });
    const byType = await searchPublicMeetings({ day: "sunday", meetingType: "Basic Text, Open", page: 1, pageSize: 25 });

    const target = expect.objectContaining({ id: 328, meetingName: "Esihlahleni Tsakane - Daily - 17:30" });
    expect(byArea.items).toEqual(expect.arrayContaining([target]));
    expect(byType.items).toEqual(expect.arrayContaining([target]));
  });

  it("keeps Sunday pagination stable without dropping or duplicating published results", async () => {
    const first = await searchPublicMeetings({ day: "sunday", page: 1, pageSize: 25 });
    const second = await searchPublicMeetings({ day: "sunday", page: 2, pageSize: 25 });
    const firstIds = new Set(first.items.map(item => item.id));

    expect(first.total).toBeGreaterThan(first.items.length);
    expect(second.items.length).toBe(first.total - first.items.length);
    expect(second.items.every(item => !firstIds.has(item.id))).toBe(true);
  });
});


  it("keeps online-only meetings out of the physical map result while retaining physical and hybrid points", async () => {
    const online = await searchPublicMeetings({ meetingFormat: "online", page: 1, pageSize: 100 });
    expect(online.items.length).toBeGreaterThan(0);
    expect(online.items.every(item => item.meetingFormat === "online")).toBe(true);
    expect(online.mapPoints).toHaveLength(0);

    const physical = await searchPublicMeetings({ meetingFormat: "in_person", page: 1, pageSize: 100 });
    expect(physical.items.length).toBeGreaterThan(0);
    expect(physical.items.every(item => item.meetingFormat === "in_person")).toBe(true);
    expect(physical.mapPoints.every(point => point.meetingFormat === "in_person" || point.meetingFormat === "hybrid")).toBe(true);
  });

  it("keeps inactive records out of public search regardless of their format", async () => {
    const formats = ["in_person", "online", "hybrid"] as const;
    for (const meetingFormat of formats) {
      const result = await searchPublicMeetings({ meetingFormat, page: 1, pageSize: 1000 });
      expect(result.items.every(item => item.meetingFormat === meetingFormat)).toBe(true);
      expect(result.items.every(item => !("inactive" in item))).toBe(true);
    }
  });
