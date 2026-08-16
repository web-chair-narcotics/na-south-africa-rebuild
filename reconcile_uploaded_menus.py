from __future__ import annotations

import json
import re
import xml.etree.ElementTree as ET
from collections import Counter
from pathlib import Path

UPLOAD = Path('/home/ubuntu/upload')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
WP = {'wp': 'http://wordpress.org/export/1.2/', 'content': 'http://purl.org/rss/1.0/modules/content/'}


def text(node, tag: str) -> str:
    value = node.findtext(tag)
    return (value or '').strip()

menus = []
legacy_urls = []
for path in sorted(UPLOAD.glob('narcoticsanonymous*.xml')):
    root = ET.parse(path).getroot()
    for item in root.findall('.//item'):
        kind = text(item, '{http://wordpress.org/export/1.2/}post_type')
        link = text(item, 'link')
        title = text(item, 'title')
        if kind == 'nav_menu_item':
            meta = {}
            for pm in item.findall('{http://wordpress.org/export/1.2/}postmeta'):
                key = text(pm, '{http://wordpress.org/export/1.2/}meta_key')
                value = text(pm, '{http://wordpress.org/export/1.2/}meta_value')
                if key:
                    meta[key] = value
            target = meta.get('_menu_item_url') or meta.get('_menu_item_object_id') or link
            menus.append({'source_export': path.name, 'title': title, 'target': target, 'object': meta.get('_menu_item_object'), 'object_type': meta.get('_menu_item_type')})
        if kind in {'page', 'post', 'tsml_meeting', 'tsml_location', 'tribe_events', 'tribe_venue', 'tribe_organizer'} and link.startswith('http'):
            legacy_urls.append({'source_export': path.name, 'url': link, 'title': title, 'post_type': kind})

# De-duplicate menus and URLs while retaining all source exports.
menu_map = {}
for row in menus:
    key = (row['title'], row['target'])
    menu_map.setdefault(key, {'title': row['title'], 'target': row['target'], 'source_exports': [], 'object_types': []})
    menu_map[key]['source_exports'].append(row['source_export'])
    if row['object_type']:
        menu_map[key]['object_types'].append(row['object_type'])

url_map = {}
for row in legacy_urls:
    url_map.setdefault(row['url'], {'url': row['url'], 'titles': [], 'post_types': [], 'source_exports': []})
    url_map[row['url']]['titles'].append(row['title'])
    url_map[row['url']]['post_types'].append(row['post_type'])
    url_map[row['url']]['source_exports'].append(row['source_export'])

for row in menu_map.values():
    target = row['target'] or ''
    if target.startswith('http'):
        row['destination'] = '/meetings' if '/meetings' in target else 'content-route-review'
        row['redirect_decision'] = 'structured-finder' if '/meetings' in target else 'content-migration-required'
    else:
        row['destination'] = 'object-reference-review'
        row['redirect_decision'] = 'resolve-object-reference'

for row in url_map.values():
    row['destination'] = '/meetings' if '/meetings/' in row['url'] or '/locations/' in row['url'] else 'content-route-review'
    row['redirect_decision'] = 'structured-finder' if row['destination'] == '/meetings' else 'content-migration-required'

output = {'menus': sorted(menu_map.values(), key=lambda x: (x['title'], x['target'])), 'urls': sorted(url_map.values(), key=lambda x: x['url'])}
(Path('/home/ubuntu/na-source-extract/uploaded-regional/uploaded_menu_url_reconciliation.json')).write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding='utf-8')

report = [
    '# Uploaded Menu and Legacy URL Reconciliation',
    '',
    f"The regional exports contain **{len(menus):,} raw navigation items**, resolving to **{len(menu_map):,} distinct title/target pairs**, and **{len(legacy_urls):,} public content, meeting, location, and event URLs**, resolving to **{len(url_map):,} unique URLs**.",
    '',
    f"The navigation register routes **{sum(1 for row in menu_map.values() if row['redirect_decision'] == 'structured-finder'):,}** meeting/location entries to the structured finder, flags **{sum(1 for row in menu_map.values() if row['redirect_decision'] == 'content-migration-required'):,}** national or regional content entries for page migration, and leaves **{sum(1 for row in menu_map.values() if row['redirect_decision'] == 'resolve-object-reference'):,}** object references requiring an explicit review.",
    '',
    f"The URL register routes **{sum(1 for row in url_map.values() if row['redirect_decision'] == 'structured-finder'):,}** meeting/location URLs into the finder and records **{sum(1 for row in url_map.values() if row['redirect_decision'] == 'content-migration-required'):,}** information or event URLs as content-migration candidates. Administrative edit URLs are not included in either public register.",
]
(PROJECT / 'uploaded_menu_url_reconciliation.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
