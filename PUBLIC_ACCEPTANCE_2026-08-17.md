# Public Acceptance Record

**Project:** Narcotics Anonymous South Africa rebuild  
**Environment:** Published public site at `https://nasarebuild-eqxm563b.manus.space/`  
**Date:** 17 August 2026  
**Scope:** Public journeys and unauthenticated administrator boundary only.

## Acceptance result

The public-facing acceptance pass is **complete for the tested scope**. The evidence covers the homepage, five regional landing experiences, primary public navigation, meeting finder, canonical and legacy meeting-directory paths, in-person and online journeys, representative meeting details, Google Maps and directions, literature catalogue and downloads, privacy and Terms pages, crawler files, mobile contact actions, cookie consent, and unauthenticated administrator entry.

This record does **not** approve staged regional pages, historical meeting records, source-content changes, authenticated role isolation, transactional email delivery, native-device keyboard behaviour, or credential rotation. Those remain separate organisation/provider gates.

## Tested public journeys

| Journey | Result | Evidence |
|---|---|---|
| Homepage and public navigation | Pass | Live desktop/mobile screenshots, route smoke tests, skip-link and public focus evidence |
| Region, Johannesburg, Cape Town, Pretoria, and KwaZulu-Natal landing routes | Pass | Five-site live route and hero-asset verification |
| In-person meeting finder | Pass | Published results, filters, cards, addresses, map clusters, directions links, pagination |
| Online meeting finder | Pass | Separate online filter, Online-only presentation, join/contact actions, no venue/map treatment |
| Meeting detail pages | Pass for sampled public scope | In-person detail map and directions; online detail without physical-map treatment |
| Google Maps | Pass for sampled public scope | Three fresh map loads plus coordinate-based Google Directions checks |
| Literature | Pass | 56 supplied PDF resources mapped to detail pages and managed-storage download targets |
| Legal/crawler routes | Pass | Privacy, Terms, `sitemap.xml`, and `robots.txt` published and linked |
| Mobile contact actions | Pass | Mobile WhatsApp, email, and helpline tray verified visually |
| Cookie consent | Pass | Essential-only acknowledgement, persisted choice, privacy link, reduced responsive footprint |
| Unauthenticated `/admin` boundary | Pass | Redirects unauthenticated visitors to sign-in; no protected content exposed |

## Recent uploaded-audit repairs

The audit-driven repairs are live. Area landing links now emit canonical area slugs and legacy area-name query links are normalised. Physical meeting detail pages reuse the existing map component. Public online notes suppress credential-like lines, placeholder-style phone values do not render call actions, and public copy uses evidence-based “published” wording rather than a universal “verified” claim. A stale production bundle was detected and corrected with a fresh deployment marker; cache-busted live verification confirmed the Johannesburg filter, 98 published results, narrowed map, and revised copy.

## Explicitly pending gates

The following work cannot be honestly closed without organisation-owned decisions, provider access, or authorised test conditions: publication of 81 staged regional pages; individual QA/publication decisions for 328 historical meeting records; verified regional content updates; an approved transactional-email provider; authenticated area-admin acceptance; native mobile keyboard/accessibility testing; and conditional credential rotation if exposure is confirmed.

The public site remains operational while those gates are pending. No meeting record, inactive status, source note, staged publication status, or authentication boundary was changed as part of this acceptance record.
