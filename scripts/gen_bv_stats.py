#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""聚合全部 Barvision 历届赛果 → data/barvision/bv-stats.json，供 stats.html（总览/排行/查询）
与 barvision/hof.html（历届领奖台 + 自动纪录）读取。

产出（仅常规版 version=='regular'，暂不含娱乐版）：
  - members : { "<space_id>": {id, nickname, handle, overview{...}} }  成员聚合（overview 复用 gen_member_pages，合报拆分、混淆排除、年度收敛、广义12分均分）
  - entries : [ 扁平歌曲向条目 ]  每场每首一条（合报不拆，member 保留 "A/B"，ids 含双方）——供 歌曲/歌手/语种 检索与歌曲向视图
  - podium  : [ {edition_no, year, edition_name, rows:[{group, rank, member, ids, nickname, artist, song, score}]} ]  历届领奖台（有 GF 取 GF 前三；否则各组前三）
  - records : { key: {title, metric, val, unit, entries:[...]} }  自动纪录（数据驱动，新增届次自动刷新）

数据规则：混淆曲(is_shadow)不计正式；合报成员向拆计双方、歌曲向不拆；匿名归 id 0。
改任意届 JSON 后重跑：python scripts/gen_bv_stats.py
"""
import csv, glob, json, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_member_pages import load_bv_editions, aggregate_barvision, is_annual_ed  # 复用聚合

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "data", "barvision", "bv-stats.json")
CHINESE_LANGS = ("华语", "中文", "国语", "粤语", "汉语", "普通话")


def load_member_meta():
    meta = {}
    with open(os.path.join(BASE, "data", "members", "members.csv"), encoding="utf-8") as f:
        for row in csv.reader(f):
            if not row or not row[0].strip().isdigit():
                continue
            meta[row[0].strip()] = {"nickname": row[1].strip(), "handle": (row[2].strip() if len(row) > 2 else "")}
    meta["0"] = {"nickname": "匿名", "handle": "匿名"}
    return meta


def resolve_ids(nick, members_map):
    """选送者昵称（可能 "A/B" 合报）→ [(id_str, nickname)]；匿名/未认领 → id 0。"""
    out = []
    for part in ([n.strip() for n in nick.split("/")] if "/" in nick else [nick]):
        info = members_map.get(part, {}) or {}
        if info.get("unclaimed"):
            out.append(("0", part))
        elif info.get("id") is not None:
            out.append((str(info["id"]), part))
        else:
            out.append((part, part))  # 兜底（不应发生）
    return out


def build_entries(eds):
    """扁平歌曲向条目（合报不拆）。"""
    rows = []
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        mm = ed.get("members", {}) or {}
        annual = is_annual_ed(ed.get("matches", []))
        for m in ed.get("matches", []):
            if m.get("canceled"):
                continue
            code = (m.get("match") or "").strip()
            for e in m.get("entries", []):
                nick = e.get("member")
                if not nick:
                    continue
                ids = resolve_ids(nick, mm)
                rows.append({
                    "year": ed["year"], "edition_no": ed["edition_no"], "edition_name": ed.get("edition_name", ""),
                    "match": code, "venue": m.get("venue", ""),
                    "member": nick, "ids": [i for i, _ in ids],
                    "artist": e.get("artist"), "song": e.get("song"),
                    "language": e.get("language"), "genre": e.get("genre"),
                    "rank": e.get("rank"), "overall": e.get("overall_rank"),
                    "score": e.get("score"), "jury": e.get("jury_vote"), "tele": e.get("tele_vote"),
                    "support_rate": e.get("support_rate"),
                    "is_shadow": bool(e.get("is_shadow")), "qualified": e.get("qualified"),
                    "joint": "/" in nick, "annual": annual,
                    "juryN": sum(1 for v in m.get("votes", {}).get("voters", []) if v.get("type") == "jury"),
                })
    return rows


def build_podium(eds, meta):
    """历届领奖台：有 GF（决赛/ed2）取 GF 前三；否则（分组制 A/B/C）各组前三。仅正式曲。"""
    out = []
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        mm = ed.get("members", {}) or {}
        matches = ed.get("matches", [])
        gf = next((m for m in matches if (m.get("match") or "") == "GF"), None)
        groups = [gf] if gf else [m for m in matches if not m.get("canceled")]
        rows = []
        for m in groups:
            if not m:
                continue
            offi = [e for e in m.get("entries", []) if not e.get("is_shadow") and e.get("rank")]
            top3 = sorted(offi, key=lambda e: e["rank"])[:3]
            for e in top3:
                ids = resolve_ids(e["member"], mm)
                rows.append({
                    "group": "" if gf else (m.get("match") or ""),
                    "venue": "" if gf else (m.get("venue") or ""),
                    "rank": e["rank"], "member": e["member"], "ids": [i for i, _ in ids],
                    "nickname": " / ".join(n for _, n in ids),
                    "artist": e.get("artist"), "song": e.get("song"), "score": e.get("score"),
                })
        if rows:  # 跳过尚无赛果的届（如进行中的 ed16）
            out.append({"edition_no": ed["edition_no"], "year": ed["year"],
                        "edition_name": ed.get("edition_name", ""), "rows": rows})
    out.sort(key=lambda x: x["edition_no"])
    return out


def top_members(by_id, meta, key, n=1):
    """成员 overview 某指标取最大值 + 并列者。排除「匿名」伪成员(id 0)。"""
    vals = [(sid, ov["overview"].get(key) or 0) for sid, ov in by_id.items() if sid != "0"]
    mx = max((v for _, v in vals), default=0)
    if mx <= 0:
        return mx, []
    ents = [{"id": int(sid) if sid.isdigit() else 0, "nickname": meta.get(sid, {}).get("nickname", sid),
             "val": v} for sid, v in vals if v == mx]
    return mx, ents


def build_records(eds, by_id, entries, meta):
    rec = {}

    def member_record(key, title, metric, ov_key, unit=""):
        val, ents = top_members(by_id, meta, ov_key)
        rec[key] = {"title": title, "metric": metric, "val": val, "unit": unit, "entries": ents}

    # —— 成员 overview 派生（accurate，复用聚合）——
    member_record("most_wins", "最多夺冠场数", "夺冠场数（rank 1 的场次）", "top1", "场")
    member_record("most_top3", "最多前三场数", "进入前三的场次", "top3", "场")
    member_record("most_top10", "最多前十场数", "进入前十的场次", "top10", "场")
    member_record("most_twelve", "最多累计 12 分次数", "累计获得 12 分次数", "twelve", "次")

    off = [e for e in entries if not e["is_shadow"]]

    def entry_max(key, title, metric, valfn, unit=""):
        cand = [(e, valfn(e)) for e in off]
        cand = [(e, v) for e, v in cand if v is not None]
        if not cand:
            rec[key] = {"title": title, "metric": metric, "val": None, "unit": unit, "entries": []}
            return
        mx = max(v for _, v in cand)
        ents = [{"ids": e["ids"], "nickname": " / ".join(meta.get(i, {}).get("nickname", i) for i in e["ids"]),
                 "artist": e["artist"], "song": e["song"], "edition_no": e["edition_no"],
                 "match": e["match"], "val": round(v, 2) if isinstance(v, float) else v}
                for e, v in cand if v == mx]
        rec[key] = {"title": title, "metric": metric, "val": round(mx, 2) if isinstance(mx, float) else mx,
                    "unit": unit, "entries": ents}

    entry_max("highest_match_score", "最高单组总分", "单场最高总分", lambda e: e["score"], "分")
    entry_max("highest_share", "最高单场得票占比", "单曲得分占全场总分比（score ÷ Σ全场）",
              lambda e: e.get("support_rate"), "%")
    entry_max("highest_jury_avg", "最高单曲评委均分", "单曲评委（Jury）均分",
              lambda e: (e["jury"] / e["juryN"]) if (e.get("jury") is not None and e.get("juryN")) else None)

    # —— 最高单届总分（分组制 LEGACY）：仅 2019–2020 分组制（每人单届多曲）——年度制每人单届仅 1 曲、与「最高单组总分」重复，故排除 ——
    annual_eds = {ed["edition_no"] for ed in eds if is_annual_ed(ed.get("matches", []))}
    edsum = {}  # (id, edition_no) -> {sum, edition_no}
    for sid, ov in by_id.items():
        if sid == "0":  # 排除「匿名」伪成员
            continue
        for x in ov["entries"]:
            if x.get("is_shadow") or x.get("canceled") or x.get("total") is None:
                continue
            if x["edition_no"] in annual_eds:  # 年度制不计（单届单曲，重复于单组总分）
                continue
            k = (sid, x["edition_no"])
            d = edsum.setdefault(k, {"sum": 0.0, "edition_no": x["edition_no"]})
            d["sum"] += x["total"]
    if edsum:
        mx = max(d["sum"] for d in edsum.values())
        ents = [{"id": int(i) if i.isdigit() else 0, "nickname": meta.get(i, {}).get("nickname", i),
                 "edition_no": d["edition_no"], "val": round(d["sum"])}
                for (i, _), d in edsum.items() if abs(d["sum"] - mx) < 0.5]
        rec["highest_edition_score"] = {"title": "最高单届总分", "metric": "单届各曲得分之和（分组制）",
                                        "val": round(mx), "unit": "分", "legacy": True, "entries": ents}

    # —— 最多参与场数（distinct 场次，合报计双方，含正式+混淆，排除取消）——
    appear = {}  # id -> set((edition_no, match))
    for e in entries:
        for i in e["ids"]:
            if i == "0":
                continue
            appear.setdefault(i, set()).add((e["edition_no"], e["match"]))
    if appear:
        mx = max(len(s) for s in appear.values())
        ents = [{"id": int(i) if i.isdigit() else 0, "nickname": meta.get(i, {}).get("nickname", i), "val": len(s)}
                for i, s in appear.items() if len(s) == mx and i != "0"]
        rec["most_participations"] = {"title": "最多参与场数", "metric": "累计参赛场次",
                                      "val": mx, "unit": "场", "entries": ents}

    # —— 最多华语单曲 ——
    cn = {}  # id -> count
    for e in off:
        lang = e.get("language") or ""
        if any(c in lang for c in CHINESE_LANGS):
            for i in e["ids"]:
                if i == "0":
                    continue
                cn[i] = cn.get(i, 0) + 1
    if cn:
        mx = max(cn.values())
        ents = [{"id": int(i) if i.isdigit() else 0, "nickname": meta.get(i, {}).get("nickname", i), "val": c}
                for i, c in cn.items() if c == mx]
        rec["most_chinese"] = {"title": "全世界都在讲中国话", "metric": "最多选送华语单曲",
                               "val": mx, "unit": "首", "entries": ents}

    return rec


def build_season(eds, meta):
    """赛季纪录：最多参赛成员数（届/场）、最多参赛曲目数（届/场）。"""
    per_ed_members, per_ed_songs = {}, {}
    per_match = []  # (edition_no, match, members, songs)
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        mm = ed.get("members", {}) or {}
        ed_members, ed_songs = set(), 0
        for m in ed.get("matches", []):
            if m.get("canceled"):
                continue
            mset, scount = set(), 0
            for e in m.get("entries", []):
                if e.get("is_shadow"):
                    continue
                scount += 1
                for i, _ in resolve_ids(e.get("member", ""), mm):
                    mset.add(i)
            ed_members |= mset
            ed_songs += scount
            per_match.append((ed["edition_no"], ed.get("edition_name", ""), m.get("match") or "", len(mset), scount))
        per_ed_members[ed["edition_no"]] = (ed.get("edition_name", ""), len(ed_members))
        per_ed_songs[ed["edition_no"]] = (ed.get("edition_name", ""), ed_songs)

    def mx_ed(d, label):
        no = max(d, key=lambda k: d[k][1])
        return {"val": d[no][1], "edition_no": no, "edition_name": d[no][0]}

    bm = max(per_match, key=lambda x: x[3]); bs = max(per_match, key=lambda x: x[4])
    return {
        "most_members_edition": mx_ed(per_ed_members, "成员"),
        "most_songs_edition": mx_ed(per_ed_songs, "曲目"),
        "most_members_match": {"val": bm[3], "edition_no": bm[0], "edition_name": bm[1], "match": bm[2]},
        "most_songs_match": {"val": bs[4], "edition_no": bs[0], "edition_name": bs[1], "match": bs[2]},
    }


def main():
    eds = load_bv_editions(BASE)
    meta = load_member_meta()
    by_id = aggregate_barvision(eds)  # {str id / "匿名": {overview, entries}}
    # aggregate 用「匿名」做 key；统一成 "0"
    if "匿名" in by_id:
        by_id["0"] = by_id.pop("匿名")
    members = {sid: {"id": int(sid) if sid.isdigit() else 0,
                     "nickname": meta.get(sid, {}).get("nickname", sid),
                     "handle": meta.get(sid, {}).get("handle", ""),
                     "overview": ov["overview"]}
               for sid, ov in by_id.items()}
    entries = build_entries(eds)
    podium = build_podium(eds, meta)
    records = build_records(eds, by_id, entries, meta)
    season = build_season(eds, meta)

    data_through = max((p["edition_no"] for p in podium), default=0)  # 有赛果的最大届号（第 15 届）
    out = {"data_through": data_through, "members": members, "entries": entries, "podium": podium,
           "records": records, "season": season}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    print("写出", OUT)
    print(f"  成员 {len(members)} | 扁平条目 {len(entries)} | 领奖台届数 {len(podium)}")
    print("  —— 自动纪录 ——")
    for k, r in records.items():
        who = "、".join(e.get("nickname", "") for e in r["entries"][:4])
        print(f"  {r['title']}: {r['val']}{r['unit']}  ← {who}")
    print("  —— 赛季纪录 ——")
    for k, r in season.items():
        print(f"  {k}: {r['val']} (第{r['edition_no']}届{(' ' + r.get('match','')) if r.get('match') else ''})")


if __name__ == "__main__":
    main()
