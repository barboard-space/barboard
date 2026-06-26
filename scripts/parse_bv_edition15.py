# -*- coding: utf-8 -*-
"""Parse Barvision 第十五届 (Jinzhong 2025) → regular-15.json.

2025 年度制（SF1/SF2/GF 三场）。**本届首次取消匿名参赛**；10 位成员通过海选选出参赛曲（auditions）。
⭐ 关键差异（与 2024）：
- **半决赛就引入观众分（20 票制）**——SF1/SF2/GF **三场都是** 评委(Top10 1-12) + 观众(20 票自由分配→观众分) 双轨，
  故三场 match 均 `tele_mode='votes'`、观众不设 12 分。
- **东道主直通决赛**：主办 S妈、协办 威妈 的歌曲直接进决赛，不参加半决赛（GF 有、SF 无）。
- 每人仅 1 首；狼/芬 合报（无折算曲、无匿名）。

数据源（D:\\Genius\\Barvision\\Barvision 2025\\data，CSV）：
- 25-SF1.csv / 25-SF2.csv：row0=「评委分/观众分」分段标记；row1=表头
  `R/O,选送者,歌名,歌手,流派,语种,[评委各票],得分,[观众各票],票数,得分,总分`
  （第一个「得分」=评委分=jury_vote；票数=观众原始票数=tele_raw；第二个「得分」=观众分=tele_vote；总分=jury+观众分=score）
- 25-GF.csv：表头多 `排名,序号` 两列在前（序号=R/O）；其余同上。
- 25-Scoreboard.csv：权威最终成绩单（overall 1-26 + 各 rate/人数），仅用于交叉校验，不解析进 JSON。

逐票 points 用 eid 键（SF eid=R/O-1；GF eid=序号-1，使 R/O 显示正确）；观众投票人 type='tele' 无 `top`（不设 12 分）。
名次/得票率/总排名交 recompute_bv_ranks.py 派生。产出后转手工维护、勿重跑覆盖（同 #141/#157）。
"""
import csv, json, os, re, sys

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = r'D:\Genius\Barvision\Barvision 2025\data'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2025', 'regular-15.json')

ALIASES = {'XX': 'X'}                                # 选送者 XX → X妈
JOINT = '狼妈/芬妈'
QUAL = 8                                             # 各半决赛前 8 名晋级
ARTIST_FIX = {}                                      # 萌：艺人现用名 MYTCH（CSV 即 MYTCH，沿用，不覆盖）

NICK2ID = {}
with open(os.path.join(BASE, 'data', 'members', 'members.csv'), encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        nk = (row.get('barboard_name') or '').strip()
        if nk:
            NICK2ID[nk] = {'id': int(row['space_id']), 'handle': (row.get('space_name') or nk).strip() or nk}

def canon1(t):
    t = (t or '').strip()
    t = ALIASES.get(t, t)
    if (t + '妈') in NICK2ID:
        return t + '妈'
    if t in NICK2ID:
        return t
    return t

def norm(raw):
    raw = (raw or '').strip().replace('&', '/')
    if raw in ('芬/狼', '狼/芬', '狼芬', '芬狼'):
        return JOINT
    if '/' in raw:
        parts = [canon1(p) for p in raw.split('/') if p.strip()]
        if set(parts) == {'狼妈', '芬妈'}:
            return JOINT
        return '/'.join(parts)
    return canon1(raw)

def num(v):
    if v is None or str(v).strip() == '':
        return None
    try:
        return float(v)
    except (TypeError, ValueError):
        m = re.match(r'\s*(-?\d+(?:\.\d+)?)', str(v))
        return float(m.group(1)) if m else None

def to_int(v):
    n = num(v)
    return int(round(n)) if n is not None else None

MEMBERS = {}
def register(nick):
    for part in str(nick).split('/'):
        part = part.strip()
        if not part or part in MEMBERS:
            continue
        if part in NICK2ID:
            MEMBERS[part] = {'id': NICK2ID[part]['id'], 'handle': NICK2ID[part]['handle']}
        else:
            MEMBERS[part] = {'id': None, 'handle': part}

def mid(nick):
    if '/' in nick:
        return None
    return (MEMBERS.get(nick) or {}).get('id')

def title_genre(g):
    g = (g or '').strip()
    SPECIAL = {'r&b': 'R&B', 'rnb': 'R&B', 'hip-hop': 'Hip-Hop', 'edm': 'EDM', 'k-pop': 'K-Pop'}
    if g.lower() in SPECIAL:
        return SPECIAL[g.lower()]
    return g[:1].upper() + g[1:] if g and g[0].isascii() else g

def read_match(path, is_gf):
    """读双轨 CSV（评委 1-12 + 观众 20 票）。返回 (entries, voters)。"""
    rows = list(csv.reader(open(path, encoding='utf-8-sig')))
    hdr = rows[0] if not is_gf else rows[0]
    # row0 是「评委分/观众分」分段标记，真正表头在 row1
    hdr = rows[1]
    sel_i = hdr.index('选送者'); song_i = hdr.index('歌名'); art_i = hdr.index('歌手')
    genre_i = hdr.index('流派'); lang_i = hdr.index('语种')
    first_score = hdr.index('得分')                  # 评委得分列
    piao = hdr.index('票数')                          # 观众原始票数列
    tele_score = piao + 1                             # 观众分列
    total_i = piao + 2                                # 总分列（=末列）
    jcols = [(i, norm(hdr[i])) for i in range(lang_i + 1, first_score)]
    tcols = [(i, norm(hdr[i])) for i in range(first_score + 1, piao)]
    ro_i = hdr.index('序号') if is_gf else hdr.index('R/O')
    rank_i = hdr.index('排名') if is_gf else None

    entries, voter_rows = [], []  # voter_rows: (eid, jdict, tdict)
    for r in rows[2:]:
        if len(r) <= total_i or not (r[sel_i] or '').strip():
            continue
        ro = to_int(r[ro_i])
        eid = ro - 1
        sel = norm(r[sel_i])
        song = (r[song_i] or '').strip()
        artist = ARTIST_FIX.get(song, (r[art_i] or '').strip())
        jpts = {nm: to_int(r[i]) for i, nm in jcols if i < len(r) and num(r[i]) is not None}
        tpts = {nm: to_int(r[i]) for i, nm in tcols if i < len(r) and num(r[i]) is not None}
        entries.append({
            'eid': eid, 'ro': ro, 'member': sel, 'member_id': mid(sel),
            'artist': artist, 'song': song,
            'language': (r[lang_i] or '').strip(), 'genre': title_genre(r[genre_i]),
            'jury_vote': num(r[first_score]), 'tele_vote': num(r[tele_score]),
            'tele_raw': to_int(r[piao]), 'score': num(r[total_i]),
            'support_rate': None, 'high_rate': None, 'is_shadow': False,
            'rank': (to_int(r[rank_i]) if rank_i is not None else None),
            '_jpts': jpts, '_tpts': tpts,
        })
    return entries

def build_match(path, code, venue, is_gf):
    entries = read_match(path, is_gf)
    for e in entries:
        register(e['member'])
    # 装配投票人：评委(1-12) + 观众(20 票，无 top)，points 用 eid 键
    jnames, tnames = [], []
    for e in entries:
        for v in e['_jpts']:
            if v not in jnames:
                jnames.append(v)
        for v in e['_tpts']:
            if v not in tnames:
                tnames.append(v)
    # 评委列序：按其选送曲在 entries 的下标（自投格对角线）；非选送者排后
    idx_of = {}
    for i, e in enumerate(entries):
        idx_of.setdefault(e['member'], i)
    jnames.sort(key=lambda v: idx_of.get(v, 9999))
    voters = []
    for v in jnames:
        register(v)
        pts = {str(e['eid']): e['_jpts'][v] for e in entries if v in e['_jpts']}
        voters.append({'voter': v, 'type': 'jury', 'points': pts})
    for v in tnames:
        register(v)
        pts = {str(e['eid']): e['_tpts'][v] for e in entries if v in e['_tpts']}
        voters.append({'voter': v, 'type': 'tele', 'points': pts})
    for e in entries:
        del e['_jpts'], e['_tpts']
    # SF：按总分(同分 tele 高者) top 8 设 qualified；GF 全部决赛曲（无 qualified）
    if not is_gf:
        order = sorted(range(len(entries)), key=lambda i: (-(entries[i]['score'] or 0), -(entries[i]['tele_vote'] or 0)))
        qset = set(order[:QUAL])
        for i, e in enumerate(entries):
            e['qualified'] = i in qset
    return {'match': code, 'venue': venue, 'tele_mode': 'votes', 'entries': entries,
            'votes': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voters}}

# ───────────────────────── 文案 ─────────────────────────
SUMMARY = ('第十五届吧视于 2025 年在山西晋中举办，由上届冠军代表 S妈主办、威妈协办。本届是吧视首次取消匿名参赛，'
           '并有 10 位成员通过举办海选选出参赛歌曲。东道主与协办方的作品直通决赛，其余成员的作品经两场半决赛、'
           '各取前 8 名晋级，共 18 首角逐总决赛冠军。\n\n'
           '最终，威妈选送、Elliot James Reay 演唱的 “Boy In Love” 以 357 分夺冠；S妈的 “Virus” '
           '与雨妈的 “Glitter & Honey” 分列亚、季军。')

VISUAL = ('Barvision Jinzhong 2025 的视觉设计由威妈完成，围绕本届举办地晋中的地理与文化意象进行延展。'
          '主视觉以暖色调为基础，采用渐变块状图形的形式表现层次与节奏，形成具有数字感与空间感的构图语言。\n\n'
          '主视觉以大面积的深红色为基调，构建出富有厚重感与秩序感的横纵格栅结构，抽象演绎 “晋中” 二字的笔画特征。'
          '配套的宣传海报及背景视觉则采用温暖的橙黄渐变为主色，图像由大小不一的色块拼接构成，形成如同低分辨率影像般的'
          '马赛克效果。这一设计灵感取自平遥古城内的古建筑剪影以及周边丘陵地貌的自然起伏，借由抽象图形呈现晋中地区的'
          '文化意象与地理特征。')

RULES = {'sections': [
    {'title': '参赛与报名', 'body': [
        'Barvision Jinzhong 2025 设报名、投票与结果揭晓三大阶段，评审机制继续以成员互评为核心；'
        '本届起不再强制匿名参赛，鼓励交流的同时确保基本公正性。所有成员可通过私信或自行发布的方式提交一首参赛歌曲，'
        '东道主与协办方的作品直接晋级决赛。',
        '参赛者可公开身份，自主决定是否公开歌曲信息及进行宣传；报名后即自动成为本届评委，需参与每轮投票。'
        '报名期间不接受代报，作品一旦发布原则上不得更换。允许最多两人合报一首作品，合报者可选择合榜或分别计分减半；'
        '如出现重复报名，可联系主办方协调合报事宜。尽管不再强制匿名，比赛过程中仍不鼓励提前泄露排名或进行过度主观评价。']},
    {'title': '海选机制', 'body': [
        '参赛作品可通过 “内定” 或 “海选” 两种方式产生。内定作品可直接发布参赛信息，或私信主办方代为发布。',
        '海选需建立公开歌单（建议使用网易云与 Spotify），可设置观众票，也可由参赛者自行决定结果；'
        '展播可由本人进行，也可由主办方代播。若海选与内定作品重合，以先发布者为准；若两个海选中同一作品胜出，可视为合报。']},
    {'title': '参赛歌曲资格', 'body': ['为保障公平性，参赛歌曲需满足以下所有条件：'],
     'list': [
        {'k': '发布时间', 'v': '2022 年 6 月 30 日至 2025 年 6 月 30 日之间'},
        {'k': '艺人资格', 'v': '艺人不得曾获得 Barvision 前三名或参赛超过三次，且未曾进入 Billboard Artist 100'},
        {'k': '作品成绩限制', 'v': '', 'sublist': [
            '作品不得进入 Billboard Hot 100、Global 200、UK Official Singles Chart',
            '所属专辑不得入选 Billboard 200',
            '不得获得格莱美或 “吧莱美” 提名',
            '不得进入 BarBoard 官方榜单（总榜与分榜）、周榜 Top 50（不超 5 周），或两位以上其他评委的年榜、半年榜']},
     ],
     'table': {'caption': '平台数据限制', 'rows': [
        ['网易云音乐', '评论数 ≤ 1000', '艺人粉丝 ≤ 1 万'],
        ['QQ 音乐', '评论数 ≤ 1000', '艺人粉丝 ≤ 1 万'],
        ['Spotify', '月听众 ≤ 500 万', '单曲播放量 ≤ 1000 万'],
        ['YouTube', '官方频道订阅 ≤ 500 万', 'MV 播放量 ≤ 1000 万']]},
     'foot': ['如对参赛作品资格有异议，评委或观众需在名单公布后 72 小时内提出并提供证据。']},
    {'title': '投票与评分', 'body': ['每位评委需在每轮比赛中提交一份 Top 10 排名，按下表赋分：'],
     'scoring': {'ranks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'scores': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1]},
     'foot': [
        '本届半决赛与决赛均设观众投票：每位观众可将 20 票自由分配给参赛歌曲，各曲所得票数按比例折算为观众分，'
        '与评审团得分相加决定名次。',
        '如评委未在规定时间内提交投票，其参赛歌曲本轮得分将减半处理；投票需保持独立、公正。']},
]}

# 海选阶段（10 位成员举办海选选出参赛曲；note 含 MOLODI 换曲说明）
AUDITIONS = {
    'note': 'MOLODI 凭借 “я не я” 在邓视海选 DuncanLee’s You Decide 中获胜，其正式参赛曲目更换为 “my sea”。',
    'list': [
        {'name': 'Rainfall Melody Festival 2025', 'member': '雨妈', 'period': '2025.1.4 – 7.4', 'artist': 'Del Water Gap', 'song': 'Glitter & Honey'},
        {'name': 'Marshmallow Festival 2025', 'member': '松妈', 'period': '2025.2.1 – 6.13', 'artist': 'Nico & Chelsea', 'song': 'Alien'},
        {'name': 'The Night of Balkan', 'member': '韩妈', 'period': '2025.3.6 – 6.27', 'artist': 'Gran Error & Elvana Gjata', 'song': 'Besame En Rio'},
        {'name': 'BacUp 2025', 'member': '包妈', 'period': '2025.4.8 – 7.20', 'artist': 'Sea Lemon', 'song': 'Stay'},
        {'name': 'RollingGOAT Music Festival 2025', 'member': '羊妈', 'period': '2025.5.4 – 6.14', 'artist': 'two blinks, I love you', 'song': 'alright'},
        {'name': 'Genius Genesis 2025', 'member': '威妈', 'period': '2025.5.24 – 7.12', 'artist': 'Elliot James Reay', 'song': 'Boy In Love'},
        {'name': "DuncanLee's You Decide", 'member': '邓妈', 'period': '2025.5.28 – 6.13', 'artist': 'MOLODI', 'song': 'я не я'},
        {'name': 'XVision 2025', 'member': 'X妈', 'period': '2025.5.31 – 6.30', 'artist': 'Harvey Causon', 'song': 'Nostalgia'},
        {'name': 'iDDEA Music Festival 2025', 'member': 'T妈', 'period': '2025.5.31 – 7.19', 'artist': 'Dreamer Boy', 'song': 'Baby Blue'},
        {'name': "TitanCrazyLand's Election 2025", 'member': '泰妈', 'period': '2025.6.21 – 7.12', 'artist': 'Story Untold', 'song': 'Black Sheep'},
    ],
}

LINKS = {
    'recaps': [
        {'label': 'Barvision Jinzhong 2025 Semi-Final 1 歌曲展播', 'url': 'https://www.bilibili.com/video/BV1Nh8bzSETM/'},
        {'label': 'Barvision Jinzhong 2025 Semi-Final 2 歌曲展播', 'url': 'https://www.bilibili.com/video/BV1PFtuzpE53/'},
    ],
    'playlists': [
        {'platform': 'Spotify', 'items': [
            {'label': 'Barvision Jinzhong 2025 Semi-Final 1', 'url': 'https://open.spotify.com/playlist/1jg7nzsdwC2LX79n4gNMFq'},
            {'label': 'Barvision Jinzhong 2025 Semi-Final 2', 'url': 'https://open.spotify.com/playlist/3jvh4MVptVvltfFHXDMf1g'},
        ]},
        {'platform': '网易云音乐', 'items': [
            {'label': 'Barvision Jinzhong 2025 Semi-Final 1', 'url': 'https://music.163.com/m/playlist?id=14014741581&creatorId=3419022698'},
            {'label': 'Barvision Jinzhong 2025 Semi-Final 2', 'url': 'https://music.163.com/m/playlist?id=14014762429&creatorId=3419022698'},
        ]},
        {'platform': 'QQ 音乐', 'items': [
            {'label': 'Barvision Jinzhong 2025 Semi-Final 1', 'url': 'https://c6.y.qq.com/base/fcgi-bin/u?__=YWobWWJQoeHp'},
            {'label': 'Barvision Jinzhong 2025 Semi-Final 2', 'url': 'https://c6.y.qq.com/base/fcgi-bin/u?__=IPWjN6nTo00a'},
        ]},
    ],
}

SF1_SUMMARY = ('第一场半决赛共有 12 首参赛作品，采用 Top 10 评委排名 + 观众票制，最终决出 8 首晋级总决赛的作品。'
               '本场得分最高的是 Canaan Cox 演唱的 “Don\'t Wanna Fall Asleep”（349 分）；'
               '“two blinks, I love you” 的 “alright”（331 分）与 MOLODI 的 “my sea”（320 分）紧随其后。')
SF2_SUMMARY = ('第二场半决赛同样共有 12 首参赛作品，最终决出 8 首晋级总决赛的作品。'
               '本场表现最为突出的是 Del Water Gap 的 “Glitter & Honey”（348 分）；'
               'Acid Ghost 的 “Nightmare…”（336 分）与 Harvey Causon 的 “Nostalgia”（304 分）分列其后。')
GF_SUMMARY = ('总决赛共有 18 首歌曲入围，由评审团与观众投票共同决出冠军。'
              '最终，威妈选送、Elliot James Reay 演唱的 “Boy In Love” 以 357 分（评委 151 + 观众 206）夺冠；'
              'S妈的 “Virus” 与雨妈的 “Glitter & Honey” 分列亚、季军。')

def main():
    m1 = build_match(os.path.join(SRC, '25-SF1.csv'), 'SF1', '半决赛一', False)
    m2 = build_match(os.path.join(SRC, '25-SF2.csv'), 'SF2', '半决赛二', False)
    mg = build_match(os.path.join(SRC, '25-GF.csv'), 'GF', '总决赛', True)
    m1['summary'] = SF1_SUMMARY; m2['summary'] = SF2_SUMMARY; mg['summary'] = GF_SUMMARY

    data = {
        'year': 2025, 'edition_no': 15, 'edition_name': 'Barvision Jinzhong 2025',
        'cn_name': '第十五届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '晋中', 'host': 'S妈', 'motto': '',
        'summary': SUMMARY, 'visual_design': VISUAL, 'rules': RULES, 'auditions': AUDITIONS, 'links': LINKS,
        'source': '第十五届吧视报名总则 + 25-SF1/SF2/GF.csv（逐票）+ 25-Scoreboard.csv（最终成绩单，校验用）',
        'members': {k: MEMBERS[k] for k in sorted(MEMBERS)},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '成员互评（Top 10，1-12 制）', 'tele': '观众 20 票自由分配（折算为观众分）',
                      'note': '本届半决赛与决赛三场均为 评委(Top10) + 观众(20 票制) 双轨，总分=评委分+观众分；'
                              '东道主 S妈、协办威妈直通决赛（不参加半决赛）；狼/芬合报；首届不匿名、10 人海选；无折算、无混淆。'},
        'matches': [m1, m2, mg],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写入', OUT)

    # ── 校验：各曲 jury 票和==jury_vote、tele 票和==tele_raw、jury_vote+tele_vote==score ──
    for m in data['matches']:
        js = [v for v in m['votes']['voters'] if v['type'] == 'jury']
        ts = [v for v in m['votes']['voters'] if v['type'] == 'tele']
        bad = 0
        for e in m['entries']:
            jsum = sum(v['points'].get(str(e['eid']), 0) for v in js)
            tsum = sum(v['points'].get(str(e['eid']), 0) for v in ts)
            if abs(jsum - (e['jury_vote'] or 0)) > 0.5 or abs(tsum - (e['tele_raw'] or 0)) > 0.5 \
               or abs((e['jury_vote'] or 0) + (e['tele_vote'] or 0) - (e['score'] or 0)) > 0.5:
                bad += 1
                if bad <= 3:
                    print('   ⚠', m['match'], e['member'], e['song'][:16], 'J', jsum, e['jury_vote'], 'rawT', tsum, e['tele_raw'], 'tot', e['jury_vote'], '+', e['tele_vote'], '=', e['score'])
        print('  %s %s: %d首 评委%d 观众%d  %s' % (m['match'], m['venue'], len(m['entries']), len(js), len(ts), '校验OK' if not bad else '⚠%d首不符' % bad))

    def top3(m):
        return [(e['member'], e['song'], e['score']) for e in sorted(m['entries'], key=lambda x: -(x['score'] or 0))[:3]]
    print('  GF 前三：', top3(mg))
    print('  SF1 前三：', top3(m1), '| 晋级', sum(1 for e in m1['entries'] if e['qualified']))
    print('  SF2 前三：', top3(m2), '| 晋级', sum(1 for e in m2['entries'] if e['qualified']))
    print('  GF 中 S妈/威妈（直通）：', [e['member'] for e in mg['entries'] if e['member'] in ('S妈', '威妈')])
    print('  合报：', [e['member'] for m in data['matches'] for e in m['entries'] if '/' in e['member']])
    print('  members 数：', len(MEMBERS), '| 无 id：', [k for k, v in MEMBERS.items() if v.get('id') is None])

if __name__ == '__main__':
    main()
