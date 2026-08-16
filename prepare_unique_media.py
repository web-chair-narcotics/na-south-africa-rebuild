from pathlib import Path
import csv, json, re, shutil

linkage=json.loads(Path('/home/ubuntu/na-south-africa-rebuild/media_attachment_linkage.json').read_text(encoding='utf-8'))
page_linkage={row['attachment_id']:row for row in json.loads(Path('/home/ubuntu/na-south-africa-rebuild/attachment_source_page_linkage.json').read_text(encoding='utf-8'))}
source_root=Path('/home/ubuntu/na-south-africa-rebuild/approved_media_extract')
out_root=Path('/home/ubuntu/webdev-static-assets/na-south-africa-unique')
if out_root.exists(): shutil.rmtree(out_root)
out_root.mkdir(parents=True)
rows=[]; used=set()
for row in linkage['rows']:
    candidates=row['archive_files']
    originals=[p for p in candidates if not re.search(r'-\d{2,5}x\d{2,5}(?=\.[^.]+$)', p)]
    chosen=sorted(originals or candidates, key=lambda p:(len(p),p))[0] if (originals or candidates) else None
    if not chosen: continue
    source_name=Path(row.get('source_export') or 'unknown').stem.replace('.WordPress.2026-08-16','')
    rel=Path(chosen)
    if rel.parts and rel.parts[0]=='uploads': rel=Path(*rel.parts[1:])
    dest_rel=Path(source_name)/rel
    if dest_rel in used: raise RuntimeError(f'Collision: {dest_rel}')
    used.add(dest_rel)
    src=source_root/chosen; dest=out_root/dest_rel; dest.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dest)
    page=page_linkage.get(row.get('attachment_id'),{})
    rows.append({'attachment_id':row.get('attachment_id'),'title':row.get('title'),'source_export':row.get('source_export'),'source_url':row.get('source_url'),'archive_path':chosen,'unique_relative_path':str(dest_rel),'local_path':str(dest),'source_page_count':page.get('source_page_count',0),'source_pages_json':page.get('source_pages_json','')})
with open('/home/ubuntu/na-south-africa-rebuild/unique_media_manifest.csv','w',encoding='utf-8',newline='') as h:
    fields=list(rows[0].keys()); w=csv.DictWriter(h,fieldnames=fields); w.writeheader(); w.writerows(rows)
print(json.dumps({'unique_attachment_files':len(rows),'unique_paths':len(used),'output_dir':str(out_root),'manifest':'/home/ubuntu/na-south-africa-rebuild/unique_media_manifest.csv'},indent=2))
