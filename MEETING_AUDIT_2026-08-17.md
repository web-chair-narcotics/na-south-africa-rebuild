# Meeting Journey Audit — 17 August 2026

## Scope

This protected audit samples the live in-person and online finder journeys at desktop and mobile widths. It checks representative cards, detail pages, Google directions, embedded-map rendering, repeated map loads, address readability, and online-only action clarity. It does not change meeting source records or publication status.

## First live in-person pass

Live route checked: `https://nasarebuild-eqxm563b.manus.space/meetings?meetingFormat=in_person`.

The finder returned **255 verified in-person meetings** and loaded the Google map tiles with clustered markers, map controls, and an “Open this area in Google Maps” action. The first page exposed readable “Show on map” and “Get directions” actions and links to dedicated meeting details. Representative records included Cape Town, Durban, Pretoria, Knysna, Johannesburg, Kuilsriver, Randfontein, Sandhurst, Scottburgh and Sea Point.

Observed address presentation is generally readable and wraps on desktop. The live text revealed two audit findings for confirmation: some records repeat venue/address components, for example Sandhurst repeats the full street address, and some notes repeat content such as “Parking available on site”. The directions links use Google Maps Directions URLs with coordinates for sampled physical records, which is the preferred precise-destination behavior.

The cookie banner was dismissed for unobstructed testing. It initially covered part of the map and lower finder area on mobile; this is a usability consideration for the audit because legal notices should not prevent meeting discovery. The embedded map itself was available after dismissal.

## Representative physical detail pass

Opened `/meetings/293` for CT Women’s Meeting. The first screenshot captured the page before the detail query had finished, but a subsequent browser wait rendered the complete detail page. The final state had a clear area eyebrow, large meeting name, separate When and Where blocks, readable address wrapping, a dedicated “Get exact Google Maps directions” action, and a “Find another meeting” escape route.

The detail page also confirmed a content-quality issue in the sampled source record: the notes repeat “Parking available on site” twice. This is not a layout defect and should not be silently rewritten without an approved source decision. The detail journey itself is structurally clear on desktop.

## Mobile finder pass

At 390px, the in-person finder and CT Women’s detail retained readable typography, wrapping addresses and distinct CTA rows. The fixed contact tray remained reachable. The cookie banner can cover finder content until acknowledged; this is expected consent UI behavior but should be considered in the final UX recommendation.

## First live online pass

Live route checked: `https://nasarebuild-eqxm563b.manus.space/meetings?meetingFormat=online`.

The online journey returned **51 verified online meetings**, changed the heading to “Join an NA meeting online”, used the online-specific search placeholder, removed the map panel, and showed no physical addresses. Cards exposed “Online meeting — use the verified join link below” and clickable “Join online” or “Call contact” actions. The sampled page was visually simple and readable at desktop. The public markdown also showed online passwords in special notes and a suspicious-looking `tel:123456` contact action on one record; these are source-data/approval findings requiring review, not automatic UI rewrites.

## Representative online detail pass

Opened `/meetings/256` for Serenity@Sunrise. After the initial loading state, the detail page rendered a clear “Online meeting” eyebrow, a readable title, a separate “Online access” block, a prominent “Join online” action and a “Find another meeting” escape route. No venue, physical address, map or directions action was shown. The information architecture is materially clearer than mixing online records into a physical venue flow.

The sampled record displays `Online meeting password: 123456` as a public note. The audit records this as a high-priority source/approval review item because access credentials should not be assumed public merely because they exist in an imported note. The UI is rendering the source field faithfully; any removal or masking requires an authorised content decision.

## Repeated map-load check

Three fresh browser navigations to `/meetings?meetingFormat=in_person` were performed. All three rendered the “Meeting map” panel, Google/AfriGIS map tiles, clustered markers, zoom/fullscreen controls, and the “Open this area in Google Maps” control. The finder consistently returned 255 verified in-person meetings and preserved the first-page “Get directions” actions. No map fallback appeared during these three live runs.

The earlier static-HTML script was not suitable for this React-rendered page because server HTML contains no result links before hydration. The browser-rendered markdown and visible map controls were used as the authoritative UI evidence instead.

## Google directions sampling

The CT Women’s coordinate-based directions link opened Google Maps successfully and resolved the destination to the Rosebank/Cape Town venue. Google Maps displayed a route panel, although the browser test environment had no usable origin and therefore reported that it could not calculate a driving route from “Your location”; this is an origin/environment limitation, not a broken destination URL.

The live finder exposed a second coordinate-based Durban destination (`-29.8446648,31.0355797`) and the map viewport showed markers across Cape Town, Johannesburg, Pretoria, Durban and other regions. The directions-link contract is consistent across sampled records: Google Maps Directions API URL, coordinate destination, and driving mode.

## Online responsive visual pass

At 390px, the online finder heading and explanatory copy wrap cleanly, the online detail title remains readable, and the absence of venue/map/directions is explicit. At 1280px, the online finder and detail use a calm two-column/content hierarchy with readable text and a clear online CTA structure.

The consent banner overlays the lower-right desktop finder panel and the lower mobile finder/detail viewport until acknowledged. Because the site deliberately uses essential-only storage and the banner has a clear dismissal action, this is not a meeting-data defect; however, it materially competes with first-view meeting content and should be considered for a later UX refinement if the organisation wants the notice reduced or moved.

## Full published-record aggregate checks

A read-only database audit covered all published records. The current published corpus is **255 in-person**, **3 hybrid**, and **51 online** meetings.

| Format | Published | Missing physical location | Missing coordinates | Physical without coordinates | Missing online join/contact | Online records with physical fields |
|---|---:|---:|---:|---:|---:|---:|
| In-person | 255 | 0 | 0 | 0 | 0 | 0 |
| Hybrid | 3 | 0 | 0 | 0 | 0 | 0 |
| Online | 51 | 0 | 0 | 0 | 0 | 0 |

Every published in-person/hybrid record has a physical location and coordinates. Every published online record has either an online URL or phone contact and has no physical address fields. Every published record has a source URL. These are structural/data-contract checks; they do not certify that every source detail remains current, which still requires area-owner confirmation.

## Content-review findings requiring authorised decisions

A narrower read-only query found **49 online records whose notes contain password/passcode terms**, **1 online record with a placeholder-looking phone value**, and **20 physical records where the venue name exactly equals the street-address field**. These findings do not indicate a broken interface, but they affect whether the public content is appropriate and easy to read. Password/passcode visibility, the placeholder phone record, and address-field de-duplication should be reviewed by the responsible area owners or Information Officer before any source data is changed.

The visual sample also showed a repeated parking sentence in CT Women’s Meeting notes. The current UI displays it faithfully, and the audit deliberately does not silently edit organisation-owned meeting content.
