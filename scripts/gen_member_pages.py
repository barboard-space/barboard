#!/usr/bin/env python3
"""Generate member/N.html stub pages from data/members/members.csv.

同时聚合 Barvision 历届赛果（data/barvision/barvision-*/*.json）到每位大妈：
  - 注入各 member/N.html 的 MEMBER_DATA.barvision（个人主页「吧视」板块）
  - 输出 data/barvision/member-bv-index.json（供 member.html 筛选/logo 徽章）
"""
import csv
import glob
import json
import os

# 活跃判定：最近参赛年份 ≥ 此值 → active（member.html 用实心 logo，否则空心）
BV_ACTIVE_SINCE_YEAR = 2024


def load_bv_editions(base):
    eds = []
    pat = os.path.join(base, "data", "barvision", "barvision-*", "*.json")
    for p in sorted(glob.glob(pat)):
        with open(p, encoding="utf-8") as f:
            eds.append(json.load(f))
    return eds


def aggregate_barvision(eds):
    """{规范昵称: {overview, entries[]}}（含 12 分次数、混淆曲计数）"""
    per = {}
    for ed in eds:
        for m in ed.get("matches", []):
            match = (m.get("match") or "").strip()
            voters = m.get("votes", {}).get("voters", [])
            for e in m.get("entries", []):
                nick = e.get("member")
                if not nick:
                    continue
                twelve = sum(1 for v in voters if v.get("points", {}).get(nick) == 12)
                rec = {
                    "year": ed["year"], "edition_no": ed["edition_no"],
                    "edition_name": ed["edition_name"], "version": ed["version"],
                    "series": match if match else str(ed["edition_no"]),  # 综合赛=届次号
                    "rank": e.get("rank"), "song": e.get("song"), "artist": e.get("artist"),
                    "language": e.get("language"),
                    "jury": e.get("jury_vote"), "tele": e.get("tele_vote"), "total": e.get("score"),
                    "twelve": twelve, "is_shadow": bool(e.get("is_shadow")),
                }
                # 联合选送「A/B」：该记录计入两人各自的吧视
                for target in ([n.strip() for n in nick.split("/")] if "/" in nick else [nick]):
                    per.setdefault(target, []).append(rec)
    out = {}
    for nick, entries in per.items():
        entries.sort(key=lambda x: (x["edition_no"], x["series"]))
        official = [x for x in entries if not x["is_shadow"]]
        shadow = [x for x in entries if x["is_shadow"]]
        ranks = [x["rank"] for x in official if x["rank"]]
        out[nick] = {
            "overview": {
                "best": (min(ranks) if ranks else None),
                "top1": sum(1 for x in official if x["rank"] == 1),
                "top1_shadow": sum(1 for x in shadow if x["rank"] == 1),
                "top3": sum(1 for x in official if x["rank"] and x["rank"] <= 3),
                "top3_shadow": sum(1 for x in shadow if x["rank"] and x["rank"] <= 3),
                "entries": len(official),
                "shadow": len(shadow),
                "twelve": sum(x["twelve"] for x in official),  # 混淆曲的 12 分不计入正式统计
                "debut": min(x["edition_no"] for x in entries),
                "active_in": max(x["edition_no"] for x in entries),
                "active": max(x["year"] for x in entries) >= BV_ACTIVE_SINCE_YEAR,
            },
            "entries": entries,
        }
    return out

TEMPLATE = """\
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <script>if(sessionStorage.getItem('barboard_dev')!=='1')document.documentElement.style.visibility='hidden'</script>
  <title>Barboard 成员</title>
  <meta name="description" content="Barboard 成员主页" />
  <link rel="icon" type="image/png" href="../assets/images/logo_center.png" />
  <link rel="stylesheet" href="../fonts.css" />
  <link rel="stylesheet" href="../style.css" />
</head>
<body>
  <div id="site-nav"></div>
  <div id="mp-root"></div>
  <div id="site-footer"></div>
  <script>var MEMBER_DATA = PLACEHOLDER;</script>
  <script src="../scripts/member-render.js"></script>
  <script src="../scripts/nav.js"></script>
</body>
</html>
"""


def parse_groups(team):
    groups = []
    if "BarboardLab" in team:
        groups.append("bbl")
    if "村摇欧共体" in team:
        groups.append("cun")
    if "Indienation" in team:
        groups.append("indie")
    return groups


def parse_bilibili_id(raw):
    if not raw:
        return None
    first = raw.split(",")[0].strip()
    return first if first else None


def main():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    csv_path = os.path.join(base, "data", "members", "members.csv")
    member_dir = os.path.join(base, "member")
    os.makedirs(member_dir, exist_ok=True)

    bv_by_nick = aggregate_barvision(load_bv_editions(base))
    bv_index = {}  # space_id -> {editions, active, count, best}

    space_ids = []

    with open(csv_path, encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader)  # skip header
        for row in reader:
            if len(row) < 2:
                continue
            space_id_str = row[0].strip()
            nickname = row[1].strip()
            if not space_id_str or not nickname:
                continue

            space_id = int(space_id_str)
            handle = row[2].strip() if len(row) > 2 else ""
            team = row[3].strip() if len(row) > 3 else ""
            bilibili_raw = row[4].strip() if len(row) > 4 else ""
            chart_raw = row[6].strip() if len(row) > 6 else ""

            groups = parse_groups(team)
            bilibili_id = parse_bilibili_id(bilibili_raw)
            try:
                chart_id = str(int(chart_raw)) if chart_raw else None
            except ValueError:
                chart_id = None

            data = {"nickname": nickname, "groups": groups}
            if handle:
                data["handle"] = handle
            if bilibili_id:
                data["bilibili_id"] = bilibili_id
            if chart_id:
                data["chart_id"] = chart_id

            bv = bv_by_nick.get(nickname)
            if bv:
                data["barvision"] = bv
                ov = bv["overview"]
                bv_index[str(space_id)] = {
                    "editions": sorted(set(e["edition_no"] for e in bv["entries"])),
                    "active": ov["active"], "count": ov["entries"] + ov["shadow"],
                    "best": ov["best"], "active_in": ov["active_in"],
                }

            data_json = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
            html = TEMPLATE.replace("PLACEHOLDER", data_json)

            out_path = os.path.join(member_dir, f"{space_id}.html")
            with open(out_path, "w", encoding="utf-8") as out:
                out.write(html)

            space_ids.append(space_id)
            print(f"  {space_id}.html — {nickname}")

    # 「匿名」伪成员（混淆曲赛后无人认领）→ member/0.html（大名弱化、仅列歌曲）
    unclaimed = bv_by_nick.get("匿名")
    if unclaimed:
        u_data = {"nickname": "匿名", "unclaimed": True, "barvision": unclaimed}
        u_json = json.dumps(u_data, ensure_ascii=False, separators=(",", ":"))
        with open(os.path.join(member_dir, "0.html"), "w", encoding="utf-8") as out:
            out.write(TEMPLATE.replace("PLACEHOLDER", u_json))
        ov = unclaimed["overview"]
        bv_index["0"] = {
            "editions": sorted(set(e["edition_no"] for e in unclaimed["entries"])),
            "active": False, "count": ov["shadow"], "best": None,
            "active_in": ov["active_in"], "unclaimed": True,
        }
        print(f"  0.html — 匿名（伪成员，{ov['shadow']} 首混淆曲）")

    idx_path = os.path.join(base, "data", "barvision", "member-bv-index.json")
    with open(idx_path, "w", encoding="utf-8") as f:
        json.dump(bv_index, f, ensure_ascii=False, indent=1)

    print(f"\nTotal: {len(space_ids)} files")
    print(f"Barvision 参赛大妈: {len(bv_index)}  → member-bv-index.json")
    print("\nBUILT_PAGES:")
    print("var BUILT_PAGES = new Set(" + json.dumps(sorted(space_ids)) + ");")


if __name__ == "__main__":
    main()
