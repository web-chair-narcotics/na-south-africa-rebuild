from pathlib import Path
import csv, hashlib, json, mimetypes, zipfile

ZIP = Path('/home/ubuntu/upload/uploads.zip')
OUT_DIR = Path('/home/ubuntu/na-south-africa-rebuild/approved_media_extract')
REPORT = Path('/home/ubuntu/na-south-africa-rebuild/media_archive_filter_report.json')
MANIFEST = Path('/home/ubuntu/na-south-africa-rebuild/media_manifest_generated.csv')
OUT_DIR.mkdir(parents=True, exist_ok=True)
allowed = {'.jpg','.jpeg','.png','.gif','.webp','.svg','.pdf','.doc','.docx','.xls','.xlsx','.txt','.mp3','.mp4','.webm','.ico','.css','.js'}
blocked_parts = {'wp-defender','wpcode','rank-math','wc-logs','et_temp','forminator'}
blocked_names = {'.ftpquota','.htaccess','index.php','index.html'}
report = {'archive': str(ZIP), 'approved': [], 'excluded': [], 'unsafe': [], 'counts': {}}
with zipfile.ZipFile(ZIP) as archive:
    for info in archive.infolist():
        if info.is_dir():
            continue
        name = info.filename.replace('\\','/')
        parts = Path(name).parts
        ext = Path(name).suffix.lower()
        if Path(name).name in blocked_names or any(part in blocked_parts for part in parts):
            report['excluded'].append({'path': name, 'reason': 'private/plugin/runtime artifact'})
            continue
        if Path(name).is_absolute() or '..' in parts:
            report['unsafe'].append(name)
            continue
        if ext not in allowed:
            report['excluded'].append({'path': name, 'reason': f'non-public extension {ext or "none"}'})
            continue
        rel = Path(name)
        target = OUT_DIR / rel
        target.parent.mkdir(parents=True, exist_ok=True)
        data = archive.read(info)
        target.write_bytes(data)
        report['approved'].append({'archive_path': name, 'relative_path': str(rel), 'size': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'mime_type': mimetypes.guess_type(name)[0] or 'application/octet-stream'})
report['counts'] = {'approved': len(report['approved']), 'excluded': len(report['excluded']), 'unsafe': len(report['unsafe'])}
REPORT.write_text(json.dumps(report, indent=2), encoding='utf-8')
with MANIFEST.open('w', encoding='utf-8', newline='') as handle:
    fields = ['relative_path','archive_path','size','sha256','mime_type','original_url','source_page','alt_text','caption']
    writer = csv.DictWriter(handle, fieldnames=fields); writer.writeheader()
    for row in report['approved']:
        writer.writerow({**row, 'original_url':'', 'source_page':'', 'alt_text':'', 'caption':''})
print(json.dumps({'report': str(REPORT), 'manifest': str(MANIFEST), 'extract_dir': str(OUT_DIR), 'counts': report['counts']}, indent=2))
