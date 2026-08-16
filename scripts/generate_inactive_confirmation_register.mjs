import fs from 'node:fs';

const archived = JSON.parse(fs.readFileSync('archived-meeting-source-decisions.json', 'utf8'));
const live = new Map(JSON.parse(fs.readFileSync('/tmp/live_tsml_meetings.json', 'utf8')).map(row => [String(row.id), row]));
const csv = value => `"${String(value ?? '').replaceAll('"', '""')}"`;

const rows = archived.map(record => {
  const source = live.get(String(record.legacy_id));
  return {
    rebuild_id: record.rebuilt_id,
    legacy_id: record.legacy_id,
    area: record.area,
    meeting_name: record.meeting,
    schedule: record.schedule,
    live_attendance_option: source?.attendance_option ?? '',
    live_types: Array.isArray(source?.types) ? source.types.join(', ') : source?.types ?? '',
    live_updated: source?.updated ?? '',
    live_location: source?.location ?? '',
    decision_required: 'Confirm resumed and provide current details, or retain archived',
    owner_decision: '',
    confirmation_date: '',
    confirmed_by: '',
    verification_notes: '',
  };
});

const fields = Object.keys(rows[0]);
fs.writeFileSync('inactive-legacy-meeting-confirmation-register.csv', [fields.join(','), ...rows.map(row => fields.map(field => csv(row[field])).join(','))].join('\n') + '\n');
fs.writeFileSync('INACTIVE_LEGACY_MEETING_CONFIRMATION_REGISTER.md', [
  '# Inactive Legacy Meeting Confirmation Register', '',
  'This register contains the 21 legacy listings retained by the current TSML endpoint but marked `attendance_option=inactive`. Each record is intentionally excluded from the public finder until the owning area confirms that it has resumed and completes current verification, or explicitly confirms it should remain archived.', '',
  '| Area | Meetings requiring decision | Required outcome |', '|---|---:|---|',
  ...Object.entries(rows.reduce((groups, row) => ({ ...groups, [row.area]: (groups[row.area] ?? 0) + 1 }), {})).map(([area, count]) => `| ${area} | ${count} | Confirm resumed with current details, or retain archived |`), '',
  'Use `inactive-legacy-meeting-confirmation-register.csv` to record the area-owner decision, confirmation date, reviewer, and verification notes. A resumed record must complete address, map pin, spelling, and contact checks before national publication.',
].join('\n') + '\n');

console.log(`Generated confirmation register for ${rows.length} inactive legacy listings.`);
