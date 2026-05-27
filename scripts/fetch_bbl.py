import json
import re
import sys
import requests
from datetime import datetime, timezone

API_URL = "https://6api.musictrack.cn/api/charts/3045"
OUTPUT_FILE = "data/bbl-latest.json"

LABEL_MAP = {"3": "peak", "4": "re-entry", "6": "new"}

def parse_issue(summary):
    m = re.search(r'Vol\.\s*(\d+)', summary or '')
    return int(m.group(1)) if m else None

def parse_date(date_str):
    try:
        return datetime.strptime(str(date_str), "%Y%m%d").strftime("%Y-%m-%d")
    except Exception:
        return str(date_str)

def main():
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
        "Accept": "application/json, text/plain, */*",
        "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding": "gzip, deflate, br",
        "Referer": "https://musictrack.cn/chart/3045/",
        "Origin": "https://musictrack.cn",
        "sec-ch-ua": '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
    }

    try:
        resp = requests.get(API_URL, headers=headers, timeout=30)
        if resp.status_code == 403:
            print("API returned 403 (anti-crawler). Keeping existing data.", file=sys.stderr)
            sys.exit(0)
        resp.raise_for_status()
        data = resp.json()
    except SystemExit:
        raise
    except Exception as e:
        print(f"Error fetching API: {e}", file=sys.stderr)
        sys.exit(0)

    record  = data.get("record", {})
    details = data.get("details", [])

    issue   = parse_issue(record.get("summary", ""))
    date    = parse_date(record.get("date", ""))
    bv      = record.get("video", "")

    tracks = []
    for item in details:
        code   = str(item.get("label") or "0")
        label  = LABEL_MAP.get(code, None)
        change = str(item.get("change") or "0")
        pts = item.get("point")
        tracks.append({
            "rank":   item["rank"],
            "title":  item["item_name"],
            "artist": item["artists"],
            "label":  label,
            "change": change,
            "peak":   item.get("peak"),
            "weeks":  item.get("weeks"),
            "points": round(pts) if pts is not None else None,
            "cover":  item.get("cover", ""),
        })

    output = {
        "issue":      issue,
        "date":       date,
        "bilibili":   bv,
        "fetched_at": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "tracks":     tracks,
    }

    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(output, f, ensure_ascii=False, indent=2)

    print(f"Saved BBL #{issue} ({date}), {len(tracks)} tracks")

if __name__ == "__main__":
    main()
