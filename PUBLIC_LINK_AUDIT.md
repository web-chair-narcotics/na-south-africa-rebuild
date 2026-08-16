# Public Link Audit

Date: 16 August 2026

The public-link audit inspected explicit destinations in the shared public layout, homepage, Areas page, ContentPage, Literature page, area pages, meeting detail, and meeting finder. It checked internal routes against the running application and concrete external literature/content URLs against their official destinations.

| Category | Count | Result |
|---|---:|---|
| Concrete destinations checked | 28 | Pass |
| Failed destinations | 0 | Pass |
| Internal public routes | 9 | HTTP 200 |
| External official resources | 19 | HTTP 200 or successful response |

The parser intentionally excludes unresolved template placeholders such as `${slug}` and checks the concrete URLs generated from the literature catalogue data. The redesigned public navigation no longer exposes `/admin` or `/news`; both remain available only through their explicit route definitions or direct URLs where applicable, not as public primary navigation entries.
