# Project TODO

- [x] Document the current national content inventory, regional routes, files, and redirects for the page-by-page migration register.
- [x] Define the public information architecture for Home, About NA, Recovery, Literature, News, Contact, and Areas.
- [x] Define the meeting, area, content, review, and notification data models with required meeting fields.
- [x] Implement role-based access control for national super-admins and strictly scoped area administrators.
- [x] Build the mobile-first public site with a persistent help pathway, accessible navigation, and high-contrast visual system.
- [x] Build the advanced meeting finder with full-text search, area/day/time/type filters, pagination, map clusters, and exact Google Maps directions.
- [x] Embed Google Maps directly in the meeting finder and implement address and coordinate validation.
- [x] Build area administrator dashboard and scoped meeting create, edit, delete, and content-management workflows.
- [x] Build national super-admin oversight, area administration, meeting review, and exact visible QA items: address verified, map pin confirmed, spelling checked, contact confirmed.
- [x] Implement in-app review notifications for area administrators and national super-administrators.
- [ ] Migrate and verify public pages, meeting records, maps, addresses, spelling, and contact details. Meeting data is verified for publication gating; 81 regional WordPress pages remain draft-staged pending page-level review.
- [ ] Add security controls, accessibility safeguards, validation, auditability, and error reporting. Security headers, validation, audit events, and runtime error reporting are implemented; formal accessibility tooling remains pending.
- [x] Write and run unit tests for permission isolation, meeting validation, search filters, and QA/review workflows.
- [ ] Perform responsive visual verification and end-to-end acceptance testing. Responsive screenshots and a live public-route smoke test exist; formal browser acceptance remains pending.
- [x] Produce the migration register, QA evidence, and administrator handover guidance. Migration registers and ADMIN_HANDOVER.md are present; page publication remains pending.
- [x] Add and route a public Areas page that explains area service coverage and links into the finder.
- [x] Implement the protected /admin landing experience before retaining the area-administration navigation entry.
- [x] Replace the temporary meeting-directory migration notice with the fully operational finder and embedded map.
- [x] Import verified meeting records so the public finder produces real results, pins, pagination, and directions end-to-end.
- [ ] Connect an organisation-approved transactional email provider so review alerts can be delivered as external email, not only as in-app alerts.
- [x] Extract all accessible public pages, regional routes, documents, media references, menus, and legacy URLs from the current website into the migration source inventory.
- [x] Build a complete content and media intake process for any WordPress export, media library, or downloadable archive supplied by the national organisation. XML/CSV/PDF intake, ZIP filtering, manifest generation, managed-storage mapping, and evidence are implemented.
- [ ] Recreate each documented public page and assign an explicit redirect decision for every legacy URL in the migration register. Route outcomes exist; full page recreation remains pending for draft-staged regional content.
- [ ] Complete individual QA and publication decisions for all 328 staged legacy meeting records using the current site as the source of truth.
- [x] Parse the uploaded day-and-region directory PDF and meeting CSV, reconcile them against the current-site corpus, and resolve any differences before final publication.

- [x] Inventory the five uploaded regional WordPress exports, seven meeting CSV snapshots, and four supporting text files.
- [x] Reconcile regional WordPress pages, menus, attachments, meeting/location records, and legacy URLs against the national source inventory.
- [x] Compare all uploaded meeting snapshots and resolve duplicate, stale, inactive, approximate, and region-assignment records using source timestamps and status fields.
- [ ] Apply verified regional content and meeting updates without importing private admin URLs, credentials, or unverified records. Public regional pages are staged as drafts; final publication remains pending review.
- [x] Produce an updated regional migration register, source reconciliation report, and QA evidence package.
- [x] Restore and verify the application build after the accidental storefront scaffold change before checkpoint delivery.
- [x] Save a checkpoint after the uploaded-source reconciliation and final verification are complete.

### Uploaded regional source inventory

- Johannesburg WordPress export: 285 items; 16 pages; 111 TSML meetings; 88 TSML locations; 23 attachments.
- KwaZulu-Natal WordPress export: 171 items; 6 pages; 63 TSML meetings; 52 TSML locations; 20 attachments.
- Pretoria WordPress export: 144 items; 7 pages; 42 TSML meetings; 32 TSML locations; 23 attachments.
- South Africa Region WordPress export: 694 items; 15 pages; 349 TSML meetings; 227 TSML locations; 19 attachments.
- Western Cape WordPress export: 416 items; 40 pages; 104 TSML meetings; 74 TSML locations; 69 attachments.
- Uploaded meeting CSV snapshots: 328-row national source plus regional snapshots of 62, 42, and 111 rows, with a further uploaded snapshot to reconcile.
- Supporting text exports contain JSON meeting records with source IDs, exact coordinates, attendance options, timestamps, source URLs, region ownership, and public contact metadata.
- [x] Remove or isolate the accidentally injected Shopify storefront scaffold if it is not required by the NA rebuild, while preserving the meeting platform and clean build.
- [x] Do not seed Shopify products or fabricate commerce content; the NA website scope does not require product catalog data.
- [x] Do not publish approximate or inactive online/location-only records as exact in-person meeting venues without a valid QA decision.

- [x] Resolve all 83 WordPress navigation object references to rebuilt routes, structured finder routes, or explicit archive/redirect decisions.
- [x] Apply all 49 uploaded meeting conflict decisions to the staged/public data model and verify that inactive or approximate online/location-only records are not published as exact in-person venues.
- [x] Assign explicit migration outcomes to all 218 content/event URLs still marked as content-migration candidates.
- [x] Regenerate the regional migration and QA evidence package after route reconciliation and conflict application.

- [x] Implement and verify a real media-library/archive intake workflow for uploaded ZIP assets, including manifest parsing, duplicate/missing-file checks, storage upload mapping, and page/asset linkage evidence. `uploads.zip` was executed with 154 canonical attachment uploads and zero missing upload results.
- [x] Run the media intake workflow against a supplied public media archive and record the resulting asset manifest, upload results, and unresolved file-review items.

- [x] Validate uploaded `uploads.zip` archive paths, file types, sizes, hashes, and private/unsafe content.
- [x] Reconcile `uploads.zip` files against the 154 WordPress attachment metadata records and source-page references.
- [x] Upload approved public media files from `uploads.zip` to managed storage and record returned URLs and page/asset linkage.
- [x] Run the completed media archive workflow against `uploads.zip`, update media evidence, rerun tests, and save a checkpoint.

- [x] Map each WordPress attachment to its originating page/post/location by parsing regional XML content references and persist that source-page linkage.
- [x] Rebuild the canonical media subset with unique relative storage paths so duplicate basenames cannot overwrite one another.
- [x] Re-upload the corrected unique media subset and verify the physical upload count against the per-attachment manifest.
- [x] Regenerate the final uploaded-media manifest with per-attachment managed URL, source page/record, and explicit duplicate/unresolved rationale.
- [x] Add an explicit per-attachment canonical-selection rationale, derivative count, and unresolved-status field to the final uploaded-media manifest.
- [x] Add an explicit per-attachment derivative or variant count derived from the archive reconciliation and regenerate the final media evidence package.
- [x] Recompute each attachment’s derivative variant count from the attachment-specific archive linkage rather than global filename-family matches.
- [x] Inspect representative final-manifest rows and document the attachment-specific variant evidence before the final verification checkpoint.
- [x] Rerun the corrected media workflow verification, tests, and production build before saving the fresh media-integration checkpoint.
- [ ] Run a documented responsive acceptance pass across the home page, meeting finder, meeting-detail journey, and administrative entry point.
- [ ] Run a documented keyboard and automated accessibility scan across the public navigation and meeting-finder controls, then remediate safe defects.
- [ ] Verify and document keyboard traversal of the desktop primary navigation, the mobile navigation toggle, and the expanded mobile navigation links.
- [ ] Record a native responsive interactive-browser keyboard pass for the mobile navigation, supplementing the desktop test-harness verification.
- [x] Rerun TypeScript checks, unit tests, and the production build after the latest public-layout accessibility changes.
- [x] Make the shared public main landmark programmatically focusable so skip-link activation transfers keyboard focus as well as viewport position.
- [x] Investigate and correct the meeting finder’s temporary Google Maps unavailable state observed in mobile responsive verification.
- [x] Compare the supplied legacy NA palette and typography against the rebuilt visual system, then apply only safe, evidence-led alignment changes.
- [x] Verify the legacy-aligned tokens across the home, meeting finder, long-form content, contact, and administrator entry routes at desktop and mobile widths.
- [x] Add a code-level regression test that verifies the supplied legacy palette and typography tokens are retained in the global stylesheet.
- [x] Rerun type checks, unit tests, and the production build after the global palette and typography changes.
