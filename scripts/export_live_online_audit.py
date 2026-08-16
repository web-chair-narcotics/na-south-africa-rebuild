import csv
import json
from pathlib import Path

ROOT = Path('/home/ubuntu/na-south-africa-rebuild')
report = json.loads((ROOT / 'LIVE_PARITY_AUDIT_REPORT.json').read_text(encoding='utf-8'))

rows = [row for row in report['liveUniqueRows'] if str(row.get('attendance_option', '')).strip().lower() == 'online']
rows.sort(key=lambda row: (str(row.get('name', '')).lower(), str(row.get('day', '')), str(row.get('time', ''))))

columns = [
    'id', 'name', 'feed_site', 'region', 'day', 'time', 'attendance_option',
    'url', 'conference_url', 'conference_url_notes', 'conference_phone',
    'entity_email', 'feedback_emails', 'data_source_name', 'source_slug',
]
with (ROOT / 'LIVE_ONLINE_MEETING_AUDIT.csv').open('w', newline='', encoding='utf-8') as handle:
    writer = csv.DictWriter(handle, fieldnames=columns)
    writer.writeheader()
    for row in rows:
        writer.writerow({column: row.get(column, '') for column in columns})

with (ROOT / 'LIVE_ONLINE_MEETING_AUDIT.md').open('w', encoding='utf-8') as handle:
    join_urls = sum(1 for row in rows if row.get('conference_url'))
    contact_fallbacks = sum(1 for row in rows if not row.get('conference_url') and (row.get('conference_phone') or row.get('entity_email') or row.get('feedback_emails')))
    no_access = len(rows) - join_urls - contact_fallbacks
    handle.write('# Live online meeting audit\n\n')
    handle.write(f"The fresh canonical feed pull contains **{len(rows)}** online meeting fingerprints across the Region and four Area feeds. The feed-level online category is treated separately from physical venues.\n\n")
    handle.write('| Online access state | Live-source records |\n|---|---:|\n')
    handle.write(f'| Verified join URL present | {join_urls} |\n')
    handle.write(f'| Contact fallback present without join URL | {contact_fallbacks} |\n')
    handle.write(f'| No join URL or contact fallback in the live feed | {no_access} |\n\n')
    handle.write('Every row, including source feed, meeting URL, schedule, and any supplied online access fields, is retained in `LIVE_ONLINE_MEETING_AUDIT.csv`. Physical address, venue, map, and directions fields are deliberately excluded from this online-only audit export.\n')
print(json.dumps({'online_fingerprints': len(rows), 'join_urls': join_urls, 'contact_fallbacks': contact_fallbacks, 'no_access': no_access}, indent=2))
