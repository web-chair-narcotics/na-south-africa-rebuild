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
