import json
import re
import sys
import requests
from datetime import datetime, timedelta, timezone

API_URL = "https://6api.musictrack.cn/api/charts/3045"
OUTPUT_FILE  = "data/bbl-latest.json"
TICKER_FILE  = "data/ticker.json"
UPDATES_FILE = "data/updates.json"

LABEL_MAP = {"3": "peak", "4": "re-entry", "6": "new"}

def parse_issue(summary):
    m = re.search(r'Vol\.\s*(\d+)', summary or '')
    return int(m.group(1)) if m else None

def parse_date(date_str):
    try:
        return datetime.strptime(str(date_str), "%Y%m%d").strftime("%Y-%m-%d")
    except Exception:
        return str(date_str)

def fmt_week_range_cn(date_str):
    start = datetime.strptime(date_str, "%Y-%m-%d")
    end = start + timedelta(days=6)
    return f"{start.year}年{start.month}月{start.day}日—{end.month}月{end.day}日"

def update_ticker(issue, artist, title):
    try:
        with open(TICKER_FILE, "r", encoding="utf-8") as f:
            items = json.load(f)
    except Exception:
        items = []
    bbl_text = f"BarboardLab 第 {issue} 期已更新 · 本周冠军：{artist} — {title}"
    # 移除旧 BBL 条目，将新条目置顶（最新在左）
    items = [t for t in items if not t.startswith("BarboardLab 第")]
    items.insert(0, bbl_text)
    with open(TICKER_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

def update_updates(issue, date, artist, title):
    try:
        with open(UPDATES_FILE, "r", encoding="utf-8") as f:
            items = json.load(f)
    except Exception:
        items = []
    bbl_entry = {
        "date":  date,
        "title": f"BarboardLab 单曲合榜第 {issue} 期已更新",
        "desc":  f"本周榜单统计周期为{fmt_week_range_cn(date)}。本周冠军为 {artist} — {title}。"
    }
    # 移除旧 BBL 条目，加入新条目，按日期从新到旧排序
    items = [u for u in items if not u.get("title", "").startswith("BarboardLab 单曲合榜第")]
    items.append(bbl_entry)
    items.sort(key=lambda u: u.get("date", ""), reverse=True)
    with open(UPDATES_FILE, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)

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

    if issue and tracks:
        top = tracks[0]
        update_ticker(issue, top["artist"], top["title"])
        update_updates(issue, date, top["artist"], top["title"])
        print(f"Updated ticker.json and updates.json with BBL #{issue}")

if __name__ == "__main__":
    main()
