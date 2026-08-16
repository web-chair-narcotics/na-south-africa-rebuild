from pathlib import Path
import csv, json, re

approved=list(csv.DictReader(open('/home/ubuntu/na-south-africa-rebuild/approved_media_manifest.csv',encoding='utf-8')))
results=Path('/home/ubuntu/na-south-africa-rebuild/approved_media_upload_results.txt').read_text(encoding='utf-8').splitlines()
url_by_name={}
for line in results:
    m=re.search(r'\[SUCCESS\] \./(.+?) -> (/.+)$',line)
    if m: url_by_name[m.group(1)] = m.group(2).strip()
for row in approved:
    row['managed_storage_url']=url_by_name.get(Path(row['local_path']).name,'')
    row['upload_status']='uploaded' if row['managed_storage_url'] else 'missing-upload-result'
out='/home/ubuntu/na-south-africa-rebuild/final_uploaded_media_manifest.csv'
with open(out,'w',encoding='utf-8',newline='') as h:
    fields=list(approved[0].keys()); w=csv.DictWriter(h,fieldnames=fields); w.writeheader(); w.writerows(approved)
report={'canonical_attachment_count':len(approved),'uploaded_count':sum(r['upload_status']=='uploaded' for r in approved),'missing_upload_result_count':sum(r['upload_status']!='uploaded' for r in approved),'storage_urls':[r['managed_storage_url'] for r in approved if r['managed_storage_url']]}
Path('/home/ubuntu/na-south-africa-rebuild/final_uploaded_media_report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps({k:report[k] for k in ['canonical_attachment_count','uploaded_count','missing_upload_result_count']},indent=2))
