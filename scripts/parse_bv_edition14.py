# -*- coding: utf-8 -*-
"""Parse Barvision 第十四届 (Tonghua 2024) → regular-14.json.

2024 年度制（同 2023 SF1/SF2/GF 三场）：28 首报名、两轮半决赛各取前 9 晋级（共 18 首）进入决赛。
主办羊妈、协办威妈各报名 2 首（分属两半区）；本届无折算曲、无混淆曲、无匿名。

⭐ 投票制度（与 2023 的关键差异，见 CLAUDE.md #157）：
- 半决赛 SF1/SF2：评委（本场选送者）与观众（其余投票人）**均用 1-12 Top10 制**，总分 = 各票之和（同 2023）。
  jury_vote = 选送者票之和、tele_vote = 其余票之和、score = 总分。
- 决赛 GF：评委 = 1-12 Top10（评委票 = 各票之和）；**观众 = 20 票自由分配制**（可全投一首），
  CSV 直接给出每首的「观众票」(raw 票数) 与「观众分」(折算分)。tele_vote = 观众分、tele_raw = 观众票、
  score = 评委票 + 观众分（无折算）。观众投票人的 points 存 raw 票数；voter.top = 其投票最多的一首（argmax，
  供「12 分」/计分板金标，类 #150 max 模式）；评委 points 存 1-12 分（金标用 p===12）。

数据源（本机磁盘 D:\\Genius\\Barvision\\Barvision 2024）：
- ⭐ 半决赛逐票读 **Barvision Tonghua 2024.xlsx「SF1」「SF2」**（完整！col0=Running Order col1=Genre col2=From
  col3=Artist(s) col4=Song col5=spo收听 col6..「总分」前=各票 「总分」列=总分）。
  ⚠️ data\\24-SF2.csv **漏了「雨」一列**（差值之和 58 = 雨完整 Top10），故 SF 不用 CSV、改用 Excel。语种由 CSV 补。
- 语种：data\\24-SF1.csv / 24-SF2.csv 的 col5「语种」按歌名匹配（Excel 无语种列）。
- 24-GF-JURY.csv：col0..3 col4..(-2)=评委各票 col(-1)=评委票（已校验完整）。
- 24-GF-TELE.csv：col0..3 col4..(-3)=观众各票 col(-2)=观众票 col(-1)=观众分（已校验完整）。
  GF 的 genre/语种 由半决赛该曲补全（按歌名匹配）。

特殊投票人：Watermelonnew = 非榜吧外部投票人 → 规范为「外部」(members external，无链接)。
联合「狼&芬 / 芬/狼 / 狼/芬」= 狼妈(113)+芬妈(110) 合报 + 合体投票 → 规范为「狼妈/芬妈」(member_id=null，下游按 / 拆分计入两人)。

⚠️ 产出后此 JSON 即转为手工维护（文案/微调直接改 JSON，勿重跑覆盖，参 #141/#157）。
逐票 points 用 eid 键（§2.1 契约）。名次/得票率/总排名交 recompute_bv_ranks.py 派生。
"""
import csv, json, os, re, sys

try:
    import openpyxl
except ImportError:
    print('need openpyxl: pip install openpyxl'); sys.exit(1)

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ROOT = r'D:\Genius\Barvision\Barvision 2024'
SRC = os.path.join(ROOT, 'data')
XLSX = os.path.join(ROOT, 'Barvision Tonghua 2024.xlsx')
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2024', 'regular-14.json')

ALIASES = {}                          # 单字/ASCII 变体归一（本届 CSV 已较规范）
JOINT_CANON = {frozenset(['狼妈', '芬妈']): '狼妈/芬妈'}  # 合报规范顺序
EXTERNAL = {'Watermelonnew'}          # 外部投票人

# ── members.csv → {权威昵称(barboard_name): {id, handle}} ──
NICK2ID = {}
with open(os.path.join(BASE, 'data', 'members', 'members.csv'), encoding='utf-8-sig') as f:
    for row in csv.DictReader(f):
        nk = (row.get('barboard_name') or '').strip()
        if nk:
            NICK2ID[nk] = {'id': int(row['space_id']), 'handle': (row.get('space_name') or nk).strip() or nk}

def canon1(t):
    """单个 CSV 昵称 token → 权威「X妈」昵称（或外部/原样）。"""
    t = (t or '').strip()
    t = ALIASES.get(t, t)
    if t in EXTERNAL:
        return '外部'
    if (t + '妈') in NICK2ID:
        return t + '妈'
    if t in NICK2ID:
        return t
    return t  # 兜底（未知）

def norm(raw):
    """归一昵称；合报（含 & 或 /）→ 规范联合串「狼妈/芬妈」。"""
    raw = (raw or '').replace('&', '/').strip()
    if '/' in raw:
        parts = [canon1(p) for p in raw.split('/') if p.strip()]
        key = frozenset(parts)
        if key in JOINT_CANON:
            return JOINT_CANON[key]
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

# 收集出现过的全部成员（拆分合报、含外部）→ members 映射
MEMBERS = {}
def register(nick):
    for part in str(nick).split('/'):
        part = part.strip()
        if not part or part in MEMBERS:
            continue
        if part == '外部':
            MEMBERS[part] = {'id': None, 'handle': '外部', 'external': True}
        elif part in NICK2ID:
            MEMBERS[part] = {'id': NICK2ID[part]['id'], 'handle': NICK2ID[part]['handle']}
        else:
            MEMBERS[part] = {'id': None, 'handle': part}

def mid(nick):
    """单一选送者 id；合报 → None（下游按 / 拆分）。"""
    if '/' in nick:
        return None
    return (MEMBERS.get(nick) or {}).get('id')

# ── 语种映射（CSV col5「语种」按歌名）——Excel 无语种列 ──
def lang_by_song():
    m = {}
    for fn in ('24-SF1.csv', '24-SF2.csv'):
        rows = list(csv.reader(open(os.path.join(SRC, fn), encoding='utf-8-sig')))
        for r in rows[1:]:
            if len(r) > 5 and (r[3] or '').strip():
                m[r[3].strip()] = (r[5] or '').strip()
    return m

# ── 读半决赛（Excel，1-12 制，完整逐票）──
def read_semi(ws, langmap):
    rows = list(ws.iter_rows(values_only=True))
    hdr = list(rows[0])
    ti = hdr.index('总分')                           # 总分列
    voters = [(ci, norm(hdr[ci])) for ci in range(6, ti)]  # col6..总分前 = 投票人
    songs = []
    for r in rows[1:]:
        if not (len(r) > 4 and r[2] and str(r[2]).strip()):  # From=col2
            continue
        pts = {}
        for ci, vn in voters:
            val = r[ci] if ci < len(r) else None
            if isinstance(val, (int, float)) and val != 0:
                pts[vn] = int(round(val))
        song = str(r[4]).strip()
        songs.append({'sel': norm(r[2]), 'artist': str(r[3]).strip(), 'song': song,
                      'genre': str(r[1] or '').strip(), 'lang': langmap.get(song, ''),
                      'total': num(r[ti]), 'points': pts})
    return songs

# ── 读决赛评委 / 观众 ──
def read_gf_side(path, raw_extra):
    """raw_extra=False: 评委(col4..-2=票, -1=评委票); True: 观众(col4..-3=票, -2=观众票, -1=观众分)。"""
    rows = list(csv.reader(open(path, encoding='utf-8-sig')))
    hdr = rows[0]
    last = len(hdr) - (2 if raw_extra else 1)       # 投票人列结束(不含)
    voters = [(ci, norm(hdr[ci])) for ci in range(4, last)]
    out = []
    for r in rows[1:]:
        if len(r) < 5 or not (r[1] or '').strip():
            continue
        pts = {}
        for ci, vn in voters:
            val = r[ci].strip() if ci < len(r) else ''
            if val:
                pts[vn] = to_int(val)
        rec = {'sel': norm(r[1]), 'artist': r[2].strip(), 'song': r[3].strip(), 'points': pts}
        if raw_extra:
            rec['tele_raw'] = to_int(r[-2]); rec['tele_score'] = num(r[-1])
        else:
            rec['jury'] = num(r[-1])
        out.append(rec)
    return out

def build_semi(songs, code, venue):
    sels = set(s['sel'] for s in songs)             # 本场选送者 = jury
    def is_tele(v):
        return v not in sels
    vacc = {}
    for s in songs:
        for v in s['points']:
            vacc.setdefault(v, 'tele' if is_tele(v) else 'jury')
    # 晋级判定：按得分降序（同分 tele 高者优先，同 recompute 主键）前 9 名晋级
    QUAL = 9
    sorder = sorted(range(len(songs)), key=lambda i: (
        -(songs[i]['total'] or 0),
        -sum(v for vn, v in songs[i]['points'].items() if is_tele(vn))))
    qual_eid = set(sorder[:QUAL])
    entries = []
    for i, s in enumerate(songs):
        jv = sum(v for vn, v in s['points'].items() if not is_tele(vn))
        tv = sum(v for vn, v in s['points'].items() if is_tele(vn))
        entries.append({
            'eid': i, 'member': s['sel'], 'member_id': mid(s['sel']),
            'artist': s['artist'], 'song': s['song'],
            'language': s['lang'], 'genre': title_genre(s['genre']),
            'jury_vote': jv, 'tele_vote': tv, 'score': s['total'],
            'support_rate': None, 'high_rate': None, 'is_shadow': False,
            'rank': i + 1, 'qualified': i in qual_eid, '_pts': s['points'],
        })
    voters = assemble(entries, vacc, {})
    return {'match': code, 'venue': venue, 'entries': entries,
            'votes': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voters}}

def build_gf(jury_rows, tele_rows, sf_meta):
    n = len(jury_rows)
    assert n == len(tele_rows), 'GF 评委/观众行数不一致'
    entries, jpts_acc, tpts_acc = [], [], []
    for i in range(n):
        jr, tr = jury_rows[i], tele_rows[i]
        assert jr['sel'] == tr['sel'] and jr['song'] == tr['song'], 'GF 评委/观众行错位: %s' % jr['song']
        meta = sf_meta.get(jr['song'], {})
        entries.append({
            'eid': i, 'member': jr['sel'], 'member_id': mid(jr['sel']),
            'artist': jr['artist'], 'song': jr['song'],
            'language': meta.get('lang', ''), 'genre': title_genre(meta.get('genre', '')),
            'jury_vote': jr['jury'], 'tele_vote': tr['tele_score'], 'tele_raw': tr['tele_raw'],
            'score': (jr['jury'] or 0) + (tr['tele_score'] or 0),
            'support_rate': None, 'high_rate': None, 'is_shadow': False,
            'rank': i + 1, '_jpts': jr['points'], '_tpts': tr['points'],
        })
    # 装配投票人：评委(1-12, p===12 金标) + 观众(20票, voter.top=argmax 金标)
    voters = []
    # —— 评委 ——
    jvoters = {}
    for e in entries:
        for v in e['_jpts']:
            jvoters.setdefault(v, {})
    for v in sorted(jvoters, key=lambda x: jorder(entries, x)):
        register(v)
        pts = {}
        for e in entries:
            if v in e['_jpts']:
                pts[str(e['eid'])] = e['_jpts'][v]
        voters.append({'voter': v, 'type': 'jury', 'points': pts})
    # —— 观众（保留 CSV 列序）——
    tnames = []
    for e in entries:
        for v in e['_tpts']:
            if v not in tnames:
                tnames.append(v)
    # 观众 = 20 票自由分配制：points 存 raw 票数；**不设 12 分/金标**（用户决策：决赛观众不设 12 分）
    for v in tnames:
        register(v)
        pts = {}
        for e in entries:
            if v in e['_tpts']:
                pts[str(e['eid'])] = e['_tpts'][v]
        voters.append({'voter': v, 'type': 'tele', 'points': pts})
    for e in entries:
        del e['_jpts'], e['_tpts']
    # tele_mode='votes'：标记观众侧为 20 票制（渲染/聚合据此跳过 12 分金标与统计、计分板观众表只显票数）
    return {'match': 'GF', 'venue': '总决赛', 'tele_mode': 'votes', 'entries': entries,
            'votes': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voters}}

def jorder(entries, voter):
    """评委列序：按其选送曲在 entries 的下标升序（自投格连对角线）；非选送者排后。"""
    for i, e in enumerate(entries):
        if e['member'] == voter:
            return i
    return 9999

def assemble(entries, vacc, _unused):
    by = {v: {} for v in vacc}
    for e in entries:
        for v, val in e.get('_pts', {}).items():
            by[v][str(e['eid'])] = val
        e.pop('_pts', None)
    out = []
    # 评委在前(按选送曲名次)、观众在后；同类按名字
    for v in sorted(vacc, key=lambda x: (vacc[x] == 'tele', jorder(entries, x), x)):
        register(v)
        out.append({'voter': v, 'type': vacc[v], 'points': by[v]})
    return out

def title_genre(g):
    """流派展示态：Title-Case 英文（R&B/Hip-Hop 等保留）。"""
    g = (g or '').strip()
    SPECIAL = {'r&b': 'R&B', 'rnb': 'R&B', 'hip-hop': 'Hip-Hop', 'edm': 'EDM', 'k-pop': 'K-Pop'}
    if g.lower() in SPECIAL:
        return SPECIAL[g.lower()]
    return g[:1].upper() + g[1:] if g and g[0].isascii() else g

# ───────────────────────── 文案（导入后转手工维护）─────────────────────────
SUMMARY = ('第十四届吧视于 2024 年在通化举办，由羊妈主办、威妈协办。26 位成员选送 28 首歌曲，'
           '经两场半决赛后共有 18 首进入决赛，并由评审团与观众投票共决冠军。\n\n'
           '最终，S妈选送、Bennett Coast 演唱的 “Pretender” 以 266 分首夺吧视冠军，并刷新吧视历史最高总分纪录；'
           '雨妈的 “Eyes Wide”（259 分）与 A妈的 “Honeycrash”（209 分）分列亚、季军。')

VISUAL = ('Barvision Tonghua 2024 的主视觉由威妈设计，灵感取自通化的城市地貌与轨道交通导视系统。'
          '设计以真实地图纹理为背景基底，叠加柠檬黄、荧光绿与品红等高饱和色块，勾勒出类似地铁线网的折角路径；'
          '计分板、赛程表与投票界面均沿用这套粗线条、强对比的导视语言。霓虹渐变字体与多层信息图层相互叠合，'
          '营造出一场贯穿地图、声音与节奏的沉浸式观赛体验。')

RULES = {'sections': [
    {'title': '参赛与报名', 'body': [
        'Barvision 2024 采用匿名参赛制，所有成员需通过私信方式将参赛歌曲报名提交给主办方羊妈。'
        '除东道主（主办方羊妈与协办方威妈）可各报名两首、且两首分属不同半区外，其余每位成员仅可报名一首。'
        '报名后，参赛者自动成为本届赛事评委，并承担评审投票义务。参赛信息全程不得提前泄露，'
        '所有报名信息将在决赛投票结束、结果揭晓前由主办方统一公开。',
        '报名通道关闭前，每位参赛者有一次主动更换歌曲的机会。允许最多两人共同报名一首作品，'
        '合报者可选择合并榜单，也可由主办方将每人提交的排名分数减半处理。若报名作品出现重复，'
        '双方可联系主办方协调合报事宜。']},
    {'title': '参赛歌曲资格', 'body': ['为保障公平性，参赛歌曲需满足以下所有条件：'],
     'list': [
        {'k': '发布时间', 'v': '2021 年 6 月 30 日至 2024 年 6 月 30 日之间（有多个版本以最早发行时间为准）'},
        {'k': '艺人资格', 'v': '艺人此前未参加过吧视，或参加吧视未能进入前三；且未曾进入 Billboard Artist 100'},
        {'k': '作品成绩限制', 'v': '', 'sublist': [
            '作品不得进入 Billboard Hot 100、Global 200、UK Official Singles Chart Top 100',
            '所属专辑不得入选 Billboard 200',
            '不得获得格莱美或 “吧莱美” 提名',
            '不得进入任何 BarBoard 官方榜单（含全吧及各派季榜、周榜等）Top 100，或其他评委的年榜、半年榜']},
     ],
     'table': {'caption': '平台数据限制', 'rows': [
        ['网易云音乐', '评论数 ≤ 1000', '艺人粉丝 ≤ 1 万'],
        ['QQ 音乐', '评论数 ≤ 1000', '艺人粉丝 ≤ 1 万'],
        ['Spotify', '月听众 ≤ 500 万', '单曲播放量 ≤ 1000 万'],
        ['YouTube', '官方频道订阅 ≤ 500 万', 'MV 播放量 ≤ 1000 万']]},
     'foot': ['如对参赛作品资格有异议，评委或观众需在名单公布后 72 小时内提出并提供证据。']},
    {'title': '投票与评分', 'body': [
        '每位评委需在每轮比赛中提交一份 Top 10 排名，按下表赋分：'],
     'scoring': {'ranks': [1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 'scores': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1]},
     'foot': [
        '决赛阶段增设大众投票：每位观众可将 20 票自由分配给参赛歌曲（允许全部投给同一首），'
        '各曲所得票数按比例折算为观众分，与评审团得分相加决定最终名次。',
        '如评委未在规定时间内提交投票，其参赛歌曲本轮得分将减半处理；'
        '所有投票需保持独立、公正，不得在投票期间泄露自己或他人的排名，或评论参赛作品。']},
]}

# 各场概况（stage-intro，渲染在该场结果概览上方；精简、只点亮点+前三，引号用中文双引号）
SF1_SUMMARY = ('第一场半决赛共有 14 首参赛作品，采用 Top 10 排名制，最终决出 9 首晋级总决赛的作品。'
               '本场得分最高的是 Bennett Coast 演唱的 “Pretender”，以 148 分位居首位；'
               'Amira Elfeky 的 “Secrets”（128 分）与 Addison Rae 的 “I got it bad”（123 分）紧随其后。'
               '晋级作品风格多样，涵盖摇滚、乡村与独立流行等。')
SF2_SUMMARY = ('第二场半决赛同样共有 14 首参赛作品，最终决出 9 首晋级总决赛的作品。'
               '本场表现最为突出的是 Alfie Jukes 带来的 “Eyes Wide”，以 143 分高居榜首；'
               'Sierra Ferrell 的 “American Dreaming”（118 分）与 The Greeting Committee & flipturn 的 '
               '“Where’d All My Friends Go?”（114 分）分列其后。')
GF_SUMMARY = ('总决赛共有 18 首歌曲入围，由 23 位评审团成员与 26 位观众投票人共同决出冠军。'
              '最终，S妈选送、Bennett Coast 演唱的 “Pretender” 以 266 分（评审 123 + 观众 143）夺冠，'
              '刷新 Barvision 历史最高总分纪录，也为 S妈赢得首座吧视冠军；'
              '雨妈的 “Eyes Wide”（259 分）与 A妈的 “Honeycrash”（209 分）分列亚、季军。')

LINKS = {
    'replays': [
        {'label': 'Barvision Tonghua 2024 Grand Final', 'url': 'https://www.bilibili.com/video/BV1dPWFeCEjK/'},
        {'label': 'Barvision Tonghua 2024 Semi-Final', 'url': 'https://www.bilibili.com/video/BV1BbYJehEfq/'},
    ],
    'recaps': [
        {'label': 'Barvision Tonghua 2024 Grand Final Recap', 'url': 'https://www.bilibili.com/video/BV1JuYnePEnD/'},
        {'label': 'Barvision Tonghua 2024 Semi-Final 1 Recap', 'url': 'https://www.bilibili.com/video/BV1MT421r7Q7/'},
        {'label': 'Barvision Tonghua 2024 Semi-Final 2 Recap', 'url': 'https://www.bilibili.com/video/BV1evvXepE8Z/'},
    ],
    'playlists': [
        {'platform': 'Spotify', 'items': [
            {'label': 'Barvision Tonghua 2024 Grand Final Spotify Playlist', 'url': 'https://open.spotify.com/playlist/4DAFRCyqJ1LIJIaUSVQbL2?si=9fc31d8a04c94a58'},
            {'label': 'Barvision Tonghua 2024 Semi-Final 1 Spotify Playlist', 'url': 'https://open.spotify.com/playlist/3l2EPktVQoM70N9W17tzFt?si=0f10d79f834c42b3'},
            {'label': 'Barvision Tonghua 2024 Semi-Final 2 Spotify Playlist', 'url': 'https://open.spotify.com/playlist/0UvOUHJbF2rdMqSYMe2vT5?si=bbcba8e251fd4cf6'},
        ]},
        {'platform': '网易云音乐', 'items': [
            {'label': 'Barvision Tonghua 2024 Grand Final NetEase Music Playlist', 'url': 'https://music.163.com/#/playlist?id=12437799139'},
            {'label': 'Barvision Tonghua 2024 Semi-Final 1 NetEase Music Playlist', 'url': 'https://music.163.com/playlist?id=12366252826'},
            {'label': 'Barvision Tonghua 2024 Semi-Final 2 NetEase Music Playlist', 'url': 'https://music.163.com/playlist?id=12365368281'},
        ]},
    ],
}

def main():
    lm = lang_by_song()
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    sf1 = read_semi(wb['SF1'], lm)
    sf2 = read_semi(wb['SF2'], lm)
    gj = read_gf_side(os.path.join(SRC, '24-GF-JURY.csv'), raw_extra=False)
    gt = read_gf_side(os.path.join(SRC, '24-GF-TELE.csv'), raw_extra=True)
    # 半决赛该曲的 genre/语种（GF 用）：按歌名
    sf_meta = {}
    for s in sf1 + sf2:
        sf_meta[s['song']] = {'genre': s['genre'], 'lang': s['lang']}
    # 先登记所有 selecter/voter（含合报拆分、外部）
    for s in sf1 + sf2:
        register(s['sel'])
    for s in gj + gt:
        register(s['sel'])

    m1 = build_semi(sf1, 'SF1', '半决赛一')
    m2 = build_semi(sf2, 'SF2', '半决赛二')
    mg = build_gf(gj, gt, sf_meta)
    m1['summary'] = SF1_SUMMARY
    m2['summary'] = SF2_SUMMARY
    mg['summary'] = GF_SUMMARY

    data = {
        'year': 2024, 'edition_no': 14, 'edition_name': 'Barvision Tonghua 2024',
        'cn_name': '第十四届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '通化', 'host': '羊妈', 'motto': '',
        'summary': SUMMARY, 'visual_design': VISUAL, 'rules': RULES, 'links': LINKS,
        'source': '第十四届吧视报名总则 + 24-SF1/SF2.csv（半决赛逐票）+ 24-GF-JURY/TELE.csv（决赛评委/观众逐票）',
        'members': {k: MEMBERS[k] for k in sorted(MEMBERS)},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '选送成员互投（Top 10，1-12 制）',
                      'tele': '其余成员/观众投票',
                      'note': '半决赛 jury=本场选送者、tele=其余投票人，均为 1-12 制；'
                              '决赛评委 1-12 制、观众 20 票自由分配制（观众分由票数折算，total=评委分+观众分）；'
                              '羊妈/威妈 各报名 2 首（分属两半区）；本届无折算曲、无混淆曲。'},
        'matches': [m1, m2, mg],
    }
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写入', OUT)

    # —— 校验 ——
    for m in data['matches']:
        js = [v for v in m['votes']['voters'] if v['type'] == 'jury']
        ts = [v for v in m['votes']['voters'] if v['type'] == 'tele']
        print('  %s %s: %d首 评委%d 观众%d' % (m['match'], m['venue'], len(m['entries']), len(js), len(ts)))
        if m['match'] != 'GF':                       # 半决赛：jury/tele 小分和 == jury_vote/tele_vote
            bad = 0
            for e in m['entries']:
                jsum = sum(v['points'].get(str(e['eid']), 0) for v in js)
                tsum = sum(v['points'].get(str(e['eid']), 0) for v in ts)
                tot = sum(v['points'].get(str(e['eid']), 0) for v in m['votes']['voters'])
                if abs(jsum - e['jury_vote']) > 0.5 or abs(tsum - e['tele_vote']) > 0.5 or abs(tot - (e['score'] or 0)) > 0.5:
                    bad += 1
                    if bad <= 3: print('    ⚠', e['member'], e['song'][:18], 'J', jsum, e['jury_vote'], 'T', tsum, e['tele_vote'], 'tot', tot, e['score'])
            print('    ', '校验OK' if not bad else '⚠ %d 首不符' % bad)
        else:                                        # GF：评委票=各评委票和；观众票=各观众票和；total=评委+观众分
            bad = 0
            traw = 0
            for e in m['entries']:
                jsum = sum(v['points'].get(str(e['eid']), 0) for v in js)
                tsum = sum(v['points'].get(str(e['eid']), 0) for v in ts)
                traw += e.get('tele_raw') or 0
                if abs(jsum - (e['jury_vote'] or 0)) > 0.5 or abs(tsum - (e.get('tele_raw') or 0)) > 0.5:
                    bad += 1
                    if bad <= 3: print('    ⚠', e['member'], e['song'][:18], 'J', jsum, e['jury_vote'], 'rawTele', tsum, e.get('tele_raw'))
                if abs((e['jury_vote'] or 0) + (e['tele_vote'] or 0) - (e['score'] or 0)) > 0.5:
                    print('    ⚠ total', e['song'][:18], e['jury_vote'], e['tele_vote'], e['score'])
            print('     评委/观众票 校验', '校验OK' if not bad else '⚠ %d 首不符' % bad, '观众总票 =', traw)

    def order(m):
        return sorted(m['entries'], key=lambda e: -(e['score'] or 0))
    top3 = order(mg)[:3]
    print('  GF 前三：', [(e['member'], e['song'], e['score']) for e in top3])
    for code, m in [('SF1', m1), ('SF2', m2)]:
        print('  %s 前三：' % code, [(e['member'], e['song'], e['score']) for e in order(m)[:3]])
    print('  合报：', [e['member'] for m in data['matches'] for e in m['entries'] if '/' in e['member']])
    print('  外部投票人出现：', any(v['voter'] == '外部' for m in data['matches'] for v in m['votes']['voters']))
    print('  members 数：', len(MEMBERS), '| 无 id 的：', [k for k, v in MEMBERS.items() if v.get('id') is None])

if __name__ == '__main__':
    main()
