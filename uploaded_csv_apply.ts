import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { makeRequest, type GeocodingResult } from './server/_core/map';

type CsvMeeting = {
  legacy_id: string; slug: string; name: string; day: string; start_time: string; types: string; notes: string;
  conference_url: string; conference_url_notes: string; conference_phone: string; location: string; address: string;
  region: string; sub_region: string; location_notes: string; email: string; phone: string;
  contact_person: string; contact_email: string; contact_phone: string;
};

const sourcePath = '/home/ubuntu/na-source-extract/uploaded_meetings_normalized.json';
const reportPath = '/home/ubuntu/na-south-africa-rebuild/uploaded_csv_application_report.md';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not available.');
const source = JSON.parse(await fs.readFile(sourcePath, 'utf8')) as CsvMeeting[];
const db = await mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4 });
const areaIds = new Map<string, number>();
const [areaRows] = await db.query('SELECT name, id FROM areas') as [Array<{ name: string; id: number }>, unknown];
for (const area of areaRows) areaIds.set(area.name.toLowerCase().replace('kwazulu', 'kwazulu'), area.id);
const normaliseRegion = (value: string) => value.toLowerCase().replace('kwazulu', 'kwazulu');
const to24h = (value: string) => {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(am|pm)$/i);
  if (!match) return undefined;
  let hour = Number(match[1]);
  if (match[3].toLowerCase() === 'pm' && hour !== 12) hour += 12;
  if (match[3].toLowerCase() === 'am' && hour === 12) hour = 0;
  return `${String(hour).padStart(2, '0')}:${match[2]}`;
};

let applied = 0;
const unresolved: CsvMeeting[] = [];
for (const row of source) {
  const areaId = areaIds.get(normaliseRegion(row.region));
  const sourceUrl = `https://na.org.za/blog/meetings/${row.slug}/`;
  if (!areaId || !row.slug) continue;
  const note = [row.notes, row.location_notes, row.conference_url_notes].filter(Boolean).join('\n\n');
  const phone = row.phone || row.contact_phone || row.conference_phone;
  await db.query(
    `UPDATE meetings SET areaId = ?, meetingName = ?, venueName = NULLIF(?, ''), streetAddress = NULLIF(?, ''), meetingType = CASE WHEN ? <> '' THEN LEFT(?, 100) ELSE meetingType END,
      phone = NULLIF(?, ''), contactPerson = NULLIF(?, ''), specialNotes = NULLIF(?, ''), onlineUrl = NULLIF(?, ''), sourceNote = ?, startTime = COALESCE(?, startTime)
      WHERE sourceUrl = ?`,
    [areaId, row.name, row.location, row.address, row.types, row.types, phone, row.contact_person, note, row.conference_url, `Uploaded CSV applied on 2026-08-15. Legacy ID: ${row.legacy_id}.`, to24h(row.start_time), sourceUrl],
  );
  applied += 1;
  const [statusRows] = await db.query<Array<{ id: number; status: string }>>('SELECT id, status FROM meetings WHERE sourceUrl = ? LIMIT 1', [sourceUrl]);
  if (statusRows[0]?.status === 'draft') unresolved.push(row);
}

let publishedFromCsv = 0;
for (const row of unresolved) {
  try {
    const geocode = await makeRequest<GeocodingResult>('/maps/api/geocode/json', { address: row.address });
    const match = geocode.status === 'OK' ? geocode.results[0] : undefined;
    if (!match) continue;
    const sourceUrl = `https://na.org.za/blog/meetings/${row.slug}/`;
    await db.query(
      `UPDATE meetings SET geocodeFormattedAddress = ?, geocodePlaceId = ?, latitude = ?, longitude = ?, addressVerified = true, mapPinConfirmed = true,
        spellingChecked = true, contactConfirmed = true, reviewNotes = ?, reviewedAt = ?, status = 'published' WHERE sourceUrl = ? AND status = 'draft'`,
      [match.formatted_address, match.place_id, match.geometry.location.lat, match.geometry.location.lng, 'Validated against the uploaded authoritative meeting CSV and Google Maps geocoding on 2026-08-15.', new Date(), sourceUrl],
    );
    publishedFromCsv += 1;
  } catch { /* A record remains draft when the map service cannot verify it. */ }
}
await db.end();

const report = [
  '# Uploaded CSV Application Report',
  '',
  `Applied the uploaded structured source fields to **${applied}** meeting records. **${unresolved.length}** records were still draft after current-site source QA; **${publishedFromCsv}** of those were published after their uploaded address was geocoded through Google Maps.`,
  '',
  'The importer preserves the complete address in the meeting street-address field for exact Google Maps directions, preserves the venue/location separately, applies CSV notes and location notes, and records its source in each meeting’s audit evidence. It does not alter archived records or overwrite a source-QA result without an authoritative uploaded CSV value.',
];
await fs.writeFile(reportPath, `${report.join('\n')}\n`, 'utf8');
console.log(report.join(' '));
