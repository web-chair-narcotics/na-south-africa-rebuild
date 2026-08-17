# Narcotics Anonymous South Africa Rebuild — Current Audit Status

**Audit date:** 17 August 2026  
**Scope:** Current Manus rebuild, live public deployment, uploaded source evidence, meeting finder, literature catalogue, five public area sites, public navigation, and deployment hygiene.

## Executive status

The safely actionable refinement work is complete and published on `nasarebuild-eqxm563b.manus.space`. The public site has five distinct landing experiences: the South Africa Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal. The meeting finder keeps in-person and online journeys separate, defaults to in-person, presents online meetings as `Online` without physical addresses, and exposes physical meeting directions through Google Maps-compatible actions. The literature catalogue contains 56 supplied PDFs mapped to dedicated detail pages and managed-storage downloads.

The latest scoped release adds the supplied NA mark as the browser favicon and social-sharing image, Open Graph/Twitter metadata, `robots.txt`, `sitemap.xml`, and a mobile-only bottom contact tray with WhatsApp, email, and national helpline actions. Desktop presentation was not changed by the mobile tray.

## Verification evidence

| Area | Result | Evidence |
|---|---|---|
| Automated regression tests | Passed | 60 tests across 17 files |
| TypeScript | Passed | `pnpm check` |
| Production build | Passed | Vite frontend and bundled server build |
| Five-site desktop rendering | Passed | Live screenshots of home, Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal routes |
| Five-site mobile rendering | Passed | Live 390px screenshots of the same public routes |
| Mobile contact actions | Passed | WhatsApp, `mailto:pr-chair@na.org.za`, and `tel:+27861006962` visible in the fixed mobile tray |
| Crawler files | Passed | Live `/robots.txt` and `/sitemap.xml` return the expected content |
| Literature | Passed | 56 managed PDF targets previously verified with successful PDF responses |
| Meeting presentation | Passed | In-person/online separation, address deduplication, entity decoding, and online map/address suppression covered by tests and prior live audit |
| Route scroll reset | Passed | `ScrollToTop` regression and prior live route verification |

## Security and deployment hygiene

`.project-config.json` is not tracked by Git and is explicitly excluded by `.gitignore`. Credential-shaped keys were detected in the local configuration file, but no values were copied into this audit or other generated evidence. The remaining credential action is rotation through the supported project configuration path if any affected value was exposed outside the local ignored file. Do not paste credentials into chat, source files, reports, or ZIP archives.

The project continues to use managed storage references for public media and literature. Large media files are not placed in the frontend public directory. The public crawler rules exclude `/admin` and `/api/` while allowing public content.

## Maintenance and organisation-owned blockers

The following items are not safely decidable by an implementation agent without organisational approval or authenticated access: publication decisions for the 81 draft-staged regional WordPress pages; individual approval of all 328 historical meeting records; an organisation-approved transactional email provider; authenticated administrator boundary acceptance with an authorised account; and native-device interactive keyboard validation. These remain explicitly pending in `todo.md` and should not be represented as complete.

The external recovery ZIP files downloaded from Google Drive must be restored using the provider's documented recovery workflow and any provider-issued key or tool. Do not attempt ad hoc decryption, rename encrypted archives as ordinary ZIPs, or run unknown executables from the archives. Preserve the originals, work on copies, record the export date, and contact the provider or workspace administrator if the archive includes a manifest or key requirement.

## Errors encountered and fixes

A stale frontend production bundle previously served older hero and literature assets after source changes. The release process was corrected by forcing a fresh deployment marker and re-verifying the live bundle. The meeting-detail audit found escaped HTML entities and repeated address components; the repair decodes the entities for display and deduplicates repeated address parts without changing source records or meeting classification. No new runtime, TypeScript, test, or build errors remain in the current validation run.

## Next controlled actions

The next release should only address the organisation-owned approval gates or credential rotation after the responsible organisation provides confirmation and, where necessary, an authorised account or approved provider configuration. Any further meeting-data changes must preserve the current source-of-truth and publication-gating rules.

## Additional live boundary observation

On 17 August 2026, opening the public `/admin` route redirected to the Manus sign-in flow rather than exposing the area-management interface. No credentials were entered and no authenticated workflow was tested. This confirms the unauthenticated entry boundary only; authorised role-scoped acceptance remains pending until the organisation supplies an approved test account.

A public homepage keyboard spot check was also performed: the first Tab focus lands on the visible “Skip to main content” link, and the page exposes the expected public navigation and meeting-path links. This is supplemental evidence only; the native-device and authenticated administrator acceptance items remain pending.
