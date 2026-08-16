# Uploaded-File Implementation Recap

## Scope and method

This audit covers the 28 files supplied in `/home/ubuntu/upload` and the 20 files retained in the project-shared source directory. Exact SHA-256 comparison found **48 file entries representing 27 unique binary/text sources**; **38 entries have an exact duplicate elsewhere**. The row-level register is `UPLOADED_FILE_AUDIT.csv`, and its deterministic generator is `audit_uploaded_sources.mjs`.

The status language is deliberately conservative. **Implemented** means the source has been represented in the running application or its verified evidence workflow. **Implemented-partial** means the source has been parsed or used, but publication, approved content, generated assets, or an organisation-owned decision remains. **Approval-dependent** means the upload is a specification or request whose activation requires a separate decision, target configuration, or credentials.

## What is built

| Uploaded source family | Evidence of implementation | Current result |
|---|---|---|
| Five regional WordPress XML exports | Regional parser, content model, migration registers, legacy route map, attachment linkage, and draft content staging | Parsed; 1,267 regional public URLs have concrete destinations, 81 regional pages remain draft-staged for authorised review. |
| Seven meeting CSV snapshots plus JSON meeting exports | Reconciliation workflow, conflict decisions, live meeting table, QA register, finder router, map pins, pagination, filters, and directions | 307 records are published and 21 are archived. The historical QA register preserves 328 staged source decisions without overriding live status. |
| Directory PDF and sitemap/source markdown | Parsed into directory and route/meeting evidence | Implemented in the migration and QA evidence package. |
| `uploads.zip` and `files (1).zip` | Archive validation, unsafe-path filtering, attachment-to-source linkage, unique canonical paths, managed-storage upload mapping, and final per-attachment manifest | 154 canonical attachment uploads are evidenced with 154 source-page links and zero unresolved canonical rows. |
| Audit reports and findings CSV | Findings were used to shape the public IA, route map, accessibility work, security headers, runtime error reporting, QA records, and acceptance evidence | Represented in the implementation evidence. |
| Colour-palette source | Global tokens, typography alignment, route screenshots, and `brandAlignment.test.ts` | Implemented and regression-tested. |
| `AreaSitePopulation.txt` | Four dedicated public area routes and landing pages are now implemented for Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal, with source-mapped directory filters and named image slots | Area page structure is built. The four approved generated hero files are not yet supplied or uploaded. |
| Supporting meeting text files | Reconciled as source snapshots and represented in meeting QA evidence | Implemented-partial because source truth still requires authorised row-level review before any staged record changes public status. |

## What is not yet complete

The five regional WordPress exports contain 81 draft-staged page records. The page routes and legacy redirects exist, but page-by-page publication decisions remain open. The historical meeting register contains 328 staged decisions, and each record still requires an authorised reviewer to confirm **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**. This is intentionally not bulk-approved by automation.

The uploaded area-site brief is now implemented as four dedicated landing pages and a generation-ready prompt pack in `AREA_SITE_IMAGE_PROMPTS.md`. The actual approved image files remain outstanding; inserting unreviewed generated artwork would be premature. External transactional email is also intentionally not configured because the organisation has not selected an approved provider and sender/domain.

The scheduled-maintenance prompt is a reusable auditor specification with placeholder configuration, a read-only operating model, and a weekly/daily cadence recommendation. It is not a concrete target configuration or an approval to create a recurring job. It therefore remains approval-dependent rather than being silently activated. If the organisation later wants it activated, the site needs the approved target scope, cadence, report destination, and owner approval before deployment and scheduling.

Formal native-mobile keyboard validation remains open. Desktop keyboard traversal, responsive screenshots, semantic scans, skip-link focus transfer, and public meeting-finder interaction checks are documented, but a real touch-device or native responsive interactive-browser pass has not been represented as complete.

## Current implementation status

The running application includes the mobile-first public site, persistent helpline, accessible navigation, dedicated area pages, advanced meeting finder, managed Google Maps with clustered markers and exact directions, scoped area administration, national oversight, four-item QA gating, audit events, in-app review notifications, runtime error reporting, migration fallback routing, and managed media evidence. The latest verification run after the dedicated area pages reports **20 passing unit tests across 10 files**, a clean TypeScript check, and a passing production build.

## Owner handoff order

The recommended order is to review and publish meeting records, then approve staged regional page content and area ownership, then supply and approve the four area hero images, then select an external email provider, and finally perform the native mobile keyboard pass. This preserves directory accuracy and avoids presenting unapproved or stale source material as current public content.

## Primary evidence files

`UPLOADED_FILE_AUDIT.csv`, `PUBLICATION_READINESS_REGISTER.md`, `ORGANISATIONAL_APPROVALS.md`, `QA_VERIFICATION.md`, `ADMIN_HANDOVER.md`, `MEDIA_INTAKE.md`, `AREA_SITE_IMAGE_PROMPTS.md`, `final_uploaded_media_manifest.csv`, `final_url_migration_register.csv`, and `meeting_qa_register.csv` provide the supporting evidence.
