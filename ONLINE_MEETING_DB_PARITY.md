# Online meeting database parity audit

Generated: 2026-08-16T07:40:20.656Z

| Measure | Count |
|---|---:|
| Current live online fingerprints | 52 |
| Published Manus online records | 51 |
| Live rows with conference URL | 49 |
| Live rows with contact fallback | 3 |
| Manus rows with join URL | 49 |
| Manus rows with contact fallback | 2 |
| Live-only keys | 0 |
| Manus-only keys | 0 |

## Live-only source keys

None.

## Manus-only keys

None.

Physical venue, address, coordinates, map, and directions fields are intentionally excluded from online-only records. The comparison keys are normalized meeting name, first schedule day, and start time.
