# NA South Africa Administration Handover

## Roles and access

The national administrator uses the `admin` role and can view all areas, assign area administrators, review submitted meetings and content, and publish or archive records. An area administrator is assigned to one or more specific areas and can view and edit only records whose `areaId` matches an assigned area. The server enforces this boundary; hiding another area in the interface is not the security control.

## Meeting workflow

Area administrators create or edit a meeting with the required fields: meeting name, area, venue name, street address, suburb, city, province, GPS coordinates, day(s) of week, start time, meeting type, meeting format, contact person, phone, special notes, and online details where applicable. A record is submitted for national review. It becomes public only when the national administrator confirms the visible QA checklist items exactly as follows: **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**.

The public finder exposes only published records. In-person and hybrid records also require a street address, coordinates, and all four QA checks. Online or approximate records are not presented as exact in-person venues. Review changes create audit events and in-app notifications; external email delivery is not configured until an organisation-approved transactional email provider is connected.

## Content workflow

Area administrators can create and update their own area content as drafts and submit it for national review. National administrators review the staged regional WordPress pages before publishing. The uploaded source work currently contains **81 draft-staged regional page records**. The final URL register supplies stable destinations for the legacy routes, but draft content should not be published merely because a route exists.

## Migration and route evidence

The final registers contain 1,267 regional public URLs and 100 navigation entries. Meetings and locations route to `/meetings`; area navigation routes to `/areas`; organisation information routes to `/about`; recovery and newcomer guidance routes to `/recovery`; literature and resources route to `/literature`; contacts route to `/contact`; notices and events route to `/news`; and technical feeds or APIs are archive/noindex outcomes. The application contains a generated fallback map for legacy paths.

## Operating checks

Before publishing a meeting, confirm the four QA items, test the map pin and Google directions link, inspect the displayed address, and verify the contact information. Before publishing content, check spelling, links, headings, mobile layout, and any attached file against the media manifest. Use the audit log and review notes to record source decisions. If a source record is stale, inactive, approximate, or conflicting, keep it in review rather than silently reactivating it.

## Current limitations and next steps

The current uploaded package includes WordPress page and attachment metadata, but not a complete binary media-library ZIP. The 81 regional pages are therefore draft-staged rather than fully published. A transactional email provider has not been selected. Comprehensive browser-based end-to-end acceptance and formal accessibility tooling remain follow-up validation tasks; the project already includes responsive visual checks, server validation, security headers, runtime error reporting, and focused unit tests.
