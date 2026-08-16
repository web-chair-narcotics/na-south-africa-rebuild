import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

type LiveRow = { id?: number; name?: string; day?: number | string; time?: string; attendance_option?: string; feed_site?: string; region?: string; url?: string; slug?: string; updated?: string };
type DbRow = { id: number; meetingName: string; daysOfWeek: string; startTime: string; meetingFormat: string; status: string; sourceUrl: string | null };

const root = "/home/ubuntu/na-south-africa-rebuild";
const report = JSON.parse(fs.readFileSync(path.join(root, "LIVE_PARITY_AUDIT_REPORT.json"), "utf8"));
const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const norm = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const dayFromLive = (value: unknown) => {
  const normalized = norm(value);
  return normalized === "daily" || normalized === "every day" || normalized === "undefined" ? "daily" : dayNames[Number(value)] ?? normalized;
};
const daysFromDb = (value: string) => { try { return JSON.parse(value || "[]") as string[]; } catch { return []; } };
const liveDay = (row: LiveRow) => /\bdaily\b/i.test(String(row.name ?? "")) && !norm(row.day) ? "daily" : dayFromLive(row.day);
const liveTime = (row: LiveRow) => {
  const direct = norm(row.time);
  if (direct) return direct;
  const encoded = String(row.name ?? "").match(/-\s*(\d{1,2}:\d{2})\s*$/);
  return encoded?.[1] ?? "";
};
const liveKey = (row: LiveRow) => `${norm(row.name)}|${liveDay(row)}|${liveTime(row)}`;
const dbKey = (row: DbRow) => {
  const days = daysFromDb(row.daysOfWeek);
  const canonicalDay = days.length === 7 ? "daily" : days[0] ?? "";
  return `${norm(row.meetingName)}|${canonicalDay}|${norm(row.startTime)}`;
};
const mapFormat = (attendance: unknown) => norm(attendance) === "in_person" ? "in_person" : norm(attendance) === "online" ? "online" : norm(attendance) === "hybrid" ? "hybrid" : "inactive";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is unavailable");
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const [records] = await connection.query<mysql.RowDataPacket[]>("SELECT id, meetingName, daysOfWeek, startTime, meetingFormat, status, sourceUrl FROM meetings ORDER BY id");
  await connection.end();
  const dbRows = records as DbRow[];
  const liveRows = (report.liveUniqueRows as LiveRow[]);
  const liveByKey = new Map(liveRows.map(row => [liveKey(row), row]));
  const dbByKey = new Map(dbRows.map(row => [dbKey(row), row]));
  const liveOnly = [...liveByKey.entries()].filter(([key]) => !dbByKey.has(key)).map(([, row]) => row);
  const dbOnly = [...dbByKey.entries()].filter(([key]) => !liveByKey.has(key)).map(([, row]) => row);
  const matched = [...liveByKey.entries()].flatMap(([key, live]) => {
    const db = dbByKey.get(key);
    return db ? [{ key, live, db, liveCategory: mapFormat(live.attendance_option), dbCategory: db.status === "published" ? db.meetingFormat : "inactive" }] : [];
  });
  const categoryConflicts = matched.filter(match => match.liveCategory !== match.dbCategory);
  const dailyDiagnostics = {
    live: liveRows.filter(row => /esihlahleni tsakane/i.test(String(row.name ?? ""))).map(row => ({ name: row.name, day: row.day, time: row.time, derivedTime: liveTime(row), key: liveKey(row) })),
    manuscript: dbRows.filter(row => /esihlahleni tsakane/i.test(row.meetingName)).map(row => ({ name: row.meetingName, daysOfWeek: row.daysOfWeek, startTime: row.startTime, key: dbKey(row) })),
  };
  const output = {
    generatedAt: new Date().toISOString(),
    liveFingerprints: liveByKey.size,
    manusRows: dbRows.length,
    matched: matched.length,
    liveOnly,
    dbOnly,
    categoryConflicts,
    dailyDiagnostics,
    liveCategories: Object.fromEntries(["in_person", "online", "hybrid", "inactive"].map(category => [category, liveRows.filter(row => mapFormat(row.attendance_option) === category).length])),
    manuscriptCategories: Object.fromEntries(["in_person", "online", "hybrid", "inactive"].map(category => [category, dbRows.filter(row => (row.status === "published" ? row.meetingFormat : "inactive") === category).length])),
  };
  fs.writeFileSync(path.join(root, "ALL_MEETING_DB_PARITY.json"), JSON.stringify(output, null, 2));
  const markdown = [
    "# All meeting database parity audit",
    "",
    `Generated: ${output.generatedAt}`,
    "",
    "| Measure | Count |",
    "|---|---:|",
    `| Live normalized fingerprints | ${output.liveFingerprints} |`,
    `| Manus meeting records | ${output.manusRows} |`,
    `| Matched normalized keys | ${output.matched} |`,
    `| Live-only keys | ${output.liveOnly.length} |`,
    `| Manus-only keys | ${output.dbOnly.length} |`,
    `| Category/status conflicts | ${output.categoryConflicts.length} |`,
    "",
    "## Live-only keys",
    "",
    output.liveOnly.length ? output.liveOnly.map(row => `- ${row.name} — ${liveDay(row)} ${row.time}; ${row.attendance_option}; ${row.url}`).join("\n") : "None.",
    "",
    "## Manus-only keys",
    "",
    output.dbOnly.length ? output.dbOnly.map(row => `- ${row.meetingName} — ${row.daysOfWeek} ${row.startTime}; ${row.status}/${row.meetingFormat}; ${row.sourceUrl ?? "no source URL"}`).join("\n") : "None.",
    "",
    "## Status and format conflicts",
    "",
    output.categoryConflicts.length ? output.categoryConflicts.map(match => `- ${match.live.name} — live ${match.liveCategory}; Manus ${match.db.status}/${match.db.meetingFormat}; ${match.live.url}`).join("\n") : "None.",
    "",
    "The matching key is normalized meeting name, first schedule day, and start time. This report is a reconciliation aid: a difference must be verified against the current Area feed before any publication-status change.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(root, "ALL_MEETING_DB_PARITY.md"), markdown);
  console.log(JSON.stringify({ liveFingerprints: output.liveFingerprints, manusRows: output.manusRows, matched: output.matched, liveOnly: output.liveOnly.length, dbOnly: output.dbOnly.length, categoryConflicts: output.categoryConflicts.length, dailyDiagnostics: output.dailyDiagnostics, liveCategories: output.liveCategories, manuscriptCategories: output.manuscriptCategories }, null, 2));
  process.exit(0);
}

main().catch(error => { console.error(error); process.exit(1); });
