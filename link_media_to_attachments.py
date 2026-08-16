from pathlib import Path
import csv, json, re

manifest = list(csv.DictReader(open('/home/ubuntu/na-south-africa-rebuild/media_manifest_generated.csv', encoding='utf-8')))
attachments = json.loads(Path('/home/ubuntu/na-source-extract/uploaded-regional/regional_attachments.json').read_text(encoding='utf-8'))
files = [row['relative_path'] for row in manifest]

def base_variants(value):
    name = Path(str(value or '').split('?',1)[0]).name.lower()
    if not name: return set()
    stem = Path(name).stem
    ext = Path(name).suffix
    stem = re.sub(r'-\\d{2,5}x\\d{2,5}$', '', stem)
    return {name, stem + ext}

rows=[]; used=set()
for attachment in attachments:
    variants=set()
    for field in ('title','guid','link','post_name'):
        variants |= base_variants(attachment.get(field))
    matched=[]
    for file in files:
        filename=Path(file).name.lower()
        base=Path(filename).stem
        normalized=re.sub(r'-\\d{2,5}x\\d{2,5}$','',base)+Path(filename).suffix
        if filename in variants or normalized in variants:
            matched.append(file); used.add(file)
    rows.append({'attachment_id':attachment.get('post_id'),'title':attachment.get('title'),'source_export':attachment.get('source_export'),'source_url':attachment.get('guid') or attachment.get('link'),'archive_files':matched})
linked=sum(bool(row['archive_files']) for row in rows)
report={'attachment_count':len(attachments),'linked_attachment_count':linked,'unlinked_attachment_count':len(attachments)-linked,'archive_file_count':len(files),'linked_archive_file_count':len(used),'unlinked_archive_file_count':len(files)-len(used),'rows':rows}
Path('/home/ubuntu/na-south-africa-rebuild/media_attachment_linkage.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:report[k] for k in ['attachment_count','linked_attachment_count','unlinked_attachment_count','archive_file_count','linked_archive_file_count','unlinked_archive_file_count']},indent=2))
