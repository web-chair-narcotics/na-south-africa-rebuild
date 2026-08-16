# Public Experience QA Verification

## Responsive acceptance evidence

Initial mobile capture covered the home page, meeting finder, About page, Contact page, and the administrator sign-in entry point at a 375 × 812 viewport. All five routes retained a readable mobile header, large tap targets, visible support pathway, content hierarchy, and complete footer. The meeting finder initially rendered its map fallback during screenshot capture.

The underlying issue was an asynchronous Google Maps proxy-loader timing condition: the script element had loaded, while the Maps namespace had not yet exposed its `Map` constructor. The loader now waits for `window.google.maps.Map` before resolving and resets its cached promise on failure, preserving a user-visible retry action only for genuine transient failures. Interactive browser verification after the change confirmed loaded Google Maps tiles, marker clusters, markers, zoom controls, and accessible map controls in the meeting finder.

## Evidence captured

| Journey | Verification result | Notes |
|---|---|---|
| Home | Pass | Responsive hero, meeting CTA, helpline, and support route were visible at mobile width. |
| Meeting finder | Pass after loader repair | Search filters, 307 verified-meeting count, one-tap directions, clustered map markers, and map controls were available. |
| About and Contact | Pass | Long-form content, emergency-support context, primary CTA, and footer remained readable at mobile width. |
| Area administration entry | Pass | Mobile sign-in call to action and area-isolation explanation remained available. |

The automated semantic and keyboard-focused scan, safe remediations, desktop traversal, and responsive navigation checks are recorded below. The remaining open item is a native touch-device or native responsive interactive-browser keyboard pass.

## Automated semantic scan: home page

The home-page DOM scan found a skip link targeting `#main-content`, one visible main landmark, a single H1 followed by ordered H2/H3 content hierarchy, 22 visible interactive controls, zero unlabelled form fields, zero unnamed controls, zero main-content images missing an `alt` attribute, and no duplicate IDs. The shared `main` landmark now uses `tabIndex={-1}` so skip-link activation transfers keyboard focus as well as viewport position; explicit activation was confirmed in the meeting-finder route.

## Automated semantic scan: meeting finder

The meeting finder exposed a skip link, main landmark, 64 visible interactive controls, 15 accessible Google Maps or marker-cluster controls, no duplicate IDs, and no missing image alternatives in the rendered main content. The scan initially flagged the search field because the visible wrapper label had no explicit `for` relationship detectable by the scanner. The field now uses `id="meeting-search"` and a corresponding `label htmlFor="meeting-search"`; this preserves the visual design while providing an explicit programmatic association. All filter selects already expose descriptive accessible names.

## Managed Google Maps verification

The Maps proxy requires the configured frontend Forge credential in its script request; without it, the proxy response has no transferable script payload and the finder correctly falls back rather than exposing an unusable map. With that managed-proxy credential restored, the browser verification confirmed an initialized Google Map, South Africa map tiles, venue markers, clustered marker controls, fullscreen and zoom controls, and direct Google Maps links. The loader continues to wait for `window.google.maps.Map` after the asynchronous script response, preventing the earlier premature fallback condition.

## Keyboard verification: meeting finder

Using keyboard navigation, the first Tab press reached the visible “Skip to main content” link. Activating it updated the location to `#main-content` and moved the viewport directly to the meeting finder, bypassing the helpline and primary navigation. The search input, five named filter controls, result-level “Show on map” actions, direct direction links, pagination, marker clusters, and Google Maps controls remain in the keyboard focus order.

The shared public layout now gives the target main landmark `tabIndex={-1}`. A repeat keyboard run confirmed that activating the skip link produces `location.hash === "#main-content"` and sets the active element to `MAIN#main-content`; keyboard focus therefore transfers as well as the visible viewport.

## Post-remediation automated scan

The final meeting-finder scan reported the skip link, `main[tabindex="-1"]`, 64 visible interactive controls, zero unlabelled inputs, and zero duplicate IDs. The only generic “unnamed control” result was the search input itself because the generic name helper evaluates an input’s value rather than its associated label; inspecting the exact element confirmed `id="meeting-search"` and its matching label. This is covered by the accessibility regression test and is not an unresolved control-name defect.

## Public meeting-finder interaction acceptance

The live public journey was exercised against the running preview. Full-text search for `Tsakane` narrowed the directory to one verified record, **Esihlahleni Tsakane - Daily - 17:30**, with its venue address, contact line, map pin, and exact Google Maps direction URL containing `destination=-26.3420167%2C28.375242`. Clearing the search and selecting Monday produced **51 verified meetings** across six pages. Selecting **Show on map** for Phefeni Soweto updated the map heading to the selected meeting and retained the marker clusters. The visible directions links use the expected `https://www.google.com/maps/dir/?api=1&destination=<latitude>%2C<longitude>&travelmode=driving` shape.

The pagination check was allowed to settle after the asynchronous query update. A subsequent Next activation changed the rendered indicator from page one to **Page 3 of 31** and changed the first visible result to **JFT Meeting**, confirming both page state and result-set movement. The meeting finder, map tiles, marker clusters, search, day filter, pagination, directions URLs, and result-to-map selection therefore passed the safe acceptance pass.

The shared Maps loader was hardened after runtime diagnostics showed transient `script.onerror` events. It now treats the loader as ready only when `window.google.maps.Map` exists, removes stale managed-loader scripts before retrying, resets the shared promise after load failure, and retains the accessible Retry map action. The regression suite covers these safeguards; TypeScript, **18 tests across 9 files**, and the production build pass.

## Shared navigation keyboard traversal

The desktop home-page traversal begins with the visible skip link, confirming that a keyboard user is offered the bypass before the helpline, brand link, and primary navigation. The remaining primary-navigation and mobile-navigation checks are recorded below as they are completed.

On desktop, the next Tab press moved focus from the skip link to the national phoneline. The header’s DOM focus order then proceeds through the labelled home link, About NA, Recovery, Literature, News, Areas, Contact, Area admin, and Find a meeting controls. Every target is a native link with visible focus treatment; this matches the visual header order and introduces no keyboard trap.

For the responsive header, the mobile toggle exposes an explicit “Open navigation” label and `aria-controls="mobile-navigation"`. Keyboard activation changed it to the “Close navigation” state with `aria-expanded="true"` and rendered the eight labelled mobile links: About NA, Recovery, Literature, News, Areas, Contact, Area admin, and Find a meeting. In the mobile-layout test harness, Tab moved from the open toggle to the About NA link, confirming that the expanded menu is included in the keyboard order. Separate 375-pixel route captures confirm that the same toggle is visible at the responsive breakpoint.

The automated browser used for this pass has a fixed desktop interaction viewport, so the mobile-link traversal was verified with a controlled responsive-layout harness rather than a native mobile browser session. A true touch-device or native responsive interactive-browser keyboard pass remains explicitly open in `todo.md`; it is not represented as completed by this record.

## Dedicated meeting-detail verification

The published in-person route `/meetings/328` loaded Esihlaheni Tsakane with its area, schedule, venue/address, contact note, and exact Google Maps directions URL. Desktop and 375-pixel mobile captures both show the route as a readable single journey: the title and area context remain visible, the meeting facts stack without clipping, the directions CTA remains a large tap target, and the finder fallback remains available.

The published online route `/meetings/2` loaded JFT as `Online Meeting`, exposed the contact action and “Find another meeting,” and did not render a physical-directions or online-join CTA because the imported source has no usable `onlineUrl`; it therefore avoids implying a false venue or fabricated join destination. The missing route `/meetings/999999` returned the safe “We could not find that meeting” state with a clear finder link and no private record data. The format-aware primary-action logic is covered by the route regression evidence and the latest application checks.

## Administrator entry boundary

A live visit to `/admin` without a session redirected to the Manus sign-in surface for Narcotics Anonymous South Africa. The unauthenticated boundary exposed no meeting, area, audit, or content records and offered the expected sign-in paths. Authenticated area-admin CRUD and national-review workflow acceptance remains open because it requires a real authorised account and organisation-owned review decisions; this boundary check is not presented as a substitute for that workflow test.

## Public journey and administrator-boundary acceptance

The end-to-end boundary pass covered the public home, About NA, Recovery, Literature, News, Contact, Areas hub, all four dedicated area routes, meeting finder, in-person meeting detail, online meeting detail, missing-meeting detail, and the unauthenticated `/admin` entry. The public journeys preserved the shared skip link, help pathway, footer escape routes, and expected local navigation; the administrator entry redirected to the approved sign-in surface without exposing protected records. Authenticated area-admin CRUD, national review submission, and external email delivery remain intentionally separate approval-dependent tests and are not claimed complete by this boundary pass.


## Final palette migration and responsive visual verification

The supplied legacy palette was reconciled across the complete `client/src` tree rather than only the global stylesheet. The final source audit confirms the core blue, green, neutral, grey, and supplied font tokens are represented, the former page-level deep-green tokens are absent, and no malformed hex literals remain. The palette regression suite now covers both positive token presence and legacy-token removal.

The first fresh desktop screenshot pass exposed two palette-replacement defects: an invalid white alpha literal and green foreground text on green CTA surfaces. Both were corrected by restoring valid eight-digit alpha literals and pairing accent-green buttons with white text. The follow-up desktop capture showed readable CTAs on Home, Johannesburg, and National Administration surfaces. A 390 × 844 responsive capture then confirmed the mobile hero, hamburger header, stacked meeting filters, meeting-detail facts, area CTA, and administration cards remain readable and within the viewport.

| Route set | Desktop 1280 × 720 | Mobile 390 × 844 |
|---|---|---|
| Home | Pass after contrast remediation | Pass — stacked CTAs and hero remain readable |
| Meeting finder | Pass — search and filter hierarchy remain clear | Pass — filters stack without clipping |
| Meeting detail | Pass — heading, area context, and fallback remain visible | Pass — facts stack with venue context visible |
| Johannesburg area | Pass — blue eyebrow, neutral hero, and CTA hierarchy remain readable | Pass — CTA and local-recovery panel remain readable |
| National administration | Pass — oversight cards and navigation remain legible | Pass — cards stack and management CTA remains usable |

The screenshot pass is visual evidence only; the native touch-device menu traversal remains the explicitly open item already recorded above.


## Post-palette accessibility verification

After the whole-site colour migration and contrast remediation, the semantic accessibility regression suite and brand-alignment suite were rerun together. All **22 tests across 10 files** passed, including the skip-link/main-landmark focus safeguards, labelled meeting-search control, public-navigation semantics, area-route checks, and full client palette audit. A source-level contrast scan found no remaining accent-green CTA combinations using the former same-colour or dark-green foregrounds. This confirms the palette changes did not regress the automated accessibility safeguards; native touch-device keyboard traversal remains separately open as previously documented.


## Post-palette keyboard traversal limitation

The post-palette route contract confirms that Home, Meetings, meeting detail, Johannesburg, and Admin retain the skip-link target, focus-ring CSS, mobile navigation ARIA attributes, meeting-finder CTA, exact-directions CTA, and admin entry route. The corresponding regression test passed. However, this is source-level evidence rather than an actual interactive-browser Tab traversal: no browser automation session capable of sending keyboard events was available in this final pass. The native interactive keyboard traversal item therefore remains open in `todo.md` and must not be represented as complete until exercised in a real browser or device session.

## na.org reference-blue and meeting-reconciliation verification

The live `na.org` reference CSS was sampled directly before the latest visual correction. Its active homepage system supplied the bright hero blue `#026AB9`, the primary blue `#085C84`, the supporting blue `#387CBB`, the green action colour `#2F9B3E`, and the darker green hover `#20752C`. The rebuilt Home and dedicated area heroes now use `#026AB9`; navigation, footer, support panels, meeting-detail action panel, administrative alert panel, and authentication action now use the primary blue system. The prior `bg-[#54595F]` dark-surface utility no longer exists in client source. Desktop and 390 × 844 captures confirm white hero-eyebrow contrast, readable CTA text, and responsive blue-surface hierarchy.

The full live TSML reconciliation returned 328 legacy records and matched all 328 to rebuilt rows. Of these, 307 are published and 21 remain archived because the current live source itself has `attendance_option=inactive`; the legacy site lists those rows despite their inactive status. No such record was silently republished. Separately, the audit found 34 published records with an empty day array after migration. The legacy TSML feed represents Sunday as numeric `0`, which the earlier importer did not decode; one Daily record also carried its schedule only in its verified meeting name. All 34 were corrected from their one-to-one live source evidence. Post-repair checks report 0 published rows with empty days or `00:00` time, and the live finder procedure returns 34 Sunday results including **Esihlahleni Tsakane – Daily – 17:30**. The behavioural finder regression suite confirms day, area, type, and pagination discoverability; the complete suite now passes **31 tests across 13 files**, alongside TypeScript and production-build verification.


## Five-site and actionable-homepage verification

The five-site structure now includes the South Africa Region route `/areas/south-africa-region` alongside `/areas/johannesburg`, `/areas/cape-town`, `/areas/pretoria`, and `/areas/kwazulu-natal`. The Areas hub presents all five sites. The regional CTA opens the national meeting finder without applying a non-existent regional area filter; each area CTA remains area-scoped.

The Home page’s three former explanatory blocks are now direct shortcuts: “Find a meeting nearby” opens `/meetings`, “Call for immediate help” opens `tel:+27861006962`, and “Know what to expect” opens `/recovery`. Desktop 1280 × 720 and mobile 390 × 844 captures show the blue-led hero, green action hierarchy, mobile stacking, and keyboard-focusable shortcut cards without clipping.

## Emergency-notice verification

The new `emergencyNotices` table, public active-notice procedure, national-admin CRUD procedures, admin manager, and shared public alert banner are implemented. Only national administrators can create, publish, update, or archive a notice. The admin interface explicitly states that emergency notices do not publish, reactivate, or change meeting records. Inactive meetings therefore remain inactive even when an emergency notice is published.

## Image prompt and intake verification

The five-site image prompt pack now covers the South Africa Region and all four areas, with research notes, primary-blue alignment, exact 2400 × 1350 WebP requirements, centre-right focal placement, left-third text safety, mobile crop guidance, exclusion constraints, alt text, and exact filenames. `FIVE_SITE_HERO_ASSET_INTAKE.csv` is the intake key and `FIVE_SITE_HANDOFF.md` contains the generation and upload instructions. The five hero assets remain intentionally pending until the organisation supplies the generated files; each site visibly labels its exact expected asset rather than displaying an unrelated image.

The final five-site regression run passed **35 tests across 14 files**, together with TypeScript checking and the production build. The build reports only the existing bundle-size advisory; no type, unit-test, or build failure remains. Native authenticated administration workflow acceptance and the real interactive-browser keyboard pass remain open as previously documented.


## Final Johannesburg visual contrast correction

The mobile screenshot pass identified one remaining palette-specific issue: the Johannesburg area label inside the blue visual panel was using the action-green accent, which was not sufficiently readable on the primary blue surface. The label now uses the shared off-white accent used by the other area panels. A follow-up 390 × 844 capture confirms readable Johannesburg panel typography, and the focused five-site regression suite, TypeScript check, and production build all pass.


## Emergency active-query fix

The public `emergency.active` query previously returned `undefined` when no published notice matched the active time window, which violated the TanStack Query contract and generated a console error on the home page. The database helper now returns `null` for both an unavailable database and an empty result set; a populated notice remains returned unchanged. The public layout already treats a null value as no banner. Added `server/emergency.query.regression.test.ts` covering the defined null contract, procedure wiring, and empty/public notice rendering. Full verification passes: 15 test files, 38 tests, TypeScript check, and production build.


## Five-site hero asset intake

The second supplied five-image set was validated without reopening the files in the file viewer, as requested. Programmatic metadata checks confirmed five genuine WebP files, each 2048 × 1143 px, RGB, with a consistent 1.791776 landscape ratio. The images were mapped to the South Africa Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal routes; uploaded to managed storage; and connected in `client/src/pages/AreaPage.tsx` using exact route-labelled storage paths. Desktop screenshots at 1280 × 720 and mobile screenshots at 375 × 812 confirmed that each panel renders its intended regional image, retains readable white overlay text, and remains visually usable in a narrow crop. Full verification passes: 15 test files, 38 tests, TypeScript check, and production build.


## Complete parity and meeting-format separation update — 16 August 2026

The canonical Region and four Area TSML feeds were re-fetched for the complete-site parity pass. Raw feed rows total 622 because the Region feed imports the four Area feeds. The current live-source working pass reports 52 online, 257 in-person, 4 hybrid, and 22 inactive rows. The supplied workbook contains 328 unique rows and previously reported 51 online, 253 in-person, 3 hybrid, and 21 inactive records. Eight area-feed-only URL variants were classified as source conflicts or route/slug variants rather than silently inserted. The source-rule decision remains that Area feeds are the system of record for their own meetings, with explicit conflict evidence retained before any status changes.

The finder/database separation work is complete. Online-only meetings are excluded from physical map points. Online-only result cards show an online-access line and join action when a URL exists, without physical address or directions treatment. In-person records retain address, map, and Google Maps directions behavior when physical fields exist. Hybrid records expose both physical and online actions only when the corresponding live-source fields exist. Meeting details use `Online access` for online-only records, while inactive records remain outside public search because public queries require published status and active areas.

Verification evidence: 15 Vitest files and 40 tests pass; TypeScript checking passes; the production Vite and server build passes. Desktop screenshots of `/meetings` and `/meetings/2` confirm that the finder and online meeting detail render cleanly after the change. The full sitemap inventory contains 1,157 unique URLs. Direct high-volume page-body crawling was attempted but the source server throttled or timed out most requests; robots, sitemap indexes, directory pages, and the canonical TSML feed were successfully retrieved through the browser/source workflow. The crawl artefacts document this source-side limitation explicitly.


## Area-source status correction verification — 16 August 2026

The live Pretoria Area feed was treated as the system of record for its own meetings. Soshanguve Wednesday (meeting ID 108) and Soshanguve Sunday (meeting ID 299) were archived in the Region-import state but live as in-person records in the current Area feed. Both rows were corrected to `published`, their current schedules were restored (`wednesday` and `sunday`), current Area source URLs were recorded, and the current Area coordinates were applied. Database verification confirmed both rows now have `meetingFormat=in_person`, published status, current coordinates, and explicit source-decision notes. No other conflicting live row was promoted automatically.


## Legacy directory format-preserving redirect verification — 16 August 2026

Regional and national legacy directory paths now preserve their meeting-format intent. `/online-meetings/`, `/jhb/online-meetings/`, `/pta/online-meetings/`, `/wc/online-meetings/`, and `/kzn/online-meetings/` resolve to `/meetings?meetingFormat=online`. The national and Western Cape in-person directory paths resolve to `/meetings?meetingFormat=in_person`, and the same suffix-based behavior applies to all area in-person directory paths even when the route is not enumerated in the generated map. The finder initializes its format filter from the query parameter. Seven redirect and finder regression assertions pass, together with TypeScript checking.


## Broad route acceptance screenshot pass — 16 August 2026

Fresh desktop captures covered `/`, `/meetings`, `/meetings/2`, `/areas`, `/areas/south-africa-region`, `/areas/johannesburg`, `/areas/cape-town`, and `/admin`. The public routes rendered their shared header, blue brand hierarchy, clear content headings, area-specific hero assets, meeting finder, meeting-detail context, and recovery/help pathways without clipping. The administration route rendered the national oversight workspace in the persisted authenticated preview session, including meeting scope, publication counters, QA requirements, review queue, and alerts panel. This visual pass does not substitute for an organisation-owned authenticated role-boundary acceptance with real area-admin and national-admin accounts; that item remains open.


## Live browser verification of legacy directory redirects — 16 August 2026

The live preview was opened at `/wc/online-meetings/` and redirected to `/meetings?meetingFormat=online`. The rendered finder showed the format control as `Online`, online meeting cards exposed `Join online`, and no physical address or `Get directions` action appeared for online-only records. The same preview was opened at `/wc/in-person-meetings/` and redirected to `/meetings?meetingFormat=in_person`. The rendered finder showed the format control as `In person`, physical venue/address content, map markers, and exact Google Maps `Get directions` URLs. This confirms the format-preserving redirect behavior in the interactive browser, not only in source-level tests.

## Online meeting re-audit and no-address enforcement — 16 August 2026

The canonical Region and four Area feeds were freshly re-fetched. They contain 52 online meeting fingerprints: 49 with a conference/join URL and 3 with a source contact fallback. The published Manus corpus contains 51 normalized online records because one live fingerprint is a duplicate under the normalized name/day/time comparison. There are **zero live-only and zero Manus-only normalized keys**. The detailed source inventory is `LIVE_ONLINE_MEETING_AUDIT.csv`; the live-to-Manus comparison is `ONLINE_MEETING_DB_PARITY.md` and `ONLINE_MEETING_DB_PARITY.json`.

All 51 published online records were then checked for physical fields. Before correction, each retained inherited venue/address or coordinate data from the legacy import. Every online-only row now has null venue, street, suburb, city, province, latitude, longitude, and geocode fields, with address/map verification reset. Their schedules, source URLs, join URLs, phones, and contact details were retained. Database verification reports 51 published online records, 49 verified join URLs, 2 contact fallbacks, and **0 rows with physical fields**. The finder regression confirms online results have no physical fields and zero map points, while physical and hybrid meetings remain independently eligible for maps and directions.

The online-only route now also removes physical cues from its interface: its heading is `Join an NA meeting online`, its explanatory copy explicitly says online records do not show a venue, map, or directions, its search placeholder is `Meeting name or online group`, and it does not render map status, map-selection controls, or a map panel. Fresh mobile verification confirmed the complete online-only presentation.

## Supplied-logo, five-site, and primary-link verification — 16 August 2026

The supplied 1200 × 300 NA South Africa wordmark was validated, uploaded to managed storage, and used without cropping or distortion in the shared public header and footer. Fresh desktop and 375 × 812 mobile captures confirmed the supplied logo, the two distinct home-page actions for **in-person** and **online** meetings, and all five hero-asset landing pages: South Africa Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal.

The primary route check returned HTTP 200 for the core public pages, all five landing pages, both separated finder filters, the Western Cape legacy online and in-person directories, a meeting detail page, and the administrator entry route. The complete result table is `PRIMARY_ROUTE_LINK_CHECK.md`. The current full regression suite passes 15 test files and 44 tests; TypeScript and production build pass.
