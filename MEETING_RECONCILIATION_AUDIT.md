# Meeting Reconciliation Audit

## Scope

This audit compares the live legacy directory at `https://na.org.za/meetings/`, the uploaded regional WordPress exports and meeting CSV snapshots, and the rebuilt application’s published directory. It is intended to determine why a meeting observed on the legacy site is missing from the rebuilt finder, without silently publishing inaccurate, inactive, or non-verifiable records.

## Initial live-source evidence

The legacy site exposes a comprehensive directory at `https://na.org.za/meetings/` and separate in-person and online route shells. The live list visibly contains records with `Inactive` locations alongside normal in-person and Zoom records, and it visibly repeats **CT Women’s Meeting 2026** twice in the first Sunday result set. These observations show that a raw count comparison is insufficient: the audit must separately classify live records, imports, staged records, published records, duplicates, and exclusion reasons.

| Source | URL | Initial finding |
|---|---|---|
| Legacy landing page | https://na.org.za/ | Links to in-person, online, and comprehensive directory journeys. |
| Comprehensive legacy directory | https://na.org.za/meetings/ | First result set includes live, online, inactive, and duplicated records. |
| In-person page | https://na.org.za/in-person-meetings/ | Navigation shell observed; detailed source extraction required. |
| Online page | https://na.org.za/online-meetings/ | Navigation shell observed; detailed source extraction required. |

## Investigation rules

The reconciliation will preserve the existing safety policy: inactive or approximate location-only records will not be made publicly discoverable as exact in-person venues merely to raise a count. Each discrepancy will receive one of the following outcomes: published, safely published as online, staged for verification, excluded as inactive/duplicate, or blocked pending missing factual source data.

## Reconciliation conclusion

The current legacy TSML endpoint returned **328** records, and the rebuilt database contains the same **328** records with a one-to-one source match. There is therefore no source-record loss in the migration. The rebuilt finder intentionally exposes **307 published** rows and withholds **21 archived** rows.

The live endpoint’s own `attendance_option` is `inactive` for every one of those 21 withheld rows. This includes entries whose *meeting type* also contains `Open`; in TSML, `Open` is a meeting-type label, whereas `attendance_option=inactive` is the availability status. The legacy public list currently displays such rows anyway, which can make an inactive meeting appear to be missing from the safer rebuilt finder. The detailed record-by-record evidence is retained in `CURRENT_LIVE_ARCHIVED_MEETINGS.md`, `ARCHIVED_MEETING_SOURCE_DECISIONS.md`, and `MEETING_RECONCILIATION_RESULTS.md`.

No inactive record was republished during this audit. If the user-found meeting is one of the 21, the appropriate correction is an area-owner confirmation that the meeting has resumed, followed by updated source status, address, map-pin, spelling, and contact review—not a silent publication override.

## Schedule-parsing defect found and repaired

The audit also found a separate discoverability defect affecting **34 already-published** records. The legacy TSML feed encodes Sunday as numeric day `0`, while the original migration expected textual weekday names. The migration therefore stored `[]` for 33 Sunday records, causing them to disappear whenever a visitor selected a day filter. A 34th record, **Esihlahleni Tsakane – Daily – 17:30** (rebuild ID 328; legacy ID 4322), had an empty legacy day/time field but a verified `Daily – 17:30` schedule in its source name.

All 34 rows were repaired from their one-to-one live TSML evidence: the Sunday set now stores `["sunday"]`, and the Daily record now stores all seven days at `17:30`. Post-repair database checks found **0** published records with an empty day array and **0** with a placeholder `00:00` time. The live finder procedure returned **34 Sunday results**, including Esihlahleni Tsakane, after the correction. `PUBLISHED_SCHEDULE_REPAIR_PLAN.md` and `published-schedule-repair.sql` retain the complete before/after evidence.

To prevent the defect from returning in a future migration, the retained import workflow now uses `scripts/legacySchedule.mjs`. Its `parseLegacyTsmlSchedule` function explicitly maps TSML `0` to Sunday and derives a full seven-day schedule plus `HH:MM` time from a verified Daily meeting name when the legacy row itself is blank. Behavioural regression tests execute those two cases directly and separately confirm that the repaired record remains discoverable through the public finder’s day, area, type, and pagination paths.
