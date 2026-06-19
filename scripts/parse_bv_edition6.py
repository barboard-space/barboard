#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第六届 (CSV: 6A / 6B / 6C 三组) → regular-06.json.

格式特点（与五届不同）：
- 列：排名 / 评委(选送者) / 歌曲(**艺人 - 歌名 合并**) / 语种 / 投票人列… / 总分。
- 语种由 CSV 提供（不猜）；歌曲列按 ` - `/` -`/`- ` 拆分 artist/song（避开 P3GI-13 等内部连字符）。
- 6A 空缺用 `0`、6B/6C 留空——均视为无票（只取正分）。score=各正分和(排自投)=CSV 总分（已校验，无折算）。
- 混淆曲：选送者含「混淆」（`猴妈混淆` 或 `音妈（混淆）`）；非正式、不计排名、并排名次。
- 昵称归一：淋檬/柠檬→柠妈、绿萌→萌妈、院长→院妈、可乐→乐妈。新成员威妈/鹿妈/蛋妈/奶妈/嘟妈 在册。
- ⚠️ 名次仅临时；导入后须跑 recompute_bv_ranks.py（全局 Eurovision 平局规则，SOP 第 5 步）。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 6'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-06.json')
GROUPS = [('Barvision_6A.csv', 'A', '小众组'), ('Barvision_6B.csv', 'B', '中众组'), ('Barvision_6C.csv', 'C', '大众组')]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈'}

def load_members():
    m = {}
    with open(os.path.join(BASE, 'data', 'members', 'members.csv'), encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            nick = (row['barboard_name'] or '').strip(); sid = (row['space_id'] or '').strip()
            handle = (row['space_name'] or '').strip()
            if nick and sid: m[nick] = {'id': int(sid), 'handle': handle or nick}
    return m
MEMBERS = load_members()
SEEN = {}; UNRESOLVED = set()

def norm(n):
    n = (n or '').strip(); return ALIASES.get(n, n)

def resolve(nick):
    if not nick: return None
    info = MEMBERS.get(nick)
    if info is None: UNRESOLVED.add(nick); return None
    SEEN[nick] = info; return info['id']

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '总分' in txt: return list(csv.reader(io.StringIO(txt)))
    raise RuntimeError('decode fail ' + fn)

def split_song(cell):
    cell = cell.strip()
    m = re.split(r'\s*[-–]\s+|\s+[-–]\s*', cell, 1)  # ` - `/` -`/`- `；避开内部无空格连字符
    return (m[0].strip(), m[1].strip()) if len(m) == 2 else ('', cell)

def strip_shadow(s):
    s = s.strip(); is_sh = '混淆' in s
    s = re.sub(r'[\(（].*?[\)）]', '', s).replace('混淆', '').strip()
    return norm(s), is_sh

def num(v):
    f = float(v); return int(f) if f == int(f) else round(f, 1)

def build_match(fn, match, venue):
    rows = load_csv(fn); h = rows[0]
    tcol = h.index('总分')
    voters = [norm(h[i]) for i in range(4, tcol)]
    data = []
    for r in rows[1:]:
        if len(r) <= tcol or not r[1].strip() or not r[2].strip(): continue
        member, is_sh = strip_shadow(r[1])
        artist, song = split_song(r[2])
        cells = {}
        for i in range(4, tcol):
            c = r[i].strip()
            if not c: continue
            p = num(c)
            if p > 0: cells[voters[i - 4]] = p  # 0/空 = 无票
        data.append(dict(member=member, shadow=is_sh, artist=artist, song=song,
                         lang=r[3].strip() or '英语', cells=cells))
    jury_set = {d['member'] for d in data if not d['shadow']}
    entries = []
    for i, d in enumerate(data):
        resolve(d['member'])
        mid = None if '/' in d['member'] else MEMBERS.get(d['member'], {}).get('id')
        raw = sum(p for v, p in d['cells'].items() if v != d['member'])
        jury = sum(p for v, p in d['cells'].items() if v != d['member'] and v in jury_set)
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': raw - jury, 'score': raw,
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
    # 临时名次（recompute_bv_ranks.py 会按全局平局规则覆盖）
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
    voter_objs = []
    for v in voters:
        pts = {}
        for i, d in enumerate(data):
            if v == d['member']: continue
            p = d['cells'].get(v)
            if p is not None: pts[i] = p
        if not pts: continue
        resolve(v)
        voter_objs.append({'voter': v, 'type': 'jury' if v in jury_set else 'tele', 'points': pts})
    return entries, {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voter_objs}

def champ(ents):
    o = sorted([e for e in ents if not e['is_shadow']], key=lambda e: e['rank'])
    return o[0] if o else None

def main():
    matches = []
    for fn, match, venue in GROUPS:
        ents, votes = build_match(fn, match, venue)
        matches.append({'match': match, 'venue': venue, 'entries': ents, 'votes': votes})
    cs = [champ(m['entries']) for m in matches]
    def cstr(e): return '%s选送的 %s — %s（%g 分）' % (e['member'], e['artist'], e['song'], e['score'])
    summary = ('第六届 Barvision 续设 A（小众）、B（中众）、C（大众）三组并行，各组独立计分与排名。'
               '本届共有 %d 位成员选送 %d 首正式作品，A 组冠军是%s，B 组冠军为%s，C 组冠军为%s。') % (
        len(SEEN), sum(len([e for e in m['entries'] if not e['is_shadow']]) for m in matches),
        cstr(cs[0]), cstr(cs[1]), cstr(cs[2]))
    data = {
        'year': 2020, 'edition_no': 6, 'edition_name': 'The 6th Barvision',
        'cn_name': '第六届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {
            'submission': '针对 lead 艺人分 A（小众）/ B（中众）/ C（大众）三组报名，发行时间 2016.1.1–2019.10；A、B 组各设 2 个混淆项名额（先报先得、每人最多 1 首），C 组不设混淆。大众组提倡报小众单曲、不提倡家喻户晓的歌。报名私戳杰妈并对所报歌曲保密。',
            'niche_standard': [
                'A 小众｜云村评论≤500·收藏≤20000·Spotify 月听众≤2.5M/单曲≤5M·YT 订阅≤2.5M/MV≤7.5M·BB 无 Top50·UK 无 Top40·MT 进榜≤5',
                'B 中众｜评论≤1000·收藏≤30000·月听众≤5M/单曲≤25M·YT≤5M/MV≤50M·BB·UK 无 Top10·MT≤10',
                'C 大众｜评论≤2500·收藏≤50000·月听众≤10M/单曲≤50M·YT≤10M/MV≤100M·BB·UK 近三年无 Top10·MT≤15',
                'lead 艺人无格莱美四大通类提名；不得进过吧半年榜/年榜 Top100；C 组艺人近三年未进吧榜/吧半年榜',
                'feat 艺人不得有 BB Hot100/UK：A·B 组 Top10 或在榜>40 周 · C 组 冠单 或>52 周',
            ],
            'format': 'A、B、C 三组分开比赛、独立计分与排名，最终成绩不综合各组。A、B 组混淆项参与评分但不计入排名；C 组不设混淆。',
            'voting': '欧视制（计分 12/10/8/7/6/5/4/3/2/1）；A、B 组列 Top12、C 组列 Top10；选送者互投为 Jury、其余观众为 Tele。报名参赛的评委必须提交排名，否则其歌曲取消最终排名资格。',
        },
        'source': '第六届赛果（6A 小众 / 6B 中众 / 6C 大众 逐票汇总）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B/C 三组独立计分排名；混淆单曲不计入排名，其票可由投票人等额再投正式单曲一次。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('summary:', summary)
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        for e in m['entries']:
            print('  #%2s %-6s J=%-3s T=%-3s 总=%-4s %s%s' % (
                e['rank'], e['member'][:6], e['jury_vote'], e['tele_vote'], e['score'],
                (e['artist'] + ' - ' + e['song'])[:34], ' [混淆]' if e['is_shadow'] else ''))

if __name__ == '__main__':
    main()
