#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""扫描各届 regular-*.json → 生成届次索引 editions-index.json（参赛名单 + 顺序）。
供详情页：① 成员变动（当前届名单 vs 历史届对比）② 上一届/下一届导航。
改/加任意届 JSON 后重跑本脚本。"""
import json, glob, os, sys
try: sys.stdout.reconfigure(encoding='utf-8')
except Exception: pass

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(BASE, 'data', 'barvision', 'editions-index.json')

eds = []
for p in sorted(glob.glob(os.path.join(BASE, 'data', 'barvision', 'barvision-*', '*.json'))):
    try:
        d = json.load(open(p, encoding='utf-8'))
    except Exception:
        continue
    if 'edition_no' not in d or 'matches' not in d:
        continue
    members = d.get('members', {})
    seen = {}
    for m in d['matches']:
        for e in m.get('entries', []):
            nm = e.get('member')
            if nm and nm not in seen:
                info = members.get(nm, {}) or {}
                seen[nm] = {'name': nm, 'id': e.get('member_id') or info.get('id'),
                            'handle': info.get('handle', nm)}
    no = d['edition_no']
    eds.append({
        'no': no, 'year': d['year'], 'version': d['version'],
        'name': d.get('edition_name', ''),
        'href': '/barvision/%d/%s-%02d.html' % (d['year'], d['version'], no),
        'roster': list(seen.values()),
    })
eds.sort(key=lambda x: x['no'])
os.makedirs(os.path.dirname(OUT), exist_ok=True)
json.dump({'editions': eds}, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('写出', OUT, '；届数', len(eds))
for e in eds:
    print('  第%d届 %s — roster %d 人' % (e['no'], e['name'], len(e['roster'])))
