import json
import re
from collections import Counter
from pathlib import Path

SOURCE = Path('/home/ubuntu/na-source-extract/uploaded-regional')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
pages = json.loads((SOURCE / 'regional_pages.json').read_text(encoding='utf-8'))
attachments = json.loads((SOURCE / 'regional_attachments.json').read_text(encoding='utf-8'))
locations = json.loads((SOURCE / 'regional_locations.json').read_text(encoding='utf-8'))

seen = {}
for row in pages:
    url = row.get('link') or row.get('guid') or f"wp-item:{row.get('post_id')}"
    seen.setdefault(url, []).append(row)

routes = []
for url, rows in sorted(seen.items()):
    title = next((row.get('title', '') for row in rows if row.get('title')), '')
    routes.append({
        'legacy_url': url,
        'title': title,
        'source_exports': sorted({row['source_export'] for row in rows}),
        'duplicate_source_count': len(rows),
        'migration_destination': '/meetings' if '/meetings' in url else 'content-page-review',
        'migration_status': 'source-inventory',
        'redirect_decision': 'pending-national-review',
    })

media_urls = set()
for row in pages + attachments + locations:
    for value in (row.get('link', ''), row.get('guid', '')):
        if value and re.match(r'^https?://', value):
            media_urls.add(value)

register = {
    'route_count': len(routes),
    'duplicate_route_count': sum(1 for row in routes if row['duplicate_source_count'] > 1),
    'attachment_count': len(attachments),
    'location_count': len(locations),
    'route_types': dict(Counter(row['migration_destination'] for row in routes)),
    'routes': routes,
}
(SOURCE / 'uploaded_page_register.json').write_text(json.dumps(register, ensure_ascii=False, indent=2), encoding='utf-8')
report = [
    '# Uploaded Page and Asset Register',
    '',
    f"The uploaded regional exports contain **{len(pages):,} page items**, **{len(attachments):,} attachment items**, and **{len(locations):,} location items**. After combining duplicate URLs across regional exports, the working register contains **{len(routes):,} unique public page URLs**.",
    '',
    f"The register identifies **{sum(1 for row in routes if row['duplicate_source_count'] > 1):,} duplicate-source page URLs**. Meeting and location URLs are directed into the structured finder and area models; national and regional information pages are retained for content-page migration and explicit redirect review.",
    '',
    'The register intentionally keeps every route at `pending-national-review` until its content has been mapped into a rebuilt page or an explicit redirect. It excludes WordPress administrative edit URLs from public destinations.',
]
(PROJECT / 'uploaded_page_register.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
print('\n'.join(report))
