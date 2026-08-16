import csv
from pathlib import Path

register = Path('/home/ubuntu/na-south-africa-rebuild/final_url_migration_register.csv')
out = Path('/home/ubuntu/na-south-africa-rebuild/client/src/legacyRouteMap.ts')
rows = []
seen = set()
for row in csv.DictReader(register.open(encoding='utf-8')):
    url = row['legacy_url']
    if not url.startswith('http'):
        continue
    path = '/' + url.split('://', 1)[1].split('/', 1)[1] if '/' in url.split('://', 1)[1] else '/'
    path = path.split('?', 1)[0].split('#', 1)[0]
    if not path.startswith('/'):
        path = '/' + path
    if path in seen:
        continue
    seen.add(path)
    destination = row['final_destination']
    if destination == 'archive-or-noindex':
        destination = '/404'
    if not destination.startswith('/'):
        destination = '/about'
    rows.append((path, destination))
rows.sort()
with out.open('w', encoding='utf-8') as handle:
    handle.write('// Generated from final_url_migration_register.csv. Do not edit manually.\n')
    handle.write('export const legacyRouteMap: Record<string, string> = {\n')
    for path, destination in rows:
        handle.write(f'  {path!r}: {destination!r},\n')
    handle.write('};\n')
print(f'Generated {len(rows)} concrete legacy path mappings.')
