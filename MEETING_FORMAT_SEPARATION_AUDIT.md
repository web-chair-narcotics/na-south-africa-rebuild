# Meeting-format separation audit

**Audit date:** 16 August 2026

The rebuild now treats meeting format as a first-class distinction across source reconciliation, database queries, public filters, result cards, map points, and meeting-detail actions. The source categories are **online**, **in-person**, **hybrid**, and **inactive**. Inactive is a publication/status state and must not be treated as a public meeting format.

## Current live-source counts

The five canonical TSML feeds returned 622 raw rows because the Region feed includes Area imports. The first stable live-source pass reported the following current counts across the deduplicated working set:

| Category | Live rows | Rebuild behavior |
|---|---:|---|
| Online | 52 | Join path only; excluded from physical map points; no physical directions |
| In-person | 257 | Physical address, map point, and Google Maps directions when coordinates/address exist |
| Hybrid | 4 | Physical map/directions plus online join when each is supplied by the source |
| Inactive | 22 | Retained for audit/admin review; excluded from public search and map points |

The supplied workbook contains 328 unique rows and previously recorded 51 online, 253 in-person, 3 hybrid, and 21 inactive rows. The current live feed therefore contains source changes that must be reconciled by Area system-of-record rules rather than blindly overwritten.

## Implemented safeguards

The public database query now limits physical map points to `in_person` and `hybrid` records with coordinates. Online-only records cannot create physical map markers. The public finder suppresses the physical address line for online-only records, displays an online-access line instead, and shows a join action for online and hybrid records when a verified URL exists. In-person and hybrid records receive Google Maps directions only when physical fields are available.

The meeting-detail page uses `Online access` for online-only records. Its action panel conditionally exposes the online join action for online and hybrid records and physical directions for in-person and hybrid records. Inactive records remain excluded by the existing `status = published` public-query condition.

## Regression evidence

The focused finder regression file now contains five passing tests. The additional safeguards verify that online-only searches return only online records and no physical map points, physical searches return only in-person records with format-appropriate points, and inactive records are not returned by public searches. TypeScript checking also passes.

## Live-source caveat

The complete sitemap inventory contains 1,157 unique URLs. A high-volume direct HTTP body crawl was attempted, but the live source throttled or timed out most concurrent requests. The robots file, sitemap indexes, canonical TSML feed, and directory pages were successfully retrieved through the browser/source workflow. The crawl artefacts retain the failed direct-request statuses as a documented source-side throttling limitation; they are not presented as successful body verification for every page.

## References

[1]: https://na.org.za/robots.txt "Narcotics Anonymous South Africa robots file"
[2]: https://na.org.za/sitemap_index.xml "Narcotics Anonymous South Africa sitemap index"
[3]: https://na.org.za/wp-admin/admin-ajax.php?action=meetings "Narcotics Anonymous South Africa canonical TSML meeting feed"
[4]: https://na.org.za/in-person-meetings/ "Narcotics Anonymous South Africa in-person directory"
