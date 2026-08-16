# Comprehensive Live Audit Findings

## Meeting finder — live production

The live in-person route `/meetings?meetingFormat=in_person` loads the meeting finder with the In person format selected, physical meeting filters, an interactive Google map with visible South Africa tiles, and the expected map-linked state. The initial browser extraction showed the finder loading its verified data; the map rendered actual Google tiles rather than the temporary unavailable panel.

The live online route `/meetings?meetingFormat=online` is a dedicated online journey. It reports 51 verified meetings, shows online-only descriptions and Join online/Call contact actions, and does not present physical addresses, venue maps, or directions. Online result cards do not display area badges. The filter control still lists area filters as available options, which is a product decision requiring review against the strictest interpretation of the requirement that online meetings have only `Online` as a location value; no physical location text was observed in the visible cards.

The online route’s browser-extracted sample includes meeting access passwords and join URLs because the current published source records contain them. This is an information-security and privacy review item: the audit must determine whether those access details are organisation-approved for public display before making any change. No data was altered during this read-only pass.

## Current status

Live meeting audit is in progress. The first two checks preserve the current presentation and confirm that the dedicated in-person and online journeys are operational. Further checks will cover pagination, meeting details, directions, legacy routes, public navigation, literature downloads, assets, and admin boundaries.

## Meeting detail checks

The live `/meetings/1` and `/meetings/3` routes both resolve to online-only meetings despite being selected for representative detail testing. Both correctly show an `Online meeting` eyebrow, online access, no physical address, no map, no directions, and a Join online action. This confirms the format-aware online detail treatment but does not yet constitute a physical-detail pass; a physical meeting ID must be selected from the loaded in-person result set before that check can be classified complete.

The visible online detail notes include a meeting password. This repeats the access-credential publication concern from the online finder and must remain an organisation-owned data-policy review item unless the source owner confirms that public display is intended.

## Physical meeting detail check

The in-person finder loaded 255 verified physical meetings, visible Google Maps tiles, clustered markers, Show on map controls, and Google directions links. The first physical result opened `/meetings/293` and correctly rendered a Western Cape area label, an in-person badge, a venue address, and an exact Google Maps directions URL.

Two low-risk meeting-detail quality defects were observed: the detail page displays the escaped entity `&amp;` in the meeting notes instead of `&`, even though the finder has entity-decoding coverage; and the venue/address text repeats `Rosebank, Cape Town, South Africa` after the complete address. These are meeting-data presentation defects suitable for a minimal formatting repair, not a redesign. The selected record’s meeting type is `Not specified`, which should remain unchanged unless the source owner supplies a verified classification.
