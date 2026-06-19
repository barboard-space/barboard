#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第四届 (CSV: 4A 小众组 + 4B 中众组) → regular-04.json.

要点：
- A 组「泰妈仅给前五喜好(12/10/8/7/6)，计分 50% 折算」→ 总分 = 各票和 − 0.5×泰妈；
  故 score 直接取 CSV 总分（已含折算），jury=评委票和，tele=score−jury（自动反映折算）。
  B 组无折算（总分=各票和）。表格后附「注：」说明。
- 混淆曲：rank 以「混淆」开头；报名者「X2」去尾数字得选送者（均有已知选送者，ed4 无匿名）。
  名次自算并排名次（不低于其分的正式曲数+1），展示「N*」。
- 联合选送「麦妈/苏妈」：member 保留斜杠，聚合时拆分进两人，结果表上下排列。
"""
import csv, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_A = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 4\Barvision_4A.csv'
SRC_B = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 4\Barvision_4B.csv'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2019', 'regular-04.json')

DISCOUNT_VOTER = '泰妈'  # A 组：该投票人计分 50% 折算（仅前五喜好）

# 非英语语种（按 song；其余默认英语）—— 已与用户核对
LANG = {
    'Et blekt lys lyder': '纯音乐',   # 纯音乐（标题挪威语）
    'Je Rêverai à Toi': '法语',
    '暖': '中文',
    'Perfume (feat. Weste & Fedrico Estevez)': '西班牙语',
    'Farlig': '挪威语',
    'Rush Hour': '纯音乐',            # Herlin Riley 纯音乐
    'Innan du väcker mig (feat. Danny Saucedo)': '瑞典语',
    'Cheregazzina': '意大利语',
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
SEEN = {}; UNRESOLVED = set()

def resolve(nick):
    if not nick: return None
    if '/' in nick:  # 联合选送：拆分各自解析，联合本身无单一 id
        for part in nick.split('/'): resolve(part.strip())
        return None
    info = MEMBERS.get(nick)
    if info is None:
        UNRESOLVED.add(nick); return None
    SEEN[nick] = info
    return info['id']

def parse_sub(report, rank):
    shadow = rank.startswith('混淆')
    member = report.strip()
    if shadow:
        member = re.sub(r'\d+$', '', member).strip()  # 雨妈2 → 雨妈
    return member, shadow

def split_song(cell):
    cell = cell.strip()
    for sep in (' - ', ' – '):  # 兼容连字符与 en-dash 分隔
        if sep in cell:
            a, s = cell.split(sep, 1); return a.strip(), s.strip()
    return '', cell

def num(v):
    f = float(v); return int(f) if f == int(f) else round(f, 1)

def build_match(path, match, venue):
    with open(path, encoding='utf-8-sig') as f:
        rows = list(csv.reader(f))
    voters = [v.strip() for v in rows[0][3:-1]]
    data = []
    for r in rows[1:]:
        if not r or not r[1].strip(): continue
        member, shadow = parse_sub(r[2], r[0].strip())
        artist, song = split_song(r[1])
        cells = {voters[i]: num(r[3+i]) for i in range(len(voters)) if r[3+i].strip()}
        data.append(dict(member=member, shadow=shadow, artist=artist, song=song,
                         cells=cells, total=num(r[-1])))
    jury_set = {d['member'] for d in data if not d['shadow']}

    entries = []
    for i, d in enumerate(data):
        resolve(d['member'])
        is_joint = '/' in d['member']
        mid = None if is_joint else (MEMBERS.get(d['member'], {}).get('id'))
        jury = sum(p for v, p in d['cells'].items() if v in jury_set)
        score = d['total']
        tele = round(score - jury, 1)
        tele = int(tele) if tele == int(tele) else tele
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': LANG.get(d['song'], '英语'),
            'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': score,
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
    # 名次：正式曲 总分↓、同分观众分↓；混淆曲并排名次 = 不低于其分的正式曲数 + 1
    official = [e for e in entries if not e['is_shadow']]
    official.sort(key=lambda e: (-e['score'], -e['tele_vote']))
    for i, e in enumerate(official, 1): e['rank'] = i
    # 混淆曲并排名次 = 不低于其分的正式曲数 + 1；同名次的混淆曲再按分降序连续编号（如 23*/24*）
    shadows = [e for e in entries if e['is_shadow']]
    by_base = {}
    for e in shadows:
        base = sum(1 for o in official if o['score'] >= e['score']) + 1
        by_base.setdefault(base, []).append(e)
    for base, grp in by_base.items():
        grp.sort(key=lambda e: -e['score'])
        for i, e in enumerate(grp): e['rank'] = base + i
    # 结果概览展示顺序：总分↓、同分正式在前混淆在后、正式内部观众分↓（混淆曲交错在名次位置）
    entries.sort(key=lambda e: (-e['score'], 1 if e['is_shadow'] else 0, -e['tele_vote']))

    # votes：每投票人 → points{条目eid:分}（按条目唯一键，避免同名成员官方/混淆曲串台；含混淆曲、去自投）
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

def main():
    a_entries, a_votes = build_match(SRC_A, 'A', '小众组')
    b_entries, b_votes = build_match(SRC_B, 'B', '中众组')
    data = {
        'year': 2019, 'edition_no': 4, 'edition_name': 'The 4th Barvision',
        'cn_name': '第四届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '',
        'summary': '第四届 Barvision 延续 A（小众）、B（中众）双组并行的格局，规模进一步扩大至 25 位成员、45 首正式作品。A 组冠军是草妈选送的 Hatchie — Stay With Me（149 分），B 组冠军为杰妈选送的 Aurora — The River（129 分）。',
        'rules': {
            'submission': '分 A 组（小众单曲）/ B 组（中等受众单曲）报名，须对所报歌曲保密；可选报“混淆项”（混淆曲，非正式项目，正常参赛达 20 首时废除）。',
            'niche_standard': ['A组 Lead Spotify 订阅 ≤1M / 月听众 ≤2M', 'A组 YT 订阅 ≤30K', 'A组 云村收藏 ≤6000 / 评论 ≤500', 'A组 无格莱美四大通类提名', 'B组 Spotify 月听众 ≤6M / 单曲 ≤50M', 'B组 YT 订阅 ≤1.5M', 'B组 无 Billboard/UK TOP10 或在榜 40 周以上热单'],
            'format': '报名达 25 首进入尾声、达 30 首结束并开赛；A、B 两组分开比赛、独立计分与排名，各组前十进决赛，最终成绩不综合两组。混淆曲不计入最终排名。',
            'voting': '欧视制，每人 Top10 给 12/10/8/7/6/5/4/3/2/1 分；分选送者互投（Jury）与观众（Tele）。未及时给分者取消投票资格。',
        },
        'source': '第四届吧视报名规则',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B 两组独立计分排名；混淆曲不计入排名。A 组泰妈仅给前五喜好，计分 50% 折算（数据保留 .5，展示四舍五入到整数）。'},
        'matches': [
            {'match': 'A', 'venue': '小众组', 'entries': a_entries, 'votes': a_votes,
             'note': '{m:泰妈} 仅给出前五喜好（12/10/8/7/6），其投票按 50% 折算计入各曲得分。'},
            {'match': 'B', 'venue': '中众组', 'entries': b_entries, 'votes': b_votes},
        ],
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    for mk, me in [('A', a_entries), ('B', b_entries)]:
        print('\n=== %s 组 ===' % mk)
        for e in me:
            tag = ' [混淆]' if e['is_shadow'] else (' [联合]' if '/' in e['member'] else '')
            print('  #%2s %s J=%-4s T=%-5s 总=%-5s %s%s' % (
                e['rank'], (e['member'])[:8], e['jury_vote'], e['tele_vote'], e['score'],
                (e['artist'] + ' - ' + e['song'])[:30], tag))
    print('\n=== 语种(非英语为猜测，请核对) ===')
    for mk, me in [('A', a_entries), ('B', b_entries)]:
        for e in me:
            if e['language'] != '英语':
                print('  %s — %s' % (e['language'], (e['artist'] + ' - ' + e['song'])))

if __name__ == '__main__':
    main()
