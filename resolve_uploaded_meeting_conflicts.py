from __future__ import annotations

import csv
import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

UPLOAD = Path('/home/ubuntu/upload')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
reconciled = json.loads((SOURCE / 'uploaded_meeting_reconciliation.json').read_text(encoding='utf-8'))

csv_by_id = defaultdict(list)
for path in sorted(UPLOAD.glob('meetings*.csv')):
    with path.open(encoding='utf-8-sig', newline='') as handle:
        for row in csv.DictReader(handle):
            if row.get('ID'):
                row['_source'] = path.name
                csv_by_id[row['ID']].append(row)

json_by_id = defaultdict(list)
for path in sorted(UPLOAD.glob('NewTextDocument*.txt')):
    try:
        rows = json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        continue
    for row in rows:
        if row.get('id') is not None:
            row = dict(row)
            row['_source'] = path.name
            json_by_id[str(row['id'])].append(row)


def parse_date(value: str) -> datetime:
    for fmt in ('%Y-%m-%d %H:%M:%S', '%Y-%m-%d'):
        try:
            return datetime.strptime(value[:19], fmt)
        except ValueError:
            pass
    return datetime.min


def active_score(row: dict) -> int:
    text = ' '.join(str(row.get(k, '')) for k in ('attendance_option', 'Attendance', 'Status', 'status', 'active_or_archived_status')).lower()
    if 'inactive' in text or 'archived' in text or 'closed' == text.strip():
        return 0
    return 1


def quality_score(row: dict) -> int:
    address = str(row.get('Address', row.get('formatted_address', ''))).strip()
    approx = str(row.get('approximate', '')).lower()
    lat = row.get('latitude')
    lng = row.get('longitude')
    score = 0
    if address and len(address) >= 12: score += 2
    if approx in ('no', 'false', ''): score += 2
    if lat not in (None, '') and lng not in (None, ''): score += 2
    if row.get('attendance_option') in ('in_person', 'hybrid'): score += 1
    return score


def choose(rows: list[dict]) -> tuple[dict, str]:
    ranked = sorted(rows, key=lambda row: (active_score(row), quality_score(row), parse_date(str(row.get('Updated', row.get('updated', ''))))), reverse=True)
    chosen = ranked[0]
    reasons = []
    if active_score(chosen): reasons.append('active over inactive/archived')
    if quality_score(chosen) >= 4: reasons.append('more complete address/coordinate evidence')
    if parse_date(str(chosen.get('Updated', chosen.get('updated', '')))) != datetime.min: reasons.append('latest available update')
    return chosen, '; '.join(reasons) or 'highest available source score'

conflicts = []
for row in reconciled:
    if not row.get('needs_review'):
        continue
    meeting_id = row['id']
    candidates = []
    candidates.extend(csv_by_id.get(meeting_id, []))
    candidates.extend(json_by_id.get(meeting_id, []))
    if not candidates:
        candidates = [{'Name': name, 'Region': region, 'Updated': updated} for name in row.get('name_variants', []) for region in row.get('region_variants', []) for updated in row.get('updated_values', [])]
    chosen, reason = choose(candidates)
    conflicts.append({
        'id': meeting_id,
        'decision': 'prefer-latest-active-highest-quality-source',
        'chosen_source': chosen.get('_source', 'xml/current-source'),
        'chosen_name': chosen.get('Name', chosen.get('name', chosen.get('title', ''))),
        'chosen_region': chosen.get('Region', chosen.get('region', '')),
        'chosen_updated': chosen.get('Updated', chosen.get('updated', '')),
        'reason': reason,
        'source_candidates': sorted({candidate.get('_source', 'xml/current-source') for candidate in candidates}),
        'name_variants': row.get('name_variants', []),
        'region_variants': row.get('region_variants', []),
        'source_statuses': row.get('xml_statuses', []),
    })

(SOURCE / 'uploaded_meeting_conflict_decisions.json').write_text(json.dumps(conflicts, ensure_ascii=False, indent=2), encoding='utf-8')
summary = [
    '# Uploaded Meeting Conflict Decisions',
    '',
    f'The combined source inventory contained **{len(conflicts)}** meeting IDs requiring precedence decisions. Each decision uses the same documented rule: prefer an active record over inactive/archived data, then prefer a record with a complete non-approximate address and coordinates, then prefer the latest source update.',
    '',
    f'By the rule, **{sum(1 for row in conflicts if "latest" in row["reason"]):,}** conflict decisions use a latest-update tie-breaker and **{sum(1 for row in conflicts if "complete" in row["reason"]):,}** include a higher-quality address or coordinate record. These decisions remain source-audit evidence and do not automatically publish a record that fails the application QA gate.',
    '',
    'Approximate online or regional records are retained as online or draft candidates and are not represented as exact in-person venues. Inactive source rows are not reactivated merely because they occur in an older export.',
]
(PROJECT / 'uploaded_meeting_conflict_decisions.md').write_text('\n'.join(summary) + '\n', encoding='utf-8')
print('\n'.join(summary))
