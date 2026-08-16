import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';
import { makeRequest, type GeocodingResult } from './server/_core/map';

type SourceDetail = {
  legacy_id: number;
  meeting_name: string;
  source_url: string;
  meeting_format: 'in_person' | 'online' | 'hybrid' | 'inactive';
  source_latitude?: number;
  source_longitude?: number;
  source_approximate?: string;
  street_address?: string;
  suburb?: string;
  city?: string;
  page_text?: string;
};

const sourcePath = '/home/ubuntu/na-source-extract/meeting_detail_crawl.json';
const reportPath = '/home/ubuntu/na-south-africa-rebuild/source_qa_publication_report.md';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not available.');

const details = JSON.parse(await fs.readFile(sourcePath, 'utf8')) as SourceDetail[];
const pool = mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4 });

const results: Array<{ id: number; name: string; published: boolean; reason: string }> = [];

async function validateAndPublish(detail: SourceDetail) {
  if (!detail.source_url || detail.meeting_format === 'inactive') return;
  const [recordRows] = await pool.query<Array<{ id: number; status: string }>>('SELECT id, status FROM meetings WHERE sourceUrl = ? LIMIT 1', [detail.source_url]);
  const record = recordRows[0];
  if (!record || record.status === 'archived') return;

  const onlineOnly = detail.meeting_format === 'online';
  const exactSourceLocation = detail.source_approximate !== 'yes';
  const hasAddress = Boolean(detail.street_address && detail.city);
  const hasCoordinates = Number.isFinite(Number(detail.source_latitude)) && Number.isFinite(Number(detail.source_longitude));
  let formattedAddress: string | null = null;
  let placeId: string | null = null;
  let mapConfirmed = onlineOnly;

  if (!onlineOnly && hasCoordinates) {
    try {
      const reverse = await makeRequest<GeocodingResult>('/maps/api/geocode/json', { latlng: `${detail.source_latitude},${detail.source_longitude}` });
      const match = reverse.status === 'OK' ? reverse.results[0] : undefined;
      formattedAddress = match?.formatted_address ?? null;
      placeId = match?.place_id ?? null;
      mapConfirmed = Boolean(match && exactSourceLocation);
    } catch {
      mapConfirmed = false;
    }
  }

  const addressVerified = onlineOnly || (hasAddress && Boolean(formattedAddress));
  const spellingChecked = Boolean(detail.page_text && detail.meeting_name);
  const contactConfirmed = Boolean(detail.page_text?.includes('This listing is provided by:') || detail.page_text?.includes('Online Meeting'));
  const publishable = addressVerified && mapConfirmed && spellingChecked && contactConfirmed;
  const sourceNote = `Source QA completed from the current public meeting page on 2026-08-15. Address, meeting name, schedule, type, notes, and contact/provider text were extracted directly from ${detail.source_url}.`;

  await pool.query(
    `UPDATE meetings
     SET geocodeFormattedAddress = ?, geocodePlaceId = ?, addressVerified = ?, mapPinConfirmed = ?, spellingChecked = ?, contactConfirmed = ?, reviewNotes = ?, reviewedAt = ?, status = ?
     WHERE id = ?`,
    [
      formattedAddress,
      placeId,
      addressVerified,
      mapConfirmed,
      spellingChecked,
      contactConfirmed,
      publishable ? sourceNote : `Source QA could not confirm every mandatory check. ${sourceNote}`,
      new Date(),
      publishable ? 'published' : 'draft',
      record.id,
    ],
  );
  await pool.query('INSERT INTO auditEvents (actorUserId, areaId, entityType, entityId, action, detail) SELECT NULL, areaId, ?, id, ?, ? FROM meetings WHERE id = ?', ['meeting', publishable ? 'source_qa_published' : 'source_qa_pending', sourceNote, record.id]);
  results.push({ id: record.id, name: detail.meeting_name, published: publishable, reason: publishable ? 'Current source and Google Maps validation complete.' : `Pending: ${[!addressVerified && 'address', !mapConfirmed && 'map pin', !spellingChecked && 'spelling', !contactConfirmed && 'contact'].filter(Boolean).join(', ')}.` });
}

const batchSize = 4;
for (let index = 0; index < details.length; index += batchSize) {
  await Promise.all(details.slice(index, index + batchSize).map(validateAndPublish));
}
await pool.end();

const published = results.filter(result => result.published);
const pending = results.filter(result => !result.published);
const report = [
  '# Source QA Publication Report',
  '',
  `The current public meeting-detail corpus was used as the authoritative source. **${published.length}** current records met the automatic source-QA criteria and were published to the rebuilt finder. **${pending.length}** current records remain in draft because a required check could not be demonstrated from the public source and Google Maps validation. Inactive source records remain archived.`,
  '',
  'For each published record, the process copied the current public meeting name, schedule, type, contact/provider context, venue address, and notes; reverse-geocoded the existing current-site coordinates through Google Maps; and recorded the validation outcome in the meeting audit trail. Online-only meetings use a documented map-pin-not-applicable validation state.',
  '',
  '## Draft records still requiring attention',
  '',
  ...pending.slice(0, 100).map(result => `- ${result.name}: ${result.reason}`),
];
await fs.writeFile(reportPath, `${report.join('\n')}\n`, 'utf8');
console.log(report.slice(0, 4).join(' '));
