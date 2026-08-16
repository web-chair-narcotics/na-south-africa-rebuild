import fs from 'node:fs';
import mysql from 'mysql2/promise';
import { parseLegacyTsmlSchedule } from './legacySchedule.mjs';

const live = JSON.parse(fs.readFileSync('/tmp/live_tsml_meetings.json', 'utf8'));
const bySlug = new Map(live.map(item => [String(item.slug ?? '').toLowerCase(), item]));
const slugFromUrl = value => String(value ?? '').match(/\/meetings\/([^/?#]+)/i)?.[1]?.toLowerCase() ?? '';

const db = await mysql.createConnection(process.env.DATABASE_URL);
const [rows] = await db.query(`
  SELECT id, meetingName, daysOfWeek, startTime, sourceUrl
  FROM meetings
  WHERE status = 'published'
    AND (daysOfWeek IS NULL OR daysOfWeek = '[]' OR daysOfWeek = '' OR startTime IS NULL OR startTime = '' OR startTime = '00:00')
  ORDER BY id
`);
await db.end();

const plan = rows.map(row => {
  const liveRecord = bySlug.get(slugFromUrl(row.sourceUrl));
  const schedule = parseLegacyTsmlSchedule(liveRecord, row.meetingName);
  const repairedDays = schedule.days.length ? JSON.stringify(schedule.days) : row.daysOfWeek;
  const repairedTime = schedule.time || row.startTime;
  return {
    id: row.id,
    meetingName: row.meetingName,
    sourceUrl: row.sourceUrl,
    liveId: liveRecord?.id ?? null,
    liveDay: liveRecord?.day ?? null,
    liveTime: liveRecord?.time ?? null,
    previousDays: row.daysOfWeek,
    previousTime: row.startTime,
    repairedDays,
    repairedTime,
    eligible: Boolean(liveRecord && (schedule.days.length || schedule.time) && (repairedDays !== row.daysOfWeek || repairedTime !== row.startTime)),
  };
});

const eligible = plan.filter(row => row.eligible);
const sql = eligible.map(row =>
  `UPDATE meetings SET daysOfWeek = '${row.repairedDays.replaceAll("'", "''")}', startTime = '${row.repairedTime.replaceAll("'", "''")}' WHERE id = ${Number(row.id)} AND status = 'published';`
).join('\n');

fs.writeFileSync('published-schedule-repair-plan.json', JSON.stringify(plan, null, 2));
fs.writeFileSync('published-schedule-repair.sql', sql + '\n');
const lines = [
  '# Published Meeting Schedule Repair Plan', '',
  `Incomplete published records found: ${plan.length}`, `Exact live-source repairs available: ${eligible.length}`, '',
  '| Rebuild ID | Meeting | Live ID | Current schedule | Live schedule | Planned schedule | Eligible |',
  '|---:|---|---:|---|---|---|---|',
  ...plan.map(row => `| ${row.id} | ${String(row.meetingName).replaceAll('|', '\\|')} | ${row.liveId ?? ''} | ${row.previousDays} ${row.previousTime} | ${row.liveDay ?? ''} ${row.liveTime ?? ''} | ${row.repairedDays} ${row.repairedTime} | ${row.eligible ? 'yes' : 'no'} |`),
];
fs.writeFileSync('PUBLISHED_SCHEDULE_REPAIR_PLAN.md', lines.join('\n') + '\n');
console.log(JSON.stringify({ incompletePublishedRecords: plan.length, exactLiveSourceRepairs: eligible.length, unmatchedOrUnparseable: plan.length - eligible.length }, null, 2));
process.exit(0);
