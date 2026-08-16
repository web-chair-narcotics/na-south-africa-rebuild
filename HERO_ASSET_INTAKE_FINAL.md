# Final Five-Site Hero Asset Intake

## Intake decision

The five supplied images were accepted for the five site hero panels after metadata-only validation and responsive screenshot verification. They are genuine WebP files at 2048 × 1143 px, RGB, with a consistent 1.791776 landscape ratio suitable for the 2K hero treatment. The supplied images were not reopened in the file viewer after the user explicitly prohibited that action; validation used file signatures, Pillow metadata, hashes, and rendered website screenshots.

## Route mapping and storage

| Site | Route | Source upload | Measured file | SHA-256 | Managed storage path | Decision |
|---|---|---|---|---|---|---|
| South Africa Region | `/areas/south-africa-region` | `asset_h60i64ptz_1786862901461.webp` | WebP, 2048 × 1143, RGB | `a90580e4b52ae2b0aa45d1eac481dfdfa7c4d1e24a308f6efae21c342149e2f3` | `/manus-storage/na-region-south-africa-hero_03348d2b.webp` | Connected |
| Johannesburg | `/areas/johannesburg` | `asset_0u2dvb5jf_1786862901461.webp` | WebP, 2048 × 1143, RGB | `06a426bd2cc7725f7b8e41f43b47f199f78a47b6dfa28e7f8482537fa2003f69` | `/manus-storage/na-area-johannesburg-hero_c81eaedf.webp` | Connected |
| Cape Town | `/areas/cape-town` | `asset_hm5mnqrg3_1786862901461.webp` | WebP, 2048 × 1143, RGB | `3084fe7d418d77cef1389b2d34a5d40b19b000ccbe0739b569e1462d439325c1` | `/manus-storage/na-area-cape-town-hero_2c81ddbc.webp` | Connected |
| Pretoria | `/areas/pretoria` | `asset_kzkqh1lbf_1786862901461.webp` | WebP, 2048 × 1143, RGB | `4dd6af3b621d53c5d78a3e1585e2b5eefe070e8c3f0ac0a8b6c8c4949857ed40` | `/manus-storage/na-area-pretoria-hero_5bad0679.webp` | Connected |
| KwaZulu-Natal | `/areas/kwazulu-natal` | `asset_3irmhzqdq_1786862901461.webp` | WebP, 2048 × 1143, RGB | `acc19d74a2c1b7ddfbc10680e9aae0635dad8b19527311e35ebee4fcbd73ae4a` | `/manus-storage/na-area-kwazulu-natal-hero_792f5d0c.webp` | Connected |

## Visual and responsive QA

All five route panels were captured at 1280 × 720 and 375 × 812. The regional lighthouse and harbour image reads as the South Africa Region hero; the Johannesburg image reads as a local neighbourhood and community notice-board scene; the Cape Town image shows the colourful street and Table Mountain relationship; Pretoria is represented by a jacaranda-lined avenue; and KwaZulu-Natal is represented by a warm coastal walkway. The blue overlay preserves white labels and descriptions, and the mobile crop retains the primary location cue in the visible panel.

The images use the exact route-labelled filenames in `AreaPage.tsx`. No inactive meeting status was changed, no meeting data was altered, and no image is associated with a specific meeting venue.
