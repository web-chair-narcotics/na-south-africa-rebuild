# Uploaded Meeting Source Notes

## Authority and structure

The uploaded `meetings.csv` is a structured meeting export containing named columns for meeting identity, schedule, types, notes, online links, phone fields, location name, address, region, sub-region, contact fields, source URLs, last-updated timestamps, and legacy IDs. It appears to be the most complete machine-readable source supplied for reconciliation against the current site and staged meeting records.

The uploaded `4.25x11_day-region-grouped_2026-08-15_directory.pdf` is a human-readable directory grouped first by **day**, then by **region/area**, with meeting time, meeting name, venue/address lines, and right-edge markers that appear to indicate meeting attributes such as open or literature. The visible pages confirm that the directory is designed for newcomer-friendly browsing and day-based lookup.

## Confirmed examples from the uploaded directory

The PDF confirms grouped listings such as Sunday Johannesburg entries for **Sydenham - Sunday - 09:00**, **Sunninghill - Sunday - 15:30**, **Alexander - Sunday - 16:00**, **Senaone Soweto - Sunday 16:30**, and **Benmore - Sunday - 18:00**. It also confirms Monday Johannesburg, KwaZulu-Natal, Pretoria, and Western Cape groupings, including entries such as **Klerksdorp - Monday - 10:00**, **Senaone Soweto - Monday - 18:00**, **Kempton Park - Monday - 18:30**, **Florida - Monday - 18:30**, **Durban North Monday**, **Phoenix Monday**, **Monday Garsfontein Meeting**, and **Green Point JFT (F2F)**.

## Reconciliation use

The CSV will be used as the primary structured import and comparison source. The PDF will be used to verify public-facing directory grouping, naming, time presentation, and day/region ordering for the rebuilt finder and any printable directory output.

## Immediate follow-up work

The next reconciliation step is to compare the uploaded CSV against the already extracted current public meeting-detail corpus and the staged database records, then update any mismatched meeting names, addresses, notes, online links, region assignments, or publication decisions.
