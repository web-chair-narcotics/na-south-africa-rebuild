from __future__ import annotations

import re
from pathlib import Path
from urllib.parse import urljoin

import requests
from bs4 import BeautifulSoup

BASE = "https://nasarebuild-eqxm563b.manus.space"
PAGES = {
    "in_person": f"{BASE}/meetings?meetingFormat=in_person",
    "online": f"{BASE}/meetings?meetingFormat=online",
}

session = requests.Session()
session.headers.update({"User-Agent": "NA South Africa meeting audit/1.0"})

for label, url in PAGES.items():
    response = session.get(url, timeout=20)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, "html.parser")
    links = []
    for anchor in soup.select("a[href]"):
        href = urljoin(BASE, anchor["href"])
        text = " ".join(anchor.get_text(" ", strip=True).split())
        if href.startswith(("https://www.google.com/maps/dir/", "https://zoom.us/", "https://us06web.zoom.us/", "http://usp04web.zoom.us/", "tel:")):
            links.append((text, href))
    print(f"[{label}] page_status={response.status_code} link_count={len(links)}")
    for text, href in links[:20]:
        if href.startswith("tel:"):
            print(f"  {text}: {href} (telephone URI not fetched)")
            continue
        try:
            checked = session.get(href, allow_redirects=True, timeout=20)
            print(f"  {text}: {href} -> {checked.status_code} {checked.url}")
        except requests.RequestException as exc:
            print(f"  {text}: {href} -> ERROR {exc.__class__.__name__}")

for attempt in range(1, 4):
    response = session.get(PAGES["in_person"], timeout=20)
    body = response.text
    map_present = "maps.googleapis.com" in body or "Meeting map" in body
    print(f"[map-load-{attempt}] finder_status={response.status_code} map_reference={map_present}")
