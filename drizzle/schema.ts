import { boolean, decimal, index, int, mysqlEnum, mysqlTable, text, timestamp, uniqueIndex, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "area_admin", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const areas = mysqlTable("areas", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 80 }).notNull(),
  name: varchar("name", { length: 160 }).notNull(),
  province: varchar("province", { length: 120 }),
  publicDescription: text("publicDescription"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [uniqueIndex("areas_slug_unique").on(table.slug)]);

export const userAreas = mysqlTable("userAreas", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  areaId: int("areaId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [
  uniqueIndex("user_areas_user_area_unique").on(table.userId, table.areaId),
  index("user_areas_user_idx").on(table.userId),
  index("user_areas_area_idx").on(table.areaId),
]);

export const contentPages = mysqlTable("contentPages", {
  id: int("id").autoincrement().primaryKey(),
  areaId: int("areaId"),
  slug: varchar("slug", { length: 180 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  excerpt: text("excerpt"),
  body: text("body").notNull(),
  status: mysqlEnum("status", ["draft", "submitted", "published", "archived"]).default("draft").notNull(),
  createdByUserId: int("createdByUserId"),
  reviewedByUserId: int("reviewedByUserId"),
  publishedAt: timestamp("publishedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  uniqueIndex("content_pages_area_slug_unique").on(table.areaId, table.slug),
  index("content_pages_status_idx").on(table.status),
]);

export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  recipientUserId: int("recipientUserId").notNull(),
  areaId: int("areaId"),
  kind: varchar("kind", { length: 80 }).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  entityType: varchar("entityType", { length: 80 }),
  entityId: int("entityId"),
  readAt: timestamp("readAt"),
  emailDeliveryStatus: mysqlEnum("emailDeliveryStatus", ["not_configured", "queued", "sent", "failed"]).default("not_configured").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("notifications_recipient_read_idx").on(table.recipientUserId, table.readAt)]);

export const meetingFormatValues = ["in_person", "online", "hybrid"] as const;
export const meetingStatusValues = ["draft", "submitted", "changes_requested", "published", "archived"] as const;

export const meetings = mysqlTable("meetings", {
  id: int("id").autoincrement().primaryKey(),
  areaId: int("areaId").notNull(),
  meetingName: varchar("meetingName", { length: 255 }).notNull(),
  venueName: varchar("venueName", { length: 255 }),
  streetAddress: varchar("streetAddress", { length: 255 }),
  suburb: varchar("suburb", { length: 160 }),
  city: varchar("city", { length: 160 }),
  province: varchar("province", { length: 120 }),
  latitude: decimal("latitude", { precision: 10, scale: 7 }),
  longitude: decimal("longitude", { precision: 10, scale: 7 }),
  daysOfWeek: text("daysOfWeek").notNull(),
  startTime: varchar("startTime", { length: 5 }).notNull(),
  meetingType: varchar("meetingType", { length: 100 }).notNull(),
  meetingFormat: mysqlEnum("meetingFormat", meetingFormatValues).default("in_person").notNull(),
  contactPerson: varchar("contactPerson", { length: 160 }),
  phone: varchar("phone", { length: 64 }),
  specialNotes: text("specialNotes"),
  onlineUrl: varchar("onlineUrl", { length: 1024 }),
  status: mysqlEnum("status", meetingStatusValues).default("draft").notNull(),
  sourceUrl: varchar("sourceUrl", { length: 1024 }),
  sourceNote: text("sourceNote"),
  geocodeFormattedAddress: varchar("geocodeFormattedAddress", { length: 512 }),
  geocodePlaceId: varchar("geocodePlaceId", { length: 255 }),
  addressVerified: boolean("addressVerified").default(false).notNull(),
  mapPinConfirmed: boolean("mapPinConfirmed").default(false).notNull(),
  spellingChecked: boolean("spellingChecked").default(false).notNull(),
  contactConfirmed: boolean("contactConfirmed").default(false).notNull(),
  reviewNotes: text("reviewNotes"),
  reviewedByUserId: int("reviewedByUserId"),
  reviewedAt: timestamp("reviewedAt"),
  revision: int("revision").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, table => [
  index("meetings_area_status_idx").on(table.areaId, table.status),
  index("meetings_status_time_idx").on(table.status, table.startTime),
  index("meetings_type_idx").on(table.meetingType),
]);

export const auditEvents = mysqlTable("auditEvents", {
  id: int("id").autoincrement().primaryKey(),
  actorUserId: int("actorUserId"),
  areaId: int("areaId"),
  entityType: varchar("entityType", { length: 80 }).notNull(),
  entityId: int("entityId").notNull(),
  action: varchar("action", { length: 120 }).notNull(),
  detail: text("detail"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
}, table => [index("audit_events_entity_idx").on(table.entityType, table.entityId)]);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Area = typeof areas.$inferSelect;
export type Meeting = typeof meetings.$inferSelect;
export type ContentPage = typeof contentPages.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type MeetingStatus = (typeof meetingStatusValues)[number];
export type MeetingFormat = (typeof meetingFormatValues)[number];
