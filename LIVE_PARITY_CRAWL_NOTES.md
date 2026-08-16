# Live parity crawl notes — 16 August 2026

The live site's `robots.txt` exposes five sitemap indexes: the national root plus `/wc/`, `/kzn/`, `/pta/`, and `/jhb/`. The national sitemap index includes page, post, TSML meeting, TSML location, and category sitemaps. The supplied audit specification identifies the canonical meeting endpoint as `https://na.org.za/wp-admin/admin-ajax.php?action=meetings` plus the four area-prefixed equivalents.

The live in-person directory at `https://na.org.za/in-person-meetings/` is a TSML-driven filter view and contains paginated/filterable meeting rows. The canonical JSON feed is the authoritative data source; the HTML directory is retained as a user-facing verification source, not as the import source.

The root canonical feed was opened successfully on 16 August 2026 and returned a large JSON corpus containing meeting IDs, names, slugs, updated timestamps, day/time, attendance options, coordinates, regions, location URLs, meeting URLs, online conference fields, and status-related fields. The next step is deterministic extraction of all five feeds and comparison against the supplied workbook and rebuilt reconciliation evidence.

## Authoritative URLs

| Purpose | URL |
|---|---|
| Robots and sitemap discovery | https://na.org.za/robots.txt |
| National sitemap index | https://na.org.za/sitemap_index.xml |
| National TSML feed | https://na.org.za/wp-admin/admin-ajax.php?action=meetings |
| In-person directory example | https://na.org.za/in-person-meetings/ |
| Supplied area directory examples | https://na.org.za/wc/in-person-meetings/ and https://na.org.za/kzn/na-meetings/ |


## Latest deterministic feed extraction

The canonical five TSML feeds were fetched on 16 August 2026. Raw rows total 622: Region 328, Johannesburg 111, Pretoria 42, Western Cape 79, and KwaZulu-Natal 62. The first stable-slug comparison produced 327 workbook/live URL-slug intersections plus eight area-feed-only URL variants and one workbook-only slug variant; these are source conflicts or slug variants, not automatically new meetings. The live feed currently reports 52 online, 257 in-person, 4 hybrid, and 22 inactive rows under the first fingerprint pass. The supplied workbook contains 328 rows and previously recorded 51 online, 253 in-person, 3 hybrid, and 21 inactive records.

The eight area-feed-only variants identified for explicit classification are: `monday-rietvlei-meeting-open`, `monday-rustenburg-meeting-open`, `soshanguve-meeting-wednesday-open`, `proteapark-wednesday-meeting-open`, `thursday-rustenburg-meeting-open`, `thursday-thabazimbi-meeting-open`, `soshanguve-meeting-sunday-open`, and the Western Cape `ct-womens-meeting` route. The area-feed rows must be compared with their Region-import counterparts using the audit specification’s rule that each Area site is the system of record for its own meetings. In particular, the live Pretoria feed currently shows Soshanguve Wednesday and Sunday as in-person while the Region-import counterparts are inactive; this is a material status conflict and must not be silently resolved without source-rule evidence.

A complete sitemap inventory contains 1,157 unique URLs: Region 542, Johannesburg 219, Pretoria 87, Western Cape 186, and KwaZulu-Natal 123. A bulk HTTP crawler was attempted but the source server throttled or timed out high-volume direct requests; browser retrieval of robots, sitemap indexes, the in-person directory, and the canonical TSML JSON feed succeeded. The crawl result is retained in `FULL_SITEMAP_CRAWL.json` and `FULL_SITEMAP_CRAWL.md` as evidence of the source-side throttling condition, not as a claim that 1,157 page bodies were successfully retrieved.

## Format-separation implementation evidence

The rebuild now excludes online-only meetings from physical map points at the database query layer. Finder cards suppress physical addresses and directions for online-only records, show verified join links for online and hybrid records when present, and preserve directions for in-person and hybrid records only when physical data exists. Meeting detail pages use `Online access` for online-only records and conditionally expose join and directions actions by format. Focused regression coverage passes: 5 tests in `server/finder.behavior.regression.test.ts`, plus TypeScript checking.
