# Uploaded CSV Application Report

Applied the uploaded structured source fields to **328** meeting records. **3** records were still draft after current-site source QA; **3** of those were published after their uploaded address was geocoded through Google Maps.

The importer preserves the complete address in the meeting street-address field for exact Google Maps directions, preserves the venue/location separately, applies CSV notes and location notes, and records its source in each meeting’s audit evidence. It does not alter archived records or overwrite a source-QA result without an authoritative uploaded CSV value.
