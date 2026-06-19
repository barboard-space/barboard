#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第十二届 (12A 已办 + 12B 已取消) → regular-12.json.

有规则书（rules 已填）。本届为 2020 最后一届。
12A（已举办，A 小众组）：
- 列：排名 / 选送者 / 艺人 / 歌曲 / 语种 / [投票人小分] / 总分。artist/song 独立两列。score=总分。
- **萌妈/雨妈 合报**：二人分开投票、**各 ×0.5 折算**（CSV 半值，计分板 ×2 还原显示）。member=萌妈/雨妈。
- **Z妈 只投前 8**（非前 10）→ 其投票 ×0.8 折算（CSV 已折）；计分板显其折算小数，**但她最高的一格显「12」**
  （`disp` 把她最大值那格设为 12，其余原样小数）。score 仍用 CSV 实际值。
- **苏妈/晕妈 未提交排名 → 得分折算**（数据约 ×0.7；规则书写 50%，以数据/总分为准）。score=总分、jury/tele 显原始和。
- **12 分 max 模式**（voter.top=最高正式曲）。匿名：神妈（选送+投票）、匿名（裸名，选送正式曲）→ number_anon 编 #11/#12。
12B（已报名但取消，B 中众组）：
- 列：选送者 / 艺人 / 歌曲 / 语种。**无投票/无分数/无名次**——仅选送名单。match `canceled:true`，entries 仅 member/artist/song/lang。
- 按选送者大名排序：中文(拼音 A-Z)在前、字母名(A-Z)在后；匿名按「匿」(ni) 位。下游：详情页『已取消·选送名单』+ 成员页『取消』行（名次—、灰、不计走势/统计）。
- 本届取消混淆（规则书）；12B CSV 残留的「X混淆」按普通选送处理（剥离「混淆」）。合报 雨妈/包妈。
"""
import csv, io, json, os, re, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRCDIR = r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 12'
OUT = os.path.join(BASE, 'data', 'barvision', 'barvision-2020', 'regular-12.json')
ALIASES = {'淋檬': '柠妈', '柠檬': '柠妈', '绿萌': '萌妈', '院长': '院妈', '可乐': '乐妈', '季风': '季妈', '隐妈3号': '隐妈三号'}
HALVED_A = {'萌妈', '雨妈'}   # 12A 合报、投票 ×0.5
PARTIAL_A = 'Z妈'            # 12A 只投前8、×0.8，计分板最高格显 12
# 12B 排序用拼音（中文首字）
PY = {'城': 'cheng', '奶': 'nai', '虎': 'hu', '季': 'ji', '杰': 'jie', '团': 'tuan', '柠': 'ning',
      '雨': 'yu', '萌': 'meng', '洛': 'luo', '锴': 'kai', '小': 'xiao', '雪': 'xue', '田': 'tian',
      '神': 'shen', '包': 'bao', '匿': 'ni', '隐': 'yin'}

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
        if '语种' in txt: return list(csv.reader(io.StringIO(txt)))
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

def build_12A():
    rows = load_csv('Barvision_12A.csv'); h = [c.strip() for c in rows[0]]
    ci_sub = h.index('选送者'); ci_art = h.index('艺人'); ci_song = h.index('歌曲')
    ci_lang = h.index('语种'); ci_tot = h.index('总分')
    voters = [norm_name(h[i]) for i in range(ci_lang + 1, ci_tot)]
    data = []
    for r in rows[1:]:
        if len(r) <= ci_tot or not r[ci_sub].strip(): continue
        member = norm_name(re.sub(r'混淆', '', r[ci_sub]).strip()); is_sh = '混淆' in r[ci_sub]
        cells = {}; disp = {}
        for idx, v in enumerate(voters):
            x = num(r[ci_lang + 1 + idx]) if ci_lang + 1 + idx < len(r) else 0
            if not x: continue
            cells[v] = x
            disp[v] = round(x * 2, 2) if v in HALVED_A else x
        data.append(dict(member=member, shadow=is_sh, artist=r[ci_art].strip(),
                         song=fix_feat(r[ci_song].strip()), lang=r[ci_lang].strip() or '英语',
                         cells=cells, disp=disp, score=num(r[ci_tot])))
    # Z妈：最高的一格 disp 设为 12（其余原样折算小数）
    zcells = [(d, d['cells'][PARTIAL_A]) for d in data if PARTIAL_A in d['cells']]
    if zcells:
        zmax = max(zcells, key=lambda t: t[1])[0]
        zmax['disp'][PARTIAL_A] = 12
    jury_set = set()
    for d in data:
        if d['shadow']: continue
        jury_set.add(d['member'])
        for p in d['member'].split('/'): jury_set.add(p)
    entries = []; folded = []
    for i, d in enumerate(data):
        resolve(d['member'])
        raw = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member'])), 2)
        if not d['shadow'] and raw > 0 and 0.6 < d['score'] / raw < 0.8:
            folded.append(d['member'])
        jury = round(sum(p for v, p in d['cells'].items() if not is_self(v, d['member']) and v in jury_set), 2)
        entries.append({
            'member': d['member'], 'member_id': mid_of(d['member']), 'eid': i,
            'language': d['lang'], 'artist': d['artist'], 'song': d['song'],
            'jury_vote': jury, 'tele_vote': round(raw - jury, 2), 'score': d['score'],
            'support_rate': None, 'high_rate': None, 'is_shadow': d['shadow'], 'rank': None,
        })
    official = [e for e in entries if not e['is_shadow']]
    official.sort(key=lambda e: (-e['score'], -e['tele_vote']))
    for i, e in enumerate(official, 1): e['rank'] = i
    for e in [e for e in entries if e['is_shadow']]:
        e['rank'] = sum(1 for o in official if o['score'] >= e['score']) + 1
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
    notes = ['萌妈、雨妈 合报参赛、二人分开投票各按 50% 折算计入（计分板中该二人投票列为 ×2 还原后的原始分）；'
             'Z妈 仅投出前 8（非前 10），其投票按 80% 折算（计分板显折算后小数、其最高一格记为 12）。']
    if folded:
        notes.append('%s 未提交完整排名，其选送歌曲得分折算。' % '、'.join(dict.fromkeys(folded)))
    return {'match': 'A', 'venue': '小众组', 'entries': entries,
            'votes': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voter_objs},
            'note': ''.join(notes)}

def sort_key_12b(member):
    first = member.split('/')[0]
    if is_anon(member): return (0, 'ni', member)             # 匿名按「匿」
    c = first[0]
    if re.match(r'[A-Za-z]', c): return (1, member.lower(), member)  # 字母名在后
    return (0, PY.get(c, c), member)                          # 中文按拼音

def build_12B():
    rows = load_csv('Barvision_12B.csv'); h = [c.strip() for c in rows[0]]
    ci_sub = h.index('选送者'); ci_art = h.index('艺人'); ci_song = h.index('歌曲'); ci_lang = h.index('语种')
    ents = []
    for r in rows[1:]:
        if len(r) <= ci_lang or not r[ci_sub].strip(): continue
        is_sh = '混淆' in r[ci_sub]  # 12B 选送名单中的「X混淆」= 混淆曲，保留标记（取消组不计成绩，标记仅供展示）
        member = norm_name(re.sub(r'混淆', '', r[ci_sub]).strip())
        resolve(member)
        ents.append(dict(member=member, member_id=mid_of(member),
                         artist=r[ci_art].strip(), song=fix_feat(r[ci_song].strip()),
                         language=r[ci_lang].strip() or '英语', is_shadow=is_sh, canceled=True))
    ents.sort(key=lambda e: sort_key_12b(e['member']))
    for i, e in enumerate(ents): e['eid'] = i
    return {'match': 'B', 'venue': '中众组', 'canceled': True, 'entries': ents,
            'votes': {'scale': [], 'voters': []}}

def main():
    mA = build_12A(); mB = build_12B()
    cA = sorted([e for e in mA['entries'] if not e['is_shadow']], key=lambda e: e['rank'])[0]
    who = '一位匿名成员' if is_anon(cA['member']) else cA['member']
    summary = ('第十二届 Barvision 是 2020 年的收官之届，A 小众组如期举办、B 中众组报名后因故取消。'
               'A 组冠军是%s选送的 %s — %s；本届取消混淆，萌妈与雨妈 合报参赛。'
               'B 组的选送名单一并存档展示。') % (who, cA['artist'], cA['song'])
    data = {
        'year': 2020, 'edition_no': 12, 'edition_name': 'The 12th Barvision',
        'cn_name': '第十二届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '雨妈', 'motto': '', 'summary': summary,
        'rules': {
            'submission': '分 A（小众）/ B（中众）两组报名（同艺人第二次选送须报 B 组）；发行时间 2016.1.1–2020.9.30；lead 艺人无 BB Hot100/UK Top100、≤1 项格莱美通类提名、≤2 首吧视常规版 Top10，feat 艺人无 BB/UK Top20 或在榜>40 周；报名歌曲不得进≥3 名参赛评委的任何年榜、或任一评委年榜 Top20。本届取消混淆。',
            'niche_standard': [
                'A 小众｜云村评论≤750·收藏≤10000·Spotify 月听众≤3M/单曲≤6M·YT 英语 订阅≤2M/MV≤7.5M·小语种≤7.5M/50M',
                'B 中众｜评论≤2000·收藏≤35000·月听众≤10M/单曲≤40M·YT 英语≤8M/80M·小语种≤25M',
                '匿名参赛每组≤2 人、按先后用“隐妈X号”命名，不得选上榜歌、不享加分、拿单组第一即自动曝光',
            ],
            'format': 'A、B 两组分开比赛、独立计分与排名；本届 B 组报名后因故取消举办，仅存档选送名单。',
            'voting': '欧视制（计分 12/10/8/7/6/5/4/3/2/1）；每位评委上交 Top10 排名；未提交排名扣除其选送歌曲 50% 分数；合报可合榜或将每人排名分数减半（≤2 人合报）。',
        },
        'source': '第十二届吧视报名总则（最终版）+ 12A 逐票汇总 / 12B 选送名单',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'jury': '选送者互投', 'tele': '观众',
                      'note': '12A：萌妈/雨妈 合报且分开投票各 50% 折算（计分板 ×2 还原）、Z妈 只投前8按 80% 折算（计分板显折算小数、最高格记 12）、未提交排名者得分折算；12 分取各投票人投出最高分的正式曲。12B 报名后取消，仅存选送名单。'},
        'matches': [mA, mB],
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('匿名身份:', [k for k in SEEN if SEEN[k].get('unclaimed')])
    print('\n=== 12A ===')
    for e in mA['entries']:
        print('  #%-3s %-9s J=%-5g T=%-5g 总=%-6g %s — %s'%(e['rank'],e['member'][:9],e['jury_vote'],e['tele_vote'],e['score'],e['artist'][:14],e['song'][:20]))
    print('12A note:', mA['note'])
    print('\n=== 12B（取消·选送名单，已排序）===')
    for e in mB['entries']:
        print('  %-9s %s — %s (%s)'%(e['member'][:9],e['artist'][:18],e['song'][:20],e['language']))

if __name__ == '__main__':
    main()
