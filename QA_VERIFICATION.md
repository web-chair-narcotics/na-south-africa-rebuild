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

The published in-person route `/meetings/328` loaded Esihlahleni Tsakane with its area, schedule, venue/address, contact note, and exact Google Maps directions URL. The published online route `/meetings/2` loaded JFT as `Online Meeting`, exposed the contact action and “Find another meeting,” and did not render a physical-directions or online-join CTA because the imported source has no usable `onlineUrl`; it therefore avoids implying a false venue or fabricated join destination. The missing route `/meetings/999999` returned the safe “We could not find that meeting” state with a clear finder link and no private record data. The format-aware primary-action logic is covered by the route regression evidence and the latest application checks.
