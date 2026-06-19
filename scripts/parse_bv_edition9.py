#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第九届 (CSV: 9A / 9B 两组) → regular-09.json.

⚠️ 本届非常混乱、无规则书，折算规则多不可考——只标注能推理出的信息与分数：
- 列：排名 / 选送妈 / 歌手 / 歌曲 / 语种 / [投票人小分…] / 总分。歌手/歌名已分两列。语种由 CSV 提供。
- 小分全是**任意小数**（非欧视 12/10/8）；`总分` 为权威最终分（score 直接取它）。jury/tele 由小分求和。
- **匿名多身份**：神妈(9A 选送 Bob Moses)、隐妈(9B 选送 Sharon Van Etten) 均归「匿名」(id 0, unclaimed)，
  但 **member 保留各自别名**（神妈/隐妈），members 映射 {id:0,handle:别名,unclaimed:true} → 详情页显别名、链 member/0；
  member/0 页由 gen_member_pages 合并并按 persona 打标签区分（10–12 届会有更多匿名身份）。
- **9A 合报+50% 投票折算**：奶妈/雨妈 合报 Alex Sampson，二人各自投票、投票 ×0.5（CSV 已半值）；
  计分板该二人投票列 **×2 还原显示**（points 存还原值；score/jury/tele 用 CSV 半值）。
- **9B 70% 折算**：晕妈未投票 → 其歌总分 = 各小分和 ×0.7（已在 CSV 总分里，score 直接取）。
- 混淆：9A 包妈/小妈/锴妈；9B 团妈/雨妈（选送妈含「混淆」）。
- **12 分（本届特例）**：每位投票人的 12 分 = 其投票列中数值最高的一首**正式**歌曲（混淆不计 12 分）。
  parser 存 voter.top=该正式曲 eid；下游（计分板金标 / 12 Points / 成员页 twelve）按 top 统计。
- 显示（renderer 既有行为已满足）：总分/Jury/Tele/计分板 Total 四舍五入（fmtScore）；小分栏保留小数。
- 跳过 rules（无规则书）。⚠️ 名次仅临时；导入后须跑 recompute_bv_ranks.py。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 9'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-09.json')
GROUPS = [('Barvision_9A.csv', 'A', '小众组', {'奶妈', '雨妈'}),
          ('Barvision_9B.csv', 'B', '中众组', set())]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈'}
ANON_PERSONAS = {'神妈', '隐妈', '神隐妈', '匿名'}  # 共用 id 0 unclaimed，但各自别名保留以区分
# 源 CSV typo / 规范修正（用户核对版）；键 (artist, fix_feat(song))
TEXT_FIX = {
    ('Jon Mclaufhin', 'So Emotional'): ('Jon McLaughlin', 'So Emotional'),
    ('Dizzy Dizzo ft.ESO', '谁爱谁'): ('Dizzy Dizzo', '谁爱谁 (feat. ESO)'),  # feat 移到歌名
    ('Ravanna/Кэш', 'Сопротивление'): ('Ravanna & Кэш', 'Сопротивление'),    # / → &
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
        if p in ANON_PERSONAS:
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
    if member in ANON_PERSONAS: return 0
    return MEMBERS.get(member, {}).get('id')

def parse_submitter(s):
    """选送妈 → (member, is_shadow)。混淆/合报(&)/别名归一；匿名身份保留别名。"""
    s = (s or '').strip(); is_sh = '混淆' in s
    s = re.sub(r'[\(（].*?[\)）]', '', s).replace('混淆', '').strip()
    parts = re.split(r'[&/]', s)
    parts = [norm(p.strip()) for p in parts if p.strip()]
    return '/'.join(parts), is_sh

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

def build_match(fn, group, venue, halved):
    rows = load_csv(fn); h = [c.strip() for c in rows[0]]
    ci_sub = h.index('选送妈'); ci_art = h.index('歌手'); ci_song = h.index('歌曲')
    ci_lang = h.index('语种'); ci_tot = h.index('总分')
    voters = [norm(h[i]) for i in range(ci_lang + 1, ci_tot)]
    data = []
    for r in rows[1:]:
        if len(r) <= ci_tot or not r[ci_sub].strip() or not r[ci_song].strip(): continue
        member, is_sh = parse_submitter(r[ci_sub])
        cells = {}; disp = {}
        for idx, v in enumerate(voters):
            x = num(r[ci_lang + 1 + idx]) if ci_lang + 1 + idx < len(r) else 0
            if x == 0: continue
            cells[v] = x
            disp[v] = round(x * 2, 2) if v in halved else x
        artist = r[ci_art].strip(); song = fix_feat(r[ci_song].strip())
        artist, song = TEXT_FIX.get((artist, song), (artist, song))
        data.append(dict(member=member, shadow=is_sh, artist=artist, song=song,
                         lang=r[ci_lang].strip() or '英语',
                         cells=cells, disp=disp, score=num(r[ci_tot])))
    jury_set = set()
    for d in data:
        if d['shadow']: continue
        for p in (d['member'].split('/') if '/' in d['member'] else [d['member']]):
            jury_set.add(p)
    entries = []
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
        if not d['shadow'] and abs(raw - d['score']) > 0.05:
            WARN.append('%s 「%s」各小分和 %g ≠ 总分 %g（疑折算）' % (group, d['song'], raw, d['score']))
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
        # 12 分：该投票人投出最高分的正式曲（混淆不计）；并列取 score 高、eid 小
        cand = [(eid, pts[eid]) for eid in official_eids if eid in pts]
        top = None
        if cand:
            top = max(cand, key=lambda t: (t[1], score_by_eid.get(t[0], 0), -t[0]))[0]
        vo = {'voter': v, 'type': 'jury' if v in jury_set else 'tele', 'points': pts}
        if top is not None: vo['top'] = top
        voter_objs.append(vo)

    note = None
    if group == 'A':
        note = ('奶妈、雨妈 合报 Alex Sampson — All That We Could Have Been，二人可分别投票，'
                '其投票按 50% 折算计入各曲得分（计分板中该二人投票列为 ×2 还原后的原始分）；'
                '本届其余小分的折算规则已不可考，按原始记录呈现。')
    else:
        note = ('晕妈 未参与投票，其选送歌曲得分按 70% 折算；本届各小分的折算规则已不可考，按原始记录呈现。')
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
    def cstr(e): return '%s选送的 %s — %s' % (e['member'], e['artist'], e['song'])
    summary = ('第九届 Barvision 设 A、B 两组并行，但本届的计分与折算细节多已不可考。'
               'A 组冠军是%s，B 组冠军为%s；其中 奶妈与雨妈 在 A 组合报参赛。') % (cstr(cs[0]), cstr(cs[1]))
    data = {
        'year': 2020, 'edition_no': 9, 'edition_name': 'The 9th Barvision',
        'cn_name': '第九届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {},  # 无规则书 → 跳过「赛制」板块
        'source': '第九届赛果（9A / 9B 逐票汇总，无规则文档）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': '本届无规则书、折算规则多不可考：小分按原始记录呈现，总分为权威最终分；9A 奶妈/雨妈 合报且投票 50% 折算（计分板 ×2 还原显示），9B 晕妈未投票其歌 70% 折算。12 分取各投票人投出最高分的正式曲（混淆不计）。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('匿名身份:', [k for k in SEEN if SEEN[k].get('unclaimed')])
    if WARN:
        print('⚠️ 各小分和≠总分（折算/异常）:'); [print('   ', w) for w in WARN]
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        for e in m['entries']:
            print('  #%-4s %-9s J=%-6g T=%-6g 总=%-7g %s — %s%s' % (
                str(e['rank']) + ('*' if e['is_shadow'] else ''), e['member'][:9],
                e['jury_vote'], e['tele_vote'], e['score'],
                e['artist'][:16], e['song'][:22], ' [混淆]' if e['is_shadow'] else ''))

if __name__ == '__main__':
    main()
