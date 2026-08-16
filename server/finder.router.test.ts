import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  getPublicAreas: vi.fn(),
  searchPublicMeetings: vi.fn(),
}));

vi.mock("./db", () => ({
  getPublicAreas: mocks.getPublicAreas,
  searchPublicMeetings: mocks.searchPublicMeetings,
}));

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const ctx = {
  user: null,
  req: { protocol: "https", headers: {} },
  res: { clearCookie: vi.fn() },
} as unknown as TrpcContext;

describe("finder.search", () => {
  beforeEach(() => {
    mocks.searchPublicMeetings.mockReset();
    mocks.searchPublicMeetings.mockResolvedValue({ items: [], mapPoints: [], total: 0 });
  });

  it("uses safe defaults for a public meeting search", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.finder.search();
    expect(mocks.searchPublicMeetings).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  });

  it("forwards area, day, type, format, and page filters to the published-directory query", async () => {
    const caller = appRouter.createCaller(ctx);
    await caller.finder.search({ areaSlug: "johannesburg", day: "monday", meetingType: "Open", meetingFormat: "in_person", page: 2, pageSize: 25 });
    expect(mocks.searchPublicMeetings).toHaveBeenCalledWith({ areaSlug: "johannesburg", day: "monday", meetingType: "Open", meetingFormat: "in_person", page: 2, pageSize: 25 });
  });

  it("rejects invalid pagination and meeting-format values", async () => {
    const caller = appRouter.createCaller(ctx);
    await expect(caller.finder.search({ page: 0 })).rejects.toThrow();
    await expect(caller.finder.search({ meetingFormat: "unknown" as "in_person" })).rejects.toThrow();
  });
});
