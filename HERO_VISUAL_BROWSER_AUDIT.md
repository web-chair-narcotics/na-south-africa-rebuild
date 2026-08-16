# Five-Site Hero Visual Browser Audit

**Checkpoint under test:** `314ceec1`  
**Method:** Actual production-browser page capture, not source inspection or development-only screenshots.

| Route | Visible result | Status |
|---|---|---|
| `/areas/south-africa-region` | Lighthouse and harbour photograph is visibly painted behind the hero content; title, buttons, and text remain legible. | Pass |
| `/areas/cape-town` | Cape Town street and Table Mountain photograph is visibly painted behind the hero content; it is visibly distinct from the Region route. | Pass |
| `/areas/johannesburg` | Previously confirmed in the production browser: community-noticeboard street photograph is visibly painted. | Pass |
| `/areas/pretoria` | Jacaranda-lined avenue with purple blossoms is visibly painted behind the hero content. | Pass |
| `/areas/kwazulu-natal` | Tree-lined Indian Ocean coastal walkway is visibly painted behind the hero content. | Pass |

The original defect was not a failed file request: browser diagnostics showed loaded images with full intrinsic dimensions. The cause was an overly opaque blue overlay. The deployed correction reduces the overlay while retaining text contrast.

All five desktop production-browser checks now pass. The Region lighthouse/harbour, Johannesburg noticeboard street, Cape Town/Table Mountain street, Pretoria jacaranda avenue, and KwaZulu-Natal coastal walkway are visibly distinct photographs behind their route-specific hero content.
