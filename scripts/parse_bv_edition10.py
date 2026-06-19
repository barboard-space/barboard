#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第十届 (CSV: 10A / 10B 两组) → regular-10.json.

⚠️ 同第九届：无规则书、折算多不可考 —— 只标注能推理的信息与分数（rules `{}` 跳过赛制板块）。
- 列：Rank / 选送妈 / **歌名-歌手**（反序，需拆 song 在前 artist 在后） / 语种 / [投票人小分] / 分数。
- 小分多为任意值（10A 含 11/13/8.5 等非欧视值）；`分数`(总分) 为权威 score、jury/tele 由小分求和。
- **12 分（同 #9 max 模式）**：每位投票人 12 分 = 其投票列最高正式曲（混淆不计）→ 存 voter.top。
- **10A 合报+50%**：雨妈/包妈 合报（1 正式 Get Back Up + 1 混淆 Paris Tx），二人各自投票、投票 ×0.5
  （CSV 已半值，计分板 ×2 还原显示）；投给混淆的票可继续再投（再投票已在矩阵，直接求和）。
- **10A 70% 折算**（选送未投票者）：苏妈/晕妈/麦妈（总分=各小分和×0.7，自动检测）。混淆：雨妈/包妈、瑞妈、城妈。
- **10B**：匿名#N 多身份（匿名1 选送正式曲+投票=jury；匿名2 仅观众投票=tele）；4 混淆 田/团/雨/猴；无折算/无半值。
- **匿名身份**：`is_anon`（神妈/隐妈/神隐妈 + 匿名\\d*）→ id 0 unclaimed、保留别名；全局编号由 number_anon.py 改写为 匿名#N。
- 洛妈的 13 分不可考、按原值保留。eid 键 points。⚠️ 名次仅临时；导入后须跑 recompute_bv_ranks.py + number_anon.py。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 10'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-10.json')
GROUPS = [('Barvision_10A.csv', 'A', '小众组', {'雨妈', '包妈'}),
          ('Barvision_10B.csv', 'B', '中众组', set())]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈', '季风': '季妈'}
ANON_NAMED = {'神妈', '隐妈', '神隐妈'}

def is_anon(n):
    return n in ANON_NAMED or bool(re.fullmatch(r'匿名\d*', n or ''))

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

def parse_submitter(s):
    s = (s or '').strip(); is_sh = '混淆' in s
    s = re.sub(r'[\(（].*?[\)）]', '', s).replace('混淆', '').strip()
    parts = [p.strip() for p in re.split(r'[&/]', s) if p.strip()]
    parts = [p if is_anon(p) else norm(p) for p in parts]
    return '/'.join(parts), is_sh

def split_sa(cell):
    """『歌名 - 歌手』(反序) → (artist, song)。"""
    parts = re.split(r'\s*[-–]\s+|\s+[-–]\s*', cell.strip(), maxsplit=1)
    if len(parts) == 2: return parts[1].strip(), parts[0].strip()  # artist, song
    return '', cell.strip()

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '分数' in txt: return list(csv.reader(io.StringIO(txt)))
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

def build_match(fn, group, venue, halved):
    rows = load_csv(fn); h = [c.strip() for c in rows[0]]
    ci_sub = h.index('选送妈'); ci_sa = h.index('歌名-歌手')
    ci_lang = h.index('语种'); ci_tot = h.index('分数')
    voters = [norm(h[i]) if not is_anon(h[i]) else h[i].strip() for i in range(ci_lang + 1, ci_tot)]
    data = []
    for r in rows[1:]:
        if len(r) <= ci_tot or not r[ci_sub].strip() or not r[ci_sa].strip(): continue
        member, is_sh = parse_submitter(r[ci_sub])
        artist, song = split_sa(r[ci_sa]); song = fix_feat(song)
        cells = {}; disp = {}
        for idx, v in enumerate(voters):
            x = num(r[ci_lang + 1 + idx]) if ci_lang + 1 + idx < len(r) else 0
            if x == 0: continue
            cells[v] = x
            disp[v] = round(x * 2, 2) if v in halved else x
        data.append(dict(member=member, shadow=is_sh, artist=artist, song=song,
                         lang=r[ci_lang].strip() or '英语', cells=cells, disp=disp, score=num(r[ci_tot])))
    jury_set = set()
    for d in data:
        if d['shadow']: continue
        for p in (d['member'].split('/') if '/' in d['member'] else [d['member']]):
            jury_set.add(p)
    entries = []; folded = []
    for i, d in enumerate(data):
        resolve(d['member'])
        raw = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member'])), 2)
        jury = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member']) and v in jury_set), 2)
        tele = round(raw - jury, 2)
        entries.append({
            'member': d['member'], 'member_id': mid_of(d['member']), 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': d['score'],
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
        if not d['shadow'] and raw > 0 and 0.6 < (d['score'] / raw) < 0.8:  # ≈0.7 折算（未投票）
            folded.append(d['member'])
    # 临时名次（recompute 覆盖）
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

    official_eids = [e['eid'] for e in entries if not e['is_shadow']]
    score_by_eid = {e['eid']: e['score'] for e in entries}
    voter_objs = []
    for v in voters:
        pts = {}
        for i, d in enumerate(data):
            if is_self(v, d['member']): continue
            p = d['disp'].get(v)
            if p: pts[i] = p
        if not pts: continue
        resolve(v)
        cand = [(eid, pts[eid]) for eid in official_eids if eid in pts]
        top = max(cand, key=lambda t: (t[1], score_by_eid.get(t[0], 0), -t[0]))[0] if cand else None
        vo = {'voter': v, 'type': 'jury' if v in jury_set else 'tele', 'points': pts}
        if top is not None: vo['top'] = top
        voter_objs.append(vo)

    notes = []
    if group == 'A':
        notes.append('雨妈、包妈 合报参赛（1 首正式 + 1 首混淆），二人可分别投票、投票按 50% 折算计入各曲得分'
                     '（计分板中该二人投票列为 ×2 还原后的原始分）。')
        if folded:
            notes.append('%s 未参与投票，其选送歌曲得分按 70%% 折算。' % '、'.join(dict.fromkeys(folded)))
        notes.append('本届各小分的折算规则多已不可考，按原始记录呈现；投给混淆单曲的票可继续再投。')
    else:
        notes.append('本届各小分按原始记录呈现（折算规则不可考）。')
    note = ''.join(notes)
    return entries, {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voter_objs}, note

def champ(ents):
    o = sorted([e for e in ents if not e['is_shadow']], key=lambda e: e['rank'])
    return o[0] if o else None

def main():
    matches = []
    for fn, group, venue, halved in GROUPS:
        ents, votes, note = build_match(fn, group, venue, halved)
        m = {'match': group, 'venue': venue, 'entries': ents, 'votes': votes}
        if note: m['note'] = note
        matches.append(m)
    cs = [champ(m['entries']) for m in matches]
    def cstr(e):
        who = '一位匿名成员' if is_anon(e['member']) else e['member']
        return '%s选送的 %s — %s' % (who, e['artist'], e['song'])
    summary = ('第十届 Barvision 设 A、B 两组并行，本届的计分与折算细节多已不可考。'
               'A 组冠军是%s，B 组冠军为%s；A 组 雨妈与包妈 合报参赛。') % (cstr(cs[0]), cstr(cs[1]))
    data = {
        'year': 2020, 'edition_no': 10, 'edition_name': 'The 10th Barvision',
        'cn_name': '第十届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {},  # 无规则书 → 跳过赛制板块
        'source': '第十届赛果（10A / 10B 逐票汇总，无规则文档）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': '本届无规则书、折算规则多不可考：小分按原始记录呈现，总分为权威最终分；10A 雨妈/包妈 合报且投票 50% 折算（计分板 ×2 还原）、苏妈/晕妈/麦妈 未投票其歌 70% 折算、投混淆票可再投；12 分取各投票人投出最高分的正式曲（混淆不计）。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('匿名身份:', [k for k in SEEN if SEEN[k].get('unclaimed')])
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        for e in m['entries']:
            print('  #%-4s %-10s J=%-6g T=%-6g 总=%-7g %s — %s%s' % (
                str(e['rank']) + ('*' if e['is_shadow'] else ''), e['member'][:10],
                e['jury_vote'], e['tele_vote'], e['score'],
                e['artist'][:16], e['song'][:22], ' [混淆]' if e['is_shadow'] else ''))

if __name__ == '__main__':
    main()
