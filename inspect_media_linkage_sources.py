from pathlib import Path
import json, xml.etree.ElementTree as ET
ATT=json.loads(Path('/home/ubuntu/na-source-extract/uploaded-regional/regional_attachments.json').read_text())
print('attachment sample', json.dumps(ATT[:3], indent=2, ensure_ascii=False))
def ln(tag): return tag.split('}',1)[-1]
def tx(node, name):
  for c in node.iter():
    if ln(c.tag)==name: return (c.text or '').strip()
  return ''
for p in sorted(Path('/home/ubuntu/upload').glob('narcoticsanonymous*.xml')):
  root=ET.parse(p).getroot(); count=0
  for item in root.iter():
    if ln(item.tag)!='item': continue
    pt=tx(item,'post_type')
    if pt=='attachment':
      print('xml',p.name,'id',tx(item,'post_id'),'parent',tx(item,'post_parent'),'title',tx(item,'title'),'guid',tx(item,'guid'),'link',tx(item,'link'))
      count+=1
      if count>=3: break
