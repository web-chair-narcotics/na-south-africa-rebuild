# Meeting Finder Live Verification

## Verified on the public preview

The populated public finder reports **307 verified meetings**. It presents full-text search along with filters for area, day, time, meeting type, and meeting format. The initial result set includes in-person, online, and hybrid-compatible records, with explicit **Show on map**, **Get directions**, and **Join online** actions where applicable.

The embedded map loaded successfully in the browser environment and displayed clustered markers for dense locations. The live map exposed clusters containing 59, 64, 155, 2, 12, 7, and 4 markers, plus individual markers. This confirms cluster behaviour against the imported national meeting corpus.

The first visible in-person result exposed a Google Maps directions URL using the precise stored coordinates in the `destination` parameter (`https://www.google.com/maps/dir/?api=1&destination=-26.3420167%2C28.375242&travelmode=driving`). This confirms the public direction action targets a specific mapped location rather than a generic city search.

The area selector was tested with **Johannesburg**. After the server-backed filter query settled, the finder narrowed from 307 national records to **136 verified Johannesburg meetings**, updated pagination from 31 to 14 pages, displayed Johannesburg-only result cards, and recalculated the clustered map markers for that filtered data set. The brief display of the prior result set immediately after selection was the intentional retained-data loading state; the settled response correctly applied the filter.

## Visual-capture note

The automated visual-capture environment displays the map fallback while the browser preview loads the actual Google Maps tiles and marker clusters. The browser preview is the applicable verification environment for the interactive third-party map service.
