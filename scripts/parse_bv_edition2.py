#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Parse Barvision 第二届 (sheets 2SF 半决赛 + 2GF 决赛) → regular-02.json.

第二届与第一届结构不同：每个 sheet 自带「报名者/歌手/歌名/分数 + 逐票矩阵 + 支持率/高位率」。
半决赛 16 首（分数=评委会票+评审团票，可校验）；决赛 19 首（分数为最终总分，含半决赛加成，
公式逐人不同、直接取用，不重算）。选送者互投=评委会票(jury)，非选送投票人=评审团票(tele)。
"""
import csv, json, os, sys
import pandas as pd

try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XLSX = 'D:/Genius/Barvision/Barvision 2019-2020/常规版/Barvision 2/第二届.xlsx'
OUT  = os.path.join(BASE, 'data', 'barvision', 'barvision-2019', 'regular-02.json')

ALIASES = {
    '绿萌': '萌妈', '绿荫夏雨': '萌妈', '绿荫夏语': '萌妈',
    '淋檬': '柠妈', 'Lemon': '柠妈',
    '肥屎': '肥妈',
    '瑞玛': '瑞妈',
    '院长': '院妈',
    '锴': '锴妈', '城城': '城妈',
}

# 歌名 → 语种（非英语显式列出，其余默认英语）
LANG = {
    'Per Sempre': '意大利语',
    'Я ХЕЙТЕР': '俄语',
    'Hatrið mun sigra': '冰岛语',
    'Louquinho': '葡萄牙语',
    '节奏爱': '中文',
}

def canon(name):
    if name is None: return None
    s = str(name).replace('\xa0', ' ').strip()
    if not s or s == 'nan': return None
    s = s.replace('【提名者】', '').strip()
    return ALIASES.get(s, s)

def load_members():
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

MEMBERS = load_members()
SEEN = {}          # 本届出现成员 canon → {id,handle}
UNRESOLVED = set()

def resolve(c):
    if not c: return None
    info = MEMBERS.get(c)
    if info is None:
        UNRESOLVED.add(c); return None
    SEEN[c] = info
    return info['id']

def num(v):
    if v is None or (isinstance(v, float) and pd.isna(v)): return None
    try:
        f = float(v)
        return int(f) if f == int(f) else round(f, 2)
    except Exception:
        return None

def build_match(df, hdr_row, col_member, col_artist, col_song, col_score,
                vcol_start, vcol_end, col_support, col_high, venue, rank_by_score):
    """vcol_start..vcol_end inclusive = 投票人列。返回 (entries, votes_block, voter_names)。"""
    voter_cols = list(range(vcol_start, vcol_end + 1))
    voter_names = [canon(df.iat[hdr_row, c]) for c in voter_cols]
    # 数据行：hdr_row+1 起，到「报名者」非空为止
    rows = []
    r = hdr_row + 1
    while r < len(df):
        mem = canon(df.iat[r, col_member])
        if mem:
            rows.append(r)
        r += 1
    entrants = set(canon(df.iat[rr, col_member]) for rr in rows)

    # entries
    raw = []
    for rr in rows:
        mem = canon(df.iat[rr, col_member])
        mid = resolve(mem)
        score = num(df.iat[rr, col_score])
        jury = tele = 0
        for c, vn in zip(voter_cols, voter_names):
            p = num(df.iat[rr, c])
            if p is None: continue
            if vn in entrants: jury += p
            else: tele += p
        song_v = (str(df.iat[rr, col_song]).replace('\xa0', ' ').strip() if not pd.isna(df.iat[rr, col_song]) else '')
        artist_v = (str(df.iat[rr, col_artist]).replace('\xa0', ' ').strip() if not pd.isna(df.iat[rr, col_artist]) else '')
        raw.append({
            'member': mem, 'member_id': mid, 'language': LANG.get(song_v, '英语'),
            'artist': artist_v,
            'song': song_v,
            'jury_vote': jury, 'tele_vote': tele, 'score': score,
            'support_rate': num(df.iat[rr, col_support]) if col_support is not None else None,
            'high_rate': num(df.iat[rr, col_high]) if col_high is not None else None,
            'is_shadow': False, '_row': rr,
        })
    # rank
    if rank_by_score:
        order = sorted(raw, key=lambda e: (-(e['score'] if e['score'] is not None else -1)))
    else:
        order = list(raw)  # Excel 已按分数降序
    for i, e in enumerate(order, 1):
        e['rank'] = i
    entries = sorted(order, key=lambda e: e['rank'])
    for e in entries: e.pop('_row', None)

    # votes：每投票人 → points{选送者:分}
    voters = []
    for c, vn in zip(voter_cols, voter_names):
        pts = {}
        for rr in rows:
            mem = canon(df.iat[rr, col_member])
            p = num(df.iat[rr, c])
            if p is not None and mem != vn:
                pts[mem] = p
        if not pts: continue
        resolve(vn)
        voters.append({'voter': vn, 'type': 'jury' if vn in entrants else 'tele', 'points': pts})

    return entries, {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1], 'voters': voters}, venue


def main():
    sf = pd.read_excel(XLSX, sheet_name='2SF', header=None)
    gf = pd.read_excel(XLSX, sheet_name='2GF', header=None)

    # 2SF: hdr row0; col0报名,1歌手,2歌名,3分数,投票人4..24,支持率25,高位率26
    sf_entries, sf_votes, _ = build_match(sf, 0, 0, 1, 2, 3, 4, 24, 25, 26, '半决赛', rank_by_score=False)
    # 2GF: hdr row1; col1报名,2歌手,3歌名,4分数,投票人5..25,支持率26,高位率27（分数含加成→按分排名）
    gf_entries, gf_votes, _ = build_match(gf, 1, 1, 2, 3, 4, 5, 25, 26, 27, '决赛', rank_by_score=True)

    data = {
        'year': 2019, 'edition_no': 2, 'edition_name': 'The 2nd Barvision',
        'cn_name': '第二届欧美流行歌曲个人榜吧歌曲大赛', 'version': 'regular',
        'city': '', 'host': '', 'motto': '',
        'summary': '第二届贴吧歌曲大赛，在第一届基础上改为「半决赛 + 总决赛」两阶段：报名歌曲分半决赛、总决赛两组，半决赛前列报名者的决赛歌曲享少量分数加成。投票沿用欧视制 Top10（12/10/8/7/6/5/4/3/2/1），分评委会票（选送者互投）与评审团票（观众）。',
        'rules': {
            'submission': '每人最多 2 首（半决赛 1 首 + 总决赛 1 首，仅报 1 首则决赛沿用）；发行时间 2017.6–2019.6。',
            'niche_standard': ['云村评论 ≤500', '艺人收藏 ≤7000', '油管订阅 ≤20W', 'Spotify 月听众 ≤300W', '油管官方 MV ≤300W'],
            'format': '报名 >15 人或 >30 首则进行半决赛 + 总决赛；半决赛前十/前十五的报名者，其总决赛歌曲享少量分数加成。',
            'voting': '欧视制，每人 Top10 给 12/10/8/7/6/5/4/3/2/1 分；分评委会票（选送者互投，去自投）与评审团票（其余观众），评委会票质量更高。',
        },
        'source': '第二届贴吧歌曲大赛策划概念书',
        'members': {},
        'vote_rule': {'scale': [12, 10, 8, 7, 6, 5, 4, 3, 2, 1],
                      'jury': '评委会票（选送者互投）', 'tele': '评审团票（观众）',
                      'note': '半决赛分数 = 评委会票 + 评审团票；决赛分数为最终总分（含半决赛加成，逐人公式不同，直接取用）。'},
        'matches': [
            {'match': 'SF', 'venue': '半决赛', 'entries': sf_entries, 'votes': sf_votes},
            {'match': 'GF', 'venue': '决赛', 'entries': gf_entries, 'votes': gf_votes},
        ],
    }
    data['members'] = {k: SEEN[k] for k in sorted(SEEN)}

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=1)

    # 报告
    print('写出:', OUT)
    print('members:', len(data['members']), '；未解析:', sorted(UNRESOLVED) or '无')
    print('\n=== 半决赛校验（分数 == 评委会+评审团?）===')
    for e in sf_entries:
        ok = (e['jury_vote'] + e['tele_vote']) == e['score']
        print(f"  #{e['rank']:>2} {e['member']}/{e['song'][:18]:<18} 分数={e['score']} jury={e['jury_vote']} tele={e['tele_vote']} 和={e['jury_vote']+e['tele_vote']} {'OK' if ok else '✗不符'}")
    print('\n=== 决赛（分数=最终含加成，jury/tele 为逐票和，仅供展示）===')
    for e in gf_entries:
        print(f"  #{e['rank']:>2} {e['member']}/{e['song'][:18]:<18} 分数={e['score']} jury={e['jury_vote']} tele={e['tele_vote']}")

if __name__ == '__main__':
    main()
