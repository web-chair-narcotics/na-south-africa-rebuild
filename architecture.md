# Platform Architecture

## Purpose and safety boundary

The application is a national service directory designed to help a visitor locate a verified NA meeting quickly. The public finder will only surface meetings marked as published and ready for public use. Imported records remain hidden until a national reviewer has completed the record-level quality checks.

## Roles and ownership

| Role | Scope | Permitted actions |
| --- | --- | --- |
| Visitor | Public content and published meetings | Search, filter, view map pins, call the help line, and open exact Google Maps directions. |
| Area administrator | Assigned areas only | View the assigned area, manage only its meetings and area-owned content, and submit changes for national review. |
| National super-admin | All national and area records | Manage areas and assignments, administer public content, publish or return meetings, run QA, and view all audit records. |

Area ownership is enforced server-side on every read and write. Area identifiers are never trusted from a browser request; the server derives the permitted area set from the authenticated user’s assignment. National super-admin access is explicitly role-gated. Every administration mutation will write an immutable audit event that identifies the actor, target record, action, and timestamp.

## Meeting record

Every meeting record stores the required fields: meeting name, area, venue name, street address, suburb, city, province, GPS coordinates, day(s) of week, start time, meeting type, contact person, phone, and special notes. The record also stores its format, public status, source provenance, verification status, revision number, and timestamps. In-person meetings require a valid pair of latitude and longitude coordinates before publication; online meetings use their online-joining details rather than a map pin.

## Quality assurance and publication

Each meeting includes four nationally visible QA controls whose labels are exactly: **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**. The national reviewer can add a review note and request a correction. An area administrator can only publish a meeting by submitting it for review; the national super-admin is the only role that can approve it for public search.

## Meeting finder and maps

The public finder uses server-side pagination and filters for full-text search, area, day, time, type, and format. Google Maps is embedded directly in the finder. The map reads published in-person meetings with verified coordinates, uses marker clustering for dense locations, and opens the exact Google Maps directions URL for the selected record. Address validation will use geocoding before a record reaches review, and a reviewer can compare the returned map position with the entered venue details.

## Alerts

Each state change creates an in-app alert for the relevant administrator and an audit event. The national super-admin receives alerts when an area administrator submits a meeting update; the assigned area administrator receives alerts when national review flags a meeting. The platform includes a delivery adapter boundary for email. No email provider is currently configured, so external email transmission remains intentionally disabled rather than being simulated; it will be activated after the organisation chooses and connects a transactional email service.

## Acceptance criteria

The platform must fail closed when an area administrator attempts to access another area’s meeting or content. Public routes must never expose unpublished or unverified meeting locations. The finder must be usable with a keyboard and at narrow mobile viewports, provide large tap targets, support browser zoom, preserve a persistent click-to-call help pathway, and make map and direction failures explicit to the user.
