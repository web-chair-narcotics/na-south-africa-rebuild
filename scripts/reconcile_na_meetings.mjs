import fs from 'node:fs';
import mysql from 'mysql2/promise';

const live = JSON.parse(fs.readFileSync('/tmp/live_tsml_meetings.json', 'utf8'));
const database = await mysql.createConnection(process.env.DATABASE_URL);
const [rebuilt] = await database.query(`
  SELECT m.id, m.meetingName, m.daysOfWeek, m.startTime, m.meetingType, m.meetingFormat,
         m.venueName, m.streetAddress, m.suburb, m.city, m.province, m.status, m.sourceUrl,
         m.sourceNote, m.reviewNotes, a.name AS areaName
  FROM meetings m
  JOIN areas a ON a.id = m.areaId
  ORDER BY m.id
`);
await database.end();

const norm = value => String(value ?? '').toLowerCase().replace(/&amp;/g, 'and').replace(/[^a-z0-9]+/g, ' ').trim();
const slugFromUrl = value => String(value ?? '').match(/\/meetings\/([^/?#]+)/i)?.[1] ?? '';
const liveArea = item => item.region || item.sub_region || item.location || '';
const liveTime = item => String(item.time ?? '').padStart(5, '0').slice(0, 5);
const liveKey = item => `${norm(item.name)}|${norm(liveArea(item))}|${liveTime(item)}`;
const rebuiltKey = item => `${norm(item.meetingName)}|${norm(item.areaName)}|${String(item.startTime ?? '')}`;

const byLiveSlug = new Map(live.map(item => [norm(item.slug), item]));
const byLiveKey = new Map();
for (const item of live) byLiveKey.set(liveKey(item), [...(byLiveKey.get(liveKey(item)) ?? []), item]);

const linked = new Map();
const liveForRebuilt = new Map();
const unmatchedRebuilt = [];
for (const row of rebuilt) {
  const sourceSlug = norm(slugFromUrl(row.sourceUrl));
  let item = sourceSlug ? byLiveSlug.get(sourceSlug) : undefined;
  if (!item) {
    const candidates = byLiveKey.get(rebuiltKey(row)) ?? [];
    if (candidates.length === 1) item = candidates[0];
  }
  if (!item) {
    unmatchedRebuilt.push(row);
    continue;
  }
  liveForRebuilt.set(row.id, item);
  linked.set(item.id, [...(linked.get(item.id) ?? []), row]);
}

const missingFromRebuild = live.filter(item => !(linked.get(item.id) ?? []).length).map(item => ({
  id: item.id,
  name: item.name,
  slug: item.slug,
  region: item.region,
  day: item.day,
  time: liveTime(item),
  location: item.location,
  address: item.formatted_address,
  attendance: item.attendance_option,
  approximate: item.approximate,
  sourceUrl: item.url,
}));

const archivedRecords = rebuilt.filter(row => row.status === 'archived').map(row => {
  const item = liveForRebuilt.get(row.id);
  return {
    rebuiltId: row.id,
    meetingName: row.meetingName,
    area: row.areaName,
    day: row.daysOfWeek,
    time: row.startTime,
    format: row.meetingFormat,
    sourceNote: row.sourceNote,
    reviewNotes: row.reviewNotes,
    liveId: item?.id ?? null,
    liveUpdated: item?.updated ?? null,
    liveLocation: item?.location ?? null,
    liveAddress: item?.formatted_address ?? null,
    liveAttendance: item?.attendance_option ?? null,
    liveApproximate: item?.approximate ?? null,
    liveUrl: item?.url ?? null,
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  liveCount: live.length,
  rebuiltCount: rebuilt.length,
  rebuiltPublished: rebuilt.filter(row => row.status === 'published').length,
  rebuiltArchived: archivedRecords.length,
  liveMatched: live.length - missingFromRebuild.length,
  liveMissingFromRebuild: missingFromRebuild.length,
  unmatchedRebuiltCount: unmatchedRebuilt.length,
  duplicateLiveMatches: [...linked.values()].filter(rows => rows.length > 1).length,
  archivedRecords,
  missingFromRebuild,
  unmatchedRebuilt,
};
fs.writeFileSync('/home/ubuntu/na-south-africa-rebuild/meeting-reconciliation-live-vs-rebuild.json', JSON.stringify(report, null, 2));

const escape = value => String(value ?? '').replaceAll('|', '\\|');
const lines = [
  '# Live Meeting Reconciliation Results', '', `Generated: ${report.generatedAt}`, '',
  '| Measure | Count |', '|---|---:|',
  `| Live legacy TSML records | ${report.liveCount} |`,
  `| Rebuilt meeting rows | ${report.rebuiltCount} |`,
  `| Rebuilt published records | ${report.rebuiltPublished} |`,
  `| Rebuilt archived records | ${report.rebuiltArchived} |`,
  `| Live records matched to rebuilt rows | ${report.liveMatched} |`,
  `| Live records without a rebuilt match | ${report.liveMissingFromRebuild} |`,
  `| Rebuilt rows without a live match | ${report.unmatchedRebuiltCount} |`,
  `| Live records linked to multiple rebuilt rows | ${report.duplicateLiveMatches} |`, '',
  '## Live records without a rebuilt match', '',
  '| Live ID | Meeting | Region | Day / time | Attendance |', '|---:|---|---|---|---|',
  ...missingFromRebuild.map(row => `| ${row.id} | ${escape(row.name)} | ${escape(row.region)} | ${escape(row.day)} / ${row.time} | ${escape(row.attendance)} |`), '',
  '## Rebuilt records not visible to public search', '',
  '| Rebuild ID | Meeting | Area | Live ID | Live location | Imported source rationale |', '|---:|---|---|---:|---|---|',
  ...archivedRecords.map(row => `| ${row.rebuiltId} | ${escape(row.meetingName)} | ${escape(row.area)} | ${row.liveId ?? ''} | ${escape(row.liveLocation)} | ${escape(row.sourceNote || row.reviewNotes)} |`),
];
fs.writeFileSync('/home/ubuntu/na-south-africa-rebuild/MEETING_RECONCILIATION_RESULTS.md', lines.join('\n') + '\n');
console.log(JSON.stringify({
  liveCount: report.liveCount,
  rebuiltCount: report.rebuiltCount,
  liveMatched: report.liveMatched,
  liveMissingFromRebuild: report.liveMissingFromRebuild,
  archivedRecords: report.archivedRecords.length,
  unmatchedRebuiltCount: report.unmatchedRebuiltCount,
}, null, 2));
process.exit(0);
