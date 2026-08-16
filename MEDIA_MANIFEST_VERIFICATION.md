# Final Media Manifest Verification

The regenerated `final_uploaded_media_manifest.csv` contains 154 attachment rows and uses the composite key of **attachment ID plus source export** to retrieve each row’s exact reconciled `archive_files` set from `media_attachment_linkage.json`. The final report confirms 154 managed-storage URLs, 154 source-page links, zero missing upload results, zero unresolved rows, and zero canonical archive paths outside their attachment-specific linkage set.

| Representative attachment | Attachment-specific linked archive files | Canonical upload decision | Result |
|---|---:|---|---|
| Johannesburg `favicon.png` | 5 | Retain the exact canonical path and preserve 4 linked alternatives as traceable variants | Managed URL present; canonical path linked |
| Johannesburg `zapper.png` | 4 | Retain the exact canonical path and preserve 3 linked alternatives as traceable variants | Managed URL present; canonical path linked |
| Johannesburg `na-safety.jpg` | 1 | Retain the single linked canonical path; no linked alternative exists | Managed URL present; canonical path linked |

The `archive_variant_count`, `derivative_variant_count`, `archive_variant_paths_json`, `canonical_archive_path_linked`, and `derivative_variant_rationale` columns make this decision auditable on every row. A variant count records **linked archive alternatives for that particular WordPress attachment**, not a claim that every alternative should be published as a separate public asset.
