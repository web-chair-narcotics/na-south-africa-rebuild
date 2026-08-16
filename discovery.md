# Initial Discovery Notes

## Current national portal

The current homepage at `https://na.org.za/` presents an immediate recovery message, the national phoneline `0861 00 6962`, primary links to in-person and online meeting searches, introductory NA content, literature, and regional contact channels. Its navigation exposes Home, Meetings, In-Person Meetings, Online Meetings, NA Africa, About NA, Contact NA, and What Happens at an NA Meeting.

## Migration and quality findings

The supplied audit identifies a homepage link to `/contact-us` that should lead to `/contact/`, disabled mobile zoom, insufficient contrast for cyan links, a missing keyboard skip link, an empty footer-logo alternative text field, duplicate top-level headings, performance issues from heavy inline styling, and missing defensive response headers. The rebuild will address each through accessible implementation, route redirect support, higher-contrast colors, one semantic H1 per page, and platform-level security configuration.

## Meeting finder priorities

The current site exposes routes for in-person meetings and online meetings. The rebuild will consolidate the discovery experience around a mobile-first finder that prioritises the quickest possible path from search to a verified meeting and precise navigation, while retaining clear alternatives for online meetings.

The legacy general meeting route at `https://na.org.za/meetings/` does present a searchable list and supports region, weekday, time, and type controls with a list/map switch. However, the in-person route appears to show no usable finder content, several listed sessions have an `Inactive` address value, duplicate records are visible, addresses are inconsistently structured, and rows combine online and physical meetings. The new model will treat meeting format and publication state explicitly, store every address component independently, require a valid geographic location before an in-person meeting can be published, and retain source provenance until each imported record completes national QA.
