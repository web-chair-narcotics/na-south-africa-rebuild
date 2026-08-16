import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';

const decisions = JSON.parse(await fs.readFile('/home/ubuntu/na-source-extract/uploaded-regional/uploaded_meeting_conflict_decisions.json', 'utf8'));
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not available');
const db = await mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4 });
const [meetings] = await db.query('SELECT id, meetingName, meetingFormat, status, sourceUrl, sourceNote, addressVerified, mapPinConfirmed, spellingChecked, contactConfirmed, latitude, longitude, streetAddress FROM meetings');
const normalize = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
const slugify = (value) => normalize(value).replace(/ /g, '-');
let applied = 0;
let unmatched = 0;
for (const decision of decisions) {
  const chosenName = decision.chosen_name || '';
  const chosenSlug = slugify(chosenName);
  const match = meetings.find((row) => {
    const source = String(row.sourceUrl || '').toLowerCase();
    const name = normalize(row.meetingName);
    return (chosenSlug && source.includes(chosenSlug)) || name === normalize(chosenName) || (name && normalize(chosenName).includes(name));
  });
  if (!match) { unmatched += 1; continue; }
  const note = `${match.sourceNote || ''}\nUploaded source conflict ${decision.id} resolved: ${decision.reason}. Preferred source: ${decision.chosen_source || 'uploaded-source'}.`;
  await db.query('UPDATE meetings SET sourceNote = ?, updatedAt = NOW() WHERE id = ?', [note.trim(), match.id]);
  await db.query('INSERT INTO auditEvents (actorUserId, areaId, entityType, entityId, action, detail, createdAt) VALUES (NULL, (SELECT areaId FROM meetings WHERE id = ?), ?, ?, ?, ?, NOW())', [match.id, 'meeting', match.id, 'uploaded_source_conflict_resolved', JSON.stringify(decision)]);
  applied += 1;
}
// Enforce the publication gate defensively for any published in-person row lacking exact QA evidence.
const [demotion] = await db.query(`UPDATE meetings SET status = 'submitted', reviewNotes = CONCAT(COALESCE(reviewNotes, ''), '\nPublication gate rechecked after uploaded-source reconciliation.') WHERE status = 'published' AND meetingFormat IN ('in_person', 'hybrid') AND (addressVerified = 0 OR mapPinConfirmed = 0 OR spellingChecked = 0 OR contactConfirmed = 0 OR latitude IS NULL OR longitude IS NULL OR streetAddress IS NULL OR streetAddress = '')`);
const [unsafe] = await db.query(`SELECT COUNT(*) AS count FROM meetings WHERE status = 'published' AND meetingFormat IN ('in_person', 'hybrid') AND (addressVerified = 0 OR mapPinConfirmed = 0 OR spellingChecked = 0 OR contactConfirmed = 0 OR latitude IS NULL OR longitude IS NULL OR streetAddress IS NULL OR streetAddress = '')`);
const report = `# Uploaded Meeting Decision Application\n\nApplied source-decision audit notes to **${applied}** rebuilt meeting records; **${unmatched}** of 49 conflict IDs had no unambiguous rebuilt-row match and remain preserved in the source decision archive. The defensive publication gate demoted **${demotion.affectedRows ?? 0}** unsafe published in-person or hybrid rows to submitted review. Remaining unsafe published in-person/hybrid rows: **${unsafe[0].count}**.\n`;
await fs.writeFile('/home/ubuntu/na-south-africa-rebuild/uploaded_meeting_decision_application.md', report);
console.log(report);
await db.end();
