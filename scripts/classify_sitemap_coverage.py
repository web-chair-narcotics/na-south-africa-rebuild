from __future__ import annotations

import csv
import json
from collections import Counter
from pathlib import Path
from urllib.parse import urlparse

ROOT = Path("/home/ubuntu/na-south-africa-rebuild")


def classify_fallback(url: str) -> str:
    path = urlparse(url).path.lower()
    if "/wp-content/" in path or path.endswith((".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx", ".xls", ".xlsx")):
        return "media_or_document"
    if "/category/" in path or "/tag/" in path or "/author/" in path or "page/" in path:
        return "taxonomy_or_archive"
    if "/events/" in path or "/event/" in path:
        return "event"
    if "/shop/" in path or "/product/" in path or "/cart/" in path or "/checkout/" in path or "/my-account/" in path:
        return "commerce_or_account"
    if "/blog/locations/" in path or "/locations/" in path:
        return "location_unmatched"
    if "/blog/meetings/" in path or "/meetings/" in path:
        return "meeting_unmatched"
    return "other_public_url"


def main() -> None:
    parity = json.loads((ROOT / "LIVE_PARITY_AUDIT_REPORT.json").read_text(encoding="utf-8"))
    rest = json.loads((ROOT / "WORDPRESS_REST_CONTENT_CRAWL.json").read_text(encoding="utf-8"))
    sitemap_urls = {url for urls in parity.get("sitemapInventory", {}).values() for url in urls}
    rest_urls = {row["source_url"] for row in rest.get("rows", []) if row.get("source_url")}
    meeting_urls = {row.get("url") for row in parity.get("liveUniqueRows", []) if row.get("url")}
    location_urls = {row.get("location_url") for row in parity.get("liveUniqueRows", []) if row.get("location_url")}
    rows = []
    for url in sorted(sitemap_urls):
        if url in rest_urls:
            coverage = "wordpress_rest_page_or_post"
        elif url in meeting_urls:
            coverage = "canonical_tsml_meeting"
        elif url in location_urls:
            coverage = "canonical_tsml_location"
        else:
            coverage = classify_fallback(url)
        rows.append({"url": url, "coverage": coverage})
    counts = Counter(row["coverage"] for row in rows)
    output = {"total_urls": len(rows), "coverage_counts": dict(sorted(counts.items())), "rows": rows}
    (ROOT / "SITEMAP_COVERAGE_CLASSIFICATION.json").write_text(json.dumps(output, indent=2), encoding="utf-8")
    with (ROOT / "SITEMAP_COVERAGE_CLASSIFICATION.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["url", "coverage"])
        writer.writeheader()
        writer.writerows(rows)
    markdown = [
        "# Sitemap coverage classification",
        "",
        "| Coverage source or route class | URLs |",
        "|---|---:|",
    ]
    markdown.extend(f"| {coverage.replace('_', ' ')} | {count} |" for coverage, count in sorted(counts.items()))
    markdown += ["", f"All {len(rows)} sitemap URLs are retained in `SITEMAP_COVERAGE_CLASSIFICATION.csv` and `.json`. REST page/post records are source-body captured; canonical TSML meeting/location records are captured through the live feed; remaining archive, event, commerce/account, media, and other public routes are explicitly classified rather than omitted.", ""]
    (ROOT / "SITEMAP_COVERAGE_CLASSIFICATION.md").write_text("\n".join(markdown), encoding="utf-8")
    print(json.dumps({"total_urls": len(rows), "coverage_counts": dict(sorted(counts.items()))}, indent=2))


if __name__ == "__main__":
    main()
