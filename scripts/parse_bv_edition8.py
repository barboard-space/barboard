#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第八届 (CSV: 8A / 8B 两组) → regular-08.json.

格式特点：
- 列：大妈(选送者) / 排名 / 歌曲(**艺人 - 歌名 合并**) / 语种 / [投票人…] / 分数。语种由 CSV 提供。
- 歌曲列按 ` - ` 拆分 artist/song。
- 混淆：仅 8A 2 首（选送者含「混淆」）；8B 无混淆。
- ⭐ 8B「合报 + 50% 投票折算」（与用户确认）：
  · 雨妈/兔妈 合报 Foals — Exits、包妈/泰妈 合报 Sylar — All or Nothing（member 含 `/`，计入两人吧视）。
  · 这 4 人在 B 组可分别投票，但每人投票按 50% 折算 —— **CSV 里这 4 人的投票格已是 ×0.5 半值**（如兔妈 0.5/1.5/4/6 = 1/3/8/12 的一半）。
  · score（最终得分）= 含半值的各票和（= CSV 分数，带 .5 小数）；jury/tele 同为半值和。
  · **计分板各格显示「折算前 12 分原始版」**：把这 4 人的格 ×2 还原成标准 12 分存入 votes.points（其余投票人原值）。
    → 计分板 Total 仍显 score（折算后），格内为折算前原始分，加 note 说明（同 ed5/ed7 折算模式）。
  · 排名按 score 原始小数比较（recompute_bv_ranks），显示 fmtScore 四舍五入取整。
- 8A 无折算（score = 各票和 = 分数，整数）。
- eid 键 points（#140）。脏字符（如 8B 布妈行的 `·`）按 0 处理。
- ⚠️ 名次仅临时；导入后须跑 recompute_bv_ranks.py（SOP 第 5 步）。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 8'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-08.json')
GROUPS = [('Barvision_8A.csv', 'A', '小众组'), ('Barvision_8B.csv', 'B', '中众组')]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈',
           '神妈': '匿名', '隐妈': '匿名', '神隐妈': '匿名'}  # 神妈=匿名大妈（id 0 unclaimed，与用户确认）
HALVED_B = {'雨妈', '兔妈', '包妈', '泰妈'}  # 仅 B 组：这 4 人投票 ×0.5（CSV 已半值，points 还原 ×2）
ANON = '匿名'; ANON_INFO = {'id': 0, 'handle': '匿名', 'unclaimed': True}
# 源 CSV typo 修正（用户核对版）；键 (artist, song) 用拆分+fix_feat 后的值匹配
TEXT_FIX = {
    ('Aitana & Cali Y EI Dandee', '+'): ('Aitana & Cali Y El Dandee', '+'),  # EI → El（El Dandee）
}

def load_members():
    m = {}
    with open(os.path.join(BASE, 'data', 'members', 'members.csv'), encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            nick = (row['barboard_name'] or '').strip(); sid = (row['space_id'] or '').strip()
            handle = (row['space_name'] or '').strip()
            if nick and sid: m[nick] = {'id': int(sid), 'handle': handle or nick}
    return m
MEMBERS = load_members()
SEEN = {}; UNRESOLVED = set(); WARN = []

def norm(n):
    n = (n or '').strip().replace('\xa0', '')
    return ALIASES.get(n, n)

def resolve(nick):
    if not nick: return None
    parts = nick.split('/') if '/' in nick else [nick]
    rid = None
    for p in parts:
        if p == ANON:
            SEEN[ANON] = ANON_INFO
            if rid is None and '/' not in nick: rid = 0
            continue
        info = MEMBERS.get(p)
        if info is None: UNRESOLVED.add(p)
        else:
            SEEN[p] = info
            if rid is None and '/' not in nick: rid = info['id']
    return rid

def mid_of(member):
    if '/' in member: return None
    if member == ANON: return 0
    return MEMBERS.get(member, {}).get('id')

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '分数' in txt: return list(csv.reader(io.StringIO(txt)))
    raise RuntimeError('decode fail ' + fn)

def split_song(cell):
    cell = cell.strip()
    m = re.split(r'\s*[-–]\s+|\s+[-–]\s*', cell, maxsplit=1)
    return (m[0].strip(), m[1].strip()) if len(m) == 2 else ('', cell)

def strip_shadow(s):
    s = (s or '').strip(); is_sh = '混淆' in s
    s = re.sub(r'[\(（].*?[\)）]', '', s).replace('混淆', '').strip()
    return norm(s), is_sh

FEAT_RE = re.compile(r'\(\s*ft\.?\s*', re.I)
def fix_feat(song): return FEAT_RE.sub('(feat. ', song).strip()

def num(v):
    v = (v or '').strip()
    if not v: return 0
    try: f = float(v)
    except Exception: return 0  # 脏字符（如 ·）按 0
    return int(f) if f == int(f) else round(f, 1)

def build_match(fn, group, venue):
    rows = load_csv(fn); h = [c.strip() for c in rows[0]]
    si = h.index('分数')
    ci_lang = h.index('语种')
    voters = [norm(h[i]) for i in range(ci_lang + 1, si)]
    halved = HALVED_B if group == 'B' else set()
    data = []
    for r in rows[1:]:
        sub_raw = r[0].strip()
        if not sub_raw or len(r) < 4 or not r[2].strip(): continue
        member, is_sh = strip_shadow(sub_raw)
        artist, song = split_song(r[2]); song = fix_feat(song)
        artist, song = TEXT_FIX.get((artist, song), (artist, song))
        score = num(r[si]) if len(r) > si else num(r[-1])
        cells = {}        # CSV 值（B 组 4 人为半值）→ 计分（jury/tele/score）
        cells_orig = {}   # 计分板显示用：B 组 4 人 ×2 还原 12 分原始版
        for idx, v in enumerate(voters):
            ci = ci_lang + 1 + idx
            x = num(r[ci]) if ci < len(r) else 0
            if x == 0: continue
            cells[v] = x
            cells_orig[v] = round(x * 2, 1) if v in halved else x
        data.append(dict(member=member, shadow=is_sh, artist=artist, song=song,
                         lang=r[ci_lang].strip() or '英语', cells=cells, orig=cells_orig, score=score))
    jury_set = set()
    for d in data:
        if d['shadow']: continue
        for p in (d['member'].split('/') if '/' in d['member'] else [d['member']]):
            jury_set.add(p)

    def is_self(v, member):
        return v == member or ('/' in member and v in member.split('/'))

    entries = []
    for i, d in enumerate(data):
        resolve(d['member'])
        mid = mid_of(d['member'])
        raw = sum(p for v, p in d['cells'].items() if not is_self(v, d['member']))
        if abs(raw - d['score']) > 0.001:
            WARN.append('%s%s「%s」raw=%g ≠ 分数=%g' % (group, '混淆' if d['shadow'] else '', d['song'], raw, d['score']))
        jury = sum(p for v, p in d['cells'].items() if not is_self(v, d['member']) and v in jury_set)
        tele = round(d['score'] - jury, 1)
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': d['score'],
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
    # 临时名次（recompute_bv_ranks.py 覆盖）
    official = [e for e in entries if not e['is_shadow']]
    official.sort(key=lambda e: (-e['score'], -e['tele_vote']))
    for i, e in enumerate(official, 1): e['rank'] = i
    shadows = [e for e in entries if e['is_shadow']]
    by_base = {}
    for e in shadows:
        base = sum(1 for o in official if o['score'] >= e['score']) + 1
        by_base.setdefault(base, []).append(e)
    for base, grp in by_base.items():
        grp.sort(key=lambda e: -e['score'])
        for j, e in enumerate(grp): e['rank'] = base + j
    entries.sort(key=lambda e: (-e['score'], 1 if e['is_shadow'] else 0, -e['tele_vote']))

    # votes.points = 计分板原始 12 分版（B 组 4 人 ×2）
    voter_objs = []
    for v in voters:
        pts = {}
        for i, d in enumerate(data):
            if is_self(v, d['member']): continue
            p = d['orig'].get(v)
            if p: pts[i] = p
        if not pts: continue
        resolve(v)
        voter_objs.append({'voter': v, 'type': 'jury' if v in jury_set else 'tele', 'points': pts})

    note = None
    if group == 'B':
        note = ('本组 雨妈、兔妈、包妈、泰妈 为合报搭档（雨妈/兔妈 合报 Foals — Exits、'
                '包妈/泰妈 合报 Sylar — All or Nothing），四人可分别投票但其投票均按 50% 折算计入最终得分；'
                '计分板各格显示折算前的原始投票分（12 分制），最终得分（Total）为折算后。')
    return entries, {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voter_objs}, note

def champ(ents):
    o = sorted([e for e in ents if not e['is_shadow']], key=lambda e: e['rank'])
    return o[0] if o else None

def main():
    matches = []
    for fn, group, venue in GROUPS:
        ents, votes, note = build_match(fn, group, venue)
        m = {'match': group, 'venue': venue, 'entries': ents, 'votes': votes}
        if note: m['note'] = note
        matches.append(m)
    cs = [champ(m['entries']) for m in matches]
    def cstr(e): return '%s选送的 %s — %s（%g 分）' % (e['member'], e['artist'], e['song'], round(e['score']))
    n_members = len(SEEN)
    n_songs = sum(len([e for e in m['entries'] if not e['is_shadow']]) for m in matches)
    summary = ('第八届 Barvision 设 A（小众）、B（中众）两组并行，各组独立计分与排名。'
               '本届共 %d 位成员选送 %d 首正式作品，小众组冠军是%s，中众组冠军为%s。'
               '中众组 雨妈与兔妈、包妈与泰妈 分别合报参赛。') % (
        n_members, n_songs, cstr(cs[0]), cstr(cs[1]))
    data = {
        'year': 2020, 'edition_no': 8, 'edition_name': 'The 8th Barvision',
        'cn_name': '第八届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {
            'submission': '针对 lead 艺人分 A（小众）/ B（中众）两组报名；A、B 组各设 2 个混淆项名额（先报先得、每位评委最多 1 首）。报名私戳小妈并对所报歌曲保密。',
            'niche_standard': [
                'A 小众｜云村评论≤600·收藏≤7500(华语20k)·Spotify 月听众≤2.1M/单曲≤5M·YT 订阅≤2M/MV≤7.5M·BB·UK 无 Top100·MT 进榜≤5',
                'B 中众｜评论≤2000·收藏≤30000(华语40k)·月听众≤8M/单曲≤28M·YT≤6M/MV≤35M·BB·UK 最高 20·MT≤10',
                'lead 艺人无格莱美四大通类提名；报名歌曲不得进过吧半年榜/年终榜 Top100',
                'feat 艺人 BB Hot100/UK 限制：A 组无 Top50 或在榜>24 周 · B 组无 Top10 或>40 周',
                '发行时间 2016.8.28–2020.2.28',
            ],
            'format': 'A、B 两组分开比赛、独立计分与排名，最终成绩不综合各组。混淆项参与评分但不计入排名。',
            'voting': '欧视制（计分 12/10/8/7/6/5/4/3/2/1）；每位评委上交 Top12 排名；选送者互投为 Jury、其余观众为 Tele。报名参赛的评委必须提交排名，否则其歌曲取消最终排名资格。中众组合报搭档（雨妈/兔妈、包妈/泰妈）四人可分别投票，投票按 50% 折算计入最终得分。',
        },
        'source': '第八届赛果（8A 小众 / 8B 中众 逐票汇总）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B 两组独立计分排名；混淆单曲不计入排名；中众组合报搭档（雨妈/兔妈、包妈/泰妈）四人可分别投票，投票按 50% 折算计入最终得分（计分板格内为折算前 12 分原始分）。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    if WARN:
        print('⚠️ raw≠分数:'); [print('   ', w) for w in WARN]
    else:
        print('校验: 所有 raw == 分数 ✓')
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        if m.get('note'): print('   note:', m['note'][:60], '…')
        for e in m['entries']:
            print('  #%-4s %-10s J=%-5g T=%-5g 总=%-6g %s — %s%s' % (
                str(e['rank']) + ('*' if e['is_shadow'] else ''), e['member'][:10],
                e['jury_vote'], e['tele_vote'], e['score'],
                e['artist'][:16], e['song'][:22], ' [混淆]' if e['is_shadow'] else ''))

if __name__ == '__main__':
    main()
