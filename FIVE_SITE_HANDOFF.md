# Five-Site NA South Africa Handoff

## What is now built

The public platform now has one regional route and four dedicated area routes. The regional site is `/areas/south-africa-region`; the area sites are `/areas/johannesburg`, `/areas/cape-town`, `/areas/pretoria`, and `/areas/kwazulu-natal`. The Areas hub presents all five as distinct entry points while keeping the meeting finder national and shared.

The homepage’s previous explanatory blocks are now direct shortcuts. Visitors can open the meeting finder, call the national phoneline at `0861 00 6962`, or read what to expect at an NA meeting. The shortcuts are keyboard-focusable and use the verified blue/green system.

## Emergency rule

Inactive meetings remain inactive. The new emergency-notice path is independent: only a national administrator can draft, publish, or archive a time-bounded public notice. A published notice appears as an accessible alert across the public region and area sites. It does not reactivate, publish, merge, or edit any meeting record.

## Image handoff

Generate five standalone WebP files using the full prompts in `AREA_SITE_IMAGE_PROMPTS.md`. The exact filename is the routing key and must not be changed:

| Site | Route | Filename | Required size | Status |
|---|---|---|---:|---|
| South Africa Region | `/areas/south-africa-region` | `na-region-south-africa-hero.webp` | 2400 × 1350 px | Awaiting generated asset |
| Johannesburg | `/areas/johannesburg` | `na-area-johannesburg-hero.webp` | 2400 × 1350 px | Awaiting generated asset |
| Cape Town | `/areas/cape-town` | `na-area-cape-town-hero.webp` | 2400 × 1350 px | Awaiting generated asset |
| Pretoria | `/areas/pretoria` | `na-area-pretoria-hero.webp` | 2400 × 1350 px | Awaiting generated asset |
| KwaZulu-Natal | `/areas/kwazulu-natal` | `na-area-kwazulu-natal-hero.webp` | 2400 × 1350 px | Awaiting generated asset |

Each image must be 16:9, keep the left third calm for copy, hold its regional focal point on the centre-right, survive a 390–430 px mobile crop, contain no text/logos/watermarks/readable signs, avoid identifiable faces and staged recovery scenes, and avoid implying a specific meeting venue. The intake manifest is `FIVE_SITE_HERO_ASSET_INTAKE.csv`. Once the five files are supplied, they can be uploaded to managed storage and connected by exact filename without changing the prompts or route map.

## Research basis

The visual directions were cross-checked against [Cape Town Tourism](https://www.capetown.travel/), which describes Cape Town as a modern city surrounded by nature and centred around Table Mountain; [South African Tourism](https://southafrica.net/gl/en/travel), which presents the country through landscapes, cities, heritage, and diversity; and the [UNESCO South Africa state-party page](https://whc.unesco.org/en/statesparties/za), which supports the varied natural and heritage context used for the national, Cape Town, and KwaZulu-Natal directions. These are visual references only; no third-party image has been copied into the application.
