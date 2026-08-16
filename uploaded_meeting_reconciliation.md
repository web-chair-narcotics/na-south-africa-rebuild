# Uploaded Meeting Reconciliation

The five WordPress exports contain **669** TSML meeting items, the CSV snapshots contain **1,278** rows in total, and the four JSON text exports contain **294** records.

Across the combined source IDs there are **620** distinct meeting IDs. **49** IDs have duplicate regional export appearances or name/region variants and require source-precedence handling; these are not automatically treated as errors.

CSV-only IDs: **0**. WordPress-only IDs: **37**. JSON-only IDs: **0**.

The reconciliation preserves the most recent public source record while retaining historical source IDs and source URLs. It does not expose WordPress edit URLs, author credentials, or private metadata in the rebuilt site.
