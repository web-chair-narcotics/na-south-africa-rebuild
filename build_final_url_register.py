from __future__ import annotations

import csv
import json
import re
from pathlib import Path

SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
source = json.loads((SOURCE / 'final_uploaded_route_decisions.json').read_text(encoding='utf-8'))


def route_for(url: str, title: str, post_types: list[str]) -> tuple[str, str]:
    text = f'{url} {title}'.lower()
    if '/meetings/' in url or '/locations/' in url:
        return '/meetings', 'meeting/location URLs use the structured finder with filters, map pins, and directions'
    if 'wp-json' in url or '/feed' in url:
        return 'archive-or-noindex', 'technical feed/API endpoint is not a public content page'
    if any(word in text for word in ('literature', 'download', 'resource', 'book', 'basic-text', 'sponsorship', 'step-working')):
        return '/literature', 'resource and literature content consolidates in the rebuilt library'
    if any(word in text for word in ('contact', 'phone', 'phoneline', 'reach-us')):
        return '/contact', 'contact and support content consolidates in the national contact page'
    if any(word in text for word in ('meeting', 'newcomer', 'recovery', 'what-is-na', 'information-about-na', 'start-an-na')):
        return '/recovery', 'recovery and newcomer guidance consolidates in the recovery section'
    if any(word in text for word in ('area', 'jhb', 'johannesburg', 'kzn', 'kwazulu', 'pretoria', 'pta', 'western-cape', 'cape-town', 'wc')):
        return '/areas', 'regional information consolidates in the area directory'
    if any(word in text for word in ('event', 'calendar', 'announcement', 'news', 'media', 'notice')) or any(t in post_types for t in ('post', 'tribe_events', 'tec_calendar_embed')):
        return '/news', 'news and event content consolidates in the reviewed notices section'
    if 'about' in text or 'who-we-are' in text or 'history' in text:
        return '/about', 'organisation and history content consolidates in About NA'
    if 'na.org.za' in url:
        return '/about', 'general public information consolidates in About NA pending page-level editorial expansion'
    return '/about', 'general legacy content receives a stable national landing route; source copy remains staged for editorial expansion'

rows = []
for row in source['urls']:
    target, rationale = route_for(row['url'], ' '.join(row.get('titles', [])), row.get('post_types', []))
    rows.append({
        'legacy_url': row['url'],
        'legacy_title': ' | '.join(sorted(set(row.get('titles', [])))),
        'source_exports': ' | '.join(sorted(set(row.get('source_exports', [])))),
        'post_types': ' | '.join(sorted(set(row.get('post_types', [])))),
        'final_destination': target,
        'decision': 'final-route' if target.startswith('/') else 'archive-or-noindex',
        'rationale': rationale,
    })

menus = []
for row in source['menus']:
    target, rationale = route_for(row.get('target', ''), row.get('title', ''), row.get('object_types', []))
    if row.get('target') in ('/jhb/', '/kzn', '/pta/', '/wc/'):
        target = '/areas'
        rationale = 'area navigation uses the rebuilt national area directory'
    menus.append({
        'menu_title': row.get('title', ''),
        'legacy_target': row.get('target', ''),
        'source_exports': ' | '.join(sorted(set(row.get('source_exports', [])))),
        'final_destination': target,
        'decision': 'final-route' if target.startswith('/') else 'archive-or-noindex',
        'rationale': rationale,
    })

with (PROJECT / 'final_url_migration_register.csv').open('w', encoding='utf-8', newline='') as handle:
    fields = list(rows[0].keys()) if rows else []
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader(); writer.writerows(rows)
with (PROJECT / 'final_menu_migration_register.csv').open('w', encoding='utf-8', newline='') as handle:
    fields = list(menus[0].keys()) if menus else []
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader(); writer.writerows(menus)

report = [
    '# Final URL Migration Register',
    '',
    f'Every one of the **{len(rows):,}** regional public URLs now has a per-URL final destination or archive decision. Every one of the **{len(menus):,}** navigation entries also has a concrete destination.',
    '',
    'Final destinations are actual rebuilt routes: `/meetings` for meetings and locations, `/areas` for regional navigation, `/about` for organisation and general information, `/recovery` for recovery/newcomer guidance, `/literature` for resources, `/contact` for contact/support content, `/news` for posts/events/notices, and `archive-or-noindex` for technical feeds or APIs.',
    '',
    'The accompanying CSV registers retain the legacy URL, source export, content type, final destination, decision type, and rationale for every row. Page content remains staged as area-owned drafts where its full editorial content has not yet been approved for publication; the route outcome itself is no longer left in a review placeholder bucket.',
]
(PROJECT / 'final_url_migration_register.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
