"""Pull CBC's public Google Calendar and write a normalized events.json.

Read-only on the Google side. Writes only the local JSON file.
"""

from __future__ import annotations

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

API_KEY = os.environ.get("GOOGLE_CAL_API_KEY", "").strip()
CAL_ID = os.environ.get(
    "GOOGLE_CAL_ID",
    "10e4a4c22c3fe6511ddf58df1f8265919d883b8fe311d12266cd550089657535@group.calendar.google.com",
).strip()

OUTPUT = Path(__file__).resolve().parent.parent / "data" / "events.json"

LOOKBACK_DAYS = 60
LOOKAHEAD_DAYS = 365


def infer_category(title: str) -> str:
    t = (title or "").lower()
    if re.search(r"(worship|service|sunday|mass|communion|baptism|easter|christmas)", t):
        return "worship"
    if re.search(r"(study|class|seminar|reading|bible)", t):
        return "study"
    if re.search(r"(choir|music|band|praise|concert|rehearsal)", t):
        return "music"
    if re.search(r"(youth|kids|children|teen|student|camp)", t):
        return "youth"
    if re.search(r"(outreach|food|drive|mission|volunteer|serve|community|donation)", t):
        return "outreach"
    return "other"


def fetch_events() -> list[dict]:
    if not API_KEY:
        sys.exit("GOOGLE_CAL_API_KEY env var is empty — set the GitHub Secret.")

    now = datetime.now(timezone.utc)
    time_min = (now - timedelta(days=LOOKBACK_DAYS)).strftime("%Y-%m-%dT%H:%M:%SZ")
    time_max = (now + timedelta(days=LOOKAHEAD_DAYS)).strftime("%Y-%m-%dT%H:%M:%SZ")

    base = f"https://www.googleapis.com/calendar/v3/calendars/{urllib.parse.quote(CAL_ID, safe='')}/events"
    params = {
        "key": API_KEY,
        "singleEvents": "true",
        "orderBy": "startTime",
        "timeMin": time_min,
        "timeMax": time_max,
        "maxResults": "500",
    }

    items: list[dict] = []
    page_token: str | None = None
    while True:
        if page_token:
            params["pageToken"] = page_token
        url = f"{base}?{urllib.parse.urlencode(params)}"
        req = urllib.request.Request(url, headers={"User-Agent": "cbc-sync/1.0"})
        with urllib.request.urlopen(req, timeout=30) as r:
            data = json.loads(r.read().decode("utf-8"))
        items.extend(data.get("items", []))
        page_token = data.get("nextPageToken")
        if not page_token:
            break

    return items


def normalize(items: list[dict]) -> list[dict]:
    out = []
    for it in items:
        start = it.get("start", {})
        end = it.get("end", {})
        start_iso = start.get("dateTime") or (start.get("date", "") + "T00:00:00")
        end_iso = end.get("dateTime") or (end.get("date", "") + "T00:00:00")
        if not start_iso or not end_iso:
            continue
        title = it.get("summary", "Untitled")
        out.append({
            "id": it.get("id"),
            "title": title,
            "category": infer_category(title),
            "start": start_iso,
            "end": end_iso,
            "location": it.get("location", "") or "",
            "description": it.get("description", "") or "",
            "htmlLink": it.get("htmlLink", "") or "",
        })
    return out


def main() -> None:
    items = fetch_events()
    events = normalize(items)
    payload = {
        "updated": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "count": len(events),
        "events": events,
    }
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"Wrote {len(events)} events → {OUTPUT}")


if __name__ == "__main__":
    main()
