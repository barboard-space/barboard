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
MEMBERS_CSV = os.path.join(os.path.dirname(__file__), "..", "data", "members", "members.csv")
# 修正表（歌手/歌名规范化的唯一维护源，见该文件顶部说明）
from annual_corrections import KEEP, ABBR_OVERRIDE, ARTIST_FIX, SONG_FIX_EXACT, SONG_FIX_SUB


# Title-Case 修复：撇号后的英文缩写/所有格被误大写（'S 'T 'M 'D 'Re 'Ve 'Ll）→ 小写
# 只改这些确定的缩写后缀，避开 O'Brien / D'Angelo / T'Aime 等名字/外语（其后非缩写词，不匹配）
_APOS_RE = re.compile(r"'(S|T|M|D|Re|Ve|Ll)\b")


def fix_text(s):
    return _APOS_RE.sub(lambda m: "'" + m.group(1).lower(), s)


_FEAT_RE = re.compile(r"\s+(?:feat|ft)\.?\s*", re.I)  # feat/ft → 逗号分隔


def _keep_split(s):
    tmp = s
    for i, k in enumerate(KEEP):
        tmp = tmp.replace(k, "\x00%d\x00" % i)
    out = []
    for p in tmp.split(","):
        p = p.strip()
        for i, k in enumerate(KEEP):
            p = p.replace("\x00%d\x00" % i, k)
        if p:
            out.append(p)
    return out


def norm_artist(s):
    s = _FEAT_RE.sub(", ", fix_text(s))          # feat/ft → 逗号
    parts = [ARTIST_FIX.get(p, p) for p in _keep_split(s)]  # 逐艺人官方写法
    return ", ".join(parts)                       # 统一「逗号 + 空格」


def norm_song(s):
    s = fix_text(s)
    s = SONG_FIX_EXACT.get(s, s)
    for a, b in SONG_FIX_SUB.items():
        s = s.replace(a, b)
    return s


def ckey(artist, song):
    """封面缓存键：归一（去大小写/空格/标点，保留字母数字与 CJK）→ 改格式/大小写不失效。"""
    n = lambda x: re.sub(r"\W+", "", x.lower(), flags=re.UNICODE)
    return n(artist) + "|" + n(song)


def build_abbr2id(abbrs):
    """把总榜里的个人榜简称（松/威/N/时…）映射到 space_id。"""
    import csv as _csv
    mem = []
    with open(MEMBERS_CSV, encoding="utf-8-sig") as f:
        rd = _csv.reader(f)
        next(rd)
        for r in rd:
            if r and r[0]:
                mem.append((int(r[0]), r[1]))
    out, miss = {}, []
    for a in abbrs:
        if a in ABBR_OVERRIDE:
            out[a] = ABBR_OVERRIDE[a]
            continue
        c = [sid for sid, name in mem if name == a + "妈" or (name and name[0] == a)]
        if len(c) == 1:
            out[a] = c[0]
        else:
            miss.append(a)
    if miss:
        sys.stderr.write("  ! 简称未唯一匹配 %d 个: %s\n" % (len(miss), miss))
    return out


_SPLIT_RE = re.compile(r"\s*(?:,|/|&|、|×|\bfeat\.?|\bft\.?|\bwith\b|\bx\b)\s*", re.I)
_PAREN_RE = re.compile(r"\s*[\(（\[][^\)）\]]*[\)）\]]")


def _primary_artist(artist):
    """取第一位主唱（feat/ft/with/,/&/、 之前）。"""
    parts = _SPLIT_RE.split(artist)
    return (parts[0] if parts else artist).strip() or artist


def _strip_paren(song):
    """去掉歌名里的括号补充（(feat. X) / (From The Series...) 等）。"""
    return _PAREN_RE.sub("", song).strip() or song


def _norm(s):
    """归一：仅保留字母数字与 CJK，用于歌名相近校验。"""
    return re.sub(r"[^a-z0-9一-鿿]+", "", (s or "").lower())


def _artwork(r):
    a = r.get("artworkUrl100") or r.get("artworkUrl60") or r.get("artworkUrl30")
    if not a:
        return None
    return re.sub(r"/\d+x\d+bb\.", "/600x600bb.", a)


def _fetch_itunes(term, limit=5):
    """查 iTunes（song 实体）；网络错误退避重试一次；每次真实请求后礼貌 sleep。"""
    url = "https://itunes.apple.com/search?term=%s&entity=song&limit=%d" % (
        urllib.parse.quote(term[:180]), limit)
    for attempt in range(2):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
            d = json.load(urllib.request.urlopen(req, timeout=15))
            time.sleep(0.4)
            return d.get("results", [])
        except Exception as e:
            if attempt == 0:
                time.sleep(2.5)  # 疑似限流，退避后重试
                continue
            sys.stderr.write("  ! cover fetch fail [%s]: %s\n" % (term[:60], e))
            time.sleep(0.4)
    return []


def itunes_cover(artist, song, cache):
    key = ckey(artist, song)
    if key in cache:
        return cache[key]
    pa, sp = _primary_artist(artist), _strip_paren(song)
    # 多级回退：完整艺人+歌名 → 主艺人+歌名 → 主艺人+去括号歌名
    terms = []
    for a in (artist, pa):
        for s in (song, sp):
            t = a + " " + s
            if t not in terms:
                terms.append(t)
    art = None
    for term in terms:
        for r in _fetch_itunes(term):
            art = _artwork(r)
            if art:
                break
        if art:
            break
    # 末级回退：仅歌名，但校验返回曲名与目标相近，避免误配到同名别曲
    if not art:
        ns, nsp = _norm(song), _norm(sp)
        for r in _fetch_itunes(song, limit=8):
            tn = _norm(r.get("trackName", ""))
            if tn and (ns in tn or tn in ns or (nsp and nsp in tn)):
                art = _artwork(r)
                if art:
                    break
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
    # 成员个人榜列（'求和项:<简称>排名' + 末尾 '盲排名'）→ col_index -> space_id
    abbrs = [str(h).replace("求和项:", "").replace("排名", "")
             for h in header[5:] if h and str(h).endswith("排名")]
    abbr2id = build_abbr2id(abbrs)
    rank_cols = {}
    for i, h in enumerate(header):
        if i >= 5 and h and str(h).endswith("排名"):
            a = str(h).replace("求和项:", "").replace("排名", "")
            if a in abbr2id:
                rank_cols[i] = abbr2id[a]
    # 复用已有 JSON 里「已命中」的封面（不缓存 null）→ 每次重跑只重试缺封面项、不动已命中的
    fp = os.path.join(OUT_DIR, year + ".json")
    cache = {}
    if os.path.exists(fp):
        try:
            old = json.load(open(fp, encoding="utf-8"))
            for oe in old.get("entries", []):
                if oe.get("cover"):
                    cache[ckey(oe["artist"], oe["song"])] = oe["cover"]
        except Exception:
            pass
    # 也复用成员年榜索引里已抓到的 top10 封面（含 Top200 之外的私榜曲），避免重复请求
    midx_path = os.path.join(OUT_DIR, "member-annual-index.json")
    if os.path.exists(midx_path):
        try:
            mold = json.load(open(midx_path, encoding="utf-8"))
            for ydata in mold.values():
                for mv in ydata.values():
                    for te in mv.get("top10", []):
                        if te.get("cover"):
                            cache[ckey(te["artist"], te["song"])] = te["cover"]
        except Exception:
            pass
    # 名次：整数=欧美占位曲；字符串带星（如 34* / 145**）=亚洲单曲（华语/K-POP），不占位、只插入展示
    STAR_RE = re.compile(r"^\s*(\d+)\s*(\**)")
    all_rows = list(rows)
    entries = []
    for row in all_rows:
        rk_raw = row[ci["rank"]]
        star = 0
        if isinstance(rk_raw, (int, float)):
            rk = int(rk_raw)
        elif isinstance(rk_raw, str):
            m = STAR_RE.match(rk_raw)
            if not m:
                continue
            rk = int(m.group(1))
            star = len(m.group(2))
        else:
            continue
        if rk < 1 or rk > top:
            continue
        artist = norm_artist(str(row[ci["artist"]] or "").strip())
        song = norm_song(str(row[ci["song"]] or "").strip())
        if not artist or not song:
            continue
        e = {"rank": rk, "artist": artist, "song": song,
             "points": round(float(row[ci["pts"]] or 0), 1),
             "assists": int(row[ci["assist"]]) if ci["assist"] is not None and row[ci["assist"]] is not None else None,
             "cover": None}
        if star:
            e["star"] = star
        # 个人榜冠军数：多少位大妈把这首歌排在其个人榜第 1（no1_by = 这些大妈的 space_id）
        no1_by = sorted(sid for col, sid in rank_cols.items()
                        if isinstance(row[col], (int, float)) and int(row[col]) == 1)
        if no1_by:
            e["no1"] = len(no1_by)
            e["no1_by"] = no1_by
        if not nocover:
            e["cover"] = itunes_cover(artist, song, cache)
            sys.stderr.write("  %3d%s. %s — %s  %s\n" % (rk, "*" * star, artist, song, "✓" if e["cover"] else "—"))
        entries.append(e)
    entries.sort(key=lambda x: (x["rank"], x.get("star", 0)))
    out = {"year": int(year), "title": "%s 榜吧年终榜" % year, "count": len(entries), "entries": entries}
    os.makedirs(OUT_DIR, exist_ok=True)
    with open(fp, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    covered = sum(1 for e in entries if e["cover"])
    print("写出 %s | %d 条 | 封面命中 %d/%d" % (fp, len(entries), covered, len(entries)))

    # ── 成员年榜聚合 → data/annual/member-annual-index.json（个人主页「个人年榜」板块）──
    TIERS = [10, 20, 50, 100, 200]
    sids = sorted(set(rank_cols.values()))
    top10 = {s: [] for s in sids}                         # 个人榜前十：其个人名次 1..10 的歌
    assist = {s: {t: 0 for t in TIERS} for s in sids}     # 助攻分档（占位/欧美曲）：按年榜名次累计（前 N）
    assist_sh = {s: {t: 0 for t in TIERS} for s in sids}  # 助攻分档（亚洲不占位曲）：单独统计、括号标注
    for row in all_rows:
        rk_raw = row[ci["rank"]]
        star = 0
        if isinstance(rk_raw, (int, float)):
            rk = int(rk_raw)
        elif isinstance(rk_raw, str):
            mm = STAR_RE.match(rk_raw)
            if not mm:
                continue
            rk = int(mm.group(1))
            star = len(mm.group(2))
        else:
            continue
        if rk < 1:
            continue
        artist = norm_artist(str(row[ci["artist"]] or "").strip())
        song = norm_song(str(row[ci["song"]] or "").strip())
        if not artist or not song:
            continue
        for col, sid in rank_cols.items():
            v = row[col]
            if not isinstance(v, (int, float)):
                continue
            pr = int(v)
            if 1 <= pr <= 10:                             # 个人榜前十
                top10[sid].append((pr, artist, song))
            tgt = assist if star == 0 else assist_sh      # 占位曲计主数 / 亚洲不占位曲计括号
            for t in TIERS:
                if rk <= t:
                    tgt[sid][t] += 1
    magg = {}
    for sid in sids:
        lst = sorted(top10[sid], key=lambda x: x[0])[:10]
        if not lst and not any(assist[sid].values()) and not any(assist_sh[sid].values()):
            continue
        t10 = []
        for r, a, s in lst:
            t10.append({"rank": r, "artist": a, "song": s,
                        "cover": (None if nocover else itunes_cover(a, s, cache))})
        m = {"assists": {"t%d" % t: assist[sid][t] for t in TIERS}, "top10": t10}
        if any(assist_sh[sid].values()):
            m["assists_shadow"] = {"t%d" % t: assist_sh[sid][t] for t in TIERS}
        magg[str(sid)] = m
    idx_path = os.path.join(OUT_DIR, "member-annual-index.json")
    idx = {}
    if os.path.exists(idx_path):
        try:
            idx = json.load(open(idx_path, encoding="utf-8"))
        except Exception:
            idx = {}
    idx[year] = magg
    with open(idx_path, "w", encoding="utf-8") as f:
        json.dump(idx, f, ensure_ascii=False, indent=1)
    print("成员年榜聚合 → %s | %d 位大妈" % (idx_path, len(magg)))


if __name__ == "__main__":
    main()
