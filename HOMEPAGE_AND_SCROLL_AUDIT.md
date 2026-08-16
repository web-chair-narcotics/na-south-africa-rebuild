# Homepage and Scroll Audit

## Visual image audit

The homepage currently uses a blue grid-and-orb hero treatment and does not contain a photographic hero image. The four area routes do contain visible, distinct photographic heroes in the current responsive project audit:

| Route | Desktop/mobile image status | Result |
|---|---|---|
| `/` | No photographic hero currently wired | Pending user-generated homepage asset |
| `/areas/johannesburg` | Visible at desktop and 375px mobile | Pass; Johannesburg dusk neighbourhood street |
| `/areas/cape-town` | Visible at desktop and 375px mobile | Pass; Cape Town street/Table Mountain scene |
| `/areas/pretoria` | Visible at desktop and 375px mobile | Pass; Pretoria jacaranda-lined avenue |
| `/areas/kwazulu-natal` | Visible at desktop and 375px mobile | Pass; KwaZulu-Natal coastal walkway |

## Scroll restoration repair

`client/src/App.tsx` now contains a route-aware `ScrollToTop` component using Wouter location changes and `window.scrollTo({ top: 0, left: 0, behavior: "auto" })`. It is mounted above the router so public and administrative route transitions reset the destination page to the top. Regression coverage was added to `server/siteExperience.regression.test.ts`.

## Verification

The project validation suite passes with 57 tests across 17 files, TypeScript passes, and the production build passes. Desktop and mobile visual captures confirm the four area photographs remain visible. The homepage image remains intentionally pending until the user supplies the generated Nano Banana 2K asset.
