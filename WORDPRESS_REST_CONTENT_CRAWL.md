# WordPress REST content crawl

Generated: 2026-08-16T07:57:18.800685+00:00

| Measure | Count |
|---|---:|
| Public REST pages/posts returned | 100 |
| Records with readable body content | 79 |
| Sitemap URLs | 1157 |
| Sitemap URLs represented by REST page/post links | 83 |
| Sitemap URLs outside REST page/post collections | 1074 |

## REST content rows by site

| Site | Rows |
|---|---:|
| johannesburg | 17 |
| kwazulu-natal | 7 |
| pretoria | 10 |
| region | 15 |
| western-cape | 51 |

## REST content rows by collection

| Collection | Rows |
|---|---:|
| pages | 78 |
| posts | 4 |
| tribe_events | 1 |
| tribe_organizer | 7 |
| tribe_venue | 10 |

## Interpretation

This crawl replaces the earlier blocked page-body approach for public WordPress pages and posts. Remaining sitemap URLs outside these REST collections are retained for classification; they include meeting/location endpoints already covered by the canonical TSML feeds, category/archive routes, media, and other non-page/post resources. The complete row-level record is `WORDPRESS_REST_CONTENT_CRAWL.csv` and `WORDPRESS_REST_CONTENT_CRAWL.json`.

## Errors

None.
