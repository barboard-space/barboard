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
# 观众分(tele)自此年起改为 20 票制（非 1-12 分），不计入「广义 12 分」均分；此前 jury/tele 均为 1-12 制
BV_TELE_SINCE_YEAR = 2024


def load_bv_editions(base):
    eds = []
    pat = os.path.join(base, "data", "barvision", "barvision-*", "*.json")
    for p in sorted(glob.glob(pat)):
        with open(p, encoding="utf-8") as f:
            eds.append(json.load(f))
    return eds


def is_annual_ed(matches):
    """2023+ 年度制：两轮半决赛 + 决赛"""
    codes = {m.get("match") for m in matches}
    return {"SF1", "SF2", "GF"} <= codes


def _emit_bv(per, ed, m, e, series, rank, final=None):
    """把一条 entry 聚合进 per（含 12 分次数、合报拆分、匿名归并）。
    final：年度制(SF1/SF2/GF)标记是否进决赛（True 决赛曲 / False 半决赛淘汰曲）；旧届为 None 不写。"""
    nick = e.get("member")
    if not nick:
        return
    voters = m.get("votes", {}).get("voters", [])
    # 12 分次数：九届(max 模式)=投票人最高正式曲 v.top；其余=points==12(eid 键/一二届昵称键)。
    # 2024+ 决赛观众为 20 票制(tele_mode='votes')——观众不设 12 分，仅评委计入。
    vote_mode = m.get("tele_mode") == "votes"
    if any(v.get("top") is not None for v in voters):
        twelve = sum(1 for v in voters if v.get("top") == e.get("eid"))
    else:
        _pk = str(e["eid"]) if e.get("eid") is not None else nick
        twelve = sum(1 for v in voters
                     if not (vote_mode and v.get("type") == "tele")
                     and v.get("points", {}).get(_pk) == 12)
    rec = {
        "year": ed["year"], "edition_no": ed["edition_no"],
        "edition_name": ed["edition_name"], "version": ed["version"],
        "series": series,
        "rank": rank, "song": e.get("song"), "artist": e.get("artist"),
        "language": e.get("language"),
        "jury": e.get("jury_vote"), "tele": e.get("tele_vote"), "total": e.get("score"),
        "juryN": sum(1 for v in voters if v.get("type") == "jury"),  # 该场评委人数（算单评委平均分用）
        "teleN": sum(1 for v in voters if v.get("type") == "tele"),  # 该场观众人数（2024 前观众分也是 1-12 制，并入广义 12 分均分）
        "twelve": twelve, "is_shadow": bool(e.get("is_shadow")),
        "joint": "/" in nick,  # 联合选送（合报）
        "canceled": bool(m.get("canceled") or e.get("canceled")),  # 取消的组(12B)：仅展示、不计统计/走势
    }
    if final is not None:
        rec["final"] = final  # 年度制：是否进决赛（走势图未进决赛正式曲用 soft 配色）
    members_map = ed.get("members", {}) or {}
    # 按 space_id 聚合（而非昵称）——使各届昵称形式不一（如 ed13 单字「萌」vs 早期「萌妈」）的
    # 同一人自动合并到其 id 下。联合选送「A/B」拆分各自计入；匿名(unclaimed)统一归 member/0。
    for target in ([n.strip() for n in nick.split("/")] if "/" in nick else [nick]):
        info = members_map.get(target, {}) or {}
        if info.get("unclaimed"):
            per.setdefault("匿名", []).append(dict(rec, persona=target))
        elif info.get("id") is not None:
            per.setdefault(str(info["id"]), []).append(rec)
        else:
            per.setdefault(target, []).append(rec)  # 兜底：members 缺该昵称（不应发生），按名保留


def aggregate_barvision(eds):
    """{规范昵称: {overview, entries[]}}（含 12 分次数、混淆曲计数）。
    年度制(2023+)：每位成员合并为一条记录（series=届号、rank=overall_rank）——
    进决赛者取 GF 数据，半决赛淘汰者取其 SF 数据；旧分组制保持每场一条记录。"""
    per = {}
    for ed in eds:
        matches = ed.get("matches", [])
        if is_annual_ed(matches):
            no = str(ed["edition_no"])
            gf = next((m for m in matches if m.get("match") == "GF"), None)
            if gf:
                for e in gf["entries"]:
                    _emit_bv(per, ed, gf, e, no, e.get("overall_rank"), final=True)
            for m in matches:
                if m.get("match") in ("SF1", "SF2"):
                    for e in m["entries"]:
                        if not e.get("qualified"):  # 淘汰曲用其半决赛数据 + overall_rank
                            _emit_bv(per, ed, m, e, no, e.get("overall_rank"), final=False)
        else:
            for m in matches:
                match = (m.get("match") or "").strip()
                series = match if match else str(ed["edition_no"])  # 综合赛=届次号
                for e in m.get("entries", []):
                    _emit_bv(per, ed, m, e, series, e.get("rank"))
    out = {}
    for nick, entries in per.items():
        entries.sort(key=lambda x: (x["edition_no"], x["series"]))
        stat = [x for x in entries if not x.get("canceled")]  # 取消组不计入任何统计
        official_all = [x for x in stat if not x["is_shadow"]]
        shadow = [x for x in stat if x["is_shadow"]]
        # ⭐ 概览卡统计：同一**年度届**有 2 首正式单曲（东道主/协办双歌，如 ed14 羊妈/威妈）→ 只计成绩较好(rank 最小)那首。
        # 旧分组制(无 final 字段，每组独立一「场」)不去重；参赛表/走势图仍用全部 entries 显示两首。
        best_ann, official = {}, []
        for x in official_all:
            if x.get("final") is not None:  # 年度制记录（按届号去重）
                ed = x["edition_no"]
                if ed not in best_ann or (x["rank"] or 1e9) < (best_ann[ed]["rank"] or 1e9):
                    best_ann[ed] = x
            else:
                official.append(x)
        official += list(best_ann.values())
        ranks = [x["rank"] for x in official if x["rank"]]
        # Jury 均分（广义 12 分，仅正式单曲）：统计所有 1-12 制投票——2024 前观众分(tele)也是 1-12 制故并入；
        # 2024 起观众分改 20 票制不计。每曲 (12分票总和)/(12分票人数) → 再对各曲求均值（理想 0–12）。
        # 年度制收敛后该曲已携带其进/未进决赛对应阶段(GF/SF)的 jury/tele 数据。
        jpers = []
        for x in official:
            if x.get("jury") is None or not x.get("juryN"):
                continue
            s, n = x["jury"], x["juryN"]
            if x["year"] < BV_TELE_SINCE_YEAR and x.get("tele") is not None:  # 2024 前 tele 也是 1-12 制
                s += x["tele"]; n += (x.get("teleN") or 0)
            if n:
                jpers.append(s / n)
        eds_stat = stat or entries  # 仅有取消条目的成员，debut/active 兜底用全部
        out[nick] = {
            "overview": {
                "best": (min(ranks) if ranks else None),
                "avg": (round(sum(ranks) / len(ranks), 2) if ranks else None),  # 平均名次（正式单曲，两位小数）
                "top1": sum(1 for x in official if x["rank"] == 1),
                "top1_shadow": sum(1 for x in shadow if x["rank"] == 1),
                "top3": sum(1 for x in official if x["rank"] and x["rank"] <= 3),
                "top3_shadow": sum(1 for x in shadow if x["rank"] and x["rank"] <= 3),
                "top10": sum(1 for x in official if x["rank"] and x["rank"] <= 10),
                "top10_shadow": sum(1 for x in shadow if x["rank"] and x["rank"] <= 10),
                "entries": len(official),
                "shadow": len(shadow),
                "twelve": sum(x["twelve"] for x in official),  # 混淆曲的 12 分不计入正式统计
                "jury_avg": (round(sum(jpers) / len(jpers), 2) if jpers else None),  # 评委平均分（单评委均分，正式单曲，两位小数）
                "debut": min(x["edition_no"] for x in eds_stat),
                "active_in": max(x["edition_no"] for x in eds_stat),
                "active": max(x["year"] for x in eds_stat) >= BV_ACTIVE_SINCE_YEAR,
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

    bv_by_id = aggregate_barvision(load_bv_editions(base))  # 现按 space_id(字符串) 聚合
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

            bv = bv_by_id.get(str(space_id))
            if bv:
                data["barvision"] = bv
                ov = bv["overview"]
                bv_index[str(space_id)] = {
                    # 仅报名取消组（如 12B）不算参加该届——与届徽章规则一致，排除 canceled
                    "editions": sorted(set(e["edition_no"] for e in bv["entries"] if not e.get("canceled"))),
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
    unclaimed = bv_by_id.get("匿名")
    if unclaimed:
        u_data = {"nickname": "匿名", "unclaimed": True, "barvision": unclaimed}
        u_json = json.dumps(u_data, ensure_ascii=False, separators=(",", ":"))
        with open(os.path.join(member_dir, "0.html"), "w", encoding="utf-8") as out:
            out.write(TEMPLATE.replace("PLACEHOLDER", u_json))
        ov = unclaimed["overview"]
        bv_index["0"] = {
            "editions": sorted(set(e["edition_no"] for e in unclaimed["entries"] if not e.get("canceled"))),
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
