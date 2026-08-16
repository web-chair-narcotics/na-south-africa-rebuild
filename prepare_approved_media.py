from pathlib import Path
import json, re, shutil, csv

linkage = json.loads(Path('/home/ubuntu/na-south-africa-rebuild/media_attachment_linkage.json').read_text(encoding='utf-8'))
source_root=Path('/home/ubuntu/na-south-africa-rebuild/approved_media_extract')
out_root=Path('/home/ubuntu/webdev-static-assets/na-south-africa')
out_root.mkdir(parents=True, exist_ok=True)
rows=[]
for row in linkage['rows']:
    candidates=row['archive_files']
    originals=[p for p in candidates if not re.search(r'-\\d{2,5}x\\d{2,5}(?=\\.[^.]+$)', p)]
    chosen=sorted(originals or candidates, key=lambda p:(len(p),p))[0] if (originals or candidates) else None
    if not chosen: continue
    src=source_root/chosen
    dest=out_root/Path(chosen).name
    if src.exists(): shutil.copy2(src,dest)
    rows.append({'attachment_id':row.get('attachment_id'),'title':row.get('title'),'source_export':row.get('source_export'),'source_url':row.get('source_url'),'archive_path':chosen,'local_path':str(dest)})
with (Path('/home/ubuntu/na-south-africa-rebuild/approved_media_manifest.csv')).open('w',encoding='utf-8',newline='') as h:
    fields=list(rows[0].keys()) if rows else []
    w=csv.DictWriter(h,fieldnames=fields); w.writeheader(); w.writerows(rows)
print(json.dumps({'canonical_attachment_files':len(rows),'output_dir':str(out_root),'manifest':'/home/ubuntu/na-south-africa-rebuild/approved_media_manifest.csv'},indent=2))
