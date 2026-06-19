#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第十一届 (CSV: 11A / 11B 两组) → regular-11.json.

⚠️ 同九/十届：无规则书（rules `{}` 跳过赛制）、按原始记录呈现、score=总分、**max 模式 12 分**（voter.top）。
- 列：选送者 / **Artist(s) / Title**（独立两列，不拆分） / 语种 / [投票人小分] / 总分。语种由 CSV 提供。
- **本届无混淆单曲、无折算、无半值**；小分接近标准欧视值。
- **11A 联合「雨妈 雀妈」合报**（空格分隔）：二人**合体给分**——一个联合投票列、**100% 计入、不折算**（区别于
  ed10 分开投票×0.5）。member/voter 归一为「雨妈/雀妈」；jury_set 含完整串以匹配联合投票列。
- **匿名多身份**：`is_anon`= 含「匿名」/含「隐妈」/∈{神妈,神隐妈}。11A 匿名1/匿名2（选送+投票）；
  11B 隐妈三号（选送 Girls + 投票，隐妈3号→隐妈三号归一）+ 神妈（仅观众投票）。全局编号 number_anon.py：
  匿名1=#7、匿名2=#8、隐妈三号=#9、神妈=#10（接 ed10 的 #6）。
- Z妈/A妈/虎妈/圈妈/雪妈 均为在册真成员（非匿名）。eid 键 points。⚠️ 导入后须跑 recompute + number_anon。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 11'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-11.json')
GROUPS = [('Barvision_11A.csv', 'A', '小众组'), ('Barvision_11B.csv', 'B', '中众组')]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈',
           '季风': '季妈', '隐妈3号': '隐妈三号'}

def is_anon(n):
    return ('匿名' in n) or ('隐妈' in n) or n in ('神妈', '神隐妈')

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

def norm1(n):
    n = (n or '').strip().replace('\xa0', '')
    return ALIASES.get(n, n)

def norm_name(n):
    """单名归一；联合（空格/&//分隔）→『A/B』。"""
    n = (n or '').strip().replace('\xa0', ' ')
    parts = [p for p in re.split(r'[&/\s]+', n) if p]
    if len(parts) > 1: return '/'.join(norm1(p) for p in parts)
    return norm1(n)

def resolve(nick):
    if not nick: return None
    parts = nick.split('/') if '/' in nick else [nick]
    rid = None
    for p in parts:
        if is_anon(p):
            SEEN[p] = {'id': 0, 'handle': p, 'unclaimed': True}
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
    if is_anon(member): return 0
    return MEMBERS.get(member, {}).get('id')

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '总分' in txt: return list(csv.reader(io.StringIO(txt)))
    raise RuntimeError('decode fail ' + fn)

FEAT_RE = re.compile(r'\(\s*ft\.?\s*', re.I)
def fix_feat(song): return FEAT_RE.sub('(feat. ', song or '').strip()

def num(v):
    v = (v or '').strip()
    if not v: return 0
    try: f = float(v)
    except Exception: return 0
    return int(f) if f == int(f) else round(f, 2)

def is_self(v, member):
    return v == member or ('/' in member and v in member.split('/'))

def build_match(fn, group, venue):
    rows = load_csv(fn); h = [c.strip() for c in rows[0]]
    ci_sub = h.index('选送者'); ci_art = h.index('Artist(s)'); ci_song = h.index('Title')
    ci_lang = h.index('语种'); ci_tot = h.index('总分')
    voters = [norm_name(h[i]) for i in range(ci_lang + 1, ci_tot)]
    data = []
    for r in rows[1:]:
        if len(r) <= ci_tot or not r[ci_sub].strip(): continue
        raw_sub = r[ci_sub].strip(); is_sh = '混淆' in raw_sub
        member = norm_name(re.sub(r'混淆', '', raw_sub).strip())
        cells = {}
        for idx, v in enumerate(voters):
            x = num(r[ci_lang + 1 + idx]) if ci_lang + 1 + idx < len(r) else 0
            if x: cells[v] = x
        data.append(dict(member=member, shadow=is_sh, artist=r[ci_art].strip(),
                         song=fix_feat(r[ci_song].strip()), lang=r[ci_lang].strip() or '英语',
                         cells=cells, score=num(r[ci_tot])))
    jury_set = set()
    for d in data:
        if d['shadow']: continue
        jury_set.add(d['member'])  # 完整串（联合投票列匹配）
        for p in d['member'].split('/'): jury_set.add(p)
    entries = []
    for i, d in enumerate(data):
        resolve(d['member'])
        raw = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member'])), 2)
        if abs(raw - d['score']) > 0.05:
            WARN.append('%s「%s」各小分和 %g ≠ 总分 %g' % (group, d['song'], raw, d['score']))
        jury = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member']) and v in jury_set), 2)
        entries.append({
            'member': d['member'], 'member_id': mid_of(d['member']), 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': round(raw - jury, 2), 'score': d['score'],
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
    official = [e for e in entries if not e['is_shadow']]
    official.sort(key=lambda e: (-e['score'], -e['tele_vote']))
    for i, e in enumerate(official, 1): e['rank'] = i
    shadows = [e for e in entries if e['is_shadow']]
    for e in shadows:
        e['rank'] = sum(1 for o in official if o['score'] >= e['score']) + 1
    entries.sort(key=lambda e: (-e['score'], 1 if e['is_shadow'] else 0, -e['tele_vote']))

    official_eids = [e['eid'] for e in entries if not e['is_shadow']]
    score_by_eid = {e['eid']: e['score'] for e in entries}
    voter_objs = []
    for v in voters:
        pts = {}
        for i, d in enumerate(data):
            if is_self(v, d['member']): continue
            p = d['cells'].get(v)
            if p: pts[i] = p
        if not pts: continue
        resolve(v)
        cand = [(eid, pts[eid]) for eid in official_eids if eid in pts]
        top = max(cand, key=lambda t: (t[1], score_by_eid.get(t[0], 0), -t[0]))[0] if cand else None
        vo = {'voter': v, 'type': 'jury' if v in jury_set else 'tele', 'points': pts}
        if top is not None: vo['top'] = top
        voter_objs.append(vo)

    note = None
    if group == 'A':
        note = ('雨妈、雀妈 合报参赛，二人合体给分（其联合投票按一票 100% 计入、不折算）；本届各小分按原始记录呈现。')
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
    def cstr(e):
        who = '一位匿名成员' if is_anon(e['member']) else e['member']
        return '%s选送的 %s — %s' % (who, e['artist'], e['song'])
    summary = ('第十一届 Barvision 设 A、B 两组并行，本届无规则文档、计分细节多已不可考。'
               'A 组冠军是%s，B 组冠军为%s；A 组 雨妈与雀妈 合报参赛、两组均有匿名成员选送。') % (
        cstr(cs[0]), cstr(cs[1]))
    data = {
        'year': 2020, 'edition_no': 11, 'edition_name': 'The 11th Barvision',
        'cn_name': '第十一届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {},
        'source': '第十一届赛果（11A / 11B 逐票汇总，无规则文档）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': '本届无规则书：小分按原始记录呈现，总分为权威最终分，无混淆/无折算；11A 雨妈/雀妈 合报且合体给分（联合投票一票 100% 计入）；12 分取各投票人投出最高分的正式曲。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('匿名身份:', [k for k in SEEN if SEEN[k].get('unclaimed')])
    if WARN: print('⚠️', WARN)
    else: print('校验: 所有 raw == 总分 ✓')
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        for e in m['entries']:
            print('  #%-3s %-10s J=%-4g T=%-4g 总=%-5g %s — %s' % (
                e['rank'], e['member'][:10], e['jury_vote'], e['tele_vote'], e['score'],
                e['artist'][:16], e['song'][:22]))

if __name__ == '__main__':
    main()
