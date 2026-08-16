from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from urllib.parse import urlsplit, urlunsplit


ROOT = Path("/home/ubuntu/na-south-africa-rebuild")


def normalize(url: str) -> str:
    parsed = urlsplit(url.strip())
    return urlunsplit((parsed.scheme.lower(), parsed.netloc.lower(), parsed.path.rstrip("/") or "/", "", ""))


def main() -> None:
    rest = json.loads((ROOT / "WORDPRESS_REST_CONTENT_CRAWL.json").read_text(encoding="utf-8"))
    with (ROOT / "final_url_migration_register.csv").open(encoding="utf-8") as handle:
        register = list(csv.DictReader(handle))
    register_by_url = {normalize(row["legacy_url"]): row for row in register if row.get("legacy_url")}
    rows = []
    for source in rest["rows"]:
        mapped = register_by_url.get(normalize(source["source_url"]))
        rows.append({
            "site": source["site"],
            "endpoint": source["endpoint"],
            "source_url": source["source_url"],
            "title": source["title"],
            "register_match": bool(mapped),
            "final_destination": mapped.get("final_destination", "") if mapped else "",
            "decision": mapped.get("decision", "") if mapped else "",
        })
    counts = Counter("mapped" if row["register_match"] else "unmapped" for row in rows)
    unmapped = [row for row in rows if not row["register_match"]]
    output = {
        "summary": {
            "rest_rows": len(rows),
            "mapped": counts["mapped"],
            "unmapped": counts["unmapped"],
            "by_endpoint": dict(Counter(row["endpoint"] for row in rows)),
        },
        "rows": rows,
        "unmapped": unmapped,
    }
    (ROOT / "REST_CONTENT_MIGRATION_COVERAGE.json").write_text(json.dumps(output, indent=2), encoding="utf-8")
    columns = ["site", "endpoint", "source_url", "title", "register_match", "final_destination", "decision"]
    with (ROOT / "REST_CONTENT_MIGRATION_COVERAGE.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    markdown = [
        "# REST content migration coverage",
        "",
        "| Measure | Count |",
        "|---|---:|",
        f"| Live REST content rows | {len(rows)} |",
        f"| Rows with migration-register outcome | {counts['mapped']} |",
        f"| Rows without migration-register outcome | {counts['unmapped']} |",
        "",
        "## Unmapped live REST rows",
        "",
        *( [f"- {row['endpoint']}: [{row['title'] or '(untitled)'}]({row['source_url']})" for row in unmapped] if unmapped else ["None."] ),
        "",
        "All rows, including their migration destination and decision where present, are saved in `REST_CONTENT_MIGRATION_COVERAGE.csv` and `.json`.",
    ]
    (ROOT / "REST_CONTENT_MIGRATION_COVERAGE.md").write_text("\n".join(markdown) + "\n", encoding="utf-8")
    print(json.dumps(output["summary"], indent=2))


if __name__ == "__main__":
    main()
