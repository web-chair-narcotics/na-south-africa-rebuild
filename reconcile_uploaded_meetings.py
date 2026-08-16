from __future__ import annotations

import csv
import json
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

UPLOAD = Path('/home/ubuntu/upload')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
WP = {'wp': 'http://wordpress.org/export/1.2/', 'content': 'http://purl.org/rss/1.0/modules/content/'}


def node_text(node, tag: str) -> str:
    value = node.findtext(tag)
    return (value or '').strip()


def parse_xml_meetings(path: Path) -> list[dict]:
    root = ET.parse(path).getroot()
    rows = []
    for item in root.findall('.//item'):
        if node_text(item, '{http://wordpress.org/export/1.2/}post_type') != 'tsml_meeting':
            continue
        meta = {}
        for pm in item.findall('{http://wordpress.org/export/1.2/}postmeta'):
            key = node_text(pm, '{http://wordpress.org/export/1.2/}meta_key')
            value = node_text(pm, '{http://wordpress.org/export/1.2/}meta_value')
            if key:
                meta[key] = value
        rows.append({
            'id': node_text(item, '{http://wordpress.org/export/1.2/}post_id'),
            'title': node_text(item, 'title'),
            'status': node_text(item, '{http://wordpress.org/export/1.2/}status'),
            'date': node_text(item, '{http://wordpress.org/export/1.2/}post_date'),
            'link': node_text(item, 'link'),
            'meta': meta,
            'source_export': path.name,
        })
    return rows

xml_rows = []
for path in sorted(UPLOAD.glob('narcoticsanonymous*.xml')):
    xml_rows.extend(parse_xml_meetings(path))

csv_rows = []
for path in sorted(UPLOAD.glob('meetings*.csv')):
    with path.open(encoding='utf-8-sig', newline='') as handle:
        for row in csv.DictReader(handle):
            row['_source_file'] = path.name
            csv_rows.append(row)

json_rows = []
for path in sorted(UPLOAD.glob('NewTextDocument*.txt')):
    try:
        data = json.loads(path.read_text(encoding='utf-8'))
    except json.JSONDecodeError:
        continue
    for row in data:
        row['_source_file'] = path.name
        json_rows.append(row)

xml_by_id = defaultdict(list)
for row in xml_rows:
    xml_by_id[row['id']].append(row)
csv_by_id = defaultdict(list)
for row in csv_rows:
    if row.get('ID'):
        csv_by_id[row['ID']].append(row)
json_by_id = defaultdict(list)
for row in json_rows:
    if row.get('id') is not None:
        json_by_id[str(row['id'])].append(row)

all_ids = sorted(set(xml_by_id) | set(csv_by_id) | set(json_by_id), key=lambda value: int(value) if value.isdigit() else value)
comparison = []
for meeting_id in all_ids:
    x = xml_by_id.get(meeting_id, [])
    c = csv_by_id.get(meeting_id, [])
    j = json_by_id.get(meeting_id, [])
    names = {row.get('Name', row.get('name', row.get('title', ''))).strip() for row in c + j + x}
    regions = {row.get('Region', row.get('region', '')).strip() for row in c + j if row.get('Region', row.get('region', ''))}
    comparison.append({
        'id': meeting_id,
        'xml_count': len(x),
        'csv_count': len(c),
        'json_count': len(j),
        'xml_exports': sorted({row['source_export'] for row in x}),
        'csv_sources': sorted({row['_source_file'] for row in c}),
        'json_sources': sorted({row['_source_file'] for row in j}),
        'name_variants': sorted(names),
        'region_variants': sorted(regions),
        'xml_statuses': sorted({row['status'] for row in x}),
        'updated_values': sorted({row.get('Updated', row.get('updated', row.get('date', ''))).strip() for row in c + j + x if row.get('Updated', row.get('updated', row.get('date', '')))}),
        'needs_review': len(names) > 1 or len(regions) > 1 or len(x) > 1,
    })

(SOURCE / 'uploaded_meeting_reconciliation.json').write_text(json.dumps(comparison, ensure_ascii=False, indent=2), encoding='utf-8')

report = [
    '# Uploaded Meeting Reconciliation',
    '',
    f'The five WordPress exports contain **{len(xml_rows):,}** TSML meeting items, the CSV snapshots contain **{len(csv_rows):,}** rows in total, and the four JSON text exports contain **{len(json_rows):,}** records.',
    '',
    f'Across the combined source IDs there are **{len(all_ids):,}** distinct meeting IDs. **{sum(1 for row in comparison if row["needs_review"]):,}** IDs have duplicate regional export appearances or name/region variants and require source-precedence handling; these are not automatically treated as errors.',
    '',
    f'CSV-only IDs: **{sum(1 for value in all_ids if value not in xml_by_id):,}**. WordPress-only IDs: **{sum(1 for value in all_ids if value not in csv_by_id):,}**. JSON-only IDs: **{sum(1 for value in all_ids if value not in xml_by_id and value not in csv_by_id):,}**.',
    '',
    'The reconciliation preserves the most recent public source record while retaining historical source IDs and source URLs. It does not expose WordPress edit URLs, author credentials, or private metadata in the rebuilt site.',
]
(PROJECT / 'uploaded_meeting_reconciliation.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
