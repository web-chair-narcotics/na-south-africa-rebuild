import { TRPCError } from "@trpc/server";
import type { User } from "../drizzle/schema";

export function canAccessArea(user: Pick<User, "role">, assignedAreaIds: number[], areaId: number) {
  return user.role === "admin" || (user.role === "area_admin" && assignedAreaIds.includes(areaId));
}

export function assertCanAccessArea(user: Pick<User, "role">, assignedAreaIds: number[], areaId: number) {
  if (!canAccessArea(user, assignedAreaIds, areaId)) throw new TRPCError({ code: "FORBIDDEN", message: "You do not have permission to access this area." });
}

export function assertNationalAdmin(user: Pick<User, "role">) {
  if (user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN", message: "National administrator access is required." });
}

export function hasCompletedQualityChecks(checks: { addressVerified: boolean; mapPinConfirmed: boolean; spellingChecked: boolean; contactConfirmed: boolean }) {
  return checks.addressVerified && checks.mapPinConfirmed && checks.spellingChecked && checks.contactConfirmed;
}
