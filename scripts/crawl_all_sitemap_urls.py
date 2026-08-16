from __future__ import annotations

import json
import re
from collections import Counter
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
from pathlib import Path

import requests
from bs4 import BeautifulSoup

ROOT = "https://na.org.za"
SITEMAP_INDEXES = [
    f"{ROOT}/sitemap_index.xml",
    f"{ROOT}/jhb/sitemap_index.xml",
    f"{ROOT}/pta/sitemap_index.xml",
    f"{ROOT}/wc/sitemap_index.xml",
    f"{ROOT}/kzn/sitemap_index.xml",
]
OUT = Path("/home/ubuntu/na-south-africa-rebuild")
HEADERS = {"User-Agent": "NA-South-Africa-Full-Parity-Crawler/1.0"}
TIMEOUT = (4, 10)


def sitemap_urls(url):
    response = requests.get(url, headers=HEADERS, timeout=TIMEOUT)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "xml")
    children = [x.get_text(strip=True) for x in soup.find_all("loc")]
    if any("sitemap" in x for x in children):
        urls = []
        for child in children:
            child_response = requests.get(child, headers=HEADERS, timeout=TIMEOUT)
            child_response.raise_for_status()
            child_soup = BeautifulSoup(child_response.text, "xml")
            urls.extend(x.get_text(strip=True) for x in child_soup.find_all("loc"))
        return urls
    return children


def fetch(url):
    result = {"url": url}
    try:
        response = requests.get(url, headers=HEADERS, timeout=TIMEOUT, allow_redirects=True)
        result.update({"status": response.status_code, "final_url": response.url, "content_type": response.headers.get("content-type", "")})
        if "text/html" in response.headers.get("content-type", ""):
            soup = BeautifulSoup(response.text, "html.parser")
            title = soup.title.get_text(" ", strip=True) if soup.title else ""
            canonical = soup.find("link", rel="canonical")
            result.update({"title": title, "canonical": canonical.get("href", "") if canonical else "", "h1_count": len(soup.find_all("h1")), "word_count": len(re.findall(r"\b\w+\b", soup.get_text(" ")))})
        else:
            result.update({"title": "", "canonical": "", "h1_count": None, "word_count": None})
    except Exception as exc:
        result.update({"status": None, "final_url": "", "content_type": "", "title": "", "canonical": "", "h1_count": None, "word_count": None, "error": repr(exc)})
    return result


def main():
    errors = {}
    urls = set()
    for index in SITEMAP_INDEXES:
        try:
            urls.update(sitemap_urls(index))
        except Exception as exc:
            errors[index] = repr(exc)
    urls = sorted(urls)
    results = []
    with ThreadPoolExecutor(max_workers=50) as pool:
        futures = {pool.submit(fetch, url): url for url in urls}
        for count, future in enumerate(as_completed(futures), 1):
            results.append(future.result())
            if count % 100 == 0:
                (OUT / "FULL_SITEMAP_CRAWL.progress.json").write_text(json.dumps({"completed": count, "total": len(urls), "results": results}, ensure_ascii=False), encoding="utf-8")
    results.sort(key=lambda x: x["url"])
    generated = datetime.now(timezone.utc).isoformat()
    report = {"generatedAt": generated, "sitemapIndexes": SITEMAP_INDEXES, "urlCount": len(urls), "sitemapErrors": errors, "results": results}
    (OUT / "FULL_SITEMAP_CRAWL.json").write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    counts = Counter(str(r.get("status")) for r in results)
    lines = ["# Full live sitemap crawl", "", f"Generated: {generated}", f"URLs crawled: {len(urls)}", "", "| Status | Count |", "|---:|---:|"]
    lines.extend(f"| {status} | {count} |" for status, count in sorted(counts.items()))
    lines += ["", "## Non-success or request-error URLs", "", "| URL | Status | Final URL | Error |", "|---|---:|---|---|"]
    for r in results:
        if r.get("status") != 200:
            lines.append(f"| {r['url']} | {r.get('status')} | {r.get('final_url','')} | {r.get('error','')} |")
    (OUT / "FULL_SITEMAP_CRAWL.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(json.dumps({"urlCount": len(urls), "statusCounts": dict(counts), "non200": sum(1 for r in results if r.get('status') != 200), "sitemapErrors": errors}, indent=2))


if __name__ == "__main__":
    main()
