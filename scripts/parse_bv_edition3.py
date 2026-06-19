#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第三届 (CSV: 3A 小众组 + 3B 中众组) → regular-03.json.

第三届分 A/B 两组、独立计分排名（match A/B）。本届起有「混淆曲」(is_shadow)：非正式项目、
不计入排名。报名者标「（混淆）」= 该大妈的混淆曲（计入该大妈、is_shadow）；报名者=「混淆」
= 赛后无人认领 → 归入伪成员「匿名」(id 0)。Jury/Tele：有正式(非混淆)参赛曲者=Jury，
仅报混淆曲或未报者=Tele。score = 总分 = 各票之和（已校验）。
混淆曲的票计入 votes.voters.points → 在 Scoreboard 计分板矩阵中作弱化行显示；
12 Points 与成员页正式统计仍排除混淆曲（渲染层 / 聚合层处理）。
"""
import csv, json, os, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_A = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 3\Barvision_3A.csv'
SRC_B = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 3\Barvision_3B.csv'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2019', 'regular-03.json')

UNCLAIMED = '匿名'  # 伪成员昵称；id 0

# 非英语歌曲语种（按 song 部分；其余默认英语）—— 已与用户核对
LANG = {
    'Clean Air': '纯音乐',
    'Wenn du liebst (feat. Kat Frankie)': '德语',
    'Нет любви': '俄语',
    'Tenho Voce': '葡萄牙语',
    'Milano Good Vibes': '意大利语',
    'TEXAS (feat. JVG)': '芬兰语',
    'No Se Te Nota (Remix)': '西班牙语',
}

# 艺人名修正（CSV 笔误 → 正确拼写）
ARTIST_FIX = {'Chloe x Haile': 'Chloe x Halle'}

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
    if nick == UNCLAIMED:
        SEEN[UNCLAIMED] = {'id': 0, 'handle': UNCLAIMED, 'unclaimed': True}
        return 0
    info = MEMBERS.get(nick)
    if info is None:
        UNRESOLVED.add(nick); return None
    SEEN[nick] = info
    return info['id']

def parse_sub(s):
    """报名者 → (member, is_shadow)。「混淆」→匿名；「X（混淆）」→X(shadow)。"""
    s = (s or '').strip(); shadow = False
    if '（混淆）' in s or '(混淆)' in s:
        shadow = True; s = s.replace('（混淆）', '').replace('(混淆)', '').strip()
    if s == '混淆':
        return UNCLAIMED, True
    return s, shadow

def split_song(cell):
    cell = cell.strip()
    if ' - ' in cell:
        a, s = cell.split(' - ', 1)
        return a.strip(), s.strip()
    return '', cell

def build_match(path, match, venue):
    with open(path, encoding='utf-8-sig') as f:
        rows = list(csv.reader(f))
    hdr = rows[0]
    voters = [v.strip() for v in hdr[3:-1]]
    data = []
    for r in rows[1:]:
        if not r or not r[1].strip(): continue
        rank = int(r[0]); member, shadow = parse_sub(r[2])
        artist, song = split_song(r[1])
        artist = ARTIST_FIX.get(artist, artist)
        cells = {voters[i]: int(r[3+i]) for i in range(len(voters)) if r[3+i].strip()}
        total = int(r[-1])
        data.append(dict(rank=rank, member=member, shadow=shadow, artist=artist, song=song, cells=cells, total=total))
    jury_set = {d['member'] for d in data if not d['shadow']}

    entries = []
    for i, d in enumerate(data):
        mid = resolve(d['member'])
        jury = sum(p for v, p in d['cells'].items() if v in jury_set)
        tele = sum(p for v, p in d['cells'].items() if v not in jury_set)
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': LANG.get(d['song'], '英语'),
            'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': d['total'],
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })
    # 名次：正式曲按 总分↓、同分则观众分↓（欧视并列打破规则）；混淆曲取并排名次 = 不低于其分的正式曲数 + 1
    official = [e for e in entries if not e['is_shadow']]
    official.sort(key=lambda e: (-e['score'], -e['tele_vote']))
    for i, e in enumerate(official, 1):
        e['rank'] = i
    for e in entries:
        if e['is_shadow']:
            e['rank'] = sum(1 for o in official if o['score'] >= e['score']) + 1
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
        'year': 2019, 'edition_no': 3, 'edition_name': 'The 3rd Barvision',
        'cn_name': '第三届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '',
        'summary': '第三届吧视，参赛歌曲按受众分 A 组（小众）/ B 组（中众）两组，独立计分与排名。本届起出现「混淆曲」——非正式参赛项目、不计入最终排名；部分混淆曲的选送者赛后未认领，归入「匿名」。投票沿用欧视制 Top10。（本届无规则文档，规则参考第四届报名须知。）',
        'rules': {
            'submission': '分 A 组（小众单曲）/ B 组（中等受众单曲）报名；每人可报正式参赛曲，亦可选报“混淆曲”（非正式项目，不计入最终排名）。',
            'niche_standard': ['A 组 小众', 'B 组 中众', 'Lead Spotify 订阅 ≤1M', 'YT 订阅 ≤30K', '云村收藏 ≤6000', '无格莱美四大通类提名'],
            'format': 'A、B 两组分开比赛、独立计分与排名，最终成绩不综合两组。混淆曲不计入最终排名，参赛者只为前 10 名打分。（规则细节参考第四届报名须知。）',
            'voting': '欧视制，每人 Top10 给 12/10/8/7/6/5/4/3/2/1 分；分选送者互投（Jury）与观众（Tele）。仅报混淆曲者按观众计。',
        },
        'source': '第三届赛果（A 小众组 / B 中众组；规则参考第四届报名须知）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B 两组独立计分排名；混淆曲不计入排名（仅报混淆曲者按观众票）。'},
        'matches': [
            {'match': 'A', 'venue': '小众组', 'entries': a_entries, 'votes': a_votes},
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
        print('\n=== %s 组 校验(score==jury+tele?) ===' % mk)
        for e in me:
            ok = (e['jury_vote'] + e['tele_vote']) == e['score']
            tag = ' [混淆]' if e['is_shadow'] else ''
            print('  #%2s %s/%-32s J=%-3d T=%-3d 总=%-3d %s%s' % (
                e['rank'], e['member'], (e['artist']+' - '+e['song'])[:32], e['jury_vote'], e['tele_vote'], e['score'], 'OK' if ok else 'X', tag))
    print('\n=== 语种(非英语为猜测，请核对) ===')
    for mk, me in [('A', a_entries), ('B', b_entries)]:
        for e in me:
            if e['language'] != '英语':
                print('  %s %s — %s' % (e['language'], e['artist'], e['song']))

if __name__ == '__main__':
    main()
