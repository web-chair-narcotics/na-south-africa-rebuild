# Remaining Acceptance Matrix

## Purpose

This matrix records the remaining checks that require organisation-owned decisions, an approved provider, or an authorised account. It is preparatory evidence only: it does not publish staged pages, alter meeting records, rotate credentials, or bypass authentication.

## Acceptance gates

| Gate | Required input | Test to run | Completion evidence |
|---|---|---|---|
| 81 staged regional pages | Page-by-page publication approval from the organisation | Review each staged route against its source page, links, media, and status; publish only approved pages | Signed publication register and live route checks |
| 328 historical meeting records | Individual area/source decisions | Review status, schedule, address, coordinates, contact details, and online/in-person classification | Completed decision register and regression/data audit |
| Regional content updates | Area-owner confirmation | Apply only confirmed copy, links, schedules, and local details | Before/after register and owner approval |
| Transactional email | Organisation-approved provider and credentials | Trigger review notification in a non-production/test workflow and verify delivery | Provider approval, secret configuration, delivery evidence |
| Authenticated area-admin acceptance | Authorised test account for each role/scope | Verify sign-in, area isolation, permitted edits, denied cross-area access, audit events, and logout | Role test matrix with no bypasses |
| Native mobile keyboard/accessibility | Physical or device-emulation test access | Test skip link, mobile menu, focus order, visible focus, CTA activation, and fixed contact actions | Device/browser matrix with screenshots or recording |
| Credential rotation | Confirmed exposure and supported rotation path | Rotate only through the approved project configuration/provider flow; never paste values into project files or reports | Provider confirmation and redacted rotation record |

## Preserved boundaries

The current public meeting corpus remains unchanged while these gates are pending. The following audit findings are documented but not silently edited: password/passcode text in source notes, one placeholder-looking online phone value, duplicated physical venue/address fields, source meeting times, and staged publication status.

## Current safe baseline

The public site has passed the latest automated suite, TypeScript validation, production build, responsive visual checks, meeting-finder map checks, canonical area-filter verification, and unauthenticated admin-boundary verification. Authenticated role acceptance and organisation-owned publication decisions remain open by design.
