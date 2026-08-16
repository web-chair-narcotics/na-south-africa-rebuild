from collections import Counter
from pathlib import Path
import csv
import hashlib
import json
import re

PROJECT = Path('/home/ubuntu/na-south-africa-rebuild')
rows = list(csv.DictReader((PROJECT / 'unique_media_manifest.csv').open(encoding='utf-8')))
result_lines = (PROJECT / 'unique_media_upload_results.txt').read_text(encoding='utf-8').splitlines()
attachment_linkage = json.loads((PROJECT / 'media_attachment_linkage.json').read_text(encoding='utf-8'))
archive_variants_by_attachment = {
    (entry['attachment_id'], entry['source_export']): sorted(set(entry['archive_files']))
    for entry in attachment_linkage['rows']
}

url_by_relative_path = {}
for line in result_lines:
    match = re.search(r'\[SUCCESS\] \./(.+?) -> (/.+)$', line)
    if match:
        url_by_relative_path[match.group(1)] = match.group(2).strip()

basename_counts = Counter(Path(row['unique_relative_path']).name for row in rows)
sha_by_path = {}
for row in rows:
    file_path = Path(row['local_path'])
    sha_by_path[row['unique_relative_path']] = hashlib.sha256(file_path.read_bytes()).hexdigest()
hash_counts = Counter(sha_by_path.values())

for row in rows:
    relative_path = row['unique_relative_path']
    basename = Path(relative_path).name
    sha256 = sha_by_path[relative_path]
    basename_collision_count = basename_counts[basename]
    identical_binary_count = hash_counts[sha256]
    attachment_key = (row['attachment_id'], row['source_export'])
    variant_paths = archive_variants_by_attachment.get(attachment_key, [])
    exact_canonical_present = row['archive_path'] in variant_paths
    derivative_variant_count = max(0, len(variant_paths) - 1)

    row['managed_storage_url'] = url_by_relative_path.get(relative_path, '')
    row['upload_status'] = 'uploaded' if row['managed_storage_url'] else 'missing-upload-result'
    row['source_linkage_status'] = 'linked' if int(row['source_page_count'] or 0) > 0 else 'attachment-only'
    row['sha256'] = sha256
    row['basename_collision_count'] = str(basename_collision_count)
    row['identical_binary_count'] = str(identical_binary_count)
    row['archive_variant_count'] = str(len(variant_paths))
    row['derivative_variant_count'] = str(derivative_variant_count)
    row['archive_variant_paths_json'] = json.dumps(variant_paths, ensure_ascii=False)
    row['canonical_archive_path_linked'] = 'yes' if exact_canonical_present else 'no'
    row['canonical_selection_status'] = 'retained-canonical-source-attachment'
    row['duplicate_or_variant_rationale'] = (
        'Retained as a distinct canonical attachment because the same basename occurs in '
        f'{basename_collision_count} source-relative records; the unique relative path prevents overwrite.'
        if basename_collision_count > 1 else
        'No basename collision; retained as the canonical approved source attachment at its unique relative path.'
    )
    row['binary_duplicate_rationale'] = (
        'Identical binary occurs in multiple source-relative attachments; each source attachment remains separately traceable and is not overwritten.'
        if identical_binary_count > 1 else
        'No identical-binary duplicate detected within the canonical attachment set.'
    )
    row['derivative_variant_rationale'] = (
        'No additional linked archive-file variants were recorded for this attachment.'
        if derivative_variant_count == 0 else
        f'{derivative_variant_count} additional linked archive-file variant(s) were recorded for this attachment; only the exact canonical attachment is in the controlled upload set.'
    )
    row['unresolved_status'] = (
        'missing-managed-upload-url' if not row['managed_storage_url'] else
        'missing-source-page-linkage' if row['source_linkage_status'] != 'linked' else
        'none'
    )

out = PROJECT / 'final_uploaded_media_manifest.csv'
with out.open('w', encoding='utf-8', newline='') as handle:
    writer = csv.DictWriter(handle, fieldnames=list(rows[0].keys()))
    writer.writeheader()
    writer.writerows(rows)

report = {
    'attachment_count': len(rows),
    'unique_archive_path_count': len({row['unique_relative_path'] for row in rows}),
    'uploaded_count': sum(row['upload_status'] == 'uploaded' for row in rows),
    'missing_upload_result_count': sum(row['upload_status'] != 'uploaded' for row in rows),
    'source_page_linked_count': sum(row['source_linkage_status'] == 'linked' for row in rows),
    'attachment_only_count': sum(row['source_linkage_status'] != 'linked' for row in rows),
    'records_with_basename_collision': sum(int(row['basename_collision_count']) > 1 for row in rows),
    'records_with_identical_binary': sum(int(row['identical_binary_count']) > 1 for row in rows),
    'records_with_derivative_variants': sum(int(row['derivative_variant_count']) > 0 for row in rows),
    'total_derivative_variant_references': sum(int(row['derivative_variant_count']) for row in rows),
    'canonical_archive_path_unlinked_count': sum(row['canonical_archive_path_linked'] != 'yes' for row in rows),
    'unresolved_count': sum(row['unresolved_status'] != 'none' for row in rows),
    'manifest': str(out),
}
(PROJECT / 'final_uploaded_media_report.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
print(json.dumps(report, indent=2))
