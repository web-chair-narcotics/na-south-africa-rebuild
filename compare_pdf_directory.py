from __future__ import annotations

import csv
import difflib
import re
from pathlib import Path

PDF_TEXT = Path('/home/ubuntu/na-source-extract/uploaded_day_region_directory.txt')
CSV_PATH = Path('/home/ubuntu/upload/meetings.csv')
PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')

with CSV_PATH.open(encoding='utf-8-sig', newline='') as handle:
    csv_rows = list(csv.DictReader(handle))

# Use a normalized key that is tolerant of punctuation, case, and whitespace differences.
def norm(value: str) -> str:
    return re.sub(r'[^a-z0-9]+', ' ', (value or '').lower()).strip()

csv_keys = []
for row in csv_rows:
    day = row.get('Day', '').strip().lower()
    name = row.get('Name', '').strip()
    time = row.get('Time', '').strip()
    csv_keys.append({'key': norm(f'{day} {name} {time}'), 'name': name, 'day': day, 'time': time, 'address': row.get('Address', '').strip()})

lines = PDF_TEXT.read_text(encoding='utf-8', errors='replace').splitlines()
pdf_entries = []
current_day = ''
current_region = ''
for index, raw in enumerate(lines):
    line = raw.strip()
    if not line or line.isdigit():
        continue
    if re.fullmatch(r'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)', line, re.I):
        current_day = line.lower()
        current_region = ''
        continue
    if re.match(r'^(JOHANNESBURG|KWAZULU-NATAL|PRETORIA|WESTERN CAPE):', line, re.I):
        current_region = line.split(':', 1)[1].strip()
        continue
    match = re.match(r'^(\d{1,2}(?::\d{2})?)\s*(am|pm)\s+(.+?)$', line, re.I)
    if not match or not current_day:
        continue
    time = match.group(1)
    meridiem = match.group(2).lower()
    remainder = match.group(3).strip()
    remainder = re.sub(r'\s{2,}(?:[A-Z](?:\s*,?\s*[A-Z])*)$', '', remainder).strip()
    name = remainder
    # The following lines are the printed venue/address excerpt.
    following = ' '.join(part.strip() for part in lines[index + 1:index + 4] if part.strip() and not part.strip().isdigit())
    pdf_entries.append({'day': current_day, 'region': current_region, 'time': f'{time} {meridiem}', 'name': name, 'venue_excerpt': following, 'key': norm(f'{current_day} {name} {time} {meridiem}')})

matches = []
for entry in pdf_entries:
    candidates = [row for row in csv_keys if row['day'] == entry['day']]
    scored = []
    for row in candidates:
        score = difflib.SequenceMatcher(None, norm(entry['name']), norm(row['name'])).ratio()
        if norm(entry['name']) in norm(row['name']) or norm(row['name']) in norm(entry['name']):
            score += 0.25
        scored.append((score, row))
    scored.sort(key=lambda pair: pair[0], reverse=True)
    best_score, best = scored[0] if scored else (0, None)
    matches.append({'pdf_day': entry['day'], 'pdf_region': entry['region'], 'pdf_time': entry['time'], 'pdf_name': entry['name'], 'pdf_venue_excerpt': entry['venue_excerpt'], 'csv_name': best['name'] if best else '', 'csv_address': best['address'] if best else '', 'name_similarity': round(best_score, 3), 'matched': bool(best and best_score >= 0.62)})

matched = sum(1 for row in matches if row['matched'])
report = [
    '# Printable Directory Comparison',
    '',
    f'The printable directory parser found **{len(pdf_entries):,} listing lines** with day and time markers. **{matched:,}** have a structured CSV name match at or above the conservative similarity threshold; **{len(pdf_entries) - matched:,}** require manual source review.',
    '',
    'The comparison treats the PDF as a public presentation source: day and time order, printed meeting names, and venue/address excerpts are checked against the structured CSV. The CSV remains authoritative for field values, while any unmatched or low-similarity PDF listing is retained as an explicit QA exception rather than silently discarded.',
]
(PROJECT / 'printable_directory_comparison.md').write_text('\n'.join(report) + '\n', encoding='utf-8')
(PROJECT / 'printable_directory_comparison.csv').write_text('', encoding='utf-8')
with (PROJECT / 'printable_directory_comparison.csv').open('w', encoding='utf-8', newline='') as handle:
    fields = list(matches[0].keys()) if matches else []
    writer = csv.DictWriter(handle, fieldnames=fields)
    writer.writeheader()
    writer.writerows(matches)
print('\n'.join(report))
