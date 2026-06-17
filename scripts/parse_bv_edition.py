#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse a Barvision edition Excel into a per-edition JSON (results + vote matrix).

Edition-1 layout (regular, 综合赛 no groups). Future editions with A/B/C groups
will need per-edition tweaks; the alias map + member resolver are reusable.

Sheets used:
  参赛信息  — results summary (rank/jury/tele/total/lang/support)
  投票      — Eurovision-style point matrix (voters x entrants)
"""
import csv, json, os, sys
import pandas as pd

try:
    sys.stdout.reconfigure(encoding='utf-8')
except Exception:
    pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 昵称变体 → 规范昵称
ALIASES = {
    'Bag': '包妈', '包妈': '包妈',
    'X妈': 'X妈',
    'dope': '嘟妈', '嘟妈': '嘟妈',
    'Lemon': '柠妈', '淋檬': '柠妈', '柠妈': '柠妈',
    '绿萌': '萌妈', '绿荫夏雨': '萌妈', '绿荫夏语': '萌妈', '萌妈': '萌妈',
    '锴': '锴妈', '锴妈': '锴妈',
    '城城': '城妈', '城妈': '城妈',
    '肥屎': '肥妈', '肥妈': '肥妈',
    '猴妈': '猴妈', '晕妈': '晕妈', '雨妈': '雨妈', '苏妈': '苏妈', '田妈': '田妈',
    '草妈': '草妈', '泰妈': '泰妈', '薯妈': '薯妈', '风妈': '风妈', '乐妈': '乐妈', '胖妈': '胖妈',
}

def canon(name):
    if name is None:
        return None
    s = str(name).strip()
    if not s:
        return None
    if s in ALIASES:
        return ALIASES[s]
    # 去掉可能的【提名者】前缀
    s = s.replace('【提名者】', '').strip()
    return ALIASES.get(s, s)

def load_member_ids():
    """规范昵称 → {id, handle}（读 members.csv）"""
    m = {}
    p = os.path.join(BASE, 'data', 'members', 'members.csv')
    with open(p, encoding='utf-8-sig') as f:
        for row in csv.DictReader(f):
            nick = (row['barboard_name'] or '').strip()
            sid = (row['space_id'] or '').strip()
            handle = (row['space_name'] or '').strip()
            if nick and sid:
                m[nick] = {'id': int(sid), 'handle': handle or nick}
    return m

def cell(v):
    if v is None or (isinstance(v, float) and pd.isna(v)):
        return None
    if isinstance(v, str):
        v = v.strip()
        return v or None
    return v

def parse_edition1(xlsx):
    member_ids = load_member_ids()
    unresolved = set()
    seen = {}  # 规范昵称 → {id, handle}，收集本届出现的全部成员

    def resolve(name):
        c = canon(name)
        if c is None:
            return None, None
        info = member_ids.get(c)
        if info is None:
            unresolved.add(c)
            return c, None
        seen[c] = info
        return c, info['id']

    # ---- 参赛信息: results ----
    info = pd.read_excel(xlsx, sheet_name='参赛信息', header=None)
    # header at row idx 1: col1序号 col2报名者 col3语言 col4歌手 col5曲目 col6评委 col7观众 col8总分 col9排名 col10支持率 col11高位率
    results = []
    for i in range(2, info.shape[0]):
        rank = cell(info.iat[i, 9])
        member_raw = cell(info.iat[i, 2])
        if rank is None or member_raw is None:
            break  # results block ended
        m, sid = resolve(member_raw)
        results.append({
            'rank': int(rank),
            'member': m, 'member_id': sid,
            'language': cell(info.iat[i, 3]),
            'artist': cell(info.iat[i, 4]),
            'song': cell(info.iat[i, 5]),
            'jury_vote': cell(info.iat[i, 6]),
            'tele_vote': cell(info.iat[i, 7]),
            'score': cell(info.iat[i, 8]),
            'support_rate': cell(info.iat[i, 10]),
            'is_shadow': False,
        })

    # ---- 手工修正：Excel 歌手/歌名拆分有误的条目（键 = 选送者 + 原歌名） ----
    CORRECTIONS = {
        ('城妈', 'Calipso'): {'artist': 'Charlie Charles',
                              'song': 'Calipso (feat. Sfera Ebbasta, Mahmood & Fabri Fibra)'},
    }
    for r in results:
        fix = CORRECTIONS.get((r['member'], r['song']))
        if fix:
            r.update(fix)

    # ---- 投票: matrix ----
    vote = pd.read_excel(xlsx, sheet_name='投票', header=None)
    # header row idx 1, recipients in cols 2..15
    recip_cols = {}
    for c in range(2, vote.shape[1]):
        nm = cell(vote.iat[1, c])
        if nm:
            recip_cols[c] = resolve(nm)[0]
    entrant_set = set(v for v in recip_cols.values() if v)

    voters = []
    support_row = high_row = None
    for i in range(2, vote.shape[0]):
        vname = cell(vote.iat[i, 1])
        if not vname:
            # 支持率 / 高位率 行 (col1 empty, numeric cols)
            if support_row is None:
                support_row = i
            elif high_row is None:
                high_row = i
            continue
        vm = resolve(vname)[0]
        pts = {}
        for c, recip in recip_cols.items():
            val = cell(vote.iat[i, c])
            if val is not None and recip:
                pts[recip] = int(val)
        vtype = 'jury' if vm in entrant_set else 'tele'
        voters.append({'voter': vm, 'type': vtype, 'points': pts})

    # 支持率/高位率 per entrant (complete, from 投票 sheet)
    rates = {}
    for c, recip in recip_cols.items():
        if not recip:
            continue
        sr = cell(vote.iat[support_row, c]) if support_row is not None else None
        hr = cell(vote.iat[high_row, c]) if high_row is not None else None
        rates[recip] = {'support_rate': sr, 'high_rate': hr}

    # 用完整 rates 回填 results 的 support_rate（参赛信息里有缺）
    for r in results:
        if r['member'] in rates:
            if r.get('support_rate') is None:
                r['support_rate'] = rates[r['member']]['support_rate']
            r['high_rate'] = rates[r['member']]['high_rate']

    # ---- 交叉校验：矩阵算出的 jury/tele 是否 == 参赛信息 ----
    calc = {}
    for v in voters:
        for recip, p in v['points'].items():
            calc.setdefault(recip, {'jury': 0, 'tele': 0})
            calc[recip][v['type']] += p
    checks = []
    for r in results:
        cj = calc.get(r['member'], {}).get('jury')
        ct = calc.get(r['member'], {}).get('tele')
        ok = (cj == r['jury_vote'] and ct == r['tele_vote'])
        checks.append((r['rank'], r['member'], r['jury_vote'], cj, r['tele_vote'], ct, ok))

    edition = {
        'year': 2019, 'edition_no': 1, 'edition_name': 'The 1st Barvision',
        'cn_name': '第一届欧美流行歌曲个人榜吧歌曲大赛',
        'version': 'regular', 'city': None, 'host': None, 'motto': None,
        'summary': '首届贴吧歌曲大赛旨在通过投票评选，将优质的小众音乐推广给更多人聆听欣赏，扩大优质音乐的影响力。',
        'rules': {
            'submission': '每位评审团成员有且仅报名 1 首；发行时间须在 2018–2019 年；须为知名度低的小众歌曲。',
            'niche_standard': ['网易云音乐评论数 ≤500', '网易云音乐艺人粉丝数 ≤5000', 'YouTube订阅数 ≤20W',
                               'Spotify 月听众 ≤300W', 'YouTube视频播放量 ≤300W', '至少满足 4/5'],
            'format': '报名 ≤30 首直接进总决赛；>30 首则按提名单双号分 A/B 两组半决赛，各组前十进决赛。首届 14 首，无分组直接决赛。',
            'voting': '评委会成员与评审团成员各列 Top10（除自己提名曲），第 1–10 名分别给 12/10/8/7/6/5/4/3/2/1 分。',
        },
        'source': '首届贴吧歌曲大赛策划概念书 1.0.2',
        'members': {k: seen[k] for k in sorted(seen)},
        'vote_rule': {
            'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
            'jury': '14 位选送者互投（去自投）',
            'tele': '5 位非选送者（泰妈/薯妈/风妈/乐妈/胖妈）',
            'note': '总分 = Jury + Tele',
        },
        'matches': [{
            'match': '', 'venue': '',
            'entries': results,
            'votes': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voters},
        }],
    }
    return edition, checks, unresolved

if __name__ == '__main__':
    xlsx = sys.argv[1] if len(sys.argv) > 1 else \
        r'D:\Genius\Barvision\Barvision 2019-2020\常规版\Barvision 1\Barvision 2019 第一届数据.xlsx'
    ed, checks, unresolved = parse_edition1(xlsx)

    out_dir = os.path.join(BASE, 'data', 'barvision', 'barvision-%d' % ed['year'])
    os.makedirs(out_dir, exist_ok=True)
    out = os.path.join(out_dir, '%s-%02d.json' % (ed['version'], ed['edition_no']))
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(ed, f, ensure_ascii=False, indent=2)

    print('=== 交叉校验 (rank | member | jury档/算 | tele档/算 | OK) ===')
    for rk, m, jc, jcalc, tc, tcalc, ok in checks:
        print(f'  {rk:>2}  {m:<4}  jury {jc}/{jcalc}  tele {tc}/{tcalc}  {"OK" if ok else "✗ MISMATCH"}')
    print(f'\nvoters: {len(ed["matches"][0]["votes"]["voters"])}  '
          f'(jury {sum(1 for v in ed["matches"][0]["votes"]["voters"] if v["type"]=="jury")} / '
          f'tele {sum(1 for v in ed["matches"][0]["votes"]["voters"] if v["type"]=="tele")})')
    if unresolved:
        print('⚠️ 未匹配到 space_id 的昵称:', unresolved)
    else:
        print('✓ 所有昵称均解析到 space_id')
    print('written:', out)
