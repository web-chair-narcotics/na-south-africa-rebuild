# Publication Readiness Register

**Generated from:** `contentPages` and `meetings` database status summaries collected on 16 August 2026, plus `meeting_qa_register.csv`. This register does not approve or publish content. It separates technically complete migration work from decisions that require authorised NA South Africa review.

## Regional page publication queue

| Area association in the content model | Draft-staged pages | Required authorised decision |
|---|---:|---|
| National / unassigned | 52 | Review source fidelity, current contact details, links, and publication suitability; then submit or publish through the national workflow. |
| Johannesburg | 16 | Review source fidelity, current contact details, links, and publication suitability; then submit or publish through the national workflow. |
| KwaZulu-Natal | 6 | Review source fidelity, current contact details, links, and publication suitability; then submit or publish through the national workflow. |
| Pretoria | 7 | Review source fidelity, current contact details, links, and publication suitability; then submit or publish through the national workflow. |
| **Total** | **81** | **No bulk publication has been performed.** |

The `National / unassigned` label is a content-model association, not a claim of geographic ownership. These pages must be assigned or explicitly retained as national content during review.

## Legacy meeting review register

The historical QA register contains **328 staged meeting records**. It records source evidence and the required national review items; it does not override the live meeting table. The live application currently contains **307 published** meetings and **21 archived** records, while the register preserves the remaining individual confirmation workflow.

| Area | Staged records | QA not started | High priority | Inactive | Online | In person |
|---|---:|---:|---:|---:|---:|---:|
| Johannesburg | 143 | 143 | 1 | 7 | 37 | 98 |
| KwaZulu-Natal | 62 | 62 | 0 | 0 | 2 | 60 |
| Pretoria | 42 | 42 | 3 | 14 | 2 | 24 |
| Western Cape | 81 | 81 | 0 | 0 | 10 | 71 |
| **Total** | **328** | **328** | **4** | **21** | **51** | **253** |

Every record requires an authorised reviewer to complete the visible quality gate: **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**. For online meetings, a physical map pin may be marked *not applicable* only when the meeting is not represented as an exact in-person venue. Inactive records remain archived until an authorised reactivation decision.

## Approval boundary

| Work item | Technical state | Required next owner |
|---|---|---|
| Draft regional pages | Imported and staged; no automatic publication | National content reviewer with area confirmation |
| Meeting review register | Source evidence and per-record QA columns are prepared | National reviewer and relevant area administrator |
| Public legacy URLs | Destination decisions and fallback routing are in place | Content reviewer before changing any draft destination to public content |
| Managed media | Canonical attachment linkage and managed URLs verified | Content reviewer when inserting media into approved pages |
| Email workflow | In-app notifications available; external provider intentionally unconfigured | Organisation owner after selecting an approved transactional email provider |
| Native mobile keyboard pass | Desktop harness and mobile captures completed; native interactive pass remains open | Organisation reviewer on a real mobile browser or responsive device lab |

## Supporting files

The detailed meeting breakdown is stored in `meeting_qa_summary_by_area.csv`. Per-record source evidence is retained in `meeting_qa_register.csv`, while URL decisions and media linkage remain in the migration and media manifests.
