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
import csv, glob, json, os, re, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen_member_pages import load_bv_editions, aggregate_barvision, is_annual_ed  # 复用聚合

try:
    sys.stdout.reconfigure(encoding="utf-8")
except Exception:
    pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, "data", "barvision", "bv-stats.json")
CHINESE_LANGS = ("华语", "中文", "国语", "粤语", "汉语", "普通话")

# 先锋奖（唯一手工维护项，见 #167）——萌妈创立 Barvision
PIONEER = {
    "nickname": "萌妈", "member_id": 125, "handle": "绿荫夏语",
    "desc": "2019 年，@绿荫夏语在榜吧发起第一届 Barvision 歌曲大赛，为小众音乐爱好者搭建了一个展示舞台，"
            "也由此开启了 Barvision 的历史。",
}

# 全局场次轴（与 member-render.js 的 BV_SLOTS 一致）——趣味奖项里「场/卡位/连续」均按此序
BV_SLOTS = ['1', '2SF', '2GF', '3A', '3B', '4A', '4B', '5A', '5B', '5C', '6A', '6B', '6C',
            '7A', '7B', '7C', '8A', '8B', '9A', '9B', '10A', '10B', '11A', '11B', '12A',
            '13', '14', '15', '16']
_SLOT_IDX = {c: i for i, c in enumerate(BV_SLOTS)}
GROUPS = {'A', 'B', 'C', 'SF', 'GF'}


def slot_code(e):
    """成员条目 → 全局场次代码（无组别=纯届号 '1'/'13'，有组别=届+组 '7A'/'2GF'）。"""
    s = (e.get("series") or "").strip()
    return (str(e["edition_no"]) + s) if s in GROUPS else str(e["edition_no"])


def slot_idx(code):
    return _SLOT_IDX.get(code, 9999)


def ord_en(n):
    if n is None:
        return "—"
    n = int(n)
    suf = "th" if 10 <= n % 100 <= 20 else {1: "st", 2: "nd", 3: "rd"}.get(n % 10, "th")
    return f"{n}{suf}"


VENUE_OF = {"A": "小众组", "B": "中众组", "C": "大众组", "SF": "半决赛", "GF": "决赛"}


def slot_label(code):
    """场次代码 → 中文标签：'5B'→'第 5 届中众组'、'1'→'第 1 届'、'2GF'→'第 2 届决赛'。"""
    m = re.match(r"(\d+)([A-Za-z]*)", str(code))
    return f"第 {m.group(1)} 届" + VENUE_OF.get(m.group(2), "") if m else str(code)


def rank_cn(n):
    return f"第 {int(n)} 名" if n is not None else "—"


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
    """历届领奖台（仅正式曲，各组/场前三）：
       年度制(2023+) 取决赛前三、组别留空；ed2 取 决赛(GF)+半决赛(SF)；分组制取各组(小众/中众/大众)；ed1 单场综合赛记「小众」。"""
    out = []
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        mm = ed.get("members", {}) or {}
        matches = ed.get("matches", [])
        annual = is_annual_ed(matches)
        gf = next((m for m in matches if (m.get("match") or "") == "GF"), None)
        if annual and gf:                              # 年度制：仅决赛，组别留空
            sel = [(gf, "", "")]
        elif gf:                                       # ed2 特例：中文「上半场/下半场」（英文仍 SF/GF）
            others = [m for m in matches if not m.get("canceled") and m is not gf]
            sel = [(gf, "GF", "下半场")] + [(m, (m.get("match") or "SF"), "上半场") for m in others]
        else:                                          # 分组制 / ed1 单场综合赛
            ms = [m for m in matches if not m.get("canceled")]
            single = len(ms) == 1 and not ms[0].get("venue")
            sel = [(m, (m.get("match") or ("S" if single else "")),
                       (m.get("venue") or ("小众组" if single else ""))) for m in ms]
        rows = []
        for m, grp, ven in sel:
            if not m:
                continue
            offi = [e for e in m.get("entries", []) if not e.get("is_shadow") and e.get("rank")]
            top3 = sorted(offi, key=lambda e: e["rank"])[:3]
            for e in top3:
                ids = resolve_ids(e["member"], mm)
                rows.append({
                    "group": grp, "venue": ven,
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

    def gf_val(e, v):
        # 年度制(13+ SF1/SF2/GF)：单届=单场，HOF 只取决赛依据 → 半决赛条目不计入
        return None if (e.get("annual") and (e.get("match") or "") in ("SF", "SF1", "SF2")) else v

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

    entry_max("highest_match_score", "最高单届总分 · 年度制", "年度制单届(=决赛)总分", lambda e: gf_val(e, e["score"]), "分")
    # highest_share（最高单场得票占比）改由 build_champ_share 在 main 中按「冠军 score ÷ 该场正式曲 score 之和」设置
    # 最高 Jury 均分（与个人主页卡片一致）：某大妈全部参赛曲在 12 分制下的平均分
    # ——2024 前「广义 12 分均分」(评委+观众)/(全部投票人)，2024 起「狭义 12 分制均分」仅评委、不计 20 票制观众。复用 overview.jury_avg。
    member_record("highest_jury_avg", "最高 Jury 均分", "参赛曲目 12 分制平均分（2024 前广义 / 2024 起仅评委）", "jury_avg")

    # —— 最高单届总分 · 分组制：仅 2019–2020 分组制（每人单届多曲，各组得分之和）——年度制单届仅 1 曲、归「· 年度制」(highest_match_score) ——
    GTYPE_R = {"A": "小众", "B": "中众", "C": "大众"}
    TYPES_R = ["小众", "中众", "大众"]
    TYPE_LETTER = {"小众": "A", "中众": "B", "大众": "C"}
    annual_eds = {ed["edition_no"] for ed in eds if is_annual_ed(ed.get("matches", []))}
    edsum = {}  # (id, edition_no) -> {sum, edition_no, parts{组:得分}}
    for sid, ov in by_id.items():
        if sid == "0":  # 排除「匿名」伪成员
            continue
        for x in ov["entries"]:
            if x.get("is_shadow") or x.get("canceled") or x.get("total") is None:
                continue
            if x["edition_no"] in annual_eds:  # 年度制不计
                continue
            k = (sid, x["edition_no"])
            d = edsum.setdefault(k, {"sum": 0.0, "edition_no": x["edition_no"], "parts": {}})
            d["sum"] += x["total"]
            t = GTYPE_R.get((x.get("series") or "").strip(), "小众")
            d["parts"][t] = d["parts"].get(t, 0) + x["total"]
    if edsum:
        mx = max(d["sum"] for d in edsum.values())
        # 各组得分：场次码作徽章 + 得分文本交替（6A 徽章 66 / 6B 徽章 86 …）。已含届号 → 不再单出「第 N 届」徽章，edition_no 置 None
        def _grp_segs(d):
            segs = []
            for t in TYPES_R:
                if t in d["parts"]:
                    segs.append({"b": str(d["edition_no"]) + TYPE_LETTER[t]})
                    segs.append({"t": str(round(d["parts"][t]))})
            return segs
        ents = [{"id": int(i) if i.isdigit() else 0, "nickname": meta.get(i, {}).get("nickname", i),
                 "edition_no": None, "val": round(d["sum"]), "segs": _grp_segs(d)}
                for (i, _), d in edsum.items() if abs(d["sum"] - mx) < 0.5]
        rec["highest_edition_score"] = {"title": "最高单届总分 · 分组制", "metric": "单届各组得分之和（分组制）",
                                        "val": round(mx), "unit": "分", "entries": ents}

    # —— 最多参与场数（distinct 场次，合报计双方，含正式+混淆，排除取消）——
    appear = {}  # id -> set(场key)；28 场模型：年度制(13+)单届=单场(折叠 SF1/SF2/GF)，ed2/分组制/ed1 按 (届,场)
    for e in entries:
        skey = (e["edition_no"],) if e.get("annual") else (e["edition_no"], e["match"])
        for i in e["ids"]:
            if i == "0":
                continue
            appear.setdefault(i, set()).add(skey)
    if appear:
        mx = max(len(s) for s in appear.values())
        ents = [{"id": int(i) if i.isdigit() else 0, "nickname": meta.get(i, {}).get("nickname", i), "val": len(s)}
                for i, s in appear.items() if len(s) == mx and i != "0"]
        rec["most_participations"] = {"title": "最多参与场数", "metric": "累计参赛场次",
                                      "val": mx, "unit": "场", "entries": ents}

    return rec


def build_champ_share(entries, meta):
    """28 场冠军单曲得票率：冠军 score ÷ 该场所有正式曲 score 之和（年度制 13+ 只取决赛 GF）。
       返回按得票率降序、带 rank 的列表（供 stats.html「冠军得票率」表 + HOF highest_share 共用）。"""
    groups = {}  # (edition_no, match) -> [entries]
    for e in entries:
        if e.get("annual") and (e.get("match") or "") in ("SF", "SF1", "SF2"):
            continue  # 年度制单届=单场，只取决赛 GF（ed2 非年度制，SF/GF 各算一场）
        groups.setdefault((e["edition_no"], e.get("match") or ""), []).append(e)
    rows = []
    for (en, mt), es in groups.items():
        offi = [e for e in es if not e["is_shadow"] and e.get("score") is not None]
        if not offi:
            continue
        pool = sum(e["score"] for e in offi)
        if pool <= 0:
            continue
        champ = next((e for e in offi if e.get("rank") == 1), None) or min(offi, key=lambda e: (e.get("rank") or 999))
        # 场次中文：小众组/中众组/大众组/决赛；ed1 单场→小众组；ed2 特例→上半场/下半场（英文仍 SF/GF）
        if en == 2:
            stage = "上半场" if mt == "SF" else "下半场"
        else:
            stage = VENUE_OF.get(mt) or (champ.get("venue") or "小众组")
        rows.append({
            "edition_no": en, "year": champ.get("year"), "match": mt, "stage": stage,
            "ids": champ["ids"],
            "nickname": " / ".join(meta.get(i, {}).get("nickname", i) for i in champ["ids"]) or champ.get("member"),
            "artist": champ.get("artist"), "song": champ.get("song"),
            "share": round(champ["score"] / pool * 100, 2),
            "score": round(champ["score"]), "pool": round(pool),
        })
    rows.sort(key=lambda r: (-r["share"], r["edition_no"]))
    for i, r in enumerate(rows):
        r["rank"] = i + 1
    return rows


def build_season(eds, meta, overview):
    """赛季纪录（基于 overview 的去重 members/songs，与历届赛果总览一致）。
       每项：title/unit/val + 其一：editions(并列届号列表) / edition_no+match / list(条目)。"""
    ov = [o for o in overview if not o.get("in_progress")]
    season = {}

    def maxeds(items, key):
        mx = max(o[key] for o in items)
        return mx, [o["edition_no"] for o in items if o[key] == mx]

    def edbadge(ed, venue=""):  # 标签：第 N 届 + 完整组名（数字两侧空格、其余无空格）
        return f"第 {ed} 届" + (venue or "")

    # 单届最多参赛成员（overview members 已排除匿名；并列全列 → 13/14/15 = 27）
    mx, e = maxeds(ov, "members")
    season["most_members_edition"] = {"title": "单届最多参赛成员", "unit": "人", "val": mx,
                                      "badges": [edbadge(x) for x in e]}
    # 单届最多参赛曲目 · 年度制（去重）/ · 分组制（各组之和）
    ann = [o for o in ov if o["format"] == "annual"]
    grp = [o for o in ov if o["format"] != "annual"]
    if ann:
        mx, e = maxeds(ann, "songs")
        season["songs_edition_annual"] = {"title": "单届最多参赛曲目 · 年度制", "unit": "首", "val": mx,
                                          "badges": [edbadge(x) for x in e]}
    if grp:
        mx, e = maxeds(grp, "songs")
        season["songs_edition_grouped"] = {"title": "单届最多参赛曲目 · 分组制", "unit": "首", "val": mx,
                                           "badges": [edbadge(x) for x in e]}

    # 单场最多参赛成员 · 分组制（仅 1–12 届=非年度制；各场/组 distinct 成员，排除匿名 id 0）
    best = None  # (count, edition_no, venue_short)
    for ed in eds:
        if ed.get("version") != "regular" or is_annual_ed(ed.get("matches", [])):
            continue
        mm = ed.get("members", {}) or {}
        for m in ed.get("matches", []):
            if m.get("canceled"):
                continue
            mset = set()
            for e2 in m.get("entries", []):
                if e2.get("is_shadow"):
                    continue
                for i, _ in resolve_ids(e2.get("member", ""), mm):
                    if i != "0":
                        mset.add(i)
            lbl = m.get("venue") or m.get("match") or ""   # 完整组名（含「组」）
            if best is None or len(mset) > best[0]:
                best = (len(mset), ed["edition_no"], lbl)
    if best:
        season["most_members_match"] = {"title": "单场最多参赛成员 · 分组制", "unit": "人", "val": best[0],
                                        "badges": [edbadge(best[1], best[2])]}

    # 单场最多语种 + 非英语歌曲夺冠（「场」：分组制按各组、否则整届一场）
    def langs_of(mlist):
        s = set()
        for m in mlist:
            for e2 in m.get("entries", []):
                if e2.get("is_shadow"):
                    continue
                for lg in re.split(r"[ /、,，]+", (e2.get("language") or "").strip()):
                    if lg:
                        s.add(lg)
        return s
    lang_units, noneng_by_ed = [], {}   # noneng_by_ed: 届号 -> [组名…]（同届多场合并一个标签）
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        ms = [m for m in ed.get("matches", []) if not m.get("canceled")]
        if not ms:
            continue
        has_venue = any(m.get("venue") for m in ms)
        if has_venue:
            for m in ms:
                lang_units.append((len(langs_of([m])), ed["edition_no"], m.get("venue") or ""))
        else:
            lang_units.append((len(langs_of(ms)), ed["edition_no"], ""))
        # 非英语夺冠场：分组制各组冠军、否则决赛(GF)/单场冠军；冠军曲语种非「英语」
        champ_ms = ms if has_venue else [next((m for m in ms if (m.get("match") or "") == "GF"), None)]
        champ_ms = [m for m in champ_ms if m] or ms
        for m in champ_ms:
            offi = [e2 for e2 in m.get("entries", []) if not e2.get("is_shadow") and e2.get("rank")]
            if not offi:
                continue
            lang = (min(offi, key=lambda x: x["rank"]).get("language") or "").strip()
            if lang and lang != "英语":
                noneng_by_ed.setdefault(ed["edition_no"], []).append(m.get("venue") or "")
    if lang_units:
        bl = max(lang_units, key=lambda x: x[0])
        season["most_lang_match"] = {"title": "单场最多语种", "unit": "种", "val": bl[0],
                                     "badges": [edbadge(bl[1], bl[2])]}
    noneng_total = sum(len(v) for v in noneng_by_ed.values())  # 场数（同届多场各计）
    noneng_badges = [edbadge(e, " ".join(vs)) for e, vs in sorted(noneng_by_ed.items())]  # 同届多组合并：第 7 届小众组 中众组
    season["noneng_champ"] = {"title": "非英语歌曲夺冠", "unit": "场", "val": noneng_total, "badges": noneng_badges}
    return season


def build_overview(eds, meta, podium):
    """历届成绩总览：每届一行（届号/年份/城市/赛制/参赛人数/曲目数/场次数/冠军）。"""
    champ_by_ed = {}
    for p in podium:
        champ_by_ed[p["edition_no"]] = [
            {"group": r.get("group", ""), "venue": r.get("venue", ""), "ids": r["ids"],
             "nickname": r["nickname"], "artist": r["artist"], "song": r["song"], "score": r["score"]}
            for r in p["rows"] if r["rank"] == 1]
    out = []
    for ed in eds:
        if ed.get("version") != "regular":
            continue
        mm = ed.get("members", {}) or {}
        annual = is_annual_ed(ed.get("matches", []))
        mlist = [m for m in ed.get("matches", []) if not m.get("canceled")]
        members, songs, song_keys = set(), 0, set()
        for m in mlist:
            for e in m.get("entries", []):
                if e.get("is_shadow"):
                    continue
                songs += 1
                song_keys.add((e.get("member", ""), e.get("artist", ""), e.get("song", "")))
                for i, _ in resolve_ids(e.get("member", ""), mm):
                    if i != "0":
                        members.add(i)
        nmatch = len(mlist)
        # 曲目数：年度制(2023+)同曲在 SF/GF 多场重复出现 → 按(选送者,歌手,歌名)去重为唯一曲目数；
        #         分组制(1–12)各组曲目互不重叠 → 按场累计（保持分开）
        songs_total = len(song_keys) if annual else songs

        def _champ(m):  # 某场冠军（正式曲 rank 最小）
            offi = [e for e in m.get("entries", []) if not e.get("is_shadow") and e.get("rank")]
            if not offi:
                return None
            top = min(offi, key=lambda e: e["rank"])
            ids = resolve_ids(top.get("member", ""), mm)
            return {"ids": [i for i, _ in ids], "nickname": " / ".join(n for _, n in ids),
                    "artist": top.get("artist"), "song": top.get("song")}

        # 当届冠军（按场/组拆分）：年度制→决赛单冠军(拉通,含夺冠曲)；ed2 等多场非年度制→按场(SF/GF)；
        # 分组制→各组(小众/中众/大众)；ed1 单场综合赛→标「小众」
        champ_rows = []
        if annual:
            gf = next((m for m in mlist if (m.get("match") or "") == "GF"), None)
            c = _champ(gf) if gf else None
            if c:
                c["label"] = ""
                champ_rows.append(c)
        else:
            for m in mlist:
                c = _champ(m)
                if not c:
                    continue
                code = (m.get("match") or "").strip()
                if code in ("SF", "GF", "SF1", "SF2"):
                    c["label"] = code
                elif m.get("venue"):
                    c["label"] = m["venue"].replace("组", "")
                else:
                    c["label"] = "小众"  # 第一届单场综合赛
                champ_rows.append(c)

        # 曲目数明细：分组制(1–12)各组分开（小众/中众/大众，与 champ_rows 同序同标签）；
        #            年度制(2023+)已去重为单一总数(songs)，不按场拆分（song_rows 留空）
        song_rows = []
        if not annual:
            for m in mlist:
                cnt = sum(1 for e in m.get("entries", []) if not e.get("is_shadow"))
                code = (m.get("match") or "").strip()
                if code in ("SF", "GF", "SF1", "SF2"):
                    lbl = code
                elif m.get("venue"):
                    lbl = m["venue"].replace("组", "")
                else:
                    lbl = "小众"
                song_rows.append({"label": lbl, "songs": cnt})

        # nmatch==0 → 进行中/尚无赛果的届（如 ed16）：仍纳入总览，仅元信息，标 in_progress
        out.append({
            "edition_no": ed["edition_no"], "year": ed["year"],
            "edition_name": ed.get("edition_name", ""), "cn_name": ed.get("cn_name", ""),
            "city": ed.get("city", ""), "host": ed.get("host", ""),
            "format": "annual" if annual else "grouped",
            "members": len(members), "songs": songs_total, "matches": nmatch,
            "champ_rows": champ_rows, "song_rows": song_rows,
            "in_progress": nmatch == 0,
        })
    out.sort(key=lambda x: x["edition_no"])
    return out


def build_awards(by_id, entries, meta):
    """趣味奖项（自动计算 + 创意命名）。每项：
       {title, metric, val(展示串), unit, type:'max'|'list', winners:[{id,nickname,detail,...}]}。
       排除「匿名」伪成员(id 0)；合报已在聚合阶段拆计双方。"""
    aw = {}

    def nick(sid):
        return meta.get(sid, {}).get("nickname", sid)

    # 预处理每位成员的（正式/混淆）场次序列
    prof = {}  # sid -> {offs, shadows, slots(code->best off entry), won_eds, part_eds, debut_slot_idx}
    for sid, rec in by_id.items():
        if sid == "0":
            continue
        offs = [e for e in rec["entries"] if not e.get("is_shadow") and not e.get("canceled") and e.get("rank")]
        shadows = [e for e in rec["entries"] if e.get("is_shadow") and e.get("rank")]
        if not offs:
            continue
        slots = {}  # code -> 该场最好（rank 最小）正式条目
        for e in offs:
            c = slot_code(e)
            if c not in slots or e["rank"] < slots[c]["rank"]:
                slots[c] = e
        won_eds = sorted({e["edition_no"] for e in offs if e["rank"] == 1})
        part_eds = sorted({e["edition_no"] for e in offs})
        debut_slot = min(slots, key=slot_idx)
        prof[sid] = {"offs": offs, "shadows": shadows, "slots": slots,
                     "won_eds": won_eds, "part_eds": part_eds, "debut_slot": debut_slot}

    def longest_run(nums):
        """连续整数最长游程 → (len, start, end)。"""
        if not nums:
            return (0, None, None)
        best = cur = 1; bs = be = nums[0]; cs = nums[0]
        for a, b in zip(nums, nums[1:]):
            if b == a + 1:
                cur += 1
            else:
                cur = 1; cs = b
            if cur > best:
                best = cur; bs = cs; be = b
        return (best, bs, be)

    def ed_range(s, e):
        return f"第 {s} 届" if s == e else f"第 {s}–{e} 届"

    # ① 出道即巅峰（list）：首秀（最早参赛届）即夺冠
    debut_win = []
    for sid, p in prof.items():
        d_ed = min(p["part_eds"])
        champs = [e for e in p["offs"] if e["edition_no"] == d_ed and e["rank"] == 1]
        if champs:
            e = sorted(champs, key=lambda x: slot_idx(slot_code(x)))[0]
            debut_win.append({"id": int(sid) if sid.isdigit() else 0, "nickname": nick(sid),
                              "edition_no": d_ed, "slot": slot_code(e),
                              "artist": e["artist"], "song": e["song"]})
    debut_win.sort(key=lambda x: x["edition_no"])
    aw["debut_peak"] = {"title": "出道即巅峰", "metric": "首次参赛即夺冠", "val": "1st",
                        "unit": "", "type": "list", "winners": debut_win}

    # ② 卧薪尝胆（max）：从首秀到首冠跨越最多场次（BV_SLOTS 含头含尾）
    wait = []
    for sid, p in prof.items():
        if not p["won_eds"]:
            continue
        win_slots = [slot_code(e) for e in p["offs"] if e["rank"] == 1]
        first_win = min(win_slots, key=slot_idx)
        span = slot_idx(first_win) - slot_idx(p["debut_slot"]) + 1
        wait.append((sid, span, p["debut_slot"], first_win))
    if wait:
        mx = max(s for _, s, _, _ in wait)
        aw["longest_wait"] = {"title": "卧薪尝胆", "metric": "最大首赛至首冠间隔场次", "val": mx,
                              "unit": "场", "type": "max",
                              "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                           "segs": [{"b": slot_label(ds)}, {"t": "→"}, {"b": slot_label(fw)}]}
                                          for s, sp, ds, fw in wait if sp == mx]}

    # ③ 实红艺人（max）：连续届夺冠（连冠）
    cw = []
    for sid, p in prof.items():
        ln, s, e = longest_run(p["won_eds"])
        if ln >= 2:
            cw.append((sid, ln, s, e))
    if cw:
        mx = max(x[1] for x in cw)
        aw["consecutive_wins"] = {"title": "实红艺人", "metric": "连续届数夺冠", "val": mx, "unit": "届",
                                  "type": "max",
                                  "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                               "segs": [{"b": f"第 {x} 届"} for x in range(a, b + 1)]}
                                              for s, ln, a, b in cw if ln == mx]}

    # ④ 小众之星（max）：小众组（A 组）夺冠次数最多
    niche = {}
    for sid, p in prof.items():
        slots_a = sorted([slot_code(e) for e in p["offs"] if (e.get("series") == "A" and e["rank"] == 1)],
                         key=slot_idx)
        if slots_a:
            niche[sid] = slots_a
    if niche:
        mx = max(len(v) for v in niche.values())
        aw["niche_star"] = {"title": "小众之星", "metric": "小众组夺冠次数最多", "val": mx, "unit": "次",
                            "type": "max",
                            "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                         "segs": [{"b": "第 " + re.match(r"\d+", c).group() + " 届"} for c in v]}
                                        for s, v in niche.items() if len(v) == mx]}

    # ⑤ 雨露均沾（max）：连续届参赛最长
    streak = []
    for sid, p in prof.items():
        ln, s, e = longest_run(p["part_eds"])
        streak.append((sid, ln, s, e))
    if streak:
        mx = max(x[1] for x in streak)
        aw["longest_streak"] = {"title": "雨露均沾", "metric": "最长连续参赛届数", "val": mx, "unit": "届",
                                "type": "max",
                                "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                             "segs": ([{"b": f"第 {a} 届"}] if a == b else
                                                      [{"b": f"第 {a} 届"}, {"t": "→"}, {"b": f"第 {b} 届"}])}
                                            for s, ln, a, b in streak if ln == mx]}

    # 缺席整届即中断：相邻两场次属于同届或相邻届才算连续（届号差 ≤ 1）
    def adjacent(e1, e2):
        return e2["edition_no"] - e1["edition_no"] <= 1

    # ⑥ 长盛不衰（max）：连续参赛场次保持前十最长（缺席整届中断）
    top10run = []
    for sid, p in prof.items():
        seq = sorted(p["slots"].items(), key=lambda kv: slot_idx(kv[0]))
        best = cur = 0; brange = crange = []; prev = None
        for c, e in seq:
            if e["rank"] <= 10 and (prev is None or adjacent(prev, e)):
                cur += 1; crange.append(c)
            elif e["rank"] <= 10:
                cur = 1; crange = [c]  # 前十但与上一场不相邻 → 重开
            else:
                cur = 0; crange = []
            if cur > best:
                best = cur; brange = crange[:]
            prev = e
        if best:
            top10run.append((sid, best, brange))
    if top10run:
        mx = max(x[1] for x in top10run)
        aw["longest_top10"] = {"title": "长盛不衰", "metric": "最长连续前十场次", "val": mx, "unit": "场",
                               "type": "max",
                               "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                            "segs": [{"b": slot_label(r[0])}, {"t": "→"}, {"b": slot_label(r[-1])}]}
                                           for s, ln, r in top10run if ln == mx]}

    # ⑦ 跳水天后（max）：相邻参赛场次名次跌幅最大
    drop = []
    for sid, p in prof.items():
        seq = sorted(p["slots"].items(), key=lambda kv: slot_idx(kv[0]))
        for (c1, e1), (c2, e2) in zip(seq, seq[1:]):
            d = e2["rank"] - e1["rank"]
            if d > 0 and adjacent(e1, e2):  # 缺席整届即中断
                drop.append((sid, d, c1, e1["rank"], c2, e2["rank"]))
    if drop:
        mx = max(x[1] for x in drop)
        aw["biggest_drop"] = {"title": "跳水天后", "metric": "最大相邻两场名次跌幅", "val": mx, "unit": "名",
                              "type": "max",
                              "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                           "segs": [{"b": slot_label(c1)}, {"t": rank_cn(r1) + " →"},
                                                    {"b": slot_label(c2)}, {"t": rank_cn(r2)}]}
                                          for s, d, c1, r1, c2, r2 in drop if d == mx]}

    # ⑧ 极限卡位（list）：同一届不同场次斩获相同名次
    clutch = []
    for sid, p in prof.items():
        byed = {}
        for e in p["offs"]:
            byed.setdefault((e["edition_no"], e["rank"]), []).append(slot_code(e))
        for (ed, rk), codes in byed.items():
            codes = sorted(set(codes), key=slot_idx)
            if len(codes) >= 2:
                clutch.append({"id": int(sid) if sid.isdigit() else 0, "nickname": nick(sid),
                               "rank": rk, "edition_no": ed,
                               "segs": [{"t": rank_cn(rk)}] + [{"b": c} for c in codes]})
    clutch.sort(key=lambda x: (x["rank"], x["edition_no"]))
    aw["clutch"] = {"title": "极限卡位", "metric": "同届不同场次收获相同名次", "val": "", "unit": "",
                    "type": "list", "winners": clutch}

    # ⑨ 独家冠名（max）：同一名次的选送次数最多
    same_rank = []
    for sid, p in prof.items():
        cnt = {}
        codes = {}
        for e in p["offs"]:
            cnt[e["rank"]] = cnt.get(e["rank"], 0) + 1
            codes.setdefault(e["rank"], []).append(slot_code(e))
        rk = max(cnt, key=lambda r: cnt[r])
        same_rank.append((sid, cnt[rk], rk, sorted(set(codes[rk]), key=slot_idx)))
    if same_rank:
        mx = max(x[1] for x in same_rank)
        aw["most_same_rank"] = {"title": "独家冠名", "metric": "最多同名次选送数", "val": mx, "unit": "首",
                                "type": "max",
                                "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                             "segs": [{"t": rank_cn(rk)}] + [{"b": cc} for cc in cs]}
                                            for s, c, rk, cs in same_rank if c == mx]}

    # ⑩ 即刻开吸（max）：同场混淆曲名次落后正式曲最大（混淆比正式差最多）
    sgap = []
    for sid, p in prof.items():
        for sh in p["shadows"]:
            c = slot_code(sh)
            off = p["slots"].get(c)
            if off and sh["rank"] is not None:
                d = sh["rank"] - off["rank"]
                if d > 0:
                    sgap.append((sid, d, c, off["rank"], sh["rank"]))
    if sgap:
        mx = max(x[1] for x in sgap)
        aw["shadow_gap"] = {"title": "即刻开吸", "metric": "最大同场混淆曲落后正式曲名次", "val": mx, "unit": "名",
                            "type": "max",
                            "winners": [{"id": int(s) if s.isdigit() else 0, "nickname": nick(s),
                                         "segs": [{"t": "选送 " + rank_cn(r1) + " → 混淆 " + rank_cn(r2)}, {"b": slot_label(c)}]}
                                        for s, d, c, r1, r2 in sgap if d == mx]}

    # ⑪ 全世界都在讲中国话（max）：最多选送华语单曲（合报计双方）
    cn = {}
    for e in entries:
        if e["is_shadow"]:
            continue
        if any(x in (e.get("language") or "") for x in CHINESE_LANGS):
            for i in e["ids"]:
                if i != "0":
                    cn[i] = cn.get(i, 0) + 1
    if cn:
        mx = max(cn.values())
        aw["most_chinese"] = {"title": "全世界都在讲中国话", "metric": "最多选送华语单曲数", "val": mx, "unit": "首",
                              "type": "max",
                              "winners": [{"id": int(i) if i.isdigit() else 0, "nickname": nick(i), "detail": ""}
                                          for i, c in cn.items() if c == mx]}

    # ⑫ 大众之选（max）：被选送最多的艺人（(届,选送者,歌名) 去重、不含混淆曲；得主为艺人、纯文本）
    artist_sub = {}
    for e in entries:
        if e["is_shadow"] or not e.get("artist"):
            continue
        artist_sub.setdefault(e["artist"], set()).add((e["edition_no"], e["member"], e["song"]))
    if artist_sub:
        mx = max(len(s) for s in artist_sub.values())
        aw["most_artist"] = {"title": "大众之选", "metric": "被选送次数最多艺人",
                             "val": mx, "unit": "次", "type": "max",
                             "winners": sorted([{"nickname": a} for a, s in artist_sub.items() if len(s) == mx],
                                               key=lambda x: x["nickname"])}

    # ⑬ 大满贯（max）：小众/中众/大众三组均夺冠（A→小众 B→中众 C→大众，无分组的届默认归小众）
    GTYPE = {"A": "小众", "B": "中众", "C": "大众"}
    TYPES = ["小众", "中众", "大众"]
    slam = []
    for sid, p in prof.items():
        won = {}  # type -> 最早夺冠场代码
        for e in p["offs"]:
            if e["rank"] != 1:
                continue
            t = GTYPE.get((e.get("series") or "").strip(), "小众")
            c = slot_code(e)
            if t not in won or slot_idx(c) < slot_idx(won[t]):
                won[t] = c
        if all(t in won for t in TYPES):
            slam.append({"id": int(sid) if sid.isdigit() else 0, "nickname": nick(sid),
                         "segs": [{"b": slot_label(won[t])} for t in TYPES]})
    if slam:
        aw["group_slam"] = {"title": "大满贯", "metric": "小众 / 中众 / 大众组均夺冠", "val": "", "unit": "",
                            "type": "max", "winners": slam}

    # ⑭ 全满贯（max）：历届正式成绩囊括第 1–10 名各至少一次
    full = []
    for sid, p in prof.items():
        if set(range(1, 11)) <= {e["rank"] for e in p["offs"]}:
            full.append({"id": int(sid) if sid.isdigit() else 0, "nickname": nick(sid)})
    if full:
        aw["rank_slam"] = {"title": "全满贯", "metric": "历届成绩收获第一至十名", "val": "", "unit": "",
                           "type": "max", "winners": full}

    return aw


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
    champ_share = build_champ_share(entries, meta)  # 28 场冠军得票率（降序）
    # highest_share（HOF）：取得票率最高者（含并列），口径 = 冠军 score ÷ 该场正式曲 score 之和
    if champ_share:
        top = champ_share[0]["share"]
        hs_ents = [{"ids": r["ids"], "nickname": r["nickname"], "artist": r["artist"], "song": r["song"],
                    "edition_no": r["edition_no"], "match": r["match"], "val": r["share"]}
                   for r in champ_share if r["share"] == top]
        records["highest_share"] = {"title": "最高单场得票占比", "metric": "冠军单曲得分 ÷ 该场正式曲总分",
                                    "val": top, "unit": "%", "entries": hs_ents}
    awards = build_awards(by_id, entries, meta)
    overview = build_overview(eds, meta, podium)
    season = build_season(eds, meta, overview)

    data_through = max((p["edition_no"] for p in podium), default=0)  # 有赛果的最大届号（第 15 届）
    out = {"data_through": data_through, "pioneer": PIONEER, "overview": overview, "members": members,
           "entries": entries, "podium": podium, "records": records, "season": season, "awards": awards,
           "champ_share": champ_share}
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
        print(f"  {k}: {r['val']} ({' / '.join(r.get('badges', []))})")
    print("  —— 成就纪录 ——")

    def wdetail(w):
        if w.get("segs"):
            return " ".join(s.get("b") or s.get("t", "") for s in w["segs"])
        if w.get("song"):
            return f"第{w.get('edition_no')}届 {w.get('artist','')} — {w.get('song','')}"
        return w.get("detail", "")

    for k, r in awards.items():
        head = f"  {r['title']}（{r['metric']}）" + (f"  共 {len(r['winners'])} 项" if r.get("type") == "list" else f"  {r['val']}{r['unit']}")
        print(head)
        for w in r["winners"]:
            d = wdetail(w)
            print(f"      · {w['nickname']}" + (f"：{d}" if d else ""))


if __name__ == "__main__":
    main()
