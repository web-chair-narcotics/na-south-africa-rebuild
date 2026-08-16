# Organisational Approval Handoff

The rebuilt national platform is operational for the public meeting finder, national and area administration, QA gating, migration routing, and managed media evidence. The remaining items below require decisions or credentials owned by the national organisation rather than additional anonymous automation.

| Decision or input | Current evidence | Required organisation action | Effect on publication |
|---|---|---|---|
| Regional page publication | 81 WordPress-derived pages are staged as drafts; final destinations are assigned in the migration register. | Review each page for wording, ownership, links, images, and whether it should be published, revised, merged, or archived. | No page is published from the draft queue until an authorised reviewer approves it. |
| Meeting QA and publication | 307 meetings are live under the four-item gate; the historical register contains 328 staged meeting decisions, with the live submitted queue separate from that register. | National/area reviewers confirm current address, map pin, spelling, contact, and any schedule changes for each staged record. | Only records that satisfy all four visible QA checks should be published or retained as public. |
| Transactional email | In-app review notifications are implemented; no organisation-approved external email provider is configured. | Select an approved provider and supply its verified sender/domain credentials and delivery policy. | External review alerts remain disabled until sender ownership and credentials are approved. |
| Native mobile keyboard pass | Desktop and responsive test-harness checks, mobile screenshots, semantic scans, and skip-link focus transfer are documented. | A reviewer should traverse the public site on a physical or native mobile browser, including menu open/close, finder filters, map controls, and directions links. | This final device-specific check should be recorded before declaring formal accessibility acceptance complete. |
| Area imagery | Generation-ready prompts and named files are in `AREA_SITE_IMAGE_PROMPTS.md`. | Generate one image for each named area file, review for text-safe composition and unintended text/logos, then supply the approved files. | Assets can be uploaded to managed storage and connected to Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal area pages after approval. |

## Review order

The safest order is to approve meeting records first, then review page content and area ownership, then approve generated imagery, and finally configure email and perform the native mobile pass. This order keeps public directory accuracy ahead of decorative content and prevents unverified historical material from being promoted merely because its route exists.

## Existing evidence

The principal evidence files are `PUBLICATION_READINESS_REGISTER.md`, `meeting_qa_register.csv`, `final_url_migration_register.csv`, `QA_VERIFICATION.md`, `ADMIN_HANDOVER.md`, `MEDIA_INTAKE.md`, and `AREA_SITE_IMAGE_PROMPTS.md`. The latest live project checkpoint is `6f08fc61`.
