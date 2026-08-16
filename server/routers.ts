import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { getPublicAreas, getPublicMeeting, searchPublicMeetings } from "./db";
import { makeRequest, type GeocodingResult } from "./_core/map";
import { adminRouter } from "./routers/admin";

const dayValues = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const formatValues = ["in_person", "online", "hybrid"] as const;

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  finder: router({
    areas: publicProcedure.query(() => getPublicAreas()),
    detail: publicProcedure.input(z.object({ id: z.number().int().positive() })).query(({ input }) => getPublicMeeting(input.id)),
    search: publicProcedure.input(z.object({
      query: z.string().trim().max(120).optional(),
      areaSlug: z.string().trim().max(80).optional(),
      day: z.enum(dayValues).optional(),
      timeOfDay: z.enum(["morning", "afternoon", "evening"]).optional(),
      meetingType: z.string().trim().max(100).optional(),
      meetingFormat: z.enum(formatValues).optional(),
      page: z.number().int().min(1).default(1),
      pageSize: z.number().int().min(1).max(25).default(10),
    }).optional()).query(({ input }) => searchPublicMeetings({ page: input?.page ?? 1, pageSize: input?.pageSize ?? 10, ...input })),
    validateAddress: publicProcedure.input(z.object({ address: z.string().trim().min(8).max(500) })).query(async ({ input }) => {
      const response = await makeRequest<GeocodingResult>("/maps/api/geocode/json", { address: input.address, region: "za" });
      const match = response.results[0];
      return match ? { matched: true, formattedAddress: match.formatted_address, placeId: match.place_id, latitude: match.geometry.location.lat, longitude: match.geometry.location.lng } : { matched: false };
    }),
  }),
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
