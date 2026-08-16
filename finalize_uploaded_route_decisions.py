from __future__ import annotations

import json
import re
from collections import Counter
from pathlib import Path

SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
source = json.loads((SOURCE / 'regional_source_inventory.json').read_text(encoding='utf-8'))
menu_url = json.loads((SOURCE / 'uploaded_menu_url_reconciliation.json').read_text(encoding='utf-8'))

items_by_id = {}
for bundle in source['xml']:
    for item in bundle['items']:
        if item.get('post_id'):
            items_by_id.setdefault(item['post_id'], []).append({**item, 'source_export': bundle['file']})

area_routes = {
    '/jhb/': '/areas/johannesburg', '/kzn': '/areas/kwazulu-natal', '/pta/': '/areas/pretoria', '/wc/': '/areas/western-cape',
    'Johannesburg': '/areas/johannesburg', 'KwaZulu-Natal': '/areas/kwazulu-natal', 'Pretoria': '/areas/pretoria', 'Western Cape': '/areas/western-cape',
}
custom_routes = {
    'About NA': '/about', 'Areas': '/areas', 'Contact NA': '/contact', 'Meetings': '/meetings', 'Events': '/news',
    'For Members': '/literature', 'For Our Members': '/literature', 'For Service Members': '/literature', 'For The Public': '/about',
    'For The New Comer': '/recovery', 'For The Newcomer': '/recovery', 'Information for The Professionals': '/about', 'For The Professionals': '/about',
    'Resources': '/literature', 'Area Service': '/areas', 'Western Cape ASC': '/areas/western-cape', 'Johannesburg': '/areas/johannesburg',
    'KwaZulu-Natal': '/areas/kwazulu-natal', 'Pretoria': '/areas/pretoria', 'Western Cape': '/areas/western-cape',
}

def route_for_menu(row):
    title = re.sub(r'&#038;|&amp;', '&', row['title']).strip()
    target = (row['target'] or '').strip()
    if target.startswith('http'):
        if '/meetings/' in target or '/locations/' in target: return '/meetings', 'structured-finder'
        if target.startswith('https://na.org.za/'):
            return '/content/source-route-review', 'content-source-route'
        return target, 'external-link'
    if target in area_routes: return area_routes[target], 'area-route'
    if target.startswith('/') and target in area_routes: return area_routes[target], 'area-route'
    if target == '#': return custom_routes.get(title, '/content/source-route-review'), 'custom-section-mapped'
    if target.isdigit():
        candidates = items_by_id.get(target, [])
        if not candidates: return '/content/source-route-review', 'unresolved-object-id'
        item = sorted(candidates, key=lambda x: (x.get('post_type') not in ('page', 'post'), x.get('link', '')))[0]
        if item.get('post_type') in ('tsml_meeting', 'tsml_location'): return '/meetings', 'structured-finder'
        if item.get('post_type') == 'page': return '/content/source-route-review', 'page-draft-review'
        if item.get('post_type') in ('post', 'tribe_events', 'tribe_venue', 'tribe_organizer'): return '/news', 'news-event-review'
        return '/content/source-route-review', 'object-type-review'
    return '/content/source-route-review', 'unresolved-object-reference'

menu_decisions = []
for row in menu_url['menus']:
    destination, decision = route_for_menu(row)
    menu_decisions.append({**row, 'destination': destination, 'decision': decision})

url_decisions = []
for row in menu_url['urls']:
    url = row['url']
    if '/meetings/' in url or '/locations/' in url:
        destination, decision = '/meetings', 'structured-finder'
    elif '/wp-json/' in url or '/feed' in url:
        destination, decision = 'archive-or-noindex', 'technical-endpoint-not-public-page'
    elif '/events' in url or 'tribe' in ' '.join(row['post_types']):
        destination, decision = '/news', 'news-event-route'
    elif row['post_types'] == ['page'] or 'page' in row['post_types']:
        destination, decision = '/content/source-route-review', 'page-draft-review'
    elif 'post' in row['post_types']:
        destination, decision = '/news', 'news-route'
    else:
        destination, decision = '/content/source-route-review', 'content-route-review'
    url_decisions.append({**row, 'destination': destination, 'decision': decision})

result = {'menus': menu_decisions, 'urls': url_decisions}
(SOURCE / 'final_uploaded_route_decisions.json').write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding='utf-8')
report = [
    '# Final Uploaded Route Decisions',
    '',
    f"Resolved **{len(menu_decisions):,}** distinct navigation pairs and **{len(url_decisions):,}** unique public legacy URLs.",
    '',
    'Navigation decisions: ' + ', '.join(f'{key}={value}' for key, value in Counter(row['decision'] for row in menu_decisions).items()) + '.',
    '',
    'URL decisions: ' + ', '.join(f'{key}={value}' for key, value in Counter(row['decision'] for row in url_decisions).items()) + '.',
    '',
    'Every route now has a concrete destination or a documented archive/source-review decision. Meeting and location URLs go to the structured finder; information pages and news/event records go to content or news review routes; technical endpoints are not treated as public pages. WordPress administrative edit URLs are excluded.',
]
(PROJECT / 'final_uploaded_route_decisions.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
