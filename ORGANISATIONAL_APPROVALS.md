# Organisational Approval Handoff

The rebuilt national platform is operational for the public meeting finder, national and area administration, QA gating, migration routing, and managed media evidence. The remaining items below require decisions or credentials owned by the national organisation rather than additional anonymous automation.

| Decision or input | Current evidence | Required organisation action | Effect on publication |
|---|---|---|---|
| Regional page publication | 81 WordPress-derived pages are staged as drafts; final destinations are assigned in the migration register. | Review each page for wording, ownership, links, images, and whether it should be published, revised, merged, or archived. | No page is published from the draft queue until an authorised reviewer approves it. |
| Meeting QA and publication | 307 meetings are live under the four-item gate; 21 additional legacy listings are currently marked `attendance_option=inactive` by the live TSML source and have an area-owner confirmation register; the historical register contains 328 staged meeting decisions, with the live submitted queue separate from that register. | National/area reviewers confirm current address, map pin, spelling, contact, schedule changes, and—in the 21-record confirmation register—whether an inactive listing has resumed or should remain archived. | Only records that satisfy all four visible QA checks should be published or retained as public. |
| Transactional email | In-app review notifications are implemented; no organisation-approved external email provider is configured. | Select an approved provider and supply its verified sender/domain credentials and delivery policy. | External review alerts remain disabled until sender ownership and credentials are approved. |
| Native mobile keyboard pass | Desktop and responsive test-harness checks, mobile screenshots, semantic scans, and skip-link focus transfer are documented. | A reviewer should traverse the public site on a physical or native mobile browser, including menu open/close, finder filters, map controls, and directions links. | This final device-specific check should be recorded before declaring formal accessibility acceptance complete. |
| Area imagery | Generation-ready prompts and named files are in `AREA_SITE_IMAGE_PROMPTS.md`. | Generate one image for each named area file, review for text-safe composition and unintended text/logos, then supply the approved files. | Assets can be uploaded to managed storage and connected to Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal area pages after approval. |

## Review order

The safest order is to approve meeting records first, then review page content and area ownership, then approve generated imagery, and finally configure email and perform the native mobile pass. This order keeps public directory accuracy ahead of decorative content and prevents unverified historical material from being promoted merely because its route exists.

## Existing evidence

The principal evidence files are `PUBLICATION_READINESS_REGISTER.md`, `meeting_qa_register.csv`, `inactive-legacy-meeting-confirmation-register.csv`, `INACTIVE_LEGACY_MEETING_CONFIRMATION_REGISTER.md`, `MEETING_RECONCILIATION_AUDIT.md`, `PUBLISHED_SCHEDULE_REPAIR_PLAN.md`, `final_url_migration_register.csv`, `QA_VERIFICATION.md`, `ADMIN_HANDOVER.md`, `MEDIA_INTAKE.md`, and `AREA_SITE_IMAGE_PROMPTS.md`. The latest live project checkpoint is `2d467b57`.


## Five-site visual handoff update

The live five-site platform is available at [nasarebuild-eqxm563b.manus.space](https://nasarebuild-eqxm563b.manus.space). The regional and area routes are `/areas/south-africa-region`, `/areas/johannesburg`, `/areas/cape-town`, `/areas/pretoria`, and `/areas/kwazulu-natal`.

Five hero assets are still required before visual asset intake can be completed. Generate and supply these exact 2400 × 1350 WebP filenames: `na-region-south-africa-hero.webp`, `na-area-johannesburg-hero.webp`, `na-area-cape-town-hero.webp`, `na-area-pretoria-hero.webp`, and `na-area-kwazulu-natal-hero.webp`. The full location-specific prompts are in `AREA_SITE_IMAGE_PROMPTS.md`, while `FIVE_SITE_HERO_ASSET_INTAKE.csv` is the routing and alt-text manifest. Until approved files are supplied, the site displays an explicit placeholder label rather than using an unrelated or unapproved image.


## Submitted hero ZIP review — 16 August 2026

The supplied archive `na-heroes_20260816_063143.zip` was audited against the five-site intake contract. It contains four named WebP candidates plus source JPGs; the required Johannesburg file `na-area-johannesburg-hero.webp` is absent. All four supplied WebP candidates are JPEG-encoded files with a `.webp` extension and fail the required 2400 × 1350 output dimensions. The visual review also found that the KwaZulu-Natal candidate depicts a specific curved-roof venue and does not match the approved everyday community-landscape direction. No supplied hero has been connected to the website. The complete measured results and visual findings are in `FIVE_SITE_HERO_ASSET_INTAKE.csv` and `HERO_ASSET_VISUAL_REVIEW.md`.

Please regenerate all five files using the exact filenames in `NA_SOUTH_AFRICA_FIVE_HERO_IMAGE_PROMPTS.md`, with real WebP encoding and exactly 2400 × 1350 pixels. A corrected ZIP must contain `na-area-johannesburg-hero.webp` and must not rely on source JPGs or renamed JPEGs.
