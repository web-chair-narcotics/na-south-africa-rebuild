import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';

const sourcePath = '/home/ubuntu/na-source-extract/meeting_detail_crawl.json';
const reportPath = '/home/ubuntu/na-south-africa-rebuild/current_meeting_detail_enrichment.md';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not available.');

const details = JSON.parse(await fs.readFile(sourcePath, 'utf8'));
const db = await mysql.createConnection(process.env.DATABASE_URL);
let updated = 0;
let noStructuredAddress = 0;
for (const row of details) {
  if (row.error || !row.source_url) continue;
  if (!row.street_address || !row.city) noStructuredAddress += 1;
  const note = [row.special_notes, 'Public detail page extracted from the current NA South Africa website on 2026-08-15.'].filter(Boolean).join('\n\n');
  await db.query(
    `UPDATE meetings
     SET streetAddress = COALESCE(NULLIF(?, ''), streetAddress),
         suburb = COALESCE(NULLIF(?, ''), suburb),
         city = COALESCE(NULLIF(?, ''), city),
         phone = COALESCE(NULLIF(?, ''), phone),
         specialNotes = COALESCE(NULLIF(?, ''), specialNotes),
         onlineUrl = COALESCE(NULLIF(?, ''), onlineUrl),
         meetingType = CASE WHEN ? <> '' THEN REPLACE(?, '|', ', ') ELSE meetingType END,
         sourceNote = ?
     WHERE sourceUrl = ? AND status IN ('draft', 'changes_requested')`,
    [
      row.street_address || '',
      row.suburb || '',
      row.city || '',
      row.phone || '',
      note,
      row.online_url || '',
      row.meeting_types || '',
      row.meeting_types || '',
      `Current public detail extraction. Legacy record ID: ${row.legacy_id}.`,
      row.source_url,
    ],
  );
  updated += 1;
}
await db.end();
const report = [
  '# Current Meeting Detail Enrichment',
  '',
  `Updated **${updated}** staged meeting drafts from their individual current public detail pages. **${noStructuredAddress}** records did not expose a complete structured street-address and city pair; all others received the public street, suburb, city, notes, online link, phone, and meeting-type detail available on the source site.`,
  '',
  'The script does not change a meeting’s draft or correction status, does not mark any QA item as complete, and does not publish any meeting. National review remains required before a record can appear in the public finder.',
];
await fs.writeFile(reportPath, `${report.join('\n')}\n`, 'utf8');
console.log(report.join(' '));
