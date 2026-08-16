from pathlib import Path
import csv, json, re, xml.etree.ElementTree as ET

XMLS = sorted(Path('/home/ubuntu/upload').glob('narcoticsanonymous*.xml'))
ATT = json.loads(Path('/home/ubuntu/na-source-extract/uploaded-regional/regional_attachments.json').read_text(encoding='utf-8'))

def local_name(tag): return tag.split('}',1)[-1]
def text(node, name):
    for child in node.iter():
        if local_name(child.tag)==name:
            return (child.text or '').strip()
    return ''

def url_keys(value):
    value=str(value or '').lower()
    value=value.split('?',1)[0].split('#',1)[0]
    name=Path(value).name
    stem=Path(name).stem
    stem=re.sub(r'-\\d{2,5}x\\d{2,5}$','',stem)
    return {name, stem+Path(name).suffix}

attachments=[]
for row in ATT:
    keys=set()
    for field in ('title','guid','link','post_name'):
        keys |= url_keys(row.get(field))
    attachments.append({'attachment_id':row.get('post_id'),'title':row.get('title'),'source_export':row.get('source_export'),'source_url':row.get('guid') or row.get('link'),'keys':keys,'source_pages':[]})

all_items={}
for xml_path in XMLS:
    root=ET.parse(xml_path).getroot()
    for item in root.iter():
        if local_name(item.tag) != 'item': continue
        item_id=text(item,'post_id')
        all_items[(xml_path.name,item_id)]={'title':text(item,'title'),'url':text(item,'link'),'post_type':text(item,'post_type') or text(item,'post_type_name') or 'unknown','post_parent':text(item,'post_parent'),'xml_export':xml_path.name}

for xml_path in XMLS:
    root=ET.parse(xml_path).getroot()
    for item in root.iter():
        if local_name(item.tag) != 'item': continue
        title=text(item,'title'); link=text(item,'link'); post_type=text(item,'post_type') or text(item,'post_type_name') or 'unknown'; item_id=text(item,'post_id'); post_parent=text(item,'post_parent')
        blob=' '.join((node.text or '') for node in item.iter() if node.text).lower()
        blob_keys=set()
        for token in re.findall(r'https?://[^\s"<>]+|[A-Za-z0-9_./-]+\.(?:jpg|jpeg|png|gif|webp|pdf|docx?|xlsx?)', blob): blob_keys |= url_keys(token)
        for attachment in attachments:
            if attachment['source_export'] and attachment['source_export'] not in xml_path.name: continue
            parent_match = attachment.get('attachment_id') and post_parent == str(attachment['attachment_id'])
            if attachment['keys'] & blob_keys or parent_match:
                ref={'xml_export':xml_path.name,'source_id':item_id,'title':title,'url':link,'post_type':post_type,'relation':'text-reference' if attachment['keys'] & blob_keys else 'post-parent'}
                if ref not in attachment['source_pages']: attachment['source_pages'].append(ref)

rows=[]
for row in attachments:
    rows.append({
        'attachment_id':row['attachment_id'],'title':row['title'],'source_export':row['source_export'],'source_url':row['source_url'],'source_page_count':len(row['source_pages']),'source_pages_json':json.dumps(row['source_pages'],ensure_ascii=False)
    })
Path('/home/ubuntu/na-south-africa-rebuild/attachment_source_page_linkage.json').write_text(json.dumps(rows,indent=2,ensure_ascii=False),encoding='utf-8')
with open('/home/ubuntu/na-south-africa-rebuild/attachment_source_page_linkage.csv','w',encoding='utf-8',newline='') as h:
    fields=list(rows[0].keys()); w=csv.DictWriter(h,fieldnames=fields); w.writeheader(); w.writerows(rows)
print(json.dumps({'xml_exports':[p.name for p in XMLS],'attachment_count':len(rows),'linked_to_source_page_count':sum(r['source_page_count']>0 for r in rows),'unlinked_attachment_count':sum(r['source_page_count']==0 for r in rows)},indent=2))
