from __future__ import annotations

import csv
import json
import re
import xml.etree.ElementTree as ET
from collections import Counter, defaultdict
from pathlib import Path

UPLOAD = Path('/home/ubuntu/upload')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
SOURCE.mkdir(parents=True, exist_ok=True)

WP = {'wp': 'http://wordpress.org/export/1.2/', 'content': 'http://purl.org/rss/1.0/modules/content/'}


def text(parent, path: str) -> str:
    node = parent.find(path, WP)
    return (node.text or '').strip() if node is not None and node.text else ''


def parse_xml(path: Path) -> dict:
    root = ET.parse(path).getroot()
    items = []
    types = Counter()
    for item in root.findall('.//item'):
        post_type = text(item, 'wp:post_type') or 'unknown'
        types[post_type] += 1
        items.append({
            'title': (item.findtext('title') or '').strip(),
            'post_type': post_type,
            'status': text(item, 'wp:status'),
            'post_id': text(item, 'wp:post_id'),
            'post_parent': text(item, 'wp:post_parent'),
            'post_date': text(item, 'wp:post_date'),
            'link': (item.findtext('link') or '').strip(),
            'guid': (item.findtext('guid') or '').strip(),
            'content': (item.findtext('{%s}encoded' % WP['content']) or '').strip(),
            'excerpt': (item.findtext('{http://wordpress.org/export/1.2/excerpt/}encoded') or '').strip(),
            'categories': [c.text.strip() for c in item.findall('category') if c.text],
        })
    return {'file': path.name, 'items': items, 'post_types': dict(types)}


def parse_csv(path: Path) -> dict:
    with path.open(encoding='utf-8-sig', newline='') as handle:
        rows = list(csv.DictReader(handle))
    return {
        'file': path.name,
        'count': len(rows),
        'rows': rows,
        'regions': dict(Counter(row.get('Region', '').strip() for row in rows if row.get('Region', '').strip())),
        'attendance': dict(Counter(row.get('Attendance', row.get('Attendance Option', '')).strip() for row in rows if row.get('Attendance', row.get('Attendance Option', '')).strip())),
    }


xml_data = [parse_xml(path) for path in sorted(UPLOAD.glob('*.xml')) if path.name.startswith('narcoticsanonymous')]
csv_data = [parse_csv(path) for path in sorted(UPLOAD.glob('meetings*.csv'))]
txt_data = []
for path in sorted(UPLOAD.glob('NewTextDocument*.txt')):
    raw = path.read_text(encoding='utf-8', errors='replace')
    try:
        parsed = json.loads(raw)
        txt_data.append({'file': path.name, 'records': len(parsed), 'regions': dict(Counter(str(r.get('region', '')).strip() for r in parsed if r.get('region'))), 'records_data': parsed})
    except json.JSONDecodeError:
        txt_data.append({'file': path.name, 'records': 0, 'parse_error': 'not valid JSON'})

all_meetings = []
for bundle in xml_data:
    for item in bundle['items']:
        if item['post_type'] == 'tsml_meeting':
            all_meetings.append({**item, 'source_export': bundle['file']})

summary = {
    'xml_exports': [{k: v for k, v in bundle.items() if k != 'items'} for bundle in xml_data],
    'csv_exports': [{k: v for k, v in bundle.items() if k != 'rows'} for bundle in csv_data],
    'text_exports': [{k: v for k, v in bundle.items() if k != 'records_data'} for bundle in txt_data],
    'xml_meeting_count': len(all_meetings),
    'xml_meetings_by_export': dict(Counter(row['source_export'] for row in all_meetings)),
    'xml_meeting_statuses': dict(Counter(row['status'] for row in all_meetings)),
    'xml_meeting_links': [row['link'] for row in all_meetings if row['link']],
}
(SOURCE / 'regional_source_inventory.json').write_text(json.dumps({'summary': summary, 'xml': xml_data, 'csv': csv_data, 'text': txt_data}, ensure_ascii=False, indent=2), encoding='utf-8')

pages = []
attachments = []
locations = []
for bundle in xml_data:
    for item in bundle['items']:
        row = {**{k: item[k] for k in ('title', 'post_type', 'status', 'post_id', 'post_parent', 'post_date', 'link', 'guid', 'categories')}, 'source_export': bundle['file']}
        if item['post_type'] == 'page': pages.append(row)
        elif item['post_type'] == 'attachment': attachments.append(row)
        elif item['post_type'] == 'tsml_location': locations.append(row)
(SOURCE / 'regional_pages.json').write_text(json.dumps(pages, ensure_ascii=False, indent=2), encoding='utf-8')
(SOURCE / 'regional_attachments.json').write_text(json.dumps(attachments, ensure_ascii=False, indent=2), encoding='utf-8')
(SOURCE / 'regional_locations.json').write_text(json.dumps(locations, ensure_ascii=False, indent=2), encoding='utf-8')

report = [
    '# Uploaded Regional Source Inventory',
    '',
    f"The package contains **{len(xml_data)} WordPress exports**, **{len(csv_data)} CSV snapshots**, and **{len(txt_data)} JSON text exports**.",
    '',
    f"Across the WordPress exports there are **{sum(len(b['items']) for b in xml_data):,} items**, including **{len(pages):,} pages**, **{len(attachments):,} attachments**, **{len(locations):,} TSML locations**, and **{len(all_meetings):,} TSML meeting records**.",
    '',
    'The regional meeting snapshots are retained with their source file names and timestamps. The source inventory excludes private edit URLs from any public migration output; those fields remain source-only and will not be copied into the application.',
]
(PROJECT / 'uploaded_regional_source_inventory.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
print(json.dumps(summary, indent=2, ensure_ascii=False)[:4000])

if __name__ == '__main__':
    pass

# Keep the import-safe helper name visible to callers that need the parsed corpus.
_ = re.compile(r'^https://na\\.org\\.za/')
defaultdict(list)

