from pathlib import Path
import csv, json, re

manifest = Path('/home/ubuntu/na-south-africa-rebuild/media_manifest_generated.csv')
meta = Path('/home/ubuntu/na-source-extract/uploaded-regional/regional_attachments.json')
out = Path('/home/ubuntu/na-south-africa-rebuild/media_reconciliation_report.json')
files = list(csv.DictReader(manifest.open(encoding='utf-8')))
attachments = json.loads(meta.read_text(encoding='utf-8'))

def keys(value):
    text = str(value or '').lower()
    return {text, text.rsplit('/', 1)[-1], re.sub(r'[^a-z0-9]+', '', text)}
attachment_keys = set()
for row in attachments:
    for field in ('title','guid','link','post_name'):
        attachment_keys |= keys(row.get(field))
matched=[]; unlinked=[]
for row in files:
    candidate = set()
    for field in ('relative_path','archive_path'):
        candidate |= keys(row.get(field))
    if any(key in attachment_keys for key in candidate if key): matched.append(row)
    else: unlinked.append(row)
by_hash={}
for row in files: by_hash.setdefault(row['sha256'], []).append(row['relative_path'])
duplicates=[paths for paths in by_hash.values() if len(paths)>1]
report={'attachment_count':len(attachments),'approved_file_count':len(files),'filename_or_url_matched_count':len(matched),'unlinked_approved_file_count':len(unlinked),'duplicate_content_groups':duplicates,'unlinked_examples':[row['relative_path'] for row in unlinked[:100]],'status':'review-required'}
if not unlinked and not duplicates: report['status']='ready-for-approved-upload'
out.write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
