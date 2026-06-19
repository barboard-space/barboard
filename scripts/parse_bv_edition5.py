#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第五届 (CSV: 5A 小众 / 5B 中众 / 5C 大众 三组) → regular-05.json.

要点（与用户确认）：
- 三组并行，各组独立计分排名。逐票原始矩阵（Barvision_5X.csv）。
- 分数 score = 该曲各票和（排除自投）。CSV「总分」仅用于识别折算（5B God Fearing Men 的 55 系漏加，
  本脚本一律按各票和算 → 自动得 58）。
- 70% 折算：选送了歌但未投评委票者（昵称不在该组投票人列），按欧视自限原则其曲
  score = round(各票和 × 0.7)；检测：CSV 总分 ≈ 各票和×0.7。Jury/Tele 显示原始票（和≠score），
  计分板注释写明原始总分。本届为 5C 的 麦妈/X妈/草妈。
- 混淆曲再投：原始矩阵已含再投的票，直接读列即可。混淆曲 is_shadow，不计排名、有自身总分与并排名次。
- artist/song/language 由 OVERRIDE 覆盖（用户核对版，CSV 行顺序一一对应；含重音/feat 规范/多语言空格分隔）。
- 昵称归一 ALIASES：淋檬→柠妈 / 绿萌→萌妈 / 院长→院妈 / 可乐→乐妈。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 5'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2019', 'regular-05.json')

# (文件, match, venue, sub_col, rank_col, art_col, song_col, vstart)
GROUPS = [
    ('Barvision_5A.csv', 'A', '小众组', 1, 0, 2, 3, 4),
    ('Barvision_5B.csv', 'B', '中众组', 1, 0, 2, 3, 4),
    ('Barvision_5C.csv', 'C', '大众组', 0, 1, 2, 3, 4),
]
ALIASES = {'淋檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈'}

# artist / song / language 权威覆盖（用户核对，按各组 CSV 数据行顺序）。多语言用空格分隔。
OVERRIDE = {
    'A': [
        ('SIRUP', 'Evergreen', '日语 英语'),
        ('Curtis Walsh', 'Seven Seas', '英语'),
        ('Birgir', "Lettin' Go", '英语'),
        ('Cascadeur', 'Fog', '英语'),
        ('Nicole Bus', 'Mr. Big Shot', '英语'),
        ('Victor Pizarro', 'The Sun Is Shining Down', '英语'),
        ('Rina Mushonga', 'Atalanta', '英语'),
        ('Salt Cathedral', 'tus ojos', '西班牙语'),
        ('The Brummies', 'Norway', '英语'),
        ('Freak Slug', 'Disorder', '英语'),
        ('旺姆', '寻光', '中文'),
        ('Kishi Bashi', 'Marigolds', '英语'),
        ('Jade Bird', 'Cathedral', '英语'),
        ('Dutch Criminal Record', 'Wasted Time', '英语'),
        ('Karickter', 'Flight to Aruba', '纯音乐'),
        ('何佳乐', '影帝', '中文'),
        ('Cape Francis', 'Bloodlines', '英语'),
        ('Alex G', 'Gretel', '英语'),
        ('Donatachi & Slayyyter', 'Crush On U', '英语'),
        ('Duckwrth', 'Crush', '英语'),
        ('Drab Majesty', 'Dot in the Sky', '英语'),
        ('Confidence Man', 'Sailboat Vacation', '英语'),
        ('Arca', 'Desafio', '西班牙语'),
    ],
    'B': [
        ('Naika', 'déjà vu', '英语'),
        ('Kevin Ross', "Don't Forget About Me", '英语'),
        ('SiR', "That's Why I Love You (feat. Sabrina Claudio)", '英语'),
        ('Lucas Lucco', 'Briguinha Boba (Pã Pã Rã Pã Pã) - Ao Vivo', '葡萄牙语'),
        ('Kishi Bashi', "Summer of '42", '英语'),
        ('Árstíðir', 'While This Way', '英语'),
        ('FIDLAR', "Can't You See", '英语'),
        ('Donkeyboy', "It'll Be Alright", '英语'),
        ('Banks', 'Gimme', '英语'),
        ('Dangerkids', 'Crawl Your Way Out', '英语'),
        ('原子邦妮', '也许你不懂', '中文'),
        ('Sakima', 'God Fearing Men', '英语'),
        ('Better Oblivion Community Center', 'Service Road', '英语'),
        ('The Japanese House', "Maybe You're the Reason", '英语'),
        ('Yaeji', "Drink I'm Sippin' On", '韩语'),
        ('Unloved', 'Damned', '英语'),
        ('Harry Hudson', 'Yellow Lights', '英语'),
        ('Blithe', 'Bad', '英语'),
        ('Dorian Electra', 'Flamboyant', '英语'),
        ('丁世光', '如果我们当时在一起会怎么样', '中文'),
        ('Ross From Friends', 'Epiphany', '英语'),
        ('Seaforth', 'Love That', '英语'),
        ('みゆな', 'ふわふわ', '日语'),
        ('Rival Consoles', "Dreamer's Wake", '纯音乐'),
        ('Maddie & Tae', 'Tourist in This Town', '英语'),
        ('The Japanese House', 'We Talk all the Time', '英语'),
    ],
    'C': [
        ('Brantley Gilbert', 'Tried to Tell Ya', '英语'),
        ('K. Michelle', 'Not A Little Bit', '英语'),
        ('Sigrid', "Don't Feel Like Crying", '英语'),
        ('Sophia Ayana', 'Heartbreak Hotel', '英语'),
        ('M83', 'Go! (feat. Mai Lan)', '英语'),
        ('Rina Sawayama', '10-20-40', '英语'),
        ('You Me at Six', 'Back Again', '英语'),
        ('FKA Twigs & Future', 'holy terrain', '英语'),
        ('Ina Wroldsen', 'Sea', '英语'),
        ('The Wombats', 'Cheetah Tongue', '英语'),
        ('Andrew McMahon in the Wilderness', 'Ohio', '英语'),
        ('The Menzingers', 'Anna', '英语'),
        ('Majid Jordan', 'Caught Up (feat. Khalid)', '英语'),
        ('Freya Ridings', 'Elephant', '英语'),
        ('SHAED', 'Lonesome', '英语'),
        ('Nao', 'Inhale Exhale', '英语'),
        ('Davi', 'Ritual', '葡萄牙语'),
        ('Joshua Radin', 'Here, Right Now', '英语'),
        ('Julien Doré', 'Le lac', '法语'),
        ('Grace VanderWaal', 'Waste My Time', '英语'),
        ('PREP & DEAN', 'Cold Fire', '英语'),
        ('Brockhampton', 'Sugar', '英语'),
        ('Big Thief', 'Cattails', '英语'),
        ('Leikeli47', 'Post That', '英语'),
        ('片山修志', '月之羽姬', '纯音乐'),
    ],
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

def norm(nick):
    nick = (nick or '').strip()
    return ALIASES.get(nick, nick)

def resolve(nick):
    if not nick: return None
    info = MEMBERS.get(nick)
    if info is None:
        UNRESOLVED.add(nick); return None
    SEEN[nick] = info
    return info['id']

def load_csv(fn):
    raw = open(os.path.join(SRCDIR, fn), 'rb').read()
    for enc in ('utf-8-sig', 'gbk', 'utf-8'):
        try: txt = raw.decode(enc)
        except Exception: continue
        if '歌曲' in txt: return list(csv.reader(io.StringIO(txt)))
    raise RuntimeError('decode fail ' + fn)

def num(v):
    f = float(v); return int(f) if f == int(f) else round(f, 1)

def build_match(fn, match, venue, sub_c, rank_c, art_c, song_c, vstart):
    rows = load_csv(fn)
    header = rows[0]
    vcols = []
    for i in range(vstart, len(header)):
        h = header[i].strip()
        if h == '' or h == '总分': break
        vcols.append(i)
    voters = [norm(header[i]) for i in vcols]
    tcol = vcols[-1] + 1  # 总分列

    data = []
    for r in rows[1:]:
        if len(r) <= tcol: continue
        sub_raw = r[sub_c].strip(); song = r[song_c].strip()
        if not sub_raw or not song: continue  # 跳过列汇总行/空行
        is_sh = '混淆' in sub_raw
        member = norm(re.sub(r'[\(（].*?[\)）]', '', sub_raw))  # 去 (混淆) 等括注
        cells = {voters[k]: num(r[vcols[k]]) for k in range(len(voters)) if r[vcols[k]].strip()}
        csv_total = num(r[tcol]) if r[tcol].strip() else 0
        data.append(dict(member=member, shadow=is_sh, cells=cells, csv_total=csv_total))

    # artist/song/language 用 OVERRIDE 覆盖（按 CSV 数据行顺序一一对应）
    ov = OVERRIDE[match]
    assert len(ov) == len(data), '%s 组 OVERRIDE %d 条 != 数据 %d 条' % (match, len(ov), len(data))
    for d, (a, s, lang) in zip(data, ov):
        d['artist'], d['song'], d['lang'] = a, s, lang

    jury_set = {d['member'] for d in data if not d['shadow']}  # 有正式曲的大妈互投=评委

    entries = []
    penalized = []
    for i, d in enumerate(data):
        resolve(d['member'])
        mid = MEMBERS.get(d['member'], {}).get('id')
        raw = sum(p for v, p in d['cells'].items() if v != d['member'])  # 排自投
        jury = sum(p for v, p in d['cells'].items() if v != d['member'] and v in jury_set)
        tele = raw - jury
        is_pen = (raw > 0 and abs(d['csv_total'] - raw * 0.7) < 0.5)
        if is_pen:
            score = round(raw * 0.7); penalized.append((d['member'], d['song'], raw))
        else:
            score = raw
        entries.append({
            'member': d['member'], 'member_id': mid, 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': tele, 'score': score,
            'orig_total': (raw if is_pen else None),
            'support_rate': None, 'high_rate': None,
            'is_shadow': d['shadow'], 'rank': None,
        })

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
    return entries, {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voter_objs}, penalized

def champ(ents):
    o = [e for e in ents if not e['is_shadow']]
    o.sort(key=lambda e: e['rank'])
    return o[0] if o else None

def main():
    matches = []
    for fn, match, venue, sc, rc, ac, songc, vs in GROUPS:
        ents, votes, pen = build_match(fn, match, venue, sc, rc, ac, songc, vs)
        mobj = {'match': match, 'venue': venue, 'entries': ents, 'votes': votes}
        if pen:
            names = '、'.join('{m:%s}' % m for m, *_ in pen)
            origs = '、'.join('{m:%s} %g' % (m, raw) for m, s, raw in pen)
            mobj['note'] = '%s 选送歌曲但未投出评委票，按欧视自限原则其总分折算为原始总分的 70%%。原始总分：%s。' % (names, origs)
        matches.append(mobj)

    cA, cB, cC = (champ(matches[0]['entries']), champ(matches[1]['entries']), champ(matches[2]['entries']))
    def cstr(e): return '%s选送的 %s — %s（%g 分）' % (e['member'], e['artist'], e['song'], e['score'])
    summary = ('第五届 Barvision 首次设 A（小众）、B（中众）、C（大众）三组并行，各组独立计分与排名。'
               '本届共有 %d 位成员选送 %d 首正式作品，A 组冠军是%s，B 组冠军为%s，C 组冠军为%s。') % (
        len(SEEN), sum(len([e for e in m['entries'] if not e['is_shadow']]) for m in matches),
        cstr(cA), cstr(cB), cstr(cC))

    data = {
        'year': 2019, 'edition_no': 5, 'edition_name': 'The 5th Barvision',
        'cn_name': '第五届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '',
        'summary': summary,
        'rules': {
            'submission': '分 A 组（小众）/ B 组（中众）/ C 组（大众）报名；可选报「混淆单曲」（非正式项目，不计入排名）。',
            'niche_standard': ['A 组 小众', 'B 组 中众', 'C 组 大众'],
            'format': 'A、B、C 三组分开比赛、独立计分与排名，最终成绩不综合各组。混淆单曲不计入排名。',
            'voting': '欧视制，每人 Top10 给 12/10/8/7/6/5/4/3/2/1 分；分选送者互投（Jury）与观众（Tele）。',
        },
        'source': '第五届赛果（5A 小众 / 5B 中众 / 5C 大众 逐票汇总）',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '选送者互投', 'tele': '观众',
                      'note': 'A/B/C 三组独立计分排名；混淆单曲不计入排名，其票可由投票人等额再投正式单曲一次。选送却未投评委票者，其曲总分按 70% 折算。'},
        'matches': matches,
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('summary:', summary)
    for m in matches:
        print('\n=== %s 组 (%s) ===' % (m['match'], m['venue']))
        for e in m['entries']:
            tag = ' [混淆]' if e['is_shadow'] else ''
            pen = ' [折算 原%g]' % e['orig_total'] if e.get('orig_total') else ''
            print('  #%2s %-7s J=%-3s T=%-4s 总=%-4s %s%s%s' % (
                e['rank'], e['member'][:7], e['jury_vote'], e['tele_vote'], e['score'],
                (e['artist'] + ' - ' + e['song'])[:36], tag, pen))
        if m.get('note'): print('  注:', m['note'])

if __name__ == '__main__':
    main()
