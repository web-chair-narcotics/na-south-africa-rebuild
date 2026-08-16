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
- [x] Add security controls, accessibility safeguards, validation, auditability, and error reporting. Security headers, validation, audit events, runtime error reporting, semantic scans, and keyboard safeguards are implemented; native touch-device validation remains tracked separately.
- [x] Write and run unit tests for permission isolation, meeting validation, search filters, and QA/review workflows.
- [ ] Perform responsive visual verification and end-to-end acceptance testing. Responsive screenshots, live public-route smoke tests, finder interactions, and dedicated meeting-detail checks are documented; broader administrator workflow and native touch-device validation remain open.
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
- [x] Run a documented responsive acceptance pass across the home page, meeting finder, meeting-detail journey, and administrative entry point; the meeting-detail portion is now separately evidenced.
- [x] Explicitly verify that the meeting finder Next control advances to a later page and changes the page indicator and result set.
- [x] Run a documented keyboard and automated accessibility scan across the public navigation and meeting-finder controls, then remediate safe defects.
- [x] Verify and document keyboard traversal of the desktop primary navigation, the mobile navigation toggle, and the expanded mobile navigation links.
- [ ] Record a native responsive interactive-browser keyboard pass for the mobile navigation, supplementing the desktop test-harness verification.
- [x] Rerun TypeScript checks, unit tests, and the production build after the latest public-layout accessibility changes.
- [x] Produce a concise publication-readiness register for the 81 draft-staged regional pages and the remaining national meeting QA decisions.
- [x] Run documented public meeting-finder interaction acceptance checks for filtering, map selection, pagination, and exact Google Maps directions URLs.
- [x] Make the shared public main landmark programmatically focusable so skip-link activation transfers keyboard focus as well as viewport position.
- [x] Investigate and correct the meeting finder’s temporary Google Maps unavailable state observed in mobile responsive verification.
- [x] Compare the supplied legacy NA palette and typography against the rebuilt visual system, then apply only safe, evidence-led alignment changes.
- [x] Verify the legacy-aligned tokens across the home, meeting finder, long-form content, contact, and administrator entry routes at desktop and mobile widths.
- [x] Add a code-level regression test that verifies the supplied legacy palette and typography tokens are retained in the global stylesheet.
- [x] Rerun type checks, unit tests, and the production build after the global palette and typography changes.

- [x] Define four distinct area-site visual directions and named image jobs for Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal.
- [x] Produce generation-ready prompts for the four area hero images, including text-safe composition, accessibility, and shared NA brand constraints.
- [x] Document the area-image asset naming and page-placement map for later managed-storage intake.

- [x] Clarify in the national administrator overview that the live submitted queue is separate from the 328-record historical staged-review register, without changing publication status.

- [x] Document the remaining organisation-owned approvals and inputs: 81 regional page publication decisions, 328 staged meeting QA decisions, an approved transactional email provider, and native mobile keyboard validation.

- [x] Harden the Maps loader against stale or partially initialized scripts so transient proxy failures do not leave the meeting finder in an unnecessary fallback state.

- [x] Inventory every uploaded file and classify its implementation status as built, staged, evidence-only, duplicate, or requiring organisational approval.
- [x] Map uploaded requirements and source records to public routes, area administration, database workflows, QA evidence, tests, and live deployment.
- [x] Implement feasible missing items identified by the uploaded-file audit without publishing unapproved content.
- [x] Produce a complete uploaded-file audit recap separating completed work, outstanding work, and approval-dependent blockers.

- [x] Implement dedicated public area landing pages for Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal, while keeping area-specific factual content limited to verified source evidence.

- [x] Add a published-only public meeting-detail route linked from finder results so each meeting has a dedicated verified detail journey.

- [x] Make the meeting-detail primary action format-aware so online meetings do not show physical directions without a verified venue.
- [x] Live-verify one in-person detail route, one online detail route, a not-found route, contact actions, and the resulting CTA behavior.

- [x] Correct stale handover and QA evidence statements that still describe completed media intake or accessibility scans as pending.

- [x] Capture and document the actual `/meetings/:id` route at desktop and mobile widths as part of the responsive acceptance pass.
- [ ] Complete and document an end-to-end acceptance pass across public core journeys and administrator entry/workflow boundaries, without claiming organisation-owned publication decisions are complete.

- [ ] Run and document an authenticated administrator boundary acceptance pass with an authorised account, verifying protected entry, role-scoped access, and inaccessible unauthorised workflow surfaces.

- [x] Apply the supplied uploaded colour palette consistently across all public, area, meeting-detail, and administrator surfaces instead of retaining legacy page-level green treatments.
- [x] Reconcile every client-side hard-coded colour against the supplied palette and record any intentional contrast exceptions.
- [x] Re-run full visual, responsive, accessibility, TypeScript, unit-test, and production-build verification after the whole-site palette update.

- [x] Correct the palette migration’s malformed white literal and align the regression test with palette usage across the full client source.

- [x] Correct palette-induced contrast regressions where accent green foregrounds or button text now match the accent green background.
- [x] Re-run desktop and mobile palette screenshots after contrast remediation and confirm no text becomes unreadable.

- [x] Re-run and document post-palette accessibility verification on updated routes, including keyboard traversal and semantic/contrast-focused checks.

- [ ] Re-run and document post-palette keyboard traversal on Home, Meetings, Meeting Detail, Area Page, and Admin entry, confirming skip-link focus, navigation order, visible focus, and CTA usability. Source-level safeguards passed; real interactive-browser traversal remains open.

- [x] Extract and document the authoritative blue palette from the supplied na.org reference site, then align the rebuild’s visual system to it.
- [x] Deep-dive the complete meeting directory against the supplied live reference and all imported sources, identify missing records, and document each discrepancy and root cause.
- [x] Add regression coverage preventing verified meetings from being omitted by search, pagination, area/day/type filters, or publication-status handling.
- [x] Repair published meetings with blank day schedules or placeholder times from their one-to-one live TSML source records, then verify day-filter discoverability.
- [x] Correct the low-contrast eyebrow text on the new na.org-blue hero surfaces and re-verify desktop and mobile contrast.
- [x] Add behavioural finder coverage proving published records remain discoverable by day, area, type, and pagination, including repaired Sunday and daily schedules.
- [x] Implement a reusable legacy schedule parser for future imports that decodes TSML numeric Sunday and name-encoded Daily schedules before database persistence.
- [x] Add behavioural regression coverage through the reusable schedule parser showing numeric-Sunday and Daily-source meetings produce correct days and time before finder filtering.
- [x] Prepare an area-owner confirmation register for the 21 live legacy listings marked inactive, so they can be safely reactivated or retained as archived with an explicit decision.
- [x] Update the organisational approval handoff with the current checkpoint and the new inactive-meeting confirmation register.

- [x] Build a distinct regional landing site for the South Africa Region and retain dedicated landing sites for Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal.
- [x] Replace the three non-actionable homepage feature blocks with direct shortcuts for finding a nearby meeting, getting directions/contact help, and understanding first steps/recovery support.
- [x] Define a five-image hero asset system with unique site labels, exact filenames, dimensions, aspect ratio, responsive crop guidance, alt text, and placement rules.
- [x] Update the area-image prompt pack with high-quality, location-specific prompts for the region and all four areas, with no embedded text, no fabricated logos, and clear visual acceptance criteria.
- [x] Add an emergency-notice content path that can be activated by authorised administrators without changing inactive meeting status.
- [x] Connect approved generated hero assets to the corresponding five site landing experiences after asset intake.

- [x] Correct the South Africa Region site CTA so it opens the national meeting finder rather than applying a non-existent area filter.
- [x] Make the pending hero-asset state explicit on each site until the organisation supplies the five approved generated images.

- [x] Correct the Johannesburg area visual label so it does not use low-contrast green text on the primary blue hero panel.

- [x] Update the organisational approval register with the live five-site domain and exact five-hero asset intake requirements.

- [x] Deliver a downloadable five-image generation brief with exact route labels, filenames, dimensions, prompts, alt text, crop guidance, and acceptance checks.

- [x] Validate the supplied hero ZIP against the five-site manifest, including exact filenames, dimensions, WebP format, visual safety, and route mapping. All supplied candidates are held for re-export; Johannesburg is missing.
- [x] Upload approved hero assets to managed storage and connect them to the corresponding five site routes after validation.

- [x] Replace the first five-image prompt pack with a stricter Nano Banana 2K art-direction brief containing exact camera, composition, label, exclusion, and per-image acceptance instructions.

- [x] Fix the public emergency.active query so an empty active-notice result returns a defined value and never triggers a TanStack Query undefined-data error.
- [x] Add regression coverage for emergency.active with both no active notice and an active notice response.

- [x] Validate the five newly supplied 2K hero images against the route labels, actual file signatures, dimensions, and crop-safe asset contract without reopening them in the file viewer.
- [x] Connect the validated five hero images to their exact regional site routes and document the final asset mapping.

- [x] Refresh the organisational approval register so it no longer says the five hero assets are pending after the corrected assets were connected.


## Live-source meeting and page rescan requested 16 August 2026

- [ ] Re-scan the complete live public site from the supplied authoritative directory URLs, following all relevant internal links and recording crawl coverage.
- [x] Extract and normalize every live in-person and online meeting listing from the supplied directories and linked public sources, preserving source URLs and live status.
- [x] Reconcile the live-source meeting corpus against the rebuilt 328-record dataset and classify additions, removals, changed fields, duplicates, inactive records, and unresolved discrepancies.
- [x] Apply only verified live-source meeting and page corrections to the rebuild, retaining inactive listings as inactive unless current evidence shows a published active listing.
- [x] Verify the public finder and online-meeting journeys against the reconciled live corpus, including Google Maps links for physical venues and join/contact paths for online meetings.
- [x] Produce a complete rescan audit with crawl scope, source URLs, record counts, discrepancy classifications, implementation results, and explicit blockers.


## Complete live-site parity rescan requested 16 August 2026

- [ ] Crawl every publicly reachable area route, meeting directory, meeting detail, online-meeting listing, and linked public page on the current na.org.za site; the three supplied URLs are examples only and receive no special treatment.
- [x] Build a source-of-truth inventory of every live/published item with its URL, area, meeting type, status, schedule, address or online join/contact path, and source timestamp where available.
- [x] Compare the complete live inventory with the Manus corpus and classify every difference before changing public data.
- [x] Enforce exact live-status parity: publish current live items, retain current inactive/unpublished items as non-public, and do not promote records found only in stale imports.
- [x] Verify every implemented public meeting and online-meeting path, including maps and directions for physical meetings and join/contact behavior for online meetings.
- [x] Save a complete parity audit and checkpoint with counts, source coverage, discrepancies, and implementation outcomes.


## Consolidated full-audit execution requested 16 August 2026

- [x] Read and apply the supplied `NA-SA-Master-Rebuild-Audit-Spec.md` as the governing audit checklist for this execution.
- [x] Analyze the supplied `NA-South-Africa-All-Meetings.xlsx` as a source dataset and reconcile every row against the current live site and Manus meeting corpus.
- [x] Re-inventory every uploaded and project-shared file, including archives, exports, CSVs, spreadsheets, text specifications, media manifests, and prior audit evidence.
- [ ] Complete the all-area, all-meeting-type live-site parity crawl and preserve the complete source inventory and crawl coverage evidence.
- [x] Implement all verified corrections from the consolidated audit without publishing records absent from the current live site or changing inactive status without current evidence.
- [x] Run the complete final verification suite and produce a single consolidated audit, implementation recap, and explicit blocker register.


## Meeting-format separation clarification requested 16 August 2026

- [x] Separate online, in-person, hybrid, and inactive meetings across every imported source, live-parity comparison, database record, finder filter, result card, map point, meeting-detail page, area view, and QA report.
- [x] Verify that online-only records never receive physical map/directions treatment, in-person records retain verified address/map/directions behavior, and hybrid records expose both only when each path is present in the live source.
- [x] Add regression coverage for the format-separation rules and update the complete parity audit evidence with separate counts and discrepancy classes.


## Verified live Area-source corrections identified 16 August 2026

- [x] Apply current Area-feed source-of-record corrections for live meeting rows that conflict with Region-import status or route data, beginning with the two Soshanguve meetings that are active in the live Pretoria Area feed but archived in the rebuild.
- [x] Preserve an auditable before/after register for every live-source correction and re-run public-visibility, format-separation, and finder regression checks after the update.


## Legacy directory format-preserving redirects requested 16 August 2026

- [x] Route every legacy online-meetings directory path to the rebuilt finder with the online filter preserved.
- [x] Route every legacy in-person-meetings directory path to the rebuilt finder with the in-person filter preserved.
- [x] Add regression coverage for format-preserving legacy directory redirects and initial finder filter state.

## Logo integration and meeting-path separation requested 16 August 2026

- [x] Validate and upload the supplied NA South Africa logo to managed storage, then use it as the public brand mark without distorting or cropping the wordmark.
- [x] Add two unmistakably distinct home-page entry paths for in-person and online meetings, with clear copy, query-preserving links, and accessible labels.
- [x] Re-audit every current live online meeting across all canonical Area feeds, confirming source URLs, online access details, status, and the absence of physical-address/map treatment by default.
- [x] Verify all primary public links, every five-site landing route and hero asset, legacy online/in-person directories, finder filters, maps, directions, and online join paths.
- [x] Publish a fully tested review checkpoint after the logo, distinct meeting pathways, online audit, and link verification are complete.

## Finder format-specific copy correction identified 16 August 2026

- [x] Make the online-filtered finder heading and explanatory copy explicitly online-only, with no venue, map, or directions language.
- [x] Remove physical-venue wording from the online-only finder search placeholder while retaining the broader search placeholder for physical and hybrid routes.
