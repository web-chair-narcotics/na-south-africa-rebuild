import json
from pathlib import Path
from collections import defaultdict

report = json.loads(Path('/home/ubuntu/na-south-africa-rebuild/LIVE_PARITY_AUDIT_REPORT.json').read_text())
rows = report['liveUniqueRows']
extras = [r for r in rows if '/meetings/' in r.get('url','') and '/blog/meetings/' not in r.get('url','')]
by = defaultdict(list)
for row in rows:
    by[(str(row.get('name','')).strip().lower(), str(row.get('day','')), str(row.get('time',''))) ].append(row)
for row in extras:
    key=(str(row.get('name','')).strip().lower(), str(row.get('day','')), str(row.get('time','')))
    print('\nEXTRA', {k:row.get(k) for k in ['id','name','day','time','attendance_option','region','url','formatted_address','latitude','longitude']})
    for counterpart in by[key]:
        if counterpart is not row:
            print('COUNTERPART', {k:counterpart.get(k) for k in ['id','name','day','time','attendance_option','region','url','formatted_address','latitude','longitude','data_source_name','source_slug']})
