# Legacy Brand Evidence Alignment

The supplied `Extractthecolorpalette.txt` identifies the legacy Elementor global-kit colours and fonts. The rebuilt interface previously used a separate deep-green editorial treatment. To preserve the completed layout and established meeting-finder usability while honouring the supplied source evidence, this pass applies only low-risk global alignment changes.

| Legacy source evidence | Applied alignment | Reason |
|---|---|---|
| Off-white `#F8F8F8` and body grey `#54595F` | Base page surface and default body tone | Restores the source neutral system without altering content hierarchy. |
| Primary blue `#085C84` | Eyebrows and skip-link surface | Reintroduces a recognisable NA brand cue in semantic navigation and labels. |
| Accent green `#2F9B3E` | Visible keyboard focus and finder-control focus treatment | Creates a consistent, high-salience interactive state aligned with the source button accent. |
| Light and mid greys `#EEEEEE`, `#AAAAAA` | Helpline support band and filter border | Aligns supporting surfaces while preserving readable foreground contrast. |
| Roboto, Gelasio, Neuton | Global body and heading font stack, with Neuton available for future display use | Restores the supplied legacy type family without changing structural markup. |

The full legacy visual system was not copied wholesale. Existing page-level deep-green and white button treatments remain where they are necessary to retain the already-tested contrast, tap-target sizing, and recovery-focused visual hierarchy. The WordPress default swatches and peach transition colour were intentionally excluded because the supplied evidence identifies them as non-core or one-off colours.

Desktop and 375-pixel mobile screenshots were reviewed after the alignment. The legacy-aligned neutral background, blue eyebrows, green focus treatment, and Gelasio/Roboto typography remain readable in the hero, meeting-finder cards, support callout, long-form content, and footer. No clipping, contrast loss, or reduced tap-target sizing was observed in these verification captures.

| Route | Desktop verification | Mobile verification |
|---|---|---|
| Home | Pass — recovery hierarchy, support CTA, cards, and footer remain readable. | Pass — mobile navigation, tap targets, hero, cards, CTA, and footer remain legible. |
| Meeting finder | Pass for filter hierarchy, results, directions CTAs, and footer; map reliability remains tracked separately. | Pass for stacked filters, meeting cards, directions CTAs, and footer; map reliability remains tracked separately. |
| About | Pass — long-form content and support panel remain readable. | Pass — copy reflows cleanly, support panel and footer remain readable. |
| Contact | Pass — helpline, emergency text, regional channels, and support panel remain readable. | Pass — long-form contact information and call-to-action remain readable. |
| Administrator entry | Pass — area-isolation explanation and sign-in panel remain legible. | Pass — sign-in CTA is large, readable, and remains within the viewport. |

The separate Google Maps reliability finding is intentionally not treated as a palette or typography defect and remains open in `todo.md`.

## Code-level regression evidence

`server/brandAlignment.test.ts` reads the global stylesheet and verifies the supplied core colour tokens (`#085C84`, `#2F9B3E`, `#54595F`, `#F8F8F8`, `#EEEEEE`, and `#AAAAAA`) alongside the Gelasio, Neuton, and Roboto font names. The post-alignment verification passed TypeScript checking, **15 tests across 7 test files**, and the production build. This provides inspectable evidence that the supplied brand source remains represented in the deployed stylesheet, independent of visual capture tooling.
