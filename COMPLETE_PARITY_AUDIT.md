# NA South Africa complete parity audit

**Audit date:** 16 August 2026

## Executive result

The rebuild now has a verified five-site public platform, a database-backed meeting finder, managed Google Maps integration, scoped administration, emergency notices independent of meeting status, and five connected hero assets. The authoritative meeting feeds were re-fetched and reconciled against the supplied 328-row workbook. Format handling is now strict: online-only records are separate from physical map/directions behavior, in-person records retain physical routing, hybrid records expose both paths only when supplied, and inactive records remain excluded from public search.

## Source inputs and coverage

The audit used the supplied `NA-SA-Master-Rebuild-Audit-Spec.md`, the supplied `NA-South-Africa-All-Meetings.xlsx`, the complete project-shared/upload inventory, the live robots file, all five sitemap indexes, the national and four Area TSML JSON feeds, and the existing migration, media, meeting, and QA evidence. The canonical feed URLs are listed in `LIVE_PARITY_CRAWL_NOTES.md` and `LIVE_PARITY_AUDIT_REPORT.json`.

The five feeds returned 622 raw rows: Region 328, Johannesburg 111, Pretoria 42, Western Cape 79, and KwaZulu-Natal 62. The Region feed imports Area rows, so the raw total is not a unique meeting count. The supplied workbook contains 328 rows. Stable URL/source-key comparison found 327 direct workbook/live intersections plus eight current Area-feed route variants and one workbook-only slug variant; these are retained as explicit source discrepancies rather than silently merged or deleted.

## Format-separated counts

| Category | Current live-feed working count | Public rebuild treatment |
|---|---:|---|
| Online | 52 | Join path only; never a physical map point or directions destination |
| In-person | 257 | Address, map point, and Google Maps directions when physical fields exist |
| Hybrid | 4 | Physical and online actions independently gated by source fields |
| Inactive | 22 | Retained for admin/audit review; excluded from public finder and map |

The supplied workbook’s earlier counts were 51 online, 253 in-person, 3 hybrid, and 21 inactive. The difference is evidence of live-source change and feed conflict, not permission to republish stale rows automatically.

## Implemented corrections

The database map-point query now requires published status, an active area, an in-person or hybrid format, and usable coordinates. Finder result cards suppress physical address and directions for online-only meetings, display the online-access state, and show join/directions actions independently for hybrid records. Meeting-detail pages use `Online access` for online records and conditionally show join and Google Maps actions based on the format and available source fields. The existing published-only visibility condition continues to exclude inactive and archived records.

The complete verification suite passes: 15 test files and 40 tests, TypeScript, and production build. Desktop screenshots of `/meetings` and `/meetings/2` were captured after the change. The formal format evidence is in `MEETING_FORMAT_SEPARATION_AUDIT.md` and the implementation evidence is appended to `QA_VERIFICATION.md`.

## Full public URL inventory

The five sitemap indexes contain 1,157 unique public URLs: Region 542, Johannesburg 219, Pretoria 87, Western Cape 186, and KwaZulu-Natal 123. The inventory includes area pages, directories, meeting URLs, location URLs, events, category pages, shop/commerce routes, and supporting public pages. The URLs are preserved in `LIVE_PARITY_AUDIT_REPORT.json` and the results of the direct crawl attempt are in `FULL_SITEMAP_CRAWL.json` and `FULL_SITEMAP_CRAWL.md`.

A high-volume direct page-body crawl was attempted with bounded concurrency and short timeouts. The live server throttled or timed out most direct sandbox requests; a single direct curl probe also failed at the TLS layer. Browser/source retrieval successfully opened the robots file, sitemap index, directory pages, and canonical TSML JSON feed. Therefore the report claims complete URL inventory and complete feed extraction, but does **not** falsely claim successful page-body verification for all 1,157 URLs. This is the only unresolved source-access limitation in the crawl phase.

## Organisation-owned blockers

The remaining project-ledger items are not hidden implementation failures. They are either source-access limitations or require authorised organisational input: publication decisions for staged regional pages, final per-record meeting QA decisions where current Area and Region sources conflict, an approved transactional email provider, authenticated area-admin/national-admin acceptance using real accounts, native touch-device keyboard acceptance, and any decision to publish or archive legacy content pages. The current build does not promote stale or conflicting records solely to make counts appear complete.

## References

[1]: https://na.org.za/robots.txt "Narcotics Anonymous South Africa robots file"
[2]: https://na.org.za/sitemap_index.xml "Narcotics Anonymous South Africa sitemap index"
[3]: https://na.org.za/wp-admin/admin-ajax.php?action=meetings "Narcotics Anonymous South Africa canonical TSML feed"
[4]: https://na.org.za/in-person-meetings/ "Narcotics Anonymous South Africa in-person directory"


## Applied Area-system-of-record correction

The current Pretoria Area feed showed **Soshanguve Meeting — Wednesday** and **Soshanguve Meeting — Sunday** as live in-person records, while their Region-import counterparts were archived. Following the governing source rule that each Area site is the system of record for its own meetings, the rebuild corrected meeting IDs 108 and 299 to `published`, restored the Wednesday and Sunday schedules, updated the live Area source URLs, updated the current Area coordinates, and recorded the source decision in each row’s review notes. No other conflicting record was promoted automatically.
