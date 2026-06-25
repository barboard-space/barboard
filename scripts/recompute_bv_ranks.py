#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""按 Eurovision 平局规则重算各届详情页 JSON 的名次（全局规则；parse 之后跑一次）。

平局规则（同 total 分时，逐级打破）：
  ① tele 总分↓  ② 给分人数(jury+tele)↓  ③ 12/10/8/7/6/5/4/3/2/1 分布↓  ④ running order↑(eid；一二届无 eid 用当前顺序兜底)
正式曲据此排 1..N；混淆曲取并排名次（不低于其分的正式曲数+1，组内按分降序）。
展示顺序：score↓、同分正式在前、正式按 rank、混淆按分。

用法：python scripts/recompute_bv_ranks.py [--write]   （默认 dry-run 只打印变化）
"""
import json, glob, io, sys, os

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SCALE = [12, 10, 8, 7, 6, 5, 4, 3, 2, 1]
WRITE = '--write' in sys.argv

def pkey(e):
    return str(e['eid']) if e.get('eid') is not None else e['member']

def rank_key(e, voters, ord_idx):
    k = pkey(e)
    pts = [v['points'].get(k) for v in voters]
    pts = [p for p in pts if p]  # 正分（给了分的投票人）
    hist = tuple(sum(1 for p in pts if p == val) for val in SCALE)
    order = e['eid'] if e.get('eid') is not None else ord_idx
    return (-e['score'], -(e.get('tele_vote') or 0), -len(pts)) + tuple(-x for x in hist) + (order,)

def recompute(match):
    if match.get('canceled'): return []  # 取消的组（如 12B）：仅选送名单、无名次，跳过
    entries = match['entries']
    voters = match.get('votes', {}).get('voters', [])
    ordmap = {id(e): i for i, e in enumerate(entries)}  # ed1/2 无 eid 的 running-order 兜底
    old = {(e.get('eid'), e.get('member'), e.get('song')): e.get('rank') for e in entries}

    official = [e for e in entries if not e.get('is_shadow')]
    official.sort(key=lambda e: rank_key(e, voters, ordmap[id(e)]))
    for i, e in enumerate(official, 1):
        e['rank'] = i
    shadows = [e for e in entries if e.get('is_shadow')]
    by_base = {}
    for e in shadows:
        base = sum(1 for o in official if o['score'] >= e['score']) + 1
        by_base.setdefault(base, []).append(e)
    for base, grp in by_base.items():
        grp.sort(key=lambda e: -e['score'])
        for j, e in enumerate(grp):
            e['rank'] = base + j
    entries.sort(key=lambda e: (-e['score'], 1 if e.get('is_shadow') else 0,
                                e['rank'] if not e.get('is_shadow') else 0))
    changes = []
    for e in entries:
        ok = (e.get('eid'), e.get('member'), e.get('song'))
        if old.get(ok) != e['rank']:
            changes.append((old.get(ok), e['rank'], e.get('member'), e.get('song')))
    return changes

ANNUAL = {'SF1', 'SF2', 'GF'}  # 2023+ 年度制（两轮半决赛 + 决赛）

def derive_rates(d):
    """每 entry 派生 support_rate(得票率%) + voters(给该曲投分的人数)。
    得票率分母 = 本场各曲「投出总分」=Σ(jury+tele)（折算前原始分，故 GF 折算曲分母仍计折前）；
    分子 = 该曲 score（折算后展示分）。对所有届都算，旧分组制虽不展示亦无害。"""
    for m in d.get('matches', []):
        if m.get('canceled'):
            continue
        entries = m.get('entries', [])
        voters = m.get('votes', {}).get('voters', [])
        cast_total = sum((e.get('jury_vote') or 0) + (e.get('tele_vote') or 0) for e in entries)
        for e in entries:
            k = pkey(e)
            e['voters'] = sum(1 for v in voters if (v.get('points', {}).get(k) or 0) > 0)
            e['support_rate'] = round(100 * (e.get('score') or 0) / cast_total, 2) if cast_total else None

def derive_overall(d):
    """年度制（SF1/SF2/GF）：每首一个跨场总排名 overall_rank。
    GF 18 首 = GF 名次 1..18；半决赛淘汰曲跨两场按 support_rate(得票率) 降序排 19..N。
    晋级 SF 条目不带 overall_rank（其届成绩取自 GF 记录）。旧分组制不处理。"""
    matches = d.get('matches', [])
    if not ANNUAL <= {m.get('match') for m in matches}:
        return
    gf = next((m for m in matches if m.get('match') == 'GF'), None)
    base = len(gf['entries']) if gf else 18
    if gf:
        for e in gf['entries']:
            e['overall_rank'] = e['rank']
    elim = []
    for m in matches:
        if m.get('match') in ('SF1', 'SF2'):
            for e in m['entries']:
                if e.get('qualified'):
                    e.pop('overall_rank', None)  # 晋级者无总排名（取自 GF）
                else:
                    elim.append(e)
    elim.sort(key=lambda e: (-(e.get('support_rate') or 0), -(e.get('score') or 0)))
    for i, e in enumerate(elim, base + 1):
        e['overall_rank'] = i

def main():
    total = 0
    for f in sorted(glob.glob(os.path.join(BASE, 'data/barvision/barvision-*/*.json'))):
        d = json.load(open(f, encoding='utf-8'))
        if 'matches' not in d:
            continue
        fch = []
        for m in d['matches']:
            for old_r, new_r, mem, song in recompute(m):
                fch.append('  [%s%s] #%s→#%s %s — %s' % (m.get('match', ''), '', old_r, new_r, mem, song))
        derive_rates(d)
        derive_overall(d)
        if fch:
            print('%s（第%s届）' % (os.path.basename(f), d.get('edition_no')))
            print('\n'.join(fch))
            total += len(fch)
        if WRITE:
            with open(f, 'w', encoding='utf-8', newline='\n') as fp:
                json.dump(d, fp, ensure_ascii=False, indent=1)
    print('\n%s：共 %d 条名次变化%s' % ('已写入' if WRITE else 'DRY-RUN(加 --write 落盘)', total, ''))

if __name__ == '__main__':
    main()
