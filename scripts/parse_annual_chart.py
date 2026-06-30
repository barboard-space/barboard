# -*- coding: utf-8 -*-
"""解析榜吧年终榜 Excel 的「总榜」sheet → data/annual/<year>.json（类 BBL 榜单）。
封面：iTunes Search API 构建期按「歌手 作品」查一次，存 600x600 URL（查不到留 null，前端 onerror 兜底）。
用法：python scripts/parse_annual_chart.py 2022 [--top 100] [--no-cover]
"""
import sys, os, json, time, re, urllib.parse, urllib.request

SRC = {
    "2022": r"D:\Genius\BarChart\吧榜文件\年终榜\2022吧年榜.xlsx",
}
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "annual")


def itunes_cover(artist, song, cache):
    key = (artist + "|" + song).lower()
    if key in cache:
        return cache[key]
    term = urllib.parse.quote((artist + " " + song)[:120])
    url = "https://itunes.apple.com/search?term=%s&entity=song&limit=1" % term
    art = None
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        d = json.load(urllib.request.urlopen(req, timeout=12))
        if d.get("results"):
            a = d["results"][0].get("artworkUrl100")
            if a:
                art = a.replace("100x100bb", "600x600bb")
    except Exception as e:
        sys.stderr.write("  ! cover fail %s - %s: %s\n" % (artist, song, e))
    cache[key] = art
    return art


def main():
    year = sys.argv[1] if len(sys.argv) > 1 else "2022"
    top = 100
    nocover = "--no-cover" in sys.argv
    if "--top" in sys.argv:
        top = int(sys.argv[sys.argv.index("--top") + 1])
    import openpyxl
    wb = openpyxl.load_workbook(SRC[year], read_only=True, data_only=True)
    ws = wb["总榜"]
    rows = ws.iter_rows(values_only=True)
    header = next(rows)
    # 定位列（排名/艺术家/作品/点数/助攻数）
    idx = {h: i for i, h in enumerate(header) if h}
    ci = {"rank": idx["排名"], "artist": idx["艺术家"], "song": idx["作品"],
          "pts": idx["点数"], "assist": idx.get("助攻数")}
    entries, cache = [], {}
    for row in rows:
        rk = row[ci["rank"]]
        if not isinstance(rk, (int, float)) or rk < 1:
            continue
        rk = int(rk)
        if rk > top:
            continue
        artist = str(row[ci["artist"]] or "").strip()
        song = str(row[ci["song"]] or "").strip()
        if not artist or not song:
            continue
        e = {"rank": rk, "artist": artist, "song": song,
             "points": round(float(row[ci["pts"]] or 0), 1),
             "assists": int(row[ci["assist"]]) if ci["assist"] is not None and row[ci["assist"]] is not None else None,
             "cover": None}
        if not nocover:
            e["cover"] = itunes_cover(artist, song, cache)
            time.sleep(0.4)  # iTunes 限速友好
            sys.stderr.write("  %3d. %s — %s  %s\n" % (rk, artist, song, "✓" if e["cover"] else "—"))
        entries.append(e)
    entries.sort(key=lambda x: x["rank"])
    out = {"year": int(year), "title": "%s 榜吧年终榜" % year, "count": len(entries), "entries": entries}
    os.makedirs(OUT_DIR, exist_ok=True)
    fp = os.path.join(OUT_DIR, year + ".json")
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    covered = sum(1 for e in entries if e["cover"])
    print("写出 %s | %d 条 | 封面命中 %d/%d" % (fp, len(entries), covered, len(entries)))


if __name__ == "__main__":
    main()
