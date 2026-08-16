# Organisational Approval Handoff

The rebuilt national platform is operational for the public meeting finder, national and area administration, QA gating, migration routing, and managed media evidence. The remaining items below require decisions or credentials owned by the national organisation rather than additional anonymous automation.

| Decision or input | Current evidence | Required organisation action | Effect on publication |
|---|---|---|---|
| Regional page publication | 81 WordPress-derived pages are staged as drafts; final destinations are assigned in the migration register. | Review each page for wording, ownership, links, images, and whether it should be published, revised, merged, or archived. | No page is published from the draft queue until an authorised reviewer approves it. |
| Meeting QA and publication | 307 meetings are live under the four-item gate; 21 additional legacy listings are currently marked `attendance_option=inactive` by the live TSML source and have an area-owner confirmation register; the historical register contains 328 staged meeting decisions, with the live submitted queue separate from that register. | National/area reviewers confirm current address, map pin, spelling, contact, schedule changes, and—in the 21-record confirmation register—whether an inactive listing has resumed or should remain archived. | Only records that satisfy all four visible QA checks should be published or retained as public. |
| Transactional email | In-app review notifications are implemented; no organisation-approved external email provider is configured. | Select an approved provider and supply its verified sender/domain credentials and delivery policy. | External review alerts remain disabled until sender ownership and credentials are approved. |
| Native mobile keyboard pass | Desktop and responsive test-harness checks, mobile screenshots, semantic scans, and skip-link focus transfer are documented. | A reviewer should traverse the public site on a physical or native mobile browser, including menu open/close, finder filters, map controls, and directions links. | This final device-specific check should be recorded before declaring formal accessibility acceptance complete. |
| Area imagery | Five supplied WebP hero assets are connected to all five public site routes, with metadata and responsive screenshot evidence recorded in `HERO_ASSET_INTAKE_FINAL.md` and `QA_VERIFICATION.md`. | Organisation may review the live regional imagery for final brand acceptance; no further technical intake is pending. | The five route-specific hero assets are live. |

## Review order

The safest order is to approve meeting records first, then review page content and area ownership, then approve generated imagery, and finally configure email and perform the native mobile pass. This order keeps public directory accuracy ahead of decorative content and prevents unverified historical material from being promoted merely because its route exists.

## Existing evidence

The principal evidence files are `PUBLICATION_READINESS_REGISTER.md`, `meeting_qa_register.csv`, `inactive-legacy-meeting-confirmation-register.csv`, `INACTIVE_LEGACY_MEETING_CONFIRMATION_REGISTER.md`, `MEETING_RECONCILIATION_AUDIT.md`, `PUBLISHED_SCHEDULE_REPAIR_PLAN.md`, `final_url_migration_register.csv`, `QA_VERIFICATION.md`, `ADMIN_HANDOVER.md`, `MEDIA_INTAKE.md`, `NA_SOUTH_AFRICA_FIVE_HERO_IMAGE_PROMPTS.md`, and `HERO_ASSET_INTAKE_FINAL.md`. The latest live project checkpoint is recorded by the current project version and the five-site hero intake checkpoint.


## Five-site visual handoff update

The live five-site platform is available at [nasarebuild-eqxm563b.manus.space](https://nasarebuild-eqxm563b.manus.space). The regional and area routes are `/areas/south-africa-region`, `/areas/johannesburg`, `/areas/cape-town`, `/areas/pretoria`, and `/areas/kwazulu-natal`.

The five supplied route-specific hero assets are now connected to the live site: South Africa Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal. The final intake record is `HERO_ASSET_INTAKE_FINAL.md`; the route manifest remains `FIVE_SITE_HERO_ASSET_INTAKE.csv`. The accepted files are managed-storage WebP assets at 2048 × 1143 px, with desktop and mobile crop evidence recorded in `QA_VERIFICATION.md`.


## Submitted hero ZIP review — 16 August 2026

The earlier archive `na-heroes_20260816_063143.zip` remains historical evidence of a rejected intake and is not the live asset source. A corrected five-file delivery was subsequently supplied, validated as genuine WebP, connected to managed storage, and verified on all five site routes. The complete accepted mapping is in `HERO_ASSET_INTAKE_FINAL.md`; the earlier rejection record remains in `HERO_ASSET_VISUAL_REVIEW.md` for audit history.

No further hero regeneration is required for the current live build. The organisation may perform a final visual acceptance review of the five connected assets; any later replacement should follow the naming, composition, and crop-safety rules in `NANO_BANANA_2K_FIVE_HERO_PROMPTS.md`.


## Latest parity execution update — 16 August 2026

The latest live-source parity execution did not treat the three supplied directory URLs as a special subset. All five canonical TSML feeds, all 100 current public WordPress REST records, and the full 1,157-URL sitemap inventory were processed. Every REST record has a migration-register outcome, and every sitemap URL has a documented coverage class. Online and in-person directory redirects preserve their format in the rebuilt finder, and live browser verification confirmed online join-only results versus in-person address, map, and Google Maps directions behavior.

Two current Pretoria Area records, Soshanguve Wednesday and Soshanguve Sunday, were found live as in-person meetings in the Area feed while their Region-import counterparts were archived. Because the Area feed is the system of record for its own meetings, both were promoted to published, their schedules and coordinates were refreshed, and the source decision was recorded in the database review notes. No other conflicting record was promoted automatically.

The remaining decisions are narrower than the earlier wording suggested. They are organisation approval for staged regional page publication; final review of the remaining source conflicts and 328-record historical register; an approved transactional email provider and sender identity; authorised area-admin and national-admin accounts for real role-boundary acceptance; and native touch-device keyboard acceptance. The current build, finder, maps, area routes, online/in-person separation, emergency path, hero assets, source inventory, migration routing, tests, and production build are not awaiting further anonymous technical completion.
