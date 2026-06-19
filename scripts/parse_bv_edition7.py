#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第七届 (CSV: 7A / 7B / 7C 三组) → regular-07.json.

格式特点（与六届不同）：
- 列布局每组不同：
  7A: 选送评委 / 歌手 / 歌名 / 语种 / [投票人…] / 总评分      （无「最终得分」列、无折算、无并列）
  7B,7C: 名次 / 歌手 / 歌名 / 选送评委 / 语种 / [投票人…] / 总评分 / 最终得分
  → 用列名 index() 通用定位（歌手/歌名/选送评委/语种/总评分[/最终得分]）；
    投票人列 = 语种 右侧 至 总评分 之间。
- 歌手 / 歌名 已是独立两列（无需拆分）。语种由 CSV 提供。
- 混淆：仅 7A 3 首（选送评委含「混淆」）；7B/7C 无混淆。
- 70% 折算：选送了歌却未提交评委排名者（最终得分 ≈ 总评分×0.7）。本届 7B 苏妈/蛋妈、7C 鹿妈。
  → 用「最终得分 < raw×0.95」检测（不靠"是否在投票列"，因 7C 蛋妈未投但未折算）。
  折算行：score=最终得分(折算值)、Jury/Tele 显原始票（和≠score）；计分板 note 写明原始总分。
- 7C 支持率小数（如 83→83.1、81→81.9…）：按用户决定 **丢弃**，总分取整数总评分；
  名次由全局 recompute_bv_ranks.py（Eurovision 平局级联）决定。
- 7C 联合「雨&布」：登记为联合投票人 雨妈/布妈（Jury），且该组 雨妈 选送的歌(Belong to You)
  改登记为 雨妈/布妈 合报（member_id=None；下游按 / 拆分计入两人）。
- feat 规范化：(ft.X) → (feat. X)（#15）。
- eid 键 points（#140）。
- ⚠️ 名次仅临时；导入后须跑 recompute_bv_ranks.py（SOP 第 5 步）。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 7'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-07.json')
GROUPS = [('Barvision_7A.csv', 'A', '小众组'), ('Barvision_7B.csv', 'B', '中众组'), ('Barvision_7C.csv', 'C', '大众组')]
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈'}
# 联合投票人 → 斜杠串
JOINT_VOTER = {'雨&布': '雨妈/布妈', '雨&布妈': '雨妈/布妈'}
# (组, 规范化选送者) → 改为联合选送
SUBMIT_JOINT = {('C', '雨妈'): '雨妈/布妈'}
# 源 CSV typo / 艺人 lead 修正（用户核对版）；键 (artist, song) 用 fix_feat 后的歌名匹配
TEXT_FIX = {
    ('CILVR', 'Decoraion'): ('CILVR', 'Decoration'),
    ('Ben Haziewood', 'Louder Than Thunder'): ('Ben Hazlewood', 'Louder Than Thunder'),
    ('TaleRich', 'Talerich-Conquistas (feat. Ester)'): ('TaleRich', 'Conquistas (feat. Ester)'),
    ('The Rubens, Vic Mensa', 'Falling Asleep at the Wheel'): ('The Rubens & Vic Mensa', 'Falling Asleep at the Wheel'),
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
    n = JOINT_VOTER.get(n, n)
    return ALIASES.get(n, n)

def resolve(nick):
    """注册到 SEEN；联合串按 / 拆分逐个解析。"""
    if not nick: return None
    parts = nick.split('/') if '/' in nick else [nick]
    rid = None
    for p in parts:
        info = MEMBERS.get(p)
        if info is None:
            UNRESOLVED.add(p)
        else:
            SEEN[p] = info
            if rid is None and '/' not in nick: rid = info['id']
    return rid

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '总评分' in txt: return list(csv.reader(io.StringIO(txt)))
    raise RuntimeError('decode fail ' + fn)

def strip_shadow(s):
    s = (s or '').strip(); is_sh = '混淆' in s
    s = re.sub(r'[\(（].*?[\)）]', '', s).replace('混淆', '').strip()
    return norm(s), is_sh

FEAT_RE = re.compile(r'\(\s*ft\.?\s*', re.I)
def fix_feat(song):
    return FEAT_RE.sub('(feat. ', song).strip()

def num(v):
    v = (v or '').strip()
    if not v: return 0
    f = float(v); return int(f) if f == int(f) else round(f, 1)

def build_match(fn, group, venue):
    rows = load_csv(fn); h = [c.strip() for c in rows[0]]
    ci_artist = h.index('歌手'); ci_song = h.index('歌名')
    ci_sub = h.index('选送评委'); ci_lang = h.index('语种')
    ci_tot = h.index('总评分')
    ci_fin = h.index('最终得分') if '最终得分' in h else None
    vcols = list(range(ci_lang + 1, ci_tot))
    voters = [norm(h[i]) for i in vcols]
    data = []
    for r in rows[1:]:
        if len(r) <= ci_tot: continue
        sub_raw = r[ci_sub].strip()
        if not sub_raw or not r[ci_song].strip(): continue
        member, is_sh = strip_shadow(sub_raw)
        member = SUBMIT_JOINT.get((group, member), member)
        artist = r[ci_artist].strip(); song = fix_feat(r[ci_song].strip())
        artist, song = TEXT_FIX.get((artist, song), (artist, song))
        cells = {}
        for vi, ci in enumerate(vcols):
            p = num(r[ci])
            if p > 0: cells[voters[vi]] = p  # 0/空 = 无票
        tot = num(r[ci_tot])
        fin = num(r[ci_fin]) if ci_fin is not None else tot
        data.append(dict(member=member, shadow=is_sh, artist=artist,
                         song=song, lang=r[ci_lang].strip() or '英语',
                         cells=cells, tot=tot, fin=fin))
    jury_set = {d['member'] for d in data if not d['shadow']}
    entries = []
    for i, d in enumerate(data):
        resolve(d['member'])
        mid = None if '/' in d['member'] else MEMBERS.get(d['member'], {}).get('id')
        raw = sum(p for v, p in d['cells'].items() if v != d['member'])
        if raw != d['tot']:
            WARN.append('%s%s「%s」raw=%s ≠ 总评分=%s' % (group, '混淆' if d['shadow'] else '', d['song'], raw, d['tot']))
        jury = sum(p for v, p in d['cells'].items() if v != d['member'] and v in jury_set)
        tele = raw - jury
        # 折算检测：最终得分明显 < raw（≈×0.7）→ 折算行，score 取折算值
        discount = (not d['shadow']) and d['fin'] < raw * 0.95 and raw > 0
        score = d['fin'] if discount else raw  # 非折算：用 raw(整数总评分)，丢弃 7C 支持率小数
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': score,
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
            '_discount': discount, '_raw': raw,
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
    # 折算注释
    disc = [(e['member'], e['_raw']) for e in entries if e['_discount']]
    note = None
    if disc:
        names = '、'.join('%s原始总分 %g' % (m, r) for m, r in disc)
        note = '%s 选送了歌曲却未提交评委排名，其得分按总分的 70%% 折算（%s）。' % (
            '、'.join(m for m, _ in disc), names)
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
    for e in entries:
        del e['_discount'], e['_raw']
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
    summary = ('第七届 Barvision 延续 A（小众）、B（中众）、C（大众）三组并行的赛制，各组独立计分与排名。'
               '本届共 %d 位成员选送 %d 首正式作品，小众组冠军是%s，中众组冠军为%s，大众组冠军为%s。') % (
        n_members, n_songs, cstr(cs[0]), cstr(cs[1]), cstr(cs[2]))
    data = {
        'year': 2020, 'edition_no': 7, 'edition_name': 'The 7th Barvision',
        'cn_name': '第七届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '', 'summary': summary,
        'rules': {
            'submission': '针对 lead 艺人分 A（小众）/ B（中众）/ C（大众）三组报名；A、B 组各设 2 个混淆项名额（先报先得、每位评委最多 1 首），C 组不设混淆。大众组提倡报小众艺人或大众艺人的小众单曲、不提倡家喻户晓的歌。报名私戳包妈并对所报歌曲保密。',
            'niche_standard': [
                'A 小众｜云村评论≤600·收藏≤7500(华语20k)·Spotify 月听众≤2.1M/单曲≤5M·YT 订阅≤2M/MV≤7.5M·BB·UK 无 Top100·MT 进榜≤5',
                'B 中众｜评论≤1500·收藏≤22000(华语30k)·月听众≤6M/单曲≤25M·YT≤6M/MV≤50M·BB·UK 最高 50·MT≤10',
                'C 大众｜评论≤2500·收藏≤50000·月听众≤10M/单曲≤50M·YT≤10M/MV≤100M·BB·UK 近三年无 Top10·MT≤15',
                'lead 艺人无格莱美四大通类提名；报名歌曲不得进过吧半年榜/年终榜 Top100；C 组艺人近两年未进吧榜/吧半年榜前百',
                'feat 艺人 BB Hot100/UK 限制：A 组无 Top50 或在榜>24 周 · B 组无 Top10 或>40 周 · C 组无冠单或>51 周',
            ],
            'format': 'A、B、C 三组分开比赛、独立计分与排名，最终成绩不综合各组。A、B 组混淆项参与评分但不计入排名；C 组不设混淆。',
            'voting': '欧视制（计分 12/10/8/7/6/5/4/3/2/1）；A 组列 Top13、B 组列 Top12、C 组列 Top10；选送者互投为 Jury、其余观众为 Tele。报名参赛的评委必须提交排名，否则其歌曲取消最终排名资格（得分按总分 70% 折算）。',
        },
        'source': '第七届赛果（7A 小众 / 7B 中众 / 7C 大众 逐票汇总）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B/C 三组独立计分排名；混淆单曲不计入排名，其票可由投票人等额再投正式单曲一次；选送却未提交排名者得分按 70% 折算。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    if WARN:
        print('⚠️ raw≠总评分:'); [print('   ', w) for w in WARN]
    else:
        print('校验: 所有 raw == 总评分 ✓')
    print('summary:', summary)
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        if m.get('note'): print('   note:', m['note'])
        for e in m['entries']:
            print('  #%-4s %-8s J=%-3s T=%-3s 总=%-5g %s — %s%s' % (
                str(e['rank']) + ('*' if e['is_shadow'] else ''), e['member'][:8],
                e['jury_vote'], e['tele_vote'], e['score'],
                e['artist'][:18], e['song'][:24], ' [混淆]' if e['is_shadow'] else ''))

if __name__ == '__main__':
    main()
