import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

type LiveRow = { id?: number; name?: string; day?: number | string; time?: string; attendance_option?: string; feed_site?: string; region?: string; url?: string; conference_url?: string; conference_phone?: string; entity_email?: string; feedback_emails?: string[] };
type DbRow = { id: number; meetingName: string; daysOfWeek: string; startTime: string; onlineUrl: string | null; phone: string | null; contactPerson: string | null; sourceUrl: string | null };

const root = "/home/ubuntu/na-south-africa-rebuild";
const report = JSON.parse(fs.readFileSync(path.join(root, "LIVE_PARITY_AUDIT_REPORT.json"), "utf8"));
const dayNames = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const norm = (value: unknown) => String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
const liveKey = (row: LiveRow) => `${norm(row.name)}|${dayNames[Number(row.day)] ?? norm(row.day)}|${norm(row.time)}`;
const dbKey = (row: DbRow) => `${norm(row.meetingName)}|${JSON.parse(row.daysOfWeek || "[]")[0] ?? ""}|${norm(row.startTime)}`;

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is unavailable");
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  const [dbRows] = await connection.query<mysql.RowDataPacket[]>("SELECT id, meetingName, daysOfWeek, startTime, onlineUrl, phone, contactPerson, sourceUrl FROM meetings WHERE status='published' AND meetingFormat='online' ORDER BY id");
  await connection.end();

  const liveRows = (report.liveUniqueRows as LiveRow[]).filter(row => norm(row.attendance_option) === "online");
  const liveByKey = new Map(liveRows.map(row => [liveKey(row), row]));
  const dbByKey = new Map((dbRows as DbRow[]).map(row => [dbKey(row), row]));
  const liveOnly = [...liveByKey.entries()].filter(([key]) => !dbByKey.has(key)).map(([, row]) => row);
  const dbOnly = [...dbByKey.entries()].filter(([key]) => !liveByKey.has(key)).map(([, row]) => row);
  const liveJoinUrls = liveRows.filter(row => Boolean(row.conference_url)).length;
  const liveContactFallbacks = liveRows.filter(row => !row.conference_url && Boolean(row.conference_phone || row.entity_email || row.feedback_emails?.length)).length;
  const dbJoinUrls = (dbRows as DbRow[]).filter(row => Boolean(row.onlineUrl)).length;
  const dbContactFallbacks = (dbRows as DbRow[]).filter(row => !row.onlineUrl && Boolean(row.phone || row.contactPerson)).length;
  const output = { generatedAt: new Date().toISOString(), liveOnlineFingerprints: liveRows.length, dbPublishedOnline: dbRows.length, liveJoinUrls, liveContactFallbacks, dbJoinUrls, dbContactFallbacks, liveOnly, dbOnly };
  fs.writeFileSync(path.join(root, "ONLINE_MEETING_DB_PARITY.json"), JSON.stringify(output, null, 2));
  const md = [
    "# Online meeting database parity audit",
    "",
    `Generated: ${output.generatedAt}`,
    "",
    "| Measure | Count |",
    "|---|---:|",
    `| Current live online fingerprints | ${output.liveOnlineFingerprints} |`,
    `| Published Manus online records | ${output.dbPublishedOnline} |`,
    `| Live rows with conference URL | ${output.liveJoinUrls} |`,
    `| Live rows with contact fallback | ${output.liveContactFallbacks} |`,
    `| Manus rows with join URL | ${output.dbJoinUrls} |`,
    `| Manus rows with contact fallback | ${output.dbContactFallbacks} |`,
    `| Live-only keys | ${liveOnly.length} |`,
    `| Manus-only keys | ${dbOnly.length} |`,
    "",
    "## Live-only source keys",
    "",
    liveOnly.length ? liveOnly.map(row => `- ${row.name} — ${dayNames[Number(row.day)] ?? row.day} ${row.time}; ${row.url}`).join("\n") : "None.",
    "",
    "## Manus-only keys",
    "",
    dbOnly.length ? dbOnly.map(row => `- ${row.meetingName} — ${row.daysOfWeek} ${row.startTime}; ${row.sourceUrl ?? "no source URL"}`).join("\n") : "None.",
    "",
    "Physical venue, address, coordinates, map, and directions fields are intentionally excluded from online-only records. The comparison keys are normalized meeting name, first schedule day, and start time.",
    "",
  ].join("\n");
  fs.writeFileSync(path.join(root, "ONLINE_MEETING_DB_PARITY.md"), md);
  console.log(JSON.stringify({ liveOnlineFingerprints: output.liveOnlineFingerprints, dbPublishedOnline: output.dbPublishedOnline, liveOnly: liveOnly.length, dbOnly: dbOnly.length, liveJoinUrls, liveContactFallbacks, dbJoinUrls, dbContactFallbacks }, null, 2));
}

main().catch(error => { console.error(error); process.exit(1); });
