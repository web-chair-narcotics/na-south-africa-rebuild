from __future__ import annotations

import csv
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = Path("/home/ubuntu/na-south-africa-rebuild")
SITES = {
    "region": "https://na.org.za",
    "johannesburg": "https://na.org.za/jhb",
    "pretoria": "https://na.org.za/pta",
    "western-cape": "https://na.org.za/wc",
    "kwazulu-natal": "https://na.org.za/kzn",
}
ENDPOINTS = ("pages", "posts", "tribe_events", "tribe_venue", "tribe_organizer")
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": "NA-South-Africa-REST-Content-Audit/1.0"})


def text_length(html: str) -> int:
    return len(re.sub(r"\s+", " ", BeautifulSoup(html or "", "html.parser").get_text(" ", strip=True)))


def fetch_collection(site: str, endpoint: str) -> list[dict]:
    url = f"{site}/wp-json/wp/v2/{endpoint}"
    response = SESSION.get(url, params={"per_page": 100, "page": 1, "status": "publish"}, timeout=45)
    response.raise_for_status()
    pages = int(response.headers.get("X-WP-TotalPages", "1"))
    records = list(response.json())
    for page in range(2, pages + 1):
        response = SESSION.get(url, params={"per_page": 100, "page": page, "status": "publish"}, timeout=45)
        response.raise_for_status()
        records.extend(response.json())
    return records


def main() -> None:
    generated = datetime.now(timezone.utc).isoformat()
    rows: list[dict] = []
    errors: dict[str, str] = {}
    for site_name, site_url in SITES.items():
        for endpoint in ENDPOINTS:
            try:
                for record in fetch_collection(site_url, endpoint):
                    content = record.get("content", {}).get("rendered", "")
                    excerpt = record.get("excerpt", {}).get("rendered", "")
                    rows.append({
                        "site": site_name,
                        "endpoint": endpoint,
                        "id": record.get("id"),
                        "status": record.get("status"),
                        "slug": record.get("slug"),
                        "source_url": record.get("link"),
                        "title": BeautifulSoup(record.get("title", {}).get("rendered", ""), "html.parser").get_text(" ", strip=True),
                        "modified": record.get("modified_gmt") or record.get("modified"),
                        "content_words": text_length(content),
                        "excerpt_words": text_length(excerpt),
                        "has_body": bool(text_length(content)),
                    })
            except Exception as exc:
                errors[f"{site_name}:{endpoint}"] = repr(exc)

    sitemap = json.loads((ROOT / "LIVE_PARITY_AUDIT_REPORT.json").read_text(encoding="utf-8"))
    sitemap_urls = set(sitemap.get("sitemapInventory", {}).get("region", []))
    for urls in sitemap.get("sitemapInventory", {}).values():
        sitemap_urls.update(urls)
    rest_urls = {row["source_url"] for row in rows if row["source_url"]}
    sitemap_rest_urls = rest_urls & sitemap_urls
    unresolved_sitemap_urls = sorted(sitemap_urls - rest_urls)
    output = {
        "generatedAt": generated,
        "sites": SITES,
        "errors": errors,
        "rows": rows,
        "summary": {
            "rest_content_rows": len(rows),
            "rows_by_site": dict(Counter(row["site"] for row in rows)),
            "rows_by_endpoint": dict(Counter(row["endpoint"] for row in rows)),
            "rows_with_body": sum(1 for row in rows if row["has_body"]),
            "sitemap_total_urls": len(sitemap_urls),
            "sitemap_urls_covered_by_rest": len(sitemap_rest_urls),
            "sitemap_urls_unresolved_by_rest": len(unresolved_sitemap_urls),
        },
        "unresolved_sitemap_urls": unresolved_sitemap_urls,
    }
    (ROOT / "WORDPRESS_REST_CONTENT_CRAWL.json").write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
    columns = ["site", "endpoint", "id", "status", "slug", "source_url", "title", "modified", "content_words", "excerpt_words", "has_body"]
    with (ROOT / "WORDPRESS_REST_CONTENT_CRAWL.csv").open("w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)
    summary = output["summary"]
    markdown = [
        "# WordPress REST content crawl",
        "",
        f"Generated: {generated}",
        "",
        "| Measure | Count |",
        "|---|---:|",
        f"| Public REST pages/posts returned | {summary['rest_content_rows']} |",
        f"| Records with readable body content | {summary['rows_with_body']} |",
        f"| Sitemap URLs | {summary['sitemap_total_urls']} |",
        f"| Sitemap URLs represented by REST page/post links | {summary['sitemap_urls_covered_by_rest']} |",
        f"| Sitemap URLs outside REST page/post collections | {summary['sitemap_urls_unresolved_by_rest']} |",
        "",
        "## REST content rows by site",
        "",
        "| Site | Rows |",
        "|---|---:|",
    ]
    markdown.extend(f"| {site} | {count} |" for site, count in sorted(summary["rows_by_site"].items()))
    markdown += ["", "## REST content rows by collection", "", "| Collection | Rows |", "|---|---:|"]
    markdown.extend(f"| {endpoint} | {count} |" for endpoint, count in sorted(summary["rows_by_endpoint"].items()))
    markdown += ["", "## Interpretation", "", "This crawl replaces the earlier blocked page-body approach for public WordPress pages and posts. Remaining sitemap URLs outside these REST collections are retained for classification; they include meeting/location endpoints already covered by the canonical TSML feeds, category/archive routes, media, and other non-page/post resources. The complete row-level record is `WORDPRESS_REST_CONTENT_CRAWL.csv` and `WORDPRESS_REST_CONTENT_CRAWL.json`.", "", "## Errors", ""]
    markdown.extend(f"- `{key}`: {value}" for key, value in errors.items()) if errors else markdown.append("None.")
    (ROOT / "WORDPRESS_REST_CONTENT_CRAWL.md").write_text("\n".join(markdown) + "\n", encoding="utf-8")
    print(json.dumps(summary, indent=2))


if __name__ == "__main__":
    main()
