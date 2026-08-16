#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-http://127.0.0.1:3000}"
out="/home/ubuntu/na-south-africa-rebuild/PRIMARY_ROUTE_LINK_CHECK.md"
paths=(
  "/"
  "/about"
  "/recovery"
  "/literature"
  "/news"
  "/areas"
  "/contact"
  "/areas/south-africa-region"
  "/areas/johannesburg"
  "/areas/cape-town"
  "/areas/pretoria"
  "/areas/kwazulu-natal"
  "/meetings?meetingFormat=in_person"
  "/meetings?meetingFormat=online"
  "/wc/in-person-meetings/"
  "/wc/online-meetings/"
  "/meetings/2"
  "/admin"
)

{
  echo "# Primary public route link check"
  echo
  echo "| Path | HTTP status | Result |"
  echo "|---|---:|---|"
  for route in "${paths[@]}"; do
    status="$(curl --silent --show-error --location --max-time 20 --output /dev/null --write-out '%{http_code}' "${base_url}${route}")"
    if [[ "$status" =~ ^2|^3 ]]; then result="Pass"; else result="Fail"; fi
    echo "| \`${route}\` | ${status} | ${result} |"
  done
} > "$out"

cat "$out"
