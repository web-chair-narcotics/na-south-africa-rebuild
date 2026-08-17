# POPIA and Legal-Readiness Review

**Review date:** 17 August 2026  
**Status:** Working implementation review; attorney and appointed Information Officer approval required before treating this as the final legal policy.

## Authoritative baseline

The South African Information Regulator states that public and private bodies must register their Information Officers and describes duties including encouraging lawful processing compliance, dealing with POPIA requests, cooperating with investigations, and ensuring compliance. The Regulator also describes additional duties such as maintaining a compliance framework, completing a personal-information impact assessment, maintaining internal request systems, and conducting awareness activities.[^1]

The Regulator's direct-marketing guidance covers unsolicited non-electronic communications under section 11 and unsolicited electronic communications under section 69. The NA rebuild currently has no public marketing subscription or public contact-form submission route, so it must not claim consent, opt-out, retention, or direct-marketing practices that the organisation has not approved.[^2]

## Current implementation inventory

| Area | Current fact | Legal-readiness implication |
|---|---|---|
| Public meetings | Public meeting records may include venue, address, coordinates, public contact details, notes, online joining information, source URLs and review fields | The organisation must confirm which fields are authorised for public disclosure and define correction/removal handling |
| Online meetings | Online records are normalised without physical address/geocode fields and are labelled Online in public journeys | This is a data-minimisation safeguard; operators must still verify that online joining links and contact details are approved |
| Authentication | Authorised administration uses a secure session cookie; preview fallback can use session storage when cookies are unavailable | The final notice should identify the responsible party, authentication provider, cross-border processing, retention and incident process |
| Accounts | The account layer may store an authentication identifier, optional name/email, role and sign-in timestamps | The organisation must set retention, access, correction and deletion rules for administrator data |
| Notifications/audit | Review workflows use in-app notifications and audit events; no approved external transactional-email provider is configured | Do not claim external email delivery or a final notification-retention policy |
| Contact actions | Phone, email and WhatsApp buttons open the visitor's own application; there is no public contact-form endpoint | The organisation should publish the approved channel and handling process for requests and complaints |
| Maps/literature | Google-related map services and external official literature pages may process requests under their own notices | The final policy should identify material third-party services and any cross-border processing |
| Analytics/cookies | Functional cookies and browser storage are used for authentication and preferences; the organisation's analytics consent and retention decision is not documented | Confirm whether analytics is enabled, whether consent is required for the chosen configuration, and how long events are retained |

## Implemented site change

The public `/privacy` route and `/privacy-policy` alias now provide a plain-language working notice. The footer links to `/privacy`. The notice explicitly says it is not the final organisational policy, avoids claiming unknown legal bases or retention periods, describes the current data flows, explains online-meeting minimisation, and identifies the Information Officer, responsible-party, provider, retention, complaint and breach-response decisions that require approval.

## Required organisational decisions

Before the notice is adopted as the final privacy policy, the organisation should confirm the responsible party and Information Officer, the lawful bases for each processing purpose, the public-meeting-field policy, data-subject request channel and service process, retention and deletion periods, administrator access reviews, breach-response procedure, third-party and cross-border processing list, analytics/cookie decision, direct-marketing position, and PAIA/manual obligations. A South African privacy attorney or the appointed Information Officer should review and approve the final wording.

## References

[^1]: [Information Regulator South Africa — Protection of Personal Information](https://inforegulator.org.za/popia/)
[^2]: [Information Regulator South Africa — Guidance notes](https://inforegulator.org.za/guidance-notes/)
