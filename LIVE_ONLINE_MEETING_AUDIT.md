# Live online meeting audit

The fresh canonical feed pull contains **52** online meeting fingerprints across the Region and four Area feeds. The feed-level online category is treated separately from physical venues.

| Online access state | Live-source records |
|---|---:|
| Verified join URL present | 49 |
| Contact fallback present without join URL | 3 |
| No join URL or contact fallback in the live feed | 0 |

Every row, including source feed, meeting URL, schedule, and any supplied online access fields, is retained in `LIVE_ONLINE_MEETING_AUDIT.csv`. Physical address, venue, map, and directions fields are deliberately excluded from this online-only audit export.
